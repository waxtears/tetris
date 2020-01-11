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

function controller() {
    $(document).keydown(function (event) {
        if (gameStatus !== 'begin')
            return;
        //console.log(event.key);
        if (!event)
            return;
        if (moveAlarm)
            return;
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
        }
    });
    $(document).keyup(function (event) {
        //console.log(event.key);
        if (gameStatus !== 'begin')
            return;
        if (!event)
            return;
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

