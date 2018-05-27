const assert = require("assert")
function solve(problem, limit){
	const {randomState, stateClone, neighbours, stateCost} = problem;
	assert.equal(typeof(randomState), "function", `randomState ${randomState} in ${problem}`)
	assert.equal(typeof(stateClone), "function", `stateClone ${stateClone} in ${problem}`)
	assert.equal(typeof(neighbours), "function", `neighbours ${neighbours} in ${problem}`)
	assert.equal(typeof(stateCost), "function", `stateCost ${stateCost} in ${problem}`)
	const start = Date.now()
	var stepCounter = 0;
	for(let iteration=0;iteration != limit;iteration++){
		function answer(state){ return {state, searchCost: (iteration * (iteration+1))/2, searchTime:Date.now() - start} }
		let initialState = randomState()
		let initialCost = stateCost(initialState)
		if (initialCost === 0) return answer(initialState)
		for (let [bestState, bestCost, lastCost] = [initialState, initialCost, initialCost+1]; bestCost < lastCost; stepCounter++) {
			lastCost = bestCost
			for (let neighbour of neighbours(stateClone(bestState))) {
				let neighbourCost = stateCost(neighbour)
				if (neighbourCost === 0) return answer(neighbour)
				if (neighbourCost< bestCost) {
					[bestState, bestCost] = [neighbour, neighbourCost]
					break
				}
			}
		}
	}
}

module.exports =
{ solve
}
