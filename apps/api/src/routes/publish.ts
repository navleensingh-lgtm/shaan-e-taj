import { Router } from "express";
import { publishTelegramDraft } from "../services/publish.js";
import { requireInternalSecret } from "../middleware/auth.js";

export const publishRoutes = Router();
publishRoutes.use(requireInternalSecret);

/** Called by Telegram bot on `/publish` or internal admin */
publishRoutes.post("/telegram/:draftId", async (req, res) => {
  try {
    const product = await publishTelegramDraft(req.params.draftId);
    res.json({ ok: true, product });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Publish failed";
    res.status(400).json({ error: message });
  }
});
