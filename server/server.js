const express = require('express');
const cors = require('cors');

const userRoutes = require('../routes/user');
const subjectRoutes = require('../routes/subject');
const database = require('../database/config');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;

    this.apiPaths = {
      auth: '/api/user',
      subject: '/api/subject',
    };

    // Methods
    this.dbConnection();
    this.middleware();
    this.routes();
  }

  // Database
  async dbConnection() {
    try {
      await database.authenticate();
      console.log('Database online');
    } catch (error) {
      console.log(error);
    }
  }

  middleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.apiPaths.auth, userRoutes);
    this.app.use(this.apiPaths.subject, subjectRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server listening at port ${this.port}`);
    });
  }
}

module.exports = Server;
