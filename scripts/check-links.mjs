const origin = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const starts = ["/en", "/es", "/pt"];
const removed = /\/(?:hoteles(?:\/|$)|hoteles-marrakech(?:\/|$)|booking\/checkout(?:\/|$)|resumen(?:\/|$)|[^/]+\/[^/]+\/resumen(?:\/|$))/i;
const maxDepth = 3;
const queue = starts.map((path) => ({url: `${origin}${path}`, depth: 0}));
const seen = new Set();
const errors = [];

while (queue.length) {
  const {url, depth} = queue.shift();
  if (seen.has(url)) continue;
  seen.add(url);
  let response;
  try {
    response = await fetch(url, {redirect: "follow"});
  } catch (error) {
    errors.push(`${url} — ${error instanceof Error ? error.message : String(error)}`);
    continue;
  }
  if (response.status !== 200) errors.push(`${url} — HTTP ${response.status}`);
  const html = await response.text();
  const hrefs = [...html.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1].replaceAll("&amp;", "&"));
  for (const href of hrefs) {
    if (removed.test(href)) errors.push(`${url} links to removed route ${href}`);
    if (depth >= maxDepth || /^(?:#|mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let target;
    try { target = new URL(href, url); } catch { continue; }
    if (target.origin !== origin || !/^\/(?:en|es|pt)(?:\/|$)/.test(target.pathname)) continue;
    target.hash = "";
    queue.push({url: target.href, depth: depth + 1});
  }
}

if (errors.length) {
  console.error(`Checked ${seen.size} pages; found ${errors.length} link errors:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${seen.size} pages from /en, /es and /pt to depth ${maxDepth}; all linked pages returned 200 and no removed routes were linked.`);
}
