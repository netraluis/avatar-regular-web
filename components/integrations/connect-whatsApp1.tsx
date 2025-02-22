import { useEffect } from "react";

const ConnectWhatsApp = () => {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID || "608566405291180";
  const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI || "https://hkdk.events/l24y5zyduqh4xg"
  const permissions = "whatsapp_business_management,whatsapp_business_messaging";

  const handleLogin = () => {
    const authUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${permissions}&response_type=code`;
    window.open(authUrl, "_blank", "width=600,height=700");
  };

  return (
    <button onClick={handleLogin} className="p-3 bg-green-500 text-white rounded-lg">
      Conectar con WhatsApp
    </button>
  );
};

export default ConnectWhatsApp;
