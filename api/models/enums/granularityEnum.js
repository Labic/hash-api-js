// https://en.wikipedia.org/wiki/ISO_8601#Durations
var granularityEnum = {};
granularityEnum['PT15M'] = 15 * 60 * 1000;
granularityEnum['PT30M'] = 30 * 60 * 1000;
granularityEnum['P1H']   = 60 * 60 * 1000;
granularityEnum['P12H']  = 12 * 60 * 60 * 1000;
granularityEnum['P1D']   = 24 * 60 * 60 * 1000;
granularityEnum['P7D']   = 7 * 24 * 60 * 60 * 1000;
granularityEnum['P15D']  = 15 * 24 * 60 * 60 * 1000;
granularityEnum['P1M']   = 30 * 24 * 60 * 60 * 1000;

module.exports = granularityEnum;