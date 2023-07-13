import './IngredientMenu.css';
import { useNavigate } from 'react-router-dom';

function IngredientMenu({ ingredientLists, setIngredientLists }) {
    const navigate = useNavigate();

    function handleViewList(index, list){
      navigate(`/ingredientList/${index}`, {state: {ingredientList: list}})
    }

    function handleCreateList(){
      navigate(`/ingredientList/new`)
    }

    //DELETE Ingredient List
    function handleDeleteList(index){
      const updatedLists = ingredientLists.filter((list, currindex) => currindex !== index);
      setIngredientLists(updatedLists); 
    }
  
    return (
      <div>
        <h2>Ingredients Menu</h2>
        <h3>Your Lists {ingredientLists.length}:</h3>
        {ingredientLists.map((list, index) => (
          <div key={index}>
            <h4>{list.title}</h4>
            <h4>${parseFloat(list.totalCost).toFixed(2)}</h4>
            <button onClick={() => handleViewList(index, list)}>View List</button>
            <button onClick={() => handleDeleteList(index)}>Delete List</button>
          </div>
        ))}
        <button onClick={handleCreateList}>Create New List</button>
      </div>
    )
}

export default IngredientMenu;