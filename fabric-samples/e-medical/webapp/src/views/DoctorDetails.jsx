import React, { useState, useEffect, useContext } from 'react';
import ActionBar from '../components/ActionBar';
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import AppContext from '../context';
import { useTranslation } from 'react-i18next'


function DoctorDetails() {
  const { t } = useTranslation('common');
  const { user } = useContext(AppContext);
  const param = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [patData, setPatData] = useState(null);
  const [medId, setMEDID] = useState(false)
  const [connect, setConnect] = useState(false);
  const [checkAdd, setCheckAdd] = useState(false);
  const [dAdd, setdAdd] = useState('');

  

  useEffect(() => {
    setLoading(true);
    setdAdd(param.dc_id)
    axios.get(`/doctor/profile/${param.dc_id}`, {
      headers: {
        Authorization: `${user.token}`,
      }
    })
      .then(res => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setInfo(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    axios.get(`/patient/profile/${user.id}`, {
      headers: {
        Authorization: `${user.token}`,
      }
    })
      .then(res => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setPatData(res.data);
          setMEDID(res.data.medid)
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Connect and check Wallet is valid
  const connectWallet = () => { 
    axios.get('http://localhost:3001/medRecsKey'+ medId).then(res => {
          setLoading(false)
          if (res.data.status) {
              console.log(res.data.medRec)
          } else {
              setError(res.data.error)
          }
      }).catch(err => {
          console.log(err);
          setLoading(false)
      });
      setConnect(true);
      setCheckAdd(true);
  };

  const logout = () => { 
      setConnect(false)
      setCheckAdd(false)
  }

  
  const handleRegister = async(e) => {

    axios.put('http://localhost:3001/permitDoc', {
          doctor: dAdd,
          medid: medId
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

      e.target.disabled = true;
      e.target.innerText = 'Registering...';
      let data = JSON.stringify({
        doctor_id: info.id,
      })
  
      axios.post('/mailboxes', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${user.token}`,
        }
      })
        .then(res => {
          if (res.data.error) {
            setError(res.data.error);
          } else {
            alert(`Doctor can view your medical records now`);
            navigate(`/app/dashboard/hospitals/${param.h_id}/departments/${param.d_id}/doctors`);
          }
          e.target.disabled = false;
          e.target.innerText = 'Register';
        })
        .catch(err => {
          setError(err);
          e.target.disabled = false;
          e.target.innerText = 'Register';
        });
  };

  return (
    <div className="doctor-details">
      <ActionBar back={`/app/dashboard/hospitals/${param.h_id}/departments/${param.d_id}/doctors`} title={t('doctor_details')} />
      {error && <div className='alert alert-danger'>{error}</div>}
      {loading && <div className='alert alert-info'>Loading...</div>}
      <div className="container">
        {!loading && <>
          <div className="information-box">
            <table style={{ backgroundColor: 'white', padding: '20px', width: '100%' }}>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{info.name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{info.email}</td>
                </tr>

                <tr>
                  <td>
                    Registration Number
                  </td>
                  <td>
                    {info.registration_number}
                  </td>
                </tr>
                <tr>
                  <td>
                    Hospital
                  </td>
                  <td>
                    {info.hospital}
                  </td>
                </tr>
                <tr>
                  <td>
                    Department
                  </td>
                  <td>
                    
                    {info.department}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {!connect ?
          <div className='form-field-blockchain' style={{ textAlign: 'center' }}>
            <br />
            <button onClick={connectWallet}>Connect Wallet</button>
            <div>
              Please connect your wallet.
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
              <br />
            </div>
            :
            <div style={{ textAlign: 'center' }}>
              <br />
              <div className='form-field-blockchain'>
                <button onClick={logout}>Disconnect</button>
              </div>
              <br />
              <div className='form-field' style={{ textAlign: 'center' }}>
                <button onClick={handleRegister}>Register</button>
              </div>
              <br />
            </div>
          }
        </>
        }
      </div>
    </div>
  );
}

export default DoctorDetails;
