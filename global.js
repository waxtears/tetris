//初始化全局变量
var SIDELEN = 42;
var BORDERWID = 1;
var COLS = 13;
var ROWS = 17;
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

$(function () {
    //导航栏
    //开始暂停键
    let selector = $('#begin');
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
    //游戏界面
    board = initBoard(0, 6, COLS, ROWS, SIDELEN, BORDERWID);
    //注册键盘事件
    controller();
})

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

