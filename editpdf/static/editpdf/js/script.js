
var cvs = document.getElementById("editor")
var ctx = cvs.getContext("2d")
var pen = document.getElementById("pen-tool")
var text = document.getElementById("text-tool")
var download = document.getElementById("download-tool")
var curX, curY, prevX, prevY
var active_tool = 'pen'
var hasInput = false

pen.addEventListener("click", draw);
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
//cvs.addEventListener("click", addtext)

cvs.onclick = function(e) {
    if (active_tool=='text'){
        if (hasInput) return;
        addText(e.clientX, e.clientY);
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