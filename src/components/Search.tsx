import { SearchIcon } from "lucide-react";
import { type FC } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface SearchProps {
  placeholder: string;
  value: string;
  setValue: (v: string) => void;
}

const Search: FC<SearchProps> = ({ placeholder, value, setValue }) => {
  return (
    <>
      <InputGroup className="bg-muted text-muted-foreground">
        <InputGroupInput
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={placeholder}
          className="placeholder:text-muted-foreground text-foreground placeholder:italic"
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </>
  );
};

export default Search;
