let linkProfile = document.getElementById("linkProfile")

linkProfile.addEventListener("click", async (e) =>{
    e.preventDefault()

    try {
        let response = await fetch("/profile")

        let data = await response.json()
    
        if (response.status >= 400) {
            window.location.href = `/login?message= No authenticated users`
            console.error("No authenticated users");
    
        } else {
            window.location.href = `/profile`
        }
    
    } catch (error) {
        console.error("Unexpected server error.");
    }
})


