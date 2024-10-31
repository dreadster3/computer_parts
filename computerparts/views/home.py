import os
import tkinter
from ultralytics import YOLO
import sys

from computerparts.components import ImageUploader, ImageViewer

# Define the path to the data file
if getattr(sys, 'frozen', False):  # If bundled as an executable
    base_path = sys._MEIPASS
else:
    base_path = os.path.abspath(".")


class MainApplication(tkinter.Frame):
    def __init__(self, parent: tkinter.Tk, *args, **kwargs):
        super().__init__(parent, *args, **kwargs)
        self.parent = parent
        self.parent.columnconfigure(0, weight=1)
        self.parent.rowconfigure(0, weight=1)
        self.parent.title("Computer Parts")
        self.parent.geometry("800x600")

        self.grid(column=0, row=0, sticky="nsew")
        self.columnconfigure(0, weight=1)
        self.columnconfigure(1, weight=1)
        self.columnconfigure(2, weight=1)
        self.columnconfigure(3, weight=1)
        self.rowconfigure(0, weight=1)
        self.rowconfigure(1, weight=1)
        self.rowconfigure(2, weight=1)
        self.rowconfigure(3, weight=1)

        self.preview_frame = tkinter.Frame(self)
        self.preview_frame.columnconfigure(0, weight=1)
        self.preview_frame.columnconfigure(1, weight=1)
        self.preview_frame.rowconfigure(0, weight=1)
        self.preview_frame.grid(column=0, row=0, columnspan=4, rowspan=3, sticky="nsew")
        self.preview_frame.grid_propagate(False)
        self.preview_frame.configure(bg="darkgray")

        self.image_preview = ImageViewer(self.preview_frame)
        self.image_preview.grid(column=0, row=0, sticky="nsew", ipadx=0, ipady=0, padx=2, pady=2)

        self.result_preview = ImageViewer(self.preview_frame)
        self.result_preview.grid(column=1, row=0, sticky="nsew", ipadx=0, ipady=0, padx=2, pady=2)

        self.preview_frame.bind("<Configure>", lambda _: self.image_preview.reload_image())

        self.uploader = ImageUploader(self, "Upload")
        self.uploader.grid(column=1, row=3, columnspan=2)
        self.uploader.on_image_upload(self.__on_image_upload)

        self.model = YOLO(os.path.join(base_path, "best.pt"))
        self.results_folder = "results"
        os.makedirs(self.results_folder, exist_ok=True)

    def __on_image_upload(self, image_path: str):
        self.image_preview.set(image_path)
        results = self.model.predict(image_path)
        if len(results) > 0:
            result = results[0]
            file_name = os.path.basename(image_path)
            save_path = os.path.join(self.results_folder, file_name)
            result.save(save_path)
            self.result_preview.set(save_path)
