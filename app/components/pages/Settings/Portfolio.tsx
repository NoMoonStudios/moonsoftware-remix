import { ChevronDown, ChevronUp, Plus, Trash, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import LinkRenderer, { IconRenderer } from "~/components/ui/link-renderer";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import LinkData from "~/lib/Modules/LinkData";
import { PortfolioLink } from "~/models/Portfolio";
import { UserInfo } from "~/types/init";

type LinkItem = {
  icon: React.ComponentType<{ className?: string }>;
  url: string;
};

type Platform = string;

interface LinkProps {
  link: PortfolioLink;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}

const Link = ({ link, onMoveUp, onMoveDown, onDelete }: LinkProps) => (
  <div className="flex items-center gap-2 bg-gray-900 w-full p-1 rounded">
    <LinkRenderer className="ml-2 w-6 h-6" link={link} />
    <p className="font-medium min-w-[100px]">{link.text}</p>
    <p className="text-gray-400 overflow-x-hidden text-sm">{link.url}</p>
    <div className="ml-auto flex items-center gap-1">
      <Button variant="ghost" size="icon" onClick={onMoveUp}>
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onMoveDown}>
        <ChevronDown className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

interface PlatformPickerProps {
  link: PortfolioLink;
  onPlatformChange: (platform: Platform) => void;
  onColorChange: (color: string) => void;
  onTextChange: (text: string) => void;
}

const PlatformPicker = ({
  link,
  onPlatformChange,
  onColorChange,
  onTextChange,
}: PlatformPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <LinkRenderer link={link} />
        </Button>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl p-6 shadow-lg max-w-[90vw] w-[480px]">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg font-medium">
              Select an icon
            </DialogTitle>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(LinkData) as Platform[]).map((platform) => (
              <Button
                key={platform}
                variant="outline"
                size="icon"
                onClick={() => {
                  onPlatformChange(platform);
                  onTextChange(
                    platform === "custom"
                      ? ""
                      : `${platform[0].toUpperCase()}${platform.slice(1)}`
                  );
                  setIsOpen(false);
                }}
              >
                <IconRenderer platform={platform} />
              </Button>
            ))}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

