import { INotifier } from "./INotifier";

// This is a stub
export class StubNotifier implements INotifier {
    async notifyUser() {
        return Promise.resolve<void>(undefined);
    }
};
