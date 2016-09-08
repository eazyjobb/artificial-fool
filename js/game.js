var turn = 0;
var side = new Array();
var result = 0;

$(document).ready(function () {
  for (var i = 1; i <= 9; ++ i) { 
    var box = $("<div>").addClass("chess-box").addClass("col-md-4");
    box.attr("pos", i);
    $('.chess').append(box);
  }
  $('.chess-box').click(function() {
	if(result != 0) return;
    if($(this).hasClass('used'))
        return;

    var pos = $(this).attr('pos');

    if (turn == 0) {
      $(this).css({"background-color":"black"});
    } else {
      $(this).css({"background-color":"white"});
    }

    $(this).addClass('used');
    side[pos] = turn + 1;
    turn = 1 - turn;

    check();
   
    if (result != 0) {
      setTimeout(function () {
				 swal({
					  title:"PLAYER "+ result + " WIN!",
					  html:true,
					  confirmButtonColor: "#057748",
					  confirmButtonText: "Restart",
					  showCancelButton: false,
					  closeOnConfirm: true,
					  animation: "slide-from-top"
					  },function() {
					  })}
      ,500);
    }
  });
});

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
}
