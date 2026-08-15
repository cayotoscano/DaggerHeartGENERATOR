
// ========== DATABASE DE ITENS ==========

// Armas: cada item tem { name, tier, type: "physical"/"magic", att, range, dmg, trait }
// tier: 1 (Nível 1), 2 (Níveis 2-4), 3 (Níveis 5-7), 4 (Níveis 8-10)
const databaseWeapons = [
    // --- TIER 1 ---
    {
        name: "Adaga",
        tier: 1,
        type: "physical",
        att: "Acuidade",
        range: "Corpo a corpo",
        dmg: "1d8+1",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Alabarda",
        tier: 1,
        type: "physical",
        att: "Força",
        range: "Muito próximo",
        dmg: "1d10+2",
        grip: "Duas mãos",
        trait: "Inconveniente: –1 em Acuidade"
    },
    {
        name: "Alfange",
        tier: 1,
        type: "physical",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d8+1",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Arco curto",
        tier: 1,
        type: "physical",
        att: "Agilidade",
        range: "Distante",
        dmg: "1d6+3",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Arco longo",
        tier: 1,
        type: "physical",
        att: "Agilidade",
        range: "Muito distante",
        dmg: "1d8+3",
        grip: "Duas mãos",
        trait: "Inconveniente: –1 em Acuidade"
    },
    {
        name: "Besta",
        tier: 1,
        type: "physical",
        att: "Acuidade",
        range: "Distante",
        dmg: "1d6+1",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Bordão",
        tier: 1,
        type: "physical",
        att: "Instinto",
        range: "Corpo a corpo",
        dmg: "1d10+3",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Espada larga",
        tier: 1,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d8",
        grip: "Uma mão",
        trait: "Confiável: +1 em testes de ataque"
    },
    {
        name: "Espada longa",
        tier: 1,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d10+3",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Lança",
        tier: 1,
        type: "physical",
        att: "Acuidade",
        range: "Muito próximo",
        dmg: "1d8+3",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Maça",
        tier: 1,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d8+1",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Machado de batalha",
        tier: 1,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+3",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Martelo de guerra",
        tier: 1,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d12+3",
        grip: "Duas mãos",
        trait: "Pesado: –1 em Evasão"
    },
    {
        name: "Montante",
        tier: 1,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+3",
        grip: "Duas mãos",
        trait: "Enorme: –1 em Evasão; ao acertar um ataque, role +1 dado de dano e descarte o resultado mais baixo"
    },
    {
        name: "Rapieira",
        tier: 1,
        type: "physical",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d8",
        grip: "Uma mão",
        trait: "Veloz: ao fazer um ataque, marque 1 Ponto de Fadiga para atingir outra criatura ao alcance"
    },
    {
        name: "Anéis luminosos",
        tier: 1,
        type: "magic",
        att: "Agilidade",
        range: "Muito próximo",
        dmg: "1d10+2",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Cajado curto",
        tier: 1,
        type: "magic",
        att: "Instinto",
        range: "Próximo",
        dmg: "1d8+1",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Cajado duplo",
        tier: 1,
        type: "magic",
        att: "Instinto",
        range: "Distante",
        dmg: "1d6+3",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Cajado grande",
        tier: 1,
        type: "magic",
        att: "Conhecimento",
        range: "Muito distante",
        dmg: "1d6",
        grip: "Duas mãos",
        trait: "Poderoso: ao acertar um ataque, role +1 dado de dano e descarte o resultado mais baixo"
    },
    {
        name: "Cetro",
        tier: 1,
        type: "magic",
        att: "Presença",
        range: "Distante",
        dmg: "1d6",
        grip: "Duas mãos",
        trait: "Versátil: também pode ser usada com estas estatísticas — Presença, corpo a corpo, 1d8"
    },
    {
        name: "Lâmina do retorno",
        tier: 1,
        type: "magic",
        att: "Acuidade",
        range: "Próximo",
        dmg: "1d8",
        grip: "Uma mão",
        trait: "Retornável: quando arremessada dentro do alcance, reaparece em sua mão imediatamente após o ataque"
    },
    {
        name: "Machado sagrado",
        tier: 1,
        type: "magic",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d8+1",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Manoplas arcanas",
        tier: 1,
        type: "magic",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+3",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Runas de mão",
        tier: 1,
        type: "magic",
        att: "Instinto",
        range: "Muito próximo",
        dmg: "1d10",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Varinha",
        tier: 1,
        type: "magic",
        att: "Conhecimento",
        range: "Distante",
        dmg: "1d6+1",
        grip: "Uma mão",
        trait: ""
    },

    // --- TIER 2 ---
    {
        name: "Adaga aprimorada",
        tier: 2,
        type: "physical",
        att: "Acuidade",
        range: "Corpo a corpo",
        dmg: "1d8+4",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Alabarda aprimorada",
        tier: 2,
        type: "physical",
        att: "Força",
        range: "Muito próximo",
        dmg: "1d10+5",
        grip: "Duas mãos",
        trait: "Inconveniente: –1 em Acuidade"
    },
    {
        name: "Alfange aprimorado",
        tier: 2,
        type: "physical",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d8+4",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Arco curto aprimorado",
        tier: 2,
        type: "physical",
        att: "Agilidade",
        range: "Distante",
        dmg: "1d6+6",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Arco longo aprimorado",
        tier: 2,
        type: "physical",
        att: "Agilidade",
        range: "Muito distante",
        dmg: "1d8+6",
        grip: "Duas mãos",
        trait: "Inconveniente: –1 em Acuidade"
    },
    {
        name: "Besta aprimorada",
        tier: 2,
        type: "physical",
        att: "Acuidade",
        range: "Distante",
        dmg: "1d6+4",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Bordão aprimorado",
        tier: 2,
        type: "physical",
        att: "Instinto",
        range: "Corpo a corpo",
        dmg: "1d10+6",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Espada larga aprimorada",
        tier: 2,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d8+3",
        grip: "Uma mão",
        trait: "Confiável: +1 em testes de ataque"
    },
    {
        name: "Espada longa aprimorada",
        tier: 2,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d10+6",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Lança aprimorada",
        tier: 2,
        type: "physical",
        att: "Acuidade",
        range: "Muito próximo",
        dmg: "1d8+6",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Maça aprimorada",
        tier: 2,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d8+4",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Machado de batalha aprimorado",
        tier: 2,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+6",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Martelo de guerra aprimorado",
        tier: 2,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d12+6",
        grip: "Duas mãos",
        trait: "Pesado: –1 em Evasão"
    },
    {
        name: "Montante aprimorada",
        tier: 2,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+6",
        grip: "Duas mãos",
        trait: "Enorme: –1 em Evasão; ao acertar um ataque, role +1 dado de dano e descarte o resultado mais baixo"
    },
    {
        name: "Rapieira aprimorada",
        tier: 2,
        type: "physical",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d8+3",
        grip: "Uma mão",
        trait: "Veloz: ao atacar, marque 1 Ponto de Fadiga para atingir outra criatura no alcance"
    },

    // especiais físicas tier 2

    { name: "Alabarda de aço", tier: 2, type: "physical", att: "Força", range: "Muito próximo", dmg: "1d8+4", grip: "Duas mãos", trait: "Aversão: ao acertar um ataque, o alvo deve marcar 1 Ponto de Fadiga" },
    { name: "Arco Fio-de-cabelo", tier: 2, type: "physical", att: "Agilidade", range: "Muito distante", dmg: "1d6+5", grip: "Duas mãos", trait: "Confiável: +1 em testes de ataque" },
    { name: "Arco grande", tier: 2, type: "physical", att: "Força", range: "Distante", dmg: "1d6+6", grip: "Duas mãos", trait: "Poderoso: ao acertar um ataque, role +1 dado de dano e descarte o resultado mais baixo" },
    { name: "Bacamarte", tier: 2, type: "physical", att: "Acuidade", range: "Próximo", dmg: "1d8+6", grip: "Duas mãos", trait: "Recarregável: após um ataque, role 1d6; se tirar 1, marque 1 Ponto de Fadiga para recarregar" },
    { name: "Chicote laminado", tier: 2, type: "physical", att: "Agilidade", range: "Muito próximo", dmg: "1d8+3", grip: "Uma mão", trait: "Veloz: ao atacar, marque 1 Ponto de Fadiga para atingir outra criatura no alcance" },
    { name: "Espada larga de Urok", tier: 2, type: "physical", att: "Acuidade", range: "Corpo a corpo", dmg: "1d8+3", grip: "Uma mão", trait: "Mortal: ao causar dano grave, o alvo deve marcar 1 Ponto de Vida adicional" },
    { name: "Falcione dourado", tier: 2, type: "physical", att: "Força", range: "Corpo a corpo", dmg: "1d10+4", grip: "Uma mão", trait: "Poderoso: ao acertar um ataque, role +1 dado de dano e descarte o resultado mais baixo" },
    { name: "Foice de guerra", tier: 2, type: "physical", att: "Acuidade", range: "Muito próximo", dmg: "1d8+5", grip: "Duas mãos", trait: "Confiável: +1 em testes de ataque" },
    { name: "Soqueira com lâmina", tier: 2, type: "physical", att: "Força", range: "Corpo a corpo", dmg: "1d10+6", grip: "Duas mãos", trait: "Brutal: quando rolar o valor máximo em um dado de dano, role +1 dado de dano" },

    // mágicas tier 2

    { name: "Anéis luminosos aprimorados", tier: 2, type: "magic", att: "Agilidade", range: "Muito próximo", dmg: "1d10+5", grip: "Duas mãos", trait: "" },
    { name: "Cajado curto aprimorado", tier: 2, type: "magic", att: "Instinto", range: "Próximo", dmg: "1d8+4", grip: "Uma mão", trait: "" },
    { name: "Cajado duplo aprimorado", tier: 2, type: "magic", att: "Instinto", range: "Distante", dmg: "1d6+6", grip: "Duas mãos", trait: "" },
    { name: "Cajado grande aprimorado", tier: 2, type: "magic", att: "Conhecimento", range: "Muito distante", dmg: "1d6+3", grip: "Duas mãos", trait: "Poderoso: ao acertar um ataque, role +1 dado de dano e descarte o resultado mais baixo" },
    { name: "Cetro aprimorado", tier: 2, type: "magic", att: "Presença", range: "Distante", dmg: "1d6+3", grip: "Duas mãos", trait: "Versátil: também pode ser usada com estas estatísticas — Presença, corpo a corpo, 1d8" },
    { name: "Lâmina do retorno aprimorada", tier: 2, type: "magic", att: "Acuidade", range: "Próximo", dmg: "1d8+3", grip: "Uma mão", trait: "Retornável: quando arremessada dentro do alcance, reaparece em sua mão imediatamente após o ataque" },
    { name: "Machado sagrado aprimorado", tier: 2, type: "magic", att: "Força", range: "Corpo a corpo", dmg: "1d8+4", grip: "Uma mão", trait: "" },
    { name: "Manoplas arcanas aprimoradas", tier: 2, type: "magic", att: "Força", range: "Corpo a corpo", dmg: "1d10+6", grip: "Duas mãos", trait: "" },
    { name: "Runas de mão aprimoradas", tier: 2, type: "magic", att: "Instinto", range: "Muito próximo", dmg: "1d10+3", grip: "Uma mão", trait: "" },
    { name: "Varinha aprimorada", tier: 2, type: "magic", att: "Conhecimento", range: "Distante", dmg: "1d6+4", grip: "Uma mão", trait: "" },

    // --- TIER 3 ---
    {
        name: "Adaga avançada",
        tier: 3,
        type: "physical",
        att: "Acuidade",
        range: "Corpo a corpo",
        dmg: "1d8+7",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Alabarda avançada",
        tier: 3,
        type: "physical",
        att: "Força",
        range: "Muito próximo",
        dmg: "1d10+8",
        grip: "Duas mãos",
        trait: "Inconveniente: –1 em Acuidade"
    },
    {
        name: "Alfange avançado",
        tier: 3,
        type: "physical",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d8+7",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Arco curto avançado",
        tier: 3,
        type: "physical",
        att: "Agilidade",
        range: "Distante",
        dmg: "1d6+9",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Arco longo avançado",
        tier: 3,
        type: "physical",
        att: "Agilidade",
        range: "Muito distante",
        dmg: "1d8+9",
        grip: "Duas mãos",
        trait: "Inconveniente: –1 em Acuidade"
    },
    {
        name: "Besta avançada",
        tier: 3,
        type: "physical",
        att: "Acuidade",
        range: "Distante",
        dmg: "1d6+7",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Bordão avançado",
        tier: 3,
        type: "physical",
        att: "Instinto",
        range: "Corpo a corpo",
        dmg: "1d10+9",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Espada larga avançada",
        tier: 3,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d8+6",
        grip: "Uma mão",
        trait: "Confiável: +1 em testes de ataque"
    },
    {
        name: "Espada longa avançada",
        tier: 3,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d10+9",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Lança avançada",
        tier: 3,
        type: "physical",
        att: "Acuidade",
        range: "Muito próximo",
        dmg: "1d8+9",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Maça avançada",
        tier: 3,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d8+7",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Machado de batalha avançado",
        tier: 3,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+9",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Martelo de guerra avançado",
        tier: 3,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d12+9",
        grip: "Duas mãos",
        trait: "Pesado: –1 em Evasão"
    },
    {
        name: "Montante avançada",
        tier: 3,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+9",
        grip: "Duas mãos",
        trait: "Enorme: –1 em Evasão; ao acertar, role +1 dado de dano e descarte o menor"
    },
    {
        name: "Rapieira avançada",
        tier: 3,
        type: "physical",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d8+6",
        grip: "Uma mão",
        trait: "Veloz: ao atacar, marque 1 Ponto de Fadiga para atingir outra criatura no alcance"
    },
    {
        name: "Arco com espinhos",
        tier: 3,
        type: "physical",
        att: "Agilidade",
        range: "Muito distante",
        dmg: "1d6+7",
        grip: "Duas mãos",
        trait: "Versátil: também pode ser usada com estas estatísticas — Agilidade, corpo a corpo, 1d10+5"
    },
    {
        name: "Espada da Bravura",
        tier: 3,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d12+7",
        grip: "Duas mãos",
        trait: "Valente: –1 em Evasão; +3 no limiar de dano grave"
    },
    {
        name: "Garras-lâmina",
        tier: 3,
        type: "physical",
        att: "Acuidade",
        range: "Próximo",
        dmg: "1d10+7",
        grip: "Duas mãos",
        trait: "Brutal: ao rolar o valor máximo em um dado de dano, role +1 dado"
    },
    {
        name: "Lâmina do Oscilume",
        tier: 3,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d8+5",
        grip: "Uma mão",
        trait: "Fugaz: receba bônus igual à sua Agilidade nas rolagens de dano"
    },
    {
        name: "Machado de Labrys",
        tier: 3,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+7",
        grip: "Duas mãos",
        trait: "Armadura: +1 Ponto de Armadura"
    },
    {
        name: "Mangual duplo",
        tier: 3,
        type: "physical",
        att: "Agilidade",
        range: "Muito próximo",
        dmg: "1d10+8",
        grip: "Duas mãos",
        trait: "Poderoso: ao acertar, role +1 dado de dano e descarte o menor"
    },
    {
        name: "Martelo da Ira",
        tier: 3,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+7",
        grip: "Duas mãos",
        trait: "Atroz: antes do ataque, marque 1 Ponto de Fadiga para usar d20 como dado de dano"
    },
    {
        name: "Revólver da Pólvora Negra",
        tier: 3,
        type: "physical",
        att: "Acuidade",
        range: "Distante",
        dmg: "1d6+8",
        grip: "Uma mão",
        trait: "Recarregável: após um ataque, role 1d6; se tirar 1, marque 1 Ponto de Fadiga para recarregar"
    },
    {
        name: "Sabre de Merídia",
        tier: 3,
        type: "physical",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d10+5",
        grip: "Uma mão",
        trait: "Direcionado: se não houver criatura Próxima do alvo, ataque com vantagem"
    },
    {
        name: "Sabre retrátil",
        tier: 3,
        type: "physical",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d10+7",
        grip: "Uma mão",
        trait: "Retrátil: a lâmina pode ser escondida no cabo para dificultar a detecção"
    },
    {
        name: "Anéis luminosos avançados",
        tier: 3,
        type: "magical",
        att: "Agilidade",
        range: "Muito próximo",
        dmg: "1d10+8",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Cajado curto avançado",
        tier: 3,
        type: "magical",
        att: "Instinto",
        range: "Próximo",
        dmg: "1d8+7",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Cajado duplo avançado",
        tier: 3,
        type: "magical",
        att: "Instinto",
        range: "Distante",
        dmg: "1d6+9",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Cajado grande avançado",
        tier: 3,
        type: "magical",
        att: "Conhecimento",
        range: "Muito distante",
        dmg: "1d6+6",
        grip: "Duas mãos",
        trait: "Poderoso: ao acertar, role +1 dado de dano e descarte o menor"
    },
    {
        name: "Cetro avançado",
        tier: 3,
        type: "magical",
        att: "Presença",
        range: "Distante",
        dmg: "1d6+6",
        grip: "Duas mãos",
        trait: "Versátil: também pode ser usado com Presença, corpo a corpo, 1d8+4"
    },
    {
        name: "Lâmina do retorno avançada",
        tier: 3,
        type: "magical",
        att: "Acuidade",
        range: "Próximo",
        dmg: "1d8+6",
        grip: "Uma mão",
        trait: "Retornável: reaparece na mão após ser arremessada"
    },
    {
        name: "Machado sagrado avançado",
        tier: 3,
        type: "magical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d8+7",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Manoplas arcanas avançadas",
        tier: 3,
        type: "magical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+9",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Runas de mão avançadas",
        tier: 3,
        type: "magical",
        att: "Instinto",
        range: "Muito próximo",
        dmg: "1d10+6",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Varinha avançada",
        tier: 3,
        type: "magical",
        att: "Conhecimento",
        range: "Distante",
        dmg: "1d6+7",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Arco dourado",
        tier: 3,
        type: "magical",
        att: "Acuidade",
        range: "Distante",
        dmg: "1d6+7",
        grip: "Duas mãos",
        trait: "Perfeccionista: dados que rolarem 1 causam 6 de dano"
    },
    {
        name: "Cajado de fogo",
        tier: 3,
        type: "magical",
        att: "Instinto",
        range: "Distante",
        dmg: "1d6+7",
        grip: "Duas mãos",
        trait: "Ardente: ao rolar 6 no dano, o alvo marca 1 Ponto de Fadiga"
    },
    {
        name: "Lâmina Fantasma",
        tier: 3,
        type: "hybrid",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d10+7",
        grip: "Uma mão",
        trait: "De outro mundo: escolha causar dano físico ou mágico ao acertar"
    },
    {
        name: "Machado de Fortunis",
        tier: 3,
        type: "magical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+8",
        grip: "Duas mãos",
        trait: "Sorte: ao errar, marque 1 Ponto de Fadiga para refazer o ataque"
    },
    {
        name: "Orbe mágico",
        tier: 3,
        type: "magical",
        att: "Conhecimento",
        range: "Distante",
        dmg: "1d6+7",
        grip: "Uma mão",
        trait: "Poderoso: ao acertar, role +1 dado de dano e descarte o menor"
    },
    {
        name: "Pingente de Widogast",
        tier: 3,
        type: "magical",
        att: "Conhecimento",
        range: "Próximo",
        dmg: "1d10+5",
        grip: "Uma mão",
        trait: "Distorção Temporal: escolha o alvo após o teste de ataque"
    },
    {
        name: "Punhal abençoado",
        tier: 3,
        type: "magical",
        att: "Instinto",
        range: "Corpo a corpo",
        dmg: "1d10+6",
        grip: "Uma mão",
        trait: "Vitalizante: recupera 1 PV automaticamente em repousos"
    },
    {
        name: "Rifle de Ilmari",
        tier: 3,
        type: "magical",
        att: "Acuidade",
        range: "Muito distante",
        dmg: "1d6+6",
        grip: "Uma mão",
        trait: "Recarregável: após o ataque, role 1d6; se 1, marque 1 Ponto de Fadiga para recarregar"
    },
    {
        name: "Runas da ruína",
        tier: 3,
        type: "magical",
        att: "Conhecimento",
        range: "Muito próximo",
        dmg: "1d20+4",
        grip: "Uma mão",
        trait: "Excruciante: sempre que acertar, marque 1 Ponto de Fadiga"
    },

    // --- TIER 4 ---
    {
        name: "Adaga lendária",
        tier: 4,
        type: "physical",
        att: "Acuidade",
        range: "Corpo a corpo",
        dmg: "1d8+10",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Alabarda lendária",
        tier: 4,
        type: "physical",
        att: "Força",
        range: "Muito próximo",
        dmg: "1d10+11",
        grip: "Duas mãos",
        trait: "Inconveniente: –1 em Acuidade"
    },
    {
        name: "Alfange lendário",
        tier: 4,
        type: "physical",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d8+10",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Arco curto lendário",
        tier: 4,
        type: "physical",
        att: "Agilidade",
        range: "Distante",
        dmg: "1d6+12",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Arco longo lendário",
        tier: 4,
        type: "physical",
        att: "Agilidade",
        range: "Muito distante",
        dmg: "1d8+12",
        grip: "Duas mãos",
        trait: "Inconveniente: –1 em Acuidade"
    },
    {
        name: "Besta lendária",
        tier: 4,
        type: "physical",
        att: "Acuidade",
        range: "Distante",
        dmg: "1d6+10",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Bordão lendário",
        tier: 4,
        type: "physical",
        att: "Instinto",
        range: "Corpo a corpo",
        dmg: "1d10+12",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Espada larga lendária",
        tier: 4,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d8+9",
        grip: "Uma mão",
        trait: "Confiável: +1 em testes de ataque"
    },
    {
        name: "Espada longa lendária",
        tier: 4,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d10+12",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Lança lendária",
        tier: 4,
        type: "physical",
        att: "Acuidade",
        range: "Muito próximo",
        dmg: "1d8+12",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Maça lendária",
        tier: 4,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d8+10",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Machado de batalha lendário",
        tier: 4,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+12",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Martelo de guerra lendário",
        tier: 4,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d12+12",
        grip: "Duas mãos",
        trait: "Pesado: –1 em Evasão"
    },
    {
        name: "Montante lendária",
        tier: 4,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+12",
        grip: "Duas mãos",
        trait: "Enorme: –1 em Evasão; ao acertar, role +1 dado de dano e descarte o menor"
    },
    {
        name: "Rapieira lendária",
        tier: 4,
        type: "physical",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d8+9",
        grip: "Uma mão",
        trait: "Veloz: marque 1 Fadiga para atingir outro alvo no alcance"
    },
    {
        name: "Adaga curva",
        tier: 4,
        type: "physical",
        att: "Acuidade",
        range: "Corpo a corpo",
        dmg: "1d8+9",
        grip: "Uma mão",
        trait: "Serra: dados que rolarem 1 causam 8 de dano"
    },
    {
        name: "Arco de Aantari",
        tier: 4,
        type: "physical",
        att: "Acuidade",
        range: "Distante",
        dmg: "1d6+11",
        grip: "Duas mãos",
        trait: "Confiável: +1 em testes de ataque"
    },
    {
        name: "Canhão de mão",
        tier: 4,
        type: "physical",
        att: "Acuidade",
        range: "Muito distante",
        dmg: "1d6+12",
        grip: "Uma mão",
        trait: "Recarregável: após o ataque, role 1d6; se 1, marque 1 Fadiga para recarregar"
    },
    {
        name: "Dardo de corda",
        tier: 4,
        type: "physical",
        att: "Presença",
        range: "Próximo",
        dmg: "1d8+9",
        grip: "Duas mãos",
        trait: "Agarrar: gaste 1 Esperança para imobilizar ou puxar o alvo"
    },
    {
        name: "Espada dupla",
        tier: 4,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d10+9",
        grip: "Duas mãos",
        trait: "Veloz: marque 1 Fadiga para atingir outro alvo no alcance"
    },
    {
        name: "Machado-martelo",
        tier: 4,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d12+13",
        grip: "Duas mãos",
        trait: "Destruição: –1 em Agilidade; adversários muito próximos marcam 1 Fadiga"
    },
    {
        name: "Machado-ricochete",
        tier: 4,
        type: "physical",
        att: "Agilidade",
        range: "Distante",
        dmg: "1d6+11",
        grip: "Duas mãos",
        trait: "Ricochete: marque Fadiga para atingir múltiplos alvos"
    },
    {
        name: "Manopla do Impacto",
        tier: 4,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+11",
        grip: "Uma mão",
        trait: "Repelente: gaste 1 Esperança para empurrar o alvo"
    },
    {
        name: "Pique estendido",
        tier: 4,
        type: "physical",
        att: "Acuidade",
        range: "Muito próximo",
        dmg: "1d8+10",
        grip: "Duas mãos",
        trait: "Comprimento: atinge todos os alvos em linha reta"
    }, {
        name: "Anéis luminosos lendários",
        tier: 4,
        type: "magic",
        att: "Agilidade",
        range: "Muito próximo",
        dmg: "1d10+11",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Cajado curto lendário",
        tier: 4,
        type: "magic",
        att: "Instinto",
        range: "Próximo",
        dmg: "1d8+10",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Cajado duplo lendário",
        tier: 4,
        type: "magic",
        att: "Instinto",
        range: "Distante",
        dmg: "1d8+12",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Cajado grande lendário",
        tier: 4,
        type: "magic",
        att: "Conhecimento",
        range: "Muito distante",
        dmg: "1d6+9",
        grip: "Duas mãos",
        trait: "Poderoso: role +1 dado de dano e descarte o menor"
    },
    {
        name: "Cetro lendário",
        tier: 4,
        type: "magic",
        att: "Presença",
        range: "Distante",
        dmg: "1d6+9",
        grip: "Duas mãos",
        trait: "Versátil: também corpo a corpo 1d8+6"
    },
    {
        name: "Lâmina do retorno lendária",
        tier: 4,
        type: "magic",
        att: "Acuidade",
        range: "Próximo",
        dmg: "1d8+9",
        grip: "Uma mão",
        trait: "Retornável: volta imediatamente para a mão após arremessar"
    },
    {
        name: "Machado sagrado lendário",
        tier: 4,
        type: "magic",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d8+10",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Manoplas arcanas lendárias",
        tier: 4,
        type: "magic",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+12",
        grip: "Duas mãos",
        trait: ""
    },
    {
        name: "Runas de mão lendárias",
        tier: 4,
        type: "magic",
        att: "Instinto",
        range: "Muito próximo",
        dmg: "1d10+9",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Varinha lendária",
        tier: 4,
        type: "magic",
        att: "Conhecimento",
        range: "Distante",
        dmg: "1d6+10",
        grip: "Uma mão",
        trait: ""
    },
    {
        name: "Arco de cardo",
        tier: 4,
        type: "magic",
        att: "Instinto",
        range: "Distante",
        dmg: "1d6+13",
        grip: "Duas mãos",
        trait: "Confiável: +1 em testes de ataque"
    },
    {
        name: "Cajado Sangrento",
        tier: 4,
        type: "magic",
        att: "Instinto",
        range: "Distante",
        dmg: "1d20+7",
        grip: "Duas mãos",
        trait: "Excruciante: ao acertar, marque 1 Fadiga"
    },
    {
        name: "Espada da Luz e da Chama",
        tier: 4,
        type: "magic",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d10+11",
        grip: "Duas mãos",
        trait: "Quente: corta materiais sólidos"
    },
    {
        name: "Foice de Midas",
        tier: 4,
        type: "magic",
        att: "Conhecimento",
        range: "Corpo a corpo",
        dmg: "1d10+9",
        grip: "Duas mãos",
        trait: "Egoísta: gaste ouro para +1 na Proficiência de dano"
    },
    {
        name: "Lâminas flutuantes",
        tier: 4,
        type: "magic",
        att: "Instinto",
        range: "Próximo",
        dmg: "1d8+9",
        grip: "Uma mão",
        trait: "Poderoso: role +1 dado de dano e descarte o menor"
    },
    {
        name: "Luvas de liga",
        tier: 4,
        type: "magic",
        att: "Conhecimento",
        range: "Muito distante",
        dmg: "1d6+9",
        grip: "Duas mãos",
        trait: "Ligação: bônus igual ao nível nas rolagens de dano"
    },
    {
        name: "Manoplas sorvedouras",
        tier: 4,
        type: "magic",
        att: "Presença",
        range: "Corpo a corpo",
        dmg: "1d10+9",
        grip: "Duas mãos",
        trait: "Sorvedouras: ao acertar, 1d6; com 6 recupera Vida ou Fadiga"
    },
    {
        name: "Revólver de Magus",
        tier: 4,
        type: "magic",
        att: "Acuidade",
        range: "Muito distante",
        dmg: "1d6+13",
        grip: "Uma mão",
        trait: "Recarregável: role 1d6 após o ataque; com 1 marque 1 Fadiga"
    },
    {
        name: "Varinha de Essek",
        tier: 4,
        type: "magic",
        att: "Conhecimento",
        range: "Distante",
        dmg: "1d8+13",
        grip: "Uma mão",
        trait: "Distorção Temporal: escolha o alvo após o teste"
    }
];

