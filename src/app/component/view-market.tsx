import { ReactNode, useEffect, useState } from "react";
import { Market } from "../model/bank-interface";
import Calendar from "./calendar";
import CurrentAccountProductTable from "./current-account-product-table";
import Population from "./population";
import useMarket from "../hooks/use-market";
import Button from "./ui/button/button";
  
function ViewMarket() {
    const { market, nextDay } = useMarket();

    const [mainContentKey, setMainContentKey] = useState<keyof typeof mainContent>('population');
    const [currentDate, setCurrentDate] = useState<Date>(market.getCurrentDate());

    useEffect(() => {
      setCurrentDate(market.getCurrentDate());
    }, [market]);
  
    const bankCurrentAccountProducts = market.otherBanks.map(bank => ({
      bankName: bank.name,
      currentAccountProduct: bank.currentAccountProduct
    }));
    bankCurrentAccountProducts.push(
      {
        bankName: market.playerBank.name,
        currentAccountProduct: market.playerBank.currentAccountProduct
      }
    );
  
    const mainContent = {
      'population': (): ReactNode => {
        return (
          <Population population={market.population} market={market} bankCurrentAccountProducts={bankCurrentAccountProducts}/>
        );
      },
      'products': (): ReactNode => {
        return (
          <div>
            <h3>Current Account Products</h3>
            {/* <ViewCurrentAccountProduct currentAccountProduct={market.playerBank.currentAccountProduct} /> */}
            <CurrentAccountProductTable bankCurrentAccountProducts={bankCurrentAccountProducts} />
          </div>
        );
      },
      'calendar': (): ReactNode => {
        return (
          <Calendar market={market} events={[
            { date: new Date(2025, 0, 1), title: 'New Year\'s Day' },
            { date: new Date(2025, 0, 14), title: 'Meeting' },
            { date: new Date(2025, 0, 21), title: 'Conference' },
          ]} />
        );
      }
    };
  
    return (
      <div>
        <div className="market-header">
          <h2>{market.name}</h2>
          <p>{currentDate.toDateString()}</p>
          <Button onClick={() => {
            nextDay();
          }}>Next Day</Button>
        </div>
        <div className="market-container">
          <div className="side-panel">
            <div onClick={() => setMainContentKey('population')}>
              <p>Population</p>
            </div>
            <div onClick={() => setMainContentKey('products')}>
              <p>Products</p>
            </div>
            <div onClick={() => setMainContentKey('calendar')}>
              <p>Calendar</p>
            </div>
          </div>
          <div className="main-content">
            {mainContent[mainContentKey]()}
          </div>
        </div>
      </div>
    );
}

export default ViewMarket;