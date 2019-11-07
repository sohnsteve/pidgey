const INDEX_URL = 'http://red.eecs.yorku.ca:';
const PORT = '40830';
var logJSON; //JSON with all categories
var cateJSON; //JSON with all products of a category
var prodJSON; //JSON with all details of a product
var lastCode;
var lastLabel;

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

function show(v, code, label)
{
    hideAll();
    let div = document.getElementById(v); 
    div.style.display = "block";
    if (v == "logView") doAjax(INDEX_URL + PORT + '/Catalog', logPopulate);
    else if (v == "cateView")
    {
        lastCode = code;
        lastLabel = label;
        document.getElementById("cateName").innerHTML = label;
        doAjax(INDEX_URL + PORT + '/List?id=' + code, catePopulate);
    }
    else if (v == "prodView")
    {
        document.getElementById("backToCate").innerHTML =
            "<a href='javascript:show(\"cateView\", \"" + lastCode + "\", \"" + lastLabel + "\")'> &#x2b05; Go Back to \"" + lastLabel + "\"</a>"
       doAjax(INDEX_URL + PORT + '/Quote?id=' + code, prodPopulate);
    }
    else if (v == "cartView")
    {
       doAjax(INDEX_URL + PORT + '/Cart?item=' + JSON.stringify(code), cartPopulate);
    }
}

    //shows all categories, user selects a product category from here
function logPopulate(res)
{
   logJSON = JSON.parse(res);
   let s = "";
   logJSON.forEach( (e, i) => { s += "<li>" + e.name + 
   " <button onclick=\'javascript:show(\"cateView\", \"" + e.id + "\", \"" + e.name + "\")'>Select " + e.name + "</button></li>"; });
   document.getElementById("logList").innerHTML = s;
}

    //shows all products within a category, user selects a product from here
function catePopulate(res)
{
   let ar = JSON.parse(res);
   let s = "";
   ar.forEach( (e, i) => { s += "<li>" + e.name + 
   " <button onclick=\'javascript:show(\"prodView\", \"" + e.id + "\")'>Select " + e.name + "</button></li>"; });
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
   s += "<li>Name of Product: " + ar[0].name + "</li>";
   s += "<li>Product Description: " + ar[0].description + "</li>";
   s += "<li>Price: $" + ar[0].msrp + "</li>";
   s += "<br><button onclick=\'javascript:show(\"cartView\", " + giveCart + ")'>Add to cart</button>";
   //ar.forEach( (e, i) => { s += "<li>Name of product: " + e.name + "<li>Description: " + e.description
   //+ "<li>Price: $" + e.msrp + 
   //" <button onclick=\"javascript:cartUpdate(" + "\'" + giveCart + "\'" + ");\">Add to cart</button></li>"; });
   document.getElementById("prodList").innerHTML = s;
}

    //if a product was added to cart, cart is shown
    //quantity of each product can be modified here by user
function cartPopulate(res)
{
   let ar = JSON.parse(res);
   let s = "";
   ar.forEach( (e, i) => { s += "<li>Name of product: " + e.id + "<li>Price: " + e.msrp
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