// ========== DATABASE DE ITENS ==========

const databaseWeapons2 = [
    // --- TIER 1 ---
    {
        name: "Adaga pequena",
        tier: 1,
        type: "physical",
        att: "Acuidade",
        range: "Corpo a corpo",
        dmg: "1d8",
        grip: "Uma",
        trait: "Par: sua arma principal causa +2 de dano em alvos corpo a corpo"
    },
    {
        name: "Besta de mão",
        tier: 1,
        type: "physical",
        att: "Acuidade",
        range: "Distante",
        dmg: "1d6+1",
        grip: "Uma",
        trait: ""
    },
    {
        name: "Chicote",
        tier: 1,
        type: "physical",
        att: "Presença",
        range: "Muito próximo",
        dmg: "1d6",
        grip: "Uma",
        trait: "Alarmante: marque 1 Ponto de Fadiga para forçar adversários corpo a corpo a recuar para alcance próximo"
    },
    {
        name: "Escudo redondo",
        tier: 1,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d4",
        grip: "Uma",
        trait: "Armadura: +1 Ponto de Armadura"
    },
    {
        name: "Escudo-torre",
        tier: 1,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d6",
        grip: "Uma",
        trait: "Barreira: +2 Pontos de Armadura; –1 na Evasão"
    },
    {
        name: "Espada curta",
        tier: 1,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d8",
        grip: "Uma",
        trait: "Par: sua arma principal causa +2 de dano em alvos corpo a corpo"
    },
    {
        name: "Gancho",
        tier: 1,
        type: "physical",
        att: "Acuidade",
        range: "Próximo",
        dmg: "1d6",
        grip: "Uma",
        trait: "Gancho: ao acertar um ataque, você pode puxar o alvo para ficar corpo a corpo"
    },

    // --- TIER 2 ---
    {
        name: "Adaga pequena aprimorada",
        tier: 2,
        type: "physical",
        att: "Acuidade",
        range: "Corpo a corpo",
        dmg: "1d8+2",
        grip: "Uma",
        trait: "Par: sua arma principal causa +3 de dano em alvos corpo a corpo"
    },
    {
        name: "Besta de mão aprimorada",
        tier: 2,
        type: "physical",
        att: "Acuidade",
        range: "Distante",
        dmg: "1d6+3",
        grip: "Uma",
        trait: ""
    },
    {
        name: "Chicote aprimorado",
        tier: 2,
        type: "physical",
        att: "Presença",
        range: "Muito próximo",
        dmg: "1d6+2",
        grip: "Uma",
        trait: "Alarmante: marque 1 Ponto de Fadiga para forçar adversários corpo a corpo a recuar para alcance próximo"
    },
    {
        name: "Escudo redondo aprimorado",
        tier: 2,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d4+2",
        grip: "Uma",
        trait: "Armadura: +2 Pontos de Armadura"
    },
    {
        name: "Escudo-torre aprimorado",
        tier: 2,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d6+2",
        grip: "Uma",
        trait: "Barreira: +3 Pontos de Armadura; –1 na Evasão"
    },
    {
        name: "Espada curta aprimorada",
        tier: 2,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d8+2",
        grip: "Uma",
        trait: "Par: sua arma principal causa +3 de dano em alvos corpo a corpo"
    },
    {
        name: "Gancho aprimorado",
        tier: 2,
        type: "physical",
        att: "Acuidade",
        range: "Próximo",
        dmg: "1d6+2",
        grip: "Uma",
        trait: "Gancho: ao acertar um ataque, você pode puxar o alvo para seu alcance corpo a corpo"
    },
    {
        name: "Adaga aparadora",
        tier: 2,
        type: "physical",
        att: "Acuidade",
        range: "Corpo a corpo",
        dmg: "1d6+2",
        grip: "Uma",
        trait: "Aparar: ao sofrer um ataque, role os dados de dano desta arma; se qualquer dado do adversário tiver o mesmo valor de um dos seus, ele deve descartá-lo antes de causar dano"
    },
    {
        name: "Escudo com espinhos",
        tier: 2,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d6+2",
        grip: "Uma",
        trait: "Dupla Função: +1 Ponto de Armadura; +1 de dano para a arma principal em alvos corpo a corpo"
    },
    {
        name: "Machado retornável",
        tier: 2,
        type: "physical",
        att: "Agilidade",
        range: "Próximo",
        dmg: "1d6+4",
        grip: "Uma",
        trait: "Retornável: quando arremessada dentro do alcance, reaparece em sua mão imediatamente após o ataque"
    },

    // --- TIER 3 ---
    {
        name: "Adaga pequena avançada",
        tier: 3,
        type: "physical",
        att: "Acuidade",
        range: "Corpo a corpo",
        dmg: "1d8+4",
        grip: "Uma",
        trait: "Par: sua arma principal causa +4 de dano em alvos corpo a corpo"
    },
    {
        name: "Besta de mão avançada",
        tier: 3,
        type: "physical",
        att: "Acuidade",
        range: "Distante",
        dmg: "1d6+5",
        grip: "Uma",
        trait: ""
    },
    {
        name: "Chicote avançado",
        tier: 3,
        type: "physical",
        att: "Presença",
        range: "Muito próximo",
        dmg: "1d6+4",
        grip: "Uma",
        trait: "Alarmante: marque 1 Ponto de Fadiga para forçar adversários corpo a corpo a recuar para alcance próximo"
    },
    {
        name: "Escudo redondo avançado",
        tier: 3,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d4+4",
        grip: "Uma",
        trait: "Armadura: +3 Pontos de Armadura"
    },
    {
        name: "Escudo-torre avançado",
        tier: 3,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d6+4",
        grip: "Uma",
        trait: "Barreira: +4 Pontos de Armadura; –1 na Evasão"
    },
    {
        name: "Espada curta avançada",
        tier: 3,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d8+4",
        grip: "Uma",
        trait: "Par: sua arma principal causa +4 de dano em alvos corpo a corpo"
    },
    {
        name: "Gancho avançado",
        tier: 3,
        type: "physical",
        att: "Acuidade",
        range: "Próximo",
        dmg: "1d6+4",
        grip: "Uma",
        trait: "Gancho: ao acertar um ataque, você pode puxar o alvo para ficar corpo a corpo"
    },
    {
        name: "Broquel",
        tier: 3,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d4+4",
        grip: "Uma",
        trait: "Desviar: ao sofrer um ataque, marque 1 Ponto de Armadura para receber bônus na Evasão igual aos seus PA disponíveis contra este ataque"
    },
    {
        name: "Funda",
        tier: 3,
        type: "physical",
        att: "Acuidade",
        range: "Muito distante",
        dmg: "1d6+4",
        grip: "Uma",
        trait: "Versátil: também pode ser usada com estas estatísticas — Acuidade, Próximo, 1d8+4"
    },
    {
        name: "Manopla fortalecida",
        tier: 3,
        type: "physical",
        att: "Conhecimento",
        range: "Próximo",
        dmg: "1d6+4",
        grip: "Uma",
        trait: "Carregar: marque 1 Ponto de Fadiga para receber +1 em sua Proficiência em um ataque com sua arma principal"
    },

    // --- TIER 4 ---
    {
        name: "Adaga pequena lendária",
        tier: 4,
        type: "physical",
        att: "Acuidade",
        range: "Corpo a corpo",
        dmg: "1d8+6",
        grip: "Uma",
        trait: "Par: sua arma principal causa +5 de dano em alvos corpo a corpo"
    },
    {
        name: "Besta de mão lendária",
        tier: 4,
        type: "physical",
        att: "Acuidade",
        range: "Distante",
        dmg: "1d6+7",
        grip: "Uma",
        trait: ""
    },
    {
        name: "Chicote lendário",
        tier: 4,
        type: "physical",
        att: "Presença",
        range: "Muito próximo",
        dmg: "1d6+6",
        grip: "Uma",
        trait: "Alarmante: marque 1 Ponto de Fadiga para forçar adversários corpo a corpo a recuar para alcance próximo"
    },
    {
        name: "Escudo redondo lendário",
        tier: 4,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d4+6",
        grip: "Uma",
        trait: "Armadura: +4 Pontos de Armadura"
    },
    {
        name: "Escudo-torre lendário",
        tier: 4,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d6+6",
        grip: "Uma",
        trait: "Barreira: +5 Pontos de Armadura; –1 na Evasão"
    },
    {
        name: "Espada curta lendária",
        tier: 4,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d8+6",
        grip: "Uma",
        trait: "Par: sua arma principal causa +5 de dano em alvos corpo a corpo"
    },
    {
        name: "Gancho lendário",
        tier: 4,
        type: "physical",
        att: "Acuidade",
        range: "Próximo",
        dmg: "1d6+6",
        grip: "Uma",
        trait: "Gancho: ao acertar um ataque, você pode puxar o alvo para ficar corpo a corpo"
    },
    {
        name: "Escudo da Bravura",
        tier: 4,
        type: "physical",
        att: "Agilidade",
        range: "Corpo a corpo",
        dmg: "1d4+6",
        grip: "Uma",
        trait: "Proteção: ao marcar 1 Ponto de Armadura, reduz o dano causado em você e em todos os aliados corpo a corpo que receberam o mesmo dano"
    },
    {
        name: "Lasca de Apoio",
        tier: 4,
        type: "physical",
        att: "Instinto",
        range: "Muito próximo",
        dmg: "1d4",
        grip: "Uma",
        trait: "Concentração: ao acertar um ataque, seu próximo ataque contra o mesmo alvo com sua arma principal tem sucesso automático"
    },
    {
        name: "Luva com garras",
        tier: 4,
        type: "physical",
        att: "Força",
        range: "Corpo a corpo",
        dmg: "1d6+8",
        grip: "Uma",
        trait: "Alvo Duplo: ao atacar com sua arma principal, você pode causar dano a outro alvo corpo a corpo"
    },
];


