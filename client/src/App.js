import { Route, Routes} from 'react-router-dom';
import './App.css';
import Header from './Header';
import React, { useState } from 'react';
import Home from './Home';
import FavoriteRecipesList from './FavoriteRecipesList';
import Navigation from './Navigation';
import Recipe from './Recipe';
import ShoppingList from './ShoppingList';
import Calendar from './Calendar';

function App() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  return (
    <div className="App">
      <Header />
      <Navigation />
      <Routes>
           <Route path='/' element={<Home favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes}/>}/>
           <Route path='/favoriteRecipesList' element={<FavoriteRecipesList favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes} ingredientList={ingredientList} setIngredientList={setIngredientList} totalCost={totalCost} setTotalCost={setTotalCost}/>}/>
           <Route path='/recipe/:id' element={<Recipe/>}/>
           <Route path='/shoppingList' element={<ShoppingList favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes} ingredientList={ingredientList} setIngredientList={setIngredientList} totalCost={totalCost} setTotalCost={setTotalCost}/>}/>
           <Route path='/calendar' element={<Calendar favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes}/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
