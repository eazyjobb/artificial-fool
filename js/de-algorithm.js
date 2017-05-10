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
				dx = eval_d(vnorm, fnorm, rf); //console.log(dx);
				fpenalty = eval_fp(vnorm, fnorm, rf); //console.log(fpenalty);
				console.log(rf);

				var id = [];
				for (var j = 0; j < population.length; ++ j)
					id.push(j);
				id.sort(function(a, b) {return fpenalty[a] + dx[a] - fpenalty[b] - dx[b];});

				//for (var j = 0; j < population.length; ++ j) {
				//	console.log(
				//		id[j], fpenalty[id[j]], f(population[id[j]]), feasible(population[id[j]]),
				//		vnorm[id[j]]//, fnorm[id[j]], dx[id[j]]
				//	);
				//}
				//console.log('-------------------------');

				var new_population = [];
				for (var j = 0; j < pop; ++ j)
					new_population.push(population[id[j]].concat());
				population = new_population;

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
			res.push(Math.random() * MAX_RANGE[i] - 0.5 * MAX_RANGE[i] + START[i]);

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
	var res = undefined;
	var val = undefined;

	for (var i = 0; i < population.length; ++ i) {
		if (feasible(population[i]) == false)
			continue;
		var new_val = f(population[i]);
		if (res === undefined || new_val < val) {
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
			sum += Math.pow(OP, g[j](x[i]));
		res.push(sum);
	}

	var vmax = res[0], vmin = res[0];
	for (var i = 1; i < x.length; ++ i) {
		vmax = Math.max(res[i], vmax);
		vmin = Math.min(res[i], vmin);
	}

	if (vmax == vmin) {
		for (var i = 0; i < x.length; ++ i)
			res[i] = 1.0;
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

function eval_fp(vnorm, fnorm, rf) {
	var res = [];
	for (var i = 0; i < vnorm.length; ++ i) {
		var e = Math.exp(-1.0 * Math.pow((vnorm[i] - fnorm[i]), 2) / (2.0 * rf * rf));
		var ans = e * (1.0 / (rf * Math.sqrt(2 * Math.PI)));
		res.push(ans);
	}
	return res;
}
