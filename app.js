const express=require("express")
const bodyparser=require("body-parser")
const mongoose = require('mongoose');

const app=express()
app.use(express.static('data'))
app.use(bodyparser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')


//Database
// mongoose.connect('mongodb+srv://admin123:admin123@cluster0.ax6nn.mongodb.net/customerdb')
mongoose.connect('mongodb://127.0.0.1:27017/customerdb')

const customerSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
const Customerdata=mongoose.model("Customerdata",customerSchema)

const customer1=new Customerdata({
    name:"Zeeshan",
    email:"zeeshanktk987@gmail.com",
    password:"Abcdef"
})

const mixeddata=[customer1]



//Get Routes


app.get('/',function(req,res){

    res.render('index')

})


app.get('/admin',function(req,res){

    Customerdata.find()
    .then((data)=>{
        if (data.length == 0) {

          Customerdata.insertMany(mixeddata)
          .then(()=>{
            res.redirect("/admin");
          }).catch((err)=>{
            if (err) {
              console.log(err);
            } else {
              console.log("Successfully Inserted Data");
            }})
            
        } else {
          res.render("admin", { newdataitem: data });
        }
    })

})


//Post Routes

app.post('/',function(req,res){

    const customer=new Customerdata({
        name:req.body.username,
        email:req.body.useremail,
        password:req.body.userpass
    })
    customer.save()
    res.redirect('/')

})




app.post('/delete',function(req,res){

const btnname=req.body.btn

Customerdata.findByIdAndRemove(btnname)
.then(()=>{
    console.log("SuccessFully Deleted");
}).catch(err=>console.log(err))

res.redirect('/admin')
})







app.listen(process.env.PORT||3000,function(){
    console.log("Server Run On 3000 Port");
})