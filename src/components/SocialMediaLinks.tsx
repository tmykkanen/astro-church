import { Icon } from "@iconify/react";

import { ButtonLink } from "@/components/ButtonLink";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SocialMediaLinksProps {
  social: {
    name?: string | undefined;
    link?: string | undefined;
    icon?: string | undefined;
    hint?: string | undefined;
  }[];
}

interface SocialButtonProps {
  name: string;
  href: string;
  icon: string;
}

interface SocialButtonWithTooltipProps extends SocialButtonProps {
  hint: string;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ social }) => {
  return (
    <div className="flex">
      {social.map(({ name = "", link = "", icon = "", hint }) =>
        hint ? (
          <SocialButtonWithTooltip
            key={name}
            name={name}
            href={link}
            icon={icon}
            hint={hint}
          />
        ) : (
          <SocialButton key={name} name={name} href={link} icon={icon} />
        ),
      )}
    </div>
  );
};

const SocialButton: React.FC<SocialButtonProps> = ({ name, href, icon }) => {
  return (
    <ButtonLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`click link for ${name}`}
      variant="footer-icon"
    >
      <Icon icon={icon} />
    </ButtonLink>
  );
};

const SocialButtonWithTooltip: React.FC<SocialButtonWithTooltipProps> = ({
  name,
  href,
  icon,
  hint,
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ButtonLink
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`click link for ${name}`}
          variant="footer-icon"
        >
          <Icon icon={icon} />
        </ButtonLink>
      </TooltipTrigger>
      <TooltipContent>
        <p>{hint}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SocialMediaLinks;
