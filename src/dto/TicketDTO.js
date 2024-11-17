export class TicketDTO {
    constructor(order) {
        this.code = order.code,
            this.purchase_datetime = order.purchase_datetime,
            this.amount = Number(order.amount),
            this.purchaser = order.purchaser
    }
}