// Armaduras: { name, tier, score, thresholds, trait }
const databaseArmor = [
    // --- TIER 1 ---
    {
        name: "Gibão",
        tier: 1,
        score: 3,
        thresholds: "5/11",
        trait: "Flexível: +1 em Evasão"
    },
    {
        name: "Armadura de couro",
        tier: 1,
        score: 3,
        thresholds: "6/13",
        trait: ""
    },
    {
        name: "Cota de malha",
        tier: 1,
        score: 4,
        thresholds: "7/15",
        trait: "Pesada: –1 em Evasão"
    },
    {
        name: "Armadura de placas",
        tier: 1,
        score: 4,
        thresholds: "8/17",
        trait: "Muito Pesada: –2 em Evasão; –1 em Agilidade"
    },

    // --- TIER 2 ---
    {
        name: "Gibão aprimorado",
        tier: 2,
        score: 4,
        thresholds: "7/16",
        trait: "Flexível: +1 em Evasão"
    },
    {
        name: "Armadura de couro aprimorada",
        tier: 2,
        score: 4,
        thresholds: "9/20",
        trait: ""
    },
    {
        name: "Cota de malha aprimorada",
        tier: 2,
        score: 5,
        thresholds: "11/24",
        trait: "Pesada: –1 em Evasão"
    },
    {
        name: "Armadura de placas aprimorada",
        tier: 2,
        score: 5,
        thresholds: "13/28",
        trait: "Muito Pesada: –2 em Evasão; –1 em Agilidade"
    },
    {
        name: "Cota de Malha Elundriana",
        tier: 2,
        score: 4,
        thresholds: "9/21",
        trait: "Égide: reduza sua Armadura do dano mágico antes de comparar com os limiares"
    },
    {
        name: "Armadura do Tormento",
        tier: 2,
        score: 4,
        thresholds: "9/21",
        trait: "Resiliente: antes de marcar seu último PA, role 1d6; com 6 reduza a gravidade do dano em 1 limiar sem marcar PA"
    },
    {
        name: "Peitoral de Placas de Pau-Ferro",
        tier: 2,
        score: 4,
        thresholds: "9/20",
        trait: "Reforços: ao marcar o último PA, aumente os limiares em +2 até recuperar 1 PA"
    },
    {
        name: "Armadura Flutuante de Runetan",
        tier: 2,
        score: 4,
        thresholds: "9/20",
        trait: "Inconstante: ao sofrer um ataque, marque 1 PA para o teste ser feito com desvantagem"
    },
    {
        name: "Armadura Graciosa de Tyris",
        tier: 2,
        score: 5,
        thresholds: "8/18",
        trait: "Furtividade: +2 em testes para se deslocar silenciosamente"
    },
    {
        name: "Armadura de Rosamata",
        tier: 2,
        score: 5,
        thresholds: "11/23",
        trait: "Esperança: ao gastar 1 Esperança, você pode marcar 1 PA em vez disso"
    },

    // --- TIER 3 ---
    {
        name: "Gibão avançado",
        tier: 3,
        score: 5,
        thresholds: "9/23",
        trait: "Flexível: +1 em Evasão"
    },
    {
        name: "Armadura de couro avançada",
        tier: 3,
        score: 5,
        thresholds: "11/27",
        trait: ""
    },
    {
        name: "Cota de malha avançada",
        tier: 3,
        score: 6,
        thresholds: "13/31",
        trait: "Pesada: –1 em Evasão"
    },
    {
        name: "Armadura de placas avançada",
        tier: 3,
        score: 6,
        thresholds: "15/35",
        trait: "Muito Pesada: –2 em Evasão; –1 em Agilidade"
    },
    {
        name: "Armadura de Bellamoi",
        tier: 3,
        score: 5,
        thresholds: "11/27",
        trait: "Revestimento Dourado: +1 em Presença"
    },
    {
        name: "Armadura de escamas de dragão",
        tier: 3,
        score: 5,
        thresholds: "11/27",
        trait: "Impenetrável: uma vez por descanso curto, marque 1 Fadiga em vez do último PV"
    },
    {
        name: "Armadura de placas com espinhos",
        tier: 3,
        score: 5,
        thresholds: "10/25",
        trait: "Cortante: ao acertar um ataque corpo a corpo, +1d4 no dano"
    },
    {
        name: "Armadura Passalâmina",
        tier: 3,
        score: 6,
        thresholds: "16/39",
        trait: "Física: não pode marcar PA para reduzir dano mágico"
    },
    {
        name: "Capa de Monett",
        tier: 3,
        score: 6,
        thresholds: "16/39",
        trait: "Mágica: não pode marcar PA para reduzir dano físico"
    },
    {
        name: "Runas da Fortificação",
        tier: 3,
        score: 6,
        thresholds: "17/43",
        trait: "Excruciante: sempre que marcar 1 PA, marque também 1 Fadiga"
    },

    // --- TIER 4 ---
    {
        name: "Gibão lendário",
        tier: 4,
        score: 6,
        thresholds: "11/32",
        trait: "Flexível: +1 em Evasão"
    },
    {
        name: "Armadura de couro lendária",
        tier: 4,
        score: 6,
        thresholds: "13/36",
        trait: ""
    },
    {
        name: "Cota de malha lendária",
        tier: 4,
        score: 7,
        thresholds: "15/40",
        trait: "Pesada: –1 em Evasão"
    },
    {
        name: "Armadura de placas lendária",
        tier: 4,
        score: 7,
        thresholds: "17/44",
        trait: "Muito Pesada: –2 em Evasão; –1 em Agilidade"
    },
    {
        name: "Cota de Seda de Dunamis",
        tier: 4,
        score: 7,
        thresholds: "13/36",
        trait: "Lentidão Temporal: ao sofrer um ataque, marque 1 PA para somar 1d4 na Evasão contra este ataque"
    },
    {
        name: "Armadura da Canalização",
        tier: 4,
        score: 5,
        thresholds: "13/36",
        trait: "Canalização: +1 em testes de conjuração"
    },
    {
        name: "Armadura de tecido âmbar",
        tier: 4,
        score: 6,
        thresholds: "13/36",
        trait: "Ardente: inimigos corpo a corpo que o atingirem marcam 1 Fadiga"
    },
    {
        name: "Armadura fortificada",
        tier: 4,
        score: 4,
        thresholds: "15/40",
        trait: "Fortificação: ao marcar 1 PA, reduza a gravidade do ataque em dois limiares"
    },
    {
        name: "Armadura de Opala da Verdade",
        tier: 4,
        score: 6,
        thresholds: "13/36",
        trait: "Veraz: brilha quando uma criatura próxima mente"
    },
    {
        name: "Cota de Malha Salvadora",
        tier: 4,
        score: 8,
        thresholds: "18/48",
        trait: "Fatigante: –1 em todos os atributos e na Evasão"
    },
];

