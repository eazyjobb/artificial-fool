var num_circle = 3, num_rad = 2;
var num_group_P = 0, num_K = 0;
var width = 800, height = 600;
var circle_close_fact = 80, rad_close_fact = 100;
var canvas, old = [];
var data, iter_col;

$(document).ready(function () {
	$('.ui.dropdown').dropdown();
	$('#calculate').click(function () {
		if (num_group_P == 0) {
			swal({
				title:"Not Data Generated",
				html:true,
				confirmButtonColor: "#057748",
				confirmButtonText: "Ok, I got it",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});
			return;
		}

		num_K = $('input[name=num-k]').val();
		if (num_K == "") {
			swal({
				title:"Choose K please",
				html:true,
				confirmButtonColor: "#057748",
				confirmButtonText: "Ok, I got it",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});
			return;
		}

		$('#dimmer').show();

		calculate();
	});
	$('#rand-data').click(function () {
		canvas.clearRect(0, 0, width, height);
		num_group_P = Math.floor($('input[name=size-selection]').val() / (num_circle + num_rad));
		data = rand_data();
		iter_col = new Array(data.length);
		paint(data);
		console.log(num_group_P);
	});
	canvas = document.getElementById("myCanvas").getContext("2d");
});

function paint(data) {
	canvas.strokeStyle = "#FF0000";
	canvas.fillStyle = "#FF0000";
	for (var i = 0; i < data.length; ++ i) {
		canvas.beginPath();
		var x = data[i][0];
		var y = data[i][1];
		canvas.arc(x, y, 2 , 0, 2 * Math.PI);
		canvas.stroke();
		canvas.fill();
		canvas.closePath();
	}
}

function random() {
	return Math.random() * 2 - 1.0;
}

function rand_data() {
	var res = [];

	while (old.length)	old.pop();

	for (var i = 0; i < num_circle; ++ i) {
		var core_x, core_y;

		do {
			core_x = Math.floor(Math.random() * width);
			core_y = Math.floor(Math.random() * height);
			var flag = false;
			for (var k = 0; k < old.length; ++ k) {
				console.log(distant(old[k][0], old[k][1], core_x, core_y));
				if (distant(old[k][0], old[k][1], core_x, core_y) < 40000)
					flag = true;
			}

		} while (flag);

		old.push([core_x, core_y]);

		//var own_set = [];
		console.log([core_x, core_y]);

		for (var j = 0; j < num_group_P; ++ j) {
			var length = Math.random() * circle_close_fact;
			var rad = random() * Math.PI;

			var x = Math.floor(length * Math.cos(rad) + core_x);
			var y = Math.floor(length * Math.sin(rad) + core_y);

			while (0 > x || x >= width || 0 > y || y > height) {
				length = Math.random() * circle_close_fact;
				rad = random() * Math.PI;
				x = Math.floor(length * Math.cos(rad) + core_x);
				y = Math.floor(length * Math.sin(rad) + core_y);
			}

			//own_set.push([x, y]);
			res.push([x, y]);
		}

		//console.log(own_set);
	}

	for (var i = 0; i < num_rad; ++ i) {
		var core_x, core_y;

		do {
			core_x = Math.floor(Math.random() * width);
			core_y = Math.floor(Math.random() * height);
			var flag = false;
			for (var k = 0; k < old.length; ++ k) {
				console.log(distant(old[k][0], old[k][1], core_x, core_y));
				if (distant(old[k][0], old[k][1], core_x, core_y) < 40000)
					flag = true;
			}

		} while (flag);

		//var own_set = [];
		old.push([core_x, core_y]);
		console.log([core_x, core_y]);

		for (var j = 0; j < num_group_P; ++ j) {
			var length = (Math.random() * 0.2 + 0.8) * rad_close_fact;
			var rad = random() * Math.PI;

			var x = Math.floor(length * Math.cos(rad) + core_x);
			var y = Math.floor(length * Math.sin(rad) + core_y);

			while (0 > x || x >= width || 0 > y || y > height) {
				length = (Math.random() * 0.2 + 0.8) * rad_close_fact;
				rad = random() * Math.PI;
				x = Math.floor(length * Math.cos(rad) + core_x);
				y = Math.floor(length * Math.sin(rad) + core_y);
			}

			//own_set.push([x, y]);
			res.push([x, y]);
		}

		//console.log(own_set);
	}

	console.log(old);
	return res;
}


