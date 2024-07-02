import { Book } from '../App'
import BookItem from './BookItem'

const Library = ({
  availableBooks,
  addToRead,
}: {
  availableBooks: Book[]
  addToRead: (id: string) => void
}) => {
  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,200px)]  w-full mx-auto gap-8 justify-center ">
        {availableBooks.map((book) => {
          if (!book.onRead) {
            return <BookItem key={book.ISBN} book={book} callBack={addToRead} />
          }
        })}
      </div>
    </>
  )
}

export default Library
