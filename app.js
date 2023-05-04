const express = require("express");
const app = express();
const morgan = require('morgan');
const postBank = require("./postBank");

app.get("/", (req, res) => res.send("Hello World!"));

app.use(morgan('dev'));


app.get("/listings", (_req, res) => {
  const listings = postBank.list();

  const html = `<h1>Comments</h1>
  <ul>
  ${listings.map(list => `<li> <strong>${list.name}:</strong> ${list.title}</li>`).join(' ')}
  </ul>`;

  res.send(html)
});

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
