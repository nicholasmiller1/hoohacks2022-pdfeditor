
var cvs = document.getElementById("editor")
var ctx = cvs.getContext("2d")
var pen = document.getElementById("pen-tool")
var text = document.getElementById("text-tool")
var eraser = document.getElementById("eraser-tool")
var curX, curY, prevX, prevY
var active_tool = 'pen'
var hasInput = false, painting = false

pen.addEventListener("click", function (e) {active_tool='pen';})
text.addEventListener("click", function (e) {active_tool='text';})
eraser.addEventListener("click", function (e) {active_tool='eraser';})
//cvs.addEventListener("click", addtext)

cvs.onclick = function(e) {
    if (active_tool=='text'){
        if (hasInput) return;
        addText(e.clientX, e.clientY);
    }
}

cvs.onmousedown = function (e) {
    if (active_tool=='pen' || painting =='eraser') {
        painting = true
        prevX = e.clientX - cvs.offsetLeft;
        prevY = e.clientY - cvs.offsetTop;
    }
}

cvs.onmouseup = function (e) {
    painting = false;
}

cvs.onmousemove = function (e) {
    if (painting) {
        var crshrX = e.clientX - cvs.offsetLeft;
        var crshrY = e.clientY - cvs.offsetTop;
        if (active_tool=="pen") {
            ctx.fillStyle ='#FF0000';
            ctx.fillRect(crshrX, crshrY, 4, 4);
        } else if (active_tool=="eraser"){
            ctx.clearRect(crshrX, crshrY, 5, 5)
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
    ctx.font = 'bold 48px serif';
    ctx.fillText(txt, x - 4 - cvs.offsetLeft, y - 4 - cvs.offsetTop);
}