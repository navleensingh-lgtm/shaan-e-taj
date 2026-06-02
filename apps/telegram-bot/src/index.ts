import dotenv from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../.env") });
import { Bot, InlineKeyboard } from "grammy";
import { prisma } from "@shaan-e-taj/database";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error("TELEGRAM_BOT_TOKEN is required");
}

const adminIds = (process.env.TELEGRAM_ADMIN_CHAT_IDS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const apiUrl = process.env.API_URL ?? "http://localhost:4000";
const bot = new Bot(token);

function isAdmin(userId: number): boolean {
  return adminIds.length === 0 || adminIds.includes(String(userId));
}

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Shaan-e-Taj Upload Bot\n\n" +
      "1. Send raw suit photo\n" +
      "2. AI processes image + generates details\n" +
      "3. Send /publish to go live on website"
  );
});

bot.on("message:photo", async (ctx) => {
  if (!ctx.from || !isAdmin(ctx.from.id)) {
    await ctx.reply("Unauthorized.");
    return;
  }

  const photo = ctx.message.photo.at(-1);
  if (!photo) return;

  const file = await ctx.api.getFile(photo.file_id);
  const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

  await ctx.reply("Processing image with AI…");

  const draft = await prisma.telegramDraft.create({
    data: {
      telegramFileId: photo.file_id,
      telegramUserId: String(ctx.from.id),
      rawImageUrl: fileUrl,
      status: "processing",
    },
  });

  try {
    const processRes = await fetch(`${apiUrl}/internal/process-draft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "",
      },
      body: JSON.stringify({ draftId: draft.id, imageUrl: fileUrl }),
    });

    if (!processRes.ok) {
      throw new Error(await processRes.text());
    }

    const preview = (await processRes.json()) as { name: string; priceInPaise: number };
    const keyboard = new InlineKeyboard().text(
      "Publish now",
      `publish:${draft.id}`
    );

    await ctx.reply(
      `Ready for review:\n\n*${preview.name}*\n₹${(preview.priceInPaise / 100).toLocaleString("en-IN")}\n\nSend /publish or tap Publish.`,
      { parse_mode: "Markdown", reply_markup: keyboard }
    );
  } catch {
    await ctx.reply(
      `Draft saved (${draft.id.slice(0, 8)}). Start API server, then send /publish`
    );
  }
});

bot.command("publish", async (ctx) => {
  if (!ctx.from || !isAdmin(ctx.from.id)) {
    await ctx.reply("Unauthorized.");
    return;
  }

  const draft = await prisma.telegramDraft.findFirst({
    where: { telegramUserId: String(ctx.from.id), status: { not: "published" } },
    orderBy: { createdAt: "desc" },
  });

  if (!draft) {
    await ctx.reply("No draft found. Send a product photo first.");
    return;
  }

  await publishDraft(ctx.chat.id, draft.id);
});

bot.callbackQuery(/^publish:(.+)$/, async (ctx) => {
  const draftId = ctx.match[1];
  await ctx.answerCallbackQuery();
  await publishDraft(ctx.chat?.id ?? 0, draftId);
});

async function publishDraft(chatId: number, draftId: string) {
  try {
    const res = await fetch(`${apiUrl}/publish/telegram/${draftId}`, {
      method: "POST",
      headers: { "x-internal-secret": process.env.INTERNAL_API_SECRET ?? "" },
    });
    const body = await res.json();
    if (!res.ok) {
      await bot.api.sendMessage(chatId, `Publish failed: ${body.error ?? res.statusText}`);
      return;
    }
    await bot.api.sendMessage(
      chatId,
      `Published: ${body.product.name}\nLive on website + New Arrivals + search.`
    );
  } catch (e) {
    await bot.api.sendMessage(chatId, `Error: ${e instanceof Error ? e.message : "unknown"}`);
  }
}

bot.start();
console.log("Telegram bot running");
