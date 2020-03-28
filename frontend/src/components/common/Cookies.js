export const getCookie = (name) => {
    if(document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(';');
        for(var i = 0; i < cookies.length; i++) {
            var ck = cookies[i].split("=");
            if(ck[0] === name) return ck[1];
        }

        return null;
    } else {
        return null;
    }
}