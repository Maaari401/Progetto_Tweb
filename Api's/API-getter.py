import requests, json
import psycopg2


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

def map_to_range(value):
    return round(min(value / 20, 5),2)

class Actor:
    def __init__(self, name, surname, date_birth, description):
        self.name = name
        self.surname = surname
        self.date_birth = date_birth
        self.description = description
    
    def __str__(self):
        return f"Actor: {self.name} {self.surname}, born on {self.date_birth}, {self.description}"

class Director:
    def __init__(self, name, surname, date_birth, description):
        self.name = name
        self.surname = surname
        self.date_birth = date_birth
        self.description = description
    
    def __str__(self):
        return f"Director: {self.name} {self.surname}, born on {self.date_birth}, {self.description}"

class Film:
    def __init__(self, id,name, rating, release, description):
        self.API_id = id
        self.name = name
        self.rating = rating
        self.release = release
        self.description = description
    
    def __str__(self):
        return f"Film: {self.name}, released on {self.release}, rated {self.rating}, {self.description}"


def pretty_print(text):
    print(json.dumps(text, indent=2))

my_headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTE2YmVmYzM0MDFjY2FhMjYyMmVhNDA5ZDYxNThlMyIsInN1YiI6IjY1NTFkZTliZWE4NGM3MTA5NGZlNjE5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rdAkx0x0go-LW8rDaHP1A0knti9Iz-ZKz667nxtmyBo"
}
# Connessione al database
conn = psycopg2.connect(
    dbname="postrges",
    user="tweb",
    password="tweb",
    host="localhost:5432"
)
# Base URL for TMDb API
BASE_URL = 'https://api.themoviedb.org/3'


cur = conn.cursor()
movies_name = ["Inception", "Tenet", "Dunkirk", "Interstellar", "Uncharted", "joker", "The nice guys", "The wolf of wall street", "Babylon", "Il Padrino", "Passengers"]
movie_ids = [27205, 577922, 374720, 157336, 335787, 475557, 290250, 106646, 615777, 274447, 274870] #get_movies_id(movies_name)
movies = []
for movie_id in movie_ids:
    baseUrl_movie = f'{BASE_URL}/movie/{movie_id}'
    #get movie info
    data = json.loads(requests.get(baseUrl_movie, headers=my_headers).text)
    movies.append(Film(data['id'], data['original_title'], map_to_range(data['popularity']), data['release_date'], data['overview']))
    #insert movie in db
    cur.execute("insert")
    #get the movie's id form db
    
    #foreach actor inserted bind it to the movie's id
    #foreach director inserted bind it to the movie's id
    
   
    
for film in movies:
    print(film)




'''
# ID of the movie you want to get information about
movie_id = 27205

# Endpoint for getting movie details
url = f'{BASE_URL}/movie/{movie_id}/credits'

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTE2YmVmYzM0MDFjY2FhMjYyMmVhNDA5ZDYxNThlMyIsInN1YiI6IjY1NTFkZTliZWE4NGM3MTA5NGZlNjE5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rdAkx0x0go-LW8rDaHP1A0knti9Iz-ZKz667nxtmyBo"
}

response = requests.get(url, headers=headers)

data = json.loads(response.text)


with open('movie_credits.json', 'w') as json_file:
        json.dump(data, json_file, indent=4)
print("JSON data saved to movie_credits.json")
'''