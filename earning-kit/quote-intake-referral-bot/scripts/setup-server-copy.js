const config = require("../src/config");
const { panelButtons, panelEmbed } = require("../src/messages");
const { CHANNELS, GUIDE_FOOTER, serverGuides } = require("../src/server-content");

const API = "https://discord.com/api/v10";
const TEXT_CHANNEL = 0;
const ROLE_OVERWRITE = 0;

const PERMS = {
  ADD_REACTIONS: 1n << 6n,
  VIEW_CHANNEL: 1n << 10n,
  SEND_MESSAGES: 1n << 11n,
  READ_MESSAGE_HISTORY: 1n << 16n,
  MENTION_EVERYONE: 1n << 17n,
  USE_APPLICATION_COMMANDS: 1n << 31n,
  CREATE_PUBLIC_THREADS: 1n << 35n,
  CREATE_PRIVATE_THREADS: 1n << 36n,
  SEND_MESSAGES_IN_THREADS: 1n << 38n
};

const AUTOMOD = {
  EVENT_MESSAGE_SEND: 1,
  TRIGGER_KEYWORD: 1,
  TRIGGER_SPAM: 3,
  TRIGGER_MENTION_SPAM: 5,
  ACTION_BLOCK_MESSAGE: 1,
  ACTION_SEND_ALERT: 2
};

const ROLE_DEFS = {
  reviewer: {
    name: "Referral Reviewer",
    legacyNames: ["Lead Reviewer"],
    color: 0xf1c21b
  },
  referrer: {
    name: "Referrer",
    legacyNames: ["Verified Finder"],
    color: 0x24a148
  },
  muted: {
    name: "Muted",
    legacyNames: [],
    color: 0x6f7682
  }
};

function botHeaders(extra = {}) {
  return {
    Authorization: `Bot ${config.token}`,
    ...extra
  };
}

async function discordFetch(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      ...botHeaders(),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${body.message || response.statusText}`);
  }
  return body;
}

function bits(...values) {
  return values.reduce((total, value) => total | value, 0n).toString();
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function guideMessagePayload(embed) {
  return {
    embeds: [embed.toJSON()],
    allowed_mentions: { parse: [] }
  };
}

function referralPanelPayload() {
  return {
    embeds: [panelEmbed(config).toJSON()],
    components: panelButtons().map((row) => row.toJSON()),
    allowed_mentions: { parse: [] }
  };
}

function isBlankPlaceholder(message) {
  return (
    message.type === 0 &&
    !message.author?.bot &&
    !message.content &&
    !message.embeds?.length &&
    !message.attachments?.length &&
    !message.components?.length &&
    !message.pinned
  );
}

function hasGuideFooter(message) {
  return (message.embeds || []).some((embed) => embed.footer?.text === GUIDE_FOOTER);
}

function hasReferralPanel(message) {
  return (message.embeds || []).some((embed) => embed.title === `${config.brandName} referrals`);
}

async function recentMessages(channelId) {
  return discordFetch(`/channels/${channelId}/messages?limit=50`);
}

async function fetchGuildChannels() {
  return discordFetch(`/guilds/${config.guildId}/channels`);
}

async function fetchGuildRoles() {
  return discordFetch(`/guilds/${config.guildId}/roles`);
}

async function fetchAutoModRules() {
  return discordFetch(`/guilds/${config.guildId}/auto-moderation/rules`);
}

async function ensureRole(def) {
  const roles = await fetchGuildRoles();
  const existing =
    roles.find((role) => role.name === def.name && !role.managed) ||
    roles.find((role) => def.legacyNames.includes(role.name) && !role.managed);

  if (existing) {
    const label = existing.name === def.name ? "exists" : `using legacy ${existing.name}`;
    return { id: existing.id, action: `${label} ${existing.id}` };
  }

  const created = await discordFetch(`/guilds/${config.guildId}/roles`, {
    method: "POST",
    body: JSON.stringify({
      name: def.name,
      color: def.color,
      mentionable: false,
      hoist: false,
      permissions: "0"
    })
  });
  return { id: created.id, action: `created ${created.id}` };
}

async function ensureRoles() {
  const results = {};
  for (const [key, def] of Object.entries(ROLE_DEFS)) {
    results[key] = await ensureRole(def);
  }
  return results;
}

async function ensureGuideChannel(guide, guildChannels) {
  if (guide.channelId) {
    return guildChannels.find((channel) => channel.id === guide.channelId) || { id: guide.channelId };
  }

  const existing = guildChannels.find(
    (channel) => channel.type === TEXT_CHANNEL && channel.name === guide.name && channel.parent_id === guide.parentId
  );
  if (existing) return existing;

  return discordFetch(`/guilds/${config.guildId}/channels`, {
    method: "POST",
    body: JSON.stringify({
      name: guide.name,
      type: TEXT_CHANNEL,
      parent_id: guide.parentId,
      position: guide.position,
      topic: guide.topic || ""
    })
  });
}

async function updateChannel(channel, guide) {
  const patch = {};
  if (guide.name && channel.name !== guide.name) patch.name = guide.name;
  if (guide.parentId && channel.parent_id !== guide.parentId) patch.parent_id = guide.parentId;
  if (guide.topic) patch.topic = guide.topic;
  if (guide.position !== undefined) patch.position = guide.position;

  if (!Object.keys(patch).length) return "unchanged";
  await discordFetch(`/channels/${channel.id}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
  return "updated";
}

