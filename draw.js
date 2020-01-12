//画板
function drawBoard(selector, blockStr, style, offsetX, offsetY, rows, cols, sideLength, borderWidth, num = 0) {
    let board = [];

    let index = 0;
    for (let x = 0; x < cols; ++x) {
        board[x] = [];
        for (let y = 0; y < rows; ++y) {
            board[x][y] = {};
            board[x][y]['x'] = offsetX + x * sideLength;
            board[x][y]['y'] = offsetY + y * sideLength;
            board[x][y]['ok'] = num; //0无，1预判，2方块（活跃的），3落地的（稳定的）
            board[x][y]['id'] = blockStr + index;
            let htmlStr = '<div id="' + board[x][y].id + '"></div>';
            selector.append(htmlStr);
            style['position'] = 'absolute';
            style['left'] = board[x][y].x + 'px';
            style['top'] = board[x][y].y + 'px';
            style['width'] = sideLength;
            style['height'] = sideLength;
            style['border'] = borderWidth + 'px solid white';
            style['box-sizing'] = 'border';
            $('#' + board[x][y].id).css(style);
            ++index;
        }
    }

    return board;
}

//初始化游戏白板
function initBoard() {
    let style = {
        'background-color': 'black',
        'display': 'none',
        'opacity': '0.8'
    };
    return drawBoard($('#game'), 'board', style, -1, 4, ROWS, COLS,
                     SIDELEN, BORDERWID);
}

//初始化存储块
function initSaveBoard() {
    let style = {
        'background-color': 'black',
        'display': 'none',
        'opacity': '0.3'
    };
    return drawBoard($('#set>.secondWord'), 'saveBoard', style, 1, 1,
                     4, 4, 12, 1);
}

//画出当前的所有方块
function drawBlocks(board) {
    for (blockRow of board) {
        for (block of blockRow) {
            let selector = $('#' + block.id);
            if (block.ok >= 2) {
                selector.css('background-color','black');
                selector.show();
            } else if (block.ok === 1) {
                selector.css('background-color','gray');
                selector.show();
            } else {
                selector.hide();
            }
        }
    }
}

//初始化七种方块[1][1]为中心
function getBlock(type, status, x, y) {
    let block = [{}, {}, {}, {}];
    switch (type) {
        case 0:                             //oooo
            if (status % 2 === 0) {
                block[0]['x'] = x - 1;
                block[0]['y'] = y;
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x + 1;
                block[2]['y'] = y;
                block[3]['x'] = x + 2;
                block[3]['y'] = y;
            } else {                        //o
                block[0]['x'] = x;          //o
                block[0]['y'] = y - 1;      //o
                block[1]['x'] = x;          //o
                block[1]['y'] = y;
                block[2]['x'] = x;
                block[2]['y'] = y + 1;
                block[3]['x'] = x;
                block[3]['y'] = y + 2;
            }
            break;
        case 1:
            if (status % 4 === 0) {         // o
                block[0]['x'] = x;          //ooo
                block[0]['y'] = y - 1;
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x - 1;
                block[2]['y'] = y;
                block[3]['x'] = x + 1;
                block[3]['y'] = y;
            } else if (status % 4 === 1) {  //o
                block[0]['x'] = x;          //oo
                block[0]['y'] = y - 1;      //o
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x;
                block[2]['y'] = y + 1;
                block[3]['x'] = x + 1;
                block[3]['y'] = y;
            } else if (status % 4 === 2) {  //ooo
                block[0]['x'] = x;          // o
                block[0]['y'] = y + 1;
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x - 1;
                block[2]['y'] = y;
                block[3]['x'] = x + 1;
                block[3]['y'] = y;
            } else if (status % 4 === 3) {  // o
                block[0]['x'] = x;          //oo
                block[0]['y'] = y - 1;      // o
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x - 1;
                block[2]['y'] = y;
                block[3]['x'] = x;
                block[3]['y'] = y + 1;
            }
            break;

        case 2:
            if (status % 4 === 0) {         //  o
                block[0]['x'] = x - 1;      //ooo
                block[0]['y'] = y;
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x + 1;
                block[2]['y'] = y;
                block[3]['x'] = x + 1;
                block[3]['y'] = y - 1;
            } else if (status % 4 === 1) {  //o
                block[0]['x'] = x;          //o
                block[0]['y'] = y - 1;      //oo
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x;
                block[2]['y'] = y + 1;
                block[3]['x'] = x + 1;
                block[3]['y'] = y + 1;
            } else if (status % 4 === 2) {  //ooo
                block[0]['x'] = x - 1;      //o
                block[0]['y'] = y;
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x - 1;
                block[2]['y'] = y + 1;
                block[3]['x'] = x + 1;
                block[3]['y'] = y;
            } else if (status % 4 === 3) {  //oo
                block[0]['x'] = x;          // o
                block[0]['y'] = y + 1;      // o
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x;
                block[2]['y'] = y - 1;
                block[3]['x'] = x - 1;
                block[3]['y'] = y - 1;
            }
            break;
                //o
        case 3: //ooo
            if (status % 4 === 0) {         //o
                block[0]['x'] = x + 1;      //ooo
                block[0]['y'] = y;
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x - 1;
                block[2]['y'] = y;
                block[3]['x'] = x - 1;
                block[3]['y'] = y - 1;
            } else if (status % 4 === 1) {  //oo
                block[0]['x'] = x;          //o
                block[0]['y'] = y + 1;      //o
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x;
                block[2]['y'] = y - 1;
                block[3]['x'] = x + 1;
                block[3]['y'] = y - 1;
            } else if (status % 4 === 2) {  //ooo
                block[0]['x'] = x - 1;      //  o
                block[0]['y'] = y;
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x + 1;
                block[2]['y'] = y;
                block[3]['x'] = x + 1;
                block[3]['y'] = y + 1;
            } else if (status % 4 === 3) {  // o
                block[0]['x'] = x;          // o
                block[0]['y'] = y - 1;      //oo
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x;
                block[2]['y'] = y + 1;
                block[3]['x'] = x - 1;
                block[3]['y'] = y + 1;
            }
            break;
        case 4:
            block[0]['x'] = x - 1;          //oo
            block[0]['y'] = y;              //oo
            block[1]['x'] = x;
            block[1]['y'] = y;
            block[2]['x'] = x - 1;
            block[2]['y'] = y + 1;
            block[3]['x'] = x;
            block[3]['y'] = y + 1;
            break;
        case 5:
            if (status % 2 === 0) {     //oo
                block[0]['x'] = x - 1;  // oo
                block[0]['y'] = y;
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x;
                block[2]['y'] = y + 1;
                block[3]['x'] = x + 1;
                block[3]['y'] = y + 1;
            } else {
                block[0]['x'] = x;      // o
                block[0]['y'] = y - 1;  //oo
                block[1]['x'] = x;      //o
                block[1]['y'] = y;
                block[2]['x'] = x - 1;
                block[2]['y'] = y;
                block[3]['x'] = x - 1;
                block[3]['y'] = y + 1;
            }
            break;

        case 6:
            if (status % 2 === 0) {     // oo
                block[0]['x'] = x - 1;  //oo
                block[0]['y'] = y;
                block[1]['x'] = x;
                block[1]['y'] = y;
                block[2]['x'] = x;
                block[2]['y'] = y - 1;
                block[3]['x'] = x + 1;
                block[3]['y'] = y - 1;
            } else {
                block[0]['x'] = x;      //o
                block[0]['y'] = y - 1;  //oo
                block[1]['x'] = x;      // o
                block[1]['y'] = y;
                block[2]['x'] = x + 1;
                block[2]['y'] = y;
                block[3]['x'] = x + 1;
                block[3]['y'] = y + 1;
            }
            break;
        default:
            alert("方块类型错误 type = " + type);
    }
    return {'type': type, 'status': status, 'blocks': block};
}

