var DEBUG_LEVEL = 0; // 0: release, 1:debug
var SERVER = "http://192.168.11.13:3000";
// var SERVER = "http://localhost:3000";
//var SERVER = "http://santamobile.herokuapp.com";
var SERVER_CLOUD = "http://santawall.herokuapp.com";
var useCloud = true;

var SANTA_RED_GADGET = "red";
var SANTA_BLUE_GADGET = "blue";
var SANTA_GREEN_GADGET = "green";
var SANTA_YELLOW_GADGET = "yellow";

var frame_to_change_img = 2; // santaの昇り降り画像の切り替えフレーム数(2の場合2frame毎に画像を差し替え)
var move_per_frame = 10; // 1フレームごとの移動ピクセル数
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
