import Preview from "@/components/preview";
import Results from "@/components/results";
import Upload from "@/components/upload";
import { ImageProcessingResponse } from "@/models/image-processing";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import Loader from "react-spinners/RingLoader";
import { useTheme } from "@/providers/theme";
import {
  EScreenSizeBreakpoints,
  get_active_screen_size_breakpoint,
} from "@/utils/style";
import useWindowSize from "@/hooks/use-window-size";

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

  const getOrientation = (): "vertical" | "horizontal" => {
    const breakpoint = get_active_screen_size_breakpoint();

    if (breakpoint >= EScreenSizeBreakpoints.xl) {
      return "vertical";
    }

    return "horizontal";
  };

  const [width] = useWindowSize();
  const [isLoading, setIsLoading] = useState(() => false);
  const [orientation, setOrientation] = useState(() => getOrientation());
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

  useEffect(() => {
    setOrientation(getOrientation());
  }, [width]);

  return (
    <>
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader size={300} color={loaderColor()} />
        </div>
      )}
      <div
        className={clsx(
          "flex flex-col xl:flex-row h-full w-full px-5 xl:px-0",
          {
            "opacity-10 pointer-events-none": isLoading,
          },
        )}
      >
        <div className="flex flex-col h-1/2 xl:h-full w-full xl:w-1/2 py-8 items-center xl:px-5">
          <div className="flex flex-col h-1/2 w-full xl:w-2/3 px-8 pb-6">
            <h1 className="h-16 text-2xl font-extrabold self-start">
              Upload Form
            </h1>
            <Upload
              className="border-2 py-10 rounded-md"
              setData={setData}
              setIsLoading={setIsLoading}
            />
          </div>
          <Separator />
          <Preview
            className="h-1/2 w-full xl:w-2/3"
            title="Processed"
            url={data.processed_image}
          />
        </div>
        <Separator orientation={orientation} />
        <div className="flex items-center h-1/2 xl:h-full w-full xl:w-1/2 xl:px-5">
          <Results className="h-2/3" data={data.results} />
        </div>
      </div>
    </>
  );
}

export default Home;
