import React, { useState } from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import Navigation from './Navigation';

function Header(){
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return(
        <div className={`full_header ${menuOpen ? 'open' : ''}`}>
            <Link to='/' className='title'>
                <h1>Meal Master</h1>
            </Link>
            {!isHomePage && <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>}
        </div>
    );
}

export default Header