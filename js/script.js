const container = document.getElementById('cards-container');
const cardsSection = document.getElementById('cards-section');
const fichaSection = document.getElementById('ficha-section');

let currentFichaIndex = null;
let deleteIndex = null;

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

// instancia os modais UMA vez
const modalFichaEl = document.getElementById('modalFicha');
const modalFicha = modalFichaEl ? new bootstrap.Modal(modalFichaEl) : null;

const modalDeleteEl = document.getElementById('modalDelete');
const modalDelete = modalDeleteEl ? new bootstrap.Modal(modalDeleteEl) : null;

// listas estáticas
const races = ["Aetheris", "Clank", "Drakona", "Dwarf", "Earthkin", "Elf", "Emberkin", "Faerie", "Faun", "Firbolg", "Fungril", "Galapa", "Giant", "Gnome", "Goblin", "Halfling", "Human", "Infernis", "Katari", "Orc", "Ribbet", "Simiah", "Skykin", "Tidekin"];
const classes = ["Assassin", "Bard", "Brawler", "Druid", "Guardian", "Ranger", "Rogue", "Seraph", "Sorcerer", "Warlock", "Warrior", "Witch", "Wizard"];
const communities = ["Duneborne", "Freeborne", "Frostborne", "Hearthborne", "Highborne", "Loreborne", "Orderborne", "Reborne", "Ridgeborne", "Seaborne", "Slyborne", "Underborne", "Wanderborne", "Warborne", "Wildborne"];

// ---------- UI / Dropdowns ----------
function populateDropdowns() {
    const raceSelect = document.getElementById('ficha-race');
    const classSelect = document.getElementById('ficha-class');
    const communitySelect = document.getElementById('ficha-community');

    if (raceSelect) {
        raceSelect.innerHTML = '<option value="">Selecione</option>';
        races.forEach(r => raceSelect.appendChild(new Option(r, r)));
        raceSelect.onchange = generateResourcesText;
    }

    if (classSelect) {
        classSelect.innerHTML = '<option value="">Selecione</option>';
        classes.forEach(c => classSelect.appendChild(new Option(c, c)));
        classSelect.onchange = () => { updateSubclasses(); generateResourcesText(); };
    }

    if (communitySelect) {
        communitySelect.innerHTML = '<option value="">Selecione</option>';
        communities.forEach(c => communitySelect.appendChild(new Option(c, c)));
        communitySelect.onchange = generateResourcesText;
    }

    // inicializa subclasse conforme classe atual (se houver)
    updateSubclasses();
}

function updateFichaCount() {
    const cards = JSON.parse(localStorage.getItem('rpgCards')) || [];
    const countEl = document.getElementById('ficha-count');
    if (countEl) {
        countEl.textContent = `• ${cards.length} Personagens`;
    }
}


function updateSubclasses() {
    const cls = document.getElementById('ficha-class')?.value;
    const subclass = document.getElementById('ficha-subclass');
    if (!subclass) return;
    subclass.innerHTML = '';
    if (cls && subclasses[cls]) {
        subclasses[cls].forEach(sc => subclass.appendChild(new Option(sc, sc)));
        subclass.disabled = false;
    } else {
        subclass.appendChild(new Option('Selecione uma classe primeiro', ''));
        subclass.disabled = true;
    }
}

