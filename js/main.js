document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (!token) { alert('Acesso bloqueado: Token ausente'); return; }

    const endpoint = 'https://script.google.com/macros/s/AKfycbxuqun8xilnruM_uXUnwdQmpjFxj7n3SuoNA-ZQFZCuVutj2apoFxDR9xvMm4R_UKF8/exec';

    // Carrega dados iniciais (nome e contratos)
    const initResponse = await fetch(`${endpoint}?token=${token}`);
    const initData = await initResponse.json();
    if (!initData.success) { alert(initData.message || 'Token inválido'); return; }

    document.getElementById('nomeGerente').textContent = initData.nome;

    const contratos = initData.contratos;
    if (contratos.length === 0) { alert('Nenhum contrato vinculado'); return; }

    const listaDiv = document.getElementById('listaContratos');
    contratos.forEach((contrato, index) => {
        const card = document.createElement('div');
        card.className = 'contrato-card';
        card.innerHTML = `<h3>${contrato}</h3><button class="btn teal-btn" data-index="${index}">Report semanal dos projeto</button>`;
        listaDiv.appendChild(card);
    });

    // Clique em contrato inicia wizard
    listaDiv.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON') {
            const index = e.target.dataset.index;
            startWizard(contratos, parseInt(index), token, endpoint);
            listaDiv.classList.add('hidden');
            document.getElementById('formWizard').classList.remove('hidden');
        }
    });
});

function startWizard(contratos, startIndex, token, endpoint) {
    let current = startIndex;
    const form = document.getElementById('reportForm');
    const progress = document.querySelector('.progress');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');

const campos = [
    {label: '💰 Faturamento Previsto (Mês)', id: 'faturPrevMes', type: 'number'},
    {label: '📅💰 Faturamento Próxima Semana', id: 'faturProxSem', type: 'number'},
    {label: '💸 Custo Previsto (Mês)', id: 'custoPrevMes', type: 'number'},
    {label: '📆💸 Custo Próxima Semana', id: 'custoProxSem', type: 'number'},
    {label: '👷 Produção Prevista (Mês)', id: 'prodPrevMes', type: 'number'},
    {label: '✅👷 Produção Realizada (Acumulada) Mês', id: 'prodRealAcum', type: 'number'},
    {label: '📆👷 Produção Próxima Semana', id: 'prodProxSem', type: 'number'},
    {label: '⚔️ Plano de Guerra - Análise', id: 'planoGuerra', type: 'textarea'},
    {label: '🌟 Destaques da Semana', id: 'destaques', type: 'textarea'},
    {label: '🎯 Concentrações da Semana', id: 'concentracoes', type: 'textarea'}
];

    function renderForm() {
        document.getElementById('contratoAtual').textContent = contratos[current];
        form.innerHTML = '';
        campos.forEach(campo => {
            const div = document.createElement('div');
            div.className = 'field';
            div.innerHTML = `<label>${campo.label}</label>
                ${campo.type === 'textarea' ? `<textarea id="${campo.id}"></textarea>` : `<input type="${campo.type}" id="${campo.id}">`}`;
            form.appendChild(div);
        });

        progress.style.width = `${((current - startIndex + 1) / (contratos.length - startIndex)) * 100}%`;
        prevBtn.classList.toggle('hidden', current === startIndex);
        nextBtn.classList.toggle('hidden', current === contratos.length - 1);
        submitBtn.classList.toggle('hidden', current !== contratos.length - 1);
    }

    prevBtn.onclick = () => { if (current > startIndex) current--; renderForm(); };
    nextBtn.onclick = () => { if (current < contratos.length - 1) current++; renderForm(); };

    submitBtn.onclick = async () => {
        const data = {
            token: token,
            contrato: contratos[current]
        };
        campos.forEach(c => { data[c.id] = document.getElementById(c.id).value; });

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            alert('Report enviado com sucesso!');
            location.reload(); // Volta à lista
        } else {
            alert('Erro: ' + result.message);
        }
    };

    renderForm();
}

