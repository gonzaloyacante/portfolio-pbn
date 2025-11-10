import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre mí - Portfolio PBN",
  description: "Conoce a Paola Bolivar Nievas, maquilladora y caracterizadora.",
  alternates: { canonical: "/about-me" },
  openGraph: {
    title: "Sobre mí - Portfolio PBN",
    description: "Conoce a Paola Bolivar Nievas, maquilladora y caracterizadora.",
    url: `${getSiteUrl()}/about-me`,
    type: "profile",
  },
};

const AboutMeClient = dynamic(() => import("./AboutMeClient"), { ssr: false });

export default function AboutMe() {
  return <AboutMeClient />;
}
