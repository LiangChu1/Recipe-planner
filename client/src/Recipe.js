import { useLocation, useNavigate } from "react-router-dom";
import './Recipe.css';

function Recipe() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.recipe) {
    return null;
  }

  const { recipe } = location.state;
  const { title, image, readyInMinutes, servings, extendedIngredients, analyzedInstructions } = recipe;

  function handleGoBack() {
    navigate(-1);
  }

  return (
    <div>
      <h3>{title}</h3>
      <img src={image} alt={title} />
      <h4>Ready in {readyInMinutes} Minutes</h4>
      <h4>Servings: {servings}</h4>
      <h4>Ingredient List</h4>
      <ul>
        {extendedIngredients.map((ingredient) => (
          <li key={ingredient.id}>
            <p>{ingredient.name}: {ingredient.measures.us.amount.toFixed(2)} {ingredient.measures.us.unitShort}</p>
          </li>
        ))}
      </ul>
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

export default Recipe;