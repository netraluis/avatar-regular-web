"use client";
import { useAppContext } from "@/components/context/appContext";
import { useDashboardLanguage } from "@/components/context/dashboardLanguageContext";
import {
  useCreateTeam,
  useFetchTeamsByUserId,
} from "@/components/context/useAppContext/team";
import OnboardingBase from "@/components/onboarding/onboarding-base";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { LanguageType, WelcomeType } from "@prisma/client";
import { SelectValue } from "@radix-ui/react-select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const { t } = useDashboardLanguage();
  const newTeam = t("app.TEAM.NEW.PAGE");

  const languages = {
    CA: newTeam.CA,
    ES: newTeam.ES,
    EN: newTeam.EN,
    FR: newTeam.FR,
  };

  const router = useRouter();
  const {
    state: { user, teams },
  } = useAppContext();
  const { fetchTeamsByUserId } = useFetchTeamsByUserId();
  const { loadingCreateTeam, createTeamData, createTeam, errorCreateTeam } =
    useCreateTeam();
  const [teamName, setTeamName] = useState("");
  const [language, setLanguage] = useState<LanguageType>(LanguageType.CA);

  const backAction = () => {
    router.push("/team");
  };

  const nextAction = async () => {
    const uuid = uuidv4();
    if (!user?.user.id) {
      router.push("/login");
    } else {
      const slug = slugify(teamName, { lower: true, strict: true });
      await createTeam({
        data: {
          welcomeType: WelcomeType.PLAIN,
          name: teamName,
          subDomain: `${slug}-${uuid}`,
          defaultLanguage: language,
          selectedLanguages: [language],
        },
        userId: user!.user.id,
      });
      await fetchTeamsByUserId(user.user.id);
    }
  };

  useEffect(() => {
    if (createTeamData) {
      router.push(`/team/${createTeamData.id}/assistant/new`);
    }
  }, [createTeamData]);

  const handleLanguageChange = (value: LanguageType) => {
    setLanguage(value);
  };

  return (
    <OnboardingBase
      title={newTeam.title}
      description={newTeam.description}
      backAction={backAction}
      nextAction={nextAction}
      backActionText={newTeam.backActionText}
      nextActionText={newTeam.nextActionText}
      loading={loadingCreateTeam}
      backActionActive={teams.length > 0}
      nextActionActive={!!teamName}
      error={errorCreateTeam}
      errorText={newTeam.errorText}
    >
      <div className="space-y-2">
        <div className="py-1 space-y-1">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {newTeam.name}
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Acme Inc."
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)} // Actualiza el estado al cambiar
          />
          <p className="text-muted-foreground text-sm">{newTeam.subName}</p>
        </div>
        <div className="py-1 space-y-1">
          <label
            htmlFor="language"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {newTeam.language}
          </label>

          <Select
            name="language"
            onValueChange={handleLanguageChange}
            value={language}
          >
            <SelectTrigger>
              <SelectValue placeholder="Idioma" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LanguageType).map((i, index) => (
                <SelectItem key={index} value={i}>
                  {languages[i]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </OnboardingBase>
  );
}
