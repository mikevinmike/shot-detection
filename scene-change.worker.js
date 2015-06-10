'use strict';

importScripts('./scene-change-detector.js');

self.addEventListener('message', function(e) {

    var currentHistogramValues = e.data.currentHistogramValues;
    var lastHistogramValues = e.data.lastHistogramValues;

    if(sceneChangeDetector.isSceneChange(currentHistogramValues, lastHistogramValues)) {
        console.log('scene change', e.data.index),
        self.postMessage(e.data.index); // return message only if scene has changed
        return;
    }
    console.log('nooooo scene change')

}, false);
