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
    <div className={cn(className, "flex flex-col w-full items-center p-8")}>
      <h1 className="h-16">{title}</h1>
      <img
        className="w-full h-full rounded-md object-scale-down border-2"
        src={sanitize_url(url)}
      />
    </div>
  );
}

export default Preview;
