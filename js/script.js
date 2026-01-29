/**
 * DaggerHeart Generator - Script Corrigido
 * Correções aplicadas:
 * 1. Função removerSelecionada duplicada removida
 * 2. Event listeners movidos para fora de generateResourcesText
 * 3. Variáveis renomeadas para evitar conflitos de escopo
 * 4. Verificações de null adicionadas
 * 5. Constantes para magic numbers
 * 6. Padrão consistente de verificação de elementos
 */

// ========== CONSTANTES ==========
const MAX_CARTAS_MAO = 5;
const MAX_RESOURCE_VALUE = 15;
const MIN_RESOURCE_VALUE = 0;
const DEFAULT_RESOURCE_VALUE = 6;

// ========== ELEMENTOS DOM (cache) ==========
const cardsContainer = document.getElementById('cards-container');
const cardsSection = document.getElementById('cards-section');
const fichaSection = document.getElementById('ficha-section');

// ========== ESTADO ==========
let currentFichaIndex = null;
let deleteIndex = null;

// ========== DADOS ESTÁTICOS ==========
const subclasses = {
    Assassin: ["Poisoners Guild", "Executioners Guild"],
    Bard: ["Troubadour", "Wordsmith"],
    Brawler: ["Juggernaut", "Martial Artist"],
    Druid: ["Warden of the Elements", "Warden of Renewal"],
    Guardian: ["Stalwart", "Vengeance"],
    Ranger: ["Wayfinder", "Beastbound"],
    Rogue: ["Nightwalker", "Syndicate"],
    Seraph: ["Divine Wielder", "Winged Sentinel"],
    Sorcerer: ["Primal Origin", "Elemental Origin"],
    Warlock: ["Pact of the Wraithful", "Pact of the Endless"],
    Warrior: ["Call of the Brave", "Call of the Slayer"],
    Witch: ["Moon", "Hedge"],
    Wizard: ["School of Knowledge", "School of War"]
};

const races = ["Aetheris", "Clank", "Drakona", "Dwarf", "Earthkin", "Elf", "Emberkin", "Faerie", "Faun", "Firbolg", "Fungril", "Galapa", "Giant", "Gnome", "Goblin", "Halfling", "Human", "Infernis", "Katari", "Orc", "Ribbet", "Simiah", "Skykin", "Tidekin"];
const classes = ["Assassin", "Bard", "Brawler", "Druid", "Guardian", "Ranger", "Rogue", "Seraph", "Sorcerer", "Warlock", "Warrior", "Witch", "Wizard"];
const communities = ["Duneborne", "Freeborne", "Frostborne", "Hearthborne", "Highborne", "Loreborne", "Orderborne", "Reborne", "Ridgeborne", "Seaborne", "Slyborne", "Underborne", "Wanderborne", "Warborne", "Wildborne"];

// ========== MODAIS (instância única) ==========
const modalFichaEl = document.getElementById('modalFicha');
const modalFicha = modalFichaEl ? new bootstrap.Modal(modalFichaEl) : null;

const modalDeleteEl = document.getElementById('modalDelete');
const modalDelete = modalDeleteEl ? new bootstrap.Modal(modalDeleteEl) : null;

// ========== HELPERS ==========

/**
 * Obtém valor de elemento de forma segura
 */
function getElementValue(id, defaultValue = '') {
    const el = document.getElementById(id);
    return el ? el.value : defaultValue;
}

/**
 * Define valor de elemento de forma segura
 */
function setElementValue(id, value) {
    const el = document.getElementById(id);
    if (el) {
        if (el.type === 'checkbox') {
            el.checked = !!value;
        } else {
            el.value = value;
        }
    }
}

/**
 * Obtém dados do localStorage com tratamento de erro
 */
function getStoredCards() {
    try {
        const data = localStorage.getItem('rpgCards');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Erro ao ler localStorage:', e);
        return [];
    }
}

/**
 * Salva dados no localStorage com tratamento de erro
 */
function saveCards(cards) {
    try {
        localStorage.setItem('rpgCards', JSON.stringify(cards));
        return true;
    } catch (e) {
        console.error('Erro ao salvar localStorage:', e);
        alert('Erro ao salvar dados. Verifique o armazenamento do navegador.');
        return false;
    }
}

/**
 * Auto resize para textareas
 */
function autoResize(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = (el.scrollHeight) + "px";
}

/**
 * Gera checkboxes para recursos
 */
function generateChecks(id, qtd) {
    const checksContainer = document.getElementById(id);
    if (!checksContainer) return;
    checksContainer.innerHTML = '';
    qtd = parseInt(qtd, 10) || 0;
    for (let i = 0; i < qtd; i++) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        checksContainer.appendChild(cb);
    }
}

/**
 * Exibe toast de notificação
 */
