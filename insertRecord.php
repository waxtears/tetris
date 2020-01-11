<?php

//创建数据库连接
$db = mysqli_connect('localhost', 'root', 'dongzj_123', 'tetris');
if (!$db) {
    die("连接失败: " . mysqli_connect_error());
}

$sql = 'SELECT * FROM rank ORDER BY "index"';
$result = mysqli_query($db, $sql);
$rank = array();

if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        array_push($rank, array('id'=>$row['index'], 'name'=>$row['name'], 'score'=>$row['score']));
    }
}
$name = $_POST['name'];
$score = $_POST['score'];
if (!$score) {
    $score = 0;
}

error_log('insertRecord name = ' . $name . ' score = ' . $score . "\n", 3, './log/php.log');
$len = count($rank);
$find = false;
for ($i = 0; $i < $len - 1; ++$i) {
    if ($score < $rank[$i]['score'])
        continue;
    if (!$find) {
        $rank[$len - 1]['id'] = $i + 1;
        $rank[$len - 1]['name'] = $name;
        $rank[$len - 1]['score'] = $score;
        $find = true;
    }
    $rank[$i]['id'] += 1;
}

if (!$find) {
    echo "success";
    return;
}

for ($i = 0; $i < $len; ++$i) {
    $sql = 'UPDATE rank set `name` = "' . $rank[$i]['name'] . '", `score` = ' . $rank[$i]['score'] . ' WHERE `index` = ' . $rank[$i]['id'];
    $result = mysqli_query($db, $sql);
    error_log($sql . ", result = " . $result . "\n", 3, './log/php.log');
    if ($result != 1)
        break;
}

if ($result == 1) {
    echo "success";
} else {
    echo "failed";
}
mysqli_close($db);
?>
