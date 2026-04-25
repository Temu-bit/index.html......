// Game State
let gameState = {
    gold: 0,
    goldPerClick: 1,
    auraMultiplier: 1.0, 
    tavernTier: 1,
    upgrades: {
        betterBeer: { level: 0, baseCost: 10, costMultiplier: 1.5 },
        bigMug: { level: 0, baseCost: 100, costMultiplier: 2.0 },
        tier: { baseCost: 500, costMultiplier: 5.0 },
        tap: { level: 0, baseCost: 500, costMultiplier: 2.0 },
        rep: { level: 0, baseCost: 1000, costMultiplier: 2.2 },
        gemLuck: { level: 0, baseCost: 3000, costMultiplier: 2.5 },
        sign: { level: 0, baseCost: 5000, costMultiplier: 3.0 }
    },
    companions: {
        bard: { count: 0, baseCost: 50, costMultiplier: 1.15, goldPerSec: 1 },
        troll: { count: 0, baseCost: 250, costMultiplier: 1.25, extraClickGold: 2 },
        cat: { count: 0, baseCost: 1000, costMultiplier: 1.5, dropChance: 0.02 },
        witch: { count: 0, baseCost: 5000, costMultiplier: 1.6, goldPerSec: 5 },
        dragon: { count: 0, baseCost: 15000, costMultiplier: 1.8, jackpotMult: 2 },
        chef: { count: 0, baseCost: 8000, costMultiplier: 1.7, vipBonus: 0.20 }
    },
    decoration: {
        carpet: { owned: false, cost: 150, multiplier: 0.05 },
        fireplace: { owned: false, cost: 400, multiplier: 0.10 },
        chandelier: { owned: false, cost: 1200, multiplier: 0.15 },
        lounge: { owned: false, cost: 5000, multiplier: 0.20 },
        garden: { owned: false, cost: 15000, multiplier: 0.10 },
        lab: { owned: false, cost: 500000, multiplier: 0.25 }
    },
    activePotions: {
        haste: 0,
        luck: 0
    },
    games: {
        dice: { level: 0, baseCost: 300, costMultiplier: 2.5, jackpotChance: 0.01 },
        cardTable: { level: 0, baseCost: 2000, costMultiplier: 2.0, passiveGold: 50 },
        wheel: { level: 0, baseCost: 5000, costMultiplier: 2.2 },
        poker: { level: 0, baseCost: 12000, costMultiplier: 2.0, passiveGold: 100 },
        dart: { level: 0, baseCost: 8000, costMultiplier: 2.3 }
    },
    dartCombo: 0,
    drinks: {
        beer: { unlocked: true, emoji: '🍺', class: '' },
        mead: { unlocked: false, cost: 500, emoji: '🍯', class: 'glow-mead' },
        wine: { unlocked: false, cost: 2500, emoji: '🌿', class: 'glow-wine' },
        dragon: { unlocked: false, cost: 10000, emoji: '🌋', class: 'glow-dragon' }
    },
    activeDrink: 'beer',
    gems: 0,
    vip: {
        loungeOwned: false,
        activeGuest: null,
        activeGardenGuest: null,
        spawnRate: 0.05, 
        lastSpawn: 0
    },
    gemUpgrades: {
        multiplier: { level: 0, cost: 10, power: 0.5 },
        attractor: { level: 0, cost: 25, power: 1.0 }
    },
    prestige: { points: 0 },
    lastSaved: Date.now(),
    wheelCooldown: 0
};

let isSpinning = false;

// Event State
let currentEvent = null;
let eventTimeRemaining = 0;
let brawlBossHealth = 10;

