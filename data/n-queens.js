#!/usr/bin/env node

module.exports = N_queens;

function legal(queens){ // Queens is an array.
			// Starting at the leftmost column and moving to the right it lists the row number of each queen.
			// Partial solutions are fine.  Use null or undefined for missing columns.  End columns can be omitted altogether.
	var occupied_rows = new Set()
	  , occupied_first_diagonal = new Set()
	  , occupied_second_diagonal = new Set();
	return !queens.some((row,col) => { // Does this queen attack previous queens?

		// Missing entry?  Skip.
		if ((undefined === row) || (null === row)) return;

		// Do any queens attack each other?
		if (occupied_rows.has(row)) return true;
		var first_dagonal = row-col;
		if (occupied_first_diagonal.has(first_dagonal)) return true;
		var second_diagonal = row+col;
		if (occupied_second_diagonal.has(second_diagonal)) return true;

		// Mark the blocked rows and diagonals:
		occupied_rows.add(row);
		occupied_first_diagonal.add(first_dagonal);
		occupied_second_diagonal.add(second_diagonal);
	});
}

function N_queens(n){
	this.n = n;
	this.initial_states = [[]];
	this.is_terminal_state = (s) => legal(s) && s.length===n;
	this.get_right_neighbours = (s) => new Array(n).fill(s).map((s,i) => s.concat([i])).filter(legal);
}

if (!module.parent){
	var problem = new N_queens(isNaN(process.argv[2])?4:Number(process.argv[2]));
	var boundary = problem.initial_states;
	function print_states(state, depth){
		console.log(JSON.stringify(state), depth===problem.n?'*':'');
		if (depth < problem.n) {
			problem.get_right_neighbours(state).forEach((s) => print_states(s, depth+1));
		}
	}
	print_states([],0);
}
