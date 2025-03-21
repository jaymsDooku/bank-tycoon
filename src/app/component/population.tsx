import { useEffect, useState } from "react";
import { BankCurrentAccountProduct, Market, Person, TransactionType } from "../model/bank-interface";
import Table from "./ui/table/table";
import Calendar from "./calendar";
import { formatCurrency } from "../util/util";
import ViewPerson from "./view-person";

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

    return (
        <div>
          <h3>Population</h3>
          <div className="population-container">
            <PopulationTable population={population} market={market} bankCurrentAccountProducts={bankCurrentAccountProducts} setSelectedPerson={setSelectedPerson} />
            {selectedPerson && <ViewPerson person={selectedPerson} bankCurrentAccountProducts={bankCurrentAccountProducts} />}
          </div>
        </div>
    );
}