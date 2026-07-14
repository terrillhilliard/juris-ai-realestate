export interface Listing {
  id: string;
  img: string;
  city: string;
  price: string;
  headline: string;
  beds: number;
  baths: number;
  sqft: string;
  lot: string;
  year: number;
}

/** Illustrative luxury listings across Laurie's East Bay markets. */
export const LISTINGS: Listing[] = [
  {
    id: 'l1',
    img: '/homes/home-1.jpg',
    city: 'Lafayette',
    price: '$2,400,000',
    headline: 'Hillside modern with infinity pool',
    beds: 5,
    baths: 4,
    sqft: '4,200',
    lot: '0.9 ac',
    year: 2019,
  },
  {
    id: 'l2',
    img: '/homes/home-2.jpg',
    city: 'Clayton',
    price: '$1,650,000',
    headline: "Warm contemporary at Mt. Diablo's foot",
    beds: 4,
    baths: 3,
    sqft: '3,100',
    lot: '0.5 ac',
    year: 2015,
  },
  {
    id: 'l3',
    img: '/homes/home-3.jpg',
    city: 'Walnut Creek',
    price: '$1,950,000',
    headline: 'Architectural retreat under the oaks',
    beds: 4,
    baths: 4,
    sqft: '3,600',
    lot: '0.6 ac',
    year: 2021,
  },
  {
    id: 'l4',
    img: '/homes/home-4.jpg',
    city: 'Lafayette',
    price: '$2,800,000',
    headline: 'Glass-and-stone estate with valley views',
    beds: 5,
    baths: 5,
    sqft: '4,800',
    lot: '1.2 ac',
    year: 2020,
  },
  {
    id: 'l5',
    img: '/homes/home-5.jpg',
    city: 'Pleasant Hill',
    price: '$1,450,000',
    headline: 'Classic shingle home, wraparound porch',
    beds: 4,
    baths: 3,
    sqft: '3,000',
    lot: '0.4 ac',
    year: 2008,
  },
  {
    id: 'l6',
    img: '/homes/home-6.jpg',
    city: 'Walnut Creek',
    price: '$2,100,000',
    headline: 'Resort-style living, downtown-close',
    beds: 4,
    baths: 3,
    sqft: '3,400',
    lot: '0.5 ac',
    year: 2017,
  },
];
