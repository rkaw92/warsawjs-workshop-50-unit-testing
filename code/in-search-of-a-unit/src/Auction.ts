import { EventEmitter } from "events";
import { BoundedSet } from "./BoundedSet";
import { INotifier } from "./INotifier";
import { Money } from "./Money";
import { Offer } from "./Offer";

export class CurrencyMismatchError extends Error {
    constructor() {
        super('Currency mismatch - the offer must be in the auction\'s currency');
        this.name = 'CurrencyMismatchError;'
    }
};

export class DuplicateOfferError extends Error {
    constructor() {
        super('Please wait until you are outbid to make another offer');
        this.name = 'DuplicateOfferError';
    }
};

/**
 * An Auction represents a sale of a definite number of items, where members may
 *  make bids that are considered from the highest to lowest, and from the earliest
 *  to latest in case of ties. This is a "first price" auction - the bid amount is
 *  the actual amount payable, unlike in some on-line auction systems that reduce
 *  the final sale price to that of the first "losing" offer plus an epsilon.
 * Our model is a transparent auction where users can know in real-time whether
 *  they are going to win or not.
 */
export class Auction {
    private qualifyingOffers: BoundedSet<Offer>;
    private notifier: INotifier;
    private currency: string;
    constructor(currency: string, availableItemCount: number, notifier: INotifier) {
        this.currency = currency;
        this.qualifyingOffers = new BoundedSet<Offer>(availableItemCount, function(a, b) {
            // Highest amounts take priority:
            return -1 * Money.compare(a.amount, b.amount);
        });
        this.notifier = notifier;
    }

    /**
     * Add an offer for one of the items. The offer is immediately considered and
     *  a result is returned that indicates whether the offer is accepted into
     *  the set of eventual winners. This action may result in another offer
     *  being outbid, which is signalled via the notifier.
     * @param offer - The offer to submit for auction.
     * @returns Whether the offer qualified for winning, provided that no other will outbid it before the end.
     */
    async makeOffer(offer: Offer): Promise<boolean> {
        if (offer.amount.currency !== this.currency) {
            throw new CurrencyMismatchError();
        }
        if (this.qualifyingOffers.getItems().some((existingOffer) => existingOffer.madeByUserID === offer.madeByUserID)) {
            throw new DuplicateOfferError();
        }
        const expungedOffers = this.qualifyingOffers.addItem(offer);
        // Notify each of the newly-losing users that they are outbid.
        for (let offer of expungedOffers) {
            await this.notifier.notifyUser(offer.madeByUserID, {
                eventType: 'outbid',
                offer: offer
            });
        }
        return !expungedOffers.includes(offer);
    }

    async end() {
        const winners = this.qualifyingOffers.getItems();
        for (let offer of winners) {
            await this.notifier.notifyUser(offer.madeByUserID, {
                eventType: 'win',
                auction: this,
                offer: offer
            });
        }
        return winners;
    }

    getQualifyingOffers() {
        return this.qualifyingOffers.getItems();
    }
};
