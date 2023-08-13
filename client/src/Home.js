import { Link } from "react-router-dom";

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
                <div>
                    <h3><Link to='/searcher'>Recipe Searcher</Link></h3>
                    <img src='client/src/images/searcher_icon.png' alt='searching'/>
                    <p></p>
                </div> 
                <div>
                    <h3><Link to='/favoriteRecipesList'>Favorite Recipes</Link></h3>
                    <img src='client/src/images/favorites_icon.png' alt='favorites'/>
                    <p></p>
                </div>
                <div>
                    <h3><Link to='/calendar'>Meal Planner</Link></h3>
                    <img src='client/src/images/calendar_icon.png' alt='calendar'/>
                    <p></p>
                </div> 
                <div>
                    <h3><Link to='/ingredientMenu'>Shopping Lists</Link></h3>
                    <img src='client/src/images/shoppingLists_icon.png' alt='shoppingCart'/>
                    <p></p>
                </div> 
            </div>
        </div>
    )
}

export default Home;