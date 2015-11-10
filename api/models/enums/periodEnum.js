// https://en.wikipedia.org/wiki/ISO_8601#Durations
var periodEnum = {};
periodEnum['15m']  = 15 * 60 * 1000;
periodEnum['30m']  = 30 * 60 * 1000;
periodEnum['1h']   = 60 * 60 * 1000;
periodEnum['12h']  = 12 * 60 * 60 * 1000;
periodEnum['1d']   = 24 * 60 * 60 * 1000;
periodEnum['7d']   = 7 * 24 * 60 * 60 * 1000;
periodEnum['15d']  = 15 * 24 * 60 * 60 * 1000;

module.exports = periodEnum;