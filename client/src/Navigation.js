import './Navigation.css'
import {Link} from 'react-router-dom';
import UserAuthDetails from './UserAuthDetails';
function Navigation({ menuOpen, setMenuOpen, setFavoriteRecipes, setIngredientLists }) {
    
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
                <li className='nav-link'><UserAuthDetails setFavoriteRecipes={setFavoriteRecipes} setIngredientLists={setIngredientLists} /></li>
            </ul>
        </nav>
    );
}

export default Navigation