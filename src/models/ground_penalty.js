const bookshelf = require('./bookshelf');
const Base = require('./Base');

const GroundPenalty = bookshelf.Model.extend({
	tableName: 'ground_penalties',
});

module.exports = new Base(GroundPenalty);
