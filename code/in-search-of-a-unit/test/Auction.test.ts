import { Auction } from "../src/Auction";
import { EmailNotifier } from "../src/EmailNotifier";
import { Money } from "../src/Money";
import * as uuid from 'uuid';
import { Offer } from "../src/Offer";
import * as assert from "assert";
import * as sinon from "sinon";
import { mockObject } from "./Mock";

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
        const mockNotifier = sinon.mock(notifier);
        const sale = new Auction('PLN', 5, notifier);
        // Initially, everybody goes into auction at 10 PLN:
        const initialOffers = stuffAuction(sale, 5);
        // Subsequent offers for the same amount should be rejected:
        const sixthOffer = testOffer(10);
        mockNotifier.expects('notifyUser').once().withArgs(sixthOffer.madeByUserID, {
            eventType: 'outbid',
            offer: sixthOffer
        }).resolves();
        const sixthOfferResult = await sale.makeOffer(sixthOffer);
        mockNotifier.verify();
    });
    it('should replace the last offer if a better one comes in', async function() {
        const notifier = new EmailNotifier();
        const mockNotifier = sinon.mock(notifier);
        const sale = new Auction('PLN', 5, notifier);
        const initialOffers = stuffAuction(sale, 5);
        // A new offer should annul the last one made:
        const lastOffer = sale.getQualifyingOffers().pop()!;
        const betterOffer = testOffer(15);
        mockNotifier.expects('notifyUser').once().withArgs(lastOffer.madeByUserID, {
            eventType: 'outbid',
            offer: lastOffer
        }).resolves();
        await sale.makeOffer(betterOffer);
        mockNotifier.verify();
    });
    it('should select the winners after some offers are replaced', async function() {
        // TODO: Rewrite this test to use behavior verification as well!
        const notifier = new EmailNotifier();
        const mockNotifier = mockObject(notifier);
        const sale = new Auction('PLN', 5, notifier);
        const initialOffers = stuffAuction(sale, 5);
        const lastOffer = sale.getQualifyingOffers().pop()!;
        const betterOffer = testOffer(15);
        mockNotifier.method('notifyUser', notifier.notifyUser).expect([ lastOffer.madeByUserID, {
            eventType: 'outbid',
            offer: lastOffer
        } ], Promise.resolve());
        await sale.makeOffer(betterOffer);
        // Make sure all the proper winners are notified:
        for (let offer of [ betterOffer, ...initialOffers.slice(0, -1) ]) {
            mockNotifier.method('notifyUser', notifier.notifyUser).expect([ offer.madeByUserID, {
                eventType: 'win',
                auction: sale,
                offer: offer
            } ], Promise.resolve());
        }
        await sale.end();
        mockNotifier.verify();
    });
});
