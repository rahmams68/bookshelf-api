const { nanoid } = require('nanoid')
const books = require('./books')

const addBook = (req, h) => {
    const { name, pageCount, readPage } = req.payload

    if (!name || readPage > pageCount) {
        const res = h.response({
            status: 'fail',
            message: !name ? 'Gagal menambahkan buku. Mohon isi nama buku' : 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })

        res.code(400)
        return res
    }

    else {
        const { year, author, summary, publisher, reading } = req.payload
        const id = nanoid(16)
        const insertedAt = new Date().toISOString()
        const updatedAt = insertedAt
        const finished = pageCount === readPage
    
        const newBook = {
            id,
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt,
            updatedAt
        }
    
        books.push(newBook)
    
        const isSuccess = books.filter((item) => item.id === id).length > 0
    
        if (isSuccess) {
            const res = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: { bookId: id }
            })
    
            res.code(201)
            return res
        }
    }
}

const getAllBooks = (req) => {
    const { name, reading, finished } = req.query
    let booksData

    if (name) {
        const regex = new RegExp(`${name.toLowerCase()}`)
        booksData = books.filter((item) => item.name.toLowerCase().match(regex)).map((item) => ({
            id: item.id,
            name: item.name,
            publisher: item.publisher
        }))
    }

    else
    if (reading) {
        booksData = books.filter((item) => reading === '0' ? item.reading === false : item.reading === true).map((item) => ({
            id: item.id,
            name: item.name,
            publisher: item.publisher
        }))
    }

    else
    if (finished) {
        booksData = books.filter((item) => finished === '0' ? item.finished === false : item.finished === true).map((item) => ({
            id: item.id,
            name: item.name,
            publisher: item.publisher
        }))
    }

    else {
        booksData = books.length < 1 ? [] : books.map((item) => ({
            id: item.id,
            name: item.name,
            publisher: item.publisher
        }))
    }

    return {
        status: 'success',
        data: {
            books: booksData
        }
    }
}

const getBookById = (req, h) => {
    const { bookId } = req.params
    const bookData = books.filter((item) => item.id === bookId)[0]

    if (!bookData) {
        const res = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        })
    
        res.code(404)
        return res    
    }

    const res = h.response({
        status: 'success',
        data: {
            book: bookData
        }
    })

    res.code(200)
    return res
    
}

const updateBook = (req, h) => {
    const { name, pageCount, readPage } = req.payload
    
    if (!name || readPage > pageCount) {
        const res = h.response({
            status: 'fail',
            message: !name ? 'Gagal memperbarui buku. Mohon isi nama buku' : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        
        res.code(400)
        return res
    }
    
    const { bookId } = req.params
    const index = books.findIndex((item) => item.id === bookId)
    
    if (index !== -1) {
        const updatedAt = new Date().toISOString()
        const { year, author, summary, publisher, reading } = req.payload

        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt
        }

        const res = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })

        res.code(200)
        return res
    }

    else {
        const res = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        })

        res.code(404)
        return res
    }
}

const deleteBook = (req, h) => {
    const { bookId } = req.params
    const index = books.findIndex((item) => item.id === bookId)

    if (index !== -1) {
        books.splice(index, 1)

        const res = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })

        res.code(200)
        return res
    }

    else {
        const res = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        })

        res.code(404)
        return res
    }
}

module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
}