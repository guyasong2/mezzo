import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const EXCLUDED_PREFIXES = ["samples/", "cld-sample", "main-sample"];
const EXCLUDED_IDS = ["logo-with-lines-backup", "logo-no-lines", "logo", "bailey", "yasin"];

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      max_results: 500,
      type: "upload",
      resource_type: "image",
    });

    const images = result.resources
      .filter(
        (img: { public_id: string }) =>
          !EXCLUDED_PREFIXES.some((prefix) => img.public_id.startsWith(prefix)) &&
          !EXCLUDED_IDS.some((id) => img.public_id === id || img.public_id.startsWith(id + "/"))
      )
      .map(
        (img: {
          public_id: string;
          format: string;
          width: number;
          height: number;
          created_at: string;
          bytes: number;
        }) => ({
          public_id: img.public_id,
          format: img.format,
          width: img.width,
          height: img.height,
          created_at: img.created_at,
          bytes: img.bytes,
        })
      );

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Cloudinary fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
