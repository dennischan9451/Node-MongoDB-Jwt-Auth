require('dotenv').config();
require('datejs');

require('./auth.test');

const config = require('../src/config/app');
const db = require('../src/connection/db');

before((done) => {
  db.initialize(config.db.uri, config.db.name, config.db.options)
    .then(() => {
      done();
    });
});

after((done) => {
  db.dropDatabase().then(() => {
    db.close(true);
    done();
  });
});
