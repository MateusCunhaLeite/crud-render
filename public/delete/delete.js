const API = '/pessoas';

const formBusca = document.getElementById('formBusca');
const cpfBusca = document.getElementById('cpfBusca');
const mensagem = document.getElementById('mensagem');
const areaPessoa = document.getElementById('areaPessoa');
const detalhes = document.getElementById('detalhes');
const btnExcluir = document.getElementById('btnExcluir');
const btnCancelar = document.getElementById('btnCancelar');

let pessoaAtual = null;

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

function esconderPessoa() {
  areaPessoa.classList.add('escondido');
  detalhes.innerHTML = '';
  pessoaAtual = null;
}

async function buscar(cpf) {
  try {
    const resultado = await fetch(`${API}?cpf=${encodeURIComponent(cpf)}`).then(r => r.json());

    if (resultado.length === 0) {
      esconderPessoa();
      mostrarMensagem('Nenhuma pessoa encontrada com esse CPF.', 'erro');
      return;
    }

    pessoaAtual = resultado[0];
    mensagem.className = 'mensagem';

    detalhes.innerHTML = `
      <p><span>Nome:</span> ${pessoaAtual.nome} ${pessoaAtual.sobrenome}</p>
      <p><span>CPF:</span> ${pessoaAtual.cpf}</p>
      <p><span>RG:</span> ${pessoaAtual.rg}</p>
      <p><span>Idade:</span> ${pessoaAtual.idade}</p>
      <p><span>E-mail:</span> ${pessoaAtual.email}</p>
      <p><span>Telefone:</span> ${pessoaAtual.telefone}</p>
      <p><span>Endereço:</span> ${pessoaAtual.rua} - ${pessoaAtual.bairro}</p>
      <p><span>Cidade:</span> ${pessoaAtual.cidade}/${pessoaAtual.estado}</p>
    `;

    areaPessoa.classList.remove('escondido');
  } catch {
    mostrarMensagem('Erro ao buscar os dados.', 'erro');
  }
}

cpfBusca.addEventListener('input', () => {
  cpfBusca.value = mascaraCpf(cpfBusca.value);
});

formBusca.addEventListener('submit', (e) => {
  e.preventDefault();
  buscar(cpfBusca.value);
});

btnExcluir.addEventListener('click', async () => {
  if (!pessoaAtual) return;

  if (!confirm(`Tem certeza que deseja excluir ${pessoaAtual.nome}?`)) return;

  try {
    const resposta = await fetch(`${API}/${pessoaAtual.id}`, { method: 'DELETE' });

    if (!resposta.ok) throw new Error();

    mostrarMensagem(`${pessoaAtual.nome} foi excluído(a) com sucesso.`, 'sucesso');
    esconderPessoa();
    cpfBusca.value = '';
  } catch {
    mostrarMensagem('Não foi possível excluir. Tente novamente.', 'erro');
  }
});

btnCancelar.addEventListener('click', () => {
  esconderPessoa();
  cpfBusca.value = '';
});

const cpfUrl = new URLSearchParams(window.location.search).get('cpf');
if (cpfUrl) {
  cpfBusca.value = cpfUrl;
  buscar(cpfUrl);
}
