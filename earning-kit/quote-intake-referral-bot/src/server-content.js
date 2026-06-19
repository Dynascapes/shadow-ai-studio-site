const { EmbedBuilder } = require("discord.js");

const GUIDE_FOOTER = "Quote Intake Studio server guide";

const COLORS = {
  blue: 0x2f6fed,
  green: 0x24a148,
  gold: 0xf1c21b,
  gray: 0x6f7682,
  red: 0xda1e28
};

const CATEGORIES = {
  startHere: "1517378353190015048",
  leadWorkflow: "1517380094732144811",
  payouts: "1517380111115223060"
};

const CHANNELS = {
  startHere: "1517425345127649361",
  rules: "1517378565186912377",
  howItWorks: "1517378578545770526",
  approvedScripts: "1517378593095815278",
  getYourLink: "",
  support: "1517378661496393818",
  questions: "1517378717498871938",
  general: "1517378353190015050",
  submitLeads: "1517378606161068133",
  referralReview: "1517378619935162459",
  approvedReferrals: "1517378633331638272",
  payoutLog: "1517378647936209007",
  wins: "1517425451109191800",
  adminNotes: ""
};

const CHANNEL_MENTIONS = {
  rules: `<#${CHANNELS.rules}>`,
  howItWorks: `<#${CHANNELS.howItWorks}>`,
  approvedScripts: `<#${CHANNELS.approvedScripts}>`,
  submitLeads: `<#${CHANNELS.submitLeads}>`,
  questions: `<#${CHANNELS.questions}>`
};

function guideEmbed({ color = COLORS.blue, title, description, fields = [] }) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .addFields(fields)
    .setFooter({ text: GUIDE_FOOTER });
}

