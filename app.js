let colaboradores = JSON.parse(localStorage.getItem("colabs")) || [];
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let veiculos = JSON.parse(localStorage.getItem("veics")) || [];
let ponto = JSON.parse(localStorage.getItem("ponto")) || [];

// Variáveis para controle de filtros
let colaboradoresFiltrados = [];
let tarefasFiltradas = [];
let veiculosFiltrados = [];
let pontoFiltrado = [];

// ---------- NAVEGAÇÃO ----------
function mostrar(id) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
  
  // Forçar atualização do dashboard quando for mostrado
  if (id === 'dashboard') {
    setTimeout(atualizarDashboard, 100);
  }
  
  atualizarTudo();
}

// ---------- COLABORADORES ----------
function addColaborador(e) {
  e.preventDefault();
  const nome = document.getElementById('colabNome').value.trim();
  const funcao = document.getElementById('colabFuncao').value;
  
  if (!nome) return;
  
  colaboradores.push({ 
    id: Date.now(),
    nome: nome, 
    funcao: funcao 
  });
  salvar();
  e.target.reset();
  filtrarColaboradores();
}

function listarColaboradores(filtrados = colaboradores) {
  const listaColaboradores = document.getElementById('listaColaboradores');
  if (!listaColaboradores) return;
  
  listaColaboradores.innerHTML = "";
  
  if (filtrados.length === 0) {
    listaColaboradores.innerHTML = '<li class="sem-registros">Nenhum colaborador encontrado</li>';
    return;
  }

  filtrados.forEach((c, i) => {
    listaColaboradores.innerHTML += `
      <li>
        <strong>${c.nome}</strong> - ${c.funcao}
        <button onclick="removerColaborador(${c.id})">🗑️</button>
      </li>`;
  });
}

function filtrarColaboradores() {
  const filtroNome = document.getElementById('filtroColab').value.toLowerCase();
  const filtroFuncao = document.getElementById('filtroColabFuncao').value;
  
  colaboradoresFiltrados = colaboradores.filter(col => {
    const nomeMatch = col.nome.toLowerCase().includes(filtroNome);
    const funcaoMatch = !filtroFuncao || col.funcao === filtroFuncao;
    return nomeMatch && funcaoMatch;
  });
  
  listarColaboradores(colaboradoresFiltrados);
}

function removerColaborador(id) {
  if (confirm('Tem certeza que deseja remover este colaborador?')) {
    const index = colaboradores.findIndex(c => c.id === id);
    if (index > -1) {
      colaboradores.splice(index, 1);
      salvar();
      filtrarColaboradores();
    }
  }
}

// ---------- PONTO ----------
function carregarColabsPonto() {
  const pontoColab = document.getElementById('pontoColab');
  if (!pontoColab) return;
  
  pontoColab.innerHTML = '<option value="">Selecione um colaborador</option>';
  colaboradores.forEach(c => {
    pontoColab.innerHTML += `<option value="${c.nome}">${c.nome} (${c.funcao})</option>`;
  });
}

function registrarPonto(e) {
  e.preventDefault();

  const data = document.getElementById('pontoData').value;
  const colaborador = document.getElementById('pontoColab').value;
  const tipo = document.getElementById('pontoTipo').value;
  const obs = document.getElementById('pontoObs').value;

  if (!colaborador) {
    alert('Selecione um colaborador!');
    return;
  }

  const existente = ponto.find(
    p => p.colaborador === colaborador && p.data === data
  );

  if (existente) {
    existente.tipo = tipo;
    existente.obs = obs;
    existente.funcao = colaboradores.find(c => c.nome === colaborador)?.funcao || "";
  } else {
    ponto.push({
      id: Date.now(),
      colaborador: colaborador,
      funcao: colaboradores.find(c => c.nome === colaborador)?.funcao || "",
      data: data,
      tipo: tipo,
      obs: obs
    });
  }

  salvar();
  e.target.reset();
  document.getElementById('pontoData').value = new Date().toISOString().split('T')[0];
  filtrarPonto();
}

