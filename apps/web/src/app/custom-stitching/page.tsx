"use client";

import { useState } from "react";
import { whatsAppUrl } from "@/lib/whatsapp";

const STITCHING = ["Unstitched", "Fully Stitched"] as const;

export default function CustomStitchingPage() {
  const [stitching, setStitching] = useState<string>(STITCHING[0]);
  const [measurements, setMeasurements] = useState({
    bust: "",
    waist: "",
    hip: "",
    shoulder: "",
    length: "",
    sleeve: "",
  });

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const msg = [
      "Hi Shaan-e-Taj! Custom stitching enquiry:",
      "",
      `Name: ${fd.get("name")}`,
      `Phone: ${fd.get("phone")}`,
      `Stitching: ${stitching}`,
      `Bust: ${measurements.bust} | Waist: ${measurements.waist} | Hip: ${measurements.hip}`,
      `Shoulder: ${measurements.shoulder} | Length: ${measurements.length} | Sleeve: ${measurements.sleeve}`,
      "",
      String(fd.get("notes") ?? ""),
    ].join("\n");
    window.open(whatsAppUrl(msg), "_blank");
  }

  return (
    <section className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose">Make It Yours</p>
      <h1 className="serif mt-3 text-4xl">Custom Stitching</h1>
      <p className="mt-4 text-sm leading-relaxed text-brand-muted">
        Choose unstitched or fully stitched. Extra stitching charges are set by admin in the dashboard.
      </p>
      <form onSubmit={submit} className="mt-10 space-y-5">
        <input name="name" required placeholder="Your name" className="w-full border border-brand-border bg-white px-4 py-3 text-sm" />
        <input name="phone" required placeholder="WhatsApp number" className="w-full border border-brand-border bg-white px-4 py-3 text-sm" />
        <div className="flex flex-wrap gap-2">
          {STITCHING.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStitching(s)}
              className={`rounded-sm border px-4 py-2 text-sm ${stitching === s ? "border-rose bg-rose text-white" : "border-brand-border"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {(["bust", "waist", "hip", "shoulder", "length", "sleeve"] as const).map((k) => (
            <input
              key={k}
              placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
              value={measurements[k]}
              onChange={(e) => setMeasurements((m) => ({ ...m, [k]: e.target.value }))}
              className="border border-brand-border bg-white px-3 py-2 text-sm capitalize"
            />
          ))}
        </div>
        <textarea name="notes" placeholder="Occasion, fabric preference, reference links…" className="h-28 w-full border border-brand-border bg-white p-4 text-sm" />
        <button type="submit" className="w-full rounded-sm bg-rose py-4 text-[11px] uppercase tracking-wider text-white">
          Send via WhatsApp
        </button>
      </form>
    </section>
  );
}