function serverGuides() {
  return [
    {
      key: "startHere",
      channelId: CHANNELS.startHere,
      name: "📌・start-here",
      parentId: CATEGORIES.startHere,
      position: 0,
      readOnly: true,
      topic: "Start here: read rules, get your link, use the approved script, and submit only interested referrals.",
      embed: guideEmbed({
        color: COLORS.blue,
        title: "Start Here",
        description:
          "Read this first before submitting referrals. The server is simple: use the approved message, submit only real interest, and payouts happen only after a referred business becomes a paid client.",
        fields: [
          {
            name: "Fast path",
            value:
              "1. Read the rules.\n2. Get your referral link with `/referral-link`.\n3. Use the approved message.\n4. Submit with the bot only after they show interest.\n5. Keep screenshot proof ready if asked."
          },
          {
            name: "Need the short version?",
            value:
              "Use `/referral-help` for the workflow and approved message without scrolling."
          },
          {
            name: "Useful channels",
            value:
              `Rules: ${CHANNEL_MENTIONS.rules}\nHow it works: ${CHANNEL_MENTIONS.howItWorks}\nApproved script: ${CHANNEL_MENTIONS.approvedScripts}\nSubmit referral: ${CHANNEL_MENTIONS.submitLeads}\nQuestions: ${CHANNEL_MENTIONS.questions}`
          }
        ]
      })
    },
    {
      key: "rules",
      channelId: CHANNELS.rules,
      name: "📜・rules",
      parentId: CATEGORIES.startHere,
      position: 1,
      readOnly: true,
      topic: "Clean referral rules. No mass DMs, fake claims, or raw lead lists.",
      embed: guideEmbed({
        color: COLORS.gold,
        title: "Referral Rules",
        description:
          "This server is for warm referral bounties for Quote Intake Studio. Keep it clean, simple, and real.",
        fields: [
          {
            name: "Allowed",
            value:
              "- People you know\n- Business owners you have a real reason to contact\n- Public posts where someone asks for website or business help"
          },
          {
            name: "Not allowed",
            value:
              "- Mass-DMing random strangers\n- Fake replies, fake screenshots, fake guarantees, or alts\n- Scraping private contact info\n- Promising prices, timelines, results, discounts, or payouts"
          },
          {
            name: "Payout rule",
            value:
              "Payouts are manual and only happen after the referred business becomes a paid Quote Intake Studio client."
          },
          {
            name: "Customer referral credit",
            value:
              "Referred businesses may get $10 off their first small fix after manual approval. One credit per real business, not stackable."
          }
        ]
      })
    },
    {
      key: "howItWorks",
      channelId: CHANNELS.howItWorks,
      name: "🧭・how-it-works",
      parentId: CATEGORIES.startHere,
      position: 2,
      readOnly: true,
      topic: "How referrals work from message to review to payout.",
      embed: guideEmbed({
        color: COLORS.blue,
        title: "How It Works",
        description:
          "The goal is not random lead lists. The goal is a real business owner who is open to a quick look.",
        fields: [
          {
            name: "Steps",
            value:
              "1. Message an allowed contact using the approved script.\n2. If they show interest, submit the referral with the bot.\n3. Quote Intake Studio reviews and follows up.\n4. If they become a paid client, the bounty can be paid."
          },
          {
            name: "What counts",
            value:
              "A useful referral has a real business, a website or public page, a contact method, and proof that they are open to help."
          },
          {
            name: "Referral link",
            value:
              "Use `/referral-link` in the link channel to get your link. If a business opens that link, the email buttons on the page include your code automatically."
          },
          {
            name: "Example submission",
            value:
              "Business: Example Plumbing\nWebsite: exampleplumbing.com\nWho replied: Owner replied on Instagram DM\nInterest proof: \"Yeah send me the site. Our quote form is annoying.\"\nWhy it counts: real business, public website, clear interest."
          }
        ]
      })
    },
    {
      key: "approvedScripts",
      channelId: CHANNELS.approvedScripts,
      name: "✉・approved-script",
      parentId: CATEGORIES.startHere,
      position: 3,
      readOnly: true,
      topic: "Approved referral message only. Do not freestyle promises.",
      embed: guideEmbed({
        color: COLORS.green,
        title: "Approved Message",
        description: "Use this simple message. Do not add promises about price, results, timing, or guarantees.",
        fields: [
          {
            name: "Script",
            value:
              "```text\nHey, quick question. Do you or someone you know handle the website for a local service business?\n\nI know a small service that fixes confusing quote/contact pages and broken buttons/links. I may get a referral payout if they end up helping you.\n\nWant me to send their info page?\n```"
          },
          {
            name: "If they say yes",
            value:
              "Send them your `/referral-link`, then submit the referral in the submit channel with what they said."
          }
        ]
      })
    },
    {
      key: "getYourLink",
      channelId: CHANNELS.getYourLink,
      name: "🔗・get-your-link",
      parentId: CATEGORIES.startHere,
      position: 4,
      readOnly: true,
      topic: "Use /referral-link here to get your personal referral link.",
      embed: guideEmbed({
        color: COLORS.blue,
        title: "Get Your Referral Link",
        description:
          "Type `/referral-link` in this channel. The bot will privately show your personal link and referral code.",
        fields: [
          {
            name: "How to use it",
            value:
              "Send your link only after someone says they want the info page. The page adds your referral code into the email draft, but still ask them to mention you if they write manually."
          },
          {
            name: "Important",
            value:
              "The link does not guarantee a payout. Payouts are manually approved only after a real referred business becomes a paid client."
          }
        ]
      })
    },
    {
      key: "support",
      channelId: CHANNELS.support,
      name: "🎫・support",
      parentId: CATEGORIES.startHere,
      position: 5,
      readOnly: false,
      topic: "Support for referral or payout issues. Do not post private payment/client info.",
      embed: guideEmbed({
        color: COLORS.gray,
        title: "Support",
        description:
          "Use this channel for ticket help, payout questions, or bot issues. Keep private payment/client details out of public messages.",
        fields: [
          {
            name: "Good support request",
            value:
              "Include your referral ID, what happened, and what you need checked. Do not post private transaction IDs or private client info."
          }
        ]
      })
    },
    {
      key: "questions",
      channelId: CHANNELS.questions,
      name: "❓・questions",
      parentId: CATEGORIES.startHere,
      position: 6,
      readOnly: false,
      topic: "Ask referral questions here. No private client/payment info.",
      embed: guideEmbed({
        color: COLORS.blue,
        title: "Questions",
        description:
          "Ask before sending if you are not sure whether a lead is allowed. Keep screenshots and private details out of public channels.",
        fields: [
          {
            name: "Quick check",
            value:
              "If the message would feel spammy if you received it, do not send it. Use warm contacts or public help requests."
          }
        ]
      })
    },
    {
      key: "general",
      channelId: CHANNELS.general,
      name: "💬・general-chat",
      parentId: CATEGORIES.startHere,
      position: 7,
      readOnly: false,
      topic: "General referral chat. No private client, payment, or account info.",
      skipGuideMessage: true
    },
    {
      key: "submitLeads",
      channelId: CHANNELS.submitLeads,
      name: "📨・submit-referral",
      parentId: CATEGORIES.leadWorkflow,
      position: 0,
      readOnly: true,
      topic: "Submit interested referrals with the bot button. Random business lists do not count.",
      skipGuideMessage: true
    },
    {
      key: "referralReview",
      channelId: CHANNELS.referralReview,
      name: "🔍・referral-review",
      parentId: CATEGORIES.leadWorkflow,
      position: 1,
      privateToReviewers: true,
      topic: "Private review queue for submitted referrals.",
      embed: guideEmbed({
        color: COLORS.gold,
        title: "Review Queue",
        description:
          "Submitted referrals land here for owner review. Approve only real, useful, non-duplicate referrals with proof of interest.",
        fields: [
          {
            name: "Reviewer checklist",
            value:
              "- Real business\n- Public website or social page\n- Public/reasonable contact path\n- Interest proof included\n- No duplicate or fake/alt signal"
          }
        ]
      })
    },
    {
      key: "approvedReferrals",
      channelId: CHANNELS.approvedReferrals,
      name: "✅・approved-referrals",
      parentId: CATEGORIES.leadWorkflow,
      position: 2,
      readOnly: true,
      topic: "Approved referrals after owner review.",
      embed: guideEmbed({
        color: COLORS.green,
        title: "Approved Referrals",
        description:
          "Approved referrals appear here after review. Approval does not mean payout yet; payout only happens after the client pays.",
        fields: [
          {
            name: "Status flow",
            value: "Submitted -> Approved -> Contacted -> Client won -> Paid"
          }
        ]
      })
    },
    {
      key: "payoutLog",
      channelId: CHANNELS.payoutLog,
      name: "💰・payout-log",
      parentId: CATEGORIES.payouts,
      position: 0,
      readOnly: true,
      topic: "Public payout confirmations only. Hide private details.",
      embed: guideEmbed({
        color: COLORS.green,
        title: "Payout Log",
        description:
          "Payout confirmations can go here after payouts happen. Hide PayPal emails, phone numbers, addresses, transaction IDs, and private client info.",
        fields: [
          {
            name: "Allowed proof",
            value:
              "A clean screenshot or short confirmation with private details covered."
          }
        ]
      })
    },
    {
      key: "wins",
      channelId: CHANNELS.wins,
      name: "🏆・wins",
      parentId: CATEGORIES.payouts,
      position: 1,
      readOnly: false,
      topic: "Clean wins and progress updates. Hide private client/payment details.",
      embed: guideEmbed({
        color: COLORS.green,
        title: "Wins",
        description:
          "Use this later for clean progress updates, approved wins, and public proof after real results happen. Do not fake activity.",
        fields: [
          {
            name: "Post safely",
            value:
              "Cover private names, emails, phone numbers, transaction IDs, and client details before sharing screenshots."
          }
        ]
      })
    },
    {
      key: "adminNotes",
      channelId: CHANNELS.adminNotes,
      name: "🛠・admin-notes",
      parentId: CATEGORIES.payouts,
      position: 2,
      privateToOwner: true,
      topic: "Private owner notes for server setup, payouts, and moderation.",
      embed: guideEmbed({
        color: COLORS.red,
        title: "Admin Notes",
        description:
          "Private owner-only notes. Keep bot setup details, payout decisions, and moderation notes here.",
        fields: [
          {
            name: "Do not post",
            value:
              "Do not post bot tokens, payment account details, private client records, or passwords in Discord."
          }
        ]
      })
    }
  ];
}

module.exports = {
  CHANNELS,
  CATEGORIES,
  COLORS,
  GUIDE_FOOTER,
  guideEmbed,
  serverGuides
};
