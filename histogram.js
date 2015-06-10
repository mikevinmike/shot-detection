'use strict';


function Histogram(colorSpace) {
    this.setColorSpace(colorSpace);
    this.initialize();
}

Histogram.prototype = {
    initialize: function() {
        this.values = [];
        this.fillDefaults(this.values, 0);
        this.canvas = document.getElementById("histogram");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.valuesLength;
    },
    fillDefaults: function(array, defaultValue) {
        for (var i = 0; i < this.valuesLength; i++) {
            array[i] = defaultValue;
        }
    },
    setColorSpace: function (colorSpace) {
        if(colorSpace == 'rgb') {
            this.getValueFromRGB = this.get9BitRGB;
            this.valuesLength = 512;
        } else {
            this.getValueFromRGB = this.getYFromRGB;
            this.valuesLength = 256;
        }
    },
    increaseValuesFromRGB: function (red, green, blue) {
        var combinedValue = Math.round( this.getValueFromRGB(red, green, blue) );
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
    getYFromRGB: function (red, green, blue) {
        var r = 0.299 * red + 0.587 * green + 0.114 * blue;
        return r
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
    },
    getValues: function () {
        return this.values;
    }
};