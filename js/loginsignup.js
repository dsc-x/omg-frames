function createordestroybutton(win) {
            if (sessionStorage.getItem('token') != null) {
                var navmenu = document.getElementById("navmenu");
                navmenu.removeChild(navmenu.lastChild);
                var btn = document.createElement("button");
                btn.type = "button";
                btn.className = "btn btn-outline-primary";
                btn.setAttribute("onclick", "logout(\'"+win+"'\)");
                btn.innerHTML = "Logout";
                navmenu.appendChild(btn);
            } else {
                var navmenu = document.getElementById("navmenu");
                navmenu.removeChild(navmenu.lastChild);
                var btn = document.createElement("button");
                btn.type = "button";
                btn.className = "btn btn-outline-primary";
                btn.setAttribute("data-toggle", "modal");
                btn.setAttribute("data-target", "#loginpopup");
                btn.innerHTML = "Login";
                navmenu.appendChild(btn);
            }
}

function signup() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("emailnew").value;
    var password = document.getElementById("passwordnew").value;
    var organization = document.getElementById('organization').value;
    var role = document.getElementById('role').value;
    loader('show');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            loader('hide');
            alertpopup('Account Created Successfully!', 'open');
            setTimeout(function () {
                $('#signupform').modal('hide');
                alertpopup('', 'hide')
                $('#loginpopup').modal('show');
                document.getElementById('email').value = email;
                document.getElementById('password').value = '';
            }, 2000);
        } else if (this.readyState == 4 && this.status == 409) {
            loader('hide');
            alertpopup('Account Already Exists\nfor this Email', 'open');
        } else if (this.readyState == 4 && this.status == 500) {
            loader('hide');
            alertpopup('Failed to Create Account\nInternal Server Error', 'open');
        }
    };
    xhttp.open("POST", "https://api.iwasat.events/api/v1/register", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({email: email, name: name, organisation: organization, password: password, role: role}));
}

function login(win) {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    loader('show');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 202) {
            loader('hide');
            sessionStorage.setItem('token', JSON.parse(this.responseText)["token"]);
            createordestroybutton(win);
            if(win=='gallery'){
                getframes();
            }
            $('#loginpopup').modal('hide');

        } else if (this.readyState == 4 && this.status == 401) {
            loader('hide');
            alertpopup('Invalid Email or Password', 'open');
        }
    };
    xhttp.open("POST", "https://api.iwasat.events/api/v1/login", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({email: email, password: password}));
}

function deleteframe(frameid) {
    loader('show');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            loader('hide');
            getframes();
        }
    };
    xhttp.open("DELETE", "https://api.iwasat.events/api/v1/frames?id=" + frameid, true);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('token')}`);
    xhttp.send();
}

function getframes() {
    var token = sessionStorage.getItem('token');
    if (token == null) {
        window.open('dashboard.html');
    } else {
        loader('show');
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 201) {
                var arrayofframes = JSON.parse(this.responseText)["frames"];
                if (arrayofframes.length === 0) {
                    var temp = '<div class="text-center">\n' +
                        '        <div>It Seems No Saved Frames Yet!</div>\n' +
                        '        <span class="btn btn-outline-primary" onclick="window.open(\'dashboard.html\',\'_self\')"><img src="svglogos/add.svg" style="height: 20px;padding-right: 10px;padding-bottom: 3px;" alt="add">New Badge</span>\n' +
                        '    </div>';
                    document.querySelector(".container").innerHTML = temp;
                } else {
                    var temp = "";
                    for (var i = 0; i < arrayofframes.length; i++) {
                        temp += '<div class="col-sm-4">'
                        temp += '<img class="displayframeimage" src="' + arrayofframes[i]["frame_data"] + '">'
                        temp += '<div class="overlay">'
                        temp += '<div class="text">' +
                            '<ul class="list">' +
                            '<li onclick="download(\'' + arrayofframes[i]["frame_data"] + '\');"><span><img src="svglogos/download.svg" class="iconsimagehover">Download</span></li>' +
                            '<li onclick="deleteframe(\'' + arrayofframes[i]["frame_id"] + '\');"><span><img src="svglogos/delete.svg" class="iconsimagehover">Delete&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></li>' +
                            '</ul>' +
                            '</div>'
                        temp += '</div>'
                        temp += '</div>'
                    }
                    document.getElementById('main').innerHTML = temp;
                }
                loader('hide');
            } else if (this.readyState == 4 && this.status == 401) {
                loader('hide');
                alertpopup(this.responseText, 'open');
            }
        };
        xhttp.open("GET", "https://api.iwasat.events/api/v1/frames", true);
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('token')}`);
        xhttp.send();
    }
}

function saveframe() {
    var token = sessionStorage.getItem('token');
    if (token == null) {
        $('#loginpopup').modal('show');
    } else {
        var dataurl = canvas.toDataURL("image/png;base64");
        var xhr = new XMLHttpRequest();
        loader('show');
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 201) {
                loader('hide');
                alertpopup('Added Successfully', 'open');
            } else if (this.readyState == 4 && this.status == 401) {
                loader('hide');
                alertpopup('Error While Saving\nLogin Again', 'open');
            }
        };
        xhr.open("POST", "https://api.iwasat.events/api/v1/frames");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
        xhr.send(JSON.stringify({frame: dataurl}));
    }

}

function logout(win) {
    sessionStorage.removeItem('token');
    createordestroybutton('index');
    createordestroybutton('dashboard');
    if(win=='gallery'){
        $('#loginpopup').modal('show');
    }
}
