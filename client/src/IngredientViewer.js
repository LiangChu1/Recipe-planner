import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";

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

function groupIngredientsByAisle(ingredients){
    const groupedIngredients = {};

    ingredients.forEach((ingredient) => {
      if(!groupedIngredients[ingredient.aisle]){
        groupedIngredients[ingredient.aisle]= [];
      }
      groupedIngredients[ingredient.aisle].push(ingredient);
    })

    return groupedIngredients;
}

function IngredientViewerContent({ setIngredientLists, currList, navigate }) {
  const [groupedIngredients, setGroupedIngredients] = useState(
    groupIngredientsByAisle(currList.ingredients)
  );
  const { title } = currList;

  function handleIngredientChange(aisle, index) {
    const updatedGroupedIngredients = { ...groupedIngredients };

    updatedGroupedIngredients[aisle][index] = {
      ...updatedGroupedIngredients[aisle][index],
      isChecked: !updatedGroupedIngredients[aisle][index].isChecked,
    };

    setGroupedIngredients(updatedGroupedIngredients);
  }

  function handleFormSubmit(event) {
    event.preventDefault();

    // Flatten groupedIngredients to update the Firestore database
    const updatedIngredients = Object.values(groupedIngredients).flat();
    const updatedIngredientList = { ...currList, ingredients: updatedIngredients };
    console.log(updatedIngredientList)
    setIngredientLists((prevState) =>
      prevState.map((list) => (list.title === title ? updatedIngredientList : list))
    );

    // Update the Firestore database with the updatedIngredientList
    const currUser = auth.currentUser;
    if (currUser) {
      const userUID = currUser.uid;
      const ingredientListsRef = collection(db, 'users', userUID, 'ingredientLists');
      const queryRef = query(ingredientListsRef, where('id', '==', currList.id));
      getDocs(queryRef)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            const currListRef = querySnapshot.docs[0].ref;
            updateDoc(currListRef, { ingredients: updatedIngredientList.ingredients })
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
      {Object.keys(groupedIngredients)
        .sort() // Sort aisles lexicographically
        .map(aisle => (
          <div key={aisle}>
            <h4>Aisle: {aisle}</h4>
            {groupedIngredients[aisle].map((ingredient, index) => (
              <div key={`${aisle}-${index}`}>
                <input
                  type="checkbox"
                  id={`${aisle}-${index}`}
                  name={`ingredient#${index}`}
                  value={index}
                  onChange={() => handleIngredientChange(aisle, index)}
                  checked={ingredient.isChecked}
                />
                <label htmlFor={`${aisle}-${index}`}>
                  {ingredient.name}
                  {" ("}
                  {ingredient.totalAmount.toFixed(1)} {ingredient.unit}
                  {")"}
                </label>
              </div>
            ))}
          </div>
        ))}
        <input type="submit" value="Save" />
      </form>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

export default IngredientViewer;