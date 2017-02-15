var token = "7ab6f2ee8f4b3755339c9257df268b51";
var url = "https://api.collection.cooperhewitt.org/rest/?method=cooperhewitt.objects.getRandom&access_token="+token+"&has_image=1";


// make request with callback
getJSON(url,cooperHewittResponse);


//--------- update Page
function replaceImageOnPage(imageUrl,title){

  document.getElementById("gallery").innerHTML = "<image src='"+imageUrl+"'></image><p>"+title+"</p>";

}

//--------- API Functions
function cooperHewittResponse(err,data){
    if (err != null) {
        alert("Something went wrong: " + err);
    } else {
        //var expo = JSON.parse(data.object);
        console.log(data.object);

        var imageUrl = data.object.images[0].z.url;
        var title = data.object.title;

        replaceImageOnPage(imageUrl,title);
        
        //alert("Your query count: " + data.query.count);
    }
}

function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};