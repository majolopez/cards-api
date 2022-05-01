const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

//@route Post/ users
//@desc Register User
//@access Public
router.post('/', [
    check('name','Nombre es requerido.')
    .not()
    .isEmpty(),
    check('email', 'Incluir un email valido.').isEmail(),
    check(
        'password',
        'La contrasena debe tener mas de 6 caracteres'
    )
    .isLength({ min: 6 })

],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email })
    
        if(user){
            return res.status(400).json({ errors: [{msg: 'El usuario ya existe'}] });
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
            }
        }

        jwt.sign(
            payload, 
            process.env.TOKEN, 
            {expiresIn: 36000 },
            (err, token) => {
                if(err) throw err;
                res.json({ token });
            });
        //Return jsonwebtoken
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server error')
    }

    

    
});

module.exports  = router;