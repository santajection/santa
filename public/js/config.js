var DEBUG_LEVEL = 0; // 0: release, 1:debug
var SERVER = "http://192.168.11.3:3000";
// var SERVER = "http://localhost:3000";
//var SERVER = "http://santamobile.herokuapp.com";
var SERVER_CLOUD = "http://santawall.herokuapp.com";
var useCloud = false;

var SANTA_RED_GADGET = "red";
var SANTA_BLUE_GADGET = "blue";
var SANTA_GREEN_GADGET = "green";
var SANTA_YELLOW_GADGET = "yellow";

var frame_per_signal = 1; // santaの昇降画像の切替をガジェット等からの何シグナルごとにやるか(2の場合2signal毎に1回のアニメーション処理を実施)
var imgs_per_frame = 5;   // 1回のアニメーションでのsantaの昇降画像の切替数(5の場合1回のアニメーションで5枚の画像を100ms毎に500msで差替)
var move_per_signal = 25; // 1シグナルごとの移動ピクセル数
var dist_window_santa = 80; // サンタと窓がこのピクセル以下の時窓のトナカイが動き出す

// 色ごとのガジェットを決めるマップ
var colorToGadgetMap = {"red":["30","41"],"blu":["36","37"],"gre":["31","32"],"yel":["29","40"]};


function gadgetToColor(gadegetNum){
	for (var tmp_color in colorToGadgetMap){
		for(var idx in colorToGadgetMap[tmp_color]){
			if(colorToGadgetMap[tmp_color][idx] == gadegetNum){
				return tmp_color;
			}	
		}
	}
	return null;
}

function gadgetToColorIdx(gadegetNum){
	for (var tmp_color in colorToGadgetMap){
		for(var idx in colorToGadgetMap[tmp_color]){
			if(colorToGadgetMap[tmp_color][idx] == gadegetNum){
				return tmp_color + idx;
			}	
		}
	}
	return null;
}

function gadgetToColorAndIdx(gadegetNum){
	for (var tmp_color in colorToGadgetMap){
		for(var idx in colorToGadgetMap[tmp_color]){
			if(colorToGadgetMap[tmp_color][idx] == gadegetNum){
				return {color:tmp_color,index:idx};
			}	
		}
	}
	return null;
}
