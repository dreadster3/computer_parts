import tkinter
from computerparts.views import MainApplication


def main():
    root = tkinter.Tk()
    app = MainApplication(root)
    app.mainloop()


if __name__ == "__main__":
    main()
