require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const express = require("express");

// ====== KIỂM TRA ENV ======
if (!process.env.TOKEN) {
  console.error("❌ Thiếu TOKEN");
  process.exit(1);
}

if (!process.env.MONGO_URL) {
  console.error("❌ Thiếu MONGO_URL");
  process.exit(1);
}

// ====== KẾT NỐI MONGODB ======
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ====== MODEL ======
const userSchema = new mongoose.Schema({
  chatId: String,
  goal: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  history: [{ date: String, amount: Number }]
});

const User = mongoose.model("User", userSchema);

// ====== TELEGRAM BOT (Polling ổn định) ======
const bot = new TelegramBot(process.env.TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

bot.on("polling_error", (err) => {
  console.error("❌ Polling Error:", err.message);
});

console.log("🤖 Bot is running...");

// ====== PROGRESS BAR ======
function progressBar(percent) {
  const total = 20;
  const filled = Math.round((percent / 100) * total);
  return "🟩".repeat(filled) + "⬜".repeat(total - filled);
}

// ====== MENU ======
async function mainMenu(chatId) {
  let user = await User.findOne({ chatId });

  if (!user) {
    user = await User.create({ chatId });
  }

  const percent = user.goal > 0
    ? ((user.total / user.goal) * 100).toFixed(1)
    : 0;

  bot.sendMessage(chatId,
`🏦 ỨNG DỤNG TIẾT KIỆM

🎯 ${user.goal.toLocaleString()} VND
💰 ${user.total.toLocaleString()} VND
📊 ${percent}%

${progressBar(percent)}`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "➕ Nạp tiền", callback_data: "add" }],
          [{ text: "📑 Sao kê", callback_data: "history" }],
          [{ text: "⚙ Đặt mục tiêu", callback_data: "setgoal" }],
          [{ text: "❌ Xoá mục tiêu", callback_data: "deletegoal" }]
        ]
      }
    }
  );
}

// ====== START ======
bot.onText(/\/start/, (msg) => {
  mainMenu(msg.chat.id.toString());
});

// ====== CALLBACK ======
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id.toString();
  let user = await User.findOne({ chatId });
  if (!user) return;

  if (query.data === "add") {
    bot.sendMessage(chatId, "Nhập số tiền:");
    bot.once("message", async (msg) => {
      const amount = parseInt(msg.text);
      if (isNaN(amount)) return bot.sendMessage(chatId, "❌ Số không hợp lệ");

      const today = new Date().toLocaleDateString("vi-VN");
      user.total += amount;
      user.history.push({ date: today, amount });
      await user.save();
      mainMenu(chatId);
    });
  }

  if (query.data === "history") {
    if (user.history.length === 0)
      return bot.sendMessage(chatId, "Chưa có giao dịch.");

    let text = "📑 SAO KÊ\n\n";
    user.history.forEach((h, i) => {
      text += `${i + 1}. ${h.date} - ${h.amount.toLocaleString()} VND\n`;
    });

    bot.sendMessage(chatId, text);
  }

  if (query.data === "setgoal") {
    bot.sendMessage(chatId, "Nhập mục tiêu mới:");
    bot.once("message", async (msg) => {
      const goal = parseInt(msg.text);
      if (isNaN(goal)) return bot.sendMessage(chatId, "❌ Số không hợp lệ");

      user.goal = goal;
      await user.save();
      mainMenu(chatId);
    });
  }

  if (query.data === "deletegoal") {
    user.goal = 0;
    user.total = 0;
    user.history = [];
    await user.save();
    mainMenu(chatId);
  }

  bot.answerCallbackQuery(query.id);
});

// ====== EXPRESS SERVER (BẮT BUỘC CHO RENDER) ======
const app = express();

app.get("/", (req, res) => {
  res.send("Bot đang chạy ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🌐 Server is running on port " + PORT);
});
