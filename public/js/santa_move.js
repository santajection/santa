



var obj_santa;
var obj_windows;
var obj_name;
var obj_tonakai;
var obj_sori;
var obj_animebox;
var obj_up;
var obj_players = {}; // {uuid: {x, y, color, key, lock, name, signal, message}} // messageはデバッグメッセージ
var intro_santa;
var intro_name;
var WIDTH;
var HEIGHT;
var game_timer;
var window_timer;
var intro_santa_timer;
var GAMETIME_DEFAULT = 30;
var gametime = GAMETIME_DEFAULT;
var gameTimer = null;
var STATE_INIT = 0;
var STATE_MOVING = 1;
var STATE_HITTED = 2;
var STATE_GOAL = 3;
var STATE_WAIT = 4;

var STATE_CLOSED_NOT_MOVE = 5; // 窓は閉まっていてアニメーションも動いていない
var STATE_CLOSED_AND_MOVE = 6; // 窓は閉まっていてアニメーションは動いている
var STATE_OPENED = 7; // 窓は相手なくアニメーションも動いていない
var STATE_CLOSED_AND_FINISHED = 8; // 窓は一回相手もうずっと閉まっている状態

// var BGM_Communication = function(name){
//     this.name = name;
// }

// BGM_Communication.prototype.play = function(){
//     SendMsg("bgm",{name:this.name});
// }
// BGM_Communication.prototype.animate = function(attr, value){
// //        obj_bgm.animate({volume: 1}, 2000);
//     SendMsg("bgm",{name:this.name});
// }
// BGM_Communication.prototype.setValue = function(attr, value){
//     SendMsg("bgm",{name:this.name, method:attr, arg:value});

// }



// var obj_bgm;
// var bgm_play = new BGM_Communication("play");
// var bgm_hit = new BGM_Communication("hit");
// var bgm_goal = new BGM_Communication("goal");
// var bgm_yojinobori = new BGM_Communication("yojinobori");
// var bgm_warp = new BGM_Communication("warp");
// // var bgm_fin = new BGM_Communication("");
// var bgm_fin = new BGM_Communication("fin");
// var bgm_start = new BGM_Communication("start");

function moveleft(){
    console.log(obj);
    // console.log(obj.position().left);
    $(obj).animate({"left":obj.position().left + 20});
    // obj.position().left += 5;
}


var _communication_keys = {};

var keys = {};
var k_left = 37;
var k_up = 38;
var k_right = 39;
var k_down = 40;
var santa_sig = {red:{37:0,38:0,39:0,40:0}, blu:{37:0,38:0,39:0,40:0},
                 yel:{37:0,38:0,39:0,40:0}, gre:{37:0,38:0,39:0,40:0}};
var color_id = {red:1,blu:2,yel:3,gre:4};
var santa_pos = {red:undefined, blu:undefined, yel:undefined, gre:undefined};
var santa_lock = {red:false, blu:false, gre:false, yel:false};

// var santaL_src = "image/santa_pack/red_l.png";
// var santaR_src = "image/santa_pack/red_r.png";
// var tonakaiL_src = "image/santa_pack/blue_l.png";
var tonakai_src = "image/tonakai/tonakai";


var cache_images = {
    };
var num_loaded_images = 0;
var image_paths = [];
var num_images = 0;
function count_loaded_images() {
    num_loaded_images++;
}
function load_images(){
    var img_dir = "image/";
    var num_introduction_images = [0, 4, 8, 4, 18];
    // 大きい画像から読み込む
    image_paths.push(img_dir + "fin1/fin.gif");
    image_paths.push(img_dir + "fin2/fin2.gif");
    image_paths.push(img_dir + "fin1/white.png");
    image_paths.push(img_dir + "fin2/merryxmas.png");
    image_paths.push(img_dir + "setumei/pre.jpg");
    image_paths.push(img_dir + "setumei/title.jpg");
    image_paths.push(img_dir + "setumei/rule_bg_black.png");
    image_paths.push(img_dir + "setumei/ouen_bg_black.png");
    image_paths.push(img_dir + "setumei/yoi.png");
    image_paths.push(img_dir + "setumei/don.png");
    image_paths.push(img_dir + "introduction/bg_black.png");
    image_paths.push(img_dir + "others/wall.png");
    image_paths.push(img_dir + "goal/goal.png");
    for (var color in color_id){
        var i = color_id[color];
    // for (var i = 1; i <= 4; i++){
        // introduction
        for (var j = 1; j <= num_introduction_images[i]; j++){
            image_paths.push(img_dir + "introduction/introduction"+i+"/" +j +".png");
        }
        // window
        for (var j = 1; j <= 26; j++){
            image_paths.push(img_dir + "window/" +j +".png");
        }

        // santa 本体
        for (var j = 1; j <= 10; j++){
            image_paths.push(img_dir + "santa" + i + "/"+ j +".png");
        }

        // santa hit
        for (var j = 1; j <= 2; j++){
            image_paths.push(img_dir + "down" + i + "/"+ j +".png");
        }

        // santa goal
        for (var j = 1; j <= 7; j++){
            image_paths.push(img_dir + "goal" + i + "/"+ j +".png");
        }

        // santa sori ride
        for (var j = 1; j <= 11; j++){
            image_paths.push(img_dir + "up" + i + "/"+ j +".png");
        }

        // santa warp
        for (var j = 1; j <= 11; j++){
            image_paths.push(img_dir + "warp" + i + "/"+ j +".png");
        }
    }
    // sleigh
    for (var j = 1; j <= 8; j++){
        image_paths.push(img_dir + "sleigh1/"+ j +".png");
    }
    image_paths.push(img_dir + "sleigh1/sleigh.png");
    // sleigh
    for (var j = 1; j <= 13; j++){
        image_paths.push(img_dir + "rope/"+ j +".png");
    }
    // num timer
    for (var j = 0; j <= 30; j++){
        image_paths.push(img_dir + "num/"+ j +".png");
    }
    num_images = image_paths.length;
    for (var j = 0; j < image_paths.length; j++){
        var new_img = new Image();
        new_img.onload = count_loaded_images;
        new_img.src = image_paths[j];
        cache_images[i+new_img.src] = new_img;
    }
}


