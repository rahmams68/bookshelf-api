const {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
} = require('./controllers')

const routes = [
    {
        path: '/books',
        method: 'POST',
        handler: addBook
    },

    {
        path: '/books',
        method: 'GET',
        handler: getAllBooks
    },

    {
        path: '/books/{bookId}',
        method: 'GET',
        handler: getBookById
    },

    {
        path: '/books/{bookId}',
        method: 'PUT',
        handler: updateBook
    },

    {
        path: '/books/{bookId}',
        method: 'DELETE',
        handler: deleteBook
    }
]

module.exports = routes