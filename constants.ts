
import { Card, Rarity, Chest, PlayerCard, PlayerCurrencies } from './types';

export const RARITY_ORDER: Rarity[] = [Rarity.Common, Rarity.Rare, Rarity.Epic, Rarity.Legendary];

// FIX: Added 'gem' property to provide a color for the RarityGem component.
export const RARITY_STYLES: { [key in Rarity]: { bg: string; border: string; text: string; shadow: string; ring: string; gem: string } } = {
  [Rarity.Common]: { bg: 'bg-gray-800', border: 'border-gray-500', text: 'text-gray-200', shadow: 'shadow-gray-900/50', ring: 'ring-gray-500', gem: 'bg-gray-400' },
  [Rarity.Rare]: { bg: 'bg-blue-900', border: 'border-sky-500', text: 'text-sky-200', shadow: 'shadow-sky-700/50', ring: 'ring-sky-500', gem: 'bg-sky-400' },
  [Rarity.Epic]: { bg: 'bg-purple-900', border: 'border-purple-500', text: 'text-purple-200', shadow: 'shadow-purple-700/50', ring: 'ring-purple-500', gem: 'bg-purple-400' },
  [Rarity.Legendary]: { bg: 'bg-orange-900', border: 'border-amber-500', text: 'text-amber-200', shadow: 'shadow-amber-700/50', ring: 'ring-amber-500', gem: 'bg-amber-400' },
};

