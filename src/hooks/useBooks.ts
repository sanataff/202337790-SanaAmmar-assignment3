import { useEffect, useState } from 'react';
import { parseBooksPayload, type Book } from '../lib/books';


type BooksState = {
  status: 'loading' | 'success' | 'error';
  books: Book[];
  error: string | null;
  updatedAt: string;
};



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



