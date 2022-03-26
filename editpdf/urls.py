from django.urls import path

from . import views

app_name = 'editpdf'
urlpatterns = [
    path('', views.index, name='index'),
]
