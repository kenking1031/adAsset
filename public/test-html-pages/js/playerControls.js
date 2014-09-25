/* ----------------------------------------------------------------------------------
Copyright 2010, Comcast Corporation. This software and its contents are Comcast 
confidential and proprietary. It cannot be used, disclosed, or distributed without 
Comcast's prior written permission. Modification of this software is only allowed at 
the direction of Comcast Corporation. All allowed modifications must be provided to Comcast 
Corporation.
-----------------------------------------------------------------------------------------*/

var playState = "stopped";
var controlsReady = false;

function buildPlayControls() {

    controlsReady = true;
    var player = document.getElementById('PlayerPlatformAPI');
    var controller = document.getElementById('controls');
    var playbutton = document.getElementById('playpause');
    var container = document.getElementById('container');
    var canvas = document.getElementById('scrubber');

    playbutton.addEventListener('click', function() {
        if(playState == "paused")
        {
        	player.play();
        }
        else
        {
        	player.pause();
        }
    }, false);

    drawScrubber();

    /*Scrubber Stuffs*/

    var stopper = 0;
    function drawScrubber() {

        if (canvas.getContext) {
            //canvas.width = 1100;
            canvas.width = 670;
            canvas.addEventListener("mousedown", function(e) {
                stopper = 0;
                setScrubber(e);
            }, false);
            canvas.addEventListener("mouseup", function(e) {
                stopper = 1;
                }, false);
            //canvas.addEventListener("mouseout",function(e) {stopper=1;player.play()},false);
            ctx = canvas.getContext('2d');
            setInterval(makeScrubber, 25);
        }
    }

    function setScrubber(e) {
        if (stopper == 0) {
            var ox = e.pageX;
            //x pos on the page itself
            var barPos = ox - findX(canvas);
            //x position relative to canvas
            //determine percentage of x across the canvas
            var xPer = (barPos / canvas.width)
            player.setPosition(player.getDuration() * xPer);
        }
    }

    function makeScrubber() {
        var xpos = canvas.width * (player.getCurrentPosition() / player.getDuration());

		//drawing scrubber before current position
        for (i = 0; i <= xpos; i += 8) {
            ctx.fillStyle = "blue";
            ctx.fillRect(i, 0, 8, 8);
        }
		//current position
        ctx.fillStyle = "#000";
        ctx.fillRect(xpos, 0, 8, 8);

		//after current position
        for (i = xpos + 8; i <= canvas.width; i += 8) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(i, 0, 8, 8);
        }

    }

    function findX(el) {
        var left = 0;
        if (el.offsetParent) {
            do {
                left += el.offsetLeft;
            }
            while (el = el.offsetParent);
            return left;
        }
    }

}

//Events have to match the external interface calls in the code check the API
function onReady() 
{
	log("ON_READY received");
}
		
function onDynamicStreamsChange(bitRateObject)
{
	log("Bitrate Changed: " + bitRateObject.bitrate + " Change Reason: " +  bitRateObject.changeReason);
	document.getElementById("playbackRate").innerHTML = "" + bitRateObject.bitrate;
}

function acquireLocalLicense(manifestUri)
{
	document.getElementById('PlayerPlatformAPI').acquireLocalLicense(manifestUri);
}

function acquireLicenseForStreaming(manifestUri)
{
	document.getElementById('PlayerPlatformAPI').acquireLicenseForStreaming(manifestUri);
}

function acquireLicenseForOfflinePlayback(manifestUri)
{
	document.getElementById('PlayerPlatformAPI').acquireLicenseForOfflinePlayback(manifestUri);
}

function acquireLicenseForStreamingUsingCustomDrmKey(manifestUri,drmToken)
{
	document.getElementById('PlayerPlatformAPI').acquireLicenseForStreamingUsingCustomDrmKey(manifestUri, drmToken);
}

function onOfflineDRMComplete(payload)
{
	log("Offline Drm Complete Asset: " + payload.asset);
}

function onDRMComplete(payload)
{
	log("Drm Complete Asset: " + payload.asset);
}

function onOfflineDRMFailure(payload)
{
	log("Offline Drm Failure - Error Code: " + payload.code + " : " + payload.description);
}


