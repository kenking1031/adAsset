/**
 * Created with JetBrains RubyMine.
 * User: USCal-XJiang
 * Date: 10/16/14
 * Time: 12:45 PM
 * To change this template use File | Settings | File Templates.
 */

var streamURL = "";
var swfVersionStr = "0";
var xiSwfUrlStr = "";
var flashvars = {configurationUrl: "http://nh.lab.xcal.tv/pauk/pauk_desktop.xml", deviceId: "TEST_PLAYER_NH" };
var params = {};
params.quality = "high";
params.bgcolor = "#000000";
params.allowscriptaccess = "always";
params.allowfullscreen = "true";
params.wmode = "direct";
var attributes = {};
attributes.id = "PlayerPlatformAPI";
attributes.name = "PlayerPlatformAPI";
attributes.align = "middle";
swfobject.embedSWF(
    "http://docs.prod.xidio.com/Viper/PlayerPlatformAPI.swf", "flashContent",
    "800", "450",
    swfVersionStr, xiSwfUrlStr,
    flashvars, params, attributes);
