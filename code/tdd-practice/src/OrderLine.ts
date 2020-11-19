import Big from "big.js";
import { Money, MoneyValue } from "./Money";

export class OrderLine {
    readonly itemID: string;
    readonly quantity: bigint;
    readonly unitPrice: Money;
    readonly taxRate: number;
    constructor({
        itemID,
        quantity,
        unitPrice,
        taxRate
    }: {
        itemID: string,
        quantity: bigint,
        unitPrice: MoneyValue,
        taxRate: number
    }) {
        this.itemID = itemID;
        this.quantity = quantity;
        this.unitPrice = new Money(unitPrice);
        this.taxRate = taxRate;
    }
};