const elements = {
    container: document.getElementById('game-container'),
    goldAmount: document.getElementById('gold-amount'),
    gpsAmount: document.getElementById('gps-amount'),
    serveBeerBtn: document.getElementById('serve-beer-btn'),
    floatingTextContainer: document.getElementById('floating-text-container'),
    tavernTierText: document.getElementById('tavern-tier-text'),
    jackpotOverlay: document.getElementById('jackpot-overlay'),
    
    tabBtns: document.querySelectorAll('.tab-btn'),
    shopTabs: document.querySelectorAll('.shop-tab'),

    upgradeBeerBtn: document.getElementById('upgrade-beer'),
    costUpgradeBeer: document.getElementById('cost-upgrade-beer'),
    upgradeMugBtn: document.getElementById('upgrade-mug'),
    costUpgradeMug: document.getElementById('cost-upgrade-mug'),
    upgradeTierBtn: document.getElementById('upgrade-tier'),
    costUpgradeTier: document.getElementById('cost-upgrade-tier'),

    compBardBtn: document.getElementById('comp-bard'),
    costCompBard: document.getElementById('cost-comp-bard'),
    ownedCompBard: document.getElementById('owned-comp-bard'),
    compTrollBtn: document.getElementById('comp-troll'),
    costCompTroll: document.getElementById('cost-comp-troll'),
    ownedCompTroll: document.getElementById('owned-comp-troll'),
    compCatBtn: document.getElementById('comp-cat'),
    costCompCat: document.getElementById('cost-comp-cat'),
    ownedCompCat: document.getElementById('owned-comp-cat'),

    decorBtns: document.querySelectorAll('.decor-purchase'),
    
    // Game Corner
    buyDiceBtn: document.getElementById('buy-dice'),
    costDice: document.getElementById('cost-game-dice'),
    ownedDice: document.getElementById('owned-game-dice'),
    buyCardTableBtn: document.getElementById('buy-card-table'),
    costCardTable: document.getElementById('cost-game-card-table'),
    ownedCardTable: document.getElementById('owned-game-card-table'),
    
    // Drinks
    cycleDrinkBtn: document.getElementById('cycle-drink-btn'),
    activeDrinkIcon: document.getElementById('active-drink-icon'),
    tapMain: document.querySelector('.tap-main'),
    buyMeadBtn: document.getElementById('buy-mead'),
    buyWineBtn: document.getElementById('buy-wine'),
    buyDragonBtn: document.getElementById('buy-dragon'),

    // VIP & Gems
    gemAmount: document.getElementById('gem-amount'),
    vipArea: document.getElementById('vip-guest-area'),
    vipEmoji: document.getElementById('vip-guest-emoji'),
    vipRequest: document.getElementById('vip-request-icon'),
    buyLoungeBtn: document.getElementById('buy-lounge'),
    buyGemMultBtn: document.getElementById('buy-gem-multiplier'),
    buyGemAttrBtn: document.getElementById('buy-gem-attractor'),
    costGemMult: document.getElementById('cost-gem-multiplier'),
    ownedGemMult: document.getElementById('owned-gem-multiplier'),
    costGemAttr: document.getElementById('cost-gem-attractor'),
    ownedGemAttr: document.getElementById('owned-gem-attractor'),

    // New companions
    compWitchBtn: document.getElementById('comp-witch'),
    costCompWitch: document.getElementById('cost-comp-witch'),
    ownedCompWitch: document.getElementById('owned-comp-witch'),
    compDragonBtn: document.getElementById('comp-dragon'),
    costCompDragon: document.getElementById('cost-comp-dragon'),
    ownedCompDragon: document.getElementById('owned-comp-dragon'),
    compChefBtn: document.getElementById('comp-chef'),
    costCompChef: document.getElementById('cost-comp-chef'),
    ownedCompChef: document.getElementById('owned-comp-chef'),

    // New games
    buyWheelBtn: document.getElementById('buy-wheel'),
    costWheel: document.getElementById('cost-game-wheel'),
    ownedWheel: document.getElementById('owned-game-wheel'),
    buyPokerBtn: document.getElementById('buy-poker'),
    costPoker: document.getElementById('cost-game-poker'),
    ownedPoker: document.getElementById('owned-game-poker'),
    buyDartBtn: document.getElementById('buy-dart'),
    costDart: document.getElementById('cost-game-dart'),
    ownedDart: document.getElementById('owned-game-dart'),
    
    // Garden
    gardenArea: document.getElementById('decor-garden'),
    gardenGuestArea: document.getElementById('garden-guest-area'),
    gardenEmoji: document.getElementById('garden-guest-emoji'),
    gardenRequest: document.getElementById('garden-request-icon'),
    
    // Lab
    labArea: document.getElementById('decor-lab'),
    potionHud: document.getElementById('potion-hud'),
    tabBtnLab: document.getElementById('tab-btn-lab'),
    buyPotionHaste: document.getElementById('buy-potion-haste'),
    buyPotionLuck: document.getElementById('buy-potion-luck'),

    // New upgrades
    upgradeTapBtn: document.getElementById('upgrade-tap'),
    upgradeRepBtn: document.getElementById('upgrade-rep'),
    upgradeLuckBtn: document.getElementById('upgrade-luck'),
    upgradeSignBtn: document.getElementById('upgrade-sign'),
    costUpgradeTap: document.getElementById('cost-upgrade-tap'),
    costUpgradeRep: document.getElementById('cost-upgrade-rep'),
    costUpgradeLuck: document.getElementById('cost-upgrade-luck'),
    costUpgradeSign: document.getElementById('cost-upgrade-sign'),

    // Modals
    helpBtn: document.getElementById('help-btn'),
    helpModal: document.getElementById('help-modal'),
    closeHelpBtn: document.getElementById('close-help'),
    confirmHelpBtn: document.getElementById('hide-help'),

    // Prestige
    prestigePoints: document.getElementById('prestige-points'),
    prestigeBonus: document.getElementById('prestige-bonus'),
    prestigeReq: document.getElementById('prestige-req'),
    btnDoPrestige: document.getElementById('btn-do-prestige'),
    openPrestigeBtn: document.getElementById('open-prestige-btn'),
    prestigeModal: document.getElementById('prestige-modal'),
    closePrestigeBtn: document.getElementById('close-prestige'),

    // Events
    eventBanner: document.getElementById('event-banner'),
    eventTitle: document.getElementById('event-title'),
    eventDesc: document.getElementById('event-desc'),
    eventTimer: document.getElementById('event-timer'),
    brawlBoss: document.getElementById('brawl-boss'),
    brawlHpBar: document.getElementById('brawl-hp-bar'),
    
    // Offline Modals
    offlineModal: document.getElementById('offline-modal'),
    offlineTime: document.getElementById('offline-time'),
    offlineGold: document.getElementById('offline-gold'),
    closeOfflineBtn: document.getElementById('close-offline'),

    // Wheel
    openWheelBtn: document.getElementById('open-wheel-btn'),
    wheelModal: document.getElementById('wheel-modal'),
    closeWheelBtn: document.getElementById('close-wheel'),
    spinWheelBtn: document.getElementById('spin-wheel-btn'),
    wheelDisplay: document.getElementById('wheel-display'),
    wheelResultText: document.getElementById('wheel-result-text'),
    wheelCooldownTimer: document.getElementById('wheel-cooldown-timer')
};

function getPassiveGPS() {
    let passiveTotal = gameState.companions.bard.count * gameState.companions.bard.goldPerSec;
    passiveTotal += gameState.companions.witch.count * gameState.companions.witch.goldPerSec;
    if (gameState.games && gameState.games.cardTable && gameState.games.cardTable.level > 0) {
        passiveTotal += gameState.games.cardTable.passiveGold * gameState.games.cardTable.level;
    }
    if (gameState.games && gameState.games.poker && gameState.games.poker.level > 0) {
        passiveTotal += gameState.games.poker.passiveGold * gameState.games.poker.level;
    }
    return passiveTotal * getEffectiveAura();
}

