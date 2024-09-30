"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  CirclePlus,
  Gem,
  CreditCard,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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

const settings = [
  {
    id: "general",
    name: "General",
    icon: <Settings className={cn("mr-2 h-4 w-4")} />,
  },
  {
    id: "members",
    name: "Members",
    icon: <Users className={cn("mr-2 h-4 w-4")} />,
  },
  {
    id: "plans",
    name: "Plans",
    icon: <CreditCard className={cn("mr-2 h-4 w-4")} />,
  },
  {
    id: "billing",
    name: "Billing",
    icon: <Gem className={cn("mr-2 h-4 w-4")} />,
  },
];

export function Combobox({
  options,
  optionSelected,
  subject,
  routerHandler,
  createNewTeamRoute,
  settingsRouteHandler,
}: {
  options: Option[];
  optionSelected: Option;
  subject: string;
  routerHandler: (route: string) => void;
  createNewTeamRoute: () => void;
  settingsRouteHandler: (route: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {optionSelected?.name ? optionSelected.name : `Search ${subject}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Find a ${subject}`} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Teams">
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
                  {team.name}
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
                <CirclePlus className={cn("mr-2 h-6 w-6")} />
                Create {subject}
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <CommandList>
            <CommandGroup heading="Settings">
              {settings.map((setting: Option) => (
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
                    {setting.icon}
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
