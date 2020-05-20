//var imgs = ["puppy.jpg", "turtle.jpg", "jag.jpg", "duckling.jpg", "volcano.jpg","lightning.jpg","castle.jpg","waterfall.jpg",
//			  "sunset.jpg","barn.jpg","coffee.jpg","owl.jpg","wall.jpg","space_shuttle.jpg","lego.jpg","cat.jpg","banana.jpg","sushi.jpg",
//			  "ramen.jpg","porkbuns.jpg","panda.jpg","dragonfruit.jpg","moon.jpg","goldengate.jpg","chess.jpg","monet.jpg","dali.jpg"];

var imgs = ["acorn.jpg", "axe.jpg", "barbecue.jpg", "beach.jpg", "berries.jpg", "bike.jpg", "books.jpg", "bowling.jpg", "bread.jpg", "bridge.jpg", "butterfly.jpg", "cables.jpg", "camera.jpg", "candle.jpg", "cards.jpg", "castle.jpg", "cat.jpg", "chess.jpg", "cliffs.jpg", "clock.jpg", "coffee.jpg", "compass.jpg", "couch.jpg", "cupcake.jpg", "diamond.jpg", "dice.jpg", "dog.jpg", "ducklings.jpg", "eiffel.jpg", "envelope.jpg", "faucet.jpg", "field.jpg", "fire.jpg", "fireworks.jpg", "fish.jpg", "flowers.jpg", "forest.jpg", "fox.jpg", "goat.jpg", "guitar.jpg", "hammer.jpg", "headphones.jpg", "helicopter.jpg", "honey.jpg", "house.jpg", "icetea.jpg", "keys.jpg", "ladybug.jpg", "lamp.jpg", "laptop.jpg", "lighthouse.jpg", "money.jpg", "moon.jpg", "mountain.jpg", "oil.jpg", "paintbrush.jpg", "parachute.jpg", "parrot.jpg", "pen.jpg", "perfume.jpg", "piano.jpg", "pinecone.jpg", "plane.jpg", "puffin.jpg", "racecar.jpg", "road.jpg", "roadsign.jpg", "rooster.jpg", "salad.jpg", "scissors.jpg", "screws.jpg", "sculpture.jpg", "shaving.jpg", "ship.jpg", "skiing.jpg", "soccerball.jpg", "spaceshuttle.jpg", "spices.jpg", "sprouts.jpg", "stairs.jpg", "stapler.jpg", "starfish.jpg", "statue.jpg", "swan.jpg", "table.jpg", "taxi.jpg", "teddybear.jpg", "tomatoes.jpg", "toothpaste.jpg", "towels.jpg", "tulips.jpg", "turtle.jpg", "typewriter.jpg", "watch.jpg", "waterfall.jpg", "zebras.jpg"]

var image_array

//"deer.jpg", "guitar.jpg",
			  
var num_main_trials, num_practice_trials_nonumbers, num_practice_trials_numbers, num_practice_trials
var instructions_text
var instructions_urls
var instructions_text_during_practice
var instructions_urls_during_practice
var instructions_text_after_practice
var instructions_urls_after_practice	
var instructions_text_after_advice
var instructions_urls_after_advice
var instructions_text_before_demonstration
var instructions_urls_before_demonstration
var instructions_text_pass_quiz
var instructions_urls_pass_quiz
var instructions_text_fail_quiz
var instructions_urls_fail_quiz
var num_imgs
var selected_color = "#f03b20"
var unselected_color = "#000000"
var suggest_color = "#0000ff"
var data_log = []
var selected, num_swaps, inherited_advice
var receive_advice_text
var enter_advice_text
var show_practice_scores_text
var show_main_scores_text
var select_advice_text
var score_text = []
var suggestion = undefined
var highlight_optimal = false
var optimal_solution = optimal_solutions[0]
var advice_mode
var selection_mode
var memory_assist
var memory_bank = []
var bonus
var quiz_content
var max_selections = 2

function shuffle(array){
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex){
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -= 1;
	temporaryValue = array[currentIndex];
	array[currentIndex] = array[randomIndex];
	array[randomIndex] = temporaryValue;
  }
  return array;
}

function swap_ranks(i,j){
	[rank[i],rank[j]]=[rank[j],rank[i]]
}

function swap_imgs(img1,img2){
	var temp_left = img1.css("left")
	var temp_id = img1.attr("id")
	img1.css("left",img2.css("left"))
	img1.attr("id",img2.attr("id"))
	img2.css("left",temp_left)
	img2.attr("id",temp_id)
}

