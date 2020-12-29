class TicketFull {
  constructor(ticketRaw) {
    this.id = ticketRaw.id;
    this.name = ticketRaw.name;
    this.description = ticketRaw.description;
    this.status = ticketRaw.status;
    this.created = ticketRaw.created;
  }
}

class Ticket {
  constructor(ticketFull) {
    this.id = ticketFull.id;
    this.name = ticketFull.name;
    this.status = ticketFull.status;
    this.created = ticketFull.created;
  }
}

module.exports.TicketFull = TicketFull;
module.exports.Ticket = Ticket;
