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
            <span className="font-extrabold">Id:</span>
            {id}
          </p>
        </div>
        <div>
          <p>
            <span className="font-extrabold">Label:</span>
            {label}
          </p>
        </div>
        <div>
          <p>
            <span className="font-extrabold">Confidence:</span>
            {confidence}
          </p>
        </div>
        <div>
          <p>
            <span className="font-extrabold">Models:</span>[{models.join(",")}]
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
  return (
    <div
      className={cn("flex w-full h-full px-10 py-8 justify-center", className)}
    >
      <Carousel
        className="flex w-5/6 h-full items-center justify-center"
        opts={{
          align: "center",
          loop: true,
        }}
      >
        <CarouselContent className="h-full w-full">
          {data.map((item, idx) => (
            <CarouselItem key={idx}>
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
