"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

type Settings = {
  semiStitchChargePaise: number;
  fullStitchChargePaise: number;
  shippingFree: boolean;
  shippingChargePaise: number;
  whatsappNumber: string;
  storeAddressLine1: string;
  storeAddressLine2: string;
  storeLandmark: string;
  storePincode: string;
  storePhone: string;
  storeMapUrl: string;
  storeHoursWeekdays: string;
  storeHoursSunday: string;
  youtubeUrl: string;
  instagramUrl: string;
  autoPostInstagram: boolean;
  autoPostFacebook: boolean;
  watermarkEnabled: boolean;
};

export function AdminStoreSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  const [syncNote, setSyncNote] = useState("");

  useEffect(() => {
    apiFetch("/admin/settings").then(setSettings).catch(console.error);
  }, []);

  async function save() {
    if (!settings) return;
    await apiFetch("/admin/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
    setSaved(true);
    setSyncNote("Saved! Contact page & footer updated — refresh shop if needed.");
    setTimeout(() => {
      setSaved(false);
      setSyncNote("");
    }, 8000);
  }

  if (!settings) return <p className="text-sm text-brand-muted">Loading store settings…</p>;

  const s = settings;

  function field(
    label: string,
    key: keyof Settings,
    opts?: { type?: string; placeholder?: string; hint?: string }
  ) {
    const val = s[key];
    return (
      <label className="block text-sm">
        <span className="text-brand-text">{label}</span>
        {opts?.hint && <span className="ml-1 text-brand-subtle">({opts.hint})</span>}
        <input
          type={opts?.type ?? "text"}
          className="mt-1 w-full border border-brand-border px-3 py-2"
          placeholder={opts?.placeholder}
          value={typeof val === "boolean" ? undefined : String(val ?? "")}
          checked={typeof val === "boolean" ? val : undefined}
          onChange={(e) => {
            const v =
              opts?.type === "number"
                ? Number(e.target.value) * (key.includes("Paise") ? 100 : 1)
                : e.target.value;
            setSettings((s) => (s ? { ...s, [key]: v } : s));
          }}
        />
      </label>
    );
  }

  return (
    <div className="space-y-8">
      {syncNote && (
        <p className="rounded-sm border border-rose/40 bg-rose/10 px-4 py-3 text-sm text-rose-dark">
          {syncNote}{" "}
          <a href="/contact" target="_blank" rel="noopener noreferrer" className="underline">
            Check contact page →
          </a>
        </p>
      )}
      <div>
        <h2 className="serif text-2xl">Store & Contact</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Address, WhatsApp, hours — updates live on Contact page & WhatsApp button.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {field("WhatsApp number", "whatsappNumber", {
            placeholder: "919876543210",
            hint: "country code, no +",
          })}
          {field("Shop phone", "storePhone", { placeholder: "0181-XXXXXXX" })}
          {field("Address line 1", "storeAddressLine1")}
          {field("Address line 2", "storeAddressLine2")}
          {field("Area / city", "storeLandmark")}
          {field("Pincode", "storePincode")}
          {field("Google Maps link", "storeMapUrl", {
            placeholder: "https://maps.google.com/?q=...",
          })}
          {field("Weekday hours", "storeHoursWeekdays")}
          {field("Sunday hours", "storeHoursSunday")}
          {field("YouTube channel URL", "youtubeUrl")}
          {field("Instagram URL", "instagramUrl")}
        </div>
      </div>

      <div>
        <h2 className="serif text-2xl">Shipping</h2>
        <p className="mt-1 text-sm text-brand-muted">
          Applied once per order at checkout and on WhatsApp quotes.
        </p>
        <div className="mt-4 space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="shippingType"
              checked={s.shippingFree}
              onChange={() => setSettings((x) => (x ? { ...x, shippingFree: true } : x))}
            />
            Free shipping
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="shippingType"
              checked={!s.shippingFree}
              onChange={() => setSettings((x) => (x ? { ...x, shippingFree: false } : x))}
            />
            Paid shipping
          </label>
          {!s.shippingFree && (
            <label className="block max-w-xs text-sm">
              Shipping charge (₹)
              <input
                type="number"
                min={0}
                className="mt-1 w-full border px-3 py-2"
                value={s.shippingChargePaise / 100}
                onChange={(e) =>
                  setSettings((x) =>
                    x ? { ...x, shippingChargePaise: Number(e.target.value) * 100 } : x
                  )
                }
              />
            </label>
          )}
        </div>
      </div>

      <div>
        <h2 className="serif text-2xl">Stitching charges</h2>
        <div className="mt-4 grid max-w-md gap-4">
          <label className="text-sm">
            Semi-stitch add-on (₹)
            <input
              type="number"
              className="mt-1 w-full border px-3 py-2"
              value={s.semiStitchChargePaise / 100}
              onChange={(e) =>
                setSettings((s) =>
                  s ? { ...s, semiStitchChargePaise: Number(e.target.value) * 100 } : s
                )
              }
            />
          </label>
          <label className="text-sm">
            Full stitch add-on (₹)
            <input
              type="number"
              className="mt-1 w-full border px-3 py-2"
              value={s.fullStitchChargePaise / 100}
              onChange={(e) =>
                setSettings((s) =>
                  s ? { ...s, fullStitchChargePaise: Number(e.target.value) * 100 } : s
                )
              }
            />
          </label>
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        className="rounded-sm bg-rose px-8 py-3 text-[11px] uppercase tracking-wider text-white"
      >
        {saved ? "Saved ✓" : "Save all settings"}
      </button>
    </div>
  );
}
