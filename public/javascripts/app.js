// click events

$(".hero-selection > ul > li").live("click", function(e) {
	var h = $(e.target).parent().attr("id");
	setHero(h);
});
$("a.play").live("click", function() {
	var heroName = hero.name;
	heroName ? loadBattleground(heroName, showBattleground) : loadBattleground("murky", showBattleground);
});
$("a.hero").live("click", function(e){
	var c = e.target.className.split(" ")[0], 
	    heroName;
	c != "brightwing" ? heroName = hero.name : heroName = "brightwing"; // Oh, look, Cherp is playing bright... ResidentSleeper
	heroName ? playAudio(heroName) : playAudio("murky");
});
$("a.minion").live("click", function(){
	score++;
	$(this).remove();
	updateScore(score);
});

$("a.boss").live("click", function(){
	$this = $(this)
	var thisCounter = $this.data('counter') || 0;
	thisCounter++;
    $this.data('counter', thisCounter);
	if (thisCounter == 10) {
		$this.remove();
		score = score+10;
		updateScore(score);
	}
});
$("#heroic.available").live("click", function(){
	useHeroic();
});
$(window).keypress(function(e){
	if(e.which == 114 && timer >= 15) {
		useHeroic();
	}
});

var hero = { name: "murky" };
var score = 0;
var timer = 0;
var interval;
var distance;
var intervalBreak;

function setHero(heroName) {
	hero = { name: heroName};
	$(".hero-selection > ul > li.selected").removeClass("selected");
	$(".hero-selection > ul > li#"+hero.name).addClass("selected");
	if (hero.name == "kt") {
		$("#kt").addClass("murky");
		hero.name = "murky";
		alert("Dirty KT Picker!");
		loadBattleground(hero.name, showBattleground);
	}
};

function loadBattleground(heroName, callback) {
	$("#main").removeClass("active");
	$("#loading").addClass("active");
	$("#hero-loading").addClass(heroName);
	$(".hero-name").html(capitalizeName(heroName));
	$(".hero.friendly").addClass(heroName).html(capitalizeName(heroName));
	insertAudioClip(heroName);
	setTimeout(function() { callback && callback(startGame); }, 5000); // just look at the pretty screen for at least 5 seconds, ok?
}

function capitalizeName(heroName) {
	return heroName.charAt(0).toUpperCase() + heroName.slice(1);
}

function insertAudioClip(heroName) {
	$(".hero-battle").append("<audio id='"+heroName+"-audio'><source src='/audio/"+heroName+".mp3' type='audio/mpeg' /></audio>")
}

function playAudio(heroName) {
	var audio = document.getElementById(heroName+"-audio");
	audio.play();
}
function showBattleground(callback) {
	$("#loading").removeClass("active");
	$("#battleground").addClass("active");
	callback && callback();
}

function updateScore() {
	var s = $(".hero-points");
	s.html(score);
}
function startGame() {
	var $battle = $(".hero-battle");
	
	var timerInterval = setInterval(function() {
		timer++;
		if (timer == 15) {
			$("#heroic").addClass("available");
			$battle.prepend("<p class='level-up'>Level Up!</p>");
			setTimeout(function() {
				$(".level-up").remove();
			}, 3000);
		}

	}, 1000);
 
	createEnemies(timerInterval);
}

function increaseInterval(i, d, b) {
	intervalBreak = timer+b;
	interval = i*0.50;
	d = d.replace("+=", "").replace("px", "");
	d = parseInt(d)*1.25;
	distance = "+="+d+"px";
}

function createEnemies(timerInterval) {
	var mInterval = 1000,
		bInterval = 10000,
		mIntervalBreak = 15,
		bIntervalBreak = 30,
		mDistance = "+=15px",
		bDistance = "+=5px",
		mIncrease = false,
		bIncrease = false;

	var evaluateTimer = setInterval(function(){
		timer % 15 === 0 ? mIncrease = true : mIncrease = false;
		timer % 30 === 0 ? bIncrease = true : bIncrease = false;

		if (mIncrease === true) {
			increaseInterval(mInterval, mDistance, 15);
			mInterval = interval;
			mDistance = distance;
			mIntervalBreak = intervalBreak;
			createEnemyInterval("minion", 15, mInterval, mIntervalBreak);
		}

		if (bIncrease === true) {
			increaseInterval(bInterval, bDistance, 30);
			bInterval = interval;
			bDistance = distance;
			bIntervalBreak = intervalBreak;
			createEnemyInterval("boss", 30, bInterval, bIntervalBreak);
		}
	}, 1000);

	createEnemyInterval("minion", 15, mInterval, mIntervalBreak);

	createEnemyInterval("boss", 30, bInterval, bIntervalBreak);

	var moveEnemies = setInterval(function(){
		var $m = $(".minion"),
			$b = $(".boss"),
			enemies = $(".enemy");
		$m.css({right: mDistance});
		$b.css({right: bDistance});
		$.each(enemies, function() {
			var $this = $(this),
				$battle = $(".hero-battle");
			if ($this.css("right").replace("px", "") >= 1075 || $this.css("right").replace("px", "") >= 1075) {
				clearInterval(enemies);
				clearInterval(timerInterval);
				clearInterval(moveEnemies);
				clearInterval(evaluateTimer);
				showEndScreen();
				$battle.remove();
			}
		});
	},500);
}

function createEnemyInterval(type, difference, interval, iBreak) {
	enemies = setInterval(function() {
		create(type); 
		if (timer+difference == iBreak) {
			clearInterval(enemies);
		}
	}, interval);
}

function create(type) {
	var $battle = $(".hero-battle");
	$battle.prepend("<a href='javascript:;' class='"+type+" enemy'>"+type+"</a>")
}
function showEndScreen() {
	playAudio("end");
	$("#battleground").removeClass("active");
	$("#end").addClass("active");
	$(".final-points-container span").html(getFinalScore());
	$(".high-score span").html(getHighScore());
}
function getFinalScore() {
	var u = "point";
	if (score != 1) { u = u+"s"; }
	return score+" "+u;
}
function getHighScore() {
	var u = "point";
	highScore = localStorage.getItem('highScore');
	if (highScore) {
		if (score > highScore) {
			highScore = score;
			localStorage.setItem('highScore', score);
		}
	}
	else {
		localStorage.setItem('highScore', score);
		highScore = score;
	}
	if (highScore != 1) { u = u+"s"; }
	highScore = highScore+" "+u;
	return highScore;
}
function useHeroic() {
	var $battle = $(".hero-battle"), 
		$h = $("#heroic");
	
	$battle.append("<div class='emerald-wind'></div>");
	$h.addClass("cooldown");
	animateHeroic(clearMinions);
	var coolDown = 45;
	$h.find("span").html(coolDown);
	var heroic = setInterval( function() {
		coolDown--;
		if (coolDown > 0) {
			$h.find("span").html(coolDown);
		}
		if (coolDown == 0) {
			$h.removeClass("cooldown");
			if ($(".emerald-wind")) { $(".emerald-wind").remove(); }
		}
	}, 1000);
}
function animateHeroic(callback) {
	var $h = $(".emerald-wind");
	playAudio("heroic");
	callback && callback();
	setTimeout(function() {
		$h.addClass("full");
	}, 500);
	setTimeout(function() {
		playAudio("sad");
	}, 3000);
}
function clearMinions() {
	var m = $(".minion"),
	    points = m.length;
	
	$.each(m, function(){
		var $this = $(this);
		$this.css("opacity", 0).remove();
	});

	score = score+points;
	updateScore(score);
}