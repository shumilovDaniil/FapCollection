import React from 'react';
import { PlayerCurrencies } from '../types';
import { FapCoinIcon, LustGemIcon } from './IconComponents';
import { updatePlayerCurrencies } from '../db';

interface ShopPageProps {
  currencies: PlayerCurrencies;
  setCurrencies: React.Dispatch<React.SetStateAction<PlayerCurrencies>>;
}

const shopItems = [
    { type: 'fapCoins', amount: 5000, cost: 50, currency: 'lustGems', name: "Мешочек Монет" },
    { type: 'fapCoins', amount: 25000, cost: 200, currency: 'lustGems', name: "Сундук Монет" },
    { type: 'lustGems', amount: 100, cost: 0.99, currency: 'real', name: "Горстка Камней" },
    { type: 'lustGems', amount: 550, cost: 4.99, currency: 'real', name: "Кошель Камней" },
    { type: 'lustGems', amount: 1200, cost: 9.99, currency: 'real', name: "Сокровище Камней" },
];

const ShopPage: React.FC<ShopPageProps> = ({ currencies, setCurrencies }) => {

    const handlePurchase = async (item: typeof shopItems[0]) => {
        if(item.currency === 'real') {
            alert("Покупка за реальные деньги в данный момент невозможна. Это всего лишь демо.");
            return;
        }

        if(currencies[item.currency] < item.cost) {
            alert("Недостаточно средств!");
            return;
        }

        const newCurrencies: PlayerCurrencies = {
            ...currencies,
            [item.type]: currencies[item.type] + item.amount,
            [item.currency]: currencies[item.currency] - item.cost
        };
        
        await updatePlayerCurrencies(newCurrencies);
        setCurrencies(newCurrencies);
    }


  return (
    <div className="animate-fade-in">
      <h2 className="text-5xl font-heading mb-8 text-[color:var(--brand-orange)] text-center">Магазин</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {shopItems.map((item, index) => (
          <div key={index} className="bg-[color:var(--brand-panel)] border border-[color:var(--brand-teal)]/30 rounded-xl p-6 flex flex-col text-center shadow-lg shadow-black/30">
            <h3 className="text-3xl font-heading text-[color:var(--brand-orange)] mb-2">{item.name}</h3>
            <div className="my-4 flex-grow flex flex-col items-center justify-center">
                <div className="flex items-center text-4xl font-black font-heading">
                   {item.type === 'fapCoins' ? <FapCoinIcon className="w-10 h-10 mr-3 text-[color:var(--brand-orange)]" /> : <LustGemIcon className="w-10 h-10 mr-3 text-purple-400" />}
                   <span>{item.amount.toLocaleString()}</span>
                </div>
            </div>
            <button
                onClick={() => handlePurchase(item)}
                className="w-full bg-teal-500 hover:bg-teal-600 text-[color:var(--brand-bg)] font-bold py-3 px-4 rounded-full transition-colors flex items-center justify-center space-x-2 text-lg transform active:scale-95 shadow-lg"
            >
              <span>{item.currency === 'real' ? `Купить за $${item.cost}` : `Купить за ${item.cost}`}</span>
              {item.currency === 'lustGems' && <LustGemIcon className="w-6 h-6"/>}
            </button>
          </div>
        ))}
      </div>
       <p className="text-center text-gray-500 mt-8 italic">Цены в магазине намеренно завышены. Экономика, б***ь!</p>
    </div>
  );
};

export default ShopPage;