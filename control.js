//检查是否可以控制界面

function checkControl() {
    return gameStatus === 'begin' && curBlock != null;
}

//左右尝试
function adaptBorder(block) {
    if (!touchBorder(block['blocks'], COLS)) return block;

    block = getBlock(block.type, block.status, block.blocks[1].x - 1, block.blocks[1].y);
    if (!touchBorder(block['blocks'], COLS)) return block;
    block = getBlock(block.type, block.status, block.blocks[1].x + 2, block.blocks[1].y);
    if (!touchBorder(block['blocks'], COLS)) return block;

    if (block.type === 0) {
        block = getBlock(block.type, block.status, block.blocks[1].x - 3, block.blocks[1].y);
        if (!touchBorder(block['blocks'], COLS)) return block;
    }
    return null;
}

//旋转方块
function rotateBlock(block) {
    if (!checkControl())
        return;

    let temp = adaptBorder(getBlock(block.type, block.status + 1, block.blocks[1].x, block.blocks[1].y));
    if (!temp)
        return block;

    if (touchLand(temp.blocks, board, ROWS))
        return block;
    return temp;
}

//移动方块
function moveBlock(block, x, y) {
    if (!checkControl())
        return;
    //console.log(block);
    let temp = getBlock(block.type, block.status, block.blocks[1].x + x, block.blocks[1].y + y);
    if (touchBorder(temp.blocks, COLS))
        return block;
    if (!touchLand(temp.blocks, board, ROWS))
        return temp;
    if (y <= 0)
        return block;
    land(block, board);
    let line = clearLines(board, COLS, ROWS);
    if (line !== 0) {
        calculateComb(comb);
        score += scoreList[line] * comb.level;
        drawCeleb(comb.level);
    }
    return getBlock(randnum(0, 7), 0, 7, 1);
}

//存储或交换取出一个方块
function saveABlock(block) {
    if (saveBlock === null) {
        saveBlock = getBlock(block.type, block.status, 1, 1);
        return getBlock(randnum(0,7), 0, 7, 1);
    }

    let temp = adaptBorder(getBlock(saveBlock.type, saveBlock.status, block.blocks[1].x, block.blocks[1].y));
    if (!temp)
        return block;

    if (touchLand(temp.blocks, board, ROWS))
        return block;

    saveBlock = getBlock(block.type, block.status, 1, 1);
    return temp;
}

//预判阴影部分
function previewBlock(blocks, board) {
    let temp = [];
    for (let i = 0; i < blocks.length; ++i) {
        temp[i] = {};
        temp[i].x = blocks[i].x;
        temp[i].y = blocks[i].y;
    }
    //console.log('preview');
    while (!touchLand(temp, board, ROWS)) {
        for (b of temp)
            ++b.y;
    }
    if (temp[1].y > blocks[1].y) {
        for (b of temp) {
            --b.y;
        }
    }

    //console.log(temp);
    return temp;
}

//直接落下
function down(block, board) {
    let temp = previewBlock(block.blocks, board);
    return moveBlock(getBlock(block.type, block.status, temp[1].x, temp[1].y), 0, 1);
}

function controllerPC() {
    $(document).keydown(function (event) {
        if (gameStatus !== 'begin') return;
        // console.log(event.key);
        if (!event) return;
        if (moveAlarm) return;
        switch (event.key) {
            case 'ArrowUp':
                curBlock = rotateBlock(curBlock);
                break;
            case 'ArrowDown':
                curBlock = moveBlock(curBlock, 0, 1);
                moveAlarm = setInterval(function () {
                    curBlock = moveBlock(curBlock, 0, 1);
                },150);
                break;
            case 'ArrowLeft':
                curBlock = moveBlock(curBlock, -1, 0);
                moveAlarm = setInterval(function () {
                    curBlock = moveBlock(curBlock, -1, 0);
                },150);
                break;
            case 'ArrowRight':
                curBlock = moveBlock(curBlock, 1, 0);
                moveAlarm = setInterval(function () {
                    curBlock = moveBlock(curBlock, 1, 0);
                },150);
                break;
            case ' ':
                curBlock = down(curBlock, board);
                break;
            case 'z':
                curBlock = saveABlock(curBlock);
                break;
        }
    });
    $(document).keyup(function (event) {
        //console.log(event.key);
        if (gameStatus !== 'begin') return;
        if (!event) return;
        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                if (moveAlarm)
                    clearInterval(moveAlarm);
                moveAlarm = null;
                break;
        }
    });
}

//移动端判断方向
function getDirention(start, end, flex) {
    // console.log('x = ' + Math.abs(start.x - end.x));
    // console.log('y = ' + Math.abs(start.y - end.y));
    if (Math.abs(start.x - end.x) <= flex && Math.abs(start.y - end.y) <= flex)
        return 0;
    if (Math.abs(start.x - end.x) > Math.abs(start.y - end.y)) {
        if (end.x > start.x)
            return RIGHT;
        else
            return LEFT;
    } else {
        if (end.y > start.y)
            return DOWN;
        else
            return UP;
    }
}

//获取长度
function getDistance(start, end) {
    return Math.sqrt(Math.pow(Math.abs(start.x - end.x), 2) + Math.pow(Math.abs(start.y - end.y), 2));
}

function controllerMove() {
    let pos = {}, posStart = {}, posEnd = {};
    //移动端
    document.addEventListener('touchstart', function (event) {
        if (gameStatus !== 'begin') return;
        if (!event) return;
        // console.log(event);
        pos['x'] = event.targetTouches[0].pageX;
        pos['y'] = event.targetTouches[0].pageY;
        posStart['x'] = event.targetTouches[0].pageX;
        posStart['y'] = event.targetTouches[0].pageY;
    }, false);
    document.addEventListener('touchmove', function (event) {
        if (gameStatus !== 'begin') return;
        if (!event) return;
        // console.log(event);
        //当屏幕有多个touch或者页面被缩放过，就不执行move操作
        if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
        posEnd['x'] = event.targetTouches[0].pageX;
        posEnd['y'] = event.targetTouches[0].pageY;
        let direction = getDirention(posStart, posEnd, 5);
        let distance = getDistance(posStart, posEnd);
        if (distance < 50) return;
        switch (direction) {
            case DOWN:
                // curBlock = moveBlock(curBlock, 0, 1);
                // canDonw = false;
                // setTimeout(function () {
                //     canDown = true;
                // },500);
                break;
            case LEFT:
                curBlock = moveBlock(curBlock, -1, 0);
                break;
            case RIGHT:
                curBlock = moveBlock(curBlock, 1, 0);
                break;
        }
        if (direction === DOWN || direction === LEFT || direction === RIGHT) {
            posStart['x'] = posEnd['x'];
            posStart['y'] = posEnd['y'];
        }
    }, false);
    document.addEventListener('touchend', function (event) {
        if (gameStatus !== 'begin') return;
        if (!event) return;
        posEnd['x'] = event.changedTouches[0].pageX;
        posEnd['y'] = event.changedTouches[0].pageY;
        let direction = getDirention(pos, posEnd, 5);
        let distance = getDistance(pos, posEnd);
        // console.log('direction = ' + direction);
        // console.log('distance = ' + distance);
        switch (direction) {
            case 0:
                curBlock = saveABlock(curBlock);
                break;
            case UP:
                if (distance >= 30) {
                    curBlock = rotateBlock(curBlock);
                }
                break;
            case DOWN:
                if (distance >= 100) {
                    curBlock = down(curBlock, board);
                    canDonw = false;
                    setTimeout(function () {
                        canDown = true;
                    },500);
                }
                break;
        }
    }, false);
}