function showToast(message) {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ========== UI / Dropdowns ==========

function populateDropdowns() {
    const raceSelect = document.getElementById('ficha-race');
    const classSelect = document.getElementById('ficha-class');
    const communitySelect = document.getElementById('ficha-community');

    if (raceSelect) {
        raceSelect.innerHTML = '<option value="">Selecione</option>';
        races.forEach(r => raceSelect.appendChild(new Option(r, r)));
    }

    if (classSelect) {
        classSelect.innerHTML = '<option value="">Selecione</option>';
        classes.forEach(c => classSelect.appendChild(new Option(c, c)));
    }

    if (communitySelect) {
        communitySelect.innerHTML = '<option value="">Selecione</option>';
        communities.forEach(c => communitySelect.appendChild(new Option(c, c)));
    }

    updateSubclasses();
}

function updateFichaCount() {
    const cards = getStoredCards();
    const countEl = document.getElementById('ficha-count');
    if (countEl) {
        countEl.textContent = `• ${cards.length} Personagens`;
    }
}

function updateSubclasses() {
    const cls = getElementValue('ficha-class');
    const subclassSelect = document.getElementById('ficha-subclass');
    if (!subclassSelect) return;

    subclassSelect.innerHTML = '';
    if (cls && subclasses[cls]) {
        subclasses[cls].forEach(sc => subclassSelect.appendChild(new Option(sc, sc)));
        subclassSelect.disabled = false;
    } else {
        subclassSelect.appendChild(new Option('Selecione uma classe primeiro', ''));
        subclassSelect.disabled = true;
    }
}

// ========== Cartões (Lista) ==========

function getDefaultCardHeight() {
    try {
        const existing = cardsContainer?.querySelector('.card:not(.new-card)');
        if (existing) {
            const h = existing.getBoundingClientRect().height;
            if (h > 10) return h;
        }

        const tmp = document.createElement('div');
        tmp.className = 'card shadow-sm';
        tmp.style.cssText = 'visibility:hidden;position:absolute;left:-9999px;top:-9999px';
        tmp.innerHTML = `<div style="padding:12px"><h5 style="margin:0">T</h5><p style="margin:0">x</p></div>`;
        document.body.appendChild(tmp);
        const h = tmp.getBoundingClientRect().height || 250;
        document.body.removeChild(tmp);
        return h;
    } catch (e) {
        return 250;
    }
}

function loadCards() {
    if (!cardsContainer) return;
    cardsContainer.innerHTML = '';
    const cards = getStoredCards();
    const defaultHeight = getDefaultCardHeight();

    // Botão "novo card"
    const newCard = document.createElement('div');
    newCard.className = 'card new-card shadow-sm';
    newCard.style.cssText = `height:${defaultHeight}px;display:flex;flex-direction:column;overflow:hidden`;
    newCard.innerHTML = '<span style="font-size:2rem;display:flex;align-items:center;justify-content:center;height:100%;">+</span>';
    newCard.onclick = (e) => { e.stopPropagation(); openModalFicha(null, true); };
    cardsContainer.appendChild(newCard);

    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card shadow-sm';
        cardEl.style.cssText = `height:${defaultHeight}px;display:flex;flex-direction:column;overflow:hidden`;

        const hasImage = !!card.image;
        const imageHtml = hasImage
            ? `<div class="card-img-wrap"><img src="${card.image}" class="card-img-custom" alt=""></div>`
            : `<div class="card-img-wrap no-image"></div>`;

        cardEl.innerHTML = `
            ${imageHtml}
            <div class="card-body-custom">
                <h5 class="card-title">${card.title ?? ''}</h5>
                <hr class="card-hr">
                <div class="card-footer-custom d-flex justify-content-between align-items-center">
                    <div class="card-date me-2">
                        <i class="bi bi-calendar-event"></i> ${card.date ?? ''}
                    </div>
                    <div class="actions d-flex">
                        <button class="action-btn edit-btn me-2" data-action="edit" data-index="${index}" title="Editar">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="action-btn delete-btn" data-action="delete" data-index="${index}" title="Deletar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        cardEl.onclick = (e) => {
            if (e.target.closest('[data-action]')) return;
            openFicha(index);
        };

        cardsContainer.appendChild(cardEl);
    });

    updateFichaCount();
}

// ========== Hash / Navegação ==========

function handleHashChange() {
    if (window.location.hash?.startsWith('#ficha')) {
        const idx = parseInt(window.location.hash.replace('#ficha', ''), 10);
        if (!isNaN(idx)) openFicha(idx);
    } else {
        backToCards();
    }
}

// ========== Modal de edição (mini-card) ==========

function openModalFicha(index, isNew = false) {
    currentFichaIndex = index;
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.innerText = isNew ? 'Nova Ficha' : 'Editar Ficha';

    if (isNew) {
        setElementValue('modal-name', '');
        setElementValue('modal-url', '');
    } else {
        const cards = getStoredCards();
        const card = cards[index];
        if (card) {
            setElementValue('modal-name', card.title ?? '');
            setElementValue('modal-url', card.image ?? '');
        }
    }

    if (modalFicha) modalFicha.show();
}

function saveModalFicha() {
    const name = getElementValue('modal-name').trim();
    const urlInput = getElementValue('modal-url').trim();
    const fileEl = document.getElementById('modal-file');
    const fileInput = fileEl?.files?.[0] || null;

    if (!name) {
        alert('Nome é obrigatório');
        return;
    }

    let cards = getStoredCards();
    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

    const saveFichaData = (imageData) => {
        const fichaData = { title: name, date, image: imageData };

        if (currentFichaIndex !== null && cards[currentFichaIndex]) {
            cards[currentFichaIndex] = { ...cards[currentFichaIndex], ...fichaData };
        } else {
            cards.push(fichaData);
            currentFichaIndex = cards.length - 1;
        }

        if (saveCards(cards)) {
            const modalInst = bootstrap.Modal.getInstance(modalFichaEl);
            if (modalInst) modalInst.hide();
            loadCards();
            window.location.hash = `ficha${currentFichaIndex}`;
        }
    };

    if (fileInput) {
        const reader = new FileReader();
        reader.onload = (e) => saveFichaData(e.target.result);
        reader.readAsDataURL(fileInput);
    } else {
        saveFichaData(urlInput);
    }
}

// ========== Tier Checkboxes ==========

function getTierCheckboxes(tierId) {
    const tier = document.getElementById(tierId);
    if (!tier) return [];
    return Array.from(tier.querySelectorAll('input[type="checkbox"]')).map(chk => chk.checked);
}

// ========== Salvar / Editar ficha completa ==========

function saveFicha() {
    let cards = getStoredCards();

    const fichaData = {
        title: getElementValue('ficha-name').trim(),
        level: parseInt(getElementValue('ficha-level'), 10) || 1,
        race: getElementValue('ficha-race'),
        classchar: getElementValue('ficha-class'),
        subclass: getElementValue('ficha-subclass'),
        community: getElementValue('ficha-community'),

        attributes: {
            agi: parseInt(getElementValue('attr-agi'), 10) || 0,
            forca: parseInt(getElementValue('attr-for'), 10) || 0,
            fin: parseInt(getElementValue('attr-fin'), 10) || 0,
            inst: parseInt(getElementValue('attr-inst'), 10) || 0,
            pre: parseInt(getElementValue('attr-pre'), 10) || 0,
            con: parseInt(getElementValue('attr-con'), 10) || 0,
            evasao: parseInt(getElementValue('evasao'), 10) || 0,
            proficiencia: parseInt(getElementValue('proficiencia'), 10) || 0,
            dano_at: getElementValue('dano_at'),
        },

        resources: {
            hp: parseInt(getElementValue('hpQtd'), 10) || DEFAULT_RESOURCE_VALUE,
            armadura: parseInt(getElementValue('armaduraQtd'), 10) || DEFAULT_RESOURCE_VALUE,
            estresse: parseInt(getElementValue('estresseQtd'), 10) || DEFAULT_RESOURCE_VALUE,
            esperanca: parseInt(getElementValue('esperancaQtd'), 10) || DEFAULT_RESOURCE_VALUE,
            especializacao: document.getElementById('check-especializacao')?.checked || false,
            maestria: document.getElementById('check-maestria')?.checked || false,
            checks: {
                hp: Array.from(document.querySelectorAll('#hpChecks input[type="checkbox"]')).map(chk => chk.checked),
                armadura: Array.from(document.querySelectorAll('#armaduraChecks input[type="checkbox"]')).map(chk => chk.checked),
                estresse: Array.from(document.querySelectorAll('#estresseChecks input[type="checkbox"]')).map(chk => chk.checked),
                esperanca: Array.from(document.querySelectorAll('#esperancaChecks input[type="checkbox"]')).map(chk => chk.checked)
            }
        },

        damage: {
            menor: document.querySelector('input[name="danoMenor"]')?.value || '',
            maior: document.querySelector('input[name="danoMaior"]')?.value || ''
        },

        experiencias: [
            getElementValue('experiencia1').trim(),
            getElementValue('experiencia2').trim(),
            getElementValue('experiencia3').trim(),
            getElementValue('experiencia4').trim(),
            getElementValue('experiencia5').trim()
        ],
        experienciasNum: [
            getElementValue('experiencia1-num').trim(),
            getElementValue('experiencia2-num').trim(),
            getElementValue('experiencia3-num').trim(),
            getElementValue('experiencia4-num').trim(),
            getElementValue('experiencia5-num').trim()
        ],

        itens: {
            proficiencias: {
                prof2: document.getElementById('prof2')?.checked || false,
                prof3: document.getElementById('prof3')?.checked || false,
                prof4: document.getElementById('prof4')?.checked || false,
                prof5: document.getElementById('prof5')?.checked || false,
                prof6: document.getElementById('prof6')?.checked || false
            },
            primaria: {
                nome: getElementValue("primariaNome"),
                traco: getElementValue("primariaTraco"),
                alcance: getElementValue("primariaAlcance"),
                tipo: getElementValue("primariaTipo"),
                dano: getElementValue("primariaDano"),
                caracteristica: getElementValue("primariaCaracteristica")
            },
            secundaria: {
                nome: getElementValue("secNome"),
                traco: getElementValue("secTraco"),
                alcance: getElementValue("secAlcance"),
                tipo: getElementValue("secTipo"),
                dano: getElementValue("secDano"),
                caracteristica: getElementValue("secCaracteristica")
            },
            armadura: {
                nome: getElementValue("armNome"),
                limiares: getElementValue("armLimiares"),
                valor: getElementValue("armValor"),
                caracteristicas: getElementValue("armCaracteristicas")
            },
            inventario: getElementValue("inventario")
        },

        dominios: cartasDominio.map(carta => ({
            id: carta.id,
            selecionada: carta.selecionada,
            naMao: carta.naMao || false
        })),

        levelUp: {
            tier2: getTierCheckboxes('tier2'),
            tier3: getTierCheckboxes('tier3'),
            tier4: getTierCheckboxes('tier4')
        }
    };

    if (currentFichaIndex !== null && cards[currentFichaIndex]) {
        const old = cards[currentFichaIndex];
        fichaData.image = old.image || old.thumbnail || '';
        fichaData.date = old.date || (new Date().toLocaleDateString('pt-BR'));
        cards[currentFichaIndex] = { ...old, ...fichaData };
        showToast("Ficha atualizada com sucesso ✅");
    } else {
        fichaData.date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
        cards.push(fichaData);
        currentFichaIndex = cards.length - 1;
        showToast("Ficha salva com sucesso ✅");
    }

    if (saveCards(cards)) {
        window.location.hash = `ficha${currentFichaIndex}`;
        loadCards();
        updateFichaCount();
    }
}

// ========== Deletar ==========

function askDeleteFicha(index) {
    deleteIndex = index;
    if (modalDelete) modalDelete.show();
}

function confirmDeleteFicha() {
    let cards = getStoredCards();
    if (deleteIndex !== null && cards[deleteIndex]) {
        cards.splice(deleteIndex, 1);
        if (saveCards(cards)) {
            showToast("Ficha deletada 🗑️");
        }
    }
    deleteIndex = null;

    if (modalDeleteEl) {
        const modalInst = bootstrap.Modal.getInstance(modalDeleteEl);
        if (modalInst) modalInst.hide();
    }

    backToCards();
    loadCards();
    if (window.location.hash?.startsWith('#ficha')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    updateFichaCount();
}

function finishEditingFicha() {
    saveFicha();
    backToCards();
    showToast("Edição finalizada ✨");
}

function deleteCard(event, index) {
    event.stopPropagation();
    deleteIndex = index;
    if (modalDelete) modalDelete.show();
}

function editCard(event, index) {
    event.stopPropagation();
    openModalFicha(index, false);
}

// ========== Abrir ficha detalhada ==========

function openFicha(index) {
    const cards = getStoredCards();
    const ficha = cards[index];
    if (!ficha) return;

    window.location.hash = `ficha${index}`;

    if (cardsSection) cardsSection.classList.add('hidden');
    if (fichaSection) fichaSection.classList.remove('hidden');

    currentFichaIndex = index;

    // Campos básicos
    setElementValue('ficha-name', ficha.title || '');
    setElementValue('ficha-level', ficha.level || 1);
    setElementValue('ficha-race', ficha.race || '');
    setElementValue('ficha-community', ficha.community || '');
    setElementValue('ficha-class', ficha.classchar || '');

    updateSubclasses();
    setElementValue('ficha-subclass', ficha.subclass || '');


    // Atributos & Defesa
    const attrs = ficha.attributes || {};
    setElementValue('attr-agi', attrs.agi ?? '');
    setElementValue('attr-for', attrs.forca ?? '');
    setElementValue('attr-fin', attrs.fin ?? '');
    setElementValue('attr-inst', attrs.inst ?? '');
    setElementValue('attr-pre', attrs.pre ?? '');
    setElementValue('attr-con', attrs.con ?? '');
    setElementValue('evasao', attrs.evasao ?? '');
    setElementValue('proficiencia', attrs.proficiencia ?? '');
    setElementValue('dano_at', attrs.dano_at ?? '');

    // Dano
    const dmg = ficha.damage || {};
    const danoMenorInput = document.querySelector('input[name="danoMenor"]');
    const danoMaiorInput = document.querySelector('input[name="danoMaior"]');
    if (danoMenorInput) danoMenorInput.value = dmg.menor ?? '';
    if (danoMaiorInput) danoMaiorInput.value = dmg.maior ?? '';

    // Recursos
    const res = ficha.resources || {};
    setElementValue('hpQtd', res.hp ?? DEFAULT_RESOURCE_VALUE);
    setElementValue('armaduraQtd', res.armadura ?? DEFAULT_RESOURCE_VALUE);
    setElementValue('estresseQtd', res.estresse ?? DEFAULT_RESOURCE_VALUE);
    setElementValue('esperancaQtd', res.esperanca ?? DEFAULT_RESOURCE_VALUE);

    const specCheck = document.getElementById('check-especializacao');
    const mastCheck = document.getElementById('check-maestria');
    if (specCheck) specCheck.checked = !!res.especializacao;
    if (mastCheck) mastCheck.checked = !!res.maestria;

    generateChecks('hpChecks', res.hp ?? DEFAULT_RESOURCE_VALUE);
    generateChecks('armaduraChecks', res.armadura ?? DEFAULT_RESOURCE_VALUE);
    generateChecks('estresseChecks', res.estresse ?? DEFAULT_RESOURCE_VALUE);
    generateChecks('esperancaChecks', res.esperanca ?? DEFAULT_RESOURCE_VALUE);

    if (res.checks) {
        ['hp', 'armadura', 'estresse', 'esperanca'].forEach(grupo => {
            const estados = res.checks[grupo];
            if (Array.isArray(estados)) {
                const checkboxes = document.querySelectorAll(`#${grupo}Checks input[type="checkbox"]`);
                checkboxes.forEach((chk, i) => chk.checked = !!estados[i]);
            }
        });
    }

    // Experiencias
    const experiencias = ficha.experiencias || [];
    const experienciasNum = ficha.experienciasNum || [];
    for (let i = 1; i <= 5; i++) {
        setElementValue(`experiencia${i}`, experiencias[i - 1] || '');
        setElementValue(`experiencia${i}-num`, experienciasNum[i - 1] || '');
    }

    // Itens
    const itens = ficha.itens || {};
    const p = itens.primaria || {};
    const s = itens.secundaria || {};
    const a = itens.armadura || {};
    const prof = itens.proficiencias || {};

    setElementValue("prof2", prof.prof2 || false);
    setElementValue("prof3", prof.prof3 || false);
    setElementValue("prof4", prof.prof4 || false);
    setElementValue("prof5", prof.prof5 || false);
    setElementValue("prof6", prof.prof6 || false);

    setElementValue("primariaNome", p.nome || "");
    setElementValue("primariaTraco", p.traco || "");
    setElementValue("primariaAlcance", p.alcance || "");
    setElementValue("primariaTipo", p.tipo || "");
    setElementValue("primariaDano", p.dano || "");
    setElementValue("primariaCaracteristica", p.caracteristica || "");

    setElementValue("secNome", s.nome || "");
    setElementValue("secTraco", s.traco || "");
    setElementValue("secAlcance", s.alcance || "");
    setElementValue("secTipo", s.tipo || "");
    setElementValue("secDano", s.dano || "");
    setElementValue("secCaracteristica", s.caracteristica || "");

    setElementValue("armNome", a.nome || "");
    setElementValue("armLimiares", a.limiares || "");
    setElementValue("armValor", a.valor || "");
    setElementValue("armCaracteristicas", a.caracteristicas || "");

    setElementValue("inventario", itens.inventario || "");

    // Domínio
    setElementValue('filtro-lvl', '');
    setElementValue('filtro-dominio', '');

    cartasDominio.forEach(c => {
        c.selecionada = false;
        c.naMao = false;
    });

    if (ficha.dominios && Array.isArray(ficha.dominios)) {
        ficha.dominios.forEach(d => {
            const carta = cartasDominio.find(c => c.id === d.id);
            if (carta) {
                carta.selecionada = d.selecionada === true;
                carta.naMao = d.naMao === true;
            }
        });
    }

    // Level Up
    const levelUp = ficha.levelUp || {};
    ['tier2', 'tier3', 'tier4'].forEach(tierId => {
        const estados = levelUp[tierId] || [];
        const checkboxes = document.querySelectorAll(`#${tierId} input[type="checkbox"]`);
        checkboxes.forEach((chk, i) => {
            chk.checked = !!estados[i];
        });
    });

    gerarCartasDominios();
    atualizarSelecionadas();
    atualizarMao();
    generateResourcesText();
}

