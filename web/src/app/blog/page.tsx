import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "Mijn blog | Veramiek",
};

export default function BlogPage() {
  return (
    <StubPage title="Mijn blog">
      Verhalen uit het atelier verschijnen hier binnenkort.
    </StubPage>
  );
}
