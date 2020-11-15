export interface INotifier {
    notifyUser(userID: string, event: object): Promise<void>;
};