// ========== Voltar para lista ==========

function backToCards() {
    if (cardsSection) cardsSection.classList.remove('hidden');
    if (fichaSection) fichaSection.classList.add('hidden');

    if (window.location.hash?.startsWith('#ficha')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    currentFichaIndex = null;
}

// ========== DADOS DE RAÇAS (imagens) ==========

const raceImages = {
    "Aetheris": "img3/Races/Aetheris.png",
    "Clank": "img3/Races/Clank.png",
    "Drakona": "img3/Races/Drakona.png",
    "Dwarf": "img3/Races/Dwarf.png",
    "Earthkin": "img3/Races/Earthkin.png",
    "Elf": "img3/Races/Elf.png",
    "Emberkin": "img3/Races/Emberkin.png",
    "Faerie": "img3/Races/Faerie.png",
    "Faun": "img3/Races/Faun.png",
    "Firbolg": "img3/Races/Firbolg.png",
    "Fungril": "img3/Races/Fungril.png",
    "Galapa": "img3/Races/Galapa.png",
    "Giant": "img3/Races/Giant.png",
    "Gnome": "img3/Races/Gnome.png",
    "Goblin": "img3/Races/Goblin.png",
    "Halfling": "img3/Races/Halfling.png",
    "Human": "img3/Races/Human.png",
    "Infernis": "img3/Races/Infernis.png",
    "Katari": "img3/Races/Katari.png",
    "Orc": "img3/Races/Orc.png",
    "Ribbet": "img3/Races/Ribbet.png",
    "Simiah": "img3/Races/Simiah.png",
    "Skykin": "img3/Races/Skykin.png",
    "Tidekin": "img3/Races/Tidekin.png"
};

// ========== DADOS DE CLASSES (imagens) ==========

const classImages = {
    "Assassin": "img3/Classes/Assassin.png",
    "Bard": "img3/Classes/Bard.png",
    "Brawler": "img3/Classes/Brawler.png",
    "Druid": "img3/Classes/Druid.png",
    "Guardian": "img3/Classes/Guardian.png",
    "Ranger": "img3/Classes/Ranger.png",
    "Rogue": "img3/Classes/Rogue.png",
    "Seraph": "img3/Classes/Seraph.png",
    "Sorcerer": "img3/Classes/Sorcerer.png",
    "Warlock": "img3/Classes/Warlock.png",
    "Warrior": "img3/Classes/Warrior.png",
    "Witch": "img3/Classes/Witch.png",
    "Wizard": "img3/Classes/Wizard.png"
};

// ========== DADOS DE SUBCLASSES (imagens - 3 cartas por subclasse) ==========

const subclassImages = {
    // Assassin
    "Poisoners Guild": [
        "img3/Subclasses/Poisoners Guild1.png",
        "img3/Subclasses/Poisoners Guild2.png",
        "img3/Subclasses/Poisoners Guild3.png"
    ],
    "Executioners Guild": [
        "img3/Subclasses/Executioners Guild1.png",
        "img3/Subclasses/Executioners Guild2.png",
        "img3/Subclasses/Executioners Guild3.png"
    ],
    // Bard
    "Troubadour": [
        "img3/Subclasses/Troubadour1.png",
        "img3/Subclasses/Troubadour2.png",
        "img3/Subclasses/Troubadour3.png"
    ],
    "Wordsmith": [
        "img3/Subclasses/Wordsmith1.png",
        "img3/Subclasses/Wordsmith2.png",
        "img3/Subclasses/Wordsmith3.png"
    ],
    // Brawler
    "Juggernaut": [
        "img3/Subclasses/Juggernaut1.png",
        "img3/Subclasses/Juggernaut2.png",
        "img3/Subclasses/Juggernaut3.png"
    ],
    "Martial Artist": [
        "img3/Subclasses/Martial Artist1.png",
        "img3/Subclasses/Martial Artist2.png",
        "img3/Subclasses/Martial Artist3.png"
    ],
    // Druid
    "Warden of the Elements": [
        "img3/Subclasses/Warden of the Elements1.png",
        "img3/Subclasses/Warden of the Elements2.png",
        "img3/Subclasses/Warden of the Elements3.png"
    ],
    "Warden of Renewal": [
        "img3/Subclasses/Warden of Renewal1.png",
        "img3/Subclasses/Warden of Renewal2.png",
        "img3/Subclasses/Warden of Renewal3.png"
    ],
    // Guardian
    "Stalwart": [
        "img3/Subclasses/Stalwart1.png",
        "img3/Subclasses/Stalwart2.png",
        "img3/Subclasses/Stalwart3.png"
    ],
    "Vengeance": [
        "img3/Subclasses/Vengeance1.png",
        "img3/Subclasses/Vengeance2.png",
        "img3/Subclasses/Vengeance3.png"
    ],
    // Ranger
    "Wayfinder": [
        "img3/Subclasses/Wayfinder1.png",
        "img3/Subclasses/Wayfinder2.png",
        "img3/Subclasses/Wayfinder3.png"
    ],
    "Beastbound": [
        "img3/Subclasses/Beastbound1.png",
        "img3/Subclasses/Beastbound2.png",
        "img3/Subclasses/Beastbound3.png"
    ],
    // Rogue
    "Nightwalker": [
        "img3/Subclasses/Nightwalker1.png",
        "img3/Subclasses/Nightwalker2.png",
        "img3/Subclasses/Nightwalker3.png"
    ],
    "Syndicate": [
        "img3/Subclasses/Syndicate1.png",
        "img3/Subclasses/Syndicate2.png",
        "img3/Subclasses/Syndicate3.png"
    ],
    // Seraph
    "Divine Wielder": [
        "img3/Subclasses/Divine Wielder1.png",
        "img3/Subclasses/Divine Wielder2.png",
        "img3/Subclasses/Divine Wielder3.png"
    ],
    "Winged Sentinel": [
        "img3/Subclasses/Winged Sentinel1.png",
        "img3/Subclasses/Winged Sentinel2.png",
        "img3/Subclasses/Winged Sentinel3.png"
    ],
    // Sorcerer
    "Primal Origin": [
        "img3/Subclasses/Primal Origin1.png",
        "img3/Subclasses/Primal Origin2.png",
        "img3/Subclasses/Primal Origin3.png"
    ],
    "Elemental Origin": [
        "img3/Subclasses/Elemental Origin1.png",
        "img3/Subclasses/Elemental Origin2.png",
        "img3/Subclasses/Elemental Origin3.png"
    ],
    // Warlock
    "Pact of the Wraithful": [
        "img3/Subclasses/Pact of the Wraithful1.png",
        "img3/Subclasses/Pact of the Wraithful2.png",
        "img3/Subclasses/Pact of the Wraithful3.png"
    ],
    "Pact of the Endless": [
        "img3/Subclasses/Pact of the Endless1.png",
        "img3/Subclasses/Pact of the Endless2.png",
        "img3/Subclasses/Pact of the Endless3.png"
    ],
    // Warrior
    "Call of the Brave": [
        "img3/Subclasses/Call of the Brave1.png",
        "img3/Subclasses/Call of the Brave2.png",
        "img3/Subclasses/Call of the Brave3.png"
    ],
    "Call of the Slayer": [
        "img3/Subclasses/Call of the Slayer1.png",
        "img3/Subclasses/Call of the Slayer2.png",
        "img3/Subclasses/Call of the Slayer3.png"
    ],
    // Witch
    "Moon": [
        "img3/Subclasses/Moon1.png",
        "img3/Subclasses/Moon2.png",
        "img3/Subclasses/Moon3.png"
    ],
    "Hedge": [
        "img3/Subclasses/Hedge1.png",
        "img3/Subclasses/Hedge2.png",
        "img3/Subclasses/Hedge3.png"
    ],
    // Wizard
    "School of Knowledge": [
        "img3/Subclasses/School of Knowledge1.png",
        "img3/Subclasses/School of Knowledge2.png",
        "img3/Subclasses/School of Knowledge3.png"
    ],
    "School of War": [
        "img3/Subclasses/School of War1.png",
        "img3/Subclasses/School of War2.png",
        "img3/Subclasses/School of War3.png"
    ]
};

// ========== DADOS DE COMUNIDADES (imagens) ==========

const communityImages = {
    "Duneborne": "img3/Communities/Duneborne.png",
    "Freeborne": "img3/Communities/Freeborne.png",
    "Frostborne": "img3/Communities/Frostborne.png",
    "Hearthborne": "img3/Communities/Hearthborne.png",
    "Highborne": "img3/Communities/Highborne.png",
    "Loreborne": "img3/Communities/Loreborne.png",
    "Orderborne": "img3/Communities/Orderborne.png",
    "Reborne": "img3/Communities/Reborne.png",
    "Ridgeborne": "img3/Communities/Ridgeborne.png",
    "Seaborne": "img3/Communities/Seaborne.png",
    "Slyborne": "img3/Communities/Slyborne.png",
    "Underborne": "img3/Communities/Underborne.png",
    "Wanderborne": "img3/Communities/Wanderborne.png",
    "Warborne": "img3/Communities/Warborne.png",
    "Wildborne": "img3/Communities/Wildborne.png"
};

// ========== GENERATE RESOURCES (imagens) ==========

/**
 * Gera HTML de uma carta de recursos (imagem fixa, não selecionável)
 */
function gerarCartaRecurso(imgPath, altText) {
    return `
<div class="card-recurso2">
    <img class="card-recurso-img2" src="${imgPath}" alt="${altText}">
</div>

    `;
}

/**
 * Gera as imagens de recursos baseado nas seleções de raça, classe, subclasse e comunidade
 */
/**
 * Atualiza a visibilidade das checkboxes de subclasse
 */
function updateSubclassVisibility(source) {
    const spec = document.getElementById('check-especializacao');
    const mast = document.getElementById('check-maestria');

    if (source === 'maestria' && mast && mast.checked) {
        if (spec) spec.checked = true;
    }
    if (source === 'especializacao' && spec && !spec.checked) {
        if (mast) mast.checked = false;
    }
    generateResourcesText();
}

/**
 * Gera as imagens de recursos baseado nas seleções de raça, classe, subclasse e comunidade
 */
function generateResourcesText() {
    const race = getElementValue('ficha-race');
    const classchar = getElementValue('ficha-class');
    const subclass = getElementValue('ficha-subclass');
    const community = getElementValue('ficha-community');

    let html = '';

    // Container para as cartas de recursos
    html += '<div class="recursos-cards-container">';

    // Comunidade
    if (community && communityImages[community]) {
        html += gerarCartaRecurso(communityImages[community], community);
    }

    // Raça
    if (race && raceImages[race]) {
        html += gerarCartaRecurso(raceImages[race], race);
    }

    // Classe
    if (classchar && classImages[classchar]) {
        html += gerarCartaRecurso(classImages[classchar], classchar);
    }

    // Subclasse (3 cartas por subclasse)
    // Subclasse (3 cartas por subclasse)
    if (subclass && subclassImages[subclass]) {
        const images = subclassImages[subclass];
        const showSpec = document.getElementById('check-especializacao')?.checked || false;
        const showMast = document.getElementById('check-maestria')?.checked || false;

        // Imagem 1: Sempre mostra
        if (images[0]) {
            html += gerarCartaRecurso(images[0], `${subclass} 1`);
        }
        // Imagem 2: Especialização ou Maestria
        if (images[1] && (showSpec || showMast)) {
            html += gerarCartaRecurso(images[1], `${subclass} 2`);
        }
        // Imagem 3: Maestria
        if (images[2] && showMast) {
            html += gerarCartaRecurso(images[2], `${subclass} 3`);
        }
    }



    html += '</div>';

    const recursosEl = document.getElementById('recursosText');
    if (recursosEl) recursosEl.innerHTML = html;
}

// ========== CARTAS DE DOMÍNIO ==========

const cartasDominio = [
    // bone
    { id: 1, dominio: "Bone", lvl: 1, img: "img/Bone/1 Eu Vi Chegando.png", selecionada: false, clicked: false },
    { id: 2, dominio: "Bone", lvl: 1, img: "img/Bone/1 Intocável.png", selecionada: false, clicked: false },
    { id: 3, dominio: "Bone", lvl: 1, img: "img/Bone/1 Manobras Habeis.png", selecionada: false, clicked: false },
    { id: 4, dominio: "Bone", lvl: 2, img: "img/Bone/2 Abordagem Estrategica.png", selecionada: false, clicked: false },
    { id: 5, dominio: "Bone", lvl: 2, img: "img/Bone/2 Ferocidade.png", selecionada: false, clicked: false },
    { id: 6, dominio: "Bone", lvl: 3, img: "img/Bone/3 Estrategista.png", selecionada: false, clicked: false },
    { id: 7, dominio: "Bone", lvl: 3, img: "img/Bone/3 Resistir.png", selecionada: false, clicked: false },
    { id: 8, dominio: "Bone", lvl: 4, img: "img/Bone/4 Impulsionar.png", selecionada: false, clicked: false },
    { id: 9, dominio: "Bone", lvl: 4, img: "img/Bone/4 Redirecionar.png", selecionada: false, clicked: false },
    { id: 10, dominio: "Bone", lvl: 5, img: "img/Bone/5 Conheça Vosso Inimigo.png", selecionada: false, clicked: false },
    { id: 11, dominio: "Bone", lvl: 5, img: "img/Bone/5 Golpe Unico.png", selecionada: false, clicked: false },
    { id: 12, dominio: "Bone", lvl: 6, img: "img/Bone/6 Recuperação.png", selecionada: false, clicked: false },
    { id: 13, dominio: "Bone", lvl: 6, img: "img/Bone/6 Resposta Rápida.png", selecionada: false, clicked: false },
    { id: 14, dominio: "Bone", lvl: 7, img: "img/Bone/7 Precisão Cruel.png", selecionada: false, clicked: false },
    { id: 15, dominio: "Bone", lvl: 7, img: "img/Bone/7 Tocado pelos Ossos.png", selecionada: false, clicked: false },
    { id: 16, dominio: "Bone", lvl: 8, img: "img/Bone/8 Embaralhar.png", selecionada: false, clicked: false },
    { id: 17, dominio: "Bone", lvl: 8, img: "img/Bone/8 Golpe de Ruptura.png", selecionada: false, clicked: false },
    { id: 18, dominio: "Bone", lvl: 9, img: "img/Bone/9 Golpe Estilhaçador.png", selecionada: false, clicked: false },
    { id: 19, dominio: "Bone", lvl: 9, img: "img/Bone/9 Na Beira.png", selecionada: false, clicked: false },
    { id: 20, dominio: "Bone", lvl: 10, img: "img/Bone/10 Corrida Mortal.png", selecionada: false, clicked: false },
    { id: 21, dominio: "Bone", lvl: 10, img: "img/Bone/10 Passo Rapido.png", selecionada: false, clicked: false },

    // valor
    { id: 22, dominio: "Valor", lvl: 1, img: "img/Valor/1 Empurrão Forte.png", selecionada: false, clicked: false },
    { id: 23, dominio: "Valor", lvl: 1, img: "img/Valor/1 Eu Sou Seu Escudo.png", selecionada: false, clicked: false },
    { id: 24, dominio: "Valor", lvl: 1, img: "img/Valor/1 Ossos Nus.png", selecionada: false, clicked: false },
    { id: 25, dominio: "Valor", lvl: 2, img: "img/Valor/2 Destruidor de Corpo.png", selecionada: false, clicked: false },
    { id: 26, dominio: "Valor", lvl: 2, img: "img/Valor/2 Presença Ousada.png", selecionada: false, clicked: false },
    { id: 27, dominio: "Valor", lvl: 3, img: "img/Valor/3 Apoie-se Em Mim.png", selecionada: false, clicked: false },
    { id: 28, dominio: "Valor", lvl: 3, img: "img/Valor/3 Inspiração Decisiva.png", selecionada: false, clicked: false },
    { id: 29, dominio: "Valor", lvl: 4, img: "img/Valor/4 Incite-os.png", selecionada: false, clicked: false },
    { id: 30, dominio: "Valor", lvl: 4, img: "img/Valor/4 Tanque de Suporte.png", selecionada: false, clicked: false },
    { id: 31, dominio: "Valor", lvl: 5, img: "img/Valor/5 Armeiro.png", selecionada: false, clicked: false },
    { id: 32, dominio: "Valor", lvl: 5, img: "img/Valor/5 Golpe Estimulante.png", selecionada: false, clicked: false },
    { id: 33, dominio: "Valor", lvl: 6, img: "img/Valor/6 Erguer-se.png", selecionada: false, clicked: false },
    { id: 34, dominio: "Valor", lvl: 6, img: "img/Valor/6 Inevitável.png", selecionada: false, clicked: false },
    { id: 35, dominio: "Valor", lvl: 7, img: "img/Valor/7 Ignorar.png", selecionada: false, clicked: false },
    { id: 36, dominio: "Valor", lvl: 7, img: "img/Valor/7 Tocado pelo Valor.png", selecionada: false, clicked: false },
    { id: 37, dominio: "Valor", lvl: 8, img: "img/Valor/8 Golpe Terremoto.png", selecionada: false, clicked: false },
    { id: 38, dominio: "Valor", lvl: 8, img: "img/Valor/8 Surto total.png", selecionada: false, clicked: false },
    { id: 39, dominio: "Valor", lvl: 9, img: "img/Valor/9 Guiar Por Exemplo.png", selecionada: false, clicked: false },
    { id: 41, dominio: "Valor", lvl: 9, img: "img/Valor/9 Segurar a Frente.png", selecionada: false, clicked: false },
    { id: 42, dominio: "Valor", lvl: 10, img: "img/Valor/10 Armadura Inflexível.png", selecionada: false, clicked: false },
    { id: 43, dominio: "Valor", lvl: 10, img: "img/Valor/10 Inquebravel.png", selecionada: false, clicked: false },

    // Sage
    { id: 44, dominio: "Sage", lvl: 1, img: "img/Sage/1 Emaranhado Perverso.png", selecionada: false, clicked: false },
    { id: 45, dominio: "Sage", lvl: 1, img: "img/Sage/1 Lingua da Natureza.png", selecionada: false, clicked: false },
    { id: 46, dominio: "Sage", lvl: 1, img: "img/Sage/1 Rastreador Abençoado.png", selecionada: false, clicked: false },
    { id: 47, dominio: "Sage", lvl: 2, img: "img/Sage/2 Conjurar Enxame.png", selecionada: false, clicked: false },
    { id: 48, dominio: "Sage", lvl: 2, img: "img/Sage/2 Familiar Natural.png", selecionada: false, clicked: false },
    { id: 49, dominio: "Sage", lvl: 3, img: "img/Sage/3 Haste Imponente.png", selecionada: false, clicked: false },
    { id: 50, dominio: "Sage", lvl: 3, img: "img/Sage/3 Projeto Corrsível.png", selecionada: false, clicked: false },
    { id: 51, dominio: "Sage", lvl: 4, img: "img/Sage/4 Aperto Mortal.png", selecionada: false, clicked: false },
    { id: 52, dominio: "Sage", lvl: 4, img: "img/Sage/4 Campo de Cura.png", selecionada: false, clicked: false },
    { id: 53, dominio: "Sage", lvl: 5, img: "img/Sage/5 Fortaleza Selvagem.png", selecionada: false, clicked: false },
    { id: 54, dominio: "Sage", lvl: 5, img: "img/Sage/5 Pele Espinhosa.png", selecionada: false, clicked: false },
    { id: 55, dominio: "Sage", lvl: 6, img: "img/Sage/6 Corceis Conjurados.png", selecionada: false, clicked: false },
    { id: 56, dominio: "Sage", lvl: 6, img: "img/Sage/6 Forrageira.png", selecionada: false, clicked: false },
    { id: 57, dominio: "Sage", lvl: 7, img: "img/Sage/7 Onda Selvagem.png", selecionada: false, clicked: false },
    { id: 58, dominio: "Sage", lvl: 7, img: "img/Sage/7 Tocado Pela Salvia.png", selecionada: false, clicked: false },
    { id: 59, dominio: "Sage", lvl: 8, img: "img/Sage/8 Barreira de Rejuvenescimento.png", selecionada: false, clicked: false },
    { id: 60, dominio: "Sage", lvl: 8, img: "img/Sage/8 Sprites da Floresta.png", selecionada: false, clicked: false },
    { id: 61, dominio: "Sage", lvl: 9, img: "img/Sage/9 Domínio Das Plantas.png", selecionada: false, clicked: false },
    { id: 62, dominio: "Sage", lvl: 9, img: "img/Sage/9 Templo das Selvas.png", selecionada: false, clicked: false },
    { id: 63, dominio: "Sage", lvl: 10, img: "img/Sage/10 Force of Nature.png", selecionada: false, clicked: false },
    { id: 64, dominio: "Sage", lvl: 10, img: "img/Sage/10 Tempestade.png", selecionada: false, clicked: false },

    // Splendor
    { id: 65, dominio: "Splendor", lvl: 1, img: "img/Splendor/1 Farol de Luz.png", selecionada: false, clicked: false },
    { id: 66, dominio: "Splendor", lvl: 1, img: "img/Splendor/1 Toque Curativo.png", selecionada: false, clicked: false },
    { id: 67, dominio: "Splendor", lvl: 1, img: "img/Splendor/2 Cura Pelas Mãos.png", selecionada: false, clicked: false },
    { id: 68, dominio: "Splendor", lvl: 2, img: "img/Splendor/2 Palavras Finais.png", selecionada: false, clicked: false },
    { id: 69, dominio: "Splendor", lvl: 2, img: "img/Splendor/3 Recuperar O Folego.png", selecionada: false, clicked: false },
    { id: 70, dominio: "Splendor", lvl: 3, img: "img/Splendor/3 Voz da Razão.png", selecionada: false, clicked: false },
    { id: 71, dominio: "Splendor", lvl: 3, img: "img/Splendor/4 Adivinhação.png", selecionada: false, clicked: false },
    { id: 72, dominio: "Splendor", lvl: 4, img: "img/Splendor/4 Glifo Da Vida.png", selecionada: false, clicked: false },
    { id: 73, dominio: "Splendor", lvl: 4, img: "img/Splendor/5 Destruir.png", selecionada: false, clicked: false },
    { id: 74, dominio: "Splendor", lvl: 5, img: "img/Splendor/5 Moldar Material.png", selecionada: false, clicked: false },
    { id: 75, dominio: "Splendor", lvl: 5, img: "img/Splendor/6 Restauração.png", selecionada: false, clicked: false },
    { id: 76, dominio: "Splendor", lvl: 6, img: "img/Splendor/6 Zona de Proteção.png", selecionada: false, clicked: false },
    { id: 77, dominio: "Splendor", lvl: 6, img: "img/Splendor/7 Golpe Curativo.png", selecionada: false, clicked: false },
    { id: 78, dominio: "Splendor", lvl: 7, img: "img/Splendor/7 Tocado pelo Esplendor.png", selecionada: false, clicked: false },
    { id: 79, dominio: "Splendor", lvl: 7, img: "img/Splendor/8 Aura de Escudo.png", selecionada: false, clicked: false },
    { id: 80, dominio: "Splendor", lvl: 8, img: "img/Splendor/8 Luz Solar Deslumbrante.png", selecionada: false, clicked: false },
    { id: 81, dominio: "Splendor", lvl: 8, img: "img/Splendor/9 Aura Avassaladora.png", selecionada: false, clicked: false },
    { id: 82, dominio: "Splendor", lvl: 9, img: "img/Splendor/9 Feixe de Salvação.png", selecionada: false, clicked: false },
    { id: 83, dominio: "Splendor", lvl: 9, img: "img/Splendor/10 Resurreição.png", selecionada: false, clicked: false },
    { id: 84, dominio: "Splendor", lvl: 10, img: "img/Splendor/10 Revigoração.png", selecionada: false, clicked: false },


    // Grace
    { id: 85, dominio: "Grace", lvl: 1, img: "img/Grace/1 Enganador Habil.png", selecionada: false, clicked: false },
    { id: 86, dominio: "Grace", lvl: 1, img: "img/Grace/1 Enlevado.png", selecionada: false, clicked: false },
    { id: 87, dominio: "Grace", lvl: 1, img: "img/Grace/1 Palavras Inspiradoras.png", selecionada: false, clicked: false },
    { id: 88, dominio: "Grace", lvl: 2, img: "img/Grace/2 Encrenqueiro.png", selecionada: false, clicked: false },
    { id: 89, dominio: "Grace", lvl: 3, img: "img/Grace/3 Brilho Hipnótico.png", selecionada: false, clicked: false },
    { id: 90, dominio: "Grace", lvl: 3, img: "img/Grace/3 Invisibilidade.png", selecionada: false, clicked: false },
    { id: 91, dominio: "Grace", lvl: 4, img: "img/Grace/4 Atraves dos seus olhos.png", selecionada: false, clicked: false },
    { id: 92, dominio: "Grace", lvl: 4, img: "img/Grace/4 Discurso Calmante.png", selecionada: false, clicked: false },
    { id: 93, dominio: "Grace", lvl: 5, img: "img/Grace/5 Explorador de Pensamentos.png", selecionada: false, clicked: false },
    { id: 94, dominio: "Grace", lvl: 5, img: "img/Grace/5 Palavras de Discordia.png", selecionada: false, clicked: false },
    { id: 95, dominio: "Grace", lvl: 6, img: "img/Grace/6 Compartilhe o Fardo.png", selecionada: false, clicked: false },
    { id: 96, dominio: "Grace", lvl: 6, img: "img/Grace/6 Nunca Ofuscado.png", selecionada: false, clicked: false },
    { id: 97, dominio: "Grace", lvl: 7, img: "img/Grace/7 Carisma Sem Fim.png", selecionada: false, clicked: false },
    { id: 98, dominio: "Grace", lvl: 7, img: "img/Grace/7 Tocado pela Graça.png", selecionada: false, clicked: false },
    { id: 99, dominio: "Grace", lvl: 8, img: "img/Grace/8 Envelados Em Massa.png", selecionada: false, clicked: false },
    { id: 101, dominio: "Grace", lvl: 8, img: "img/Grace/8 Projeção Astral.png", selecionada: false, clicked: false },
    { id: 102, dominio: "Grace", lvl: 9, img: "img/Grace/9 Imitador.png", selecionada: false, clicked: false },
    { id: 103, dominio: "Grace", lvl: 9, img: "img/Grace/9 Mestre do Ofício.png", selecionada: false, clicked: false },
    { id: 104, dominio: "Grace", lvl: 10, img: "img/Grace/10 Bis.png", selecionada: false, clicked: false },
    { id: 105, dominio: "Grace", lvl: 10, img: "img/Grace/10 Notório.png", selecionada: false, clicked: false },

    // Midnight
    { id: 106, dominio: "Midnight", lvl: 1, img: "img/Midnight/1 Chuva de Laminas.png", selecionada: false, clicked: false },
    { id: 107, dominio: "Midnight", lvl: 1, img: "img/Midnight/1 Disfarce Estranho.png", selecionada: false, clicked: false },
    { id: 108, dominio: "Midnight", lvl: 1, img: "img/Midnight/1 Mãos Leves.png", selecionada: false, clicked: false },
    { id: 109, dominio: "Midnight", lvl: 2, img: "img/Midnight/2 Espirito Sombrio.png", selecionada: false, clicked: false },
    { id: 110, dominio: "Midnight", lvl: 2, img: "img/Midnight/2 Prisão Sombria.png", selecionada: false, clicked: false },
    { id: 111, dominio: "Midnight", lvl: 3, img: "img/Midnight/3 Estrangulamento.png", selecionada: false, clicked: false },
    { id: 112, dominio: "Midnight", lvl: 3, img: "img/Midnight/3 Veu da Noite.png", selecionada: false, clicked: false },
    { id: 113, dominio: "Midnight", lvl: 4, img: "img/Midnight/4 Expertise em Furtividade.png", selecionada: false, clicked: false },
    { id: 114, dominio: "Midnight", lvl: 4, img: "img/Midnight/4 Glifo das Sombras.png", selecionada: false, clicked: false },
    { id: 115, dominio: "Midnight", lvl: 5, img: "img/Midnight/5 Recuo Fantasma.png", selecionada: false, clicked: false },
    { id: 116, dominio: "Midnight", lvl: 5, img: "img/Midnight/5 Silencio.png", selecionada: false, clicked: false },
    { id: 117, dominio: "Midnight", lvl: 6, img: "img/Midnight/6 Disfarce em Massa.png", selecionada: false, clicked: false },
    { id: 118, dominio: "Midnight", lvl: 6, img: "img/Midnight/6 Sussurros Sombrios.png", selecionada: false, clicked: false },
    { id: 119, dominio: "Midnight", lvl: 7, img: "img/Midnight/7 Desaparecimento.png", selecionada: false, clicked: false },
    { id: 120, dominio: "Midnight", lvl: 7, img: "img/Midnight/7 Tocado pela Sombra.png", selecionada: false, clicked: false },
    { id: 121, dominio: "Midnight", lvl: 8, img: "img/Midnight/8 Caçador das Sombras.png", selecionada: false, clicked: false },
    { id: 122, dominio: "Midnight", lvl: 8, img: "img/Midnight/8 Carga Magica.png", selecionada: false, clicked: false },
    { id: 123, dominio: "Midnight", lvl: 9, img: "img/Midnight/9 Pedagio do Crepusculo.png", selecionada: false, clicked: false },
    { id: 124, dominio: "Midnight", lvl: 9, img: "img/Midnight/9 Terror da Noite.png", selecionada: false, clicked: false },
    { id: 125, dominio: "Midnight", lvl: 10, img: "img/Midnight/10 Eclipse.png", selecionada: false, clicked: false },
    { id: 126, dominio: "Midnight", lvl: 10, img: "img/Midnight/10 Espectro da Escuridão.png", selecionada: false, clicked: false },

    // Dread

    // Arcana
    { id: 127, dominio: "Arcana", lvl: 1, img: "img/Arcana/1 Andar na parede.png", selecionada: false, clicked: false },
    { id: 128, dominio: "Arcana", lvl: 1, img: "img/Arcana/1 Liberar O Caos.png", selecionada: false, clicked: false },
    { id: 129, dominio: "Arcana", lvl: 1, img: "img/Arcana/1 Proteção Runica.png", selecionada: false, clicked: false },
    { id: 130, dominio: "Arcana", lvl: 2, img: "img/Arcana/2 Aperto Das Cinzas.png", selecionada: false, clicked: false },
    { id: 131, dominio: "Arcana", lvl: 2, img: "img/Arcana/2 Olho Flutuante.png", selecionada: false, clicked: false },
    { id: 132, dominio: "Arcana", lvl: 3, img: "img/Arcana/3 Contramagica.png", selecionada: false, clicked: false },
    { id: 133, dominio: "Arcana", lvl: 3, img: "img/Arcana/3 Voo.png", selecionada: false, clicked: false },
    { id: 134, dominio: "Arcana", lvl: 4, img: "img/Arcana/4 Piscar.png", selecionada: false, clicked: false },
    { id: 135, dominio: "Arcana", lvl: 4, img: "img/Arcana/4 Preservação Explosiva.png", selecionada: false, clicked: false },
    { id: 136, dominio: "Arcana", lvl: 5, img: "img/Arcana/5 Cadeia de Relampagos.png", selecionada: false, clicked: false },
    { id: 137, dominio: "Arcana", lvl: 5, img: "img/Arcana/5 Premonição.png", selecionada: false, clicked: false },
    { id: 138, dominio: "Arcana", lvl: 6, img: "img/Arcana/6 Andarilho da Fenda.png", selecionada: false, clicked: false },
    { id: 139, dominio: "Arcana", lvl: 6, img: "img/Arcana/6 Telecinese.png", selecionada: false, clicked: false },
    { id: 140, dominio: "Arcana", lvl: 7, img: "img/Arcana/7 Explosão Camuflada.png", selecionada: false, clicked: false },
    { id: 141, dominio: "Arcana", lvl: 7, img: "img/Arcana/7 Tocado Pelo Arcano.png", selecionada: false, clicked: false },
    { id: 142, dominio: "Arcana", lvl: 8, img: "img/Arcana/8 Aura de confusão.png", selecionada: false, clicked: false },
    { id: 143, dominio: "Arcana", lvl: 8, img: "img/Arcana/8 Retribuição Arcana.png", selecionada: false, clicked: false },
    { id: 144, dominio: "Arcana", lvl: 9, img: "img/Arcana/9 Projeção Sensorial.png", selecionada: false, clicked: false },
    { id: 145, dominio: "Arcana", lvl: 9, img: "img/Arcana/9 Terremoto.png", selecionada: false, clicked: false },
    { id: 146, dominio: "Arcana", lvl: 10, img: "img/Arcana/10 Ajustar Realidade.png", selecionada: false, clicked: false },
    { id: 147, dominio: "Arcana", lvl: 10, img: "img/Arcana/10 Ceu Caindo.png", selecionada: false, clicked: false },

    // Codex
    { id: 148, dominio: "Codex", lvl: 1, img: "img/Codex/1 Livro De Ava.png", selecionada: false, clicked: false },
    { id: 149, dominio: "Codex", lvl: 1, img: "img/Codex/1 Livro De Illiat.png", selecionada: false, clicked: false },
    { id: 150, dominio: "Codex", lvl: 1, img: "img/Codex/1 Livro De Tyfar.png", selecionada: false, clicked: false },
    { id: 151, dominio: "Codex", lvl: 2, img: "img/Codex/2 Livro De Sitil.png", selecionada: false, clicked: false },
    { id: 152, dominio: "Codex", lvl: 2, img: "img/Codex/2 Livro de Vagras.png", selecionada: false, clicked: false },
    { id: 153, dominio: "Codex", lvl: 3, img: "img/Codex/3 Livro de Korvax.png", selecionada: false, clicked: false },
    { id: 154, dominio: "Codex", lvl: 3, img: "img/Codex/3 Livro de Norai.png", selecionada: false, clicked: false },
    { id: 155, dominio: "Codex", lvl: 4, img: "img/Codex/4 Livro de Exota.png", selecionada: false, clicked: false },
    { id: 156, dominio: "Codex", lvl: 4, img: "img/Codex/4 Livro de Grynn.png", selecionada: false, clicked: false },
    { id: 157, dominio: "Codex", lvl: 5, img: "img/Codex/5 Manifestar Muralha.png", selecionada: false, clicked: false },
    { id: 158, dominio: "Codex", lvl: 5, img: "img/Codex/5 Teleporte.png", selecionada: false, clicked: false },
    { id: 159, dominio: "Codex", lvl: 6, img: "img/Codex/6 Banimento.png", selecionada: false, clicked: false },
    { id: 160, dominio: "Codex", lvl: 6, img: "img/Codex/6 Sigilo de Retribuição.png", selecionada: false, clicked: false },
    { id: 161, dominio: "Codex", lvl: 7, img: "img/Codex/7 Livro De Homet.png", selecionada: false, clicked: false },
    { id: 162, dominio: "Codex", lvl: 7, img: "img/Codex/7 Tocado pelo Codex.png", selecionada: false, clicked: false },
    { id: 163, dominio: "Codex", lvl: 8, img: "img/Codex/8 Livro De Vyola.png", selecionada: false, clicked: false },
    { id: 164, dominio: "Codex", lvl: 8, img: "img/Codex/8 Porto Seguro.png", selecionada: false, clicked: false },
    { id: 165, dominio: "Codex", lvl: 9, img: "img/Codex/9 Livro de Ronin.png", selecionada: false, clicked: false },
    { id: 166, dominio: "Codex", lvl: 9, img: "img/Codex/9 Onda de Desintegração.png", selecionada: false, clicked: false },
    { id: 167, dominio: "Codex", lvl: 10, img: "img/Codex/10 Livro de Yarrow.png", selecionada: false, clicked: false },
    { id: 168, dominio: "Codex", lvl: 10, img: "img/Codex/10 União Transcedente.png", selecionada: false, clicked: false },

    // Blade
    { id: 169, dominio: "Blade", lvl: 1, img: "img/Blade/1 Não É Bom O Suficiente.png", selecionada: false, clicked: false },
    { id: 170, dominio: "Blade", lvl: 1, img: "img/Blade/1 Nunca caído.png", selecionada: false, clicked: false },
    { id: 171, dominio: "Blade", lvl: 1, img: "img/Blade/1 Redemoinho.png", selecionada: false, clicked: false },
    { id: 172, dominio: "Blade", lvl: 2, img: "img/Blade/2 Imprudente.png", selecionada: false, clicked: false },
    { id: 173, dominio: "Blade", lvl: 3, img: "img/Blade/3 Guerreiro Versatil.png", selecionada: false, clicked: false },
    { id: 174, dominio: "Blade", lvl: 3, img: "img/Blade/3 Rolamento.png", selecionada: false, clicked: false },
    { id: 175, dominio: "Blade", lvl: 3, img: "img/Blade/3 Vínculo De Soldado.png", selecionada: false, clicked: false },
    { id: 176, dominio: "Blade", lvl: 4, img: "img/Blade/4 Armadura Fortificada.png", selecionada: false, clicked: false },
    { id: 177, dominio: "Blade", lvl: 4, img: "img/Blade/4 Foco Mortal.png", selecionada: false, clicked: false },
    { id: 178, dominio: "Blade", lvl: 5, img: "img/Blade/5 Vantagem do Campeão.png", selecionada: false, clicked: false },
    { id: 179, dominio: "Blade", lvl: 5, img: "img/Blade/5 Vitalitidade.png", selecionada: false, clicked: false },
    { id: 180, dominio: "Blade", lvl: 6, img: "img/Blade/6 Endurecido pela batalha.png", selecionada: false, clicked: false },
    { id: 181, dominio: "Blade", lvl: 6, img: "img/Blade/6 Furia.png", selecionada: false, clicked: false },
    { id: 182, dominio: "Blade", lvl: 7, img: "img/Blade/7 Golpe de Relance.png", selecionada: false, clicked: false },
    { id: 183, dominio: "Blade", lvl: 7, img: "img/Blade/7 Tocado Pela Lamina.png", selecionada: false, clicked: false },
    { id: 184, dominio: "Blade", lvl: 8, img: "img/Blade/8 Frenesi.png", selecionada: false, clicked: false },
    { id: 185, dominio: "Blade", lvl: 8, img: "img/Blade/8 Grito de Guerra.png", selecionada: false, clicked: false },
    { id: 186, dominio: "Blade", lvl: 9, img: "img/Blade/9 Ataque do Ceifador.png", selecionada: false, clicked: false },
    { id: 187, dominio: "Blade", lvl: 9, img: "img/Blade/9 Sangramento e Gloria.png", selecionada: false, clicked: false },
    { id: 188, dominio: "Blade", lvl: 10, img: "img/Blade/10 Massacre.png", selecionada: false, clicked: false },
    { id: 189, dominio: "Blade", lvl: 10, img: "img/Blade/10 Monstro de Batalha.png", selecionada: false, clicked: false },

    // Dread
    { id: 190, dominio: "Dread", lvl: 1, img: "img/Dread/1 Golpe Destruidor.png", selecionada: false, clicked: false },
    { id: 191, dominio: "Dread", lvl: 1, img: "img/Dread/1 Veu Umbral.png", selecionada: false, clicked: false },
    { id: 192, dominio: "Dread", lvl: 1, img: "img/Dread/1 Voz do Pavor.png", selecionada: false, clicked: false },
    { id: 193, dominio: "Dread", lvl: 2, img: "img/Dread/2 Retribuição Horrenda.png", selecionada: false, clicked: false },
    { id: 194, dominio: "Dread", lvl: 2, img: "img/Dread/2 Sugar Essencia.png", selecionada: false, clicked: false },
    { id: 195, dominio: "Dread", lvl: 3, img: "img/Dread/3 Aterrorizar.png", selecionada: false, clicked: false },
    { id: 196, dominio: "Dread", lvl: 3, img: "img/Dread/3 Trauma Compartilhado.png", selecionada: false, clicked: false },
    { id: 197, dominio: "Dread", lvl: 4, img: "img/Dread/4 Aflição Devastadora.png", selecionada: false, clicked: false },
    { id: 198, dominio: "Dread", lvl: 4, img: "img/Dread/4 Convocar Terror.png", selecionada: false, clicked: false },
    { id: 199, dominio: "Dread", lvl: 5, img: "img/Dread/5 Golpe Terrível.png", selecionada: false, clicked: false },
    { id: 201, dominio: "Dread", lvl: 5, img: "img/Dread/5 Nevoa Espectral.png", selecionada: false, clicked: false },
    { id: 202, dominio: "Dread", lvl: 6, img: "img/Dread/6 Chamas Inferiores.png", selecionada: false, clicked: false },
    { id: 203, dominio: "Dread", lvl: 6, img: "img/Dread/6 Salto Lamentador.png", selecionada: false, clicked: false },
    { id: 204, dominio: "Dread", lvl: 7, img: "img/Dread/7 Muro da Fome.png", selecionada: false, clicked: false },
    { id: 205, dominio: "Dread", lvl: 7, img: "img/Dread/7 Tocado pelo Terror.png", selecionada: false, clicked: false },
    { id: 206, dominio: "Dread", lvl: 8, img: "img/Dread/8 Carne Sombria.png", selecionada: false, clicked: false },
    { id: 207, dominio: "Dread", lvl: 8, img: "img/Dread/8 Exercito Das Trevas.png", selecionada: false, clicked: false },
    { id: 208, dominio: "Dread", lvl: 9, img: "img/Dread/9 Condenação.png", selecionada: false, clicked: false },
    { id: 209, dominio: "Dread", lvl: 9, img: "img/Dread/9 Saboreie a Angustia.png", selecionada: false, clicked: false },
    { id: 210, dominio: "Dread", lvl: 10, img: "img/Dread/10 Avatar da Malícia.png", selecionada: false, clicked: false },
    { id: 211, dominio: "Dread", lvl: 10, img: "img/Dread/10 Invocar Tormento.png", selecionada: false, clicked: false },
];

// ========== FUNÇÕES DE DOMÍNIO ==========

function gerarCartasDominios() {
    const lvl = parseInt(getElementValue("filtro-lvl")) || "";
    const dominio = getElementValue("filtro-dominio");

    const dominioContainer = document.getElementById("cartas-disponiveis");
    if (!dominioContainer) return;
    dominioContainer.innerHTML = "";

    const filtradas = cartasDominio.filter(carta => {
        return (lvl === "" || carta.lvl === lvl) &&
            (dominio === "" || carta.dominio === dominio);
    });

    filtradas.forEach(carta => {
        const cardEl = document.createElement("div");
        cardEl.className = "card-dominio";
        cardEl.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${carta.img}" alt="${carta.dominio}">
            </div>
            <button class="select-btn ${carta.selecionada ? 'selected' : ''}" data-id="${carta.id}">
                ${carta.selecionada ? 'Selecionada' : 'Selecionar'}
            </button>
        `;
        dominioContainer.appendChild(cardEl);
    });

    atualizarSelecionadas();
}

function atualizarSelecionadas() {
    const selecionadasContainer = document.getElementById("cartas-selecionadas");
    const maoContainer = document.getElementById("cartas-mao");
    if (!selecionadasContainer || !maoContainer) return;

    selecionadasContainer.innerHTML = "";
    maoContainer.innerHTML = "";

    const selecionadas = cartasDominio.filter(carta => carta.selecionada && !carta.naMao);
    const cartasMao = cartasDominio.filter(carta => carta.naMao);

    selecionadas.forEach(carta => {
        const cardEl = document.createElement("div");
        cardEl.className = "card-dominio";
        cardEl.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${carta.img}" alt="${carta.dominio}">
            </div>
            <div class="card-actions">
                <button class="select-btn remove-btn" onclick="removerSelecionada(${carta.id})">Remover</button>
                <button class="select-btn mao-btn" onclick="mandarParaMao(${carta.id})">Para Mão</button>
            </div>
        `;
        selecionadasContainer.appendChild(cardEl);
    });

    cartasMao.forEach(carta => {
        const cardEl = document.createElement("div");
        cardEl.className = "card-dominio";
        cardEl.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${carta.img}" alt="${carta.dominio}">
            </div>
            <div class="card-actions">
                <button class="select-btn" disabled>Remover</button>
                <button class="select-btn" onclick="tirarDaMao(${carta.id})">Voltar</button>
            </div>
        `;
        maoContainer.appendChild(cardEl);
    });
}

function atualizarMao() {
    atualizarSelecionadas();
}

function mandarParaMao(id) {
    const carta = cartasDominio.find(c => c.id === id);
    if (!carta) return;

    const cartasNaMao = cartasDominio.filter(c => c.naMao).length;
    if (cartasNaMao >= MAX_CARTAS_MAO) {
        alert(`Você só pode ter até ${MAX_CARTAS_MAO} cartas na mão.`);
        return;
    }

    carta.naMao = true;
    atualizarSelecionadas();
}

function tirarDaMao(id) {
    const carta = cartasDominio.find(c => c.id === id);
    if (!carta) return;

    carta.naMao = false;
    atualizarSelecionadas();
}

// ÚNICA DEFINIÇÃO de removerSelecionada (corrigido)
function removerSelecionada(id) {
    const carta = cartasDominio.find(c => c.id === id);
    if (!carta || carta.naMao) return; // Não remove cartas que estão na mão

    carta.selecionada = false;
    gerarCartasDominios();
}

// ========== INICIALIZAÇÃO (SEM DUPLICAÇÃO) ==========

function init() {
    populateDropdowns();
    loadCards();
    handleHashChange();
    gerarCartasDominios();
    generateResourcesText();

    // Auto resize item-text
    document.querySelectorAll('.item-text').forEach(textarea => {
        textarea.addEventListener('input', () => autoResize(textarea));
        autoResize(textarea);
    });

    // Filtros domínio
    document.getElementById("filtro-lvl")?.addEventListener("change", gerarCartasDominios);
    document.getElementById("filtro-dominio")?.addEventListener("change", gerarCartasDominios);

    // Clique selecionar carta (delegação de eventos)
    document.addEventListener("click", e => {
        // Seleção de carta
        if (e.target.classList.contains("select-btn") && !e.target.classList.contains("selected") && e.target.dataset.id) {
            const id = parseInt(e.target.dataset.id);
            const carta = cartasDominio.find(c => c.id === id);
            if (carta) carta.selecionada = true;
            gerarCartasDominios();
        }

        // Delegação para botões de editar/deletar cards
        const actionBtn = e.target.closest('[data-action]');
        if (actionBtn) {
            const action = actionBtn.dataset.action;
            const index = parseInt(actionBtn.dataset.index);
            if (action === 'edit') {
                e.stopPropagation();
                openModalFicha(index, false);
            } else if (action === 'delete') {
                e.stopPropagation();
                deleteIndex = index;
                if (modalDelete) modalDelete.show();
            }
        }
    });

    // Selects ficha - eventos de change
    ['ficha-race', 'ficha-class', 'ficha-subclass', 'ficha-community'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', generateResourcesText);
    });

    // Atualiza subclasses quando classe muda
    document.getElementById('ficha-class')?.addEventListener('change', updateSubclasses);

    // Recursos (HP/Armadura/etc)
    const recursos = [
        { inputId: 'hpQtd', checkId: 'hpChecks' },
        { inputId: 'armaduraQtd', checkId: 'armaduraChecks' },
        { inputId: 'estresseQtd', checkId: 'estresseChecks' },
        { inputId: 'esperancaQtd', checkId: 'esperancaChecks' }
    ];

    recursos.forEach(({ inputId, checkId }) => {
        const input = document.getElementById(inputId);
        if (!input) return;

        input.addEventListener('input', () => {
            const val = parseInt(input.value) || 0;
            input.value = Math.min(Math.max(val, MIN_RESOURCE_VALUE), MAX_RESOURCE_VALUE);
            generateChecks(checkId, input.value);
        });

        generateChecks(checkId, input.value);
    });

    // Exp-text auto height
    document.querySelectorAll(".exp-text").forEach(textarea => {
        textarea.addEventListener("input", function () {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
        });
        textarea.style.height = textarea.scrollHeight + "px";
    });

    // Hash change
    window.addEventListener('hashchange', handleHashChange);

    // Botão confirmar delete (apenas uma vez)
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDeleteFicha);
    }

    // Export global para onclick inline
    window.askDeleteFicha = askDeleteFicha;
    window.confirmDeleteFicha = confirmDeleteFicha;
    window.saveModalFicha = saveModalFicha;
    window.saveFicha = saveFicha;
    window.deleteCard = deleteCard;
    window.editCard = editCard;
    window.openModalFicha = openModalFicha;
    window.openFicha = openFicha;
    window.backToCards = backToCards;
    window.finishEditingFicha = finishEditingFicha;
    window.removerSelecionada = removerSelecionada;
    window.mandarParaMao = mandarParaMao;
    window.tirarDaMao = tirarDaMao;
}

// ========== EVENTOS DE INICIALIZAÇÃO ==========

// Primeira carga
document.addEventListener('DOMContentLoaded', init);

// Correção para bfcache (mobile)
window.addEventListener('pageshow', (e) => {
    if (e.persisted) init();
});

