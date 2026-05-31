const YouTube = require("../models/YouTube");
const { defaultYouTube } = require("../data/seedDefaults");

function formatCount(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return String(num);
}

function normalizeHandle(raw) {
  if (!raw) return "";
  return raw.trim().replace(/^@/, "");
}

function channelLabel(snippet, fallbackHandle) {
  const custom = snippet?.customUrl;
  if (custom) return custom.startsWith("@") ? custom : `@${custom}`;
  const handle = fallbackHandle || normalizeHandle(process.env.YOUTUBE_CHANNEL_HANDLE);
  if (handle) return `@${handle}`;
  return snippet?.title || defaultYouTube.channel;
}

function channelUrl(handleOrLabel) {
  const handle = normalizeHandle(handleOrLabel);
  if (!handle) return null;
  return `https://www.youtube.com/@${handle}`;
}

async function getStoredYouTube() {
  let youtube = await YouTube.findOne();
  if (!youtube) {
    const handle = normalizeHandle(process.env.YOUTUBE_CHANNEL_HANDLE);
    youtube = await YouTube.create({
      ...defaultYouTube,
      ...(handle ? { channel: `@${handle}` } : {}),
      ...(process.env.YOUTUBE_CHANNEL_ID?.trim()
        ? { channelId: process.env.YOUTUBE_CHANNEL_ID.trim() }
        : {}),
    });
  }
  return youtube;
}

function toLivePayload(youtube, extra = {}) {
  const handle = normalizeHandle(youtube.channel) || normalizeHandle(process.env.YOUTUBE_CHANNEL_HANDLE);
  return {
    channel: youtube.channel,
    channelId: youtube.channelId,
    channelUrl: channelUrl(handle) || undefined,
    subscribers: youtube.subscribers,
    videos: youtube.videos,
    growth: youtube.growth,
    recentVideos: [],
    ...extra,
  };
}

async function resolveChannelId(apiKey) {
  const envId = process.env.YOUTUBE_CHANNEL_ID?.trim();
  if (envId) return envId;

  const handle = normalizeHandle(process.env.YOUTUBE_CHANNEL_HANDLE);
  if (!handle) return null;

  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "id");
  url.searchParams.set("forHandle", handle);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube handle lookup failed (${response.status})`);
  }

  const data = await response.json();
  const id = data.items?.[0]?.id;
  if (!id) {
    throw new Error(`YouTube channel not found for handle @${handle}`);
  }
  return id;
}

async function fetchRecentVideos(apiKey, channelId, maxResults = 3) {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("channelId", channelId);
  url.searchParams.set("order", "date");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    console.warn("YouTube recent videos fetch failed:", response.status);
    return [];
  }

  const data = await response.json();
  return (data.items || []).map((item) => {
    const videoId = item.id?.videoId;
    const snippet = item.snippet || {};
    return {
      id: videoId,
      title: snippet.title,
      publishedAt: snippet.publishedAt,
      thumbnailUrl: snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url,
      url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
    };
  });
}

async function fetchYouTubeApi(apiKey, channelId) {
  const url = new URL("https://www.googleapis.com/youtube/v3/channels");
  url.searchParams.set("part", "statistics,snippet");
  url.searchParams.set("id", channelId);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API error (${response.status})`);
  }

  const data = await response.json();
  const item = data.items?.[0];
  if (!item) {
    throw new Error("YouTube channel not found");
  }

  const stats = item.statistics || {};
  const snippet = item.snippet || {};
  const label = channelLabel(snippet);
  const urlForChannel = channelUrl(label) || `https://www.youtube.com/channel/${channelId}`;
  const recentVideos = await fetchRecentVideos(apiKey, channelId);

  const subscriberHidden = stats.hiddenSubscriberCount === true;
  const growth = subscriberHidden
    ? "Subscriber count hidden"
    : `${formatCount(stats.viewCount || 0)} total views`;

  return {
    channel: label,
    channelId,
    channelUrl: urlForChannel,
    subscribers: subscriberHidden ? "Hidden" : formatCount(stats.subscriberCount || 0),
    videos: formatCount(stats.videoCount || 0),
    growth,
    recentVideos,
    source: "youtube_api",
  };
}

async function fetchYouTubeRss(channelId) {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error(`YouTube RSS error (${response.status})`);
  }

  const xml = await response.text();
  const titleMatch = xml.match(/<name>([^<]+)<\/name>/);
  const entryMatches = xml.match(/<entry>/g) || [];
  const handle = normalizeHandle(process.env.YOUTUBE_CHANNEL_HANDLE);

  return {
    channel: handle ? `@${handle}` : titleMatch?.[1] || defaultYouTube.channel,
    channelId,
    channelUrl: channelUrl(handle) || `https://www.youtube.com/channel/${channelId}`,
    subscribers: defaultYouTube.subscribers,
    videos: `${Math.max(entryMatches.length, 1)}+`,
    growth: "Updated from channel RSS feed",
    recentVideos: [],
    source: "youtube_rss",
  };
}

async function getYouTube(_req, res) {
  try {
    const youtube = await getStoredYouTube();
    res.json(youtube);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getYouTubeLive(_req, res) {
  try {
    const youtube = await getStoredYouTube();
    const apiKey = process.env.YOUTUBE_API_KEY?.trim();
    let channelId = process.env.YOUTUBE_CHANNEL_ID?.trim() || youtube.channelId?.trim();

    if (apiKey && !channelId) {
      try {
        channelId = await resolveChannelId(apiKey);
      } catch (resolveError) {
        console.warn("YouTube channel resolve failed:", resolveError.message);
      }
    }

    if (apiKey && channelId) {
      try {
        return res.json(await fetchYouTubeApi(apiKey, channelId));
      } catch (apiError) {
        console.warn("YouTube API fetch failed:", apiError.message);
      }
    }

    if (channelId) {
      try {
        return res.json(await fetchYouTubeRss(channelId));
      } catch (rssError) {
        console.warn("YouTube RSS fetch failed:", rssError.message);
      }
    }

    res.json(toLivePayload(youtube, { source: "database" }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateYouTube(req, res) {
  try {
    const youtube = await YouTube.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
    });
    res.json(youtube);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getYouTube, getYouTubeLive, updateYouTube };
