/* EVENTO CREAR CUENTA (REGISTRO) */

const btnRegister = document.getElementById("btnRegister")
let alertValidation = document.getElementById("alertValidation")

const validEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email)
}

btnRegister.addEventListener("click", async (e) => {
    e.preventDefault()

    let first_name = document.getElementById("name").value.toLowerCase()
    let last_name = document.getElementById("last-name").value.toLowerCase()
    let age = document.getElementById("age").value
    let email = document.getElementById("email").value.toLowerCase()
    let password = document.getElementById("password").value

    if (!first_name.trim() || !last_name.trim() || !age || age == " " || !email.trim() || !password || password == " ") {
        alertValidation.textContent = 'Complete the required fields'
        return
    }

    if (!validEmail(email)) {
        alertValidation.textContent = 'Wrong email format'
        return
    }

    try {
        let response = await fetch("/api/sessions/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'accept': 'application/json'
                },
                body: JSON.stringify({ first_name, last_name, age, email, password })
            })

        let data = await response.json()
        console.log(data);

        if (response.status >= 400) {
            alertValidation.textContent = data.error;
            console.error("account not created");

            setTimeout(() => {
                alertValidation.textContent = ""
            }, 5000);


        } else {
            window.location.href = `/login?message= Account created to ${data.newUser.email}`
        }


    } catch (error) {
        console.error(error.message);
    }


})