const API_URL = "SUA_URL_DO_APPS_SCRIPT";
const token = new URLSearchParams(window.location.search).get('token');
let gerente = null;
let contratos = [];


async function init() {
const res = await fetch(`${API_URL}?action=validar&token=${token}`);
const data = await res.json();
if (!data.success) return alert('Acesso negado');


gerente = data.gerente;
contratos = data.contratos;
montarFormulario();
carregarHistorico();
}


function montarFormulario() {
const div = document.getElementById('formulario');
contratos.forEach(c => {
div.innerHTML += `
<div class="accordion">
<div class="accordion-header" onclick="toggle(this)">${c.nome}</div>
<div class="accordion-content">
<input placeholder="Faturamento Mês" data-id="${c.id}" data-campo="fat_mes" />
<input placeholder="Faturamento Semana" data-id="${c.id}" data-campo="fat_semana" />
<input placeholder="Custo Mês" data-id="${c.id}" data-campo="custo_mes" />
<input placeholder="Custo Semana" data-id="${c.id}" data-campo="custo_semana" />
<input placeholder="Produção Mês" data-id="${c.id}" data-campo="prod_mes" />
<input placeholder="Produção Real" data-id="${c.id}" data-campo="prod_real" />
<input placeholder="Produção Semana" data-id="${c.id}" data-campo="prod_semana" />
</div>
</div>`;
});
}


function toggle(el) {
const content = el.nextElementSibling;
content.style.display = content.style.display === 'block' ? 'none' : 'block';
}


async function enviar() {
const inputs = document.querySelectorAll('input[data-id]');
const payload = [];


inputs.forEach(i => {
payload.push({
contrato: i.dataset.id,
campo: i.dataset.campo,
valor: i.value
});
});


await fetch(API_URL, {
method: 'POST',
body: JSON.stringify({ token, payload })
});


alert('Enviado com sucesso');
}


async function carregarHistorico() {
const res = await fetch(`${API_URL}?action=historico&token=${token}`);
const dados = await res.json();
const tabela = document.getElementById('tabelaHistorico');
tabela.innerHTML = dados.map(d => `<tr><td>${d.data}</td><td>${d.contrato}</td></tr>`).join('');
}


init();

