import tkinter
from PIL import ImageTk, Image


class ImageViewer(tkinter.Label):
    def __init__(self, parent: tkinter.Widget):
        super().__init__(parent, bd=10)
        self.parent = parent
        self.image_path = tkinter.StringVar(self, "")
        self.image_path.trace_add("write", self.__image_path_callback)
        self.image = None

    def set(self, path: str):
        self.image_path.set(path)

    def __image_path_callback(self, var: str, index: str, mode: str):
        self.reload_image()

    def reload_image(self):
        if self.image_path.get() == "":
            return

        width = self.winfo_width()
        height = self.winfo_height()

        original_image = Image.open(self.image_path.get())
        aspect_ratio = min(width / original_image.width, height / original_image.height)

        new_width = int(original_image.width * aspect_ratio)
        new_height = int(original_image.height * aspect_ratio)

        resized_image = original_image.resize((new_width, new_height))

        self.image = ImageTk.PhotoImage(resized_image)
        self.config(image=self.image)
