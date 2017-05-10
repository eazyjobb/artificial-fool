var calculation = function(dataset, pop, n, callback) {
	var i = 0;

	var population = init_dataset(pop);

	(function() {
		var st = +new Date();
		while (i < n) {
			if ((+new Date()) - st < 100) {
				++ i;

				cur_iter = i;

				var middle = Mutate(population);

				population = population.concat(middle);

				rf = calrf(population);

				vnorm = eval_v(population); //console.log(vnorm);
				fnorm = eval_f(population); //console.log(fnorm);
				dx = eval_d(vnorm, fnorm, rf); console.log(dx);

				population = population.sort(function(a, b) {return F(a) - F(b);}).slice(0, pop);

				var res = best_of(population);

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

function init_dataset(pop) {
	var ori_population = [];
	for (var i = 0; i < pop; ++ i)
		ori_population.push(random_in_search_space());
	return ori_population;
}

function random_in_search_space() {
	var res;

	do {
		res = []

		for (var i = 0; i < vec_size; ++ i)
			res.push(Math.random() * MAX_RANGE - MAX_RANGE * 0.5);

		if (feasible(res)) break;
	} while (1);

	return res;
}

function Mutate(population) {
	var res = [];

	for (var i = 0; i < population.length; ++ i) {
		var x1, x2, x3;

		do { x3 = parseInt(population.length * Math.random()); } while (x3 == i);
		do { x1 = parseInt(population.length * Math.random()); } while (x1 == i || x1 == x3);
		do { x2 = parseInt(population.length * Math.random()); } while (x2 == i || x2 == x3 || x2 == x1);

		var new_gene = population[i].concat();
		for (var j = 0; j < vec_size; ++ j)
			if (Math.random() <= CROSS_RATE)
				new_gene[j] = population[x3][j] + SCAL_FACTOR * (population[x1][j] - population[x2][j]);

		res.push(new_gene);
	}

	return res;
}

function best_of(population) {
	var res = population[0];
	var val = F(population[0]);

	for (var i = 1; i < population.length; ++ i) {
		var new_val = F(population[i]);
		if (new_val < val) {
			res = population[i];
			val = new_val;
		}
	}

	return res;
}

function feasible(x) {
	var flag = true;
	for (var i = 0; i < g.length; ++ i)
		if (g[i](x) > 0) {
			flag = false;
			break;
		}
	return flag;
}

function calrf(x) {
	var res = 0;
	for (var i = 0; i < x.length; ++ i)
		if (feasible(x[i]))
			++ res;
	return res * 1.0 / x.length;
}

function eval_v(x) {
	var res = [];
	for (var i = 0; i < x.length; ++ i) {
		var sum = 0.0;
		for (var j = 0; j < g.length; ++ j)
			sum += g[j](x[i]);
		res.push(sum);
	}

	var vmax = res[0], vmin = res[0];
	for (var i = 1; i < x.length; ++ i) {
		vmax = Math.max(res[i], vmax);
		vmin = Math.min(res[i], vmin);
	}

	if (vmax == vmin) {
		for (var i = 0; i < x.length; ++ i)
			res[i] = 0.0;
	} else {
		for (var i = 0; i < x.length; ++ i)
			res[i] = (res[i] - vmin) / (vmax - vmin);
	}

	return res;
}

function eval_f(x) {
	var res = [];
	for (var i = 0; i < x.length; ++ i)
		res.push(f(x[i]));

	var fmax = res[0], fmin = res[0];
	for (var i = 1; i < x.length; ++ i) {
		fmax = Math.max(res[i], fmax);
		fmin = Math.min(res[i], fmin);
	}

	if (fmax == fmin) {
		for (var i = 0; i < x.length; ++ i)
			res[i] = 0.0;
	} else {
		for (var i = 0; i < x.length; ++ i)
			res[i] = (res[i] - fmin) / (fmax - fmin);
	}

	return res;
}

function eval_d(x, y, rf) {
	var res = [];
	for (var i = 0; i < x.length; ++ i)
		res.push((x[i] * (1.0 - rf) + y[i] * rf));
	return res;
}
