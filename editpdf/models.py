import os
from django.db import models
from django.dispatch import receiver
from asgiref.sync import sync_to_async

# Create your models here.


class PdfFile(models.Model):
    pdf_name = models.CharField(max_length=50)
    pdf_file = models.FileField()
    connectionCount = models.IntegerField(default=0)

    @classmethod
    @sync_to_async
    def addConnection(self, pdf_name):
        instance_set = self.objects.filter(pdf_name=pdf_name)
        if instance_set.exists():
            instance = instance_set.first()
            instance.connectionCount += 1
            instance.save()

    @classmethod
    @sync_to_async
    def removeConnection(self, pdf_name):
        instance_set = self.objects.filter(pdf_name=pdf_name)
        if instance_set.exists():
            instance = instance_set.first()
            instance.connectionCount -= 1
            instance.save()

    @classmethod
    @sync_to_async
    def getConnections(self, pdf_name):
        instance = self.objects.filter(pdf_name=pdf_name)
        if instance.exists():
            return instance.first().connectionCount

    @classmethod
    @sync_to_async
    def deleteFile(self, pdf_name):
        instance = self.objects.filter(pdf_name=pdf_name)
        if instance.exists():
            return instance.first().delete()


@receiver(models.signals.post_delete, sender=PdfFile)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    if instance.pdf_file:
        if os.path.isfile(instance.pdf_file.path):
            os.remove(instance.pdf_file.path)


@receiver(models.signals.pre_save, sender=PdfFile)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `MediaFile` object is updated
    with new file.
    """
    if not instance.pk:
        return False

    try:
        old_file = PdfFile.objects.get(pk=instance.pk).pdf_file
    except PdfFile.DoesNotExist:
        return False

    new_file = instance.pdf_file
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)