// ========== ITEM SELECTION MODAL LOGIC ==========
let currentItemContext = null; // 'primary', 'secondary', 'armor'
let modalItemSelection = null; // Bootstrap modal instance

function openItemModal(context) {
    currentItemContext = context;
    const modalEl = document.getElementById('modalItemSelection');
    if (modalEl) {
        modalItemSelection = new bootstrap.Modal(modalEl);
        renderItemLists(context);
        modalItemSelection.show();
    }
}

function renderItemLists(context) {
    const isArmor = context === 'armor';
    const isSecondary = context === 'secondary';

    let db;
    if (isArmor) {
        db = databaseArmor;
    } else if (isSecondary) {
        db = databaseWeapons2;
    } else {
        db = databaseWeapons;
    }

    const tiers = [
        { id: 1, target: 'tier1-content' },
        { id: 2, target: 'tier2-content' },
        { id: 3, target: 'tier3-content' },
        { id: 4, target: 'tier4-content' }
    ];

    tiers.forEach(t => {
        const container = document.getElementById(t.target);
        if (!container) return;
        container.innerHTML = '';

        const itemsInTier = db.filter(i => i.tier === t.id);

        if (itemsInTier.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">Nenhum item cadastrado neste nível.</p>';
            return;
        }

        if (isArmor || isSecondary) {
            // Lista única para armaduras ou armas secundárias
            const listDiv = document.createElement('div');
            listDiv.className = 'item-list-container';

            itemsInTier.forEach(item => {
                listDiv.appendChild(createItemCard(item, isArmor));
            });
            container.appendChild(listDiv);
        } else {
            // Dividir em Físico e Mágico para armas primárias
            const rowDiv = document.createElement('div');
            rowDiv.className = 'item-row-split';

            const colPhys = document.createElement('div');
            colPhys.className = 'item-col';
            colPhys.innerHTML = '<div class="item-section-title">Físico</div>';

            const colMagic = document.createElement('div');
            colMagic.className = 'item-col';
            colMagic.innerHTML = '<div class="item-section-title">Mágico</div>';

            itemsInTier.forEach(item => {
                const card = createItemCard(item, false);
                if (item.type === 'physical') {
                    colPhys.appendChild(card);
                } else {
                    colMagic.appendChild(card);
                }
            });

            rowDiv.appendChild(colPhys);
            rowDiv.appendChild(colMagic);
            container.appendChild(rowDiv);
        }
    });
}

