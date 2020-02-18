var b,bp,wp,user_color,m
var tiles = [];
var game_status = "ready"
//game_status = "ready";
//move_index = 0;
//last_move = 99;
var M=9,N=4
var win_color = "#22ddaa",
	square_color = "#999999",
	highlight_color = "#bbbbbb";
var data_log =[]

function create_board() {
	bp = new Array(M*N).fill(0)
	wp = new Array(M*N).fill(0)
	$(".canvas").empty();
	for (var i=0; i<N; i++) {
		for(var j=0; j<M; j++) {
			$(".canvas").append($("<div>", {"class" : "tile", "id": "tile_" + (i*M + j).toString()}))
		}
		$(".canvas").append("<br>");
	}
}

function add_piece(i, color) {
	if(color == 0) {//BLACK
		$("#tile_" + i.toString()).append(
			$("<div>",{"class" : "blackPiece"})
		).removeClass("tile").addClass("usedTile").off('mouseenter').off('mouseleave').css("backgroundColor", square_color);
		bp[i] = 1;
	} else {
		$("#tile_" + i.toString()).append(
			$("<div>",{"class" : "whitePiece"})
		).removeClass("tile").addClass("usedTile").off('mouseenter').off('mouseleave').css("backgroundColor", square_color);
		wp[i] = 1;
	}
}

function remove_piece(i){
	$("#tile_" + i.toString()).empty().removeClass("usedTile").addClass("tile").off().css("backgroundColor", square_color);
	bp[i]=0
	wp[i]=0
}


function show_last_move(i, color) {
	if(color == 0) {//BLACK
		$(".blackShadow").remove();
		$("#tile_" + i.toString()).append($("<div>" , {"class" : "blackShadow"}))
	} else {
		$(".whiteShadow").remove();
		$("#tile_" + i.toString()).append($("<div>" , {"class" : "whiteShadow"}))
	}
}

function check_win(color){
	fourinarows = [[ 0,  9, 18, 27],
				   [ 1, 10, 19, 28],
				   [ 2, 11, 20, 29],
				   [ 3, 12, 21, 30],
				   [ 4, 13, 22, 31],
				   [ 5, 14, 23, 32],
				   [ 6, 15, 24, 33],
				   [ 7, 16, 25, 34],
				   [ 8, 17, 26, 35],
				   [ 0, 10, 20, 30],
				   [ 1, 11, 21, 31],
				   [ 2, 12, 22, 32],
				   [ 3, 13, 23, 33],
				   [ 4, 14, 24, 34],
				   [ 5, 15, 25, 35],
				   [ 3, 11, 19, 27],
				   [ 4, 12, 20, 28],
				   [ 5, 13, 21, 29],
				   [ 6, 14, 22, 30],
				   [ 7, 15, 23, 31],
				   [ 8, 16, 24, 32],
				   [ 0,  1,  2,  3],
				   [ 1,  2,  3,  4],
				   [ 2,  3,  4,  5],
				   [ 3,  4,  5,  6],
				   [ 4,  5,  6,  7],
				   [ 5,  6,  7,  8],
				   [ 9, 10, 11, 12],
				   [10, 11, 12, 13],
				   [11, 12, 13, 14],
				   [12, 13, 14, 15],
				   [13, 14, 15, 16],
				   [14, 15, 16, 17],
				   [18, 19, 20, 21],
				   [19, 20, 21, 22],
				   [20, 21, 22, 23],
				   [21, 22, 23, 24],
				   [22, 23, 24, 25],
				   [23, 24, 25, 26],
				   [27, 28, 29, 30],
				   [28, 29, 30, 31],
				   [29, 30, 31, 32],
				   [30, 31, 32, 33],
				   [31, 32, 33, 34],
				   [32, 33, 34, 35]]
	
	for(var i=0;i<fourinarows.length;i++){
		var n = 0;
		for(var j=0;j<N;j++){
			if(color==0)//BLACK
				n+=bp[fourinarows[i][j]]
			else
				n+=wp[fourinarows[i][j]]
		}
		if(n==N)
			return fourinarows[i]
	}
	return []
}

function check_draw(){
	for(var i=0; i<M*N; i++)
		if(bp[i]==0 && wp[i]==0)
			return false;
	return true;
}

function show_win(color, pieces) {
	for(i=0; i<pieces.length; i++){
		if(color==0)
			$("#tile_" + pieces[i] + " .blackPiece").animate({"backgroundColor": win_color}, 250)
		else
			$("#tile_" + pieces[i] + " .whitePiece").animate({"backgroundColor": win_color}, 250)
	}
}

