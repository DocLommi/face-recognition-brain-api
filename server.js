const express    = require('express');
const bodyParser = require('body-parser');
const bcrypt     = require('bcrypt-nodejs');
const cors       = require('cors');
const knex       = require('knex');

const register = require('./controllers/register');
const signin   = require('./controllers/signin');
const profile  = require('./controllers/profile');
const image    = require('./controllers/image');

const database = {
    users  : [{
        id      : '1',
        name    : 'John',
        email   : 'john@gmail.com',
        password: 'cookies',
        entries : 0,
        joined  : new Date()
    }],
    secrets: {
        users_id: '1',
        hash    : '$2a$10$g8iXX5YxGcZOr87B8Bocn.TRoBSlshPmJZho6tdPBkiN5gmHIj87y'
    }
};

const db = knex({
    client    : 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl : true
    }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt)
});

app.get('/profile/:id', (req, res) => {
    profile.handleProfileGet(req, res, db)
});

app.put('/image', (req, res) => {
    image.handleImage(req, res, db)
});

app.post('/imageurl', (req, res) => {
    image.handleApiCall(req, res)
});

app.listen(process.env.PORT || 3001, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});
