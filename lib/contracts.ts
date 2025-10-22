import { ethers } from "ethers";
import type { AddressLike } from "ethers";

export const LOTTERY_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS as AddressLike | undefined) ??
  "0xd307291F7ADE8813a825f2291a5AD6B22EBC5E0f";

export const lotteryAbi = [
  "function jackpot() view returns (uint256)",
  "function ticketPrice() view returns (uint256)",
  "function totalSold() view returns (uint256)",
  "function getActiveLotteries() view returns (tuple(uint256 id,string title,uint256 jackpot,uint256 ticketPrice,uint256 closesAt)[])",
  "function buyTickets(uint256 lotteryId,uint256 quantity) payable",
] as const;

export function getLotteryContract(
  signerOrProvider: ethers.Provider | ethers.Signer
) {
  return new ethers.Contract(
    LOTTERY_CONTRACT_ADDRESS,
    lotteryAbi,
    signerOrProvider
  );
}
