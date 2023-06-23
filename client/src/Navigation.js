import './Navigation.css'
import {Link} from 'react-router-dom';
function Navigation() {
    return (
        <nav>
            <li className='nav-link'><Link to='/'>Home</Link></li>
            <li className='nav-link'><Link to='/favoriteRecipesList'>Favorite Recipes</Link></li>
            <li className='nav-link'><Link to='/shoppingList'>Shopping Cart</Link></li>
            <li className='nav-link'><Link to='/calendar'>Calendar</Link></li>
        </nav>
    );
}

export default Navigation