'use strict';

var shotDetection = function() {

    var histograms = [];

    function detectSceneChange() {
        var numberOfHistograms = histograms.length;
        if(numberOfHistograms < 2) {
            return;
        }
        var currentHistogram = histograms[numberOfHistograms - 1];
        var lastHistogram = histograms[numberOfHistograms - 2];

        if(isSceneChange(currentHistogram, lastHistogram)) {
            visualizeFrame(numberOfHistograms - 1);
        }
    }

    function isSceneChange(currentHistogram, lastHistogram) {
        // TODO: implement formula for scene change detection
        return Math.random() < 0.005;
    }

    function visualizeFrame(index) {
        var frame = videoProcessor.getFrame(index);
        var sceneContainer = document.getElementById('sceneContainer');
        sceneContainer.insertBefore(frame.createElement(), sceneContainer.firstChild);
    }

    return {
        addHistogram: function (histogram) {
            histograms.push(histogram);
            detectSceneChange();
        },
        clear: function () {
            histograms = [];
            var sceneContainer = document.getElementById('sceneContainer');
            sceneContainer.innerHTML = '';
        }
    };
}();