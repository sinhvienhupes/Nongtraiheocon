const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');

const token = process.env.TOKEN;
mongoose.connect(process.env.MONGO_URL);

const userSchema = new mongoose.Schema({
  chatId: String,
  goal: Number,
  total: Number,
  history: [{ date: String, amount: Number }]
});

const User = mongoose.model("User", userSchema);

const bot = new TelegramBot(token, { polling: true });

function progressBar(percent) {
  const total = 20;
  const filled = Math.round((percent / 100) * total);
  return "🟩".repeat(filled) + "⬜".repeat(total - filled);
}

async function mainMenu(chatId) {
  let user = await User.findOne({ chatId });

  if (!user) {
    user = await User.create({ chatId, goal: 0, total: 0, history: [] });
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
          [{ text: "✏ Sửa giao dịch", callback_data: "edit" }],
          [{ text: "🗑 Xoá giao dịch", callback_data: "delete" }],
          [{ text: "⚙ Đặt mục tiêu", callback_data: "setgoal" }],
          [{ text: "❌ Xoá mục tiêu", callback_data: "deletegoal" }]
        ]
      }
    }
  );
}

bot.onText(/\/start/, (msg) => {
  mainMenu(msg.chat.id.toString());
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id.toString();
  let user = await User.findOne({ chatId });

  if (!user) return;

  // Thêm tiền
  if (query.data === "add") {
    bot.sendMessage(chatId, "Nhập số tiền:");
    bot.once("message", async (msg) => {
      const amount = parseInt(msg.text);
      if (isNaN(amount)) return;

      const today = new Date().toLocaleDateString('vi-VN');
      user.total += amount;
      user.history.push({ date: today, amount });
      await user.save();
      mainMenu(chatId);
    });
  }

  // Sao kê
  if (query.data === "history") {
    if (user.history.length === 0)
      return bot.sendMessage(chatId, "Chưa có giao dịch.");

    let text = "📑 SAO KÊ\n\n";
    user.history.forEach((h, i) => {
      text += `${i + 1}. ${h.date} - ${h.amount.toLocaleString()} VND\n`;
    });

    bot.sendMessage(chatId, text);
  }

  // Sửa giao dịch
  if (query.data === "edit") {
    bot.sendMessage(chatId, "Nhập số thứ tự giao dịch cần sửa:");
    bot.once("message", async (msg) => {
      const index = parseInt(msg.text) - 1;
      if (!user.history[index]) return;

      bot.sendMessage(chatId, "Nhập số tiền mới:");
      bot.once("message", async (msg2) => {
        const newAmount = parseInt(msg2.text);
        if (isNaN(newAmount)) return;

        user.total -= user.history[index].amount;
        user.history[index].amount = newAmount;
        user.total += newAmount;

        await user.save();
        mainMenu(chatId);
      });
    });
  }

  // Xoá giao dịch
  if (query.data === "delete") {
    bot.sendMessage(chatId, "Nhập số thứ tự giao dịch cần xoá:");
    bot.once("message", async (msg) => {
      const index = parseInt(msg.text) - 1;
      if (!user.history[index]) return;

      user.total -= user.history[index].amount;
      user.history.splice(index, 1);

      await user.save();
      mainMenu(chatId);
    });
  }

  // Đặt mục tiêu
  if (query.data === "setgoal") {
    bot.sendMessage(chatId, "Nhập mục tiêu mới:");
    bot.once("message", async (msg) => {
      const goal = parseInt(msg.text);
      if (isNaN(goal)) return;

      user.goal = goal;
      await user.save();
      mainMenu(chatId);
    });
  }

  // Xoá mục tiêu
  if (query.data === "deletegoal") {
    user.goal = 0;
    user.total = 0;
    user.history = [];
    await user.save();
    mainMenu(chatId);
  }

  bot.answerCallbackQuery(query.id);
});
