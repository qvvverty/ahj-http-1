const http = require('http');
const Koa = require('koa');
const app = new Koa();

const port = 7070;

app.use(async (ctx) => {
  console.log(ctx.request);
  ctx.response.body = 'Server response';
});

const server = http.createServer(app.callback()).listen(port, () => {
  console.log(`\x1b[33m> Server ready and listening on ${port}\x1b[0m`);
});
