import {
  IImageProcessingResponse,
  ImageProcessingResponse,
} from "@/models/image-processing";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class ImageProcessorClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(instance?: AxiosInstance) {
    this.axiosInstance = instance ?? axios.create();
  }

  async process_image_async(image: File): Promise<IImageProcessingResponse> {
    const formData = new FormData();
    formData.append("image", image);

    const options: AxiosRequestConfig = {
      method: "POST",
      url: "/api/v1/detect/image",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await this.axiosInstance.request(options);

    return new ImageProcessingResponse(response.data);
  }

  async process_url_async(url: string): Promise<IImageProcessingResponse> {
    const data = {
      url: url,
    };

    const options: AxiosRequestConfig = {
      method: "POST",
      url: "/api/v1/detect/url",
      data: data,
    };

    const response = await this.axiosInstance.request(options);

    return new ImageProcessingResponse(response.data);
  }
}

export default ImageProcessorClient;
