const getProductsCart = async () => {
    try {

        let user = await fetch("/api/sessions/current",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'accept': 'application/json'
                }
            })

        let info = await user.json();
        let cartId

        if (info.error) {
            window.location.href = `/login?message= Log in to add the products to the shopping cart`
        } else {
            cartId = info.user.cart
        }

        if (typeof cartId == "string") {
            cartId
        } else if (cartId._id) {
            cartId = cartId._id
        }

        let response = await fetch(`/api/carts/${cartId}`)
        let data = await response.json()
        let carts = data.cart.products

        let cartList = document.getElementById("cart")
        cartList.innerHTML = ""

        // IMPRIMIR PRODUCTOS EN PANTALLA 
        carts.forEach(item => {
            const li = document.createElement("li")
            li.id = item._id
            li.classList.add("item-cart")

            li.innerHTML = `
            <h3 class="color-cart">Product: ${item.product.title}</h3>
            <p>Price: $ ${item.product.price}</p>
            <p class="color-cart">Quantity: ${item.quantity}</p>
            <small>Description: ${item.product.description}</small> 
            <small>Category: ${item.product.category}</small> 
            <small>Stock: ${item.product.stock}</small>
            <button class="btnRemove" id="${item.product._id}">Remove</button>
            `
            cartList.appendChild(li)
        })

        // BOTON REMOVE
        Array.from(document.getElementsByClassName("btnRemove")).forEach(button => {
            button.addEventListener("click", async (e) => {
                let pid = e.target.id
                let cid = cartId
                pid = pid.toString()
                cid = cid.toString()

                try {
                    const response = await fetch(`/api/carts/${cid}/products/${pid}`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })

                    let removeProduct = await response.json()
                    if (removeProduct) {
                        console.log("removed product");
                        getProductsCart();

                        Toastify({
                            text: `Removed product`,
                            duration: 3000,
                            gravity: "top",
                            position: "right",
                            close: true,
                            style: {
                                background: "#99ff0047"
                            }
                        }).showToast();

                    } else {
                        console.error("product not removed");
                    }
                } catch (error) {
                    console.log("Error removing product", error)
                }
            })
        })


        // BOTON COMPRAR
        let cid = cartId
        let btnBuy = document.getElementById("buy")
        btnBuy.addEventListener("click", async (e) => {

            try {
                const response = await fetch(`/api/carts/${cid}/purchase`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })

                let data = await response.json()

                if (response.status >= 400) {
                    Toastify({
                        text: `${data.error}`,
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        close: true,
                        style: {
                            background: "#99ff0047"
                        }
                    }).showToast();

                } else {


                    let noteTicket
                    let noteOrder = `Order Nro. =  ${data.code} \n Date = ${data.purchase_datetime} \n Amount = $ ${data.amount} \n Email purchaser = ${data.purchaser}`        

                    data.hasOwnProperty('warning') ? noteTicket = `Order processed. \n\n Order Nro. =  ${data.ticket.code} \n Date = ${data.ticket.purchase_datetime} \n Amount = $ ${data.ticket.amount} \n Email purchaser = ${data.ticket.purchaser} \n\n ${data.warning} \n\n Press the button to close` : noteTicket = `Order processed. \n\n ${noteOrder} \n\n Press the button to close`


                    Toastify({
                        text: `${noteTicket}`,
                        duration: -1,
                        gravity: "top",
                        position: "right",
                        close: true,
                        style: {
                            background: "#99ff0047"
                        }
                    }).showToast();
                }

                getProductsCart();

            } catch (error) {
                console.log("Error in the order proccess", error)
            }
        })




    } catch (error) {
        console.log("Error cart: Unexpected server error. Try later.", error)
    }
}

getProductsCart()