document.addEventListener("DOMContentLoaded", () => {
    const btnLogin = document.getElementById("btnLogin");
    const btnSign = document.getElementById("btnSign");
    btnLogin.addEventListener("click", async (event) => {
        event.preventDefault();
        const log = document.getElementById("log").value;
        const pass = document.getElementById("pass").value;
        const hash = CryptoJS.MD5(pass).toString();

        try {
            const resp = await fetch("login-normal", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({log, pass: hash})
            });

            // comprueba siempre response.ok antes de json()
            if (!resp.ok) {
                throw new Error(`HTTP error ${resp.status}`);
            }

            const result = await resp.json();
            console.log("JSON recibido:", result);

            if (result.result === "ok") {
                setCookie("token", result.token, 7);
                alert("¡Login exitoso!");
                window.location.href = "dist/pages/tables/simple.html";
            } else if (result.result === "not") {
                alert("Credenciales incorrectas");
            } else {
                // por si te envían { result: "error", message: ... }
                alert(result.message || "Error desconocido");
            }
        } catch (err) {
            console.error("Error en fetch o parseo:", err);
            alert("No se pudo procesar la respuesta del servidor.");
        }
    });

    function setCookie(nombre, valor, dias) {
        const fecha = new Date();
        fecha.setTime(fecha.getTime() + (dias * 24 * 60 * 60 * 1000));
        const expira = "expires=" + fecha.toUTCString();
        document.cookie = nombre + "=" + valor + ";" + expira + ";path=/";
    }
});