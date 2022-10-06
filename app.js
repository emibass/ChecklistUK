require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const {getItems, addItem, deleteItem, updateItemTo1, updateItemTo0, getItemByID} = require("./database");



const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


//Dynamo DB 

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
        id: new Date().valueOf(),
    }

    try {
        await  addItem(newListItem);

    } catch (err){
        console.log(err);
    }
}

res.redirect("/");

});

app.get("/update/:id", async (req, res) => {

const checkedItem = await getItemByID(new Number (req.params.id));



if (checkedItem.Item.selected == 0){
    try 
        {
        await updateItemTo1(new Number (req.params.id));
        // res.redirect("/");
        } catch (err)
            {
            console.log(err);
            }
} else if (checkedItem.Item.selected == 1){
    try 
    {
        await updateItemTo0 (new Number (req.params.id));
    } catch (err)
    {
        console.log(err);
    }
}

res.redirect('/');

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



app.listen(process.env.PORT || 3000, () => console.log ("app running"));
