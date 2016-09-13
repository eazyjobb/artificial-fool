var turn = 0;
var side = new Array();
var result = 0;

$(document).ready(function () {
  for (var i = 1; i <= 9; ++ i) { 
    var box = $("<div>").addClass("chess-box");
    box.attr("pos", i);
    $('.chess').append(box);
  }

  $('.chess-box').click(chess_box_click);
  set_turn_info();
  
  ai_control();

  setTimeout(function () {
    swal({
	  title:"Welcome",
	  html:true,
	  confirmButtonColor: "#057748",
	  confirmButtonText: "Play As P2",
	  showCancelButton: true,
	  cancelButtonText: "Play As P1",
	  cancelButtonColor: "#057748",
	  closeOnConfirm: true,
	  animation: "slide-from-top"
	  },function(ret) {
	    if (ret) {
   		  console.log("p2");
	      com_turn = 0;
		  player_turn = 1;
		} else {
		  console.log("p1");
		  player_turn = 0;
		  com_turn = 1;
		}
		restart();
	  })
  }, 100);
});

function chess_box_click() {
  if(result != 0) return;
  if($(this).hasClass('used'))
      return;

  var pos = $(this).attr('pos');

  var icon;

  if (turn == 0)
    icon = $('<span>').addClass('glyphicon').addClass('glyphicon-remove').addClass('player1');
  else
    icon = $('<span>').addClass('glyphicon').addClass('glyphicon-record').addClass('player2');

  $(this).append(icon);
  $(this).addClass('used');
  side[pos] = turn + 1;
  turn = 1 - turn;
  set_turn_info();

  check();

  if (result != 0) {
    var str = "PLAYER "+ result + " WIN!";
    if (result == -1)
      str = "DRAW";
    setTimeout(function () {
      swal({
        title:str,
        html:true,
        confirmButtonColor: "#057748",
        confirmButtonText: "Play As P2",
        showCancelButton: true,
        cancelButtonText: "Play As P1",
        cancelButtonColor: "#057748",
        closeOnConfirm: true,
        animation: "slide-from-top"
        },function(ret) {
		   if (ret) {
   		     console.log("p2");
		     com_turn = 0;
		     player_turn = 1;
		   } else {
		     console.log("p1");
  		     player_turn = 0;
		     com_turn = 1;
		   }
		   restart();
        })
    }, 100);
  }
  
  ai_control();
}

function restart() {
  $('.chess-box').remove();
  for (var i = 1; i <= 9; ++ i) {
    side[i] = 0;
    var box = $("<div>").addClass("chess-box");
    box.attr("pos", i);
    $('.chess').append(box);
  }
  $('.chess-box').click(chess_box_click);

  result = 0;
  turn = 0;
  set_turn_info();
  
  ai_control();
}

function check() {
  for (var i = 1; i <= 2; ++ i) {
    if (side[1] == i && side[2] == i && side[3] == i) { result = i; return ; }   
    if (side[4] == i && side[5] == i && side[6] == i) { result = i; return ; }   
    if (side[7] == i && side[8] == i && side[9] == i) { result = i; return ; }   
    if (side[1] == i && side[4] == i && side[7] == i) { result = i; return ; }   
    if (side[2] == i && side[5] == i && side[8] == i) { result = i; return ; }   
    if (side[3] == i && side[6] == i && side[9] == i) { result = i; return ; }   
    if (side[1] == i && side[5] == i && side[9] == i) { result = i; return ; }   
    if (side[3] == i && side[5] == i && side[7] == i) { result = i; return ; }   
  }
  if ($('.used').length >= 9)
    result = -1;
}

function set_turn_info() {
  $('.turn-info > div').remove();
  var info = $('<div>');
  var info_p = $('<p>').html('TURN FOR PLAYER' + (turn + 1));
  var icon;
  if (turn == 0)
    icon = $('<span>').addClass('glyphicon').addClass('glyphicon-remove').addClass('player1');
  else
    icon = $('<span>').addClass('glyphicon').addClass('glyphicon-record').addClass('player2');
  info.append(info_p).append(icon);
  $('.turn-info').append(info);
}