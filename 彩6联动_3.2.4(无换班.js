
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
//日期对象，用于 “基建换班”和 “作战关卡” 的判断
var d = new Date();



//图片名称，找图位置，根据传入的值执行不同操作
function 找图_通用(picture, position, returnP) {
    //不传参数时，returnP的默认值为'no'，position的默认值为'全屏'
    returnP = returnP || 'no';
    position = position || '全屏';



    //弹出消息时有些地方会被挡住，影响找图
    //不等于"线索_6" 才能弹出消息
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
            case 'x+200_y+50':
                click(p.x + 200, p.y + 50);
                sleep(2000);
                return true;
            case 'true':
                return true;
        }
    } else {
        if (picture != "线索_6") {
            toastLog(picture + ".jpg - 位置：" + position + " - 未找到");
        }
        return false;
    }

}


function 刷图() {
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
                    TorF = 找图_通用("行动结束", "左下", "yes"); sleep(3000);
                    if (TorF) {
                        找图_通用("行动结束", "左下", "x+100");
                        break;//找到“行动结束”，结束循环         
                    } else {
                        //找不到的话可能是升级了或者还没刷完
                        //点下 敌方情报 上面的位置  
                        click(1320, 260);
                        for (var k = 9; k > 0; k--) {
                            toastLog(k); sleep(1000);
                        }
                    }
                }
                //等待13秒
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
}


/////////////////////////////////开始

TorF = 找图_通用("公告_小图", "右上");
//点击后等待9秒
if (TorF) {
    for (var i = 9; i > 0; i--) {
        toastLog(i); sleep(1000);
    }
}

TorF = 找图_通用("今日配给_小图", "上半屏");
if (TorF) {
    for (var i = 9; i > 0; i--) {
        toastLog(i); sleep(1000);
    }
}

TorF = 找图_通用("签到_小图", "右上");
if (TorF) {
    for (var i = 9; i > 0; i--) {
        toastLog(i); sleep(1000);
    }
}

// TorF = 找图_通用("彩六联动签到_左上角", "全屏"); sleep(2000);
// if (TorF) {
//     for (var i = 6; i > 0; i--) {
//         toastLog(i); sleep(1000);
//     }
//     //签到后随便点一下
//     click(200, 200);
//     sleep(4000);
// }


// TorF = 找图_通用("彩六联动签到_关闭", "右上");
// if (TorF) {
//     for (var i = 5; i > 0; i--) {
//         toastLog(i); sleep(1000);
//     }
// }



TorF = 找图_通用("基建", "右下");
if (TorF) {
    for (var i = 15; i > 0; i--) {
        toastLog(i); sleep(1000);
    }

    TorF = 找图_通用("蓝色小铃铛", "右上_1_4");
    if (TorF) {
        sleep(2000);
        toastLog("收菜3次");
        click(250, 700); sleep(4000);
        click(250, 700); sleep(4000);
        click(250, 700); sleep(4000);

        toastLog("随便点下其它地方");
        click(400, 180); sleep(2000);
    }


    // TorF = 找图_通用("制造站", "左半屏");
    TorF = 找图_通用("制造站_黄", "左上");
    if (TorF) {
        sleep(4000);

        toastLog("制造中");
        click(330, 620); sleep(4000);

        TorF = 找图_通用("制造加速", "右下"); sleep(2000);
        if (TorF) {
            找图_通用("无人机加速_最多", "右上"); sleep(2000);
            找图_通用("无人机加速_确定", "右下"); sleep(4000);
            找图_通用("制造站界面_收取", "右下"); sleep(3000);

            //返回
            找图_通用("导航", "上半屏", "x-50"); sleep(3000);
            找图_通用("导航", "上半屏", "x-50"); sleep(3000);
        }
    }


    TorF = 找图_通用("基建_会客室2");
    if (TorF == false) {
        TorF = 找图_通用("基建_会客室", "右上");//这个是点了蓝色小铃铛之后的样子，比较小
    }

    if (TorF) {
        sleep(5000);

        toastLog("收集中");
        click(360, 600); sleep(6000);


        TorF = 找图_通用("线索交流_小图", "左上", "true");
        if (TorF) {
            //返回
            TorF = 找图_通用("导航", "上半屏", "x-50"); sleep(3000);
        }


        TorF = 找图_通用("线索_NEW", "右半屏", "y+50");
        if (TorF) {
            sleep(3000);
            TorF = 找图_通用("领取线索", "右下");
            if (TorF) {
                sleep(5000);
                找图_通用("领取线索_关闭", "右上");
                sleep(3000);
            } else {
                找图_通用("线索_全部收取", "右下"); sleep(6000);
                TorF = 找图_通用("导航", "左上", "yes");
                click(TorF.x + 250, TorF.y); sleep(3000);
            }
        }


        TorF = 找图_通用("线索_NEW", "右半屏", "y+50");
        if (TorF) {
            sleep(3000);
            TorF = 找图_通用("领取线索", "右下");
            if (TorF) {
                sleep(5000);
                找图_通用("领取线索_关闭", "右上");
                sleep(2000);
            } else {
                找图_通用("线索_全部收取", "右下"); sleep(6000);
                TorF = 找图_通用("导航", "左上", "yes");
                click(TorF.x + 250, TorF.y); sleep(1000);
            }
        }



        找图_通用("线索_1", "全屏", "会客室_线索");
        找图_通用("线索_2", "全屏", "会客室_线索");
        找图_通用("线索_3", "全屏", "会客室_线索");
        找图_通用("线索_4", "全屏", "会客室_线索");
        找图_通用("线索_5", "全屏", "会客室_线索"); sleep(3000);//等3秒，不然弹出消息会影响 线索_6 找图
        找图_通用("线索_6", "全屏", "会客室_线索");
        找图_通用("线索_7", "全屏", "会客室_线索");

        TorF = 找图_通用("解锁线索", "下半屏");
        if (TorF) {
            sleep(5000);
        } else {
            //返回
            找图_通用("导航", "上半屏", "x-50"); sleep(2000);
        }


    }


    sleep(2000);
    TorF = 找图_通用("会客室_好友", "左下");
    if (TorF) {
        sleep(5000);

        TorF = 找图_通用("好友列表", "左上");
        if (TorF) {
            sleep(6000);

            toastLog("访问基建（第一个）");
            click(1000, 160);
            for (var i = 18; i > 0; i--) {
                toastLog(i); sleep(1000);
            }
            for (i = 1; i <= 10; i++) {
                TorF = 找图_通用("访问下位_小图", "右下");
                if (TorF) {
                    toastLog("访问下一个，第" + i + "个");
                    for (var j = 15; j > 0; j--) {
                        toastLog(j); sleep(1000);
                    }
                } else {
                    i = 11
                }
            }
        }
    }
}


