import React, { useState, useContext, useEffect, useMemo } from 'react';
import { ALL_TAGS } from '../constants';
import { ImageContext } from '../context/ImageContext';
import { Card, Rarity, FetishTag, CardStats } from '../types';

interface DeveloperPageProps {
    allCards: Card[];
    onImageUpload: (cardId: number, imageData: string) => void;
    onSaveCard: (card: Card) => Promise<void>;
}

const NEW_CARD_TEMPLATE: Omit<Card, 'id'> = {
    name: '',
    rarity: Rarity.Common,
    imageUrl: 'https://placehold.co/400x600/1a202c/ec4899/png?text=New+Card',
    effect: '',
    tags: [],
    stats: {
        strength: 10,
        agility: 10,
        charisma: 10,
        stamina: 10,
        rage: 10,
    }
}

const DeveloperPage: React.FC<DeveloperPageProps> = ({ allCards, onImageUpload, onSaveCard }) => {
    const customImages = useContext(ImageContext);
    const [selectedCardId, setSelectedCardId] = useState<string>('none');
    const [editableCard, setEditableCard] = useState<Card | null>(null);
    
    const sortedAvailableCards = useMemo(() => 
        [...allCards].sort((a, b) => a.name.localeCompare(b.name)),
        [allCards]
    );

    const newCardTemplate = useMemo((): Card => ({
        ...NEW_CARD_TEMPLATE,
        id: Math.max(0, ...allCards.map(c => c.id)) + 1
    }), [allCards]);


    useEffect(() => {
        if (selectedCardId === 'none') {
            setEditableCard(null);
        } else if (selectedCardId === 'new') {
            setEditableCard(newCardTemplate);
        } else {
            const cardToEdit = allCards.find(c => c.id === parseInt(selectedCardId));
            if (cardToEdit) {
                setEditableCard({ ...cardToEdit });
            }
        }
    }, [selectedCardId, newCardTemplate, allCards]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editableCard) return;
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const imageDataUrl = event.target?.result as string;
            if (imageDataUrl) {
                if(selectedCardId !== 'new') {
                    onImageUpload(editableCard.id, imageDataUrl);
                }
                setEditableCard(prev => prev ? { ...prev, imageUrl: imageDataUrl } : null);
            }
        };
        reader.onerror = (error) => {
            console.error("Error reading file:", error);
            alert("Не удалось прочитать файл.");
        }
        reader.readAsDataURL(file);
    };

    const handleInputChange = (field: keyof Card, value: any) => {
        setEditableCard(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleStatChange = (stat: keyof CardStats, value: string) => {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) && value !== "") return;
        setEditableCard(prev => prev ? { ...prev, stats: { ...prev.stats, [stat]: isNaN(numValue) ? 0 : numValue } } : null);
    };

    const handleTagChange = (tag: FetishTag) => {
        setEditableCard(prev => {
            if (!prev) return null;
            const newTags = prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag];
            return { ...prev, tags: newTags };
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!editableCard) return;
        
        await onSaveCard(editableCard);
        
        if (selectedCardId === 'new') {
            alert(`Карта "${editableCard.name}" создана и сохранена в БД!`);
            // After creation, switch to editing this new card
            setSelectedCardId(String(editableCard.id));
        } else {
            alert(`Карта "${editableCard.name}" была сохранена в БД!`);
        }
    };

    const inputClass = "w-full bg-[color:var(--brand-bg)] border border-[color:var(--brand-teal)]/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-orange)] transition";
    const labelClass = "block text-sm font-bold text-[color:var(--brand-teal)] mb-1 uppercase tracking-wider";

    return (
        <div className="animate-fade-in">
            <h2 className="text-5xl font-heading mb-8 text-[color:var(--brand-orange)] text-center">Меню Разработчика</h2>
            
            <div className="max-w-4xl mx-auto mb-8">
                 <label htmlFor="card-select" className={labelClass}>Выберите карту для редактирования или создайте новую</label>
                 <select 
                    id="card-select"
                    value={selectedCardId}
                    onChange={e => setSelectedCardId(e.target.value)}
                    className={inputClass}
                 >
                    <option value="none">-- Не выбрано --</option>
                    <option value="new">++ Создать новую карту ++</option>
                    {sortedAvailableCards.map(card => (
                        <option key={card.id} value={card.id}>{card.name} ({card.rarity})</option>
                    ))}
                 </select>
            </div>

            {editableCard && (
                <form onSubmit={handleSubmit} className="bg-[color:var(--brand-panel)] p-6 rounded-xl border border-[color:var(--brand-teal)]/20 space-y-6 max-w-4xl mx-auto shadow-2xl">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Image Section */}
                        <div className="w-full md:w-1/3 flex-shrink-0">
                             <img src={customImages.get(editableCard.id) || editableCard.imageUrl} alt="Card Preview" className="aspect-[2/3] w-full object-cover rounded-md bg-gray-700 mb-4 border-2 border-[color:var(--brand-teal)]/30" />
                             <label htmlFor="upload-image" className="cursor-pointer w-full block text-center bg-teal-500 hover:bg-teal-600 text-[color:var(--brand-bg)] font-bold py-2 px-4 rounded-lg transition-colors">
                                Загрузить
                            </label>
                            <input
                                id="upload-image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* Details Section */}
                        <div className="w-full md:w-2/3 space-y-4">
                            <div>
                                <label htmlFor="card-name" className={labelClass}>Название</label>
                                <input type="text" id="card-name" value={editableCard.name} onChange={e => handleInputChange('name', e.target.value)} className={inputClass} required />
                            </div>
                            <div>
                                <label htmlFor="card-rarity" className={labelClass}>Редкость</label>
                                <select id="card-rarity" value={editableCard.rarity} onChange={e => handleInputChange('rarity', e.target.value as Rarity)} className={inputClass}>
                                    {Object.values(Rarity).map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                             <div>
                                <label htmlFor="card-effect" className={labelClass}>Эффект</label>
                                <textarea id="card-effect" value={editableCard.effect} onChange={e => handleInputChange('effect', e.target.value)} className={inputClass} rows={3}></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Tags Section */}
                    <div>
                        <label className={labelClass}>Теги</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-4 bg-[color:var(--brand-bg)] rounded-lg">
                            {ALL_TAGS.map(tag => (
                                <label key={tag} className="flex items-center space-x-2 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={editableCard.tags.includes(tag)}
                                        onChange={() => handleTagChange(tag)}
                                        className="form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-[color:var(--brand-orange)] focus:ring-[color:var(--brand-orange)]/50"
                                    />
                                    <span className="text-gray-200">{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div>
                        <label className={labelClass}>Параметры</label>
                         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {(Object.keys(editableCard.stats) as Array<keyof CardStats>).map(statKey => (
                                <div key={statKey}>
                                    <label htmlFor={`stat-${statKey}`} className="capitalize block text-sm font-medium text-gray-400 mb-1">{statKey}</label>
                                    <input 
                                        type="number" 
                                        id={`stat-${statKey}`}
                                        value={editableCard.stats[statKey]}
                                        onChange={e => handleStatChange(statKey, e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            ))}
                         </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-[color:var(--brand-orange)] hover:brightness-110 text-[color:var(--brand-bg)] font-bold py-3 px-6 rounded-lg transition-colors text-xl transform active:scale-95 shadow-lg shadow-[color:var(--brand-orange)]/20">
                       {selectedCardId === 'new' ? 'Создать Карту' : 'Сохранить Изменения'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default DeveloperPage;