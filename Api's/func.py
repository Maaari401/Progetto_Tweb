# func.py
def get_movie_id(movie_name):
    # Endpoint for searching movies
    search_url = f'{BASE_URL}/search/movie'
    
    # Parameters for the search query
    params = {
        'api_key': 'e916befc3401ccaa2622ea409d6158e3',
        'query': movie_name
    }
    
    response = requests.get(search_url, params=params)
    
    if response.status_code == 200:
        data = json.loads(response.text)
        #print(json.dumps(data, indent=2))
        
        if data['results']:
            return data['results'][0]['id']
        else:
            print("No movie found with that name.")
            return None
    else:
        print("Error:", response.status_code)
        return None
def get_movies_id(movies):
    movie_ids = []
    for movie in movies:
        movie_ids.append(get_movie_id(movie))
    return movie_ids



my_headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTE2YmVmYzM0MDFjY2FhMjYyMmVhNDA5ZDYxNThlMyIsInN1YiI6IjY1NTFkZTliZWE4NGM3MTA5NGZlNjE5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rdAkx0x0go-LW8rDaHP1A0knti9Iz-ZKz667nxtmyBo"
}
# Base URL for TMDb API
BASE_URL = 'https://api.themoviedb.org/3'