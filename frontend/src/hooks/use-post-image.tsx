import { useMutation } from "@tanstack/react-query";
import useImageProcessorClient from "./use-image-processor-client";
import { randomChoices } from "@/utils/arrays";

interface IPostImageProps {
  image?: File;
  url?: string;
}

function usePostImage() {
  const client = useImageProcessorClient();

  const { mutate, isPending, data, isSuccess, isError, isIdle } = useMutation({
    mutationFn: ({ image, url }: IPostImageProps) => {
      if (url !== undefined && url !== "") {
        return client.process_url_async(url);
      }

      if (image !== undefined) {
        return client.process_image_async(image);
      }

      throw Error("Should never happen");
    },
    onSuccess: (data) => {
      data.results.forEach((result) => {
        const amount = Math.floor(Math.random() * 5);
        const models = randomChoices([...Array(amount).keys()], amount).map(
          (number) => `${result.label}${number}`,
        );

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
