import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query } from "firebase/firestore";
import './UserAuthDetails.css'

function UserAuthDetails({ setFavoriteRecipes, setIngredientLists }) {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        loadUsersRecipes(user.uid);
        loadUserIngredientLists(user.uid);
      } else {
        setAuthUser(null);
        setFavoriteRecipes([]);
      }
    });

    return () => {
      listen();
    };
  });

  function loadUsersRecipes(userId){
    const userRecipesRef = collection(db, 'users', userId, 'favorites');
    const userFavoritesQuery = query(userRecipesRef);

    onSnapshot(userFavoritesQuery, (snapshot) => {
      const currFavoriteRecipes = [];
      snapshot.forEach((doc) => {
        currFavoriteRecipes.push({ ...doc.data() });
      });
      setFavoriteRecipes(currFavoriteRecipes);
    });
  }

  function loadUserIngredientLists(userId){
    const userIngredientListsRef = collection(db, 'users', userId, 'ingredientLists');
    const userIngredientListsQuery = query(userIngredientListsRef);

    onSnapshot(userIngredientListsQuery, (snapshot) => {
      const currIngredientLists = [];
      snapshot.forEach((doc) => {
        currIngredientLists.push({ ...doc.data() });
      });
      setIngredientLists(currIngredientLists);
    });
  }

  function userSignOut() {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => console.log(error));
  };


  return (
    <div className='auth'>
      {authUser ? (
        <div>
          <p> Welcome {authUser.displayName || authUser.email}</p>
          <button onClick={userSignOut}>Log Out</button>
        </div>
      ) : (
        <div>
          <button>
            <Link to="/login">Log In</Link>
          </button>
          <button>
            <Link to="/signup">Sign Up</Link>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserAuthDetails;