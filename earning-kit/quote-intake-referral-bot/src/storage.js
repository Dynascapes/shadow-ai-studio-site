const fs = require("node:fs/promises");
const path = require("node:path");

async function ensureFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify({ referrals: [] }, null, 2));
  }
}

async function readStore(filePath) {
  await ensureFile(filePath);
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function writeStore(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

function normalizeWebsite(website) {
  return String(website || "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/g, "")
    .toLowerCase();
}

function normalizeContact(contact) {
  return String(contact || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalizeBusinessName(name) {
  return String(name || "")
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

function riskScoreFromFlags(flags, duplicate) {
  let score = 100 - flags.length * 12;
  if (duplicate) score -= 18;
  return Math.max(0, Math.min(100, score));
}

function riskLevel(score) {
  if (score >= 80) return "low";
  if (score >= 55) return "manual_check";
  return "high";
}

function buildReviewFlags(store, referral, normalizedWebsite, normalizedContact, normalizedBusinessName, duplicate) {
  const flags = [];
  const proof = String(referral.interestProof || "").trim();
  const proofLower = proof.toLowerCase();
  const contactLower = String(referral.contactMethod || "").toLowerCase();
  const createdCutoff = Date.now() - 24 * 60 * 60 * 1000;

  if (duplicate) {
    flags.push(`Possible duplicate website of ${duplicate.id}`);
  }

  const repeatedBusiness = normalizedBusinessName
    ? store.referrals.find((item) => item.normalizedBusinessName === normalizedBusinessName)
    : null;
  if (repeatedBusiness) {
    flags.push(`Business name is similar to ${repeatedBusiness.id}`);
  }

  if (!normalizedWebsite || (!normalizedWebsite.includes(".") && !normalizedWebsite.includes("/"))) {
    flags.push("Website or public page needs manual check");
  }

  if (proof.replace(/\s+/g, "").length < 18) {
    flags.push("Interest proof is short");
  }

  if (/^(yes|yeah|yep|sure|ok|okay|interested|send it|send me it)$/i.test(proof.trim())) {
    flags.push("Interest proof is very generic");
  }

  if (/\b(fake|alt|alternate account|test lead|dummy|made up|guaranteed|guarantee)\b/i.test(`${proofLower} ${contactLower}`)) {
    flags.push("Proof/contact text contains fake/alt/guarantee wording");
  }

  const repeatedContact = normalizedContact
    ? store.referrals.find((item) => item.normalizedContact === normalizedContact)
    : null;
  if (repeatedContact) {
    flags.push(`Contact method matches ${repeatedContact.id}`);
  }

  const recentBySubmitter = store.referrals.filter((item) => {
    if (item.submitterId !== referral.submitterId || !item.createdAt) return false;
    return new Date(item.createdAt).getTime() >= createdCutoff;
  }).length;
  if (recentBySubmitter >= 5) {
    flags.push("Submitter has 5+ referrals in the last 24 hours");
  }

  return flags;
}

async function nextReferralId(filePath) {
  const store = await readStore(filePath);
  const stamp = todayStamp();
  const todayCount = store.referrals.filter((item) => item.id.startsWith(`QIS-${stamp}`)).length + 1;
  return `QIS-${stamp}-${String(todayCount).padStart(3, "0")}`;
}

async function addReferral(filePath, referral) {
  const store = await readStore(filePath);
  const normalizedWebsite = normalizeWebsite(referral.website);
  const normalizedContact = normalizeContact(referral.contactMethod);
  const normalizedBusinessName = normalizeBusinessName(referral.businessName);
  const duplicate = store.referrals.find((item) => normalizeWebsite(item.website) === normalizedWebsite);
  const reviewFlags = buildReviewFlags(
    store,
    referral,
    normalizedWebsite,
    normalizedContact,
    normalizedBusinessName,
    duplicate
  );
  const reviewScore = riskScoreFromFlags(reviewFlags, duplicate);
  const record = {
    ...referral,
    normalizedWebsite,
    normalizedContact,
    normalizedBusinessName,
    reviewFlags,
    reviewScore,
    reviewRisk: riskLevel(reviewScore),
    duplicateOf: duplicate ? duplicate.id : "",
    status: duplicate ? "possible_duplicate" : "submitted",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store.referrals.push(record);
  await writeStore(filePath, store);
  return record;
}

async function updateReferral(filePath, id, patch) {
  const store = await readStore(filePath);
  const index = store.referrals.findIndex((item) => item.id === id);
  if (index === -1) return null;
  store.referrals[index] = {
    ...store.referrals[index],
    ...patch,
    updatedAt: new Date().toISOString()
  };
  await writeStore(filePath, store);
  return store.referrals[index];
}

async function getReferral(filePath, id) {
  const store = await readStore(filePath);
  return store.referrals.find((item) => item.id === id) || null;
}

async function getUserReferrals(filePath, userId) {
  const store = await readStore(filePath);
  return store.referrals.filter((item) => item.submitterId === userId);
}

async function getStats(filePath) {
  const store = await readStore(filePath);
  return store.referrals.reduce(
    (acc, item) => {
      acc.total += 1;
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    { total: 0 }
  );
}

module.exports = {
  addReferral,
  getReferral,
  getStats,
  getUserReferrals,
  nextReferralId,
  normalizeBusinessName,
  normalizeContact,
  normalizeWebsite,
  updateReferral
};