function createItemCard(item, isArmor) {
    const card = document.createElement('div');
    card.className = 'item-card-mini';
    card.onclick = () => selectItem(item, isArmor);

    if (isArmor) {
        card.innerHTML = `
            <div class="item-name">${item.name}</div>
            <div class="item-details">
                Score: ${item.score} | Limiares: ${item.thresholds}
            </div>
            <div class="item-trait">${item.trait || ''}</div>
        `;
    } else {
        card.innerHTML = `
            <div class="item-name">${item.name}</div>
            <div class="item-details">
                 ${item.att} | ${item.dmg} | ${item.range} | ${item.grip || '-'}
            </div>
            <div class="item-trait">${item.trait || ''}</div>
        `;
    }
    return card;
}

function selectItem(item, isArmor) {
    if (!currentItemContext) return;

    if (isArmor && currentItemContext === 'armor') {
        setElementValue('armNome', item.name);
        setElementValue('armValor', item.score);
        setElementValue('armLimiares', item.thresholds);
        setElementValue('armCaracteristicas', item.trait);
    } else if (!isArmor) {
        // Weapon
        let prefix = '';
        if (currentItemContext === 'primary') prefix = 'primaria';
        if (currentItemContext === 'secondary') prefix = 'sec'; // IDs são 'secNome', etc (exceto 'secundariaMaoEsq' criados antes, mas campos de texto sao 'sec...')

        // Cuidado com os IDs da secundaria que nao sao padrao 'secundariaX' mas sim 'secX'
        // Primaria: primariaNome, primariaTraco, primariaAlcance, primariaTipo, primariaDano, primariaCaracteristica
        // Secundaria: secNome, secTraco, secAlcance, secTipo, secDano, secCaracteristica

        const idMap = currentItemContext === 'primary' ?
            { nome: 'primariaNome', att: 'primariaTraco', range: 'primariaAlcance', type: 'primariaTipo', dmg: 'primariaDano', trait: 'primariaCaracteristica', grip: 'primariaEmpunhadura' } :
            { nome: 'secNome', att: 'secTraco', range: 'secAlcance', type: 'secTipo', dmg: 'secDano', trait: 'secCaracteristica', grip: 'secEmpunhadura' };

        setElementValue(idMap.nome, item.name);
        setElementValue(idMap.att, item.att);
        setElementValue(idMap.range, item.range);
        setElementValue(idMap.type, item.type === 'physical' ? 'Físico' : 'Mágico');
        setElementValue(idMap.dmg, item.dmg);
        setElementValue(idMap.trait, item.trait);
        setElementValue(idMap.grip, item.grip || "");
    }

    // Fechar modal
    const modalEl = document.getElementById('modalItemSelection');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
}

