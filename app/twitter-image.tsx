import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Steve Mezzo Images - Professional Photography in Texas";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#D4AF37",
              letterSpacing: "-1px",
            }}
          >
            Steve Mezzo Images
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#cccccc",
              fontWeight: 400,
            }}
          >
            Professional Photography in Texas
          </div>
          <div
            style={{
              width: 80,
              height: 2,
              background: "#D4AF37",
              marginTop: 10,
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: "#999999",
              marginTop: 10,
            }}
          >
            Portraits · Weddings · Events · Commercial
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
