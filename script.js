const API = "https://script.google.com/macros/s/AKfycbws4W6I1FpoX5L2RRJidsmY5AmgSSEVonOmO-x_kzOBFqlRpCBUgBl5R0uOIYIL3iF1/exec";
const token = new URLSearchParams(window.location.search).get("token");

let GERENTE = "";
let CONTRATO_ATUAL = "";

// Carrega gerente e contratos
fetch(`${API}?token=${token}`)
  .then(r => r.json())
  .then(data => {
    if (data.error) {
      alert(data.error);
      return;
    }

    GERENTE = data.gerente;
    document.getElementById("gerente").value = GERENTE;

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
  CONTRATO_ATUAL = contrato;

  document.getElementById("tituloContrato").innerText = contrato;
  document.getElementById("contrato").value = contrato;
  document.getElementById("dataEnvio").value =
    new Date().toLocaleDateString("pt-BR");

  document.getElementById("formWrapper").classList.remove("hidden");

  carregarHistorico();
}

function carregarHistorico() {
  fetch(`${API}?token=${token}&contrato=${encodeURIComponent(CONTRATO_ATUAL)}`)
    .then(r => r.json())
    .then(data => {
      const div = document.getElementById("historico");
      div.innerHTML = "";

      if (!data.historico || data.historico.length === 0) {
        div.innerHTML = "<p>Sem registros anteriores</p>";
        return;
      }

      data.historico.forEach(h => {
        div.innerHTML += `
          <div class="history-item">
            <strong>${new Date(h.data).toLocaleDateString()}</strong><br>
            💰 ${h.fatPrevMes} | 💸 ${h.custoPrevMes}<br>
            👷 ${h.prodRealMes}
          </div>
        `;
      });
    });
}

function enviar() {
  const payload = {
    token: token,
    gerente: GERENTE,
    contrato: CONTRATO_ATUAL,
    fatPrevMes: document.getElementById("fatPrevMes").value,
    fatProxSemana: document.getElementById("fatProxSemana").value,
    custoPrevMes: document.getElementById("custoPrevMes").value,
    custoProxSemana: document.getElementById("custoProxSemana").value,
    prodPrevMes: document.getElementById("prodPrevMes").value,
    prodRealMes: document.getElementById("prodRealMes").value,
    prodProxSemana: document.getElementById("prodProxSemana").value,
    planoGuerra: document.getElementById("planoGuerra").value,
    destaques: document.getElementById("destaques").value,
    concentracoes: document.getElementById("concentracoes").value
  };

  fetch(API, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(() => {
    alert("Relatório enviado com sucesso!");
    carregarHistorico();
  });
}