function onNumAlternativeAudioStreamsChange(numAudio)
{
	log("Number of Alternative Audio: " + numAudio);
}

function onMediaFailed(payload)
{
	log("Media Failed: " + payload.code + " : " + payload.description + " : " + JSON.stringify(payload.parameters));
}

function onDRMFailure(payload)
{
	log("DRM Failure: " + payload.code + " : " + payload.description);
}
		
function onMediaOpened(payload)
{
	log("Media Opened: Took " + payload.openningLatency/1000 + " seconds");
    if(controlsReady){
        updateTimeline();
    } else {
        buildPlayControls();
    }
}

function onMediaProgress(payload)
{
 	var player = document.getElementById('PlayerPlatformAPI');
	//log("Position update: " + payload.position);
	document.getElementById('duration').innerHTML = fixtime(player.getDuration());
    document.getElementById('display').innerHTML = fixtime(player.getCurrentPosition()) + "&nbsp;/&nbsp;";
}

function onMediaEnded()
{
 	var playbutton = document.getElementById('playpause');
	log("Play State Changed: ended");
	playbutton.innerHTML = '<button class="pause"></button>';	 
}

function playerPlatformEvent(type, payload)
{
	//log("Event From Player Platfrom: Type(" + type + ") : Payload(" + JSON.stringify(payload) + ")");
}

function onBufferStart()
{
	log("Buffering Start");
}

function onBufferComplete()
{
	log("Buffering End");
}

function onSeekStart()
{
    log("Seek Start");
}

function onSeekComplete()
{
    log("Seek End");
}

function fixtime(t) {
        var s = t
        var h = Math.floor(s / 3600);
        s = s % 3600;
        var m = Math.floor(s / 60);
        s = Math.floor(s % 60);
        /* pad the minute and second strings to two digits */
        if (s.toString().length < 2)
            s = "0" + s;
        if (m.toString().length < 2)
            m = "0" + m;
        return h + ":" + m + ":" + s;
}

function onPlayStateChanged(state)
{
	var playbutton = document.getElementById('playpause');
	log("Play State Changed: " + state);
	
	if(state == "PLAYING")
	{
		  playbutton.innerHTML = '<button class="pause"></button>';
		  playState = state;
	}
	else if(state == "PAUSED")
	{
		  playbutton.innerHTML = '<button class="play"></button>';
		  playState  = state;
	}
    else if (state == "READY")
    {
        updateTimeline();
    }
}

var timeline = null;

function updateTimeline()
{
    timeline = document.getElementById('PlayerPlatformAPI').getTimeline();

    if (timeline.length == 0){
        log('No timeline markers');
    }

    for (var i = 0; i < timeline.length; i++){
        log('Ad Marker found: Start = ' + timeline[i]['startTime'] + ' Duration = ' + timeline[i]['duration']);
    }

    /*ctx = canvas.getContext('2d');

    timeline = document.getElementById('PlayerPlatformAPI').getTimeline();
    var markers = timeline.getTimelineMarkers;
    var inner = "";

    if (tracks.length == null) {
        return;  // not an array!
    }

    inner += '<p>AUDIO TRACKS<p/>';

    for (var i = 0; i < tracks.length; i++) {
        inner += '<a id="track' + i + '" class="speedBtn" href="javascript:setAudioTrack(\'';
        inner += tracks[i];
        inner += '\');"> ';
        inner += tracks[i];
        inner += ' </a>';
    }*/

}

function enableLogging(flag)
{
	document.getElementById('PlayerPlatformAPI').enableLogging(flag);
}

// How to change the channel
function setContentURL(manifestUri, contentOptions) {
    document.getElementById('PlayerPlatformAPI').setContentUrl(manifestUri, contentOptions);
}

function setClosedCaptionsOptions() {
  document.getElementById('PlayerPlatformAPI').setClosedCaptionsOptions({
    fontStyle: 'proportional_without_serifs',
    textForegroundColor: 'bright_red',
    windowBorderEdgeColor: 'bright_white',
    textForegroundEdge: 'drop_shadow_left',
    windowBackgroundColor: 'bright_white',
    windowFillColor: 'dark_green',
    fontSize: 'medium',
    textForegroundOpacity: '70',
    windowBackgroundOpacity: '100',
    windowFillOpacity: '50'
  });
}

