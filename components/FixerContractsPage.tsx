import React, { useState } from 'react';
import { FixerProgress, FixerDistrict, Card, PlayerCurrencies, FixerContractsPageProps } from '../types';
import { FIXER_DISTRICTS } from '../constants';
import * as db from '../db';
import RaidInterface from './RaidInterface';

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
);


const FixerContractsPage: React.FC<FixerContractsPageProps> = (props) => {
    const { progress, allGameCards, playerCurrencies, setPlayerCurrencies, setFixerProgress, clickDamage } = props;
    const [activeRaid, setActiveRaid] = useState<FixerDistrict | null>(null);

    const isDistrictUnlocked = (districtId: string): boolean => {
        const district = FIXER_DISTRICTS.find(d => d.id === districtId);
        if (!district || !district.unlockRequirement) {
            return true;
        }
        const requiredKills = district.unlockRequirement.kills;
        const currentKills = progress[district.unlockRequirement.districtId]?.kills || 0;
        return currentKills >= requiredKills;
    };

    const handleStartRaid = (district: FixerDistrict) => {
        setActiveRaid(district);
    };

    const handleEndRaid = async (districtId: string, kills: number, earnings: number) => {
        // Update currencies
        const newCurrencies = { ...playerCurrencies, eddies: playerCurrencies.eddies + earnings };
        await db.updatePlayerCurrencies(newCurrencies);
        setPlayerCurrencies(newCurrencies);

        // Update progress
        const newProgress = { ...progress };
        if (!newProgress[districtId]) {
            newProgress[districtId] = { kills: 0 };
        }
        newProgress[districtId].kills += kills;
        
        await db.updateFixerProgress(newProgress);
        setFixerProgress(newProgress);

        // Exit raid view
        setActiveRaid(null);
    };

    if (activeRaid) {
        return <RaidInterface 
                    district={activeRaid} 
                    allCards={allGameCards} 
                    onEndRaid={handleEndRaid} 
                    clickDamage={clickDamage}
                />;
    }

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-5xl font-heading text-[color:var(--brand-orange)]">Контракты Фиксера</h2>
                <p className="text-lg text-gray-400 mt-2">Выберите район для начала рейда и заработка Эдди.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {FIXER_DISTRICTS.map(district => {
                    const isUnlocked = isDistrictUnlocked(district.id);
                    const requiredKills = district.unlockRequirement?.kills || 0;
                    const requiredDistrictName = FIXER_DISTRICTS.find(d => d.id === district.unlockRequirement?.districtId)?.name;
                    
                    return (
                        <div key={district.id} className={`bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 transition-all duration-300 ${isUnlocked ? 'hover:border-[color:var(--brand-teal)] hover:scale-105' : 'opacity-60 saturate-50'}`}>
                            <div className="relative h-48">
                                <img src={district.imageUrl} alt={district.name} className="w-full h-full object-cover"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                                <h3 className="absolute bottom-4 left-4 text-4xl font-heading text-white">{district.name}</h3>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-gray-300 mb-4 flex-grow">{district.description}</p>
                                
                                <div className="text-sm space-y-2 mb-6">
                                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                                        <span className="font-bold text-gray-400">Здоровье врагов:</span>
                                        <span className="font-mono text-white">{district.hpRange[0]} - {district.hpRange[1]}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-md">
                                        <span className="font-bold text-gray-400">Награда (Эдди):</span>
                                        <span className="font-mono text-[color:var(--brand-orange)]">{district.rewardRange[0]} - {district.rewardRange[1]}</span>
                                    </div>
                                </div>

                                {isUnlocked ? (
                                     <button
                                        onClick={() => handleStartRaid(district)}
                                        className="w-full mt-auto bg-[color:var(--brand-orange)] hover:brightness-110 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-200 text-lg transform active:scale-95 shadow-lg shadow-[color:var(--brand-orange)]/20"
                                    >
                                        Начать Рейд
                                    </button>
                                ) : (
                                    <div className="w-full mt-auto bg-gray-800 text-gray-400 font-bold py-3 px-4 rounded-lg text-center border-2 border-dashed border-gray-600">
                                        <div className="flex items-center justify-center mb-1">
                                            <LockIcon />
                                            <span className="ml-2">ЗАБЛОКИРОВАНО</span>
                                        </div>
                                        <p className="text-xs font-normal">
                                            Победить {requiredKills} в районе "{requiredDistrictName}"
                                            ({(progress[district.unlockRequirement!.districtId]?.kills || 0)}/{requiredKills})
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FixerContractsPage;