'use strict';


function Histogram() {
    this.initialize();
}

Histogram.prototype = {
    initialize: function() {
        this.values = [];
        this.fillDefaults(this.values, 0);
        this.canvas = document.getElementById("histogram");
        this.ctx = this.canvas.getContext("2d");
    },
    fillDefaults: function(array, defaultValue) {
        for (var i = 0; i < 512; i++) {
            array[i] = defaultValue;
        }
    },
    increaseRGB: function (red, green, blue) {
        var combinedValue = this.get9BitRGB(red, green, blue);
        this.increaseValues( combinedValue );
    },
    get9BitRGB: function (red, green, blue) {
        var quantisizedRed = red >> 5;
        var quantisizedGreen = green >> 5;
        var quantisizedBlue = blue >> 5;

        var combiningRed = quantisizedRed << 6;
        var combiningGreen = quantisizedGreen << 3;
        var combiningBlue = quantisizedBlue;

        var combined = combiningRed | combiningGreen | combiningBlue;

        return combined;
    },
    increaseValues: function (rgb) {
        this.values[rgb]++;
    },
    draw: function () {
        var ctx = this.ctx;
        var height = this.ctx.canvas.height;
        var max = Math.max.apply(this, this.values);

        ctx.fillStyle = "rgb(255,255,255)";
        for(var index = 0; index < this.values.length; index++) {
            var percentageValue = (this.values[index] / max) * height;
            ctx.fillRect(index, height, 1, -Math.round(percentageValue));
        }
    }
};