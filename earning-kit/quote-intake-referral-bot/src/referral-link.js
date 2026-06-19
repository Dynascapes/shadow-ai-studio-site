const BASE_REFERRAL_URL = "https://quoteintakestudio.com/referrals.html";

function referralCodeForUser(user) {
  const base = String(user?.username || user?.tag || "referrer")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24) || "referrer";
  const suffix = String(user?.id || "").slice(-4) || "0000";
  return `${base}-${suffix}`;
}

function referralUrlForUser(user) {
  return `${BASE_REFERRAL_URL}?ref=${encodeURIComponent(referralCodeForUser(user))}`;
}

module.exports = {
  BASE_REFERRAL_URL,
  referralCodeForUser,
  referralUrlForUser
};
