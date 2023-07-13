import { useNavigate } from 'react-router-dom';
import './IngredientCreator.css';
import { useState } from 'react';

function IngredientCreator({ favoriteRecipes, setIngredientLists }) {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [currListTitle, setcurrListTitle] = useState("");
  const [firstDate, setFirstDate] = useState(new Date());
  const [secondDate, setSecondDate] = useState(new Date());
  const [currList, setcurrList] = useState([]);
  const [totalCost, settotalCost] = useState(0);
  const [creationStep, setCreationStep] = useState(1);

  function handleCurrListTitle(){
    setcurrListTitle(userInput)
    setCreationStep((prevStepNum) => prevStepNum+1)
  }

  function handleGenerateList() {
    favoriteRecipes.forEach((recipe) => {
      recipe.dates.forEach((date) => {
        const recipeDate = new Date(date);
        if (recipeDate.getDate() >= firstDate.getDate() && recipeDate.getDate() <= secondDate.getDate()) {
          const json = JSON.stringify({ recipeId: recipe.id });
          fetch('http://127.0.0.1:5000/ingredientMenu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: json,
          })
            .then((res) => res.json())
            .then((data) => {
              if (data && data.ingredients) {
                data.ingredients.forEach((newIngredient) => {
                  setcurrList((prevIngredientList) => {
                    const existingIngredientIndex = prevIngredientList.findIndex((item) => item.name === newIngredient.name);
                    if (existingIngredientIndex !== -1) {
                      // Update the existing ingredient's price and amount value by adding up the existing values to the new values
                      const updatedList = [...prevIngredientList];
                      updatedList[existingIngredientIndex] = {
                        ...updatedList[existingIngredientIndex],
                        price: updatedList[existingIngredientIndex].price + newIngredient.price,
                        amountValue: updatedList[existingIngredientIndex].amountValue + newIngredient.amount.us.value,
                      };
                      return updatedList;
                    } else {
                      // Add the new ingredient to the list
                      return [
                        ...prevIngredientList,
                        {
                          name: newIngredient.name,
                          price: newIngredient.price,
                          amountValue: newIngredient.amount.us.value,
                          amountUnit: newIngredient.amount.us.unit,
                          isChecked: false,
                        },
                      ];
                    }
                  });
                });
  
                settotalCost((prevTotalCost) => prevTotalCost + parseFloat((data.totalCost / 100).toFixed(2)));
              }
            })
            .catch((error) => {
              console.log('FAILED: ' + error);
            });
        }
      });
    });
    setCreationStep((prevStepNum) => prevStepNum + 1);
  }

  //ADD new ingredient List
  function handleCreateList(){
    if(currList.length !== 0 && totalCost !== 0){
    const newIngredientListEntry = {
        title: currListTitle,
        ingredients: currList,
        totalCost: totalCost
    }
    setIngredientLists((prevlists) => [...prevlists, newIngredientListEntry])
    navigate(-1)
    }
    else{
        alert("ERROR: No ingredients have been added to new list")
        setCreationStep((prevStepNum) => prevStepNum - 1)
    }
  }

  function handleReverseCreateList() {
    if(creationStep === 2){
      setcurrListTitle("")
    }
    else if(creationStep === 3){
      setcurrList([])
      settotalCost(0)
    }
    setCreationStep((prevStepNum) => prevStepNum - 1)
  }

  function handleFirstDateChange(event){
    let selectedDate = new Date(event.target.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    setFirstDate(selectedDate);
  }

  function handleSecondDateChange(event){
    let selectedDate = new Date(event.target.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    setSecondDate(selectedDate);
  }

  return (
    <>
      <h2> Ingredient List Creator: </h2>

      {creationStep === 1 && (
      <div>
        <input type='text' placeholder='Set Ingredient List Title' onChange={(e) => setUserInput(e.target.value)}></input>
        <button onClick={handleCurrListTitle} disabled={userInput === ""}>Set Title</button>
      </div>
      )}
      
      {creationStep === 2 && (
      <div>
        <h3>Pick calendar dates: </h3>
        <label>First Date: </label>
        <input type='date' onChange={handleFirstDateChange}></input>
        <label>Second Date: </label>
        <input type='date' onChange={handleSecondDateChange}></input>
        <button onClick={handleGenerateList} disabled={firstDate === "" && secondDate === ""}>Generate List</button>
      </div>
      )}

      <div>
        <h2> Title so far: {currListTitle}</h2>
        <h3> Ingredients Far: </h3>
        <ul>
          {currList.map((ingredient) => (
              <li>
              {ingredient.name}
              {" ("}
              {ingredient.amountValue.toFixed(2)} {ingredient.amountUnit}
              {")"}
              {" - $"}
              {(ingredient.price / 100).toFixed(2)}
              </li>
          ))}
        </ul>
        <h3> Your Total so Far: ${parseFloat(totalCost).toFixed(2)}</h3>
      </div>
      
      {creationStep === 3 && (
        <button onClick={handleCreateList}>Create List</button>
      )}
      
      {(creationStep === 2 || creationStep === 3) && (
        <button onClick={handleReverseCreateList}>Go Back to Previous Step</button>
      )}
      
      <button onClick={() => navigate(-1)}>Exit out of Ingredient Creator Menu</button>
    </>
  );
}

export default IngredientCreator;