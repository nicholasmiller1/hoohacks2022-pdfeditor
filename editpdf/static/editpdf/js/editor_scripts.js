const pdfName = JSON.parse(document.getElementById('pdf-name').textContent);
      const ws_protocol = window.location.protocol == "https:" ? "wss://" : "ws://";

      const pdfEditSocket = new WebSocket(
        ws_protocol
        + window.location.host
        + '/ws/editpdf/editor/'
        + pdfName
        + '/'
      );
    
      pdfEditSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        document.getElementById('message-display').value += (data.message + "\n");
      }
    
      pdfEditSocket.onclose = function(event) {
        console.log('Connection closed');
      }
    
      function onClick() {
        const messageElement = document.getElementById('message-input')
        const message = messageElement.value;
        pdfEditSocket.send(JSON.stringify({
          'message': message
        }));
        messageElement.value = '';
      }