import React, { useState } from 'react';
import { PlayerCard, PlayerCurrencies } from '../types';
import { MARKETPLACE_LISTINGS } from '../constants';
import CardComponent from './CardComponent';
import { EddyIcon } from './IconComponents';
import * as db from '../db';

interface MarketplacePageProps {
  playerCards: PlayerCard[];
  setPlayerCards: React.Dispatch<React.SetStateAction<PlayerCard[]>>;
  currencies: PlayerCurrencies;
  setCurrencies: React.Dispatch<React.SetStateAction<PlayerCurrencies>>;
}

const MarketplacePage: React.FC<MarketplacePageProps> = ({ playerCards, setPlayerCards, currencies, setCurrencies }) => {
    const [listings, setListings] = useState(MARKETPLACE_LISTINGS);

    const handleBuy = async (listing: typeof listings[0]) => {
        if (currencies.eddies < listing.price) {
            alert("Недостаточно Эдди!");
            return;
        }

        // Update currencies
        const newCurrencies = { ...currencies, eddies: currencies.eddies - listing.price };
        await db.updatePlayerCurrencies(newCurrencies);
        setCurrencies(newCurrencies);

        // Add card to player collection
        const newCard: PlayerCard = { ...listing, instanceId: crypto.randomUUID() };
        await db.addPlayerCards([newCard]);
        setPlayerCards(prev => [...prev, newCard]);

        // Remove from listings
        setListings(prev => prev.filter(l => l.instanceId !== listing.instanceId));
    };

    const handleSell = async (card: PlayerCard) => {
        const price = prompt(`За сколько Эдди вы хотите продать "${card.name}"?`);
        const sellPrice = parseInt(price || '0', 10);

        if (isNaN(sellPrice) || sellPrice <= 0) {
            alert("Пожалуйста, введите корректную цену.");
            return;
        }
        
        const commission = Math.ceil(sellPrice * 0.1);
        const profit = sellPrice - commission;

        // Update currencies
        const newCurrencies = { ...currencies, eddies: currencies.eddies + profit };
        await db.updatePlayerCurrencies(newCurrencies);
        setCurrencies(newCurrencies);

        // Remove card from player collection
        await db.removePlayerCards([card.instanceId]);
        setPlayerCards(prev => prev.filter(c => c.instanceId !== card.instanceId));

        alert(`Карта "${card.name}" продана за ${sellPrice} Эдди. После комиссии 10% (${commission}) вы получили ${profit} Эдди.`);
    };

    const groupedPlayerCards = playerCards.reduce((acc, card) => {
      const existing = acc.find(item => item.card.id === card.id);
      if (existing) {
        existing.instances.push(card);
      } else {
        acc.push({ card: card, instances: [card] });
      }
      return acc;
    }, [] as { card: PlayerCard, instances: PlayerCard[] }[]);

    return (
        <div className="animate-fade-in space-y-12">
            <div>
                <h2 className="text-5xl font-heading mb-6 text-[color:var(--brand-orange)] text-center">Торговая Площадка</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {listings.map(listing => (
                        <div key={listing.instanceId} className="flex flex-col items-center">
                            <CardComponent card={listing} />
                            <button 
                                onClick={() => handleBuy(listing)}
                                className="w-full mt-2 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center text-sm transform active:scale-95"
                            >
                                <span className="mr-2">Купить</span>
                                <span className="flex items-center font-semibold">
                                    {listing.price.toLocaleString()}
                                    <EddyIcon className="w-4 h-4 ml-1" />
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
                 {listings.length === 0 && <p className="text-center text-gray-400 mt-8">На рынке пусто. Загляните позже!</p>}
            </div>

            <div>
                <h2 className="text-5xl font-heading mb-6 text-[color:var(--brand-orange)] text-center">Продать Свои Карты</h2>
                {groupedPlayerCards.length === 0 ? (
                    <p className="text-center text-gray-400">У вас нет карт для продажи.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {groupedPlayerCards.map(({ card, instances }) => (
                            <div key={card.id} className="flex flex-col items-center">
                                <CardComponent card={card} count={instances.length} />
                                <button 
                                    onClick={() => handleSell(instances[0])}
                                    className="w-full mt-2 bg-[color:var(--brand-orange)] hover:brightness-110 text-gray-900 font-bold py-2 px-3 rounded-lg transition-colors transform active:scale-95"
                                >
                                    Продать
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplacePage;