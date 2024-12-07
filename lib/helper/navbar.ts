import {
  Settings,
  Paintbrush,
  User,
  Gem,
  CreditCard,
  Languages,
  Link2,
} from "lucide-react";

export const teamsSettingsNav = [
  { name: "General", href: "general", icon: Settings, id: "general" },
  { name: "Interface", href: "interface", icon: Paintbrush, id: "interface" },
  {
    name: "Localisations",
    href: "localisations",
    icon: Languages,
    id: "localisations",
  },
  {
    name: "Custom domain",
    href: "custom-domain",
    icon: Link2,
    id: "custom-domain",
  },
  { name: "Members", href: "members", icon: User, id: "members" },
  { name: "Plans", href: "plans", icon: Gem, id: "plans" },
  { name: "Billings", href: "billings", icon: CreditCard, id: "billings" },
];

export const assistantSettingsNav = [
    { name: "Playground", href: "playground", id: "playground" },
    { name: "Activity", href: "activity", id: "activity" },
    { name: "Sources", href: "sources", id: "sources" },
    { name: "Connect", href: "connect", id: "connect" },
    { name: "Settings", href: "settings", id: "settings" },
  ];
