import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "Workshops | Veramiek",
};

export default function WorkshopsPage() {
  return (
    <StubPage title="Workshops">
      Binnenkort kun je hier een plek aan de draaischijf reserveren.
    </StubPage>
  );
}
