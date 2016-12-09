// 　サーバとのコネクションの作成
var socket_cloud = io.connect(SERVER_CLOUD + "/proj");
// var socket_cloud = io.connect('http://192.168.0.5:3000');
socket_cloud.on('connect', function(msg) {
  console.log("connect");
  document.getElementById("connectId").innerHTML =
    "あなたの接続ID::" + socket_cloud.io.engine.id;

});

var count_clouds = {red:0,blu:0,yel:0,gre:0};

// メッセージを受けたとき
socket_cloud.on('message', function(msg) {
   // メッセージを画面に表示する
   document.getElementById("receiveMsg").innerHTML = msg.value;
   if(msg.value){
      try{
         var msgObj = JSON.parse(msg.value);
         switch(msgObj.method){
            case "santa_move":
             for (var color in _communication_keys){
                 if (msgObj.options["santa_keys"][color]){
                    count_clouds[color] += 1; 
                 }
                 if (count_clouds[color] > 4) {
                    _communication_keys[color][k_up] = true;
                    count_clouds[color] = 0;
                 }
             }
               break;
            default:
         }
      } catch (error){
         document.getElementById("errorMsg").innerHTML = error;
      }
   }
});

