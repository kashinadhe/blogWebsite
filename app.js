const express=require("express");
const bodyParser=require("body-parser");
const _ = require("lodash");
const res = require("express/lib/response");
const mongoos=require("mongoose");
const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

mongoos.connect("mongodb+srv://admin-kaustubh:Kashin12@cluster0.gf3u2.mongodb.net/blogsDB",{useNewUrlParser:true});
                            //admin name    //password                        //DatabaseName

const postsSchema=new mongoos.Schema({
    title: String,
    textArea: String
});
const Post=mongoos.model("Post",postsSchema);

app.get("/",function(req,res){
    Post.find(function(err,posts){
        res.render("index",{posts: posts});
    });
});

app.get("/aboutus",function(req,res){
    res.render("aboutus");
});
app.get("/contactus",function(req,res){
    res.render("contactus");
});
app.get("/newblog",function(req,res){
    res.render("newblog");
});
app.post("/newblog",function(req,res){
    Post.find(function(err,posts){
        if(!err){
        const post=new Post({
            title: req.body.title,
            textArea: req.body.textArea
        });
        post.save();
        res.render("index",{posts: posts});
        
        }
    });
    res.redirect("/");
});
app.get("/post",function(req,res){
    res.render("post");
});

app.get("/posts/:title",function(req,res){
    const requestedTitle= _.lowerCase(req.params.title);
    Post.find(function(err,posts){
        for(let i=0;i<posts.length;i++){
            let storedTitle=_.lowerCase(posts[i].title);
            if(storedTitle===requestedTitle){
                res.render("post",{title: posts[i].title, textArea: posts[i].textArea});
            }
        }
    });
});
app.post("/delete",function(req,res){
    let title=req.body.getTitleDeleteBtn;
    Post.deleteOne({title: title},function(err){
        if(!err){
            console.log("successfully Deleted");
            res.redirect("/");
        }
    });
});
app.listen(process.env.PORT  || 3000,function(){
    console.log("Server Started");
});