// ---------- Cartões (Lista) ----------
function getDefaultCardHeight() {
    // tenta ler um card existente (se houver), senão cria um temporário escondido para medir
    try {
        const existing = container.querySelector('.card:not(.new-card)');
        if (existing) {
            const h = existing.getBoundingClientRect().height;
            if (h > 10) return h;
        }

        const tmp = document.createElement('div');
        tmp.className = 'card shadow-sm';
        tmp.style.visibility = 'hidden';
        tmp.style.position = 'absolute';
        tmp.style.left = '-9999px';
        tmp.style.top = '-9999px';
        // adiciona conteúdo mínimo para aproximar altura real
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
    if (!container) return;
    container.innerHTML = '';
    const cards = JSON.parse(localStorage.getItem('rpgCards')) || [];

    // mede altura "padrão" do card (respeita o CSS atual)
    const defaultHeight = getDefaultCardHeight();

    // botão "novo card"
    const newCard = document.createElement('div');
    newCard.className = 'card new-card shadow-sm';
    newCard.style.height = `${defaultHeight}px`;
    newCard.style.display = 'flex';
    newCard.style.flexDirection = 'column';
    newCard.style.overflow = 'hidden';
    newCard.innerHTML = '<span style="font-size:2rem;display:flex;align-items:center;justify-content:center;height:100%;">+</span>';
    newCard.onclick = (e) => { e.stopPropagation(); openModalFicha(null, true); };
    container.appendChild(newCard);

    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card shadow-sm';
        // Mantém exatamente a altura do card original
        cardEl.style.height = `${defaultHeight}px`;
        cardEl.style.display = 'flex';
        cardEl.style.flexDirection = 'column';
        cardEl.style.overflow = 'hidden';

        const hasImage = !!card.image;
        const imageHtml = hasImage
            ? `<div class="card-img-wrap"><img src="${card.image}" class="card-img-custom" alt=""></div>`
            : `<div class="card-img-wrap no-image"></div>`;

        cardEl.innerHTML = `
      ${imageHtml}
      <div class="card-body-custom">
        <h5 class="card-title">${card.title ?? ''}</h5>
        <hr class="card-hr">
        <div class="card-footer-custom">
          <div class="card-date"><i class="bi bi-calendar-event"></i> ${card.date ?? ''}</div>
          <div class="actions">
            <button class="action-btn edit-btn" onclick="editCard(event, ${index})" title="Editar">
              <i class="bi bi-pencil-square"></i>
            </button>
            <button class="action-btn delete-btn" onclick="deleteCard(event, ${index})" title="Deletar">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;

        // abre ficha ao clicar no card
        cardEl.onclick = () => openFicha(index);

        container.appendChild(cardEl);
    });
    updateFichaCount();
}


// ---------- Hash / Navegação ----------
function handleHashChange() {
    if (window.location.hash && window.location.hash.startsWith('#ficha')) {
        const idx = parseInt(window.location.hash.replace('#ficha', ''), 10);
        if (!isNaN(idx)) openFicha(idx);
    } else {
        // sem hash: volta para a lista
        backToCards();
    }
}

// ---------- Modal de edição (mini-card) ----------
function openModalFicha(index, isNew = false) {
    currentFichaIndex = index;
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.innerText = isNew ? 'Nova Ficha' : 'Editar Ficha';

    if (isNew) {
        const nameEl = document.getElementById('modal-name');
        const urlEl = document.getElementById('modal-url');
        if (nameEl) nameEl.value = '';
        if (urlEl) urlEl.value = '';
    } else {
        const cards = JSON.parse(localStorage.getItem('rpgCards')) || [];
        const card = cards[index];
        if (card) {
            const nameEl = document.getElementById('modal-name');
            const urlEl = document.getElementById('modal-url');
            if (nameEl) nameEl.value = card.title ?? '';
            if (urlEl) urlEl.value = card.image ?? '';
        }
    }

    if (modalFicha) modalFicha.show();
}

function saveModalFicha() {
    const name = document.getElementById('modal-name')?.value.trim() || '';
    const urlInput = document.getElementById('modal-url')?.value.trim() || '';
    const fileEl = document.getElementById('modal-file');
    const fileInput = fileEl?.files ? fileEl.files[0] : null;

    if (!name) return alert('Nome é obrigatório');

    let cards = JSON.parse(localStorage.getItem('rpgCards')) || [];
    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

    const saveFichaData = (imageData) => {
        const fichaData = { title: name, date, image: imageData };

        if (currentFichaIndex !== null && cards[currentFichaIndex]) {
            cards[currentFichaIndex] = { ...cards[currentFichaIndex], ...fichaData };
        } else {
            cards.push(fichaData);
            currentFichaIndex = cards.length - 1;
        }

        localStorage.setItem('rpgCards', JSON.stringify(cards));
        // esconde modal via getInstance (seguro)
        const modalInst = bootstrap.Modal.getInstance(modalFichaEl);
        if (modalInst) modalInst.hide();

        loadCards();

        // atualiza hash para o card salvo (mantém referência)
        window.location.hash = `ficha${currentFichaIndex}`;
    };

    if (fileInput) {
        const reader = new FileReader();
        reader.onload = function (e) {
            saveFichaData(e.target.result); // imagem em Base64
        };
        reader.readAsDataURL(fileInput);
    } else {
        saveFichaData(urlInput);
    }
}

// ---------- Salvar / Editar ficha completa ----------
function saveFicha() {
    let cards = JSON.parse(localStorage.getItem('rpgCards')) || [];

    // coleta campos (valores numéricos convertidos)
    const fichaData = {
        title: document.getElementById('ficha-name')?.value.trim() || '',
        level: parseInt(document.getElementById('ficha-level')?.value, 10) || 1,
        race: document.getElementById('ficha-race')?.value || '',
        classchar: document.getElementById('ficha-class')?.value || '',
        subclass: document.getElementById('ficha-subclass')?.value || '',
        community: document.getElementById('ficha-community')?.value || '',

        // atributos
        attributes: {
            agi: parseInt(document.getElementById('attr-agi')?.value, 10) || 0,
            forca: parseInt(document.getElementById('attr-for')?.value, 10) || 0,
            fin: parseInt(document.getElementById('attr-fin')?.value, 10) || 0,
            inst: parseInt(document.getElementById('attr-inst')?.value, 10) || 0,
            pre: parseInt(document.getElementById('attr-pre')?.value, 10) || 0,
            con: parseInt(document.getElementById('attr-con')?.value, 10) || 0,
            evasao: parseInt(document.getElementById('evasao')?.value, 10) || 0
        },

        // recursos / quantidades
        resources: {
            hp: parseInt(document.getElementById('hpQtd')?.value, 10) || 6,
            armadura: parseInt(document.getElementById('armaduraQtd')?.value, 10) || 6,
            estresse: parseInt(document.getElementById('estresseQtd')?.value, 10) || 6,
            esperanca: parseInt(document.getElementById('esperancaQtd')?.value, 10) || 6
        },

        // dano (captura por name, sem exigir id)
        damage: {
            menor: document.querySelector('input[name="danoMenor"]')?.value || '',
            maior: document.querySelector('input[name="danoMaior"]')?.value || ''
        },

        // --- Experiências ---
        experiencias: [
            document.getElementById('experiencia1')?.value.trim() || '',
            document.getElementById('experiencia2')?.value.trim() || '',
            document.getElementById('experiencia3')?.value.trim() || '',
            document.getElementById('experiencia4')?.value.trim() || '',
            document.getElementById('experiencia5')?.value.trim() || ''
        ]
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

    localStorage.setItem('rpgCards', JSON.stringify(cards));
    window.location.hash = `ficha${currentFichaIndex}`;
    loadCards();
    updateFichaCount();
}

// ---------- Deletar ----------
function askDeleteFicha(index) {
    deleteIndex = index;
    if (modalDelete) modalDelete.show();
}

// ---------- Deletar ----------
function confirmDeleteFicha() {
    let cards = JSON.parse(localStorage.getItem('rpgCards')) || [];
    if (deleteIndex !== null && cards[deleteIndex]) {
        cards.splice(deleteIndex, 1);
        localStorage.setItem('rpgCards', JSON.stringify(cards));
        showToast("Ficha deletada 🗑️");
    }
    deleteIndex = null;
    if (modalDeleteEl) {
        const modalInst = bootstrap.Modal.getInstance(modalDeleteEl);
        if (modalInst) modalInst.hide();
    }
    backToCards();
    loadCards();
    if (window.location.hash && window.location.hash.startsWith('#ficha')) window.location.hash = '';
    updateFichaCount();
}

// ---------- Finalizar edição ----------
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

// ---------- Toast ----------
function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.textContent = message;

    container.appendChild(toast);

    // remove após a animação
    setTimeout(() => {
        toast.remove();
    }, 3000); // 3 segundos
}


// ---------- Abrir ficha detalhada ----------
function openFicha(index) {
    const cards = JSON.parse(localStorage.getItem('rpgCards')) || [];
    const ficha = cards[index];
    if (!ficha) return;

    // Mantém a URL sincronizada
    window.location.hash = `ficha${index}`;

    // Mostra a seção da ficha
    if (cardsSection) cardsSection.classList.add('hidden');
    if (fichaSection) fichaSection.classList.remove('hidden');

    currentFichaIndex = index;

    // Campos básicos
    if (document.getElementById('ficha-name')) document.getElementById('ficha-name').value = ficha.title || '';
    if (document.getElementById('ficha-level')) document.getElementById('ficha-level').value = ficha.level || 1;
    if (document.getElementById('ficha-race')) document.getElementById('ficha-race').value = ficha.race || '';
    if (document.getElementById('ficha-community')) document.getElementById('ficha-community').value = ficha.community || '';
    if (document.getElementById('ficha-class')) document.getElementById('ficha-class').value = ficha.classchar || '';

    updateSubclasses(); // popula subclasse
    if (document.getElementById('ficha-subclass')) document.getElementById('ficha-subclass').value = ficha.subclass || '';

    // --- Atributos & Defesa ---
    const attrs = ficha.attributes || {};
    if (document.getElementById('attr-agi')) document.getElementById('attr-agi').value = attrs.agi ?? '';
    if (document.getElementById('attr-for')) document.getElementById('attr-for').value = attrs.forca ?? '';
    if (document.getElementById('attr-fin')) document.getElementById('attr-fin').value = attrs.fin ?? '';
    if (document.getElementById('attr-inst')) document.getElementById('attr-inst').value = attrs.inst ?? '';
    if (document.getElementById('attr-pre')) document.getElementById('attr-pre').value = attrs.pre ?? '';
    if (document.getElementById('attr-con')) document.getElementById('attr-con').value = attrs.con ?? '';
    if (document.getElementById('evasao')) document.getElementById('evasao').value = attrs.evasao ?? '';

    // --- Dano & Vida ---
    const danoMenorInput = document.querySelector('input[name="danoMenor"]');
    const danoMaiorInput = document.querySelector('input[name="danoMaior"]');
    const dmg = ficha.damage || {};
    if (danoMenorInput) danoMenorInput.value = dmg.menor ?? '';
    if (danoMaiorInput) danoMaiorInput.value = dmg.maior ?? '';

    // --- Recursos (HP / Armadura / Estresse / Esperança) ---
    const res = ficha.resources || {};
    if (document.getElementById('hpQtd')) document.getElementById('hpQtd').value = res.hp ?? 6;
    if (document.getElementById('armaduraQtd')) document.getElementById('armaduraQtd').value = res.armadura ?? 6;
    if (document.getElementById('estresseQtd')) document.getElementById('estresseQtd').value = res.estresse ?? 6;
    if (document.getElementById('esperancaQtd')) document.getElementById('esperancaQtd').value = res.esperanca ?? 6;

    // agora sim gera os quadradinhos
    generateChecks('hpChecks', res.hp ?? 6);
    generateChecks('armaduraChecks', res.armadura ?? 6);
    generateChecks('estresseChecks', res.estresse ?? 6);
    generateChecks('esperancaChecks', res.esperanca ?? 6);

    const experiencias = ficha.experiencias || [];
    for (let i = 1; i <= 5; i++) {
        const expEl = document.getElementById(`experiencia${i}`);
        if (expEl) expEl.value = experiencias[i - 1] || '';
    }

    // atualiza texto de recursos (usa selects atuais)
    generateResourcesText();
}

// ---------- Voltar para lista ----------
function backToCards() {
    if (cardsSection) cardsSection.classList.remove('hidden');
    if (fichaSection) fichaSection.classList.add('hidden');

    // limpa hash (não faz reload)
    if (window.location.hash && window.location.hash.startsWith('#ficha')) window.location.hash = '';
    currentFichaIndex = null;
}

// ---------- Helpers ----------
function generateChecks(id, qtd) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = '';
    qtd = parseInt(qtd, 10) || 0;
    for (let i = 0; i < qtd; i++) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        container.appendChild(cb);
    }
}

// Fallback leve: se você já tem uma função mais completa para gerar texto de recursos,
// ela poderá sobrescrever esta. Aqui apenas evitamos erros caso não exista.
function generateResourcesText() {
    // exemplo: atualiza um span com id 'resources-text' (se existir)
    const el = document.getElementById('resources-text');
    if (!el) return;
    const race = document.getElementById('ficha-race')?.value || '-';
    const cls = document.getElementById('ficha-class')?.value || '-';
    const comm = document.getElementById('ficha-community')?.value || '-';
    el.innerText = `Raça: ${race} · Classe: ${cls} · Comunidade: ${comm}`;
}

// ---------- Inicialização ----------
populateDropdowns();
loadCards();

// sincroniza hash quando usuário navega
window.addEventListener('hashchange', handleHashChange);
// checa hash atual na carga (caso o link venha com #fichaX)
handleHashChange();

// exporta funções para serem chamadas por atributos onclick inline (se necessário)
window.askDeleteFicha = askDeleteFicha;
window.confirmDeleteFicha = confirmDeleteFicha;
window.saveModalFicha = saveModalFicha;
window.saveFicha = saveFicha;
window.deleteCard = deleteCard;
window.editCard = editCard;
window.openModalFicha = openModalFicha;
window.openFicha = openFicha;
window.backToCards = backToCards;



function generateResourcesText() {
    const race = document.getElementById('ficha-race').value;
    const classchar = document.getElementById('ficha-class').value;
    const subclass = document.getElementById('ficha-subclass').value;
    const community = document.getElementById('ficha-community').value;

    let text = '';

    if (race) {
        text += `<span style="color:#ff9359">Raça:</span> <span style="color:hsl(54, 100%, 83%)">${race}</span><br>`;
        switch (race) {
            case "Aetheris":
                text += `Hallowed Aura: Once per rest, when an ally within Close range rolls with Fear, you can make it a roll with Hope instead.
Divine Countenance: You have advantage on rolls to command or persuade.<br><br>`;
                break;
            case "Clank":
                text += `Purposeful Design: Decide who made you and for what purpose. At character creation, choose one of your Experiences that best aligns with this purpose and gain a permanent +1 bonus to it.
Efficient: When you take a short rest, you can choose a long rest move instead of a short rest move.<br><br>`;
                break;
            case "Drakona":
                text += `Scales: Your scales act as natural protection. When you would take Severe damage, you can mark a Stress to mark 1 fewer Hit Points.
Elemental Breath: Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinctweapon that deals d8 magic damage using your Proficiency.<br><br>`;
                break;
            case "Dwarf":
                text += `Thick Skin: When you take Minor damage, you can mark 2 Stress instead of marking a Hit Point.
Increased Fortitude: Spend 3 Hope to halve incoming physical damage.<br><br>`;
                break;
            case "Earthkin":
                text += `Stonekin: Gain a +1 bonus to your Armor Score and Damage Thresholds.
Immoveable: While your feet are touching the ground, you cannot be lifted or moved against your will.<br><br>`;
                break;
            case "Elf":
                text += `Quick Reactions: Mark a Stress to gain advantage on a reaction roll.
Celestial Trance: During a rest, you can drop into a trance to choose an additional downtime move.<br><br>`;
                break;
            case "Emberkin":
                text += `Fireproof: You are immune to damage from magical or mundane flame.
Ignition: Mark a Stress to wreathe your primary weapon in flame until the end of the scene. While ablaze, it gives off a bright light and grants a 1d6 bonus to damage rolls against targets within Melee range.<br><br>`;
                break;
            case "Faerie":
                text += `Luckbender: Once per session, after you or a willing ally within Close range makes an action roll, you can spend 3 Hope to reroll the Duality Dice.
Wings: You can fly. While flying, you can mark a Stress after an adversary makes an attack against you to gain a +2 bonus to your Evasion against that attack.<br><br>`;
                break;
            case "Faun":
                text += `Caprine Leap: You can leap anywhere within Close range as though you were using normal movement, allowing you to vault obstacles, jump across gaps, or scale barriers with ease.
Kick: When you succeed on an attack against a target within Melee range, you can mark a Stress to kick yourself off them, dealing an extra 2d6 damage and knocking back either yourself or the target to Very Close range.<br><br>`;
                break;
            case "Firbolg":
                text += `Charge: When you succeed on an Agility Roll to move from Faror Very Far range into Melee range with one or more targets, you can mark a Stress to deal 1d12 physical damage to all targets within Melee range.
Unshakable: When you would mark a Stress, roll a d6. On a result of 6, don’t mark it.<br><br>`;
                break;
            case "Fungril":
                text += `Fungril Network: Make an Instinct Roll ( 12) to use your mycelial array to speak with others of your ancestry. On a success, you can communicate across any distance.
Death Connection: While touching a corpse that died recently, you can mark a Stress to extract one memory from the corpse related to a specific emotion or sensation of your choice.<br><br>`;
                break;
            case "Galapa":
                text += `Shell: Gain a bonus to your damage thresholds equal to your Proficiency.
Retract: Mark a Stress to retract into your shell. While in your shell, you have resistance to physical damage, you have disadvantage on action rolls, and you can’t move.<br><br>`;
                break;
            case "Giant":
                text += `Endurance: Gain an additional Hit Point slot at character creation.
Reach: Treat any weapon, ability, spell, or other feature that has a Melee range as though it has a Very Close range instead.<br><br>`;
                break;
            case "Gnome":
                text += `Nimble Fingers: When you make a Finesse Roll, you can spend 2 Hope to reroll your Hope Die.
True Sight: You have advantage on rolls to see through illusions.<br><br>`;
                break;
            case "Goblin":
                text += `Surefooted: You ignore disadvantage on Agility Rolls.
Danger Sense: Once per rest, mark a Stress to force an adversary to reroll an attack against you or an ally within Very Close range.<br><br>`;
                break;
            case "Halfling":
                text += `Luckbringer: At the start of each session, everyone in your party gains a Hope.
Internal Compass: When you roll a 1 on your Hope Die, you can reroll it.<br><br>`;
                break;
            case "Human":
                text += `High Stamina: Gain an additional Stress slot at character creation.
Adaptability: When you fail a roll that utilized one of your Experiences, you can mark a Stress to reroll.<br><br>`;
                break;
            case "Infernis":
                text += `Fear: When you roll with Fear, you can mark 2 Stress to change it into a roll with Hope instead.
Dread Visage: You have advantage on rolls to intimidate hostile creatures.<br><br>`;
                break;
            case "Katari":
                text += `Feline Instincts: When you make an Agility Roll, you can spend 2 Hope to reroll your Hope Die.
Retracting Claws: Make an Agility Roll to scratch a target within Melee range. On a success, they become temporarily Vulnerable.<br><br>`;
                break;
            case "Orc":
                text += `Sturdy: When you have 1 Hit Point remaining, attacks against you have disadvantage.
Tusks: When you succeed on an attack against a target within Melee range, you can spend a Hope to gore the target with your tusks, dealing an extra 1d6 damage.<br><br>`;
                break;
            case "Ribbet":
                text += `Amphibious: You can breathe and move naturally underwater.
Long Tongue: You can use your long tongue to grab onto things within Close range. Mark a Stress to use your tongue as a Finesse Close weapon that deals d12 physical damage using your Proficiency.<br><br>`;
                break;
            case "Simiah":
                text += `Natural Climber: You have advantage on Agility Rolls that involve balancing and climbing.
Nimble: Gain a permanent +1 bonus to your Evasion at character creation.<br><br>`;
                break;
            case "Skykin":
                text += `Gale Force: Mark a Stress to conjure a gust of wind that carries you or an ally up to Very Far range. Additionally, you can always control the speed at which you fall.
Eye of the Storm: Spend 2 Hope to grant a +1 bonus to either your or an ally’s Evasion until you next take Severe damage or you use Eye of the Storm again.<br><br>`;
                break;
            case "Tidekin":
                text += `Amphibious: You can breathe and move naturally underwater.
Lifespring: Once per rest, when you have access to a small amount of water, you can mark 2 Stress to heal a Hit Point on yourself or an ally.<br><br>`;
                break;
        }
    }


    if (subclass) {
        text += `<span style="color:#ff9359">Classe/Subclasse:</span> <span style="color:hsl(54, 100%, 83%)">${classchar}/${subclass}</span><br>`;

        switch (subclass) {
            // Assassin
            case "Poisoners Guild":
                text += `<strong>Foundation</strong><br>`;
                text += `Toxic Concoctions: Mark a Stress to add 1d4+1 tokens to this card. On your next long rest, clear this card. You know these poisons:
• Gorgon Root: The target gains a permanent -1 penalty to their Difficulty. This can only affect them once.
• Grave Spore: The target must also mark a Stress.
• Leech Weed: Gain a +1d6 damage bonus on this attack.
Envenomate: When you make a successful weapon attack, you can spend a token from this card to afflict the target with a known poison’s effect.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Poison Compendium: You also know these poisons:
• Midnight’s Veil: The target gains a permanent -2 penalty to attack rolls. This can only affect them once.
• Ghost Petal: Permanently decrease the damage dice of the target’s standard attack by one step (d10 to d8, d8 to d6, etc.). This can only affect them once.
Adder’s Blessing: You are immune to poisons and other toxins.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Venomancer: You also know these poisons:
• Blight Seed: The target gains a permanent -3 penalty to their damage thresholds. This can only affect them once.
• Fear Leaf: The damage from this attack gains a bonus equal to the result of your Fear Die.
Twin Fang: When you afflict a target with a known poison’s effect, you can spend an additional token to inflict the effect of a second known poison.<br><br>`;
                break;
            case "Executioners Guild":
                text += `<strong>Foundation</strong><br>`;
                text += `First Strike: The first time in a scene you succeed on an attack roll, double the damage of the attack.
Ambush: Your “Marked for Death” feature uses d6s instead of d4s.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Death Strike: When you deal Severe damage to a creature, you can mark a Stress to make them mark an additional Hit Point.
Scorpion’s Poise: You gain a +2 bonus to your Evasion against any attacks made by the creature Marked for Death.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `True Strike: Once per long rest, when you fail an attack roll, you can spend a Hope to make it a success instead.
Backstab: Your “Marked for Death” feature uses d8s instead of d6s.<br><br>`;
                break;

            // Bard
            case "Troubadour":
                text += `<strong>Foundation</strong><br>`;
                text += `Gifted Performer: Describe how you perform for others. You can play each song once per long rest:
• Relaxing Song: You and all allies within Close range clear a Hit Point.
• Epic Song: Make a target within Close range temporarily Vulnerable.
• Heartbreaking Song: You and all allies within Close range gain a Hope.<br><br>`;
                text += `<strong>Specialization</strong><br>`;
                text += `Maestro: Your rallying songs steel the courage of those who listen. When you give a Rally Die to an ally, they can gain a Hope or clear a Stress.<br><br>`;
                text += `<strong>Mastery</strong><br>`;
                text += `Virtuoso: You are among the greatest of your craft and your skill is boundless. You can perform each of your “Gifted Performer” feature’s songs twice instead of once per long rest.<br><br>`;
                break;
            case "Wordsmith":
                text += `<strong>Foundation</strong><br>`;
                text += `Rousing Speech: Once per long rest, you can give a heartfelt, inspiring speech. All allies within Far range clear 2 Stress.
Heart of a Poet: After you make an action roll to impress, persuade, or offend someone, you can spend a Hope to add a d4 to the roll.<br><br>`;
                text += `<strong>Specialization</strong><br>`;
                text += `Eloquent: Your moving words boost morale. Once per session, when you encourage an ally, you can do one of the following:
• Allow them to find a mundane object or tool they need.
• Help an Ally without spending Hope.
• Give them an additional downtime move during their next rest.<br><br>`;
                text += `<strong>Mastery</strong><br>`;
                text += `Epic Poetry: Your Rally Die increases to a d10. Additionally, when you Help an Ally, you can narrate the moment as if you were writing the tale of their heroism in a memoir. When you do, roll a d10 as your advantage die.<br><br>`;
                break;

            // Brawler
            case "Juggernaut":
                text += `<strong>Foundation</strong><br>`;
                text += `Powerhouse: Increase the d8 damage dice for your unarmed attack to d10s. Additionally, you can mark a Stress to target two creatures within Melee range with a single attack roll.
Overwhelm: On a successful attack, you can spend a Hope to force the target to mark a Stress or to throw them within Close range.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Rugged: Gain a permanent +3 bonus to your Severe damage threshold. Additionally, your “Powerhouse” feature can target three creatures instead of two.
Eye for an Eye: When you mark more than one Hit Point from an attack in melee range, the attacker must make a Reaction Roll (13). On a failure, once per rest, they immediately mark the same number of Hit Points in return.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Pummeljoy: When you critically succeed on a weapon attack in Melee range, you gain an additional Hope, clear an additional Stress, and gain a +1 bonus to your Proficiency for the attack.
Not Done Yet: When you mark more than one HP from an attack, you may gain a Hope or clear a Stress.<br><br>`;
                break;
            case "Martial Artist":
                text += `<strong>Foundation</strong><br>`;
                text += `Martial Form: Take the Martial Form sheet. You start with two martial stances from Tier 1. When you reach a new tier, take two additional stances at your tier or lower.
Focus: During a rest, roll a number of d6s equal to your Instinct and place a number of Focus tokens equal to the highest value rolled on this card. Spend a Focus to shift into a stance until you take Severe damage, the scene ends, you mark your last Hit Point, or you shift into another stance.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Keen Defenses: When you are targeted by an attack, you can spend a Focus to make the adversary’s attack roll have disadvantage.
Spirit Blast: Spend a Focus to make an Instinct Roll against an adversary within Close range. On a success, you deal d20+3 magic damage using your Proficiency and can spend an additional Focus to make them temporarily Vulnerable.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Limit Breaker: Once per rest, you can pull off an unbelievable feat like running across water, leaping between distant rooftops, or scaling the side of a building without needing to roll. When you do, gain a Hope and clear a Stress.<br><br>`;
                break;

            // Druid
            case "Warden of the Elements":
                text += `<strong>Foundation</strong><br>`;
                text += `Elemental Incarnation: Mark a Stress to Channel one of the following elements until you take Severe damage or until your next rest:
• Fire: When an adversary within Melee range deals damage to you, they take 1d10 magic damage.
• Earth: Gain a bonus to your damage thresholds equal to your Proficiency.
• Water: When you deal damage to an adversary within Melee range, all other adversaries within Very Close range must mark a Stress.
• Air: You can hover, gaining advantage on Agility Rolls.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Elemental Aura: Once per rest while Channeling, you can assume an aura matching your element. The aura affects targets within Close range until your Channeling ends.
• Fire: When an adversary marks 1 or more Hit Points, they must also mark a Stress.
• Earth: Your allies gain a +1 bonus to Strength.
• Water: When an adversary deals damage to you, you can mark a Stress to move them anywhere within Very Close range of where they are.
• Air: When you or an ally takes damage from an attack beyond Melee range, reduce the damage by 1d8.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Elemental Dominion: You further embody your element. While Channeling, you gain the following benefit:
• Fire: You gain a +1 bonus to your Proficiency for attacks and spells that deal damage.
• Earth: When you would mark Hit Points, roll a d6 per Hit Point marked. For each result of 6, reduce the number of Hit Points you mark by 1.
• Water: When an attack against you succeeds, you can mark a Stress to make the attacker temporarily Vulnerable.
• Air: You gain a +1 bonus to your Evasion and can fly.<br><br>`;
                break;
            case "Warden of Renewal":
                text += `<strong>Foundation</strong><br>`;
                text += `Clarity of Nature: Once per long rest, you can create a space of natural serenity within Close range. When you spend a few minutes resting within the space, clear Stress equal to your Instinct, distributed as you choose between you and your allies.
Regeneration: Touch a creature and spend 3 Hope. That creature clears 1d4 Hit Points.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Regenerative Reach: You can target creatures within Very Close range with your “Regeneration” feature.
Warden’s Protection: Once per long rest, spend 2 Hope to clear 2 Hit Points on 1d4 allies within Close range.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Defender: Your animal transformation embodies a healing guardian spirit. When you’re in Beastform and an ally within Close range marks 2 or more Hit Points, you can mark a Stress to reduce the number of Hit Points they mark by 1.<br><br>`;
                break;

            // Guardian
            case "Stalwart":
                text += `<strong>Foundation</strong><br>`;
                text += `Unwavering: Gain a permanent +1 bonus to your damage thresholds.
Iron Will: When you take physical damage, you can mark an additional Armor Slot to reduce the severity.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Unrelenting: Gain a permanent +2 bonus to your damage thresholds.
Partners-in-Arms: When an ally within Very Close range takes damage, you can mark an Armor Slot to reduce the severity by one threshold.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Undaunted: Gain a permanent +3 bonus to your damage thresholds.
Loyal Protector: When an ally within Close range has 2 or fewer Hit Points and would take damage, you can mark a Stress to sprint to their side and take the damage instead.<br><br>`;
                break;
            case "Vengeance":
                text += `<strong>Foundation</strong><br>`;
                text += `At Ease: Gain an additional Stress slot.
Revenge: When an adversary within Melee range succeeds on an attack against you, you can mark 2 Stress to force the attacker to mark a Hit Point.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Act of Reprisal: When an adversary damages an ally within Melee range, you gain a +1 bonus to your Proficiency for the next successful attack you make against that adversary.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Nemesis: Spend 2 Hope to Prioritize an adversary until your next rest. When you make an attack against your Prioritized adversary, you can swap the results of your Hope and Fear Dice. You can only Prioritize one adversary at a time.<br><br>`;
                break;

            // Ranger
            case "Wayfinder":
                text += `<strong>Foundation</strong><br>`;
                text += `Ruthless Predator: When you make a damage roll, you can mark a Stress to gain a +1 bonus to your Proficiency. Additionally, when you deal Severe damage to an adversary, they must mark a Stress.
Path Forward: When you’re traveling to a place you’ve previously visited or you carry an object that has been at the location before, you can identify the shortest, most direct path to your destination.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Elusive Predator: When your Focus makes an attack against you, you gain a +2 bonus to your Evasion against the attack.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Apex Predator: Before you make an attack roll against your Focus, you can spend a Hope. On a successful attack, you remove a Fear from the GM’s Fear pool.<br><br>`;
                break;
            case "Beastbound":
                text += `<strong>Foundation</strong><br>`;
                text += `Companion: You have an animal companion of your choice (at the GM’s discretion). They stay by your side unless you tell them otherwise.
Take the Ranger Companion sheet. When you level up your character, choose a level-up option for your companion from this sheet as well.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Expert Training: Choose an additional level-up option for your companion.
Battle-Bonded: When an adversary attacks you while they’re within your companion’s Melee range, you gain a +2 bonus to your Evasion against the attack.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Advanced Training: Choose two additional level-up options for your companion.
Loyal Friend: Once per long rest, when the damage from an attack would mark your companion’s last Stress or your last Hit Point and you’re within Close range of each other, you or your companion can rush to the other’s side and take that damage instead.<br><br>`;
                break;

            // Rogue
            case "Nightwalker":
                text += `<strong>Foundation</strong><br>`;
                text += `Shadow Stepper: You can move from shadow to shadow. When you move into an area of darkness or a shadow cast by another creature or object, you can mark a Stress to disappear from where you are and reappear inside another shadow within Far range. When you reappear, you are Cloaked.
Dark Cloud: Make a Spellcast Roll (15). On a success, create a temporary dark cloud that covers any area within Close range. Anyone in this cloud can’t see outside of it, and anyone outside of it can’t see in. You’re considered Cloaked from any adversary for whom the cloud blocks line of sight.
Adrenaline: While you’re Vulnerable, add your level to your damage rolls.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Fleeting Shadow: Gain a permanent +1 bonus to your Evasion. You can use your “Shadow Stepper” feature to move within Very Far range.
Vanishing Act: Mark a Stress to become Cloaked at any time. When Cloaked from this feature, you automatically clear the Restrained condition if you have it. You remain Cloaked in this way until you roll with Fear or until your next rest.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `<br><br>`;
                break;
            case "Syndicate":
                text += `<strong>Foundation</strong><br>`;
                text += `Well-Connected: When you arrive in a prominent town or environment, you know somebody who calls this place home. Give them a name, note how you think they could be useful, and choose one fact from the following list:
• They owe me a favor, but they’ll be hard to find.
• They’re going to ask for something in exchange.
• They’re always in a great deal of trouble.
• We used to be together. It’s a long story.
• We didn’t part on great terms.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Contacts Everywhere: Once per session, you can briefly call on a shady contact. Choose one of the following benefits and describe what brought them here to help you in this moment:
• They provide 1 handful of gold, a unique tool, or a mundane object that the situation requires.
• On your next action roll, their help provides a +3 bonus to the result of your Hope or Fear Die.
• The next time you deal damage, they snipe from the shadows, adding 2d8 to your damage roll.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Reliable Backup: You can use your “Contacts Everywhere” feature three times per session. The following options are added to the list of benefits you can choose from when you use that feature:
• When you mark 1 or more Hit Points, they can rush out to shield you, reducing the Hit Points marked by 1.
• When you make a Presence Roll in conversation, they back you up. You can roll a d20 as your Hope Die.<br><br>`;
                break;

            // Seraph
            case "Divine Wielder":
                text += `<strong>Foundation</strong><br>`;
                text += `Spirit Weapon: When you have an equipped weapon with a range of Melee or Very Close, it can fly from your hand to attack an adversary within Close range and then return to you. You can mark a Stress to target an additional adversary within range with the same attack roll.
Sparing Touch: Once per long rest, touch a creature and clear 2 Hit Points or 2 Stress from them.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Devout: When you roll your Prayer Dice, you can roll an additional die and discard the lowest result. Additionally, you can use your “Sparing Touch” feature twice instead of once per long rest.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Sacred Resonance: When you roll damage for your “Spirit Weapon” feature, if any of the die results match, double the value of each matching die. For example, if you roll two 5s, they count as two 10s.<br><br>`;
                break;
            case "Winged Sentinel":
                text += `<strong>Foundation</strong><br>`;
                text += `Wings of Light: You can fly. While flying, you can do the following:
• Mark a Stress to pick up and carry another willing creature approximately your size or smaller.
• Spend a Hope to deal an extra 1d8 damage on a successful attack.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Ethereal Visage: Your supernatural visage strikes awe and fear. While flying, you have advantage on Presence Rolls. When you succeed with Hope on a Presence Roll, you can remove a Fear from the GM’s Fear pool instead of gaining Hope.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Ascendant: Gain a permanent +4 bonus to your Severe damage threshold.
Power of the Gods: While flying, you deal an extra 1d12 damage instead of 1d8 from your “Wings of Light” feature.<br><br>`;
                break;

            // Sorcerer
            case "Primal Origin":
                text += `<strong>Foundation</strong><br>`;
                text += `Manipulate Magic: Your primal origin allows you to modify the essence of magic itself. After you cast a spell or make an attack using a weapon that deals magic damage, you can mark a Stress to do one of the following:
• Extend the spell or attack’s reach by one range
• Gain a +2 bonus to the action roll’s result
• Double a damage die of your choice
• Hit an additional target within range<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Enchanted Aid: You can enhance the magic of others with your essence. When you Help an Ally with a Spellcast Roll, you can roll a d8 as your advantage die. Once per long rest, after an ally has made a Spellcast Roll with your help, you can swap the results of their Duality Dice.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Arcane Charge: You can gather magical energy to enhance your capabilities. When you take magic damage, you become Charged. Alternatively, you can spend 2 Hope to become Charged. When you successfully make an attack that deals magic damage while Charged, you can clear your Charge to either gain a +10 bonus to the damage roll or gain a +3 bonus to the Difficulty of a reaction roll the spell causes the target to make. You stop being Charged at your next long rest.<br><br>`;
                break;
            case "Elemental Origin":
                text += `<strong>Foundation</strong><br>`;
                text += `Elementalist: Choose one of the following elements at character creation:
                Air • Earth • Fire • Lightning • Water
You can shape this element into harmless effects. Additionally, spend a Hope and describe how your control over this element helps an action roll you’re about to make, then either gain a +2 bonus to the roll or a +3 bonus to the roll’s damage.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Natural Evasion: You can call forth your element to protect you from harm. When an attack roll against you succeeds, you can mark a Stress and describe how you use your element to defend you. When you do, roll a d6 and add its result to your Evasion against the attack.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Transcendence: Once per long rest, you can transform into a physical manifestation of your element. When you do, describe your transformation and choose two of the following benefits to gain until your next rest:
• +4 bonus to your Severe threshold
• +1 bonus to a character trait of your choice
• +1 bonus to your Proficiency
• +2 bonus to your Evasion<br><br>`;
                break;

            // Warlock
            case "Pact of the Wraithful":
                text += `<strong>Foundation</strong><br>`;
                text += `Favored Weapon: Mark a Stress to Imbue your weapon with your Patron’s fury until you deal Severe damage. On a successful Imbued weapon attack, you can spend any number of Favor to gain a +1d6 damage bonus for each Favor spent.
Herald of Death: When you fail an attack roll, you can spend a Favor to reroll it. If it fails again, mark a Stress and take the new result.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Menacing Reach: When you Imbue your weapon with your Patron’s fury, you can mark an additional Stress to increase its range by one step (Melee to Very Close, Very Close to Close, etc.).
Diminish My Foes: When you succeed with Hope on an action roll against a target, you can spend a Hope to make your target mark a Stress.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Fearsome Attack: You can always spend a Favor to reroll any number of your damage dice. You can continue spending Favor to reroll the same dice as many times as you’d like.
Divine Ire: Once per rest, when you take damage, you can spend any number of Favor to target that many adversaries within Close range. Each target must mark a Hit Point.<br><br>`;
                break;
            case "Pact of the Endless":
                text += `<strong>Foundation</strong><br>`;
                text += `Patron’s Mantle: Mark a Stress to cloak yourself in a terrifying aspect of your Patron that lasts until you take Severe damage or the scene ends:
• When you would mark an Armor Slot, you can spend 2 Favor instead.
• You gain a bonus equal to your tier on action rolls to intimidate a target.
Deadly Devotion: On a successful attack, you can spend a Favor to gain a +1 bonus to your Evasion until you mark a Hit Point or take a rest.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Draining Invocation: When an adversary attacks you or an ally within Very Close range, you can spend a Favor to make them roll a d12 instead of a d20 for the attack. Additionally, the adversary must mark a Stress, and you can clear a Stress.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Dark Aegis: Once per long rest, when you would mark any number of Hit Points, you can spend a Favor instead.
Draining Bane: When an adversary attacks you or an ally within Very Close range, you can spend 2 Favor to temporarily Drain them. When you do, they must mark a Stress and you can clear a Stress. A Drained creature uses a d12 instead of a d20 for attack rolls.<br><br>`;
                break;

            // Warrior
            case "Call of the Brave":
                text += `<strong>Foundation</strong><br>`;
                text += `Courage: When you fail a roll with Fear, you gain a Hope.
Battle Ritual: Once per long rest, before you attempt something incredibly dangerous or face off against a foe who clearly outmatches you, describe what ritual you perform or preparations you make. When you do, clear 2 Stress and gain 2 Hope.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Rise to the Challenge: You are vigilant in the face of mounting danger. While you have 2 or fewer Hit Points unmarked, you can roll a d20 as your Hope Die.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Camaraderie: Your unwavering bravery is a rallying point for your allies. You can initiate a Tag Team Roll one additional time per session. Additionally, when an ally initiates a Tag Team Roll with you, they only need to spend 2 Hope to do so.<br><br>`;
                break;
            case "Call of the Slayer":
                text += `<strong>Foundation</strong><br>`;
                text += `Slayer: You gain a pool of dice called Slayer Dice. On a roll with Hope, you can place a d6 on this card instead of gaining a Hope, adding the die to the pool. You can store a number of Slayer Dice equal to your Proficiency. When you make an attack roll or damage roll, you can spend any number of these Slayer Dice, rolling them and adding their result to the roll. At the end of each session, clear any unspent Slayer Dice on this card and gain a Hope per die cleared.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Weapon Specialist: You can wield multiple weapons with dangerous ease. When you succeed on an attack, you can spend a Hope to add one of the damage dice from your secondary weapon to the damage roll. Additionally, once per long rest when you roll your Slayer Dice, reroll any 1s.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Martial Preparation: You’re an inspirational warrior to all who travel with you. Your party gains access to the Martial Preparation downtime move. To use this move during a rest, describe how you instruct and train with your party. You and each ally who chooses this downtime move gain a d6 Slayer Die. A PC with a Slayer Die can spend it to roll the die and add the result to an attack or damage roll of their choice.<br><br>`;
                break;

            // Witch
            case "Moon":
                text += `<strong>Foundation</strong><br>`;
                text += `Night’s Glamour: Mark a Stress to Glamour yourself in a magical facade that lasts until you mark a Hit Point, make an attack, or take a rest. While Glamoured, you can:
• Disguise yourself to look like any creature of your approximate size that you’ve seen.
• Enhance your own appearance. You gain advantage on Presence Rolls that leverage this change.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Moonbeam: Once per session, you can conjure a column of moonlight that illuminates the area within Close range until the end of the scene. While bathed in this moonlight, you and any allies gain a +1 bonus to Spellcast Rolls and advantage on rolls to see through illusions.
Ire of Pale Light: When a Hexed creature within Far range fails an attack roll, they must mark a Stress.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Lunar Phases: Your spirit ebbs and flows like the phases of the moon. At the beginning of each session, roll a d4 and gain the matching effect until the end of the session:
• 1: New - You can always spend a Hope to reduce Minor damage to None.
• 2: Waxing - Gain a +2 bonus to your damage rolls.
• 3: Full - Gain a +2 bonus to your damage thresholds.
• 4: Waning - Gain a +1 bonus to your Evasion.<br><br>`;
                break;
            case "Hedge":
                text += `<strong>Foundation</strong><br>`;
                text += `Herbal Remedies: When you or an ally clear one or more Hit Points or Stress as the result of using a consumable, increase the number cleared by one.
Tethered Talisman: Once per rest, you can imbue a small item with your protective essence. When the person holding the talisman takes damage, you can expend its magic to reduce the number of Hit Points they mark by one. You can’t create a new talisman until the old one has been used.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Walk Between Worlds: Make a Spellcast Roll (13) to step beyond the veil of death and converse with any nearby spirits. Place a number of tokens equal to your Spellcast trait on this card and remove one each time a spirit answers a question. You return to the mortal realm when the last token is removed.
Enhanced Hex: Attacks you make against Hexed creatures gain a damage bonus equal to your Proficiency.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Circle of Power: Once per rest, mark a circle on the ground around you up to Very Close range and place a number of tokens equal to your Spellcast Trait on this card. Each time you or any ally within the circle makes an action roll or is hit with an attack, remove a token. This spell lasts until the last token is removed or you step out of the circle. While within this circle, you and any allies:
• Gain a +4 bonus to your damage thresholds.
• Gain a +2 bonus to your attack rolls.
• Gain a +1 bonus to your Evasion.<br><br>`;
                break;

            // Wizard
            case "School of Knowledge":
                text += `<strong>Foundation</strong><br>`;
                text += `Prepared: Take an additional domain card of your level or lower from a domain you have access to.
Adept: When you Utilize an Experience, you can mark a Stress instead of spending a Hope. If you do, double your Experience modifier for that roll.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Accomplished: Take an additional domain card of your level or lower from a domain you have access to.
Perfect Recall: Once per rest, when you recall a domain card in your vault, you can reduce its Recall Cost by 1.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Brilliant: Take an additional domain card of your level or lower from a domain you have access to.
Honed Expertise: When you use an Experience, roll a d6. On a result of 5 or higher, you can use it without spending Hope.<br><br>`;
                break;
            case "School of War":
                text += `<strong>Foundation</strong><br>`;
                text += `Battlemage: You’ve focused your studies on becoming an unconquerable force on the battlefield. Gain an additional Hit Point slot.
Face Your Fear: When you succeed with Fear on an attack roll, you deal an extra 1d10 magic damage.<br><br>`;

                text += `<strong>Specialization</strong><br>`;
                text += `Conjure Shield: You can maintain a protective barrier of magic. While you have at least 2 Hope, you add your Proficiency to your Evasion.
Fueled by Fear: The extra magic damage from your “Face Your Fear” feature increases to 2d10.<br><br>`;

                text += `<strong>Mastery</strong><br>`;
                text += `Thrive in Chaos: When you succeed on an attack, you can mark a Stress after rolling damage to force the target to mark an additional Hit Point.
Have No Fear: The extra magic damage from your “Face Your Fear” feature increases to 3d10.<br><br>`;
                break;
        }
    }



    if (community) {
        text += `<span style="color:#ff9359">Comunidade:</span> <span style="color:hsl(54, 100%, 83%)">${community}</span>\n`;

        switch (community) {
            case "Duneborne":
                text +=
                    `Oasis: During a short rest, you or an ally can reroll a die used for a downtime action.\n\n`;
                break;
            case "Freeborne":
                text += `Unbound: Once per session, when you make an action roll with Fear, you can instead change it to a roll with Hope instead.\n\n`;
                break;
            case "Frostborne":
                text += `Hardy: Once per rest, you can Help an Ally traverse difficult terrain without spending a Hope.\n\n`;
                break;
            case "Hearthborne":
                text += `Close-Knit: Once per long rest, you can spend any number of Hope to give an ally the same number of Hope.\n\n`;
                break;
            case "Highborne":
                text += `Privilege: You have advantage on rolls to consort with nobles, negotiate prices, or leverage your reputation to get what you want.\n\n`;
                break;
            case "Loreborne":
                text += `Well-Read: You have advantage on rolls that involve the history, culture, or politics of a prominent person or place.\n\n`;
                break;
            case "Orderborne":
                text += `Dedicated: Record three sayings or values your upbringing instilled in you. Once per rest, when you describe how you’re embodying one of these principles through your current action, you can roll a d20 as your Hope Die.\n\n`;
                break;
            case "Reborne":
                text += `Found Family: Once per session, you can spend a Hope to use an ally’s community ability. When you do, your ally gains a Hope.
At any point, when you’ve discovered the community you were once a part of, or have joined a new community, you can permanently trade this community card for that one instead.\n\n`;
                break;
            case "Ridgeborne":
                text += `Steady: You have advantage on rolls to traverse dangerous cliffs and ledges, navigate harsh environments, and use your survival knowledge.\n\n`;
                break;
            case "Seaborne":
                text += `Know the Tide: You can sense the ebb and flow of life. When you roll with Fear, place a token on this card. You can hold a number of tokens equal to your level. Before you make an action roll, you can spend any number of these tokens to gain a +1 bonus to the roll for each token spent. At the end of each session, clear all unspent tokens.\n\n`;
                break;
            case "Slyborne":
                text += `Scoundrel: You have advantage on rolls to negotiate with criminals, detect lies, or find a safe place to hide.\n\n`;
                break;
            case "Underborne":
                text += `Low-Light Living: When you’re in an area with low light or heavy shadow, you have advantage on rolls to hide, investigate, or perceive details within that area.\n\n`;
                break;
            case "Wanderborne":
                text += `Nomadic Pack: Add a Nomadic Pack to your inventory. Once per session, you can spend a Hope to reach into this pack and pull out a mundane item that’s useful to your situation. Work with the GM to figure out what item you take out.\n\n`;
                break;
            case "Warborne":
                text += `Brave Face: Once per session, when an attack would cause you to mark a Stress, you can spend a Hope instead.\n\n`;
                break;
            case "Wildborne":
                text += `Lightfoot: Your movement is naturally silent. You have advantage on rolls to move without being heard.\n\n`;
                break;
        }
    }

    // Conecta o botão do modal com a função que realmente deleta
    document.getElementById('confirmDelete').addEventListener('click', confirmDeleteFicha);


    window.addEventListener('load', () => {
        populateDropdowns();
        loadCards();
        // abre ficha caso haja hash
        handleHashChange();
        // escuta mudanças de hash (usuário ou link externo)
        window.addEventListener('hashchange', handleHashChange);
    });


    document.getElementById('recursosText').innerHTML = text;
}

// sempre atualizar quando mudar qualquer select
document.getElementById('ficha-race').addEventListener('change', generateResourcesText);
document.getElementById('ficha-class').addEventListener('change', generateResourcesText);
document.getElementById('ficha-subclass').addEventListener('change', generateResourcesText);
document.getElementById('ficha-community').addEventListener('change', generateResourcesText);

// também atualizar na carga inicial
window.addEventListener('DOMContentLoaded', generateResourcesText);

document.addEventListener('DOMContentLoaded', () => {
    // lista dos recursos e ids correspondentes dos check-groups
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
            // limite mínimo e máximo
            if (input.value > 30) input.value = 30;
            if (input.value < 0) input.value = 0;

            // atualiza os checkboxes instantaneamente
            generateChecks(checkId, input.value);
        });

        // inicializa os checks na carga da página
        generateChecks(checkId, input.value);
    });

    document.querySelectorAll(".exp-text").forEach((textarea) => {
        textarea.addEventListener("input", function () {
            this.style.height = "auto"; // reseta antes de medir
            this.style.height = this.scrollHeight + "px"; // ajusta ao conteúdo
        });

        // ajusta altura inicial (caso já tenha texto salvo)
        textarea.style.height = textarea.scrollHeight + "px";
    });
});