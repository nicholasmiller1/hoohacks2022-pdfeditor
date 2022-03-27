release: python manage.py migrate
web: daphne editpdf.asgi:channel_layer --port 6379 --bind 0.0.0.0 -v2
worker: python manage.py runworker -v2