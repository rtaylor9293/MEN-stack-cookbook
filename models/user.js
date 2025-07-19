const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
  },
  ingredients: String, 
  recipeLink: String, 
  notes: String,
  status: {
    type: String, 
    enum: ['lovedIt', 'hatedIt', 'neutral', 'haveYetToTry']
  }
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pantry: [foodSchema],
});


const User = mongoose.model('User', userSchema);

module.exports = User;