import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function IngredientViewer({ setIngredientLists }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.ingredientList) {
    return null;
  }

  return (
    <IngredientViewerContent
      setIngredientLists={setIngredientLists}
      recipe={location.state.ingredientList}
      navigate={navigate}
    />
  );
}

function IngredientViewerContent({ setIngredientLists, recipe, navigate }) {
  const [ingredientList, setIngredientList] = useState(recipe);
  const { title, ingredients, totalCost } = ingredientList;

  function handleIngredientChange(index) {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].isChecked = !updatedIngredients[index].isChecked;
    setIngredientList((prevState) => ({
      ...prevState,
      ingredients: updatedIngredients,
    }));
  }

  //UPDATE Ingredient List's state
  function handleFormSubmit(event) {
      event.preventDefault();
      setIngredientLists((prevState) =>
        prevState.map((list) =>
          list.title === title ? ingredientList : list
        )
      );
      navigate(-1);
  }

  return (
    <div>
      <h3>{title}</h3>
      <form onSubmit={handleFormSubmit}>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={index}
              name={"ingredient#" + index}
              value={index}
              onChange={() => handleIngredientChange(index)}
              checked={ingredient.isChecked}
            />
            <label htmlFor={index}>
              {ingredient.name}
              {" ("}
              {ingredient.amountValue.toFixed(2)} {ingredient.amountUnit}
              {")"}
              {" - $"}
              {(ingredient.price / 100).toFixed(2)}
            </label>
          </div>
        ))}
        <input type="submit" value="Save" />
      </form>
      <p>Total Cost: ${parseFloat(totalCost).toFixed(2)}</p>

      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

export default IngredientViewer;