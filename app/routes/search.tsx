import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from '@remix-run/react';
import { type Film } from '../types/types';

function SearchPage() {
    const [id, setId] = useState('');
    const [result, setResult] = useState<Film | Film[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGetId = () => {
        axios.get(`https://localhost:3000/rest/${id}`)
             .then(response => {
               setResult(response.data);
               setError(null);
            })
             .catch(err => {
               setError('Failed to fetch data');
               setResult(null);
            });
    };

    const handleGetAllFilms = () => {
        axios.get('https://localhost:3000/rest/')
             .then(response => {
               setResult(response.data);
               console.log(response)
               setError(null);
            })
             .catch(error => {
               setError('Failed to fetch all films');
               setResult(null);
            });
    };

    return (
        <div>   
        <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
        <button onClick={handleGetId} className="btn btn-primary mt-3">Suche mit ID</button>
        <button onClick={handleGetAllFilms} className="btn btn-primary mt-3 ms-3">Suche alle Filme</button>
            {result && (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ISAN</th>
                            <th>Rating</th>
                            <th>Genre</th>
                            <th>Preis</th>
                            <th>Rabatt</th>
                            <th>Lieferbar</th>
                            <th>Datum</th>
                            <th>Homepage</th>
                            <th>Schlagwörter</th>
                            <th>Titel</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(result) ? result.map((film, index) => (
                      <FilmRow film={film} index={index} key={film.isan} />
                      )): (
                      <FilmRow film={result} index={0} key={result.isan} />
                      )}
                    </tbody>
                </table>
            )}
             {error && <p className="text-danger mt-3">{error}</p>}
        </div>
    );

    function FilmRow({ film, index }: { film: Film; index: number }) {
        return (
            <tr key={index}>
                <td>{film.isan}</td>
                <td>{film.rating}</td>
                <td>{film.genre}</td>
                <td>{film.preis}</td>
                <td>{film.rabatt}</td>
                <td>{film.lieferbar ? 'Ja' : 'Nein'}</td>
                <td>{film.datum}</td>
                <td><a href={film.homepage}>{film.homepage}</a></td>
                <td>{film.schlagwoerter && film.schlagwoerter.join(', ')}</td>
                <td>
                    {film.titel && (
                    <>
                        <p>Titel: {film.titel.titel}</p>
                        <p>Untertitel: {film.titel.untertitel}</p>
                    </>
                    )}
                </td>
            </tr>
        );
    }
}

function withAuth(Component: React.ComponentType) {
    return function ProtectedRoute(props: any) {
      const navigate = useNavigate();
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        navigate('/');
        return null;
      }
      return <Component {...props} />;
    };
  }

const ProtectedSearchPage = withAuth(SearchPage);

export default ProtectedSearchPage;