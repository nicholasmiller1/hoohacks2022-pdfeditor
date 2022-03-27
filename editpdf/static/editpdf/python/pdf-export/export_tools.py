import pytesseract
from PIL import Image
from pdf2image import convert_from_path

# Take a path to the input png, a path to the output pdf file
# Take the input png, run an optical character resolution and then write to a pdf
def to_ocr(input_png, output_pdf):
    ocr = pytesseract.image_to_pdf_or_hocr(input_png, extension='pdf')
    with open(output_pdf, 'w+b') as f:
        f.write(ocr)  # pdf type is bytes by default

# Take a path the the input pdf, path to the output png location, and the canvas overlay png
# Convert the input pdf, and put the canvas overlay on top of it.
def overlay(input_pdf, output_png, overlay_png):
    images = convert_from_path(input_pdf)
    for image in images:
        image.save(output_png)

    background = Image.open(output_png)
    foreground = Image.open(overlay_png)

    background.paste(foreground, (0, 0), foreground)
    background.save(output_png)
    return background

def overlay_main(input_pdf):
    overlay(input_pdf, 'output.png', 'overlay.png')
    to_ocr('output.png', 'output.pdf')
    return 