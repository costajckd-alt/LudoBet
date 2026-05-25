const users = {};

function criarUsuario(id){

  if(!users[id]){

    users[id] = {
      id,
      saldo: 1000,
      historico: []
    };

    console.log("Usuário criado:", id);
  }

  return users[id];
}

function obterSaldo(id){

  if(!users[id]) return 0;

  return users[id].saldo;
}

function adicionarSaldo(id, valor){

  if(!users[id]) return;

  users[id].saldo += valor;

  users[id].historico.push({
    tipo: "ganho",
    valor
  });
}

function removerSaldo(id, valor){

  if(!users[id]) return false;

  if(users[id].saldo < valor){
    return false;
  }

  users[id].saldo -= valor;

  users[id].historico.push({
    tipo: "perda",
    valor
  });

  return true;
}

function definirSaldo(id, valor){

  if(!users[id]) return;

  users[id].saldo = valor;
}

function obterUsuario(id){
  return users[id];
}

module.exports = {
  criarUsuario,
  obterSaldo,
  adicionarSaldo,
  removerSaldo,
  definirSaldo,
  obterUsuario
};