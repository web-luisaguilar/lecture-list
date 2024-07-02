import { Book } from '../App'

const BookItem = ({ book, callBack }: { book: Book; callBack: (id: string) => void }) => {
  return (
    <figure
      className="w-[200px] min-h-[400px] flex flex-col justify-between bg-[--md-sys-color-surface-container] p-4 rounded-sm"
      key={(book.ISBN, '-', book.title)}
    >
      <img src={book.cover} alt={book.title} title={`Portada del libro ${book.title}`} />
      <h3 className="text-lg font-medium text-center">{book.title}</h3>
      <button onClick={() => callBack(book.ISBN)}>
        {!book.onRead ? 'Add to Read' : 'Remove from Read'}
      </button>
    </figure>
  )
}

export default BookItem
