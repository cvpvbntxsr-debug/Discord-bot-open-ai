import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PREFIX = process.env.BOT_PREFIX || '!';

// Carrier data for deals (simulated - in production, this could fetch from APIs)
const carrierDeals = [
  {
    carrier: 'Verizon',
    plan: 'Unlimited Plus',
    price: '$80/month',
    data: 'Unlimited 5G',
    perks: '30GB hotspot, Disney+, Apple Music',
    rating: 4.5,
  },
  {
    carrier: 'T-Mobile',
    plan: 'Magenta MAX',
    price: '$85/month',
    data: 'Unlimited Premium 5G',
    perks: '40GB hotspot, Netflix, Apple TV+',
    rating: 4.7,
  },
  {
    carrier: 'AT&T',
    plan: 'Unlimited Elite',
    price: '$85/month',
    data: 'Unlimited 5G',
    perks: '40GB hotspot, HBO Max',
    rating: 4.3,
  },
  {
    carrier: 'Mint Mobile',
    plan: 'Unlimited',
    price: '$30/month',
    data: 'Unlimited 5G (35GB premium)',
    perks: 'Budget-friendly, 3-month commitment',
    rating: 4.2,
  },
  {
    carrier: 'Visible',
    plan: 'Visible+',
    price: '$45/month',
    data: 'Unlimited Premium 5G',
    perks: 'No contract, Verizon network',
    rating: 4.0,
  },
];

// Coverage information by carrier
const coverageInfo = {
  verizon: {
    network: '5G Ultra Wideband & 4G LTE',
    coverage: '99% of US population',
    strength: 'Best rural coverage',
  },
  tmobile: {
    network: '5G Extended Range',
    coverage: '98% of US population',
    strength: 'Largest 5G coverage area',
  },
  att: {
    network: '5G & 5G+',
    coverage: '99% of US population',
    strength: 'Strong nationwide coverage',
  },
  mint: {
    network: 'T-Mobile network (MVNO)',
    coverage: '98% of US population',
    strength: 'Same as T-Mobile coverage',
  },
  visible: {
    network: 'Verizon network (MVNO)',
    coverage: '99% of US population',
    strength: 'Same as Verizon coverage',
  },
};

client.on('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  console.log(`📡 Serving ${client.guilds.cache.size} servers`);
  client.user.setActivity('!help for commands', { type: 'WATCHING' });
});

client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Handle OpenAI questions (messages starting with the bot mention or prefix + "ask")
  if (message.mentions.has(client.user) || message.content.startsWith(`${PREFIX}ask`)) {
    await handleAskCommand(message);
    return;
  }

  // Ignore messages that don't start with prefix
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Command routing
  switch (command) {
    case 'help':
      await handleHelpCommand(message);
      break;
    case 'deals':
    case 'bestdeal':
      await handleDealsCommand(message);
      break;
    case 'coverage':
      await handleCoverageCommand(message, args);
      break;
    case 'compare':
      await handleCompareCommand(message, args);
      break;
    case 'datacalc':
      await handleDataCalcCommand(message, args);
      break;
    case 'plans':
      await handlePlansCommand(message, args);
      break;
    case 'network':
      await handleNetworkCommand(message);
      break;
    case 'carriers':
      await handleCarriersCommand(message);
      break;
    default:
      // Unknown command - do nothing or provide help
      break;
  }
});

// OpenAI Ask Command
async function handleAskCommand(message) {
  const question = message.content
    .replace(`<@${client.user.id}>`, '')
    .replace(`${PREFIX}ask`, '')
    .trim();

  if (!question) {
    return message.reply('Please ask me a question! Example: `!ask What is 5G?`');
  }

  const thinkingMsg = await message.reply('🤔 Thinking...');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant in a Discord server. Provide clear, concise answers. If asked about carriers or cellular topics, provide expert information.',
        },
        {
          role: 'user',
          content: question,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const answer = completion.choices[0].message.content;

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('💡 AI Assistant')
      .addFields(
        { name: '❓ Question', value: question.substring(0, 1024) },
        { name: '✅ Answer', value: answer.substring(0, 1024) }
      )
      .setFooter({ text: 'Powered by OpenAI' })
      .setTimestamp();

    await thinkingMsg.edit({ content: null, embeds: [embed] });
  } catch (error) {
    console.error('OpenAI Error:', error);
    await thinkingMsg.edit('❌ Sorry, I encountered an error processing your question. Please try again later.');
  }
}

