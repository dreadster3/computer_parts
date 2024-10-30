import tkinter

root = tkinter.Tk()
frame = tkinter.Frame(root)
frame.grid()

tkinter.Label(frame, text="Hello World!").grid(column=0, row=0)
tkinter.Button(frame, text="Quit", command=quit).grid(column=0, row=1)

def main():
    root.mainloop()

if __name__ == "__main__":
    main()
