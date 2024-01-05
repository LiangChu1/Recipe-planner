import { useLocation, useNavigate } from "react-router-dom";
import './RecipeViewer.css';

function NutritionFacts({ nutrition, recipe }) {
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

    function getServingSizeNumber(recipe){
      if(recipe.servings){
        return recipe.servings;
      }
      else{
        const currentServingForDay = recipe.servingSizeForDay;
        return currentServingForDay ? currentServingForDay : recipe.recommandedServings;
      }
    }
  
    return (
      <div>
      <h4>Nutrition Facts:</h4>
      <h5>According to Servings:</h5>
      <ul>
          {nutritionNames.map((name) => {
              const nutrientData = getNutrientDataByName(name);
              if(nutrientData){
                return(
                  <li key={name}>
                    {name}: {nutrientData.amount * getServingSizeNumber(recipe)} {nutrientData.unit}
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
          <li>Weight: {nutrition.weightPerServing.amount * getServingSizeNumber(recipe)} {nutrition.weightPerServing.unit}</li>
      </ul>

      <h5>Per Serving:</h5>
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


function IngredientListing({recipe}){

  const currentIngredientListing = recipe.extendedIngredients ? recipe.extendedIngredients : recipe.ingredients;
  const isUsingOldFields = recipe.extendedIngredients ? true : false;

  function filterUniqueIngredients(extendedIngredients) {
    
    const uniqueIngredientIds = new Set();
    return extendedIngredients.filter((ingredient) => {
        if (ingredient.id !== -1 && !uniqueIngredientIds.has(ingredient.id)) {
            uniqueIngredientIds.add(ingredient.id);
            return true;
        }
        return false;
    });
  }

  function getIngredientAmountPerServing(ingredientId) {
    const tempIngredient = currentIngredientListing.find((tempIngredient) => tempIngredient.id === ingredientId);
    if (tempIngredient) {
      const { amount, measures, unit } = tempIngredient;
      const unitShort = measures?.us?.unitShort || unit; // Check if measures and measures.us exist
      const amountPerServing = isUsingOldFields ? (amount / recipe.servings).toFixed(2) : amount;
      return `${amountPerServing} ${unitShort}`;
    } else {
      return '0';
    }
  }

  function getIngredientAmountAccordingToServing(ingredientId){
    const tempIngredient = currentIngredientListing.find((tempIngredient) => tempIngredient.id === ingredientId);
    if (tempIngredient) {
      const { amount, measures, unit } = tempIngredient;
      const unitShort = measures?.us?.unitShort || unit; // Check if measures and measures.us exist
      const amountPerServing = isUsingOldFields ? (amount / recipe.servings).toFixed(2) : amount;
      return `${amountPerServing * getServingSizeNumber(recipe)} ${unitShort}`;
    } else {
      return '0';
    }
  }

  function getServingSizeNumber(recipe){
    if(recipe.servings){
      return recipe.servings;
    }
    else{
      const currentServingForDay = recipe.servingSizeForDay;
      return currentServingForDay ? currentServingForDay : recipe.recommandedServings;
    }
  }

  return(
    <div>
      <h4>Ingredient List: </h4>

      <h5>Measurements According to Servings:</h5>
      <ul>
      {isUsingOldFields
        ? filterUniqueIngredients(currentIngredientListing).map((ingredient) => (
            <li key={ingredient.id}>
              <p>
                {ingredient.name}: {getIngredientAmountAccordingToServing(ingredient.id)};
              </p>
            </li>
          ))
        : currentIngredientListing.map((ingredient) => (
            <li key={ingredient.id}>
              <p>
                {ingredient.name}: {getIngredientAmountAccordingToServing(ingredient.id)};
              </p>
            </li>
          ))}
      </ul>

      <h5>Measurements Per Serving:</h5>
      <ul>
      {isUsingOldFields
        ? filterUniqueIngredients(currentIngredientListing).map((ingredient) => (
            <li key={ingredient.id}>
              <p>
                {ingredient.name}: {getIngredientAmountPerServing(ingredient.id)};
              </p>
            </li>
          ))
        : currentIngredientListing.map((ingredient) => (
            <li key={ingredient.id}>
              <p>
                {ingredient.name}: {getIngredientAmountPerServing(ingredient.id)};
              </p>
            </li>
          ))}
      </ul>
    </div>
  )
}


function InstructionsListing({ recipe }) {
  const currentInstructionsListing = recipe.analyzedInstructions ? recipe.analyzedInstructions : recipe.instructions;
  const isUsingOldFields = recipe.analyzedInstructions ? true : false;

  return (
    <div>
      <h4>Instructions</h4>
      <ol>
        {isUsingOldFields
          ? currentInstructionsListing[0].steps.map((step) => (
              <li key={step.number}>
                <p>{step.step}</p>
              </li>
            ))
          : currentInstructionsListing.map((step) => (
              <li key={step.number}>
                <p>{step.description}</p>
              </li>
            ))}
      </ol>
    </div>
  );
}
  
function RecipeViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.recipe) {
    return null;
  }

  const { recipe } = location.state;

  //new RecipeViewer
  //const { title, image, readyInMinutes, servings, extendedIngredients, analyzedInstructions, nutrition } = recipe;

  //old RecipeViewer
  /*
  const { title, image, averageCookTime, ingredients, instructions, nutrition } = recipe;

  // Check if the serving size for the day is available in the recipe state
  const servingSizeForDay = location.state.recipe.servingSizeForDay;
  const servingsForDisplay = servingSizeForDay ? servingSizeForDay : recipe.recommandedServings;
  */

  function handleGoBack() {
    navigate(-1);
  }

  function getServingSize(recipe){
    if(recipe.servings){
      return recipe.servings + " (Recommanded)";
    }
    else{
      const currentServingForDay = recipe.servingSizeForDay;
      return currentServingForDay ? currentServingForDay : recipe.recommandedServings + " (Recommanded)";
    }
  }

  return (
    <div>
      <h3>{recipe.title}</h3>
      <img src={recipe.image} alt={recipe.title} />
      <h4>Average Cooking Time: {recipe.readyInMinutes ? recipe.readyInMinutes : recipe.averageCookTime} Minutes</h4>
      <h4>Serving Size: {getServingSize(recipe)}</h4>
      {<IngredientListing recipe={recipe}/>}
      {<NutritionFacts recipe={recipe} nutrition={recipe.nutrition}/>}
      {<InstructionsListing recipe={recipe}/>}
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  );
}

export default RecipeViewer;