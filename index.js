const mineflayer = require('mineflayer');
const express = require('express');
const vec3 = require('vec3');
const app = express();
const port = process.env.PORT || 3000;

// 🌐 Keep Render awake
app.get("/", (req, res) => res.send("AFK Bot is alive!"));
app.listen(port, () => console.log(`Web server running on port ${port}`));

// 🤖 Create bot
const bot = mineflayer.createBot({
  host: 'SyncGangSMP.aternos.me',
  port: 49432,
  username: 'PreXAFKBot',
  auth: 'offline',
  version: '1.21.6'
});

bot.on('spawn', () => {
  console.log('✅ Bot joined the server.');

  // 🔐 Login to AuthMe
  setTimeout(() => {
    bot.chat('/login IMNOOB');
    console.log('🔐 Sent login command');
  }, 3000);

  // 🎁 Give 64 stone blocks
  setTimeout(() => {
    bot.chat('/give PreXAFKBot stone 64');
    console.log('🎁 Sent /give stone command');
  }, 6000);

  // 🧱 Start AFK loop
  setTimeout(() => {
    startAntiIdleLoop();
  }, 9000);
});

function startAntiIdleLoop() {
  bot.setQuickBarSlot(0); // select hotbar slot 1 (slot 0)

  setInterval(async () => {
    try {
      const basePos = bot.entity.position.offset(0, -1, 0); // block below
      const referenceBlock = bot.blockAt(basePos);

      // Place block above ground
      if (referenceBlock && bot.canPlaceBlock(referenceBlock)) {
        await bot.placeBlock(referenceBlock, vec3(0, 1, 0));
        console.log('🧱 Placed block');
      }

      await bot.waitForTicks(5);

      const placedBlock = bot.blockAt(basePos.offset(0, 1, 0));
      if (placedBlock && placedBlock.name !== 'bedrock' && placedBlock.breakable) {
        await bot.dig(placedBlock);
        console.log('⛏️ Broke block:', placedBlock.name);
      } else {
        console.log('❌ Block unbreakable or not found');
      }

      // Jump for fun 😆
      bot.setControlState('jump', true);
      await bot.waitForTicks(5);
      bot.setControlState('jump', false);
      console.log('⬆️ Jumped');

    } catch (err) {
      console.log('⚠️ Error in anti-idle loop:', err.message);
    }
  }, 10000); // repeat every 10 seconds
}

bot.on('end', () => console.log('❌ Bot disconnected'));
bot.on('error', err => console.log('⚠️ Error:', err));
