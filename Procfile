release: python manage.py migrate
web: gunicorn mysite.wsgi
web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker pythoncode:app