//初始化全局变量
var OFFSETX = 0;
var OFFSETY = 0;
var SIDELEN = 0;
var BORDERWID = 1;
var COLS = 13;
var ROWS = 20;
var board = null;
var curBlock = null;
var gameStatus = 'wait';
var score = 0;
var scoreList = [0, 1, 3, 6, 10];
var blockAlarm = null;
var screenAlarm = null;
var moveAlarm = null;
var celebAlarm = null;
var comb = {'level':null, 'alarm': null};
var saveBlock = null;
var saveBoard = null;

$(function () {
    adaptAllSize();
    $('.firstWord').show();
    //导航栏
    //开始暂停键
    selector = $('#begin');
    selector.mouseenter(function () {
        $(this).addClass('fontBold');
    });
    selector.mouseleave(function () {
        $(this).removeClass('fontBold');
    });
    selector.click(function () {
        if ($(this).children('.firstWord').css('display') === 'block') {
            $('.firstWord').hide();
            $('.secondWord').show();
            $('#game>.secondWord').text('');
            $(this).children('.secondWord').text('暂停游戏');
            gameMain(parseInt($('#speedVal>i').html()));
        } else {
            let content = $(this).children('.secondWord').text().trim();
            if (content === '暂停游戏') {
                $(this).children('.secondWord').text('继续游戏');
                pauseGame();
            } else if (content === '继续游戏') {
                $(this).children('.secondWord').text('暂停游戏');
                gameMain(parseInt($('#speedVal>i').html()));
            } else {
               $('.firstWord').show();
               $('.secondWord').hide();
               clearBoard(board, 3);
               resetGlobal();
               drawBlocks(board);
            }
        }
    });

    //记录
    selector = $('#record');
    selector.mouseenter(function () {
        $(this).addClass('fontBold');
    });
    selector.mouseleave(function () {
        $(this).removeClass('fontBold');
    });
    $('#record>.firstWord').click(function () {
        $.get('getrecord.php', function (data, status) {
            //console.log(status);
            //console.log(data);
            if (status === 'success') {
                showRecord(data);
                $('#background').show();
            } else {
                alert('记录读取失败');
            }
        });
    });

    $('#recordList>.x').click(function () {
        $('#recordList').hide();
        $('#background').hide();
    });

    $('#scoreSubmit>.button').click(function () {
        submitRecord($('#scoreSubmit>.input>input').val(), $('#record>.secondWord>span').text());
    });

    //游戏设置
    selector = $('#set');
    selector.mouseenter(function () {
        if ($(this).children('.firstWord').css('display') === 'none')
            return;
        $(this).children(':not(.firstWord)').css({'display': 'block', 'position': 'absolute'});
    });
    selector.mouseleave(function () {
        if ($(this).children('.firstWord').css('display') === 'none')
            return;
        $(this).children(':not(.firstWord)').css('display', 'none');
    });

    selector = $('#mode, #speed');
    selector.mouseenter(function () {
        $(this).children(':not(.firstWord)').css({'display': 'block', 'position': 'absolute'});
    });
    selector.mouseleave(function () {
        $(this).children(':not(.firstWord)').css('display', 'none');
    });

    $('#mode>div').click(function () {
        if ($(this).text().trim() === "双人模式") {
            window.alert('敬请期待');
            return;
        }
        $(this).siblings('.firstWord').text($(this).text().trim());
        // $(this).parent().contents()[0].remove();
        // $(this).parent().prepend($(this).text().trim());
    });
    $('#speedVal>span').click(function () {
        var i = $(this).siblings('i').text();
        if ($(this).text().trim() === '>') {
            if (i < 9) ++i;
            else window.alert('速度范围1~9！');
        }
        else {
            if (i > 1) --i;
            else window.alert('速度范围1~9！');
        }
        $(this).siblings('i').text(i);
    });

    //浏览器调整大小
    $(window).resize(function () {
        adaptAllSize();
        board = initBoard();
    });

    //游戏界面
    board = initBoard();
    //注册键盘事件
    controller();
});

function resetGlobal() {
    curBlock = null;
    gameStatus = 'wait';
    score = 0;
    scoreList = [0, 1, 3, 6, 10];
    blockAlarm = null;
    screenAlarm = null;
    moveAlarm = null;
    celebAlarm = null;
    comb = {'level':null, 'alarm': null};
    saveBlock = null;
}

//适应屏幕大小
function adaptAllSize() {
    let width = Math.max(500, $(window).width());
    let height = Math.max(700, $(window).height());

    let selector = $('#screen');
    adaptActive(selector, 9, 14, width, height);
    selector = $('#game');
    adaptActive(selector, 9, 14,
        parseInt(selector.parent().css('width')),
        parseInt(selector.parent().css('height')));
    $('#navigation').css("width", selector.css("width"));

    SIDELEN = Math.min(parseInt(selector.css('width')) / COLS,
        parseInt(selector.css('height')) / ROWS);
    SIDELEN = parseInt(SIDELEN);
    OFFSETX = (parseInt(selector.css('width')) - SIDELEN * COLS) / 2;
    OFFSETX = parseInt(OFFSETX);
    OFFSETY = (parseInt(selector.css('height')) - SIDELEN * ROWS);
    OFFSETY = parseInt(OFFSETY);
    if (OFFSETY > OFFSETX)
        OFFSETY -= OFFSETX;
    console.log(SIDELEN + ' ' + OFFSETX + ' ' + OFFSETY);

    let lineHeight = parseInt(selector.css('height')) / 8;
    $('#game>.firstWord, #game>.secondWord').css({
        'width': selector.css('width'), 'height': selector.css('height'),
        'font-size': parseInt(lineHeight / 2)
    });

    // adaptActive($('#recordList'), 3, 5, selector.css('width'), selector.css('height'));

    selector = $('#navigation>div, #navigation>div>div');
    selector.css("line-height", selector.css('height'));
    selector.css("font-size", parseInt(selector.css('height')) / 2);


}
