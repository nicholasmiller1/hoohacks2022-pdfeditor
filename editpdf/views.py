from django.shortcuts import render
from django.views import generic

# Create your views here.


def index(request):
    return render(request, 'editpdf/base.html')

class EditorView(generic.TemplateView):
    template_name = 'editpdf/editor.html'

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs)

class UploadView(generic.TemplateView):
    template_name = 'editpdf/upload.html'

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs)

class ExportView(generic.TemplateView):
    template_name = 'editpdf/export.html'

    def get_context_data(self, **kwargs):
        return super().get_context_data(**kwargs)



