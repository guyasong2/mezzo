import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AboutPageContent } from "@/components/about/about-page-content";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "About",
  description: "Learn more about Steve Mezzo Images and our photography philosophy.",
};

export default async function AboutPage() {
  const supabase = await createClient();

  const { data: aboutText } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "about_text")
    .single();

  const { data: aboutImage } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "about_image")
    .single();

  const text = (aboutText?.value as any) ?? null;
  const image = (aboutImage?.value as any) ?? null;

  return (
    <>
      <Navbar />
      <AboutPageContent text={text} image={image} />
      <Footer />
    </>
  );
}
