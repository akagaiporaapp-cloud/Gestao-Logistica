let colaboradores = JSON.parse(localStorage.getItem("colabs")) || [];
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let veiculos = JSON.parse(localStorage.getItem("veics")) || [];
let ponto = JSON.parse(localStorage.getItem("ponto")) || [];

// ---------- NAVEGAÇÃO ----------
function mostrar(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  atualizarTudo();
}

// ---------- COLABORADORES ----------
function addColaborador(e) {
  e.preventDefault();
  colaboradores.push({ nome: colabNome.value, funcao: colabFuncao.value });
  salvar();
  e.target.reset();
}

function listarColaboradores() {
  listaColaboradores.innerHTML = "";
  colaboradores.forEach((c, i) => {
    listaColaboradores.innerHTML += `
      <li>${c.nome} - ${c.funcao}
        <button onclick="colaboradores.splice(${i},1);salvar()">🗑️</button>
      </li>`;
  });
}

// ---------- PONTO ----------
function carregarColabsPonto() {
  pontoColab.innerHTML = "";
  colaboradores.forEach(c => {
    pontoColab.innerHTML += `<option>${c.nome}</option>`;
  });
}

function registrarPonto(e) {
  e.preventDefault();

  const data = pontoData.value;
  const colaborador = pontoColab.value;

  // impede duplicar ponto no mesmo dia
  const existente = ponto.find(
    p => p.colaborador === colaborador && p.data === data
  );

  if (existente) {
    existente.tipo = pontoTipo.value;
    existente.obs = pontoObs.value;
  } else {
    ponto.push({
      id: Date.now(), // ID ÚNICO
      colaborador,
      funcao: colaboradores.find(c => c.nome === colaborador)?.funcao || "",
      data,
      tipo: pontoTipo.value,
      obs: pontoObs.value
    });
  }

  salvar();
  e.target.reset();
}

function listarPonto() {
  listaPonto.innerHTML = "";
  const hoje = new Date().toISOString().split("T")[0];

  ponto
    .filter(p => p.data === hoje)
    .forEach(p => {
      listaPonto.innerHTML += `
        <li>
          <strong>${p.colaborador}</strong> (${p.funcao})<br>

          <select onchange="alterarPonto(${p.id}, 'tipo', this.value)">
            <option ${p.tipo === 'Presente' ? 'selected' : ''}>Presente</option>
            <option ${p.tipo === 'Falta' ? 'selected' : ''}>Falta</option>
            <option ${p.tipo === 'Atraso' ? 'selected' : ''}>Atraso</option>
          </select>

          <input
            value="${p.obs || ''}"
            placeholder="Observação"
            onchange="alterarPonto(${p.id}, 'obs', this.value)"
          >
        </li>
      `;
    });
}

function alterarPonto(id, campo, valor) {
  const registro = ponto.find(p => p.id === id);
  if (!registro) return;

  registro[campo] = valor;
  salvar();
}


// ---------- TAREFAS ----------
function carregarRespTarefa() {
  tarefaResp.innerHTML = "";
  colaboradores.forEach(c => tarefaResp.innerHTML += `<option>${c.nome}</option>`);
}

function addTarefa(e) {
  e.preventDefault();
  tarefas.push({
    descricao: tarefaDesc.value,
    setor: tarefaSetor.value,
    responsavel: tarefaResp.value,
    status: tarefaStatus.value
  });
  salvar();
  e.target.reset();
}

function listarTarefas() {
  listaTarefas.innerHTML = "";
  tarefas.forEach((t, i) => {
    listaTarefas.innerHTML += `
      <li>
        ${t.descricao} - ${t.setor}<br>
        <select onchange="tarefas[${i}].responsavel=this.value;salvar()">
          ${colaboradores.map(c =>
            `<option ${c.nome===t.responsavel?'selected':''}>${c.nome}</option>`
          ).join("")}
        </select>
        <select onchange="tarefas[${i}].status=this.value;salvar()">
          <option ${t.status==='Pendente'?'selected':''}>Pendente</option>
          <option ${t.status==='Em andamento'?'selected':''}>Em andamento</option>
          <option ${t.status==='Concluída'?'selected':''}>Concluída</option>
        </select>
        <button onclick="tarefas.splice(${i},1);salvar()">🗑️</button>
      </li>`;
  });
}

