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
print_r(json_encode($rank));
mysqli_close($db);
?>
