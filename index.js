const express = require("express");

const server = express();

server.use(express.json());

// localhost:3000/teste
// Query Params = ?teste=1
// Route Params = /users/1
// Request Body = { "name": "Emerson", "email": "emerson@gmail.com" }

// CRUD - Create, Read, Update, Delete

const users = ["Emerson", "Frazão", "Leandro"];

// Middleware Global
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL ${req.url};`);
  next();

  console.timeEnd("Request");
});

// Middleware Local
function checkUserExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}

// Rota que usa o método GET para buscar todos os usuários:
server.get("/users", (req, res) => {
  return res.json(users);
});

// Rota que usa o método GET para buscar um só usuário:
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json({ message: `Buscando o usuário ${req.user}` });
});

// Rota que usa o método POST para criar um usuário:
server.post("/users", checkUserExist, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Rota que usa o método PUT para editar um usuário:
server.put("/users/:index", checkUserInArray, checkUserExist, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// Rota que usa o método DELETE para deletar um usuário:
server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
