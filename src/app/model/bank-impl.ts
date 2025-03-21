import { getRandomNumber } from "../util/util";
import { Account, Bank, BankCurrentAccountProduct, Budget, CurrentAccountProduct, Market, Person, Profession, ProfessionIncomeRange, ProfessionType, Transaction, TransactionType } from "./bank-interface";
import { v4 as uuidv4 } from "uuid";
import { generateRandomPerson } from "./person-impl";
import { AccountImpl } from "./account-impl";

export class BankImpl implements Bank {
    name: string;
    accounts: Map<string, Account[]>;
    currentAccountProduct: CurrentAccountProduct;

    constructor(name: string, currentAccountProduct: CurrentAccountProduct) {
        this.name = name;
        this.accounts = new Map<string, Account[]>();
        this.currentAccountProduct = currentAccountProduct;
    }

    createAccount(ownerId: string, day: number, initialDeposit: number): Account {
        const account = initialDeposit > 0 ? new AccountImpl(day, ownerId, initialDeposit, [
            {
                id: uuidv4(),
                amount: initialDeposit,
                date: new Date(),
                type: TransactionType.DEPOSIT
            }]) : new AccountImpl(day, ownerId, 0);
        if (this.accounts.has(ownerId)) {
            this.accounts.get(ownerId)?.push(account);
        } else {
            this.accounts.set(ownerId, [account]);
        }
        return account;
    }

    getCurrentAccount(ownerId: string): Account {
        const account = this.accounts.get(ownerId)?.[0];
        if (!account) {
            throw new Error(`No account found for ownerId: ${ownerId}`);
        }
        return account;
    }
} 

export function generateRandomBank(existingBankNames: string[]): Bank {
    const bankNames = ["First National Bank", "Global Trust Bank", "Pioneer Savings", "United Financial", "Community Bank"];
    let randomName = bankNames[Math.floor(Math.random() * bankNames.length)];

    // Ensure the generated name is unique
    while (existingBankNames.includes(randomName)) {
        randomName = bankNames[Math.floor(Math.random() * bankNames.length)];
    }

    return new BankImpl(randomName, generateRandomCurrentAccountProduct());
}

export function generateRandomCurrentAccountProduct(): CurrentAccountProduct {
    return {
        minimumDeposit: getRandomNumber(100, 1000), // Random value between 100 and 1000
        overdraftLimit: getRandomNumber(500, 5000), // Random value between 500 and 5000
        overdraftInterestRate: getRandomNumber(0.01, 0.2), // Random value between 1% and 20%
        monthlyFee: getRandomNumber(5, 50), // Random value between 5 and 50
        withdrawFee: getRandomNumber(0.5, 5) // Random value between 0.5 and 5
    };
}