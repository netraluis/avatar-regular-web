"use server";

import ConversationSwitcher from "@/components/conversationSwitcher";

export async function generateStaticParams() {
  return [{ domain: "demo.yoursite.com" }, { domain: "mycustomsite.com" }];
}

export default async function SiteHomePage() {
  return <ConversationSwitcher />;
}