function setURL(manifestUri) {
   document.getElementById('PlayerPlatformAPI').setContentUrlNoDictionary(manifestUri);
}

// How to retrieve the playbackPosition
function getCurrentPosition() {
    log("Playback position = " + document.getElementById('PlayerPlatformAPI').getCurrentPosition());
}

// How to retrieve the playbackPosition
function getEndPosition() {
    log("End position = " + document.getElementById('PlayerPlatformAPI').getEndPosition());
}

function getStartPosition() {
    log("Start position = " + document.getElementById('PlayerPlatformAPI').getStartPosition());
}

function getDuration() {
    log("Duration = " + document.getElementById('PlayerPlatformAPI').getDuration());
}

function getPlayerState() {
    log("Player State = " + document.getElementById('PlayerPlatformAPI').getPlayerState().Name);
}

// How to set the size (width, height) of the video within the player
function setDimensionsOfVideo(width, height) {
    document.getElementById('PlayerPlatformAPI').setDimensionsOfVideo(width, height);
}

// How to start the video playback
function play() {
    document.getElementById('PlayerPlatformAPI').play();
}

// How to stop video playback
function stop() {
    document.getElementById('PlayerPlatformAPI').stop();
}

// How to pause video playback
function pause() {
   document.getElementById('PlayerPlatformAPI').pause();
}

function setSpeed(speed, overShootCorrection){
	document.getElementById('PlayerPlatformAPI').setSpeed(speed, overShootCorrection)
}

// How to set the volume in range [0..1]
function setVolume(volume) {
    document.getElementById('PlayerPlatformAPI').setVolume(volume);
}

// How to enable/disbale closed captions
function setClosedCaptionsEnabled(isClosedCaptions) {
    document.getElementById('PlayerPlatformAPI').setClosedCaptionsEnabled(isClosedCaptions);
}

//Time in double seconds
function seekToPosition(time) {
   document.getElementById('PlayerPlatformAPI').setPosition(time);
}

function log(message) {
    var now = new Date();

    var pad = function (val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) val = "0" + val;
        return val;
    };

    var ts = pad(now.getHours(), 2) + ":" + pad(now.getMinutes(), 2) + ":" + pad(now.getSeconds(), 2) + "." + pad(now.getMilliseconds(), 3);

    var logs = ts + " - " + message.replace(/</g, "&lt;") + "<br />" + document.getElementById("log").innerHTML;
    document.getElementById("log").innerHTML = logs;
}

var localAudioTracks = null;

function getAvailableAudioTracks() {
    localAudioTracks = document.getElementById('PlayerPlatformAPI').getAvailableAudioLanguages();
    var tracks = localAudioTracks;
    var inner = "";

    if (tracks.length == null) {
        return;  // not an array!
    }

    inner += '<p>AUDIO TRACKS<p/>';

    for (var i = 0; i < tracks.length; i++) {
        inner += '<a id="track' + i + '" class="speedBtn" href="javascript:setAudioTrack(\'';
        inner += tracks[i];
        inner += '\');"> ';
        inner += tracks[i];
        inner += ' </a>';
    }

    document.getElementById('audioTrack').innerHTML = inner;

}

function setAudioTrack(language) {
    document.getElementById('PlayerPlatformAPI').setPreferredAudioLanguage(language);
    fnUpdateAudioControl(language);
}

function fnUpdateAudioControl(language) {
    if (localAudioTracks != null) {
        for (var i = 0; i < localAudioTracks.length; i++) {
            var audipLabelId = 'track' + i;
            if (language == localAudioTracks[i])
                document.getElementById(audipLabelId).className = 'speedBtn activeBtn';
            else
                document.getElementById(audipLabelId).className = 'speedBtn';
        }
    }
    else {
        alert("null localSpeeds!");
    }
}

var localBitrates = null;

