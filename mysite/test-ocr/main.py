import pytesseract
from PyPDF2 import PdfFileReader, PdfFileWriter
from PIL import Image
from pdf2image import convert_from_path

def to_ocr(input_png, output_pdf):
    ocr = pytesseract.image_to_pdf_or_hocr(input_png, extension='pdf')
    with open(output_pdf, 'w+b') as f:
        f.write(ocr)  # pdf type is bytes by default


def overlay(input_pdf, output_pdf, output_png, overlay_png):
    images = convert_from_path(input_pdf)
    for image in images:
        image.save(output_png)

    background = Image.open(output_png)
    foreground = Image.open(overlay_png)

    background.paste(foreground, (0, 0), foreground)
    background.save(output_png)
    
    # The following code does not work because pdfs cannot have transparency
    #pdf = PdfFileReader(input_pdf)
    #pdf_writer = PdfFileWriter()
    #image_1 = Image.open(overlay_png)
    #img = image_1.convert('RGB')
    #img.save('temp.pdf')
    #overlay = PdfFileReader('temp.pdf')
    #overlay_page = overlay.getPage(0)

    #pdf_page = pdf.getPage(0)
    #pdf_page.mergePage(overlay_page)
    #pdf_writer.addPage(pdf_page)

    #with open(output_pdf, 'wb') as fh:
    #    pdf_writer.write(fh)
    
    #images = convert_from_path(output_pdf)
    #for image in images:
    #    image.save(output_png)


if __name__ == '__main__':
    overlay(input_pdf='test-2.pdf',
            output_pdf='test-3.pdf',
            output_png='test-3.png',
            overlay_png='test-1.png')
    to_ocr(input_png='test-3.png', output_pdf='test-3.pdf')
