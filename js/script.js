



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


// Função chamada quando o usuário pede para deletar (antes de abrir o modal)
function askDeleteFicha(index) {
    deleteIndex = index;
    const modal = new bootstrap.Modal(document.getElementById('modalDelete'));
    modal.show();
}

// Função que realmente deleta quando clica em "Confirmar"
function confirmDeleteFicha() {
    let cards = JSON.parse(localStorage.getItem('rpgCards')) || [];
    if (deleteIndex !== null && cards[deleteIndex]) {
        cards.splice(deleteIndex, 1); // remove do array
        localStorage.setItem('rpgCards', JSON.stringify(cards));
    }

    // reset
    deleteIndex = null;

    // fecha modal
    const modalEl = document.getElementById('modalDelete');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    // se estava dentro da ficha, volta para a lista
    backToCards();
    loadCards();

    // limpa hash da URL
    window.location.hash = '';
}


const modalFicha = new bootstrap.Modal(document.getElementById('modalFicha'));
const modalDelete = new bootstrap.Modal(document.getElementById('modalDelete'));

const races = ["Aetheris", "Clank", "Drakona", "Dwarf", "Earthkin", "Elf", "Emberkin", "Faerie", "Faun", "Firbolg", "Fungril", "Galapa", "Giant", "Gnome", "Goblin", "Halfling", "Human", "Infernis", "Katari", "Orc", "Ribbet", "Simiah", "Skykin", "Tidekin"];
const classes = ["Assassin", "Bard", "Brawler", "Druid", "Guardian", "Ranger", "Rogue", "Seraph", "Sorcerer", "Warlock", "Warrior", "Witch", "Wizard"];
const communities = ["Duneborne", "Freeborne", "Frostborne", "Hearthborne", "Highborne", "Loreborne", "Orderborne", "Reborne", "Ridgeborne", "Seaborne", "Slyborne", "Underborne", "Wanderborne", "Warborne", "Wildborne"];

function populateDropdowns() {
    const raceSelect = document.getElementById('ficha-race');
    const classSelect = document.getElementById('ficha-class');
    const communitySelect = document.getElementById('ficha-community');

    raceSelect.innerHTML = '<option value="">Selecione</option>';
    races.forEach(r => raceSelect.appendChild(new Option(r, r)));

    classSelect.innerHTML = '<option value="">Selecione</option>';
    classes.forEach(c => classSelect.appendChild(new Option(c, c)));

    communitySelect.innerHTML = '<option value="">Selecione</option>';
    communities.forEach(c => communitySelect.appendChild(new Option(c, c)));

    raceSelect.onchange = generateResourcesText;
    classSelect.onchange = () => { updateSubclasses(); generateResourcesText(); };
    communitySelect.onchange = generateResourcesText;
}

function updateSubclasses() {
    const cls = document.getElementById('ficha-class').value;
    const subclass = document.getElementById('ficha-subclass');
    subclass.innerHTML = '';
    if (cls && subclasses[cls]) {
        subclasses[cls].forEach(sc => subclass.appendChild(new Option(sc, sc)));
        subclass.disabled = false;
    } else {
        subclass.appendChild(new Option('Selecione uma classe primeiro', ''));
        subclass.disabled = true;
    }
}

function loadCards() {
    container.innerHTML = '';
    const cards = JSON.parse(localStorage.getItem('rpgCards')) || [];

    const newCard = document.createElement('div');
    newCard.className = 'card new-card shadow-sm';
    newCard.innerHTML = '<span>+</span>';
    newCard.onclick = () => openModalFicha(null, true);
    container.appendChild(newCard);

    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card shadow-sm';
        cardEl.innerHTML = `
            ${card.image ? `<img src="${card.image}" style="height:120px; object-fit:cover;">` : ''}
            <div class="card-body d-flex flex-column p-3">
                <h5 class="card-title">${card.title}</h5>
                <hr style="border-color:#5c82c4">
                <div class="card-footer-custom">
                    <div><i class="bi bi-calendar-event"></i> ${card.date}</div>
                    <div class="actions">
                        <i class="bi bi-pencil-square" title="Editar" onclick="editCard(event, ${index})"></i>
                        <i class="bi bi-trash" title="Deletar" onclick="deleteCard(event, ${index})"></i>
                    </div>
                </div>
            </div>
        `;
        cardEl.onclick = () => openFicha(index);
        container.appendChild(cardEl);
    });
}



function handleHashChange() {
    if (window.location.hash && window.location.hash.startsWith('#ficha')) {
        const idx = parseInt(window.location.hash.replace('#ficha', ''), 10);
        if (!isNaN(idx)) openFicha(idx);
    } else {
        // sem hash: volta para a lista
        backToCards();
    }
}

