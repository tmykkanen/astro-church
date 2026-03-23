import { Check, ChevronDown } from "lucide-react";
import { type FC, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { PreacherData, SeriesData } from "@/data/types";
import { cn } from "@/lib/utils";

// import type { SearchSchemaProps } from "../routes/$all";

interface ComboboxProps {
  type: "series" | "preacher" | "tag";
  data: SeriesData[] | PreacherData[] | string[];
  value: string;
  setValue: (v: string) => void;
}

const Combobox: FC<ComboboxProps> = ({
  type,
  data,
  value: selectedValue,
  setValue: setSelectedValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const options = data.map((item, index) => ({
    key: typeof item === "string" ? index : item.id,
    value: typeof item === "string" ? item : item.id,
    label:
      typeof item === "string"
        ? item
        : item.collection === "preachers"
          ? item.data.name
          : item.data.title,
  }));

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  const placeholder = options.find((o) => o.value === selectedValue)?.label;

  const label = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="inline-flex h-9 items-stretch">
      <Label
        htmlFor={label}
        className="bg-muted flex h-full min-w-24 flex-1/4 items-center rounded-l-md border px-4 py-2 text-sm font-normal select-none sm:flex-1"
      >
        {label}
      </Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild id={label}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className={cn(
              "bg-muted text-muted-foreground -ml-px flex-[65%] justify-between overflow-hidden rounded-l-none text-sm",
              selectedValue
                ? "text-foreground"
                : "text-muted-foreground font-normal italic",
            )}
          >
            {selectedValue ? placeholder : `Filter by ${type}`}

            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popper-anchor-width) p-2">
          <Command>
            <CommandInput placeholder={`Search ${type}...`} className="h-9" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options?.map(({ key, value, label }) => (
                  <CommandItem
                    key={key}
                    value={value}
                    onSelect={() => handleSelect(value)}
                    className="px-4"
                  >
                    {label}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedValue === value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Combobox;
