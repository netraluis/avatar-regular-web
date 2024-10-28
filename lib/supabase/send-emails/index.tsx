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
  user: { email },
}: {
  email_data: EmailData;
  user: UserData;
}) => {
  switch (email_action_type) {
    case "invite":
      return await resend.emails.send({
        from: "you@chatbotfor.xyz",
        to: email,
        subject: "Link de invitación",
        react: (
          <InviteTemplate
            inviteUrl={`${process.env.PROTOCOL}app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/auth/confirm?token_hash=${token_hash}`}
          />
        ),
      });
  }
};
