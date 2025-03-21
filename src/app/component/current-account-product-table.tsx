import { CurrentAccountProduct } from "../model/bank-interface";
import Table from "./ui/table/table";

type BankCurrentAccountProduct = {
  bankName: string;
  currentAccountProduct: CurrentAccountProduct;
};

type CurrentAccountProductTableProps = {
  bankCurrentAccountProducts: BankCurrentAccountProduct[];
};

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

export default CurrentAccountProductTable;