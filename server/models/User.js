const mongoose = require("../database/mongodb");

const UserSchema = new mongoose.Schema({

  playerId: {
    type: String,
    unique: true
  },

  nome: {
    type: String,
    default: "Jogador"
  },

  email: {
  type: String,
  unique: true,
  sparse: true
},

password: {
  type: String
},

  saldo: {
    type: Number,
    default: 1000
  },

  vitorias: {
    type: Number,
    default: 0
  },

  derrotas: {
    type: Number,
    default: 0
  },

  amigos: {
    type: Array,
    default: []
  }
});

module.exports =
  mongoose.model("User", UserSchema);