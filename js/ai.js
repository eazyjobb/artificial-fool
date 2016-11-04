// ai global var
var hash = new Array();
var ai_level = 2;
var player_turn = 1;
var com_turn = 0;
var inf = 0x3f3f3f3f;
// ai global var end

//-1 not finish
// 0 player1 win
// 1 palyer2 win
// 2 draw


function check_state(side) {
  for (var i = 1; i <= 2; ++ i) {
	if (side[1] == i && side[2] == i && side[3] == i) {if (i-1 == com_turn) return 1; else return -1; } //电脑赢估价最大
    if (side[4] == i && side[5] == i && side[6] == i) {if (i-1 == com_turn) return 1; else return -1; }
    if (side[7] == i && side[8] == i && side[9] == i) {if (i-1 == com_turn) return 1; else return -1; }
	                                                       
    if (side[1] == i && side[4] == i && side[7] == i) {if (i-1 == com_turn) return 1; else return -1; }
    if (side[2] == i && side[5] == i && side[8] == i) {if (i-1 == com_turn) return 1; else return -1; }
    if (side[3] == i && side[6] == i && side[9] == i) {if (i-1 == com_turn) return 1; else return -1; }
	                                                      
    if (side[1] == i && side[5] == i && side[9] == i) {if (i-1 == com_turn) return 1; else return -1; }
    if (side[3] == i && side[5] == i && side[7] == i) {if (i-1 == com_turn) return 1; else return -1; }
  }  
  for (var i = 1; i < 10; ++ i) if (side[i] == 0) return -inf; //不是最终态
  return 0;	//平局
}

// 0 player1 win
// 1 player2 win
// 2 draw

function min(a, b) { if (a<b) return a; else return b; }
function max(a, b) { if (a>b) return a; else return b; }

function dfs(state, player, alpha, beta) {
	var res = check_state(state);
	if (res != -inf) return res;
	for (var i = 1; i < 10; ++i) if (state[i] == 0) {
		state[i] = player + 1;
		var v = dfs(state, 1 - player, alpha, beta);
		state[i] = 0;
		
		if (player == com_turn) alpha = max(alpha, v);
		else beta = min(beta, v);
		
		if (beta <= alpha) break;
		
	}
	if (player == com_turn) return alpha;
	return beta;
}

function ai_control() {
	console.log(turn, com_turn, player_turn);
	
	if (turn != com_turn) return ;
	
	console.log('ai_control');
	
	if (ai_level == 1) { //级别1的AI，乱走一步
		for (var i = 1; i < 10; ++i) {
			if (typeof side[i] == 'undefined' || (typeof side[i] == 'number' && side[i] == 0)) {
				$("div.chess-box:eq(" + (i-1) + ")").trigger("click");
				break;
			}
		}	 
	}
	else {		//级别2AI，用alpha-beta剪枝进行搜索策略
		var t = 0, tt = 0;
		var state = new Array();
		for (var i = 0; i < 10; ++i) {
			state[i] = side[i];
			if (typeof state[i] == 'undefined') state[i] = 0;
		}
		for (var i = 1; i < 10; ++i) {
			var sel = -1;
			if (typeof state[i] == 'undefined' || (typeof state[i] == 'number' && state[i] == 0)) {
				tt = i;
				
				state[i] = com_turn + 1;
				var sw = dfs(state, player_turn, -inf, inf);
				state[i] = 0;
				
				if (sw == 1) { //能必胜直接退出
					t = i;
					break;
				}
				else if (sw == 0)	//不然保留一个平局态
					t = i;
			}
		}
		
		if (t == 0) t = tt;	//若必败，选第一步可行走
		$("div.chess-box:eq(" + (t-1) + ")").trigger("click");
	}
}





/*  下面注释部分为原来旧版的记忆化搜索。上方是alpha—beta剪枝部分



// ai global var
var hash = new Array();
var ai_level = 2;
var player_turn = 1;
var com_turn = 0;
var ai_strategy
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
	
	return res;
}

function ai_control() {
	if (turn != com_turn) return ;
	if (ai_level == 1) {
		for (var i = 1; i < 10; ++i) {
			console.log(i, ' ', side[i], ' ', typeof side[i]);
			if (typeof side[i] == 'undefined' || (typeof side[i] == 'number' && side[i] == 0)) {
				$("div.chess-box:eq(" + (i-1) + ")").trigger("click");
				break;
			}
		}	 
	}
	else {
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
				
				
				if (sw == com_turn) {
					t = i;
					break;
				}
				else if (sw == 2)
					t = i;
			}
		}
		
		if (t == 0) t = tt;
		$("div.chess-box:eq(" + (t-1) + ")").trigger("click");
	}
}

*/