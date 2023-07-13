import { useNavigate } from "react-router-dom";
import {recipeDataFetchCall} from "./fetchCalls";
import './FavoriteRecipesList.css'

function FavoriteRecipesList({ favoriteRecipes, setFavoriteRecipes }){
    const navigate = useNavigate();

    function handleView(id){
        recipeDataFetchCall({id})
        .then((data) => {
          if (data) {
            navigate(`/recipe/${id}`, {state: {recipe: data}});
          } else {
            navigate(`/recipe/${id}`, {state: {recipe: null}});
          }
        })
        .catch((error) => {
          console.log("FAILED: " + error);
        });
    }

    //Delete from favorite recipe list
    function deleteFromFavorites(id) {
      // Filter out the recipe with the given recipeId
      const updatedFavorites = favoriteRecipes.filter((recipe) => recipe.id !== id);
      // Update the favoriteRecipes state with the updated list
      setFavoriteRecipes(updatedFavorites);
    }

    return (
        <>
        <h2>Your favorite Recipes</h2>
        <div>
        {favoriteRecipes.map((recipe) => (
        <div key={recipe.id}>
            <h3>{recipe.title}</h3>
            <img src={recipe.image} alt={recipe.title} />
            <button onClick={() => handleView(recipe.id)}>View Recipe</button>
            <button onClick={() => deleteFromFavorites(recipe.id)}>Delete From Favorites</button>
        </div>
        ))}
        </div>   
        </>
    )
}

export default FavoriteRecipesList