const cors = require('cors');
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { MONGOURI } = require('./config/config')
const PORT = process.env.PORT || 3001


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log('Connected to Mongo')
})

mongoose.connection.on('error', (err) => {
    console.log('Error Connecting to Mongo ', err)
})


require('./models/user')
require('./models/expense')

app.use(cors());
app.use(express.json())
app.use(require('./routes/auth'))
app.use('/expense',require('./routes/expense'))
app.use('/user', require('./routes/user'))

app.listen(PORT, () => {
    console.log('Server is running on ', PORT)
})