async function putRoleOverwrite(channelId, roleId, allow, deny) {
  await discordFetch(`/channels/${channelId}/permissions/${roleId}`, {
    method: "PUT",
    body: JSON.stringify({
      type: ROLE_OVERWRITE,
      allow,
      deny
    })
  });
}

async function applyPublicReadOnly(channelId, roles) {
  await putRoleOverwrite(
    channelId,
    config.guildId,
    bits(PERMS.VIEW_CHANNEL, PERMS.READ_MESSAGE_HISTORY, PERMS.USE_APPLICATION_COMMANDS),
    bits(
      PERMS.SEND_MESSAGES,
      PERMS.ADD_REACTIONS,
      PERMS.MENTION_EVERYONE,
      PERMS.CREATE_PUBLIC_THREADS,
      PERMS.CREATE_PRIVATE_THREADS,
      PERMS.SEND_MESSAGES_IN_THREADS
    )
  );
  await applyMutedOverwrite(channelId, roles);
}

async function applyPublicWritable(channelId, roles) {
  await putRoleOverwrite(
    channelId,
    config.guildId,
    bits(PERMS.VIEW_CHANNEL, PERMS.READ_MESSAGE_HISTORY, PERMS.SEND_MESSAGES, PERMS.USE_APPLICATION_COMMANDS),
    bits(PERMS.MENTION_EVERYONE)
  );
  await applyMutedOverwrite(channelId, roles);
}

async function applyPrivateReview(channelId, roles) {
  await putRoleOverwrite(channelId, config.guildId, "0", bits(PERMS.VIEW_CHANNEL));
  await putRoleOverwrite(
    channelId,
    roles.reviewer.id,
    bits(PERMS.VIEW_CHANNEL, PERMS.READ_MESSAGE_HISTORY, PERMS.SEND_MESSAGES, PERMS.USE_APPLICATION_COMMANDS),
    bits(PERMS.MENTION_EVERYONE)
  );
  await applyMutedPrivateOverwrite(channelId, roles);
}

async function applyPrivateOwner(channelId, roles) {
  await putRoleOverwrite(channelId, config.guildId, "0", bits(PERMS.VIEW_CHANNEL));
  await applyMutedPrivateOverwrite(channelId, roles);
}

async function applyMutedOverwrite(channelId, roles) {
  await putRoleOverwrite(
    channelId,
    roles.muted.id,
    bits(PERMS.VIEW_CHANNEL, PERMS.READ_MESSAGE_HISTORY),
    bits(
      PERMS.SEND_MESSAGES,
      PERMS.ADD_REACTIONS,
      PERMS.USE_APPLICATION_COMMANDS,
      PERMS.CREATE_PUBLIC_THREADS,
      PERMS.CREATE_PRIVATE_THREADS,
      PERMS.SEND_MESSAGES_IN_THREADS
    )
  );
}

async function applyMutedPrivateOverwrite(channelId, roles) {
  await putRoleOverwrite(
    channelId,
    roles.muted.id,
    "0",
    bits(
      PERMS.VIEW_CHANNEL,
      PERMS.SEND_MESSAGES,
      PERMS.ADD_REACTIONS,
      PERMS.USE_APPLICATION_COMMANDS,
      PERMS.CREATE_PUBLIC_THREADS,
      PERMS.CREATE_PRIVATE_THREADS,
      PERMS.SEND_MESSAGES_IN_THREADS
    )
  );
}

async function applyChannelPermissions(channelId, guide, roles) {
  if (guide.privateToOwner) {
    await applyPrivateOwner(channelId, roles);
    return "private-owner";
  }
  if (guide.privateToReviewers) {
    await applyPrivateReview(channelId, roles);
    return "private-reviewers";
  }
  if (guide.readOnly) {
    await applyPublicReadOnly(channelId, roles);
    return "public-readonly";
  }
  await applyPublicWritable(channelId, roles);
  return "public-writable";
}