function change_image_src(obj_img, id){
    // 連番の画像ソースについて数字部分をidに変更
    // console.log("change_image_src:"+id);
    cur_image_src = obj_img.attr("src");
    var num_start = cur_image_src.lastIndexOf("/") + 1;
    var num_end = cur_image_src.lastIndexOf(".png");
    var new_src = cur_image_src.substring(0, num_start) + id + cur_image_src.substring(num_end);
    // console.log("new_src:"+new_src);
    obj_img.attr({
        src: new_src
    });
    // console.log(res);
}
function next_image_src(cur_image_src, num_image){
    // 1.png, 2.png, ..., 10.pngの順番で次の画像パスを返す
    // console.log("cur_image_src=" + cur_image_src);
    var num_start = cur_image_src.lastIndexOf("/") + 1;
    var num_end = cur_image_src.lastIndexOf(".png");
    var next_num = (Number(cur_image_src.substring(num_start, num_end)) + 1) % num_image;
    next_num = Math.max(1, next_num);
    // console.log("num_start=" + num_start + " num_end=" + num_end);
    // console.log("next_num="+next_num);
    var res = cur_image_src.substring(0, num_start) + next_num + cur_image_src.substring(num_end);
    // console.log(res);
    return res;
}

function debug(){
    if (DEBUG_LEVEL == 0) return;
    // console.log(_communication_keys)
    for (var uuid in obj_players) {
        //console.log("debug", color);
        // santa_pos[color] = $("<p>");
        obj_players[uuid].img.css("top", obj_players[uuid].img.css("top"));
        obj_players[uuid].img.css("left", obj_players[uuid].img.css("left"));
        // santa_pos[color].css("top", obj_santa[color].css("top"));
        // santa_pos[color].css("left", obj_santa[color].css("left"));
        var str = uuid +
            " top:" + obj_players[uuid].img.css("top") +
            " left:" + obj_players[uuid].img.css("left");
        obj_players[uuid].message = str;
        // console.log(uuid, str)
        // santa_pos[color].text(str);
    }
}

function santamove(player, direction){

    // 1回呼ばれる毎にシグナルを追加する
    player.signal[direction] += 1;

    if(player.lock){
        return;
    }

    // 動きカウンタがしきい値以上ならば動かす
    var sum = 0;
    for (d in player.signal) {
        sum += player.signal[d];
    }
    // var sum = santa_sig[color][k_up] + santa_sig[color][k_down] + santa_sig[color][k_right] + santa_sig[color][k_left];
    if (sum >= frame_per_signal){

        // アニメーション制御間隔：　設定値「1回の切替枚数imgs_per_frame」×100ms毎にアニメーションを制御する
        player.lock = true;
        setTimeout(function(){
            player.lock = false;
        }, imgs_per_frame * 100);

        //
        // シグナルの整理と相殺
        //

        // 下向きと右向きのシグナルの総和を数える
        var left_count = player.signal.k_right - player.signal.k_left;
        var top_count  = player.signal.k_down - player.signal.k_up;
        if (left_count > 0) {
            player.signal[k_right] = player.signal.k_right - player.signal.k_left;
            player.signal[k_left] = 0;
        } else {
            player.signal[k_right] = 0;
            player.signal[k_left] = player.signal.k_left - player.signal.k_right;
        }
        if (top_count > 0) {
            player.signal[k_down] = player.signal.k_down - player.signal.k_up;
            player.signal[k_up] = 0;
        } else {
            player.signal[k_down] = 0;
            player.signal[k_up] = player.signal.k_up - player.signal.k_down;
        }

        //
        // 動作1 上下左右への動き
        //

        // デフォルトでは来た数だけ進める
        var left_offset = left_count;
        var top_offset = top_count;

        // シグナルが3つ以上が来ていたら、来たシグナルの半分を消費し、残りは次回に持ち越すことにする
        if(Math.abs(top_count) > 2){
            top_offset = (top_count > 0) ? Math.ceil(top_count / 2) : Math.floor(top_count / 2);
        }
        if(Math.abs(left_count) > 2){
            left_offset = (left_count > 0) ? Math.ceil(left_count / 2) : Math.floor(left_count / 2);
        }

        // たくさんシグナルが来れば来るほどたくさん進む
        player.img.animate(
            {
                left: "+=" + move_per_signal * left_offset,
                top:  "+=" + move_per_signal * top_offset
            }
            , imgs_per_frame * 100
        );

        // 進んだ分だけシグナルを消費する
        if(top_count > 0) {
            player.signal.k_down -= top_offset;
        } else {
            player.signal.k_up -= Math.abs(top_offset);
        }
        if(left_count > 0) {
            player.signal.k_right -= left_offset;
        } else {
            player.signal.k_left -= Math.abs(left_offset);
        }

        //
        // 動作2 画像の差し替えによる手のもがき
        //

        // 動きカウンタがしきい値の2倍以上なら2倍速く動かす
        var santa_speed = (sum >= frame_per_signal * 2) ? 2 : 1.4;

        // 画像の差替
        for(var idx = 1; idx <= imgs_per_frame * santa_speed; idx++){
            setTimeout(function(){
                if(player.state == STATE_MOVING){
                    player.img.attr({
                        src: next_image_src(player.img.attr("src"), 10) //10枚で1周期
                    });
                }
            }, 100 * idx / santa_speed); // 基本は100msごとに画像変更。2倍速なら50ms毎に画像変更。
        }
    }
}

function santa_warp(color){
    // サンタをワープさせる
    // 1. ロープで上方画面外へ
    // 2. 上方画面外からそりへ
}

function santa_goal_anime(color){
    // サンタよじ登りアニメーション
    // console.log("santa_goal_anime:" + obj_santa[color].image_id);
     if (obj_santa[color].image_id >= 12){
        obj_santa[color].image_id = 0;
        santa_goal_sori_ride(color);
    } else {
        if (obj_santa[color].image_id % 3 == 0){
            SendMsg("unnei",{name:"yojinobori",method:"play"});
            //bgm_yojinobori.play();
        }
        change_image_src(obj_santa[color], obj_santa[color].image_id);
        obj_santa[color].image_id++;
        setTimeout(function(){santa_goal_anime(color);}, 100);
        // setTimeout("santa_goal_anime("+color+")", 100);
    }
}

function santa_goal1(color){
    // 状態変更(操作不可に)
    // よじのぼり
    // そりへ座る
    // 状態変更(手を触れるように)
    obj_santa[color].state = STATE_WAIT;
    obj_santa[color].attr({src:"image/up" + obj_santa[color].id +"/1.png"});
    console.log("santa_goal1");
    santa_goal_anime(color);
    // anime
}

