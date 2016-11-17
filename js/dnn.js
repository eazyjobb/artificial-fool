var graph;

var layer_size = 7;
var node_size = [3, 7, 5, 8, 6, 7, 5];
var node_pos = [];
var lines = [];

var chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(231,233,237)'
};

var config = {
	type: 'line',
	data: {
		labels: [],
		datasets: []
	},
	options: {
		responsive: true,
		title:{display: false,},
		tooltips: false,
		legend: {display: false},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Layers'
				},
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Nodes'
				},
				ticks: {
					display: false,
					min: 0,
					max: 9
				},
			}]
		}
	}
};

$(document).ready(function () {
	var ctx = $('#canvas');

	config.data.labels.push("Input Layer");
	for (var i = 1; i < layer_size - 1; ++ i) {
		config.data.labels.push("Hidden Layer " + i);
	}
	config.data.labels.push("Output Layer");

	for (var i = 0; i < 8; ++ i)
		lines.push([]);

	for (var i = 0; i < layer_size; ++ i) {
		node_pos.push([]);

		var l = Math.floor((8 - node_size[i]) / 2) + 1;
		var r = l + node_size[i];

		for (var j = l; j < r; ++ j)
			node_pos[i].push(j);

		for (var j = 0; j < 8; ++ j)
			if (l <= j + 1 && j + 1 < r)
				lines[j].push(j + 1);
			else
				lines[j].push(NaN);
	}
	
	console.log(node_pos);
	console.log(lines);

	for (var i = 0; i < 8; ++ i) {
		config.data.datasets.push({
			lineTension: 0,
			showLine: false,
			backgroundColor: chartColors.red,
			pointRadius: 3,
			pointHoverRadius: 3,
			pointStyle: 'circle',
			data: lines[i],
			fill: false
		});
	}

	graph = new Chart(ctx, config);
});

function random_chunk() {
	var networks = [];
	for (var j = 1; j < layer_size; ++ j) {
		var i = j - 1;
		networks.push([]);
		for (var x = 0; x < node_size[i]; ++ x) {
			networks[i].push([]);
			for (var y = 0; y < node_size[j]; ++ y)
				networks[i][x].push(Math.random());
		}
	}
	return networks;
}

function redraw(networks) {
	while (config.data.datasets.length > 8)
		config.data.datasets.pop();
	graph.update();
}
