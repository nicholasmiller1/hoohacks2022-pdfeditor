
var cvs = document.getElementById("editor")
var ctx = cvs.getContext("2d")
var pen = document.getElementById("pen-tool")
var text = document.getElementById("text-tool")
var download = document.getElementById("download-tool")
var eraser = document.getElementById("eraser-tool")
var curX, curY, prevX, prevY
var active_tool = 'pen'
var hasInput = false, painting = false
var tool_size = 2

pen.addEventListener("click", function (e) {active_tool='pen';})
text.addEventListener("click", function (e) {active_tool='text';})
download.addEventListener("click", function () {
    var imageURL = cvs.toDataURL("image/png");
    $.ajax({
        type: "POST",
        url: "../python/pdf-export/export.py",
        data: {
            param: imageURL,
        }
    }).done((o) => {
        var filename = "output.pdf";
        download(filename, o);
    });
    });
eraser.addEventListener("click", function (e) {active_tool='eraser';})
//cvs.addEventListener("click", addtext)

cvs.onclick = function(e) {
    if (active_tool=='text'){
        if (hasInput) return;
        addText(e.clientX, e.clientY);
    }
}

cvs.onmousedown = function (e) {
    if (active_tool!='text') {
        painting = true
        prevX = e.clientX - cvs.offsetLeft;
        prevY = e.clientY - cvs.offsetTop;
    }
}

cvs.onmouseup = function (e) {
    painting = false;
    console.log('test');
    sendCanvas();
}

cvs.onmousemove = function (e) {
    if (painting) {
        if (painting) {
            mouseX = e.clientX - this.offsetLeft;
            mouseY = e.clientY - this.offsetTop;
    
            // find all points between        
            var x1 = mouseX,
                x2 = prevX,
                y1 = mouseY,
                y2 = prevY;
    
    
            var steep = (Math.abs(y2 - y1) > Math.abs(x2 - x1));
            if (steep){
                var x = x1;
                x1 = y1;
                y1 = x;
    
                var y = y2;
                y2 = x2;
                x2 = y;
            }
            if (x1 > x2) {
                var x = x1;
                x1 = x2;
                x2 = x;
    
                var y = y1;
                y1 = y2;
                y2 = y;
            }
    
            var dx = x2 - x1,
                dy = Math.abs(y2 - y1),
                error = 0,
                de = dy / dx,
                yStep = -1,
                y = y1;
    
            if (y1 < y2) {
                yStep = 1;
            }
    
            for (var x = x1; x < x2; x++) {
                if (steep) {
                    if (active_tool=="pen") {
                        ctx.fillStyle ='#FF0000';
                        ctx.fillRect(y, x, tool_size , tool_size );
                    } else if (active_tool=="eraser"){
                        ctx.clearRect(y, x, tool_size , tool_size );
                    }
                } else {
                    if (active_tool=="pen") {
                        ctx.fillStyle ='#FF0000';
                        ctx.fillRect(x, y, tool_size , tool_size );
                    } else if (active_tool=="eraser"){
                        ctx.clearRect(x, y, tool_size , tool_size );
                    }
                }
    
                error += de;
                if (error >= 0.5) {
                    y += yStep;
                    error -= 1.0;
                }
            }
    
    
    
            prevX = mouseX;
            prevY = mouseY;
    
        }
    }
}

function addText(x,y) {
    var input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4) + 'px';
    input.style.top = (y - 4) + 'px';

    input.onkeydown = handleEnter;

    document.body.appendChild(input);

    input.focus();

    hasInput = true;
}

//Key handler for input box:
function handleEnter(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.body.removeChild(this);
        hasInput = false;
    }
}

//Draw the text onto canvas:
function drawText(txt, x, y) {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = "#000000";
    ctx.font = '20px sans-serif';
    ctx.fillText(txt, x - 4 - cvs.offsetLeft, y - 4 - cvs.offsetTop);
    sendCanvas()
    ctx.font = '12 px Arial';
    ctx.fillText(txt, x - 4, y - 4);
}

function draw () {
    active_tool = 'pen';
    ctx.fillText('pen tool', 50, 50);
}

function dowloadPDF(fileURL, fileName) {
    var link = document.createElement('a');
    link.href = fileURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}