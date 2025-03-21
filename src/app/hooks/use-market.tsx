import { useState, useEffect, createContext, useContext } from "react";
import { BankImpl } from "../model/bank-impl";
import { MarketImpl } from "../model/market-impl";
import { generateRandomCurrentAccountProduct, Market } from "../model/bank-interface";

type MarketContextProps = {
    market: Market;
    nextDay: () => void;
};

const MarketContext = createContext<MarketContextProps>({
    market: MarketImpl.newMarket("Lancashire Market", 10, new BankImpl("Lancaster Bank", generateRandomCurrentAccountProduct()), 4),
    nextDay: () => {}
});

export const MarketProvider = ({ children }) => {
    const [market, setMarket] = useState<Market>(MarketImpl.newMarket("Lancashire Market", 10, 
        new BankImpl("Lancaster Bank", generateRandomCurrentAccountProduct()), 4
    ));

    const nextDay = () => {
        console.log('next day');
        const newMarket = market.clone();
        newMarket.nextDay();
        setMarket(newMarket);
    };

    return <MarketContext.Provider value={{ market, nextDay }}>{children}</MarketContext.Provider>;
};

const useMarket = () => useContext(MarketContext);

export default useMarket;