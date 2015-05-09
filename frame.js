'use strict';


function Frame(dataURL, time) {
    this.dataURL = dataURL;
    this.time = time;
};

Frame.prototype = {
    createElement: function () {
        var frameContainer = document.createElement('div');
        frameContainer.className = 'frame';
        var imageElement = document.createElement('img');
        var caption = document.createElement('span');
        imageElement.src = this.dataURL;
        caption.innerHTML = this.getTimeFormatted();

        frameContainer.appendChild(imageElement);
        frameContainer.appendChild(caption);

        return frameContainer;
    },
    getTimeFormatted: function () {
        var hours = Math.floor(this.time / 60 / 60);
        var minutes = Math.floor(this.time / 60 - hours);
        var secondsRaw = this.time - hours * 60 * 60 - minutes * 60;
        var seconds = Math.floor(secondsRaw);
        var milliseconds = Math.floor((secondsRaw - Math.floor(secondsRaw)) * 1000);

        var timeString = '';
        if(hours > 0) {
            timeString += hours + ':';
        }
        timeString += minutes + ':';
        timeString += seconds.toString().length == 1 ? '0' + seconds : seconds;
        timeString += '.' + milliseconds;

        return timeString;
    }
};