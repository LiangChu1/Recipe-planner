import { Link } from "react-router-dom";
import searcherIcon from "./images/searcher_icon.png";
import favoritesIcon from "./images/favorites_icon.png";
import calendarIcon from "./images/calendar_icon.png";
import shoppingListsIcon from "./images/shoppingLists_icon.png";
import './Home.css'
function Home(){
    return (
        <div>
            <p>
            Welcome to Meal Master, your ultimate tool for effortless meal planning and delicious dining! 
            Whether you're a seasoned chef or just starting out in the kitchen, our user-friendly platform empowers you to create, organize, and enjoy a week's worth of delectable meals.
            Say goodbye to mealtime stress and hello to culinary inspiration. 
            With Meal Master, you can easily browse through a vast collection of chef-curated recipes, tailor your meal preferences, and generate personalized meal plans that suit your taste, dietary needs, and busy schedule. 
            From breakfast to dinner, our intuitive interface streamlines your cooking journey, making it a breeze to plan, shop for ingredients, and execute mouthwatering dishes.
            </p>

            <h2>Key Features</h2>
            <div className="features">
                <div className="feature">
                    <h3>Recipe Searcher</h3>
                    <Link to='/searcher'><img src={searcherIcon} alt='searching'/></Link>
                    <p></p>
                </div> 
                <div className="feature">
                    <h3>Favorite Recipes</h3>
                    <Link to='/favoriteRecipesList'><img src={favoritesIcon} alt='favorites'/></Link>
                    <p></p>
                </div>
                <div className="feature">
                    <h3>Meal Planner</h3>
                    <Link to='/calendar'><img src={calendarIcon} alt='calendar'/></Link>
                    <p></p>
                </div> 
                <div className="feature">
                    <h3>Shopping Lists</h3>
                    <Link to='/ingredientMenu'><img src={shoppingListsIcon} alt='shoppingCart'/></Link>
                    <p></p>
                </div> 
            </div>
        </div>
    )
}

export default Home;