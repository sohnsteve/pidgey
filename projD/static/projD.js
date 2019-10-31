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
   if (v == "logView") doAjax(PROV_URL, logPopulate);
}

function logPopulate(res)
{
   let ar = JSON.parse(res);
   let s = "";
   ar.forEach( (e, i) => { s += "<li>" + e.name + "</li>"; });
   document.getElementById("provList").innerHTML = s;

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