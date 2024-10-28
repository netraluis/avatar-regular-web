import { Resend } from "resend";
import { InviteTemplate } from "./templates/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  token: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: string;
  site_url: string;
  token_new: string;
  token_hash_new: string;
}
export interface UserData {
  id: string;
  aud: string;
  role: string;
  email: string;
  phone: string;
  app_metadata: string;
  user_metadata: any;
  identities: string;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

export default async ({
  email_data: { email_action_type, token_hash },
  user,
}: {
  email_data: EmailData;
  user: UserData;
}) => {
  console.log({ email_action_type, token_hash, user });
  switch (email_action_type) {
    case "signup":
      return await resend.emails.send({
        from: "you@chatbotfor.xyz",
        to: user?.email,
        subject: "Link de invitación",
        react: (
          <InviteTemplate
            inviteUrl={`app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/api/auth/confirm?token_hash=${token_hash}`}
          />
        ),
      });
    default:
      return "no email sent";
  }
};
