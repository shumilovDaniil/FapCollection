import { FixerDistrict } from '../types';

export const FIXER_DISTRICTS: FixerDistrict[] = [
    {
        id: 'watson',
        name: 'Уотсон',
        description: "Район уличных банд и мелких сошек. Легкая добыча для начинающего наемника.",
        imageUrl: 'https://i.imgur.com/gK2bYp8.jpeg',
        hpRange: [100, 500],
        rewardRange: [5, 20],
        stunChance: 0.15, // 15% chance
    },
    {
        id: 'pacifica',
        name: 'Пасифика',
        description: "Территория 'Voodoo Boys' и 'Животных'. Опасные противники, но и награда выше.",
        imageUrl: 'https://i.imgur.com/h5vYp5E.jpeg',
        hpRange: [1000, 5000],
        rewardRange: [25, 100],
        stunChance: 0.30, // 30% chance
        unlockRequirement: {
            districtId: 'watson',
            kills: 100,
        },
    },
    {
        id: 'city_center',
        name: 'Центр Города',
        description: "Сердце корпоративной мощи. Элитные охранники 'Арасаки' и 'Милитеха'. Только для профессионалов.",
        imageUrl: 'https://i.imgur.com/Tq9Y6ZJ.jpeg',
        hpRange: [10000, 50000],
        rewardRange: [150, 600],
        stunChance: 0.50, // 50% chance
        unlockRequirement: {
            districtId: 'pacifica',
            kills: 250,
        },
    },
];