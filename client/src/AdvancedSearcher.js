import { useState } from 'react';
import './AdvancedSearcher.css';

function AdvancedSearcher({setSelectedCuisine, setSelectedDiet, setSelectedIntolerances, setSelectedMealTypes}){
    const cuisineTypes = ['African', 'Asian', 'American', 'British', 'Cajun', 'Caribbean', 'Chinese', 'Eastern European', 'European', 'French', 'German', 'Greek', 'Indian', 'Irish', 'Italian', 'Japanese', 'Jewish', 'Korean', 'Latin American', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Nordic', 'Southern', 'Spanish', 'Thai', 'Vietnamese'];
    const dietTypes = ['Gluten Free', 'Ketogenic', 'Vegetarian', 'Vegan', 'Pescetarian', 'Paleo'];
    const intolerances = ['Dairy', 'Egg', 'Gluten', 'Grain', 'Peanut', 'Seafood', 'Sesame', 'Shellfish', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'];
    const mealTypes = ['main course', 'side dish', 'dessert', 'appetizer', 'salad', 'bread', 'breakfast', 'soup', 'beverage', 'sauce', 'marinade', 'fingerfood', 'snack', 'drink',];
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

    function handleToggleAdvancedOptions() {
      setShowAdvancedOptions((prevValue) => !prevValue);
    }

    function handleAdvancedInputs(inputType, event){
      setSelectedCuisine('')
      setSelectedDiet('')
      setSelectedIntolerances('')
      setSelectedMealTypes('')

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