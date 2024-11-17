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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface IUploadProps {
  className?: string;
  setData: (data: IImageProcessingResponse) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const formSchema = z
  .object({
    url: z.string().url().optional().or(z.literal("")),
    image: z
      .instanceof(FileList)
      .optional()
      .refine((file) => {
        return (file?.length ?? 0) <= 1;
      }, "Too many files")
      .refine(
        (file) => file?.[0]?.size ?? 0 <= MAX_UPLOAD_SIZE,
        "Max upload size is 5MB",
      )
      .refine(
        (file) => IMAGE_TYPES.includes(file?.[0]?.type ?? "image/jpeg"),
        "Invalid file type",
      ),
    confidence_threshold: z.preprocess(
      (a) => Number(z.any().parse(a)),
      z.number().gte(0).lte(1),
    ),
  })
  .refine(
    (val) => {
      // XOR
      if ((val.image?.length ?? 0) > 0 && (val.url?.length ?? 0) > 1) {
        return false;
      }
      return true;
    },
    { message: "Specify Image or URL", path: ["image"] },
  );

function Upload({ setData, className, setIsLoading }: IUploadProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      image: undefined,
      confidence_threshold: 0.5,
    },
  });
  const fileRef = form.register("image");
  const { postImage, isPending } = usePostImage();

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    postImage(
      {
        image: values.image?.[0],
        url: values.url,
        confidence_threshold: values.confidence_threshold,
      },
      {
        onSuccess: (data) => {
          setData(data);
          form.resetField("url");
          form.resetField("image");
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
            render={() => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept={IMAGE_TYPES.join(",")}
                    {...fileRef}
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
