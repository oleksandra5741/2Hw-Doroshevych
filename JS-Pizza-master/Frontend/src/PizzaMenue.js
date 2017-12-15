var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = [];
var API = require('../API');
//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
var $pizzacount = $("#pizza-num");
var $pizzavar = $(".pizza-vars");
var inType = "";
	$pizzavar.find("a").click(function(){
	 console.log(this.id + "   " + this.innerHTML);
	inType = this.innerHTML;
		if(inType === 'Усі'){
			showPizzaList(Pizza_List);
		}else{
		filterPizza();}});
function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");
 	$pizzacount.find(".pizza-count").text(list.length);
    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});
        var $node = $(html_code);
        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);});
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);});
        $pizza_list.append($node);}
    list.forEach(showOnePizza);}
function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];
	Pizza_List.filter(function(obj){
		if(obj.type === inType){
			pizza_shown.push(obj);}
		else{
			return 0;}})
console.log(pizza_shown.length);
    //Показати відфільтровані піци
    showPizzaList(pizza_shown);}
function initialiseMenu() {
    API.getPizzaList(function(err, data){
		if(err){
			Pizza_List = [];}
		else{
			Pizza_List = data;
			console.log("Pizza_List = ", data);}
		showPizzaList(Pizza_List);});}
exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
