"use client";

import * as React from "react";
import { Check, ChevronsUpDown, CirclePlus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Option } from "@/types/types";
import { ChevronRight } from "lucide-react";
import { Separator } from "./ui/separator";
import { useDashboardLanguage } from "./context/dashboardLanguageContext";

export function Combobox({
  options,
  optionSelected,
  subject,
  routerHandler,
  createNewTeamRoute,
  settingsRouteHandler,
  navItems,
  fromColor,
  toColor,
}: {
  options: Option[];
  optionSelected: Option;
  subject: string;
  routerHandler: (route: string) => void;
  createNewTeamRoute: () => void;
  settingsRouteHandler: (route: string) => void;
  navItems: Option[];
  fromColor: string;
  toColor: string;
}) {
  const { t } = useDashboardLanguage();
  const dashboard = t("app.LAYOUT");
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between"
        >
          <div
            className={`h-7 w-7 rounded-full bg-gradient-to-r ${fromColor} ${toColor} mr-2`}
          >
            {/* <Image
              src="/avatar.png"
              width={36}
              height={36}
              alt="Avatar"
              className=" rounded-full"
            /> */}
          </div>
          <span className="truncate w-2/3 flex justify-start">
            {optionSelected?.name
              ? optionSelected.name
              : `Search ${subject}...`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          {/* <CommandInput placeholder={`Find a ${subject}`} /> */}
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading={dashboard.teams}>
              {options.map((team: Option) => (
                <CommandItem
                  className="pl-3 flex justify-between items-center"
                  key={team.id}
                  value={team.id}
                  onSelect={(currentValue) => {
                    setOpen(false);
                    routerHandler(currentValue);
                  }}
                >
                  <span className="truncate w-full">{team.name}</span>
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      optionSelected.id === team.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
              <CommandItem className="flex" onSelect={createNewTeamRoute}>
                <CirclePlus className={cn("mr-2 h-4 w-4")} />
                {dashboard.create} {subject}
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <Separator />
          <CommandList>
            <CommandGroup heading="Settings">
              {navItems?.map((setting: Option) => (
                <CommandItem
                  className="flex justify-between items-center"
                  key={setting.id}
                  value={setting.id}
                  onSelect={(currentValue) => {
                    setOpen(false);
                    settingsRouteHandler(currentValue);
                  }}
                >
                  <div className="flex items-center">
                    {setting.icon && <setting.icon className="mr-2 h-4 w-4" />}
                    {setting.name}
                  </div>
                  <ChevronRight className={cn("ml-2 h-4 w-4")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
