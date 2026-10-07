const API = '/pessoas';

const formBusca = document.getElementById('formBusca');
const cpfBusca = document.getElementById('cpfBusca');
const mensagemBusca = document.getElementById('mensagemBusca');
const areaEdicao = document.getElementById('areaEdicao');
const formEdicao = document.getElementById('formEdicao');
const mensagem = document.getElementById('mensagem');
const btnCancelar = document.getElementById('btnCancelar');

const campos = ['nome', 'sobrenome', 'email', 'idade', 'telefone', 'cpf', 'rg', 'rua', 'bairro', 'cidade', 'estado'];

let idAtual = null;

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

function mostrar(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = 'mensagem ' + tipo;
}

function limpar(elemento) {
  elemento.textContent = '';
  elemento.className = 'mensagem';
}

async function buscar(cpf) {
  limpar(mensagemBusca);
  limpar(mensagem);

  try {
    const resultado = await fetch(`${API}?cpf=${encodeURIComponent(cpf)}`).then(r => r.json());

    if (resultado.length === 0) {
      areaEdicao.classList.add('escondido');
      mostrar(mensagemBusca, 'Nenhuma pessoa encontrada com esse CPF.', 'erro');
      return;
    }

    const pessoa = resultado[0];
    idAtual = pessoa.id;

    campos.forEach(campo => {
      document.getElementById(campo).value = pessoa[campo] ?? '';
    });

    areaEdicao.classList.remove('escondido');
  } catch {
    mostrar(mensagemBusca, 'Erro ao buscar os dados.', 'erro');
  }
}

['cpfBusca', 'cpf'].forEach(id => {
  const campo = document.getElementById(id);
  campo.addEventListener('input', () => {
    campo.value = mascaraCpf(campo.value);
  });
});

document.getElementById('telefone').addEventListener('input', (e) => {
  e.target.value = mascaraTelefone(e.target.value);
});

formBusca.addEventListener('submit', (e) => {
  e.preventDefault();
  buscar(cpfBusca.value);
});

formEdicao.addEventListener('submit', async (e) => {
  e.preventDefault();

  const pessoa = {};
  campos.forEach(campo => {
    pessoa[campo] = document.getElementById(campo).value.trim();
  });
  pessoa.idade = Number(pessoa.idade);

  if (pessoa.cpf.length !== 14) {
    mostrar(mensagem, 'CPF incompleto.', 'erro');
    return;
  }

  try {
    const mesmoCpf = await fetch(`${API}?cpf=${encodeURIComponent(pessoa.cpf)}`).then(r => r.json());

    if (mesmoCpf.some(p => p.id !== idAtual)) {
      mostrar(mensagem, 'Esse CPF já pertence a outra pessoa.', 'erro');
      return;
    }

    const resposta = await fetch(`${API}/${idAtual}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pessoa)
    });

    if (!resposta.ok) throw new Error();

    cpfBusca.value = pessoa.cpf;
    mostrar(mensagem, 'Dados atualizados com sucesso!', 'sucesso');
  } catch {
    mostrar(mensagem, 'Não foi possível atualizar. Tente novamente.', 'erro');
  }
});

btnCancelar.addEventListener('click', () => {
  areaEdicao.classList.add('escondido');
  formEdicao.reset();
  cpfBusca.value = '';
  idAtual = null;
});

const cpfUrl = new URLSearchParams(window.location.search).get('cpf');
if (cpfUrl) {
  cpfBusca.value = cpfUrl;
  buscar(cpfUrl);
}
