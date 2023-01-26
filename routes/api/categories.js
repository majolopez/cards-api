const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');


const { check, validationResult } = require('express-validator');



//@route  GET api/categories
//@desc   Get all categories
//@access Private
router.get('/',
 async (req, res) => {
   try {

    const text = req.query.q;

    const categories = text === undefined  ?  await Category.find({}) : 
    await Category.find({ name: { $regex: text } });
    console.log(categories)
    res.set('Access-Control-Allow-Origin', process.env.UIURL);
    res.json(categories);

   } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
   }
  });

//@route Post/ cards
//@desc Register Card
//@access Public
router.post('/', [
    check('name','Nombre es requerido.')
    .not()
    .isEmpty()
],
async (req, res) => {
  console.log("calling post category")
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name} = req.body;

    try {
        let category = await Category.findOne({ name })
    
        if(category){
            return res.status(400).json({ errors: [{msg: 'La categiria ya existe'}] });
        }

        category = new Category({
            name
        });

        await category.save();

        return res.json(category);

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
  const { name } = req.body;

  //Build contact object
  const categoryFields = {};
  if(name) categoryFields.name = name;

  try {
    let category = await Category.findById(req.params.id);

    if(!category) return res.status(404).json({ msg: 'Card not found'});

    category = await Category.findByIdAndUpdate(req.params.id, 
      { $set: categoryFields }, 
      {new: true} );
    
    
    res.json(category);
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
    let category = await Category.findById(req.params.id);

    if(!category) return res.status(404).json({ msg: 'Category not found'});

    await Category.findByIdAndRemove(req.params.id );
    
    res.json({msg: 'Category removed'});
  } catch (error) {
    console.error(error.message);
    res.status(500).send('server error');
  }
});

module.exports  = router;