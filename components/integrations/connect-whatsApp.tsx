import { useEffect, useState } from "react";

const ConnectWhatsApp = () => {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID || "608566405291180";
  const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI || "https://hkdk.events/l24y5zyduqh4xg"
  const permissions = "whatsapp_business_management,whatsapp_business_messaging";

  const [accessToken, setAccessToken] = useState(null);
  const [businessAccountId, setBusinessAccountId] = useState(null);
  const [phoneNumbers, setPhoneNumbers] = useState([]);

  // Maneja la respuesta después del login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetch(`/api/auth/meta-callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            setAccessToken(data.access_token);
            localStorage.setItem("access_token", data.access_token); // Guardar en localStorage
          }
        });
    }
  }, []);

  const handleLogin = () => {
    const authUrl = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${permissions}&response_type=code`;
    // window.location.href = authUrl; // Redirige a Meta para login
    window.open(authUrl, "_blank", "width=600,height=700");
  };

  const fetchBusinessAccount = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return alert("No hay token disponible");

    fetch(`/api/whatsapp/get-business-account?access_token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.whatsapp_business_account_id) {
          setBusinessAccountId(data.whatsapp_business_account_id);
          localStorage.setItem("business_account_id", data.whatsapp_business_account_id);
        }
      });
  };

  const fetchPhoneNumbers = () => {
    const token = localStorage.getItem("access_token");
    const businessId = localStorage.getItem("business_account_id");
    if (!token || !businessId) return alert("No hay datos disponibles");

    fetch(`/api/whatsapp/get-phone-numbers?access_token=${token}&business_account_id=${businessId}`)
      .then(res => res.json())
      .then(data => {
        if (data.phone_numbers) {
          setPhoneNumbers(data.phone_numbers);
        }
      });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {!accessToken ? (
        <button onClick={handleLogin} className="p-3 bg-green-500 text-white rounded-lg">
          Conectar con WhatsApp
        </button>
      ) : (
        <>
          <p className="text-green-600 font-bold">✅ Autenticado con Meta</p>
          {!businessAccountId ? (
            <button onClick={fetchBusinessAccount} className="p-3 bg-blue-500 text-white rounded-lg mt-3">
              Obtener cuenta de WhatsApp Business
            </button>
          ) : (
            <>
              <p className="text-blue-600 font-bold">✅ Cuenta de WhatsApp Business obtenida</p>
              <button onClick={fetchPhoneNumbers} className="p-3 bg-purple-500 text-white rounded-lg mt-3">
                Obtener números de WhatsApp
              </button>
            </>
          )}
          {phoneNumbers.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Selecciona un número:</h3>
              <ul>
                {phoneNumbers.map((phone: any) => (
                  <li key={phone.id} className="p-2 border rounded-lg mt-2">
                    {phone.display_phone_number} ({phone.id})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConnectWhatsApp;
