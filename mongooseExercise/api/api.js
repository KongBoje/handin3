let router = require("express").Router();
var Jokes = require("../models/Jokes")

router.get("/", (req, res) => {
  res.json({ msg: "Hello World" });
});

// get all
router.get("/jokes", (req, res) => {
  Jokes.model("Joke").find({}, (err, docs) => {
    res.json(docs);
  })
})

// get by id
router.get("/jokes/:id", (req, res) => {
  Jokes.find(
    {
      _id: req.params.id
    },
    (err, docs) => {
      res.json(docs[0]);
    }
  )
})

// edit
router.put("/jokes/:id", (req, res) => {
  // this does not run the update lastedited
  /*Jokes.findByIdAndUpdate(req.params.id, req.body, (err, tmp)=>{
    res.json(tmp);
  })*/
  Jokes.findById(req.params.id, (err, tmp) => {
    tmp.joke = req.body.joke;
    tmp.reference = req.body.reference;
    tmp.category = req.body.category;

    tmp.save((err, data) => {
      res.json(data);
    })
  })

})

// delete
router.delete("/jokes/:id", (req, res) => {

  Jokes.findOneAndRemove({ _id: req.params.id }, (err) => {
    if (err) throw err;
    res.status(204).send();
  })

})

// create
router.post("/jokes", (req, res) => {


  // res.status(200).send();

  let tmp = new Jokes({
    joke: req.body.joke,
    category: req.body.category,
    reference: req.body.reference
  })

  Jokes.create(tmp, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.json(data);
    }
  })

  /* tmp.save((err, newObj) => {
     if (err) throw err;
     res.json(newObj);
   })*/

})


module.exports = router;
