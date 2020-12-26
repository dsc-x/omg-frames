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
    switch (action) {
        case 'show':
            var body = document.getElementsByTagName("body");
            var div=document.createElement("div");
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
                '        <div style="height:3rem;\n' +
                '            width: 3rem;" class="spinner-border text-light" role="status">' +
                '        </div>\n' +
                '    </div>'
            body[0].prepend(div);
            break;
        case 'hide':
            var body = document.getElementsByTagName("body");
            body[0].removeChild(document.getElementById('loader'));
            break;
    }

}