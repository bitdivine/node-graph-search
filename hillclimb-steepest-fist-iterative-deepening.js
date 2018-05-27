const assert = require("assert")
function solve(problem, limit){
	const {randomState, stateClone, neighbours, stateCost} = problem;
	assert.equal(typeof(randomState), "function", `randomState ${randomState} in ${problem}`)
	assert.equal(typeof(stateClone), "function", `stateClone ${stateClone} in ${problem}`)
	assert.equal(typeof(neighbours), "function", `neighbours ${neighbours} in ${problem}`)
	assert.equal(typeof(stateCost), "function", `stateCost ${stateCost} in ${problem}`)
	const start = Date.now()
	for(let iteration=0;iteration != limit;iteration++){
		let state = randomState()
		let initialState = state
		let cost = stateCost(state)
		if (cost === 0) return {state, searchCost:0, searchTime:Date.now() - start}
		for (let step=0; step < iteration; step++) {
			for (let neighbour of neighbours(stateClone(state))) {
				let neighbourCost = stateCost(neighbour)
//console.log(iteration, initialState, state, neighbour, cost, neighbourCost)
				if (neighbourCost === 0) return {neighbour, searchCost: (iteration * (iteration+1))/2, searchTime:Date.now() - start}
				if (neighbourCost<= cost) {
					[state, cost] = [neighbour, neighbourCost]
				}
			}
		}
	}
}

module.exports =
{ solve
}