// Help Command
async function handleHelpCommand(message) {
  const embed = new EmbedBuilder()
    .setColor('#00ff00')
    .setTitle('📱 Carrier Bot - Command List')
    .setDescription('Your AI-powered cellular carrier assistant!')
    .addFields(
      {
        name: '🤖 AI Commands',
        value: `\`${PREFIX}ask <question>\` - Ask me anything!\n\`@${client.user.username} <question>\` - Mention me with a question`,
      },
      {
        name: '💰 Carrier Deal Commands',
        value: `\`${PREFIX}deals\` - Find the best carrier deals\n\`${PREFIX}bestdeal\` - Same as deals`,
      },
      {
        name: '📡 Coverage & Network',
        value: `\`${PREFIX}coverage <carrier>\` - Check coverage info\n\`${PREFIX}network\` - Network technology overview`,
      },
      {
        name: '📊 Plan Tools',
        value: `\`${PREFIX}compare <carrier1> <carrier2>\` - Compare carriers\n\`${PREFIX}plans <carrier>\` - View carrier plans\n\`${PREFIX}datacalc <gb>\` - Calculate data usage`,
      },
      {
        name: '📋 Information',
        value: `\`${PREFIX}carriers\` - List all major carriers\n\`${PREFIX}help\` - Show this help message`,
      }
    )
    .setFooter({ text: 'Prefix: ' + PREFIX })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

// Best Deals Command
async function handleDealsCommand(message) {
  // Sort deals by rating
  const sortedDeals = [...carrierDeals].sort((a, b) => b.rating - a.rating);
  const topDeals = sortedDeals.slice(0, 3);

  const embed = new EmbedBuilder()
    .setColor('#ffd700')
    .setTitle('🏆 Best Carrier Deals Right Now')
    .setDescription('Top 3 carrier plans based on value and ratings:')
    .setTimestamp();

  topDeals.forEach((deal, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    embed.addFields({
      name: `${medal} ${deal.carrier} - ${deal.plan}`,
      value: `**Price:** ${deal.price}\n**Data:** ${deal.data}\n**Perks:** ${deal.perks}\n**Rating:** ${'⭐'.repeat(Math.floor(deal.rating))} (${deal.rating}/5)`,
    });
  });

  embed.setFooter({ text: 'Deals updated regularly • Use !compare to compare carriers' });

  await message.reply({ embeds: [embed] });
}

// Coverage Command
async function handleCoverageCommand(message, args) {
  if (args.length === 0) {
    return message.reply(`Please specify a carrier! Example: \`${PREFIX}coverage verizon\`\nAvailable: verizon, tmobile, att, mint, visible`);
  }

  const carrier = args[0].toLowerCase();
  const info = coverageInfo[carrier];

  if (!info) {
    return message.reply(`❌ Carrier not found. Available: ${Object.keys(coverageInfo).join(', ')}`);
  }

  const embed = new EmbedBuilder()
    .setColor('#9b59b6')
    .setTitle(`📡 ${carrier.charAt(0).toUpperCase() + carrier.slice(1)} Coverage Info`)
    .addFields(
      { name: '🌐 Network Type', value: info.network },
      { name: '📍 Coverage Area', value: info.coverage },
      { name: '💪 Strength', value: info.strength }
    )
    .setFooter({ text: 'Coverage may vary by location' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

// Compare Carriers Command
async function handleCompareCommand(message, args) {
  if (args.length < 2) {
    return message.reply(`Please specify two carriers to compare!\nExample: \`${PREFIX}compare verizon tmobile\`\nAvailable: verizon, tmobile, att, mint, visible`);
  }

  const carrier1 = args[0].toLowerCase();
  const carrier2 = args[1].toLowerCase();

  const deal1 = carrierDeals.find(d => d.carrier.toLowerCase().includes(carrier1));
  const deal2 = carrierDeals.find(d => d.carrier.toLowerCase().includes(carrier2));

  if (!deal1 || !deal2) {
    return message.reply('❌ One or both carriers not found. Check spelling!');
  }

  const embed = new EmbedBuilder()
    .setColor('#e67e22')
    .setTitle('⚖️ Carrier Comparison')
    .setDescription(`Comparing ${deal1.carrier} vs ${deal2.carrier}`)
    .addFields(
      { name: '\u200B', value: '**📱 ' + deal1.carrier + '**' },
      { name: 'Plan', value: deal1.plan, inline: true },
      { name: 'Price', value: deal1.price, inline: true },
      { name: 'Data', value: deal1.data, inline: true },
      { name: 'Perks', value: deal1.perks },
      { name: 'Rating', value: '⭐'.repeat(Math.floor(deal1.rating)) + ` (${deal1.rating}/5)` },
      { name: '\u200B', value: '**📱 ' + deal2.carrier + '**' },
      { name: 'Plan', value: deal2.plan, inline: true },
      { name: 'Price', value: deal2.price, inline: true },
      { name: 'Data', value: deal2.data, inline: true },
      { name: 'Perks', value: deal2.perks },
      { name: 'Rating', value: '⭐'.repeat(Math.floor(deal2.rating)) + ` (${deal2.rating}/5)` }
    )
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

// Data Calculator Command
async function handleDataCalcCommand(message, args) {
  if (args.length === 0) {
    return message.reply(`Calculate how much you can do with your data!\nExample: \`${PREFIX}datacalc 10\` (for 10GB)`);
  }

  const gb = parseFloat(args[0]);
  if (isNaN(gb) || gb <= 0) {
    return message.reply('❌ Please provide a valid number of GB!');
  }

  // Rough estimates
  const hours = {
    streaming: Math.floor(gb * 3), // ~3 hours per GB at standard quality
    music: Math.floor(gb * 200), // ~200 hours per GB
    browsing: Math.floor(gb * 1000), // ~1000 pages per GB
    emails: Math.floor(gb * 10000), // ~10,000 emails per GB
  };

  const embed = new EmbedBuilder()
    .setColor('#3498db')
    .setTitle(`📊 Data Usage Calculator - ${gb}GB`)
    .setDescription('Approximate usage with your data:')
    .addFields(
      { name: '🎬 Video Streaming', value: `~${hours.streaming} hours (SD quality)`, inline: true },
      { name: '🎵 Music Streaming', value: `~${hours.music} hours`, inline: true },
      { name: '🌐 Web Browsing', value: `~${hours.browsing} pages`, inline: true },
      { name: '📧 Emails', value: `~${hours.emails} emails (text)`, inline: true },
      { name: '📱 Social Media', value: `~${Math.floor(gb * 50)} hours`, inline: true },
      { name: '🎮 Online Gaming', value: `~${Math.floor(gb * 100)} hours`, inline: true }
    )
    .setFooter({ text: 'Estimates may vary based on quality settings and usage patterns' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

// Plans Command
async function handlePlansCommand(message, args) {
  if (args.length === 0) {
    // Show all plans
    const embed = new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle('📋 All Carrier Plans')
      .setDescription('Current plans from major carriers:')
      .setTimestamp();

    carrierDeals.forEach(deal => {
      embed.addFields({
        name: `${deal.carrier} - ${deal.plan}`,
        value: `💵 ${deal.price} | 📶 ${deal.data}\n${deal.perks}`,
      });
    });

    await message.reply({ embeds: [embed] });
  } else {
    // Show specific carrier plans
    const carrier = args[0].toLowerCase();
    const deal = carrierDeals.find(d => d.carrier.toLowerCase().includes(carrier));

    if (!deal) {
      return message.reply('❌ Carrier not found!');
    }

    const embed = new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle(`📋 ${deal.carrier} Plans`)
      .addFields(
        { name: 'Plan Name', value: deal.plan },
        { name: 'Price', value: deal.price },
        { name: 'Data', value: deal.data },
        { name: 'Included Perks', value: deal.perks },
        { name: 'Rating', value: '⭐'.repeat(Math.floor(deal.rating)) + ` (${deal.rating}/5)` }
      )
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
}

// Network Technology Command
async function handleNetworkCommand(message) {
  const embed = new EmbedBuilder()
    .setColor('#e74c3c')
    .setTitle('📡 Mobile Network Technologies')
    .setDescription('Understanding cellular network generations:')
    .addFields(
      {
        name: '5G (Fifth Generation)',
        value: '⚡ Ultra-fast speeds (up to 10 Gbps)\n📡 Low latency (~1ms)\n🎯 Best for: Streaming, gaming, AR/VR',
      },
      {
        name: '4G LTE (Long-Term Evolution)',
        value: '🚀 Fast speeds (up to 100 Mbps)\n📡 Moderate latency (~50ms)\n🎯 Best for: Video calls, HD streaming',
      },
      {
        name: '5G Types',
        value: '**mmWave (Ultra Wideband):** Fastest, short range\n**Mid-band:** Balance of speed & coverage\n**Low-band:** Widest coverage, slower speeds',
      },
      {
        name: 'Network Bands',
        value: '📻 Different carriers use different frequency bands\n🗼 Lower frequencies = better building penetration\n⚡ Higher frequencies = faster speeds',
      }
    )
    .setFooter({ text: 'Use !coverage <carrier> to check specific carrier networks' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

// Carriers List Command
async function handleCarriersCommand(message) {
  const embed = new EmbedBuilder()
    .setColor('#1abc9c')
    .setTitle('📱 Major US Carriers')
    .setDescription('Overview of cellular carriers:')
    .addFields(
      {
        name: '🏢 Major Carriers (MNO)',
        value: '**Verizon** - Largest network, best rural coverage\n**T-Mobile** - Largest 5G network, competitive pricing\n**AT&T** - Nationwide coverage, business focus',
      },
      {
        name: '💰 Budget Carriers (MVNO)',
        value: '**Mint Mobile** - T-Mobile network, prepaid plans\n**Visible** - Verizon network, unlimited plans\n**Cricket** - AT&T network, affordable\n**Metro by T-Mobile** - T-Mobile network',
      },
      {
        name: '📊 What\'s an MVNO?',
        value: 'Mobile Virtual Network Operators rent network access from major carriers, offering lower prices without owning infrastructure.',
      }
    )
    .setFooter({ text: 'Use !deals to see the best current offers' })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}

// Error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Login
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN not found in environment variables!');
  console.error('Please create a .env file with your Discord token.');
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error('⚠️  OPENAI_API_KEY not found in environment variables!');
  console.error('OpenAI features will not work. Please add your API key to .env file.');
}

client.login(process.env.DISCORD_TOKEN);
