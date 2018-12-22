const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const app = express();
const Sequelize = require('sequelize');

const AURORA_MYSQL_HOST = "";

const sequelize = new Sequelize('db', 'yjd_master', 'pwd12!@12', {
  host: AURORA_MYSQL_HOST,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  operatorsAliases: false
});

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

sequelize.sync();
  // .then(() => User.create({
  //   username: 'janedoe',
  //   birthday: new Date(1980, 6, 20)
  // }))
  // .then(jane => {
  //   console.log(jane.toJSON());
  // });

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
  const indexPage = fs.readFileSync('./index.html');
  return res.status(200).send(indexPage.toString());
});

app.post('/user', (req, res, next) => {

});
app.get('/user', (req, res, next) => {

});

app.use((req, res, next) => {
  return res.status(404).send('Not found');
});
app.use((req, res, next) => {
  return res.status(500).send('Internal server error');
});

app.listen(port, () => console.log(`Server is running at ${port}`));