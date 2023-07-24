let express = require("express");
const cors = require("cors");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
var port = process.env.port || 2410;
app.listen(port, () => console.log(`Listening on port ${port}!`));
let axios = require("axios");

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
let { prods, orders, users } = require("./fashionProdDetails.js");
// console.log(prods);

app.get("/products/:category", (req, res) => {
  let category = req.params.category;
  if (category) {
    let products = prods.filter((k) => k.category === category);
    if (products) {
      res.send(products);
    } else {
      res.status(404).send("No Product is available in this category");
    }
  } else {
    res.send(prods);
  }
});

app.get("/product/:id", (req, res) => {
  let { id } = req.params;
  let product = prods.find((k) => k.id === +id);
  // console.log(product);
  if (product) res.send(product);
  else res.status(404).send("Not Found");
});

app.post("/products", async (req, res) => {
  let { body } = req;
  try {
    let maxId = prods.reduce((acc, curr) =>
      acc.id > curr.id ? acc.id : curr.id
    );
    prods.push({ id: maxId + 1, ...body });
    res.send({ id: maxId + 1, ...body });
  } catch (ex) {
    if (ex.response) {
      // console.log(ex.response);
      let { status, statusText } = ex.response;
      // console.log(status, statusText);
      res.status(status).send(statusText);
    } else {
      res.status(404).send(ex);
    }
  }
});

app.put("/products/:id", (req, res) => {
  let { id } = req.params;
  let body = req.body;
  let index = prods.findIndex((k) => k.id === +id);
  if (index > -1) {
    prods[index] = { id: id, ...body };
    res.send(prods[index]);
  } else {
    res.status(404).send("Not Found");
  }
});

app.delete("/products/:id", (req, res) => {
  let id = +req.params.id;
  console.log(id);
  let index = prods.findIndex((k) => k.id === id);
  // console.log(index);
  if (index > -1) {
    let delprod = prods.splice(index, 1);
    res.send(delprod);
  } else {
    res.status(404).send("Not Found");
  }
});

app.get("/orders/:email", (req, res) => {
  let { email } = req.params;
  let myOrders = orders.filter((k) => k.email === email);
  res.send(myOrders);
});
app.get("/products", (req, res) => {
  res.send(prods);
});

app.post("/orders", (req, res) => {
  let body = req.body;
  orders.push(body);
  res.send(body);
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  // console.log(users);
  // console.log(req.body);
  let user = users.find((k) => k.email === email && k.password === password);
  if (user) {
    res.send(user.email);
  } else {
    res.status(404).send("Not found");
  }
});

app.post("/register", (req, res) => {
  let { body } = req;
  let index = users.findIndex((k) => k.email === body.email);
  users.push(body);
  res.send(body.email);
});
