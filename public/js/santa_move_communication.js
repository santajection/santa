//////////////////////////////////////////////////////////
// 通信
//////////////////////////////////////////////////////////

// 　サーバとのコネクションの作成
var socket = io.connect(SERVER + "/proj");
// var socket = io.connect('http://192.168.0.5:3000');
socket.on('connect', function(msg) {
  console.log("connect");
  document.getElementById("connectId").innerHTML =
    "あなたの接続ID::" + socket.io.engine.id;

});

// メッセージを受けたとき
socket.on('message', function(msg) {
   // メッセージを画面に表示する
   document.getElementById("receiveMsg").innerHTML = msg.value;
   if(msg.value){
      try{
         var msgObj = JSON.parse(msg.value);
         switch(msgObj.method){
            case "santa_move":
             for (var color in _communication_keys){
                 if (msgObj.options["santa_keys"][color]){
             // console.log(color + ":"+msgObj.options["santa_keys"][color]);
                 _communication_keys[color][k_up] = msgObj.options["santa_keys"][color];
                     }
             }
//                var direction = msgObj.options["direction"];
//                var color = msgObj.options["color"];
//                if(direction == "left")
//                  _communication_keys[color][k_left] = true;
//                if(direction == "right")
//                  _communication_keys[color][k_right] = true;
//                if(direction == "up")
// //                upMultiple(20, color);
//                  _communication_keys[color][k_up] = true;
//                if(direction == "down")
//                  _communication_keys[color][k_down] = true;
               break;
            case "gadget_move":
               var gesture = msgObj.options["gesture"];
               var gadgetNum = msgObj.options["gadgetNum"];
               var color = gadgetToColor(gadgetNum);
               if(gesture == "up" || gesture == "byebye"){
                 _communication_keys[color][k_up] = true;
               }
               break;
            case "gadget_color_update":
               var gadgetNum = msgObj.options["gadgetNum"];
               var color = msgObj.options["color"];
               var index = msgObj.options["index"];
               colorToGadgetMap[color][index] = gadgetNum;
               break;
            case "init":
               init(msgObj.names, msgObj.pos);
               break;
            case "pre":
               pre();
               break;
            case "title":
               title();
               break;
            case "rule":
               rule();
               break;
            case "ouen":
               ouen();
               break;
            case "readyGo":
               readyGo();
               break;
            case "timeUp":
               timeUp();
               break;
            case "toujou":
             console.log("color" + msgObj.color + " name=" +msgObj.name);
             toujou_start(msgObj.color, msgObj.name);
             break;
            case "config":
             frame_per_signal = msgObj.options["frame_per_signal"];
             imgs_per_frame = msgObj.options["imgs_per_frame"];
             move_per_signal = msgObj.options["move_per_signal"];
             dist_window_santa = msgObj.options["dist_window_santa"];
             DEBUG_LEVEL = msgObj.options["debug_level"];
             break;
            case "end":
            default:
         }
      } catch (error){
         document.getElementById("errorMsg").innerHTML = error;
      }
   }
});

// メッセージを送る
function SendMsg(target,msg) {
     socket.emit(target, { value: JSON.stringify(msg) });
}

// 切断する
function DisConnect() {
  var msg = JSON.stringify({method:disconnect, options:{termId:socket.io.engine.id}});
  // メッセージを発射する
  socket.emit('message', { value: msg });
  // socketを切断する
  socket.disconnect();
}

function upMultiple(times, color){
  for(var idx = 0; idx < times; idx++){
      setTimeout(function(){upOnetime(color)}, 20 * idx);
  }
}

function upOnetime(color){
   _communication_keys[color][k_up] = true;
}
