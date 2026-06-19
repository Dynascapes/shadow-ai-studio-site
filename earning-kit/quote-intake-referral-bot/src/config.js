require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function optional(name, fallback = "") {
  return process.env[name] || fallback;
}

module.exports = {
  token: required("DISCORD_TOKEN"),
  clientId: required("CLIENT_ID"),
  guildId: optional("GUILD_ID"),
  reviewChannelId: required("REVIEW_CHANNEL_ID"),
  approvedChannelId: optional("APPROVED_CHANNEL_ID"),
  reviewerRoleId: optional("REVIEWER_ROLE_ID"),
  brandName: optional("BRAND_NAME", "Quote Intake Studio"),
  publicSiteUrl: optional("PUBLIC_SITE_URL", "https://quoteintakestudio.com"),
  storagePath: optional("STORAGE_PATH", "./data/referrals.json")
};
