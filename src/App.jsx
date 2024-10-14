import { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";

function App() {
  const [books, setBooks] = useState([]);
  const [selectedGenre, setselectedGenre] = useState("");
  const [selectedBooks, setselectedBooks] = useState([]);
  const [aviableBooks, setAviableBooks] = useState(0);

  useEffect(() => {
    fetch(`./data/books.json`)
      .then((res) => res.json())
      .then((response) => {
        setBooks(response.library);

        const storedBooks = localStorage.getItem("listBooks");

        if (storedBooks) {
          const parsedBooks = JSON.parse(storedBooks);

          setselectedBooks(parsedBooks);
        }

        const totalAviableBooks =
          response.library.length -
          (storedBooks ? JSON.parse(storedBooks).length : 0);

        setAviableBooks(totalAviableBooks);
      })
      .catch((error) => {
        console.error("Error al realizar la peticion", error.message);
      });
  }, []);

  const genres = useMemo(() => {
    const allGenres = books.map((book) => book.book.genre);

    return [...new Set(allGenres)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (!selectedGenre) {
      return books;
    }

    return books.filter((book) => book.book.genre === selectedGenre);
  }, [books, selectedGenre]);

  const addList = (book) => {
    const isAlreadySelected =
      selectedBooks.filter((b) => b.ISBN === book.ISBN).length > 0;

    if (!isAlreadySelected) {
      const updatedBooks = [...selectedBooks, book];

      setselectedBooks(updatedBooks);

      localStorage.setItem("listBooks", JSON.stringify(updatedBooks));

      const totalAviableBooks = books.length - updatedBooks.length;

      setAviableBooks(totalAviableBooks);
    }
  };

  const removeList = (book) => {
    const updatedBooks = selectedBooks.filter((b) => b.ISBN !== book.ISBN);

    setselectedBooks(updatedBooks);

    localStorage.setItem("listBooks", JSON.stringify(updatedBooks));

    const totalAviableBooks = books.length - updatedBooks.length;

    setAviableBooks(totalAviableBooks);
  };

  return (
    <div>
      <h1>Librería</h1>
      <header>
        <label>Filtrar por Género</label>
        <select
          value={selectedGenre}
          onChange={(e) => setselectedGenre(e.target.value)}
        >
          <option value="">Todos</option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </header>
      <main>
        <section>
          <h2>Libros disponibles</h2>
          <h4>{aviableBooks} libros disponibles</h4>
          <h6>{selectedBooks.length} en la lista de lectura</h6>
          <ul role="default">
            {filteredBooks &&
              filteredBooks.map((book) => (
                <li key={book.book.ISBN} onClick={() => addList(book.book)}>
                  <img src={book.book.cover} alt={book.book.title} />
                </li>
              ))}
          </ul>
        </section>
        <section>
          <h2>Lista de lectura</h2>
          <ul role="dynamic">
            {selectedBooks &&
              selectedBooks.map((book) => (
                <li key={book.ISBN} onClick={() => removeList(book)}>
                  <img src={book.cover} alt={book.title} />
                </li>
              ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
