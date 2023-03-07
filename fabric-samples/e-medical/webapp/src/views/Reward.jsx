import React, { useState, useEffect, useContext } from 'react';
import ActionBar from '../components/ActionBar';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import Web3 from 'web3';
import AppContext from '../context';
import medicalToken from '../contracts/medicalToken';
import Collapsible from 'react-collapsible';

const Reward = () => {
  const { user } = useContext(AppContext);
  const { t } = useTranslation('common');
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [balance, setBalance] = useState('');
  const [accounts, setCurrentAccount] = useState();
  const [connect, setConnect] = useState(false);

  const getRewards = () => {
    axios.get('/rewards', {
      headers: {
        Authorization: `${user.token}`,
      }
    })
      .then(res => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setRewards(res.data.rewards);
          setTotal(res.data.total);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
    getRewards();
  }, []);

  const claimReward = (e) => {
    e.preventDefault();
    // disable button
    e.target.disabled = true;
    // button text
    e.target.innerHTML = 'Claiming...';
    let data = JSON.stringify({
      reward: "daily"
    });
    axios.post('/rewards', data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${user.token}`
      }
    })
      .then(res => {
        if (res.data.error) {
          alert(res.data.error);
        } else {
          alert(res.data.message);

          getRewards();
        }
        // enable button
        e.target.disabled = false;
        // button text
        e.target.innerHTML = 'Claim Daily Reward';
      })
      .catch(err => {
        e.target.disabled = false;
        // button text
        e.target.innerHTML = 'Claim Daily Reward';
      });
  }

  // Connect wallet and load wallet address
  async function load() {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    setCurrentAccount(accounts);
  }
  
    // Connect and check Wallet is valid
  async function connectWallet(){ 
    setConnect(true);
    await load();
    const address = await accounts.toString();
    const wBalance = await medicalToken.methods.balanceOf(address).call();
    setBalance(wBalance);
    console.log(balance);
  };

  const viewEthAc = () => {
    window.location.href = `https://rinkeby.etherscan.io/address/${accounts}`; 
  }


  return (
    <div className="reward">
      <ActionBar back='/app/dashboard' title={t('reward')} />
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Loading...</div>}
      <div className="reward-content">
        <br/>
        {total === 0
          ? <div style={{ marginBottom: '20px', textAlign: 'center', color: 'green', fontSize: '30pt', fontWeight: 'bold' }}>{total} token</div>
          : <div style={{ marginBottom: '20px', textAlign: 'center', color: 'green', fontSize: '30pt', fontWeight: 'bold' }}>{total} token</div>
        }
        <div style={{ textAlign: 'center' }}>
          Waiting to be transferred to the wallet
        </div>
        <div className='container form-field' style={{ textAlign: 'center' }}>
          <button onClick={claimReward}>Claim Daily Reward</button>
        </div>
        <div className='rows'>
              {rewards.slice(0, 10).map((reward, index) => (
                // {rewards && rewards.map(reward => (
                <div className="row" key={reward.id}>
                  <div className="row-contain row-col">
                    <div >{new Date(reward.date).toLocaleDateString()}</div>
                    <div >{reward.title}</div>
                    <div >+ {reward.value}</div>
                  </div>
                </div>
              ))}
          </div>
        {!connect
          ?
          <div className='form-field-blockchain' style={{ textAlign: 'center' }}>
            <br />
            <button onClick={connectWallet}>Connect Wallet</button>
            <div style={{ fontWeight: 'bold' , margin: '10px'}}>
              Connect your wallet to check the token balance in your wallet.
            </div>
            <br />
          </div> 
          :
          <div className='form-field-blockchain' style={{ textAlign: 'center' }}>
            <br/>
            <button onClick={connectWallet}>Connect Again</button>
            <br/>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <b>Wallet Address :</b> {accounts}<br/>
              <b>Wallet Token Balance : </b> {balance} EMED 
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={viewEthAc}>View Account On Etherscan</button>
            </div>
          </div>
        }
        <div style={{ textAlign: 'center' }}>
        <Collapsible trigger="▷ What is E-Medical Token (EMED)? ◁"  classParentString ="col-row2">
              <p>
                Emedic is the token of <b>EMED</b> with a limited supply of one trillion tokens.<br/>
                People can use EMED to redeem the reward in E-Medical App.
              </p>
        </Collapsible>
        </div>
        <br />
      </div>
    </div>
  );
};

export default Reward;
