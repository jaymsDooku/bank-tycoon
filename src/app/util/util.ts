
export const getRandomNumber = (min: number, max: number): number  => {
    return Math.random() * (max - min) + min;
}

export const formatCurrency = (value: number): string => {
    return value < 0 ? `-£${Math.abs(value).toFixed(2)}` : `£${value.toFixed(2)}`;
}