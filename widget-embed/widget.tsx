// widget-embed/Widget.tsx

import ChatWidget from "./chat-widget";
import "./output.css"

interface User {
  name?: string;
  email?: string;
}

interface WidgetProps {
  appId?: string;
  user?: User;
}

export function Widget({ appId, user }: WidgetProps) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, background: "#eee", padding: 10 }}>
      {/* <p>App ID: {appId}</p>
      <p>User: {user?.name} ({user?.email})</p>
      <button onClick={() => alert("Hola desde tu widget!")}>Click</button> */}
      <ChatWidget language="en" teamId="123" assistantId="456" />
    </div>
  );
}
