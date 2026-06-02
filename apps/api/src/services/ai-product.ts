import OpenAI from "openai";
import { MainCategory, SubCategory } from "@shaan-e-taj/database";

function getOpenAI(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

const CATEGORY_PROMPT = `You are Shaan-e-Taj luxury Indian couture catalog AI.
Analyze the outfit image and return JSON only:
{
  "name": "elegant 3-6 word product name",
  "description": "2-3 sentences: fabric, embroidery, occasion",
  "mainCategory": "BRIDAL|PARTY_WEAR|FESTIVE|NEW_ARRIVALS",
  "subCategory": "ANARKALI|SHARARA|GHARARA|PAKISTANI|INDO_WESTERN|LEHENGA|KURTI_SET|SALWAR_SUIT|DUPATTA|OTHER",
  "fabric": "string",
  "color": "string",
  "priceInPaise": number,
  "seoKeywords": ["keyword1", "keyword2"]
}
Pick category automatically. Price realistic INR (in paise: rupees * 100).`;

export type AiProductMetadata = {
  name: string;
  description: string;
  mainCategory: MainCategory;
  subCategory: SubCategory;
  fabric?: string;
  color?: string;
  priceInPaise: number;
  seoKeywords: string[];
};

export async function generateProductFromImage(
  imageUrl: string
): Promise<AiProductMetadata> {
  const openai = getOpenAI();
  if (!openai) {
    return {
      name: "Noor-e-Zareen Embroidered Suit Set",
      description:
        "Elegant embroidered georgette suit with premium dupatta. Add OPENAI_API_KEY for live AI generation.",
      mainCategory: MainCategory.PARTY_WEAR,
      subCategory: SubCategory.PAKISTANI,
      fabric: "Georgette",
      color: "Wine Maroon",
      priceInPaise: 399900,
      seoKeywords: ["party wear suit", "designer suit"],
    };
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: CATEGORY_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Generate product catalog JSON for this suit." },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty AI response");
  return JSON.parse(raw) as AiProductMetadata;
}
