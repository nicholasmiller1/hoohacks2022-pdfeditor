import json
from channels.generic.websocket import AsyncWebsocketConsumer

from editpdf.models import PdfFile


class EditConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.pdf_name = self.scope['url_route']['kwargs']['pdf_name']
        self.group_name = 'pdf_%s' % self.pdf_name

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        print('test')
        await PdfFile.addConnection(self.group_name)

        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

        await PdfFile.removeConnection(self.group_name)
        count = await PdfFile.getConnections(self.group_name)
        if (count == 0):
            await PdfFile.deleteFile(self.group_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'pdf.message',
                'message': message
            }
        )

    async def pdf_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))
