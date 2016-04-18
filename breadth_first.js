#!/usr/bin/env node


// Node: { name: /* city name */, parent: /*points to another node or null*/, cost: /* number - cost from an initial position */}
// Edge: { nodes: [city_name1, city_name2], cost: number }
// Problem:
// { "initial_states":   [cityname_1, ...] // Possible starting points
// , "terminal_states":  [cityname_1, ...] // Possible finishing points
// , "edges": [ edge1, edge2, ... ]        // See above for the form of an edge
// }

function ancestry(node){
	var route = [];
	var terminus = node;
	while(node){ route.push(node.name); node = node.parent; }
	return {route: route.reverse(), cost:terminus.cost};
}
function setPath(obj,path,val){ // setPath({}, ['a',5,'b'],99) => { a: { '5': { b: 99 } } }
	path.reduce((obj, node, i) => obj=obj[node]=i===path.length-1?val:obj[node]?obj[node]:{}, obj);
	return obj;
}

function breadth_first(problem){
	var visited = new Set();                           // Names of tested nodes.
	var final_set = new Set(problem.terminal_states);  // Names of destination nodes.
	var boundary = problem.initial_states.map((name) => {return {name:name,parent:null,cost:0};}); // queue.  Add with push.  Remove with shift.
	// Make an index of edges by node so that I can refer to them thus: adjacent[city1][city2] == edge;
	var adjacent = problem.edges.reduce
		((adjacent, edge) => edge.nodes.reduce
			((adjacent, node, i) => setPath(adjacent,[edge.nodes[i], edge.nodes[i^1]], edge)
			, adjacent
			)
		, {});
	while (boundary.length > 0) {
		var node = boundary.shift();
		if (final_set.has(node.name)) return ancestry(node);
		visited.add(node.name);
		Object.keys(adjacent[node.name])
			.filter((adj_node_name) => !visited.has(adj_node_name))
			.forEach((adj_node_name) => boundary.push({name:adj_node_name, parent:node, cost:node.cost + adjacent[node.name][adj_node_name].cost}));
	}
	return null;
}

module.exports = breadth_first;

if (!module.parent){
	console.log(breadth_first(require(process.argv[2]  || './data')));
}
