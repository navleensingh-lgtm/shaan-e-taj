import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: 1 }}>ST</div>
        <div
          style={{
            fontSize: 5,
            letterSpacing: 2,
            color: "#9a8070",
            marginTop: 2,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          JLD
        </div>
      </div>
    ),
    { ...size }
  );
}
