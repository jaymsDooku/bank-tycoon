import { CurrentAccountProduct } from "../model/bank-interface";

type CurrentAccountProductProps = {
  currentAccountProduct: CurrentAccountProduct;
};

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

export default ViewCurrentAccountProduct;