//////////////////////////////////////////////////////////
// 通信
//////////////////////////////////////////////////////////

// 　サーバとのコネクションの作成
var socket = io.connect(SERVER + "/proj");
// var socket = io.connect("/proj");
// var socket = io.connect('http://192.168.0.5:3000');
socket.on('connect', function (msg) {
  console.log("connect");
  document.getElementById("connectId").innerHTML =
    "あなたの接続ID::" + socket.io.engine.id;

});

// var socket2 = io.connect('/proj')

socket.on('connect', function () {
  console.log(socket);
})
  .on('start', function (msg) {
    console.log('####start', msg);
    readyGo();
    socket.emit('started', null);
  })
  .on('mobile_move', function (msg) {
    for (var uuid in msgObj.options["santa_keys"]) {
      _communication_keys[uuid] = { k_up: msgObj.options["santa_keys"][uuid] };
    }
  })
  .on('join', function (msg) {
    console.log('join');
    //     case "addSanta":
    // console.log("comu", msgObj.uuids);
    // addSanta(msgObj.uuids);
    // break;

  })
  .on('glow_santa', function (msg) {

    //     case "specialMove":
    // specialMove(msgObj.uuids);
    // break;
  })
  .on('change_scene', function (msg) {
    console.log('change_scene', msg);
    // socket.on('change_scene', {method: 'change_scene', options: {???}, timestamp: 12323422224123}): 画面遷移指示
    switch (msg.options.scene) {
      // case "init":
      //   init(msgObj.uuids, msgObj.pos);
      //   break;
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
      case "toujou":
        console.log("color" + msg.options.color + " name=" + msg.options.name);
        toujou_start(msg.options.color, msg.options.name);
        break;
    }
  })
  .on('initialize', function (msg) {
    console.log('initialize', msg);
    var dummy_uuids = {
      one: {
        color: "red"
      },
      two: {
        color: "blu"
      },
      three: {
        color: "yel"
      },
      four: {
        color: "gre"
      }
    }
    var pos = {
      "red": getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500),
      "blu": getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500),
      "gre": getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500),
      "yel": getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500)
    }

    init(dummy_uuids, pos);
    socket.emit('initialized', null);
  })
  .on('notify', function (msg) {

  })
  .on('santa_move', function (msg) {
    console.log('santa_move', msg);
    for (var color in msg.options['colors']) {
      otasuke(color, msg.options['amount']);
    }
  });

// メッセージを受けたとき
socket.on('notify', function (msg) {
  // メッセージを画面に表示する
  console.log('msg.options', msg);
  document.getElementById("receiveMsg").innerHTML = msg.value;
  //  if(msg.options != null){
  if (true) {
    try {
      var msgObj = JSON.parse(msg.options.value);
      // var msgObj = msg.options;
      console.log(msgObj, msgObj.method);
      switch (msgObj.method) {
        case "gadget_move":
          var gesture = msgObj.options["gesture"];
          var gadgetNum = msgObj.options["gadgetNum"];
          var color = gadgetToColor(gadgetNum);
          if (gesture == "up" || gesture == "byebye") {
            _communication_keys[color][k_up] = true;
          }
          break;
        case "gadget_color_update":
          var gadgetNum = msgObj.options["gadgetNum"];
          var color = msgObj.options["color"];
          var index = msgObj.options["index"];
          colorToGadgetMap[color][index] = gadgetNum;
          break;
        case "timeUp":
          timeUp();
          break;
        case "dev_readyGo":
          readyGo(0, 0);
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
    } catch (error) {
      console.log('error', error);
      document.getElementById("errorMsg").innerHTML = error;
    }
  }
});

// メッセージを送る
function SendMsg(target, msg) {
  socket.emit("initialize", JSON.stringify(msg));
  //   socket.emit("initialize", { value: JSON.stringify(msg) });
  console.log('sendmsg', target, msg);
}

// 切断する
function DisConnect() {
  var msg = JSON.stringify({ method: disconnect, options: { termId: socket.io.engine.id } });
  // メッセージを発射する
  socket.emit('message', { value: msg });
  // socketを切断する
  socket.disconnect();
}

function upMultiple(times, color) {
  for (var idx = 0; idx < times; idx++) {
    setTimeout(function () { upOnetime(color) }, 20 * idx);
  }
}

function upOnetime(color) {
  _communication_keys[color][k_up] = true;
}
