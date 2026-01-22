# Gestao-Logistica

# 📦 Sistema de Gestão Logística

Sistema web simples e funcional para **gestão operacional de equipes de logística**, desenvolvido em **HTML, CSS e JavaScript**, com armazenamento local (`localStorage`) e suporte a **backup, importação/exportação e uso em celular (PWA)**.

Ideal para equipes com:

* colaboradores em **carros, motos, bicicletas, pedestres**
* setores diferentes
* necessidade de controle diário de presença, tarefas e veículos

---

## 🚀 Funcionalidades

### 👥 Gestão de Colaboradores

* Cadastro de colaboradores
* Definição de função:

  * Carteiro
  * Motorista
  * Motociclista
  * Pedestre
  * Bicicleta
  * Interno
  * Gestão
* Exclusão de colaboradores
* Uso automático em:

  * Ponto diário
  * Atribuição de tarefas
  * Dashboard por função

---

### 🕒 Ponto Diário

* Registro diário por colaborador:

  * ✅ Presente
  * ❌ Falta
  * ⏰ Atraso
* Campo de **observação** (ex: INSS, férias, apoio externo)
* **Edição após lançamento** (status e observação)
* Histórico por data
* Base para relatórios e dashboard

---

### 📦 Gestão de Tarefas

* Criação de tarefas por setor
* Atribuição de responsável
* Alteração de responsável
* Alteração de status:

  * Pendente
  * Em andamento
  * Concluída
* Exclusão de tarefas
* Contagem automática no dashboard

---

### 🚗 Gestão de Veículos

* Cadastro de veículos:

  * Carro
  * Moto
  * Bicicleta
* Status:

  * Ativo
  * Manutenção
* Alteração de status
* Exclusão de veículos
* Visão clara no dashboard

---

### 📊 Dashboard (Atualização automática)

Exibe em tempo real:

* Total de colaboradores
* Presentes / Faltas / Atrasos (do dia)
* Presença por **função** (mostra onde há desfalque)
* Tarefas pendentes
* Tarefas concluídas
* Veículos ativos
* Veículos em manutenção

Tudo é recalculado automaticamente sempre que algo muda no sistema.

---

## 💾 Backup e Restauração

### 📤 Exportar JSON

* Exporta **todos os dados do sistema**:

  * colaboradores
  * tarefas
  * veículos
  * ponto
* Arquivo versionado com data e hora
* Usado para backup e migração entre dispositivos

### 📥 Importar JSON

* Restaura completamente os dados
* Substitui o conteúdo atual
* Validação básica do arquivo
* Compatível com versões anteriores
* Ideal para trocar de computador ou celular

⚠️ **Nunca edite o JSON manualmente**, sempre gere pelo botão de exportação.

---

## 📊 Exportação de Relatórios

* Exportação para **Excel (.xlsx)**:

  * uma aba por módulo
* Exportação de **PDF**:

  * relatório diário
  * tarefas
  * ponto do dia

---

## 📱 Versão Mobile (PWA)

* Instalável no celular (Android / iOS)
* Funciona offline
* Interface responsiva
* Pode ser usada como aplicativo
* Ideal para supervisão em campo

---

## 🗂 Estrutura do Projeto

```
gestao-logistica/
├── index.html          # Interface principal
├── styles.css          # Estilos (responsivo)
├── app.js              # Lógica do sistema
├── manifest.json       # Configuração PWA
├── service-worker.js   # Cache offline
└── README.md           # Documentação
```

---

## ▶️ Como Usar

1. Baixe ou copie os arquivos do projeto
2. Abra o arquivo `index.html` no navegador
3. Cadastre colaboradores, tarefas e veículos
4. Use o **Ponto Diário** diariamente
5. Faça **backup JSON regularmente**
6. (Opcional) Instale como aplicativo no celular

---

## 🔐 Armazenamento

* Todos os dados são salvos localmente via `localStorage`
* Cada dispositivo possui seus próprios dados
* Para mover dados entre dispositivos, use **Exportar / Importar JSON**

---

## 🧠 Boas Práticas

* Fazer backup diário ou semanal
* Usar observações no ponto para justificativas
* Conferir dashboard antes de distribuir tarefas
* Exportar Excel/PDF para relatórios administrativos

---

## 🔮 Próximas Evoluções (planejadas / possíveis)

* Login por perfil (gestor / supervisor)
* Escala automática
* Alertas de desfalque
* Gráficos estatísticos
* Integração com GPS
* Backend e banco de dados
* Assinatura digital de entrega

---

## 📄 Licença

Projeto interno / uso administrativo.
Pode ser adaptado livremente conforme a necessidade da unidade.

---

## 🤝 Suporte

Sistema desenvolvido de forma incremental e modular.
Qualquer ajuste ou evolução pode ser feito sem reescrever tudo.

---

📦 **Esse sistema já está pronto para uso real em operação logística diária.**
