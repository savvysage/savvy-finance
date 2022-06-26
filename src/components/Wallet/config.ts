import MetaMask from "./WalletIcons/MetaMask.png";
import TrustWallet from "./WalletIcons/TrustWallet.png";
import WalletConnect from "./WalletIcons/WalletConnect.png";

export const wallets = [
  {
    name: "MetaMask",
    icon: MetaMask,
    connectorId: "injected",
    priority: 1,
  },
  {
    name: "Trust Wallet",
    icon: TrustWallet,
    connectorId: "injected",
    priority: 3,
  },
  {
    name: "WalletConnect",
    icon: WalletConnect,
    connectorId: "walletconnect",
    priority: 2,
  },
];
