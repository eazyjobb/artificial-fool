$(document).ready(function () {
	$('#calculate').click(function () {
		//var data_set_name = $('input[name=data-selection]').val();
		var gene_size = $('input[name=size-selection]').val();
		var iters = $('input[name=iter-selection]').val();

		if (/*('' === data_set_name) || */('' === gene_size) || ('' === iters)) {
			swal({
				title:"Please, fill the blank first",
				html:true,
				confirmButtonColor: "#057748",
				confirmButtonText: "Ok, I got it",
				closeOnConfirm: true,
				animation: "slide-from-top"
			});
			return;
		}

		ui_init();

		calculation(/*parseInt(data_set_name), */0, parseInt(gene_size), parseInt(iters), undefined);

		/*
		swal({
				title:"Calculation finished",
				html:true,
				confirmButtonColor: "#057748",
				confirmButtonText: "See the result",
				closeOnConfirm: true,
				animation: "slide-from-top"
		});
		*/

	});

	down = $.plot("#res-down", []);
});

function ui_init() {
	$('#dimmer').show();

	$('#best-ans > thead > tr').html('');
	$('#ans > thead > tr').html('');
	
	$('#best-ans > thead > tr').append($('<th>').html('iter'));
	$('#ans > thead > tr').append($('<th>').html('iter'))

	for (var i = 0; i < vec_size; ++ i) {
		$('#best-ans > thead > tr').append($('<th>').html('x' + i));
		$('#ans > thead > tr').append($('<th>').html('x' + i));
	}
	
	$('#best-ans > thead > tr').append($('<th>').html('val'));
	$('#ans > thead > tr').append($('<th>').html('val'));

	$('#best-ans > tbody > tr').html('');
	$('#ans > tbody > tr').html('');
}

function pump_data_to_ui(res) {
	if (res != undefined) {

		new_f = f(res);

		if (best_ans === undefined || new_f < best_ans_f) {
			best_ans = res;
			best_ans_f = new_f;
			best_ans_iter = cur_iter;
			refresh_best_ans();
			refresh_ans_iter();
		}
	}

	refresh_result();
}

function refresh_ans_iter() {
	var tr = $('<tr>');
	var fi = $('<th>').html(best_ans_iter);
	var la = $('<th>').html(best_ans_f.toExponential(5));
	tr.append(fi);
	for (var i = 0; i < vec_size; ++ i) {
		var vec = $('<th>').html(best_ans[i].toExponential(5));
		tr.append(vec);
	}
	tr.append(la);
	$('#ans > tbody').append(tr);
}

function refresh_best_ans() {
	$('#best-ans > tbody > tr').html('');

	var fi = $('<th>').html(best_ans_iter);
	var la = $('<th>').html(best_ans_f.toExponential(5));
	$('#best-ans > tbody > tr').append(fi);
	for (var i = 0; i < vec_size; ++ i) {
		var vec = $('<th>').html(best_ans[i].toExponential(5));
		$('#best-ans > tbody > tr').append(vec);
	}
	$('#best-ans > tbody > tr').append(la);
}

function refresh_result() {
	history_bests.push([cur_iter, best_ans_f]);
	down.setData([history_bests]);
	down.setupGrid();
	down.draw();
}