function calculateOfflineProgress(loadedState) {
    if (!loadedState.lastSaved) return;
    const now = Date.now();
    const diffSec = Math.floor((now - loadedState.lastSaved) / 1000);
    
    // Require at least 60 seconds of offline time to trigger
    if (diffSec > 60) {
        const gps = getPassiveGPS();
        if (gps > 0) {
            // Apply maximum offline time to prevent absurd sums if they come back a year later (e.g. 7 days max = 604800s)
            const actualSec = Math.min(diffSec, 604800);
            const reward = gps * actualSec;
            gameState.gold += reward;

            const hours = Math.floor(actualSec / 3600);
            const minutes = Math.floor((actualSec % 3600) / 60);
            let timeStr = "";
            if (hours > 0) timeStr += `${hours}h `;
            timeStr += `${minutes}m`;
            
            if(elements.offlineTime) elements.offlineTime.innerText = timeStr;
            if(elements.offlineGold) elements.offlineGold.innerText = `+${reward.toLocaleString('de-DE', {maximumFractionDigits:0})}`;
            if(elements.offlineModal) elements.offlineModal.classList.remove('hidden');
        }
    }
}

function spinWheel() {
    if (isSpinning || Date.now() < gameState.wheelCooldown) return;
    
    isSpinning = true;
    elements.spinWheelBtn.disabled = true;
    elements.wheelResultText.innerText = "";
    
    const options = [
        { emoji: '💰', chance: 0.40, action: () => { const r = getPassiveGPS() * 300; gameState.gold += r; return `JACKPOT! +${Math.floor(r).toLocaleString('de-DE')} Gold!`; } },
        { emoji: '💎', chance: 0.10, action: () => { gameState.gems += 1; return `GLÜCKSGRIFF! +1 Edelstein!`; } },
        { emoji: '🧪', chance: 0.20, action: () => { gameState.activePotions.haste += 60; return `TRANK! +60s Haste!`; } },
        { emoji: '💀', chance: 0.30, action: () => { return `NIETE! Versuchs später nochmal.`; } }
    ];

    let spinTime = 0;
    const spinDur = 2000;
    const interval = setInterval(() => {
        elements.wheelDisplay.innerText = options[Math.floor(Math.random() * options.length)].emoji;
        spinTime += 50;
        if (spinTime >= spinDur) {
            clearInterval(interval);
            
            // Pick result based on chances
            const rand = Math.random();
            let cumulative = 0;
            let selected = options[0];
            for (let opt of options) {
                cumulative += opt.chance;
                if (rand <= cumulative) {
                    selected = opt;
                    break;
                }
            }
            
            elements.wheelDisplay.innerText = selected.emoji;
            const resText = selected.action();
            elements.wheelResultText.innerText = resText;
            
            gameState.wheelCooldown = Date.now() + (5 * 60 * 1000); // 5 minutes
            saveGame();
            updateUI();
            isSpinning = false;
        }
    }, 50);
}

function init() {
    loadGame();
    setupEventListeners();
    setInterval(gameLoop, 1000);
    setInterval(saveGame, 10000);
    window.addEventListener('beforeunload', saveGame);
    updateUI();
}

function getEffectiveAura() {
    let aura = gameState.auraMultiplier;
    if (gameState.activeDrink === 'wine') aura *= 1.20;
    aura += (gameState.gemUpgrades.multiplier.level * gameState.gemUpgrades.multiplier.power);
    if (gameState.prestige && gameState.prestige.points > 0) {
        aura += (gameState.prestige.points * 1.5);
    }
    return aura;
}

function triggerRandomEvent() {
    if (currentEvent) return;
    const rand = Math.random();
    if (rand < 0.5) {
        startDwarfEvent();
    } else {
        startBrawlEvent();
    }
}

function startDwarfEvent() {
    currentEvent = 'dwarves';
    eventTimeRemaining = 30;
    if(elements.eventTitle) elements.eventTitle.innerText = '🍺 Die Zwerge sind da!';
    if(elements.eventDesc) elements.eventDesc.innerText = 'Doppeltes Klick-Gold für kurze Zeit!';
    if(elements.eventBanner) elements.eventBanner.classList.remove('hidden');
    if(elements.brawlBoss) elements.brawlBoss.classList.add('hidden');
}

function startBrawlEvent() {
    currentEvent = 'brawl';
    eventTimeRemaining = -1; // No timer timeout, wait for clicks
    brawlBossHealth = 10;
    if(elements.eventTitle) elements.eventTitle.innerText = '🔥 Schlägerei!';
    if(elements.eventDesc) elements.eventDesc.innerText = 'Dein Einkommen ist blockiert! Verjage ihn!';
    if(elements.eventTimer) elements.eventTimer.innerText = 'Klick den Ork!';
    if(elements.brawlHpBar) elements.brawlHpBar.style.width = '100%';
    if(elements.eventBanner) elements.eventBanner.classList.remove('hidden');
    if(elements.brawlBoss) elements.brawlBoss.classList.remove('hidden');
}

function clearEvent() {
    currentEvent = null;
    if(elements.eventBanner) elements.eventBanner.classList.add('hidden');
    if(elements.brawlBoss) elements.brawlBoss.classList.add('hidden');
}

function doPrestige() {
    let points = gameState.prestige ? gameState.prestige.points : 0;
    let reqCost = 1000000 * Math.pow(10, points);
    if (gameState.gold >= reqCost) {
        if (!confirm("Willst du wirklich deine Taverne niederbrennen? Du verlierst fast alles (außer Edelsteine und deren Upgrades)!")) return;
        let savedGems = gameState.gems;
        let savedGemUpgrades = JSON.parse(JSON.stringify(gameState.gemUpgrades));
        localStorage.removeItem(SAVE_KEY);
        const newState = {
            prestige: { points: points + 1 },
            gems: savedGems,
            gemUpgrades: savedGemUpgrades
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(newState));
        window.location.reload();
    }
}

