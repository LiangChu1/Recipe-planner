import { useLocation, useNavigate } from "react-router-dom";
import './OldRecipeViewer.css';

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


function OldRecipeViewer() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.recipe) {
    return null;
  }

  function handleGoBack() {
    navigate(-1);
  }

  const { recipe } = location.state;
  const { title, image, averageCookTime, ingredients, instructions, nutrition } = recipe;

  // Check if the serving size for the day is available in the recipe state
  const servingSizeForDay = location.state.recipe.servingSizeForDay;
  const servingsForDisplay = servingSizeForDay ? servingSizeForDay : recipe.recommandedServings;

  return (
    <div>
      <h3>{title}</h3>
      <img src={image} alt={title} />
      <h4>Average Cooking Time: {averageCookTime} Minutes</h4>
      <h4>Servings for Recipe: {servingsForDisplay}</h4>
      <h4>Ingredient List (w/ measurements): </h4>
      <ul>
        {ingredients.map((ingredient) => (
          <li key={ingredient.id}>
            <p>{ingredient.name}: {(ingredient.amountPerServing * servingsForDisplay).toFixed(1)} {ingredient.unit}</p>
            <p>Aisle: {ingredient.aisle}</p>
          </li>
        ))}
      </ul>
      {<NutritionFacts nutrition={nutrition}/>}
      <h4>Instructions: </h4>
      <ol>
        {instructions.map((step) => (
          <li key={step.number}>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
      <button onClick={handleGoBack}>Go Back</button>
    </div>
  ); 
}


export default OldRecipeViewer;