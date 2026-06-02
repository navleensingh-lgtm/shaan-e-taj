import { getTrackingSteps, type TrackableOrder } from "@/lib/order-tracking";

export function OrderTracking({ order }: { order: TrackableOrder }) {
  if (order.status === "CANCELLED") return null;

  const steps = getTrackingSteps(order.status);

  if (!steps) return null;

  return (
    <div className="mt-4 border-t border-brand-border pt-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-rose">Order tracking</p>
      <ol className="mt-3 space-y-2">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-3 text-sm">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                step.done
                  ? step.current
                    ? "bg-rose text-white"
                    : "bg-rose/20 text-rose-dark"
                  : "bg-ivory-2 text-brand-subtle"
              }`}
            >
              {step.done ? "✓" : "·"}
            </span>
            <span className={step.current ? "font-medium text-brand-text" : "text-brand-muted"}>
              {step.label}
            </span>
          </li>
        ))}
      </ol>

      {order.status === "SHIPPED" && (order.trackingNumber || order.trackingUrl) && (
        <div className="mt-3 text-sm text-brand-muted">
          {order.trackingCarrier && <p>Courier: {order.trackingCarrier}</p>}
          {order.trackingNumber && (
            <p>
              Tracking ID: <strong className="text-brand-text">{order.trackingNumber}</strong>
            </p>
          )}
          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-rose underline"
            >
              Track shipment →
            </a>
          )}
        </div>
      )}
    </div>
  );
}