function openModalFicha(index, isNew = false) {
    currentFichaIndex = index;
    document.getElementById('modalTitle').innerText = isNew ? 'Nova Ficha' : 'Editar Ficha';
    if (isNew) {
        document.getElementById('modal-name').value = '';
        document.getElementById('modal-url').value = '';
    } else {
        const cards = JSON.parse(localStorage.getItem('rpgCards')) || [];
        const card = cards[index];
        document.getElementById('modal-name').value = card.title;
        document.getElementById('modal-url').value = card.image || '';
    }
    modalFicha.show();
}

function saveModalFicha() {
    const name = document.getElementById('modal-name').value.trim();
    const image = document.getElementById('modal-url').value.trim();
    if (!name) return alert('Nome é obrigatório');

    let cards = JSON.parse(localStorage.getItem('rpgCards')) || [];
    const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    const fichaData = { title: name, date, image };

    if (currentFichaIndex !== null && cards[currentFichaIndex]) {
        cards[currentFichaIndex] = { ...cards[currentFichaIndex], ...fichaData };
    } else {
        cards.push(fichaData);
    }

    localStorage.setItem('rpgCards', JSON.stringify(cards));
    modalFicha.hide();
    loadCards();
}


function saveFicha() {
    let cards = JSON.parse(localStorage.getItem('rpgCards')) || [];

    // coleta campos (valores numéricos convertidos)
    const fichaData = {
        title: document.getElementById('ficha-name').value.trim(),
        level: parseInt(document.getElementById('ficha-level').value, 10) || 1,
        race: document.getElementById('ficha-race').value || '',
        classchar: document.getElementById('ficha-class').value || '',
        subclass: document.getElementById('ficha-subclass').value || '',
        community: document.getElementById('ficha-community').value || '',

        // atributos
        attributes: {
            agi: parseInt(document.getElementById('attr-agi').value, 10) || 0,
            forca: parseInt(document.getElementById('attr-for').value, 10) || 0,
            fin: parseInt(document.getElementById('attr-fin').value, 10) || 0,
            inst: parseInt(document.getElementById('attr-inst').value, 10) || 0,
            pre: parseInt(document.getElementById('attr-pre').value, 10) || 0,
            con: parseInt(document.getElementById('attr-con').value, 10) || 0,
            evasao: parseInt(document.getElementById('evasao').value, 10) || 0
        },

        // recursos / quantidades
        resources: {
            hp: parseInt(document.getElementById('hpQtd').value, 10) || 6,
            armadura: parseInt(document.getElementById('armaduraQtd').value, 10) || 6,
            estresse: parseInt(document.getElementById('estresseQtd').value, 10) || 6,
            esperanca: parseInt(document.getElementById('esperancaQtd').value, 10) || 6
        },

        // dano (captura por name, sem exigir id)
        damage: {
            menor: document.querySelector('input[name="danoMenor"]')?.value || '',
            maior: document.querySelector('input[name="danoMaior"]')?.value || ''
        },

        // --- Experiências ---
        experiencias: [
            document.getElementById('experiencia1').value.trim(),
            document.getElementById('experiencia2').value.trim(),
            document.getElementById('experiencia3').value.trim(),
            document.getElementById('experiencia4').value.trim(),
            document.getElementById('experiencia5').value.trim()
        ]


        // opcional: se quiser manter thumbnail/image/date no card da lista,
        // preserva campos já existentes (caso exista ficha anterior)
    };

    // Se já existe a ficha (edição), preserva metadados existentes (imagem/date)
    if (currentFichaIndex !== null && cards[currentFichaIndex]) {
        // preserva imagens/data do card anterior se existirem
        const old = cards[currentFichaIndex];
        fichaData.image = old.image || old.thumbnail || '';
        fichaData.date = old.date || (new Date().toLocaleDateString('pt-BR'));
        // substitui
        cards[currentFichaIndex] = { ...old, ...fichaData };
    } else {
        // cria nova ficha e seta date
        fichaData.date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
        cards.push(fichaData);
        currentFichaIndex = cards.length - 1;
    }

    localStorage.setItem('rpgCards', JSON.stringify(cards));

    // Mantém o hash referente à ficha salva
    window.location.hash = `ficha${currentFichaIndex}`;

    // atualiza UI
    loadCards();
    // opcional: manter na ficha (não voltar automaticamente)
    // backToCards();
}





function deleteCard(event, index) {
    event.stopPropagation();
    deleteIndex = index;
    new bootstrap.Modal(document.getElementById('modalDelete')).show();
}

