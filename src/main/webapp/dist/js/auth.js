document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    const btnSign = document.getElementById("btnSign");
    btnLogin.addEventListener("click", async (event) => {
        const log = document.getElementById("log").value;
        const pass = document.getElementById("pass").value;
        const hash = CryptoJS.MD5(pass);
        console.log("MD5 Hash:", hash.toString());
        event.preventDefault();
        const response = await fetch("login-normal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({log: log, pass: hash})
        }).then(response => response.json());
        if (response.result === "ok") {
            console.log(response.token);
            setCookie("token", response.token, 7);
            alert(response.result);
            window.location.href = "dist/pages/tables/simple.html";
        } else {
            alert("Credenciales incorrectas");
        }
    });
    function setCookie(nombre, valor, dias) {
        const fecha = new Date();
        fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
        const expira = "expires=" + fecha.toUTCString();
        document.cookie = nombre + "=" + valor + ";" + expira + ";path=/";
    }
});