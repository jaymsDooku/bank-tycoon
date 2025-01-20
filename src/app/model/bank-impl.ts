import { Account, Bank, BankCurrentAccountProduct, CurrentAccountProduct, Market, Person, Profession, ProfessionIncomeRange, ProfessionType } from "./bank-interface";
import { v4 as uuidv4 } from "uuid";

export class PersonImpl implements Person {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    profession: Profession;
    incomeFactor: number;

    averageMonthlyWithdrawals: number; // Number of withdrawals they make monthly
    overdraftUsageLikelihood: number; // Likelihood of using overdraft (0 to 1)
    preferenceForLowFees: number; // Weighting for low fees (0 to 1)
    preferenceForOverdraft: number; // Weighting for overdraft features (0 to 1)

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        age: number,
        profession: Profession,
        incomeFactor: number,
        averageMonthlyWithdrawals: number,
        overdraftUsageLikelihood: number,
        preferenceForLowFees: number,
        preferenceForOverdraft: number
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.profession = profession;
        this.incomeFactor = incomeFactor;
        this.averageMonthlyWithdrawals = averageMonthlyWithdrawals;
        this.overdraftUsageLikelihood = overdraftUsageLikelihood;
        this.preferenceForLowFees = preferenceForLowFees;
        this.preferenceForOverdraft = preferenceForOverdraft;
    }

    getIncome(): number {
        const incomeRange = ProfessionIncomeRange[this.profession.type];
        const baseSalary = incomeRange[0];
        const extraSalary = incomeRange[1] - incomeRange[0];
        return baseSalary + (extraSalary * this.incomeFactor);
    }

    decideCurrentAccountProduct(products: BankCurrentAccountProduct[]): BankCurrentAccountProduct {
        let bestProduct: BankCurrentAccountProduct = products[0];
        let highestScore = -Infinity;
        const income = this.getIncome();

        products.forEach(bankProduct => {
            const product = bankProduct.currentAccountProduct;
            const affordabilityScore = income >= product.minimumDeposit ? 1 : 0;

            const overdraftScore = 
                (product.overdraftLimit * this.overdraftUsageLikelihood) - product.overdraftInterestRate;

            const feeImpactScore = 
                -((this.averageMonthlyWithdrawals * product.withdrawFee) + product.monthlyFee);

            const totalScore = 
                (affordabilityScore * 0.5) +
                (overdraftScore * this.preferenceForOverdraft) +
                (feeImpactScore * this.preferenceForLowFees);

            if (totalScore > highestScore) {
                highestScore = totalScore;
                bestProduct = bankProduct;
            }
        });

        return bestProduct;
    }
}

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
    }

    getCurrentDate(): Date {
        const currentDate = new Date(this.startDate);
        currentDate.setDate(this.startDate.getDate() + this.day);
        return currentDate;
    }
}

export function generateRandomPerson(): Person {
    const firstNames = ["John", "Jane", "Alex", "Emily", "Chris", "Katie"];
    const lastNames = ["Smith", "Doe", "Johnson", "Brown", "Davis", "Miller"];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 60) + 18; // Random age between 18 and 77

    const professionTypes = Object.values(ProfessionType);
    const professionType = professionTypes[Math.floor(Math.random() * professionTypes.length)];
    const profession: Profession = {
        type: professionType
    };

    const incomeFactor = Math.random(); // Random number between 0 and 1
    const averageMonthlyWithdrawals = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const overdraftUsageLikelihood = Math.random(); // Random number between 0 and 1
    const preferenceForLowFees = Math.random(); // Random number between 0 and 1
    const preferenceForOverdraft = Math.random(); // Random number between 0 and 1

    return new PersonImpl(
        uuidv4(),
        firstName,
        lastName,
        age,
        profession,
        incomeFactor,
        averageMonthlyWithdrawals,
        overdraftUsageLikelihood,
        preferenceForLowFees,
        preferenceForOverdraft
    );
}

export function generateRandomBank(existingBankNames: string[]): Bank {
    const bankNames = ["First National Bank", "Global Trust Bank", "Pioneer Savings", "United Financial", "Community Bank"];
    let randomName = bankNames[Math.floor(Math.random() * bankNames.length)];

    // Ensure the generated name is unique
    while (existingBankNames.includes(randomName)) {
        randomName = bankNames[Math.floor(Math.random() * bankNames.length)];
    }

    return {
        name: randomName,
        accounts: new Map<string, Account[]>(),
        currentAccountProduct: generateRandomCurrentAccountProduct()
    };
}

export function generateRandomCurrentAccountProduct(): CurrentAccountProduct {
    const getRandomNumber = (min: number, max: number) => Math.random() * (max - min) + min;

    return {
        minimumDeposit: getRandomNumber(100, 1000), // Random value between 100 and 1000
        overdraftLimit: getRandomNumber(500, 5000), // Random value between 500 and 5000
        overdraftInterestRate: getRandomNumber(0.01, 0.2), // Random value between 1% and 20%
        monthlyFee: getRandomNumber(5, 50), // Random value between 5 and 50
        withdrawFee: getRandomNumber(0.5, 5) // Random value between 0.5 and 5
    };
}