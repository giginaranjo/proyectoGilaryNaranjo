export class CartsDTO {
    constructor(cart) {
        this._id = cart._id,
            this.products = Array.isArray(cart.products) ? cart.products : []
    }

}