var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
        callback(null, xhr.response);
    } else {
        callback(status, xhr.response);
    }
    };
    xhr.send();
  };
  var getJSONFILE = function(url,callback){
  var request = new XMLHttpRequest();
  request.open('GET',url);
  request.send(null);
  request.onload = function(){
    if(request.status == 200){
      var json = JSON.parse(request.responseText);
      for(var i=0;i < json.length;i++){
        console.log(json[i].name);
      }
      console.log(json);

      callback(null,request.response);

    }else{
      callback(status,request.response);
    }
  }
  }

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function displaydApes(){

    const web3 = new Web3(provider);
    let Contract = web3.eth.Contract;
    let contract = new Contract(abi, contractAddress);
    const usersTokenIds = await contract.methods.tokensOfOwner(userAddress).call();
    let showApesFrame = document.getElementById("showApes");

    for (let x in usersTokenIds) {
      await sleep(1000);

        getJSONFILE("https://kai.meta.rareboard.com/api/"+ usersTokenIds[x] +".json",
            function(err, data) {
            if (err !== null) {
                console.log("Something Went Wrong");
            } else {
                var obj = JSON.parse(data);

                var theURL = obj["image"];
                var tokenName =  obj["name"];


                let showApesDiv =
                '<div class="dape-card">'+
                '<div class="dape-card2__image">'+
                '<img src="'+theURL+'" alt="img"></div>'+
                '<div class="dape-card__content">'+
                '<p class="dape-card__name">'+tokenName+'</p>'+


                '</div>';
                showApesFrame.innerHTML += showApesDiv;


            }
        });
}
  }
