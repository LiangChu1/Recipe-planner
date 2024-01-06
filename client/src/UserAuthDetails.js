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
      }
    });

    return () => {
      listen();
    };
  });

  function loadData(userId, collectionName, setData){
    const userRef = collection(db, 'users', userId, collectionName);
    const userQuery = query(userRef);

    onSnapshot(userQuery, (snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data() });
      });
      setData(data);
    });
  }

  function loadUsersRecipes(userId){
    loadData(userId, 'favorites', setFavoriteRecipes);
  }

  function loadUserIngredientLists(userId){
    loadData(userId, 'ingredientLists', setIngredientLists);
  }

  function userSignOut() {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        setAuthUser(null);
        setFavoriteRecipes([]);
        setIngredientLists([]);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className='auth'>
      {authUser ? (
        <div className="sign-in-message">
          <h5> Welcome, {authUser.displayName || authUser.email}</h5>
          <button onClick={userSignOut}>Log Out</button>
        </div>
      ) : (
        <div className="auth-buttons">
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