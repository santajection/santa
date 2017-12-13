/////////////////////////////////////////////////////
//  音声
/////////////////////////////////////////////////////

var obj_bgm = null;
var bgm_play = new Audio("image/sound/bgm.mp3");
var bgm_hit = new Audio("image/sound/tonakai_hit.mp3");
var bgm_goal = new Audio("image/sound/goal.mp3");
var bgm_yojinobori = new Audio("image/sound/sound02.mp3");
var bgm_warp = new Audio("image/sound/warp.mp3");
var bgm_fin = new Audio("image/sound/clear.wav");
var bgm_start = new Audio("image/sound/start.wav");
bgm_hit.load();
bgm_goal.load();
bgm_yojinobori.load();
bgm_warp.load();
bgm_start.load();

var bgmAudio = {
  play: bgm_play,
  hit: bgm_hit,
  goal: bgm_goal,
  yojinobori: bgm_yojinobori,
  warp: bgm_warp,
  fin: bgm_fin,
  start: bgm_start
};



//////////////////////////////////////////////////////////
// 通信
//////////////////////////////////////////////////////////
var keys = {};
var k_left = 37;
var k_up = 38;
var k_right = 39;
var k_down = 40;

var k_red = 81; // q
var k_blu = 87; // w
var k_yel = 69; // e
var k_gre = 82; // r


var santa = "red";

var receivedCount = { "red": [0, 0], "blu": [0, 0], "gre": [0, 0], "yel": [0, 0] };

// 　サーバとのコネクションの作成
var socket = io.connect(SERVER + "/unnei");
console.log(SERVER + "/unnei", socket)

// var socket = io.connect('http://192.168.0.5:3000');
socket.on('connect', function (msg) {
  console.log("connect");
  document.getElementById("connectId").innerHTML = "あなたの接続ID::" + socket.io.engine.id;

});

// メッセージを受けたとき
socket.on('message', function (msg) {
  // メッセージを画面に表示する
  document.getElementById("receiveMsg").innerHTML = msg.value;
  console.log('unnei_communication message', msg);
  if (msg.value) {
    try {
      var msgObj = JSON.parse(msg.options.value);
      console.log('unnei_communication', msgObj);

      // if(msgObj.method.substr(0, 1) != "g"){
      //  console.log(msgObj);
      // }
      switch (msgObj.method) {
        case "santa_move":
          var direction = msgObj.options["direction"];
          if (direction == "left")
            keys[k_left] = true;
          if (direction == "right")
            keys[k_right] = true;
          if (direction == "up")
            keys[k_up] = true;
          if (direction == "down")
            keys[k_down] = true;
          break;
        case "gadget_move":
          var gesture = msgObj.options["gesture"];
          var gadgetNum = msgObj.options["gadgetNum"];
          var count = msgObj.options["count"];
          var color = gadgetToColorAndIdx(gadgetNum).color;
          var index = gadgetToColorAndIdx(gadgetNum).index;

          receivedCount[color][index]++;

          $("#" + color + index + gesture)[0].innerHTML = count;
          $("#" + color + index + "recv")[0].innerHTML = receivedCount[color][index];
          break;
        case "gadget_alive":
          var gadgetNum = msgObj.options["gadgetNum"];
          var state = msgObj.options["state"];
          var color = gadgetToColorAndIdx(gadgetNum).color;
          var index = gadgetToColorAndIdx(gadgetNum).index;
          $("#" + color + index + "alive")[0].innerHTML = state;
          break;
        case "gadget_register_unnei":
          var gadgetNum = msgObj.options["gadget"];
          break;

        // 以下、BGM
        case "play":
          bgmAudio[msgObj.name].play();
          break;
        case "pause_if_exist":

          if (obj_bgm) {
            obj_bgm.pause();
          }
          break;
        case "obj_overwrite":
          obj_bgm = bgmAudio[msgObj.name];
          obj_bgm.play();
          break;
        case "soriAnimation":

          if (msgObj.idx > 5 && obj_bgm != bgm_fin) {
            // ソリの動き始めで音楽を鳴らす
            console.log("soriAnimation");
            obj_bgm = bgm_fin;
            obj_bgm.pause();
            obj_bgm.play();
            obj_bgm.animate({ volume: 1.0 }, 4000);
          }
          break;
        case "readyGo2":
          obj_bgm.animate({ volume: 0 }, 1500);
          setTimeout(function () {
            obj_bgm = bgm_play;
            obj_bgm.loop = "true";
            obj_bgm.currentTime = 0;
            obj_bgm.play();
            obj_bgm.animate({ volume: 1 }, 2000);
          }, 1500);
          break;
        default:
      }
    } catch (error) {
      document.getElementById("errorMsg").innerHTML = error;
    }
  }
});

