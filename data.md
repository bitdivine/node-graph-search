

// Get distances between cities:
r = require('../Romania/map.json');

Object.keys(r.locations).map((name) => {return {nodes:[name, 'Bucharest'], cost: Math.pow(new Array(2).fill(0).map((n,i) =>Math.pow(r.Bucharest[0]-r[name][0],2)).reduce((a,b)=>a+b,0),0.5)};})

