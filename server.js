process.env.PWD = process.cwd();

const express = require('express');

const app = express();

app.use(express.static(`${process.env.PWD}/build`));

app.get('*', (request, response) => {
  response.sendFile(`${process.env.PWD}/build/index.html`);
});

app.listen(process.env.PORT || 8081, () => {console.log(`Your app is listening on port 8081`); });
