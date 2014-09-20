var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TweetSchema   = new Schema({
	filter_level: String,
	contributors: Number,
	text: String,
	geo: String,
	retweeted: Boolean,
	in_reply_to_screen_name: Boolean,
	possibly_sensitive: Boolean,
	truncated: Boolean,
	lang: String,
	entities: {
		trends: Array,
		symbols: Array,
		urls: Array,
		hashtags: Array,
		user_mentions: Array
	},
	in_reply_to_status_id_str: String,
	id: Number,
	source: String,
	in_reply_to_user_id_str: String,
	favorited: Boolean,
	in_reply_to_status_id: Number,
	retweet_count: Number,
	in_reply_to_user_id: Number,
	created_at: String,
	favorite_count: Number,
	id_str: String,
	place: String,
	user: {
		location: String,
		default_profile: Boolean,
		statuses_count: Number,
		profile_background_tile: Boolean,
		lang: String,
		profile_link_color: String,
		profile_banner_url: String,
		id: Number,
		following: Boolean,
		favourites_count: Number,
		protected: Boolean,
		profile_text_color: String,
		contributors_enabled: Boolean,
		verified: Boolean,
		description: String,
		name: String,
		profile_sidebar_border_color: String,
		profile_background_color: String,
		created_at: String,
		default_profile_image: Boolean,
		followers_count: Number,
		profile_image_url_https: String,
		geo_enabled: Boolean,
		profile_background_image_url: String,
		profile_background_image_url_https: String,
		follow_request_sent: Boolean,
		url: String,
		utc_offset: Number,
		time_zone: String,
		notifications: Boolean,
		friends_count: Number,
		profile_use_background_image: Boolean,
		profile_sidebar_fill_color: String,
		screen_name: String,
		id_str: String,
		profile_image_url: String,
		listed_count: Number,
		is_translator: Boolean,
	},
	coordinates: Boolean
});

module.exports = mongoose.model('Tweet', TweetSchema);