function santa_goal_sori_ride(color){
    // そりに乗るまではサンタはそりの前面にいるが
    // そりに乗る時はサンタはそりの背面にいるようにする
    obj_name[color].hide();
    obj_santa[color].css('z-index', Number($("#sori").css('z-index'))-1);
    console.log("color's z-index" + obj_santa[color].css('z-index'));
    // そりに乗る
    SendMsg("unnei",{name:"goal",method:"play"});
    //    bgm_goal.play();
    if (obj_santa[color].image_id == 0){
        // 初期化処理
        obj_santa[color].css("left", 370 + 50 * obj_santa[color].id);
        obj_santa[color].css("bottom", 940);
        obj_santa[color].css("top", "auto");
        obj_santa[color].css("z-index", 1000);
        obj_santa[color].image_id = 1;
    }
     if (obj_santa[color].image_id > 7){
         obj_santa[color].state = STATE_GOAL;
         if (gameTimer){
             // 時間切れでなくそりに乗る時はゴールテキストを表示
             showGoalText(color);
             var all_player_goal = true;
             for(var color2 in obj_santa){
                 if (obj_santa[color2].state != STATE_GOAL) {
                     all_player_goal = false;
                 }
             }
             if (all_player_goal) {
                 // 全員がゴールしたなら
                 // 若干のタイムラグ後，タイムアップする
                 timeUp();
                 // setTimeout(function(){timeUp();}, 500);
             }
         }
        // obj_santa[color].image_id = 1;
        // santa_goal_end(color);
    } else {
        obj_santa[color].attr({
            src:"image/goal" + obj_santa[color].id + "/" + obj_santa[color].image_id + ".png"
            });
        // change_image_src(obj_santa[color], obj_santa[color].image_id);
        obj_santa[color].image_id++;
        setTimeout(function(){santa_goal_sori_ride(color);}, 100);
        // setTimeout("santa_goal_anime("+color+")", 100);
    }
}

function showGoalText(color){
    var goal_text = $("<img class='goal_text'>").attr("src", "image/goal/goal.png");
    goal_text.css("position", "absolute");
    var step = (WIDTH - SANTA_MARGIN) / 4;
    goal_text.appendTo(obj_animebox);
    goal_text.css("top", 200);
    console.log("color_id["+color+"]="+color_id[color] + " margin="+SANTA_MARGIN);
    console.log(color_id[color] * step);
    goal_text.css("left", 20 + SANTA_MARGIN + (color_id[color]-1) * step );
}

var hit_animation_num_iterate = 30;
function hit_animation(player, prev_src){
    if (!gameTimer) {
        // 時間切れの時には強制終了
        return;
    }
    if (player.image_id >= hit_animation_num_iterate){
        player.image_id = 1;
        player.img.attr({src:prev_src});
        player.state=STATE_MOVING;
    }else{
        // console.log(obj_santa[color]);
        change_image_src(player.img, (player.image_id % 2)+1);
        player.image_id++;
        setTimeout(function(){hit_animation(player, prev_src);}, 100);
    }
}

function santa_hitstop(player){
    // トナカイとぶつかった時のモーション
    // 操作不可
	  var pos_top = px2int(player.img.css("top"));
    player.img.animate({top: pos_top + 200}, 300);
    set_name_pos(player);
    var prev_src = player.img.attr("src");
    // console.log(id);
    // var down_src = "image/down" + id + "/down" + id + ".png";
    player.img.attr({src:"image/down" + player.image_id + "/1.png"});
    //console.log(bgm_hit);
    SendMsg("unnei",{name:"hit",method:"play"});
    //    bgm_hit.play();
    hit_animation(player, prev_src);
}


function px2int(pxstr){
    return Number(pxstr.substr(0, pxstr.length-2));
}

function goalAnimation(color){
    obj_name[color].hide();
    // とりあえずはゴールの表示だ
    // goal_text.appendTo($("#game_box"));
    santa_goal1(color);
    // clearInterval(game_timer);

    // ゴールに到達した時の処理

    // 一番のサンタがよじ登る

    // 他のサンタはロープを使ってワープする

    // そりに乗る

    // そりが動く

    // 終わりナレーション

}

var window_anime_step = [
    // [2, 0.1], [3, 0.1], [4, 0.1], [5, 0.1], [6, 0.2], // 0.6
    [2, 0.5], [3, 0.1], [4, 0.1], [5, 0.1], [6, 0.2], // 0.6
    [7, 0.1], [8, 0.1], [9, 0.1], [10, 1.0], // 1.3
    [11, 0.1], [12, 0.1], [13, 0.1], [6, 0.2], // 0.5
    [14, 0.1], [15, 0.1], [16, 0.1], [17, 0.2], // 0.5
    [18, 0.1], [19, 0.1], [20, 0.1], [21, 0.1], // 0.4
    [22, 0.1], [23, 0.1], [24, 0.1], [25, 1.0], // 1.3
    [24, 0.1], [23, 0.1], [22, 0.1], [21, 0.1], // 0.4
    [20, 0.1], [19, 0.1], [18, 0.1], [17, 0.1], // 0.4
    [15, 0.1], [14, 0.1], [26, 0.1], [6, 0.2], // 0.5
    [5, 0.1], [4, 0.1], [3, 0.1], [2, 0.1] // 0.4
]; // 全部で6.3sec

// windowのアニメーション
function moveWindowColor(color){
    // console.log("movewindow color:"+color + obj_window[color].image_id);
    if (obj_windows[color].image_id >= window_anime_step.length){
        obj_windows[color].image_id = 1;
        change_image_src(obj_windows[color], obj_windows[color].image_id);
        obj_windows[color].state = STATE_CLOSED_AND_FINISHED;
    }else {
        var image_id = window_anime_step[obj_windows[color].image_id][0];
        var wait_time = window_anime_step[obj_windows[color].image_id][1];
        if (image_id  >= 20 && image_id < 26){
            // 窓が開いた
            obj_windows[color].state = STATE_OPENED;
            // for debug
            // obj_window[color].css("border-width", "10px");
            // obj_window[color].css("border-color", "#000000");
            // obj_window[color].css("border-style", "solid");
        }else {
            obj_windows[color].state = STATE_CLOSED_AND_MOVE;
            // obj_window[color].css("border-width", "");
            // obj_window[color].css("border-color", "");
            // obj_window[color].css("border-style", "");
        }
        change_image_src(obj_windows[color], image_id);
        obj_windows[color].image_id += 1;
        setTimeout(function(){moveWindowColor(color);}, wait_time*1000);
    }
}

