from django.urls import reverse
from django.shortcuts import redirect, render
from django.views import generic
from django.http import FileResponse, Http404

from editpdf.forms import UploadPdfForm
from editpdf.models import PdfFile

# Create your views here.


def index(request):
    return render(request, 'editpdf/base.html')


def editor(request, pdf_name):
    return render(request, 'editpdf/editor.html', {
        "pdf_name": pdf_name
    })


def upload(request):
    if request.method == 'POST':
        form = UploadPdfForm(request.POST, request.FILES)
        if form.is_valid():
            file_name = request.FILES['pdf_file'].name
            file_name = file_name[:file_name.index('.')].replace(
                ' ', '_').replace(',', '')
            instance = form.save(commit=False)
            instance.pdf_name = 'pdf_%s' % file_name
            instance.save()
            return redirect(reverse('editpdf:editor', kwargs={'pdf_name': file_name}))
    else:
        form = UploadPdfForm()
    return render(request, 'editpdf/upload.html', {'form': form})


def export(request):
    return redirect(reverse("editpdf:upload"))
