
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const TabButton = ({ onClick, tooltip, children }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          variant={"outline"}
          className="cursor-pointer w-8 h-8"
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{tooltip}</TooltipContent>
    </Tooltip>
  );
};

export default TabButton;
