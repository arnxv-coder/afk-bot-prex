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

  // 🎁 Give blocks (if allowed)
  setTimeout(() => {
    bot.chat('/give PreXAFKBot stone 64');
    console.log('🎁 Sent /give stone command');
  }, 6000);

  // ⛏️ Start anti-idle action
  setTimeout(() => {
    bot.setQuickBarSlot(0); // Select 1st hotbar slot
    console.log('🎯 Selected slot 0');
    startAntiIdleLoop();
  }, 9000);
});

function startAntiIdleLoop() {
  setInterval(async () => {
    try {
      const basePos = bot.entity.position.offset(0, -1, 0); // block below
      const referenceBlock = bot.blockAt(basePos);

      // 🧱 Try placing block above
      if (referenceBlock) {
        await bot.placeBlock(referenceBlock, vec3(0, 1, 0));
        console.log('🧱 Placed block');
      }

      await bot.waitForTicks(5);

      // ⛏️ Dig the block just placed
      const above = bot.blockAt(basePos.offset(0, 1, 0));
      if (above && above.name !== 'bedrock') {
        await bot.dig(above);
        console.log('⛏️ Broke block:', above.name);
      } else {
        console.log('❌ Nothing to break or unbreakable block');
      }

      // ⬆️ Jump to avoid idle kicks
      bot.setControlState('jump', true);
      await bot.waitForTicks(5);
      bot.setControlState('jump', false);
      console.log('⬆️ Jumped');
    } catch (err) {
      console.log('⚠️ Error in anti-idle loop:', err.message);
    }
  }, 10000); // every 10 seconds
}

bot.on('end', () => console.log('❌ Bot disconnected'));
bot.on('error', err => console.log('⚠️ Error:', err.message));
