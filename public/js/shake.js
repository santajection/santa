// var DEBUG_LEVEL = 3;
var selected_color;
// var santa_keys;

var shakeCounted = 0;
var shakeSended = 0;
var isGaming = false;
var movePerShake = 2; // 指定回数振る毎にサンタを動かすメッセージを送る


// 端末の角度が変わった時
function init_event() {
  window.addEventListener('devicemotion', function (e) {
    return furu(e);
  }, true);

}

// 端末を振ったときの挙動
function furu(e) {
    var x = e.accelerationIncludingGravity.x; // X方向の加速度
    var y = e.accelerationIncludingGravity.y; // Y方向の加速度
    var z = e.accelerationIncludingGravity.z; // Z方向の加速度

    // 加速度が一定以上のとき
    if (Math.abs(x) > 15 || Math.abs(y) > 15 || Math.abs(z) > 15) {
      shakeCounted ++;
    }
 }

function checkShake(){
  if(shakeCounted - shakeSended > movePerShake){
    // SendMsg("santa", {method:"santa_move", options:{color:color, direction:"up", times: shakeCounted - shakeSended}});
    shakeSended = shakeCounted;
    // var santa_keys = {red:undefined, blu:undefined, yel:undefined, gre:undefined};
    // santa_keys[color] = true;
    var santa_keys = {};
    santa_keys[selected_color] = true;
    SendMsg("santa", {method:"santa_move", options:{santa_keys:santa_keys, shakeCount:shakeCounted}});
    console.log(santa_keys);
    $("#debug_box").text("debug: color=" + selected_color);
  }
  // SendMsg("santa", {method:"santa_move", options:{color:"red", direction:"up"}});
  setTimeout("checkShake()",50);  
}

function setSanta(col){
    selected_color = col;
    var colors = ["red", "blu", "yel", "gre"];
    $("#debug_box").text("debug: color " + col + " was selected");
    $("input[name='santa']").val([col]);
    for (var j=0; j < colors.length; j++) {
        if (colors[j] == col) {
            console.log("color" + colors[j]);
            $("#"+colors[j]+"_select").css("background-color", "red");
        }else{
            $("#"+colors[j]+"_select").css("background-color", "");
        }
    }
  //$("input[name='santa']:checked")[0].value;
}




// 　サーバとのコネクションの作成
var socket = io.connect(SERVER + "/mobile");
// var socket = io.connect('http://192.168.0.5:3000');
socket.on('connect', function(msg) {
    console.log("あなたの接続ID:" + socket.io.engine.id);
    // console.log(socket.io.engine.id);
    $("#connectId").text("あなたの接続ID::" + socket.io.engine.id);
});
// メッセージを受けたとき
socket.on('message', function(msg) {
   // メッセージを画面に表示する
   document.getElementById("receiveMsg").innerHTML = msg.value;
   if(msg.value){
      try{
         var msgObj = JSON.parse(msg.value);
         switch(msgObj.method){
            case "init":
               init_screen();
               break;
            // case "pre":
            //    pre();
            //    break;
            // case "title":
            //    title();
            //    break;
            // case "rule":
            //    rule();
            //    break;
            // case "ouen":
            //    ouen();
            //    break;
            case "readyGo":
               readyGo();
               break;
            case "config":
             DEBUG_LEVEL = msgObj.options["debug_level"];
             break;
            case "end":
            default:
         }
      } catch (error){
         document.getElementById("errorMsg").innerHTML = error;
      }
   }
    if(DEBUG_LEVEL == 0){
        $("#debug_display").css("display", "none");
        // $("#debug_display").hide();
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




///////////////////////////////////////////////////////////////////////
// signaling
///////////////////////////////////////////////////////////////////////
function reset_screen(){
    // プレ、タイトル、説明用画像を消す
    $("#screen_pre").hide();
    $("#screen_title").hide();
    $("#screen_rule").hide();
    $("#screen_select").hide();
    $("#screen_fure").hide();
    $("#screen_ouen").hide();
};

function screen_select(){
    reset_screen();
    $("#screen_select").show();
}

function init_screen(){
    screen_select();
}
// プレ用
function pre(){
    reset_screen();
    $("#screen_pre").show();
    // $("#screen_pre").css("display", "inline");
    // $("#screen_title").css("display", "none");
    // $("#screen_rule").css("display", "none");
    // $("#screen_select").hide();
    // $("#screen_fure").hide();
};

// タイトル用
function title(){
    reset_screen();
    $("#screen_title").show();
    // $("#screen_pre").css("display", "none");
    // $("#screen_title").css("display", "inline");
    // $("#screen_rule").css("display", "none");
    // $("#screen_select").hide();
    // $("#screen_fure").hide();
};

// ルール説明用
function rule(){
    reset_screen();
    $("#screen_rule").show();
    // $("#screen_pre").css("display", "none");
    // $("#screen_title").css("display", "none");
    // $("#screen_rule").css("display", "inline");
    // $("#screen_select").hide();
    // $("#screen_fure").hide();
    // $("#screen_intro_bg").hide();
};
function ouen(){
    reset_screen();
    console.log("ouen");
    $("#screen_ouen").show();
};


function readyGo(){
    // よーい
    reset_screen();
    // $("#all_select").hide();
    $("#screen_yoi").show();

    // どん!
    setTimeout("gameStart()",3000);
}

// よーいどん用
function gameStart(){

    $("#screen_yoi").hide();
    $("#screen_don").show();
    $("#screen_don").fadeOut(2000);
    // 振れ!
    setTimeout("fureView()",2000);
}

function fureView(){
    $("#screen_fure").show();
}



$(function(){
    if (DEBUG_LEVEL == 0) {
        $("#debug_display").css("display", "none");
        // $("#debug_display").hide();
    }
    // console.log($("#anime_box"));
    // console.log($("#anime_box").css("height"));
    // console.log($(window).height());
    // $("screen_yoi").css("height", $("#anime_box").height());
    // $("screen_yoi").css("height", $(window).height());
    // $("screen_yoi").css("height", "100%");
    // $("screen_yoi").css("width", "auto");
    // $("screen_yoi").css("width", "100%");
    // $("screen_yoi").css("height", "auto");
    // function init(){
    setSanta("red");

    // $("#connectId").text("fuga");
    init_event();
    screen_select();
    // document.getElementById("connectId").innerHTML = "あなたの接続ID::" + socket.io.engine.id;

    if(DEBUG_LEVEL == 0){
        $("#connectId").hide();
        $("#receiveMsg").hide();
        $("#errorMsg").hide();
    }

    setTimeout("checkShake()",100);
    // }
});


function end(){

}
