export const alertError = (error) => {
    var alert = document.getElementById("alert");
    alert.innerHTML = error;
    alert.style.display = "block";
    alert.style.opacity = 1;

    setTimeout(() => {
        var fadeEffect = setInterval(function () {
            if(!alert.style.opacity) {
                alert.style.opacity = 1;
            }
            if(alert.style.opacity > 0) {
                alert.style.opacity -= 0.1;
            } else {
                clearInterval(fadeEffect);
                alert.innerHTML = "";
                alert.style.display = "none";
            }
        }, 60);
    }, 3000);
}