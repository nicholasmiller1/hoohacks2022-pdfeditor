from django import forms

from editpdf.models import PdfFile


class UploadPdfForm(forms.ModelForm):
    class Meta:
        model = PdfFile
        fields = ['pdf_file']
