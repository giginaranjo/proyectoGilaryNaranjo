
const getListProducts = async () => {

    //PARAMS URL PRODUCTS
    let params = new URLSearchParams(location.search)

    let page = params.get("page")
    let limit = params.get("limit")
    let sort = params.get("sort")
    let filter = params.get("filter")

    let message = params.get("message")

    if (message) {
        Toastify({
            text: `${message}`,
            duration: 5000,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            close: true,
            style: {
                background: "#99ff0047"
            }
        }).showToast();
    }

    page = parseInt(page)
    limit = parseInt(limit)

    if (!page || isNaN(Number(page))) {
        page = 1
    }
    if (!limit || isNaN(Number(limit))) {
        limit = 10
    }
    let searchParams = new URLSearchParams({ page, limit })
    if (sort !== null && sort !== undefined && sort !== "") {
        searchParams.set("sort", sort)
    }
    if (filter !== null && filter !== undefined && filter !== "") {
        searchParams.set("filter", filter)
    }

    try {

        let response = await fetch(`/api/products?${searchParams.toString()}`)
        let data = await response.json()
        let productsCollection = data


        let productList = document.getElementById("list")
        productList.innerHTML = ""


        // IMPRIMIR PRODUCTOS EN PANTALLA 
        productsCollection.payload.products.forEach(p => {
            const li = document.createElement("li")
            li.id = p._id
            li.classList.add("item")

            //Thumbnail sería: <img src="${p.thumbnail}" alt="${p.thumbnail}"> si tuviera las imagenes (son nombres inventados)

            li.innerHTML = `
            
            <p>${p.thumbnail}</p>
            <h3>${p.title}</h3>
            <strong>Product information:</strong>
            <p>Description: ${p.description}</p>
            <p>Code: ${p.code}</p>
            <h4>Price: $${p.price}</h4>
            <p>Status: ${p.status}</p>
            <p>Stock: ${p.stock}</p>
            <p>Category: ${p.category}</p>
            <button class="btnAdd" id="${p._id}">Add to cart</button>
            `

            productList.appendChild(li)
        })


        // BOTON AÑADIR PRODUCTOS

        Array.from(document.getElementsByClassName("btnAdd")).forEach(button => {
            button.addEventListener("click", async (e) => {

                // OBTENER CART ID

                let user = await fetch("/api/sessions/current",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            'accept': 'application/json'
                        }
                    })

                let info = await user.json();
                let cid

                if (info.error) {
                    window.location.href = `/login?message= Log in to add the products to the shopping cart`
                } else {
                    cid = info.user.cart
                }

                if (!cid) {
                    return Toastify({
                        text: `Unauhorized`,
                        duration: 5000,
                        gravity: "top",
                        position: "right",
                        stopOnFocus: true,
                        close: true,
                        style: {
                            background: "#99ff0047"
                        }
                    }).showToast();
                }

                if (typeof cid == "string") {
                    cid
                } else if (cid._id) {
                    cid = cid._id
                }

                // AÑADIR PRODUCTO
                let pid = e.target.id
                pid = pid.toString()

                try {

                    const response = await fetch(`/api/carts/${cid}/products/${pid}`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })

                    const addProduct = await response.json()

                    if (addProduct) {
                        console.log("product added");

                        Toastify({
                            text: "Product added to cart",
                            duration: 3000,
                            gravity: "top",
                            position: "right",
                            stopOnFocus: true,
                            destination: `/carts/${cid}`,
                            style: {
                                background: "#99ff0047"
                            }
                        }).showToast();

                    } else {
                        console.error("product not added");
                    }

                } catch (error) {
                    console.error("Error adding product");

                }
            })
        })

        //COMPONENTE PAGINATION
        let pagination = document.getElementById("pagination")
        pagination.innerHTML = "";

        const linkPage = (text, numPage) => {
            let link = document.createElement("a")
            link.textContent = text

            let newParams = new URLSearchParams(searchParams)
            newParams.set("page", numPage)
            link.href = `/products?${newParams.toString()}`
            return link
        }

        // Primera
        const firstPage = linkPage(`1 |<`, 1)
        if (data.payload.page == 1) {
            firstPage.classList.add("disabled")
        } else {
            firstPage.classList.remove("disabled")
        }
        pagination.append(firstPage)

        // Previa
        const prevPage = linkPage(`<`, data.payload.prevPage)
        if (!data.payload.hasPrevPage) {
            prevPage.classList.add("disabled")
        } else {
            prevPage.classList.remove("disabled")
        }
        pagination.append(prevPage)

        // Actual
        const currentPage = document.createElement("p")
        currentPage.textContent = `${data.payload.page}`
        pagination.append(currentPage)

        // Siguiente
        const nextPage = linkPage(`>`, data.payload.nextPage)
        if (!data.payload.hasNextPage) {
            nextPage.classList.add("disabled")
        } else {
            nextPage.classList.remove("disabled")
        }
        pagination.append(nextPage)

        // Última
        const lastPage = linkPage(`>| ${data.payload.totalPages}`, data.payload.totalPages)
        if (data.payload.page == data.payload.totalPages) {
            lastPage.classList.add("disabled")
        } else {
            lastPage.classList.remove("disabled")
        }
        pagination.append(lastPage)
    } catch (error) {
        console.log(`Error products: Unexpected server error. Try later. ${error.message}`)
    }
}


getListProducts()