function show_suggestion(){
	if(suggestion!==undefined){
		if(suggestion=="done"){
			$("#finishedbutton").css({"border-color" : suggest_color})
		}
		else{
			$(".task_img#" + suggestion[0][0]).css({"border-color" : suggest_color})
			$(".task_img#" + suggestion[0][1]).css({"border-color" : suggest_color})
		}
	}
}

function on_img_hover(img,mode,show_numbers){
	log_data({"event_type": "hover", "event_info": {"index" : img.attr('id'), "mode" : mode}})
	if(show_numbers){
		if (mode == "on"){
			img.find(".transbox").css({"opacity" : 0.35})
		}
		else {
			img.find(".transbox").css({"opacity" : 0.25})
		}
	}
	else {
		if (mode == "on"){
			img.find(".transbox").css({"opacity" : 0.1})
		}
		else {
			img.find(".transbox").css({"opacity" : 0})
		}
	}
	if(memory_assist){
		img = $("#" + $(".task_img").index(img) + ".memory_img")
		if (mode == "on"){
			img.find(".memory_transbox").css({"opacity" : 0.1})
		}
		else {
			img.find(".memory_transbox").css({"opacity" : 0})
		}
	}
}

function add_memory(img1,img2){
	if(parseInt(img2.attr("id")) > parseInt(img1.attr("id"))){
		add_to_bank(img1,img2)
	}
	else{
		add_to_bank(img2,img1)
	}
}

function find_in_bank(l){
	for(var k=0;k<memory_bank.length;k++){
		if(memory_bank[k][0]==l[0] && memory_bank[k][1]==l[1])
			return k;
	}
	return -1;
}

function update_memory_bank_size(s){
	if(memory_bank.length>13){
		s="5vh";
	}
	else if(memory_bank.length>11){
		s="6vh";
	}
	else if(memory_bank.length>10){
		s="7vh";
	}
	else if(memory_bank.length>9){
		s="8vh";
	}
	else if(memory_bank.length>8){
		s="9vh";
	}
	else{
		s="10vh";
	}
	$("#memoryassistpane p span").css("line-height",s)
	$(".memory_img").css({
		"height":s,
		"width":s,
	})
	$(".memory_transbox").css({
		"height":s,
		"width":s,
	})
}

function add_to_bank(img1,img2){
	i = $(".task_img").index(img1)
	j = $(".task_img").index(img2)
	k = find_in_bank([i,j])
	if(k>=0){
		$("#memoryassistpane p:eq(" + k + ")").addClass("highlighted")
		setTimeout(function(){
			$("#memoryassistpane p:eq(" + k + ")").removeClass("highlighted")
		},0)
	}
	else{
		memory_bank.push([i,j])
		$("#memoryassistpane").append(
			$("<p />").append(
				$("<div />", {
					class: "memory_img",
					"id" : $(".task_img").index(img1)
				}).css({
					"background-image" : img1.css("background-image")
				}).append("<div class = 'memory_transbox'></div>")
			).append(
				$("<span></span>")
			).append(
				$("<div />", {
					class: "memory_img",
					"id" : $(".task_img").index(img2)
				}).css({
					"background-image" : img2.css("background-image")
				}).append("<div class = 'memory_transbox'></div>")
			)
		)
		update_memory_bank_size()
	}
}

function try_swap(img,show_numbers){
	selected.css("border-color" , unselected_color)
	img.css("border-color" , unselected_color)
	$('.memory_img').css("border-color" , unselected_color)
	var i_selected = parseInt(selected.attr("id"))
	var i_img = parseInt(img.attr("id"))
	var followed_suggestion = suggestion !==undefined && ((i_img == suggestion[0][0] && i_selected == suggestion[0][1]) || 
						  (i_img == suggestion[0][1] && i_selected == suggestion[0][0]))
	if(!followed_suggestion){
		suggestion = undefined
	}
	if((rank[i_img] > rank[i_selected]) != (i_img > i_selected)){
		swap_imgs(img,selected)
		swap_ranks(i_img, i_selected)
		if(show_numbers){
			show_image_numbers(0.25)
		}
		if(followed_suggestion){
			suggestion = suggestion[1]['True']
		}
		log_data({"event_type": "swap", "event_info": {"indices" : [i_selected, i_img], "success": true}})
	}
	else {
		if(followed_suggestion){
			suggestion = suggestion[1]['False']
		}
		log_data({"event_type": "swap", "event_info": {"indices" : [i_selected, i_img], "success": false}})
	}
	if(i_img != i_selected){
		if(memory_assist){
			add_memory(img,selected)
		}	
		num_swaps++;
	}
	selected = undefined
	if(highlight_optimal){
		show_suggestion()
	}
	$('.task_img').mousedown(function(){
		on_img_mousedown($(this));
	}).mouseup(function(){
		on_img_mouseup($(this),show_numbers);
	})
}

