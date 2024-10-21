/* EVENTO CREAR CUENTA (REGISTRO) */

const btnRegister = document.getElementById("btnRegister")
let alertValidation = document.getElementById("alertValidation")

btnRegister.addEventListener("click", async (e) => {
    e.preventDefault()

    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    if (!name.trim() || !email.trim() || !password.trim()) {
        alertValidation.textContent = 'Complete the required fields'
        return
    }

    let newUser = { name, email, password }

    try {
        let response = await fetch("/api/sessions/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            })

        let data = await response.json()
        if (response.status >= 400) {
            alertValidation.textContent = data.error;
            console.error("account not created");

            setTimeout(() => {
                alertValidation.textContent = ""
            }, 5000);


        } else {
            window.location.href = `/login?mensaje= Account created to ${data.createdUser.email}`
        }


    } catch (error) {
        console.error("Error creating account");
    }


})