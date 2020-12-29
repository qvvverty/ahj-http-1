import Request from './Request';

export default class Control {
  bindToDOM(parentEl) {
    this.parentEl = parentEl;

    this.modalBackground = document.querySelector('.modal-background');
    this.createTicketForm = document.querySelector('[name="createTicket"]');
    this.editTicketForm = document.querySelector('[name="editTicket"]');
    this.deleteTicketAlert = document.querySelector('.ticket-delete-alert');

    document.querySelector('.add-ticket').addEventListener('click', this.addTicketBtnHandler.bind(this));
    this.parentEl.addEventListener('click', this.cancelBtnHandler.bind(this));
    document.addEventListener('click', this.ticketDescriptionHandler.bind(this));
    this.parentEl.addEventListener('click', this.ticketEditHandler.bind(this));
    this.parentEl.addEventListener('click', this.ticketDeleteHandler.bind(this));
  }

  addTicketBtnHandler() {
    this.modalBackground.classList.remove('hidden');
    this.createTicketForm.classList.remove('hidden');
  }

  cancelBtnHandler(click) {
    if (click.target.classList.contains('cancel')) {
      this.modalBackground.classList.add('hidden');
      const parentForm = click.target.closest('form');
      if (parentForm) {
        parentForm.name.value = '';
        parentForm.description.value = '';
        parentForm.classList.add('hidden');
        this.ticketToEditId = null;
      } else {
        click.target.closest('.ticket-delete-alert').classList.add('hidden');
      }
    }
  }

  ticketDescriptionHandler(click) {
    if (click.target.classList.contains('ticket-name')) {
      this.openedTicketDescription = click.target.closest('.ticket').querySelector('.ticket-description');
      this.openedTicketDescription.classList.remove('hidden');
    } else if (this.openedTicketDescription && click.target !== this.openedTicketDescription) {
      this.openedTicketDescription.classList.add('hidden');
      this.openedTicketDescription = null;
    }
  }

  ticketEditHandler(click) {
    if (click.target.classList.contains('ticket-edit')) {
      this.ticketToEditId = click.target.closest('.ticket').dataset.id;
      this.modalBackground.classList.remove('hidden');
      this.editTicketForm.classList.remove('hidden');
    }
  }

  ticketDeleteHandler(click) {
    if (click.target.classList.contains('ticket-delete')) {
      this.ticketToDeleteId = click.target.closest('.ticket').dataset.id;
      this.modalBackground.classList.remove('hidden');
      this.deleteTicketAlert.classList.remove('hidden');
    }
  }
}
