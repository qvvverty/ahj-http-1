const getTicketsForm = document.querySelector('[name="getTickets"]');
const getTicketForm = document.querySelector('[name="getTicket"]');
const createTicketForm = document.querySelector('[name="createTicket"]');

getTicketsForm.addEventListener('submit', (submit) => {
  submit.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://localhost:7070/?method=allTickets');
  xhr.addEventListener('readystatechange', () => {
    if (xhr.readyState === 4) {
      console.log(xhr.response);
    }
  });
  xhr.send();
});

getTicketForm.addEventListener('submit', (submit) => {
  submit.preventDefault();
  if (getTicketForm.id.value) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:7070/?method=ticketById&id=${getTicketForm.id.value}`);
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        console.log(xhr.response);
      }
    });
    xhr.send();
  }
});

createTicketForm.addEventListener('submit', (submit) => {
  submit.preventDefault();
  if (createTicketForm.name.value && createTicketForm.description.value) {
    const formData = new FormData(createTicketForm);
    formData.set('status', createTicketForm.status.checked);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:7070?method=createTicket');
    xhr.send(formData);

    createTicketForm.name.value = '';
    createTicketForm.description.value = '';
  }
});