function listarPonto(filtrados = ponto) {
  const listaPonto = document.getElementById('listaPonto');
  if (!listaPonto) return;
  
  listaPonto.innerHTML = "";
  
  if (filtrados.length === 0) {
    listaPonto.innerHTML = '<li class="sem-registros">Nenhum registro encontrado</li>';
    return;
  }

  filtrados.forEach(p => {
    listaPonto.innerHTML += `
      <li>
        <div style="margin-bottom: 10px;">
          <strong>${p.colaborador}</strong> (${p.funcao}) - ${formatarData(p.data)}<br>
          <small>Observação: ${p.obs || 'Nenhuma'}</small>
        </div>
        
        <div style="display: flex; gap: 10px; align-items: center;">
          <span>Status:</span>
          <select onchange="alterarPonto(${p.id}, 'tipo', this.value)">
            <option value="Presente" ${p.tipo === 'Presente' ? 'selected' : ''}>Presente</option>
            <option value="Falta" ${p.tipo === 'Falta' ? 'selected' : ''}>Falta</option>
            <option value="Atraso" ${p.tipo === 'Atraso' ? 'selected' : ''}>Atraso</option>
          </select>
          
          <input
            type="text"
            value="${p.obs || ''}"
            placeholder="Nova observação..."
            onchange="alterarPonto(${p.id}, 'obs', this.value)"
            style="flex: 1;"
          >
          
          <button onclick="removerPonto(${p.id})">🗑️</button>
        </div>
      </li>`;
  });
}

function filtrarPonto() {
  const filtroNome = document.getElementById('filtroPontoColab')?.value.toLowerCase() || '';
  const filtroTipo = document.getElementById('filtroPontoTipo')?.value || '';
  const filtroFuncao = document.getElementById('filtroPontoFuncao')?.value || '';
  const filtroData = document.getElementById('filtroPontoData')?.value || '';
  
  pontoFiltrado = ponto.filter(p => {
    const nomeMatch = p.colaborador.toLowerCase().includes(filtroNome);
    const tipoMatch = !filtroTipo || p.tipo === filtroTipo;
    const funcaoMatch = !filtroFuncao || p.funcao === filtroFuncao;
    const dataMatch = !filtroData || p.data === filtroData;
    return nomeMatch && tipoMatch && funcaoMatch && dataMatch;
  });
  
  listarPonto(pontoFiltrado);
}

function alterarPonto(id, campo, valor) {
  const registro = ponto.find(p => p.id === id);
  
  if (registro) {
    registro[campo] = valor;
    salvar();
    filtrarPonto();
  }
}

function removerPonto(id) {
  if (confirm('Tem certeza que deseja remover este registro de ponto?')) {
    const index = ponto.findIndex(p => p.id === id);
    if (index > -1) {
      ponto.splice(index, 1);
      salvar();
      filtrarPonto();
    }
  }
}

