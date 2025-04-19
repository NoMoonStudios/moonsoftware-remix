import { ComponentType, createElement } from "react";
import LinkData from "~/lib/Modules/LinkData";
import { PortfolioLink } from "~/models/Portfolio";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface LinkRendererProps {
  link: PortfolioLink;
  className?: string;
  tooltip?: true
}

interface IconRendererProps {
  platform: string | PortfolioLink;
  className?: string;
  tooltip?: true
}

const IconRenderer = ({ platform, className }: IconRendererProps) => (
  <>
    {createElement(
      typeof platform === "string"
        ? (LinkData[platform].icon as ComponentType<{className?: string}>)
        : (LinkData[platform.platform].icon as ComponentType<{className?: string}>),
       { className: className + " cursor-pointer" }
      )}
  </>
);
const LinkRenderer = ({ link, className, tooltip }: LinkRendererProps) => (
  <>
    {tooltip ? <Tooltip>
      <TooltipTrigger>
        <IconRenderer platform={link} className={className} />
      </TooltipTrigger>

      <TooltipContent side="bottom">
        {link.text}</TooltipContent>
    </Tooltip> :
    <IconRenderer platform={link} className={className} />}
  </>
);

export default LinkRenderer
export { IconRenderer }