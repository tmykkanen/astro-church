import { SearchIcon } from "lucide-react";
import { type FC, type HTMLProps, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/useDebounce";
import { useNanostoreURLSync } from "@/hooks/useNanostoreURLSync";

/* -------------------------------------------------------------------------- */
/*                                   Types                                     */
/* -------------------------------------------------------------------------- */
interface SearchProps {
  type: "sermons" | "blog";
}

/* -------------------------------------------------------------------------- */
/*                                Search Component                             */
/* -------------------------------------------------------------------------- */
const Search: FC<HTMLProps<HTMLDivElement> & SearchProps> = ({
  className,
  type,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkeys("meta+k", (e) => {
    e.preventDefault();
    inputRef.current?.focus();
  });

  // Determine the nanostore key based on type
  const storeKey = type === "sermons" ? "sermonSearchTerm" : "blogSearchTerm";

  const { value: storeValue, setValue } = useNanostoreURLSync<string>(storeKey);

  // Local input state
  const [inputValue, setInputValue] = useState(storeValue ?? "");

  // Debounce the store value to avoid too many updates
  const debouncedValue = useDebounce(inputValue, 300);

  // Sync debounced value back to Nanostore + URL
  useEffect(() => {
    setValue(debouncedValue || undefined);
  }, [debouncedValue, setValue]);

  // Keep input in sync if URL/store changes externally
  useEffect(() => {
    setInputValue(storeValue ?? "");
  }, [storeValue]);

  const placeholder =
    type === "sermons" ? "Search sermons..." : "Search posts...";

  return (
    <InputGroup className={className}>
      <InputGroupInput
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        placeholder={placeholder}
        className="placeholder:text-muted-foreground text-foreground placeholder:italic"
        ref={inputRef}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default Search;
