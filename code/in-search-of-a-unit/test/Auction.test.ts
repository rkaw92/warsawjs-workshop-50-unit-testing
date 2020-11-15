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

describe('Auction', function() {
    it('should carry out an auction and select the winners', async function() {
        const notifier = new EmailNotifier();
        const sale = new Auction('PLN', 5, notifier);
        // Initially, everybody goes into auction at 10 PLN:
        const initialOffers = [];
        for (let i = 0; i < 5; i++) {
            const offer = testOffer(10);
            initialOffers.push(offer);
            sale.makeOffer(offer);
        }
        // Subsequent offers for the same amount should be rejected:
        const sixthOfferResult = await sale.makeOffer(testOffer(10));
        assert.strictEqual(sixthOfferResult, false);
        // However, a new offer should annul the last one made:
        const lastOffer = sale.getQualifyingOffers().pop()!;
        const betterOffer = testOffer(15);
        await sale.makeOffer(betterOffer);
        assert.ok(sale.getQualifyingOffers().includes(betterOffer));
        assert.ok(!sale.getQualifyingOffers().includes(lastOffer));
        // Make sure the winners are: 4/5 of the initial offers and
        //  the one better offer which was made later.
        const winners = await sale.end();
        assert.strictEqual(winners.length, 5);
        for (let offer of initialOffers.slice(0, -1)) {
            assert.ok(winners.includes(offer));
        }
        assert.ok(winners.includes(betterOffer));
    });
});
