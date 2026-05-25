const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const users = require("./users/users");

require("./database/mongodb");

const ludoSocket = require("./sockets/ludo");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// 🔥 SERVIR FICHEIROS DO CLIENTE
app.use(express.static(path.join(__dirname, "client")));

// 🔥 página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/index.html"));
});

// 🔥 SOCKETS
ludoSocket(io);

const PORT = 3000;

app.use(express.json());

app.post("/register", async (req, res) => {

  const {
    nome,
    email,
    password
  } = req.body;

  const user =
    await users.registrar(
      nome,
      email,
      password
    );

  if(!user){

    return res.json({
      sucesso: false
    });
  }

  res.json({
    sucesso: true
  });
});

app.post("/login", async (req, res) => {

  const {
    email,
    password
  } = req.body;

  const resultado =
    await users.login(
      email,
      password
    );

  if(!resultado){

    return res.json({
      sucesso: false
    });
  }

  res.json({
    sucesso: true,
    token: resultado.token,
    user: resultado.user
  });
});

server.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});