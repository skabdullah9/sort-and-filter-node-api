console.log('04 Store API')
require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const connectDb = require('./db/connect')
const productsRouter = require('./routes/products')

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

//middleware
app.use(express.json())

//products router
app.use('/api/v1/products', productsRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDb(process.env.MONGO_URI)
        app.listen(port, () => console.log('server is running...'))
    } catch (error) {
        console.log(error)
    }
}
start()