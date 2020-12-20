const http = require('http');
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body')

const port = 7070;

const tickets = [
  {
    id: 1,
    name: 'Feed cat',
    description: 'Cat must be fed no matter what!',
    status: true,
    created: new Date()
  },
  {
    id: 2,
    name: 'Wash hands',
    description: 'Must wash hands!',
    status: false,
    created: new Date()
  },
  {
    id: 3,
    name: 'Call Gennadiy',
    description: 'Gennadiy is waiting...',
    status: false,
    created: new Date()
  }
];

app.use(async (ctx, next) => {
  ctx.response.set({
    'Access-Control-Allow-Origin': 'http://localhost:8080',
  });
  await next();
});

app.use(koaBody({
  // urlencoded: true,
  multipart: true,
}));

app.use(async (ctx) => {
  const request = ctx.request.query;
  const { method } = request;

  switch (method) {
    case 'allTickets':
      ctx.response.body = JSON.stringify(tickets);
      break;

    case 'ticketById':
      if (ctx.request.query.id) {
        for (const ticket of tickets) {
          if (ticket.id == ctx.request.query.id) {
            ctx.response.body = JSON.stringify(ticket);
            return;
          }
        }
      }
      break;
    
    case 'createTicket':
      const newTicket = {};
      newTicket.id = tickets[tickets.length - 1].id + 1;
      Object.assign(newTicket, ctx.request.body);
      newTicket.status = newTicket.status === 'true';
      newTicket.created = new Date();
      tickets.push(newTicket);
      console.log(tickets);

      ctx.response.status = 200;
  }

  console.log(`\x1b[33m>>>\x1b[0m`);
});

const server = http.createServer(app.callback()).listen(port, () => {
  console.log(`\x1b[33m> Server ready and listening on ${port}\x1b[0m`);
});
