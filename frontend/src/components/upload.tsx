import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { FieldValues, useForm } from "react-hook-form";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TooltipArrow, TooltipPortal } from "@radix-ui/react-tooltip";
import usePostImage from "@/hooks/use-post-image";
import { IImageProcessingResponse } from "@/models/image-processing";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import NumberInput from "./number-input";

interface IUploadProps {
  className?: string;
  setData: (data: IImageProcessingResponse) => void;
  setIsLoading: (isLoading: boolean) => void;
}

function Upload({ setData, className, setIsLoading }: IUploadProps) {
  const form = useForm({
    defaultValues: {
      url: "",
      image: "",
      confidence_threshold: 0.5,
    },
  });
  const [file, setFile] = useState<File>();
  const { postImage, isPending } = usePostImage();

  function reset(values: FieldValues) {
    form.reset({
      confidence_threshold: values.confidence_threshold,
    });
    setFile(undefined);
  }

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  function onSubmit(values: FieldValues) {
    postImage(
      {
        image: file,
        url: values.url,
        confidence_threshold: values.confidence_threshold,
      },
      {
        onSuccess: (data) => {
          setData(data);
          reset(values);
        },
      },
    );
  }

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-2/3 h-full"
        >
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="url" {...field} />
                </FormControl>
                <FormDescription>The url of any image</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    {...field}
                    onChange={(e) => {
                      setFile(e.target.files?.[0]);
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormDescription>Upload any image</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confidence_threshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confidence Threshold</FormLabel>
                <FormControl>
                  <NumberInput
                    placeholder={"0.5"}
                    step={0.1}
                    min={0}
                    max={1}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Threshold for detecting objects in image
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <TooltipProvider delayDuration={700}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit">Submit</Button>
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent side="bottom">
                  <p>Set either url or image but not both</p>
                  <TooltipArrow />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>
          </TooltipProvider>
        </form>
      </Form>
    </div>
  );
}

export default Upload;
