import { useState } from 'react';
import './ShoppingList.css';

function ShoppingList({ favoriteRecipes, setFavoriteRecipes, ingredientList, setIngredientList, totalCost, setTotalCost }) {
  const [dataFetched, setDataFetched] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  function getShoppingList() {
    let completedRequests = 0;

    favoriteRecipes.forEach((recipe, recipeIndex) => {
      if(!recipe.isFetched){
      const json = JSON.stringify({ recipeId: recipe.id });
      fetch('http://127.0.0.1:5000/shoppingList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.ingredients) {
            const newIngredients = data.ingredients.map((ingredient) => ({
              recipeId: recipe.id,
              name: ingredient.name,
              image: ingredient.image,
              price: ingredient.price,
              amountValue: ingredient.amount.us.value,
              amountUnit: ingredient.amount.us.unit,
              isChecked: false
            }));

            setIngredientList((prevIngredientList) => [
              ...prevIngredientList,
              ...newIngredients,
            ]);

            setTotalCost((prevTotalCost) => prevTotalCost + (data.totalCost / 100).toFixed(2));
            
            const updatedFavoriteRecipes = [...favoriteRecipes];
            updatedFavoriteRecipes[recipeIndex] = {
              ...updatedFavoriteRecipes[recipeIndex],
              isFetched: true,
            };
            setFavoriteRecipes(updatedFavoriteRecipes);
          }
        })
        .catch((error) => {
          console.log('FAILED: ' + error);
        });
      }
      completedRequests++;
      if (completedRequests === favoriteRecipes.length) {
        setDataFetched(true);
      }
    });
  }

  function handleIngredientChange(event) {
    const ingredientIndex = parseInt(event.target.value, 10);
    const isChecked = event.target.checked;

    setIngredientList((prevIngredientList) =>
      prevIngredientList.map((ingredient, index) =>
        index === ingredientIndex ? { ...ingredient, isChecked } : ingredient
      )
    );

    if (isChecked) {
      setSelectedIngredients((prevSelectedIngredients) => [
        ...prevSelectedIngredients,
        ingredientIndex,
      ]);
    } else {
      setSelectedIngredients((prevSelectedIngredients) =>
        prevSelectedIngredients.filter((index) => index !== ingredientIndex)
      );
    }
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    const selectedIngredientsData = selectedIngredients.map(
      (index) => ingredientList[index]
    );

    const updatedIngredientList = ingredientList.map((ingredient, index) => {
      if (selectedIngredients.includes(index)) {
        return { ...ingredient, isChecked: true };
      }
      return ingredient;
    });
  
    setIngredientList(updatedIngredientList);

    // Do something with the selected ingredients data
    console.log(selectedIngredientsData);
  }

  if (!dataFetched) {
    getShoppingList();
  }

  return (
    <div>
      <h2>Shopping Cart:</h2>
      <form onSubmit={handleFormSubmit}>
        {ingredientList.map((ingredient, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={index}
              name={"ingredient#" + index}
              value={index}
              onChange={handleIngredientChange}
              checked={ingredient.isChecked}
            />
            <label htmlFor={index}>
              {ingredient.name}
              {' ('}
              {ingredient.amountValue.toFixed(2)} {ingredient.amountUnit}
              {')'}
              {' - $'}
              {(ingredient.price / 100).toFixed(2)}
            </label>
          </div>
        ))}
        <input type="submit" value="Save" />
      </form>
      <p>Total Cost: ${parseFloat(totalCost).toFixed(2)}</p>
    </div>
  );
}

export default ShoppingList;