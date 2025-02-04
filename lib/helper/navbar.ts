import {
  Settings,
  Paintbrush,
  // User,
  // Gem,
  Languages,
  Link2,
  Gamepad2,
  Activity,
  Folder,
  ExternalLink,
  Settings2,
  Inbox,
  Archive,
  Gem,
} from "lucide-react";

interface TeamSettingsText {
  general: string;
  interface: string;
  localistaions: string;
  customDomain: string;
  members: string;
  plans: string;
}

// const teamSettingsText = {
//   general: "General",
//   interface: "Interficie",
//   localistaions: "Traduccions",
//   customDomain: "Domini personalitzat",
//   members: "Membres",
//   plans: "Plans",
// };

export const teamsSettingsNav = (teamSettingsText: TeamSettingsText) => [
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
  // {
  //   name: `${teamSettingsText.members}`,
  //   href: "members",
  //   icon: User,
  //   id: "members",
  //   alpha: true,
  // },
  { name: "Plans", href: "plans", icon: Gem, id: "plans", alpha: true },
  // { name: "Billings", href: "billings", icon: CreditCard, id: "billings" },
];

export interface AssistantSettingsText {
  playground: string;
  activity: string;
  sources: string;
  connect: string;
  settings: string;
  chatLogs: string;
  archives: string;
  notion: string;
  googleDrive: string;
  oneDrive: string;
  teams: string;
  share: string;
  general: string;
  interface: string;
}

export const assistantSettingsMenu = (
  assistantSettingsText: AssistantSettingsText,
) => [
  {
    name: `${assistantSettingsText.playground}`,
    href: "playground",
    id: "playground",
    icon: Gamepad2,
    subItems: [],
  },
  {
    name: `${assistantSettingsText.activity}`,
    href: "activity",
    id: "activity",
    icon: Activity,
    subItems: [
      {
        name: `${assistantSettingsText.chatLogs}`,
        href: "activity/chat-logs",
        icon: Inbox,
      },
    ],
  },
  {
    name: `${assistantSettingsText.sources}`,
    href: "sources",
    id: "sources",
    icon: Folder,
    subItems: [
      {
        name: `${assistantSettingsText.archives}`,
        href: "sources/archives",
        icon: Archive,
      },
      // { name: "Texts", href: "texts", icon: FileText },
      // { name: "Emails", href: "emails", icon: Mail },
      // { name: "Q&A", href: "qna", icon: MessageSquare },
      // {
      //   name: `${assistantSettingsText.notion}`,
      //   href: "notion",
      //   icon: BookOpen,
      //   commingSoon: true,
      // },
      // {
      //   name: `${assistantSettingsText.googleDrive}`,
      //   href: "google-drive",
      //   icon: HardDrive,
      //   commingSoon: true,
      // },
      // {
      //   name: `${assistantSettingsText.oneDrive}`,
      //   href: "one-drive",
      //   icon: CloudUpload,
      //   commingSoon: true,
      // },
      // {
      //   name: `${assistantSettingsText.teams}`,
      //   href: "teams",
      //   icon: MessageSquare,
      //   commingSoon: true,
      // },
    ],
  },
  {
    name: `${assistantSettingsText.connect}`,
    href: "connect",
    id: "connect",
    icon: ExternalLink,
    subItems: [
      {
        name: `${assistantSettingsText.share}`,
        href: "connect/share",
        icon: ExternalLink,
      },
    ],
  },
  {
    name: `${assistantSettingsText.settings}`,
    href: "settings",
    id: "settings",
    icon: Settings2,
    subItems: [
      {
        name: `${assistantSettingsText.general}`,
        href: "settings/general",
        icon: Settings2,
      },
      {
        name: `${assistantSettingsText.interface}`,
        href: "settings/interface",
        icon: Paintbrush,
      },
    ],
  },
];
