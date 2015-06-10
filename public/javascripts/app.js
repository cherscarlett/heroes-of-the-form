// click events

$(".hero-selection > ul > li").live("click", function(e) {
	var h = $(e.target).parent().attr("id");
	setHero(h);
});
$("a.play").live("click", function() {
	heroName = hero.name;
	loadBattleground(heroName);
});

var hero = { name: "murky" };

function setHero(heroName) {
	hero = { name: heroName};
	$(".hero-selection > ul > li.selected").removeClass("selected");
	$(".hero-selection > ul > li#"+hero.name).addClass("selected");
	if (hero.name == "kt") {
		$("#kt").addClass("murky");
		hero.name = "murky";
		alert("Dirty KT Picker!");
		loadBattleground(hero.name);
	}
};

function loadBattleground(heroName) {
	$("section.active").removeClass("active");
	$("#loading").addClass("active");
	$("#hero-loading").addClass(heroName);
}