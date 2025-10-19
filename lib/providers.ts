import { ethers } from "ethers";
import type { EIP1193Provider } from "viem";

type EthereumWindow = typeof window & {
  ethereum?: EIP1193Provider;
};

function getInjectedProvider(): EIP1193Provider | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return (window as EthereumWindow).ethereum;
}

const fallbackRpc =
  process.env.NEXT_PUBLIC_RPC_URL ??
  "https://ethereum-sepolia.publicnode.com";

export async function getReadonlyProvider() {
  const injected = getInjectedProvider();
  if (injected) {
    try {
      const provider = new ethers.BrowserProvider(injected, "any");
      await provider.ready;
      return provider;
    } catch (error) {
      console.warn("Failed to initialise BrowserProvider", error);
    }
  }

  return new ethers.JsonRpcProvider(fallbackRpc);
}

export async function getSigner() {
  const injected = getInjectedProvider();
  if (!injected) {
    throw new Error("Wallet provider not found. Connect a wallet first.");
  }

  const provider = new ethers.BrowserProvider(injected, "any");
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}
