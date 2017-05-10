var rf = 0;

var OP = 1.05;

var vec_size = 10;
var cur_iter = 0;

var MAX_RANGE = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
var START =     [2, 2, 9, 5, 1, 1, 1, 10, 8, 8];

var CROSS_RATE = 0.7;
var SCAL_FACTOR = 0.05;

var best_ans = undefined;
var best_ans_f = undefined;
var best_ans_iter = undefined;

var history_bests = [];

var vnorm, fnorm, dx, fpenalty;

var f = function (x) {
	res = x[0] * x[0] + x[1] * x[1] + x[0] * x[1] - 14.0 * x[0] - 16.0 * x[1] + (x[2] - 10.0) * (x[2] - 10.0) +
		4.0 * (x[3] - 5.0) * (x[3] - 5.0) + (x[4] - 3.0) * (x[4] - 3.0) + 2.0 * (x[5] - 1.0) * (x[5] - 1.0) +
		5.0 * x[6] * x[6] + 7.0 * (x[7] - 11) * (x[7] - 11) + 2.0 * (x[8] - 10.0) * (x[8] - 10.0) +
		(x[9] - 7.0) * (x[9] - 7.0) + 45.0;
	return res;
}

var g = [
	function (x) {
		return -105.0 + 4.0 * x[0] + 5.0 * x[1] - 3.0 * x[6] + 9.0 * x[7];
	},//0
	function (x) {
		return 10.0 * x[0] - 8.0 * x[1] - 17.0 * x[6] + 2.0 * x[7];
	},//1
	function (x) {
		return -8.0 * x[0] + 2.0 * x[1] + 5.0 * x[8] - 2.0 * x[9] - 12.0;
	},//2
	function (x) {
		return 3.0 * (x[0] - 2.0) * (x[0] - 2.0) + 4.0 * (x[1] - 3.0) * (x[1] - 3.0) + 2.0 * x[2] * x[2] - 7.0 * x[3] - 120.0;
	},//3
	function (x) {
		return 5.0 * x[0] * x[0] + 8.0 * x[1] + (x[2] - 6.0) * (x[2] - 6.0) - 2.0 * x[3] - 40.0;
	},//4
	function (x) {
		return x[0] * x[0] + 2.0 * (x[1] - 2.0) * (x[1] - 2.0) - 2.0 * x[0] * x[1] + 14.0 * x[4] - 6.0 * x[5];
	},//5
	function (x) {
		return 0.5 * (x[0] - 8.0) * (x[0] - 8.0) + 2.0 * (x[1] - 4.0) * (x[1] - 4.0) + 3.0 * x[4] * x[4] - x[5] - 30.0;
	},//6
	function (x) {
		return -3.0 * x[0] + 6.0 * x[1] + 12.0 * (x[8] - 8.0) * (x[8] - 8.0) - 7.0 * x[9];
	}//7
];
