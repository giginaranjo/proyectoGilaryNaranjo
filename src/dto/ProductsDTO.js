export class ProductsDTO {
    constructor(product) {
        this._id = product._id
        this.title = product.title.toUpperCase(),
            this.description = product.description ? product.description : 'No description',
            this.code = product.code,
            this.price = Number(product.price),
            this.status = product.status ? product.status : true,
            this.stock = Number(product.stock),
            this.category = product.category.toUpperCase(),
            this.thumbnail = product.thumbnail ? product.thumbnail : []
    }

}