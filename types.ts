export enum Rarity {
  Common = 'Обычная',
  Rare = 'Редкая',
  Epic = 'Эпическая',
  Legendary = 'Легендарная',
}

export interface CardStats {
  strength: number;
  healing: number;
}

export type CardRole = 'attack' | 'support';
export type SpecialEffect = 'skip_turn' | 'steal_card' | 'enhance_next_attack' | 'second_heart';

export interface Card {
  id: number;
  name: string;
  rarity: Rarity;
  imageUrl: string;
  effect: string;
  role: CardRole;
  stats: CardStats;
  specialEffect?: SpecialEffect;
  effectValue?: number;
}

export interface PlayerCard extends Card {
  instanceId: string; // Unique ID for each specific card instance a player owns
}

export interface PlayerCurrencies {
  eddies: number;
  lustGems: number;
}

export interface PlayerState {
  cards: PlayerCard[];
  currencies: PlayerCurrencies;
}

export enum Page {
  Collection = 'Коллекция',
  Battle = 'Бой',
  FixerContracts = 'Контракты',
  Chests = 'Сундуки',
  Crafting = 'Крафт',
  Shop = 'Магазин',
  Marketplace = 'Рынок',
  Developer = 'Разработка'
}

export interface Chest {
    id: string;
    name: string;
    description: string;
    cost: number;
    currency: keyof PlayerCurrencies;
    cardCount: [number, number]; // min, max cards
    rarityChances: { [key in Rarity]?: number };
    filter?: { role: CardRole };
}

// --- Fixer Contracts ---
export interface FixerDistrict {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  hpRange: [number, number];
  rewardRange: [number, number];
  unlockRequirement?: {
    districtId: string;
    kills: number;
  };
}

export interface FixerProgress {
  [districtId: string]: {
    kills: number;
  };
}

export interface FixerContractsPageProps {
  progress: FixerProgress;
  allGameCards: Card[];
  playerCurrencies: PlayerCurrencies;
  setPlayerCurrencies: React.Dispatch<React.SetStateAction<PlayerCurrencies>>;
  setFixerProgress: React.Dispatch<React.SetStateAction<FixerProgress>>;
  clickDamage: number;
}

export interface RaidInterfaceProps {
  district: FixerDistrict;
  allCards: Card[];
  onEndRaid: (districtId: string, kills: number, earnings: number) => void;
  clickDamage: number;
}

export interface CheatMenuProps {
  onAddCurrency: (currency: keyof PlayerCurrencies, amount: number) => void;
  clickDamage: number;
  setClickDamage: (damage: number) => void;
}