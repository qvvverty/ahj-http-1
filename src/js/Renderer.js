export default class Renderer {
  bindToDOM(ticketsContainer) {
    this.ticketsContainer = ticketsContainer;
  }

  render() {
    Renderer.requestTickets(this.renderTickets.bind(this));
  }

  renderTickets(ticketsString) {
    const tickets = JSON.parse(ticketsString);
    for (const ticket of tickets) {
      this.renderTicket(ticket);
    }
  }

  static requestTickets(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://obscure-depths.herokuapp.com/?method=allTickets');
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        callback(xhr.response);
        document.body.classList.remove('loading');
      }
    });
    xhr.send();
    document.body.classList.add('loading');
  }

  renderTicket(ticket) {
    const date = new Date(Date.parse(ticket.created));
    const dateFormatted = date.toLocaleString('ru', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const ticketEl = document.createElement('div');
    ticketEl.classList.add('ticket');
    ticketEl.dataset.id = ticket.id;
    ticketEl.innerHTML = `
      <div class="ticket-name-container">
        <input class="status-checkbox" type="checkbox" name="status">
        <p class="ticket-name">
          ${ticket.name}
        </p>
      </div>
      <div class="ticket-date-container">
        <p class="ticket-time">
          ${dateFormatted}
        </p>
        <div class="ticket-edit">✎</div>
        <div class="ticket-delete">×</div>
      </div>
      <p class="ticket-description hidden">
      </p>
    `;
    ticketEl.querySelector('.status-checkbox').checked = ticket.status;
    this.ticketsContainer.append(ticketEl);
  }
}