// ========== DATABASE DE STATUS (HELP) ==========

const subclassStats = [
    { name: "Assassino", evasion: 12, hp: 6 },
    { name: "Bardo", evasion: 10, hp: 5 },
    { name: "Lutador", evasion: 11, hp: 6 },
    { name: "Druida", evasion: 10, hp: 6 },
    { name: "Guardião", evasion: 9, hp: 7 },
    { name: "Patrulheiro", evasion: 12, hp: 6 },
    { name: "Ladino", evasion: 12, hp: 6 },
    { name: "Serafim", evasion: 9, hp: 7 },
    { name: "Feiticeiro", evasion: 10, hp: 6 },
    { name: "Bruxo", evasion: 10, hp: 6 },
    { name: "Guerreiro", evasion: 11, hp: 6 },
    { name: "Ocultista", evasion: 10, hp: 6 },
    { name: "Mago", evasion: 10, hp: 6 },
    { name: "Blood Hunter", evasion: 9, hp: 7 },
    { name: "Sumoner", evasion: 10, hp: 6 },
    { name: "Perjurador", evasion: 9, hp: 7 },
    { name: "Monge", evasion: 11, hp: 6 }
];

const classDomains = [
    { name: "Assassino", d1: "Meia-Noite", d2: "Lâmina" },
    { name: "Bardo", d1: "Códice", d2: "Graça" },
    { name: "Lutador", d1: "Valor", d2: "Falange" },
    { name: "Druida", d1: "Sabedoria", d2: "Arcano" },
    { name: "Guardião", d1: "Lâmina", d2: "Valor" },
    { name: "Patrulheiro", d1: "Sabedoria", d2: "Falange" },
    { name: "Ladino", d1: "Meia-Noite", d2: "Graça" },
    { name: "Serafim", d1: "Valor", d2: "Esplendor" },
    { name: "Feiticeiro", d1: "Arcano", d2: "Meia-Noite" },
    { name: "Bruxo", d1: "Graça", d2: "Pavor" },
    { name: "Guerreiro", d1: "Lâmina", d2: "Falange" },
    { name: "Ocultista", d1: "Pavor", d2: "Sabedoria" },
    { name: "Mago", d1: "Esplendor", d2: "Códice" },
    { name: "Blood Hunter", d1: "Sangue", d2: "Lâmina" },
    { name: "Sumoner", d1: "Sangue", d2: "Esplendor" },
    { name: "Perjurador", d1: "Pavor", d2: "Valor" },
    { name: "Monge", d1: "Arcano", d2: "Falange" }
];