function controller() {

  var santa_keys = { red: keys[k_red], blu: keys[k_blu], yel: keys[k_yel], gre: keys[k_gre] };
  SendMsg("message", { method: "santa_move", options: { santa_keys: santa_keys } });
}



// $(document).keydown(function(e) {
//    	santa = $("input[name='santa']:checked")[0].value;

//    	if(santa == "non"){
//    			return;
//    	}

// 		switch(e.keyCode){
// 		case k_left:
// 		    SendMsg("message", {method:"santa_move", options:{color:santa, direction:"left"}});
// 				break;
// 		case k_up:
// 		    SendMsg("message", {method:"santa_move", options:{color:santa, direction:"up"}});
// 		    break;
// 		case k_right:
// 		    SendMsg("message", {method:"santa_move", options:{color:santa, direction:"right"}});
// 				break;
// 		case k_down:
// 		    SendMsg("message", {method:"santa_move", options:{color:santa, direction:"down"}});
// 				break;
// 		}

// });

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createSanta() {
  santa = {
    UUID: "" + Math.random(),
    state: "not goal",
    x: 0,
    y: 500,
    names: "name",
    color: "red"
  }
}

// var dummy_uuids = {
//   one: {
//     color: "red"
//   },
//   two: {
//     color: "blu"
//   },
//   three: {
//     color: "yel"
//   },
//   four: {
//     color: "gre"
//   }
// }

function init() {
  socket.emit('initialize');
  // SendMsg("message", {
  //   method: "init",
  //   options: {},
  //   uuids: dummy_uuids,
  //   pos: {
  //     "red": getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500),
  //     "blu": getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500),
  //     "gre": getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500),
  //     "yel": getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500)
  //   }
  // });
  gestureStop();
}

function preBtn() {
  socket.emit('change_scene', { scene: 'pre' });
}

function titleBtn() {
  socket.emit('change_scene', { scene: 'title' });
}

function ruleBtn() {
  socket.emit('change_scene', { scene: 'rule' });
}
function toujouBtn(color) {
  socket.emit('change_scene', { scene: 'toujou', color: color, name: $("#name_" + color).val()});
  console.log("toujou send " + color);
  // SendMsg("message", {
  //   method: "toujou",
  //   options: {}, color: color,
  //   name: $("#name_" + color).val()
  // });
}

function ouenBtn() {
  socket.emit('change_scene', { scene: 'ouen' });
}

function config() {
  console.log({
    frame_per_signal: $("#config_frame_per_signal").val(),
    imgs_per_frame: $("#config_imgs_per_frame").val(),
    move_per_signal: $("#config_move_per_signal").val(),
    dist_window_santa: $("#config_dist_window_santa").val()
  });
  SendMsg("message", {
    method: "config",
    options: {
      frame_per_signal: $("#config_frame_per_signal").val(),
      imgs_per_frame: $("#config_imgs_per_frame").val(),
      move_per_signal: $("#config_move_per_signal").val(),
      dist_window_santa: $("#config_dist_window_santa").val(),
      debug_level: $("#config_debug_level").val()
    }
  });
}

function readyGo() {
  console.log('emit start');
  socket.emit('start');
  // SendMsg("message", { method: "start"});
  setTimeout(gestureStart, 2000);
}

function timeUp() {
  SendMsg("message", { method: "timeUp", options: {} });
}

function specialMove() {
  // console.log("specialMove", $("#specialmove_uuid").val())
  uuids = {};
  uuid = $("#specialmove_uuid").val();
  uuids[uuid] = uuid;
  SendMsg("message", { method: "specialMove", uuids: uuids });
}

function dev_readyGo() {
  SendMsg("message", { method: "dev_readyGo" });
}

function createDummyUsers() {
  return {
    timestamp: new Date(),
    UUIDs: [Math.random()]
  };
}

function addSanta() {
  var dummy_uuids = {};
  var colors = ["red", "yel", "blu", "gre"];
  for (var i = 0; i < 4; i++) {
    uuid = Math.floor(Math.random() * 100000);
    dummy_uuids[uuid] = { color: colors[uuid % colors.length] };
  }
  console.log("unei", dummy_uuids);
  SendMsg("message", {
    method: "addSanta",
    options: {
      uuids: dummy_uuids,
      timestamp: new Date()
    },
    uuids: dummy_uuids,
    timestamp: new Date()
  })
}

function notify_mobile() {
  msg = $("#mobile_message").val();
  console.log('mobile_message', msg);
  socket.emit('notify_mobile', { message: msg });
}

// メッセージを送る
function SendMsg(target, msg) {
  console.log('SendMsg', msg);
  socket.emit('notify_proj', { value: JSON.stringify(msg) });
  if (useCloud) {
    SendMsgCloud(target, msg);
  }
}
// 切断する
function DisConnect() {
  var msg = JSON.stringify({ method: disconnect, options: { termId: socket.io.engine.id } });
  // メッセージを発射する
  socket.emit('message', { value: msg });
  // socketを切断する
  socket.disconnect();
}

