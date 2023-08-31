import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Searcher.css';
import { auth, db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";
import { recipeDataFetchCall } from "./fetchCalls";
import AdvancedSearcher from "./AdvancedSearcher";

function OutputRecipes({ recipe, favoriteRecipes, setFavoriteRecipes }) {
  const navigate = useNavigate();
  
  const handleView = useCallback(() => {
    const existingRecipeInFavorites = favoriteRecipes.filter((favRecipe) => favRecipe.id === recipe.id);
    if(existingRecipeInFavorites.length === 0){
      recipeDataFetchCall({id : recipe.id})
      .then((data) => {
        if (data) {
          navigate(`/newRecipe/${recipe.id}`, {state: {recipe: data}});
        } else {
          navigate(`/newRecipe/${recipe.id}`, {state: {recipe: null}});
        }
      })
      .catch((error) => {
        console.log("FAILED: " + error);
      });
    }
    else{
      navigate(`/oldRecipe/${existingRecipeInFavorites[0].id}`, {state: {recipe: existingRecipeInFavorites[0]}});
    }
    
  }, [recipe.id, favoriteRecipes, navigate]); 

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
  const addToFavorites = useCallback(() => {
    const doesRecipeExistInFav = favoriteRecipes.find((favRecipe) => favRecipe.id === recipe.id);
    if(!doesRecipeExistInFav){
      recipeDataFetchCall({id: recipe.id})
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
  }, [recipe.id, favoriteRecipes, setFavoriteRecipes]);
  
  return (
    <div className="recipeContent">
      <h3>{recipe.title}</h3>
      <img src={recipe.image} alt={recipe.title} />
      <div className="recipeActionButtons"> 
        <button onClick={handleView}>View Recipe</button>
        {auth.currentUser !== null && (
          <button onClick={addToFavorites}>Add to Favorites</button>
        )}
      </div>
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
  const currNumber = 6;
  
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedIntolerances, setSelectedIntolerances] = useState('');
  const [selectedMealTypes, setSelectedMealTypes] = useState('');
  const [selectedIncludedIngredients, setSelectedIncludedIngredients] = useState([]);

  function handleSearch() {
    if (input !== "" || selectedCuisine !== "" || selectedDiet !== "" || selectedIntolerances !== "" || selectedMealTypes !== "" || selectedIncludedIngredients !== "") {
      const json = JSON.stringify({ 
        input: input,
        cuisine: selectedCuisine,
        meal_type: selectedMealTypes,
        intolerance: selectedIntolerances,
        diet: selectedDiet,
        includedIngredients: selectedIncludedIngredients,
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

  function handleInitialSearch(){
    setOffSet(0);
    setOutput([]);
    setTotalResults(0);
    handleSearch();
  }

  function atMaxResults() {
    return (offSet + 1) * currNumber >= totalResults;
  }

  function getDisplayedRange() {
    const start = offSet * currNumber + 1;
    const end = Math.min(start + currNumber - 1, totalResults);
    return `${start}-${end} out of ${totalResults}`;
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
      <input onChange={(e) => setInput(e.target.value)} placeholder="Type in Recipe Here" />
      <br/>
      <AdvancedSearcher setSelectedCuisine={setSelectedCuisine} setSelectedDiet={setSelectedDiet} setSelectedIntolerances={setSelectedIntolerances} setSelectedMealTypes={setSelectedMealTypes} selectedIncludedIngredients={selectedIncludedIngredients} setSelectedIncludedIngredients={setSelectedIncludedIngredients}/>
      <button onClick={handleInitialSearch}>Search</button>

      {showRecipes && (
        <div className="searcherPage">
          <div className="recipeResults">
            {output.map((recipe) => (
                <OutputRecipes
                  key={recipe.id}
                  recipe={recipe}
                  favoriteRecipes={favoriteRecipes}
                  setFavoriteRecipes={setFavoriteRecipes}
                />
            ))}
          </div>
          <div className="subMenu">
            <button onClick={handleBackButton} disabled={offSet === 0}>{'<'}</button>
            <div>{getDisplayedRange()}</div>
            <button onClick={handleNextButton} disabled={atMaxResults()}>{'>'}</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Searcher;