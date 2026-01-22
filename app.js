let colaboradores = JSON.parse(localStorage.getItem("colabs")) || [];
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let veiculos = JSON.parse(localStorage.getItem("veics")) || [];
let ponto = JSON.parse(localStorage.getItem("ponto")) || [];

// ---------------- NAVEGAÇÃO ----------------
function mostrar(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  atualizarTudo();
}

// ---------------- COLABORADORES ----------------
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

// ---------------- PONTO ----------------
function carregarColabsPonto() {
  pontoColab.innerHTML = "";
  colaboradores.forEach(c => pontoColab.innerHTML += `<option>${c.nome}</option>`);
}

function registrarPonto(e) {
  e.preventDefault();

  ponto.push({
    colaborador: pontoColab.value,
    funcao: colaboradores.find(c => c.nome === pontoColab.value)?.funcao || "",
    data: pontoData.value,
    tipo: pontoTipo.value,
    obs: pontoObs.value
  });

  salvar();
  e.target.reset();
}

function alterarPonto(i, campo, valor) {
  ponto[i][campo] = valor;
  salvar();
}

function listarPonto() {
  listaPonto.innerHTML = "";
  const hoje = new Date().toISOString().split("T")[0];

  ponto.filter(p => p.data === hoje).forEach((p, i) => {
    listaPonto.innerHTML += `
      <li>
        ${p.colaborador} (${p.funcao})<br>
        <select onchange="alterarPonto(${i},'tipo',this.value)">
          <option ${p.tipo==='Presente'?'selected':''}>Presente</option>
          <option ${p.tipo==='Falta'?'selected':''}>Falta</option>
          <option ${p.tipo==='Atraso'?'selected':''}>Atraso</option>
        </select>
        <input value="${p.obs}" placeholder="Obs"
          onchange="alterarPonto(${i},'obs',this.value)">
      </li>`;
  });
}

// ---------------- TAREFAS ----------------
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

// ---------------- VEÍCULOS ----------------
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

// ---------------- DASHBOARD ----------------
function atualizarDashboard() {
  const hoje = new Date().toISOString().split("T")[0];

  dColabs.innerText = colaboradores.length;
  dPres.innerText = ponto.filter(p => p.data===hoje && p.tipo==="Presente").length;
  dFalt.innerText = ponto.filter(p => p.data===hoje && p.tipo==="Falta").length;
  dAtra.innerText = ponto.filter(p => p.data===hoje && p.tipo==="Atraso").length;
  dTarAnd.innerText = tarefas.filter(t => t.status === "Em andamento").length;

  const porFuncao = {};
  ponto.filter(p => p.data===hoje).forEach(p => {
    if (!porFuncao[p.funcao]) porFuncao[p.funcao] = { Presente:0, Falta:0 };
    porFuncao[p.funcao][p.tipo] = (porFuncao[p.funcao][p.tipo]||0)+1;
  });

  presencaPorFuncao.innerHTML = "";
  Object.keys(porFuncao).forEach(f => {
    presencaPorFuncao.innerHTML += `
      <li>${f}: ✅ ${porFuncao[f].Presente||0} | ❌ ${porFuncao[f].Falta||0}</li>`;
  });
}

// ---------------- SALVAR ----------------
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

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}


function atualizarDashboard() {
  const hoje = new Date().toISOString().split("T")[0];

  // --- COLABORADORES ---
  dColabs.innerText = colaboradores.length;

  // --- PONTO ---
  const pontoHoje = ponto.filter(p => p.data === hoje);

  dPres.innerText = pontoHoje.filter(p => p.tipo === "Presente").length;
  dFalt.innerText = pontoHoje.filter(p => p.tipo === "Falta").length;
  dAtra.innerText = pontoHoje.filter(p => p.tipo === "Atraso").length;

  // --- TAREFAS ---
dTarPend.innerText = tarefas.filter(t => t.status === "Pendente").length;
dTarAnd.innerText  = tarefas.filter(t => t.status === "Em andamento").length;
dTarConc.innerText = tarefas.filter(t => t.status === "Concluída").length;


  // --- VEÍCULOS ---
  dVeicAt.innerText = veiculos.filter(v => v.status === "Ativo").length;
  dVeicMan.innerText = veiculos.filter(v => v.status === "Manutenção").length;

  // --- PRESENÇA POR FUNÇÃO ---
  const porFuncao = {};

  pontoHoje.forEach(p => {
    if (!porFuncao[p.funcao]) {
      porFuncao[p.funcao] = { Presente: 0, Falta: 0, Atraso: 0 };
    }
    porFuncao[p.funcao][p.tipo]++;
  });

  presencaPorFuncao.innerHTML = "";
  Object.keys(porFuncao).forEach(funcao => {
    presencaPorFuncao.innerHTML += `
      <li>
        <strong>${funcao}</strong> →
        ✅ ${porFuncao[funcao].Presente || 0} |
        ❌ ${porFuncao[funcao].Falta || 0} |
        ⏰ ${porFuncao[funcao].Atraso || 0}
      </li>
    `;
  });
}
function exportarJSON() {
  const agora = new Date();

  const data = agora.toISOString().split("T")[0];
  const hora = agora.toTimeString().slice(0,5).replace(":", "h");

  const nomeArquivo = `backup-gestao-${data}-${hora}.json`;

  const dados = {
    versao: "1.0",
    geradoEm: agora.toISOString(),
    colaboradores,
    tarefas,
    veiculos,
    ponto
  };

  const blob = new Blob(
    [JSON.stringify(dados, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  a.click();
}
function importarJSON(event) {
  if (!confirm("Importar este backup irá substituir todos os dados atuais. Deseja continuar?")) {
    return;
  }

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const dados = JSON.parse(e.target.result);

    colaboradores = dados.colaboradores || [];
    tarefas = dados.tarefas || [];
    veiculos = dados.veiculos || [];
    ponto = dados.ponto || [];

    salvar();
    alert("Backup restaurado com sucesso!");
  };
  reader.readAsText(file);
}
