const collections = ["users", "categories", "menu", "orders", "payments", "content"];
const memory = Object.fromEntries(collections.map((name) => [name, []]));

const githubHeaders = () => ({
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "Content-Type": "application/json"
});

const configReady = () => process.env.GITHUB_TOKEN && process.env.GITHUB_REPO;
const apiUrl = (path) => `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`;
export const makeId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
export const now = () => new Date().toISOString();

async function fetchFile(collection) {
  if (!configReady()) return { data: memory[collection] || [], sha: null };
  const path = `data/${collection}.json`;
  const url = `${apiUrl(path)}?ref=${process.env.GITHUB_BRANCH || "main"}`;
  const res = await fetch(url, { headers: githubHeaders() });
  if (res.status === 404) return { data: [], sha: null };
  if (!res.ok) throw new Error(`GitHub read failed for ${collection}: ${res.status}`);
  const json = await res.json();
  const text = Buffer.from(json.content || "", "base64").toString("utf8");
  return { data: text ? JSON.parse(text) : [], sha: json.sha };
}

async function saveFile(collection, data, sha) {
  if (!configReady()) {
    memory[collection] = data;
    return;
  }
  const path = `data/${collection}.json`;
  const body = {
    message: `Update ${collection} database`,
    content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
    branch: process.env.GITHUB_BRANCH || "main"
  };
  if (sha) body.sha = sha;
  const res = await fetch(apiUrl(path), { method: "PUT", headers: githubHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`GitHub write failed for ${collection}: ${res.status} ${await res.text()}`);
}

export async function all(collection) {
  const file = await fetchFile(collection);
  return file.data;
}

export async function findById(collection, id) {
  return (await all(collection)).find((doc) => doc._id === id) || null;
}

export async function findOne(collection, predicate) {
  return (await all(collection)).find(predicate) || null;
}

export async function create(collection, doc) {
  const file = await fetchFile(collection);
  const item = { _id: makeId(), ...doc, createdAt: now(), updatedAt: now() };
  file.data.push(item);
  await saveFile(collection, file.data, file.sha);
  return item;
}

export async function updateById(collection, id, patch) {
  const file = await fetchFile(collection);
  const index = file.data.findIndex((doc) => doc._id === id);
  if (index === -1) return null;
  file.data[index] = { ...file.data[index], ...patch, updatedAt: now() };
  await saveFile(collection, file.data, file.sha);
  return file.data[index];
}

export async function upsertBy(collection, predicate, insertDoc, patch = {}) {
  const file = await fetchFile(collection);
  const index = file.data.findIndex(predicate);
  if (index === -1) {
    const item = { _id: makeId(), ...insertDoc, ...patch, createdAt: now(), updatedAt: now() };
    file.data.push(item);
    await saveFile(collection, file.data, file.sha);
    return item;
  }
  file.data[index] = { ...file.data[index], ...patch, updatedAt: now() };
  await saveFile(collection, file.data, file.sha);
  return file.data[index];
}

export async function removeById(collection, id) {
  const file = await fetchFile(collection);
  const next = file.data.filter((doc) => doc._id !== id);
  await saveFile(collection, next, file.sha);
  return true;
}

export async function replaceCollection(collection, docs) {
  const file = await fetchFile(collection);
  await saveFile(collection, docs, file.sha);
}

export async function contentObject() {
  const rows = await all("content");
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}
