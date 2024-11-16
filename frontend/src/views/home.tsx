import Preview from "@/components/preview";
import Results from "@/components/results";
import Upload from "@/components/upload";
import { ImageProcessingResponse } from "@/models/image-processing";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import Loader from "react-spinners/RingLoader";
import { useTheme } from "@/providers/theme";

function Home() {
  const [data, setData] = useState(
    () =>
      new ImageProcessingResponse({
        original_image: "",
        processed_image: "",
        results: [
          {
            label: "None",
            confidence: 0,
            image: "/placeholder.png",
            models: [],
          },
        ],
      }),
  );

  const [isLoading, setIsLoading] = useState(() => false);
  const { theme } = useTheme();

  const loaderColor = () => {
    let localTheme = theme;
    if (localTheme == "system") {
      localTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    if (localTheme == "dark") {
      return "#f1f5f9";
    }

    return "#0f172a";
  };

  return (
    <>
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader size={300} color={loaderColor()} />
        </div>
      )}
      <div
        className={clsx("flex h-full w-full", {
          "opacity-10 pointer-events-none": isLoading,
        })}
      >
        <div className="flex flex-col h-full basis-1/2 py-16 px-5 items-center">
          <Upload
            className="basis-1/2 justify-end w-2/3 p-8 h-1/3"
            setData={setData}
            setIsLoading={setIsLoading}
          />
          <Separator />
          <Preview
            className="w-2/3 h-2/3 justify-self-end"
            title="Processed"
            url={data.processed_image}
          />
        </div>
        <Separator orientation="vertical" />
        <div className="flex items-center h-full basis-1/2 px-5">
          <Results className="h-2/3" data={data.results} />
        </div>
      </div>
    </>
  );
}

export default Home;
