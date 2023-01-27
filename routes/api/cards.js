const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const Card = require('../../models/Card');
const Category = require('../../models/Category');
const { check, validationResult } = require('express-validator');



//@route  GET api/cards
//@desc   Get all cards
//@access Private
router.get('/:categoryId',
 async (req, res) => {
   try {

    category = req.params.categoryId

    cards = await Card.find({ category:  category  }).populate("category");

    res.set('Access-Control-Allow-Origin', process.env.UIURL);
    res.json(cards);
    
   } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
   }
  });

  //@route  GET api/cards
//@desc   Get all cards
//@access Private
router.get('/',
async (req, res) => { 
  try {

   const text = req.query.q;

   const cards = text === undefined  ?  await Card.find({}).populate("category") : 
   await Card.find({ back: { $regex: text } }).populate("category");

    res.json(cards);
  } catch (error) {
   console.error(error.message);
   res.status(500).send('server error');
  }
 });

//@route Post/ cards
//@desc Register Card
//@access Public
router.post('/', [
    check('front','Front es requerido.')
    .not()
    .isEmpty(),
    check('back','Back es requerido.')
    .not()
    .isEmpty(),
    check('category_id','Categoria es requerida.')
    .not()
    .isEmpty(),

],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { front, back, category_id } = req.body;

    try {
        let card = await Card.findOne({ front, back })
    
        if(card){
            return res.status(400).json({ errors: [{msg: 'La tarjeta ya existe'}] });
        }

        const category = await Category.findById(category_id);

        card = new Card({
            front,
            back,
            category: category.id
        });

        await card.save();
        res.set('Access-Control-Allow-Origin', process.env.UIURL);
        return res.json(card);

    } catch (error) {

        console.log("error")
        console.log(error.message);
        return res.status(500).send('Server error')
    }
    
});

//@route  PUT api/cards/:id
//@desc   Update cards
//@access Public
router.put('/:id',
async (req, res) => {
  const { front, back, level, category} = req.body;

  //Build contact object
  const cardFields = {};
  if(front) cardFields.front = front;
  if(back) cardFields.back = back;
  if(level) cardFields.level = level;
  if(category) cardFields.category = category;


  try {
    let card = await Card.findById(req.params.id);

    if(!card) return res.status(404).json({ msg: 'Card not found'});

    card = await Card.findByIdAndUpdate(req.params.id, 
      { $set: cardFields }, 
      {new: true} ).populate("category");
    
    
    res.json(card);
  } catch (error) {
    console.error(error.message);
    error.status(500).send('server error');
  }
});

//@route  DELETE api/cards/:id
//@desc   Delete a card
//@access Public
router.delete('/:id', 
async (req, res) => {
  try {
    let card = await Card.findById(req.params.id);

    if(!card) return res.status(404).json({ msg: 'Card not found'});

    await Card.findByIdAndRemove(req.params.id );
    
    res.json({msg: 'Card removed'});
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
});

module.exports  = router;