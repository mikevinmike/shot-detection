'use strict';

var shotDetection = function() {

    var histograms = [];
    var lastFrameNo = -1;
    var frameDisplacement = 9; // number of frames to skip for scene change detection
    var pufferSize = 6; // number of histograms to compare for scene change detection
    var pufferSizeWithFrameDisplacement = pufferSize * frameDisplacement;

    var sceneChangeMultipleWorker = new Worker("scene-change-multiple.worker.js");
    sceneChangeMultipleWorker.onmessage = function addSceneChange(event){
        var index = event.data;
        countSceneChange(index);
    };

    function detectSceneChange() {
        lastFrameNo++;
        if(lastFrameNo % parseInt(pufferSizeWithFrameDisplacement * 0.9) !== 0) {
            return
        }
        var numberOfHistograms = histograms.length;
        if(numberOfHistograms < pufferSizeWithFrameDisplacement) {
            return;
        }

        var histogramValuesPuffer = [];
        for(var index = numberOfHistograms - 1 - pufferSizeWithFrameDisplacement; index < numberOfHistograms; index += frameDisplacement) {
            histogramValuesPuffer.push(histograms[index].values);
        }

        sceneChangeMultipleWorker.postMessage({
            histogramValueArray: histogramValuesPuffer,
            index: numberOfHistograms - 1
        });
    }

    function countSceneChange(index) {
        visualizeFrame(index);
        statistics.increaseDetectedCuts(index);
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
            lastFrameNo = -1;
            histograms = [];
            var sceneContainer = document.getElementById('sceneContainer');
            sceneContainer.innerHTML = '';
        }
    };
}();
