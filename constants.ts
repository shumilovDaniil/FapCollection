import { Card, Rarity, FetishTag, Chest, PlayerCard, PlayerCurrencies } from './types';

export const RARITY_ORDER: Rarity[] = [Rarity.Common, Rarity.Rare, Rarity.Epic, Rarity.Legendary, Rarity.Masturbatory];

export const RARITY_STYLES: { [key in Rarity]: { bg: string; border: string; text: string; shadow: string; ring: string } } = {
  [Rarity.Common]: { bg: 'bg-gray-700/80', border: 'border-slate-400', text: 'text-slate-100', shadow: 'shadow-slate-500/10', ring: 'ring-slate-400' },
  [Rarity.Rare]: { bg: 'bg-sky-800/80', border: 'border-teal-400', text: 'text-teal-100', shadow: 'shadow-teal-500/20', ring: 'ring-teal-400' },
  [Rarity.Epic]: { bg: 'bg-purple-800/80', border: 'border-purple-400', text: 'text-purple-100', shadow: 'shadow-purple-500/30', ring: 'ring-purple-400' },
  [Rarity.Legendary]: { bg: 'bg-amber-700/80', border: 'border-orange-400', text: 'text-orange-100', shadow: 'shadow-orange-500/40', ring: 'ring-orange-400' },
  [Rarity.Masturbatory]: { bg: 'bg-rose-800/80', border: 'border-rose-400', text: 'text-rose-100', shadow: 'shadow-rose-500/50', ring: 'ring-rose-400' },
};

