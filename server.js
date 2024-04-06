import express from "express";
import { register, login, createSession, matchSessionToUser } from "./user.js";
import { addproduct, getProductImage, deleteProductById } from "./product.js";
import multer from "multer";
import cookieParser from "cookie-parser";
import { join } from "path";
import { readFileSync } from "fs";

const app = express(); //Creating the server
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // Extend the server to be able to read request's body
app.use(cookieParser()); //Able to read cookies
app.use("/signin", (req, res) => {
  const result = register(req.query);
  res.end();
});
app.post("/login", async (req, res) => {
  const user = await login(req.body);
  if (user !== null) {
    //console.log("User should log in.");
    const session = await createSession(user.id);
    res.cookie("session", session, { maxAge: 900000, httpOnly: false });
    res.status(200);
    console.log("User logged");
    res.redirect("/index.html");
  } else {
    console.log("Wrong Credentials.");
  }
  res.end();
});
app.get("/me", async (req, res) => {
  console.log(req.cookies);
  const user = await matchSessionToUser(req.cookies.session);
  console.log(user);
  if (user !== null) {
    res.status(200);
  } else res.status(401);

  res.end();
});

app.get("/admin.html", async (req, res) => {
  // get req cookies
  // if session exists in req cookies
  // which user matches session in cookies
  // check if isAdmin == 1
  // redirect to proper page
  const user = await matchSessionToUser(req.cookies.session);
  if (user !== null) {
    if (user.isadmin == 1) {
      res.sendFile(join(process.cwd(), "admin", "admin.html"));
    } else res.sendFile(join(process.cwd(), "public", "unauthorized.html"));
  } else res.sendFile(join(process.cwd(), "public", "unauthorized.html"));
  console.log(req.cookies);
  res.end;
});

const single = multer({ storage: multer.memoryStorage() }).single("image");
app.post("/addproduct", single, async (req, res) => {
  const product = { ...req.body, image: req.file };
  await addproduct(product);
  res.end();
});

app.get("/product/:id", async (req, res) => {
  const image = await getProductImage(req.params.id);

  // res.setHeader('Content-Type',image.imageType);
  // res.setHeader('Content-Length',image.image.length)
  res.end(image.image);
});

app.delete("/product/:id", async (req, res) => {
  const succsess = await deleteProductById(req.params.id);
  if (succsess == true) {
    res.status(200).end();
  } else res.status(403).end();
});
app.get("/components/header", async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const text = readFileSync(join(process.cwd(), "components", "header.html"));
  // res.sendFile(join(process.cwd(), "components", "header.html"));
  // console.log(text);
  res.end(text);
});
app.get("/components/footer", async (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  const text = readFileSync(join(process.cwd(), "components", "footer.html"));
  // res.sendFile(join(process.cwd(), "components", "header.html"));
  // console.log(text);
  res.end(text);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