sleep(2000);
TorF = 找图_通用("导航", "上半屏");
if (TorF) {
    sleep(2000);

    TorF = 找图_通用("导航_采购中心", "上半屏");
    if (TorF) {
        sleep(6000);

        TorF = 找图_通用("信用交易所", "右上");
        if (TorF) {
            sleep(5000);

            TorF = 找图_通用("收取信用", "右上_1_4");
            if (TorF) {
                sleep(5000);
                toastLog("收取信用后随便点一下");
                click(1180, 45); sleep(2000);
            }
        }
    }
}


TorF = 找图_通用("导航", "上半屏"); sleep(1000);

TorF = 找图_通用("导航_公开招募", "上半屏");
if (TorF) {
    for (var i = 22; i > 0; i--) {
        toastLog(i); sleep(1000);
    }
    for (i = 1; i <= 4; i++) {
        TorF = 找图_通用("聘用候选人_小图");
        if (TorF) {
            for (var i = 9; i > 0; i--) {
                toastLog(i); sleep(1000);
            }
            TorF = 找图_通用("SKIP_小图", "右上_1_4", "SKIP");
        } else {
            i = 5;
        }
    }
}


找图_通用("导航", "左上"); sleep(2000);
TorF = 找图_通用("导航_作战", "左上");
if (TorF) {
    for (var l = 15; l > 0; l--) {
        toastLog(l); sleep(1000);
    }

    TorF = 找图_通用("作战_源石尘行动", "下半屏");
    for (var l = 7; l > 0; l--) {
        toastLog(l); sleep(1000);
    }
    if (TorF) {
        TorF = 找图_通用("源石尘行动_行动记录", "左半屏");
        for (var l = 5; l > 0; l--) {
            toastLog(l); sleep(1000);
        }
        if (TorF) {
            // 周一、周四、周六、周日 刷OD-8    
            if (d.getDay() == 1 || d.getDay() == 4 || d.getDay() == 6 || d.getDay() == 0) {
                toastLog("周 " + d.getDay() + "，刷OD-8"); sleep(2000);

                TorF = 找图_通用("源石尘行动_OD-8", "全屏"); sleep(3000);
                if (TorF) { 刷图(); }
            } else {
                toastLog("周 " + d.getDay() + "，刷OD-7"); sleep(2000);

                TorF = 找图_通用("源石尘行动_OD-7", "全屏"); sleep(3000);
                if (TorF) { 刷图(); }
            }
        }
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




toastLog("结束喽~");
// 回收图片（image对象创建后尽量在不使用时进行回收）例外的是，caputerScreen()返回的图片不需要回收。
img_small.recycle();