import { ImageResponse } from "next/og";

export const alt = "Maxa - Högskoleprovet Prep";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1E1A2D",
          color: "#F5F5F5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: "bold", marginBottom: 20 }}>
          Maxa
        </div>
        <div style={{ fontSize: 40, opacity: 0.9 }}>
          Högskoleprovet Prep
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 40,
            opacity: 0.7,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Gamla prov, facit och normering
        </div>
      </div>
    ),
    { ...size }
  );
}