// These are now only used to seed the database on the first run.
export const INITIAL_CARDS: Card[] = [
  // Commons
  { id: 1, name: "Новичок в Латексе", rarity: Rarity.Common, imageUrl: "https://picsum.photos/seed/1/400/600", effect: "+1 к предвкушению", tags: [FetishTag.BDSM], stats: { strength: 45, agility: 60, charisma: 80, stamina: 55, rage: 20 } },
  { id: 2, name: "Лесная Нимфа", rarity: Rarity.Common, imageUrl: "https://picsum.photos/seed/2/400/600", effect: "Восстанавливает 1 выносливость", tags: [FetishTag.Fantasy, FetishTag.Elven], stats: { strength: 30, agility: 85, charisma: 75, stamina: 65, rage: 10 } },
  { id: 3, name: "Скромная горничная", rarity: Rarity.Common, imageUrl: "https://picsum.photos/seed/3/400/600", effect: "Увеличивает покорность на 5%", tags: [FetishTag.AltGirl], stats: { strength: 40, agility: 50, charisma: 90, stamina: 60, rage: 5 } },
  { id: 4, name: "Пушистый Хвостик", rarity: Rarity.Common, imageUrl: "https://picsum.photos/seed/4/400/600", effect: "Мурлычет при использовании", tags: [FetishTag.Furry], stats: { strength: 35, agility: 70, charisma: 85, stamina: 50, rage: 15 } },
  { id: 5, name: "Соседка MILF", rarity: Rarity.Common, imageUrl: "https://picsum.photos/seed/5/400/600", effect: "Предлагает испечь печенье", tags: [FetishTag.MILF], stats: { strength: 50, agility: 40, charisma: 95, stamina: 70, rage: 5 } },

  // Rares
  { id: 6, name: "Готичная Стримерша", rarity: Rarity.Rare, imageUrl: "https://picsum.photos/seed/6/400/600", effect: "Увеличивает шанс выбить донат-сундук на 10%", tags: [FetishTag.AltGirl, FetishTag.Gothic], stats: { strength: 120, agility: 180, charisma: 250, stamina: 150, rage: 90 } },
  { id: 7, name: "Щупальце-искуситель", rarity: Rarity.Rare, imageUrl: "https://picsum.photos/seed/7/400/600", effect: "Опутывает противника на 1 ход", tags: [FetishTag.Tentacles], stats: { strength: 220, agility: 120, charisma: 150, stamina: 190, rage: 180 } },
  { id: 8, name: "Опытная Наставница", rarity: Rarity.Rare, imageUrl: "https://picsum.photos/seed/8/400/600", effect: "+10 к опыту за бой", tags: [FetishTag.MILF], stats: { strength: 140, agility: 130, charisma: 280, stamina: 200, rage: 50 } },
  { id: 9, name: "Эльфийская Лучница", rarity: Rarity.Rare, imageUrl: "https://picsum.photos/seed/9/400/600", effect: "Пробивает любую защиту", tags: [FetishTag.Elven, FetishTag.Fantasy], stats: { strength: 150, agility: 260, charisma: 190, stamina: 160, rage: 110 } },
  { id: 10, name: "Волчица в Стае", rarity: Rarity.Rare, imageUrl: "https://picsum.photos/seed/10/400/600", effect: "Призывает на помощь ещё одну карту Furry", tags: [FetishTag.Furry], stats: { strength: 180, agility: 220, charisma: 170, stamina: 180, rage: 150 } },

  // Epics
  { id: 11, name: "Эльфийка на острие страсти", rarity: Rarity.Epic, imageUrl: "https://picsum.photos/seed/11/400/600", effect: "+3 возбуждение в бою", tags: [FetishTag.Fantasy, FetishTag.Elven], stats: { strength: 350, agility: 500, charisma: 450, stamina: 380, rage: 300 } },
  { id: 12, name: "Королева Доминатрикс", rarity: Rarity.Epic, imageUrl: "https://picsum.photos/seed/12/400/600", effect: "Берёт под контроль карту противника", tags: [FetishTag.BDSM], stats: { strength: 420, agility: 350, charisma: 580, stamina: 400, rage: 450 } },
  { id: 13, name: "Владычица Глубин", rarity: Rarity.Epic, imageUrl: "https://picsum.photos/seed/13/400/600", effect: "Все карты с тегом Tentacles получают +2 к атаке", tags: [FetishTag.Tentacles], stats: { strength: 550, agility: 300, charisma: 400, stamina: 520, rage: 500 } },
  
  // Legendary
  { id: 14, name: "Богиня Плодородия MILF", rarity: Rarity.Legendary, imageUrl: "https://picsum.photos/seed/14/400/600", effect: "Удваивает все получаемые награды", tags: [FetishTag.MILF, FetishTag.Fantasy], stats: { strength: 600, agility: 550, charisma: 950, stamina: 850, rage: 400 } },
  { id: 15, name: "Верховная Жрица Боли", rarity: Rarity.Legendary, imageUrl: "https://picsum.photos/seed/15/400/600", effect: "Каждый ход наносит урон всем картам", tags: [FetishTag.BDSM, FetishTag.Gothic], stats: { strength: 750, agility: 650, charisma: 800, stamina: 700, rage: 900 } },

  // Masturbatory
  { id: 16, name: "Абсолютное Единение", rarity: Rarity.Masturbatory, imageUrl: "https://picsum.photos/seed/16/400/600", effect: "Вы немедленно побеждаете. Игра заканчивается.", tags: [FetishTag.Tentacles, FetishTag.Fantasy], stats: { strength: 999, agility: 999, charisma: 999, stamina: 999, rage: 999 } }
];

export const INITIAL_PLAYER_CARDS: PlayerCard[] = [
    {...INITIAL_CARDS[0], instanceId: crypto.randomUUID()},
    {...INITIAL_CARDS[0], instanceId: crypto.randomUUID()},
    {...INITIAL_CARDS[1], instanceId: crypto.randomUUID()},
    {...INITIAL_CARDS[2], instanceId: crypto.randomUUID()},
    {...INITIAL_CARDS[6], instanceId: crypto.randomUUID()},
];

export const INITIAL_PLAYER_CURRENCIES: PlayerCurrencies = {
    fapCoins: 1000,
    lustGems: 100,
};

