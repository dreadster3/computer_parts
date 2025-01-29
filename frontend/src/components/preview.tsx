import { cn } from "@/lib/utils";

interface IPreviewProps {
  title: string;
  url?: string;
  className?: string;
}

function Preview({ title, url, className }: IPreviewProps) {
  const sanitize_url = (url: string | undefined) => {
    if (url === undefined || url === "") {
      return "/placeholder.png";
    }

    return url;
  };

  return (
    <div className={cn("flex flex-col w-full items-center p-8", className)}>
      <h1 className="self-start">{title}</h1>
      <img
        className="w-full h-auto max-h-[50vh] rounded-md object-contain border-2"
        src={sanitize_url(url)}
      />
    </div>
  );
}

export default Preview;
