
var cvs = document.getElementById("editor")
var ctx = cvs.getContext("2d")
var pen = document.getElementById("pen-tool")
var text = document.getElementById("text-tool")
var eraser = document.getElementById("eraser-tool")
var download = document.getElementById("download-tool")
var curX, curY, prevX, prevY
var active_tool = 'pen'
var hasInput = false, painting = false
var tool_size = 2
var pen_color = "#000000"
var erase_color = "#ffffff"

pen.addEventListener("click", function (e) {active_tool='pen';})
text.addEventListener("click", function (e) {active_tool='text';})
eraser.addEventListener("click", function (e) {active_tool='eraser';})
download.addEventListener("click", downloadPNG);

function cvsColor(color) {
    if (color.length == 6) {
        erase_color = '#' + color;
        ctx.fillRect(0,0, cvs.clientWidth, cvs.clientHeight);
    }
}

function toolColor (color ){
    if (color.length == 6) {
        pen_color = '#' + color;
    }
}

function updateBrushSize (size) {
    tool_size = size;
}
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
        downloadPDF(filename, o);
    });
});
//cvs.addEventListener("click", addtext)

cvs.onclick = function(e) {
    if (active_tool=='text'){
        if (hasInput) return;
        addText(e.pageX, e.pageY);
    }
}

cvs.onmousedown = function (e) {
    if (active_tool!='text') {
        painting = true
        prevX = e.pageX - cvs.offsetLeft;
        prevY = e.pageY - cvs.offsetTop;
    }
}

cvs.onmouseup = function (e) {
    painting = false;
    sendCanvas();
}

cvs.onmousemove = function (e) {
    if (painting) {
        if (painting) {
            mouseX = e.pageX - this.offsetLeft;
            mouseY = e.pageY - this.offsetTop;
    
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
                        ctx.fillStyle =pen_color;
                        ctx.fillRect(y, x, tool_size , tool_size );
                    } else if (active_tool=="eraser"){
                        ctx.fillStyle =erase_color;
                        ctx.fillRect(y, x, tool_size , tool_size );
                    }
                } else {
                    if (active_tool=="pen") {
                        ctx.fillStyle =pen_color;
                        ctx.fillRect(x, y, tool_size , tool_size );
                    } else if (active_tool=="eraser"){
                        ctx.fillStyle =erase_color;
                        ctx.fillRect(x, y, tool_size , tool_size );
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
    ctx.fillStyle = pen_color;
    ctx.font = '20px sans-serif';
    ctx.fillText(txt, x - 4 - cvs.offsetLeft, y - 4 - cvs.offsetTop);
    sendCanvas()
}

function downloadPNG() {
    var anchor = document.createElement('a');
    anchor.href = cvs.toDataURL("image/png");
    anchor.download = "IMAGE.PNG";
    anchor.click();
}