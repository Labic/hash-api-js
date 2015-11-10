// https://en.wikipedia.org/wiki/ISO_8601#Durations
var periodEnum = {};
periodEnum['15m']  = 15 * 60 * 1000;
periodEnum['30m']  = 30 * 60 * 1000;
periodEnum['1h']   = 60 * 60 * 1000;
periodEnum['12h']  = 12 * 60 * 60 * 1000;
periodEnum['1d']   = 24 * 60 * 60 * 1000;
periodEnum['7d']   = 7 * 24 * 60 * 60 * 1000;
periodEnum['15d']  = 15 * 24 * 60 * 60 * 1000;

// TODO: Use new period convention
periodEnum['PT15M'] = 15 * 60 * 1000;
periodEnum['PT30M'] = 30 * 60 * 1000;
periodEnum['P1H']   = 60 * 60 * 1000;
periodEnum['P12H']  = 12 * 60 * 60 * 1000;
periodEnum['P1D']   = 24 * 60 * 60 * 1000;
periodEnum['P7D']   = 7 * 24 * 60 * 60 * 1000;
periodEnum['P15D']  = 15 * 24 * 60 * 60 * 1000;
periodEnum['P1M']   = 30 * 24 * 60 * 60 * 1000;

module.exports = periodEnum;