function setupEventListeners() {
    if(elements.btnDoPrestige) elements.btnDoPrestige.addEventListener('click', doPrestige);
    elements.serveBeerBtn.addEventListener('click', handleMainClick);
    elements.upgradeBeerBtn.addEventListener('click', () => buyUpgrade('betterBeer'));
    elements.upgradeMugBtn.addEventListener('click', () => buyUpgrade('bigMug'));
    elements.upgradeTierBtn.addEventListener('click', upgradeTavernTier);
    elements.compBardBtn.addEventListener('click', () => buyCompanion('bard'));
    elements.compTrollBtn.addEventListener('click', () => buyCompanion('troll'));
    elements.compCatBtn.addEventListener('click', () => buyCompanion('cat'));
    elements.compWitchBtn.addEventListener('click', () => buyCompanion('witch'));
    elements.compDragonBtn.addEventListener('click', () => buyCompanion('dragon'));
    elements.compChefBtn.addEventListener('click', () => buyCompanion('chef'));
    
    elements.buyDiceBtn.addEventListener('click', buyDice);
    elements.buyCardTableBtn.addEventListener('click', buyCardTable);
    elements.buyWheelBtn.addEventListener('click', buyWheel);
    elements.buyPokerBtn.addEventListener('click', buyPoker);
    elements.buyDartBtn.addEventListener('click', buyDart);

    elements.buyMeadBtn.addEventListener('click', () => buyDrink('mead'));
    elements.buyWineBtn.addEventListener('click', () => buyDrink('wine'));
    elements.buyDragonBtn.addEventListener('click', () => buyDrink('dragon'));

    elements.cycleDrinkBtn.addEventListener('click', cycleDrink);
    
    elements.vipArea.addEventListener('click', serveVIP);
    elements.gardenGuestArea.addEventListener('click', serveGardenGuest);

    elements.buyGemMultBtn.addEventListener('click', () => buyGemUpgrade('multiplier'));
    elements.buyGemAttrBtn.addEventListener('click', () => buyGemUpgrade('attractor'));

    elements.buyPotionHaste.addEventListener('click', () => buyPotion('haste', 50000));
    elements.buyPotionLuck.addEventListener('click', () => buyPotion('luck', 150000));

    elements.upgradeTapBtn.addEventListener('click', () => buyUpgrade('tap'));
    elements.upgradeRepBtn.addEventListener('click', () => buyUpgrade('rep'));
    elements.upgradeLuckBtn.addEventListener('click', () => buyUpgrade('gemLuck'));
    elements.upgradeSignBtn.addEventListener('click', () => buyUpgrade('sign'));

    elements.helpBtn.addEventListener('click', () => elements.helpModal.classList.remove('hidden'));
    [elements.closeHelpBtn, elements.confirmHelpBtn].forEach(btn => {
        btn.addEventListener('click', () => elements.helpModal.classList.add('hidden'));
    });

    if(elements.openPrestigeBtn) elements.openPrestigeBtn.addEventListener('click', () => elements.prestigeModal.classList.remove('hidden'));
    if(elements.closePrestigeBtn) elements.closePrestigeBtn.addEventListener('click', () => elements.prestigeModal.classList.add('hidden'));

    if(elements.brawlBoss) {
        elements.brawlBoss.addEventListener('click', (e) => {
            if (currentEvent !== 'brawl') return;
            brawlBossHealth--;
            elements.brawlBoss.classList.add('hit');
            setTimeout(() => elements.brawlBoss.classList.remove('hit'), 100);
            
            elements.brawlHpBar.style.width = `${(brawlBossHealth / 10) * 100}%`;
            createFloatingText(`💥`, e.clientX, e.clientY);
            
            if (brawlBossHealth <= 0) {
                let reward = gameState.goldPerClick * 50 * getEffectiveAura();
                gameState.gold += reward;
                createFloatingText(`💰 +${Math.floor(reward)} Kopfgeld!`, window.innerWidth/2, window.innerHeight/2);
                clearEvent();
                updateUI();
            }
        });
    }

    if(elements.closeOfflineBtn) elements.closeOfflineBtn.addEventListener('click', () => elements.offlineModal.classList.add('hidden'));

    if(elements.openWheelBtn) elements.openWheelBtn.addEventListener('click', () => elements.wheelModal.classList.remove('hidden'));
    if(elements.closeWheelBtn) elements.closeWheelBtn.addEventListener('click', () => elements.wheelModal.classList.add('hidden'));
    if(elements.spinWheelBtn) elements.spinWheelBtn.addEventListener('click', spinWheel);

    elements.decorBtns.forEach(btn => {
        btn.addEventListener('click', () => buyDecoration(btn.dataset.decor));
    });

    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            elements.tabBtns.forEach(b => b.classList.remove('active'));
            elements.shopTabs.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });
}

