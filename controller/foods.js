const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
    
        res.render('foods/index.ejs', {
            foods: currentUser.pantry,
            user: currentUser,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});


router.get('/new', (req, res) => {
    res.render('foods/new.ejs');
})


router.delete('/:itemId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const currentFood = currentUser.pantry.id(req.params.itemId).deleteOne();
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/foods`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


router.put('/:itemId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentFood = currentUser.pantry.id(req.params.itemId)

        currentFood.set(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/foods/${currentFood._id}`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


router.post('/', async (req, res) => {
    console.log(req.body)
    if (req.body.isVegan === "on") {
        req.body.isVegan = true;
    } else {
        req.body.isVegan = false;
    }

    try {
        const currentUser = await User.findById(req.session.user._id)
        currentUser.pantry.push(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/foods`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


router.get('/:itemId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const currentFood = currentUser.pantry.id(req.params.itemId)
        res.render('foods/edit.ejs', {
            foods: currentFood,
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// SHOW
router.get('/:itemId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentFood = currentUser.pantry.id(req.params.itemId)
        res.render('foods/show.ejs', {
            foods: currentFood,
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

module.exports = router;