// https://en.wikipedia.org/wiki/ISO_8601#Durations
var periodEnum = {};
periodEnum['15m']  = 15 * 60 * 1000;
periodEnum['30m']  = 30 * 60 * 1000;
periodEnum['1h']   = 60 * 60 * 1000;
periodEnum['6h']   = 6 * 60 * 60 * 1000;
periodEnum['12h']  = 12 * 60 * 60 * 1000;
periodEnum['1d']   = 24 * 60 * 60 * 1000;
periodEnum['2d']   = 2 * 24 * 60 * 60 * 1000;
periodEnum['3d']   = 3 * 24 * 60 * 60 * 1000;
periodEnum['4d']   = 4 * 24 * 60 * 60 * 1000;
periodEnum['5d']   = 5 * 24 * 60 * 60 * 1000;
periodEnum['6d']   = 6 * 24 * 60 * 60 * 1000;
periodEnum['7d']   = 7 * 24 * 60 * 60 * 1000;
periodEnum['15d']  = 15 * 24 * 60 * 60 * 1000;

// TODO: Use new period convention
periodEnum['PT15M'] = 15 * 60 * 1000;
periodEnum['PT30M'] = 30 * 60 * 1000;
periodEnum['P1H']   = 60 * 60 * 1000;
periodEnum['P6H']   = 6 * 60 * 60 * 1000;
periodEnum['P12H']  = 12 * 60 * 60 * 1000;
periodEnum['P1D']   = 24 * 60 * 60 * 1000;
periodEnum['P2D']   = 2 * 24 * 60 * 60 * 1000;
periodEnum['P3D']   = 3 * 24 * 60 * 60 * 1000;
periodEnum['P4D']   = 4 * 24 * 60 * 60 * 1000;
periodEnum['P5D']   = 5 * 24 * 60 * 60 * 1000;
periodEnum['P6D']   = 6 * 24 * 60 * 60 * 1000;
periodEnum['P7D']   = 7 * 24 * 60 * 60 * 1000;
periodEnum['P15D']  = 15 * 24 * 60 * 60 * 1000;
periodEnum['P1M']   = 30 * 24 * 60 * 60 * 1000;
periodEnum['P4M']   = 30 * 24 * 60 * 90 * 1000;

module.exports = periodEnum;