import type { Metadata } from "next";
import { StubPage } from "@/components/layout/StubPage";

export const metadata: Metadata = {
  title: "Contact | Veramiek",
};

export default function ContactPage() {
  return (
    <StubPage title="Contact">
      Een bericht via WhatsApp is de snelste weg, deze pagina volgt binnenkort.
    </StubPage>
  );
}
