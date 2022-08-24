import React, { useEffect, useState } from 'react';
import './ExtraContent.css';


const ExtraContent = ({ setExtraContent }) => {




  return (
  <div className="extra-content-container">
    <h2>How to use this website</h2>  
    <h3>Step 1</h3>  
    <p>Download a wallet like <a href="https://metamask.io/download/" target="_blank">MetaMask</a> and create a new wallet.</p>
    <h3>Step 2</h3>  
    <p>Go to your Metamask wallet and click "Show/hide test networks."</p>
    <p>In settings, toggle the button next to show test networks to "ON".</p>
    <p>Change Metamask to the Rinkeby testnet.</p>
    <h3>Step 3</h3>  
    <p>We need some ETH on the Rinkeby testnet to power this transaction.</p>
    <p>Go to <a href="https://rinkebyfaucet.com/" target='_blank'>https://rinkebyfaucet.com/</a> and paste your <em>Rinkeby wallet</em> address here and push the "Send me ETH" button.</p>
    <p>Your 0.1 ETH will appear in 2-5min.</p>
    <h3>Step 4</h3>  
    <p>Push the "Connect Wallet To Get Started" button above and follow the instructions in your wallet.</p>
    <p>Now you're connected you can choose a character to mint!</p>
    
  </div>
  );
};

export default ExtraContent;