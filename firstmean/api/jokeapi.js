var express = require("express")
var router = express.Router()
var jokemodule = require("../model/jokes")
var ObjectId = require('mongodb').ObjectID;


router.get("/joke", function (req, res, next) {
    jokemodule.allJokes((msg) => {
        //console.log(msg);
        res.json(msg)
    })
});

router.get("/findjoke/:id", function(req, res, next) {
    console.log("Lets find " + req.params.id);
    jokemodule.findJoke(req.params.id, (msg)=>{
        res.json(msg);
    });
})

router.post("/addjoke", function(req, res, next) {
    console.log("Let's create ---");

    req.body.lastEdited = (new Date()).toISOString();
    req.body._id = new ObjectId();

    console.log(req.body);
    jokemodule.addJoke(req.body, (msg)=>{
        res.json(msg);
    })
})

router.put("/editjoke", function(req, res, next) {
    console.log("Let's edit ---");

    jokemodule.editJoke(req.body, (msg)=>{
        res.json(msg);
    })

})

router.delete("/delete/:id", function(req, res, next) {
    console.log("Let's delete " + req.params.id);

    jokemodule.deleteJoke(req.params.id, (msg)=>{
        res.json(msg);
    })

})

router.get("/random", (req, res, next)=>{
    jokemodule.randomJoke((msg)=>{
        res.json(msg);
    })
})

module.exports = router;
