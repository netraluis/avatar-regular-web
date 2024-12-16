import {
  Settings,
  Paintbrush,
  User,
  Gem,
  Languages,
  Link2,
} from "lucide-react";

const teamSettingsText = {
  general: "General",
  interface: "Interficie",
  localistaions: "Traduccions",
  customDomain: "Domini personalitzat",
  members: "Membres",
  plans: "Plans",
};

export const teamsSettingsNav = [
  {
    name: `${teamSettingsText.general}`,
    href: "general",
    icon: Settings,
    id: "general",
  },
  {
    name: `${teamSettingsText.interface}`,
    href: "interface",
    icon: Paintbrush,
    id: "interface",
  },
  {
    name: `${teamSettingsText.localistaions}`,
    href: "localisations",
    icon: Languages,
    id: "localisations",
    alpha: true,
  },
  {
    name: `${teamSettingsText.customDomain}`,
    href: "custom-domain",
    icon: Link2,
    id: "custom-domain",
  },
  {
    name: `${teamSettingsText.members}`,
    href: "members",
    icon: User,
    id: "members",
    alpha: true,
  },
  { name: "Plans", href: "plans", icon: Gem, id: "plans", alpha: true },
  // { name: "Billings", href: "billings", icon: CreditCard, id: "billings" },
];

export interface AssistantSettingsText {
  playground: string;
  activity: string;
  sources: string;
  connect: string;
  settings: string;
}

export const assistantSettingsMenu = (
  assistantSettingsText: AssistantSettingsText,
) => [
  {
    name: `${assistantSettingsText.playground}`,
    href: "playground",
    id: "playground",
  },
  {
    name: `${assistantSettingsText.activity}`,
    href: "activity",
    id: "activity",
  },
  { name: `${assistantSettingsText.sources}`, href: "sources", id: "sources" },
  { name: `${assistantSettingsText.connect}`, href: "connect", id: "connect" },
  {
    name: `${assistantSettingsText.settings}`,
    href: "settings",
    id: "settings",
  },
];
