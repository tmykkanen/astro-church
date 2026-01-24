import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

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
import { useNanostoreURLSync } from "@/hooks/useNanostoreURLSync";
import {
  type PreacherData,
  type SeriesData,
  isPreacherCollection,
  isSeriesCollection,
  isStringArray,
} from "@/lib/types";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                 Types                                      */
/* -------------------------------------------------------------------------- */
type ComboboxProps =
  | { type: "series"; data: SeriesData[] }
  | { type: "preacher"; data: PreacherData[] }
  | { type: "tag"; data: string[] };

interface Option {
  key: string | number;
  value: string;
  label: string;
}

/* -------------------------------------------------------------------------- */
/*                               Combobox Component                           */
/* -------------------------------------------------------------------------- */
const Combobox: React.FC<ComboboxProps> = ({ data: inputData, type }) => {
  /* ------------------------------------------------------------------------ */
  /*                                  Hooks                                  */
  /* ------------------------------------------------------------------------ */
  const [open, setOpen] = useState(false);
  const { value: selectedValue, setValue } = useNanostoreURLSync<string>(type);

  /* ------------------------------------------------------------------------ */
  /*                               Options & Label                             */
  /* ------------------------------------------------------------------------ */
  let label = "";
  let options: Option[] = [];

  switch (type) {
    case "series":
      if (!isSeriesCollection(inputData))
        throw new Error("Invalid data for series combobox");
      label = "Series";
      options = inputData.map((item) => ({
        key: item.id,
        value: item.id,
        label: item.data.title,
      }));
      break;

    case "preacher":
      if (!isPreacherCollection(inputData))
        throw new Error("Invalid data for preacher combobox");
      label = "Preacher";
      options = inputData.map((item) => ({
        key: item.id,
        value: item.id,
        label: item.data.name,
      }));
      break;

    case "tag":
      if (!isStringArray(inputData))
        throw new Error("Invalid data for tag combobox");
      label = "Tag";
      options = inputData.map((item, index) => ({
        key: index,
        value: item,
        label: item,
      }));
      break;

    default:
      throw new Error(`Unsupported combobox type: ${type}`);
  }

  const placeholder = options.find((o) => o.value === selectedValue)?.label;

  /* ------------------------------------------------------------------------ */
  /*                                 Handlers                                  */
  /* ------------------------------------------------------------------------ */

  const handleSelect = (value: string) => {
    setValue(value);
    setOpen(false);
  };

  /* ------------------------------------------------------------------------ */
  /*                                  Render                                    */
  /* ------------------------------------------------------------------------ */
  return (
    <div className="inline-flex h-9 items-stretch">
      <Label
        htmlFor={label}
        className="bg-muted flex h-full min-w-24 flex-1/4 items-center rounded-l-md border px-4 py-2 text-sm font-normal select-none sm:flex-1"
      >
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild id={label}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
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
