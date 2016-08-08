#!/usr/bin/env node

// Searches for the shortest path from A to B.  May be quite inefficient as it is blind to the likely progress towards the goal.
// Node: { name: /* city name */, parent: /*points to another node or null*/, cost: /* number - cost from an initial position */}
// Edge: { nodes: [city_name1, city_name2], cost: number }
// Problem:
// { "initial_states":   [cityname_1, ...] // Possible starting points
// , "terminal_states":  [cityname_1, ...] // Possible finishing points
// , "edges": [ edge1, edge2, ... ]        // See above for the form of an edge
// }

var Priority_Queue = require('./pqueue');

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

function cheapest_first(problem){
	var visited   = {};                                // Names of tested nodes => cheapest known cost
	var final_set = new Set(problem.terminal_states);  // Names of destination nodes.
	var boundary  = new Priority_Queue(problem.initial_states.map((name) => {return {name:name,parent:null,cost:0};}), "cost"); // queue.  Add with push.  Remove with shift.
	// Make an index of edges by node so that I can refer to them thus: adjacent[city1][city2] == edge;
	var adjacent = problem.edges.reduce
		((adjacent, edge) => edge.nodes.reduce
			((adjacent, node, i) => setPath(adjacent,[edge.nodes[i], edge.nodes[i^1]], edge)
			, adjacent
			)
		, {});
	while (boundary.queue.length > 0) {
		var node = boundary.queue.shift();
		if (final_set.has(node.name)) return ancestry(node);
		visited[node.name]	= (visited[node.name] === undefined)? node.cost
					: (visited[node.name] > node.cost)? node.cost
					:  visited[node.name];
		if (!(visited[node.name] < node.cost)) {
			visited[node.name] = node.cost;
			Object.keys(adjacent[node.name])
				.map((adj_node_name) => {return {name:adj_node_name, parent:node, cost:node.cost + adjacent[node.name][adj_node_name].cost}})
				.filter((new_node) => !(visited[new_node.name] < new_node.cost))
				.forEach((new_node) => boundary.push(new_node));
		}
	}
	return null;
}

module.exports = cheapest_first;

if (!module.parent){
	console.log(cheapest_first(require(process.argv[2]  || './data')));
}
