const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const fs = require('fs');
const ticketsModule = require('./Ticket')
const TicketFull = ticketsModule.TicketFull;
const Ticket = ticketsModule.Ticket;

const app = new Koa();

const port = process.env.PORT || 7070;

function saveState() {
  try {
    fs.writeFile('./tickets.json', JSON.stringify(tickets), (err) => {
      if (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

function findTicket(id) {
  for (const ticket of tickets) {
    if (ticket.id === +id) return ticket;
  }
}

app.use(koaBody({
  multipart: true,
}));

let ticketsRaw = [];
const tickets = [];
fs.readFile('./tickets.json', 'utf8', (readErr, data) => {
  if (readErr) {
    console.error(readErr);
    return;
  }

  try {
    ticketsRaw = JSON.parse(data);
  } catch (parseErr) {
    console.error(parseErr);
    return;
  }

  for (const ticketRaw of ticketsRaw) {
    tickets.push(new TicketFull(ticketRaw));
  }
});

app.use(async (ctx, next) => {
  ctx.response.set({
    'Access-Control-Allow-Origin': 'https://qvvverty.github.io',
  });
  await next();
});

app.use(async (ctx) => {
  const request = ctx.request.query;
  const { method } = request;

  switch (method) {
    case 'allTickets':
      const allTickets = [];
      for (ticketFull of tickets) {
        allTickets.push(new Ticket(ticketFull));
      }
      ctx.response.body = JSON.stringify(allTickets);
      break;

    case 'ticketById':
      if (ctx.request.query.id) {
        ctx.response.body = findTicket(ctx.request.query.id).description;
      }
      break;

    case 'createTicket': {
      const newTicket = {};
      if (tickets.length > 0) {
        newTicket.id = tickets[tickets.length - 1].id + 1;
      } else {
        newTicket.id = 0;
      }
      Object.assign(newTicket, ctx.request.body);
      newTicket.status = newTicket.status === 'true';
      newTicket.created = new Date();
      tickets.push(new TicketFull(newTicket));
      ctx.response.body = JSON.stringify(new Ticket(tickets[tickets.length - 1]));

      ctx.response.status = 200;
      saveState();
      break;
    }

    case 'deleteTicket': {
      if (ctx.request.query.id) {
        tickets.forEach((ticket, index) => {
          if (ticket.id === +ctx.request.query.id) {
            tickets.splice(index, 1);
            ctx.response.status = 200;
            saveState();
            return;
          }
        });
      }
      break;
    }

    case 'editTicket': {
      const ticketToEdit = findTicket(ctx.request.body.id);
      ticketToEdit.name = ctx.request.body.name;
      ticketToEdit.description = ctx.request.body.description;

      ctx.response.status = 200;
      saveState();
      break;
    }

    case 'changeStatus': {
      const ticketToEdit = findTicket(ctx.request.body.id);
      ticketToEdit.status = ctx.request.body.status === 'true';

      ctx.response.status = 200;
      saveState();
      break;
    }

    default:
      ctx.response.body = "I'm not sleeping!";
      ctx.response.status = 200;
  }
});

const server = http.createServer(app.callback());
server.listen(port, () => {
  console.log(`\x1b[33m> Server ready and listening on ${port}\x1b[0m`);
});
