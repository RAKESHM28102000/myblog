//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const _ =require("lodash");



const app=express();
//mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});
mongoose.set('strictQuery', true);
//mongoose connection to mongodb
const URI=process.env.MONGO_KEY;
mongoose.connect(URI,{useNewUrlParser:true});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});





app.set("view engine" ,'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

const homePara = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const aboutPara = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

const event = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const day=event.toLocaleDateString("en-US",options);
const postSchema={
    title:String,
    content:String
}
const Blog=mongoose.model("Blog",postSchema);






app.get("/",function(req,res){
    Blog.find({},function(err,posts){
        res.render('home',{keyforhome:"homepage",
        keyforhomepara:homePara,
        posts:posts,
        today:day});
    });
    

});
app.get("/about",function(req,res){
    res.render('about',{keyforabout:"ABOUT ME"});
});
app.get("/compose",function(req,res){
    res.render('compose',{keyforcompose:"hey! you can create your own blog"});
});
// to create a blog
app.post("/compose",function(req,res){
  
   const post=new Blog({
        title:req.body.postTitle,
        content:req.body.postContent
    });
    post.save(function(err){
        if(!err){
            res.redirect("/");
        }
    });
  
});
// go to seperate  blog
app.get("/posts/:postid",function(req,res){
    const postid=req.params.postid;
     Blog.findOne({_id:postid},function(err,post){
        res.render("post",{keyforposttitle:post.title,
                           keyforpostpara:post.content});
    });
});

// to remove a blog
app.get("/remove",function(req,res){
    res.render('remove',{keyforremove:"hey! you can delete blog"});
});
app.post("/remove",function(req,res){
  const titleToRemove=_.lowerCase(req.body.removecontent);
   Blog.findOneAndDelete({title:titleToRemove},function(err,foundedtitle){
    if(!err){
        console.log("successfully removed");
        res.redirect("/");
    }
    else{
       console.log(err);
    }
   });

   
        
});


let port=process.env.PORT ||3000 || 8000 || 8080 ;
app.listen(port,function(req,res){
    console.log('port server is'+port);
});