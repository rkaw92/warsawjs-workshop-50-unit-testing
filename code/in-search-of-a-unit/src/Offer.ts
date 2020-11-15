import { Money } from "./Money";

export interface Offer {
    offerID: string;
    madeByUserID: string;
    amount: Money;
};
