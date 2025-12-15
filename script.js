const API = "https://script.google.com/macros/s/SEU_DEPLOY_ID/exec";
const token = new URLSearchParams(window.location.search).get("token");

// carregar contratos
fetch(`${API}?token=${token}`)
  .then(r => r.json())
  .then(data => {
    if (!data.valido) {
      alert("Acesso inválido");
      return;
    }

    gerente.value = data.gerente;

    const ul = document.getElementById("listaContratos");
    ul.innerHTML = "";

    data.contratos.forEach(c => {
      const li = document.createElement("li");
      li.textContent = c;
      li.onclick = () => abrirContrato(c);
      ul.appendChild(li);
    });
  });

function abrirContrato(contrato) {
  tituloContrato.innerText = contrato;
  document.getElementById("formWrapper").classList.remove("hidden");

  fetch(`${API}?token=${token}&contrato=${encodeURIComponent(contrato)}`)
    .then(r => r.json())
    .then(data => {
      const div = document.getElementById("historico");
      div.innerHTML = "";

      data.historico.forEach(h => {
        div.innerHTML += `
          <div class="history-item">
            <strong>${h.data}</strong><br>
            💰 ${h.fatPrevMes} | 💸 ${h.custoPrevMes} | 👷 ${h.prodPrevMes}
          </div>
        `;
      });
    });
}

function enviar() {
  fetch(API, {
    method: "POST",
    body: JSON.stringify({
      token,
      gerente: gerente.value,
      contrato: contrato.value,
      faturamentoPrevistoMes: fatPrevMes.value,
      faturamentoProxSemana: fatProxSemana.value,
      custoPrevistoMes: custoPrevMes.value,
      custoProxSemana: custoProxSemana.value,
      producaoPrevistaMes: prodPrevMes.value,
      producaoRealizadaMes: prodRealMes.value,
      producaoProxSemana: prodProxSemana.value,
      planoGuerra: planoGuerra.value,
      destaques: destaques.value,
      concentracoes: concentracoes.value
    })
  })
  .then(() => alert("✅ Enviado"));
}
