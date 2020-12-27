function fullscreen(type) {
    var el = document.getElementById("middle");

    if (type == 't') {          //toggle
        if (el.style.display.toString() == "" || el.style.display.toString() == "none") {
            $("#perview").removeClass("col-md-7");
            $("#perview").removeClass("col-md-11");
            $("#perview").addClass("col-md-7");
        }
        if (el.style.display.toString() == "block") {
            $("#perview").removeClass("col-md-7");
            $("#perview").removeClass("col-md-11");
            setTimeout(function () {
                $("#perview").addClass("col-md-11");
            }, 1)
        }
        $("#middle").fadeToggle(1);
    } else if (type == 'o') {    //open
        $("#perview").removeClass("col-md-7");
        $("#perview").removeClass("col-md-11");
        $("#perview").addClass("col-md-7");
        $("#middle").fadeIn(1);
    } else if (type == 'c') {    //close
        $("#middle").fadeOut(1);
    }
}

function openclosecontentinmiddle(open) {
    var els = ["backgroundandshape", "editingimage", "eventselector", "iconsselector"];
    for (i of els) {
        if (open == i) {
            $(String('#' + i)).fadeIn(1);
        } else {
            $(String('#' + i)).fadeOut(1);
        }
    }
}

function originalimage() {
    image.src = tempsrc;
}

function hideshowcropwindow(val) {
    switch (val) {
        case "original":
            $("#imageforcrop").hide();
            break;
        default:
            $("#imageforcrop").show();
            break;
    }
}

function addselected(add) {
    var els = ["imageselectoroption", "iconselectoroption", "uploadselectoroption", "eventselectoroption", "fullscreenselectoroption", "frameselectoroption"];
    var dom;
    for (i of els) {
        dom = document.getElementById(String(i));
        if (add == i) {
            dom.setAttribute("selected", "");
        } else {
            dom.removeAttribute("selected");

        }
    }

}

function opengallery(){
    var token=sessionStorage.getItem('token');
    if(token==null){
        $('#loginpopup').modal('show');
    }else{
        window.open('gallery.html','_parent');
    }
}

function download(url) {
    const a = document.createElement("a");
    var filename=prompt("Please Enter Filename", "badge");
    if(filename!=null){
        a.download = filename;
        a.href = url;
        a.click();
    }

}

var img;
function deleteimg() {
    // document.querySelector("input.profile-input").value='';
    img=new Image();
    img.crossOrigin='anonymous';
    img.src=canvas.toDataURL('image/png;base64');
    start()
}

function start(){
    var w=prompt("Enter Scale Factor",2);
    resizeImg(img,w);
}

function resizeImg(img,scaleFactor){
    var c=document.createElement('canvas');
    var ctx=c.getContext('2d');
    var iw=img.width;
    var ih=img.height;
    c.width=iw*scaleFactor;
    console.log("Width "+c.width)
    c.height=ih*scaleFactor;
    console.log("Height "+c.height)
    ctx.drawImage(img,0,0,iw*scaleFactor,ih*scaleFactor);
    var scaledImg=new Image();
    scaledImg.onload=function(){
        // scaledImg is a scaled imageObject for upload/download
        download(c.toDataURL('image/png;base64'));
    }
    scaledImg.src=c.toDataURL();
}

function loader(action){
    var body = document.getElementsByTagName("body");
    var head = document.getElementsByTagName("head");
    switch (action) {
        case 'show':
            var style = document.createElement('style');
            var div=document.createElement("div");
            var css = ".sk-chase {\n" +
                "            width: 40px;\n" +
                "            height: 40px;\n" +
                "            position: relative;\n" +
                "            animation: sk-chase 2.5s infinite linear both;\n" +
                "        }\n" +
                "\n" +
                "        .sk-chase-dot {\n" +
                "            width: 100%;\n" +
                "            height: 100%;\n" +
                "            position: absolute;\n" +
                "            left: 0;\n" +
                "            top: 0;\n" +
                "            animation: sk-chase-dot 2.0s infinite ease-in-out both;\n" +
                "        }\n" +
                "\n" +
                "        .sk-chase-dot:before {\n" +
                "            content: '';\n" +
                "            display: block;\n" +
                "            width: 25%;\n" +
                "            height: 25%;\n" +
                "            background-color: #fff;\n" +
                "            border-radius: 100%;\n" +
                "            animation: sk-chase-dot-before 2.0s infinite ease-in-out both;\n" +
                "        }\n" +
                "\n" +
                "        .sk-chase-dot:nth-child(1) { animation-delay: -1.1s; }\n" +
                "        .sk-chase-dot:nth-child(2) { animation-delay: -1.0s; }\n" +
                "        .sk-chase-dot:nth-child(3) { animation-delay: -0.9s; }\n" +
                "        .sk-chase-dot:nth-child(4) { animation-delay: -0.8s; }\n" +
                "        .sk-chase-dot:nth-child(5) { animation-delay: -0.7s; }\n" +
                "        .sk-chase-dot:nth-child(6) { animation-delay: -0.6s; }\n" +
                "        .sk-chase-dot:nth-child(1):before { animation-delay: -1.1s; }\n" +
                "        .sk-chase-dot:nth-child(2):before { animation-delay: -1.0s; }\n" +
                "        .sk-chase-dot:nth-child(3):before { animation-delay: -0.9s; }\n" +
                "        .sk-chase-dot:nth-child(4):before { animation-delay: -0.8s; }\n" +
                "        .sk-chase-dot:nth-child(5):before { animation-delay: -0.7s; }\n" +
                "        .sk-chase-dot:nth-child(6):before { animation-delay: -0.6s; }\n" +
                "\n" +
                "        @keyframes sk-chase {\n" +
                "            100% { transform: rotate(360deg); }\n" +
                "        }\n" +
                "\n" +
                "        @keyframes sk-chase-dot {\n" +
                "            80%, 100% { transform: rotate(360deg); }\n" +
                "        }\n" +
                "\n" +
                "        @keyframes sk-chase-dot-before {\n" +
                "            50% {\n" +
                "                transform: scale(0.4);\n" +
                "            } 100%, 0% {\n" +
                "                  transform: scale(1.0);\n" +
                "              }\n" +
                "        }"
            style.type = 'text/css';
            if (style.styleSheet){
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            div.id="loader";
            div.style.cssText="position: fixed;\n" +
                "            z-index:5000;\n" +
                "            width: 100%;\n" +
                "            height: 100%;\n" +
                "            background: rgba(4,4,4,0.8);";
            div.innerHTML='<div style="margin:auto;\n' +
                '            position: absolute;\n' +
                '            top:46%;\n' +
                '            left:46%;">\n' +
                '<div class="sk-chase">\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '  <div class="sk-chase-dot"></div>\n' +
                '</div>'+
                '    </div>'
            head[0].appendChild(style);
            body[0].prepend(div);
            break;
        case 'hide':
            body[0].removeChild(document.getElementById('loader'));
            head[0].removeChild(head[0].lastChild);
            break;
    }

}

function alertpopup(text, par) {
    document.getElementById('alerttext').innerHTML = text;
    if (par == 'open') {
        $('#alertpopup').modal('show');
    } else {
        $('#alertpopup').modal('hide');
    }
}