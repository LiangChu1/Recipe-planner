export async function recipeDataFetchCall({id}){
    const json = JSON.stringify({recipeId: id});
    return fetch('http://127.0.0.1:5000/recipeData', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          return data;
        } else {
          return null;
        }
      })
      .catch((error) => {
        console.log("FAILED: " + error);
      });
}

