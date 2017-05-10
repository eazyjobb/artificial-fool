var rf = 0;

var OP = 1.1;

var vec_size = 7;
var cur_iter = 0;

var MAX_RANGE = [5, 5, 5, 5, 5, 5, 5];
var START =     [2, 2, 0, 4, 0, 1, 2];

var CROSS_RATE = 1.0;
var SCAL_FACTOR = 0.3;

var best_ans = undefined;
var best_ans_f = undefined;
var best_ans_iter = undefined;

var history_bests = [];

var vnorm, fnorm, dx, fpenalty;

var f = function (x) {
	res =
		(x[0] - 10.0) * (x[0] - 10.0) + 5.0 * (x[1] - 12.0) * (x[1] - 12.0) +
		Math.pow(x[2],4) + 3.0 * (x[3] - 11.0) * (x[3] - 11.0) +
		10.0 * Math.pow(x[4], 6) + 7.0 * x[5] * x[5] + Math.pow (x[6], 4) - 4.0 * x[5] * x[6] - 10.0 * x[5] - 8.0 * x[6];

	return res;
}

var g = [
	function (x) {
		return -127.0 + 2 * x[0] * x[0] + 3.0 * Math.pow(x[1], 4) + x[2] + 4.0 * x[3] * x[3] + 5.0 * x[4];
	},
	function (x) {
		return -282.0 + 7.0 * x[0] + 3.0 * x[1] + 10.0 * x[2] * x[2] + x[3] - x[4];
	},
	function (x) {
		return -196.0 + 23.0 * x[0] + x[1] * x[1] + 6.0 * x[5] * x[5] - 8.0 * x[6];
	},
	function (x) {
		return 4.0 * x[0] * x[0] + x[1] * x[1] - 3.0 * x[0] * x[1] + 2.0 * x[2] * x[2] + 5.0 * x[5] - 11.0 * x[6];
	}
];
