const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const genresRouter = require('./routes/genres');
const organizationRouter = require('./routes/concertOrganizator');
const authorizationRouter = require('./routes/authorization');
const userRouter = require('./routes/user');
const bandRouter = require('./routes/bands');
const eventRouter = require('./routes/events');
const seatRouter = require('./routes/seats');
const ticketRouter = require('./routes/tickets');
const exportRouter = require('./routes/export');
const cardRouter = require('./routes/card');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const corsOptions = {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.json());

app.use(fileUpload());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


app.use('/genre', genresRouter);
app.use('/organization', organizationRouter);
app.use('/authorization', authorizationRouter);
app.use('/user', userRouter);
app.use('/band', bandRouter);
app.use('/event', eventRouter);
app.use('/seat', seatRouter);
app.use('/ticket', ticketRouter);
app.use('/export', exportRouter);
app.use('/card', cardRouter);

app.use('/', () => {
    console.log('Hello!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
