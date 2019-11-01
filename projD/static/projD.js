const INDEX_URL = 'http://red.eecs.yorku.ca:';
const PORT = '';

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
       //hideAll();
       doAjax(INDEX_URL + PORT + '/Category?id=', catePopulate);
   }
}

function logPopulate(res)
{
   let ar = JSON.parse(res);
   let s = "";
   ar.forEach( (e, i) => { s += "<li>" + e.name + 
   " <button onclick=\"javascript:show(cateView);\">Select</button></li>"; });
   document.getElementById("logList").innerHTML = s;

}

function catePopulate(res)
{
   let ar = JSON.parse(res);
   let s = "";
   ar.forEach( (e, i) => { s += "<li>" + e.name + "</li>"; });
   document.getElementById("cateList").innerHTML = s;

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