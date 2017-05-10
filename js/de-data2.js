var rf = 0;

var vec_size = 2;
var cur_iter = 0;

var MAX_RANGE = 60.0;

var CROSS_RATE = 1.0;
var SCAL_FACTOR = 0.3;

var best_ans = undefined;
var best_ans_f = undefined;
var best_ans_iter = undefined;

var history_bests = [];

var vnorm, fnorm;

function sqr(x) {return x * x;}

var f = function (x) {
	res = Math.pow(x[0] - 10.0, 3.0) + Math.pow(x[1] - 20.0, 3.0);
	return res;
}

var g = [
	function (x) {
		return 100.0 - (x[0] - 5.0) * (x[0] - 5.0) - (x[1] - 5.0) * (x[1] - 5.0);
	},
	function (x) {
		return (x[0] - 6.0) * (x[0] - 6.0) + (x[1] - 5.0) * (x[1] - 5.0) - 82.81;
	}
];

F = function(x) {
	return f(x);
}
