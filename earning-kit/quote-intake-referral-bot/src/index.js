const {
  ActionRowBuilder,
  ChannelType,
  Client,
  GatewayIntentBits,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle
} = require("discord.js");

const config = require("./config");
const {
  addReferral,
  getReferral,
  getStats,
  getUserReferrals,
  nextReferralId,
  updateReferral
} = require("./storage");
const {
  panelButtons,
  panelEmbed,
  reviewButtons,
  reviewEmbed,
  safe,
  statusLabel
} = require("./messages");
const { referralCodeForUser, referralUrlForUser } = require("./referral-link");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

function allowedMentions() {
  return { parse: [], users: [] };
}

function isReviewer(member) {
  if (!member) return false;
  if (member.permissions?.has(PermissionFlagsBits.ManageGuild)) return true;
  if (!config.reviewerRoleId) return false;
  return member.roles?.cache?.has(config.reviewerRoleId);
}

function referralModal() {
  return new ModalBuilder()
    .setCustomId("qis:referral-modal")
    .setTitle("Submit referral")
    .addComponents(
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("businessName")
          .setLabel("Business name")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(100)
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("website")
          .setLabel("Website")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(200)
          .setPlaceholder("https://example.com")
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("locationNiche")
          .setLabel("Location / niche")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(200)
          .setPlaceholder("Las Vegas plumber, Kauai cleaner, etc.")
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("contactMethod")
          .setLabel("Who did you message?")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(200)
          .setPlaceholder("Owner name + where they replied, public email, IG DM")
          .setRequired(true)
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder()
          .setCustomId("interestProof")
          .setLabel("Proof of interest")
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(900)
          .setPlaceholder("Paste/summarize their interested reply. Screenshot proof may be requested.")
          .setRequired(true)
      )
    );
}

async function handleSetup(interaction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
    await interaction.reply({
      content: "Only server managers can set up referral panels.",
      ephemeral: true,
      allowedMentions: allowedMentions()
    });
    return;
  }

  const channel = interaction.options.getChannel("channel") || interaction.channel;
  if (!channel || channel.type !== ChannelType.GuildText) {
    await interaction.reply({
      content: "Choose a normal text channel for the referral panel.",
      ephemeral: true,
      allowedMentions: allowedMentions()
    });
    return;
  }

  await channel.send({
    embeds: [panelEmbed(config)],
    components: panelButtons(),
    allowedMentions: allowedMentions()
  });

  await interaction.reply({
    content: `Referral panel posted in ${channel}.`,
    ephemeral: true,
    allowedMentions: allowedMentions()
  });
}

async function handleStats(interaction) {
  if (!isReviewer(interaction.member)) {
    await interaction.reply({
      content: "Only reviewers can view referral stats.",
      ephemeral: true,
      allowedMentions: allowedMentions()
    });
    return;
  }

  const stats = await getStats(config.storagePath);
  const lines = Object.entries(stats).map(([key, value]) => `${key}: ${value}`);
  await interaction.reply({
    content: `Referral stats\n${lines.join("\n")}`,
    ephemeral: true,
    allowedMentions: allowedMentions()
  });
}

async function handleMyReferrals(interaction) {
  const referrals = await getUserReferrals(config.storagePath, interaction.user.id);
  if (!referrals.length) {
    await interaction.reply({
      content: "You have not submitted any referrals yet.",
      ephemeral: true,
      allowedMentions: allowedMentions()
    });
    return;
  }

  const latest = referrals.slice(-10).reverse();
  const lines = latest.map((item) => `${item.id} - ${item.status} - ${safe(item.businessName, 80)}`);
  await interaction.reply({
    content: `Your latest referrals:\n${lines.join("\n")}`,
    ephemeral: true,
    allowedMentions: allowedMentions()
  });
}

async function handleReferralLink(interaction) {
  const code = referralCodeForUser(interaction.user);
  const url = referralUrlForUser(interaction.user);
  await interaction.reply({
    content: [
      `Your referral link: ${url}`,
      `Your referral code: \`${code}\``,
      "Tell them to mention your Discord username or code when they email. Links and discounts are manually approved."
    ].join("\n"),
    ephemeral: true,
    allowedMentions: allowedMentions()
  });
}

async function handleReferralHelp(interaction) {
  await interaction.reply({
    content: [
      "Clean referral workflow:",
      "1. Use people you know, business owners you have a real reason to contact, or public posts asking for website/business help.",
      "2. Send the approved message. Do not promise pricing, results, timelines, discounts, or payouts.",
      "3. If they say yes, use `/referral-link` and send the link.",
      "4. Submit the referral only after they show interest. Keep screenshot proof ready.",
      "",
      "Approved message:",
      "```text",
      "Hey, quick question. Do you or someone you know handle the website for a local service business?",
      "",
      "I know a small service that fixes confusing quote/contact pages and broken buttons/links. I may get a referral payout if they end up helping you.",
      "",
      "Want me to send their info page?",
      "```"
    ].join("\n"),
    ephemeral: true,
    allowedMentions: allowedMentions()
  });
}

async function postReferralForReview(referral) {
  const channel = await client.channels.fetch(config.reviewChannelId);
  await channel.send({
    embeds: [reviewEmbed(referral, config)],
    components: reviewButtons(referral),
    allowedMentions: allowedMentions()
  });
}

