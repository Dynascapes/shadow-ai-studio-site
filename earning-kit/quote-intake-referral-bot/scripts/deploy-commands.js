const {
  ChannelType,
  PermissionFlagsBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

require("dotenv").config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token || !clientId) {
  throw new Error("DISCORD_TOKEN and CLIENT_ID are required.");
}

const commands = [
  new SlashCommandBuilder()
    .setName("setup-referrals")
    .setDescription("Post the Quote Intake Studio referral panel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel where the referral panel should be posted.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("referral-stats")
    .setDescription("Show referral totals by status."),
  new SlashCommandBuilder()
    .setName("my-referrals")
    .setDescription("Show your latest referral statuses."),
  new SlashCommandBuilder()
    .setName("referral-link")
    .setDescription("Get your referral info page link."),
  new SlashCommandBuilder()
    .setName("referral-help")
    .setDescription("Show the clean referral workflow and approved message.")
].map((command) => command.toJSON());

async function main() {
  const rest = new REST({ version: "10" }).setToken(token);
  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log(`Registered ${commands.length} guild commands.`);
    return;
  }

  await rest.put(Routes.applicationCommands(clientId), { body: commands });
  console.log(`Registered ${commands.length} global commands.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