function moveWindow(){
    // ランダムでウインドウを動かす
    var id = getRandomInt(0, 3);
    // id = 0 // for debug
    var color = Object.keys(obj_windows)[id];
    if (obj_windows[color].state == STATE_CLOSED_NOT_MOVE) {
        obj_windows[color].id = 1;
        obj_windows[color].state = STATE_CLOSED_AND_MOVE;
        moveWindowColor(color);
    } else{
    console.log("moveWindow:" + color + " was selected, but it still be running");
    }
}

function movePlane() {
    debug();
    if (!gameTimer){
        // タイマーが動いていない時は何もしない
        return;
    }
    var move_keys = _communication_keys;
    // for(var direction in keys){
    //     if (!keys.hasOwnProperty(direction)) continue;
    //     move_keys.red[direction] = true;
    // }
    _communication_keys = {};
    for (var uuid in move_keys) {
        console.log(uuid, move_keys[uuid]);
        var player = obj_players[uuid]
        var toppos = px2int(player.img.css("top"));
        var windowpos = px2int(player.img.css("top"));
        var obj_window = obj_windows[player.color];
        var window_bottom_pos = windowpos + px2int(obj_window.css("height"));

        // console.log(obj_window[color].state);
        // if (color == "red"){
        // console.log("toppos="+toppos + " windowpos="+windowpos);
        //     }
        if (obj_window.state != STATE_CLOSED_AND_FINISHED &&
            obj_window.state == STATE_CLOSED_NOT_MOVE &&
            Math.abs(toppos - window_bottom_pos) < dist_window_santa) {
            // console.log("hoge");
            obj_window.id = 1;
            obj_window.state = STATE_CLOSED_AND_MOVE;
            moveWindowColor(player.color);
        }

        if (toppos <= GOAL_LINE && player.state == STATE_MOVING){
            player.img.stop();
            goalAnimation(player.color); //todo
            // alert();
        }
        if (player.state == STATE_MOVING &&
            obj_window.state == STATE_OPENED &&
            windowpos + 100 <= toppos && toppos <= windowpos + 250){
            // トナカイとぶつかった
            console.log("HITTED:" + player.state);
            player.state = STATE_HITTED;
            player.img.stop();
            santa_hitstop(player);
        }

        if (player.state == STATE_MOVING){

            for (var direction in move_keys[uuid]) {
                // シグナルが入っていないような異常系は除外
                if (!move_keys[uuid].hasOwnProperty(direction)) continue;

                // サンタを上下左右に動かす
                santamove(player, direction);

                // 上下左右にはみ出さないように補正
                if (px2int(player.img.css("top")) < 0) player.img.css("top", 0);
                if (px2int(player.img.css("left")) < 0) player.img.css("left", 0);
                // 下方向だけははみ出しても良いようにする？
                // if (px2int(obj_santa[color].css("top")) > HEIGHT - px2int(obj_santa[color].css("height"))) obj_santa[color].css("top", HEIGHT - px2int(obj_santa[color].css("height")));
                if (px2int(player.img.css("left")) > WIDTH - px2int(player.img.css("width"))) player.img.css("left", WIDTH - px2int(player.img.css("width")));

            }
        }
            if (player.state != STATE_WAIT){
                set_name_pos(player);
            }
    }
}

// santaの位置から逆算して、名前の表示を動かす
function set_name_pos(player){
    // console.log(obj_santa[color].css("left"));
    var left = px2int(player.img.css("left")) + px2int(player.img.css("width")) / 2 - px2int(player.name.css("width")) / 2 - 10;
    // console.log(obj_santa[color].css("left"));
    var top = px2int(player.img.css("top")) + px2int(player.img.css("height")) + 30;

    // console.log(obj_name[color].css("left") + " " + left);
    player.name.css("left", left);
    var name_height = px2int(player.name.css("height"));
    if (top + name_height + 20 > HEIGHT){
        top = HEIGHT - name_height - 20;
    }
    player.name.css("top", top);
}

function reset_santa_pos(){
    // サンタの位置を初期値（中央に移動）
    // var MARGIN = 50;
    var step = (WIDTH - SANTA_MARGIN) / 4;
    // var top  = 700;
    var top  = 900;
    var left = SANTA_MARGIN;
    console.log("step" + step);
    for (var uuid in obj_players){
        obj_players[uuid].img.css("left", left);
        obj_players[uuid].img.css("top", top);
        set_name_pos(obj_players[uuid]);
        // obj_name[color].css("left", left + 30);
        // var santa_bottom_pos = px2int(obj_santa[color].css("top")) + px2int(obj_santa[color].css("height"));
        // obj_name[color].css("top", santa_bottom_pos + 30);
        left += step;
    }
}
function getRandomInt(min, max) {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
}
function reset_window_pos(pos){
    // サンタの位置を初期値（中央に移動）
    console.log("reset_window_pos");
    // var step = (WIDTH - 2 * MARGIN) / 4;
    var step = (WIDTH -  SANTA_MARGIN) / 4;
    var left = SANTA_MARGIN;
    for (var color in obj_windows){
        // console.log("step" + step);
        obj_windows[color].css("left", left);
        // obj_window[color].css("top", getRandomInt(GOAL_LINE + MARGIN * 2, 500));
        obj_windows[color].css("top", pos[color]);
        left += step;
    }
}

function show_santa_stats(){
    for (var color in obj_santa){
        var top = obj_santa[color].css("top");
        var left = obj_santa[color].css("left");
        var width = obj_santa[color].css("width");
        var height = obj_santa[color].css("height");

        console.log("top=" + top + " left=" + left + " width=" + width + " height"+ height);
    }
}

