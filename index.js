const mineflayer = require('mineflayer');
const express = require('express');
const vec3 = require('vec3');
const app = express();
const port = process.env.PORT || 3000;

// 🌐 Keep Render alive
app.get("/", (req, res) => res.send("AFK Bot is alive!"));
app.listen(port, () => console.log(`🌍 Web server running on port ${port}`));

// 🤖 Create the bot
const bot = mineflayer.createBot({
  host: 'SyncGangSMP.aternos.me',
  port: 49432,
  username: 'PreXAFKBot',
  auth: 'offline',
  version: '1.21.6'
});

bot.on('spawn', () => {
  console.log('✅ Bot joined the server.');

  // 🔐 AuthMe login
  setTimeout(() => {
    bot.chat('/login IMNOOB');
    console.log('🔐 Sent login command');
  }, 3000);

  // 🎁 Give blocks
  setTimeout(() => {
    bot.chat('/give PreXAFKBot stone 64');
    console.log('🎁 Sent /give stone command');
  }, 6000);

  // Start everything
  setTimeout(() => {
    bot.setQuickBarSlot(0);
    console.log('🎯 Selected slot 0');
    startAntiIdleLoop();
    startAfkChat();
  }, 9000);
});

// 🔁 Place, break, jump
function startAntiIdleLoop() {
  setInterval(() => {
    try {
      const yaw = bot.entity.yaw;
      const dirX = Math.round(Math.cos(yaw));
      const dirZ = Math.round(Math.sin(yaw));
      const frontPos = bot.entity.position.offset(dirX, 0, dirZ);
      const referenceBlock = bot.blockAt(frontPos.offset(0, -1, 0));

      // Place block
      if (referenceBlock) {
        bot.placeBlock(referenceBlock, vec3(dirX, 1, dirZ)).catch(e => {
          console.log('⚠️ Place error:', e.message);
        });
        console.log('🧱 Placed block in front');
      }

      // Break after delay
      setTimeout(() => {
        const placed = bot.blockAt(frontPos);
        if (placed?.name !== 'air' && placed?.name !== 'bedrock') {
          bot.dig(placed).catch(e => {
            console.log('⚠️ Dig error:', e.message);
          });
          console.log('⛏️ Broke block in front');
        }
      }, 1500);

      // Jump
      bot.setControlState('jump', true);
      setTimeout(() => {
        bot.setControlState('jump', false);
        console.log('⬆️ Jumped');
      }, 500);

    } catch (err) {
      console.log('⚠️ Anti-idle loop error:', err.message);
    }
  }, 8000);
}

// 💬 AFK chat every 30 seconds
function startAfkChat() {
  const messages = [
    "Still AFK 👻",
    "PreXAFKBot chilling here 😎",
    "Grinding air like a pro 💨",
    "Just placed and broke a block 🧱⛏️",
    "Not a ghost, just very patient 👀"
  ];

  setInterval(() => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    bot.chat(msg);
    console.log(`💬 Sent AFK message: ${msg}`);
  }, 30000);
}

bot.on('end', () => console.log('❌ Bot disconnected'));
bot.on('error', err => console.log('⚠️ Error:', err.message));
