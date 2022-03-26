from django.urls import re_path
from .consumers import EditConsumer

websocket_urlpatterns = [
    re_path(r'ws/editpdf/editor/(?P<pdf_name>\w+)/$', EditConsumer.as_asgi())
]
