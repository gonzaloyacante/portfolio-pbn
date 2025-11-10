import { Instagram, Twitter, Linkedin, Facebook } from "lucide-react";

export interface Social {
  url: string;
  username: string;
}

export interface ContactData {
  email: string;
  socials: {
    facebook: Social;
    instagram: Social;
    linkedin: Social;
    twitter: Social;
  };
}

export const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
};
