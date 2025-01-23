"use server";
import { AppProvider } from "@/components/context/appContext";
import { getUserById } from "@/lib/data/user";
import { headers } from "next/headers";
import Script from "next/script";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  if (!headersList.get("x-user-id")) {
    return <div>1 no user</div>;
  }
  const userId = headersList.get("x-user-id");
  if (!userId) {
    return <div>2 no user</div>;
  }
  const user = JSON.parse(userId);

  // const team = await getTeamsByUser(data?.user.id);
  // console.log({ team });
  // if (!team) return <div>no team</div>;

  let userLocal = null;
  if (user.user?.id) {
    userLocal = await getUserById(user.user.id);
  }

  return (
    <AppProvider user={user} userLocal={userLocal}>
      {children}
      <Script id="fernand-init" strategy="afterInteractive">
        {`
            (function (w) {
              if (typeof w.Fernand !== "function") {
                var f = function () {
                  f.q[arguments[0] == 'set' ? 'unshift' : 'push'](arguments);
                };
                f.q = [];
                w.Fernand = f;
              }
            })(window);
            Fernand('init', { appId: 'chatbotfor' });
            Fernand('set', {
              user: {
                  name: '${userLocal?.name || ""}',
                  email: '${userLocal?.email || ""}'
                }
            });

          `}
      </Script>

      {/* Script externo de GetFernand */}
      <Script
        src="https://messenger.getfernand.com/client.js"
        strategy="afterInteractive"
        async
      />
    </AppProvider>
  );
}
