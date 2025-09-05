import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { PlayerCard, Card, PlayerCurrencies } from '../types';
import { updatePlayerCurrencies } from '../db';
import CardComponent from './CardComponent';
import { EddyIcon } from './IconComponents';

const DECK_SIZE = 5;
const PLAYER_MAX_HP = 500;
const OPPONENT_MAX_HP = 500;

interface BattlePageProps {
  playerCards: PlayerCard[];
  allGameCards: Card[];
  playerCurrencies: PlayerCurrencies;
  setPlayerCurrencies: React.Dispatch<React.SetStateAction<PlayerCurrencies>>;
}

type BattleStatus = 'idle' | 'deck_selection' | 'in_progress' | 'victory' | 'defeat' | 'draw';

const HealthBar: React.FC<{ current: number; max: number; label: string }> = ({ current, max, label }) => (
  <div className="w-full">
    <span className="text-lg font-bold text-white">{label}</span>
    <div className="w-full bg-gray-700 rounded-full h-6 border-2 border-gray-900 shadow-inner relative">
      <div
        className="bg-gradient-to-r from-red-500 to-red-700 h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.max(0, (current / max) * 100)}%` }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm drop-shadow-md">
        {current} / {max}
      </span>
    </div>
  </div>
);

const BattlePage: React.FC<BattlePageProps> = ({ playerCards, allGameCards, playerCurrencies, setPlayerCurrencies }) => {
  const [status, setStatus] = useState<BattleStatus>('idle');
  const [selectedDeck, setSelectedDeck] = useState<PlayerCard[]>([]);
  
  const [playerHp, setPlayerHp] = useState(PLAYER_MAX_HP);
  const [opponentHp, setOpponentHp] = useState(OPPONENT_MAX_HP);
  const [playerHand, setPlayerHand] = useState<PlayerCard[]>([]);
  const [opponentHand, setOpponentHand] = useState<Card[]>([]);
  const [turn, setTurn] = useState<'player' | 'opponent' | 'none'>('none');
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [reward, setReward] = useState(0);
  
  // New states for special effects
  const [attackEnhancement, setAttackEnhancement] = useState(0);
  const [isSecondHeartActive, setIsSecondHeartActive] = useState(false);


  const uniquePlayerCards = useMemo(() => {
    const unique = new Map<number, PlayerCard>();
    playerCards.forEach(card => {
      if (!unique.has(card.id)) {
        unique.set(card.id, card);
      }
    });
    return Array.from(unique.values());
  }, [playerCards]);

  const toggleCardInDeck = (card: PlayerCard) => {
    setSelectedDeck(prev => {
      const isInDeck = prev.some(c => c.instanceId === card.instanceId);
      if (isInDeck) {
        return prev.filter(c => c.instanceId !== card.instanceId);
      } else if (prev.length < DECK_SIZE) {
        return [...prev, card];
      }
      return prev;
    });
  };
  
  const addLog = useCallback((message: string) => {
      setBattleLog(prev => [message, ...prev.slice(0, 4)]);
  }, []);

  const handleOpponentTurn = useCallback(() => {
    if (opponentHand.length === 0) {
      if (playerHand.length === 0) {
        setStatus('draw');
      } else {
        setTurn('player');
      }
      return;
    }

    const attackCards = opponentHand.filter(c => c.role === 'attack');
    const supportCards = opponentHand.filter(c => c.role === 'support');
    
    let cardToPlay: Card | null = null;
    
    if (opponentHp < OPPONENT_MAX_HP * 0.4 && supportCards.length > 0) {
        cardToPlay = supportCards.reduce((best, current) => current.stats.healing > best.stats.healing ? current : best);
    } else if (attackCards.length > 0) {
        cardToPlay = attackCards.reduce((best, current) => current.stats.strength > best.stats.strength ? current : best);
    } else if (opponentHand.length > 0) {
        cardToPlay = opponentHand[0];
    }

    if (!cardToPlay) {
        addLog("У противника нет карт для хода.");
        setTurn('player');
        return;
    }

    let newPlayerHp = playerHp;

    if (cardToPlay.role === 'support') {
        const healAmount = cardToPlay.stats.healing;
        addLog(`Противник использует "${cardToPlay.name}", восстанавливая ${healAmount} здоровья.`);
        setOpponentHp(prev => Math.min(OPPONENT_MAX_HP, prev + healAmount));
    } else {
        const damage = cardToPlay.stats.strength;
        addLog(`Противник атакует картой "${cardToPlay.name}", нанося ${damage} урона.`);
        
        if (isSecondHeartActive && playerHp - damage <= 0) {
            newPlayerHp = 1;
            setIsSecondHeartActive(false);
            addLog("Имплант 'Второе Сердце' спасает вас от гибели!");
        } else {
            newPlayerHp = playerHp - damage;
        }
        
        setPlayerHp(newPlayerHp);
    }
    
    setOpponentHand(prev => prev.filter(c => c.id !== cardToPlay!.id));

    if (newPlayerHp <= 0) {
        setStatus('defeat');
    } else {
        setTurn('player');
    }

  }, [opponentHand, playerHand.length, opponentHp, playerHp, addLog, isSecondHeartActive]);


 const handlePlayerTurn = (playedCard: PlayerCard) => {
    if (turn !== 'player' || status !== 'in_progress') return;
    setTurn('none'); // Prevent multiple actions

    let nextOpponentHp = opponentHp;
    let nextPlayerHp = playerHp;
    let turnSkipped = false;

    // --- Apply main card effect ---
    if (playedCard.role === 'support') {
        nextPlayerHp = Math.min(PLAYER_MAX_HP, playerHp + playedCard.stats.healing);
        addLog(`Вы используете "${playedCard.name}", восстанавливая ${playedCard.stats.healing} здоровья.`);
    } else {
        const totalDamage = playedCard.stats.strength + attackEnhancement;
        if (attackEnhancement > 0) {
            addLog(`'Black Lace' усиливает атаку на ${attackEnhancement}!`);
            setAttackEnhancement(0);
        }
        nextOpponentHp = opponentHp - totalDamage;
        addLog(`Вы атакуете картой "${playedCard.name}", нанося ${totalDamage} урона.`);
    }

    // --- Apply special effects activation ---
    switch (playedCard.specialEffect) {
        case 'skip_turn':
            addLog("Вы вызываете системный сбой! Противник пропустит ход.");
            turnSkipped = true;
            break;
        case 'steal_card':
            setOpponentHand(prevOpponentHand => {
                if (prevOpponentHand.length > 0) {
                    const stolenCardIndex = Math.floor(Math.random() * prevOpponentHand.length);
                    const stolenCard = prevOpponentHand[stolenCardIndex];
                    const remainingOpponentHand = prevOpponentHand.filter((_, i) => i !== stolenCardIndex);
                    
                    setPlayerHand(prevPlayerHand => [...prevPlayerHand, { ...stolenCard, instanceId: crypto.randomUUID() }]);
                    addLog(`Вы взломали систему и украли карту: "${stolenCard.name}"!`);
                    return remainingOpponentHand;
                } else {
                    addLog("Вы пытались украсть карту, но у противника их не осталось.");
                    return prevOpponentHand;
                }
            });
            break;
        case 'enhance_next_attack':
            setAttackEnhancement(playedCard.effectValue || 0);
            addLog(`Вы использовали 'Black Lace'. Следующая атака будет усилена.`);
            break;
        case 'second_heart':
            setIsSecondHeartActive(true);
            addLog(`Имплант 'Второе Сердце' активирован.`);
            break;
    }

    // Update HP and hand, then check for win/loss
    setPlayerHp(nextPlayerHp);
    setOpponentHp(nextOpponentHp);
    const updatedPlayerHand = playerHand.filter(c => c.instanceId !== playedCard.instanceId);
    setPlayerHand(updatedPlayerHand);

    if (nextOpponentHp <= 0) {
        const calculatedReward = Math.floor(Math.random() * 150) + 50;
        setReward(calculatedReward);
        const newCurrencies = { ...playerCurrencies, eddies: playerCurrencies.eddies + calculatedReward };
        updatePlayerCurrencies(newCurrencies).then(() => setPlayerCurrencies(newCurrencies));
        setStatus('victory');
        return;
    }

    if (updatedPlayerHand.length === 0 && opponentHand.length === 0) {
        setStatus('draw');
        return;
    }

    // Transition to next turn
    if (turnSkipped) {
      setTimeout(() => setTurn('player'), 500); // Give log time to show, then skip back to player
    } else {
      setTurn('opponent');
    }
};

  useEffect(() => {
      if (turn === 'opponent' && status === 'in_progress') {
          setTimeout(() => handleOpponentTurn(), 1500);
      }
  }, [turn, status, handleOpponentTurn]);
  
  const startBattle = () => {
    setPlayerHp(PLAYER_MAX_HP);
    setOpponentHp(OPPONENT_MAX_HP);
    setPlayerHand(selectedDeck);
    
    // Reset effects
    setAttackEnhancement(0);
    setIsSecondHeartActive(false);

    // Generate opponent deck
    const opponentDeck: Card[] = [];
    for (let i = 0; i < DECK_SIZE; i++) {
        const randomIndex = Math.floor(Math.random() * allGameCards.length);
        opponentDeck.push(allGameCards[randomIndex]);
    }
    setOpponentHand(opponentDeck);
    setBattleLog(['Бой начинается!']);
    setTurn('player');
    setStatus('in_progress');
  };

  const resetGame = () => {
    setStatus('idle');
    setSelectedDeck([]);
    setBattleLog([]);
    setTurn('none');
  };

  if (status === 'idle') {
    return (
      <div className="text-center animate-fade-in">
        <h2 className="text-5xl font-heading text-[color:var(--brand-orange)]">Боевая Арена</h2>
        <p className="text-xl text-gray-300 my-6">Соберите колоду из 5 карт и сразитесь за славу и Эдди!</p>
        <button
          onClick={() => setStatus('deck_selection')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-2xl transition-transform transform hover:scale-105"
        >
          Начать Бой
        </button>
      </div>
    );
  }

  if (status === 'deck_selection') {
    return (
      <div className="animate-fade-in">
        <h2 className="text-4xl font-heading text-[color:var(--brand-orange)] text-center mb-4">Выберите свою колоду ({selectedDeck.length}/{DECK_SIZE})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {uniquePlayerCards.map(card => {
            const isSelected = selectedDeck.some(c => c.instanceId === card.instanceId);
            return (
              <div key={card.instanceId} className={`relative rounded-3xl transition-all duration-300 ${isSelected ? 'scale-95 opacity-50' : ''}`}>
                <CardComponent card={card} onClick={() => toggleCardInDeck(card)} />
                {isSelected && <div className="absolute inset-0 bg-black/70 rounded-3xl flex items-center justify-center"><div className="text-orange-500 text-6xl font-black">✓</div></div>}
              </div>
            );
          })}
        </div>
        {selectedDeck.length === DECK_SIZE && (
          <div className="text-center mt-8">
            <button
              onClick={startBattle}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-full text-2xl animate-pulse"
            >
              В Бой!
            </button>
          </div>
        )}
      </div>
    );
  }
  
  if (status === 'victory' || status === 'defeat' || status === 'draw') {
    let message = '';
    let messageClass = '';
    switch(status) {
        case 'victory':
            message = 'Победа!';
            messageClass = 'text-green-400';
            break;
        case 'defeat':
            message = 'Поражение';
            messageClass = 'text-red-500';
            break;
        case 'draw':
            message = 'Ничья';
            messageClass = 'text-gray-400';
            break;
    }

    return (
        <div className="text-center animate-fade-in flex flex-col items-center justify-center h-full">
            <h2 className={`text-7xl font-heading mb-4 ${messageClass}`}>
                {message}
            </h2>
            {status === 'victory' && (
                <div className="flex items-center text-2xl text-yellow-400 mb-6 bg-black/30 p-4 rounded-xl">
                    <EddyIcon className="w-8 h-8 mr-2"/>
                    <span>Вы получили {reward} Эдди!</span>
                </div>
            )}
            {status === 'draw' && (
                 <p className="text-xl text-gray-300 mb-6">У обоих игроков закончились карты.</p>
            )}
            <button
                onClick={resetGame}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-transform transform hover:scale-105"
            >
                Сыграть снова
            </button>
        </div>
    )
  }

  return (
    <div className="animate-fade-in flex flex-col h-[calc(100vh-150px)] max-w-7xl mx-auto">
        {/* Opponent's Side */}
        <div className="flex-1 flex flex-col items-center justify-end p-4">
            <HealthBar current={opponentHp} max={OPPONENT_MAX_HP} label="Противник" />
            <div className="flex justify-center space-x-[-50px] mt-4 h-48">
                {opponentHand.map((card, i) => (
                    <div key={card.id + '-' + i} className="w-28 aspect-[2/3] bg-gray-800 rounded-xl border-2 border-purple-500 transform rotate-[-3deg] shadow-lg"></div>
                ))}
            </div>
        </div>

        {/* Center Log */}
        <div className="h-24 p-2">
            <div className="bg-black/30 h-full rounded-lg p-2 text-center text-sm overflow-auto font-mono flex flex-col-reverse">
                {battleLog.map((msg, i) => <p key={i} className={i === 0 ? 'text-yellow-300' : 'text-gray-400'}>{msg}</p>)}
            </div>
        </div>

        {/* Player's Side */}
        <div className="flex-1 flex flex-col items-center justify-start p-4">
            <div className="flex justify-center space-x-[-20px] mb-4 h-52">
                {playerHand.map(card => (
                    <CardComponent 
                        key={card.instanceId} 
                        card={card}
                        size="small"
                        className={`w-32 transition-all duration-300 ${turn === 'player' ? 'cursor-pointer hover:-translate-y-4 hover:scale-110' : 'opacity-70 saturate-50'}`}
                        onClick={() => handlePlayerTurn(card)}
                    />
                ))}
            </div>
             <HealthBar current={playerHp} max={PLAYER_MAX_HP} label="Вы" />
        </div>
    </div>
  );
};

export default BattlePage;