// funcがtrueの間処理を止める，間隔はinterval msec
function waitUntil(func, interval, callback) {
    // if (func() == true) waitUntil(func, interval);
    // else {
    //     }
    setTimeout(function(){
        console.log("num_loaded_images=" + num_loaded_images);
        // $("#prepare_message").text("Image Loading " + num_loaded_images + " / " + num_images + "");
        $("#prepare_message").text("Image Loading " + parseInt(100.0 * num_loaded_images / num_images, 10) + " %");
        console.log("num_loaded_images=" + num_loaded_images);
        if (func() == true) waitUntil(func, interval, callback);
        else {
            setTimeout(function(){
                $("#prepare_box").fadeOut("1000");
                setTimeout(callback, 1000);
            }, 500);
        }
    }, interval);
}
function setImages(){
    $("#anime_box").css("background-image", "url(image/others/wall.png)");
    $("#sori").attr({src:"image/sleigh1/sleigh.png"});
    $("#gameTimer").attr({src:"image/num/30.png" });
    $("#screen_pre").attr({src:"image/setumei/pre.jpg"});
    $("#screen_title").attr({src:"image/setumei/title.jpg"});
    $("#screen_rule").attr({src:"image/setumei/rule_bg_black.png"});
    $("#screen_ouen").attr({src:"image/setumei/ouen_bg_black.png"});
    $("#screen_intro_bg").attr({src:"image/introduction/bg_black.png"});
    $("#santa_intro").attr({src:"image/introduction/introduction1/1.png"});
    $("#santa_rope").attr({src:"image/rope/1.png"});
    $("#screen_yoi").attr({src:"image/setumei/yoi.png"});
    $("#screen_don").attr({src:"image/setumei/don.png"});
    $("#screen_fin1").attr({src:"image/fin1/fin.gif"});
    $("#screen_white").attr({src:"image/fin1/white.png"});
    $("#screen_fin2").attr({src:"image/fin2/fin2.gif"});
    $("#merryxmas").attr({src:"image/fin2/merryxmas.png"});
    // $("#").attr({src:""});
    // $("#").attr({src:""});
    // $("#screen_ouen").attr({src:"image/setumei/ouen_bg_black.png"});




    $("#window_red").attr({src:"image/window/1.png"});
    $("#window_blu").attr({src:"image/window/1.png"});
    $("#window_gre").attr({src:"image/window/1.png"});
    $("#window_yel").attr({src:"image/window/1.png"});

    // $("#santa_red").attr({src:"image/santa1/1.png"});
    // $("#santa_blu").attr({src:"image/santa2/1.png"});
    // $("#santa_gre").attr({src:"image/santa4/1.png"});
    // $("#santa_yel").attr({src:"image/santa3/1.png"});
}

$(function(){
    console.log($("#game_box"));
    load_images();
    // console.log(num_images);
    dummy_uuids = {
        "one": {
            color: "red"
        },
        "two": {
            color: "yel"
        },
        "three": {
            color: "blu"
        },
        "four": {
            color: "gre"
        }
    };
    waitUntil(function(){
        return num_loaded_images < num_images;
    }, 150, function(){
        setImages();
        init(dummy_uuids)});
    // $("#game_box").mask("Waiting...", 1000);
});

var colorid = { "red": 1, "blu": 2, "yel": 3, "gre": 4 };

function createUser(uuid, color) {
    body = document.getElementById("anime_box");
    // div = body.createElement("div")
    div = document.createElement('img');
    div.id = "img-" + uuid;
    body.appendChild(div);
    obj = $("#" + div.id)
    css_config = [
        ["position", "absolute"],
        ["left", "0px"],
        ["top", "16px"],
        ["z-index", "5000"]]
    for (var i = 0; i < css_config.length; i++) {
        obj.css(css_config[i][0], css_config[i][1]);
    }
    // obj.css("position", "absolute");
    // obj.css("left", "0px");
    // obj.css("top", "16px");
    // obj.css("z-index", "5000");

    namediv = document.createElement('div');
    namediv.id = "name-" + uuid;
    body.appendChild(namediv);
    obj_name = $("#" + namediv.id)
    obj_name.addClass("name")
    for (var i = 0; i < css_config.length; i++) {
        obj_name.css(css_config[i][0], css_config[i][1]);
        obj_name.text(uuid)
    }
    document.getElementsByTagName("body").item(0);

    return {
        x: 0,
        y: 0,
        color: color,
        key: null,
        lock: false,
        name: obj_name,
        signal: {k_up: 0, k_down: 0, k_left: 0, k_right: 0},
        message: "None",
        img: obj,
        state: STATE_INIT,
        image_id: 1,
        img_dir: colorid[color] // [1,2,3,4]
    };
}

function init(uuids,window_pos){
    // function init1() {
        // $("#prepare_box").hide();
        $("#game_box").fadeIn("100");
        $("#game_box").show();
        console.log("image loaded");
        if(DEBUG_LEVEL == 0){
            $("#connectId").hide();
            $("#receiveMsg").hide();
            $("#errorMsg").hide();
        }

        // 各種オブジェクトの初期化
        for (uuid in uuids) {
            obj_players[uuid] = createUser(uuid, uuids[uuid].color)
            obj_players[uuid].img.attr("src","image/santa" + obj_players[uuid].img_dir + "/1.png");
            obj_players[uuid].img.show()
        }
        window_pos = {
                "red":getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500),
                "blu":getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500),
                "gre":getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500),
                "yel":getRandomInt(GOAL_LINE + SANTA_MARGIN * 2, 500)
        };
        obj_windows = {
            red : $("#window_red"),
            blu : $("#window_blu"),
            yel : $("#window_yel"),
            gre : $("#window_gre")
        };
        // シグナルカウンタを初期化
        // for(var color in santa_sig){
        //     santa_sig[color][k_up] = 0;
        //     santa_sig[color][k_down] = 0;
        //     santa_sig[color][k_left] = 0;
        //     santa_sig[color][k_right] = 0;
        // }
        // for (var color in obj_window){
        //     // name
        //     obj_name[color].text(names[color]);
        //     obj_name[color].show();
        //     set_name_pos(color);

        //     // window
        //     obj_window[color].image_id = 1;
        //     obj_window[color].state = STATE_CLOSED_NOT_MOVE;
        // }
        // 画像の読み込みタイミングによって位置がずれるので少し待つ
        setTimeout(function(){
            for (var color in obj_windows){
                // window
                obj_windows[color].image_id = 1;
                obj_windows[color].state = STATE_CLOSED_NOT_MOVE;
            }
            for (var uuid in obj_players) {
                // name
                // obj_players[uuid].name.text(uuid);
                obj_players[uuid].img.show();
                set_name_pos(obj_players[uuid]);
            }
        }, 50);


        intro_santa = $("#santa_intro");
        intro_name = $("#name_intro");
        // obj_tonakai = $("#tonakai");

        obj_sori = $("#sori");
        obj_animebox = $("#anime_box"); // ゲーム画面全体
        WIDTH = px2int(obj_animebox.css("width"));
        HEIGHT = px2int(obj_animebox.css("height"));

        if (DEBUG_LEVEL > 0){
            for (var uuid in obj_players){
                santa_pos[uuid] = $("<p>");
                santa_pos[uuid].appendTo(obj_animebox);
            }
        }

        // 画面配置

        reset_screen();
        reset_santa_pos();
        reset_window_pos(window_pos);
        toujou_end();

        $("#anime_box").css("top",0);
        // ソリ
        obj_sori.css("zoom", 1);
        obj_sori.css("left",150);
        obj_sori.css("top",0);
        obj_sori.attr("src","image/sleigh1/sleigh.png");
        obj_sori.removeClass("refrect");

        SendMsg("unnei",{name:"obj_bgm",method:"pause_if_exist"});
        // if(obj_bgm){
        //     obj_bgm.pause();
        // }

        $(document).keydown(function(e) {
            keys[e.keyCode] = true;

            $(document).keyup(function(e) {
                delete keys[e.keyCode];
            });
        });

        // timer
        initGameTimer();
        if (game_timer == undefined){
            game_timer = setInterval(movePlane, 20);
        }
        // moveWindow();
        // if (DEBUG_LEVEL > 0){
        //     window_timer = setInterval(moveWindow, 2300);
        // }
        // $("#game_box").show();
        // $("#game_box").fadeIn("200");
    // }
    // while(num_loaded_images < num_images) {
    //     console.log("num_loaded_images=" + num_loaded_images);
    // }
}

