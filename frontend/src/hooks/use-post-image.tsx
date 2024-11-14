import { useMutation } from "@tanstack/react-query";
import useImageProcessorClient from "./use-image-processor-client";

interface IPostImageProps {
  image?: File;
  url?: string;
}

function usePostImage() {
  const client = useImageProcessorClient();

  const { mutate, isPending, data } = useMutation({
    mutationFn: ({ image, url }: IPostImageProps) => {
      if (url !== undefined && url !== "") {
        return client.process_url_async(url);
      }

      if (image !== undefined) {
        return client.process_image_async(image);
      }

      throw Error("Should never happen");
    },
  });

  return { postImage: mutate, isPending, data };
}

export default usePostImage;