function on_img_mousedown(img){
	log_data({"event_type": "mousedown", "event_info": {"index" : img.attr('id')}})
	img.css("border-color" , selected_color)
	i = $("#" + $(".task_img").index(img) + ".memory_img").css("border-color" , selected_color)
}

function on_img_mouseup(img){
	log_data({"event_type": "mouseup", "event_info": {"index" : img.attr('id')}})
	if(selected === undefined){
		selected = img
	}
	else if (selected === img){
		selected = undefined
		img.css("border-color" , unselected_color)
	}
	else{
		$('.task_img').off("mousedown").off("mouseup")
		setTimeout(function(){
			try_swap(img)
		},150)
	}
}

function create_imgs(show_numbers){
	for(i = 0; i < num_imgs; i++){
		left = memory_assist?(80*(i+0.5)/num_imgs-6):(100*(i+0.5)/num_imgs-6)
		$("<div />", {
			class: "task_img",
			id: i.toString(),
		}).mousedown(function(){
			on_img_mousedown($(this));
		}).mouseup(function(){
			on_img_mouseup($(this),show_numbers);	
		}).hover(function(){
			on_img_hover($(this),"on",show_numbers);
		},function(){
			on_img_hover($(this),"off",show_numbers);
		}).css({
			"background-image" : "url('" + get_image_path(task_imgs[i]) + "')",
			"left" : left.toString() + "vw",
			"top" : "30vh"
		}).append("<div class = 'transbox'></div><p></p>").appendTo("#listsortingpane").show();
	}
	if(show_numbers){
		show_image_numbers(0.25)
	}
	if(highlight_optimal){
		show_suggestion()
	}
}

function show_image_numbers(opacity){
	for(i = 0; i < num_imgs; i++){
		$(".task_img#" + i.toString() + " .transbox").off("mouseenter").off("mouseleave").css("opacity",opacity)
		$(".task_img#" + i.toString() + " p").text(rank[i].toString())
	}
}

function is_sorted(arr){
	var sorted = true
	for(i = 0; i < num_imgs-1; i++){
		if(rank[i+1]<rank[i]){
			sorted=false;
		}
	}
	return sorted
}

function check_finished(trial_num){
	var sorted = is_sorted(rank)
	show_image_numbers(0.5);
	$("#finishedbutton").hide().off("click")
	var feedbacktext = (sorted ? "Correct" : "Incorrect") + ", " + num_swaps.toString() + " comparison" + (num_swaps!=1? "s":"")
	bonus = bonus + (sorted?1.25*(0.8*Math.min(10/Math.max(num_swaps,1),1)**2+0.2):0)/(num_main_trials+1)
	if(trial_num<num_practice_trials){
		score_text.push("Trial " + (trial_num + 1) + ": " + feedbacktext)
		$("#feedback p").text(feedbacktext)
	}
	else {
		score_text.push("Trial " + (trial_num - num_practice_trials +1) + ": "  + feedbacktext)
		$("#feedback p").text(feedbacktext + ", Bonus so far: $" + bonus.toFixed(2))
	}
	log_data({"event_type": "finished", "event_info": {"correct": sorted, "num_swaps": num_swaps, "is_practice" : trial_num < num_practice_trials, "trial_num" : trial_num}})
	$("#feedback").show()
	$(".task_img").off("mousedown").off("mouseup").off("mouseenter").off("mouseleave")
	$("#nexttrialbutton").show()
}