///////////////////////////////////////////////////////////////////////
// GameTimer
///////////////////////////////////////////////////////////////////////
function initGameTimer(){
    if(gameTimer){
        clearInterval(gameTimer);
        gameTimer = null;
    }
    gametime = GAMETIME_DEFAULT;
    $("#gameTimer").attr("src","image/num/30.png");
}

function startGameTimer(){
    if (!gameTimer){
        gameTimer = setInterval("timeSpend()",1000);
        // gameTimer = setInterval("timeSpend()",300); // for debug
    }
}

function timeSpend(){
    gametime--;
    $("#gameTimer").attr("src","image/num/" + gametime + ".png");
    if(gametime < 1){
        timeUp();
    }
}

function timeUp(){
    if(gameTimer){
        clearInterval(gameTimer);
        gameTimer = null;
    }
    if (game_timer){
        clearInterval(game_timer);
        game_timer = null;
    }
    clearInterval(window_timer);
    window_timer = null;

    SendMsg("unnei",{name:"obj_bgm",method:"pause_if_exist"});
    // if(obj_bgm){
    //     obj_bgm.pause();
    // }

    // ヒット時のアニメーションの完了を待ってワープモーションに移る
    // setTimeout(function(){warp();}, 500);

    // debug
    // xmas();
    // return;
    var all_player_goal = true;
    for(var color2 in obj_santa){
        if (obj_santa[color2].state != STATE_GOAL) {
            all_player_goal = false;
        }
    }
    if (!all_player_goal){
        setTimeout(function(){warp();}, 1000);
    }else{
        setTimeout(function(){soriAnimationStart();}, 1000);
    }
}

function warp(){
    for(var color in obj_santa){
        // console.log("warp santa:" + color + " state is " + obj_santa[color].state);
        if((obj_santa[color].state == STATE_INIT) || (obj_santa[color].state == STATE_MOVING) || (obj_santa[color].state == STATE_HITTED)){
            // console.log("santa:" + color + " warps");
            obj_santa[color].state = STATE_WAIT;
            obj_santa[color].warp = 2;
            var top = parseInt(obj_santa[color].css("top"));
            // obj_santa[color].hide();
            obj_santa[color].attr("src","image/warp" + obj_santa[color].id + "/1.png");
            obj_santa[color].css("top", top - 900);
//            obj_santa[color].show();
        }
    }
    setTimeout(function(){warpAnimation1();},100);
    console.log("warp");
}

function warpAnimation1(){
    // 本当はwarpに書くべきだが、なぜか上に書くとゴミが写るのでここで記述
    // for(var color in obj_santa){
    //     if(obj_santa[color].state == STATE_WAIT){
    //         obj_santa[color].show();
    //     }
    // }
    $("#santa_rope").show();
    setTimeout(function(){rope1(1);},100);

}

// 1 2 3 4 5
function rope1(ropeIdx){
    $("#santa_rope").attr("src","image/rope/" + ropeIdx + ".png");
    if(ropeIdx < 5){
        ropeIdx ++;
        setTimeout(function(){rope1(ropeIdx);},100);
    } else {
        setTimeout(function(){rope2(0);},100);
    }
}

// 6 7 6 7 6 7 8 9
function rope2(idx){
    if(idx % 2 == 0){
        $("#santa_rope").attr("src","image/rope/6.png");
    } else {
        $("#santa_rope").attr("src","image/rope/7.png");
    }
    if(idx < 7){
        idx ++;
        setTimeout(function(){rope2(idx);},200);
    } else {
        setTimeout(function(){
            $("#santa_rope").attr("src","image/rope/8.png");
            setTimeout(function(){
                $("#santa_rope").attr("src","image/rope/9.png");
                setTimeout(function(){rope3(0);},100);
                for(var color in obj_santa){
                    // console.log(color);
                    if(obj_santa[color].state == STATE_WAIT){
                        setTimeout("warpAnimation2(\"" + color + "\")",800);
                    }
                }
            });
        });
    }
}

// rope: (10 11) x 6 (santa:1~12と同時)
function rope3(idx){
    if(idx % 2 == 0){
        $("#santa_rope").attr("src","image/rope/10.png");
    } else {
        $("#santa_rope").attr("src","image/rope/11.png");
    }
    if(idx < 12){
        idx ++;
        setTimeout(function(){rope3(idx)},100);
    } else {
        setTimeout(function(){rope4(0)},100);
    }

}

// santa: 1 ~ 12
function warpAnimation2(color){
    // console.log(color);
    // console.log("ここがバグとみた！！color=" + color + " warp="+obj_santa[color].warp);
    obj_santa[color].attr("src","image/warp" + obj_santa[color].id + "/" + obj_santa[color].warp + ".png");
    obj_santa[color].warp = obj_santa[color].warp + 1;
    if(obj_santa[color].warp < 12){
        setTimeout(function(){warpAnimation2(color);},100);
    } else {
        setTimeout(function(){
            SendMsg("unnei",{name:"warp",method:"obj_overwrite"});
            // obj_bgm = bgm_warp;
            // obj_bgm.play();

            obj_santa[color].animate({top:-1440},2000);
            obj_name[color].animate({top:-1440},2800);
            setTimeout(function(){warpAnimation3(color);},2100);
        },400);
    }
}

