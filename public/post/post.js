const API = '/pessoas';

const form = document.getElementById('formCadastro');
const mensagem = document.getElementById('mensagem');
const campoCpf = document.getElementById('cpf');
const campoTelefone = document.getElementById('telefone');

function mascaraCpf(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mascaraTelefone(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = 'mensagem ' + tipo;
}

campoCpf.addEventListener('input', () => {
  campoCpf.value = mascaraCpf(campoCpf.value);
});

campoTelefone.addEventListener('input', () => {
  campoTelefone.value = mascaraTelefone(campoTelefone.value);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (campoCpf.value.length !== 14) {
    mostrarMensagem('CPF incompleto.', 'erro');
    return;
  }

  const pessoa = {
    nome: document.getElementById('nome').value.trim(),
    sobrenome: document.getElementById('sobrenome').value.trim(),
    email: document.getElementById('email').value.trim(),
    idade: Number(document.getElementById('idade').value),
    telefone: campoTelefone.value,
    cpf: campoCpf.value,
    rg: document.getElementById('rg').value.trim(),
    rua: document.getElementById('rua').value.trim(),
    bairro: document.getElementById('bairro').value.trim(),
    cidade: document.getElementById('cidade').value.trim(),
    estado: document.getElementById('estado').value
  };

  try {
    const existe = await fetch(`${API}?cpf=${encodeURIComponent(pessoa.cpf)}`).then(r => r.json());

    if (existe.length > 0) {
      mostrarMensagem('Já existe uma pessoa cadastrada com esse CPF.', 'erro');
      return;
    }

    const resposta = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pessoa)
    });

    if (!resposta.ok) throw new Error();

    mostrarMensagem(`${pessoa.nome} foi cadastrado(a) com sucesso!`, 'sucesso');
    form.reset();
  } catch {
    mostrarMensagem('Não foi possível salvar. Tente novamente.', 'erro');
  }
});
