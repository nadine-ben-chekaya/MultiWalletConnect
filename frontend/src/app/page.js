"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { BuyToken } from "./buytoken";
import { MyTokenERC20Address, abi } from "./contract";
import Web3 from "web3";

export default function Home() {
  const { data: hash, isPending, sendTransaction } = useSendTransaction();
  const [recipientAddress, setrecipientAddress] = useState("");
  const [amount, setamount] = useState("");
  const [amountToken, setAmountToken] = useState("");

  async function submit() {
    console.log("submit");
    console.log("address=,", recipientAddress);
    console.log("amount=", amount);
    try {
      // Send the transaction with the correct 'to' field
      const tx = await sendTransaction({
        to: recipientAddress, // Use 'to' instead of 'recipientAddress'
        value: parseEther(amount),
      });
      console.log("Transaction sent, tx:", tx);
    } catch (error) {
      console.error("Error sending transaction:", error);
      window.alert("Error sending transaction: " + error.message);
    }
  }

  async function buytoken() {
    console.log("submit");
    console.log("address=,", recipientAddress);
    console.log("amount=", amount);
    try {
      const { ethereum } = window;

      if (ethereum) {
        const web3 = new Web3(ethereum);
        const TokenContract = new web3.eth.Contract(abi, MyTokenERC20Address);

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("Found account", accounts[0]);
        await TokenContract.methods
          .buyTokens(parseEther(amountToken))
          .send({ from: accounts[0] });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Task", error);
    }
  }
  return (
    <div className={styles.page}>
      <ConnectButton />
      <main className={styles.main}>
        <div className={styles.ctas}>
          <h1>Transfer Funds</h1>
          <input
            name="recipient address"
            placeholder="0x..."
            onChange={(e) => setrecipientAddress(e.target.value)}
            required
          />
          <input
            name="amount"
            placeholder="0"
            onChange={(e) => setamount(e.target.value)}
            required
          />
          <button onClick={submit}>send ETH</button>
          {hash && <div>Transaction Hash: {hash}</div>}
        </div>

        <div className={styles.ctas}>
          <h1>Buy ERC20 Tokens</h1>
          <input
            name="amountToken"
            placeholder="Enter token amount"
            value={amountToken}
            onChange={(e) => setAmountToken(e.target.value)}
            required
          />
          <button onClick={buytoken}>Buy Tokens</button>
        </div>
      </main>
    </div>
  );
}
