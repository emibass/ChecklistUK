require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const {getItems, addItem, deleteItem, updateItem} = require("./database");
const e = require('express');


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

app.post("/submit", async(req, res)=> {

 
if (req.body.listItem.length > 0) {
    const newListItem ={
        name: req.body.listItem,
        selected: 0,
        id: Math. floor(Math. random() * 1000)
    }

    try {
        await  addItem(newListItem);
        // res.redirect("/");

    } catch (err){
        console.log(err);
    }
}

const checkedItem = req.body.check;
console.log(checkedItem);

 res.redirect("/");

});


app.get("/delete/:id", async (req, res) => {


const checkedItemId = new Number(req.params.id);
    
try {
    await deleteItem(checkedItemId);
    res.redirect("/");

} catch (err){
    console.log(err);
}


});



app.listen(process.env.PORT || 3000);
