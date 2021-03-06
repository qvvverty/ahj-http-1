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
    this.parentEl.addEventListener('change', Control.ticketStatusHandler);
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
        this.ticketToEdit = null;
      } else {
        click.target.closest('.ticket-delete-alert').classList.add('hidden');
      }
    }
  }

  ticketDescriptionHandler(click) {
    if (click.target.classList.contains('ticket-name')) {
      if (this.openedTicketDescription) this.openedTicketDescription.classList.add('hidden');

      this.openedTicketDescription = click.target.closest('.ticket').querySelector('.ticket-description');

      const xhr = new XMLHttpRequest();
      xhr.open('GET', `https://obscure-depths.herokuapp.com/?method=ticketById&id=${click.target.closest('.ticket').dataset.id}`);
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          this.openedTicketDescription.innerText = xhr.response;
          this.openedTicketDescription.classList.remove('hidden');
          this.parentEl.classList.remove('loading');
        }
      });
      xhr.send();
      this.parentEl.classList.add('loading');
    } else if (this.openedTicketDescription && click.target !== this.openedTicketDescription) {
      this.openedTicketDescription.classList.add('hidden');
      this.openedTicketDescription = null;
    }
  }

  okBtnHandler(click) {
    if (click.target.classList.contains('ok')) {
      if (click.target.closest('form') === this.createTicketForm) {
        this.createTicket();
      } else if (click.target.closest('.ticket-delete-alert') && this.ticketToDelete) {
        this.deleteTicket();
      } else if (click.target.closest('form') === this.editTicketForm) {
        this.editTicketForm();
      }
    }
  }

  createTicket() {
    const formData = new FormData(this.createTicketForm);
    if (formData.get('name') && formData.get('description')) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://obscure-depths.herokuapp.com/?method=createTicket');
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          this.renderer.renderTicket(JSON.parse(xhr.response));
          this.parentEl.classList.remove('loading');
        }
      });
      xhr.send(formData);
      this.parentEl.classList.add('loading');

      this.createTicketForm.classList.add('hidden');
      this.modalBackground.classList.add('hidden');
      this.createTicketForm.name.value = '';
      this.createTicketForm.description.value = '';
    }
  }

  deleteTicket() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://obscure-depths.herokuapp.com/?method=deleteTicket&id=${this.ticketToDelete.dataset.id}`);
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) this.parentEl.classList.remove('loading');
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.ticketToDelete.remove();
        this.modalBackground.classList.add('hidden');
        this.deleteTicketAlert.classList.add('hidden');
      }
    });
    xhr.send();
    this.parentEl.classList.add('loading');
  }

  editTicket() {
    const formData = new FormData(this.editTicketForm);
    formData.set('id', this.ticketToEdit.dataset.id);
    if (formData.get('name') && formData.get('description')) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://obscure-depths.herokuapp.com/?method=editTicket');
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          this.ticketToEdit.querySelector('.ticket-name').innerText = formData.get('name');
          this.ticketToEdit.querySelector('.ticket-description').innerText = formData.get('description');
          this.parentEl.classList.remove('loading');
        }
      });
      xhr.send(formData);
      this.parentEl.classList.add('loading');

      this.editTicketForm.classList.add('hidden');
      this.modalBackground.classList.add('hidden');
      this.editTicketForm.name.value = '';
      this.editTicketForm.description.value = '';
    }
  }

  ticketEditHandler(click) {
    if (click.target.classList.contains('ticket-edit')) {
      this.ticketToEdit = click.target.closest('.ticket');
      this.modalBackground.classList.remove('hidden');
      this.editTicketForm.classList.remove('hidden');

      const xhr = new XMLHttpRequest();
      this.editTicketForm.name.value = this.ticketToEdit.querySelector('.ticket-name').innerText.trim();
      xhr.open('GET', `https://obscure-depths.herokuapp.com/?method=ticketById&id=${click.target.closest('.ticket').dataset.id}`);
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) {
          this.editTicketForm.description.value = xhr.response;
        }
      });
      xhr.send();
    }
  }

  ticketDeleteHandler(click) {
    if (click.target.classList.contains('ticket-delete')) {
      this.ticketToDelete = click.target.closest('.ticket');
      this.modalBackground.classList.remove('hidden');
      this.deleteTicketAlert.classList.remove('hidden');
    }
  }

  static ticketStatusHandler(event) {
    if (event.target.classList.contains('status-checkbox')) {
      const checkbox = event.target;
      const formData = new FormData();
      formData.set('id', checkbox.closest('.ticket').dataset.id);
      formData.set('status', checkbox.checked);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://obscure-depths.herokuapp.com/?method=changeStatus');
      xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === 4) this.parentEl.classList.add('loading');
        if (xhr.readyState === 4 && xhr.status !== 200) {
          checkbox.checked = !checkbox.checked;
        }
      });
      xhr.send(formData);
      this.parentEl.classList.add('loading');
    }
  }
}
