export const dynamic = "force-dynamic";

import Hero from "@/components/landing/hero";
import GallerySection from "@/components/landing/gallery-section";
import AboutSection from "@/components/landing/about-section";
import ReviewsSection from "@/components/landing/reviews-section";
import InstagramSection from "@/components/landing/instagram-section";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <GallerySection />
      <AboutSection />
      <ReviewsSection />
      <InstagramSection />
      <Footer />
    </>
  );
}
