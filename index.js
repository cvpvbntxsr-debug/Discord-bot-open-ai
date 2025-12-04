import { Client, GatewayIntentBits } from 'discord.js';
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

// Initialize OpenRouter AI (uses OpenAI SDK)
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const PREFIX = process.env.BOT_PREFIX || '!';

// Conversation memory - stores recent messages per channel/user
const conversationHistory = new Map();

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
  console.log(`👤 User-installable: Ready for DMs and server use!`);
  console.log(`🤖 Powered by OpenRouter.ai - Conversational mode enabled!`);
  client.user.setActivity('!help for commands', { type: 'WATCHING' });
});

client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Handle AI questions (messages starting with the bot mention or prefix + "ask")
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

// AI Chat Command with Memory
async function handleAskCommand(message) {
  const question = message.content
    .replace(`<@${client.user.id}>`, '')
    .replace(`${PREFIX}ask`, '')
    .trim();

  if (!question) {
    return message.reply('yo what did u wanna ask me lol just say !ask and then ur question');
  }

  const thinkingMsg = await message.reply('typing...');

  try {
    // Get conversation history for this user
    const userId = message.author.id;
    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }

    const history = conversationHistory.get(userId);

    // Add user message to history
    history.push({
      role: 'user',
      content: question,
    });

    // Keep only last 10 messages to avoid token limits
    if (history.length > 10) {
      history.shift();
      history.shift(); // Remove both user and assistant message
    }

    const completion = await openrouter.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
      messages: [
        {
          role: 'system',
          content: 'You are a super chill Gen Z bot in a Discord server. Talk like you\'re texting your bestie - use slang, abbreviations, lowercase, be funny and relatable. Drop "fr fr", "ngl", "lowkey", "highkey", "no cap", "bet", "valid", etc. Be supportive but also roast people in a friendly way. Keep it real and conversational. If someone asks about carriers or phones, still be helpful but keep that Gen Z energy. Don\'t use emojis unless it feels natural. Be authentic and fun!',
        },
        ...history,
      ],
      max_tokens: 500,
      temperature: 0.9,
    });

    const answer = completion.choices[0].message.content;

    // Add assistant response to history
    history.push({
      role: 'assistant',
      content: answer,
    });

    await thinkingMsg.edit(answer);
  } catch (error) {
    console.error('OpenRouter AI Error:', error);
    await thinkingMsg.edit('bruh my brain crashed rn try again in a sec lmao');
  }
}

// Help Command
async function handleHelpCommand(message) {
  const helpText = `**yo here's what i can do:**

🤖 **chat with me:**
${PREFIX}ask <question> - literally ask me anything and we can just vibe
@${client.user.username} <message> - or just @ me and we can chat

💰 **carrier deals:**
${PREFIX}deals - best carrier deals rn no cap
${PREFIX}bestdeal - same thing lol

📡 **coverage stuff:**
${PREFIX}coverage <carrier> - check who's got bars where
${PREFIX}network - learn about 5g and all that tech

📊 **compare plans:**
${PREFIX}compare <carrier1> <carrier2> - see which one hits different
${PREFIX}plans <carrier> - peep a carrier's plans
${PREFIX}datacalc <gb> - see what u can do with ur data

📋 **general info:**
${PREFIX}carriers - all the carriers u should know about
${PREFIX}help - shows this again lol

btw i work everywhere - dms, servers, wherever u need me fr`;

  await message.reply(helpText);
}

// Best Deals Command
async function handleDealsCommand(message) {
  // Sort deals by rating
  const sortedDeals = [...carrierDeals].sort((a, b) => b.rating - a.rating);
  const topDeals = sortedDeals.slice(0, 3);

  let dealsText = '**ok so here are the top carrier deals rn:**\n\n';

  topDeals.forEach((deal, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    dealsText += `${medal} **${deal.carrier} - ${deal.plan}**\n`;
    dealsText += `price: ${deal.price}\n`;
    dealsText += `data: ${deal.data}\n`;
    dealsText += `perks: ${deal.perks}\n`;
    dealsText += `rating: ${'⭐'.repeat(Math.floor(deal.rating))} (${deal.rating}/5)\n\n`;
  });

  dealsText += 'use !compare to see how they stack up against each other fr';

  await message.reply(dealsText);
}

// Coverage Command
async function handleCoverageCommand(message, args) {
  if (args.length === 0) {
    return message.reply(`yo which carrier? try like ${PREFIX}coverage verizon\navailable: verizon, tmobile, att, mint, visible`);
  }

  const carrier = args[0].toLowerCase();
  const info = coverageInfo[carrier];

  if (!info) {
    return message.reply(`bruh that carrier aint in my list. try: ${Object.keys(coverageInfo).join(', ')}`);
  }

  const carrierName = carrier.charAt(0).toUpperCase() + carrier.slice(1);
  const coverageText = `**📡 ${carrierName} coverage info:**

network: ${info.network}
coverage: ${info.coverage}
strength: ${info.strength}

*coverage varies by location obv`;

  await message.reply(coverageText);
}

