import { generateRandomBank } from "./bank-impl";
import { Account, Bank, Market, Person } from "./bank-interface";
import { generateRandomPerson } from "./person-impl";

export class MarketImpl implements Market {
    name: string;
    startDate: Date;
    day: number;
    population: Person[];
    playerBank: Bank;
    otherBanks: Bank[];

    constructor(name: string, totalPopulation: number, playerBank: Bank, otherBankCount: number) {
        this.name = name;
        this.startDate = new Date(2025, 0, 1); // January 1, 2025
        this.day = 0;
        this.population = [];
        for (let i = 0; i < totalPopulation; i++) {
            this.population.push(generateRandomPerson());
        }
        this.playerBank = playerBank;
        this.otherBanks = [];
        const existingBankNames = new Set<string>();
        existingBankNames.add(playerBank.name);

        for (let i = 0; i < otherBankCount; i++) {
            const newBank = generateRandomBank(Array.from(existingBankNames));
            this.otherBanks.push(newBank);
            existingBankNames.add(newBank.name);
        }

        this.initialize();
    }

    initialize() {
        this.createAccounts();
    }

    paySalaries() {
        const currentDate = this.getCurrentDate();
        const incomeDay = currentDate.getDate() === 1;
        if (!incomeDay) {
            return;
        }

        this.population.forEach(person => {
            const income = person.getIncome();
            const accounts = this.playerBank.accounts.get(person.id);
            const account = accounts ? accounts[0] : undefined;
            if (account) {
                account.deposit(this, income);
            }
        });
    }

    takeRents() {
        const currentDate = this.getCurrentDate();
        const rentDay = currentDate.getDate() === 2;
        if (!rentDay) {
            return;
        }

        this.population.forEach(person => {
            const rent = person.budget.getHousingPortion(person.getIncome());
            const accounts = this.playerBank.accounts.get(person.id);
            const account = accounts ? accounts[0] : undefined;
            if (account) {
                account.withdraw(this, rent);
            }
        });
    }

    nextDay() {
        const date: Date = this.getCurrentDate();
        console.log('date: ', date.getDate());
        if (date.getDate() === 1) {
            console.log('paying salaries');
            this.paySalaries();
        } else if (date.getDate() === 2) {
            this.takeRents();
        }
        
        this.day++;
    }

    createAccounts() {
        this.population.forEach(person => {
            console.log('creating account for person', person.id);
            this.playerBank.createAccount(person.id, this.day, 0);
        });
    }

    getCurrentAccount(ownerId: string): Account {
        return this.playerBank.getCurrentAccount(ownerId);
    }

    getCurrentDate(): Date {
        const currentDate = new Date(this.startDate);
        currentDate.setDate(this.startDate.getDate() + this.day);
        return currentDate;
    }
}