"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { LanguageType } from "@prisma/client";
// import { ScrollArea } from "@/components/ui/scroll-area"

type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  selectedDefault: LanguageType[];
  defaultLanguages: LanguageType;
}

export function MultiSelect({
  options = [],
  onChange,
  placeholder = "Seleccionar items...",
  selectedDefault,
  defaultLanguages,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>(selectedDefault);

  React.useEffect(() => {
    setSelected(selectedDefault);
  }, [selectedDefault]);

  const handleSelect = React.useCallback(
    (value: string) => {
      const updatedSelected =
        selected.includes(value) && value !== defaultLanguages
          ? selected.filter((item) => item !== value)
          : [...selected, value];

      setSelected(updatedSelected);
      onChange?.(updatedSelected);
    },
    [selected, onChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1">
            <span className="text-muted-foreground">{placeholder}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {/* <ScrollArea className="h-60"> */}
              {options?.map((option, index) => (
                <CommandItem
                  key={index}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  {option.label}
                </CommandItem>
              ))}
              {/* </ScrollArea> */}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
