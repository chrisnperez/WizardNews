const express = require("express");
const app = express();
const morgan = require('morgan');
const postBank = require("./postBank");
const path = require('path')

app.get("/", (req, res) => res.send("Hello World!"));

app.use(morgan('dev'));

app.get("/posts", (_req, res) => {
  const posts = postBank.list();

  const html =
    `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>
            ${post.title}
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
            <div><a href="/posts/${post.id}">${post.title}</a></div>
          </small>
        </div>`
    ).join('')}
    </div>
  </body>
</html>`

  res.send(html)
});


app.get("/posts/:id", (req, res) => {
  console.log(req.params.id)
  const id = req.params.id;
  const posts = postBank.find(id);

  if (!posts.id) {
    // If the post wasn't found, set the HTTP status to 404 and send Not Found HTML
    res.status(404)
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>404: Page Not Found</p>
      </div>
    </body>
    </html>`
    res.send(html)
  } else {
    res.send(`
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>

    <body>
      <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
         <div class='news-item'>
          <p>
            ${posts.title}
            <small>(by ${posts.name})</small>
          </p>

          <p>${posts.content} </p>
          <small class="news-info">
            ${posts.upvotes} upvotes | ${posts.date}
          </small>
        </div>
      </div>
        </body>`)
  }

});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 1337;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});


