"use client";
// import { CustomCard } from "@/components/custom-card";
import { useAppContext } from "@/components/context/appContext";

// const general = {
//   title: "Configuració",
//   description:
//     "Gestiona la configuració del teu compte i ajusta les preferències",
//   general: "General",
//   security: "Segure"
// }

export default function General() {
  const {
    state: { teamSelected, assistantsByTeam, user, userLocal },
  } = useAppContext();

  console.log({ teamSelected, assistantsByTeam, user, userLocal });
  return (
    <div>
      {/* <CustomCard title={share.title} description={share.desription}>
        <div className="space-y-2">
          <Label htmlFor="team-url">{share.chat.title}</Label>
          <div className="flex items-center space-x-2">
            {teamSelected ? (
              <Input id="team-url" disabled read-only="true" value={url} />
            ) : (
              <InputCharging />
            )}

            <Button size="sm" onClick={handleRedirect} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {share.chat.description}
          </p>
        </div>
      </CustomCard> */}
      <>General</>
    </div>
  );
}
