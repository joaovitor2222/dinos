const orcamentoInicial = 100000;
let orcamento = orcamentoInicial;
let exercitoDefesa = [];
let exercitoAtaque = [];
let dificuldade = "personalizado";
let clickCount = 0;
let exercito = [];
let contagemDinos = {};

const dinos = {
    "Argentinossauro": { poder: 120000, preco: 75000, tipo: "sauropode" },
    "Titanossauro": { poder: 140000, preco: 80000, tipo: "sauropode" },
    "Branquiossauro": { poder: 100000, preco: 74000, tipo: "sauropode" },
    "Diplodoco": { poder: 85000, preco: 70000, tipo: "sauropode" },
    "Apatossauro": { poder: 90000, preco: 72000, tipo: "sauropode" },

    "T-Rex": { poder: 40000, preco: 38000, tipo: "grande", solitario: true },
    "Giganotossauro": { poder: 39000, preco: 36000, tipo: "grande", bando: true },
    "Spinossauro": { poder: 38000, preco: 34000, tipo: "grande", solitario: true },
    
    "Carnotauro": { poder: 28000, preco: 7475, tipo: "medio" },  // 15% a mais
    "Ceratossauro": { poder: 25000, preco: 6900, tipo: "medio" }, // 15% a mais
    "Alossauro": { poder: 30000, preco: 8050, tipo: "medio", bando: true }, // 15% a mais

    "Velociraptor": { poder: 10000, preco: 2000, tipo: "pequeno", bando: true }, // Preço mantido
    "Dimetrodonte": { poder: 15000, preco: 2500, tipo: "pequeno" }, // Preço mantido
    "Iguanodonte": { poder: 20000, preco: 4600, tipo: "medio", bando: true }, // 15% a mais

    "Triceratops": { poder: 25000, preco: 10350, tipo: "medio", defensivo: true }, // 15% a mais
    "Estiracossauro": { poder: 24000, preco: 10120, tipo: "medio", bando: true }, // 15% a mais

    "Oxalaia": { poder: 24000, preco: 5750, tipo: "grande" }, // 15% a mais
    "Pycnonemosaurus": { poder: 25000, preco: 6900, tipo: "grande" } // 15% a mais
};

// Função para definir dificuldade
function definirDificuldade(nivel) {
    dificuldade = nivel;
    orcamento = orcamentoInicial;
    exercitoDefesa = [];
    exercitoAtaque = [];

    if (nivel !== "personalizado") {
        escolherDinosIA();
    }

    mostrarDinosCompra();
    atualizarSelecionados();
    atualizarOrcamento();
}

function atualizarSelecionados() {
    let div = document.getElementById("selecionados");
    div.innerHTML = "<h3>Defensores:</h3>";

    exercitoDefesa.forEach(d => {
        div.innerHTML += `<p>${d.nome} (Poder: ${d.poder})</p>`;
    });

    if (dificuldade === "personalizado") {
        div.innerHTML += "<h3>Atacantes:</h3>";
        exercitoAtaque.forEach(d => {
            div.innerHTML += `<p>${d.nome} (Poder: ${d.poder})</p>`;
        });
    }
}

// Função para IA escolher dinossauros de ataque
function escolherDinosIA() {
    let budget = orcamento;
    let opcoes = Object.entries(dinos);

    // Ajustar preços para o modo difícil
    if (dificuldade === "dificil") {
        opcoes.forEach(([nome, dino]) => {
            if (dino.tipo === "sauropode") {
                let novosPrecos = {
                    "Titanossauro": 80000,
                    "Argentinossauro": 75000,
                    "Branquiossauro": 74000,
                    "Diplodoco": 70000
                };
                dino.preco = novosPrecos[nome] || dino.preco;
            } else if (dino.nome === "T-Rex") {
                dino.preco = 38000;
            } else if (dino.nome === "Giganotossauro") {
                dino.preco = 36000;
            }
        });
    }

    // IA seleciona dinossauros
    while (budget > 0) {
        let escolha;

        if (dificuldade === "facil") {
            escolha = opcoes[Math.floor(Math.random() * opcoes.length)][1];
        } else if (dificuldade === "medio") {
            let opcoesGrandes = opcoes.filter(([_, d]) => d.tipo === "grande");
            if (exercitoAtaque.filter(d => d.tipo === "grande").length < 4) {
                escolha = opcoesGrandes[Math.floor(Math.random() * opcoesGrandes.length)][1];
            } else {
                escolha = opcoes[Math.floor(Math.random() * opcoes.length)][1];
            }
        } else if (dificuldade === "dificil") {
            let opcoesSauropodes = opcoes.filter(([_, d]) => d.tipo === "sauropode");
            let opcoesGrandes = opcoes.filter(([_, d]) => d.tipo === "grande");

            if (Math.random() < 0.5) {
                escolha = opcoesSauropodes[Math.floor(Math.random() * opcoesSauropodes.length)][1];
            } else {
                escolha = opcoesGrandes[Math.floor(Math.random() * opcoesGrandes.length)][1];
            }
        }

        if (escolha && budget >= escolha.preco) {
            budget -= escolha.preco;
            exercitoAtaque.push(escolha);
        } else {
            break;
        }
    }

    calcularPoder();
}

