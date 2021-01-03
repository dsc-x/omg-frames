function createordestroybutton(win) {
    if (sessionStorage.getItem('token') != null) {
        var navmenu = document.getElementById("navmenu");
        navmenu.removeChild(navmenu.lastChild);
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-outline-primary";
        btn.setAttribute("onclick", "logout(\'" + win + "'\)");
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

function dashboardandgallerybutton() {
    var token = sessionStorage.getItem('token');
    var el = document.getElementById('top');
    var eluser = document.querySelector('#navmenu .navbar-nav');
    if (document.getElementById('btns') != undefined) {
        el.removeChild(document.getElementById('btns'));
    }
    if (document.getElementById('user') != undefined) {
        eluser.removeChild(document.getElementById('user'));
    }
    var div = document.createElement('div');
    div.id = 'btns';
    if (token != null) {
        var tempuserinfo = '<div id="user" onclick="$(\'#userinfo\').modal(\'show\')" style="cursor: pointer;display: inline"><img style="height: 30px;" src="svglogos/user.svg" alt="user">\n' +
            '           </div><div class="dropdown-divider"></div>';
        eluser.innerHTML += tempuserinfo;
        var tempdashboardgallery = '<div class="text-center row">\n' +
            '                    <div class="col-6">\n' +
            '                        <button type="button" onclick="window.open(\'dashboard.html\',\'_self\')" class="btn btn-primary"\n' +
            '                                style="width: 150px;">View Dashboard\n' +
            '                        </button>\n' +
            '                    </div>\n' +
            '                    <div class="col-6">\n' +
            '                        <button type="button" onclick="opengallery();" class="btn btn-outline-primary" style="width: 150px">View Gallery</button>\n' +
            '                    </div>\n' +
            '                </div>'
        div.innerHTML = tempdashboardgallery;
    } else {
        var tempdashboardgallery = '<div class="row" style="padding-top: 10px;">\n' +
            '                    <div class="col-12">\n' +
            '                        <button type="button" onclick="$(\'#loginpopup\').modal(\'show\');" class="btn btn-outline-primary getstartedbutton">Get Started</button>\n' +
            '                    </div>\n' +
            '                </div>'
        div.innerHTML = tempdashboardgallery;
    }
    el.appendChild(div);
}

function checkloginindashboard() {
    if (sessionStorage.getItem('token') == null) {
        $('#loginpopup').modal('show');
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
            alertpopup('Account Created Successfully!', 'open', '#28a745');
            setTimeout(function () {
                $('#signuppopup').modal('hide');
                $('#loginpopup').modal('show');
                document.getElementById('email').value = email;
                document.getElementById('password').value = '';
            }, 2000);
        } else if (this.readyState == 4 && this.status == 409) {
            loader('hide');
            alertpopup('Account Already Exists\nfor this Email', 'open', '#dc3545');
        } else if (this.readyState == 4 && this.status == 500) {
            loader('hide');
            alertpopup('Failed to Create Account\nInternal Server Error', 'open', '#dc3545');
        }
    };
    xhttp.open("POST", "https://api.iwasat.events/api/v1/register", true);
    xhttp.onerror = function () {
        loader('hide');
        alertpopup("Unexpected Error!", 'open', '#dc3545');
    };
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({email: email, name: name, organisation: organization, password: password, role: role}));
}

function userinfodisplay() {
    var el = document.getElementById('bodyuserinfo');
    var userinfo = JSON.parse(sessionStorage.getItem('userinfo'));
    var temp = '<table class="table">'
    for (i in userinfo) {
        temp += '<tr>';
        temp += '<td>' + i + '</td>';
        temp += '<td>' + userinfo[i] + '</td>';
        temp += '</tr>'
    }
    temp += '</div>'
    el.innerHTML = temp;
}

function login(win) {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    loader('show');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 202) {
            loader('hide');
            var userinfo = {
                "Name": JSON.parse(this.responseText)["name"],
                "E-mail": JSON.parse(this.responseText)["email"],
                "Organisation": JSON.parse(this.responseText)["organisation"],
                "Role": JSON.parse(this.responseText)["role"]
            };
            sessionStorage.setItem('userinfo', JSON.stringify(userinfo));
            sessionStorage.setItem('token', JSON.parse(this.responseText)["token"]);
            createordestroybutton(win);
            userinfodisplay();
            if (win == 'gallery') {
                getframes();
            }
            setTimeout(function () {
                if (win == 'index') {
                    dashboardandgallerybutton();
                    window.open('dashboard.html', '_self');
                }
            }, 1000);
            $('#loginpopup').modal('hide');

        } else if (this.readyState == 4 && this.status == 401) {
            loader('hide');
            alertpopup('Invalid Email or Password', 'open', '#dc3545');
        }
    };

    xhttp.open("POST", "https://api.iwasat.events/api/v1/login", true);
    xhttp.onerror = function () {
        loader('hide');
        alertpopup("Unexpected Error!", 'open', '#dc3545');
    };
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({email: email, password: password}));

}

