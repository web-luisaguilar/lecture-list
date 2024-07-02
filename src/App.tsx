// import { library } from './db/books.json'
import { useEffect, useState } from 'react'
import Library from './components/Library'
import LectureList from './components/LectureList'

export interface Book {
  title: string
  pages: number
  genre: string
  cover: string
  synopsis: string
  year: number
  ISBN: string
  author: {
    name: string
    otherBooks: string[]
  }
  onRead: boolean
}
function App() {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [availableBooks, setAvailableBooks] = useState<Book[]>([])
  const [isFilter, setIsFilter] = useState(false)

  const orderByName = (list: Book[]) => {
    list.sort((a, b) => {
      const nameA = a.title.toUpperCase()
      const nameB = b.title.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    })
    return list
  }

  const addToRead = (id: string) => {
    const updateAvaliableBooks = availableBooks.map((book) => {
      if (book.ISBN == id) {
        book.onRead = true
        return book
      } else {
        return book
      }
    })

    //actualizando localStorage
    const readBooks = updateAvaliableBooks.filter((book) => book.onRead)
    localStorage.setItem('onReadBooks', JSON.stringify(readBooks))

    setAvailableBooks(updateAvaliableBooks)
  }

  const removeFromRead = (id: string) => {
    const updateAvaliableBooks = availableBooks.map((book) => {
      if (book.ISBN == id) {
        book.onRead = false
        return book
      } else {
        return book
      }
    })

    //actualizando localStorage
    const readBooks = updateAvaliableBooks.filter((book) => book.onRead)
    localStorage.setItem('onReadBooks', JSON.stringify(readBooks))

    setAvailableBooks(updateAvaliableBooks)
  }

  const getLocalBooks = () => {
    const localData = localStorage.getItem('onReadBooks')
    if (localData) {
      return JSON.parse(localData) as Book[]
    } else {
      localStorage.setItem('onReadBooks', JSON.stringify([]))
      return null
    }
  }

  const filterByGenre = (genre: string) => {
    if (genre != 'all') {
      setIsFilter(true)
      const booksFilter = availableBooks.filter((book) => book.genre == genre)
      setFilteredBooks(booksFilter)
    } else {
      setFilteredBooks([])
      setIsFilter(false)
    }
  }
  const genres = [...new Set(availableBooks.map((book) => book.genre))]

  useEffect(() => {
    let active = true // esto evita el race condicion dereactal hacer fetching de datos v18

    const getLibraryData = async () => {
      const url = '/db/books.json'
      const data = await fetch(url)
      const json = await data.json()
      const fetchedLibrary = json.library.map(({ book }: { book: Book }) => {
        book.onRead = false
        return book
      }) as Book[]

      const localBooks = getLocalBooks()
      if (localBooks) {
        const mergedBooks = fetchedLibrary.map((bookFetched) => {
          const bookLocal = localBooks.find((localBook) => localBook.ISBN == bookFetched.ISBN)
          if (bookLocal) {
            return bookLocal
          } else {
            return bookFetched
          }
        })

        setAvailableBooks(orderByName(mergedBooks))
      } else {
        setAvailableBooks(orderByName(fetchedLibrary))
      }
    }
    if (active) {
      getLibraryData()
    }

    return () => {
      active = false
    }
  }, [])

  return (
    <main>
      <h1 className="text-4xl">Lista de Lectura</h1>
      <section className="flex md:gap-8 md:p-8">
        <article className=" flex flex-col w-1/2 gap-4 p-8 border border-[--md-sys-color-outline]">
          <h2 className="text-xl text-center my-4">Libros Disponibles</h2>
          <nav className="flex flex-wrap gap-8 justify-center lg:justify-between">
            <div>
              <h3>Ordenar por Genero</h3>
              <select
                name="genre"
                id="genre"
                onChange={(e) => filterByGenre(e.target.value)}
                defaultValue={'all'}
              >
                <option value="all">Todos</option>
                {genres.map((genre) => (
                  <option key={`key-${genre}`} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h3>Cantida de Libros</h3>
              <p className="text-center font-bold border p-2">
                {filteredBooks.length
                  ? filteredBooks.filter((b) => !b.onRead).length
                  : availableBooks.filter((b) => !b.onRead).length}
              </p>
            </div>
          </nav>
          <Library
            availableBooks={isFilter ? filteredBooks : availableBooks}
            addToRead={addToRead}
          />
        </article>
        <LectureList onRead={availableBooks} removeFromRead={removeFromRead} />
      </section>
    </main>
  )
}

export default App
