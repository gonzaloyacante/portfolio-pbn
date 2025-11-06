import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto - Portfolio PBN",
  description: "Canales de contacto y redes sociales de Paola Bolivar Nievas.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contacto - Portfolio PBN",
    description: "Canales de contacto y redes sociales de Paola Bolivar Nievas.",
    url: `${getSiteUrl()}/contact`,
    type: "website",
  },
};

const ContactClient = dynamic(() => import("./ContactClient"), { ssr: false });

export default function Contacto() {
  return <ContactClient />;
}
