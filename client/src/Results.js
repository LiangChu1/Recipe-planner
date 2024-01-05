import { auth, db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";
import { recipeDataFetchCall } from "./fetchCalls";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Results.css'

function Results({ recipe, favoriteRecipes, setFavoriteRecipes }) {
  const navigate = useNavigate();
  const doesRecipeExistInFav = favoriteRecipes.some(
    (favRecipe) => favRecipe.id === recipe.id
  );

  const [recipeData, setRecipeData] = useState(null);

  useEffect(() => {
    const fetchPromise = recipeDataFetchCall({ id: recipe.id });
    fetchPromise
      .then((data) => {
        setRecipeData(data);
      })
      .catch((error) => {
        console.log("FAILED: " + error);
      });
  }, [recipe.id]);

  const handleView = useCallback(() => {
    if (recipeData) {
      navigate(`/recipeViewer/${recipe.id}`, { state: { recipe: recipeData } });
    } else {
      navigate(`/recipeViewer/${recipe.id}`, { state: { recipe: null } });
    }
  }, [recipe.id, navigate, recipeData]);

  const addToFavorites = useCallback(() => {
    if (recipeData) {
      const newInstructions = getNewInstructions(
        recipeData.analyzedInstructions
      );
      const newRecipeIngredientList = getNewRecipeIngredientList(
        recipeData.extendedIngredients,
        recipeData.nutrition.ingredients
      );
      const nutrients = recipeData.nutrition.nutrients;
      const weightPerServing = recipeData.nutrition.weightPerServing;
      const newRecipe = {
        id: recipeData.id,
        title: recipeData.title,
        image: recipeData.image,
        recommandedServings: recipeData.servings,
        averageCookTime: recipeData.readyInMinutes,
        instructions: newInstructions,
        ingredients: newRecipeIngredientList,
        nutrition: { nutrients, weightPerServing },
        calendarInfo: [],
      };
      const currUser = auth.currentUser;
      if (currUser) {
        const userUID = currUser.uid;
        const favoritesRef = collection(
          db,
          "users",
          userUID,
          "favorites"
        );
        addDoc(favoritesRef, newRecipe)
          .then((docRef) => {
            console.log("Recipe added with ID: ", docRef.id);
            setFavoriteRecipes((prevFavorites) => [
              ...prevFavorites,
              newRecipe,
            ]);
          })
          .catch((error) => {
            console.error("Error adding recipe: ", error);
          });
      } else {
        console.log("User didn't sign in yet");
      }
    } else {
      console.log("Failed to add to favorites");
    }
  }, [recipeData, favoriteRecipes, setFavoriteRecipes]);


  function getNewInstructions(analyzedInstructions){
    const initialInstructionList = analyzedInstructions[0].steps.map((step) => ({
      number: step.number,
      description: step.step
    }));
    return initialInstructionList;
  }

  function getNewRecipeIngredientList(extendedIngredientsInfo, nutritionAmountPerServing) {
    const uniqueIngredientIds = new Set();
  
    const initialIngredientList = extendedIngredientsInfo
        .filter((ingredient) => ingredient.id !== -1)
        .map((ingredient) => {
            // Check if the ingredient ID is already in the Set
            if (uniqueIngredientIds.has(ingredient.id)) {
                return null; // Skip duplicate ingredient
            }

            // Add the ingredient ID to the Set
            uniqueIngredientIds.add(ingredient.id);

            return {
                id: ingredient.id,
                name: ingredient.name,
                aisle: ingredient.aisle,
                amount: nutritionAmountPerServing.find((nutritionIngredient) => nutritionIngredient.id === ingredient.id)?.amount || 0,
                unit: ingredient.measures.us.unitShort
            };
        })
        .filter((ingredient) => ingredient !== null); // Remove null values (duplicates)

    return initialIngredientList;
  }

  return (
    <div className="recipeContent">
      <div className="recipeTitleAndButtons">
        <h3>{recipe.title}</h3>
        <button onClick={handleView}>View Recipe</button>
        {auth.currentUser !== null && (
          <button onClick={addToFavorites} disabled={doesRecipeExistInFav}>
            {doesRecipeExistInFav ? "Added to Favorites ✓" : "Add to Favorites"}
          </button>
        )}
      </div>
      <img src={recipe.image} alt={recipe.title} />
    </div>
  );
}

export default Results;