"use client";
import React, { useState } from "react";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";
import { MyTokenERC20Address, abi } from "./contract";

export function BuyToken() {
  const [amountToken, setAmountToken] = useState("");

  const {
    write,
    data,
    isLoading: isWriting,
  } = useContractWrite({
    address: MyTokenERC20Address,
    abi: abi,
    functionName: "buyTokens",
    args: [parseEther(amountToken)], // Pass the amount to the contract function
  });

  const { isLoading: isConfirming, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  function handleSubmit() {
    if (!write) {
      alert("Contract function is not ready. Please check your setup.");
      return;
    }
    write(); // Execute the contract function
  }

  return (
    <div>
      <h1>Buy ERC20 Tokens</h1>
      <input
        type="number"
        name="amountToken"
        placeholder="Enter token amount"
        value={amountToken}
        onChange={(e) => setAmountToken(e.target.value)}
        required
      />
      <button disabled={isWriting || !write} onClick={handleSubmit}>
        {isWriting ? "Processing..." : "Buy Tokens"}
      </button>
      {data && <div>Transaction Hash: {data.hash}</div>}
      {isConfirming && <div>Waiting for confirmation...</div>}
      {isSuccess && <div>Transaction confirmed!</div>}
    </div>
  );
}