function handleMainClick(e) {
    if (currentEvent === 'brawl') {
        const rect = document.getElementById('tavern-area').getBoundingClientRect();
        const x = e ? (e.clientX - rect.left - 20) : (rect.width / 2);
        const y = e ? (e.clientY - rect.top - 20) : (rect.height / 2);
        createFloatingText(`⛔ Blockiert!`, x, y);
        return;
    }

    let amount = gameState.goldPerClick;
    amount += (gameState.companions.troll.count * gameState.companions.troll.extraClickGold);

    if (currentEvent === 'dwarves') amount *= 2;
    
    // Drink Buffs: Mead
    if (gameState.activeDrink === 'mead') amount *= 1.25;
    
    // Potion Buffs: Haste
    if (gameState.activePotions.haste > 0) amount *= 2.0;

    if (Math.random() < (gameState.upgrades.bigMug.level * 0.10)) {
        amount *= 2;
    }

    if (gameState.games.dart.level > 0) {
        gameState.dartCombo = (gameState.dartCombo || 0) + 1;
        if (gameState.dartCombo >= 5) {
            const dartBonus = gameState.goldPerClick * gameState.games.dart.level * 5;
            gameState.gold += dartBonus;
            createFloatingText(`🎯 COMBO! +${Math.floor(dartBonus)}`, window.innerWidth/2, window.innerHeight/2 - 80);
            gameState.dartCombo = 0;
        }
    }

    // Jackpot Logic (Glücks-Würfel)
    let jackpotChance = gameState.games.dice.level * 0.01;
    // Drink Buffs: Dragon Ale
    if (gameState.activeDrink === 'dragon') jackpotChance *= 2;
    // Potion Buffs: Luck
    if (gameState.activePotions.luck > 0) jackpotChance *= 5;

    if (gameState.games.dice.level > 0 && Math.random() < jackpotChance) {
        const jackpotMult = 20 * (1 + gameState.companions.dragon.count * (gameState.companions.dragon.jackpotMult - 1));
        amount *= jackpotMult;
        showJackpot();
    }

    // Aura Calculation
    let effectiveAura = getEffectiveAura();

    amount *= effectiveAura;

    // Rare Gem Drop
    if (Math.random() < 0.001) {
        gameState.gems += 1;
        createFloatingText(`💎 +1 EDELSTEIN!`, window.innerWidth/2, window.innerHeight/3);
    }

    const catChance = gameState.companions.cat.count * gameState.companions.cat.dropChance;
    if (Math.random() < catChance) {
        const catDrop = Math.floor(amount * 10);
        gameState.gold += catDrop;
        createFloatingText(`🐈 +${catDrop} MAGIE!`, window.innerWidth/4, window.innerHeight/3);
    }

    gameState.gold += amount;
    const rect = document.getElementById('tavern-area').getBoundingClientRect();
    const x = e ? (e.clientX - rect.left - 20) : (rect.width / 2);
    const y = e ? (e.clientY - rect.top - 20) : (rect.height / 2);
    createFloatingText(`+${amount.toFixed(1)}`, x, y);
    updateUI();
}

function showJackpot() {
    elements.jackpotOverlay.classList.remove('hidden');
    // Force reflow
    elements.jackpotOverlay.style.animation = 'none';
    elements.jackpotOverlay.offsetHeight; 
    elements.jackpotOverlay.style.animation = null;
    
    setTimeout(() => {
        elements.jackpotOverlay.classList.add('hidden');
    }, 1500);
}

function gameLoop() {
    let passiveTotal = gameState.companions.bard.count * gameState.companions.bard.goldPerSec;
    passiveTotal += gameState.companions.witch.count * gameState.companions.witch.goldPerSec;
    // Add Game Bonuses
    if (gameState.games.cardTable.level > 0) {
        passiveTotal += gameState.games.cardTable.passiveGold * gameState.games.cardTable.level;
    }
    if (gameState.games.poker.level > 0) {
        passiveTotal += gameState.games.poker.passiveGold * gameState.games.poker.level;
    }
    
    let effectiveAura = getEffectiveAura();

    passiveTotal *= effectiveAura;
    
    if (passiveTotal > 0) {
        gameState.gold += passiveTotal;
    }

    // Potion Timers
    Object.keys(gameState.activePotions).forEach(key => {
        if (gameState.activePotions[key] > 0) {
            gameState.activePotions[key]--;
        }
    });

    updateUI();

    // VIP Spawn Logic
    if (gameState.decoration.lounge.owned && !gameState.vip.activeGuest) {
        const baseChance = 0.03; // 3% per second
        const multi = 1 + (gameState.gemUpgrades.attractor.level * gameState.gemUpgrades.attractor.power);
        if (Math.random() < (baseChance * multi)) {
            spawnVIP();
        }
    }

    // Garden Spawn Logic
    if (gameState.decoration.garden.owned && !gameState.vip.activeGardenGuest) {
        if (Math.random() < 0.02) { // 2% per second
            spawnGardenGuest();
        }
    }

    // Random Event Engine (1% chance per second if no event)
    if (!currentEvent && Math.random() < 0.01) {
        triggerRandomEvent();
    }

    if (currentEvent === 'dwarves') {
        eventTimeRemaining--;
        if(elements.eventTimer) elements.eventTimer.innerText = `${eventTimeRemaining}s`;
        if (eventTimeRemaining <= 0) {
            clearEvent();
        }
    }

    // Wheel Cooldown Timer
    if (elements.wheelCooldownTimer) {
        const now = Date.now();
        if (gameState.wheelCooldown && now < gameState.wheelCooldown) {
            const diff = Math.ceil((gameState.wheelCooldown - now) / 1000);
            const m = Math.floor(diff / 60);
            const s = diff % 60;
            elements.wheelCooldownTimer.innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
            elements.wheelCooldownTimer.style.color = '#ff9999';
            if (elements.spinWheelBtn) elements.spinWheelBtn.disabled = true;
        } else {
            elements.wheelCooldownTimer.innerText = `Bereit!`;
            elements.wheelCooldownTimer.style.color = '#4caf50';
            if (elements.spinWheelBtn && !isSpinning) elements.spinWheelBtn.disabled = false;
        }
    }
}

function getCost(base, level, multiplier) {
    return Math.floor(base * Math.pow(multiplier, level));
}

function buyUpgrade(type) {
    const up = gameState.upgrades[type];
    const cost = getCost(up.baseCost, up.level, up.costMultiplier);
    if (gameState.gold >= cost) {
        gameState.gold -= cost;
        up.level++;
        if (type === 'betterBeer') gameState.goldPerClick++;
        if (type === 'tap') gameState.goldPerClick += 3;
        if (type === 'rep') gameState.auraMultiplier += 0.10;
        if (type === 'gemLuck') { /* gem chance tracked via upgrade level */ }
        if (type === 'sign') gameState.vip.spawnRate = Math.min(0.5, gameState.vip.spawnRate + 0.05);
        updateUI();
        saveGame();
    }
}

function buyCompanion(type) {
    const comp = gameState.companions[type];
    const cost = getCost(comp.baseCost, comp.count, comp.costMultiplier);
    if (gameState.gold >= cost) {
        gameState.gold -= cost;
        comp.count++;
        updateUI();
        saveGame();
    }
}

