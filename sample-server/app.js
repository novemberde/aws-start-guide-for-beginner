const express = require('express');
const fs = require('fs');
const port = process.env.PORT || 3000;
const app = express();

app.get('/*', (req, res, next) => {
  const indexPage = fs.readFileSync('./index.html');
  return res.status(200).send(indexPage.toString());
});

app.use((req, res, next) => {
  return res.status(404).send('Not found');
});
app.use((req, res, next) => {
  return res.status(500).send('Internal server error');
});

app.listen(port, () => console.log(`Server is running at ${port}`));