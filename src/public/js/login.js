/* EVENTO INGRESAR A LA CUENTA (INICIO DE SESIÓN) */

const btnLogin = document.getElementById("btnLogin")
let alertValidation = document.getElementById("alertValidation")

let params = new URLSearchParams(location.search)

let message = params.get("message")

if (message) {
    alertValidation.textContent = message;

    setTimeout(() => {
        alertValidation.textContent = ""
    }, 5000);

}



btnLogin.addEventListener("click", async (e) => {
    e.preventDefault()

    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    if (!email.trim() || !password.trim()) {
        alertValidation.textContent = 'Complete the required fields'
        return
    }

    let loginUser = { email, password }

    try {
        let response = await fetch("/api/sessions/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginUser)
            })

        let data = await response.json()
        if (response.status >= 400) {
            alertValidation.textContent = data.error;
            console.error("login error");

            setTimeout(() => {
                alertValidation.textContent = ""
            }, 5000);

        } else {
            const name = encodeURIComponent(data.user.name)
            const email = encodeURIComponent(data.user.email)
            const rol = encodeURIComponent(data.user.rol)
            window.location.href = `/products?name=${name}&email=${email}&rol=${rol}`
        }

    } catch (error) {
        console.error("Unexpected server error.");
    }


})
