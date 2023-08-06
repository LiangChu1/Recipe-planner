import { useState } from 'react';
import './Calendar.css';
import ReactModal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from './firebase';

function Calendar({ favoriteRecipes, setFavoriteRecipes }) {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    const currentWeekSunday = new Date(today);
    currentWeekSunday.setDate(today.getDate() - today.getDay());
    return currentWeekSunday;
  });
  const [recipeDate, setRecipeDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [servingSize, setServingSize] = useState(1);
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
    setRecipeDate(new Date(day));
  }

  // ADD to calendar
  function handleAddRecipeToDate() {
    setShowModal(false);
  
    if (selectedRecipe) {
      const updatedRecipes = favoriteRecipes.map((favRecipe) => {
        if (favRecipe.id === selectedRecipe.id) {
          const updatedCalendarInfo = {
            date: new Date(recipeDate),
            servingSize: servingSize,
          };
          return {
            ...favRecipe,
            calendarInfo: [...favRecipe.calendarInfo, updatedCalendarInfo],
          };
        }
        return favRecipe;
      });
      setFavoriteRecipes(updatedRecipes);
  
      const currUser = auth.currentUser;
      if (currUser) {
        const userUID = currUser.uid;
        const favoritesRef = collection(db, 'users', userUID, 'favorites');
        const queryRef = query(favoritesRef, where('id', '==', selectedRecipe.id));
  
        getDocs(queryRef)
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              const recipeRef = querySnapshot.docs[0].ref;
              const updatedDateInfo = {
                date: recipeDate,
                servingSize: servingSize,
              };
              updateDoc(recipeRef, { calendarInfo: [...selectedRecipe.calendarInfo, updatedDateInfo] })
                .then(() => {
                  console.log('Recipe calendar Info has been updated successfully!');
                })
                .catch((error) => {
                  console.error('Error updating recipe calendar Info: ', error);
                });
            } else {
              console.error('Recipe not found in favorites.');
            }
          })
          .catch((error) => {
            console.error('Error querying recipe: ', error);
          });
      }
    }
    setSelectedRecipe(null)
    setServingSize(1)
  }
  

  function handleView(id, servingSize){
    const existingRecipeInFavorites = favoriteRecipes.filter((recipe) => recipe.id === id);
    if(existingRecipeInFavorites){
      const modifiedRecipe = {
        ...existingRecipeInFavorites[0],
        servingSizeForDay: servingSize
      };
      navigate(`/oldRecipe/${modifiedRecipe.id}`, { state: { recipe: modifiedRecipe } });
    }
  }

  //DELETE from calendar
  function deleteRecipeDate(id, day, servingSizeToDelete){
    const updatedList = favoriteRecipes.map((recipe) => {
      if (recipe.id === id) {
        const filteredDates = recipe.calendarInfo.filter((date) => {
          const dateFormatted = formatDate(date.date);
          return dateFormatted !== day || date.servingSize !== servingSizeToDelete;
        });
        return { ...recipe, calendarInfo: filteredDates };
      }
      return recipe;
    });
  
    setFavoriteRecipes(updatedList);

    const currUser = auth.currentUser;
    if(currUser){
      const userUID = currUser.uid;
      const favoritesRef = collection(db, 'users', userUID, 'favorites');
      const queryRef = query(favoritesRef, where('id', '==', id));
      
      getDocs(queryRef)
      .then((querySnapshot) => {
        if(!querySnapshot.empty){
          const recipeRef = querySnapshot.docs[0].ref;
          const updatedRecipe = updatedList.find((recipe) => recipe.id === id);
          updateDoc(recipeRef, {calendarInfo: updatedRecipe.calendarInfo}).then(() => {
            console.log('Recipe calendar Info updated successfully!');
          })
          .catch((error) => {
            console.error('Error updating recipe calendar Info: ', error);
          })
        }
        else{
          console.error('Recipe not found in favorites.')
        }
      })
      .catch((error) => {
        console.error("Error querying recipe: ", error);
      });
    }
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
      const dayFormatted = formatDate(day);
      // Initialize the nutrition totals
      let totalCaloriesOfDay = 0;
      let totalFatOfDay = 0;
      let totalSodiumOfDay = 0;
      let totalCarbsOfDay = 0;
      let totalProteinOfDay = 0;
    
      // Iterate through favoriteRecipes and calculate the totals
      favoriteRecipes.forEach((recipe) => {
        const matchingDates = recipe.calendarInfo.filter(
          (dateEle) => formatDate(dateEle.date) === dayFormatted
        );
    
        if (matchingDates.length > 0) {
          matchingDates.forEach((dateEle) => {
            // Calculate the total nutrition for the day based on the recipe's nutrition per serving and the serving size for that day
            const servingsForDisplay = dateEle.servingSize ? dateEle.servingSize : recipe.recommandedServings;
            
            const caloriesNutrient = recipe.nutrition.nutrients.find((nutrient) => nutrient.name === "Calories");
            if (caloriesNutrient) {
              totalCaloriesOfDay += caloriesNutrient.amount * servingsForDisplay;
            }
            
            const fatNutrient = recipe.nutrition.nutrients.find((nutrient) => nutrient.name === "Fat");
            if (fatNutrient) {
              totalFatOfDay += fatNutrient.amount * servingsForDisplay;
            }

            const sodiumNutrient = recipe.nutrition.nutrients.find((nutrient) => nutrient.name === "Sodium");
            if (sodiumNutrient){
              totalSodiumOfDay += sodiumNutrient.amount * servingsForDisplay;
            }

            const carbsNurient = recipe.nutrition.nutrients.find((nutrient) => nutrient.name === "Carbohydrates");
            if (carbsNurient){
              totalCarbsOfDay += carbsNurient.amount * servingsForDisplay;
            }
            const proteinNurient = recipe.nutrition.nutrients.find((nutrient) => nutrient.name === "Protein");
            if (proteinNurient){
              totalProteinOfDay += proteinNurient.amount * servingsForDisplay;
            }
          });
        }
      });  
  
      return (
        <div key={index}>
          <h4>{weekDays[day.getDay()]}</h4>
          <p>{day.toLocaleDateString()}</p>
          {favoriteRecipes.map((recipe) => {
            const matchingDates = recipe.calendarInfo.filter(
              (dateEle) => formatDate(dateEle.date) === dayFormatted
            );
  
            if (matchingDates.length > 0) {
              return (
                <div key={`${recipe.id}-${dayFormatted}`}>
                  <h3>{recipe.title}</h3>
                  {matchingDates.map((dateEle) => (
                    <div key={`${recipe.id}-${dayFormatted}-${dateEle.servingSize}`}>
                      <p>Serving Size: {dateEle.servingSize}</p>
                      <img src={recipe.image} alt={recipe.title} />
                      <button onClick={() => handleView(recipe.id, dateEle.servingSize)}>View Recipe</button>
                      <button onClick={() => deleteRecipeDate(recipe.id, dayFormatted, dateEle.servingSize)}>
                        Delete From Day
                      </button>
                    </div>
                  ))}
                </div>
              );
            }
            return null;
          })}
          <h5>Total Nutrition for the Day:</h5>
          <ul>
            <li>Calories: {totalCaloriesOfDay.toFixed(0)}kcal</li>
            <li>Fat: {totalFatOfDay.toFixed(0)}g</li>
            <li>Sodium: {totalSodiumOfDay.toFixed(0)}mg</li>
            <li>Carbohydrates: {totalCarbsOfDay.toFixed(0)}g</li>
            <li>Protein: {totalProteinOfDay.toFixed(0)}g</li>
          </ul>
          <button onClick={() => handleAddRecipeToDay(day)}>+</button>
        </div>
      );
    });
  
    return <div>{dayElements}</div>;
  }

  return (
    <div>
      {auth.currentUser !== null ? (
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
          <button key={recipe.title} onClick={() => setSelectedRecipe(recipe)}>
            {recipe.title}
          </button>
        ))}

        {selectedRecipe && (
          <div>
            <h4>Serving Size:</h4>
            <input
              type="number"
              value={servingSize}
              min={1}
              onChange={(e) => setServingSize(e.target.value)}
            />
            <button onClick={handleAddRecipeToDate}>Add to Calendar</button>
          </div>
        )}
      </ReactModal>
      </div>
      ) : (
        <p>Please sign in to access your Calendar</p>
      )}
    </div>
  );
}

export default Calendar;