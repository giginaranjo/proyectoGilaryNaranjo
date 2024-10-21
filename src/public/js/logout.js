let linkLogout = document.getElementById("linkLogout")

linkLogout.addEventListener("click", async (e) =>{
    e.preventDefault()

    try {
        let response = await fetch("/api/sessions/logout",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })

        let data = await response.json()
    
    
        if (response.status >= 400) {
            window.location.href = `/login?message= Logout error`
            console.error("Logout error");
    
        } else {
            window.location.href = `/login?message= Logout successful`
            console.log("Logout successful");
        }
    
    } catch (error) {
        console.error("Unexpected server error.");
    }
})


