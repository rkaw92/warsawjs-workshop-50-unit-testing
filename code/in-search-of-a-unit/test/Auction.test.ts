import { Auction } from "../src/Auction";
import { EmailNotifier } from "../src/EmailNotifier";
import { Money } from "../src/Money";
import * as uuid from 'uuid';
import { Offer } from "../src/Offer";
import * as assert from "assert";

function testOffer(amount: number, currency = 'PLN', user?: string): Offer {
    return {
        offerID: uuid.v4(),
        madeByUserID: user || uuid.v4(),
        amount: new Money({ amount, currency })
    };
}

function stuffAuction(auction: Auction, count: number) {
    const madeOffers = [];
    for (let i = 0; i < 5; i++) {
        const offer = testOffer(10);
        madeOffers.push(offer);
        auction.makeOffer(offer);
    }
    return madeOffers;
}

describe('Auction', function() {
    it('should immediately reject an offer that could not possibly win', async function() {
        const notifier = new EmailNotifier();
        const sale = new Auction('PLN', 5, notifier);
        // Initially, everybody goes into auction at 10 PLN:
        const initialOffers = stuffAuction(sale, 5);
        // Subsequent offers for the same amount should be rejected:
        const sixthOfferResult = await sale.makeOffer(testOffer(10));
        assert.strictEqual(sixthOfferResult, false);
    });
    it('should replace the last offer if a better one comes in', async function() {
        const notifier = new EmailNotifier();
        const sale = new Auction('PLN', 5, notifier);
        const initialOffers = stuffAuction(sale, 5);
        // A new offer should annul the last one made:
        const lastOffer = sale.getQualifyingOffers().pop()!;
        const betterOffer = testOffer(15);
        await sale.makeOffer(betterOffer);
        assert.ok(sale.getQualifyingOffers().includes(betterOffer));
        assert.ok(!sale.getQualifyingOffers().includes(lastOffer));
    });
    it('should select the winners after some offers are replaced', async function() {
        const notifier = new EmailNotifier();
        const sale = new Auction('PLN', 5, notifier);
        const initialOffers = stuffAuction(sale, 5);
        const lastOffer = sale.getQualifyingOffers().pop()!;
        const betterOffer = testOffer(15);
        await sale.makeOffer(betterOffer);
        const winners = await sale.end();
        // Make sure the winners are: 4/5 of the initial offers and
        //  the one better offer which was made later.
        assert.strictEqual(winners.length, 5);
        for (let offer of initialOffers.slice(0, -1)) {
            assert.ok(winners.includes(offer));
        }
        assert.ok(winners.includes(betterOffer));
    });
});
