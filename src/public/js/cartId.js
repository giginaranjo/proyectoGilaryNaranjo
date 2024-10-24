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
        let cartId = info.user.cart._id

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
                        console.log("product removed");
                        getProductsCart();

                        Toastify({
                            text: `Producto eliminado`,
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

    } catch (error) {
        console.log("Error cart: Unexpected server error. Try later.", error)
    }
}

getProductsCart()