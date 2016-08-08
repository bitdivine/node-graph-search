
// Primitive priority queue.

module.exports = Priority_Queue;

function Priority_Queue(queue, weight_name){
	this.queue = queue || [];
	this.weight_name = "weight";
}

Priority_Queue.prototype.push = function push(node) {
	var weight_name = this.weight_name;
	var index = this.queue.findIndex((n) => n[weight_name] >= node[weight_name]);
	if (index === -1) index = this.queue.length;
	this.queue = this.queue.slice(0,index).concat([node], this.queue.slice(index))
};
Priority_Queue.prototype.pop = function pop(){
	return this.queue.pop()
};
