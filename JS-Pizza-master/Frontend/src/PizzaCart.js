var Templates = require('../Templates');
var API = require('../API');
//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"};
var Cart = [];
var localstorage	=	require('../LocalStorage');
var quan = 0;
var sum = 0;
var def_price = [];
//Змінна в якій зберігаються перелік піц в кошику
//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");
var $platform = $("#platform");
function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    quan++;
	 var j =0;
	var check = true;
	//Приклад реалізації, можна робити будь-яким іншим способом
	for(var i=0; i<Cart.length; ){
		if(Cart[i].pizza.title === pizza.title && Cart[i].size === size){
			j = i;
			check = false;
			break;
		}else{
			check = true;}
		i++;}
	console.log(check + "\n"+  pizza.title + "\n" + size);
	
	if(check == false){
		var st = (Cart[j].size === "small_size") ? true : false;
	if(st == true){
		Cart[j].pizza.small_size.price = Cart[j].pizza.small_size.price + def_price[j];
	}else{
		Cart[j].pizza.big_size.price = Cart[j].pizza.big_size.price + def_price[j];
	}
		sum = sum + def_price[j] ;
		Cart[j].quantity = Cart[j].quantity + 1; 
		console.log(def_price[j]);
	}
	if(check == true){
    Cart.push({
        pizza: pizza,
        size: size,
        quantity: 1
    });
	def_price.push(pizza[size].price);
		sum = sum + pizza[size].price;}
    //Оновити вміст кошика на сторінці
    updateCart();}
function getSum() {
    return sum;}
function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    //TODO: треба зробити
	var a = Cart.indexOf(cart_item);
	def_price.splice(a, 1);   
	Cart.splice(a, 1);
	localstorage.set("cart",	Cart);
    //Після видалення оновити відображення
    updateCart();}
function initialiseCart() {
	var c = localstorage.get("cart");
	var p = localstorage.get("price");
	var q = localstorage.get("quan");
	var s = localstorage.get("sum");
    if(localstorage.get("cart") != undefined){
	Cart = c;
	def_price = p;
	quan = q;
	sum = s;}
    updateCart();}
function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;}
function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
	localstorage.set("cart", Cart);
	localstorage.set("price", def_price);
	localstorage.set("quan", quan);
	localstorage.set("sum", sum);
	$platform.find(".count-items").text(quan);
	$platform.find(".money").text(sum);
	$platform.find(".clearbtn").click(function(){
		if(Cart.length != 0){
		sum = 0;
		quan = 0;
		Cart.forEach(function(ob){
			ob.quantity =0;
			if(ob.size == 'big_size'){
				ob.pizza.big_size.price = def_price[Cart.indexOf(ob)];
			}else if(ob.size == 'small_size'){
				ob.pizza.small_size.price = def_price[Cart.indexOf(ob)];}
			removeFromCart(ob);});}
		localstorage.reset();
		 location.reload();});
	//Очищаємо старі піци в кошику
	$cart.html("");
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        var $node = $(html_code);
        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
			++quan;
		if(cart_item.size == 'big_size'){
			cart_item.pizza.big_size.price = cart_item.pizza.big_size.price/(cart_item.quantity-1) * cart_item.quantity;
			sum = sum + cart_item.pizza.big_size.price/(cart_item.quantity);
		}else if(cart_item.size == 'small_size'){
			cart_item.pizza.small_size.price = cart_item.pizza.small_size.price/(cart_item.quantity-1) * cart_item.quantity;
			sum = sum + cart_item.pizza.small_size.price/(cart_item.quantity);
		} 
            //Оновлюємо відображення
            updateCart();});
		$node.find(".cancel").click(function(){
			if(cart_item.size == 'big_size'){
			sum = sum - cart_item.pizza.big_size.price;
			cart_item.pizza.big_size.price = def_price[Cart.indexOf(cart_item)];
				console.log("ind" + Cart.indexOf(cart_item));
		}else if(cart_item.size == 'small_size'){
			sum = sum - cart_item.pizza.small_size.price;
			cart_item.pizza.small_size.price = def_price[Cart.indexOf(cart_item)];}
			var e = cart_item.quantity;
            removeFromCart(cart_item);
			quan = quan - e;
			updateCart();});
		$node.find(".minus").click(function(){
			if(cart_item.quantity == 1){
				if(cart_item.size == 'big_size'){
			sum = sum - cart_item.pizza.big_size.price;
			cart_item.pizza.big_size.price = def_price[Cart.indexOf(cart_item)];
				console.log("ind" + Cart.indexOf(cart_item));
		}else if(cart_item.size == 'small_size'){
			sum = sum - cart_item.pizza.small_size.price;
			cart_item.pizza.small_size.price = def_price[Cart.indexOf(cart_item)];}
				removeFromCart(cart_item);
				quan = quan - 1;
				updateCart();
			}else if(cart_item.quantity > 1){
				if(cart_item.size == 'big_size'){
			sum = sum - cart_item.pizza.big_size.price/(cart_item.quantity);
			cart_item.pizza.big_size.price = cart_item.pizza.big_size.price - cart_item.pizza.big_size.price/(cart_item.quantity);
		}else if(cart_item.size == 'small_size'){
			sum = sum - cart_item.pizza.small_size.price/(cart_item.quantity);
			cart_item.pizza.small_size.price = cart_item.pizza.small_size.price - cart_item.pizza.small_size.price/cart_item.quantity;}
				cart_item.quantity -= 1;
				quan = quan - 1;
				updateCart();}});
		$cart.append($node);}
    Cart.forEach(showOnePizzaInCart);}
$("#send-data").click(function(){
		  console.log("order is ",Cart);
		  API.createOrder(Cart, function(){
			  console.log("Data sent.");});});
exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;
exports.getPizzaInCart = getPizzaInCart;
exports.getSum = getSum;
exports.initialiseCart = initialiseCart;
exports.PizzaSize = PizzaSize;
