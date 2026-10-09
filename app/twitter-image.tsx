import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Steve Mezzo Images - Professional Photography in Texas";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const logoData = await readFile(
  join(process.cwd(), "public/logo-original.jpg"),
  "base64"
);
const logoSrc = `data:image/jpeg;base64,${logoData}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          gap: "60px",
        }}
      >
        <img
          src={logoSrc}
          width={220}
          height={220}
          style={{
            borderRadius: "50%",
            border: "3px solid #D4AF37",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#D4AF37",
              letterSpacing: "-1px",
              fontFamily: "serif",
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
              marginTop: 4,
            }}
          />
          <div
            style={{
              fontSize: 22,
              color: "#999999",
              marginTop: 4,
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