function upgradeTavernTier() {
    const cost = getCost(gameState.upgrades.tier.baseCost, gameState.tavernTier - 1, gameState.upgrades.tier.costMultiplier);
    if (gameState.gold >= cost && gameState.tavernTier < 10) {
        gameState.gold -= cost;
        gameState.tavernTier++;
        updateUI();
        saveGame();
    }
}

function buyDecoration(decorKey) {
    const dec = gameState.decoration[decorKey];
    if (gameState.gold >= dec.cost && !dec.owned) {
        gameState.gold -= dec.cost;
        dec.owned = true;
        gameState.auraMultiplier += dec.multiplier;
        updateUI();
        saveGame();
    }
}

function buyDice() {
    const cost = getCost(gameState.games.dice.baseCost, gameState.games.dice.level, gameState.games.dice.costMultiplier);
    if (gameState.gold >= cost) {
        gameState.gold -= cost;
        gameState.games.dice.level++;
        updateUI();
        saveGame();
    }
}

function buyCardTable() {
    const cost = getCost(gameState.games.cardTable.baseCost, gameState.games.cardTable.level, gameState.games.cardTable.costMultiplier);
    if (gameState.gold >= cost) {
        gameState.gold -= cost;
        gameState.games.cardTable.level++;
        updateUI();
        saveGame();
    }
}

function buyWheel() {
    const cost = getCost(gameState.games.wheel.baseCost, gameState.games.wheel.level, gameState.games.wheel.costMultiplier);
    if (gameState.gold >= cost) {
        gameState.gold -= cost;
        gameState.games.wheel.level++;
        updateUI();
        saveGame();
    }
}

function buyPoker() {
    const cost = getCost(gameState.games.poker.baseCost, gameState.games.poker.level, gameState.games.poker.costMultiplier);
    if (gameState.gold >= cost) {
        gameState.gold -= cost;
        gameState.games.poker.level++;
        updateUI();
        saveGame();
    }
}

function buyDart() {
    const cost = getCost(gameState.games.dart.baseCost, gameState.games.dart.level, gameState.games.dart.costMultiplier);
    if (gameState.gold >= cost) {
        gameState.gold -= cost;
        gameState.games.dart.level++;
        updateUI();
        saveGame();
    }
}

function buyDrink(key) {
    const drink = gameState.drinks[key];
    if (gameState.gold >= drink.cost && !drink.unlocked) {
        gameState.gold -= drink.cost;
        drink.unlocked = true;
        updateUI();
        saveGame();
    }
}

function selectDrink(key) {
    if (gameState.drinks[key].unlocked) {
        gameState.activeDrink = key;
        updateUI();
        saveGame();
    }
}

function cycleDrink() {
    const keys = Object.keys(gameState.drinks);
    let currentIndex = keys.indexOf(gameState.activeDrink);
    
    // Find next unlocked drink
    for (let i = 1; i < keys.length; i++) {
        let nextIndex = (currentIndex + i) % keys.length;
        let nextKey = keys[nextIndex];
        if (gameState.drinks[nextKey].unlocked) {
            gameState.activeDrink = nextKey;
            break;
        }
    }
    updateUI();
    saveGame();
}

function spawnVIP() {
    const types = [
        { emoji: '👑', request: 'mead', rewardMult: 100 },
        { emoji: '🧙‍♂️', request: 'wine', rewardMult: 250 },
        { emoji: '👸', request: 'dragon', rewardMult: 500 }
    ];
    const guest = types[Math.floor(Math.random() * types.length)];
    gameState.vip.activeGuest = guest;
    
    updateUI();
    
    // Auto-leave after 15 seconds
    setTimeout(() => {
        if (gameState.vip.activeGuest === guest) {
            gameState.vip.activeGuest = null;
            updateUI();
        }
    }, 15000);
}

function serveVIP() {
    const guest = gameState.vip.activeGuest;
    if (!guest) return;

    if (gameState.activeDrink === guest.request) {
        const reward = gameState.goldPerClick * guest.rewardMult;
        // Chef bonus per stack
        const chefBonus = 1 + (gameState.companions.chef.count * gameState.companions.chef.vipBonus);
        const total = reward * chefBonus;
        gameState.gold += total;
        
        // Gem chance: base 50% + 1% per gemLuck level
        const gemChance = 0.50 + (gameState.upgrades.gemLuck.level * 0.01);
        if (Math.random() < gemChance) {
            gameState.gems += 1;
            createFloatingText(`💎 +1 EDELSTEIN!`, window.innerWidth/2, window.innerHeight/2);
        }
        
        createFloatingText(`✨ +${reward.toFixed(0)} KÖNIGLICH!`, window.innerWidth/2, window.innerHeight/2 + 50);
        gameState.vip.activeGuest = null;
        updateUI();
        saveGame();
    } else {
        createFloatingText(`🚫 Falschen Drink!`, window.innerWidth/2, window.innerHeight/2);
    }
}

function buyGemUpgrade(type) {
    const up = gameState.gemUpgrades[type];
    if (gameState.gems >= up.cost) {
        gameState.gems -= up.cost;
        up.level++;
        up.cost = Math.floor(up.cost * 2.5);
        updateUI();
        saveGame();
    }
}

function spawnGardenGuest() {
    const types = [
        { emoji: '🧝‍♀️', rewardMult: 1000 },
        { emoji: '🧝‍♂️', rewardMult: 1000 },
        { emoji: '🧚', rewardMult: 2000 }
    ];
    const guest = types[Math.floor(Math.random() * types.length)];
    gameState.vip.activeGardenGuest = guest;
    updateUI();
    
    setTimeout(() => {
        if (gameState.vip.activeGardenGuest === guest) {
            gameState.vip.activeGardenGuest = null;
            updateUI();
        }
    }, 12000);
}