//设置blocks中的方块
function setBlock(blocks, board, num) {
    //console.log(blocks);
    for (block of blocks) {
        board[block.x][block.y].ok = num;
    }
}

//将所有方块设置为0
function clearBoard(board, num) {
    for (blockRow of board) {
        for (block of blockRow) {
            if (block.ok <= num)
                block.ok = 0;
        }
    }
}

//展示记录
function showRecord(info) {
    let data = JSON.parse(info);
    $('#recordList').show();
    let showData = "<table>";
    showData = "<tr> <td>id</td> <td>name</td> <td>score</td> </tr>";
    for (let i = 0; i < data.length; ++i) {
        showData += '<tr>';
        showData += '<td>' + data[i]['id'] + '</td><td>' + data[i]['name'] + '</td><td>' + data[i]['score'] + '</td>';
        showData += '</tr>';
    }
    showData += "</table>";
    //console.log(showData);
    let selector = $('#list');
    selector.html(showData);
    $('#list *').css({'text-align':'center', 'width':'120px', 'height':'45px'});
}

//提交记录板
function showSubmit(score) {
    $.get('getrecord.php', function (info, status) {
        if (status === 'success') {
            let data = JSON.parse(info);
            console.log('showSubmit : ' + score);
            if (parseInt(score) < parseInt(data[data.length - 1]["score"]))
                return;
            $('#background').show();
            $('#scoreSubmit').show();
        } else {
            alert('与服务器连接失败');
        }
    });
}

//提交记录
function submitRecord(name, score) {
    if (!checkName(name)) {
        $('#scoreSubmit>.input>span').text('姓名只能包含字母数字下划线，长度3-10');
        return;
    } else {
        $('#scoreSubmit>.input>span').text('');
    }
    console.log(name);
    console.log(score);
    $.post("insertRecord.php", {
        'name': name,
        'score': score
    }, function(data, status) {
        console.log(status);
        console.log(data);
        if (status !== 'success') {
            alert('记录插入失败');
        }
        $('#background').hide();
        $('#scoreSubmit').hide();
    });
}

//检查姓名
function checkName(name) {
    //console.log(name);
    return /^\w{3,10}$/.test(name);
}

//庆祝语
function drawCeleb(level) {
    selector = $('#game').children('.secondWord');
    switch (level) {
        case 0:
        case 1:
            break;
        case 2:
            selector.text('2连击');
            break;
        case 3:
            selector.text('3连击');
            break;
        case 4:
            selector.text('4连击');
            break;
        case 5:
            selector.text('5连击');
            break;
        case 6:
            selector.text('6连击');
            break;
        default:
            selector.text('超神了');
            break;
    }
    if (level >= 2) {
        if (celebAlarm) clearTimeout(celebAlarm);
        celebAlarm = setTimeout(function () {
            selector.text('');
        }, 800);
    }
}
