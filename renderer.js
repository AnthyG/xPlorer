// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const fs = require('fs');
const path = require('path');
const shell = require('electron').shell;
const ipc = require('electron').ipcRenderer;

/* FROM http://stackoverflow.com/a/14919494/5712160 */
function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si ? ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

function navto(to) {
    var to = to || ".";
    DIR = to;
    fs.realpath(to, function(err, rTo) {
        $('#pathcrumbs').html('');
        $('#pathcntnt').find('.pathcntnt').html('');
        $('#pathinput').val(rTo + '\\');
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
            $('<li class="breadcrumb-item" tpp="' + tillpathparts + '"><a href="#">' + pathpart + '</a></li>').on('click', function(e) {
                navto($(this).attr('tpp'));
            }).appendTo($('#pathcrumbs'));
            a++;
        });
        fs.readdir(rTo, function(err, files) {
            $('#pathcntnt').find('.pathcntnt').addClass('hide');
            $('#pathcntnt').find('.pathcntnt').parent('.pathcntntC').addClass('hide');
            files.forEach(file => {
                var fileP = fs.realpathSync(rTo + '\\' + file);
                fs.stat(fileP, function(err, stats) {
                    if (stats.isDirectory()) {
                        $('<li tpp="' + fileP + '"><a class="btn btn-link searchable" href="#">' + file + '</a></li>').on('click', function(e) {
                            navto($(this).attr('tpp'));
                        }).appendTo($('#pathcntnt').find('.dirs'));
                        $('#pathcntnt').find('.dirs').removeClass('hide');
                    } else {
                        var ct = stats['ctime'];

                        var ct_d = ct.getDate();
                        var ct_m = ct.getMonth();
                        var ct_y = ct.getFullYear();
                        if (ct_d < 10) {
                            ct_d = '0' + ct_d;
                        }
                        if (ct_m < 10) {
                            ct_m = '0' + ct_m;
                        }

                        var ct_H = ct.getHours();
                        var ct_M = ct.getMinutes();
                        if (ct_M < 10) {
                            ct_M = '0' + ct_M;
                        }

                        var fileT = ct_d + '.' + ct_m + '.' + ct_y + ' ' + ct_H + ':' + ct_M;
                        $('<tr searchable="' + file + '" rpp="' + fileP + '"><td><span>' + file + '</span></td><td>' + fileT + '</td><td>' + humanFileSize(stats['size'], true) + '</td></tr>').on('dblclick', function(e) {
                            shell.openItem($(this).attr('rpp'));
                        }).on('contextmenu', function(e) {
                            ipc.send('show-menu_file');
                            CONTEXTER = $(this).attr('rpp');
                        }).appendTo($('#pathcntnt').find('.files'));
                        // $('<li rpp="' + fileP + '"><a class="btn btn-link searchable" href="#">' + file + '</a></li>').on('dblclick', function() {
                        //     shell.openItem($(this).attr('rpp'));
                        // }).appendTo($('#pathcntnt').find('.files'));
                        $('#pathcntnt').find('.files').removeClass('hide');
                        $('#pathcntnt').find('.files').parent('.pathcntntC').removeClass('hide');
                    }
                });
            });
        });
    });
}

function searcher(srch) {
    var s = new RegExp(srch, "i") || "";
    console.log(srch);
    $('#pathcntnt').find('.pathcntnt').removeClass('hide');
    $('#pathcntnt').find('.pathcntnt').parent('.pathcntntC').removeClass('hide');
    $('#pathcntnt').find('.searchable').removeClass('hide');
    $('#pathcntnt').find('[searchable]').removeClass('hide');
    if (srch !== "" && typeof srch !== 'undefined' && typeof srch !== 'null') {
        $('#pathcntnt').find('.pathcntnt').each(function() {
            var disX = $(this);
            var foundone = false;
            disX.find('.searchable').each(function() {
                var disY = $(this);
                if (disY.html().search(srch) === -1) {
                    disY.addClass('hide');
                } else {
                    foundone = true;
                }
            });
            disX.find('[searchable]').each(function() {
                var disY = $(this);
                if (disY.attr('searchable').search(srch) === -1) {
                    disY.addClass('hide');
                } else {
                    foundone = true;
                }
            });
            if (foundone === false) {
                disX.addClass('hide');
                disX.parent('.pathcntntC').addClass('hide');
            }
        });
    }
}