function serveGardenGuest() {
    const guest = gameState.vip.activeGardenGuest;
    if (!guest) return;

    if (gameState.activeDrink === 'wine') {
        const reward = gameState.goldPerClick * guest.rewardMult * 5;
        gameState.gold += reward;
        createFloatingText(`🌸 +${reward.toFixed(0)} ELFEN-SEGEN!`, window.innerWidth/4, window.innerHeight/2);
        gameState.vip.activeGardenGuest = null;
        updateUI();
        saveGame();
    } else {
        createFloatingText(`🌿 Braucht Wein!`, window.innerWidth/4, window.innerHeight/2);
    }
}

function buyPotion(type, cost) {
    if (gameState.gold >= cost) {
        gameState.gold -= cost;
        gameState.activePotions[type] += 60; // Add 60s
        updateUI();
        saveGame();
        createFloatingText(`🧪 TRANK AKTIVIERT!`, window.innerWidth/2, window.innerHeight/2);
    }
}

function updateUI() {
    elements.goldAmount.innerText = Math.floor(gameState.gold);
    elements.gemAmount.innerText = gameState.gems;

    let gps = (gameState.companions.bard.count * gameState.companions.bard.goldPerSec);
    gps += (gameState.companions.witch.count * gameState.companions.witch.goldPerSec);
    if (gameState.games.cardTable.level > 0) gps += gameState.games.cardTable.passiveGold * gameState.games.cardTable.level;
    if (gameState.games.poker.level > 0) gps += gameState.games.poker.passiveGold * gameState.games.poker.level;
    
    // Aura Calculation
    let effectiveAura = getEffectiveAura();
    
    gps *= effectiveAura;
    
    elements.gpsAmount.innerText = gps.toFixed(1);

    elements.container.className = `tier-${Math.min(10, gameState.tavernTier)}`;
    const tierNames = ["Dreckloch", "Schankstube", "Prunkhalle", "Abenteurer-Treff", "Heldenschmiede", "Königswirtshaus", "Mythisches Gasthaus", "Götter-Halle", "Astral-Schänke", "Weltenende"];
    elements.tavernTierText.innerText = `${tierNames[Math.min(9, gameState.tavernTier-1)]} (Tier ${gameState.tavernTier})`;

    updateBtn('betterBeer', elements.upgradeBeerBtn, elements.costUpgradeBeer);
    updateBtn('bigMug', elements.upgradeMugBtn, elements.costUpgradeMug, 10);
    updateBtn('tap', elements.upgradeTapBtn, elements.costUpgradeTap);
    updateBtn('rep', elements.upgradeRepBtn, elements.costUpgradeRep);
    updateBtn('gemLuck', elements.upgradeLuckBtn, elements.costUpgradeLuck);
    updateBtn('sign', elements.upgradeSignBtn, elements.costUpgradeSign);
    
    const tierCost = getCost(gameState.upgrades.tier.baseCost, gameState.tavernTier - 1, gameState.upgrades.tier.costMultiplier);
    const isMaxTier = gameState.tavernTier >= 10;
    elements.costUpgradeTier.innerText = isMaxTier ? "Max." : tierCost;
    elements.upgradeTierBtn.disabled = gameState.gold < tierCost || isMaxTier;
    if (isMaxTier) elements.upgradeTierBtn.querySelector('.item-cost').innerText = "Max.";

    updateCompBtn('bard', elements.compBardBtn, elements.costCompBard, elements.ownedCompBard);
    updateCompBtn('troll', elements.compTrollBtn, elements.costCompTroll, elements.ownedCompTroll);
    updateCompBtn('cat', elements.compCatBtn, elements.costCompCat, elements.ownedCompCat);
    updateCompBtn('witch', elements.compWitchBtn, elements.costCompWitch, elements.ownedCompWitch);
    updateCompBtn('dragon', elements.compDragonBtn, elements.costCompDragon, elements.ownedCompDragon);
    updateCompBtn('chef', elements.compChefBtn, elements.costCompChef, elements.ownedCompChef);

    // Games
    const diceCost = getCost(gameState.games.dice.baseCost, gameState.games.dice.level, gameState.games.dice.costMultiplier);
    elements.costDice.innerText = diceCost;
    elements.ownedDice.innerText = gameState.games.dice.level;
    elements.buyDiceBtn.disabled = gameState.gold < diceCost;

    const cardCost = getCost(gameState.games.cardTable.baseCost, gameState.games.cardTable.level, gameState.games.cardTable.costMultiplier);
    elements.costCardTable.innerText = cardCost;
    elements.ownedCardTable.innerText = gameState.games.cardTable.level;
    elements.buyCardTableBtn.disabled = gameState.gold < cardCost;

    const wheelCost = getCost(gameState.games.wheel.baseCost, gameState.games.wheel.level, gameState.games.wheel.costMultiplier);
    elements.costWheel.innerText = wheelCost;
    elements.ownedWheel.innerText = gameState.games.wheel.level;
    elements.buyWheelBtn.disabled = gameState.gold < wheelCost;
    
    if (gameState.games.wheel.level > 0) {
        elements.openWheelBtn.classList.remove('hidden');
    } else {
        elements.openWheelBtn.classList.add('hidden');
    }

    const pokerCost = getCost(gameState.games.poker.baseCost, gameState.games.poker.level, gameState.games.poker.costMultiplier);
    elements.costPoker.innerText = pokerCost;
    elements.ownedPoker.innerText = gameState.games.poker.level;
    elements.buyPokerBtn.disabled = gameState.gold < pokerCost;

    const dartCost = getCost(gameState.games.dart.baseCost, gameState.games.dart.level, gameState.games.dart.costMultiplier);
    elements.costDart.innerText = dartCost;
    elements.ownedDart.innerText = gameState.games.dart.level;
    elements.buyDartBtn.disabled = gameState.gold < dartCost;
    Object.keys(gameState.decoration).forEach(key => {
        const dec = gameState.decoration[key];
        const btn = document.getElementById(`buy-${key}`);
        const visual = document.getElementById(`decor-${key}`);
        if (btn) btn.disabled = gameState.gold < dec.cost || dec.owned;
        if (dec.owned && visual) visual.classList.remove('hidden');
        if (dec.owned && btn) btn.querySelector('.item-cost').innerText = "Max.";
    });

    const diceVisual = document.getElementById('decor-dice');
    if (gameState.games.dice.level > 0 && diceVisual) diceVisual.classList.remove('hidden');

    const cardTableVisual = document.getElementById('decor-card-table');
    if (gameState.games.cardTable.level > 0 && cardTableVisual) {
        cardTableVisual.classList.remove('hidden');
    }


    // Drinks
    const unlockedAny = Object.values(gameState.drinks).some(d => d.unlocked && d.emoji !== '🍺');
    if (unlockedAny) elements.cycleDrinkBtn.classList.remove('hidden');

    Object.keys(gameState.drinks).forEach(key => {
        const d = gameState.drinks[key];
        const buyBtn = document.getElementById(`buy-${key}`);
        
        if (buyBtn && key !== 'beer') {
            buyBtn.disabled = gameState.gold < d.cost || d.unlocked;
            if (d.unlocked) buyBtn.querySelector('.item-cost').innerText = "Frei";
        }
    });

    // Update Tap & Cycle Button Visual
    const active = gameState.drinks[gameState.activeDrink];
    elements.activeDrinkIcon.innerText = active.emoji;
    elements.tapMain.innerText = active.emoji;
    elements.tapMain.className = 'tap-main ' + active.class;

    // VIP Visuals
    if (gameState.vip.activeGuest) {
        elements.vipArea.classList.remove('hidden');
        elements.vipEmoji.innerText = gameState.vip.activeGuest.emoji;
        const reqEmoji = gameState.drinks[gameState.vip.activeGuest.request].emoji;
        elements.vipRequest.innerText = reqEmoji;
    } else {
        elements.vipArea.classList.add('hidden');
    }

    // Garden Visuals
    if (elements.gardenGuestArea) {
        if (gameState.vip.activeGardenGuest) {
            elements.gardenGuestArea.classList.remove('hidden');
            if (elements.gardenEmoji) elements.gardenEmoji.innerText = gameState.vip.activeGardenGuest.emoji;
        } else {
            elements.gardenGuestArea.classList.add('hidden');
        }
    }

    // Lab & Potions
    if (gameState.decoration.lab.owned) {
        elements.tabBtnLab.classList.remove('hidden');
        elements.labArea.classList.remove('hidden');
    }

    elements.buyPotionHaste.disabled = gameState.gold < 50000;
    elements.buyPotionLuck.disabled = gameState.gold < 150000;

    // HUD Update
    elements.potionHud.innerHTML = '';
    if (gameState.activePotions.haste > 0) {
        elements.potionHud.innerHTML += `<div class="potion-tag">🧪 Hektik-Rausch <span class="potion-time">${gameState.activePotions.haste}s</span></div>`;
    }
    if (gameState.activePotions.luck > 0) {
        elements.potionHud.innerHTML += `<div class="potion-tag">🍀 Glücks-Elixier <span class="potion-time">${gameState.activePotions.luck}s</span></div>`;
    }

    // Gem Upgrades
    updateGemBtn('multiplier', elements.buyGemMultBtn, elements.costGemMult, elements.ownedGemMult);
    updateGemBtn('attractor', elements.buyGemAttrBtn, elements.costGemAttr, elements.ownedGemAttr);

    // Prestige UI
    if (elements.prestigePoints) {
        let currentPoints = gameState.prestige ? gameState.prestige.points : 0;
        elements.prestigePoints.innerText = currentPoints;
        elements.prestigeBonus.innerText = (currentPoints * 150);
        let reqCost = 1000000 * Math.pow(10, currentPoints);
        elements.prestigeReq.innerText = reqCost.toLocaleString('de-DE');
        elements.btnDoPrestige.disabled = gameState.gold < reqCost;
    }
}

