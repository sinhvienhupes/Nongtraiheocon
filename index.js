require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const express = require("express");

// ===== KIỂM TRA ENV =====
if (!process.env.TOKEN) {
  console.log("❌ Thiếu TOKEN");
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.log("❌ Thiếu MONGO_URI");
  process.exit(1);
}

// ===== KẾT NỐI MONGODB =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Đã kết nối MongoDB"))
  .catch(err => {
    console.log("❌ Lỗi MongoDB:", err.message);
    process.exit(1);
  });

// ===== TẠO BOT =====
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
console.log("🤖 Bot đang chạy...");

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

// ===== HÀM HỖ TRỢ =====
function formatMoney(num) {
  return num.toLocaleString("vi-VN") + " VNĐ";
}

function formatDate(date) {
  return new Date(date).toLocaleString("vi-VN");
}

function divider() {
  return "━━━━━━━━━━━━━━━━━━━━";
}

async function getUser(msg) {
  let user = await User.findOne({ chatId: msg.chat.id });
  if (!user) {
    user = await User.create({
      chatId: msg.chat.id,
      username: msg.from.first_name || "Khách hàng"
    });
  }
  return user;
}

// ===== GIAO DIỆN CHÍNH =====
async function mainMenu(msg) {
  const user = await getUser(msg);
  const balance = user.totalDeposit - user.totalWithdraw;

  const text = `
🏦 *OKEMA DIGITAL BANK*

${divider()}
👤 *Khách hàng:* ${user.username}
🆔 *Mã ID:* \`${user.chatId}\`

💳 *SỐ DƯ HIỆN TẠI*
💰 ${formatMoney(balance)}

${divider()}
✨ Vui lòng chọn chức năng:
`;

  bot.sendMessage(msg.chat.id, text, {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "💰 Nạp tiền", callback_data: "deposit" },
          { text: "📜 Lịch sử", callback_data: "history" }
        ],
        [
          { text: "📊 Thống kê", callback_data: "summary" },
          { text: "🗑 Reset", callback_data: "reset" }
        ]
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

  if (!user) return;

  // ===== NẠP TIỀN =====
  if (query.data === "deposit") {
    bot.sendMessage(chatId, "💵 *Nhập số tiền muốn nạp:*", { parse_mode: "Markdown" });

    bot.once("message", async (msg) => {
      const amount = Number(msg.text);

      if (!isNaN(amount) && amount > 0) {
        user.totalDeposit += amount;
        user.history.push({ type: "Nạp", amount });
        await user.save();

        bot.sendMessage(chatId,
`✅ *GIAO DỊCH THÀNH CÔNG*

➕ Nạp: ${formatMoney(amount)}
💰 Số dư mới: ${formatMoney(user.totalDeposit - user.totalWithdraw)}

${divider()}`,
          { parse_mode: "Markdown" }
        );

        mainMenu(msg);
      } else {
        bot.sendMessage(chatId, "❌ Số tiền không hợp lệ.");
      }
    });
  }

  // ===== LỊCH SỬ =====
  if (query.data === "history") {
    if (user.history.length === 0) {
      bot.sendMessage(chatId, "📭 Chưa có giao dịch nào.");
      return;
    }

    let text = `📜 *LỊCH SỬ GIAO DỊCH*\n${divider()}\n\n`;

    user.history.slice().reverse().forEach((h, i) => {
      text += `#${i+1} | ${h.type}\n`;
      text += `💵 ${formatMoney(h.amount)}\n`;
      text += `🕒 ${formatDate(h.date)}\n`;
      text += `${divider()}\n`;
    });

    bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  }

  // ===== THỐNG KÊ =====
  if (query.data === "summary") {
    const balance = user.totalDeposit - user.totalWithdraw;

    const text = `
📊 *THỐNG KÊ TÀI KHOẢN*

${divider()}
💰 Tổng đã nạp: ${formatMoney(user.totalDeposit)}
💸 Tổng đã rút: ${formatMoney(user.totalWithdraw)}
💳 Số dư: ${formatMoney(balance)}
📈 Tổng giao dịch: ${user.history.length}
${divider()}
`;

    bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  }

  // ===== RESET =====
  if (query.data === "reset") {
    user.totalDeposit = 0;
    user.totalWithdraw = 0;
    user.history = [];
    await user.save();

    bot.sendMessage(chatId,
`🗑 *ĐÃ RESET TOÀN BỘ DỮ LIỆU*
Tài khoản đã được làm mới.`,
      { parse_mode: "Markdown" }
    );

    mainMenu(query.message);
  }

  bot.answerCallbackQuery(query.id);
});

// ===== EXPRESS SERVER (BẮT BUỘC CHO RENDER) =====
const app = express();

app.get("/", (req, res) => {
  res.send("OKEMA DIGITAL BANK đang hoạt động ✅");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🌐 Server chạy tại cổng", PORT);
});