// Atualizar preços para balanceamento
function ajustarPrecos() {
    let novosPrecos = {
        "Titanossauro": 80000, "Argentinossauro": 75000, "Branquiossauro": 74000, "Diplodoco": 70000,
        "T-Rex": 38000, "Giganotossauro": 36000, "Spinossauro": 34000, "Alossauro": 7000, "Carnotauro": 6500,
        "Ceratossauro": 6000, "Triceratops": 9000, "Estiracossauro": 8800
    };

    Object.entries(dinos).forEach(([nome, dino]) => {
        if (novosPrecos[nome]) {
            dino.preco = novosPrecos[nome];
        }
    });
}

    // Aplicar os novos preços ao carregar o jogo
    ajustarPrecos();


// Adicionar um dinossauro ao exército
function adicionarDino(tipo, nome) {
    let dino = dinos[nome];
    if (!dino) {
        alert("Dinossauro não encontrado!");
        return;
    }

    if (orcamento >= dino.preco) {
        orcamento -= dino.preco;
        
        if (tipo === "defesa") {
            exercitoDefesa.push(dino);
        } else {
            exercitoAtaque.push(dino);
        }

        // Atualiza a contagem
        if (contagemDinos[nome]) {
            contagemDinos[nome]++;
        } else {
            contagemDinos[nome] = 1;
        }

        atualizarOrcamento();
        calcularPoder();
        atualizarListaTime();
    } else {
        alert("Orçamento insuficiente!");
    }
}

function atualizarListaTime() {
    let lista = document.getElementById("listaTime");
    lista.innerHTML = ""; // Limpa antes de atualizar

    exercito.forEach(dino => {
        let item = document.createElement("li");
        item.textContent = `${dino.nome} x${dino.qtd}`;
        lista.appendChild(item);
    });
}

// Vender um dinossauro para recuperar orçamento
function venderDino(tipo, nome) {
    let exército = tipo === "defesa" ? exercitoDefesa : exercitoAtaque;
    let index = exército.findIndex(d => d.nome === nome);

    if (index !== -1) {
        let dino = exército.splice(index, 1)[0];
        orcamento += dino.preco;
        atualizarOrcamento();
        calcularPoder();
    } else {
        alert("Este dinossauro não está no seu exército.");
    }
}

function venderTudo() {
    let tipo = document.getElementById("tipoVenda").value;
    
    if (tipo === "defesa") {
        orcamento += exercitoDefesa.reduce((total, d) => total + d.preco, 0);
        exercitoDefesa = [];
    } else {
        orcamento += exercitoAtaque.reduce((total, d) => total + (dificuldade === "personalizado" ? 0 : d.preco), 0);
        exercitoAtaque = [];
    }

    atualizarOrcamento();
    atualizarSelecionados();
}

function venderDinoHTML() {
    let tipo = document.getElementById("tipoVenda").value;
    let nome = document.getElementById("dinoVenda").value.trim();

    // Normaliza o nome digitado para evitar erro de maiúsculas/minúsculas
    let nomeCorrigido = Object.keys(dinos).find(d => d.toLowerCase() === nome.toLowerCase());

    if (!nomeCorrigido) { 
        alert("Esse dinossauro não existe! Mas pode ser adicionado futuramente.");
        return;
    }

    venderDino(tipo, nomeCorrigido);
}




// Atualizar orçamento na tela
function atualizarOrcamento() {
    document.getElementById("orcamento").innerText = orcamento;
}

// Calcular o poder total do exército
function calcularPoder() {
    let poderPlayer = calcularForca(exercitoDefesa);
    let poderInimigo = calcularForca(exercitoAtaque);

    document.getElementById("power-player").style.width = (poderPlayer / 150000) * 100 + "%";
    document.getElementById("power-enemy").style.width = (poderInimigo / 150000) * 100 + "%";
}