// Compare Carriers Command
async function handleCompareCommand(message, args) {
  if (args.length < 2) {
    return message.reply(`i need two carriers to compare bro\nexample: ${PREFIX}compare verizon tmobile\navailable: verizon, tmobile, att, mint, visible`);
  }

  const carrier1 = args[0].toLowerCase();
  const carrier2 = args[1].toLowerCase();

  const deal1 = carrierDeals.find(d => d.carrier.toLowerCase().includes(carrier1));
  const deal2 = carrierDeals.find(d => d.carrier.toLowerCase().includes(carrier2));

  if (!deal1 || !deal2) {
    return message.reply('cant find one or both of those carriers, check ur spelling lol');
  }

  const compareText = `**⚖️ ${deal1.carrier} vs ${deal2.carrier}**

**📱 ${deal1.carrier}:**
plan: ${deal1.plan}
price: ${deal1.price}
data: ${deal1.data}
perks: ${deal1.perks}
rating: ${'⭐'.repeat(Math.floor(deal1.rating))} (${deal1.rating}/5)

**📱 ${deal2.carrier}:**
plan: ${deal2.plan}
price: ${deal2.price}
data: ${deal2.data}
perks: ${deal2.perks}
rating: ${'⭐'.repeat(Math.floor(deal2.rating))} (${deal2.rating}/5)`;

  await message.reply(compareText);
}

// Data Calculator Command
async function handleDataCalcCommand(message, args) {
  if (args.length === 0) {
    return message.reply(`tell me how many gb and ill show u what u can do with it\nexample: ${PREFIX}datacalc 10`);
  }

  const gb = parseFloat(args[0]);
  if (isNaN(gb) || gb <= 0) {
    return message.reply('bruh gimme a real number lol');
  }

  // Rough estimates
  const hours = {
    streaming: Math.floor(gb * 3), // ~3 hours per GB at standard quality
    music: Math.floor(gb * 200), // ~200 hours per GB
    browsing: Math.floor(gb * 1000), // ~1000 pages per GB
    emails: Math.floor(gb * 10000), // ~10,000 emails per GB
  };

  const calcText = `**📊 with ${gb}GB u can do:**

🎬 video streaming: ~${hours.streaming} hours (sd quality)
🎵 music streaming: ~${hours.music} hours
🌐 web browsing: ~${hours.browsing} pages
📧 emails: ~${hours.emails} emails (text only)
📱 social media: ~${Math.floor(gb * 50)} hours
🎮 online gaming: ~${Math.floor(gb * 100)} hours

*these are estimates obv, depends on quality and stuff`;

  await message.reply(calcText);
}

// Plans Command
async function handlePlansCommand(message, args) {
  if (args.length === 0) {
    // Show all plans
    let plansText = '**📋 all the carrier plans:**\n\n';

    carrierDeals.forEach(deal => {
      plansText += `**${deal.carrier} - ${deal.plan}**\n`;
      plansText += `💵 ${deal.price} | 📶 ${deal.data}\n`;
      plansText += `${deal.perks}\n\n`;
    });

    await message.reply(plansText);
  } else {
    // Show specific carrier plans
    const carrier = args[0].toLowerCase();
    const deal = carrierDeals.find(d => d.carrier.toLowerCase().includes(carrier));

    if (!deal) {
      return message.reply('cant find that carrier bro');
    }

    const planText = `**📋 ${deal.carrier} plan:**

plan name: ${deal.plan}
price: ${deal.price}
data: ${deal.data}
perks: ${deal.perks}
rating: ${'⭐'.repeat(Math.floor(deal.rating))} (${deal.rating}/5)`;

    await message.reply(planText);
  }
}

// Network Technology Command
async function handleNetworkCommand(message) {
  const networkText = `**📡 mobile network tech explained:**

**5g (fifth gen):**
⚡ ultra fast speeds (up to 10 gbps)
📡 super low latency (~1ms)
🎯 best for: streaming, gaming, ar/vr

**4g lte:**
🚀 fast speeds (up to 100 mbps)
📡 decent latency (~50ms)
🎯 best for: video calls, hd streaming

**5g types:**
mmwave (ultra wideband): fastest but short range
mid-band: balance of speed & coverage
low-band: widest coverage but slower

**network bands:**
📻 different carriers use different frequencies
🗼 lower freq = better building penetration
⚡ higher freq = faster speeds

use !coverage <carrier> to check specific networks`;

  await message.reply(networkText);
}

// Carriers List Command
async function handleCarriersCommand(message) {
  const carriersText = `**📱 major us carriers:**

**🏢 big ones (mno):**
**verizon** - biggest network, best rural coverage
**t-mobile** - largest 5g network, competitive pricing
**at&t** - nationwide coverage, business focused

**💰 budget options (mvno):**
**mint mobile** - uses t-mobile network, prepaid plans
**visible** - uses verizon network, unlimited plans
**cricket** - uses at&t network, affordable
**metro by t-mobile** - uses t-mobile network

**what's an mvno?**
mobile virtual network operators rent network access from the big carriers so they can offer lower prices without owning their own infrastructure

use !deals to see the best current offers fr`;

  await message.reply(carriersText);
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

if (!process.env.OPENROUTER_API_KEY) {
  console.error('⚠️  OPENROUTER_API_KEY not found in environment variables!');
  console.error('OpenRouter AI features will not work. Please add your API key to .env file.');
}

client.login(process.env.DISCORD_TOKEN);
