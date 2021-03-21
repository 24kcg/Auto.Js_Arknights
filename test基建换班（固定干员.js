
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


var bool;

//图片名称，找图位置，根据传入的值执行不同操作
function 找图_通用(picture, position, returnP) {
    //不传参数时，returnP的默认值为'no'
    returnP = returnP || 'no';
    position = position || '全屏';


    //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置
    //返回大于等于0的整数值，若不包含 "xx" 则返回"-1
    bool = picture.indexOf("基建换班选项");

    //弹出消息时有些地方会被挡住，影响找图
    //不等于"线索_6" 且 不包含 "基建换班选项" 才能弹出消息
    if (picture != "线索_6" && bool < 0 && picture != "基建换班_办公室") {
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
                click(p.x, p.y); sleep(1000);
                return true;
            //只返回 p
            case 'yes':
                return p;
            case '会客室_线索':
                click(p.x + 50, p.y + 50); sleep(2000);
                click(1230, 200); sleep(5000);
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
        if (picture != "线索_6" && bool < 0) {
            toastLog(picture + ".jpg - 位置：" + position + " - 未找到");
        }
        return false;
    }

}


function 宿舍休息(position) {
    TorF = 找图_通用("基建换班_宿舍", position, "x+200_y+50");
    if (TorF) {
        找图_通用("基建换班_清空选择", "左下"); sleep(1000);

        TorF = 找图_通用("基建换班_右上下拉选项", "右上");
        if (TorF) {
            sleep(1000);
            找图_通用("基建换班选项_心情", "全屏");

            找图_通用("基建换班选项_未进驻", "全屏");
            找图_通用("基建换班选项_心情_由低到高", "全屏");

            找图_通用("基建换班选项_勾", "全屏"); sleep(1000);

            //第一行第1个
            click(540, 230);
            //第二行第1个
            click(540, 500);


            //第一行第2个
            click(680, 230);
            //第二行第2个
            click(680, 500);

            //第一行第3个
            click(820, 230);
        }
        找图_通用("基建换班_小确认", "右下"); sleep(5000);
    }
}

//d.getHours() 获取小时
//分两批换班（早班，晚班），以 中午12点 为中间线，超过12点就是晚班
//控制中枢、会客室、发电站 为晚班（共10个干员，刚好填满 2、3号宿舍）


