// click events

$(".hero-selection > ul > li").live("click", function(e) {
	var h = $(e.target).parent().attr("id");
	setHero(h);
});
$("a.play").live("click", function() {
	var heroName = hero.name;
	heroName ? loadBattleground(heroName, showBattleground()) : loadBattleground("murky", showBattleground());
});
$("a.hero").live("click", function(e){
	var c = e.target.className.split(" ")[0], 
	    heroName;
	c != "brightwing" ? heroName = hero.name : heroName = "brightwing"; 
	heroName ? playAudio(heroName) : playAudio("murky");
})

var hero = { name: "murky" };

function setHero(heroName) {
	hero = { name: heroName};
	$(".hero-selection > ul > li.selected").removeClass("selected");
	$(".hero-selection > ul > li#"+hero.name).addClass("selected");
	if (hero.name == "kt") {
		$("#kt").addClass("murky");
		hero.name = "murky";
		alert("Dirty KT Picker!");
		loadBattleground(hero.name, showBattleground());
	}
};

function loadBattleground(heroName, callback) {
	$("#main").removeClass("active");
	$("#loading").addClass("active");
	$("#hero-loading").addClass(heroName);
	$(".hero-name").html(capitalizeName(heroName));
	$(".hero.friendly").addClass(heroName).html(capitalizeName(heroName));
	insertAudioClip(heroName);
	callback();
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
function showBattleground() {
	$("#loading").removeClass("active");
	$("#battleground").addClass("active");
}
