'use strict';

importScripts('./scene-change-detector.js');

self.addEventListener('message', function(e) {

    var histogramValueArray = e.data.histogramValueArray;

    var pufferIndex = sceneChangeDetector.isSceneChangeWithPuffer(histogramValueArray);
    var sceneChangeIndex = e.data.index - histogramValueArray.length + pufferIndex;
    if(pufferIndex) {
        self.postMessage(sceneChangeIndex); // return message only if scene has changed
        return;
    }

}, false);
