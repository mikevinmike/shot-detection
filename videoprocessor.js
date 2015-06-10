'use strict';

var videoProcessor = function() {

    var video,
        canvas,
        ctx,
        frameWidth = 0,
        frameHeight = 0,
        framesDataURL = [],
        subscribers = [];

    function timerCallback() {
        if (video.paused || video.ended) {
            return;
        }
        computeFrame();
        setTimeout(function () {
            timerCallback();
        }, 10);
    }

    function computeFrame() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        framesDataURL.push(new Frame(canvas.toDataURL(), video.currentTime));
        var frame = ctx.getImageData(0, 0, canvas.width / 2, canvas.height / 2);

        var imageData = canvas.toDataURL('image/jpeg');
        document.getElementById('image').setAttribute('src', imageData);
        $('#image').trigger('imageDataChanged');

        var edgeCanvas = document.getElementById("rawData");
        var edgeCtx = edgeCanvas.getContext("2d");
        var edgeFrame = edgeCtx.getImageData(0, 0, edgeCanvas.width * 0.66, edgeCanvas.height * 0.66);
        var edgeHistogram = new Histogram();
        for (var index = 0; index < edgeFrame.data.length; index += 4) {
            var red = edgeFrame.data[index + 0];
            var green = edgeFrame.data[index + 1];
            var blue = edgeFrame.data[index + 2];
            edgeHistogram.increaseValuesFromRGB(red, green, blue);
        }

        var histogram = new Histogram();


        //shotDetection.addHistogram(histogram);
        //histogram.draw();

        shotDetection.addHistogram(edgeHistogram);
        edgeHistogram.draw();

        notifySubscribers();
    }

    function notifySubscribers() {
        for(var index = 0; index < subscribers.length; index++) {
            subscribers[index]();
        }
    }

    return {
        doLoad: function () {
            video = document.getElementById("video");
            canvas = document.getElementById("canvas");
            ctx = canvas.getContext("2d");
            video.addEventListener("play", function () {
                frameWidth = video.videoWidth;
                frameHeight = video.videoHeight;
                timerCallback();
            }, false);
            video.addEventListener("seeked", function () {
                shotDetection.clear();
                statistics.resetDetectedCuts();
            }, false);
        },
        getFrame: function (index) {
            return framesDataURL[index];
        },
        subscribe: function (subscriber) {
            if(typeof subscriber != 'function') {
                throw new Error('subscriber is no function')
            }
            subscribers.push(subscriber);
        },
        getCurrentTime: function () {
            if(!video) {
                return 0;
            }
            return video.currentTime;
        }
    };
}();