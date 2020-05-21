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
var num_games
var level = 199

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

function user_move(game_num){
	log_data({"event_type": "your turn", "event_info" : {"bp" : bp.join(""), "wp": wp.join("")}})
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
			log_data({"event_type": "user win", "event_info" : {"bp" : bp.join(""), "wp": wp.join(""), "winning_pieces" : winning_pieces}})
			$('.headertext h1').text('Game over, you win').css('color', '#000000');
			end_game(game_num)
		}
		else if (check_draw()){
			log_data({"event_type": "draw", "event_info" : {"bp" : bp.join(""), "wp": wp.join("")}})
			$('.headertext h1').text('Game over, draw').css('color', '#000000');
			end_game(game_num)
		}
		else {
			make_opponent_move(game_num)
		}
	});
}

function make_opponent_move(game_num){
	log_data({"event_type": "waiting for opponent", "event_info" : {"bp" : bp.join(""), "wp": wp.join("")}})
	$('.headertext h1').text('Waiting for opponent').css('color', '#333333');
	setTimeout(function(){
		opponent_color = (user_color+1)%2
		seed = Date.now()
		tile_ind = makemove(seed,bp.join(""),wp.join(""),opponent_color,level);
		setTimeout(function(){
			log_data({"event_type": "opponent move", "event_info" : {"tile" : tile_ind, "bp" : bp.join(""), "wp": wp.join("")}})
			add_piece(tile_ind,opponent_color);
			show_last_move(tile_ind, opponent_color);
			winning_pieces = check_win(opponent_color)
			if(winning_pieces.length==N){
				log_data({"event_type": "opponent win", "event_info" : {"bp" : bp.join(""), "wp": wp.join(""), "winning_pieces" : winning_pieces}})
				show_win(opponent_color,winning_pieces)
				$('.headertext h1').text('Game over, you lose').css('color', '#000000');
				end_game(game_num)
			}
			else if (check_draw()){
				log_data({"event_type": "draw", "event_info" : {"bp" : bp.join(""), "wp": wp.join("")}})
				$('.headertext h1').text('Game over, draw').css('color', '#000000');
				end_game(game_num)
			}
			else {
				user_move(game_num)
			}
		},1000);
	},0)
}

function start_game(game_num){
	log_data({"event_type": "start game", "event_info" : {"game_num" : game_num}})
	create_board()
	if(user_color==0)
		user_move(game_num)
	else
		make_opponent_move(game_num)
}

function end_game(game_num){
	log_data({"event_type": "end game", "event_info" : {"game_num" : game_num}})
	$("#nextgamebutton").show().css({"display" :"inline"}).off("click").on("click",function(){
		$("#nextgamebutton").hide()
		user_color = (user_color+1)%2
		$(".canvas").empty();
		if(game_num<num_games-1)
			start_game(game_num+1)
		else 
			show_instructions(0,instructions_text_end,instructions_urls_end,function(){
				$('.headertext h1').text('');
				finish_experiment()
			},"Finish")
	})
}

function show_instructions(i,texts,urls,callback,start_text){
	log_data({"event_type": "show instructions", "event_info" : {"screen_number": i}})
	$('.overlayed').show();
	$('#instructions').show();
	$('#instructions p').remove();
	$('#instructions h4').after("<p>" + texts[i] + "</p>");
	if(urls[i]==""){
		$('#instructions img').hide()
	}
	else{
		$('#instructions img').show().attr("src",get_image_path(urls[i] + ".png"));
	}
	if(i==0){
		$('#previousbutton').hide()
	}
	else {
		$('#previousbutton').show().off("click").on("click",function(){
			show_instructions(i-1,texts,urls,callback,start_text);
		});
	}
	if(i == texts.length - 1 || i == urls.length - 1){
		$('#nextbutton').text(start_text)
		$('#nextbutton').off("click").on("click",function(){
			$('#instructions').hide();
			$('.overlayed').hide();
			callback();
		})
	}
	else {
		$('#nextbutton').text("Next")
		$('#nextbutton').off("click").on("click",function(){
			show_instructions(i+1,texts,urls,callback,start_text);
		});
	}
}

function enter_credentials(callback){
	$('.overlayed').show();
	$('#credentials').show();
	$( "#credentials_input [type=text]").bind("keydown", function( event ) {
		$( "#credentials_input [type=submit]").show()
	})
	$( "#credentials_input [type=submit]").off("click").on("click",function(){
		$('.overlayed').hide();
		$('#credentials').hide();
		user_credentials = $( "#credentials_input [type=text]").val()
		log_data({"event_type" : "credentials entered", "event_info" : {"credentials" : user_credentials}})
		callback()
	})
}

function initialize_task(_num_games,callback){
	num_games = _num_games
	user_color = 0
	instructions_text = ["You'll be playing 4-in-a-row.",
						 "Pretty exciting.",
						 "I think so too.",
						 "here's an image of a chess board"
						 ]

	instructions_urls = ["",
						 "",
						 "",
						 "instructions_chess"
						 ]
	instructions_text_end = ["That's all. Click finished to finish."]

	instructions_urls_end = [""]

	callback()
}

function start_experiment(){
	makemove = Module.cwrap('makemove', 'number', ['number','string','string','number','number'])
	$(document).on("contextmenu",function(e){
		e.preventDefault()
	})
	show_instructions(0,instructions_text,instructions_urls,function(){
		start_game(0)
	},"Start")
}

