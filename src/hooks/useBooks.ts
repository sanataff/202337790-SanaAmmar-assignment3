import { useEffect, useState } from 'react';
import { parseBooksPayload, type Book } from '../lib/books';


type BooksState = {
  status: 'loading' | 'success' | 'error';
  books: Book[];
  error: string | null;
  updatedAt: string;
};


// TODO: Initialize the hook state with loading status, an empty books list,
//       no error, and an empty updatedAt value.
// TODO: Use an effect to request /api/books when the hook mounts or refreshes.
// TODO: Set the status to loading and clear any previous error before fetching.
// TODO: Handle non-OK responses, including the API's not_configured error code.
// TODO: Parse the JSON response with parseBooksPayload from ../lib/books.
// TODO: Set an error state for invalid payloads or failed requests.
// TODO: On success, store the parsed books and updatedAt value.
// TODO: Expose a stable reload function that triggers another request and
//       adds a changing refresh query parameter to bypass the CDN cache.
// TODO: Keep the returned state and reload shape compatible with Books.tsx.
export function useBooks(): BooksState & { reload: () => void } {



const [loading, setLoading] = useState(true)
const [books, setBooks] = useState<Book[]>([])
const [error, setError] = useState("")
const [updatedAt, setUpdatedAt] = useState("")
const [refreshToken, setRefreshToken] = useState(0);

useEffect(()=>{
  const endpoint = refreshToken === 0? '/api/books' :  `/api/books?refresh=${refreshToken}`;
  
  const loadBooks =async()=> {
    const response = await fetch(endpoint,{
      headers: {Accept: 'application/json'},
      cache: 'no-store'
    })
     if (!response.ok){
    setError("error")

    return; 
  };
  const data = await response.json()
  const parsed = parseBooksPayload(data);

if(!parsed){
  setError("")
  return;
}
  setBooks(parsed.books)
  setLoading(false)
  setUpdatedAt(parsed.updatedAt)

  }
 void loadBooks()

}, [refreshToken])
const reload = () => {
     setRefreshToken((token) => token + 1);


};

return {
  status: loading ? 'loading' : error ? 'error' : 'success',
  books,
  error: error ? 'Could not load books.' : null,
  updatedAt,
  reload,
};

}