function getAvailableBitrates() {
    localBitrates = document.getElementById('PlayerPlatformAPI').getAvailableBitrates();
    var bitrates = localBitrates;
    var inner = "";

    if (bitrates.length == null) {
        return;  // not an array!
    }

    inner += '<p>BITRATES<p/>';

    for (var i = 0; i < bitrates.length; i++) {
        inner += '<a id="bitrate' + i + '" class="bitrateBtn" href="javascript:setBitrateRange(\'';
        inner += bitrates[i] + '\',\'' + bitrates[i];
        inner += '\');"> ';
        inner += bitrates[i];
        inner += ' </a>';
    }

    document.getElementById('bitrates').innerHTML = inner;

}

function setBitrateRange(min, max) {
	fnUpdateBitrateControl(min);
    document.getElementById('PlayerPlatformAPI').setBitrateRange(min,max);
}

function fnUpdateBitrateControl(bitrate) {
    if (localBitrates != null) {
        for (var i = 0; i < localBitrates.length; i++) {
            var bitLabelId = 'bitrate' + i;
            if (bitrate == localBitrates[i])
                document.getElementById(bitLabelId).className = 'bitrateBtn activeBtn';
            else
                document.getElementById(bitLabelId).className = 'bitrateBtn';
        }
    }
    else {
        alert("null localBitrates!");
    }
}

function configureAnalytics() {
    log("Device ID: " + document.getElementById('PlayerPlatformAPI').configureAnalytics());
}

function configureEmergencyAlerts(xsctToken) {
	document.getElementById('PlayerPlatformAPI').configureEmergencyAlerts(xsctToken);
}

function getVersion()
{
	log(document.getElementById('PlayerPlatformAPI').getVersion());
}

function setInitialBitrate(bitrate)
{
	document.getElementById('PlayerPlatformAPI').setInitialBitrate(bitrate);
}

function setSendFragmentInfo(flag)
{
	document.getElementById('PlayerPlatformAPI').setSendFragmentInfo(flag);
}

function showDebug()
{
	document.getElementById('PlayerPlatformAPI').showDebug();
}

function setChannelStoreAsset(url,channelId, programId, episodeId, metadata, resumePoint)
{
    document.getElementById('PlayerPlatformAPI').setAsset(url,channelId, programId, episodeId, metadata, 0);
}


// Toggle line wrap for logger.
function logWrap(wrap) {
    var logDiv = document.getElementById('log');
    if (logDiv) {
        if (wrap) {
            logDiv.className = "log";
        } else {
            logDiv.className = "log noWrap";
        }
    }
}

function authenticateAssetOffline(manifestUri,contentOptions,workFlowType)
{
	document.getElementById('PlayerPlatformAPI').setCimaCredentials('cidcima_06', 'testtest');
	document.getElementById('PlayerPlatformAPI').setProductName('quantum');
	document.getElementById('PlayerPlatformAPI').authenticateAssets(manifestUri,contentOptions,workFlowType);
}

function createContentOptionsCRPID(drmKey, licenseID, releaseID) {
    var contentOptions = new Object();;
    contentOptions.drmKey = drmKey;
	contentOptions.licenseID = licenseID;
	contentOptions.releaseID = releaseID;
    return contentOptions;
}

function createContentOptionsAAEID(drmKey, mediaID, tPID) {
    var contentOptions = new Object();;
    contentOptions.drmKey = drmKey;
	contentOptions.mediaID = mediaID;
	contentOptions.tPID = tPID;
    return contentOptions;
}

function createContentOptionsLAAEID(drmKey, assetID, providerID) {
    var contentOptions = new Object();;
    contentOptions.drmKey = drmKey;
	contentOptions.assetID = assetID;
	contentOptions.providerID = providerID;
    return contentOptions;
}

function createContentOptionsSTRID(streamId){
    var contentOptions = new Object();
    contentOptions.streamId = streamId;
    contentOptions.mediaID = 'testAuditude';
    return contentOptions;
}

function createContentOptionsRID(recordingId){
    var contentOptions = new Object();
    contentOptions.recordingId = recordingId;
    contentOptions.mediaID = '26178627912';
    return contentOptions;
}

