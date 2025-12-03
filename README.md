# 📱 Discord Bot - OpenAI Carrier Assistant

A Discord bot powered by OpenAI that helps users find the best carrier deals and provides cellular/mobile carrier information.

## ✨ Features

### 🤖 AI-Powered Q&A
- Ask the bot any question using OpenAI's GPT-3.5
- Mention the bot or use `!ask` command
- Get intelligent, context-aware responses

### 💰 Carrier Deal Finder
- `!deals` - Find the best carrier deals currently available
- Compares major carriers: Verizon, T-Mobile, AT&T, Mint Mobile, Visible
- Shows ratings, pricing, data allowances, and perks

### 📡 Cellular Commands
- `!coverage <carrier>` - Check coverage information for specific carriers
- `!compare <carrier1> <carrier2>` - Side-by-side carrier comparison
- `!datacalc <gb>` - Calculate what you can do with X GB of data
- `!plans [carrier]` - View all plans or specific carrier plans
- `!network` - Learn about mobile network technologies (5G, 4G LTE, etc.)
- `!carriers` - List all major carriers and MVNOs

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Discord Bot Token
- OpenAI API Key

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd Discord-bot-open-ai
npm install
```

### Step 2: Get Your Discord Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" tab
4. Click "Add Bot"
5. Under "Token", click "Reset Token" and copy it
6. Enable these Privileged Gateway Intents:
   - Message Content Intent
   - Server Members Intent (optional)

### Step 3: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the key (you won't be able to see it again!)

### Step 4: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your tokens:

```env
DISCORD_TOKEN=your_discord_bot_token_here
OPENAI_API_KEY=your_openai_api_key_here
BOT_PREFIX=!
```

### Step 5: Invite Bot to Your Server

1. In Discord Developer Portal, go to "OAuth2" > "URL Generator"
2. Select scopes:
   - `bot`
   - `applications.commands`
3. Select bot permissions:
   - Send Messages
   - Send Messages in Threads
   - Embed Links
   - Read Message History
   - Use Slash Commands
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

### Step 6: Run the Bot

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## 📖 Command List

### AI Commands
| Command | Description | Example |
|---------|-------------|---------|
| `!ask <question>` | Ask the AI anything | `!ask What is 5G?` |
| `@BotName <question>` | Mention bot with question | `@CarrierBot Explain unlimited data` |

### Carrier Commands
| Command | Description | Example |
|---------|-------------|---------|
| `!deals` | Show best carrier deals | `!deals` |
| `!bestdeal` | Alias for deals | `!bestdeal` |
| `!coverage <carrier>` | Check carrier coverage | `!coverage verizon` |
| `!compare <c1> <c2>` | Compare two carriers | `!compare tmobile att` |
| `!plans [carrier]` | View plans | `!plans` or `!plans verizon` |
| `!carriers` | List all carriers | `!carriers` |

### Utility Commands
| Command | Description | Example |
|---------|-------------|---------|
| `!datacalc <gb>` | Calculate data usage | `!datacalc 10` |
| `!network` | Network technology info | `!network` |
| `!help` | Show all commands | `!help` |

## 🎮 Usage Examples

### Ask AI Questions
```
!ask What's the difference between 5G and 4G?
@CarrierBot Which carrier has the best coverage in rural areas?
```

### Find Best Deals
```
!deals
!bestdeal
```

### Check Coverage
```
!coverage verizon
!coverage tmobile
```

### Compare Carriers
```
!compare verizon tmobile
!compare mint visible
```

### Calculate Data Usage
```
!datacalc 5
!datacalc 20
```

## 🛠️ Configuration

### Change Command Prefix
Edit `.env` file:
```env
BOT_PREFIX=?
```
Now commands will use `?` instead of `!` (e.g., `?help`, `?deals`)

### Customize Carrier Data
Edit `index.js` and modify the `carrierDeals` array to add/update carrier plans and pricing.

## 📦 Project Structure

```
Discord-bot-open-ai/
├── index.js          # Main bot file
├── package.json      # Dependencies
├── .env             # Environment variables (create from .env.example)
├── .env.example     # Example environment file
├── .gitignore       # Git ignore rules
└── README.md        # This file
```

## 🔧 Troubleshooting

### Bot doesn't respond
- Check that bot is online (green status in Discord)
- Verify Message Content Intent is enabled in Discord Developer Portal
- Check console for errors

### OpenAI errors
- Verify your API key is correct in `.env`
- Check you have credits in your OpenAI account
- Ensure API key has proper permissions

### Permission errors
- Make sure bot has "Send Messages" and "Embed Links" permissions
- Check channel permissions

## 🌟 Features Explained

### Carrier Deals Command
Shows the top 3 rated carrier plans with:
- Monthly pricing
- Data allowances
- Included perks (streaming services, hotspot data)
- User ratings

### Coverage Checker
Provides detailed coverage information:
- Network type (5G, 4G LTE)
- Coverage percentage
- Network strengths

### Data Calculator
Estimates what you can do with your data plan:
- Video streaming hours
- Music streaming hours
- Web browsing
- Email usage
- Social media time
- Gaming hours

### Carrier Comparison
Side-by-side comparison showing:
- Plan names and pricing
- Data allowances
- Included perks
- Ratings

## 📝 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 💡 Future Enhancements

Potential features to add:
- Real-time carrier deal fetching from APIs
- Location-based coverage maps
- International carrier support
- Plan recommendation based on usage
- Price alerts for deals
- User reviews and ratings system

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Discord bot setup in Developer Portal
3. Verify all environment variables are set correctly
4. Check console output for error messages

---

Built with ❤️ using Discord.js and OpenAI
