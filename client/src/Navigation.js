import './Navigation.css'
import {Link} from 'react-router-dom';
function Navigation({ menuOpen, setMenuOpen }) {
    
    function toggleMenu(){
        setMenuOpen(!menuOpen)
    }
    return (
        <nav>
             <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <div className='bar'></div>
                <div className='bar'></div>
                <div className='bar'></div>
            </div>
            <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
                <li className='nav-link' onClick={toggleMenu}><Link to='/searcher'>Recipe Searcher</Link></li>
                <li className='nav-link' onClick={toggleMenu}><Link to='/favoriteRecipesList'>Favorite Recipes</Link></li>
                <li className='nav-link' onClick={toggleMenu}><Link to='/calendar'>Meal Planner</Link></li>
                <li className='nav-link' onClick={toggleMenu}><Link to='/ingredientMenu'>Shopping Lists</Link></li>
            </ul>
        </nav>
    );
}

export default Navigation