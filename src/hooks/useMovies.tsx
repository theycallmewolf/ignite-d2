import React, { 
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect
} from 'react';
import { api } from '../services/api';

const MoviesContext = createContext<MoviesContextData>(
  {} as MoviesContextData,
);

interface MoviesProviderProps {
  children: ReactNode;
}

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface MoviesContextData {
  genres: GenreResponseProps[];
  movies: MovieProps[];
  selectedGenre: GenreResponseProps;
  selectedGenreId: number;
  setSelectedGenreId: React.Dispatch<React.SetStateAction<number>>;
}

export const MoviesProvider = ({children} : MoviesProviderProps) => {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then(response => {
      setMovies(response.data);
    });

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then(response => {
      setSelectedGenre(response.data);
    })
  }, [selectedGenreId]);

  return (
    <MoviesContext.Provider value={{
      genres,
      movies,
      selectedGenre,
      selectedGenreId,
      setSelectedGenreId,
      }}>
      {children}
    </MoviesContext.Provider>
  )
}

export function useMovies(): MoviesContextData {
  const context = useContext(MoviesContext);
  return context;
}