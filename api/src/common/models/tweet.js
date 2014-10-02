module.exports = function(Tweet) {
	Tweet.Favorite = function (statusId, callback) {
		callback(null, true);
	}

	Tweet.remoteMethod(
		'Favorite',
		{
			accepts: [{arg: 'statusId', type: 'number'}],
			returns: {arg: 'success', type: 'boolean'}
		}
	);
};