// Função para calcular buffs e poder final
function calcularForca(exercito) {
    let poderTotal = 0;
    let contagem = {};

    exercito.forEach(dino => {
        poderTotal += dino.poder;

        if (dino.bando) {
            contagem[dino.tipo] = (contagem[dino.tipo] || 0) + 1;
        }
    });

    // Buffs de bando
    for (let tipo in contagem) {
        if (contagem[tipo] > 1) {
            let bonus = tipo === "grande" ? 5000 : tipo === "medio" ? 2000 : 500;
            poderTotal += contagem[tipo] * bonus;
        }
    }

    // Rivalidade: Triceratops defensivo ganha bônus contra predadores
    exercito.forEach(dino => {
        if (dino.defensivo) {
            let predadores = exercitoAtaque.filter(d => ["T-Rex", "Giganotossauro", "Spinossauro", "Alossauro"].includes(d.nome));
            predadores.forEach(p => {
                if (p.nome === "T-Rex") poderTotal += 4000;
                else poderTotal += 2000;
            });
        }
    });

    // Giganotossauro e Alossauro ganham 4000 contra Sauropodes
    let temSauropode = exercito.some(d => d.tipo === "sauropode");
    if (temSauropode) {
        exercito.forEach(dino => {
            if (["Giganotossauro", "Alossauro"].includes(dino.nome)) {
                poderTotal += 4000;
            }
        });
    }

    // Spinossauro perde 3000 contra Sauropodes, mas ganha 5000 se houver um T-Rex inimigo
    let temTrexInimigo = exercitoAtaque.some(d => d.nome === "T-Rex");
    exercito.forEach(dino => {
        if (dino.nome === "Spinossauro") {
            if (temSauropode) poderTotal -= 3000;
            if (temTrexInimigo) poderTotal += 5000;
        }
    });

    // Oxalaia + Pycnonemosaurus ganham 60 mil juntos
    let temOxalaia = exercito.some(d => d.nome === "Oxalaia");
    let temPycnonemosaurus = exercito.some(d => d.nome === "Pycnonemosaurus");
    if (temOxalaia && temPycnonemosaurus) {
        poderTotal += 60000;
    }

    return poderTotal;
}

// Exibir dinossauros disponíveis para compra
function mostrarDinosCompra() {
    let lista = document.getElementById("listaDinosCompra");
    lista.innerHTML = "";

    Object.keys(dinos).forEach(nome => {
        let dino = dinos[nome];

        // Criar um contêiner para cada dinossauro
        let div = document.createElement("div");

        // Criar dropdown para selecionar defesa ou ataque (aparece só no modo "personalizado")
        let select = document.createElement("select");
        select.innerHTML = `
            <option value="defesa">Defesa</option>
            <option value="ataque">Ataque</option>
        `;
        select.style.display = (dificuldade === "personalizado") ? "inline-block" : "none";

        // Criar botão para adicionar o dinossauro
        let botao = document.createElement("button");
        botao.innerText = `${nome} - R$${dino.preco}`;
        botao.onclick = () => adicionarDino(select.value, nome);
        botao.disabled = (orcamento < dino.preco); // Bloqueia se não tiver dinheiro

        // Adicionar elementos na página
        div.appendChild(botao);
        div.appendChild(select);
        lista.appendChild(div);
    });
}

// Confirmar dinossauros escolhidos
function confirmarDinos() {
    alert("Dinossauros confirmados!");
}

// Bloquear alteração dos atacantes se não for personalizado
function bloquearAtaque() {
    if (dificuldade !== "personalizado") {
        document.getElementById("ataque").innerHTML = "<p>Os atacantes são escolhidos automaticamente nessa dificuldade.</p>";
    }
}

document.getElementById("emojiClick").addEventListener("click", function() {
    clickCount++;

    // Quando o jogador clicar 3 vezes
    if (clickCount === 3) {
        document.getElementById("emojiClick").style.display = "none";  // Esconde a imagem
        document.getElementById("modoTrapaça").style.display = "block";  // Mostra o botão
    }
});

// Função para adicionar R$500.000 ao orçamento
function adicionarOrcamentoTrap() {
    orcamento += 500000;
    atualizarOrcamento();
    alert("R$500.000 adicionados ao orçamento!");
}

// Mostrar o mod menu ao carregar o jogo
window.onload = function() {
    document.getElementById("modMenu").style.display = "block";
};

// Chama as funções ao carregar a página
mostrarDinosCompra();
bloquearAtaque();
atualizarSelecionados();


// Simular batalha
function simularBatalha() {
    let poderDefesa = calcularForca(exercitoDefesa);
    let poderAtaque = calcularForca(exercitoAtaque);

    if (poderDefesa > poderAtaque) {
        alert("Você venceu!");
    } else if (poderDefesa < poderAtaque) {
        alert("Você perdeu!");
    } else {
        alert("Empate!");
    }
}
