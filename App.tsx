import React, { useState, useCallback, useEffect } from 'react';
import { PlayerCard, Card, Rarity, Chest, Page, PlayerCurrencies } from './types';
import { RARITY_ORDER, updateAllTags, CHESTS } from './constants';
import Header from './components/Header';
import CollectionPage from './components/CollectionPage';
import OpenChestsPage from './components/OpenChestsPage';
import CraftingPage from './components/CraftingPage';
import ShopPage from './components/ShopPage';
import MarketplacePage from './components/MarketplacePage';
import DeveloperPage from './components/DeveloperPage';
import Modal from './components/Modal';
import * as db from './db';
import { ImageContext } from './context/ImageContext';


const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.Collection);
    const [playerCards, setPlayerCards] = useState<PlayerCard[]>([]);
    const [playerCurrencies, setPlayerCurrencies] = useState<PlayerCurrencies>({ fapCoins: 0, lustGems: 0 });
    const [allGameCards, setAllGameCards] = useState<Card[]>([]);
    
    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
    const [customImages, setCustomImages] = useState<Map<number, string>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial data loading from IndexedDB
    useEffect(() => {
        const loadGameData = async () => {
            try {
                setLoading(true);
                await db.initDB();
                const [gameCards, pCards, pCurrencies, images] = await Promise.all([
                    db.getGameCards(),
                    db.getPlayerCards(),
                    db.getPlayerCurrencies(),
                    db.getAllImages(),
                ]);
                setAllGameCards(gameCards);
                updateAllTags(gameCards); // Update tags based on DB
                setPlayerCards(pCards);
                setPlayerCurrencies(pCurrencies);
                setCustomImages(images);
            } catch (err) {
                console.error("Failed to load game data:", err);
                setError("Не удалось загрузить игровые данные. Попробуйте обновить страницу.");
            } finally {
                setLoading(false);
            }
        };
        loadGameData();
    }, []);

    const addCardsToCollection = async (newCards: Card[]) => {
        const newPlayerCards: PlayerCard[] = newCards.map(card => ({
            ...card,
            instanceId: crypto.randomUUID()
        }));
        await db.addPlayerCards(newPlayerCards);
        setPlayerCards(prev => [...prev, ...newPlayerCards]);
    };
    
    const getRandomCardByRarity = (rarity: Rarity): Card => {
        const cardsOfRarity = allGameCards.filter(c => c.rarity === rarity);
        if (cardsOfRarity.length === 0) {
            const commonCards = allGameCards.filter(c => c.rarity === Rarity.Common);
            return commonCards[Math.floor(Math.random() * commonCards.length)];
        }
        return cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
    };

    const openChest = useCallback(async (chest: Chest) => {
        const { cost, currency, cardCount, rarityChances } = chest;
        if (playerCurrencies[currency] < cost) {
            alert("Недостаточно средств!");
            return;
        }

        const newCurrencies = { ...playerCurrencies, [currency]: playerCurrencies[currency] - cost };
        await db.updatePlayerCurrencies(newCurrencies);
        setPlayerCurrencies(newCurrencies);

        const numCards = Math.floor(Math.random() * (cardCount[1] - cardCount[0] + 1)) + cardCount[0];
        const droppedCards: Card[] = [];

        for (let i = 0; i < numCards; i++) {
            const rand = Math.random();
            let cumulativeChance = 0;
            let chosenRarity: Rarity = Rarity.Common;

            const sortedChances = Object.entries(rarityChances)
                .sort(([rarityA], [rarityB]) => RARITY_ORDER.indexOf(rarityA as Rarity) - RARITY_ORDER.indexOf(rarityB as Rarity));

            for (const [rarity, chance] of sortedChances) {
                cumulativeChance += chance;
                if (rand <= cumulativeChance) {
                    chosenRarity = rarity as Rarity;
                    break;
                }
            }
            droppedCards.push(getRandomCardByRarity(chosenRarity));
        }

        await addCardsToCollection(droppedCards);
        setModalContent(<CollectionPage cards={droppedCards.map(c => ({...c, instanceId: 'modal-preview'}))} isModal={true} />);
    }, [playerCurrencies, allGameCards]);

    const craftCard = useCallback(async (cardId: number) => {
        const cardsToCraft = playerCards.filter(c => c.id === cardId);
        if (cardsToCraft.length < 5) return;

        const sourceCard = cardsToCraft[0];
        const currentRarityIndex = RARITY_ORDER.indexOf(sourceCard.rarity);
        if (currentRarityIndex >= RARITY_ORDER.length - 1) {
            alert("Нельзя улучшить карту максимальной редкости!");
            return;
        }

        const newRarity = RARITY_ORDER[currentRarityIndex + 1];
        const potentialNewCards = allGameCards.filter(c => c.rarity === newRarity);
        if (potentialNewCards.length === 0) {
            alert("Нет карт для создания следующей редкости!");
            return;
        }

        const newCard = potentialNewCards[Math.floor(Math.random() * potentialNewCards.length)];
        const newPlayerCard: PlayerCard = { ...newCard, instanceId: crypto.randomUUID() };
        
        const instanceIdsToRemove = cardsToCraft.slice(0, 5).map(c => c.instanceId);
        
        await db.removePlayerCards(instanceIdsToRemove);
        await db.addPlayerCards([newPlayerCard]);
        
        setPlayerCards(prev => [...prev.filter(c => !instanceIdsToRemove.includes(c.instanceId)), newPlayerCard]);
        
        alert(`Создана карта: ${newCard.name}!`);

    }, [playerCards, allGameCards]);

    const handleImageUpdate = useCallback(async (cardId: number, imageData: string) => {
        await db.setImage(cardId, imageData);
        setCustomImages(prev => new Map(prev).set(cardId, imageData));
    }, []);
    
    const handleGameCardUpdate = async (card: Card) => {
        await db.saveGameCard(card);
        const updatedCards = await db.getGameCards();
        setAllGameCards(updatedCards);
        updateAllTags(updatedCards);
    };

    const handleDeleteGameCard = async (cardId: number) => {
        await db.deleteGameCard(cardId);
        const updatedCards = await db.getGameCards();
        setAllGameCards(updatedCards);
        updateAllTags(updatedCards);
        // Also remove from player's collection if they own it
        setPlayerCards(prev => prev.filter(pc => pc.id !== cardId));
    };

    const renderPage = () => {
        switch (currentPage) {
            case Page.Collection:
                return <CollectionPage cards={playerCards} />;
            case Page.Chests:
                return <OpenChestsPage onOpenChest={openChest} />;
            case Page.Crafting:
                return <CraftingPage cards={playerCards} onCraft={craftCard} />;
            case Page.Shop:
                return <ShopPage currencies={playerCurrencies} setCurrencies={setPlayerCurrencies} />;
            case Page.Marketplace:
                return <MarketplacePage playerCards={playerCards} setPlayerCards={setPlayerCards} currencies={playerCurrencies} setCurrencies={setPlayerCurrencies} />;
            case Page.Developer:
                return <DeveloperPage 
                            allCards={allGameCards} 
                            onImageUpload={handleImageUpdate} 
                            onSaveCard={handleGameCardUpdate} 
                            onDeleteCard={handleDeleteGameCard} // Pass the new delete function
                        />;
            default:
                return <CollectionPage cards={playerCards} />;
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-[color:var(--brand-bg)] flex flex-col items-center justify-center text-[color:var(--brand-cream)]">
                <img src="./logo.png" alt="Fap Collection Logo" className="h-32 mb-4 animate-pulse" />
                <h1 className="text-5xl font-heading text-shadow-lg" style={{color: 'var(--brand-orange)'}}>Fap Collection</h1>
                <p className="text-lg mt-2 font-semibold">Загрузка данных...</p>
            </div>
        )
    }
    
    if(error){
        return <div className="min-h-screen bg-[color:var(--brand-bg)] flex items-center justify-center text-red-400 text-xl">{error}</div>
    }

    return (
        <ImageContext.Provider value={customImages}>
            <div className="min-h-screen bg-[color:var(--brand-bg)] text-[color:var(--brand-cream)] font-sans">
                <Header
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    fapCoins={playerCurrencies.fapCoins}
                    lustGems={playerCurrencies.lustGems}
                />
                <main className="p-4 md:p-8">
                    {renderPage()}
                </main>
                {modalContent && (
                    <Modal onClose={() => setModalContent(null)}>
                        <h2 className="text-4xl font-heading text-center mb-6 text-[color:var(--brand-orange)]">Новые Карты!</h2>
                        {modalContent}
                    </Modal>
                )}
            </div>
        </ImageContext.Provider>
    );
};

export default App;
