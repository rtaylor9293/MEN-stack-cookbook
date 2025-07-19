const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

/*
Action	Route	HTTP Verb
Index	‘/users/:userId/foods’	GET
New	‘/users/:userId/foods/new’	GET
Create	‘/users/:userId/foods’	POST
Show	‘/users/:userId/foods/:itemId’	GET
Edit	‘/users/:userId/foods/:itemId/edit’	GET
Update	‘/users/:userId/foods/:itemId’	PUT
Delete	‘/users/:userId/foods/:itemId’	DELETE
*/

// All routes below are mounted on /users/:userId/foods

// INDEX
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

// NEW
router.get('/new', (req, res) => {
    res.render('foods/new.ejs');
})

// DELETE
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

// UPDATE
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

// CREATE
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

// EDIT
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