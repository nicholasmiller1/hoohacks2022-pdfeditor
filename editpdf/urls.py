from django.urls import path

from . import views

app_name = 'editpdf'
urlpatterns = [
    path('', views.upload, name='upload'),
    path('editor/<str:pdf_name>', views.editor, name='editor'),
    path('export/', views.export, name='export'),
]