function do_trial(trial_num,show_numbers){
	log_data({"event_type": "do_trial", "event_info" : {"trial_num" : trial_num}})
	num_swaps = 0
	selected = undefined
	suggestion = optimal_solution
	if(trial_num<num_practice_trials){
		task_imgs = shuffled_imgs.slice(trial_num*num_imgs,(trial_num+1)*num_imgs);		
	}
	else{
		task_imgs = shuffled_imgs.slice((trial_num+max_selections)*num_imgs,(trial_num+max_selections+1)*num_imgs);	
	}
	rank = []
	for(i =0; i<num_imgs; i++){
		rank.push(i+1);
	}
	rank = shuffle(rank)
	//rank = [3,6,4,1,5,2]//TODO: delete this
	log_data({"event_type": "shuffle", "event_info" : {"rank" : rank.slice(), "img_urls" : task_imgs, "trial_num" : trial_num}})
	create_imgs(show_numbers)
	$("#finishedbutton").css({"border-color" : "#666666"}).show().on("click",function(){
		check_finished(trial_num)
	});
	$("#memoryassistpane").show()
	$("#nexttrialbutton").on("click",function(){
		$('.task_img').remove()
		$("#nexttrialbutton").hide().off("click")
		$("#feedback").hide()
		if(memory_assist){
			memory_bank=[]
			$("#memoryassistpane").hide()
			$("#memoryassistpane p").remove()
		}
		if (trial_num == num_practice_trials_numbers - 1){
			show_instructions(0,instructions_text_during_practice,instructions_urls_during_practice,function(){
				do_trial(trial_num + 1, false)
			},"Continue")
		}
		else if(trial_num == num_practice_trials -1){
			show_scores(true)
		}
		else if(trial_num == num_practice_trials + num_main_trials -1){
			show_scores(false)
		}
		else if(trial_num == num_practice_trials + num_main_trials){
			finish_experiment()
		}
		else{
			do_trial(trial_num+1,show_numbers)
		}
	})
}

function show_scores(is_practice){
	log_data({"event_type": "show_scores", "event_info" : {"score_text" : score_text, "is_practice" : is_practice}})
	$('.overlayed').show();
	$('#score').show()
	$('#score p').text(is_practice?show_practice_scores_text:show_main_scores_text)
	for(i =0;i<score_text.length;i++){
		$("#score button").before("<p>" + score_text[i] + "</p>")
	}
	$("#score button").off("click").on("click",function(){
		$('#score').hide();
		$('#score p').remove();
		$("#score button").before("<p></p>")
		if(is_practice){
			score_text = []
			show_instructions(0,instructions_text_after_practice,instructions_urls_after_practice,select_and_show_advice,"Next")	
		}
		else{
			enter_advice()
		}
	})
}

function select_and_show_advice(){
	if(selection_mode == "no-selection" || inherited_advice.length==1){
		task_imgs = shuffled_imgs.slice(num_practice_trials*num_imgs,(num_practice_trials+1)*num_imgs);
		show_advice(inherited_advice[0])
	}
	else {
		select_advice({})
	}
}

function select_advice(previously_selected){
	console.log(previously_selected)
	log_data({"event_type": "select_advice", "event_info" : {"inherited_advice" : inherited_advice}})
	$('.overlayed').show();
	$('#select_advice').show()
	$('#select_advice p:not(:first)').remove()
	if(Object.keys(previously_selected).length==0){
		$('#select_advice p').text(select_advice_text_initial)
		$('#select_advice button').hide()
	}
	else{
		$('#select_advice p').text(select_advice_text_additional)
		$('#select_advice button').show().off('click').on('click',function(){
			$('#select_advice').hide()
			show_instructions(0,instructions_text_after_advice,instructions_urls_after_advice,start_main,"Continue")
		})
	}
	for(i=0;i<inherited_advice.length;i++){
		$('#select_advice').append("<p></p>")
		$("<span />", {
			class: "inherited_advice"
		}).text(
			"  received bonus: $" + inherited_advice[i]["bonus"].toFixed(2)
		).prepend(
			"<i class='fas fa-user'></i>"
		).off("click").on("click",function (i) {
			return function(){
				log_data({"event_type": "select_parent", "event_info" : {"parent_id" : inherited_advice[i]["parent_id"], "selected_advice": inherited_advice[i]}})
				$('#select_advice').hide()
				if(i in previously_selected){
					task_imgs = previously_selected[i]
				}
				else{
					n = num_practice_trials+Object.keys(previously_selected).length
					task_imgs = shuffled_imgs.slice(n*num_imgs,(n+1)*num_imgs);
					previously_selected[i]=task_imgs.slice()
				}
				show_advice(inherited_advice[i],previously_selected)
			}
		}(i)
		).appendTo("#select_advice p:last")
	}
}

