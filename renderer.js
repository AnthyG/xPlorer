// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs');
const path = require('path');
const shell = require('electron').shell;

function navto(to) {
    console.log("NavTo >> " + to);
    fs.realpath(to, function(err, rTo) {
        $('#pathcrumbs').html('');
        $('#pathcntnt').html('');
        var tillpathparts = "";
        var fncs;
        fncs = [];
        var a = 0;
        rTo.split("\\").forEach(pathpart => {
            if (tillpathparts !== "") {
                tillpathparts += "\\" + pathpart;
            } else {
                tillpathparts = pathpart;
            }
            $('<li class="breadcrumb-item" tpp="' + tillpathparts + '"><a href="#">' + pathpart + '</a></li>').on('click', function() {
                navto($(this).attr('tpp'));
            }).appendTo($('#pathcrumbs'));
            a++;
        });
        fs.readdir(rTo, function(err, files) {
            files.forEach(file => {
                var fileP = fs.realpathSync(rTo + '\\' + file);
                fs.stat(fileP, function(err, stats) {
                    console.log(stats.isDirectory());
                    if (stats.isDirectory()) {
                        $('<li tpp="' + fileP + '"><a class="btn btn-primary href="#">' + file + '</a></li>').on('click', function() {
                            navto($(this).attr('tpp'));
                        }).appendTo($('#pathcntnt'));
                    } else {
                        $('<li rpp="' + fileP + '"><a class="btn" href="#">' + file + '</a></li>').on('dblclick', function() {
                            shell.openItem($(this).attr('rpp'));
                        }).appendTo($('#pathcntnt'));
                    }
                });
            });
        });
    });
}

$('#pathinput').on('dblclick', function() {
    $('#pathcrumbs').toggleClass('hide');
});

$(document).on('ready', function() {
    navto(".");
});