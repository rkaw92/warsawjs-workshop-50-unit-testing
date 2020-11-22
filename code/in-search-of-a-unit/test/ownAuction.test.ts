import { Auction } from "../src/Auction";
import { EmailNotifier } from "../src/EmailNotifier";
import { Money } from "../src/Money";
import * as uuid from 'uuid';
import { Offer } from "../src/Offer";
import * as assert from "assert";
import { StubNotifier } from "../src/StubNotifier";
import * as sinon from 'sinon';
import { INotifier } from "../src/INotifier";

function testOffer(amount: number, currency = 'PLN', user?: string): Offer {
    return {
        offerID: uuid.v4(),
        madeByUserID: user || uuid.v4(),
        amount: new Money({ amount, currency })
    };
}

async function stuffAuction(sale: Auction, count: number) {
    const initialOffers = [];
    for (let i = 0; i < count; i++) {
        const offer = testOffer(10);
        initialOffers.push(offer);
        await sale.makeOffer(offer);
    }
    return initialOffers;
}

describe('Auction', async function() {
    it('should carry out an auction and select the winners', async function() {
        // Given:
        const notifier = new EmailNotifier();
        const sale = new Auction('PLN', 5, notifier);
        // When initially everybody goes into auction at 10 PLN:
        const initialOffers = await stuffAuction(sale, 5);
        // Then:
        assert.deepStrictEqual(sale.getQualifyingOffers(), initialOffers);
    });
    it('should reject an equal-amount offer if already full', async function() {
        const notifier = new StubNotifier();
        const sale = new Auction('PLN', 5, notifier);
        const initialOffers = await stuffAuction(sale, 5);
        // Subsequent offers for the same amount should be rejected:
        const sixthOfferResult = await sale.makeOffer(testOffer(10));
        assert.strictEqual(sixthOfferResult, false);
    });
    it('should end auction with proper winning offers after outbidding one', async function() {
        // Given:
        const notifier = new StubNotifier();
        const sale = new Auction('PLN', 5, notifier);
        const initialOffers = await stuffAuction(sale, 5);
        const lastOffer = sale.getQualifyingOffers().pop()!;
        const betterOffer = testOffer(15);
        await sale.makeOffer(betterOffer);
        // When:
        const notifyUserSpy = sinon.spy<INotifier,'notifyUser'>(notifier, 'notifyUser');
        await sale.end();
        // Then:
        // Make sure the winners are: 4/5 of the initial offers and
        //  the one better offer which was made later.
        assert.strictEqual(notifyUserSpy.callCount, 5);
        for (let offer of initialOffers.slice(0, -1)) {
            assert.ok(notifyUserSpy.calledWith(offer.madeByUserID, {
                eventType: 'win',
                auction: sale,
                offer
            }));
        }
        assert.ok(notifyUserSpy.calledWith(betterOffer.madeByUserID, {
            eventType: 'win',
            auction: sale,
            offer: betterOffer
        }));
    });
});
