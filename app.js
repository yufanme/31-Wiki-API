const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

// basic setup
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// set up mongodb with mongoose
mongoose.connect('mongodb://localhost:27017/wikiDB');
// set schema
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

// set collection
const Article = mongoose.model('Article',articleSchema);
// set document

///////////////////////////////// Requests Targetting All Articles /////////////////////////////////
app.route('/articles')
.get(
    function (req, res) {
        Article.find({},function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    }
)

.post(
    function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err, article) {
           if (!err) {
               res.send(newArticle);
           }
        });
    
    }
)

.delete(
    function (req, res) {
        Article.deleteMany({}, function(err) {
            if (!err) {
                res.send("Deleted all articles.");
            }
        });
    }
);

///////////////////////////////// Requests Targetting A Specific Article /////////////////////////////////
app.route("/articles/:articleTitle")

.get(function(req, res) {
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
        if (!err) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found!");
            }

        } else {
            console.log(err);
        }
    })
})

.post()

.put(function(req, res) {
    Article.findOneAndUpdate(
        {title: req.params.articleTitle}, 
        {
            title: req.body.title,
            content: req.body.content
        },
        {overwrite: true}, 
        function(err){
        if (!err) {
            res.send("Successfutly updated articte.");
        }
    });
})

// .patch(function(req, res){
//     Article.findOneAndUpdate(
//         {title: req.params.articleTitle},
//         {
//             title: req.body.title,
//             content: req.body.content
//         },
//         function(err) {
//             if (!err) {
//                 res.send("Successfutly updated one part of articte.");
//             }
//         }
//     ); 
// })

.patch(function(req, res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err) {
            if (err) {
                console.log(err);
            } else {
                res.send("Patch success.");
            }
        }
    );
})

.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTitle}, function(err) {
        if (err) {
            console.error(err);
        } else {
            if (req.params.articleTitle) {
                res.send(req.params.articleTitle + " has been deleted!");
            } else {
                console.log("do not find.");
            }
        }
    });
});

app.listen(port, function() {
    console.log('Start program at port ' + port);
});