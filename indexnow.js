const axios = require("axios");
const xml2js = require("xml2js");

// CONFIG
const BLOG_URL = "https://www.byteenvision.com";
const INDEXNOW_KEY = "ad414240f9614f71a05b849e7fb72087";
const KEY_LOCATION = "https://admin.byteenvision.com/ad414240f9614f71a05b849e7fb72087.txt";
const API = "https://www.bing.com/indexnow";

// Fetch posts
async function fetchPosts() {
  const url = `${BLOG_URL}/feeds/posts/default?max-results=10`;
  const res = await axios.get(url);

  const parsed = await xml2js.parseStringPromise(res.data);
  const entries = parsed.feed.entry || [];

  return entries.map(e =>
    e.link.find(l => l.$.rel === "alternate").$.href
  );
}

// Submit
async function submit(urls) {
  const payload = {
    host: new URL(BLOG_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls
  };

  const res = await axios.post(API, payload, {
    headers: { "Content-Type": "application/json" }
  });

  console.log("Status:", res.status);
}

// Run
(async () => {
  const urls = await fetchPosts();
  console.log("Submitting:", urls);
  await submit(urls);
})();
