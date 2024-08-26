/* Evento añadir producto */

const btnAdd = document.getElementById("btnAdd")
let alertValidation = document.getElementById("alertValidation")

btnAdd.addEventListener("click", async (e) => {
    e.preventDefault()

    let title = document.getElementById("title").value
    let description = document.getElementById("description").value
    let code = document.getElementById("code").value
    let price = document.getElementById("price").value
    let stock = document.getElementById("stock").value
    let category = document.getElementById("category").value
    let thumbnailInput = [document.getElementById("thumbnail").value]


    if (!title.trim() || !description.trim() || !code.trim() || !price || price == " " || !stock || stock == " " || !category.trim()) {
        alertValidation.textContent = 'Complete the required fields'
        return
    }

    if (price < 0 || stock < 0) {
        alertValidation.textContent = 'Enter a valid value'
        return
    }

    let thumbnail = []

    if (thumbnailInput.trim() !== "") {
        thumbnail = thumbnailInput.split(",").map(i => i.trim()).filter(i => i !== "")
    }

    let validString = thumbnail.every(i => typeof i === "string")

    if (!Array.isArray(thumbnail) || !validString) {
        alertModify.textContent = 'Thumbnail must be an array of strings';
        return
    }

    let infoProduct = await fetch("/api/products", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, code, price, stock, category, thumbnail })
    })

    document.getElementById("title").value = ""
    document.getElementById("description").value = ""
    document.getElementById("code").value = ""
    document.getElementById("price").value = ""
    document.getElementById("stock").value = ""
    document.getElementById("category").value = ""
    document.getElementById("thumbnail").value = ""

    alertValidation.textContent = "The product has been added successfully"

    setTimeout(() => {
        alertValidation.textContent = ""
    }, 3000);
})


/* Evento modificar producto */

const btnModify = document.getElementById("btnModify")
let alertModify = document.getElementById("alertModify")


btnModify.addEventListener("click", async (e) => {
    e.preventDefault()

    let pid = document.getElementById("searchById").value

    if (!pid) {
        alertModify.textContent = 'Enter the id'
        return
    }

    let title = document.getElementById("newTitle").value
    let description = document.getElementById("newDescription").value
    let code = document.getElementById("newCode").value
    let price = document.getElementById("newPrice").value
    let stock = document.getElementById("newStock").value
    let category = document.getElementById("newCategory").value
    let thumbnailInput = document.getElementById("newThumbnail").value


    if (price < 0 || stock < 0) {
        alertModify.textContent = 'Enter a valid value'
        return
    }

    let thumbnail = []

    if (thumbnailInput.trim() !== "") {
        thumbnail = thumbnailInput.split(",").map(i => i.trim()).filter(i => i !== "")
    }

    let validString = thumbnail.every(i => typeof i === "string")

    if (!Array.isArray(thumbnail) || !validString) {
        alertModify.textContent = 'Thumbnail must be an array of strings';
        return
    }


    let newInfoProduct = await fetch(`/api/products/${pid}`, {
        method: "put",
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({ title, description, code, price, stock, category, thumbnail })
    })


    document.getElementById("newTitle").value = ""
    document.getElementById("newDescription").value = ""
    document.getElementById("newCode").value = ""
    document.getElementById("newPrice").value = ""
    document.getElementById("newStock").value = ""
    document.getElementById("newCategory").value = ""
    document.getElementById("newThumbnail").value = ""


    if (newInfoProduct.status == 400) {
        alertModify.textContent = 'Product not found'
        return
    }


    alertModify.textContent = "The product has been modified successfully"

    setTimeout(() => {
        alertModify.textContent = ""
    }, 3000);

})


/* Evento eliminar producto */

const btnDelete = document.getElementById("btnDelete")
let alertDelete = document.getElementById("alertDelete")


btnDelete.addEventListener("click", async (e) => {
    e.preventDefault()

    let pid = document.getElementById("deleteById").value

    if (!pid) {
        alertDelete.textContent = 'Enter the id'
        return
    }

    let deleteProduct = await fetch(`/api/products/${pid}`, {
        method: "delete",
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (deleteProduct.status == 400) {
        alertDelete.textContent = 'Product not found'
        return
    }

    document.getElementById("deleteById").value = ""
    alertDelete.textContent = "The product has been successfully removed"

    setTimeout(() => {
        alertDelete.textContent = ""
    }, 3000);

})