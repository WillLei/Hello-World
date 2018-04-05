/**
 * Created by leipeng on 18/4/1.
 */


var mongoose = require('mongoose');
var categorySchema = require('../schemas/category');

module.exports = mongoose.model('Category', categorySchema);