type LinkFormState = {
  links: PortfolioLink[];
};
interface LinkFormProps {
  formState: LinkFormState;
  setFormState: React.Dispatch<React.SetStateAction<LinkFormState>>;
  isLoading: boolean;
}
const LinkForm = ({ formState, setFormState, isLoading }: LinkFormProps) => {
  const [newLink, setNewLink] = useState<PortfolioLink>({
    platform: "custom",
    url: "",
    text: "",
    iconColor: "#ffffff",
  });
  const [linkUrlSuffix, setLinkUrlSuffix] = useState("");
  const addLink = () => {
    if (isLoading) return;

    if (!newLink.text || !newLink.url) return;

    const baseUrl = (LinkData[newLink.platform as Platform] as LinkItem).url;
    const finalUrl =
      newLink.platform === "custom"
        ? linkUrlSuffix
        : `${baseUrl}${linkUrlSuffix}`;

    setFormState((prev) => ({
      ...prev,
      links: [...prev.links, { ...newLink, url: finalUrl }],
    }));

    setNewLink({ platform: "custom", text: "", url: "", iconColor: "#ffffff" });
    setLinkUrlSuffix("");
  };

  return (
    <div className="flex flex-col gap-4">
      <Label className="text-lg">Links</Label>

      <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
        {formState.links.map((link, index) => (
          <Link
            key={index}
            link={link}
            onMoveUp={
              index > 0
                ? () => {
                    const updated = [...formState.links];
                    [updated[index], updated[index - 1]] = [
                      updated[index - 1],
                      updated[index],
                    ];
                    setFormState((prev) => ({ ...prev, links: updated }));
                  }
                : undefined
            }
            onMoveDown={
              index < formState.links.length - 1
                ? () => {
                    const updated = [...formState.links];
                    [updated[index], updated[index + 1]] = [
                      updated[index + 1],
                      updated[index],
                    ];
                    setFormState((prev) => ({ ...prev, links: updated }));
                  }
                : undefined
            }
            onDelete={() => {
              const updated = formState.links.filter((_, i) => i !== index);
              setFormState((prev) => ({ ...prev, links: updated }));
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <PlatformPicker
          link={newLink}
          onPlatformChange={(platform) =>
            setNewLink((prev) => ({
              ...prev,
              platform,
              text:
                platform === "custom"
                  ? prev.text
                  : `${platform[0].toUpperCase()}${platform.slice(1)}`,
            }))
          }
          onColorChange={(color) =>
            setNewLink((prev) => ({ ...prev, iconColor: color }))
          }
          onTextChange={(text) => setNewLink((prev) => ({ ...prev, text }))}
        />

        <Input
          value={newLink.text}
          onChange={(e) =>
            setNewLink((prev) => ({ ...prev, text: e.target.value }))
          }
          className="w-40 h-full"
          placeholder="Text"
          disabled={isLoading}
        />

        <div className="border rounded flex items-center p-2 gap-1">
          <span className="text-sm opacity-70">
            {(LinkData[newLink.platform as Platform] as LinkItem).url}
          </span>
          <input
            type="text"
            value={linkUrlSuffix}
            onChange={(e) => setLinkUrlSuffix(e.target.value)}
            className="w-min outline-none border-none"
            placeholder="Link suffix"
            disabled={isLoading}
          />
        </div>

        <Button variant="outline" size="icon" onClick={addLink}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface PortfolioProps {
  userInfo: UserInfo;
}

const Portfolio = ({ userInfo }: PortfolioProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formState, setFormState] = useState({
    displayName: userInfo.displayName,
    about: "",
    enabled: false,
    showTimestamps: false,
    links: [] as PortfolioLink[],
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("data", JSON.stringify(formState));

      const response = await fetch("/api/v1/portfolio/update", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast.success("Portfolio updated successfully");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/v1/portfolio/${userInfo.username}`);
        const data = await response.json();

        setFormState({
          displayName: userInfo.displayName,
          about: response.status === 404 ? userInfo.bio : "",
          enabled: false,
          showTimestamps: false,
          links: [],
          ...data,
        });
      } catch {
        toast.error("Failed to load portfolio data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userInfo]);

  return (
    <div className="h-full flex flex-col">
      <div className="text-sm text-muted-foreground text-center absolute top-0 left-0 bg-gray-900 border-b-1 w-full p-1 grid grid-cols-3 ">
      <span className="flex items-center justify-center gap-2"><TriangleAlert/>EXPERIMENTAL</span> <span>Early Work in Progress</span> <span className="flex items-center justify-center gap-2">No Mulas Allowed<TriangleAlert/></span>
      </div>
      <div className="grid grid-cols-2 gap-6 mt-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label className="font-medium">Display Name</Label>
            <Input
              value={formState.displayName}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
              placeholder="Display Name"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-medium">Bio</Label>
            <Textarea
              value={formState.about}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, about: e.target.value }))
              }
              className="h-30 resize-none"
              placeholder="Enter your bio"
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="flex gap-4">
            <div className="flex flex-col items-center gap-2">
              <Label>Portfolio Enabled</Label>
              <Switch
                checked={formState.enabled}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, enabled: checked }))
                }
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label>Show Timestamps</Label>
              <Switch
                checked={formState.showTimestamps}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, showTimestamps: checked }))
                }
              />
            </div>
          </div>
        </div>
        <LinkForm
          formState={formState}
          setFormState={
            setFormState as React.Dispatch<React.SetStateAction<LinkFormState>>
          }
          isLoading={isLoading}
        />
      </div>

      <div className="mt-auto flex items-center gap-2 justify-end">
        {isLoading && <CgSpinner size={20} className="animate-spin" />}
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Portfolio;
