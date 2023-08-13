import { useNavigate } from 'react-router-dom';
import './IngredientCreator.css';
import { useState } from 'react';
import { auth, db } from './firebase';
import { addDoc, collection } from 'firebase/firestore';

function IngredientCreator({ favoriteRecipes, ingredientLists, setIngredientLists }) {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [currListTitle, setcurrListTitle] = useState("");
  const [firstDate, setFirstDate] = useState(new Date());
  const [secondDate, setSecondDate] = useState(new Date());
  const [currList, setcurrList] = useState([]);
  const [creationStep, setCreationStep] = useState(1);

  function handleCurrListTitle(){
    setcurrListTitle(userInput)
    setCreationStep((prevStepNum) => prevStepNum+1)
  }

  function formatDate(date) {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else if (date && date.toDate && typeof date.toDate === 'function') {
      // If date is a Firestore Timestamp object, convert it to a Date object
      return formatDate(date.toDate());
    } else if (typeof date === 'string') {
      // If date is already a formatted string, return it as is
      return date;
    } else {
      // Invalid or unsupported date format
      console.error("ERROR: Date not formatted correctly:", date);
      return null;
    }
  }

  function handleGenerateList() {
    favoriteRecipes.forEach((recipe) => {
      recipe.calendarInfo.forEach((dateEle) => {
        const recipeDate = formatDate(dateEle.date);
        if (new Date(recipeDate) >= new Date(firstDate) && new Date(recipeDate) <= new Date(secondDate)) {
          recipe.ingredients.forEach((recipeIngredient) => {
            const existingIngredient = currList.find(
              (item) => item.id === recipeIngredient.id
            );
  
            if (existingIngredient) {
              setcurrList((prevList) =>
                prevList.map((currShoppingListIngredient) => {
                  if (currShoppingListIngredient.id === recipeIngredient.id) {
                    return {
                      ...currShoppingListIngredient,
                      totalAmount:
                        currShoppingListIngredient.totalAmount +
                        recipeIngredient.amountPerServing * dateEle.servingSize,
                    };
                  } else {
                    return currShoppingListIngredient;
                  }
                })
              );
            } else {
              setcurrList((prevList) => [
                ...prevList,
                {
                  id: recipeIngredient.id,
                  name: recipeIngredient.name,
                  aisle: recipeIngredient.aisle,
                  totalAmount: recipeIngredient.amountPerServing * dateEle.servingSize,
                  unit: recipeIngredient.unit,
                  isChecked: false,
                },
              ]);
            }
          });
        }
      });
    });
  
    setCreationStep((prevStepNum) => prevStepNum + 1);
  }

  //ADD new ingredient List
  function handleCreateList(){
    if(currList.length !== 0){
      const newIngredientListEntry = {
          id: ingredientLists.length + 1,
          title: currListTitle,
          ingredients: currList
      }
      const currUser = auth.currentUser;
      if(currUser){
        const userUID = currUser.uid;
        const favoritesRef = collection(db, 'users', userUID, 'ingredientLists');
        addDoc(favoritesRef, newIngredientListEntry)
          .then((docRef) => {
            console.log("Ingredient List added with ID: ", docRef.id);
            setIngredientLists((prevlists) => [...prevlists, newIngredientListEntry])
            navigate(-1)
          })
          .catch((error) => {
            console.error("Error adding Ingredient List: ", error);
          });
      }
      else{
        console.log("User didn't sign in yet")
      }
    }
    else{
        alert("ERROR: No ingredients have been added to new list")
        setCreationStep((prevStepNum) => prevStepNum - 1)
    }
  }

  function handleBackButton() {
    if(creationStep === 2){
      setcurrListTitle("")
    }
    else if(creationStep === 3){
      setcurrList([])
    }
    setCreationStep((prevStepNum) => prevStepNum - 1)
  }

  function handleFirstDateChange(event){
    let selectedDate = new Date(event.target.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    setFirstDate(formatDate(selectedDate));
  }

  function handleSecondDateChange(event){
    let selectedDate = new Date(event.target.value);
    selectedDate.setDate(selectedDate.getDate() + 1);
    setSecondDate(formatDate(selectedDate));
  }

  function generateIngredientListByAisle(){
    const groupedIngredientsList = {};

    currList.forEach((ingredient) => {
      if (!groupedIngredientsList[ingredient.aisle]) {
        groupedIngredientsList[ingredient.aisle] = [];
      }
      groupedIngredientsList[ingredient.aisle].push(ingredient);
    });

    return (
      <div>
        {Object.keys(groupedIngredientsList).sort()
        .map((aisle) => (
          <div key={aisle}>
            <h4>Aisle: {aisle}</h4>
            <ul>
              {groupedIngredientsList[aisle].map((ingredient, index) => (
                <li key={`${aisle}-${index}`}>{ingredient.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
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
        {generateIngredientListByAisle()}
      </div>
      
      {creationStep === 3 && (
        <button onClick={handleCreateList}>Create List</button>
      )}
      
      {(creationStep === 2 || creationStep === 3) && (
        <button onClick={handleBackButton}>Go Back to Previous Step</button>
      )}
      
      <button onClick={() => navigate(-1)}>Exit out of Ingredient Creator Menu</button>
    </>
  );
}

export default IngredientCreator;