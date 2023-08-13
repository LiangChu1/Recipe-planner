import { useLocation, useNavigate } from "react-router-dom";
import './NewRecipeViewer.css';

function NutritionFacts({ nutrition }) {
    const nutritionNames = ["Calories", "Fat", "Sodium", "Carbohydrates", "Protein"];
  
    function getNutrientDataByName(name){
      const nutrient = nutrition.nutrients.find((data) => data.name === name);
  
      if(nutrient){
        return{
          amount: nutrient.amount.toFixed(0),
          unit: nutrient.unit
        };
      }
      else{
        return null;
      }
    }
  
    return (
      <div>
      <h4>Nutrition Facts (per serving):</h4>
      <ul>
          {nutritionNames.map((name) => {
              const nutrientData = getNutrientDataByName(name);
              if(nutrientData){
                return(
                  <li key={name}>
                    {name}: {nutrientData.amount} {nutrientData.unit}
                  </li>
                );
              }
              else{
                return (
                  <li key={name}>
                    {name}: Nutrient data not available
                  </li>
                );
              }
          })}
          <li>Weight: {nutrition.weightPerServing.amount} {nutrition.weightPerServing.unit}</li>
      </ul>
      </div>
    );
}
  
function NewRecipeViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.recipe) {
    return null;
  }

  const { recipe } = location.state;
  const { title, image, readyInMinutes, servings, extendedIngredients, analyzedInstructions, nutrition } = recipe;

  function handleGoBack() {
    navigate(-1);
  }

  function getIngredientAmountPerServing(ingredientId){
    return nutrition.ingredients.find((tempIngredient) => tempIngredient.id === ingredientId)?.amount || 0
  }

  return (
    <div>
      <h3>{title}</h3>
      <img src={image} alt={title} />
      <h4>Average Cooking Time: {readyInMinutes} Minutes</h4>
      <h4>Recommanded Servings for Recipe: {servings}</h4>
      <h4>Ingredient List (w/ measurements per serving): </h4>
      <ul>
        {extendedIngredients.filter((ingredient) => ingredient.id !== -1).map((ingredient) => (
          <li key={ingredient.id}>
            <p>{ingredient.name}: {getIngredientAmountPerServing(ingredient.id)} {ingredient.measures.us.unitShort}</p>
          </li>
        ))}
      </ul>
      {<NutritionFacts nutrition={nutrition}/>}
      <h4>Instructions</h4>
      <ol>
        {analyzedInstructions[0].steps.map((step) => (
          <li key={step.number}>
            <p>{step.step}</p>
          </li>
        ))}
      </ol>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}

export default NewRecipeViewer;