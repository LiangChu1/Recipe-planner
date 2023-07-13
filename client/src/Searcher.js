import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Searcher.css';
import {recipeDataFetchCall} from "./fetchCalls";

function OutputRecipes({ output, favoriteRecipes, setFavoriteRecipes }) {
  const navigate = useNavigate();
  
  function handleView(id){
    recipeDataFetchCall({id})
    .then((data) => {
      if (data) {
        navigate(`/recipe/${id}`, {state: {recipe: data}});
      } else {
        navigate(`/recipe/${id}`, {state: {recipe: null}});
      }
    })
    .catch((error) => {
      console.log("FAILED: " + error);
    });
  } 

  //ADD to favorite recipe list
  function addToFavorites(id) {
    recipeDataFetchCall({id})
    .then((data) => {
      if (data) {
        const updatedRecipe = { ...data, dates: [] };
        setFavoriteRecipes([...favoriteRecipes, updatedRecipe]);
      } else {
        console.log("FAILED TO ADD TO FAVORITES")
      }
    })
    .catch((error) => {
      console.log("FAILED: " + error);
    });
  }  
  
  return (
    <div>
    {output && output.length > 0 ? (
      output.map((recipe) => (
        <div key={recipe.id}>
          <h3>{recipe.title}</h3>
          <img src={recipe.image} alt={recipe.title} />
          <button onClick={() => handleView(recipe.id)}>View Recipe</button>
          <button onClick={() => addToFavorites(recipe.id)}>
            Add to Favorites
          </button>
        </div>
      ))
    ) : (
      <p>No recipes found.</p>
    )}
  </div>
  );
}

function Searcher({favoriteRecipes, setFavoriteRecipes}) {
  const [input, setInput] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const [showRecipes, setShowRecipes] = useState(false);
  const [output, setOutput] = useState([]);

  function handleSearch() {
    if (input !== "" && searchAmount !== "") {
      const json = JSON.stringify({ recipeName: input, number: searchAmount });

      fetch('http://127.0.0.1:5000/searchData', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: json
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.results.length !== 0) {
            setOutput([...data.results]);
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
      alert("Please provide both recipe name and search amount.");
      setShowRecipes(false);
    }
  }

  function handleInput(e) {
    setInput(e.target.value);
  }

  function handleSearchAmount(e) {
    setSearchAmount(e.target.value);
  }

  return (
    <>
      <h2>Recipe Searcher</h2>
      <input onChange={handleInput} placeholder="Recipe Name Here" />
      <input
        onChange={handleSearchAmount}
        type="number"
        min="1"
        placeholder="Search Amount here"
      />
      <button onClick={handleSearch}>Search</button>
      {showRecipes && <OutputRecipes output={output} favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes}/>}
    </>
  );
}

export default Searcher;