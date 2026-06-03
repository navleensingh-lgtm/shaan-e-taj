"use client";

import type { AddressInput } from "@/lib/checkout-address";

const inputClass =
  "mt-1 w-full rounded-sm border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:border-rose";

type Props = {
  title: string;
  value: AddressInput;
  onChange: (next: AddressInput) => void;
  idPrefix: string;
};

export function AddressFields({ title, value, onChange, idPrefix }: Props) {
  function set<K extends keyof AddressInput>(key: K, v: AddressInput[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-[11px] uppercase tracking-[0.2em] text-rose">{title}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="sm:col-span-2 block text-sm">
          Full name *
          <input
            id={`${idPrefix}-name`}
            required
            value={value.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            className={inputClass}
            autoComplete="name"
          />
        </label>
        <label className="block text-sm">
          Mobile *
          <input
            id={`${idPrefix}-phone`}
            required
            type="tel"
            inputMode="numeric"
            value={value.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputClass}
            placeholder="10-digit number"
            autoComplete="tel"
          />
        </label>
        <label className="block text-sm">
          Email *
          <input
            id={`${idPrefix}-email`}
            required
            type="email"
            value={value.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
        </label>
        <label className="sm:col-span-2 block text-sm">
          Address line 1 *
          <input
            id={`${idPrefix}-line1`}
            required
            value={value.line1}
            onChange={(e) => set("line1", e.target.value)}
            className={inputClass}
            placeholder="House no., street, area"
            autoComplete="address-line1"
          />
        </label>
        <label className="sm:col-span-2 block text-sm">
          Address line 2
          <input
            id={`${idPrefix}-line2`}
            value={value.line2}
            onChange={(e) => set("line2", e.target.value)}
            className={inputClass}
            placeholder="Landmark (optional)"
            autoComplete="address-line2"
          />
        </label>
        <label className="block text-sm">
          City *
          <input
            id={`${idPrefix}-city`}
            required
            value={value.city}
            onChange={(e) => set("city", e.target.value)}
            className={inputClass}
            autoComplete="address-level2"
          />
        </label>
        <label className="block text-sm">
          State *
          <input
            id={`${idPrefix}-state`}
            required
            value={value.state}
            onChange={(e) => set("state", e.target.value)}
            className={inputClass}
            autoComplete="address-level1"
          />
        </label>
        <label className="block text-sm">
          PIN code *
          <input
            id={`${idPrefix}-pincode`}
            required
            inputMode="numeric"
            maxLength={6}
            value={value.pincode}
            onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
            className={inputClass}
            autoComplete="postal-code"
          />
        </label>
      </div>
    </fieldset>
  );
}
