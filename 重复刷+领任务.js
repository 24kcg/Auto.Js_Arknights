
toastLog("请求截图权限(横屏截图)");
if (!requestScreenCapture(true)) {
    toast("请求截图失败");
    exit();
}
sleep(6000);//暂停6毫秒,1秒等于1000毫秒

//屏幕高度
var height = device.height;
//屏幕宽度
var width = device.width;

//保存布尔值（true/false）
var TorF;
//保存读取的图片
var img_small;
//保存找图后的返回值
var p;
//根据这个返回不同的值
var returnP;


//图片名称，找图位置，根据传入的值执行不同操作
function 找图_通用(picture, position, returnP) {
    //不传参数时，returnP的默认值为'no'
    returnP = returnP || 'no';
    //不传参数时，position的默认值为'全屏'
    position = position || '全屏';

    //弹出消息时有些地方会被挡住，影响找图
    if (picture != "线索_6") {
        toastLog("找图 - " + picture);
    }
    img_small = images.read("/sdcard/mrfz/" + picture + ".jpg");



    switch (position) {
        case '全屏':
            p = findImage(captureScreen(), img_small, {
                region: [0, 0, height, width]
            });
            break;
        case '上半屏':
            p = findImage(captureScreen(), img_small, {
                region: [0, 0, height, width / 2]
            });
            break;
        case '下半屏':
            p = findImage(captureScreen(), img_small, {
                region: [0, width / 2, height, width / 2]
            });
            break;
        case '左半屏':
            p = findImage(captureScreen(), img_small, {
                region: [0, 0, height / 2, width]
            });
            break;
        case '右半屏':
            p = findImage(captureScreen(), img_small, {
                region: [height / 2, 0, height / 2, width]
            });
            break;
        case '左上_宽高_3':
            p = findImage(captureScreen(), img_small, {
                region: [0, 0, height / 3, width / 3]
            });
            break;
        //右上 1/4屏幕
        case '右上_1_4':
            p = findImage(captureScreen(), img_small, {
                region: [height - height / 4, 0, height / 4, width / 3]
            });
            break;
        case '右下':
            p = findImage(captureScreen(), img_small, {
                region: [height / 2, width / 2, height / 2, width / 2]
            });
            break;
        case '右上':
            p = findImage(captureScreen(), img_small, {
                region: [height / 2, 0, height / 2, width / 2]
            });
            break;
        case '左上':
            p = findImage(captureScreen(), img_small, {
                region: [0, 0, height / 2, width / 2]
            });
            break;
        case '左下':
            p = findImage(captureScreen(), img_small, {
                region: [0, width / 2, height / 2, width / 2]
            });
            break;
        default:
    }


    if (p) {
        switch (returnP) {
            //点击坐标，返回true
            case 'no':
                click(p.x, p.y);//sleep(1000);
                return true;
            //只返回 p
            case 'yes':
                return p;
            case '会客室_线索':
                click(p.x + 50, p.y + 50); sleep(2000);
                TorF = 找图_通用("线索_来自", "右半屏");
                if (TorF) { sleep(5000); }
                return true;
            case 'y+50':
                click(p.x, p.y + 50);
                return true;
            case 'x+100':
                click(p.x + 100, p.y);
                return true;
            case 'x-50':
                click(p.x - 50, p.y);
                return true;
            case 'SKIP':
                click(p.x + 50, p.y + 50);//点击坐标
                sleep(5000);
                click(p.x + 50, p.y + 50);
                sleep(2000);
                break;
            case 'true':
                return true;
        }
    } else {
        toastLog(picture + ".jpg - 位置：" + position + " - 未找到");
        return false;
    }

}

找图_通用("代理指挥_未点击", "右下");
//用于“开始行动_蓝色1” 判断，超过3次找不到就跳出循环
i = 0;
while (true) {
    TorF = 找图_通用("开始行动_蓝色1", "右下"); sleep(5000);
    if (TorF) {
        TorF = 找图_通用("开始行动_红色", "右下");
        if (TorF) {
            for (var j = 110; j > 0; j--) {
                toastLog(j); sleep(1000);
            }

            while (true) {
                TorF = 找图_通用("行动结束", "左下", "yes");  sleep(3000);
                if (TorF) {
                    找图_通用("行动结束", "左下", "x+100");
                    break;//找到“行动结束”，结束循环         
                }else{//找不到的话可能是升级了或者还没刷完
                    //点下 敌方情报 上面的位置  
                    click(1320, 260);
                    for (var k = 9; k > 0; k--) {
                        toastLog(k); sleep(1000);
                    }
                }
            }
            //sleep(13 * 1000);
            for (var l = 13; l > 0; l--) {
                toastLog(l); sleep(1000);
            }
        } else {
            //如果找不到“开始行动_红色”
            toastLog("体力不够了？ OR 找不到 开始行动_红色？");
            click(200, 200);//随便点一下
            sleep(1000);
            break;
        }
    } else {
        //找不到“开始行动_蓝色1”，先等2秒
        sleep(2000);
        i++;
        if (i >= 3) {
            toastLog("超过3次找不到 开始行动_蓝色1 - 结束");
            break;
        }//超过3次找不到就跳出循环
    }
}


TorF = 找图_通用("导航", "上半屏"); sleep(1000);

TorF = 找图_通用("导航_首页", "上半屏");
if (TorF) {
    for (var i = 9; i > 0; i--) {
        toastLog(i); sleep(1000);
    }
}

TorF = 找图_通用("主界面_任务", "右下");
if (TorF) {
    sleep(6000);
    while (true) {
        TorF = 找图_通用("任务_已完成", "左上_宽高_3");
        if (TorF) { break; }
        TorF = 找图_通用("任务_点击领取", "右上", "y+50");
        if (TorF) {
            sleep(6000);
            TorF = 找图_通用("任务_获得物资", "上半屏");
            if (TorF) { sleep(6000); }
        } else {
            break;
        }
    }

    TorF = 找图_通用("任务_周常任务", "上半屏");
    if (TorF) {
        sleep(3000);
        while (true) {
            TorF = 找图_通用("任务_已完成", "左上_宽高_3");
            if (TorF) { break; }
            TorF = 找图_通用("任务_点击领取", "右上", "y+50");
            if (TorF) {
                sleep(6000);
                TorF = 找图_通用("任务_获得物资", "上半屏");
                if (TorF) { sleep(6000); }
            } else {
                break;
            }
        }
    }
}

// 回收图片（image对象创建后尽量在不使用时进行回收）例外的是，caputerScreen()返回的图片不需要回收。
img_small.recycle();