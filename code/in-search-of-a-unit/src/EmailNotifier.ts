import { INotifier } from "./INotifier";

// NOTE: This is a fake implementation to avoid actually sending e-mail
//  during the Unit Testing Workshop classes.
export class EmailNotifier implements INotifier {
    async notifyUser() {
        return new Promise<void>(function(resolve, reject) {
            setTimeout(function() {
                if (Math.random() > 0.15) {
                    resolve();
                } else {
                    reject(new Error('Fault fault unknown'));
                }
            }, Math.random() * 100);
        });
    }
};
