import { Hero } from "@/components/sections/Hero";
import { LoadIntro } from "@/components/sections/LoadIntro";
import { OverMij } from "@/components/sections/OverMij";
import { Collecties } from "@/components/sections/Collecties";
import { BlogTeaser } from "@/components/sections/BlogTeaser";
import { WorkshopsCta } from "@/components/sections/WorkshopsCta";
import { ContactCta } from "@/components/sections/ContactCta";

export default function Home() {
  return (
    <>
      <LoadIntro />
      <Hero />
      <OverMij />
      <Collecties />
      <BlogTeaser />
      <WorkshopsCta />
      <ContactCta />
    </>
  );
}