function editCard(event, index) {
    event.stopPropagation();
    openModalFicha(index, false);
}

function openFicha(index) {
    const cards = JSON.parse(localStorage.getItem('rpgCards')) || [];
    const ficha = cards[index];
    if (!ficha) return;

    // Mantém a URL sincronizada
    window.location.hash = `ficha${index}`;

    // Mostra a seção da ficha
    cardsSection.classList.add('hidden');
    fichaSection.classList.remove('hidden');

    currentFichaIndex = index;

    // Campos básicos
    document.getElementById('ficha-name').value = ficha.title || '';
    document.getElementById('ficha-level').value = ficha.level || 1;
    document.getElementById('ficha-race').value = ficha.race || '';
    document.getElementById('ficha-community').value = ficha.community || '';
    document.getElementById('ficha-class').value = ficha.classchar || '';
    updateSubclasses(); // popula subclasse
    document.getElementById('ficha-subclass').value = ficha.subclass || '';

    // --- Atributos & Defesa ---
    const attrs = ficha.attributes || {};
    document.getElementById('attr-agi').value = attrs.agi ?? '';
    document.getElementById('attr-for').value = attrs.forca ?? '';
    document.getElementById('attr-fin').value = attrs.fin ?? '';
    document.getElementById('attr-inst').value = attrs.inst ?? '';
    document.getElementById('attr-pre').value = attrs.pre ?? '';
    document.getElementById('attr-con').value = attrs.con ?? '';
    document.getElementById('evasao').value = attrs.evasao ?? '';

    // --- Dano & Vida ---
    // seus inputs de dano no HTML usam name="danoMenor" e name="danoMaior"
    const danoMenorInput = document.querySelector('input[name="danoMenor"]');
    const danoMaiorInput = document.querySelector('input[name="danoMaior"]');
    const dmg = ficha.damage || {};
    if (danoMenorInput) danoMenorInput.value = dmg.menor ?? '';
    if (danoMaiorInput) danoMaiorInput.value = dmg.maior ?? '';

    // --- Recursos (HP / Armadura / Estresse / Esperança) ---
    const res = ficha.resources || {};
    document.getElementById('hpQtd').value = res.hp ?? 6;
    document.getElementById('armaduraQtd').value = res.armadura ?? 6;
    document.getElementById('estresseQtd').value = res.estresse ?? 6;
    document.getElementById('esperancaQtd').value = res.esperanca ?? 6;

    // agora sim gera os quadradinhos
    generateChecks('hpChecks', res.hp ?? 6);
    generateChecks('armaduraChecks', res.armadura ?? 6);
    generateChecks('estresseChecks', res.estresse ?? 6);
    generateChecks('esperancaChecks', res.esperanca ?? 6);

    const experiencias = ficha.experiencias || [];
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`experiencia${i}`).value = experiencias[i - 1] || '';
    }

    // atualiza texto de recursos (usa selects atuais)
    generateResourcesText();
}


function backToCards() {
    cardsSection.classList.remove('hidden');
    fichaSection.classList.add('hidden');

    // limpa hash (não faz reload)
    if (window.location.hash.startsWith('#ficha')) window.location.hash = '';
    currentFichaIndex = null;
}


populateDropdowns();
loadCards();

function generateChecks(id, qtd) {
    const container = document.getElementById(id);
    container.innerHTML = '';
    qtd = parseInt(qtd) || 0;
    for (let i = 0; i < qtd; i++) {
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        container.appendChild(cb);
    }
}

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
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "Executioners Guild":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
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
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "Martial Artist":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;

            // Druid
            case "Warden of the Elements":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "Warden of Renewal":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;

            // Guardian
            case "Stalwart":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "Vengeance":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;

            // Ranger
            case "Wayfinder":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "Beastbound":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;

            // Rogue
            case "Nightwalker":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "Syndicate":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;

            // Seraph
            case "Divine Wielder":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "Winged Sentinel":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;

            // Sorcerer
            case "Primal Origin":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "Elemental Origin":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;

            // Warlock
            case "Pact of the Wraithful":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "Pact of the Endless":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;

            // Warrior
            case "Call of the Brave":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "Call of the Slayer":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;

            // Witch
            case "Moon":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "Hedge":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;

            // Wizard
            case "School of Knowledge":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
                break;
            case "School of War":
                text += `<strong>Foundation</strong>`;
                text += `<br>`;
                text += `<strong>Specialization</strong>`;
                text += `<br>`;
                text += `<strong>Mastery</strong>`;
                text += `<br><br>`;
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
