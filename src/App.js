import React, {useState, useRef, useCallback } from 'react'
import useBookSearch from './useBookSearch'
import './App.css'
export default function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber)

  const observer = useRef()
  const lastBookElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore){
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })

    if(node) observer.current.observe(node)

  }, [loading, hasMore])

  const handleChange = (e) => {
    setQuery(e.target.value)
    setPageNumber(1)
  }
  return (
    <>
      <input type='text' value={query} onChange={handleChange}></input>
      {books.map((book,index) => {
        if ( books.length === index + 1) {
          return <div className="offset" 
            ref={lastBookElementRef} 
            key={book+index}>
              {book}
            </div>
        } else {
          return <div className="offset" key={book+index}>{book}</div>
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'There is an error'}</div>
    </>
  )
}
