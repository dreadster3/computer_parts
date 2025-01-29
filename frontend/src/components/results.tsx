import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { IDetectionResult } from "@/models/image-processing";

interface IResultProps {
  id: number;
  image: string;
  label: string;
  confidence: number;
  models: string[];
}

function Result({ id, image, label, confidence, models }: IResultProps) {
  return (
    <div className="flex flex-col max-h-full w-full h-full items-center">
      <img
        className="w-full h-5/6 rounded-md object-contain border-2"
        src={image}
      />
      <div className="flex flex-col h-1/6 w-full">
        <div>
          <p>
            <span className="font-extrabold">Id: </span>
            {id}
          </p>
        </div>
        <div>
          <p>
            <span className="font-extrabold">Label: </span>
            {label}
          </p>
        </div>
        <div>
          <p>
            <span className="font-extrabold">Confidence: </span>
            {Math.round(confidence * 100)}%
          </p>
        </div>
        <div>
          <div>
            <h2 className="font-extrabold">Models: </h2>
            <ol className="list-decimal list-inside indent-4">
              {models.map((model) => (
                <li>{model}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

interface IResultsProps {
  className?: string;
  data: IDetectionResult[];
}

function Results({ className, data }: IResultsProps) {
  const calculateBasisClassName = (amount: number) => {
    const half = Math.floor(amount / 2);
    if (half <= 1) {
      return "";
    }

    return `basis-1/${Math.min(3, half).toString()}`;
  };

  return (
    <div
      className={cn(
        "flex flex-col w-full h-full p-8 xl:px-10 xl:py-8 items-center justify-center",
        className,
      )}
    >
      <h1 className="self-start pb-8">Results</h1>

      <div className="flex w-full h-full px-16 xl:px-0 justify-center items-center ">
        <Carousel
          className="flex w-full xl:w-5/6 h-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="h-full max-h-[50vh] -ml-0">
            {data.map((item, idx) => (
              <CarouselItem
                className={cn(
                  "content-center",
                  calculateBasisClassName(data.length),
                )}
                key={idx}
              >
                <Result id={idx} {...item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}

export default Results;
