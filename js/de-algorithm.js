var calculation = function(dataset, pop, n, callback) {
	var i = 0;
	(function() {
		var st = +new Date();
		while (i < n) {
			if ((+new Date()) - st < 100) {
				++ i;

				cur_iter = i;
				res = iterate();

				pump_data_to_ui(res);

				if (i == n)
					callback && callback();
			} else {
				setTimeout(arguments.callee, 0);
				return;
			}
		}
	})();
};

function iterate() {
	res = []

	for (var i = 0; i < vec_size; ++ i)
		res.push(Math.random());

	return res;
}