export const CHESTS: Chest[] = [
    {
        id: 'common',
        name: 'Обычный сундук',
        description: 'Содержит 1-2 карты, в основном обычные.',
        cost: 100,
        currency: 'fapCoins',
        cardCount: [1, 2],
        rarityChances: {
            [Rarity.Common]: 0.8,
            [Rarity.Rare]: 0.2,
        },
    },
    {
        id: 'premium',
        name: 'Премиум-сундук',
        description: '3-5 карт с повышенным шансом на Эпик.',
        cost: 50,
        currency: 'lustGems',
        cardCount: [3, 5],
        rarityChances: {
            [Rarity.Common]: 0.5,
            [Rarity.Rare]: 0.4,
            [Rarity.Epic]: 0.1,
        },
    },
    {
        id: 'fap-box',
        name: 'Фап-бокс',
        description: 'Супер-редкий. Высокий шанс на Легендарку!',
        cost: 200,
        currency: 'lustGems',
        cardCount: [5, 5],
        rarityChances: {
            [Rarity.Rare]: 0.6,
            [Rarity.Epic]: 0.35,
            [Rarity.Legendary]: 0.05,
        },
    },
    {
        id: 'fetish-chest',
        name: 'Фетиш-сундук',
        description: 'Содержит карты только одного случайного фетиша (например, только “Фурри” или только “BDSM”).',
        cost: 120,
        currency: 'fapCoins',
        cardCount: [2, 3],
        rarityChances: {
            [Rarity.Common]: 0.7,
            [Rarity.Rare]: 0.25,
            [Rarity.Epic]: 0.05,
        },
    },
    {
        id: 'random-orgy',
        name: 'Рандом-Оргия',
        description: 'Дропает много дешёвых карт (5–7 штук), но шанс на эпик почти нулевой. Отлично для крафта дублей.',
        cost: 80,
        currency: 'fapCoins',
        cardCount: [5, 7],
        rarityChances: {
            [Rarity.Common]: 0.6,
            [Rarity.Rare]: 0.35,
            [Rarity.Epic]: 0.05,
        },
    },
    {
        id: 'mythic-chest',
        name: 'Мифический сундук',
        description: 'Содержит 1–2 карты, но гарантированно минимум Эпик. Шанс Легендарки выше обычного в 3 раза.',
        cost: 300,
        currency: 'lustGems',
        cardCount: [1, 2],
        rarityChances: {
            [Rarity.Epic]: 0.85,
            [Rarity.Legendary]: 0.15,
        },
    },
    {
        id: 'hardcore-box',
        name: 'Хардкор-бокс',
        description: 'Шанс дропа “проклятых” карт (с отрицательными статами, но дающими редкие бафы в крафте). Риск/награда.',
        cost: 150,
        currency: 'fapCoins',
        cardCount: [2, 4], // Assuming 2-4 cards for risk/reward
        rarityChances: {
            [Rarity.Rare]: 0.4,
            [Rarity.Epic]: 0.4,
            [Rarity.Legendary]: 0.2,
        },
    },
    {
        id: 'secret-chest',
        name: 'Секретный сундук',
        description: 'На вид пустой (иконка — просто чёрный ящик). Может выпасть ничего (10% шанс), но может выпасть Легендарка или уникальная карта, которой нет в других сундуках. Чисто на азарт игроков.',
        cost: 500,
        currency: 'lustGems',
        cardCount: [0, 1], // 0 cards for the chance of nothing
        rarityChances: {
            [Rarity.Legendary]: 0.7,
            [Rarity.Epic]: 0.2,
            [Rarity.Rare]: 0.1,
        },
    },
];

export const MARKETPLACE_LISTINGS: (PlayerCard & { price: number })[] = [
    { ...INITIAL_CARDS[6], instanceId: 'market-1', price: 350 },
    { ...INITIAL_CARDS[1], instanceId: 'market-2', price: 75 },
    { ...INITIAL_CARDS[8], instanceId: 'market-3', price: 400 },
    { ...INITIAL_CARDS[11], instanceId: 'market-4', price: 5000 },
];

export let ALL_TAGS = [...new Set(INITIAL_CARDS.flatMap(card => card.tags))].sort((a,b) => a.localeCompare(b));

export const updateAllTags = (cards: Card[]) => {
    ALL_TAGS = [...new Set(cards.flatMap(card => card.tags))].sort((a, b) => a.localeCompare(b));
};
