import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";
//Needs work
function IngredientViewer({ setIngredientLists }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state || !location.state.ingredientList) {
    return null;
  }

  return (
    <IngredientViewerContent
      setIngredientLists={setIngredientLists}
      currList={location.state.ingredientList}
      navigate={navigate}
    />
  );
}

function IngredientViewerContent({ setIngredientLists, currList, navigate }) {
  const [ingredientList, setIngredientList] = useState(currList);
  const { title, ingredients } = ingredientList;

  function handleIngredientChange(index) {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].isChecked = !updatedIngredients[index].isChecked;
    setIngredientList((prevState) => ({
      ...prevState,
      ingredients: updatedIngredients,
    }));
  }

  //UPDATE Ingredient List's state
  function handleFormSubmit(event) {
      event.preventDefault();
      setIngredientLists((prevState) =>
        prevState.map((list) =>
          list.title === title ? ingredientList : list
        )
      );
      const currUser = auth.currentUser;
      if (currUser) {
        const userUID = currUser.uid;
        const ingredientListsRef = collection(db, 'users', userUID, 'ingredientLists');
        const queryRef = query(ingredientListsRef, where('id', '==', currList.id));
        getDocs(queryRef)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const currListRef = querySnapshot.docs[0].ref;
            updateDoc(currListRef, {ingredients: ingredientList.ingredients})
            .then(() => {
              console.log('Ingredient list updated successfully!');
            })
            .catch((error) => {
              console.error('Error updating ingredient list: ', error);
            });
        } else {
          console.error('Ingredient List missing');
        }
        })
        .catch((error) => {
          console.error('Error querying Ingredient List: ', error);
        });
      }
      navigate(-1);
  }

  return (
    <div>
      <h3>{title}</h3>
      <form onSubmit={handleFormSubmit}>
        {ingredients.map((ingredient, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={index}
              name={"ingredient#" + index}
              value={index}
              onChange={() => handleIngredientChange(index)}
              checked={ingredient.isChecked}
            />
            <label htmlFor={index}>
              {ingredient.name}
              {" ("}
              {ingredient.totalAmount.toFixed(1)} {ingredient.unit}
              {")"}
            </label>
          </div>
        ))}
        <input type="submit" value="Save" />
      </form>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

export default IngredientViewer;