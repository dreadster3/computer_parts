from __future__ import annotations

import tkinter
from tkinter import filedialog
from typing import Callable

OnClickFunction = Callable[[str], None]

class ImageLabel(tkinter.Entry):
    def __init__(self, parent: tkinter.Widget, placeholder: str):
        super().__init__(parent, bd=0, highlightthickness=0, bg="white", relief="flat", fg="grey")
        self.parent = parent
        self.placeholder = placeholder

        self.image_path = tkinter.StringVar(self, placeholder)

        self.config(textvariable=self.image_path)
        self.bind("<FocusIn>", self.on_entry_click)
        self.bind("<FocusOut>", self.on_focus_out)

    def path(self) -> str:
        if self.image_path.get() == self.placeholder:
            return ""

        return super().get()

    def set(self, path: str):
        self.image_path.set(path)
        if path != "" and path != self.placeholder:
            self.config(fg="black")
        else:
            self.config(fg="grey")

    def clear(self):
        self.set(self.placeholder)

    def on_entry_click(self, event: tkinter.Event[ImageLabel]) -> None:
        if event.widget.get() == self.placeholder:
            event.widget.delete(0, tkinter.END)
            event.widget.config(fg="black")

    def on_focus_out(self, event: tkinter.Event[ImageLabel]):
        if event.widget.get() == "":
            event.widget.insert(0, self.placeholder)
            event.widget.config(fg="grey")



class ImageUploader(tkinter.Frame):
    def __init__(self, parent: tkinter.Widget, label: str):
        super().__init__(parent, padx=2, pady=2)
        self.parent = parent

        self.config(bg="white")
        self.columnconfigure(0, weight=2)
        self.columnconfigure(1, weight=1)
        self.columnconfigure(2, weight=1)
        self.rowconfigure(0)

        self.label = ImageLabel(self, "Paste image url or path")
        self.label.grid(column=0, row=0)

        self.find_button = tkinter.Button(self, bd=0, highlightthickness=0, bg="white", text="...", relief="flat", command=self.__on_image_select)
        self.find_button.grid(column=1, row=0)

        self.upload_button = tkinter.Button(self, text="Upload", relief="flat", command=self.__on_upload)
        self.upload_button.grid(column=2, row=0)

        self.__on_upload_func: OnClickFunction = lambda _: None
        self.__file_types = [("Image Files", "*.jpg *.jpeg *.png")]

    def __on_image_select(self):
        path = filedialog.askopenfilename(filetypes=self.__file_types)
        self.label.set(path)

    def __on_upload(self):
        self.__on_upload_func(self.label.path())
        self.label.clear()

    def on_image_upload(self, func: OnClickFunction):
        self.__on_upload_func = func
