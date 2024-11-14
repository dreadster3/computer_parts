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
import { useState } from "react";

interface IUploadProps {
  setData: (data: IImageProcessingResponse) => void;
}

function Upload({ setData }: IUploadProps) {
  const form = useForm({
    defaultValues: {
      url: "",
      image: "",
    },
  });
  const [file, setFile] = useState<File>();
  const { postImage } = usePostImage();

  function onSubmit(values: FieldValues) {
    postImage(
      { image: file, url: values.url },
      {
        onSuccess: (data) => {
          setData(data);
          form.reset({
            url: "",
            image: "",
          });
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
  );
}

export default Upload;
