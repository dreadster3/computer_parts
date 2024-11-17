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
    <div className="flex flex-col w-full h-full items-center">
      <img
        className="w-full h-full rounded-md object-contain border-2"
        src={image}
      />
      <div className="flex flex-col w-full">
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
            {confidence * 100}%
          </p>
        </div>
        <div>
          <p>
            <span className="font-extrabold">Models: </span>[{models.join(",")}]
          </p>
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
        "flex flex-col w-full h-full px-10 py-8 items-center justify-center",
        className,
      )}
    >
      <div className="flex w-5/6 justify-start">
        <h1 className="pb-8">Results</h1>
      </div>

      <Carousel
        className="flex w-5/6 h-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="h-full -ml-0">
          {data.map((item, idx) => (
            <CarouselItem
              className={cn("pl-10", calculateBasisClassName(data.length))}
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
  );
}

export default Results;
