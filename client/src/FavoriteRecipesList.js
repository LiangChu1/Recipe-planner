import { useNavigate } from "react-router-dom";
import './FavoriteRecipesList.css'
import { auth, db } from "./firebase";
import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";

function FavoriteRecipesList({ favoriteRecipes, setFavoriteRecipes }){
    const navigate = useNavigate();

    function handleView(id){
      const existingRecipeInFavorites = favoriteRecipes.filter((recipe) => recipe.id === id);
      if(existingRecipeInFavorites){
        navigate(`/oldRecipe/${existingRecipeInFavorites[0].id}`, {state: {recipe: existingRecipeInFavorites[0]}});
      }
    }

    //Delete from favorite recipe list
    function deleteFromFavorites(id) {
      const currUser = auth.currentUser;
        if(currUser){
          const userUID = currUser.uid;
          const favoritesRef = collection(db, 'users', userUID, 'favorites');
          const queryRef = query(favoritesRef, where('id', '==', id));

          getDocs(queryRef)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref)
                  .then(() => {
                    console.log("Recipe deleted successfully");
                    // Filter out the recipe with the given id from the favoriteRecipes state
                    const updatedFavorites = favoriteRecipes.filter((recipe) => recipe.id !== id);
                    // Update the favoriteRecipes state with the updated list
                    setFavoriteRecipes(updatedFavorites);
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
          <h2>Your favorite Recipes</h2>
          <div>
            {favoriteRecipes.map((recipe) => (
              <div key={recipe.id}>
                <h3>{recipe.title}</h3>
                <img src={recipe.image} alt={recipe.title} />
                <button onClick={() => handleView(recipe.id)}>View Recipe</button>
                <button onClick={() => deleteFromFavorites(recipe.id)}>Delete From Favorites</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Please sign in to access your saved recipes.</p>
      )}
    </div>
  )
}

export default FavoriteRecipesList