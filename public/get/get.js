const API = '/pessoas';

const formBusca = document.getElementById('formBusca');
const cpfBusca = document.getElementById('cpfBusca');
const corpoTabela = document.getElementById('corpoTabela');
const mensagem = document.getElementById('mensagem');
const btnTodos = document.getElementById('btnTodos');

function mascaraCpf(valor) {
  return valor
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = 'mensagem ' + tipo;
}

function limparMensagem() {
  mensagem.textContent = '';
  mensagem.className = 'mensagem';
}

function montarTabela(pessoas) {
  corpoTabela.innerHTML = '';

  if (pessoas.length === 0) {
    corpoTabela.innerHTML = '<tr><td colspan="9">Nenhuma pessoa encontrada.</td></tr>';
    return;
  }

  pessoas.forEach(p => {
    const linha = document.createElement('tr');
    const cpf = encodeURIComponent(p.cpf);

    linha.innerHTML = `
      <td>${p.nome} ${p.sobrenome}</td>
      <td>${p.cpf}</td>
      <td>${p.rg}</td>
      <td>${p.idade}</td>
      <td>${p.email}</td>
      <td>${p.telefone}</td>
      <td>${p.rua} - ${p.bairro}</td>
      <td>${p.cidade}/${p.estado}</td>
      <td>
        <a href="/put/put.html?cpf=${cpf}">Editar</a>
        <a href="/delete/delete.html?cpf=${cpf}">Excluir</a>
      </td>
    `;

    corpoTabela.appendChild(linha);
  });
}

async function carregar(cpf) {
  const url = cpf ? `${API}?cpf=${encodeURIComponent(cpf)}` : API;

  try {
    const pessoas = await fetch(url).then(r => r.json());
    montarTabela(pessoas);

    if (cpf && pessoas.length === 0) {
      mostrarMensagem('Nenhuma pessoa com esse CPF.', 'erro');
    } else {
      limparMensagem();
    }
  } catch {
    mostrarMensagem('Erro ao carregar os dados.', 'erro');
  }
}

cpfBusca.addEventListener('input', () => {
  cpfBusca.value = mascaraCpf(cpfBusca.value);
});

formBusca.addEventListener('submit', (e) => {
  e.preventDefault();
  carregar(cpfBusca.value);
});

btnTodos.addEventListener('click', () => {
  cpfBusca.value = '';
  carregar();
});

carregar();