function user_move(){
	$('.headertext h1').text('Your turn').css('color', '#000000');
	$('.canvas, .tile').css('cursor', 'pointer');
	$('.usedTile, .usedTile div').css('cursor', 'default');
	$('.tile').off().on('mouseenter', function(e){ 
		$(e.target).animate({"background-color":highlight_color}, 50)
	}).on('mouseleave', function(e){ 
		$(e.target).animate({"background-color": square_color}, 50)
	});
	$('.tile').off('click').on('click', function(e){
		$('.tile').off('mouseenter').off('mouseleave').off('click');
		$('.canvas, .canvas div').css('cursor', 'default');
		tile_ind = parseInt(e.target.id.replace("tile_", ""));
		log_data({"event_type": "user move", "event_info" : {"tile" : tile_ind, "bp" : bp.join(""), "wp": wp.join("")}})
		add_piece(tile_ind,user_color);
		show_last_move(tile_ind, user_color);
		winning_pieces = check_win(user_color)
		if(winning_pieces.length==N){
			show_win(user_color,winning_pieces)
			$('.headertext h1').text('Game over, you win').css('color', '#000000');
			end_game()
		}
		else if (check_draw()){
			$('.headertext h1').text('Game over, draw').css('color', '#000000');
			end_game()
		}
		else {
			make_opponent_move()
		}
	});
}

function make_opponent_move(){
	$('.headertext h1').text('Waiting for opponent').css('color', '#333333');
	setTimeout(function(){
		opponent_color = (user_color+1)%2
		seed = Date.now()
		tile_ind = makemove(seed,bp.join(""),wp.join(""),opponent_color);
		setTimeout(function(){
			log_data({"event_type": "opponent move", "event_info" : {"tile" : tile_ind, "bp" : bp.join(""), "wp": wp.join("")}})
			add_piece(tile_ind,opponent_color);
			show_last_move(tile_ind, opponent_color);
			//duration = move_end - move_start;
			winning_pieces = check_win(opponent_color)
			if(winning_pieces.length==N){
				log_data({"event_type": "opponent win", "event_info" : {"winning_pieces" : winning_pieces}})
				show_win(opponent_color,winning_pieces)
				$('.headertext h1').text('Game over, you lose').css('color', '#000000');
				end_game()
			}
			else if (check_draw()){
				log_data({"event_type": "draw", "event_info" : {}})
				$('.headertext h1').text('Game over, draw').css('color', '#000000');
				end_game()
			}
			else {
				user_move()
			}
		},1000);
	},0)
}

function enter_credentials(){
	$('.overlayed').show();
	$('#credentials').show();
	$( "#credentials_input [type=text]").bind("keydown", function( event ) {
		$( "#credentials_input [type=submit]").show()
	})
	$( "#credentials_input [type=submit]").off("click").on("click",function(){
		$('.overlayed').hide();
		$('#credentials').hide();
		credentials = $( "#credentials_input [type=text]").val()
		log_data({"event_type" : "credentials entered", "event_info" : {"credentials" : credentials}})
		start_game()
	})
}

function start_game(){
	log_data({"event_type": "start game", "event_info" : {}})
	create_board()
	if(user_color==0)
		user_move()
	else
		make_opponent_move()
}


function end_game(){
	log_data({"event_type": "end game", "event_info" : {}})
	$("#nextgamebutton").show().off("click").on("click",function(){
		$("#nextgamebutton").hide()
		user_color = (user_color+1)%2
		$(".canvas").empty();
		start_game()
	})
}

function finish_experiment(){
	save(data_log,"fourinarow_data_" + credentials + ".json")	
}

function save(data,filename){
	var blob = new Blob([JSON.stringify(data)], {type: 'text/csv'});
	var elem = window.document.createElement('a');
	elem.href = window.URL.createObjectURL(blob);
	elem.download = filename;        
	document.body.appendChild(elem);
	elem.click();
	document.body.removeChild(elem);
}

function log_data(data){
	data["event_time"] = Date.now()
	data["credentials"] = credentials
	console.log(data)
	data_log.push(data)
}
		
$(document).ready(function(){
	makemove = Module.cwrap('makemove', 'number', ['number','string','string','number'])
	user_color = 0
	enter_credentials()
	$(window).unload(finish_experiment)
});

