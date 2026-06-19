const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

function safe(text, max = 1000) {
  const clean = String(text || "")
    .replace(/@/g, "@\u200b")
    .replace(/\s+/g, " ")
    .trim();
  return clean.slice(0, max) || "Not provided";
}

function statusLabel(status) {
  const labels = {
    possible_duplicate: "POSSIBLE DUPLICATE",
    submitted: "SUBMITTED",
    approved: "APPROVED",
    contacted: "CONTACTED",
    client_won: "CLIENT WON",
    rejected: "REJECTED",
    paid: "PAID"
  };
  return labels[status] || safe(status, 80).toUpperCase();
}

function panelEmbed(config) {
  return new EmbedBuilder()
    .setColor(0x2f6fed)
    .setTitle(`${config.brandName} referrals`)
    .setDescription(
      [
        "Refer local service businesses that may be open to help with their website, contact page, or quote request page.",
        "",
        "Only message people you know, business owners you have a real reason to contact, or people publicly asking for website/business help.",
        "",
        "Do not mass-DM random strangers. Random business lists do not count.",
        "",
        "Paste or summarize the interested reply in the form. Screenshot proof may be requested.",
        "",
        "Use /referral-link if you want a tracked link. The referral page will add your code to the email buttons automatically.",
        "",
        "Payouts are manual after the referred business becomes a paid client."
      ].join("\n")
    )
    .addFields(
      {
        name: "Payout",
        value: "$10 when your referral becomes a paid client. Referred businesses may get $10 off their first small fix after manual approval."
      },
      {
        name: "Allowed message",
        value:
          "Hey, quick question. Do you or someone you know handle the website for a local service business?\n\nI know a small service that fixes confusing quote/contact pages and broken buttons/links. I may get a referral payout if they end up helping you.\n\nWant me to send their info page?"
      }
    )
    .setFooter({ text: "No mass DMs, fake claims, fake screenshots, or private contact scraping." });
}

function panelButtons() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("qis:open-referral-modal")
        .setLabel("Submit referral")
        .setStyle(ButtonStyle.Primary)
    )
  ];
}

function reviewEmbed(referral, config) {
  const status = statusLabel(referral.status);
  const score = Number.isFinite(referral.reviewScore) ? `${referral.reviewScore}/100` : "Not scored";
  const risk = referral.reviewRisk ? referral.reviewRisk.replaceAll("_", " ") : "manual check";
  const embed = new EmbedBuilder()
    .setColor(status === "PAID" || status === "CLIENT WON" ? 0x24a148 : status === "REJECTED" ? 0xda1e28 : 0xf1c21b)
    .setTitle(`${config.brandName} referral: ${referral.id}`)
    .setDescription(`Status: **${status}**`)
    .addFields(
      { name: "Business", value: safe(referral.businessName, 256), inline: true },
      { name: "Website", value: safe(referral.website, 256), inline: true },
      { name: "Review score", value: `${score} (${safe(risk, 40)})`, inline: true },
      { name: "Location / niche", value: safe(referral.locationNiche, 256), inline: false },
      { name: "Who / where they replied", value: safe(referral.contactMethod, 512), inline: false },
      { name: "Interest proof", value: safe(referral.interestProof, 1000), inline: false },
      { name: "Submitted by", value: `<@${referral.submitterId}>`, inline: true }
    )
    .setTimestamp(new Date(referral.createdAt || Date.now()));

  if (referral.duplicateOf) {
    embed.addFields({ name: "Possible duplicate of", value: referral.duplicateOf, inline: true });
  }

  if (referral.reviewFlags?.length) {
    embed.addFields({
      name: "Review flags",
      value: referral.reviewFlags.map((flag) => `- ${safe(flag, 140)}`).join("\n"),
      inline: false
    });
  }

  if (referral.reviewedBy) {
    embed.addFields({ name: "Last reviewed by", value: `<@${referral.reviewedBy}>`, inline: true });
  }

  return embed;
}

function reviewButtons(referral) {
  const status = referral.status;
  const done = ["rejected", "paid"].includes(status);
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`qis:approve:${referral.id}`)
        .setLabel("Approve")
        .setStyle(ButtonStyle.Success)
        .setDisabled(done || ["approved", "contacted", "client_won"].includes(status)),
      new ButtonBuilder()
        .setCustomId(`qis:contacted:${referral.id}`)
        .setLabel("Contacted")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(done || status !== "approved"),
      new ButtonBuilder()
        .setCustomId(`qis:won:${referral.id}`)
        .setLabel("Client won")
        .setStyle(ButtonStyle.Success)
        .setDisabled(done || !["approved", "contacted"].includes(status)),
      new ButtonBuilder()
        .setCustomId(`qis:paid:${referral.id}`)
        .setLabel("Paid")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(done || status !== "client_won"),
      new ButtonBuilder()
        .setCustomId(`qis:reject:${referral.id}`)
        .setLabel("Reject")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(done)
    )
  ];
}

module.exports = {
  panelButtons,
  panelEmbed,
  reviewButtons,
  reviewEmbed,
  safe,
  statusLabel
};
