import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ActionBarWithSearch from '../components/ActionBarWithSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import AppContext from '../context';
import {useTranslation} from 'react-i18next'

function FindHospital() {
  const { t } = useTranslation('common');
  const { user } = useContext(AppContext);
  const [hospitals, setHospitals] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('/hospitals', {
      headers: {
        Authorization: `${user.token}`,
      }
    })
      .then(res => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setHospitals(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="hospitals">
      <ActionBarWithSearch back="/app/dashboard" title={t("find_hospital")} />
      {error && <div className='alert alert-danger'>{error}</div>}
      {loading && <div className='alert alert-info'>Loading...</div>}
      <div className='rows'>
        {hospitals && hospitals.map(hospital => (
          <Link to={`/app/dashboard/hospitals/${hospital.id}/departments`} key={hospital._id}>
            <div className="row" key={hospital.id}>
              <div className="row-contain">
                {hospital.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FindHospital;
