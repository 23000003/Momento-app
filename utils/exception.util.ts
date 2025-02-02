export class WalletNotConnectedError extends Error {
  constructor(message: string = "Wallet Not Connected") {
    super(message);
    this.name = "WalletNotConnectedError";
  }
}
