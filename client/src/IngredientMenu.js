import './IngredientMenu.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { collection, deleteDoc, getDocs, query, where } from 'firebase/firestore';

function IngredientMenu({ ingredientLists, setIngredientLists }) {
    const navigate = useNavigate();

    function handleViewList(id, list){
      navigate(`/ingredientList/${id}`, {state: {ingredientList: list}})
    }

    function handleCreateList(){
      navigate(`/ingredientList/new`)
    }

    //DELETE Ingredient List
    function handleDeleteList(id){
      const currUser = auth.currentUser;
      if(currUser){
        const userUID = currUser.uid;
        const ingredientListRef = collection(db, 'users', userUID, 'ingredientLists');
        const queryRef = query(ingredientListRef, where('id', '==', id));

        getDocs(queryRef)
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              deleteDoc(doc.ref)
                .then(() => {
                  console.log("Recipe deleted successfully");
                  const updatedLists = ingredientLists.filter((list) => list.id !== id);
                  setIngredientLists(updatedLists); 
                })
                .catch((error) => {
                  console.error("Error deleting recipe: ", error);
                });
            });
          })
          .catch((error) => {
            console.error("Error querying recipe: ", error);
          });
      }
    }
  
    return (
      <div>
        {auth.currentUser !== null ? (
        <div>
          <h2>Ingredients Menu</h2>
          {ingredientLists.map((list) => (
            <div key={list.id}>
              <h4>{list.title}</h4>
              <button onClick={() => handleViewList(list.id, list)}>View List</button>
              <button onClick={() => handleDeleteList(list.id)}>Delete List</button>
            </div>
          ))}
          <button onClick={handleCreateList}>Create New List</button>
        </div>
        ) : (
          <p>Please sign in to access your shopping lists.</p>
        )}
      </div>
    )
}

export default IngredientMenu;