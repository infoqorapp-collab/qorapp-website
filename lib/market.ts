'use client';

import { useSyncExternalStore } from 'react';

export type MarketCode = 'RW' | 'US' | 'GB' | 'EU' | 'KE' | 'NG' | 'ZA' | 'UG' | 'TZ';

export type Market = {
  code: MarketCode;
  country: string;
  label: string;
  currency: string;
  locale: string;
  rateFromUsd: number;
  supportPhone: string;
  supportEmail: string;
  officeLabel: string;
};

export const MARKET_STORAGE_KEY = 'qorapp-market';
export const MARKET_CHANGE_EVENT = 'qorapp-market-change';

export const markets: Market[] = [
  {
    code: 'RW',
    country: 'Rwanda',
    label: 'Rwanda - RWF',
    currency: 'RWF',
    locale: 'rw-RW',
    rateFromUsd: 1400,
    supportPhone: '+250791 801 416',
    supportEmail: 'infoqorapp@gmail.com',
    officeLabel: 'Kigali, Rwanda',
  },
  {
    code: 'US',
    country: 'United States',
    label: 'United States - USD',
    currency: 'USD',
    locale: 'en-US',
    rateFromUsd: 1,
    supportPhone: '+250791 801 416',
    supportEmail: 'infoqorapp@gmail.com',
    officeLabel: 'Global support desk',
  },
  {
    code: 'GB',
    country: 'United Kingdom',
    label: 'United Kingdom - GBP',
    currency: 'GBP',
    locale: 'en-GB',
    rateFromUsd: 0.79,
    supportPhone: '+250791 801 416',
    supportEmail: 'infoqorapp@gmail.com',
    officeLabel: 'Global support desk',
  },
  {
    code: 'EU',
    country: 'European Union',
    label: 'European Union - EUR',
    currency: 'EUR',
    locale: 'de-DE',
    rateFromUsd: 0.92,
    supportPhone: '+250791 801 416',
    supportEmail: 'infoqorapp@gmail.com',
    officeLabel: 'Global support desk',
  },
  {
    code: 'KE',
    country: 'Kenya',
    label: 'Kenya - KES',
    currency: 'KES',
    locale: 'en-KE',
    rateFromUsd: 130,
    supportPhone: '+250791 801 416',
    supportEmail: 'infoqorapp@gmail.com',
    officeLabel: 'Nairobi, Kenya',
  },
  {
    code: 'NG',
    country: 'Nigeria',
    label: 'Nigeria - NGN',
    currency: 'NGN',
    locale: 'en-NG',
    rateFromUsd: 1500,
    supportPhone: '+250791 801 416',
    supportEmail: 'infoqorapp@gmail.com',
    officeLabel: 'Lagos, Nigeria',
  },
  {
    code: 'ZA',
    country: 'South Africa',
    label: 'South Africa - ZAR',
    currency: 'ZAR',
    locale: 'en-ZA',
    rateFromUsd: 18.5,
    supportPhone: '+250791 801 416',
    supportEmail: 'infoqorapp@gmail.com',
    officeLabel: 'Johannesburg, South Africa',
  },
  {
    code: 'UG',
    country: 'Uganda',
    label: 'Uganda - UGX',
    currency: 'UGX',
    locale: 'en-UG',
    rateFromUsd: 3800,
    supportPhone: '+250791 801 416',
    supportEmail: 'infoqorapp@gmail.com',
    officeLabel: 'Kampala, Uganda',
  },
  {
    code: 'TZ',
    country: 'Tanzania',
    label: 'Tanzania - TZS',
    currency: 'TZS',
    locale: 'en-TZ',
    rateFromUsd: 2600,
    supportPhone: '+250791 801 416',
    supportEmail: 'infoqorapp@gmail.com',
    officeLabel: 'Dar es Salaam, Tanzania',
  },
];

export const defaultMarket = markets[0];

export function getMarket(code?: string | null) {
  return markets.find((market) => market.code === code) ?? defaultMarket;
}

export function formatMarketMoney(usdAmount: number, market: Market) {
  const convertedAmount = usdAmount * market.rateFromUsd;
  const hasDecimals = market.currency !== 'RWF' && market.currency !== 'UGX' && market.currency !== 'TZS';
  const fixedAmount = hasDecimals ? convertedAmount.toFixed(2) : Math.round(convertedAmount).toString();
  const [whole, decimal] = fixedAmount.split('.');
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${market.currency} ${decimal ? `${formattedWhole}.${decimal}` : formattedWhole}`;
}

export function marketAmountToUsd(marketAmount: number, market: Market) {
  return marketAmount / market.rateFromUsd;
}

function getMarketSnapshot() {
  if (typeof window === 'undefined') {
    return defaultMarket.code;
  }

  return getMarket(window.localStorage.getItem(MARKET_STORAGE_KEY)).code;
}

function getServerMarketSnapshot() {
  return defaultMarket.code;
}

function subscribeToMarketChange(onStoreChange: () => void) {
  window.addEventListener(MARKET_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener(MARKET_CHANGE_EVENT, onStoreChange);
  };
}

export function useMarket() {
  const marketCode = useSyncExternalStore(subscribeToMarketChange, getMarketSnapshot, getServerMarketSnapshot);

  const setMarket = (code: MarketCode) => {
    const nextMarket = getMarket(code);
    window.localStorage.setItem(MARKET_STORAGE_KEY, nextMarket.code);
    window.dispatchEvent(new CustomEvent(MARKET_CHANGE_EVENT, { detail: nextMarket.code }));
  };

  return { market: getMarket(marketCode), setMarket };
}
