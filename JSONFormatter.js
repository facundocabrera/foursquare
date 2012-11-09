/**
JSONFormatter is taken from the excellent JSONView Firefox extension.
http://benhollis.net/software/jsonview/

MIT License

Copyright (c) 2009 Benjamin Hollis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
*/
window.JSONFormatter = {
    htmlEncode: function(t) {
        return t != null ? t.toString().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : ''; //"
    },
    
    decorateWithSpan: function(value, className) {
        return '<span class="' + className + '">' + this.htmlEncode(value) + '</span>';
    },

    // Convert a basic JSON datatype (number, string, boolean, null, object, array) into an HTML fragment.
    valueToHTML: function(value) {
        var valueType = typeof value;
        
        var output = "";
        if (value == null) {
            output += this.decorateWithSpan('null', 'null');
        } 
        else if (value && value.constructor == Array) {
            output += this.arrayToHTML(value);
        } 
        else if (valueType == 'object') {
            output += this.objectToHTML(value);
        } 
        else if (valueType == 'number') {
            output += this.decorateWithSpan(value, 'num');
        } 
        else if (valueType == 'string') {
            //       if (/^(http|https):\/\/[^\s]+$/i.test(value)) {
            //         output += '<a href="' + value + '">' + this.htmlEncode(value) + '</a>';
            //       } else {
            output += this.decorateWithSpan('"' + value + '"', 'string');
        //      }
        } 
        else if (valueType == 'boolean') {
            output += this.decorateWithSpan(value, 'bool');
        }
        
        return output;
    },

    // Convert an array into an HTML fragment
    arrayToHTML: function(json) {
        var output = '[<ul class="array collapsible">';
        var hasContents = false;
        for (var prop in json) {
            hasContents = true;
            output += '<li>';
            output += this.valueToHTML(json[prop]);
            output += '</li>';
        }
        output += '</ul>]';
        
        if (!hasContents) {
            output = "[ ]";
        }
        
        return output;
    },

    // Convert a JSON object to an HTML fragment
    objectToHTML: function(json) {
        var output = '{<ul class="obj collapsible">';
        var hasContents = false;
        for (var prop in json) {
            hasContents = true;
            output += '<li>';
            output += '<span class="prop" onclick="$(this).parent().children().last().toggle();">' + this.htmlEncode(prop) + '</span>: '
            output += this.valueToHTML(json[prop]);
            output += '</li>';
        }
        output += '</ul>}';
        
        if (!hasContents) {
            output = "{ }";
        }
        
        return output;
    },

    // Convert a whole JSON object into a formatted HTML document.
    jsonToHTML: function(json, callback, uri) {
        var output = '';
        if (callback) {
            output += '<div class="callback">' + callback + ' (</div>';
            output += '<div id="json">';
        } else {
            output += '<div id="json">';
        }
        output += this.valueToHTML(json);
        output += '</div>';
        if (callback) {
            output += '<div class="callback">)</div>';
        }
        return output;
    }
};