/**
 * Abre os modais de ajuda da aba Geral
 */
function openHelpModal(type) {
    if (type === 'status') {
        renderSubclassStats();
        const modal = new bootstrap.Modal(document.getElementById('modalStatusGerais'));
        modal.show();
    } else if (type === 'damage') {
        const modal = new bootstrap.Modal(document.getElementById('modalDanoVida'));
        modal.show();
    } else if (type === 'exp') {
        const modal = new bootstrap.Modal(document.getElementById('modalExperiencias'));
        modal.show();
    } else if (type === 'domains') {
        renderDomainsList();
        const modal = new bootstrap.Modal(document.getElementById('modalDominiosList'));
        modal.show();
    } else if (type === 'multirace') {
        const modal = new bootstrap.Modal(document.getElementById('modalMultiRace'));
        modal.show();
    }
}

/**
 * Renderiza a tabela de status das subclasses
 */
function renderSubclassStats() {
    const tableBody = document.getElementById('subclassStatsTable');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    subclassStats.forEach(stat => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stat.name}</td>
            <td class="text-center">${stat.evasion}</td>
            <td class="text-center">${stat.hp}</td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Renderiza a tabela de domínios das classes
 */
function renderDomainsList() {
    const tableBody = document.getElementById('classDomainsTable');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    classDomains.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td class="text-center">${item.d1}</td>
            <td class="text-center">${item.d2}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Expor para o escopo global
window.openHelpModal = openHelpModal;