function updateGemBtn(type, btn, costEl, ownedEl) {
    const up = gameState.gemUpgrades[type];
    costEl.innerText = up.cost;
    ownedEl.innerText = up.level;
    btn.disabled = gameState.gems < up.cost;
}

function updateBtn(type, btn, costEl, max = null) {
    const up = gameState.upgrades[type];
    const cost = getCost(up.baseCost, up.level, up.costMultiplier);
    costEl.innerText = cost;
    btn.disabled = gameState.gold < cost || (max && up.level >= max);
}

function updateCompBtn(type, btn, costEl, ownedEl) {
    const comp = gameState.companions[type];
    ownedEl.innerText = comp.count;
    const cost = getCost(comp.baseCost, comp.count, comp.costMultiplier);
    costEl.innerText = cost;
    btn.disabled = gameState.gold < cost;
}

function createFloatingText(text, x, y) {
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.innerText = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    elements.floatingTextContainer.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

const SAVE_KEY = 'fantasy-tavern-v8'; 
function saveGame() { 
    gameState.lastSaved = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState)); 
}

function loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        const p = JSON.parse(saved);
        gameState = { ...gameState, ...p };
        if (p.upgrades) gameState.upgrades = { ...gameState.upgrades, ...p.upgrades };
        if (p.companions) gameState.companions = { ...gameState.companions, ...p.companions };
        if (p.decoration) gameState.decoration = { ...gameState.decoration, ...p.decoration };
        if (p.games) gameState.games = { ...gameState.games, ...p.games };
        if (p.gemUpgrades) gameState.gemUpgrades = { ...gameState.gemUpgrades, ...p.gemUpgrades };
        if (p.vip) gameState.vip = { ...gameState.vip, ...p.vip };
        if (p.prestige) gameState.prestige = { ...gameState.prestige, ...p.prestige };
        if (p.wheelCooldown !== undefined) gameState.wheelCooldown = p.wheelCooldown;
        
        calculateOfflineProgress(p);
    }
}
init();
