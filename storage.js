function storage(loadcallback){
  if(platform==platforms.yandex){

    ysdk.getPlayer().then(player => {

    player.getData().then(data => {
      console.log("data load");
      console.log(data);
      storage.get = function(key){
        return data[key];
      }
      storage.set = function(key,value){
        data[key] = value;
      }
      storage.push = function(){
        player.setData(data).then(() => {
          console.log('yandexsdk cloud push seccuss');
          console.log(data);
        });
      }

      storage.type = 1;

      storage.getraw = function(){
        return data;
      }

      loadcallback();
      console.log("storage bind yandexsdk cloud");
    }).catch(err => {
      lssave();
    });

    }).catch(err => {
      lssave();
   });
  } else {
    lssave();
  }

  function lssave(){
    console.log("storage bind localStorage");
    storage.get = function(key){
      return localStorage[key];
    }
    storage.set = function(key,value){
      localStorage[key] = value;
    }
    storage.push = function(){

    }
    storage.getraw = function(){
      return localStorage;
    }
    storage.type = 0;
    loadcallback();
  }
}
