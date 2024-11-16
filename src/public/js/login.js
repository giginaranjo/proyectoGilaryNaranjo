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


const validEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}


btnLogin.addEventListener("click", async (e) => {
    e.preventDefault()

    let email = document.getElementById("email").value.toLowerCase()
    let password = document.getElementById("password").value

    if (!email.trim() || !password || password == " ") {
        alertValidation.textContent = 'Complete the required fields'
        return
    }

    if (!validEmail(email)) {
        alertValidation.textContent = 'Wrong email format'
        return
    }

    let loginUser = { email, password }

    try {
        let response = await fetch("/api/sessions/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'accept': 'application/json'
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
            const name = encodeURIComponent(data.user.first_name)
            const email = encodeURIComponent(data.user.email)
            const role = encodeURIComponent(data.user.role)
            window.location.href = `/products?message= Welcome, ${name} | Email: ${email} | Role: ${role}`
        }

    } catch (error) {
        console.error("Unexpected server error.");
    }


})
