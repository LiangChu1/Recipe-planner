import { useNavigate } from "react-router-dom";
import {recipeDataFetchCall} from "./fetchCalls";
import './FavoriteRecipesList.css'

function FavoriteRecipesList({ favoriteRecipes, setFavoriteRecipes, ingredientList, setIngredientList, totalCost, setTotalCost }){
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

    function deleteFromFavorites(id) {
      // Filter out the recipe with the given recipeId
      const updatedFavorites = favoriteRecipes.filter((recipe) => recipe.id !== id);
      // Update the favoriteRecipes state with the updated list
      setFavoriteRecipes(updatedFavorites);
    
      // Filter out the ingredients with the given recipeId
      const deletedIngredients = ingredientList.filter(
        (ingredient) => ingredient.recipeId === id
      );
      // Calculate the total cost of the deleted ingredients
      const deletedIngredientsCost = deletedIngredients.reduce(
        (total, ingredient) => total + ingredient.price,
        0
      );
      // Filter out the ingredients with the given recipeId
      const updatedIngredientList = ingredientList.filter(
        (ingredient) => ingredient.recipeId !== id
      );
      // Update the ingredientList state with the updated list
      setIngredientList(updatedIngredientList);

      // Update the totalCost state by subtracting the deleted ingredients cost
      const updatedTotalCost = (totalCost - deletedIngredientsCost).toFixed(2);
      if(updatedTotalCost <= 0 || updatedIngredientList.length === 0){
        setTotalCost(0)
      }
      else{
        setTotalCost(updatedTotalCost);
      }
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