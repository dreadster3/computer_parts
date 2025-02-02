import os
from functools import cache

from pydantic_settings import BaseSettings, SettingsConfigDict
from ultralytics import YOLO


@cache
def load_model(path: str) -> YOLO:
    return YOLO(path)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="computerparts")

    _models_path: str = "models"
    yolo_model_name: str = "20241107.pt"

    static_folder: str = "static"
    _uploads_folder: str = os.path.join(static_folder, "uploads")
    _raw_images_folder: str = os.path.join(_uploads_folder, "raw")
    _processed_images_folder: str = os.path.join(_uploads_folder, "processed")

    def load_model(self) -> YOLO:
        self.__init__()

        return load_model(os.path.join(self._models_path, self.yolo_model_name))


settings = Settings()
