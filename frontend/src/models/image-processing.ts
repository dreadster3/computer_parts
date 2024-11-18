export interface IDetectionResult {
  label: string;
  confidence: number;
  image: string;
  models: string[];
}

export interface IImageProcessingResponse {
  original_image: string;
  processed_image: string;
  results: IDetectionResult[];
}

export class DetectionResult {
  label: string;
  confidence: number;
  image: string;
  models: string[];

  constructor(data: IDetectionResult) {
    this.label = data.label;
    this.confidence = data.confidence;
    this.image = data.image;
    this.models = data.models ?? [];
  }
}

export class ImageProcessingResponse {
  original_image: string;
  processed_image: string;
  results: DetectionResult[];

  constructor(data: IImageProcessingResponse) {
    this.original_image = data.original_image;
    this.processed_image = data.processed_image;
    this.results = data.results.map((result) => new DetectionResult(result));
  }
}
