export default class Request {
  constructor() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:7070/?method=allTickets');
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === 4) {
        console.log(xhr.response);
      }
    });
    xhr.send();
  }
}
