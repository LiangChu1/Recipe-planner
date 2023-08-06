import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Header';
import React, { useState } from 'react';
import Searcher from './Searcher';
import FavoriteRecipesList from './FavoriteRecipesList';
import Navigation from './Navigation';
import OldRecipeViewer from './OldRecipeViewer';
import IngredientMenu from './IngredientMenu';
import Calendar from './Calendar';
import IngredientCreator from './IngredientCreator';
import Home from './Home';
import IngredientViewer from './IngredientViewer';
import UserAuthDetails from './UserAuthDetails';
import SignUp from './SignUp';
import Login from './Login';
import NewRecipeViewer from './NewRecipeViewer';

function App() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [ingredientLists, setIngredientLists] = useState([]);
  
  return (
    <div className="App">
      <Header />
      <Navigation />
      <UserAuthDetails setFavoriteRecipes={setFavoriteRecipes} setIngredientLists={setIngredientLists}/>
      <Routes>
           <Route path="/" element={<Home />}/>
           <Route path='/searcher' element={<Searcher favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes}/>}/>
           <Route path='/favoriteRecipesList' element={<FavoriteRecipesList favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes}/>}/>
           <Route path='/oldRecipe/:id' element={<OldRecipeViewer/>}/>
           <Route path='/newRecipe/:id' element={<NewRecipeViewer/>}/>
           <Route path='/ingredientMenu' element={<IngredientMenu ingredientLists={ingredientLists} setIngredientLists={setIngredientLists}/>}/>
           <Route path='/ingredientList/new' element={<IngredientCreator favoriteRecipes={favoriteRecipes} ingredientLists={ingredientLists} setIngredientLists={setIngredientLists}/>}/>
           <Route path='/ingredientList/:index' element={<IngredientViewer setIngredientLists={setIngredientLists}/>}/>
           <Route path='/calendar' element={<Calendar favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes}/>}/>
           <Route path='/login' element={<Login />}/>
           <Route path='/signup' element={<SignUp />}/>
      </Routes>
    </div>
  );
}

export default App;
