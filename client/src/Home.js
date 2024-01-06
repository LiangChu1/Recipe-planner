import { Link } from "react-router-dom";
import searcherIcon from "./images/searcher_icon.png";
import favoritesIcon from "./images/favorites_icon.png";
import calendarIcon from "./images/calendar_icon.png";
import shoppingListsIcon from "./images/shoppingLists_icon.png";
import mainPageImg from "./images/home_screen_image.png";
import './Home.css'
function Home(){
    return (
        <div className="homePage">
            <div className="homePage-img-container">
            <div className="homePage-img" style={{ backgroundImage: `url(${mainPageImg})` }}/>
            </div>
            <div className="intro">
                <h1>Welcome to Meal Master</h1>
                <h2>Your ultimate tool for effortless meal planning and delicious dining!</h2>
            </div>

            <div className="moreInfo">
                <h2>Start Meal Planning Now:</h2>
                <div className="featureListing">
                    <div className="feature">
                        <h3>Recipe Searcher</h3>
                        <Link to='/searcher'><img src={searcherIcon} alt='searching'/></Link>
                        <p>A convenient way to discover and explore a variety of dishes.</p>
                    </div> 
                    <div className="feature">
                        <h3>Favorite Recipes</h3>
                        <Link to='/favoriteRecipesList'><img src={favoritesIcon} alt='favorites'/></Link>
                        <p>Save and organize your preferred recipes in one central location for quick and easy access.</p>
                    </div>
                    <div className="feature">
                        <h3>Meal Planner</h3>
                        <Link to='/calendar'><img src={calendarIcon} alt='calendar'/></Link>
                        <p>Plan your meals by using the provided visual calendar</p>
                    </div> 
                    <div className="feature">
                        <h3>Shopping Lists</h3>
                        <Link to='/ingredientMenu'><img src={shoppingListsIcon} alt='shoppingCart'/></Link>
                        <p>Create and manage your own shopping lists based on selected recipes throughout the weeks.</p>
                    </div> 
                </div>
            </div>
        </div>
    )
}

export default Home;