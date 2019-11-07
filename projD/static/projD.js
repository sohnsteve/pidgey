const INDEX_URL = 'http://red.eecs.yorku.ca:';
const PORT = '43476';
var cateCode;
var cateLabel;
var prodCode;
var prodLabel;

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

function show(v, code, label, c_up)
{
    hideAll();
    let div = document.getElementById(v); 
    div.style.display = "block";
    if (v == "logView") doAjax(INDEX_URL + PORT + '/Catalog', logPopulate);
    else if (v == "cateView")
    {
        cateCode = code;
        cateLabel = label;
        document.getElementById("cateName").innerHTML = label;
        doAjax(INDEX_URL + PORT + '/List?id=' + code, catePopulate);
    }
    else if (v == "prodView")
    {
        prodCode = code;
        //prodLabel = label;
        document.getElementById("backToCate").innerHTML =
            "<a href='javascript:show(\"cateView\", \"" + cateCode + "\", \"" + cateLabel + "\")'> &#x2b05; Go Back to " + cateLabel + "</a>";
       doAjax(INDEX_URL + PORT + '/Quote?id=' + code, prodPopulate);
    }
    else if (v == "cartView")
    {
        document.getElementById("backToProd").innerHTML =
            //"<a href='javascript:show(\"prodView\", \"" + prodCode + "\", \"" + prodLabel + "\")'> &#x2b05; Go Back to " + prodLabel + "</a>";
            "<a href='javascript:show(\"prodView\", \"" + prodCode + "\")'> &#x2b05; Go Back to Product Details</a>";
        if (c_up)
        {
            code.qty = document.getElementById(c_up).value;
        }
       doAjax(INDEX_URL + PORT + '/Cart?item=' + JSON.stringify(code), cartPopulate);
    }
}

    //shows all categories, user selects a product category from here
function logPopulate(res)
{
   logJSON = JSON.parse(res);
   let s = "";
   logJSON.forEach( (e, i) => { s += "<li>" + e.name
   + " <button onclick=\'javascript:show(\"cateView\", \"" + e.id + "\", \"" + e.name + "\")'>Select " + e.name + "</button></li>"; });
   document.getElementById("logList").innerHTML = s;
}

    //shows all products within a category, user selects a product from here
function catePopulate(res)
{
   let ar = JSON.parse(res);
   let s = "";
   ar.forEach( (e, i) => { s += "<li>" + e.name
   //" <button onclick=\'javascript:show(\"prodView\", \"" + e.id + "\", \"" + e.name + "\")'>Select " + e.name + "</button></li>"; });
   + " <button onclick=\'javascript:show(\"prodView\", \"" + e.id + "\")'>Select " + e.name + "</button></li>"; });
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
   s += "<table>"
   + "<tr>"
   + "<th>Product Name</th>"
   + "<th>Price</th>"
   + "<th>Quantity</th>"
   + "<th>Update Quantity</th>"
   + "</tr>";
   /*
   ar.forEach( (e, i) => { s 
    += "<tr>"
    + "<td>Name of product: " + e.id + "</td>"
    + "<td>Price: " + e.msrp + "</td>"
    + "<td>Quantity: " + e.qty 
    + "<input type=\"number\" id=\"modQuantity\"></td>"
    + "</tr>"; });
    */
   //" <button onclick=\"javascript:cartUpdate(" + e + ");\">Add to cart</button></li>"; });
   document.getElementById("cartTable").innerHTML = s + tablePopulate(ar);
}

function tablePopulate(arr)
{
    let s = "";
    arr.forEach( (e, i) => { s 
        += "<tr>"
        + "<td>" + e.name + "</td>"
        + "<td>$" + e.msrp + "</td>"
        + "<td>" + e.qty + "</td>"
        + "<td><input type=\"number\" id=" + e.id + ">"
        + "<button onclick=\'javascript:show(\"cartView\", " + JSON.stringify(e) + ", null, \"" + e.id + "\")'>Update</button>"
        //+ "<button onclick=\'javascript:updateCart(" + e.id + ", " + JSON.stringify(e) + ")'>Update</button>"
        + "</td>"
        + "</tr>"; });
    return s;
}

function updateCart(val, cartItem)
{
    let update = JSON.parse("\"" + cartItem + "\"");
    update.qty = document.getElementById(val).value;
    show(cartView, update);
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
   http.withCredentials = true;
   http.send();
}