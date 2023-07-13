import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { Link, useNavigate } from "react-router-dom";

function UserAuthDetails({setCurrUserId}) {
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        setCurrUserId(user.uid);
        navigate('/');
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  function userSignOut() {
    signOut(auth)
      .then(() => {
        console.log("sign out successful");
        setCurrUserId("");
      })
      .catch((error) => console.log(error));
  };


  return (
    <div>
      {authUser ? (
        <>
          <p>{`Signed In as ${authUser.email}`}</p>
          <button onClick={userSignOut}>Log Out</button>
        </>
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