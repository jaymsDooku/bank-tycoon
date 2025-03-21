import { Account, Market, Transaction, TransactionType } from "./bank-interface";
import { v4 as uuidv4 } from "uuid";

export class AccountImpl implements Account {
    id: string;
    dayCreated: number;
    accountOwner: string;
    balance: number;
    transactions: Transaction[];

    constructor(dayCreated: number, accountOwner: string, balance: number, transactions?: Transaction[]) {
        this.id = uuidv4();
        this.dayCreated = dayCreated;
        this.accountOwner = accountOwner;
        this.balance = balance;
        this.transactions = transactions || [];
    }

    addTransaction(market: Market, amount: number, type: TransactionType, comment?: string) {
        this.balance += type === TransactionType.DEPOSIT ? amount : -amount;
        this.transactions.push({
            id: uuidv4(),
            amount,
            date: market.getCurrentDate(),
            type,
            comment
        });
    }

    deposit(market: Market, amount: number, comment?: string) {
        this.addTransaction(market, amount, TransactionType.DEPOSIT, comment);
    }

    withdraw(market: Market, amount: number, comment?: string) {
        this.addTransaction(market, amount, TransactionType.WITHDRAW, comment);
    }
}