function deleteframe(frameid, frameindex) {
    if (confirm("Delete this Frame?")) {
        loader('show');
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 201) {
                loader('hide');

                //delete from array
                if (frameindex > -1) {
                    arrayofframes.splice(frameindex, 1);
                }
                //delete from array

                displayarrayofframes();     //now display
            }
        };
        xhttp.open("DELETE", "https://api.iwasat.events/api/v1/frames?id=" + frameid, true);
        xhttp.onerror = function () {
            loader('hide');
            alertpopup("Unexpected Error!", 'open', '#dc3545');
        };
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('token')}`);
        xhttp.send();
    }
}

function displayarrayofframes() {

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
                '<li onclick="deleteframe(\'' + arrayofframes[i]["frame_id"] + '\',\'' + i + '\');"><span><img src="svglogos/delete.svg" class="iconsimagehover">Delete&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></li>' +
                '</ul>' +
                '</div>'
            temp += '</div>'
            temp += '</div>'
        }
        document.getElementById('main').innerHTML = temp;
    }
}

var arrayofframes;

function getframes() {
    var token = sessionStorage.getItem('token');
    loader('show');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 201) {
            arrayofframes = JSON.parse(this.responseText)["frames"];
            displayarrayofframes();
            loader('hide');
        } else if (this.readyState == 4 && this.status == 401) {
            loader('hide');
            alertpopup(this.responseText, 'open', '#dc3545');
        }
    };
    xhttp.open("GET", "https://api.iwasat.events/api/v1/frames", true);

    xhttp.onerror = function () {
        loader('hide');
        alertpopup("Unexpected Error!", 'open', '#dc3545');
    };
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('token')}`);
    xhttp.send();

}

function saveframe() {
    var token = sessionStorage.getItem('token');
    if (token == null) {
        $('#loginpopup').modal('show');
    } else {
        var dataurl = canvas.toDataURL("image/png;base64");
        var xhttp = new XMLHttpRequest();
        loader('show');

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 201) {
                loader('hide');
                alertpopup('Added Successfully', 'open', '#28a745');
            } else if (this.readyState == 4 && this.status == 400) {
                loader('hide');
                alertpopup('Error While Saving\nTry Again', 'open', '#dc3545');
            } else if (this.readyState == 4 && this.status == 401) {
                loader('hide');
                alertpopup('Error While Saving\nLogin Again', 'open', '#dc3545');
            }
        };
        xhttp.open("POST", "https://api.iwasat.events/api/v1/frames");
        xhttp.onerror = function () {
            loader('hide');
            alertpopup("Unexpected Error!", 'open', '#dc3545');
        };
        xhttp.setRequestHeader("Accept", "application/json");
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem("token")}`);
        xhttp.send(JSON.stringify({frame: dataurl}));
    }

}

function resetpassword() {
    var email = document.getElementById('email').value;
    loader('show');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loader('hide');
            alertpopup('Reset Link Sent to your E-mail', 'open', '#28a745');
        } else if (this.readyState == 4 && this.status == 400) {
            loader('hide');
            alertpopup('Enter E-mail', 'open', '#dc3545');
        } else if (this.readyState == 4 && this.status == 401) {
            loader('hide');
            alertpopup('Seems there\'s no Account Registered with this E-mail', 'open', '#dc3545');
        } else if (this.readyState == 4 && this.status == 500) {
            loader('hide');
            alertpopup('Internal Server Error!', 'open', '#dc3545');
        }
    };

    xhttp.open("POST", "https://api.iwasat.events/api/v1/send-reset-mail", true);
    xhttp.onerror = function () {
        loader('hide');
        alertpopup("Unexpected Error!", 'open', '#dc3545');
    };
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({email: email}));
}

function updatepassword() {
    var password = document.getElementById('password').value;
    const params = new URLSearchParams(window.location.search)
    var resettoken = params.get('token');

    loader('show');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loader('hide');
            alertpopup('Password Changed Successfully', 'open', '#28a745');
            setTimeout(function () {
                window.open('dashboard.html', '_self');
            }, 2000);
        } else if (this.readyState == 4 && this.status == 400) {
            loader('hide');
            alertpopup('Token or Password is absent in the request body', 'open', '#dc3545');
        } else if (this.readyState == 4 && this.status == 401) {
            loader('hide');
            alertpopup('Invalid Token!', 'open', '#dc3545');
        } else if (this.readyState == 4 && this.status == 500) {
            loader('hide');
            alertpopup('Internal Server Error!', 'open', '#dc3545');
        }
    };

    xhttp.open("POST", "https://api.iwasat.events/api/v1/update-password", true);
    xhttp.onerror = function () {
        loader('hide');
        alertpopup("Unexpected Error!", 'open', '#dc3545');
    };
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({password: password, token: resettoken}));
}

function logout(win) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userinfo');
    createordestroybutton('index');
    createordestroybutton('dashboard');
    if (win == 'gallery') {
        $('#loginpopup').modal('show');
    } else if (win == 'index') {
        dashboardandgallerybutton();
    } else if (win == 'dashboard') {
        checkloginindashboard();
    }
}
