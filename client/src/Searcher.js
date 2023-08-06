import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Searcher.css';
import { auth, db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";
import { recipeDataFetchCall } from "./fetchCalls";
import AdvancedSearcher from "./AdvancedSearcher";

function OutputRecipes({ output, favoriteRecipes, setFavoriteRecipes }) {
  const navigate = useNavigate();
  
  function handleView(id){
    const existingRecipeInFavorites = favoriteRecipes.filter((recipe) => recipe.id === id);
    if(existingRecipeInFavorites.length === 0){
      recipeDataFetchCall({id})
      .then((data) => {
        if (data) {
          navigate(`/newRecipe/${id}`, {state: {recipe: data}});
        } else {
          navigate(`/newRecipe/${id}`, {state: {recipe: null}});
        }
      })
      .catch((error) => {
        console.log("FAILED: " + error);
      });
    }
    else{
      navigate(`/oldRecipe/${existingRecipeInFavorites[0].id}`, {state: {recipe: existingRecipeInFavorites[0]}});
    }
    
  } 

  function getNewInstructions(analyzedInstructions){
    const initialInstructionList = analyzedInstructions[0].steps.map((step) => ({
      number: step.number,
      description: step.step
    }));
    return initialInstructionList;
  }

  function getNewRecipeIngredientList(extendedIngredientsInfo, nutritionAmountPerServing) {
    const initialIngredientList = extendedIngredientsInfo.filter((ingredient) => ingredient.id !== -1).map((ingredient) => ({
      id: ingredient.id,
      name: ingredient.name,
      aisle: ingredient.aisle,
      amountPerServing: nutritionAmountPerServing.find((nutritionIngredient) => nutritionIngredient.id === ingredient.id)?.amount || 0,
      unit: ingredient.measures.us.unitShort
    }));
    return initialIngredientList;
  }

  //ADD to favorite recipe list
  function addToFavorites(id) {
    const doesRecipeExistInFav = favoriteRecipes.find((recipe) => recipe.id === id);
    if(!doesRecipeExistInFav){
      recipeDataFetchCall({id})
      .then((data) => {
        if (data) {
          const newInstructions = getNewInstructions(data.analyzedInstructions);
          const newRecipeIngredientList = getNewRecipeIngredientList(data.extendedIngredients, data.nutrition.ingredients);
          const nutrients = data.nutrition.nutrients;
          const weightPerServing = data.nutrition.weightPerServing;
          const newRecipe = { id: data.id, title: data.title, image: data.image, recommandedServings: data.servings, averageCookTime: data.readyInMinutes, instructions: newInstructions, ingredients: newRecipeIngredientList, nutrition: {nutrients, weightPerServing}, calendarInfo: [] };
          const currUser = auth.currentUser;
          if(currUser){
            const userUID = currUser.uid;
            const favoritesRef = collection(db, 'users', userUID, 'favorites');
            addDoc(favoritesRef, newRecipe)
              .then((docRef) => {
                console.log("Recipe added with ID: ", docRef.id);
                setFavoriteRecipes((prevFavorites) => [...prevFavorites, newRecipe]);
              })
              .catch((error) => {
                console.error("Error adding recipe: ", error);
              });
          }
          else{
            console.log("User didn't sign in yet")
          }
        } else {
          console.log("Failed to add to favorites")
        }
      })
      .catch((error) => {
        console.log("FAILED: " + error);
      });
    }
    else{
      console.log("Recipe is already saved in favorites")
    }
  }  
  
  return (
    <div>
    {output && output.length > 0 ? (
      output.map((recipe) => (
        <div key={recipe.id}>
          <h3>{recipe.title}</h3>
          <img src={recipe.image} alt={recipe.title} />
          <button onClick={() => handleView(recipe.id)}>View Recipe</button>
          {auth.currentUser !== null && (
          <button onClick={() => addToFavorites(recipe.id)}>
            Add to Favorites
          </button>
          )}
        </div>
      ))
    ) : (
      <p>No recipes found.</p>
    )}
  </div>
  );
}


function Searcher({ favoriteRecipes, setFavoriteRecipes }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);

  const [showRecipes, setShowRecipes] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);

  const [offSet, setOffSet] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [currNumber, setCurrNumber] = useState(5);
  
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedIntolerances, setSelectedIntolerances] = useState('');
  const [selectedMealTypes, setSelectedMealTypes] = useState('');

  function handleSearch() {
    if (input !== "" || selectedCuisine !== "" || selectedDiet !== "" || selectedIntolerances !== "" || selectedMealTypes !== "") {
      const json = JSON.stringify({ 
        input: input,
        cuisine: selectedCuisine,
        meal_type: selectedMealTypes,
        intolerance: selectedIntolerances,
        diet: selectedDiet,
        number: currNumber, 
        offSet: offSet 
      });

      fetch('http://127.0.0.1:5000/searchData', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.results.length !== 0) {
            setOutput([...data.results]);
            setTotalResults(data.totalResults);
          } else {
            setOutput([]);
          }
        })
        .catch((error) => {
          console.log("FAILED: " + error);
        });

      setShowRecipes(true);
    } else {
      // Display error message
      alert("Please provide a valid input");
      setShowRecipes(false);
    }
  }

  function handleInput(e) {
    setOffSet(0)
    setTotalResults(0)
    setCurrNumber(5)
    setInput(e.target.value);
  }

  function atMaxResults() {
    return (offSet + 1) * currNumber >= totalResults;
  }

  function handleBackButton() {
    setOffSet((prevOffSet) => prevOffSet - 1);
    setShowRecipes(false);
    setSearchTriggered(true);
  }

  function handleNextButton() {
    setOffSet((prevOffSet) => prevOffSet + 1);
    setShowRecipes(false);
    setSearchTriggered(true);
  }

  if (searchTriggered) {
    handleSearch();
    setSearchTriggered(false);
  }

  return (
    <>
      <h2>Recipe Searcher</h2>
      <input onChange={handleInput} placeholder="Type in Recipe Here" />

      <br/>
      <AdvancedSearcher setSelectedCuisine={setSelectedCuisine} setSelectedDiet={setSelectedDiet} setSelectedIntolerances={setSelectedIntolerances} setSelectedMealTypes={setSelectedMealTypes}/>
      <button onClick={handleSearch}>Search</button>

      {showRecipes && (
        <>
          <OutputRecipes output={output} favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes} />
          <button onClick={handleBackButton} disabled={offSet === 0}>{'<'}</button>
          <button onClick={handleNextButton} disabled={atMaxResults()}>{'>'}</button>
        </>
      )}
    </>
  );
}

export default Searcher;