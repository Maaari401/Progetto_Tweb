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
        # print(json.dumps(data, indent=2))

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
    return round(min(value / 20, 5), 2)


class Actor:
    def __init__(self, name, date_birth, description, image):
        self.name = name
        self.date_birth = date_birth
        self.description = description
        self.image = image

    def __str__(self):
        return f"Actor: {self.name} {self.surname}, born on {self.date_birth}, {self.description}"


class Director:
    def __init__(self, name, date_birth, description, image):
        self.name = name
        self.date_birth = date_birth
        self.description = description
        self.image = image

    def __str__(self):
        return f"Director: {self.name} {self.surname}, born on {self.date_birth}, {self.description}"


class Film:
    def __init__(self, id, name, rating, release, description, cover):
        self.API_id = id
        self.name = name
        self.rating = rating
        self.release = release
        self.description = description
        self.cover = cover

    def __str__(self):
        return f"Film: {self.name}, released on {self.release}, rated {self.rating}, {self.description}"


def pretty_print(text):
    print(json.dumps(text, indent=2))


my_headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlOTE2YmVmYzM0MDFjY2FhMjYyMmVhNDA5ZDYxNThlMyIsInN1YiI6IjY1NTFkZTliZWE4NGM3MTA5NGZlNjE5YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rdAkx0x0go-LW8rDaHP1A0knti9Iz-ZKz667nxtmyBo"
}
BASE_URL = 'https://api.themoviedb.org/3'
print("prova")
# Connessione al database
conn = psycopg2.connect(
    dbname="postgres",
    user="tweb",
    password="tweb",
    host="localhost",
    port="5432"
)
# Base URL for TMDb API

conn.autocommit = False
cur = conn.cursor()

movies_name = ["Inception", "Tenet", "Dunkirk", "Interstellar", "Uncharted", "joker", "The nice guys", "The wolf of wall street", "Babylon", "Il Padrino", "Passengers"]
movie_ids = get_movies_id(movies_name)


for movie_id in movie_ids:
    print(movie_id)
    baseUrl_movie = f'{BASE_URL}/movie/{movie_id}'
    #get movie info
    data = json.loads(requests.get(baseUrl_movie, headers=my_headers).text)
    movie = Film(data['id'], data['original_title'], map_to_range(data['popularity']), data['release_date'], data['overview'], requests.get(f"https://image.tmdb.org/t/p/original{data['poster_path']}").content)
    #insert movie in db
    film_id = 0
    try:
        cur.execute("insert into film (name, ranking, public_release, cover, description) values (%s,%s,%s,%s,%s) RETURNING cod", (movie.name, movie.rating, movie.release, movie.cover, movie.description))
        film_id = cur.fetchone()[0]
        conn.commit()

    except psycopg2.IntegrityError as e:
        if e.pgcode == '23505':
            conn.rollback()
            cur.close()
            cur = conn.cursor()
            try:
                query = "SELECT cod FROM film WHERE name ='"+movie.name+"'"
                cur.execute(query)
                film_id = cur.fetchone()[0]
                conn.commit()
            except Exception as e:
                print(e)

    finally:
        print(film_id)
        credits_data = json.loads(requests.get(baseUrl_movie+'/credits', headers=my_headers).text)
        #foreach actor inserted bind it to the movie's id
        cast_data = credits_data['cast']

        for actorTmp in cast_data:
            #insert actor in db
            actorData = json.loads(requests.get(f'https://api.themoviedb.org/3/person/{actorTmp["id"]}', headers=my_headers).text)
            if actorData['profile_path'] is not None:
                imageUrl = "https://image.tmdb.org/t/p/original"+actorData['profile_path']
                a = Actor(actorData['name'], actorData['birthday'], actorData['biography'], requests.get(imageUrl, headers=my_headers).content)
            else:
                a = Actor(actorData['name'], actorData['birthday'], actorData['biography'], "null")
            actor_id=0
            try:
                # Insert actor into the database
                cur.execute("INSERT INTO tweb.actors (name, date_birth, image, description) VALUES (%s, %s, %s, %s) RETURNING id", (a.name, a.date_birth, a.image, a.description,))
                actor_id = cur.fetchone()[0]
                conn.commit()
                #print("Actor inserted successfully.")

            except psycopg2.IntegrityError as e:
                # Handle duplicate entry error
                if e.pgcode == '23505':
                    try:
                        conn.rollback()
                        cur.close()
                        cur = conn.cursor()
                        # Retrieve actor ID
                        cur.execute("SELECT id FROM actors WHERE name = %s", (a.name,))
                        actor_id = cur.fetchone()[0]
                        #print("Actor already exists in the database.")
                    except psycopg2.Error as ex:
                        # Handle cursor re-establishment error
                        print("Error re-establishing cursor:", ex)
                else:
                    # Handle other database errors
                    print("Database error:", e)
            finally:
                try:
                    cur.execute("insert into act (id_actor, film_id, character, order_cast) values (%s,%s,%s,%s)", (actor_id, film_id, actorTmp['character'], int(actorTmp['order'])))
                    conn.commit()
                except psycopg2.Error as ex:
                    if ex.pgcode == '23505':
                        conn.rollback()
                        cur.close()
                        cur = conn.cursor()
                    else:
                        print(ex)

            print("done with actor -->"+actorData['name'])
        #foreach director inserted bind it to the movie's id

        crew_data = credits_data['crew']
        for crewTmp in crew_data:
            #insert actor in db
            crewMember = json.loads(requests.get(f'https://api.themoviedb.org/3/person/{crewTmp["id"]}', headers=my_headers).text)
            if crewMember['profile_path'] is not None:
                imageUrl = "https://image.tmdb.org/t/p/original"+crewMember['profile_path']
                d = Director(crewMember['name'], crewMember['birthday'], crewMember['biography'], requests.get(imageUrl, headers=my_headers).content)
            else:
                d = Actor(crewMember['name'], crewMember['birthday'], crewMember['biography'], "null")
            crew_id=0
            d.name =d.name.replace("'", "''")
            try:
                # Insert actor into the database
                cur.execute("INSERT INTO director (name, date_birth, image, description) VALUES (%s, %s, %s, %s) RETURNING id", (d.name, d.date_birth, d.image, d.description,))
                crew_id = cur.fetchone()[0]
                conn.commit()
                #print("Actor inserted successfully.")

            except psycopg2.IntegrityError as e:
                # Handle duplicate entry error
                if e.pgcode == '23505':
                    try:
                        conn.rollback()
                        cur.close()
                        cur = conn.cursor()
                        # Retrieve actor ID
                        query = "SELECT id FROM director WHERE name like '"+d.name+"'" 
                        cur.execute(query)
                        crew_id = cur.fetchone()[0]
                        #conn.commit()
                        #print("Actor already exists in the database.")
                    except Exception as ex:
                        # Handle cursor re-establishment error
                        print("Error re-establishing cursor:", ex)
                else:
                    # Handle other database errors
                    print("Database error:", e)
            except Exception as e:
                print(e)
            finally:
                try:
                    cur.execute("insert into direct (director_id, film_id, role, departmant) values (%s,%s,%s,%s)", (crew_id, film_id, crewTmp['job'], crewTmp['department']))
                    conn.commit()
                except psycopg2.Error as e:
                    if e.pgcode == '23505':
                        conn.rollback()
                        cur.close()
                        cur = conn.cursor()
                    else:
                        print(ex)

            print("done with director -->"+crewMember['name'])
    print("done with "+movie.name)
conn.close()


