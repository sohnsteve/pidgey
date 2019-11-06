const INDEX_URL = 'http://red.eecs.yorku.ca:';
const PORT = '40087';
var catId = 0;
var prodId = '';
var cartJSON = '';

function init()
{
   hideAll();
   show("logView");
}

function hideAll()
{
   let list = document.getElementsByClassName("view");
   for (let e of list)
   {
       e.style.display = "none";
   }
}

function show(v)
{
   let div = document.getElementById(v); 
   div.style.display = "block";
   if (v == "logView") doAjax(INDEX_URL + PORT + '/Catalog', logPopulate);
   else if (v == "cateView")
   {
       doAjax(INDEX_URL + PORT + '/List?id=' + catId, catePopulate);
   }
   else if (v == "prodView")
   {
       doAjax(INDEX_URL + PORT + '/Quote?id=' + prodId, prodPopulate);
   }
   else if (v == "cartView")
   {
       doAjax(INDEX_URL + PORT + '/Cart?item=' + cartJSON, cartPopulate);
   }
}

function cateUpdate(s)
{
    hideAll();
    catId = s;
    show("cateView");
}

function prodUpdate(s)
{
    hideAll();
    prodId = s;
    show("prodView");
}

function cartUpdate(s)
{
    hideAll();
    cartJSON = s;
    show("cartView");
}

    //shows all categories, user selects a product category from here
function logPopulate(res)
{
   let ar = JSON.parse(res);
   let s = "";
   ar.forEach( (e, i) => { s += "<li>" + e.name + 
   " <button onclick=\"javascript:cateUpdate(" + e.id + ");\">Select " + e.name + "</button></li>"; });
   document.getElementById("logList").innerHTML = s;

}

    //shows all products within a category, user selects a product from here
function catePopulate(res)
{
   let ar = JSON.parse(res);
   let s = "";
   ar.forEach( (e, i) => { s += "<li>" + e.name + 
   " <button onclick=\"javascript:prodUpdate(" + "\'" + e.id + "\'" + ");\">Select " + e.name + "</button></li>"; });
   document.getElementById("cateList").innerHTML = s;
}

    //shows detail of each product, user chooses to add to cart
function prodPopulate(res)
{
   let ar = JSON.parse(res);
   //let giveCart = cartify(ar);
   let gCart = ar[0];
   let obj = new Object();
   obj.id = gCart.id;
   obj.msrp = gCart.msrp;
   obj.qty = 1;
   let giveCart = JSON.stringify(obj);
   let s = "";
   ar.forEach( (e, i) => { s += "<li>Name of product: " + e.name + "<li>Description: " + e.description
   + "<li>Price: $" + e.msrp + 
   " <button onclick=\"javascript:cartUpdate(" + "\'" + giveCart + "\'" + ");\">Add to cart</button></li>"; });
   document.getElementById("prodList").innerHTML = s;
}

    //the purpose of this function is to take the JSON received in
    //prodPopulate and give back a JSON with items: id, msrp, qty
function cartify(s)
{
    var obj = new Object();
    obj.id = s.id;
    obj.msrp = s.msrp;
    obj.qty = 1;
    return JSON.stringify(obj);
}

    //if a product was added to cart, cart is shown
    //quantity of each product can be modified here by user
function cartPopulate(res)
{
   let ar = JSON.parse(res);
   let s = "";
   ar.forEach( (e, i) => { s += "<li>Name of product: " + e.name + "<li>Price: " + e.msrp
   + "<li>Quantity: " + e.qty +
   "</li>"; });
   //" <button onclick=\"javascript:cartUpdate(" + e + ");\">Add to cart</button></li>"; });
   document.getElementById("cartList").innerHTML = s;
}

function doAjax(address, handler)
{
   var http = new XMLHttpRequest();
   http.onreadystatechange = function() 
   {
      if (http.readyState == 4 && http.status == 200)
      { 
         handler(http.responseText);
      }
   }
   http.open("GET", address, true);
   http.send();
}