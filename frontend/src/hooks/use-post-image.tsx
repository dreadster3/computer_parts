import { useMutation } from "@tanstack/react-query";
import useImageProcessorClient from "./use-image-processor-client";
import { randomChoices } from "@/utils/arrays";

interface IPostImageProps {
  image?: File;
  url?: string;
  confidence_threshold: number;
}

function usePostImage() {
  const client = useImageProcessorClient();

  const { mutate, isPending, data, isSuccess, isError, isIdle } = useMutation({
    mutationFn: ({ image, url, confidence_threshold }: IPostImageProps) => {
      if (url !== undefined && url !== "") {
        return client.process_url_async(url, confidence_threshold);
      }

      if (image !== undefined) {
        return client.process_image_async(image, confidence_threshold);
      }

      throw Error("Should never happen");
    },
    onSuccess: (data) => {
      const timestamp = Math.floor(Date.now() / 1000);
      data.processed_image = data.processed_image.concat(
        "?",
        timestamp.toString(),
      );
      data.results.forEach((result) => {
        const amount = Math.floor(Math.random() * 5);
        const models = randomChoices([...Array(amount).keys()], amount).map(
          (number) => `${result.label}${number}`,
        );
        result.confidence = Math.round(result.confidence * 100) / 100;

        result.models.push(...models);
      });
    },
  });

  return {
    postImage: mutate,
    isPending,
    data,
    isSuccess,
    isIdle,
    isError,
    isSettled: isError || isSuccess,
  };
}

export default usePostImage;
