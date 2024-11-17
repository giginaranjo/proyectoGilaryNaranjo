import { TicketManagerMongo as DAO } from "../dao/ticketManagerMongo.js"
import { TicketDTO } from "../dto/ticketDTO.js"


class TicketService {
    constructor(dao) {
        this.ticketDAO = dao
    }

    async getTickets() {
        let tickets = await this.ticketDAO.getBy()

        if (Array.isArray(tickets)) {
            tickets = tickets.map(t => new TicketDTO(t))
        } else {
            tickets = new TicketDTO(tickets)
        }

        return tickets
    }

    async getTicketBy(filter) {
        let ticket = await this.ticketDAO.getBy(filter)

        if (ticket) {
            ticket = new TicketDTO(ticket)
        }

        return ticket
    }

    async createTicket(order) {
        return await this.ticketDAO.create(order)
    }
}

export const ticketService = new TicketService(DAO)