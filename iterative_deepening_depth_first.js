#!/usr/bin/env node


// Node: { name: /* city name */, parent: /*points to another node or null*/, cost: /* number - cost from an initial position */}
// Edge: { nodes: [city_name1, city_name2], cost: number , depth: number}
// Problem:
// { "initial_states":   [cityname_1, ...] // Possible starting points
// , "terminal_states":  [cityname_1, ...] // Possible finishing points
// , "edges": [ edge1, edge2, ... ]        // See above for the form of an edge
// }

var limited_depth_first = require('./limited_depth_first');

function iterative_deepening_depth_first(problem, limit){
	var i, ans;
	for (i=0; i<limit; i++) {
		ans = limited_depth_first(problem);
		if (ans === null) return null;
		if (ans === false) continue;
		return ans;
	}
}

module.exports = iterative_deepening_depth_first;

if (!module.parent){
	console.log(iterative_deepening_depth_first(require(process.argv[2]  || './data'), process.argv[3] || Infinity));
}
