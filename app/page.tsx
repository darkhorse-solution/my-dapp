"use client"
import { useEffect, useState } from "react";
import contractAddress from '@/constants/address';
import Greetings from '@/contracts/Greeter.json';
import MyToken from '@/contracts/MyToken.json';
import { Web3 } from "web3";
const web3 = new Web3('http://127.0.0.1:8545');

export default function Home() {
  const {
    greatAddress,
    mytokenAddress
  } = contractAddress;
  const greetAbi = [...Greetings.abi] as const; // your contract ABI
  const mytokenAbi = [...MyToken.abi] as const; // your contract ABI
  const [accounts, setAccounts] = useState(null);
  const [tokenId, setTokenId] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenAmount, setTokenAmount] = useState(0);

  const greet = async () => {
    const contract = new web3.eth.Contract(greetAbi, greatAddress);    
    
    contract.methods.greet().call().then(function(res) {
      console.log(res);
    });
  }

  const setGreet = async () => {
    const contract = new web3.eth.Contract(greetAbi, greatAddress);    
    const accounts = await requestAccount();
    
    contract.methods.setGreeting(greetText).send({from: accounts[0]}).then(function(res) {
      console.log(res);
    });
  }

  const mint = async () => {
    const contract = new web3.eth.Contract(mytokenAbi, mytokenAddress);
    const accounts = await requestAccount();
    
    contract.methods.mint(accounts[0], tokenAmount).send({from: accounts[0]}).then(function(res) {
      console.log(res);
    });
  }

  const requestAccount = async () => {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {          
      window.ethereum.on('accountsChanged', function(accounts: any) {        
        setAccounts(accounts);
      });
      return await window.ethereum.request({method: 'eth_requestAccounts'})
    }
  }

  const [greetText, setGreetText] = useState('');
    
  return (
    <div>
      <input type="text" value={greetText} onChange={(e) => setGreetText(e.target.value)} />
      <button onClick={setGreet}>Set Greeting</button>
      <button onClick={greet}>Get Greeting</button>

      <input type="text" value={tokenId} onChange={(e) => setTokenId(e.target.value)} placeholder="Token ID" />
      <input type="text" value={tokenSymbol} onChange={(e) => setTokenSymbol(e.target.value)} placeholder="Token Symbol" />
      <input type="number" value={tokenAmount} onChange={(e) => setTokenAmount(parseInt(e.target.value))} placeholder="Token Amount" />
      <button onClick={mint}>Mint</button>
    </div>
  );
}
