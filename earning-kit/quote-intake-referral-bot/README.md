# Quote Intake Studio Referral Bot

Small Discord bot for referral submissions.

What it does:

- Posts a clean referral panel with a `Submit referral` button.
- Opens a form for business name, website, location/niche, contact method, and proof of interest.
- Sends each referral to a review channel.
- Adds lightweight review flags for duplicates, weak proof, repeated contacts, or unusual volume.
- Lets an admin/reviewer move referrals through `approved`, `contacted`, `client_won`, `paid`, or `rejected`.
- Provides `/referral-link` so members can send `https://quoteintakestudio.com/referrals.html?ref=...`.
- Stores referral records locally in `data/referrals.json`.

## Setup

1. Create a Discord application named `Quote Intake Studio`.
2. Add a bot user to the application.
3. Copy `.env.example` to `.env`.
4. Fill in:
   - `DISCORD_TOKEN`
   - `CLIENT_ID`
   - `GUILD_ID`
   - `REVIEW_CHANNEL_ID`
5. Invite the bot with these permissions:
   - Send Messages
   - Embed Links
   - Read Message History
   - Use Slash Commands
6. Install dependencies:

```bash
npm install
```

7. Register slash commands:

```bash
npm run deploy
```

8. Post/update the server guide embeds:

```bash
npm run server:setup
```

9. Start the bot:

```bash
npm start
```

## Server Workflow

Use `/setup-referrals` in the channel where members should submit referrals.
Use `npm run server:setup` when the server guide messages need to be posted or refreshed.
The approved script sends interested prospects to `https://quoteintakestudio.com/referrals.html`.
Members can also use `/referral-link`. The customer should still mention the Discord username or referral code manually.

Recommended channels:

- `📌・start-here`
- `📜・rules`
- `🧭・how-it-works`
- `✉・approved-scripts`
- `❓・questions`
- `🎫・support`
- `📝・submit-leads`
- `👀・claimed-leads`
- `✅・approved-leads`
- `💰・payment-proof`
- `🏆・wins`

Keep instruction channels read-only. Let members ask in `questions`/`support` and submit referrals through the bot button instead of posting business info publicly.