var DIR = ".";
var DIRHISTORY_b = [];
var DIRHISTORY_f = [];
$(document).on('ready', function() {
    navto(DIR);

    $('#pathcrumbs').on('dblclick', function(e) {
        $('#pathcrumbs').toggleClass('hide');
        $('#pathinput').toggleClass('hide');
        $('#pathinput').focus();
    });
    // $('#pathinput').on('dblclick', function(e) {
    //     $('#pathcrumbs').toggleClass('hide');
    //     $('#pathinput').toggleClass('hide');
    // });
    // $('#pathinput').on('dblclick', function(e) {
    //     $('#pathcrumbs').toggleClass('hide');
    // });
    $('#pathcntnt').on('mousedown', function(e) {
        $('#pathcrumbs').removeClass('hide');
        $('#pathinput').addClass('hide');
    });
    $('.path_back').on('click', function(e) {

    });
    $('.path_for').on('click', function(e) {

    });
    $('.path_up').on('click', function(e) {
        navto(DIR + "\\..");
    });
    $('.path_refresh').on('click', function(e) {
        navto(DIR);
        $('#pathcrumbs').removeClass('hide');
        $('#pathinput').addClass('hide');
    });
    $('#pathinput').on('change', function(e) {
        navto($(this).val());
    });
    $('#pathinput').on('keydown', null, 'return', function(e) {
        $('#pathcrumbs').removeClass('hide');
        $('#pathinput').addClass('hide');
        // navto($(this).val());
    });

    $('#searchopener').on('click', function(e) {
        $(".upperbar").find('.search-part').toggleClass('hide');
        // $(".upperbar").find('.path-part').toggleClass('hide');
        searcher("");
        $('#pathcrumbs').removeClass('hide');
        $('#pathinput').addClass('hide');
    });
    $('#searchinput').on('change', function(e) {
        searcher($(this).val());
    });
    $('#searchgo').on('click', function(e) {
        searcher($('#searchinput').val());
    });
    $(document).on('keydown', null, 'ctrl+f', function(e) {
        $(".upperbar").find('.search-part').removeClass('hide');
        // $(".upperbar").find('.path-part').addClass('hide');
        $('#searchinput').focus();
        searcher($('#searchinput').val());
    });
    $('#searchinput').on('keydown', null, 'return', function(e) {
        if ($('#searchinput').val() === '') {
            $(".upperbar").find('.search-part').addClass('hide');
            // $(".upperbar").find('.path-part').removeClass('hide');
            searcher("");
        }
    });
    $('#searchinput').on('keydown', null, 'esc', function(e) {
        $(".upperbar").find('.search-part').addClass('hide');
        // $(".upperbar").find('.path-part').removeClass('hide');
        searcher("");
    });
});


(function() {

    const remote = require('electron').remote;

    function init() {
        document.getElementById("min-btn").addEventListener("click", function(e) {
            const window = remote.getCurrentWindow();
            window.minimize();
        });

        document.getElementById("max-btn").addEventListener("click", function(e) {
            const window = remote.getCurrentWindow();
            if (!window.isMaximized()) {
                window.maximize();
            } else {
                window.unmaximize();
            }
        });

        document.getElementById("close-btn").addEventListener("click", function(e) {
            const window = remote.getCurrentWindow();
            window.close();
        });
    };

    document.onreadystatechange = function() {
        if (document.readyState == "complete") {
            init();
        }
    };
})();

var CONTEXTER;
ipc.on('OPEN', function(event, arg) {
    shell.openItem(CONTEXTER);
});