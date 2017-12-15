var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var API = require('../API');
var PIZZAL = [];
var $COUNTPIZZ = $("#pizza-num");
var $VARPIZ = $(".pizza-vars");
var $PIZZAL = $("#PIZZAL");
var inType = "";
$VARPIZ.find("a").click(function(){
    console.log(this.id + "   " + this.innerHTML);
    inType = this.innerHTML;
    if(inType === 'Усі'){
        SHOWLIST(PIZZAL);
    }else{
        filterPizza();}});
function SHOWLIST(list) {
    $PIZZAL.html("");
    $COUNTPIZZ.find(".pizza-count").text(list.length);
    function ONEPIZZASHOW(pizza) {
        var HTML = Templates.PizzaMenu_OneItem({pizza: pizza});
        var $node = $(HTML);
        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);});
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);});
        $PIZZAL.append($node);}
    list.forEach(ONEPIZZASHOW);}
function initialiseMenu() {
    API.getPizzaList(function(err, data){
        if(err){
            PIZZAL = [];}
        else{
            PIZZAL = data;
            console.log("PIZZAL = ", data);}
        SHOWLIST(PIZZAL);});}
function filterPizza(filter) {
    var SHOWNPIZ = [];
    PIZZAL.filter(function(obj){
        if(obj.type === inType){
            SHOWNPIZ.push(obj);}
        else{
            return 0;}})
    console.log(SHOWNPIZ.length);
    SHOWLIST(SHOWNPIZ);}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
