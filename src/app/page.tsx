'use client'

import { ReactNode, useEffect, useState } from "react";
import { Account, newBank, newMarket, Market, Person, CurrentAccountProduct, generateRandomCurrentAccountProduct } from "./model/bank-interface";
import Table from "./component/table";
import { MarketImpl } from "./model/bank-impl";
import Population from "./component/population";

interface PersonProps {
  person: Person;
}

function ViewPerson({ person }: PersonProps) {
  return (
    <div className="person-container">
      <p>{person.id}</p>
      <p>{person.firstName}</p>
      <p>{person.lastName}</p>
      <p>{person.age}</p>
      <p>{person.profession.type}</p>
    </div>
  );
}

interface CurrentAccountProductProps {
  currentAccountProduct: CurrentAccountProduct;
}

function ViewCurrentAccountProduct({ currentAccountProduct }: CurrentAccountProductProps) {

  return (
    <div className="current-account-product">
      <h5>Current Account Product</h5>
      <p>Minimum Deposit: ${currentAccountProduct.minimumDeposit.toFixed(2)}</p>
      <p>Overdraft Limit: ${currentAccountProduct.overdraftLimit.toFixed(2)}</p>
      <p>Overdraft Interest Rate: {(currentAccountProduct.overdraftInterestRate * 100).toFixed(2)}%</p>
      <p>Monthly Fee: ${currentAccountProduct.monthlyFee.toFixed(2)}</p>
      <p>Withdraw Fee: ${currentAccountProduct.withdrawFee.toFixed(2)}</p>
    </div>
  );
}

interface BankCurrentAccountProduct {
  bankName: string;
  currentAccountProduct: CurrentAccountProduct
}

interface CurrentAccountProductTableProps {
  bankCurrentAccountProducts: BankCurrentAccountProduct[];
}

function CurrentAccountProductTable({ bankCurrentAccountProducts }: CurrentAccountProductTableProps) {
  const columns = [
    { key: 'bankName', header: 'Bank Name' },
    { key: 'minimumDeposit', header: 'Minimum Deposit', render: (item: BankCurrentAccountProduct) => `$${item.currentAccountProduct.minimumDeposit.toFixed(2)}` },
    { key: 'overdraftLimit', header: 'Overdraft Limit', render: (item: BankCurrentAccountProduct) => `$${item.currentAccountProduct.overdraftLimit.toFixed(2)}` },
    { key: 'overdraftInterestRate', header: 'Overdraft Interest Rate', render: (item: BankCurrentAccountProduct) => `${(item.currentAccountProduct.overdraftInterestRate * 100).toFixed(2)}%` },
    { key: 'monthlyFee', header: 'Monthly Fee', render: (item: BankCurrentAccountProduct) => `$${item.currentAccountProduct.monthlyFee.toFixed(2)}` },
    { key: 'withdrawFee', header: 'Withdraw Fee', render: (item: BankCurrentAccountProduct) => `$${item.currentAccountProduct.withdrawFee.toFixed(2)}` }
  ];

  return (
    <Table data={bankCurrentAccountProducts} columns={columns} />
  );
}

interface PopulationProps {
  population: Person[];
  bankCurrentAccountProducts: BankCurrentAccountProduct[]
}

function PopulationTable({ population, bankCurrentAccountProducts }: PopulationProps) {
  const columns = [
     { key: 'id', header: 'ID' },
     { key: 'firstName', header: 'First Name' },
     { key: 'lastName', header: 'Last Name' },
     { key: 'age', header: 'Age' },
     { key: 'profession.type', header: 'Profession Type', render: (person: Person) => person.profession.type },
     { key: 'targetCurrentAccountProduct', header: 'Target Current Account Product', render: (person: Person) => {
      return person.decideCurrentAccountProduct(bankCurrentAccountProducts).bankName;
     }}
  ];
  return (
    <Table data={population} columns={columns} />
  );
}

interface MarketProps {
  market: Market;
}

function ViewMarket({ market }: MarketProps) {
  const [mainContentKey, setMainContentKey] = useState<keyof typeof mainContent>('population');

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
        <Population population={market.population} bankCurrentAccountProducts={bankCurrentAccountProducts}/>
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
    }
  };

  return (
    <div>
      <div className="market-header">
        <h2>{market.name}</h2>
        <p>{market.getCurrentDate().toDateString()}</p>
        <button>Next Day</button>
      </div>
      <div className="market-container">
        <div className="side-panel">
          <div onClick={() => setMainContentKey('population')}>
            <p>Population</p>
          </div>
          <div onClick={() => setMainContentKey('products')}>
            <p>Products</p>
          </div>
        </div>
        <div className="main-content">
          {mainContent[mainContentKey]()}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [money, setMoney] = useState(100000);
  const [market, setMarket] = useState<Market | null>(null);

  useEffect(() => {
    const generatedMarket = new MarketImpl("Lancashire Market", 10, 
      newBank("Lancaster Bank", generateRandomCurrentAccountProduct(), new Map<string, Account[]>()), 4
    );
    setMarket(generatedMarket);
  }, []);

  if (!market) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ViewMarket market={market} />
    </div>
  );
}
