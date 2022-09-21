require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const {getItems, addOrUpdateItem, deleteItem} = require("./database");

const app = express();
app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", async (req, res) => {
try {
    const allItems =  await getItems();
    res.render("index", {newListItems: allItems.Items});

 } catch (err){
    console.log(err);
    res.status(500).json({ err: 'Something went wrong' });
 }
});

app.post("/", async(req, res)=> {
    const newListItem ={
        name: req.body.item,
        id: Date.now()
    }
try {
    await  addOrUpdateItem(newListItem);
    res.redirect("/");

} catch (err){
   console.log(err);
}
});

app.post("/delete", async (req, res) => {
const checkedItemId = new Number(req.body.delete);

try {
    await deleteItem(checkedItemId);
    res.redirect("/");

} catch (err){
    console.log(err);
}
});

app.listen(process.env.PORT || 3000);