// ---------- VEÍCULOS ----------
function addVeiculo(e) {
  e.preventDefault();
  veiculos.push({ placa: veicPlaca.value, tipo: veicTipo.value, status: veicStatus.value });
  salvar();
  e.target.reset();
}

function listarVeiculos() {
  listaVeiculos.innerHTML = "";
  veiculos.forEach((v, i) => {
    listaVeiculos.innerHTML += `
      <li>
        ${v.tipo} - ${v.placa}
        <select onchange="veiculos[${i}].status=this.value;salvar()">
          <option ${v.status==='Ativo'?'selected':''}>Ativo</option>
          <option ${v.status==='Manutenção'?'selected':''}>Manutenção</option>
        </select>
        <button onclick="veiculos.splice(${i},1);salvar()">🗑️</button>
      </li>`;
  });
}

// ---------- DASHBOARD ----------
function atualizarDashboard() {
  const hoje = new Date().toISOString().split("T")[0];
  const pontoHoje = ponto.filter(p => p.data === hoje);

  dColabs.innerText = colaboradores.length;
  dPres.innerText = pontoHoje.filter(p => p.tipo === "Presente").length;
  dFalt.innerText = pontoHoje.filter(p => p.tipo === "Falta").length;
  dAtra.innerText = pontoHoje.filter(p => p.tipo === "Atraso").length;

  dTarPend.innerText = tarefas.filter(t => t.status === "Pendente").length;
  dTarAnd.innerText = tarefas.filter(t => t.status === "Em andamento").length;
  dTarConc.innerText = tarefas.filter(t => t.status === "Concluída").length;

  dVeicAt.innerText = veiculos.filter(v => v.status === "Ativo").length;
  dVeicMan.innerText = veiculos.filter(v => v.status === "Manutenção").length;

  // Presença por função
  const porFuncao = {};
  pontoHoje.forEach(p => {
    if (!porFuncao[p.funcao]) {
      porFuncao[p.funcao] = { Presente:0, Falta:0, Atraso:0 };
    }
    porFuncao[p.funcao][p.tipo]++;
  });

  presencaPorFuncao.innerHTML = "";
  Object.keys(porFuncao).forEach(f => {
    presencaPorFuncao.innerHTML += `
      <li>
        <strong>${f}</strong> →
        ✅ ${porFuncao[f].Presente} |
        ❌ ${porFuncao[f].Falta} |
        ⏰ ${porFuncao[f].Atraso}
      </li>`;
  });

  // Alerta de desfalque
  const limites = { Motorista:1, Motociclista:2, Pedestre:1, Bicicleta:1, Interno:1 };
  listaDesfalque.innerHTML = "";
  let alerta = false;

  Object.keys(limites).forEach(f => {
    if ((porFuncao[f]?.Falta || 0) >= limites[f]) {
      alerta = true;
      listaDesfalque.innerHTML += `<li>${f}: ${porFuncao[f].Falta} falta(s)</li>`;
    }
  });

  alertaDesfalque.style.display = alerta ? "block" : "none";
}

// ---------- BACKUP ----------
function exportarJSON() {
  const dados = { colaboradores, tarefas, veiculos, ponto };
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "backup-gestao-logistica.json";
  a.click();
}

function importarJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const dados = JSON.parse(e.target.result);

    colaboradores = Array.isArray(dados.colaboradores) ? dados.colaboradores : [];
    tarefas = Array.isArray(dados.tarefas) ? dados.tarefas : [];
    veiculos = Array.isArray(dados.veiculos) ? dados.veiculos : [];
    ponto = Array.isArray(dados.ponto) ? dados.ponto : [];

    localStorage.clear();
    salvar();
  };
  reader.readAsText(file);
}

// ---------- SALVAR ----------
function salvar() {
  localStorage.setItem("colabs", JSON.stringify(colaboradores));
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  localStorage.setItem("veics", JSON.stringify(veiculos));
  localStorage.setItem("ponto", JSON.stringify(ponto));
  atualizarTudo();
}

function atualizarTudo() {
  listarColaboradores();
  listarPonto();
  listarTarefas();
  listarVeiculos();
  carregarColabsPonto();
  carregarRespTarefa();
  atualizarDashboard();
}

atualizarTudo();
