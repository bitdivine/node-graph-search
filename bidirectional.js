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
function set(d,k,v){
	d[k] = v;
	return d;
}

function bidirectional_search(problem){
	var visited = [problem.initial_states, problem.terminal_states]
			.map((states) => new Set(states));
	// Queues:
	var boundaries = [problem.initial_states, problem.terminal_states]
			.map((states) => states.map((name) => {return {name:name,parent:null,cost:0};}));
	// For quick lookup:
	var termini = [problem.initial_states, problem.terminal_states]
			.map((states) => states.reduce((d,state) => d.add(state), new Set()));
	// Make an index of edges by node so that I can refer to them thus: adjacent[city1][city2] == edge;
	var adjacent = problem.edges.reduce
		((adjacent, edge) => edge.nodes.reduce
			((adjacent, node, i) => setPath(adjacent,[edge.nodes[i], edge.nodes[i^1]], edge)
			, adjacent
			)
		, {});
	// Search away:
	while(Math.min(...boundaries.map((x) => x.length)) > 0) {
		var shorter = Number(boundaries[0].length > boundaries[1].length);
		var node = boundaries[shorter].shift();
		termini[shorter].delete(node.name);
		if (termini[shorter^1].has(node.name)) {
			var forward_leg = ancestry(node);
			var reverse_leg = ancestry(boundaries[shorter^1].find((shadow) => shadow.name === node.name));
			return	{ cost: forward_leg.cost + reverse_leg.cost
				, route: forward_leg.route.concat(reverse_leg.route.reverse().slice(1))
				};
		}
		visited[shorter].add(node.name);
		Object.keys(adjacent[node.name])
			.filter((adj_node_name) => !visited[shorter].has(adj_node_name))
			.forEach((adj_node_name) => {
				boundaries[shorter].push({name:adj_node_name, parent:node, cost:node.cost + adjacent[node.name][adj_node_name].cost});
				termini[shorter].add(adj_node_name);
			});
	}
}

module.exports = bidirectional_search;

if (!module.parent){
	console.log(bidirectional_search(require(process.argv[2]  || './data')));
}
