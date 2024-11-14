import Preview from "@/components/preview";
import Upload from "@/components/upload";
import { ImageProcessingResponse } from "@/models/image-processing";
import { useState } from "react";

function Home() {
  const [data, setData] = useState(
    () =>
      new ImageProcessingResponse({
        original_image: "",
        processed_image: "",
        results: [],
      }),
  );

  return (
    <div className="px-10">
      <div className="flex">
        <div className="p-5">
          <Preview title="Original" url={data.original_image} />
          <Preview title="Processed" url={data.processed_image} />
        </div>
        <div className="p-5">
          <Upload setData={setData} />
        </div>
      </div>
    </div>
  );
}

export default Home;
