from django.urls import path

from . import views

app_name = 'editpdf'
urlpatterns = [
    path('', views.UploadView.as_view(), name='upload'),
    path('editor/', views.EditorView.as_view(), name='editor'),
    path('export/', views.ExportView.as_view(), name='export'),
]
