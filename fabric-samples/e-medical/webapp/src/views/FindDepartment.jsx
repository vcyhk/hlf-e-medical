import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import ActionBarWithSearch from '../components/ActionBarWithSearch';
import axios from 'axios';
import AppContext from '../context';
import { useTranslation } from 'react-i18next';

function FindDepartment() {
    const { t } = useTranslation('common');
  const { user } = useContext(AppContext);
  const params = useParams();
  const [departments, setDepartments] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/hospitals/${params.id}/departments`, {
      headers: {
        Authorization: `${user.token}`,
      }
    })
      .then(res => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setDepartments(res.data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="find-department">
      <ActionBarWithSearch back="/app/dashboard/hospitals" title={t("find_department")} />
      {error && <div className='alert alert-danger'>{error}</div>}
      {loading && <div className='alert alert-info'>Loading...</div>}
      <div className='rows'>
        {departments && departments.map(department => (
          <Link to={`/app/dashboard/hospitals/${params.id}/departments/${department.id}/doctors`} key={department._id}>
            <div className="row" key={department.id}>
              <div className="row-contain">
                {department.name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FindDepartment;
