const users = require("../users/users");

const rooms = {};

function getPlayerId(socket){
  return socket.handshake.auth.playerId;
}

function ludoSocket(io) {
 
  io.on("connection", async (socket) => {

    const playerId = getPlayerId(socket);

const user =
  await users.criarOuObterUser(playerId);


    console.log("Jogador conectado:", playerId);


    user.online = true;

    socket.emit("saldo", {
      saldo: user.saldo
    });

    // 👤 salvar nome
    socket.on("salvar_nome", (nome) => {

      const user =
        users.getUser(playerId);

      user.nome = nome;
    });

    // 🤝 adicionar amigo
    socket.on("adicionar_amigo", (nome) => {

      const sucesso =
        users.adicionarAmigo(
          playerId,
          nome
        );

      socket.emit(
        "resultado_amigo",
        sucesso
      );
    });

    // 🏆 ranking
    socket.on("pedir_ranking", () => {

      socket.emit(
        "ranking",
        users.getRanking()
      );
    });

    socket.on("entrar_sala", (roomId) => {

      const valorEntrada = 100;

      const user = users.getUser(playerId);

      if(user.saldo < valorEntrada){
        socket.emit("saldo_insuficiente");
        return;
      }

      if (!rooms[roomId]) {
        rooms[roomId] = {
          players: [],
          turno: 0,
          progress: {},
          pool: 0,
          iniciada: false
        };
      }

      const room = rooms[roomId];

      if (room.players.length >= 2) {
        socket.emit("sala_cheia");
        return;
      }

      if(room.players.includes(playerId)){
        socket.emit("ja_na_sala");
        return;
      }

      if(room.iniciada){
        socket.emit("partida_iniciada");
        return;
      }

      user.saldo -= valorEntrada;

      socket.emit("saldo", {
        saldo: user.saldo
      });

      room.players.push(playerId);

      room.pool += valorEntrada;

      socket.join(roomId);

      if(room.players.length === 2){
        room.iniciada = true;
      }

      io.to(roomId).emit("estado_sala", {
        players: room.players,
        turno: room.turno
      });
    });

    socket.on("jogada", (data) => {

      const room = rooms[data.roomId];
      if (!room) return;

      if(!room.iniciada){
        return;
      }

      const jogadorAtual =
        room.players[room.turno];

      if (playerId !== jogadorAtual) {
        socket.emit("nao_e_sua_vez");
        return;
      }

      const jogada = data.jogada;

      io.to(data.roomId).emit("jogada_recebida", {
        jogador: playerId,
        jogada
      });

      room.progress[playerId] =
        (room.progress[playerId] || 0) + jogada;

      if (room.progress[playerId] >= 30) {

        user.saldo += room.pool;

        users.adicionarVitoria(playerId);

        room.players.forEach(id => {
          if(id !== playerId){
            users.adicionarDerrota(id);
          }
        });

        socket.emit("saldo", {
          saldo: user.saldo
        });

        io.to(data.roomId).emit("fim_jogo", {
          vencedor: playerId
        });

        delete rooms[data.roomId];
        return;
      }

      room.turno =
        (room.turno + 1) % room.players.length;

      io.to(data.roomId).emit("estado_sala", {
        players: room.players,
        turno: room.turno
      });
    });

    socket.on("chat_mensagem", (msg) => {

  io.emit(
    "chat_mensagem",
    {
      jogador: playerId,
      mensagem: msg
    }
  );
});

    socket.on("disconnect", () => {

      for (let roomId in rooms) {

        const room = rooms[roomId];

        room.players =
          room.players.filter(id => id !== playerId);

        if (room.players.length === 0) {
          delete rooms[roomId];
        }
      }

      user.online = false;
    });

  });
}

module.exports = ludoSocket;