// AT Blogs component
function fetchBlogs() {
    let xhttp = new XMLHttpRequest();
    var flag = false;
    
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                flag = true;
                setNewState(JSON.parse(this.responseText));
            } else console.log(this.responseText)
        }
    }
    
    xhttp.open('GET', '/api/blogs/user/', true);
    xhttp.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
    xhttp.send();
}

// At Logout.js
const logout = () => {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            console.log(this.responseText);
        }
    };
    xmlHttp.open("POST", "/api/auth/logout/", true);
    xmlHttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    xmlHttp.send();
    location.replace(location.origin + '/auth/');
}
// At Blogs.js
const deleteBlog = (id) => {
    const removeBlogFromState = () => {
        this.setState({ blogs: this.state.blogs.filter((blog) => blog.id !== id) });
    }
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 201) removeBlogFromState();
            else console.log(this.responseText); 
        }
    }

    xhttp.open('DELETE', '/api/blogs/delete/', true);
    xhttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    xhttp.send(JSON.stringify({ 'blog_id': id }));
}

// At AddBlog.js
function addBlog() {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if(this.readyState == 4){
            if(this.status == 201) fetchUpdated();
            else if(this.status == 400) console.log(this.responseText);
            else if(this.status == 500) console.log(this.responseText);
            else console.log(this.responseText);
        }
    }

    xmlHttp.open('POST', '/api/blogs/add/', true);
    xmlHttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    xmlHttp.send(JSON.stringify({ 'title': this.state.title, "content": this.state.content }));
}

// At UpdateBlog.js
const updateBlog = (e) => {
    e.preventDefault();
    let blog =  {
        id: this.state.id,
        title: this.state.title,
        content: this.state.content
    }
    const updateBlogInState = (updatedBlog) => {
        this.props.changeBlogInState(updatedBlog);
    }

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            let response = JSON.parse(this.responseText);
            if(this.status == 201) {
                updateBlogInState(response.msg);
            }
            else console.log(response); 
        }
    }

    xhttp.open('PUT', '/api/blogs/update/', true);
    xhttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    xhttp.send(JSON.stringify({ blog: blog }));
}

// At Blog.js 
function fetchUser() {
        
    let xhr = new XMLHttpRequest()
    const updateState = (username, profilePic) => this.setState({ username, profilePic })

    xhr.onreadystatechange = function() {
        if(this.readyState == 4) {
            let response = JSON.parse(this.responseText);
            if(this.status == 200) updateState(response.username, response.profilePic);
            else console.log(this.responseText);
        }
    }

    xhr.open('POST', 'api/user/fufb/', true);       // fufb => Fetch user for blog
    xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'))
    xhr.send(JSON.stringify({ 'user_id': this.props.blog.user }));
}

// At Index.js
function fetchBlogs() {
    let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(this.readyState == 4) {
                if(this.status == 200) {
                    flag = true;
                    setNewState(JSON.parse(this.responseText));
                } else console.log(this.responseText)
            }
        }
        
        xhttp.open('GET', '/api/blogs/all/', true);
        xhttp.setRequestHeader('X-CSRFToken', getCookie("csrftoken"));
        xhttp.send();
}

// At Settings.js
fetchUser = () => {
    var xhttp = new XMLHttpRequest();
    const setUserState = (user, profile_pic) => {
        this.setState({
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            email: user.email,
            profile_pic: profile_pic,
            active: true
        });
    }

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            let response = JSON.parse(this.responseText);
            if(this.status == 201) setUserState(response.msg, response.profile_pic)
            else console.log(this.responseText)
        }
    }

    xhttp.open('POST', 'api/user/getuser/', true);
    xhttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    xhttp.send()
}

// At Settings.js
updateUser = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            const response = JSON.parse(this.responseText);
            if(this.status == 201) alertMessage(response.msg);
            else alertError(response.error);
        }
    }

    xhttp.open('POST', 'api/user/update/', true);
    xhttp.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    xhttp.send(formData);
    e.preventDefault();
}

// At auth/Login.js
const sendData = () => {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    const csrftoken = getCookie("csrftoken");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) location.replace(location.origin + '/');
            else if(this.status == 400) {
                const response = JSON.parse(this.responseText);
                alertError(response.error);
            } else console.log("Error occured!");
        } 
    };

    xmlHttp.open("POST", '/api/auth/login/');
    xmlHttp.setRequestHeader('X-CSRFToken', csrftoken);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify({ "username": username, "password": password }));
}

// At auth/Register.js
const sendData = () => {
    var firstName = document.getElementById("first_name").value;
    var lastName = document.getElementById("last_name").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm_password").value;

    const csrftoken = getCookie("csrftoken");
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) location.replace(location.origin + '/');
            else if(this.status == 400) {
                const response = JSON.parse(this.responseText);
                alertError(response.error);
            } else console.log("Error occured!");
        } 
    };

    xmlHttp.open("POST", '/api/auth/register/');
    xmlHttp.setRequestHeader('X-CSRFToken', csrftoken);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify({
        "first_name": firstName,
        "last_name": lastName,
        "username": username,
        "email": email,
        "password": password,
        "confirm_password": confirmPassword
    }));
}