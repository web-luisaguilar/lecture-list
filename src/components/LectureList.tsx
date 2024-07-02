import { Book } from '../App'
import BookItem from './BookItem'

const LectureList = ({
  onRead,
  removeFromRead,
}: {
  onRead: Book[]
  removeFromRead: (id: string) => void
}) => {
  return (
    <article className="  flex flex-col w-1/2 gap-4 p-8 border border-[--md-sys-color-outline]">
      <h2 className="text-xl text-center my-4">Libros para Leer</h2>
      <nav className="flex flex-wrap gap-8 justify-center lg:justify-between">
        <div>
          <h3>Cantida de Libros</h3>
          <p className="text-center font-bold border p-2">
            {onRead.filter((b) => b.onRead).length}
          </p>
        </div>
      </nav>
      <aside className="grid grid-cols-[repeat(auto-fill,200px)] w-full gap-8 justify-center ">
        {onRead.map((book) => {
          if (book.onRead) {
            return (
              <BookItem key={book.ISBN} book={book} callBack={() => removeFromRead(book.ISBN)} />
            )
          }
        })}
      </aside>
    </article>
  )
}

export default LectureList