function calculate() {
	console.log(old);
	var seed = [];
	for (var i = 0; i < num_K; ++ i) {
		var index = Math.floor(Math.random() * data.length);
		if (i < old.length)
			seed.push([old[i][0], old[i][1]]);
		else
			seed.push([data[index][0], data[index][1]]);
	}

	var aold = [];
	for (var haha = 0; haha < 3000; ++ haha) {
		aold = seed.concat();
		iter(seed);

		console.log(haha, seed);

		var flag = true;
		for (var k = 0; k < num_K; ++ k)
			if (aold[k][0] != seed[k][0] || aold[k][1] != seed[k][1])
				flag = false;

		if (flag)
			break;
	}
	colored(seed);
}

function iter(seed) {
	var count = new Array(num_K);
	for (var k = 0; k < num_K; ++ k)
		count[k] = 0;

	for (var k = 0; k < data.length; ++ k) {
		var dis = distant(data[k][0], data[k][1], seed[0][0], seed[0][1]), col = 0;
		for (var i = 1; i < num_K; ++ i) {
			var new_dis = distant(data[k][0], data[k][1], seed[i][0], seed[i][1]);
			if (new_dis < dis) {
				dis = new_dis;
				col = i;
			}
		}
		iter_col[k] = col;
		++ count[col];
	}

	//console.log(count);

	for (var k = 0; k < num_K; ++ k)
		if (count[k] > 0)
			seed[k][0] = seed[k][1] = 0;
		else
			console.log("BAD K", k);

	for (var k = 0; k < data.length; ++ k) {
		seed[iter_col[k]][0] += data[k][0];
		seed[iter_col[k]][1] += data[k][1];
	}

	for (var k = 0; k < num_K; ++ k) if (count[k] > 0) {
		seed[k][0] /= count[k]; seed[k][0] = Math.floor(seed[k][0]);
		seed[k][1] /= count[k]; seed[k][1] = Math.floor(seed[k][1]);
	}

	//console.log(seed);
}

var color = ["rgb(153, 102, 204)", "rgb(233, 240, 29)", "rgb(0, 255, 128)", "rgb(221, 240, 237)",
			 "rgb(224, 128, 49)", "rgb(25, 148, 117)", "rgb(73, 90, 128)", "rgb(242, 117, 63)"];

function colored(seed) {
	var thread = function(callback) {
		var x = 0;
		(function() {
			var st = +new Date();
			while (x < width) {
				//console.log(x);

				for (var y = 0; y < height; ++ y) {
					canvas.beginPath();
					var dis = distant(x, y, seed[0][0], seed[0][1]), col = 0;
					for (var i = 1; i < num_K; ++ i) {
						var new_dis = distant(x, y, seed[i][0], seed[i][1]);
						if (new_dis < dis) {
							dis = new_dis;
							col = i;
						}
					}
					canvas.strokeStyle = color[col];
					canvas.arc(x, y, 1 , 0, 2 * Math.PI);
					canvas.stroke();
					canvas.closePath();
				}

				++ x;
				if ((+new Date()) - st >= 100) {
					setTimeout(arguments.callee, 0);
					return;
				}
			}
			callback && callback();
		})();
	}(function () {
		paint(data);
	});
}

function distant(x1,y1,x2,y2) {
	var x3 = (x1 - x2); x3 = x3 * x3;
	var y3 = (y1 - y2); y3 = y3 * y3;
	return x3 + y3;
}