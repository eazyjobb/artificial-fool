// ai global var
var hash = new Array();
var ai_level = 2;
var player_turn = 1;
var com_turn = 0;
var ai_strategy
// ai global var end
/*
$(document).ready(function () {
	console.log('ai init');
	
	var fun = chess_box_click;
	
	console.log(fun);
	
	function for_switch_ai_control() {
		console.log('swith success');
		ai_control();
		fun();
	}
	
	chess_box_click = for_switch_ai_control;
	
	console.log(chess_box_click);
	console.log(fun);
	
	ai_control();
	
	console.log('ai init end');
	
	var fun2 = restart;
	
  for (var i = 1; i <= 9; ++ i) { 
    var box = $("<div>").addClass("chess-box");
    box.attr("pos", i);
    $('.chess').append(box);
  }

  $('.chess-box').click(chess_box_click);
  set_turn_info();
  ai_control();
  
  
   var f = .click
   function l() {
     f();
	 awddfsaf
   }	   
   click = l;
  
});
*/

//////////////////////////

function get_key(state) {
	var t = 0;
	for (var i = 1; i < 10; ++i) {
		t *= 3;
		if (typeof state[i] == 'undefined') ;
		else {
			t += state[i];
		}
	}
	return t;
}

function get_hash(state) {
	var t = get_key(state);
	if (typeof hash[t] == 'undefined') return -1;
	return hash[t];
}

function add_hash(state, val) {
	hash[get_key(state)] = val;
}


//-1 not finish
// 0 player1 win
// 1 palyer2 win
// 2 draw


function check_state(side) {
  for (var i = 1; i <= 2; ++ i) {
    if (side[1] == i && side[2] == i && side[3] == i) return i-1;
    if (side[4] == i && side[5] == i && side[6] == i) return i-1;
    if (side[7] == i && side[8] == i && side[9] == i) return i-1;
	
    if (side[1] == i && side[4] == i && side[7] == i) return i-1;
    if (side[2] == i && side[5] == i && side[8] == i) return i-1;
    if (side[3] == i && side[6] == i && side[9] == i) return i-1;
	
    if (side[1] == i && side[5] == i && side[9] == i) return i-1;
    if (side[3] == i && side[5] == i && side[7] == i) return i-1;
  }
  var cnt = 9;
  for (var i = 1; i < 10; ++i) {
	  if (1 === side[i] || 2 === side[i]) --cnt;
  }
  if (cnt == 0) {
	  return 2;
  }
  return -1;
}

// 0 player1 win
// 1 player2 win
// 2 draw

function dfs(state, who, dep) {
	var res = -1;
	if (get_hash(state) != -1) return get_hash(state);
	
	//console.log(state, ' ', who, check(state));
	var sw = check_state(state);
	if (sw == 2) res = 2;
	else if (sw == -1) {
		var sel;
		var can_draw = false;
		for (var i = 1; i < 10; ++i) {
			if (typeof state[i] == 'undefined' || (typeof state[i] == 'number' && state[i] == 0)) {
				state[i] = who + 1;
				var sw = dfs(state, 1 - who, dep + 1);
				state[i] = 0;
				if (sw == who) {
					sel = i;
					res = who;
					break;
				}
				if (sw == 2) can_draw = true;
			}
		}
	}
	else {
		res = sw;
	}
	
	if (res == -1) {
		if (can_draw) res = 2;
		else res = 1 - who;
	}
	
	add_hash(state, res);
	
	//console.log(state, ' ', res, ' ', who, ' ', sel);
	
	return res;
}

function ai_control() {
	if (turn != com_turn) return ;
	//console.log('ai_control');	
	if (ai_level == 1) {
		for (var i = 1; i < 10; ++i) {
			console.log(i, ' ', side[i], ' ', typeof side[i]);
			if (typeof side[i] == 'undefined' || (typeof side[i] == 'number' && side[i] == 0)) {
				console.log('ai_level 1  ', i, ' ', $(".chess-box").html());
				$("div.chess-box:eq(" + (i-1) + ")").trigger("click");
				break;
			}
		}	 
	}
	else {
		//console.log('init');
		var t = 0, tt = 0;
		var state = new Array();
		for (var i = 0; i < 10; ++i) state[i] = side[i];
		for (var i = 1; i < 10; ++i) {
			var sel = -1;
			if (typeof state[i] == 'undefined' || (typeof state[i] == 'number' && state[i] == 0)) {
				tt = i;
				state[i] = com_turn + 1;
				var sw = dfs(state, player_turn, com_turn);
				state[i] = 0;
				
				//console.log("sel: ", i, ' ', "sw: ", sw, ' ', com_turn);
				
				if (sw == com_turn) {
					t = i;
					break;
				}
				else if (sw == 2)
					t = i;
			}
		}
		
		if (t == 0) t = tt;
		//console.log(tt);
		//console.log('final select  ', t);  ////fuck
		//if (t > 0) 
		$("div.chess-box:eq(" + (t-1) + ")").trigger("click");
		//else 
		//	$("div.chess-box:eq(" + (t-1) + ")").trigger("click");
	}
}