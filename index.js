require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

mongoose.connect(process.env.MONGO_URI);

// ===== SCHEMA =====
const userSchema = new mongoose.Schema({
  chatId: String,
  username: String,
  totalDeposit: { type: Number, default: 0 },
  totalWithdraw: { type: Number, default: 0 },
  history: [{
    type: String,
    amount: Number,
    date: { type: Date, default: Date.now }
  }]
});

const User = mongoose.model("User", userSchema);

async function getUser(msg) {
  let user = await User.findOne({ chatId: msg.chat.id });
  if (!user) {
    user = await User.create({
      chatId: msg.chat.id,
      username: msg.from.first_name || "Khách"
    });
  }
  return user;
}

function formatMoney(num) {
  return num.toLocaleString("vi-VN") + " VNĐ";
}

async function mainMenu(msg) {
  const user = await getUser(msg);
  const balance = user.totalDeposit - user.totalWithdraw;

  const text = `
🏦 OKEMA BANKING BOT

👤 Khách hàng: ${user.username}
🆔 ID: ${user.chatId}

💰 SỐ DƯ HIỆN TẠI: ${formatMoney(balance)}
────────────────────
Chọn chức năng bên dưới:
`;

  bot.sendMessage(msg.chat.id, text, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "💰 Nạp tiền", callback_data: "deposit" }],
        [{ text: "📜 Lịch sử", callback_data: "history" }],
        [{ text: "📊 Thống kê", callback_data: "summary" }],
        [{ text: "✏️ Chỉnh sửa", callback_data: "edit" }],
        [{ text: "🗑 Reset", callback_data: "reset" }]
      ]
    }
  });
}

// ===== START =====
bot.onText(/\/start/, async (msg) => {
  await mainMenu(msg);
});

// ===== CALLBACK =====
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const user = await User.findOne({ chatId });

  // NẠP TIỀN
  if (query.data === "deposit") {
    bot.sendMessage(chatId, "Nhập số tiền muốn nạp:");
    bot.once("message", async (msg) => {
      const amount = Number(msg.text);
      if (!isNaN(amount) && amount > 0) {
        user.totalDeposit += amount;
        user.history.push({ type: "Nạp", amount });
        await user.save();
        bot.sendMessage(chatId, "✅ Nạp thành công!");
        mainMenu(msg);
      }
    });
  }

  // LỊCH SỬ
  if (query.data === "history") {
    if (user.history.length === 0) {
      bot.sendMessage(chatId, "Chưa có giao dịch.");
      return;
    }

    let text = "📜 LỊCH SỬ:\n\n";
    user.history.forEach((h, i) => {
      text += `${i+1}. ${h.type} ${formatMoney(h.amount)} - ${new Date(h.date).toLocaleString("vi-VN")}\n`;
    });

    bot.sendMessage(chatId, text);
  }

  // THỐNG KÊ
  if (query.data === "summary") {
    const balance = user.totalDeposit - user.totalWithdraw;

    const text = `
📊 THỐNG KÊ

Tổng đã nạp: ${formatMoney(user.totalDeposit)}
Tổng đã rút: ${formatMoney(user.totalWithdraw)}
Số dư hiện tại: ${formatMoney(balance)}
Số giao dịch: ${user.history.length}
`;

    bot.sendMessage(chatId, text);
  }

  // RESET
  if (query.data === "reset") {
    user.totalDeposit = 0;
    user.totalWithdraw = 0;
    user.history = [];
    await user.save();
    bot.sendMessage(chatId, "🗑 Đã reset toàn bộ dữ liệu!");
  }

  bot.answerCallbackQuery(query.id);
});
