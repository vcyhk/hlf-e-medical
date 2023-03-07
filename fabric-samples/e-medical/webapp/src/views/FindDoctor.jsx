import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import ActionBarWithSearch from '../components/ActionBarWithSearch';
import axios from 'axios';
import AppContext from '../context';
import {useTranslation} from 'react-i18next'
function FindDoctor() {
  const { t } = useTranslation('common');
  const { user } = useContext(AppContext);
  const params = useParams();
  const [doctors, setDoctors] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('/hospitals/' + params.h_id + '/departments/' + params.d_id + '/doctors', {
      headers: {
        Authorization: `${user.token}`,
      }
    })
      .then(res => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setDoctors(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="find-doctor">
      <ActionBarWithSearch back={`/app/dashboard/hospitals/${params.h_id}/departments`} title={t("find_doctor")} />
      {error && <div className='alert alert-danger'>{error}</div>}
      {loading && <div className='alert alert-info'>Loading...</div>}
      <div className='rows'>
        {doctors && doctors.map(doctor => (
          <Link to={`/app/dashboard/hospitals/${params.h_id}/departments/${params.d_id}/doctors/${doctor.id}`} key={doctor._id}>
            <div className="row" key={doctor.id}>
              <div className="row-contain">
                {doctor.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FindDoctor;
