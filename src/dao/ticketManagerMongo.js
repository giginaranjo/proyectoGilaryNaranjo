import { ticketModel } from "./models/ticketModel.js"


export class TicketManagerMongo {

    // Obtener tickets

    static async get() {
        return await ticketModel.find().lean()
    }

    // Obtener ticket

    static async getBy(filter) {
        return await ticketModel.findOne(filter).lean()
    }

    // Crear ticket

    static async create(order = {}) {
        let newTicket = await ticketModel.create(order)
        return newTicket.toJSON()
    }


}