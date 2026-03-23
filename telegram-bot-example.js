// Telegram Bot Setup Instructions
// ===============================
// 
// 1. Create a bot with @BotFather on Telegram:
//    - Open Telegram and search for @BotFather
//    - Send /newbot and follow the instructions
//    - Save the bot token you receive
//
// 2. Set up Web App:
//    - Send /mybots to BotFather
//    - Select your bot
//    - Go to Bot Settings > Menu Button
//    - Set the menu button to open your Web App URL
//
// 3. Deploy your app:
//    - Build the app: npm run build
//    - Deploy the 'dist' folder to any static hosting (Vercel, Netlify, GitHub Pages)
//    - Use the deployed URL as your Web App URL
//
// 4. Configure Web App in BotFather:
//    - Send /newapp to BotFather
//    - Select your bot
//    - Enter the Web App URL
//    - Enter a title and description
//
// Example bot code (Node.js with node-telegram-bot-api):
// =====================================================

const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot token
const TOKEN = 'YOUR_BOT_TOKEN_HERE';
const WEB_APP_URL = 'https://your-app-url.vercel.app';

const bot = new TelegramBot(TOKEN, { polling: true });

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name;
  
  bot.sendMessage(chatId, `Hello, ${firstName}! 👋\n\nOpen the menu to launch Weather App ☀️`, {
    reply_markup: {
      keyboard: [[{
        text: 'Open Weather App ⛅',
        web_app: { url: WEB_APP_URL }
      }]],
      resize_keyboard: true
    }
  });
});

// Handle any message - show Web App button
bot.on('message', (msg) => {
  if (msg.web_app_data) {
    // Handle data from Web App
    console.log('Data from Web App:', msg.web_app_data.data);
  }
});

console.log('Bot started...');
