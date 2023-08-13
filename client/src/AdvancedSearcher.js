import { useState } from 'react';
import './AdvancedSearcher.css';

function AdvancedSearcher({setSelectedCuisine, setSelectedDiet, setSelectedIntolerances, setSelectedMealTypes, selectedIncludedIngredients, setSelectedIncludedIngredients}){
    const cuisineTypes = ['African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'];
    const dietTypes = ['Gluten Free', 'Ketogenic', 'Vegetarian', 'Vegan', 'Pescetarian', 'Paleo'];
    const intolerances = ['Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'];
    const mealTypes = ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood', 'snack', 'drink',];
    const [newIncludedIngredient, setNewIncludedIngredient] = useState('');
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

    function handleToggleAdvancedOptions() {
      setShowAdvancedOptions((prevValue) => !prevValue);
      resetSetters()
    }

    function resetSetters(){
      setSelectedCuisine('')
      setSelectedDiet('')
      setSelectedIntolerances('')
      setSelectedMealTypes('')
      setSelectedIncludedIngredients([])
      setNewIncludedIngredient('')
    }

    function handleAdvancedInputs(inputType, event){
      if (inputType === "cuisine") {
        setSelectedCuisine(event.target.value);
      } 
      else if (inputType === "diet") {
        setSelectedDiet(event.target.value);
      }
      else if (inputType === "intolerances") {
        setSelectedIntolerances(event.target.value);
      }
      else if (inputType === "mealType"){
        setSelectedMealTypes(event.target.value);
      }
    }

    function addIncludedIngredient(){
      setSelectedIncludedIngredients([...selectedIncludedIngredients, newIncludedIngredient])
      setNewIncludedIngredient('')
    }

    function deleteIncludedIngredient(ingredientName, index){
      const updatedIncludedIngredientList = selectedIncludedIngredients.filter((tempIngredientName, tempIndex) => tempIngredientName !== ingredientName && tempIndex !== index);
      setSelectedIncludedIngredients(updatedIncludedIngredientList)
    }

    return (
        <>
        {showAdvancedOptions && (
          <>
            <h4>Advanced Options</h4>
            <label>Cuisine</label>
            <select onChange={(e) => handleAdvancedInputs("cuisine", e)}>
              <option value="">Select Cuisine</option>
              {cuisineTypes.map((type) => {
                return <option key={type}>{type}</option>
              })}
            </select>
            <br/>
            <label>Diet</label>
            <select onChange={(e) => handleAdvancedInputs("diet", e)}>
              <option value="">Select Diet</option>
              {dietTypes.map((type) => {
                return <option key={type}>{type}</option>
              })}
            </select>
            <br/>
            <label>Food Intolerances</label>
            <select onChange={(e) => handleAdvancedInputs("intolerances", e)}>
              <option value="">Select Food Intolerance</option>
              {intolerances.map((type) => {
                return <option key={type}>{type}</option>
              })}
            </select>
            <br/>
            <label>Meals Types</label>
            <select onChange={(e) => handleAdvancedInputs("mealType", e)}>
              <option value="">Select Diet</option>
              {mealTypes.map((type) => {
                return <option key={type}>{type}</option>
              })}
            </select>
            <br/>
            <label>Included Ingredients</label>
            <ul>
              {selectedIncludedIngredients.map((ingredientName, index) => (
                <li key={index}>
                  <button onClick={() => deleteIncludedIngredient(ingredientName, index)}>-</button>
                  {ingredientName}
                </li>
              ))}
              <li>
                <input
                  type="text"
                  placeholder="Add ingredient..."
                  value={newIncludedIngredient}
                  onChange={(e) => setNewIncludedIngredient(e.target.value)}
                />
                <button onClick={addIncludedIngredient}>+</button>
              </li>
            </ul>
          </>
        )}
        <button onClick={handleToggleAdvancedOptions}>
            {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>
        <br/>
      </>
    )
}

export default AdvancedSearcher;