function createContentOptionsVOD(tid, mid){
    var contentOptions = new Object();
    contentOptions.tid = tid;
    contentOptions.mediaID = mid;
    contentOptions.drmKey = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxuczI6eGNhbC1hdXRoLW1lc3NhZ2UgeG1sbnM6bnMyPSJ1cm46Y2NwOmRldmlkOmRybSIgdmVyc2lvbj0iMyI+DQogIDxhdHRyaWJ1dGUga2V5PSJtZXNzYWdlOnByb3RlY3Rpb24iPk1JSU5PakNCNHd3UmJXVnpjMkZuWlVGMGRISnBZblYwWlhNd2djMHdEQXdIZG1WeWMybHZiZ3dCTXpBZERBVnViMjVqWlFRVUV2Q1g5UTBYUUI1T1JBZ1V2Ym9LTXZkODdKa3dHZ3dKYVhOemRXVkVZWFJsRncweE5EQTBNalV5TURJME16RmFNQm9NQ1c1dmRFSmxabTl5WlJjTk1UUXdOREkxTWpBeU5ETXhXakFkREF4dWIzUlBiazl5UVdaMFpYSVhEVEUwTURReU56SXdNalF6TVZvd0lnd0xiV1Z6YzJGblpWUjVjR1VNRTNoallXeFRaWE56YVc5dVEzUjRWRzlyWlc0d0Rnd0dhWE56ZFdWeURBUjRjMk56TUJNTUNuSmxZMmx3YVdWdWRITXdCUXdEWkd4ek1JSGVEQTF0WlhOellXZGxSR2xuWlhOME1JSE1NQmtNRDJScFoyVnpkRUZzWjI5eWFYUm9iUXdHYzJoaE1qVTJNREVNRFcxbGMzTmhaMlZFYVdkbGMzUUVJS2tsbGxmYjN0eWxGVFVGYmJTR1AyNzZvOWg0cXM5SXNWN1RTZk80ajl2UU1EME1HWEJzWVdsdWRHVjRkRUYwZEhKcFluVjBaWE5FYVdkbGMzUUVJTzFDZDBLcVBRcWdUd3NqbUFUQ2FhWHV6WmpwRTYvcjI4aFErSENsSmNTMk1EME1HV1Z1WTNKNWNIUmxaRUYwZEhKcFluVjBaWE5FYVdkbGMzUUVJQm5uUGxpVGNoTVdzNkxMaUJpamxJSFBwdTFzWDQ1c2ZFcDNzS2p6M0ZtOU1JSUZKZ3dPWVhWMGFHVnVkR2xqWVhScGIyNHdnZ1VTTUJZTUNXRnNaMjl5YVhSb2JRd0pjMmhoTWpVMlVuTmhNQmNNQzJ0bGVVbHVabTlVZVhCbERBaDROVEE1UkdGMFlUQ0NCTjBNQjJ0bGVVbHVabThFZ2dUUU1JSUV6RENDQTdTZ0F3SUJBZ0lVSjFDa3dnWE5jNEtwcUl0eWtJZDIvSURnR0owd0RRWUpLb1pJaHZjTkFRRUZCUUF3Z1k4eEN6QUpCZ05WQkFZTUFsVlRNUXN3Q1FZRFZRUUlEQUpRUVRFVk1CTUdBMVVFQnd3TVVHaHBiR0ZrWld4d2FHbGhNU2N3SlFZRFZRUUtEQjVEYjIxallYTjBJRU52Ym5abGNtZGxaQ0JRY205a2RXTjBjeUJNVEVNeElqQWdCZ05WQkFzTUdYVnlianBqYjIxallYTjBPbU5qY0Rwd2Eya3RZM010ZEdReER6QU5CZ05WQkFNTUJsQXdNakF3TVRBZUZ3MHhNVEE1TWpBeE1EUXhNVGxhRncweE5qQTVNVGt4TmpReE1UbGFNSUdhTVFzd0NRWURWUVFHREFKVlV6RUxNQWtHQTFVRUNBd0NVRUV4RlRBVEJnTlZCQWNNREZCb2FXeGhaR1ZzY0docFlURW5NQ1VHQTFVRUNnd2VRMjl0WTJGemRDQkRiMjUyWlhKblpXUWdVSEp2WkhWamRITWdURXhETVNnd0pnWURWUVFMREI5MWNtNDZZMjl0WTJGemREcGpZM0E2Y0d0cExXTnpMV2x1ZERwNGMyTnpNUlF3RWdZRFZRUUREQXRRTURJd01EQXdNREF6TWpDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTFZQR2tBOFdRQkhkMzYrL004OE9sOUZvSnV6empEMFRIaHZEMlF0dUxtUE8xMEVkeWpOcGJhcUN5QmR6VWtWNU84N0docUp4c0s2QnB5UUZTM2g3STBkeGV5NVp6YWpVU05oNURhZ2dUTEFjRXZZdlBmLzlWcDBMVDRxalAwa20zK2tmdlNJMGx0QVQxNjdEN29PS0VnTXF1dUdQYVVXbW1BOENFWmVhZEhJcmpGMVpNcU1nSk1ZakxzRkRZNUZ3OXBnaUJ1UzI0d1liK2o2NnFvZm8zQUlMdS9uNktTTGFaOFd5Y29oMHJkQXJlVnVCc3M2aHJjMHFySHRiRVhqdmlTVUxXcmpRZmZNUXhYNjJDZXowUnkwdnZZU21iYlF1ejR3a1lMNlppdWM2THVyV1lVUkxReU1OZFdMRzBZUDVMN0wxQndIQmZhS1kva0Q2WWpSdGVNQ0F3RUFBYU9DQVJFd2dnRU5NQjBHQTFVZERnUVdCQlJHU21WZmNtUDZ1OEY0bWZDQzA2bFZLVXFKSmpBT0JnTlZIUThCQWY4RUJBTUNCNEF3Z2MwR0ExVWRJd1NCeFRDQndvQVVtc0N5b1M2eTJydzA0UjduY1V2cVN2SXQ2NTZoZ1pPa2daQXdnWTB4Q3pBSkJnTlZCQVlNQWxWVE1Rc3dDUVlEVlFRSURBSlFRVEVWTUJNR0ExVUVCd3dNVUdocGJHRmtaV3h3YUdsaE1TY3dKUVlEVlFRS0RCNURiMjFqWVhOMElFTnZiblpsY21kbFpDQlFjbTlrZFdOMGN5Qk1URU14SVRBZkJnTlZCQXNNR0hWeWJqcGpiMjFqWVhOME9tTmpjRHB3YTJrdFl5MTBZVEVPTUF3R0ExVUVBd3dGVURBeU1EQ0NGRDJQRjVzUGI1ZlBxbUxtbE1zZEQwa3EyVkVZTUF3R0ExVWRFd0VCL3dRQ01BQXdEUVlKS29aSWh2Y05BUUVGQlFBRGdnRUJBRm03cUNsandxVTJkWnVCblF0WkVOa2t4elRZTGtlcTh0d1ZndDdicU5RRVcrejIxVE00TVcxZXZnSDJoem0xVE5vUXZhSks0dkRUT3NLVGpqY2l2ZUF1S3UydzNvc0JZaHduRkpTNFdYZFhYdE9NandwMUxRWEtXelVjak1IVjA5SW1uaEx4ZFB5YVh1TWdnYThnRERjZlBDd2VuejYzMTJscWdIc3JodWZqWkNQL0ZQSHVnSFhaU2F0TE0vcy9IREozZWt0eHk4MHFwdVhuVlN0SkRTbWs3MGNDY0tSUTVzQ3JEbi85anc0NDVBdi92NDFValNoOGlKVG0rNU9va2E5ZEJwaldJMWVsR0wvN1F5aWxSUjB3cFJQZ3l4N0tINVhSbWd0Z3ZkYXAxNUM2bGhtZ1ZVaGE3ZVNzUzI0SWp3a01SVXdHSkMrM1MvWmRVcEc1Uk1Zd2Fnd01hMlY1VkhKaGJuTndiM0owTUZvd0hnd0pZV3huYjNKcGRHaHREQkZ5YzJGUFlXVndVMmhoTWpVMlRXZG1NVEFWREF0clpYbEpibVp2Vkhsd1pRd0dlRFV3T1Vsa01DRU1CMnRsZVVsdVptOHdGZ1FVZUM2MlNPVCtKYXh0VzBsUEFhSHljZnhYaWRnd2diNE1DbVZ1WTNKNWNIUnBiMjR3Z2E4d0dBd0pZV3huYjNKcGRHaHREQXRoWlhORFltTlFhMk56TlRBZURBdHJaWGxKYm1adlZIbHdaUXdQWTJsd2FHVnlTMlY1VTJoaE1qVTJNQ3NNQjJ0bGVVbHVabThFSUR6RVU1N0tyNGhnM0VoSjg1RGF6ZUJraHZGUm9ONE1RTks0VCt1YllvVE5NQkVNQjJ0bGVWUjVjR1VNQm1GbGN6STFOakFXREFOclpHWU1EMk52Ym1OaGRFdGtabE5vWVRJMU5qQVREQVpwZGxSNWNHVU1DWE5wZGxOb1lUSTFOakFHREFKcGRnVUFNSUlGR0F3S1kybHdhR1Z5UkdGMFlUQ0NCUWd3Z2dFT0RBaGhkWFJvUkdGMFlRU0NBUUFzd1hrbFJQaHpSRnYyQjRFeVhSZ0pxdDE1ZmRFZDZoVGVMdXp2K0pqZ0NvNEZGRWdaTW1ORUpTMUx3dlJ3QzZzVGdlOTR5MFl4S1JTV1JONDZVOUJ0a0JJVWhSQWpxc296K3ZSc09KRHhHNmR0T1FSQ3NUV3c3aVZzUU5KVnU3S29mNWE1TXlQSkVsczR1Tk1TalZrUjhwcVpWM3VKcWRWRFpOOER4dk9QZGFOUHd5MVB0Y2xGQ2ZwOFp6elJrNGFiK0d2ZTUrTnZMNWpSWW1jalZsNDh6OHlLVThMeW1IZlZqZTdJb2g1THFBeHFnTGE0WUtDbGl0S3VKbzM3aXJ3VjVteEZLUGRrOEdqTjUySHljdVc4MTdTTnl1N3FPaGtZb2ZZaHJCbFBxNEN3WW52bWNyczBGWFpLemMwYUhQL3gxVzBRL01HaE5yNjZ1eW1aRDU1Rk1JSUJHZ3dRYTJWNVZISmhibk53YjNKMFJHRjBZVENDQVFRRWdnRUFRMXEwZVRtVW5YU0NqdzBvdGhFK2hiWTZoTUxPaVRVQWlrTmxrRFBZeEpQa3BwNXl2RldLTEpyRXJtNjMyT2RoMW52aUtHaVhHTmFXSW83R25ONjlrdmZ2ekhiY3BqeCtJVmNkcG9Jc0xmU1RpZ1g1aWJHbG5td0xWc0pRZ2VNdStJVXhGV2RhSkE5djBGSzZwUkRwdDdMOVdPTFdyNkIrUmZzWTRGRzNLNmVKTkROa3lYUVlra3BnNzBneWQ2Q3p1a2Y4SDVxa09lVTlBU2JISy9UaFpqa2k5Z0J4ckM1RWd5dy9Sd01JTmVKWmhYY1VYQlIrd1lzNUZhR1A4aXFLMXBmYjVHb2w5S2c1TGtMdjB3d2tqVENMWmtyUm5ydFBBZzA4Wk5yekxCT2V3KzR2U3krY0RMSUhkalp6N0lYcWhXOVl6RG91eWlQcGhQUjVUN0tNb0RDQ0F0UU1EbU5wY0dobGNuUmxlSFJFWVhSaEJJSUN3R0hrTk1xUnhoaW5XU1MvY2lSVEJJRFdFUFNQaGU2YzRMbkxHbCtkNHI2OVJZZTluc3NJZ2tUL1BCWkhremUvMHd3bGVhNWdrN2JMbzN6ZzE2RVVHZmxLWlZPc1VCeEx4SHBjRitnY21CSExwSnNCNzJCRWJSbjBKWGR3THlmU0JwNUxXZnRIVEhSSFN1am1sM2EzMkI1R2R2VnF0cWpHRWpjdHBUT1pFOXEybUtlSWtKVlNqdmxpVWJkSzVPcUd5amlGd1RtWnZrcFB4K2ZPMVBDZ0haTlo1VWNLN2hZbk1jbkljTWJTYkFMYWIrNFhZYkY1emFWWkY5YlhXS09EdUlPYWRJajJib1cxR2hoSExPT3RnRWpUcEo1Z3pWOWUvY2dNT3Z1aGVoeWc3MDhORWh0YTV0SjV3aEVRTEJPM0Y4S0g3SFhPcGwydTVTN1UrT2RoUWt3aEt3bTlQV0gyTFRGZXU3NldsWlFzRzFCa0prb2N6M1BaUFlIVzZvWnBvaVVNLzRhUStKeGg4L1dMWkYxVGsrclovdWhUMXF6a2lvQTFhRDVUQUllemoxRVBNbnVMcmZTWldidWhWd2F0aERUMnVrUXZVMlNmdkJacjVpd25RaVhUbHVteURsM0V0ZzhyVjRnUURFVzQwRkxaTTRKQVpwM0R0ZTJ1RjlhTGg1T3FOWEtMbDBzQXlOWUM5S2JDTWVUV0VmdW1rZGpoanhLeEw5cWF0SWVPRXl0aUMxa3lpd2ovWHdwOXp6ZFlzTGswZ09GOE9xcmVYa1JyZW5lVU1LdVg0ZExUR0MyZDJEWEpIdzNNVFV4eWJsY1NwY0xRV2tNTlg0WUNTazA5alMvVkhLbkVVMHc2cEhqYTduRUIyLzBpclo5MGppTzcyS3hzY0RJeEdVdDNlUUladFpOMEN2WjVjMXpybjZxMU9kMldUY0VHMW1mOE9aQWRMejluL0I3ckMrb0ZzekxsZGlFaVVnYUxFNzhwYkxsWlpKY3JXdG1GSk40S3V0ektYM0VUam9xbUVLT0N6SWl0V0dzTmoxQ1NZMmorRGs4aFRZd2FPS2lhVzEzUThtcDc3QzlEbE1LeDZpMDZZSjNsZThQNlZqdDl5RGJVZ1BjKzBNa1JRL2VyVmhGaXZiVnArQU1zckdFUzI3MnN0Y2FmUFlWZFJkVWNxbkNsMUlNdzQ4NzlSenEreUcvZTBlU0FMMmIweTJQZWp1S0lWUUREV3p0cTZoelRya0tRPC9hdHRyaWJ1dGU+DQogIDxhdHRyaWJ1dGUga2V5PSJzZXJ2aWNlOnByb2R1Y3QiPnByaW1ldGltZTwvYXR0cmlidXRlPg0KICA8YXR0cmlidXRlIGtleT0ibWVzc2FnZTpzdGF0dXMiPjA8L2F0dHJpYnV0ZT4NCiAgPGF0dHJpYnV0ZSBrZXk9Im1lc3NhZ2U6dHlwZSI+eGNhbFNlc3Npb25DdHhUb2tlbjwvYXR0cmlidXRlPg0KICA8YXR0cmlidXRlIGtleT0ibWVzc2FnZTppZCI+NE5ELTU2QS1GNTktQUM5PC9hdHRyaWJ1dGU+DQogIDxhdHRyaWJ1dGUga2V5PSJzZXJ2aWNlOnZlcnNpb24iPjEuMDwvYXR0cmlidXRlPg0KICA8YXR0cmlidXRlIGtleT0ic2VydmljZTpwcm92aWRlcnMiPmNpbTwvYXR0cmlidXRlPg0KPC9uczI6eGNhbC1hdXRoLW1lc3NhZ2U+DQoNCg==';
    return contentOptions;
}

function createContentOptionsWhitelist(tid, mid, token){
    var contentOptions = new Object();
    contentOptions.tid = tid;
    contentOptions.mediaID = mid;
    contentOptions.drmKey = token;
    contentOptions.drmWorkFlow = "PlayerPlatformWhitelistWorkflow";
    return contentOptions;
}

function createChannelStoreMetadata(){
    var contentOptions = new Object();
    contentOptions.name = "test";
    contentOptions.provider = "FOX";
    return contentOptions;
}

function configureComcastAds(deviceId)
{
	document.getElementById('PlayerPlatformAPI').configureComcastAds(deviceId);
}

function configureAuditudeAds()
{
    document.getElementById('PlayerPlatformAPI').configureAuditudeAds();
}

function configureC3Ads()
{
    document.getElementById('PlayerPlatformAPI').configureC3Ads();
}
