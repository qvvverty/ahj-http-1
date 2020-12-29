// import Request from './Request';
import Renderer from './Renderer';

export default class Control {
  bindToDOM(parentEl) {
    this.parentEl = parentEl;

    this.renderer = new Renderer();
    this.renderer.bindToDOM(this.parentEl.querySelector('.tickets-container'));
    this.renderer.render();

    this.modalBackground = document.querySelector('.modal-background');
    this.createTicketForm = document.querySelector('[name="createTicket"]');
    this.editTicketForm = document.querySelector('[name="editTicket"]');
    this.deleteTicketAlert = document.querySelector('.ticket-delete-alert');

    document.querySelector('.add-ticket').addEventListener('click', this.addTicketBtnHandler.bind(this));
    this.parentEl.addEventListener('click', this.okBtnHandler.bind(this));
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

  ticketDescriptionHandler(click) { // можно ещё улучшить
    if (click.target.classList.contains('ticket-name')) {
      if (this.openedTicketDescription) this.openedTicketDescription.classList.add('hidden');

      this.openedTicketDescription = click.target.closest('.ticket').querySelector('.ticket-description');

      const xhr = new XMLHttpRequest();
      xhr.open('GET', `http://localhost:7070/?method=ticketById&id=${click.target.closest('.ticket').dataset.id}`);
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          this.openedTicketDescription.innerText = xhr.response;
          this.openedTicketDescription.classList.remove('hidden');
        }
      });
      xhr.send();
    } else if (this.openedTicketDescription && click.target !== this.openedTicketDescription) {
      this.openedTicketDescription.classList.add('hidden');
      this.openedTicketDescription = null;
    }
  }

  okBtnHandler(click) {
    if (click.target.classList.contains('ok')) {
      if (click.target.closest('form') === this.createTicketForm) {
        const formData = new FormData(this.createTicketForm);
        if (formData.get('name') && formData.get('description')) {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'http://localhost:7070?method=createTicket');
          xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4) {
              this.renderer.renderTicket(JSON.parse(xhr.response));
            }
          });
          xhr.send(formData);

          this.createTicketForm.classList.add('hidden');
          this.modalBackground.classList.add('hidden');
          this.createTicketForm.name.value = '';
          this.createTicketForm.description.value = '';
        }
      }
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
