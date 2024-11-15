import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusIcon, XIcon } from "lucide-react";

const API_URL = import.meta.env.VITE_BASE_URL;

export default function BookManager() {
  const [books, setBooks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAllBooks`);
      if (Array.isArray(response.data.getallBooksDetails)) {
        setBooks(response.data.getallBooksDetails);
      } else {
        console.error("Invalid data format received:", response.data);
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    setNewBook((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Regular expression to match only letters, numbers, hyphens, and underscores
    const allowedChars = /^[a-zA-Z0-9-_]+$/;

    if (!newBook.title || newBook.title.length < 3) {
      newErrors.title = "Title is required and should be at least 3 characters.";
    } else if (!allowedChars.test(newBook.title)) {
      newErrors.title = "Title can only contain letters, numbers, hyphens (-), and underscores (_).";
    }

    if (!newBook.author || newBook.author.length < 3) {
      newErrors.author = "Author is required and should be at least 3 characters.";
    } else if (!allowedChars.test(newBook.author)) {
      newErrors.author = "Author can only contain letters, numbers, hyphens (-), and underscores (_).";
    }

    if (!newBook.description || newBook.description.length < 10) {
      newErrors.description = "Description is required and should be at least 10 characters.";
    }

    if (!newBook.image) {
      newErrors.image = "Image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", newBook.title);
    formData.append("author", newBook.author);
    formData.append("description", newBook.description);
    formData.append("images", newBook.image);

    try {
      await axios.post(`${API_URL}/createBook`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchBooks();
      setIsFormOpen(false);
      setNewBook({ title: "", author: "", description: "", image: null });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/deleteBook/${id}`);
      await fetchBooks();
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Book Manager</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Book
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
              <input
                name="title"
                placeholder="Title"
                value={newBook.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              
              <input
                name="author"
                placeholder="Author"
                value={newBook.author}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}

              <textarea
                name="description"
                placeholder="Description"
                value={newBook.description}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="p-4 flex-grow">
                {book.images.length > 0 ? (
                  <img
                    src={`${API_URL}/public/${book.images[0]}`}
                    alt={book.title}
                    className="w-full h-48 object-contain mb-4 rounded"
                  />
                ) : (
                  <div className="w-full h-48 flex justify-center items-center bg-gray-200 text-gray-500 mb-4 rounded">
                    No Image Available
                  </div>
                )}

                <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
                <p className="text-sm text-gray-600 mb-2">By {book.author}</p>
                <p className="text-sm">{book.description}</p>
              </div>
              <div className="bg-gray-100 px-4 py-3 flex justify-end">
                <button
                  onClick={() => setDeleteConfirmation(book._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No books available.</p>
        )}
      </div>

      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this book?</p>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmation)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
