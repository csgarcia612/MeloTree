const express = require('express'),
  // bodyParser = require('body-parser'),
  session = require('express-session'),
  massive = require('massive'),
  app = express(),
  // redis = require('redis'),
  // RedisStore = require('connect-redis')(session),
  cors = require('cors'),
  { graphqlHTTP } = require('express-graphql'),
  gqlConfigs = require('./graphql/graphqlConfigs'),
  connect = require('connect-pg-simple'),
  auth0Controller = require('./controllers/auth0Controller'),
  nodemailerController = require('./controllers/nodemailerController'),
  usersController = require('./controllers/usersController'),
  stripeController = require('./controllers/stripeController'),
  dotenv = require('dotenv');

dotenv.config();

// app.use(bodyParser.json());

app.use(express.json());

massive({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_SECRET,
  ssl: {
    rejectUnauthorized: false,
  },
})
  .then((db) => {
    exports.database = db;
    console.log('Database Connection : ONLINE');
  })
  .catch((error) => {
    console.log(('😡 Error with Massive DB Connection 😡', error));
  });

// massive(process.env.CONNECTION_STRING)
//   .then((db) => {
//     exports.database = db;
//     console.log('Database Connection : ONLINE');
//   })
//   .catch((error) => {
//     console.log(('😡 Error with Massive DB Connection 😡', error));
//   });

// app.use(cors());

app.use(
  '/graphiql',
  graphqlHTTP({
    schema: gqlConfigs.schema,
    rootValue: gqlConfigs.root,
    graphiql: true,
  })
);

// let client = redis.createClient(process.env.REDIS_URI, {
//   tls: { rejectUnauthorized: false },
// });

// client.on('ready', () => {
//   console.log('Redis Connection : ONLINE');
// });

// client.on('error', (error) => {
//   console.log('***Redis Connection Error : ', error);
// });

// app.use(
//   session({
//     store: new RedisStore({ client }),
//     secret: process.env.REDIS_SECRET,
//     saveUninitialized: false,
//     resave: false,
//     cookie: { maxAge: 1000 * 60 * 60 * 24 * 2 },
//   })
// );

app.use(
  session({
    store: new (connect(session))({
      conObject: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_SECRET,
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 2,
    },
  })
);

app.get('/api/user-data', usersController.getUser);

app.get('/auth/callback', auth0Controller.login);

app.post('/api/logout', auth0Controller.logout);

app.post('/api/nodemailer', nodemailerController.send);

app.post('/api/stripe', stripeController.creditCharge);

app.use(express.static(`${__dirname}/../build`));

const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