// rope: (12 13) x 10 (santa:12の引き上げと同時 santa.animate 2000)
function rope4(idx){
    if(idx % 2 == 0){
        $("#santa_rope").attr("src","image/rope/12.png");
    } else {
        $("#santa_rope").attr("src","image/rope/13.png");
    }
    if(idx < 20){
        idx ++;
        setTimeout(function(){rope4(idx)},100);
    } else {
        // 10 9 8 3 2 1
        setTimeout(function(){rope5(0)},100);
    }

}

// rope: 10 9 8 3 2 1
function rope5(idx){
    if(idx == 0){
        $("#santa_rope").attr("src","image/rope/10.png");
    } else if (idx == 1){
        $("#santa_rope").attr("src","image/rope/9.png");
    } else if (idx == 2){
        $("#santa_rope").attr("src","image/rope/8.png");
    } else if (idx == 3){
        $("#santa_rope").attr("src","image/rope/3.png");
    } else if (idx == 4){
        $("#santa_rope").attr("src","image/rope/2.png");
    } else {
        $("#santa_rope").attr("src","image/rope/1.png");
        setTimeout(function(){warpAnimationEnd();},2000);
        return;
    }

    idx++;
    setTimeout(function(){rope5(idx);},100);
}

// 上からサンタが落ちてくる
function warpAnimation3(color){
    obj_santa[color].image_id = 0;
    santa_goal_sori_ride(color);
}

function warpAnimationEnd(){
    soriAnimationStart();
}
function soriAnimationStart(){
    console.log("sori move");
    obj_sori.image_id = 1;
    obj_sori.attr("src","image/sleigh1/1.png");
    //$("#sori").animate({left:-1080},2000,endAnimationBigSoriMove);
    //$("#santa_rope").animate({left:-1080},2000);

    $("#santa_rope").hide();
    for (var color in obj_santa){
        obj_santa[color].hide();
    }
    setTimeout("soriAnimation()",100);
}

function soriAnimation(){
    // ソリの動き始めアニメーションフレームアウトまで
    var idx = obj_sori.image_id;
    SendMsg("unnei",{name:"fin", idx:idx, method:"soriAnimation"});

    // if (idx > 5 && obj_bgm != bgm_fin){
    //     // ソリの動き始めで音楽を鳴らす
    //     console.log("soriAnimation");
    //     obj_bgm = bgm_fin;
    //     obj_bgm.pause();
    //     obj_bgm.play();
    //     obj_bgm.animate({volume: 1.0}, 4000);
    // }
    if(idx < 32){
        obj_sori.image_id++;
        var left = parseInt(obj_sori.css("left"));
        obj_sori.attr("src","image/sleigh1/" + (idx % 8 + 1)+ ".png");
        obj_sori.css("left", (left - idx * 2));
        setTimeout("soriAnimation()",100)
    } else {
        //obj_sori.animate({left:-1080},1000,soriAnimationBigSoriMove);
        setTimeout("soriAnimationBigSoriMove()",1000);
    }
}

function soriAnimationBigSoriMove(){
    console.log("soriAnimationBigSori");
    console.log(sori);
    obj_sori.addClass("refrect");
    obj_sori.css("zoom", 3);
//    sori.css("left", 1100);
    obj_sori.css("top", 100);
    obj_sori.animate({left:500,top:0},5000, xmas);
}



function xmas(){
    // 終わりナレーション
//    obj_bgm.pause();

    SendMsg("gadget", {method:"gStop", options:{}});

    // obj_bgm = bgm_fin;
    // obj_bgm.load();
    // obj_bgm.play();
    $("#anime_box").animate({top:"1080px"}, 1500);

    $("#screen_fin2").show();

    setTimeout(function(){
      var now = (+ new Date());
      $("#screen_fin1").attr('src', 'image/fin1/fin.gif?' + now);
      $("#screen_fin1").fadeIn("slow");

      setTimeout(function(){
          $("#screen_white").fadeIn(1000);
        // $("#screen_fin1").fadeOut("1300");

        setTimeout(function(){
            $("#screen_fin1").hide();
            $("#screen_white").fadeOut(500);
          $("#merryxmas").fadeIn("slow");
          // $("#white_box").fadeIn("slow");
        },1000);
      },3900);
    },1000);

}

function reset_screen(){
    // プレ、タイトル、説明用画像を消す
    $("#screen_pre").hide();
    $("#screen_title").hide();
    $("#screen_rule").hide();
    $("#screen_ouen").hide();
    $("#screen_intro_bg").hide();
    $("#screen_fin1").hide();
    $("#screen_white").hide();
    $("#screen_fin2").hide();
    $("#anime_box").css({
        "left": "0px",
        "top": "0px"});
    toujou_end();

    // エンディング画面を消す
    $("#screen_fin2").hide();
    $("#merryxmas").hide();
    $(".goal_text").remove();
    // console.log("test");
};

// プレ用
function pre(){
    reset_screen();
    $("#screen_pre").show();
};

// タイトル用
function title(){
    reset_screen();
    $("#screen_title").show();
};

// ルール説明用
function rule(){
    reset_screen();
    $("#screen_rule").show();
};

// フロンタ応援用
function ouen(){
    reset_screen();
    $("#screen_ouen").show();
};

function stopintrotimer(){
    clearInterval(intro_santa_timer);
};

function toujou_end(){
    console.log("toujou_end");
    // clearInterval(intro_santa_timer);
    toujou_animation_moving = 0;
    intro_santa.hide();
    intro_name.hide();
    $("#screen_intro_bg").hide();
    // first_animation = 0;
};

var first_animation = 0;
function toujou_start(color, name){
    console.log("toujou_start");
    console.log("toujou_animation_moving=" + toujou_animation_moving);

    if (toujou_animation_moving == 1){
        console.log(toujou_animation_moving);
        intro_santa.animate({left:"-=" + 600}, 1000, 'linear');
        intro_name.animate({left:"-=" + 1000}, 1100, 'linear');
        setTimeout(function(){toujou_animation_moving = 0; toujou_start(color, name);}, 1200);
        return;
    }else {
        reset_screen();
        $("#screen_intro_bg").show();
        toujou(color_id[color], name);
        if (toujou_animation_moving == 0){
            toujou_animation_moving = 1;
            if (first_animation == 0){
                first_animation = 1;
                toujou_animation();
            }
        }
        // intro_santa.css("left", 1100);
        intro_santa.animate({left:"+=" + 500}, 0);
        intro_santa.animate({left:"-=" + 500}, 1000, 'linear');
        intro_name.animate({left:"+=" + 700}, 0);
        intro_name.animate({left:"-=" + 700}, 1000, 'linear');
    }
    // intro_santa.animate({left:intro_santa.left_pos}, 1000);
};

