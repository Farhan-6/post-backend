const express = require("express");
const ogs = require("open-graph-scraper");
const router = express.Router();

router.get("/preview", async (req, res) => {
  try {
    const { url } = req.query;
    const { result } = await ogs({ url });

    let embedData = null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const response = await fetch(oEmbedUrl);
      if (!response.ok) {
        throw new Error(`oEmbed fetch failed: ${response.status}`);
      }
      const oEmbedResponse = await response.json();
      embedData = {
        url: oEmbedResponse.html?.match(/src="([^"]+)"/)?.[1] || url,
        type: "video",
      };
    } else if (result.ogVideo || result.twitterPlayer) {
      embedData = {
        url: result.ogVideo?.url || result.twitterPlayer?.url || url,
        type: result.ogType || "video",
      };
    }

    res.json({
      title: result.ogTitle,
      description: result.ogDescription,
      image: result.ogImage?.[0]?.url,
      url: result.ogUrl || url,
      embed: embedData,
    });
  } catch (err) {
    console.error("Error fetching link preview:", err.message);
    res.status(500).json({ error: "Preview failed" });
  }
});

module.exports = router;