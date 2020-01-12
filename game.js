//生产随机数
function randnum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

//判断边界
function touchBorder(blocks, X) {
    for (block of blocks) {
        if (block.x < 0 || block.x >= X)
            return true;
    }
    return false;
}

//判断落地
function touchLand(blocks, board, Y) {
    for (block of blocks) {
        if (block.y >= Y)
            return true;
        if (board[block.x][block.y].ok === 3)
            return true;
    }
    return false;
}

//方块落地
function land(block, board) {
    for (b of block.blocks) {
        board[b.x][b.y].ok = 3;
    }
}

//清除行
function clearLines(board, X, Y) {
    let complete = [];
    for (let y = 0; y < Y; ++y) {
        complete[y] = true;
        for (let x = 0; x < X; ++x) {
            if (board[x][y].ok !== 3) {
                complete[y] = false;
                break;
            }
        }
    }
    let line = 0;
    for (let y = Y - 1; y >= 0; --y) {
        if (complete[y]) {
            ++line;
            continue;
        }
        //console.log('line = ' + line);
        if (line > 0) {
            //console.log('y = ' + y);
            for (let x = 0; x < X; ++x) {
                //console.log(board[x][y].ok);
                board[x][y+line].ok = board[x][y].ok;
            }
        }
    }
    for (let y = line; y >= 0; --y) {
        for (let x = 0; x < X; ++x) {
            board[x][y].ok = 0;
        }
    }
    return line;
}

//游戏结束
function over(newBlock, board) {
    for (let x = 0; x < COLS; ++x) {
        if (board[x][0].ok === 3)
            return true;
    }
    for (block of newBlock.blocks) {
        if (board[block.x][block.y].ok === 3)
            return true;
    }
    return false;
}

//计算连击次数
function calculateComb(comb) {
    if (comb.alarm) clearTimeout(comb.alarm);
    ++comb.level;
    let time = comb.level > 4 ? 2000 : 7000 - 1000 * comb.level;
    comb.alarm = setTimeout(function (comb) {
        console.log(comb.level);
        comb.level = 0;
        comb.alarm = null;
    }, time, comb);
}

//游戏主函数
function gameMain(speed) {

    //生产第一个block
    if (gameStatus === 'wait') {
        saveBoard = initSaveBoard();
        curBlock = getBlock(randnum(0, 7), 0, 7, 1);
    }

    gameStatus = 'begin';

    //定时block向下移动
    blockAlarm = setInterval(function () {
        curBlock = moveBlock(curBlock, 0, 1);
        $('#record>.secondWord>span').text(score);
        if (over(curBlock, board)) {
            clearInterval(blockAlarm);
            gameStatus = 'over';
        }
    }, 1500 / speed);

    //定时刷新屏幕
    screenAlarm = setInterval(function () {
        if (gameStatus === 'over') {
            clearInterval(screenAlarm);
            //$('#game').prepend('游戏结束');
            $('#game>.secondWord').text('游戏结束');
            showSubmit($('#record>.secondWord>span').text());
            $('#begin>.secondWord').text('回到首页');
        }

        clearBoard(board, 2);
        setBlock(previewBlock(curBlock['blocks'], board), board, 1);
        setBlock(curBlock['blocks'], board, 2);
        drawBlocks(board);

        clearBoard(saveBoard, 1);
        if (saveBlock) {
           setBlock(saveBlock['blocks'], saveBoard, 1);
        }
        drawBlocks(saveBoard);

    }, 100);
}

function pauseGame() {
    clearInterval(blockAlarm);
    clearInterval(screenAlarm);
    gameStatus = 'pause';
}
