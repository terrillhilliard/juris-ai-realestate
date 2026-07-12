/** Illustrative East Bay market snapshots for the 3D skyline. Not live data. */
export interface CityMarket {
  id: string;
  name: string;
  medianPrice: number; // USD, illustrative
  daysOnMarket: number;
  vibe: string;
  color: string;
  height: number; // normalized 3D bar height
}

export const CITY_MARKETS: CityMarket[] = [
  {
    id: 'lafayette',
    name: 'Lafayette',
    medianPrice: 1_900_000,
    daysOnMarket: 12,
    vibe: 'Top schools · wooded hills',
    color: '#C8A26A',
    height: 1.9,
  },
  {
    id: 'walnut-creek',
    name: 'Walnut Creek',
    medianPrice: 1_250_000,
    daysOnMarket: 14,
    vibe: 'Downtown living · BART access',
    color: '#FF5A6E',
    height: 1.5,
  },
  {
    id: 'clayton',
    name: 'Clayton',
    medianPrice: 1_100_000,
    daysOnMarket: 18,
    vibe: 'Small-town charm · Mt. Diablo views',
    color: '#E8E6EA',
    height: 1.35,
  },
  {
    id: 'pleasant-hill',
    name: 'Pleasant Hill',
    medianPrice: 975_000,
    daysOnMarket: 13,
    vibe: 'Family neighborhoods · parks',
    color: '#4ade80',
    height: 1.2,
  },
  {
    id: 'martinez',
    name: 'Martinez',
    medianPrice: 850_000,
    daysOnMarket: 16,
    vibe: 'Historic waterfront · value',
    color: '#FF5A6E',
    height: 1.05,
  },
  {
    id: 'concord',
    name: 'Concord',
    medianPrice: 780_000,
    daysOnMarket: 15,
    vibe: 'First-time buyer friendly',
    color: '#C8A26A',
    height: 0.95,
  },
];