async function deleteMessage(channelId, messageId) {
  const response = await fetch(`${API}/channels/${channelId}/messages/${messageId}`, {
    method: "DELETE",
    headers: botHeaders()
  });
  if (!response.ok && response.status !== 404) {
    const body = await response.json().catch(() => ({}));
    throw new Error(`DELETE /channels/${channelId}/messages/${messageId} failed: ${response.status} ${body.message || response.statusText}`);
  }
}

function autoModActions(alertChannelId, customMessage) {
  const actions = [
    {
      type: AUTOMOD.ACTION_BLOCK_MESSAGE,
      metadata: { custom_message: customMessage.slice(0, 150) }
    }
  ];

  if (alertChannelId) {
    actions.push({
      type: AUTOMOD.ACTION_SEND_ALERT,
      metadata: { channel_id: alertChannelId }
    });
  }

  return actions;
}

function buildAutoModRules({ alertChannelId, exemptRoleIds, guideChannelIds }) {
  const guideExemptions = unique(guideChannelIds);
  const common = {
    event_type: AUTOMOD.EVENT_MESSAGE_SEND,
    enabled: true,
    exempt_roles: unique(exemptRoleIds)
  };

  return [
    {
      name: "QIS block spam content",
      trigger_type: AUTOMOD.TRIGGER_SPAM,
      payload: {
        ...common,
        trigger_metadata: {},
        actions: autoModActions(alertChannelId, "This looks like spam. Keep referral messages clean and readable."),
        exempt_channels: []
      }
    },
    {
      name: "QIS block mention spam",
      trigger_type: AUTOMOD.TRIGGER_MENTION_SPAM,
      payload: {
        ...common,
        trigger_metadata: {
          mention_total_limit: 4,
          mention_raid_protection_enabled: true
        },
        actions: autoModActions(alertChannelId, "Too many mentions in one message. Keep pings limited."),
        exempt_channels: []
      }
    },
    {
      name: "QIS referral safety keywords",
      trigger_type: AUTOMOD.TRIGGER_KEYWORD,
      payload: {
        ...common,
        trigger_metadata: {
          keyword_filter: [
            "mass dm",
            "mass-dm",
            "fake screenshot",
            "fake reply",
            "fake guarantee",
            "fake leads",
            "alt account",
            "alts",
            "guaranteed payout",
            "scrape private",
            "scraped private",
            "private scraping",
            "cold sms",
            "outbound ai call",
            "account farm",
            "burner account",
            "kyc",
            "bypass captcha",
            "captcha solver",
            "self referral",
            "self-referral",
            "buy accounts"
          ]
        },
        actions: autoModActions(alertChannelId, "That wording is not allowed here. Keep referrals real and clean."),
        exempt_channels: guideExemptions
      }
    }
  ];
}

async function upsertAutoModRule(rule, existingRules) {
  const existing = existingRules.find((item) => item.name === rule.name);
  const body = JSON.stringify({
    ...rule.payload,
    ...(existing ? {} : { name: rule.name, trigger_type: rule.trigger_type })
  });

  if (existing) {
    await discordFetch(`/guilds/${config.guildId}/auto-moderation/rules/${existing.id}`, {
      method: "PATCH",
      body
    });
    return `updated ${rule.name}`;
  }

  await discordFetch(`/guilds/${config.guildId}/auto-moderation/rules`, {
    method: "POST",
    body
  });
  return `created ${rule.name}`;
}

async function ensureAutoModRules(roles, channelIds) {
  const existingRules = await fetchAutoModRules();
  const readOnlyGuideChannelIds = [
    channelIds.startHere,
    channelIds.rules,
    channelIds.howItWorks,
    channelIds.approvedScripts,
    channelIds.getYourLink,
    channelIds.submitLeads,
    channelIds.referralReview,
    channelIds.approvedReferrals,
    channelIds.payoutLog,
    channelIds.adminNotes
  ];
  const rules = buildAutoModRules({
    alertChannelId: channelIds.adminNotes || channelIds.referralReview,
    exemptRoleIds: [roles.reviewer.id],
    guideChannelIds: readOnlyGuideChannelIds
  });

  const results = [];
  for (const rule of rules) {
    results.push(await upsertAutoModRule(rule, existingRules));
  }
  return results;
}

async function updateGuildSafetySettings() {
  await discordFetch(`/guilds/${config.guildId}`, {
    method: "PATCH",
    body: JSON.stringify({
      verification_level: 1,
      default_message_notifications: 1,
      explicit_content_filter: 2
    })
  });
  return "verification=email required; notifications=mentions only; media filter=all members";
}

