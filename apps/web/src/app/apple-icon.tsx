import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf7f2",
          color: "#2c1f14",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 400, letterSpacing: 2 }}>Shaan·e·Taj</div>
        <div
          style={{
            fontSize: 14,
            letterSpacing: 6,
            color: "#9a8070",
            marginTop: 12,
            fontFamily: "system-ui, sans-serif",
            textTransform: "uppercase",
          }}
        >
          Jalandhar
        </div>
      </div>
    ),
    { ...size }
  );
}
