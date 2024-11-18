from functools import cache
import os
from pydantic import Field
from ultralytics import YOLO
from pydantic_settings import BaseSettings, SettingsConfigDict
import logging


@cache
def load_model(path: str) -> YOLO:
    logger = logging.getLogger("uvicorn")
    logger.info("Loading model %s", os.path.basename(path))

    return YOLO(path)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="computerparts_")

    _models_path: str = "models"
    yolo_model_name: str = Field("20241107.pt")
    static_folder: str = Field("static")

    @property
    def uploads_folder(self) -> str:
        return os.path.join(self.static_folder, "uploads")

    @property
    def raw_images_folder(self) -> str:
        return os.path.join(self.uploads_folder, "raw")

    @property
    def processed_images_folder(self) -> str:
        return os.path.join(self.uploads_folder, "processed")

    def load_model(self) -> YOLO:
        self.__init__()

        return load_model(os.path.join(self.models_path, self.yolo_model_name))


settings = Settings()
