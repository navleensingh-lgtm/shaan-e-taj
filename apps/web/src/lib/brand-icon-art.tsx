/** Shared artwork for favicon / PWA / Open Graph (matches SiteNav text branding). */
export const brandColors = {
  ivory: "#faf7f2",
  text: "#2c1f14",
  subtle: "#9a8070",
  gold: "#9a7a3e",
  rose: "#a0705a",
} as const;

type BrandIconVariant = "favicon" | "apple" | "opengraph";

export function BrandIconArt({ variant }: { variant: BrandIconVariant }) {
  if (variant === "favicon") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: brandColors.ivory,
          color: brandColors.text,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 15, fontWeight: 500 }}>
          <span>S</span>
          <span style={{ color: brandColors.gold, margin: "0 1px" }}>·</span>
          <span>T</span>
        </div>
      </div>
    );
  }

  if (variant === "apple") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: brandColors.ivory,
          color: brandColors.text,
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 34, fontWeight: 500, letterSpacing: 2 }}>
          <span>Shaan</span>
          <span style={{ color: brandColors.gold, margin: "0 2px" }}>·</span>
          <span>e·Taj</span>
        </div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 5,
            color: brandColors.subtle,
            marginTop: 14,
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          Jalandhar
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: brandColors.ivory,
        color: brandColors.text,
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", fontSize: 72, fontWeight: 500, letterSpacing: 4 }}>
        <span>Shaan</span>
        <span style={{ color: brandColors.gold, margin: "0 6px" }}>·</span>
        <span>e·Taj</span>
      </div>
      <div
        style={{
          fontSize: 28,
          letterSpacing: 8,
          color: brandColors.subtle,
          marginTop: 24,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Luxury Indian Couture
      </div>
      <div
        style={{
          fontSize: 18,
          letterSpacing: 6,
          color: brandColors.rose,
          marginTop: 16,
          fontFamily: "system-ui, sans-serif",
          textTransform: "uppercase",
        }}
      >
        Jalandhar
      </div>
    </div>
  );
}
