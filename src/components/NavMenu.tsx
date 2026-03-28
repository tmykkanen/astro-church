import { ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MenuItem } from "@/data/types";

const NavMenu: React.FC<React.ComponentProps<"nav"> & { menu: MenuItem[] }> = ({
  menu,
  ...props
}) => {
  return (
    <nav {...props}>
      {menu.map(({ label, submenu, path }) =>
        submenu.length > 0 ? (
          <DropdownMenu key={label}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="group flex items-center gap-1 rounded-md px-3 py-2 text-sm tracking-widest uppercase xl:text-base"
              >
                {label}
                <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-out group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="animate-in fade-in slide-in-from-top-1 w-56"
            >
              {submenu.map((subItem) => (
                <DropdownMenuItem key={subItem.path} asChild>
                  <a href={`/${subItem.path}`}>{subItem.label}</a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <a
            key={label}
            href={`/${path}`}
            className="hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 text-sm font-medium tracking-widest text-nowrap uppercase xl:text-base"
          >
            {label}
          </a>
        ),
      )}
    </nav>
  );
};

export default NavMenu;
