//////////////////////////////////////////////////////////
// 通信
//////////////////////////////////////////////////////////

var receivedCountCloud = {"red":0,"blu":0,"gre":0,"yel":0};

// 　サーバとのコネクションの作成
var socket_cloud = io.connect(SERVER_CLOUD + "/unnei");
// var socket_cloud = io.connect('http://192.168.0.5:3000');
socket_cloud.on('connect', function(msg) {
  console.log("connect");
  document.getElementById("connectId_cloud").innerHTML = "あなたの接続ID::" + socket_cloud.io.engine.id;

});

// メッセージを受けたとき
socket_cloud.on('message', function(msg) {
   // メッセージを画面に表示する
   document.getElementById("receiveMsg_cloud").innerHTML = msg.value;
   if(msg.value){
      try{
         var msgObj = JSON.parse(msg.value);
         switch(msgObj.method){
            case "santa_move":
               //var color = msgObj.options.santa_keys
               receivedCountCloud[color]++;
               $("#" + color + "recv_cloud")[0].innerHTML = receivedCountCould[color]; 
               break;
            default:
         }
      } catch (error){
         document.getElementById("errorMsg").innerHTML = error;
      }
   }
});


// メッセージを送る
function SendMsgCloud(target,msg) {
     socket_cloud.emit(target, { value: JSON.stringify(msg) });
}
