import { useEffect, useState } from "react";
import useMarket from "../hooks/use-market";
import { BankCurrentAccountProduct, Person, TransactionType } from "../model/bank-interface";
import { formatCurrency } from "../util/util";
import Calendar from "./calendar";

type PersonProps = {
  person: Person;
  bankCurrentAccountProducts: BankCurrentAccountProduct[];
};

function ViewPerson({ person, bankCurrentAccountProducts }: PersonProps) {
  const { market } = useMarket();
  const [events, setEvents] = useState<{ date: Date; title: string }[]>([]);

  useEffect(() => {
    if (person) {
      const currentAccount = market.getCurrentAccount(person.id);
      if (currentAccount && currentAccount.transactions) {
        const newEvents = currentAccount.transactions.map((transaction) => {
          return {
            date: transaction.date,
            title: transaction.comment + ' ' + formatCurrency(transaction.type === TransactionType.DEPOSIT ? transaction.amount : -transaction.amount)
          };
        });
        setEvents(newEvents);
      } else {
        setEvents([]);
      }
    } else {
      setEvents([]);
    }
  }, [person, market]);

  return (
    <div>
      <div className="selected-person">
        <h4>{person.firstName} {person.lastName}</h4>
        <p>Age: {person.age}</p>
        <p>Profession: {person.profession.type}</p>
        <p>Income: {person.getIncome()}</p>
        <p>Target Current Account Product: {person.decideCurrentAccountProduct(bankCurrentAccountProducts).bankName}</p>
      </div>
      <Calendar market={market} events={events} />
    </div>
  );
}

export default ViewPerson;