function after_advice(previously_selected){
	if(inherited_advice.length==1 || selection_mode == "single-selection" || Object.keys(previously_selected).length == 2){
		show_instructions(0,instructions_text_after_advice,instructions_urls_after_advice,start_main,"Continue")
	}
	else{
		select_advice(previously_selected)
	}
}

function show_advice(advice,previously_selected){
	log_data({"event_type": "show_advice", "event_info" : {"advice" : advice}})
	if(advice_mode == "text" || advice["replay_data"]["sequence"] == undefined){
		show_advice_text(advice["advice_text"],function(){
			after_advice(previously_selected)
		})
	}
	else if(advice_mode == "replay"){
		show_replay(advice["replay_data"],function(){
			after_advice(previously_selected)
		})
	}
	else if(advice_mode == "both"){
		show_advice_text(advice["advice_text"],function(){
			show_replay(advice["replay_data"],function(){
				after_advice(previously_selected)
			})
		})
	}
}

function show_advice_text(advice_text,callback){
	$('.overlayed').show();
	$('#advice').show()
	$('#advice p').text(receive_advice_text)
	$('#advice textarea').text(advice_text).prop('disabled', true);
	$("#advice button").off("click").on("click",function(){
		$('#advice').hide();
		callback()
	})
}


function do_replay(sequence,i,callback){
	if(i==sequence.length){
		$(".replay_cursor").animate({
			"left": "50vw",
			"top": "65vh",
			"margin-top": 0
		}, 800, function(){
			$("#finishedbutton_replay").css({"background-color" : "#aaaaaa"})
			$(".replay_cursor").removeClass("fas fa-mouse-pointer").addClass("fas fa-hand-pointer")
			setTimeout(function(){
				var sorted = is_sorted(rank)
				var num_swaps = sequence.length
				show_image_numbers(0.5);
				$("#finishedbutton_replay").hide()
				$(".replay_cursor").hide()
				var feedbacktext = (sorted ? "Correct" : "Incorrect") + ", " + num_swaps.toString() + " comparison" + (num_swaps!=1? "s":"")
				$("#feedback p").text(feedbacktext)
				$("#feedback").show()
				setTimeout(function(){
					$("#replayendbutton").show().off("click").on("click",function(){
						$("#replayendbutton").hide().off("click")
						$(".task_img").remove()
						$("#feedback").hide()
						callback()
					})
				},800)
			},800)
		})
	}
	else{
		move_replay_cursor(sequence[i]["indices"][0],function(){
			$(".task_img#" + sequence[i]["indices"][0].toString()).css("border-color" , selected_color)
			setTimeout(function(){
				move_replay_cursor(sequence[i]["indices"][1],function(){
					$(".task_img#" + sequence[i]["indices"][1].toString()).css("border-color" , selected_color)
					setTimeout(function(){
						$(".task_img").css("border-color" , unselected_color)
						if(sequence[i]["success"]){
							swap_imgs($(".task_img#" + sequence[i]["indices"][0]),$(".task_img#" + sequence[i]["indices"][1]))
							swap_ranks(sequence[i]["indices"][0],sequence[i]["indices"][1])
						}
						do_replay(sequence,i+1,callback)
					},350)
				})
			},200)
		})
	}
}

function move_replay_cursor(to_img,callback){
	$(".replay_cursor").animate({
		left: (100*(to_img+0.5)/num_imgs).toString() + "vw"
	}, 800, callback)
}

function show_replay(replay_data,callback){
	log_data({"event_type": "show_replay", "event_info" : {"replay_data" : replay_data}})
	$(".overlayed").hide()
	rank = replay_data["rank"].slice()
	jQuery.fx.interval = 1;
	$(".replay_cursor").css({
		"left": "50vw",
		"top": "30vh",
		"margin-top": "6vw"
	})
	$(".replay_cursor").removeClass("fas fa-hand-pointer").addClass("fas fa-mouse-pointer")
	$("#replaystartbutton").show().off("click").on("click",function(){
		$("#replaystartbutton").off("click").hide()
		create_imgs()
		$(".task_img").off("mousedown mouseup mouseenter mouseleave")
		$("#finishedbutton_replay").show().off("click").css("cursor","default")
		$(".replay_cursor").show()
		do_replay(replay_data["sequence"],0,callback)
	})	
}

