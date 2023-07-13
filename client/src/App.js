import { Route, Routes} from 'react-router-dom';
import './App.css';
import Header from './Header';
import React, { useState } from 'react';
import Searcher from './Searcher';
import FavoriteRecipesList from './FavoriteRecipesList';
import Navigation from './Navigation';
import Recipe from './Recipe';
import IngredientMenu from './IngredientMenu';
import Calendar from './Calendar';
import IngredientCreator from './IngredientCreator';
import Home from './Home';
import IngredientViewer from './IngredientViewer';
import UserAuthDetails from './UserAuthDetails';
import SignUp from './SignUp';
import Login from './Login';

function App() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [ingredientLists, setIngredientLists] = useState([]);
  const [currUserId, setCurrUserId] = useState("");
  
  return (
    <div className="App">
      <Header />
      <Navigation />
      <UserAuthDetails setCurrUserId={setCurrUserId}/>
      <Routes>
           <Route path="/" element={<Home />}/>
           <Route path='/searcher' element={<Searcher favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes}/>}/>
           <Route path='/favoriteRecipesList' element={<FavoriteRecipesList favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes}/>}/>
           <Route path='/recipe/:id' element={<Recipe/>}/>
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
