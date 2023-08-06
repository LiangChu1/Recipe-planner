import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header(){
    return(
        <Link to='/'>
        <h1>
            Meal Master
        </h1>
        </Link>
    );
}

export default Header