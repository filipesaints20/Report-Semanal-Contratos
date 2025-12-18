const API_URL = 'https://script.google.com/macros/s/AKfycbyHiWosC0e2bwmxZrLSB5b42mGz_m1jHXsixezdEQN2aQDfv34lwNMfIAB7u4ls4KiOXg/exec';

// ===============================
// Lê token da URL
// ===============================
const params = new URLSearchParams(window.location.search);
const token = params.get('token');

if (!token) {
  document.getElementById('erro').innerText = 'Token não informado na URL';
  throw new Error('Token ausente');
}

// ===============================
// Valida gerente e carrega contratos
// ===============================
fetch(`${API_URL}?action=validar&token=${token}`)
  .then(res => res.json())
  .then(data => {
    console.log('Resposta da API:', data);

    if (!data.success) {
      document.getElementById('erro').innerText = data.message || 'Erro ao validar token';
      return;
    }

    renderContratos(data.contratos);
  })
  .catch(err => {
    document.getElementById('erro').innerText = 'Erro ao conectar com a API';
    console.error(err);
  });

// ===============================
// Renderiza contratos
// ===============================
function renderContratos(contratos) {
  const container = document.getElementById('formulario');
  container.innerHTML = '';

  if (!contratos || contratos.length === 0) {
    container.innerHTML = '<p>Nenhum contrato encontrado.</p>';
    return;
  }

  contratos.forEach(c => {
    const div = document.createElement('div');
    div.className = 'contrato';

  div.innerHTML = `
  <div class="contrato-header">${c.nome}</div>
  <div class="contrato-body">

    <h4> class ="bloco-titulo"> 💰 Faturamento</h4>
    <div class="grid-2">
      <input placeholder="Previsto (Mês)" data-field="faturamentoPrevistoMes">
      <input placeholder="Próx. Semana" data-field="faturamentoProximaSemana">
    </div>

    <h4> class ="bloco-titulo"> 💸 Custos</h4>
    <div class="grid-2">
      <input placeholder="Previsto (Mês)" data-field="custoPrevistoMes">
      <input placeholder="Próx. Semana" data-field="custoProximaSemana">
    </div>

    <h4> class ="bloco-titulo">👷 Produção</h4>
    <div class="grid-3">
      <input placeholder="Realizada (Mês)" data-field="producaoRealizadaMes">
      <input placeholder="Prevista (Mês)" data-field="producaoPrevistaMes">
      <input placeholder="Próx. Semana" data-field="producaoProximaSemana">
    </div>

    <h4> class ="bloco-titulo"> 🧠 Análise</h4>
    <textarea placeholder="Destaques da Semana" data-field="destaquesdaSemana"></textarea>
    <textarea placeholder="Concentrações da Semana" data-field="concentracaodaSemana"></textarea>

  </div>
`;

    // Abre / fecha contrato
    div.querySelector('.contrato-header').onclick = () => {
      const body = div.querySelector('.contrato-body');
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
    };

    container.appendChild(div);
  });
}

// ===============================
// Envio dos dados
// ===============================
document.getElementById('btnEnviar').onclick = () => {
  const contratos = [];

  document.querySelectorAll('.contrato').forEach(div => {
    const header = div.querySelector('.contrato-header');

    const dados = {
      idContrato: header.dataset.id,
      nomeContrato: header.innerText
    };

    div.querySelectorAll('[data-field]').forEach(el => {
      dados[el.dataset.field] = el.value || '';
    });

    contratos.push(dados);
  });

  console.log('Dados enviados:', contratos);

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, contratos })
  })
    .then(res => res.json())
    .then(r => {
      console.log('Resposta do POST:', r);
      if (r.success) {
        alert('Dados enviados com sucesso!');
      } else {
        alert(r.message || 'Erro ao enviar dados');
      }
    })
    .catch(err => {
      alert('Erro ao enviar dados');
      console.error(err);
    });
};


