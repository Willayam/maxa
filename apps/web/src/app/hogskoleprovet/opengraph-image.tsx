import { ImageResponse } from "next/og";

export const alt = "Gamla Högskoleprovet - Maxa";
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
        <div style={{ fontSize: 72, fontWeight: "bold", marginBottom: 20 }}>
          Gamla Högskoleprovet
        </div>
        <div style={{ fontSize: 36, opacity: 0.9 }}>
          Ladda ner PDF, facit och normering
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 60,
            gap: 16,
          }}
        >
          <div
            style={{
              backgroundColor: "#D4A017",
              color: "#1E1A2D",
              padding: "12px 32px",
              borderRadius: 12,
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            Maxa
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
