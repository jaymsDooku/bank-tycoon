import { BankCurrentAccountProduct, Person } from "../model/bank-interface";
import Table from "./ui/table/table";

type PopulationProps = {
  population: Person[];
  bankCurrentAccountProducts: BankCurrentAccountProduct[]
};

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

export default PopulationTable;