function enter_advice(){
	log_data({"event_type": "enter_advice", "event_info" : {}})
	$('.overlayed').show();
	$('#advice').show()
	$('#advice p').text(enter_advice_text)
	$('#advice textarea').text("").prop('disabled', false);
	$("#advice button").hide().text("Submit").off("click").on("click",function(){
		log_data({"event_type": "submit_advice", "event_info" : {"advice" : $('#advice textarea').val()}})
		$('#advice').hide();
		show_instructions(0,instructions_text_before_demonstration,instructions_urls_before_demonstration,do_demonstration,"Continue")
	})
	$("#advice textarea").off("keyup").on("keyup",function(){
		if($("#advice textarea").val().length>=1){
			$("#advice button").show()
		}
		else{
			$("#advice button").hide()
		}
	})
}

function do_demonstration(){
	log_data({"event_type": "demonstration trial", "event_info" : {}})
	$("#nexttrialbutton").text("Finished")
	do_trial(num_practice_trials + num_main_trials,false)
}

function start_main(){
	log_data({"event_type": "start main", "event_info" : {}})
	bonus = 0
	do_trial(num_practice_trials,false)
}

function start_practice(){
	log_data({"event_type": "start practice", "event_info" : {}})
	do_trial(0,num_practice_trials_numbers>0)
}

function pass_quiz(num_previous_tries){
	log_data({"event_type": "pass quiz", "event_info" : {"number_of_previous_tries" : num_previous_tries}})
	show_instructions(0,instructions_text_pass_quiz,instructions_urls_pass_quiz,start_practice,"Start")
}

function fail_quiz(num_previous_tries){
	log_data({"event_type": "fail quiz", "event_info" : {"number_of_previous_tries" : num_previous_tries}})
	if(num_previous_tries==3){
		finish_experiment()
	}
	else{
		show_instructions(0,instructions_text_fail_quiz,instructions_urls_fail_quiz,function(){
			do_quiz(num_previous_tries+1)
		},"Next")
	}
}

function do_quiz(num_previous_tries){
	log_data({"event_type": "quiz", "event_info" : {"number_of_previous_tries" : num_previous_tries}})
	$('.overlayed').show();
	$('#attention_quiz').show();
	if($('#attention_quiz p').length==0){
		for(var i=0;i<quiz_content.length;i++){
			quiz_question = $("<p />").text(quiz_content[i]["question"])
			quiz_answers = $("<select></select>").css({"width" : "50vw"}).append("<option>Choose your answer</option")
			question_order = []
			for(var j =0; j<quiz_content[i]["answers"].length; j++){
				question_order.push(j);
			}
			question_order = shuffle(question_order)
			for(var k=0;k<question_order.length;k++){
				var j = question_order[k]
				quiz_answers.append($("<option></option>").text(quiz_content[i]["answers"][j]).val(quiz_content[i]["answers"][j]==quiz_content[i]["correct_answer"]))
			}
			$('#attention_quiz button').before(quiz_question).before(
				$("<div />").css({"text-align" :"left"}).append(quiz_answers)
			)
		}
	}
	$('#attention_quiz button').off("click").on("click",function(){
		$('#attention_quiz').hide();
		correct = true
		$('#attention_quiz select').each(function(){
			correct = correct && $(this).val()=="true"
			log_data({"event_type": "submit quiz answer", "event_info" : {"selected answer" : $(this).children("option").filter(":selected").text(), "correct" : correct}})//TODO: get selected answers
		})
		if(correct){
			pass_quiz(num_previous_tries)
		}
		else{
			fail_quiz(num_previous_tries)
		}
	})
}

