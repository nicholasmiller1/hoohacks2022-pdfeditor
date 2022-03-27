"""
ASGI config for mysite project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')

django_asgi_app = get_asgi_application()

from editpdf.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,

    "websocket": URLRouter(websocket_urlpatterns)
})
