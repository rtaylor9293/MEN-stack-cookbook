const express = require('express');
const router = express.Router();
const User = require('../models/user.js');


router.get('/communityPage', async (req, res) => {
    const usersInDatabase = await User.find({}).sort({ username: 1 })
    console.log(usersInDatabase)

    res.render('users/index.ejs', {
        users: usersInDatabase,
    })
})

router.get('/communityPage/:userId', async (req, res) => {
    const foundUser = await User.findById(req.params.userId)
    
    console.log('foundUser:', foundUser)
    
    res.render('users/show.ejs', {
        users: foundUser,
        pantry: foundUser.pantry,
    })
})

router.get('/communityPage/:userId/:itemId', async (req, res) => {
    const foundUser = await User.findById(req.params.userId)
    const index = foundUser.pantry.filter(item => {
        // console.log({item: item._id.toString()})
        return item._id.toString() === req.params.itemId
    })

    // console.log({index, params:req.params})
    res.render('foods/communityPantry.ejs', {
        users: foundUser,
        pantry: index,
    })
})

module.exports = router;