function show_instructions(i,texts,urls,callback,start_text,verbose=true){
	if(verbose){
		log_data({"event_type": "show instructions", "event_info" : {"screen_number": i}})
	}
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

function initialize_task(n_imgs,n_main,n_practice_no_numbers,n_practice_numbers,a_mode,s_mode,assist,advice,callback){
	num_imgs = n_imgs
	num_main_trials = n_main
	num_practice_trials_nonumbers = n_practice_no_numbers
	num_practice_trials_numbers = n_practice_numbers
	num_practice_trials = num_practice_trials_numbers + num_practice_trials_nonumbers
	advice_mode = a_mode
	selection_mode = s_mode
	memory_assist = assist
	inherited_advice = advice


	instructions_text_pass_quiz = ["Thank you! You answered all questions correctly.",
								   "You will now complete " + num_practice_trials_nonumbers + " practice trials."]
	instructions_urls_pass_quiz = ["",
								   ""]
	instructions_text_fail_quiz = ["You answered at least one question incorrectly. Here is a short review of the instructions.",
								   "Every image has a number.",
								   "The numbers are randomly assigned on every trial. They are not related to the content of the images.",
								   "To change the ordering, you can click on any pair of images.",
								   "If the pair you select is out of order, they will swap positions.",
								   "If the pair you select is out of order, they will swap positions.",
								   "You will earn a bonus for every trial you get correct.",
								   "The fewer comparisons you use to put the images in order, the larger your bonus will be.",
								   "Please answer the three questions again to start."]
	instructions_urls_fail_quiz = ["",
								   "instructions-out-of-order",
								   "instructions-out-of-order",
								   "instructions-select-nonadjacent",
								   "instructions-out-of-order",
								   "instructions-select-nonadjacent-swapped",
								   "instructions-in-order",
								   "instructions-in-order-few-swaps",
								   ""]

	instructions_text = ["On each trial, you will see a set of images like this.",
						 "Every image has a number.",
						 "The numbers are randomly assigned on every trial. They are not related to the content of the images.",
						 "But you will not see the numbers.",
						 "Your task is to put the images in the correct order.",
						 "To change the ordering, you can click on any pair of images.",
						 "If the pair you select is out of order, they will swap positions.",
						 "This pair is out of order",
						 "Because the train is number 6 and the eagle is number 1",
						 "So they will swap position",
						 "So they will swap position",
						 "You can make as many such comparisons as you wish.",
						 "When you think all of the images are in order, click Finished.",
						 "You will earn a bonus for every trial you get correct.",
						 "The fewer comparisons you use to put the images in order, the larger your bonus will be.",
						 "Remember, the content of the images is not important.",
						 "The hidden ordering is not related to what is in the images.",
						 "To do this task well, you must ignore the content of the images!",
						 "Before starting the task, please answer three questions to make sure you understand the instructions."
						 ]

	instructions_urls = ["instructions-array",
						 "instructions-out-of-order",
						 "instructions-out-of-order",
						 "instructions-array",
						 "instructions-in-order",
						 "instructions-select-nonadjacent",
						 "instructions-select-nonadjacent",
						 "instructions-select-nonadjacent",
						 "instructions-out-of-order",
						 "instructions-select-nonadjacent",
						 "instructions-select-nonadjacent-swapped",
						 "instructions-select-nonadjacent-swapped",
						 "instructions-click-finished",
						 "instructions-in-order",
						 "instructions-in-order-few-swaps",
						 "",
						 "",
						 "",
						 ""
						 ]

	instructions_text_during_practice = ["You will now complete " + num_practice_trials_nonumbers + " more practice trials.",
										"In these trials, you won't see the number of each image."
										]
	instructions_urls_during_practice = ["",
										""]
						 
	instructions_text_after_practice = ["You have completed all practice trials.",
										"You will now complete " + num_main_trials + " real trials.",
										"Remember, the content of the image is not important.",
										"On these trials, you will receive an additional bonus for every trial you get correct!",
										"Try to be systematic about your comparisons.",
										"If you use a good strategy, you will get more trials correct.",
										"At the end of the experiment, you will be asked to describe and demonstrate your strategy, for the chance to earn an extra bonus.", 
										""]
	instructions_urls_after_practice = ["",
										"",
										"",
										"",
										"",
										"",
										"",
										""]
										


	if(inherited_advice[0]["replay_data"]["sequence"]==undefined){
		instructions_text_after_advice = ["You are now ready to begin."]
	}
	else if (inherited_advice.length==1){
		instructions_text_after_advice = ["You are now ready to begin. Can you improve on the previous participant's strategy?"]
	}
	else {
		instructions_text_after_advice = ["You are now ready to begin. Can you improve on the strategies you've seen?"]
	}
	instructions_urls_after_advice = [""]
									  
	instructions_text_before_demonstration = ["Please now demonstrate your strategy on the following images."]
	instructions_urls_before_demonstration = [""]
	

	receive_advice_text = "The previous participant gave the following strategy advice:"
	enter_advice_text = "Please try to describe the strategy you used, and how well it worked. Your description may be given to another participant. You will recieve an additional bonus if your advice helps somebody perform well. Remember, future participants will not see the advice you viewed, only the advice you give here."
	show_practice_scores_text = "This is your performance on the practice trials"
	show_main_scores_text = "This is your performance on the main trials"
	if(advice_mode == "text" || inherited_advice[0]["replay_data"]["sequence"]==undefined){
		select_advice_text_initial = "Please select whose advice you would like to view. Next to each participant's icon, you can see the bonus they received. To view a participant's advice, click on their icon."
		select_advice_text_additional = "You can view the same advice again, or select other participants' advice to view. You can view advice from up to three different participants in total, or whenever you feel ready click Start to begin the main trials, which determine your bonus."
		instructions_text_after_practice[instructions_text_after_practice.length-1] = "To help you with the task, you will first view advice from previous participants."	
	}
	else if(advice_mode == "replay"){
		select_advice_text_initial = "Please select whose strategy you would like to observe. Next to each participant's icon, you can see the bonus they received. To observe a participant's strategy, click on their icon."
		select_advice_text_additional = "You can observe the same advice again, or select other participants' advice to observe. You can observe advice from up to three different participants in total, or whenever you feel ready click Start to begin the main trials, which determine your bonus."
		instructions_text_after_practice[instructions_text_after_practice.length-1] = "To help you with the task, you will first see animations of the strategies of previous participants."
	}
	else if(advice_mode == "both"){
		select_advice_text_initial = "Please select whose advice you would like to view. Next to each participant's icon, you can see the bonus they received. To view a participant's advice and see an animation of their strategy, click on their icon."
		select_advice_text_additional = "You can view the same advice again, or select other participants' advice to view. You can view advice from up to three different participants in total, or whenever you feel ready click Start to begin the main trials, which determine your bonus."
		instructions_text_after_practice[instructions_text_after_practice.length-1] = "To help you with the task, you will first view advice and see animations of the strategies of previous participants."
	}
	else{
		console.log("unknown advice mode:",advice_mode)
	}
	quiz_content = [{
			"question" : "How is the order of the images determined?",
			"answers" : ["The numbers are randomly assigned on every trial",
						 "Images of animals have high numbers, other images are lower",
						 "Images that look beautiful have higher numbers"
			],
			"correct_answer" : "The numbers are randomly assigned on every trial"
		},{
			"question" : "When do two images swap?",
			"answers" : ["When I click on them",
						 "When I click on them and they are out of order",
						 "Never"
			],
			"correct_answer" : "When I click on them and they are out of order"
		},{
			"question" : "How is your bonus calculated?",
			"answers" : ["My bonus is larger if I correctly put the images in order with as few comparisons as I can",
						 "My bonus is randomly assigned on every trial",
						 "I always get the same bonus when the images are in order"
			],
			"correct_answer" : "My bonus is larger if I correctly put the images in order with as few comparisons as I can"
		}
	]
	shuffled_imgs = shuffle(imgs.slice())
	preload_images()
	callback()
}

function preload_img(imgs_to_preload, i){
	if(i<imgs_to_preload.length){
		if(imgs_to_preload[i]==""){
			preload_img(imgs_to_preload, i + 1);
		}
		else{
			image_array[i]=new Image();
			img = imgs_to_preload[i]
			if(img.startsWith("instructions")){
				img=img + ".png"
			}
			image_array[i].onload=function(){
				$("<img />").attr("src",get_image_path(img)).appendTo("#preload_images");
				preload_img(imgs_to_preload, i + 1);
			}
			image_array[i].src=get_image_path(img);
		}
	}
	else{
		log_data({"event_type": "preloading complete", "event_info" : {}})
	}
}

function preload_images(){
	log_data({"event_type": "preloading images", "event_info" : {}})
	imgs_to_preload = [].concat.apply([],[instructions_urls,instructions_urls_fail_quiz,instructions_urls_pass_quiz,instructions_urls_during_practice,instructions_urls_after_practice,instructions_urls_after_advice,instructions_urls_before_demonstration,shuffled_imgs])
	image_array = new Array(imgs_to_preload.length)
	preload_img(imgs_to_preload,0)
}

function start_experiment(){
	$(document).on("contextmenu",function(e){
		e.preventDefault()
	})
	if(!memory_assist){
		$("#memoryassistpane").remove()
		$("#listsortingpane").css("width","100vw")
	}
	//show_instructions(0,instructions_text,instructions_urls,function(){
	// 	do_quiz(0)
	//},"Next");
	//shuffled_imgs = ['tiger.jpg','train.jpg','orange.jpg','eagle.jpg','shoe.jpg','mushroom.jpg']
	$(".overlayed").hide()
	select_and_show_advice()
}