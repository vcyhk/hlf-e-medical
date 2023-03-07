import React from 'react';
import { Link } from 'react-router-dom';
import backicon from '../assets/images/chevron-left-solid.svg';

function ActionBar({ back, title }) {
    return (
        <div className='actionbar'>
            <div style={{ padding: '20px 20px 20px 20px' }}>
                <div style={{ display: 'flex' }}>
                    <Link to={back} style={{ flex: 'none' }}>
                        <img src={backicon} alt="" width="20" />
                    </Link>
                    <h2 style={{ flex: 'auto', margin: '0', textAlign: 'center' }}>{title}</h2>
                </div>
            </div>
        </div>
    );
}

export default ActionBar;
