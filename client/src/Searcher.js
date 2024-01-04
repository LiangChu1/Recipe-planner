import { useState } from "react";
import './Searcher.css';
import AdvancedSearcher from "./AdvancedSearcher";
import Results from "./Results";

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
          <div>
            {output.map((recipe) => (
                <Results
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