$(
  function () {
    $("#config_frame_per_signal").val(frame_per_signal);
    $("#config_imgs_per_frame").val(imgs_per_frame);
    $("#config_move_per_signal").val(move_per_signal);
    $("#config_dist_window_santa").val(dist_window_santa);
    $("#config_debug_level").val(DEBUG_LEVEL);
    $(document).keydown(function (e) {
      keys[e.keyCode] = true;
      if (e.keyCode == k_red) $("#cnt_red").css("background-color", "HotPink");
      if (e.keyCode == k_blu) $("#cnt_blu").css("background-color", "HotPink");
      if (e.keyCode == k_yel) $("#cnt_yel").css("background-color", "HotPink");
      if (e.keyCode == k_gre) $("#cnt_gre").css("background-color", "HotPink");

      // santa = $("input[name='santa']:checked")[0].value;

      if (santa == "non") {
        return;
      }
    });
    $(document).keyup(function (e) {
      if (e.keyCode == k_red) $("#cnt_red").css("background-color", "White");
      if (e.keyCode == k_blu) $("#cnt_blu").css("background-color", "White");
      if (e.keyCode == k_yel) $("#cnt_yel").css("background-color", "White");
      if (e.keyCode == k_gre) $("#cnt_gre").css("background-color", "White");
      // var uuid_keys = {
      //   one: {
      //     keys: keys[k_red]
      //   },
      //   two: {
      //     keys: keys[k_blu]
      //   },
      //   three: {
      //     keys: keys[k_yel]
      //   },
      //   four: {
      //     keys: keys[k_gre]
      //   },
      // };
      var santa_keys = {}
      if (keys[k_red]) santa_keys["red"] = keys[k_red];
      if (keys[k_blu]) santa_keys["blu"] = keys[k_blu];
      if (keys[k_yel]) santa_keys["yel"] = keys[k_yel];
      if (keys[k_gre]) santa_keys["gre"] = keys[k_gre];

      if (santa_keys) {
        // console.log(santa_keys);
        socket.emit('santa_move', { colors: santa_keys, amount: parseFloat($('#config_santa_move_ratio').val()) });
        // SendMsg("message", { method: "santa_move", options: { santa_keys: santa_keys } });
      }
      delete keys[e.keyCode];
    });
    // setInterval(controller, 100);

    // gadget の初期値を読込
    for (var color in colorToGadgetMap) {
      $("#" + color + "0gadget")[0].value = colorToGadgetMap[color][0];
      $("#" + color + "1gadget")[0].value = colorToGadgetMap[color][1];
    }

    // checkAliveする
    // setInterval(checkAlive, 5000);
  }

  // TODO: keyをqwerにして、red blu gre yel　を全部移動できるようにする
);


/////////////////////////////////////////////////////
//  ガジェットの管理に関する部分
/////////////////////////////////////////////////////
function setGadget(color, index) {
  var gadgetNum = $("#" + color + index + "gadget")[0].value;
  if (0 < gadgetNum && gadgetNum < 100) {
    colorToGadgetMap[color][index] = gadgetNum;
    updateGadegetColor(gadgetNum, color, index);
  }
}

// index.htmlとsantaのgadgetNumを同期
// color: red blu gre yel, index: 0 or 1
function updateGadegetColor(gadgetNum, color, index) {
  SendMsg("message", { method: "gadget_color_update", options: { gadgetNum: gadgetNum, color: color, index: index } });
}


function gestureStart() {
  SendMsg("gadget", { method: "gStart", options: {} });
}

function gestureStop() {
  SendMsg("gadget", { method: "gStop", options: {} });
}

function clearCount() {
  var colors = ["red", "blu", "gre", "yel"];
  for (var cidx in colors) {
    var color = colors[cidx];
    for (var index in [0, 1]) {
      $("#" + color + index + "up")[0].innerHTML = 0;
      $("#" + color + index + "byebye")[0].innerHTML = 0;
      $("#" + color + index + "rotate")[0].innerHTML = 0;
      $("#" + color + index + "recv")[0].innerHTML = 0;
      receivedCount[color][index] = 0;
    }
  }
  SendMsg("gadget", { method: "clearCount", options: {} });
}

function checkAlive() {
  var colors = ["red", "blu", "gre", "yel"];
  for (var color in colors) {
    $("#" + colors[color] + "0" + "alive")[0].innerHTML = "";
    $("#" + colors[color] + "1" + "alive")[0].innerHTML = "";
  }
  SendMsg("gadget", { method: "checkAlive", options: {} });
}