function submitterStatusMessage(referral, status) {
  const business = safe(referral.businessName, 120);
  const messages = {
    approved: [
      `Your referral ${referral.id} for ${business} was approved for review.`,
      "Approval means it looks useful enough to check. Payout still only happens if the business becomes a paid client."
    ],
    contacted: [
      `Your referral ${referral.id} for ${business} was marked contacted.`,
      "Keep screenshot proof available in case the owner asks for it."
    ],
    client_won: [
      `Your referral ${referral.id} for ${business} was marked client won.`,
      "Payout is not marked sent yet. Watch for the paid status."
    ],
    paid: [
      `Your referral ${referral.id} for ${business} was marked paid.`,
      "Keep private payment details out of public channels."
    ],
    rejected: [
      `Your referral ${referral.id} for ${business} was not approved.`,
      "Common reasons are duplicates, weak proof, fake/alt signals, or the business not being a fit."
    ]
  };
  return (messages[status] || [`Your referral ${referral.id} is now ${statusLabel(status)}.`]).join("\n");
}

async function notifySubmitter(referral, status) {
  try {
    const user = await client.users.fetch(referral.submitterId);
    await user.send({
      content: submitterStatusMessage(referral, status),
      allowedMentions: allowedMentions()
    });
    return true;
  } catch (error) {
    console.warn(`Could not DM submitter for ${referral.id}: ${error.message}`);
    return false;
  }
}

async function handleReferralSubmit(interaction) {
  const id = await nextReferralId(config.storagePath);
  const referral = await addReferral(config.storagePath, {
    id,
    submitterId: interaction.user.id,
    submitterTag: interaction.user.tag,
    businessName: interaction.fields.getTextInputValue("businessName"),
    website: interaction.fields.getTextInputValue("website"),
    locationNiche: interaction.fields.getTextInputValue("locationNiche"),
    contactMethod: interaction.fields.getTextInputValue("contactMethod"),
    interestProof: interaction.fields.getTextInputValue("interestProof")
  });

  await postReferralForReview(referral);

  const duplicateText = referral.duplicateOf
    ? ` It may duplicate \`${referral.duplicateOf}\`, so it needs extra review.`
    : "";
  const flagText = referral.reviewFlags?.length
    ? " Some review flags were added for the owner to check."
    : "";
  await interaction.reply({
    content: [
      `Referral submitted: \`${referral.id}\`.`,
      duplicateText.trim(),
      flagText.trim(),
      "Keep screenshot proof ready. If we ask for proof, use a support ticket or DM the owner, and hide private client/payment details."
    ].filter(Boolean).join(" "),
    ephemeral: true,
    allowedMentions: allowedMentions()
  });
}

async function handleReviewButton(interaction, action, id) {
  if (!isReviewer(interaction.member)) {
    await interaction.reply({
      content: "Only reviewers can use these buttons.",
      ephemeral: true,
      allowedMentions: allowedMentions()
    });
    return;
  }

  const existing = await getReferral(config.storagePath, id);
  if (!existing) {
    await interaction.reply({
      content: "Referral record not found.",
      ephemeral: true,
      allowedMentions: allowedMentions()
    });
    return;
  }

  const statusByAction = {
    approve: "approved",
    contacted: "contacted",
    won: "client_won",
    reject: "rejected",
    paid: "paid"
  };
  const status = statusByAction[action];
  const referral = await updateReferral(config.storagePath, id, {
    status,
    reviewedBy: interaction.user.id
  });

  await interaction.update({
    embeds: [reviewEmbed(referral, config)],
    components: reviewButtons(referral),
    allowedMentions: allowedMentions()
  });

  if (["approved", "contacted", "client_won", "paid"].includes(status) && config.approvedChannelId) {
    const approvedChannel = await client.channels.fetch(config.approvedChannelId);
    await approvedChannel.send({
      content: `${statusLabel(status)} referral ${referral.id}`,
      embeds: [reviewEmbed(referral, config)],
      allowedMentions: allowedMentions()
    });
  }

  const notified = await notifySubmitter(referral, status);
  await interaction.followUp({
    content: notified ? "Submitter notified by DM." : "Status saved. Submitter DM failed or is closed.",
    ephemeral: true,
    allowedMentions: allowedMentions()
  });
}

client.once("clientReady", () => {
  console.log(`${config.brandName} referral bot logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "setup-referrals") {
        await handleSetup(interaction);
        return;
      }
      if (interaction.commandName === "referral-stats") {
        await handleStats(interaction);
        return;
      }
      if (interaction.commandName === "my-referrals") {
        await handleMyReferrals(interaction);
        return;
      }
      if (interaction.commandName === "referral-link") {
        await handleReferralLink(interaction);
        return;
      }
      if (interaction.commandName === "referral-help") {
        await handleReferralHelp(interaction);
        return;
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId === "qis:open-referral-modal") {
        await interaction.showModal(referralModal());
        return;
      }

      const [, action, id] = interaction.customId.split(":");
      if (["approve", "contacted", "won", "reject", "paid"].includes(action) && id) {
        await handleReviewButton(interaction, action, id);
        return;
      }
    }

    if (interaction.isModalSubmit() && interaction.customId === "qis:referral-modal") {
      await handleReferralSubmit(interaction);
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "Something went wrong. Ask the owner to check the bot logs.",
        ephemeral: true,
        allowedMentions: allowedMentions()
      });
    }
  }
});

client.login(config.token);
