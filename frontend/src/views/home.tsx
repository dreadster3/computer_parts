import Preview from "@/components/preview";
import Results from "@/components/results";
import Upload from "@/components/upload";
import { ImageProcessingResponse } from "@/models/image-processing";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

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

  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col h-full w-1/2 px-5">
        <Upload className="p-8 h-1/3" setData={setData} />
        <Separator />
        <Results className="h-2/3" data={data.results} />
      </div>
      <div className="flex flex-col h-full w-1/2 px-5 pb-5 items-center">
        <Preview className="h-1/2" title="Original" url={data.original_image} />
        <Preview
          className="h-1/2"
          title="Processed"
          url={data.processed_image}
        />
      </div>
    </div>
  );
}

export default Home;
