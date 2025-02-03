import { useEffect, useState } from "react";
import { BankCurrentAccountProduct, Market, Person, TransactionType } from "../model/bank-interface";
import Table from "./table";
import Calendar from "./calendar";

interface PopulationProps {
  population: Person[];
  market: Market;
  bankCurrentAccountProducts: BankCurrentAccountProduct[]
}

interface PopulationTableProps {
  population: Person[];
  market: Market;
  bankCurrentAccountProducts: BankCurrentAccountProduct[]
  setSelectedPerson: (person: Person) => void;
}

function PopulationTable({ population, market, bankCurrentAccountProducts, setSelectedPerson }: PopulationTableProps) {
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
    <Table data={population} columns={columns} onRowClick={setSelectedPerson}/>
  );
}

export default function Population({ population, market, bankCurrentAccountProducts }: PopulationProps) {
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [events, setEvents] = useState<{ date: Date; title: string }[]>([]);

    useEffect(() => {
      console.log('set select person');
      if (selectedPerson) {
        console.log('selectedPerson: ', selectedPerson);
        const currentAccount = market.getCurrentAccount(selectedPerson.id);
        if (currentAccount && currentAccount.transactions) {
          const newEvents = currentAccount.transactions.map((transaction) => {
            return {
              date: transaction.date,
              title: (transaction.type === TransactionType.DEPOSIT ? '+' : '-') + transaction.amount
            };
          });
          setEvents(newEvents);
        } else {
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
    }, [selectedPerson, market]);

    return (
        <div>
          <h3>Population</h3>
          <div className="population-container">
            <PopulationTable population={population} market={market} bankCurrentAccountProducts={bankCurrentAccountProducts} setSelectedPerson={setSelectedPerson} />
            {selectedPerson && (
              <div>
                <div className="selected-person">
                  <h4>Selected Person</h4>
                  <p>{selectedPerson.firstName} {selectedPerson.lastName}</p>
                  <p>Age: {selectedPerson.age}</p>
                  <p>Profession: {selectedPerson.profession.type}</p>
                  <p>Income: {selectedPerson.getIncome()}</p>
                  <p>Target Current Account Product: {selectedPerson.decideCurrentAccountProduct(bankCurrentAccountProducts).bankName}</p>
                </div>
                <Calendar market={market} events={events} />
              </div>
            )}
          </div>
        </div>
    );
}