// These are now only used to seed the database on the first run.
export const INITIAL_CARDS: Card[] = [
    // === LEGENDARY (5 + 1 new) ===
    { id: 1, name: "Джонни Сильверхенд", rarity: Rarity.Legendary, imageUrl: "https://i.imgur.com/gU8h4Y2.jpeg", effect: "Никогда не угасай.", role: 'attack', stats: { strength: 800, healing: 0 } },
    { id: 2, name: "Адам Смэшер", rarity: Rarity.Legendary, imageUrl: "https://i.imgur.com/W209L9h.jpeg", effect: "Ты лишь кусок мяса.", role: 'attack', stats: { strength: 1000, healing: 0 } },
    { id: 3, name: "V (Легенда Найт-Сити)", rarity: Rarity.Legendary, imageUrl: "https://i.imgur.com/5SgV5dE.jpeg", effect: "Время сжечь этот город.", role: 'attack', stats: { strength: 750, healing: 200 } },
    { id: 4, name: "Альт Каннингем", rarity: Rarity.Legendary, imageUrl: "https://i.imgur.com/g6P5xWf.jpeg", effect: "За Черным Заслоном.", role: 'support', stats: { strength: 100, healing: 600 } },
    { id: 5, name: "Сабуро Арасака", rarity: Rarity.Legendary, imageUrl: "https://i.imgur.com/m4h8u0C.jpeg", effect: "Корпорации правят миром.", role: 'attack', stats: { strength: 600, healing: 0 } },
    { id: 6, name: "Имплант 'Второе Сердце'", rarity: Rarity.Legendary, imageUrl: "https://i.imgur.com/J30Gs4j.jpeg", effect: "Если следующая атака должна вас убить, вы выживаете с 1 HP. Срабатывает один раз за бой.", role: 'support', stats: { strength: 0, healing: 0 }, specialEffect: 'second_heart' },

    // === EPIC (15 + 1 new) ===
    { id: 101, name: "Джуди Альварес", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/lZ6J3xU.jpeg", effect: "Найди свой тихий уголок.", role: 'support', stats: { strength: 150, healing: 350 } },
    { id: 102, name: "Панам Палмер", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/5b8Q3jF.jpeg", effect: "За семью и за клан.", role: 'attack', stats: { strength: 450, healing: 0 } },
    { id: 103, name: "Горо Такэмура", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/T0a3c9t.jpeg", effect: "Честь превыше всего.", role: 'attack', stats: { strength: 400, healing: 100 } },
    { id: 104, name: "Джеки Уэллс", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/N7W0gYj.jpeg", effect: "За тебя, чумба!", role: 'attack', stats: { strength: 500, healing: 0 } },
    { id: 105, name: "Виктор Вектор", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/i9R3n2C.jpeg", effect: "Подлатаю тебя.", role: 'support', stats: { strength: 50, healing: 450 } },
    { id: 106, name: "Роуг Амендиарес", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/x0e3L6s.jpeg", effect: "Королева фиксеров.", role: 'attack', stats: { strength: 480, healing: 0 } },
    { id: 107, name: "Пласид", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/Y3W1q2P.jpeg", effect: "За Voodoo Boys.", role: 'attack', stats: { strength: 520, healing: 0 } },
    { id: 108, name: "Сасквоч", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/t7r1d4f.jpeg", effect: "Лидер 'Животных'.", role: 'attack', stats: { strength: 600, healing: 0 } },
    { id: 109, name: "Имплант 'Сандевистан'", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/f0i4y6b.jpeg", effect: "Время замедляется.", role: 'attack', stats: { strength: 300, healing: 0 } },
    { id: 110, name: "Имплант 'Керензиков'", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/k9v9d3E.jpeg", effect: "Рефлексы на пределе.", role: 'attack', stats: { strength: 280, healing: 0 } },
    { id: 111, name: "Система запуска снарядов", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/t9L7h2B.jpeg", effect: "Взрывное решение.", role: 'attack', stats: { strength: 550, healing: 0 } },
    { id: 112, name: "Rayfield Caliburn", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/S6e1l6E.jpeg", effect: "Скорость гиперкара.", role: 'attack', stats: { strength: 250, healing: 0 } },
    { id: 113, name: "Quadra Turbo-R V-Tech", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/k6l4T4V.jpeg", effect: "Икона улиц.", role: 'attack', stats: { strength: 220, healing: 0 } },
    { id: 114, name: "Militech 'Химера'", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/s0C4f7C.jpeg", effect: "Тяжелая боевая платформа.", role: 'attack', stats: { strength: 650, healing: 0 } },
    { id: 115, name: "Эвелин Паркер", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/d9T6i5p.jpeg", effect: "Кукла со связями.", role: 'support', stats: { strength: 100, healing: 200 } },
    { id: 116, name: "Вирус 'System Shock'", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/2X8Y5vT.jpeg", effect: "Критическая ошибка системы. Противник пропускает следующий ход.", role: 'attack', stats: { strength: 50, healing: 0 }, specialEffect: 'skip_turn' },
    { id: 117, name: "Спайдер Мёрфи", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/sO9f8U5.jpeg", effect: "Легенда Сети. Крадет карту у противника.", role: 'attack', stats: { strength: 250, healing: 0 }, specialEffect: 'steal_card' },
    { id: 118, name: "Боевой Стимулятор 'Black Lace'", rarity: Rarity.Epic, imageUrl: "https://i.imgur.com/fN0n2gG.jpeg", effect: "Следующая ваша атакующая карта получает +200 Силы.", role: 'support', stats: { strength: 0, healing: 0 }, specialEffect: 'enhance_next_attack', effectValue: 200 },

    // === RARE (25) ===
    { id: 201, name: "Ривер Уорд", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/B7x6r3h.jpeg", effect: "Бывший коп NCPD.", role: 'attack', stats: { strength: 200, healing: 50 } },
    { id: 202, name: "Керри Евродин", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/Q7o8J5g.jpeg", effect: "Рок-звезда.", role: 'support', stats: { strength: 80, healing: 120 } },
    { id: 203, name: "Мисти Ольшевски", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/U8h5i3A.jpeg", effect: "Таро и эзотерика.", role: 'support', stats: { strength: 10, healing: 200 } },
    { id: 204, name: "Вакако Окада", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/F4L2a1j.jpeg", effect: "Фиксер из Уэстбрука.", role: 'attack', stats: { strength: 150, healing: 0 } },
    { id: 205, name: "Боец 'Мальстрём'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/h9S2s1k.jpeg", effect: "Замена плоти на хром.", role: 'attack', stats: { strength: 250, healing: 0 } },
    { id: 206, name: "Якудза 'Тигриный Коготь'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/x4W8d9z.jpeg", effect: "Честь и катана.", role: 'attack', stats: { strength: 220, healing: 0 } },
    { id: 207, name: "Солдат 'Валентино'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/j5T8b7L.jpeg", effect: "За семью и честь.", role: 'attack', stats: { strength: 190, healing: 30 } },
    { id: 208, name: "Нетраннер 'Voodoo Boys'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/W9v1c0b.jpeg", effect: "Взлом сети.", role: 'attack', stats: { strength: 180, healing: 0 } },
    { id: 209, name: "Атлет 'Животных'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/D4s3h2f.jpeg", effect: "Сила превыше всего.", role: 'attack', stats: { strength: 280, healing: 0 } },
    { id: 210, name: "Риппердок-Стервятник", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/s6W7a8d.jpeg", effect: "Дешевый хром.", role: 'support', stats: { strength: 40, healing: 150 } },
    { id: 211, name: "Агент 'Милитех'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/Y2m3b1A.jpeg", effect: "Корпоративный солдат.", role: 'attack', stats: { strength: 230, healing: 0 } },
    { id: 212, name: "Ниндзя 'Арасака'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/U5h4a2B.jpeg", effect: "Тень корпорации.", role: 'attack', stats: { strength: 260, healing: 0 } },
    { id: 213, name: "Дрон 'Кан Тао'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/L7p8O9f.jpeg", effect: "Автономная угроза.", role: 'attack', stats: { strength: 170, healing: 0 } },
    { id: 214, name: "Медик 'Trauma Team'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/V6b7c8D.jpeg", effect: "Пакет 'Платина'.", role: 'support', stats: { strength: 50, healing: 250 } },
    { id: 215, name: "Офицер 'Макс-Так'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/I8f7g6E.jpeg", effect: "Охота на киберпсихов.", role: 'attack', stats: { strength: 300, healing: 0 } },
    { id: 216, name: "Револьвер 'Overture'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/K3n4i5F.jpeg", effect: "Тяжелый калибр.", role: 'attack', stats: { strength: 210, healing: 0 } },
    { id: 217, name: "Термальная Катана", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/P7o8Q9W.jpeg", effect: "Раскаленное лезвие.", role: 'attack', stats: { strength: 240, healing: 0 } },
    { id: 218, name: "Клинки Богомола", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/A6j5b4K.jpeg", effect: "Смерть из рук.", role: 'attack', stats: { strength: 270, healing: 0 } },
    { id: 219, name: "Руки Гориллы", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/M5n4p3L.jpeg", effect: "Грубая сила.", role: 'attack', stats: { strength: 290, healing: 0 } },
    { id: 220, name: "Моноструна", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/J6f7g8H.jpeg", effect: "Тонкая нить смерти.", role: 'attack', stats: { strength: 260, healing: 0 } },
    { id: 221, name: "Фиксер 'Падре'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/k9m8b7C.jpeg", effect: "Контракты в Хейвуде.", role: 'attack', stats: { strength: 140, healing: 40 } },
    { id: 222, name: "Брейнданс-техник", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/t3u4v5B.jpeg", effect: "Редактор воспоминаний.", role: 'support', stats: { strength: 20, healing: 180 } },
    { id: 223, name: "Рокербой", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/s4n5b6C.jpeg", effect: "Бунт и музыка.", role: 'attack', stats: { strength: 160, healing: 60 } },
    { id: 224, name: "Кочевник из клана 'Альдекальдо'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/Q2x3z4V.jpeg", effect: "Свобода в пустошах.", role: 'attack', stats: { strength: 180, healing: 50 } },
    { id: 225, name: "Байк 'Kusanagi CT-3X'", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/y5p6q7D.jpeg", effect: "Скорость и стиль.", role: 'attack', stats: { strength: 120, healing: 0 } },
    { id: 226, name: "Нейро-взлом", rarity: Rarity.Rare, imageUrl: "https://i.imgur.com/9fX7wG3.jpeg", effect: "Проникновение в кибердеку. Крадет случайную карту из руки противника.", role: 'support', stats: { strength: 10, healing: 0 }, specialEffect: 'steal_card' },

    // === COMMON (60) ===
    { id: 301, name: "Головорез 'Мальстрём'", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/7bY5z7j.jpeg", effect: "Простой бандит.", role: 'attack', stats: { strength: 60, healing: 0 } },
    { id: 302, name: "Уличный самурай", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/s7n8b9C.jpeg", effect: "Наемник на задании.", role: 'attack', stats: { strength: 50, healing: 10 } },
    { id: 303, name: "Охранник 'Арасака'", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/f8g9h0D.jpeg", effect: "Корпоративная пешка.", role: 'attack', stats: { strength: 70, healing: 0 } },
    { id: 304, name: "Боец '6-й Улицы'", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/k1m2n3O.jpeg", effect: "Закон и порядок.", role: 'attack', stats: { strength: 65, healing: 0 } },
    { id: 305, name: "Пистолет 'Lexington'", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/u4p5q6R.jpeg", effect: "Надежный ствол.", role: 'attack', stats: { strength: 40, healing: 0 } },
    { id: 306, name: "Дрон-охранник", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/z7y8x9S.jpeg", effect: "Автоматизированная защита.", role: 'attack', stats: { strength: 55, healing: 0 } },
    { id: 307, name: "Уличный торговец", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/v1a2b3T.jpeg", effect: "Продает хлам.", role: 'support', stats: { strength: 5, healing: 30 } },
    { id: 308, name: "Медтехник", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/a4b5c6U.jpeg", effect: "Латает раны.", role: 'support', stats: { strength: 10, healing: 70 } },
    { id: 309, name: "Гонщик 'Тигриный Коготь'", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/b7c8d9V.jpeg", effect: "Быстрый и дерзкий.", role: 'attack', stats: { strength: 45, healing: 0 } },
    { id: 310, name: "Номад-разведчик", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/c1d2e3W.jpeg", effect: "Глаза клана.", role: 'attack', stats: { strength: 50, healing: 5 } },
    { id: 311, name: "Малолитражка 'Makigai Maimai'", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/d4e5f6X.jpeg", effect: "Маленькая, но гордая.", role: 'attack', stats: { strength: 20, healing: 0 } },
    { id: 312, name: "Кибер-рука", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/e7f8g9Y.jpeg", effect: "Базовый имплант.", role: 'attack', stats: { strength: 30, healing: 0 } },
    { id: 313, name: "Корпо-клерк", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/f1g2h3Z.jpeg", effect: "Офисный планктон.", role: 'support', stats: { strength: 5, healing: 20 } },
    { id: 314, name: "Курьер", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/g4h5i6A.jpeg", effect: "Доставка посылок.", role: 'attack', stats: { strength: 25, healing: 10 } },
    { id: 315, name: "Полицейский NCPD", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/h7i8j9B.jpeg", effect: "Патрулирует улицы.", role: 'attack', stats: { strength: 60, healing: 0 } },
    { id: 316, name: "Бандит-Стервятник", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/i1j2k3C.jpeg", effect: "Охотится за имплантами.", role: 'attack', stats: { strength: 75, healing: 0 } },
    { id: 317, name: "Винтовка 'Copperhead'", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/j4k5l6D.jpeg", effect: "Стандартное оружие.", role: 'attack', stats: { strength: 50, healing: 0 } },
    { id: 318, name: "Стимулятор 'Bounce Back'", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/k7l8m9E.jpeg", effect: "Быстрое исцеление.", role: 'support', stats: { strength: 0, healing: 80 } },
    { id: 319, name: "Фиксер-новичок", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/l1m2n3F.jpeg", effect: "Дает мелкие заказы.", role: 'attack', stats: { strength: 35, healing: 15 } },
    { id: 320, name: "Боксер из спортзала", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/m4n5o6G.jpeg", effect: "Тренируется каждый день.", role: 'attack', stats: { strength: 80, healing: 0 } },
    { id: 321, name: "Официантка из бара", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/n7o8p9H.jpeg", effect: "Знает все слухи.", role: 'support', stats: { strength: 10, healing: 40 } },
    { id: 322, name: "Инженер 'Милитех'", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/o1p2q3I.jpeg", effect: "Ремонтирует технику.", role: 'support', stats: { strength: 15, healing: 60 } },
    { id: 323, name: "Охранная турель", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/p4q5r6J.jpeg", effect: "Стационарная огневая точка.", role: 'attack', stats: { strength: 85, healing: 0 } },
    { id: 324, name: "Уличный музыкант", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/q7r8s9K.jpeg", effect: "Играет за еду.", role: 'support', stats: { strength: 5, healing: 25 } },
    { id: 325, name: "Хакер-любитель", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/r1s2t3L.jpeg", effect: "Взламывает автоматы.", role: 'attack', stats: { strength: 40, healing: 0 } },
    { id: 326, name: "Протеже 'Валентино'", rarity: Rarity.Common, imageUrl: "https://i.imgur.com/s4t5u6M.jpeg", effect: "Молодой и дерзкий.", role: 'attack', stats: { strength: 55, healing: 5 } }
];

export const INITIAL_PLAYER_CURRENCIES: PlayerCurrencies = {
  fapCoins: 1000,
  lustGems: 50,
};

export const INITIAL_PLAYER_CARDS: PlayerCard[] = [
    { ...INITIAL_CARDS.find(c => c.id === 226)!, instanceId: crypto.randomUUID() }, // Нейро-взлом (steal)
    { ...INITIAL_CARDS.find(c => c.id === 116)!, instanceId: crypto.randomUUID() }, // Вирус 'System Shock' (skip)
    { ...INITIAL_CARDS.find(c => c.id === 118)!, instanceId: crypto.randomUUID() }, // Black Lace (enhance)
    { ...INITIAL_CARDS.find(c => c.id === 6)!, instanceId: crypto.randomUUID() },   // Second Heart
    { ...INITIAL_CARDS.find(c => c.id === 301)!, instanceId: crypto.randomUUID() },
];

export const CHESTS: Chest[] = [
    {
        id: 'common',
        name: 'Обычный Сундук',
        description: 'Содержит в основном обычные карты с небольшим шансом на что-то получше.',
        cost: 500,
        currency: 'fapCoins',
        cardCount: [3, 5],
        rarityChances: {
            [Rarity.Common]: 0.75,
            [Rarity.Rare]: 0.20,
            [Rarity.Epic]: 0.04,
            [Rarity.Legendary]: 0.01,
        },
    },
    {
        id: 'premium',
        name: 'Премиум Сундук',
        description: 'Повышенные шансы на получение редких и эпических карт. Гарантированно содержит хотя бы одну редкую карту.',
        cost: 100,
        currency: 'lustGems',
        cardCount: [5, 7],
        rarityChances: {
            [Rarity.Common]: 0.40,
            [Rarity.Rare]: 0.45,
            [Rarity.Epic]: 0.12,
            [Rarity.Legendary]: 0.03,
        },
    },
    {
        id: 'legendary',
        name: 'Легендарный Пак',
        description: 'Очень дорогой, но гарантирует получение эпической или легендарной карты.',
        cost: 500,
        currency: 'lustGems',
        cardCount: [4, 6],
        rarityChances: {
            [Rarity.Common]: 0.10,
            [Rarity.Rare]: 0.50,
            [Rarity.Epic]: 0.30,
            [Rarity.Legendary]: 0.10,
        },
    },
];

export const MARKETPLACE_LISTINGS: (PlayerCard & { price: number })[] = [
    { ...INITIAL_CARDS.find(c => c.id === 205)!, instanceId: crypto.randomUUID(), price: 1200 },
    { ...INITIAL_CARDS.find(c => c.id === 218)!, instanceId: crypto.randomUUID(), price: 2500 },
    { ...INITIAL_CARDS.find(c => c.id === 102)!, instanceId: crypto.randomUUID(), price: 8000 },
];