// 基建换班（2个贸易站，4个制造站，3个发电站）
// 1号、2号制造站 制造经验，3号、4号制造赤金
TorF = 找图_通用("进驻总览", "左上");
if (TorF) {
    sleep(5000);

    if (d.getHours() <= 12) {//晚上要录视频，所以改了 原：>12
        TorF = 找图_通用("基建换班_控制中枢", "全屏", "x+200_y+50");
        if (TorF) {
            TorF = 找图_通用("阿米娅", "全屏", "true");
            找图_通用("基建换班_清空选择", "左下");

            if (TorF) {
                找图_通用("阿米娅");
                找图_通用("闪击");
                找图_通用("战车");
                找图_通用("红");
                找图_通用("霜华");
            } else {
                找图_通用("诗怀雅");
                找图_通用("灰喉");
                找图_通用("清道夫");
                找图_通用("杜宾");
                找图_通用("陈");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }


        TorF = 找图_通用("基建换班_会客室", "全屏", "x+200_y+50");
        if (TorF) {
            TorF = 找图_通用("暗索", "全屏", "true");
            找图_通用("基建换班_清空选择", "左下");
            if (TorF) {
                找图_通用("暗索");
                找图_通用("安洁丽娜");
            } else {
                找图_通用("极境");
                找图_通用("梅");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }

        //从下往上滑动一小段距离
        //第一次滑动  看到1号发电站
        swipe(height / 2, width / 3, height / 2, 0, 1000); sleep(2000);


        // 1号发电站
        TorF = 找图_通用("基建换班_发电站", "全屏", "yes");
        if (TorF) {
            click(TorF.x + 200, TorF.y + 50); sleep(2000);

            TorF = 找图_通用("伊芙利特", "全屏");
            if (!TorF) {
                找图_通用("格雷伊");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }

        //第二次滑动，看到2号发电站、2号宿舍
        swipe(height / 2, width / 1.1, height / 2, 0, 1000); sleep(2000);
        swipe(height / 2, width / 2, height / 2, 0, 1000); sleep(2000);


        //2号发电站
        TorF = 找图_通用("基建换班_发电站", "全屏", "yes");
        if (TorF) {
            click(TorF.x + 200, TorF.y + 50); sleep(2000);

            TorF = 找图_通用("阿消", "全屏");
            if (!TorF) {
                找图_通用("THRM-EX");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }
        //2号宿舍
        宿舍休息("全屏");

        //第三次滑动，看到3号发电站、3号宿舍
        swipe(height / 2, width / 1.1, height / 2, 0, 1000); sleep(2000);
        swipe(height / 2, width / 5, height / 2, 0, 1000); sleep(2000);

        //3号发电站
        TorF = 找图_通用("基建换班_发电站", "全屏", "yes");
        if (TorF) {
            click(TorF.x + 200, TorF.y + 50); sleep(2000);

            TorF = 找图_通用("雷蛇", "全屏");
            if (!TorF) {
                找图_通用("Lancet-2");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }
        //3号宿舍
        宿舍休息("全屏");

    } else {
        swipe(height / 2, width / 3, height / 2, 0, 1000); sleep(2000);
        // 1号制造站
        TorF = 找图_通用("基建换班_制造站", "上半屏", "x+200_y+50");
        if (TorF) {
            TorF = 找图_通用("霜叶", "全屏", "true");
            找图_通用("基建换班_清空选择", "左下");
            if (TorF) {
                找图_通用("霜叶");
                找图_通用("断罪者");
                找图_通用("白雪");
            } else {
                找图_通用("香草");
                找图_通用("赫默");
                找图_通用("石棉");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }


        swipe(height / 2, width / 3, height / 2, 0, 2000); sleep(2000);
        // 2号制造站
        TorF = 找图_通用("基建换班_制造站", "全屏", "x+200_y+50");
        if (TorF) {
            TorF = 找图_通用("食铁兽", "全屏", "true");
            找图_通用("基建换班_清空选择", "左下");
            if (TorF) {
                找图_通用("食铁兽");
                找图_通用("红豆");
                找图_通用("Castle-3");
            } else {
                找图_通用("泡普卡");
                找图_通用("杰西卡");
                找图_通用("调香师");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }
        //1号宿舍
        宿舍休息("全屏");


        swipe(height / 2, width / 2, height / 2, 0, 1000); sleep(2000);
        //1号贸易站
        TorF = 找图_通用("基建换班_贸易站", "全屏", "x+200_y+50");
        if (TorF) {
            TorF = 找图_通用("拉普兰德", "全屏", "true");
            找图_通用("基建换班_清空选择", "左下");
            if (TorF) {
                找图_通用("拉普兰德");
                找图_通用("德克萨斯");
                //从右往左滑动
                swipe(height / 2.2, width / 2, 0, width / 2, 1000); sleep(2000);
                找图_通用("孑");
                //从左往右滑动（还原）
                swipe(height / 3, width / 2, height, width / 2, 1000); sleep(2000);
            } else {
                找图_通用("空爆");
                找图_通用("古米");
                找图_通用("月见夜");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }


        swipe(height / 2, width / 4, height / 2, 0, 1000); sleep(2000);
        //3号制造站
        TorF = 找图_通用("基建换班_制造站", "全屏", "x+200_y+50");
        if (TorF) {
            TorF = 找图_通用("斑点", "全屏", "true");
            找图_通用("基建换班_清空选择", "左下");
            if (TorF) {
                找图_通用("斑点");
                找图_通用("砾");
                找图_通用("夜烟");
            } else {
                找图_通用("白面鸮");
                找图_通用("槐虎");
                找图_通用("梅尔");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }


        swipe(height / 2, width / 2, height / 2, 0, 1000); sleep(2000);
        //2号宿舍
        宿舍休息("全屏");

        TorF = 找图_通用("基建换班_办公室", "全屏", "x+200_y+50");
        if (TorF) {
            TorF = 找图_通用("伊桑", "全屏");
            if (!TorF) {
                找图_通用("艾雅法拉");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }


        swipe(height / 2, width / 4, height / 2, 0, 1000); sleep(2000);
        //2号贸易站
        TorF = 找图_通用("基建换班_贸易站", "全屏", "x+200_y+50");
        if (TorF) {
            TorF = 找图_通用("能天使", "全屏", "true");
            找图_通用("基建换班_清空选择", "左下");
            if (TorF) {
                找图_通用("能天使");
                找图_通用("夜刀");
                找图_通用("玫兰莎");
            } else {
                找图_通用("缠丸");
                找图_通用("慕斯");
                找图_通用("安比尔");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }


        swipe(height / 2, width / 4, height / 2, 0, 1000); sleep(2000);
        //4号制造站
        TorF = 找图_通用("基建换班_制造站", "全屏", "x+200_y+50");
        if (TorF) {
            TorF = 找图_通用("刻俄柏", "全屏", "true");
            找图_通用("基建换班_清空选择", "左下");
            if (TorF) {
                找图_通用("刻俄柏");
                找图_通用("红云");
                找图_通用("蛇屠箱");
            } else {
                找图_通用("史都华德");
                找图_通用("芬");
                找图_通用("稀音");
            }
            找图_通用("基建换班_小确认", "右下"); sleep(5000);
        }


        swipe(height / 2, width / 1.1, height / 2, 0, 1000); sleep(2000);
        //3号宿舍
        宿舍休息("上半屏");

        //4号宿舍
        宿舍休息("下半屏");
    }

    // //返回
    找图_通用("导航", "上半屏", "x-50"); sleep(3000);
}



// 回收图片（image对象创建后尽量在不使用时进行回收）例外的是，caputerScreen()返回的图片不需要回收。
img_small.recycle();