const socket = io();

/* EVENTO AÑADIR PRODUCTO */

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
    let thumbnailInput = document.getElementById("thumbnail").value


    if (!title.trim() || !description.trim() || !code || code == " " || !price || price == " " || !stock || stock == " " || !category.trim()) {
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


    try {
        alertValidation.textContent = "The product has been added successfully"
        socket.emit("addProduct", { title, description, code, price, stock, category, thumbnail })
    } catch (error) {
        alertValidation.textContent = "An error occurred while trying to add the product";
    }



    document.getElementById("title").value = ""
    document.getElementById("description").value = ""
    document.getElementById("code").value = ""
    document.getElementById("price").value = ""
    document.getElementById("stock").value = ""
    document.getElementById("category").value = ""
    document.getElementById("thumbnail").value = ""


    setTimeout(() => {
        alertValidation.textContent = ""
    }, 3000);
})


/* EVENTO MODIFICAR PRODUCTO */

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

    const validFields = [title, description, code, price, stock, category, ...thumbnailInput].some(value => value !== '' && value !== undefined && value !== null && (!Array.isArray(value) || value.length > 0))
    if (!validFields) {
        alertModify.textContent = 'Complete the required fields'
        return
    }


     price = Number(parseFloat(price))
    if (price === null || price === "" || price === " " || price < 0) {
        return alertModify.textContent = 'Enter a valid value'
    }

    stock = Number(parseInt(stock))
    if (stock === null || stock === "" || stock === " " || stock < 0) {
        return alertModify.textContent = 'Enter a valid value'
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


    const existId = async (pid) => {
        let response = await fetch(`/api/products/${pid}`)
        try {
            if (response.ok) {
                return true
            } else {
                return false
            }
        } catch (error) {
            alertDelete.textContent = "An error occurred while trying to remove the product";
            return false
        }

    }

    let product = { pid, title, description, code, price, stock, category, thumbnail }
    let filterProduct = Object.fromEntries(Object.entries(product).filter(([key, value]) => value !== "" && value !== undefined && value !== null && (!Array.isArray(value) || value.length > 0)))


    let responseId = await existId(pid)
    if (responseId) {
        alertModify.textContent = "The product has been modified successfully"
        socket.emit("modifyProduct", filterProduct)
        console.log(socket.emit("modifyProduct", filterProduct));

        document.getElementById("searchById").value = ""
    } else {
        alertModify.textContent = "Product not found";
    }

    document.getElementById("newTitle").value = ""
    document.getElementById("newDescription").value = ""
    document.getElementById("newCode").value = ""
    document.getElementById("newPrice").value = ""
    document.getElementById("newStock").value = ""
    document.getElementById("newCategory").value = ""
    document.getElementById("newThumbnail").value = ""


    setTimeout(() => {
        alertModify.textContent = ""
    }, 3000);

})


/* EVENTO ELIMINAR PRODUCTO */

const btnDelete = document.getElementById("btnDelete")
let alertDelete = document.getElementById("alertDelete")


btnDelete.addEventListener("click", async (e) => {
    e.preventDefault()

    let pid = document.getElementById("deleteById").value

    if (!pid) {
        alertDelete.textContent = 'Enter the id'
        return
    }

    const existId = async (pid) => {

        let response = await fetch(`/api/products/${pid}`)
        try {
            if (response.ok) {
                return true
            } else {
                return false
            }
        } catch (error) {
            alertDelete.textContent = "An error occurred while trying to remove the product";
            return false
        }

    }

    let responseId = await existId(pid)

    if (responseId) {
        alertDelete.textContent = "The product has been successfully removed"
        socket.emit("deleteProduct", { pid })

        document.getElementById("deleteById").value = ""
    } else {
        alertDelete.textContent = "Product not found";
    }


    setTimeout(() => {
        alertDelete.textContent = ""
    }, 3000);

})


// ACTUALIZAR LISTA DE PRODUCTOS
socket.on("updateProducts", (products) => {

    let productList = document.getElementById("list")
    productList.innerHTML = ""

    products.forEach(p => {
        const li = document.createElement("li")
        li.id = p.id
        li.classList.add("item")

        /* Thumbnail sería: <img src="${p.thumbnail}" alt="${p.thumbnail}"> si tuviera las imagenes (son nombres inventados)*/

        li.innerHTML = `
        
        <span>ID:${p._id}</span>
        <p>${p.thumbnail}</p>
        <h3>${p.title}</h3>
        <strong>Product information:</strong>
        <p>Description: ${p.description}</p>
        <p>Code: ${p.code}</p>
        <h4>Price: $${p.price}</h4>
        <p>Status: ${p.status}</p>
        <p>Stock: ${p.stock}</p>
        <p>Category: ${p.category}</p>
        `

        productList.appendChild(li)
    })

})
