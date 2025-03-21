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

    constructor(name: string, startDate: Date, day: number, population: Person[], playerBank: Bank, otherBanks: Bank[]) {
        this.name = name;
        this.startDate = startDate;
        this.day = day;
        this.population = population;
        this.playerBank = playerBank;
        this.otherBanks = otherBanks;
    }

    static newMarket(name: string, totalPopulation: number, playerBank: Bank, otherBankCount: number): Market {
        const population = [];
        for (let i = 0; i < totalPopulation; i++) {
            population.push(generateRandomPerson());
        }

        const otherBanks = [];
        const existingBankNames = new Set<string>();
        existingBankNames.add(playerBank.name);

        for (let i = 0; i < otherBankCount; i++) {
            const newBank = generateRandomBank(Array.from(existingBankNames));
            otherBanks.push(newBank);
            existingBankNames.add(newBank.name);
        }
        const result = new MarketImpl(name, new Date(2025, 0, 1), 0, population, playerBank, otherBanks);
        result.initialize();
        return result;
    }

    initialize() {
        this.createAccounts();
    }

    

    paySalaries() {
        const currentDate = this.getCurrentDate();
        const incomeDay = currentDate.getDate() === 1;
        console.log('incomeDay: ', incomeDay);
        if (!incomeDay) {
            return;
        }

        this.population.forEach(person => {
            const income = person.getIncome();
            const accounts = this.playerBank.accounts.get(person.id);
            const account = accounts ? accounts[0] : undefined;
            if (account) {
                account.deposit(this, income, 'Salary');
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
                account.withdraw(this, rent, 'Rent');
            }
        });
    }

    nextDay() {
        const date: Date = this.getCurrentDate();
        if (date.getDate() === 1) {
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
        console.log('startDate: ', this.startDate);
        const currentDate = new Date(this.startDate);
        currentDate.setDate(this.startDate.getDate() + this.day);
        return currentDate;
    }

    clone(): Market {
        return new MarketImpl(this.name, this.startDate, this.day, this.population, this.playerBank, this.otherBanks);
    }
}