
var cvs = document.getElementById("editor")
var ctx = cvs.getContext("2d")
var pen = document.getElementById("pen-tool")
var text = document.getElementById("text-tool")
var curX, curY, prevX, prevY
var active_tool = 'pen'
var hasInput = false, painting = false

pen.addEventListener("click", function (e) {active_tool='pen';})
text.addEventListener("click", function (e) {active_tool='text';})
//cvs.addEventListener("click", addtext)

cvs.onclick = function(e) {
    if (active_tool=='text'){
        if (hasInput) return;
        addText(e.clientX - cvs.offsetLeft, e.clientY - cvs.offsetTop);
    }
}

cvs.onmousedown = function (e) {
    painting = true
    if (active_tool=='pen') {
        if (hold == false) return;
        prevX = e.clientX - cvs.offsetLeft;
        prevY = e.clientY - cvs.offsetTop;
    }
}

cvs.onmouseup = function (e) {
    painting = false;
}

cvs.onmousemove = function (e) {
    if (painting) {
        crshrX = e.clientX - cvs.offsetLeft;
        crshrY = e.clientY - cvs.offsetTop;

        ctx.fillText("black", prevX, prevY, crshrX - prevX, crshrY - prevY);
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
    ctx.font = '14 px Arial';
    ctx.fillText(txt, x - 4, y - 4);
}