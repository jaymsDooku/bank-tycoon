import { getRandomNumber } from "../util/util";
import { BankCurrentAccountProduct, Budget, Person, Profession, ProfessionIncomeRange, ProfessionType } from "./bank-interface";
import { BudgetImpl } from "./budget-impl";
import { v4 as uuidv4 } from "uuid";

export class PersonImpl implements Person {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    profession: Profession;
    incomeFactor: number;

    budget: Budget;

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
        budget: Budget,
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
        this.budget = budget;
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

    const budget: Budget = new BudgetImpl(getRandomNumber(0.1, 0.2), getRandomNumber(0.3, 0.5), getRandomNumber(0.1, 0.2));

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
        budget,
        averageMonthlyWithdrawals,
        overdraftUsageLikelihood,
        preferenceForLowFees,
        preferenceForOverdraft
    );
}
