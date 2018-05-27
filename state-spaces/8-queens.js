function randomState(length){
	return Array(length).fill(0).map(x=>Math.floor(Math.random()*length))
}
function stateCost(state){
	return 	( state.length - state.reduce((d,p,i) => d.add(p), new Set()).size
		+ state.length - state.reduce((d,p,i) => d.add(p-i), new Set()).size
		+ state.length - state.reduce((d,p,i) => d.add(p+i), new Set()).size
		);
}
function stateClone(state){
	return state.map(x => x)
}
function randomPermutation(length) {
	return Array(length).fill([0,0.0]).map((_,i) => [i,Math.random()]).sort((a,b)=>a[1]-b[1]).map(x=>x[0])
}
function* neighbours(state){
	const columnOrder = randomPermutation(state.length)
	for(let i=0; i<state.length; i++){
		const col = columnOrder[i];
		const rowOrder = randomPermutation(state.length)
		for (let j=0; j<state.length; j++) {
			const row = rowOrder[j]
			if (state[col]!==row) {
				yield state.map((rr,cc) => (col==cc)?row:rr)
			}
		}
	}
}

function problem(length) {
	length = (length === undefined)?8:length
	return(
	{ randomState: function(){return randomState(length)}
	, stateClone
	, stateCost
	, neighbours
	})
}

console.log(module.parent)
if (module.parent === null) {
	const {solve} = require("../hillclimb-steepest-fist-iterative-deepening")
	const length = Number(process.argv[2]) || 8
	console.log(solve(problem(length)))
}

module.exports =
{ problem
}
