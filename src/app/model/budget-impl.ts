import { Budget } from "./bank-interface";


export class BudgetImpl implements Budget {
    food: number;
    housing: number;
    transportation: number;
    savings: number;

    constructor(food: number, housing: number, transportation: number) {
        this.food = food;
        this.housing = housing;
        this.transportation = transportation;
        this.savings = 1 - (food + housing + transportation);
    }

    getFoodPortion(income: number): number {
        return this.food * income;
    }

    getHousingPortion(income: number): number {
        return this.housing * income;
    }

    getTransportationPortion(income: number): number {
        return this.transportation * income;
    }

    getSavingsPortion(income: number): number {
        return this.savings * income;
    }
};