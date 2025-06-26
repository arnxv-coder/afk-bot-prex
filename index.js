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

  // ⛏️ Start anti-idle
  setTimeout(() => {
    bot.setQuickBarSlot(0);
    console.log('🎯 Selected slot 0');
    startAntiIdleLoop();
  }, 9000);
});

function startAntiIdleLoop() {
  setInterval(async () => {
    try {
      const forward = bot.entity.yaw;
      const direction = bot.entity.position.offset(
        Math.round(Math.cos(forward)),
        0,
        Math.round(Math.sin(forward))
      );
      const referenceBlock = bot.blockAt(direction.offset(0, -1, 0)); // block to place against

      // 🧱 Place block in front
      if (referenceBlock) {
        await bot.placeBlock(referenceBlock, vec3(0, 1, 0)); // place block above that surface
        console.log('🧱 Placed block in front');
      }

      await bot.waitForTicks(5);

      const placedBlock = bot.blockAt(direction);
      if (placedBlock && placedBlock.name !== 'bedrock') {
        await bot.dig(placedBlock);
        console.log('⛏️ Broke block:', placedBlock.name);
      } else {
        console.log('❌ Nothing to break in front');
      }

      // ⬆️ Jump
      bot.setControlState('jump', true);
      await bot.waitForTicks(5);
      bot.setControlState('jump', false);
      console.log('⬆️ Jumped');
    } catch (err) {
      console.log('⚠️ Error in anti-idle loop:', err.message);
    }
  }, 10000);
}

bot.on('end', () => console.log('❌ Bot disconnected'));
bot.on('error', err => console.log('⚠️ Error:', err.message));
