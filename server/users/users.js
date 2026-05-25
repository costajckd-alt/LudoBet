const User = require("../models/User");
const auth = require("../auth/auth");

async function criarOuObterUser(playerId){

  let user =
    await User.findOne({ playerId });

  if(!user){

    user = await User.create({
      playerId,
      nome: playerId
    });
  }

  return user;
}

async function getUser(playerId){

  return await User.findOne({
    playerId
  });
}

async function getUserByName(nome){

  return await User.findOne({
    nome
  });
}

async function adicionarAmigo(
  playerId,
  amigoNome
){

  const user =
    await getUser(playerId);

  const amigo =
    await getUserByName(amigoNome);

  if(!user || !amigo){
    return false;
  }

  if(user.amigos.includes(amigo.id)){
    return false;
  }

  user.amigos.push(amigo.id);

  await user.save();

  return true;
}

async function adicionarVitoria(playerId){

  const user =
    await getUser(playerId);

  if(user){

    user.vitorias++;

    await user.save();
  }
}

async function adicionarDerrota(playerId){

  const user =
    await getUser(playerId);

  if(user){

    user.derrotas++;

    await user.save();
  }
}

async function atualizarSaldo(
  playerId,
  valor
){

  const user =
    await getUser(playerId);

  if(user){

    user.saldo += valor;

    await user.save();
  }
}

async function getRanking(){

  return await User.find()
    .sort({ vitorias: -1 });
}

async function registrar(
  nome,
  email,
  password
){

  const existe =
    await User.findOne({ email });

  if(existe){
    return null;
  }

  const hash =
    await auth.hashPassword(
      password
    );

  const user =
    await User.create({

      nome,
      email,

      password: hash
    });

  return user;
}

async function login(
  email,
  password
){

  const user =
    await User.findOne({ email });

  if(!user){
    return null;
  }

  const correta =
    await auth.comparePassword(
      password,
      user.password
    );

  if(!correta){
    return null;
  }

  const token =
    auth.createToken(user);

  return {
    user,
    token
  };
}

module.exports = {

registrar,
login,

  criarOuObterUser,
  getUser,
  getUserByName,
  adicionarAmigo,
  adicionarVitoria,
  adicionarDerrota,
  atualizarSaldo,
  getRanking
};