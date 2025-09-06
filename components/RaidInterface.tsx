import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { FixerDistrict, Card, RaidInterfaceProps, PlayerCard, KillStats, Rarity } from '../types';
import CardComponent from './CardComponent';
import { EddyIcon, StrengthIcon } from './IconComponents';
import { AudioContext } from '../context/AudioContext';
import { playSound } from '../utils/audio';

interface DamageNumber {
    id: number;
    amount: number;
    x: number;
    y: number;
}

interface ClickBurst {
    id: number;
    x: number;
    y: number;
}

const RaidHealthBar: React.FC<{ current: number; max: number; }> = ({ current, max }) => (
    <div className="w-full bg-gray-900 h-8 border-2 border-[color:var(--brand-accent)]/50 relative my-4">
      <div
        className="bg-[color:var(--brand-warning)] h-full transition-all duration-200"
        style={{ width: `${Math.max(0, (current / max) * 100)}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg drop-shadow-md">
        {Math.round(current)} / {max}
      </span>
    </div>
);


const RaidInterface: React.FC<RaidInterfaceProps> = ({ district, team, allGameCards, onEndRaid }) => {
    const [currentEnemy, setCurrentEnemy] = useState<Card | null>(null);
    const [maxHp, setMaxHp] = useState(0);
    const [currentHp, setCurrentHp] = useState(0);
    
    const [raidKills, setRaidKills] = useState(0);
    const [raidEarnings, setRaidEarnings] = useState(0);
    const [killStats, setKillStats] = useState<KillStats>({});
    
    const [activeTeam, setActiveTeam] = useState<PlayerCard[]>(team);
    const [stunnedTeam, setStunnedTeam] = useState<PlayerCard[]>([]);
    const [attackerIndex, setAttackerIndex] = useState(0);
    const [killsSinceStunCheck, setKillsSinceStunCheck] = useState(0);
    
    const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
    const [clickBursts, setClickBursts] = useState<ClickBurst[]>([]);
    const [battleLog, setBattleLog] = useState<string[]>([]);

    const [isGettingHit, setIsGettingHit] = useState(false);
    const [isEnemyDying, setIsEnemyDying] = useState(false);
    
    const audioAssets = useContext(AudioContext);
    const [lastHitSoundIndex, setLastHitSoundIndex] = useState<number | null>(null);
    const [lastDeathSoundIndex, setLastDeathSoundIndex] = useState<number | null>(null);
    
    const hitSounds = useMemo(() => {
        return [
            audioAssets.get('hitSound1'),
            audioAssets.get('hitSound2'),
            audioAssets.get('hitSound3'),
            audioAssets.get('hitSound4'),
        ].filter((sound): sound is AudioBuffer => !!sound);
    }, [audioAssets]);

    const deathSounds = useMemo(() => {
        return [
            audioAssets.get('deathSound1'),
            audioAssets.get('deathSound2'),
            audioAssets.get('deathSound3'),
            audioAssets.get('deathSound4'),
        ].filter((sound): sound is AudioBuffer => !!sound);
    }, [audioAssets]);
    
    const addLog = useCallback((message: string) => {
        setBattleLog(prev => [message, ...prev.slice(0, 9)]);
    }, []);

    const spawnNewEnemy = useCallback(() => {
        setIsEnemyDying(false);
        
        let potentialEnemies: Card[] = [];
        const rand = Math.random();

        switch(district.id) {
            case 'watson': {
                const commons = allGameCards.filter(c => c.rarity === Rarity.Common);
                const rares = allGameCards.filter(c => c.rarity === Rarity.Rare);
                if (rand < 0.8 || rares.length === 0) {
                    potentialEnemies = commons;
                } else {
                    potentialEnemies = rares;
                }
                break;
            }
            case 'pacifica': {
                const rares = allGameCards.filter(c => c.rarity === Rarity.Rare);
                const epics = allGameCards.filter(c => c.rarity === Rarity.Epic);
                if (rand < 0.75 || epics.length === 0) {
                    potentialEnemies = rares;
                } else {
                    potentialEnemies = epics;
                }
                break;
            }
            case 'city_center': {
                const epics = allGameCards.filter(c => c.rarity === Rarity.Epic);
                const legendaries = allGameCards.filter(c => c.rarity === Rarity.Legendary);
                if (rand < 0.85 || legendaries.length === 0) {
                    potentialEnemies = epics;
                } else {
                    potentialEnemies = legendaries;
                }
                break;
            }
            default:
                potentialEnemies = allGameCards.filter(c => c.rarity === Rarity.Common);
        }

        if (potentialEnemies.length === 0) {
            potentialEnemies = allGameCards.filter(c => c.rarity === Rarity.Common);
        }
         if (potentialEnemies.length === 0) {
            potentialEnemies = allGameCards;
        }

        const enemyCard = potentialEnemies[Math.floor(Math.random() * potentialEnemies.length)];
        const newMaxHp = Math.floor(Math.random() * (district.hpRange[1] - district.hpRange[0] + 1)) + district.hpRange[0];
        
        setCurrentEnemy(enemyCard);
        setMaxHp(newMaxHp);
        setCurrentHp(newMaxHp);
    }, [allGameCards, district]);

    useEffect(() => {
        addLog(`Рейд в районе "${district.name}" начался!`);
        spawnNewEnemy();
    }, [spawnNewEnemy, district.name, addLog]);

    const handleEnemyClick = (e: React.MouseEvent) => {
        if (!currentEnemy || currentHp <= 0 || activeTeam.length === 0 || isEnemyDying) return;

        const attacker = activeTeam[attackerIndex];
        const damageDealt = attacker.stats.strength;

        // Play random hit sound, avoiding repetition
        if (hitSounds.length > 0) {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * hitSounds.length);
            } while (hitSounds.length > 1 && nextIndex === lastHitSoundIndex);
            
            playSound(hitSounds[nextIndex]);
            setLastHitSoundIndex(nextIndex);
        }

        // Visual Hit Effects
        setIsGettingHit(true);
        setTimeout(() => setIsGettingHit(false), 200);

        const newBurst: ClickBurst = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
        setClickBursts(prev => [...prev, newBurst]);
        setTimeout(() => setClickBursts(prev => prev.filter(b => b.id !== newBurst.id)), 300);

        const newHp = currentHp - damageDealt;
        setCurrentHp(newHp);

        // Show damage number
        const newDamageNumber: DamageNumber = {
            id: Date.now() + Math.random(),
            amount: damageDealt,
            x: e.clientX,
            y: e.clientY,
        };
        setDamageNumbers(prev => [...prev, newDamageNumber]);
        setTimeout(() => setDamageNumbers(prev => prev.filter(dn => dn.id !== newDamageNumber.id)), 1000);

        // Cycle attacker
        setAttackerIndex(prev => (prev + 1) % activeTeam.length);

        if (newHp <= 0) {
            // Play random death sound, avoiding repetition
            if (deathSounds.length > 0) {
                let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * deathSounds.length);
                } while (deathSounds.length > 1 && nextIndex === lastDeathSoundIndex);
                
                playSound(deathSounds[nextIndex]);
                setLastDeathSoundIndex(nextIndex);
            }

            const reward = Math.floor(Math.random() * (district.rewardRange[1] - district.rewardRange[0] + 1)) + district.rewardRange[0];
            addLog(`💥 "${attacker.name}" уничтожил(а) "${currentEnemy.name}"!`);
            
            // Update stats
            setRaidEarnings(prev => prev + reward);
            setRaidKills(prev => prev + 1);
            setKillStats(prev => ({
                ...prev,
                [attacker.instanceId]: (prev[attacker.instanceId] || 0) + 1
            }));
            setKillsSinceStunCheck(prev => prev + 1);
            
            // Trigger death animation, then spawn new enemy
            setIsEnemyDying(true);
            setTimeout(() => {
                spawnNewEnemy();
            }, 500); // Wait for death animation to finish
        }
    };
    
    // Stun logic
    useEffect(() => {
        if (killsSinceStunCheck >= 3 && activeTeam.length > 0) {
            setKillsSinceStunCheck(0); // Reset counter after check
            
            if (Math.random() < district.stunChance) {
                const stunIndex = Math.floor(Math.random() * activeTeam.length);
                const stunnedCard = activeTeam[stunIndex];

                setActiveTeam(prev => prev.filter((_, i) => i !== stunIndex));
                setStunnedTeam(prev => [...prev, stunnedCard]);
                setAttackerIndex(0); // Reset index to avoid out-of-bounds
                addLog(`⚡ "${stunnedCard.name}" была оглушена!`);
            } else {
                addLog(`🍀 Ваша команда избежала оглушения!`);
            }
        }
    }, [killsSinceStunCheck, activeTeam, district.stunChance, addLog]);

    // End raid logic
    useEffect(() => {
        if (team.length > 0 && activeTeam.length === 0 && !isEnemyDying) {
            addLog("Все карты оглушены. Рейд завершен.");
            const allStunnedIds = team.map(c => c.instanceId);
            setTimeout(() => onEndRaid(district.id, raidKills, raidEarnings, allStunnedIds, killStats), 2000);
        }
    }, [activeTeam, team, district.id, raidKills, raidEarnings, onEndRaid, addLog, isEnemyDying, killStats]);
    
    const currentAttacker = useMemo(() => {
        if (activeTeam.length > 0) {
            return activeTeam[attackerIndex];
        }
        return null;
    }, [activeTeam, attackerIndex]);
    
    if (!currentEnemy) {
        return <div>Загрузка рейда...</div>
    }

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] animate-fade-in relative overflow-hidden">
             {damageNumbers.map(dn => (
                <div key={dn.id} className="absolute text-3xl font-black text-[color:var(--brand-accent)] pointer-events-none animate-damage-number" style={{ left: dn.x, top: dn.y, zIndex: 101 }}>-{dn.amount}</div>
            ))}
             {clickBursts.map(burst => (
                <div key={burst.id} className="absolute w-20 h-20 bg-[color:var(--brand-accent)]/50 rounded-full pointer-events-none animate-click-burst" style={{ left: burst.x, top: burst.y, transform: 'translate(-50%, -50%)', zIndex: 102 }}></div>
            ))}
            
            {/* Top Right Info */}
            <div className="absolute top-0 right-0 bg-black/50 p-4 text-lg text-center border-b-2 border-l-2 border-[color:var(--brand-accent)]/50">
                <div className="font-bold text-gray-300">Добыча в Рейде:</div>
                <div className="flex items-center justify-center font-bold text-2xl text-[color:var(--brand-accent)]"><EddyIcon className="w-6 h-6 mr-2"/> {raidEarnings.toLocaleString()}</div>
                <div className="font-bold text-gray-300 mt-2">Уничтожено:</div>
                <div className="font-bold text-2xl text-white">{raidKills}</div>
            </div>

            {/* Top Left Team Status */}
            <div className="absolute top-0 left-0 bg-black/50 p-4 w-96 border-b-2 border-r-2 border-[color:var(--brand-accent)]/50">
                <h3 className="font-bold text-center text-gray-300 mb-2">Ваша Команда</h3>
                <div className="flex space-x-2">
                    {team.map((card) => {
                        const isStunned = stunnedTeam.some(c => c.instanceId === card.instanceId);
                        const isActiveAttacker = !isStunned && activeTeam.findIndex(c => c.instanceId === card.instanceId) === attackerIndex;
                        return (
                            <div key={card.instanceId} className={`w-16 transition-all duration-300 ${isStunned ? 'opacity-20 saturate-0' : ''} ${isActiveAttacker ? 'ring-2 ring-[color:var(--brand-accent)] scale-110' : ''}`}>
                                <img src={card.imageUrl} className="w-full" alt={card.name}/>
                            </div>
                        )
                    })}
                </div>
                 {currentAttacker && (
                    <div className="mt-2 text-center bg-black/30 p-2">
                        <p className="text-xs text-gray-400">СЕЙЧАС АТАКУЕТ</p>
                        <p className="font-bold text-white truncate">{currentAttacker.name}</p>
                        <div className="flex items-center justify-center text-[color:var(--brand-accent)] font-bold">
                            <StrengthIcon className="w-4 h-4 mr-1"/>
                            {currentAttacker.stats.strength}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Bottom Left Battle Log */}
            <div className="absolute bottom-4 left-4 bg-black/50 p-2 w-72 h-36 border-2 border-[color:var(--brand-accent)]/50">
                <div className="h-full text-xs overflow-auto font-mono flex flex-col-reverse text-left">
                    {battleLog.map((msg, i) => <p key={i} className={`p-1 ${i === 0 ? 'text-[color:var(--brand-accent)] bg-white/5' : 'text-gray-400'}`}>{msg}</p>)}
                </div>
            </div>


            <h2 className="text-4xl font-heading text-white mb-2">Цель: {currentEnemy.name}</h2>
            <p className="text-xl text-gray-400">Район: {district.name}</p>
            
            <RaidHealthBar current={currentHp} max={maxHp} />

            <div 
                className={`w-full max-w-sm cursor-pointer transition-opacity duration-500 ${isEnemyDying ? 'animate-enemy-death' : ''} ${isGettingHit ? 'animate-hit-shake' : ''}`}
                onClick={handleEnemyClick}
            >
                <CardComponent card={currentEnemy} />
            </div>

            <button onClick={() => onEndRaid(district.id, raidKills, raidEarnings, stunnedTeam.map(c => c.instanceId), killStats)} className="mt-8 bg-[color:var(--brand-warning)] hover:brightness-110 text-white font-bold py-3 px-8 text-xl transform active:scale-95">
                Завершить Рейд
            </button>
        </div>
    );
};

export default RaidInterface;