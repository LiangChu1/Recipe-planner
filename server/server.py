from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

api_key = "af43bf0d5a144e8fa1579311e65e6f7b"

@app.route('/recipeData', methods=['POST'])
def get_recipe_data():
    url = "https://api.spoonacular.com/recipes/{id}/information"
    inputData = request.get_json()
    recipe_id = inputData['recipeId']
    url = url.replace("{id}", str(recipe_id))
    query_params = {
        "apiKey": api_key
    }
    response = requests.get(url, params=query_params)
    outputData = response.json()
    return jsonify(outputData)


@app.route('/shoppingList', methods=['POST'])
def get_shopping_list_data():
    url = "https://api.spoonacular.com/recipes/{id}/priceBreakdownWidget.json"
    inputData = request.get_json()
    recipe_id = inputData['recipeId']
    url = url.replace("{id}", str(recipe_id))
    query_params = {
        "apiKey": api_key
    }
    response = requests.get(url, params=query_params)
    outputData = response.json()
    print(outputData)
    return jsonify(outputData)


@app.route('/searchData', methods=['POST'])
def get_search_data():
    url = "https://api.spoonacular.com/recipes/complexSearch"
    inputData = request.get_json()
    recipeName = inputData['recipeName']
    number = inputData['number']
    query_params = {
        "apiKey": api_key,
        "query": recipeName,
        "number": number
    }
    response = requests.get(url, params=query_params)
    outputData = response.json()  # Extract the JSON data from the response
    print(outputData)
    return jsonify(outputData)

# Start the server
if __name__ == '__main__':
    app.run()