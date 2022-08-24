import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import myEpicGame from './utils/MyEpicGame.json'
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import { ethers } from 'ethers';
import twitterLogo from './assets/twitter-logo.svg';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';
import ExtraContent from './Components/ExtraContent';

// Constants
const TWITTER_HANDLE = 'AndrewSzwec';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [readMore, setReadMore]=useState(false);

  
  {/* Some temporary content */}
  {/*const extraContent=<div>
        <p className="extra-content">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, consectetur nequeab 
          porro quasi culpa nulla rerum quis minus voluptatibus sed hic ad quo sint, libero 
          commodi officia aliquam! Maxime.
        </p>
    </div>*/}
  const linkName=readMore?'Show less':'Instructions'
    
  {/* End Some temporary content */}
  
  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
    /*
     * We release the state property after all the function logic
     */
    setIsLoading(false);
    console.log('isLoading: ', isLoading);
  };

  // Render Methods
  const renderContent = () => {
   /*
   * If the app is currently loading, just render out LoadingIndicator
   */
    if (isLoading) {
      return <LoadingIndicator />;
    }
    /*
     * Scenario #1
     */
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          {/*<img
            src="https://i.imgur.com/uyKgrYk.gif"
            alt="You're Welcome"
          />*/}
          
          <img
            src="https://cloudflare-ipfs.com/ipfs/QmeVDoyqVYV6612chqVX1RbncSc27PYbF1uhVq2zXr7cH2"
            alt="You're Welcome"
          />
          
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
          </button>

          {/* Show/Hide instructions */}            
          <div className="instructions-text">
            <a className="read-more-link" onClick={()=>{setReadMore(!readMore)}}><h3>{linkName}</h3></a>
            {/* {readMore && extraContent} */}
            {readMore && <ExtraContent />}
            
          </div>
          
        </div>
      );
      /*
       * Scenario #2
       */
      } else if (currentAccount && !characterNFT) {
        return <SelectCharacter setCharacterNFT={setCharacterNFT} />;	
      	/*
      	* Scenario #3 If there is a connected wallet and characterNFT, it's time to battle!
      	*/
      } else if (currentAccount && characterNFT) {
        return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} currentAccount={currentAccount} />;
    }
  };

  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    const checkNetwork = async () => {
      try { 
        if (window.ethereum.networkVersion !== '4') {
          alert("Please connect to Rinkeby!")
        }
      } catch(error) {
        console.log(error)
      }
    }
  }, []);


  // UseEffects
  useEffect(() => {
    /*
     * Anytime our component mounts, make sure to immiediately set our loading state
     */
    setIsLoading(true);
    console.log('isLoading: ', isLoading);
    checkIfWalletIsConnected();
  }, []);
  

  useEffect(() => {
  /*
   * The function we will call that interacts with out smart contract
   */
  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    const txn = await gameContract.checkIfUserHasNFT();

    console.log(txn)
    
    if (txn.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(txn));
    } else {
      console.log('No character NFT found');
    }
  };

  /*
   * We only want to run this, if we have a connected wallet
   */
  if (currentAccount) {
    console.log('CurrentAccount:', currentAccount);
    fetchNFTMetadata();
  }
}, [currentAccount]);

  

  return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header gradient-text">⚔️ Maui vs Ducky ⚔️</p>
        <p className="sub-text">Team up to protect the Metaverse!</p>
        {/* This is where our button and image code used to be!
         *	Remember we moved it into the render method.
         */}
        {renderContent()}
      </div>
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built by @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  </div>
);
};

export default App;