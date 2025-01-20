

export enum ProfessionType {
    LOW_INCOME = "Low Income",
    MIDDLE_INCOME = "Middle Income",
    HIGH_INCOME = "High Income"
};

export const ProfessionIncomeRange = {
    [ProfessionType.LOW_INCOME]: [12000, 25000],
    [ProfessionType.MIDDLE_INCOME]: [25001, 80000],
    [ProfessionType.HIGH_INCOME]: [80001, 250000]
};

export interface Profession {
    type: ProfessionType
};

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    age: number;

    profession: Profession;
    incomeFactor: number;
    getIncome: () => number;

    averageMonthlyWithdrawals: number; // Number of withdrawals they make monthly
    overdraftUsageLikelihood: number; // Likelihood of using overdraft (0 to 1)
    preferenceForLowFees: number; // Weighting for low fees (0 to 1)
    preferenceForOverdraft: number; // Weighting for overdraft features (0 to 1)
    decideCurrentAccountProduct: (products: BankCurrentAccountProduct[]) => BankCurrentAccountProduct;
};

export enum TransactionType {
    DEPOSIT = "Deposit",
    WITHDRAW = "Withdraw"
};

export interface Transaction {
    id: string;
    amount: number;
    date: Date;
    type: TransactionType;
}

export interface Account {
    id: string;
    accountOwner: string;
    balance: number;
    transactions?: Transaction[];
};

export interface CurrentAccountProduct {
    minimumDeposit: number;
    overdraftLimit: number;
    overdraftInterestRate: number;
    monthlyFee: number;
    withdrawFee: number;
}

export interface BankCurrentAccountProduct {
    bankName: string;
    currentAccountProduct: CurrentAccountProduct
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

export interface Bank {
    name: string;
    accounts: Map<string, Account[]>;
    currentAccountProduct: CurrentAccountProduct;
};

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

export interface Market {
    name: string;
    startDate: Date;
    day: number;
    population: Person[];
    playerBank: Bank;
    otherBanks: Bank[];

    getCurrentDate: () => Date;
};

export function newBank(name: string, currentAccountProduct: CurrentAccountProduct, accounts: Map<string, Account[]>): Bank {
    return {
        name,
        currentAccountProduct,
        accounts
    };
}