async function upsertGuide(guide, guildChannels, roles) {
  const channel = await ensureGuideChannel(guide, guildChannels);
  const channelId = channel.id;

  const channelAction = await updateChannel(channel, guide);
  const permissions = await applyChannelPermissions(channelId, guide, roles);

  if (guide.skipGuideMessage) {
    return { channelId, action: `channel ${channelAction}; permissions ${permissions}`, removedBlank: 0 };
  }

  const messages = await recentMessages(channelId);
  const guideMessages = messages.filter((message) => message.author?.id === config.clientId && hasGuideFooter(message));
  const blankPlaceholders = messages.filter(isBlankPlaceholder);

  let action;
  if (guideMessages.length) {
    const [keeper, ...extras] = guideMessages;
    await discordFetch(`/channels/${channelId}/messages/${keeper.id}`, {
      method: "PATCH",
      body: JSON.stringify(guideMessagePayload(guide.embed))
    });
    for (const message of extras) {
      await deleteMessage(channelId, message.id);
    }
    action = `edited ${keeper.id}`;
  } else {
    const sent = await discordFetch(`/channels/${channelId}/messages`, {
      method: "POST",
      body: JSON.stringify(guideMessagePayload(guide.embed))
    });
    action = `posted ${sent.id}`;
  }

  for (const message of blankPlaceholders) {
    await deleteMessage(channelId, message.id);
  }

  return {
    channelId,
    action: `channel ${channelAction}; permissions ${permissions}; guide ${action}`,
    removedBlank: blankPlaceholders.length
  };
}

async function updateReferralPanel(roles) {
  const channelId = CHANNELS.submitLeads;
  const channel = await discordFetch(`/channels/${channelId}`);
  await updateChannel(channel, {
    id: channelId,
    name: "📨・submit-referral",
    parentId: "1517380094732144811",
    position: 0,
    topic: "Submit interested referrals with the bot button. Random business lists do not count."
  });
  await applyPublicReadOnly(channelId, roles);

  const messages = await recentMessages(channelId);
  const panels = messages.filter((message) => message.author?.id === config.clientId && hasReferralPanel(message));
  const blankPlaceholders = messages.filter(isBlankPlaceholder);

  let action;
  if (panels.length) {
    const [keeper, ...extras] = panels;
    await discordFetch(`/channels/${channelId}/messages/${keeper.id}`, {
      method: "PATCH",
      body: JSON.stringify(referralPanelPayload())
    });
    for (const message of extras) {
      await deleteMessage(channelId, message.id);
    }
    action = `edited ${keeper.id}`;
  } else {
    const sent = await discordFetch(`/channels/${channelId}/messages`, {
      method: "POST",
      body: JSON.stringify(referralPanelPayload())
    });
    action = `posted ${sent.id}`;
  }

  for (const message of blankPlaceholders) {
    await deleteMessage(channelId, message.id);
  }

  return { action, removedBlank: blankPlaceholders.length };
}

async function main() {
  const results = [];
  const channelIds = {};
  const roles = await ensureRoles();
  results.push(`reviewerRole: ${roles.reviewer.action}`);
  results.push(`referrerRole: ${roles.referrer.action}`);
  results.push(`mutedRole: ${roles.muted.action}`);

  let guildChannels = await fetchGuildChannels();
  for (const guide of serverGuides()) {
    const result = await upsertGuide(guide, guildChannels, roles);
    channelIds[guide.key] = result.channelId;
    results.push(`${guide.key}: ${result.action}; channel=${result.channelId}; removed blank=${result.removedBlank}`);
    if (!guide.channelId) {
      guildChannels = await fetchGuildChannels();
    }
  }

  const panel = await updateReferralPanel(roles);
  channelIds.submitLeads = CHANNELS.submitLeads;
  results.push(`submitReferralPanel: ${panel.action}; removed blank=${panel.removedBlank}`);

  try {
    const safety = await updateGuildSafetySettings();
    results.push(`guildSafety: ${safety}`);
  } catch (error) {
    results.push(`guildSafety: skipped (${error.message})`);
  }

  try {
    const autoModResults = await ensureAutoModRules(roles, channelIds);
    results.push(`autoMod: ${autoModResults.join("; ")}`);
  } catch (error) {
    results.push(`autoMod: skipped (${error.message})`);
  }

  results.push(`set REVIEWER_ROLE_ID=${roles.reviewer.id} in .env if it is not already set`);

  console.log(results.join("\n"));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
