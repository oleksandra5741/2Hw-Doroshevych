var Templates = require('../Templates');
var API = require('../API');
var localstorage=require('../LocalStorage');
var CART = [];
var QUANTITY = 0;
var SUMMARYMARY = 0;
var SIZE = {
    Big: "BIG",
    Small: "SMALL"};
var def_price = [];
var $CART = $("#CART");
var $platform = $("#platform");
function ADDITEMS(pizza, size) {
    QUANTITY++;
	 var j =0;
	var CHEKIT = true;
	for(var i=0; i<CART.length; ){
		if(CART[i].pizza.title === pizza.title && CART[i].size === size){
			j = i;
			CHEKIT = false;
			break;
		}else{
			CHEKIT = true;}
		i++;}
	console.log(CHEKIT + "\n"+  pizza.title + "\n" + size);
	if(CHEKIT == false){
		var st = (CART[j].size === "Small") ? true : false;
	if(st == true){
		CART[j].pizza.Small.price = CART[j].pizza.Small.price + def_price[j];
	}else{
		CART[j].pizza.Big.price = CART[j].pizza.Big.price + def_price[j];}
		SUMMARYMARY = SUMMARYMARY + def_price[j] ;
		CART[j].quantity = CART[j].quantity + 1; 
		console.log(def_price[j]);}
	if(CHEKIT==true){
    CART.push({
        pizza: pizza,
        size: size,
        quantity: 1});
	def_price.push(pizza[size].price);
		SUMMARYMARY = SUMMARYMARY + pizza[size].price;}
   UPDATE();}
function getSUMMARY(){
    return SUMMARY;}
function INITIALIZE() {
	var c = localstorage.get("CART");
	var p = localstorage.get("price");
	var q = localstorage.get("QUANTITY");
	var s = localstorage.get("SUMMARYMARY");
    if(localstorage.get("CART") != undefined){
	CART = c;
	def_price = p;
	QUANTITY = q;
	SUMMARYMARY = s;}
   UPDATE();}
function REMOVEITEM(CART_item) {
	var a = CART.indexOf(CART_item);
	def_price.splice(a, 1);   
	CART.splice(a, 1);
	localstorage.set("CART",	CART);
   UPDATE();}
function GETPIZZA() {
    return CART;}
functionUPDATE() {
    localstorage.set("CART", CART);
	localstorage.set("price", def_price);
	localstorage.set("QUANTITY", QUANTITY);
	localstorage.set("SUMMARYMARY", SUMMARYMARY);
	$platform.find(".count-items").text(QUANTITY);
	$platform.find(".money").text(SUMMARYMARY);
	$platform.find(".clearbtn").click(function(){
		if(CART.length != 0){
		SUMMARYMARY = 0;
		QUANTITY = 0;
		CART.forEach(function(ob){
			ob.quantity =0;
			if(ob.size=='Big'){
				ob.pizza.Big.price = def_price[CART.indexOf(ob)];
			}else if(ob.size=='Small'){
				ob.pizza.Small.price = def_price[CART.indexOf(ob)];}
			REMOVEITEM(ob);});}
		localstorage.reset();
		 location.reload();});
	$CART.html("");
    function showOnePizzaInCART(CART_item) {
        var html_code = Templates.PizzaCART_OneItem(CART_item);
        var $node = $(html_code);
        $node.find(".plus").click(function(){
            CART_item.quantity += 1;
			++QUANTITY;
		if(CART_item.size=='Big'){
			CART_item.pizza.Big.price = CART_item.pizza.Big.price/(CART_item.quantity-1) * CART_item.quantity;
			SUMMARYMARY = SUMMARYMARY + CART_item.pizza.Big.price/(CART_item.quantity);
		}else if(CART_item.size=='Small'){
			CART_item.pizza.Small.price = CART_item.pizza.Small.price/(CART_item.quantity-1) * CART_item.quantity;
			SUMMARY = SUMMARY + CART_item.pizza.Small.price/(CART_item.quantity);
		} 
           UPDATE();});
		$node.find(".cancel").click(function(){
			if(CART_item.size == 'Big'){
			SUMMARY = SUMMARY - CART_item.pizza.Big.price;
			CART_item.pizza.Big.price = def_price[CART.indexOf(CART_item)];
				console.log("ind" + CART.indexOf(CART_item));
		}else if(CART_item.size == 'Small'){
			SUMMARY = SUMMARY - CART_item.pizza.Small.price;
			CART_item.pizza.Small.price = def_price[CART.indexOf(CART_item)];}
			var e = CART_item.quantity;
            REMOVEITEM(CART_item);
			QUANTITY = QUANTITY - e;
			updateCART();});
		$node.find(".minus").click(function(){
			if(CART_item.quantity == 1){
				if(CART_item.size=='Big'){
			SUMMARY = SUMMARY - CART_item.pizza.Big.price;
			CART_item.pizza.Big.price = def_price[CART.indexOf(CART_item)];
				console.log("ind" + CART.indexOf(CART_item));
		}else if(CART_item.size=='Small'){
			SUMMARY = SUMMARY - CART_item.pizza.Small.price;
			CART_item.pizza.Small.price = def_price[CART.indexOf(CART_item)];}
				REMOVEITEM(CART_item);
				QUANTITY = QUANTITY - 1;
				updateCART();
			}else if(CART_item.quantity > 1){
				if(CART_item.size=='Big'){
			SUMMARY = SUMMARY - CART_item.pizza.Big.price/(CART_item.quantity);
			CART_item.pizza.Big.price = CART_item.pizza.Big.price - CART_item.pizza.Big.price/(CART_item.quantity);
		}else if(CART_item.size=='Small'){
			SUMMARY = SUMMARY - CART_item.pizza.Small.price/(CART_item.quantity);
			CART_item.pizza.Small.price = CART_item.pizza.Small.price - CART_item.pizza.Small.price/CART_item.quantity;}
				CART_item.quantity -= 1;
				QUANTITY = QUANTITY - 1;
				updateCART();}});
		$CART.append($node);}
    CART.forEach(showOnePizzaInCART);}
$("#send-data").click(function(){
		  console.log("order is ",CART);
		  API.createOrder(CART, function(){
			  console.log("Data sent.");});});
exports.REMOVEITEM = REMOVEITEM;
exports.GETPIZZA = GETPIZZA;
exports.getSUMMARY = getSUMMARY;
exports.INITIALIZE = INITIALIZE;
exports.ADDITEMS = ADDITEMS;
exports.SIZE = SIZE;
