import { Html, Button } from "@react-email/components";

export const InviteTemplate = ({ inviteUrl }: { inviteUrl: string }) => {
  return (
    <Html lang="en">
      <Button href={inviteUrl}>Click me</Button>
    </Html>
  );
};