function toujouall(){
    $("#screen_intro_bg").show();
    // return;
    intro_santa = $("#santa_intro");
    // console.log(intro_santa);
    toujou(1);
    toujou_animation_moving = 1;
    // intro_santa.id = 1;
    toujou_animation();
    // intro_santa_timer = setInterval(function(){toujou_animation();}, 100);
    // setTimeout(function(){toujou_end();},30000);

    // for (var color in obj_santa){
    //     toujou(color);
    //     break;
    // }
    // $("#screen_intro_bg").hide();
};

var toujou_anime_step = [
     // dummy
    [],
    // red
    [[1, 0.1], [2, 0.1], [3, 0.1], [4, 0.1]],
    // blu
    [[1, 0.1], [2, 0.1], [3, 0.1], [4, 0.1],
     [5, 0.1], [6, 0.1], [7, 0.1], [8, 0.1]],
    // yel
    [[1, 0.1], [2, 0.1], [3, 0.1], [4, 0.1]],
    // gre
    [[1, 0.2], [2, 0.2], [3, 0.2], [4, 0.2],
     [5, 0.2], [6, 0.2], [7, 0.2], [8, 0.2],
     [9, 0.1], [10, 0.1], [11, 0.1],
     [12, 0.5],
     [13, 0.1], [14, 0.1], [15, 0.1],[16, 0.1],
     [17, 1.0],
     [16, 0.1], [15, 0.1], [14, 0.1],[13, 0.1],
     [12, 0.5],
     [18, 0.1]]
];
var toujou_animation_num_iterate = 30;
var toujou_animation_moving = 0;
function toujou_animation(){
    if (toujou_animation_moving > 0){
    // if (first_animation > 0){
        // console.log("toujou_animation");
    // console.log("img.id:"+intro_santa.image_id);
    // console.log(intro_santa);
    // console.log("toujou_animation:" + intro_santa.attr("src"));
    // if (intro_santa.image_id >= toujou_animation_num_iterate){
    //     intro_santa.image_id = 1;
    //     // intro_santa.attr({src:prev_src});
    //     // intro_santa.state=STATE_MOVING;
    // }else{
        // console.log(intro_santa);
        var anime_idx = intro_santa.image_id % toujou_anime_step[intro_santa.id].length;
        // console.log("anime_idx"+anime_idx);
        var next_img_id = toujou_anime_step[intro_santa.id][anime_idx][0];
        var next_img_wait = toujou_anime_step[intro_santa.id][anime_idx][1];
        // console.log("santa id=" + intro_santa.id + " next_img_id="+next_img_id + " wait=" + next_img_wait);
        change_image_src(intro_santa, next_img_id);
        intro_santa.image_id++;
        setTimeout(function(){toujou_animation();}, next_img_wait * 1000);
    }else {
        first_animation = 0;
    }
    // }
    // console.log("hogetoujou_animation:" + intro_santa.attr("src"));
}

var intro_santa_wh = [
    [],
    [530*1.5, 400*1.5],
    [530*1.5, 400*1.5],
    [530*1.5, 400*1.5],
    [450*1.5, 530*1.5]
    ];
var intro_santa_pos = [
    [],
    [50, 150],
    [50, 150],
    [50, 150],
    [100, 100]
    ];
function toujou(id, name){
    console.log("toujou " + id);
    // if (id <= 4){
    intro_name.text(name);
    intro_santa.id = id;
    intro_santa.attr("src", "image/introduction/introduction" + id + "/1.png");
    intro_santa.show();
    intro_santa.image_id = 1;
    intro_name.show();
    console.log("height:" + intro_santa.css("height") + " width"+intro_santa.css("width"));
    var toujou_top_pos = HEIGHT / 2 - intro_santa_wh[intro_santa.id][0] / 2;
    var toujou_left_pos = WIDTH / 2 - intro_santa_wh[intro_santa.id][1] / 2;
    intro_santa.top_pos = toujou_top_pos;
    intro_santa.left_pos = toujou_left_pos;
    console.log("top:" + toujou_top_pos + " left:"+toujou_left_pos);
    intro_santa.css("top", toujou_top_pos);
    intro_santa.css("left", toujou_left_pos);
    intro_santa.css("top", intro_santa_pos[intro_santa.id][0]);
    intro_santa.css("left", intro_santa_pos[intro_santa.id][1]);

    intro_name.css("top", intro_santa_pos[intro_santa.id][0] + intro_santa_wh[intro_santa.id][0]);
    console.log([intro_santa_pos[intro_santa.id][1], intro_santa_wh[intro_santa.id][1], intro_name.css("width")]);
    intro_name.css("left", intro_santa_pos[intro_santa.id][1] + intro_santa_wh[intro_santa.id][1]/2 - px2int(intro_name.css("width")) /2 + 50);

}


function readyGo(){
    // プレ、タイトル、説明用画像を消す
    $("#screen_pre").hide();
    $("#screen_title").hide();
    $("#screen_rule").hide();
    $("#screen_ouen").hide();

    SendMsg("unnei",{name:"start",method:"obj_overwrite"});
    // obj_bgm = bgm_start;
    // obj_bgm.play();
    setTimeout(function(){
        // よーい
        $("#screen_yoi").show();

        // どん!
        setTimeout("readyGo2()",3200);
    }, 5300);
}

// よーいどん用
function readyGo2(){
    startGameTimer();
    for(var uuid in obj_players){
        obj_players[uuid].state = STATE_MOVING;
    }
    $("#screen_yoi").hide();
    $("#screen_don").show();
    $("#screen_don").fadeOut(3000);
    //bgm開始
    SendMsg("unnei",{name:"play",method:"readyGo2"});

    // obj_bgm.animate({volume: 0}, 1500);
    // setTimeout(function(){
    //     obj_bgm = bgm_play;
    //     obj_bgm.loop = "true";
    //     obj_bgm.currentTime = 0;
    //     obj_bgm.play();
    //     obj_bgm.animate({volume: 1}, 2000);
    // }, 1500);
}

function end(){

}
