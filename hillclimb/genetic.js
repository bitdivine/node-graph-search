const assert = require("assert");
const BestN = require("../data-structures/best-n.js");
function solve(problem, options){
	const {randomState, stateClone, neighbours, stateCost, size, geneticBond} = problem;
	assert.equal(typeof(randomState), "function", `randomState ${randomState} in ${problem}`);
	assert.equal(typeof(stateClone), "function", `stateClone ${stateClone} in ${problem}`);
	assert.equal(typeof(neighbours), "function", `neighbours ${neighbours} in ${problem}`);
	assert.equal(typeof(stateCost), "function", `stateCost ${stateCost} in ${problem}`);
	assert.equal(typeof(geneticBond), "function", `stateCost ${geneticBond} in ${problem}`);
	assert.equal(typeof(size), "number", `The problem size has to be a number.`);
	options = options || {};
	var {limit, stackSize} = options;
	limit = limit || -1;
	stackSize = stackSize || 1000;
	assert.equal(typeof(limit), "number", `The step limit has to be a number.`);
	assert.equal(typeof(stackSize), "number", `The stackSize has to be a number.`);
	const start = Date.now();
	var stepCounter = 0;

	function answer(state){ return {state, searchCost: stepCounter, searchTime:Date.now() - start}; }
	function random(n){ return Math.floor(Math.random() * n); }
	function chooseInverselyWeightedRandom(initialStates) {
		while (true) {
			let index = random(stackSize);
			if (Math.random() < 1.0/initialStates.contents[index].cost) {
				return initialStates.contents[index].item;
			}
		}
	}
	function auditedStateCost(state){ stepCounter++; return stateCost(state); }
	function initialFill() {
		const ans = new BestN(stackSize);
		for (let i=0; i<stackSize; i++) {
			let state = randomState();
			let cost = auditedStateCost(state);
			if (cost === 0) return answer(state);
			ans.add(cost, state);
		}
		return ans;
	}
	function solve() {
		let states = initialFill();
		for(let iteration=0;iteration != limit;iteration++){
			let state = geneticBond(chooseInverselyWeightedRandom(states), chooseInverselyWeightedRandom(states), 0.1);
			let cost = auditedStateCost(state);
			if (cost === 0) return answer(state);
			states.add(cost, state);
		}
	}
	return solve()
}

module.exports =
{ solve
};
