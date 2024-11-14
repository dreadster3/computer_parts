import axios from "axios";
import ImageProcessorClient from "@/clients/image-processor";

const instance = axios.create({
  // baseURL: import.meta.env.VITE_IMAGE_PROCESSOR_URL,
  baseURL: "http://localhost:8000",
});

function useImageProcessorClient(): ImageProcessorClient {
  return new ImageProcessorClient(instance);
}

export default useImageProcessorClient;
