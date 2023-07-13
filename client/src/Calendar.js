import { useState } from 'react';
import './Calendar.css';
import ReactModal from 'react-modal';
import { recipeDataFetchCall } from './fetchCalls';
import { useNavigate } from 'react-router-dom';


function Calendar({ favoriteRecipes, setFavoriteRecipes }) {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const currentWeekSunday = new Date(today);
    currentWeekSunday.setDate(today.getDate() - today.getDay());
    return currentWeekSunday;
  });
  const [recipeDate, setRecipeDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  function handlePrevWeek() {
    let newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  }

  function handleNextWeek() {
    let newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  }

  function getSecondDate() {
    let newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 6);
    const dateOptions = { month: 'short', day: 'numeric' };
    return newDate.toLocaleString(undefined, dateOptions);
  }

  function getFirstDate() {
    const dateOptions = { month: 'short', day: 'numeric' };
    return currentDate.toLocaleString(undefined, dateOptions);
  }

  function handleAddRecipeToDay(day) {
    setShowModal(true);
    setRecipeDate(day);
  }
  //ADD to calender
  function handleRecipeSelection(recipe) {
    setShowModal(false);

    const updatedRecipes = favoriteRecipes.map((favRecipe) => {
      if (favRecipe.title === recipe.title) {
        return {
          ...favRecipe,
          dates: [...favRecipe.dates, recipeDate],
        };
      }
      return favRecipe;
    });
    setFavoriteRecipes(updatedRecipes);
  }

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
  //DELETE from calendar
  function deleteRecipeDate(id, day){
    const updatedList = favoriteRecipes.map((recipe) => {
      if (recipe.id === id) {
        const filteredDates = recipe.dates.filter((date) => date.toISOString().split('T')[0] !== day);
        return { ...recipe, dates: filteredDates };
      }
      return recipe;
    });
    
    setFavoriteRecipes(updatedList);
  }



  function renderGrid() {
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const days = [];

    // Generate the array of date objects for the week
    for (let i = 0; i < 7; i++) {
      let newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + i);
      days.push(newDate);
    }
    
    // Render each day as a separate element
    const dayElements = days.map((day, index) => {
      const dayFormatted = day.toISOString().split('T')[0]; // Get the date in 'YYYY-MM-DD' format
      return (
        <div key={index}>
          <h4>{weekDays[day.getDay()]}</h4>
          <p>{day.toLocaleDateString()}</p>
          {favoriteRecipes.map((recipe) => {
            const recipeDates = recipe.dates.map((date) => date.toISOString().split('T')[0]);
            if (recipeDates.includes(dayFormatted)) {
              return (
                <div key={recipe.title}>
                  <h3>{recipe.title}</h3>
                  <img src={recipe.image} alt={recipe.title} />
                  <button onClick={() => handleView(recipe.id)}>View Recipe</button>
                  <button onClick={() => deleteRecipeDate(recipe.id, dayFormatted)}>Delete From Day</button>
                </div>
              );
            }
            return null; // add a default return value if the condition is not met
          })}
          <button onClick={() => handleAddRecipeToDay(day)}>+</button>
        </div>
      );
    });

    return <div>{dayElements}</div>;
  }

  return (
    <div>
      <h2>Calendar</h2>
      <h4>
        Current Week: {getFirstDate()}-{getSecondDate()}
      </h4>
      <button onClick={handlePrevWeek}>{'<'}</button>
      <button onClick={handleNextWeek}>{'>'}</button>
      {renderGrid()}
      {/*Pop up menu for recipe selection*/}
      <ReactModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Select a Recipe"
      >
        <h3>Select a Recipe:</h3>
        {favoriteRecipes.map((recipe) => (
          <button key={recipe.title} onClick={() => handleRecipeSelection(recipe)}>
            {recipe.title}
          </button>
        ))}
      </ReactModal>
    </div>
  );
}

export default Calendar;