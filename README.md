# 📱 Discord Bot - Gen Z Carrier Assistant

A Discord bot powered by OpenRouter.ai that helps users find the best carrier deals and provides cellular/mobile carrier information. Features a fun Gen Z personality and conversational memory!

## ✨ Features

### 👤 User-Installable
- **Install to your Discord account** - Use the bot anywhere!
- Works in DMs, servers, and group chats
- No need to add to every server individually

### 🤖 AI-Powered Chat
- Talk to the bot using OpenRouter.ai - it has conversational memory!
- Fun Gen Z personality - talks like you're texting your bestie
- Mention the bot or use `!ask` command
- Bot remembers your previous messages for natural conversations

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
- OpenRouter API Key (supports free models!)

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd Discord-bot-open-ai
npm install
```

### Step 2: Get Your Discord Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Installation" tab
4. **Enable User Install:**
   - Under "Installation Contexts", check **"User Install"**
   - Under "Install Link", select "Discord Provided Link"
   - Under "Default Install Settings", add these scopes:
     - `bot`
     - `applications.commands`
   - Add these permissions:
     - Send Messages
     - Send Messages in Threads
     - Embed Links
     - Read Message History
     - Use External Emojis
5. Go to the "Bot" tab
6. Click "Add Bot" (if not already created)
7. Under "Token", click "Reset Token" and copy it
8. Enable these Privileged Gateway Intents:
   - **Message Content Intent** (Required)
   - Server Members Intent (optional)

### Step 3: Get Your OpenRouter API Key

1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Go to [Keys](https://openrouter.ai/keys)
4. Click "Create Key"
5. Copy the key
6. **Optional:** Add credits or use free models (like llama-3.1-8b-instruct:free)

### Step 4: Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your tokens:

```env
DISCORD_TOKEN=your_discord_bot_token_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
BOT_PREFIX=!
```

**Available Models:**
- `meta-llama/llama-3.1-8b-instruct:free` (Free!)
- `meta-llama/llama-3.1-70b-instruct` (Paid but better)
- `anthropic/claude-3.5-sonnet` (Premium)
- See more at [OpenRouter Models](https://openrouter.ai/models)

### Step 5: Install the Bot

**Option A: Install to Your User Account (Use Everywhere)**
1. In Discord Developer Portal, go to "Installation" tab
2. Copy the "Install Link" at the top
3. Open the link in your browser
4. Click "Add to User"
5. Authorize the bot
6. Now you can use it in DMs, any server, or group chats!

**Option B: Install to a Specific Server Only**
1. In Discord Developer Portal, go to "OAuth2" > "URL Generator"
2. Select scopes:
   - `bot`
   - `applications.commands`
3. Select bot permissions:
   - Send Messages
   - Send Messages in Threads
   - Embed Links
   - Read Message History
   - Use External Emojis
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

> **Recommended:** Use Option A (User Install) to use the bot everywhere!

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

### OpenRouter AI errors
- Verify your API key is correct in `.env`
- Check you have credits in your OpenRouter account (or use free models)
- Ensure API key has proper permissions
- Try a different model if one isn't working

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

Built with ❤️ using Discord.js and OpenRouter.ai | Gen Z vibes only fr fr
