const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, 'public')
});

const porta = process.env.PORT || 3000;

server.use(middlewares);
server.use(router);

server.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});
