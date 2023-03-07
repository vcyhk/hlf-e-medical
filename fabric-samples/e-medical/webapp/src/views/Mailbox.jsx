import React, { useState, useEffect, useContext } from 'react';
import ActionBarWithSearch from '../components/ActionBarWithSearch';
import AppContext from '../context';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function Mailbox() {
    const { t } = useTranslation('common');
    const { user } = useContext(AppContext);
    const [mailboxes, setMailboxes] = useState(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        axios.get('/mailboxes', {
            headers: {
                Authorization: `${user.token}`,
            }
        })
            .then(res => {
                if (res.data.error) {
                    setError(res.data.error);
                } else {
                    setMailboxes(res.data);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    return (
        <div className='mailbox'>
            <ActionBarWithSearch back="/app/dashboard" title={t("mailbox")} />
            {error && <div className='alert alert-danger'>{error}</div>}
            {loading && <div className='alert alert-info'>Loading...</div>}
            <div className='rows'>
                {mailboxes && mailboxes.map(mailbox => (
                    <Link to={`/app/dashboard/mailbox/${mailbox.id}`} key={mailbox._id}>
                        <div className='row' key={mailbox.id}>
                            <div className='row-contain'>
                                {mailbox.patient_name}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Mailbox;
