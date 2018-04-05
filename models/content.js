
/**
 * Created by leipeng on 18/4/1.
 */

var mongoose = require('mongoose');
var contentsSchema = require('../schemas/content');

module.exports = mongoose.model('Content', contentsSchema);