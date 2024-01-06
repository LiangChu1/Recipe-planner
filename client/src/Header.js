import React, { useState } from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import UserAuthDetails from './UserAuthDetails';

function Header({ setFavoriteRecipes, setIngredientLists }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className={`full_header ${menuOpen ? 'open' : ''}`}>
      <Link to='/' className='title'>
        <h1>Meal Master</h1>
      </Link>
      {isHomePage ? (
        <UserAuthDetails setFavoriteRecipes={setFavoriteRecipes} setIngredientLists={setIngredientLists} />
      ) : (
        <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} setFavoriteRecipes={setFavoriteRecipes} setIngredientLists={setIngredientLists} />
      )}
    </div>
  );
}

export default Header;