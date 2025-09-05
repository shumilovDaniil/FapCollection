export enum Rarity {
  Common = 'Обычная',
  Rare = 'Редкая',
  Epic = 'Эпическая',
  Legendary = 'Легендарная',
  Masturbatory = 'Мастурбаторская'
}

export enum FetishTag {
  BDSM = 'BDSM',
  Elven = 'Эльфийки',
  MILF = 'MILF',
  Tentacles = 'Тентакли',
  Fantasy = 'Fantasy',
  AltGirl = 'Alt Girl',
  Furry = 'Furry',
  Gothic = 'Готика'
}

export interface CardStats {
  strength: number;
  agility: number;
  charisma: number;
  stamina: number;
  rage: number;
}

export interface Card {
  id: number;
  name: string;
  rarity: Rarity;
  imageUrl: string;
  effect: string;
  tags: FetishTag[];
  stats: CardStats;
}

export interface PlayerCard extends Card {
  instanceId: string; // Unique ID for each specific card instance a player owns
}

export interface PlayerCurrencies {
  fapCoins: number;
  lustGems: number;
}

export interface PlayerState {
  cards: PlayerCard[];
  currencies: PlayerCurrencies;
}

export enum Page {
  Collection = 'Коллекция',
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
}
