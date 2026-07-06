import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "Over mij | Veramiek",
};

export default function OverMijPage() {
  return (
    <StubPage title="Over mij">
      Het volledige verhaal achter het atelier lees je hier binnenkort.
    </StubPage>
  );
}
