import React, { useState, useEffect, useContext } from 'react';
import ActionBar from '../components/ActionBar';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AppContext from '../context';
import {useTranslation} from 'react-i18next'

function MailboxDetails() {
    const { t } = useTranslation('common');
    const { user } = useContext(AppContext);
    const param = useParams();
    const navigate = useNavigate();
    const [mailbox, setMailbox] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submiting, setSubmiting] = useState(false);
    const [error, setError] = useState('');
    const [note, setNote] = useState('');
    const [medid, setMEDID] = useState('');

    const [docData, setDocData] = useState(null);
    const [accounts, setCurrentAccount] = useState();
    const [connect, setConnect] = useState(false);
    const [checkAdd, setCheckAdd] = useState(false);

    const [dateTime, setDateTime] = useState('');

    useEffect(() => {
        setLoading(true);
        axios.get(`/mailboxes/${param.id}`, {
            headers: {
                Authorization: `${user.token}`,
            }
        })
            .then(res => {
                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    setMailbox(res.data);
                    setMEDID(res.data.patient.medid)
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });

            axios.get(`/doctor/profile/${user.id}`, {
                headers: {
                  Authorization: `${user.token}`,
                }
              })
                .then(res => {
                  if (res.data.error) {
                    setError(res.data.error);
                  } else {
                    setDocData(res.data);
                  }
                  setLoading(false);
                })
                .catch(err => {
                  setError(err.message);
                  setLoading(false);
                });
    }, []);
    
    async function load() {
        
    }

    const handleChange = (e) => {
        setNote(e.target.value);
    }
    
    // Connect and check Wallet is valid
    const connectWallet = () => { 
        getDateTime();
        getRecord();
        if(accounts === docData.wallet_address){
          setConnect(true);
          setCheckAdd(true);
        }else{
          setConnect(true)
          setCheckAdd(false)
        }
      };
    
    const logout = () => { 
        setConnect(false)
        setCheckAdd(false)
    }

    const [records,setRecords]=useState([]);
    async function getRecord(){

    }

    async function getDateTime(){
        var year = new Date().getFullYear();
        var month = new Date().getMonth();
        var date = new Date().getDate();
        var hours = new Date().getHours();
        var min = new Date().getMinutes();
        var sec = new Date().getSeconds();
        setDateTime(year + '/' + month + '/' + date + ' ' + hours + ':' + min + ':' + sec);
    }

    const handleSubmit = async(e) => {
            e.preventDefault();
            setSubmiting(true);

            axios.put('http://localhost:3001/changeRecord', {
                key: medid,
                dt: dateTime,
                info: note
              }).then(res => {
                setLoading(false)
                  if (res.data.status) {
                    console.log(res.data.message);
                  } else {
                    setError(res.data.error)
                  }
              }).catch(err => {
                  console.log(err);
                  setLoading(false)
              });

            try {
                getDateTime();
                alert('Medical history created');
                navigate(`/app/dashboard/mailbox`);
                setSubmiting(false);
            }catch (err) {
                setError(err.message);
                setSubmiting(false);
            }
            
    }


    return (
        <div className='mailbox-details'>
            <ActionBar back="/app/dashboard/mailbox" title={t("mailbox")} />
            {error && <div className='alert alert-danger'>{error}</div>}
            {loading && <div className='alert alert-info'>Loading...</div>}
            <div className='container'>
                {mailbox && (
                    <>
                                               
                        {!connect ?
                            <div className='form-field-blockchain' style={{ textAlign: 'center' }}>
                                <br />
                                <button onClick={connectWallet}>Connect Wallet</button>
                                <div>

                                </div>
                                <br />
                            </div> : !checkAdd ?
                            <div style={{ textAlign: 'center' }}>
                                <br />
                                <div className='form-field-blockchain'>
                                    <button onClick={logout}>Connect Again</button>
                                </div>
                                <div>
                                <b>Please try again.<br />
                                    Your wallet address is unauthorized.</b>
                                </div>
                                <div>
                                    Your account is: {accounts}
                                </div>
                            </div>
                            :
                            <div>
                                <div className='mailbox-item'>
                                    <h3>Patient</h3> 
                                    <div>
                                        Name: {mailbox.patient.name}
                                    </div>
                                    <div>
                                        Email: {mailbox.patient.email}
                                    </div>
                                    <div>
                                        Phone: {mailbox.patient.phone}
                                    </div>
                                    <div>
                                        Birhday: {new Date(mailbox.patient.birthday).toLocaleDateString()}
                                    </div>
                                </div>
                                <br />
                                <div>
                                    <h3>Medical histories</h3>
                                    {records.map((item) => (
                                        <div key={item} style={{margin:'10px 0px' }}>
                                        Date: {item.datetime} <br/>
                                        Detail: {item.info}
                                        </div>
                                    ))}
                                </div>
                                <br />
                                <div style={{ textAlign: 'center' }}>
                                    Your wallet address is: {accounts}
                                </div>
                                <br />
                                <form onSubmit={handleSubmit}>
                                    <div className='form-field'>
                                        <input type="text" name="note" id="note" onChange={handleChange} value={note} required/>
                                    </div>
                                    <div className='form-field' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <button onClick={()=>{navigate(-1)}}>Cancel</button>
                                        <button type='submit' disabled={submiting}>
                                            {submiting ? 'Submiting...' : 'Submit'}
                                        </button>
                                    </div>
                                </form>
                            </div> 
                        }
                    </>
                )}
            </div>
        </div>
    );
}

export default MailboxDetails;
