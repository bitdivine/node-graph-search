const assert = require("assert")

class Item {
	constructor(cost, item) {
		assert(typeof(cost) === "number", `Cost must be a number, not ${typeof cost}: ${cost}`)
		assert(!Number.isNaN(cost), "Cost bust be a normal number, not NaN")
		this.cost = cost;
		this.item = item;
	}
}

class BestN{
	constructor(n){
		assert(typeof(n) === "number", "The size 'n' must be a number.")
		this.n = n;
		this.contents = [];
	}
	add(cost, item) {
		if (this.contents.length < this.n) {
			this.contents.push(new Item(cost, item))
		} else {
			const smallest = this.contents.reduce((worst, item, index) => (item.cost > worst.cost)?new Item(item.cost, index):worst, new Item(this.contents[0].cost, 0))
			if (smallest.cost > cost) this.contents[smallest.item] = new Item(cost, item)
		}
	}
}

module.exports = BestN

if (module.parent === null) {
	const best = new BestN(10);
	for (let x=10; x>=-10; x--) best.add(x,x*x)
	for (let x=0; x<10; x++) best.add(x,x*x)
	assert.equal(best.contents.length, 10, `Should contain 10 elements, not ${best.contents.length}`)
	assert.equal(Array.from(best.contents).map(x => x.cost).reduce((a,b) => a+b, 0), -55)
	for (let x=10; x>=-10; x--) best.add(x,x*x)
	assert.equal(best.contents.length, 10, `Should contain 10 elements, not ${best.contents.length}`)
	assert.equal(Array.from(best.contents).map(x => x.cost).reduce((a,b) => a+b, 0), -80)
}
