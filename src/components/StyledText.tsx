import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      default: "",
      meta: "text-muted-foreground text-xs md:text-sm",
      button:
        "text-xs tracking-widest uppercase sm:text-sm whitespace-normal text-center font-semibold",
      subheading: "text-lg md:text-xl text-foreground font-normal",
      heading: "text-xl  uppercase md:text-2xl tracking-wider",
      display: "text-xl font-bold uppercase md:text-2xl",
      displayLG: "text-xl md:text-3xl uppercase font-bold",
      displayXL: "text-5xl font-bold uppercase sm:text-7xl",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface StyledTextAs {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "address" | "span";
}

const StyledText: React.FC<
  StyledTextAs & React.ComponentProps<"h1"> & VariantProps<typeof textVariants>
> = ({ as: As, className, variant, children }, ...props) => {
  return (
    <As className={cn(textVariants({ variant, className }))} {...props}>
      {children}
    </As>
  );
};

export { StyledText };
