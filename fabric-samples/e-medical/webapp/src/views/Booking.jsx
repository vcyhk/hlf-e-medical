import React from 'react';
import logo from '../assets/images/logo.png';
import ActionBar from '../components/ActionBar';
import { useNavigate } from 'react-router-dom';
import {useTranslation} from 'react-i18next'
function Booking() {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
  return (
    <div className="booking">
        <ActionBar back="/app/dashboard" title={t("booking")}/>
        <div className='container' style={{textAlign:'center'}}>
            <picture>
                <img src={logo} alt="" width="100"/>
            </picture>
            <div>
                <div className='form-field'>
                    <button style={{width:'200px'}} onClick={()=>navigate('/app/dashboard/booking/new')}>{t('make_appointment')}</button>
                    <br />
                    <button style={{width:'200px'}} onClick={()=>navigate('/app/dashboard/booking/appointments')}>{t('check_appointment')}</button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default Booking;
