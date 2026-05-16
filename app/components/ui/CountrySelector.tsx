'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MarketCode, markets, useMarket } from '@/lib/market';

type CountrySelectorProps = {
  mobile?: boolean;
};

export default function CountrySelector({ mobile = false }: CountrySelectorProps) {
  const { market, setMarket } = useMarket();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (code: MarketCode) => {
    setMarket(code);
    setIsOpen(false);
  };

  return (
    <div className={`qorapp-country-select-wrap ${mobile ? 'is-mobile' : ''}`}>
      <button
        type="button"
        className="qorapp-country-select"
        aria-label={`Selected country: ${market.country}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span>{market.code}</span>
        <ChevronDown size={15} />
      </button>

      {isOpen && (
        <div className="qorapp-country-menu">
          {markets.map((countryMarket) => (
            <button
              key={countryMarket.code}
              type="button"
              className={`qorapp-country-option ${countryMarket.code === market.code ? 'is-selected' : ''}`}
              onClick={() => handleSelect(countryMarket.code)}
            >
              <span className="qorapp-country-code">{countryMarket.code}</span>
              <span className="qorapp-country-name">{countryMarket.country}</span>
              <span className="qorapp-country-currency">{countryMarket.currency}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