function formatarData(dataStr) {
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// ---------- TAREFAS ----------
function carregarRespTarefa() {
  const tarefaResp = document.getElementById('tarefaResp');
  const filtroResp = document.getElementById('filtroTarefaResponsavel');
  const filtroSetor = document.getElementById('filtroTarefaSetor');
  
  if (!tarefaResp || !filtroResp || !filtroSetor) return;
  
  tarefaResp.innerHTML = '<option value="">Selecione um responsável</option>';
  filtroResp.innerHTML = '<option value="">Todos os responsáveis</option>';
  filtroSetor.innerHTML = '<option value="">Todos os setores</option>';
  
  const setoresUnicos = [...new Set(tarefas.map(t => t.setor).filter(Boolean))];
  
  colaboradores.forEach(c => {
    tarefaResp.innerHTML += `<option value="${c.nome}">${c.nome}</option>`;
    filtroResp.innerHTML += `<option value="${c.nome}">${c.nome}</option>`;
  });
  
  setoresUnicos.forEach(setor => {
    filtroSetor.innerHTML += `<option value="${setor}">${setor}</option>`;
  });
}

function addTarefa(e) {
  e.preventDefault();
  
  const descricao = document.getElementById('tarefaDesc').value.trim();
  const setor = document.getElementById('tarefaSetor').value.trim();
  const responsavel = document.getElementById('tarefaResp').value;
  const status = document.getElementById('tarefaStatus').value;
  
  if (!descricao) return;
  
  tarefas.push({
    id: Date.now(),
    descricao: descricao,
    setor: setor,
    responsavel: responsavel,
    status: status
  });
  
  salvar();
  e.target.reset();
  carregarRespTarefa();
  filtrarTarefas();
}

function listarTarefas(filtrados = tarefas) {
  const listaTarefas = document.getElementById('listaTarefas');
  if (!listaTarefas) return;
  
  listaTarefas.innerHTML = "";
  
  if (filtrados.length === 0) {
    listaTarefas.innerHTML = '<li class="sem-registros">Nenhuma tarefa encontrada</li>';
    return;
  }

  filtrados.forEach(t => {
    listaTarefas.innerHTML += `
      <li>
        <div style="margin-bottom: 10px;">
          <strong>${t.descricao}</strong>${t.setor ? ` - ${t.setor}` : ''}<br>
          <small>Responsável: ${t.responsavel || 'Não definido'}</small>
        </div>
        
        <div style="display: flex; gap: 10px; align-items: center;">
          <span>Status:</span>
          <select onchange="alterarTarefa(${t.id}, 'status', this.value)">
            <option value="Pendente" ${t.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
            <option value="Em andamento" ${t.status === 'Em andamento' ? 'selected' : ''}>Em andamento</option>
            <option value="Concluída" ${t.status === 'Concluída' ? 'selected' : ''}>Concluída</option>
          </select>
          
          <select onchange="alterarTarefa(${t.id}, 'responsavel', this.value)" style="flex: 1;">
            <option value="">Mudar responsável...</option>
            ${colaboradores.map(c =>
              `<option value="${c.nome}" ${c.nome === t.responsavel ? 'selected' : ''}>${c.nome}</option>`
            ).join("")}
          </select>
          
          <button onclick="removerTarefa(${t.id})">🗑️</button>
        </div>
      </li>`;
  });
}

function filtrarTarefas() {
  const filtroDesc = document.getElementById('filtroTarefaDesc')?.value.toLowerCase() || '';
  const filtroResp = document.getElementById('filtroTarefaResponsavel')?.value || '';
  const filtroStatus = document.getElementById('filtroTarefaStatus')?.value || '';
  const filtroSetor = document.getElementById('filtroTarefaSetor')?.value || '';
  
  tarefasFiltradas = tarefas.filter(t => {
    const descMatch = t.descricao.toLowerCase().includes(filtroDesc);
    const respMatch = !filtroResp || t.responsavel === filtroResp;
    const statusMatch = !filtroStatus || t.status === filtroStatus;
    const setorMatch = !filtroSetor || t.setor === filtroSetor;
    return descMatch && respMatch && statusMatch && setorMatch;
  });
  
  listarTarefas(tarefasFiltradas);
}

function alterarTarefa(id, campo, valor) {
  const tarefa = tarefas.find(t => t.id === id);
  
  if (tarefa) {
    tarefa[campo] = valor;
    salvar();
    filtrarTarefas();
  }
}

function removerTarefa(id) {
  if (confirm('Tem certeza que deseja remover esta tarefa?')) {
    const index = tarefas.findIndex(t => t.id === id);
    if (index > -1) {
      tarefas.splice(index, 1);
      salvar();
      filtrarTarefas();
    }
  }
}

// ---------- VEÍCULOS ----------
function addVeiculo(e) {
  e.preventDefault();
  
  veiculos.push({ 
    id: Date.now(),
    placa: document.getElementById('veicPlaca').value.trim().toUpperCase(), 
    tipo: document.getElementById('veicTipo').value, 
    status: document.getElementById('veicStatus').value 
  });
  
  salvar();
  e.target.reset();
  filtrarVeiculos();
}

function listarVeiculos(filtrados = veiculos) {
  const listaVeiculos = document.getElementById('listaVeiculos');
  if (!listaVeiculos) return;
  
  listaVeiculos.innerHTML = "";
  
  if (filtrados.length === 0) {
    listaVeiculos.innerHTML = '<li class="sem-registros">Nenhum veículo encontrado</li>';
    return;
  }

  filtrados.forEach(v => {
    listaVeiculos.innerHTML += `
      <li>
        <div style="margin-bottom: 10px;">
          <strong>${v.tipo}</strong> - ${v.placa}
        </div>
        
        <div style="display: flex; gap: 10px; align-items: center;">
          <span>Status:</span>
          <select onchange="alterarVeiculo(${v.id}, 'status', this.value)" style="flex: 1;">
            <option value="Ativo" ${v.status === 'Ativo' ? 'selected' : ''}>Ativo</option>
            <option value="Manutenção" ${v.status === 'Manutenção' ? 'selected' : ''}>Manutenção</option>
          </select>
          
          <button onclick="removerVeiculo(${v.id})">🗑️</button>
        </div>
      </li>`;
  });
}

function filtrarVeiculos() {
  const filtroPlaca = document.getElementById('filtroVeiculoPlaca')?.value.toUpperCase() || '';
  const filtroTipo = document.getElementById('filtroVeiculoTipo')?.value || '';
  const filtroStatus = document.getElementById('filtroVeiculoStatus')?.value || '';
  
  veiculosFiltrados = veiculos.filter(v => {
    const placaMatch = v.placa.includes(filtroPlaca);
    const tipoMatch = !filtroTipo || v.tipo === filtroTipo;
    const statusMatch = !filtroStatus || v.status === filtroStatus;
    return placaMatch && tipoMatch && statusMatch;
  });
  
  listarVeiculos(veiculosFiltrados);
}

function alterarVeiculo(id, campo, valor) {
  const veiculo = veiculos.find(v => v.id === id);
  if (veiculo) {
    veiculo[campo] = valor;
    salvar();
    filtrarVeiculos();
  }
}

function removerVeiculo(id) {
  if (confirm('Tem certeza que deseja remover este veículo?')) {
    const index = veiculos.findIndex(v => v.id === id);
    if (index > -1) {
      veiculos.splice(index, 1);
      salvar();
      filtrarVeiculos();
    }
  }
}

// ---------- DASHBOARD ----------
function atualizarDashboard() {
  console.log('Atualizando dashboard...');
  
  const hoje = new Date().toISOString().split("T")[0];
  const pontoHoje = ponto.filter(p => p.data === hoje);

  // Atualizar contadores - com verificação robusta
  const dColabs = document.getElementById('dColabs');
  const dPres = document.getElementById('dPres');
  const dFalt = document.getElementById('dFalt');
  const dAtra = document.getElementById('dAtra');
  const dTarPend = document.getElementById('dTarPend');
  const dTarAnd = document.getElementById('dTarAnd');
  const dTarConc = document.getElementById('dTarConc');
  const dVeicAt = document.getElementById('dVeicAt');
  const dVeicMan = document.getElementById('dVeicMan');
  
  if (dColabs) dColabs.innerText = colaboradores.length;
  if (dPres) dPres.innerText = pontoHoje.filter(p => p.tipo === "Presente").length;
  if (dFalt) dFalt.innerText = pontoHoje.filter(p => p.tipo === "Falta").length;
  if (dAtra) dAtra.innerText = pontoHoje.filter(p => p.tipo === "Atraso").length;

  if (dTarPend) dTarPend.innerText = tarefas.filter(t => t.status === "Pendente").length;
  if (dTarAnd) dTarAnd.innerText = tarefas.filter(t => t.status === "Em andamento").length;
  if (dTarConc) dTarConc.innerText = tarefas.filter(t => t.status === "Concluída").length;

  // Calcula veículos ativos e em manutenção
  const veiculosAtivos = veiculos.filter(v => v.status === "Ativo").length;
  const veiculosManutencao = veiculos.filter(v => v.status === "Manutenção").length;
  
  if (dVeicAt) dVeicAt.innerText = veiculosAtivos;
  if (dVeicMan) dVeicMan.innerText = veiculosManutencao;

  // NOVO: Calcula veículos por tipo com verificação
  const veiculosCarroAtivo = veiculos.filter(v => v.tipo === "Carro" && v.status === "Ativo").length;
  const veiculosCarroManutencao = veiculos.filter(v => v.tipo === "Carro" && v.status === "Manutenção").length;
  const veiculosMotoAtivo = veiculos.filter(v => v.tipo === "Moto" && v.status === "Ativo").length;
  const veiculosMotoManutencao = veiculos.filter(v => v.tipo === "Moto" && v.status === "Manutenção").length;
  const veiculosBicicletaAtivo = veiculos.filter(v => v.tipo === "Bicicleta" && v.status === "Ativo").length;
  const veiculosBicicletaManutencao = veiculos.filter(v => v.tipo === "Bicicleta" && v.status === "Manutenção").length;

  // Atualizar detalhes por tipo - com verificação de elemento
  const detalhesVeiculos = document.getElementById('detalhesVeiculos');
  if (detalhesVeiculos) {
    detalhesVeiculos.innerHTML = `
      <div class="tipo-veiculo">
        <span>🚗 Carros:</span>
        <span class="ativo">${veiculosCarroAtivo} ativos</span>
        <span class="manutencao">${veiculosCarroManutencao} em manutenção</span>
        <span class="total">${veiculosCarroAtivo + veiculosCarroManutencao} total</span>
      </div>
      <div class="tipo-veiculo">
        <span>🏍️ Motos:</span>
        <span class="ativo">${veiculosMotoAtivo} ativos</span>
        <span class="manutencao">${veiculosMotoManutencao} em manutenção</span>
        <span class="total">${veiculosMotoAtivo + veiculosMotoManutencao} total</span>
      </div>
      <div class="tipo-veiculo">
        <span>🚲 Bicicletas:</span>
        <span class="ativo">${veiculosBicicletaAtivo} ativos</span>
        <span class="manutencao">${veiculosBicicletaManutencao} em manutenção</span>
        <span class="total">${veiculosBicicletaAtivo + veiculosBicicletaManutencao} total</span>
      </div>
    `;
  }

  // Presença por função
  const porFuncao = {};
  pontoHoje.forEach(p => {
    if (!porFuncao[p.funcao]) {
      porFuncao[p.funcao] = { Presente: 0, Falta: 0, Atraso: 0 };
    }
    porFuncao[p.funcao][p.tipo]++;
  });

  const presencaPorFuncao = document.getElementById('presencaPorFuncao');
  if (presencaPorFuncao) {
    presencaPorFuncao.innerHTML = "";
    
    if (Object.keys(porFuncao).length === 0) {
      presencaPorFuncao.innerHTML = '<li class="sem-registros">Nenhum registro de ponto hoje</li>';
    } else {
      Object.keys(porFuncao).forEach(f => {
        presencaPorFuncao.innerHTML += `
          <li>
            <strong>${f}</strong> →
            ✅ ${porFuncao[f].Presente} |
            ❌ ${porFuncao[f].Falta} |
            ⏰ ${porFuncao[f].Atraso}
          </li>`;
      });
    }
  }

  // Alerta de desfalque
  const limites = { 
    Motorista: 1, 
    Motociclista: 2, 
    Pedestre: 1, 
    Bicicleta: 1, 
    Interno: 1 
  };
  
  const listaDesfalque = document.getElementById('listaDesfalque');
  const alertaDesfalque = document.getElementById('alertaDesfalque');
  
  if (listaDesfalque && alertaDesfalque) {
    listaDesfalque.innerHTML = "";
    let alerta = false;

    Object.keys(limites).forEach(f => {
      const faltas = porFuncao[f]?.Falta || 0;
      if (faltas >= limites[f]) {
        alerta = true;
        listaDesfalque.innerHTML += `<li>${f}: ${faltas} falta(s) - Limite: ${limites[f]}</li>`;
      }
    });

    alertaDesfalque.style.display = alerta ? "block" : "none";
  }
  
  console.log('Dashboard atualizada com sucesso!');
}

// ---------- BACKUP ----------
function exportarJSON() {
  const dados = { 
    colaboradores, 
    tarefas, 
    veiculos, 
    ponto,
    exportadoEm: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `backup-gestao-logistica-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}

function importarJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const dados = JSON.parse(e.target.result);

      if (confirm('Importar dados? Isso substituirá todos os dados atuais.')) {
        colaboradores = Array.isArray(dados.colaboradores) ? dados.colaboradores.map(c => ({
          ...c,
          id: c.id || Date.now() + Math.random()
        })) : [];
        
        tarefas = Array.isArray(dados.tarefas) ? dados.tarefas.map(t => ({
          ...t,
          id: t.id || Date.now() + Math.random()
        })) : [];
        
        veiculos = Array.isArray(dados.veiculos) ? dados.veiculos.map(v => ({
          ...v,
          id: v.id || Date.now() + Math.random()
        })) : [];
        
        ponto = Array.isArray(dados.ponto) ? dados.ponto.map(p => ({
          ...p,
          id: p.id || Date.now() + Math.random()
        })) : [];

        salvar();
        alert("Dados importados com sucesso!");
      }
    } catch (error) {
      alert("Erro ao importar arquivo: " + error.message);
    }
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
  listarColaboradores(colaboradores);
  listarTarefas(tarefas);
  listarVeiculos(veiculos);
  listarPonto(ponto);
  carregarColabsPonto();
  carregarRespTarefa();
  atualizarDashboard();
}

// ---------- INICIALIZAÇÃO ROBUSTA ----------
function inicializarAplicacao() {
  console.log('Inicializando aplicação...');
  
  // Configurar data atual
  const hoje = new Date().toISOString().split("T")[0];
  
  // Configurar datas nos campos
  const pontoData = document.getElementById('pontoData');
  if (pontoData) {
    pontoData.value = hoje;
  }
  
  const filtroPontoData = document.getElementById('filtroPontoData');
  if (filtroPontoData) {
    filtroPontoData.value = hoje;
  }
  
  // Atualizar tudo com delay para garantir que o DOM está pronto
  setTimeout(() => {
    atualizarTudo();
    
    // Verificar se estamos na dashboard e forçar atualização
    const dashboardAtiva = document.getElementById('dashboard')?.classList.contains('ativa');
    if (dashboardAtiva) {
      console.log('Dashboard ativa, forçando atualização...');
      setTimeout(atualizarDashboard, 300);
    }
  }, 300);
}

// Aguardar DOM completamente carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarAplicacao);
} else {
  // DOM já carregado
  inicializarAplicacao();
}

// Atualizar dashboard periodicamente quando visível
setInterval(() => {
  const dashboardAtiva = document.getElementById('dashboard')?.classList.contains('ativa');
  if (dashboardAtiva) {
    atualizarDashboard();
  }
}, 10000); // Atualiza a cada 10 segundos

// Forçar atualização quando a janela ganha foco (útil para mobile)
window.addEventListener('focus', () => {
  const dashboardAtiva = document.getElementById('dashboard')?.classList.contains('ativa');
  if (dashboardAtiva) {
    atualizarDashboard();
  }
});

// Forçar atualização quando a página fica visível (mobile)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    const dashboardAtiva = document.getElementById('dashboard')?.classList.contains('ativa');
    if (dashboardAtiva) {
      setTimeout(atualizarDashboard, 100);
    }
  }
});