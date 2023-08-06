from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# api_key = "1cf648fa04e64a02a6f299e802e4c624"
api_key = "af43bf0d5a144e8fa1579311e65e6f7b"

@app.route('/recipeData', methods=['POST'])
def get_recipe_data():
    url = "https://api.spoonacular.com/recipes/{id}/information?includeNutrition=true"
    inputData = request.get_json()
    recipe_id = inputData['recipeId']
    url = url.replace("{id}", str(recipe_id))
    query_params = {
        "apiKey": api_key
    }
    response = requests.get(url, params=query_params)
    outputData = response.json()
    return jsonify(outputData)


@app.route('/searchData', methods=['POST'])
def get_search_data():
    url = "https://api.spoonacular.com/recipes/complexSearch"
    inputData = request.get_json()
    query = inputData['input']
    offSet = inputData['offSet']
    number = inputData['number']
    cuisine = inputData['cuisine'],
    meal_type = inputData['meal_type'],
    intolerance = inputData['intolerance'],
    diet = inputData['diet'],
    query_params = {
        "apiKey": api_key,
        "query": query,
        "cuisine": cuisine,
        "type": meal_type,
        "intolerances": intolerance,
        "diet": diet,
        "number": number,
        'offset': offSet * number
    }
    response = requests.get(url, params=query_params)
    outputData = response.json()
    #print(outputData)
    return jsonify(outputData)

# Start the server
if __name__ == '__main__':
    app.run()