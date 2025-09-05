import React, { useState, useEffect, useCallback } from 'react';
import { FixerDistrict, Card, RaidInterfaceProps } from '../types';
import CardComponent from './CardComponent';
import { EddyIcon } from './IconComponents';

interface DamageNumber {
    id: number;
    amount: number;
    x: number;
    y: number;
}

const RaidHealthBar: React.FC<{ current: number; max: number; }> = ({ current, max }) => (
    <div className="w-full bg-gray-700 rounded-full h-8 border-2 border-gray-900 shadow-inner relative my-4">
      <div
        className="bg-gradient-to-r from-red-500 to-red-700 h-full rounded-full transition-all duration-200"
        style={{ width: `${Math.max(0, (current / max) * 100)}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg drop-shadow-md">
        {Math.round(current)} / {max}
      </span>
    </div>
);


const RaidInterface: React.FC<RaidInterfaceProps> = ({ district, allCards, onEndRaid, clickDamage }) => {
    const [currentEnemy, setCurrentEnemy] = useState<Card | null>(null);
    const [maxHp, setMaxHp] = useState(0);
    const [currentHp, setCurrentHp] = useState(0);
    const [kills, setKills] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);

    const spawnNewEnemy = useCallback(() => {
        const enemyCard = allCards[Math.floor(Math.random() * allCards.length)];
        const newMaxHp = Math.floor(Math.random() * (district.hpRange[1] - district.hpRange[0] + 1)) + district.hpRange[0];
        setCurrentEnemy(enemyCard);
        setMaxHp(newMaxHp);
        setCurrentHp(newMaxHp);
    }, [allCards, district]);

    useEffect(() => {
        spawnNewEnemy();
    }, [spawnNewEnemy]);

    const handleEnemyClick = (e: React.MouseEvent) => {
        if (!currentEnemy || currentHp <= 0) return;

        const newHp = currentHp - clickDamage;
        setCurrentHp(newHp);

        // Show damage number
        const newDamageNumber: DamageNumber = {
            id: Date.now() + Math.random(),
            amount: clickDamage,
            x: e.clientX,
            y: e.clientY,
        };
        setDamageNumbers(prev => [...prev, newDamageNumber]);
        setTimeout(() => {
            setDamageNumbers(prev => prev.filter(dn => dn.id !== newDamageNumber.id));
        }, 1000);


        if (newHp <= 0) {
            const reward = Math.floor(Math.random() * (district.rewardRange[1] - district.rewardRange[0] + 1)) + district.rewardRange[0];
            setEarnings(prev => prev + reward);
            setKills(prev => prev + 1);
            spawnNewEnemy();
        }
    };
    
    if (!currentEnemy) {
        return <div>Загрузка рейда...</div>
    }

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] animate-fade-in relative overflow-hidden">
            {/* Damage Numbers */}
            {damageNumbers.map(dn => (
                <div 
                    key={dn.id} 
                    className="absolute text-3xl font-black text-orange-400 pointer-events-none animate-damage-number"
                    style={{ left: dn.x, top: dn.y }}
                >
                    -{dn.amount}
                </div>
            ))}
            
            <div className="absolute top-0 right-0 bg-black/50 p-4 rounded-bl-xl text-lg text-center">
                <div className="font-bold text-gray-300">Добыча в Рейде:</div>
                <div className="flex items-center justify-center font-bold text-2xl text-[color:var(--brand-orange)]">
                   <EddyIcon className="w-6 h-6 mr-2"/> {earnings.toLocaleString()}
                </div>
                 <div className="font-bold text-gray-300 mt-2">Уничтожено:</div>
                <div className="font-bold text-2xl text-white">{kills}</div>
            </div>

            <h2 className="text-4xl font-heading text-white mb-2">Цель: {currentEnemy.name}</h2>
            <p className="text-xl text-gray-400">Район: {district.name}</p>
            
            <RaidHealthBar current={currentHp} max={maxHp} />

            <div className="w-full max-w-sm cursor-pointer" onClick={handleEnemyClick}>
                <CardComponent card={currentEnemy} />
            </div>

            <button
                onClick={() => onEndRaid(district.id, kills, earnings)}
                className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-xl transform active:scale-95 shadow-lg shadow-red-600/20"
            >
                Завершить Рейд и Забрать Добычу
            </button>
             <style>{`
                @keyframes damage-number {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
                }
                .animate-damage-number {
                    animation: damage-number 1s forwards;
                }
            `}</style>
        </div>
    );
};

export default RaidInterface;