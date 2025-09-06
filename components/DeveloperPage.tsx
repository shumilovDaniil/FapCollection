import React, { useState, useContext, useEffect, useMemo } from 'react';
import { ImageContext } from '../context/ImageContext';
import { Card, Rarity, CardStats, CardRole, SpecialEffect } from '../types';

interface DeveloperPageProps {
    allCards: Card[];
    onImageUpload: (cardId: number, imageData: string) => void;
    onSaveCard: (card: Card) => Promise<void>;
    onDeleteCard: (cardId: number) => Promise<void>;
}

const NEW_CARD_TEMPLATE: Omit<Card, 'id'> = {
    name: '',
    rarity: Rarity.Common,
    imageUrl: 'https://placehold.co/400x600/1a202c/ec4899/png?text=New+Card',
    effect: '',
    role: 'attack',
    stats: {
        strength: 10,
        healing: 0,
    }
}

const DeveloperPage: React.FC<DeveloperPageProps> = (props) => {
    const { allCards, onImageUpload, onSaveCard, onDeleteCard } = props;
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

    const handleInputChange = (field: keyof Card | 'specialEffect', value: any) => {
        if (field === 'specialEffect') {
            setEditableCard(prev => {
                if (!prev) return null;
                const newCard = {...prev};
                if (value === 'none') {
                    delete newCard.specialEffect;
                    delete newCard.effectValue;
                } else {
                    newCard.specialEffect = value;
                    if (value !== 'enhance_next_attack') {
                        delete newCard.effectValue;
                    }
                }
                return newCard;
            });
        } else {
            setEditableCard(prev => prev ? { ...prev, [field]: value } : null);
        }
    };
    

    const handleStatChange = (stat: keyof CardStats, value: string) => {
        const numValue = parseInt(value, 10);
        if (isNaN(numValue) && value !== "") return;
        setEditableCard(prev => prev ? { ...prev, stats: { ...prev.stats, [stat]: isNaN(numValue) ? 0 : numValue } } : null);
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

    const handleDeleteCard = async () => {
        if (!editableCard || selectedCardId === 'new' || selectedCardId === 'none') {
            alert("Пожалуйста, выберите существующую карту для удаления.");
            return;
        }

        if (window.confirm(`Вы уверены, что хотите удалить карту "${editableCard.name}"? Это действие необратимо.`)) {
            try {
                await onDeleteCard(editableCard.id);
                alert(`Карта "${editableCard.name}" успешно удалена.`);
                setSelectedCardId('none');
                setEditableCard(null);
            } catch (error) {
                console.error("Ошибка при удалении карты:", error);
                alert("Не удалось удалить карту.");
            }
        }
    };

    const inputClass = "w-full bg-gray-800 border border-[color:var(--brand-accent)]/50 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)] transition";
    const labelClass = "block text-sm font-bold text-[color:var(--brand-accent)] mb-1 uppercase tracking-wider";

    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-heading mb-8 text-[color:var(--brand-accent)] text-center">Меню Разработчика</h2>
            
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
                <form onSubmit={handleSubmit} className="bg-[color:var(--brand-panel)] p-6 border border-[color:var(--brand-accent)]/50 space-y-6 max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Image Section */}
                        <div className="w-full md:w-1/3 flex-shrink-0">
                             <img src={customImages.get(editableCard.id) || editableCard.imageUrl} alt="Card Preview" className="aspect-[2/3] w-full object-cover bg-gray-700 mb-4 border-2 border-gray-600" />
                             <label htmlFor="upload-image" className="cursor-pointer w-full block text-center bg-[color:var(--brand-accent)] hover:bg-[color:var(--brand-warning)] text-black font-bold py-2 px-4 transition-colors">
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
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="card-rarity" className={labelClass}>Редкость</label>
                                    <select id="card-rarity" value={editableCard.rarity} onChange={e => handleInputChange('rarity', e.target.value as Rarity)} className={inputClass}>
                                        {Object.values(Rarity).map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="card-role" className={labelClass}>Роль</label>
                                    <select id="card-role" value={editableCard.role} onChange={e => handleInputChange('role', e.target.value as CardRole)} className={inputClass}>
                                        <option value="attack">Атака</option>
                                        <option value="support">Поддержка</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="card-special-effect" className={labelClass}>Спецэффект</label>
                                <select id="card-special-effect" value={editableCard.specialEffect || 'none'} onChange={e => handleInputChange('specialEffect', e.target.value as SpecialEffect | 'none')} className={inputClass}>
                                    <option value="none">Нет</option>
                                    <option value="skip_turn">Пропуск хода</option>
                                    <option value="steal_card">Кража карты</option>
                                    <option value="enhance_next_attack">Усиление атаки</option>
                                    <option value="second_heart">Второе сердце</option>
                                </select>
                            </div>
                             {editableCard.specialEffect === 'enhance_next_attack' && (
                                <div>
                                    <label htmlFor="card-effect-value" className={labelClass}>Значение усиления</label>
                                    <input type="number" id="card-effect-value" value={editableCard.effectValue || ''} onChange={e => handleInputChange('effectValue', parseInt(e.target.value, 10) || 0)} className={inputClass} />
                                </div>
                            )}
                             <div>
                                <label htmlFor="card-effect" className={labelClass}>Эффект</label>
                                <textarea id="card-effect" value={editableCard.effect} onChange={e => handleInputChange('effect', e.target.value)} className={inputClass} rows={2}></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div>
                        <label className={labelClass}>Параметры</label>
                         <div className="grid grid-cols-2 gap-4">
                            {(['strength', 'healing'] as Array<keyof CardStats>).map(statKey => (
                                <div key={statKey}>
                                    <label htmlFor={`stat-${statKey}`} className="capitalize block text-sm font-medium text-gray-400 mb-1">{statKey === 'strength' ? 'Сила' : 'Исцеление'}</label>
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
                    
                    <div className="flex gap-4">
                        <button type="submit" className="flex-grow bg-[color:var(--brand-accent)] hover:bg-[color:var(--brand-warning)] text-black font-bold py-3 px-6 transition-colors text-xl transform active:scale-95">
                           {selectedCardId === 'new' ? 'Создать Карту' : 'Сохранить Изменения'}
                        </button>
                        {selectedCardId !== 'new' && selectedCardId !== 'none' && (
                            <button 
                                type="button" 
                                onClick={handleDeleteCard} 
                                className="flex-grow bg-[color:var(--brand-warning)] hover:brightness-125 text-white font-bold py-3 px-6 transition-colors text-xl transform active:scale-95"
                            >
                                Удалить Карту
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default DeveloperPage;