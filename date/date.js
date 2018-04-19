//若要显示:当前日期加时间(如:2009-06-12 12:00)

// +---------------------------------------------------
// | 字符串转成日期类型,获取日期加时间
// | 格式 MM/dd/YYYY MM-dd-YYYY YYYY/MM/dd YYYY-MM-dd
// +---------------------------------------------------
function getCurentDate(time, o) {
	var str = '',
		date = time ? new Date(time) : new Date(),
		y = date.getFullYear(),
		m = date.getMonth() + 1,
		d = date.getDate(),
		h = date.getHours(),
		min = date.getMinutes(),
		s = date.getSeconds(),
		ms = date.getMilliseconds();
	m = m < 10 ? '0' + m : m;
	d = d < 10 ? '0' + d : d;
	h = h < 10 ? '0' + h : h;
	min = min < 10 ? '0' + min : min;
	s = s < 10 ? '0' + s : s;
	if(ms < 10) {
		ms = '00' + ms;
	} else if(ms >= 10 && ms < 100) {
		ms = '0' + ms;
	}
	str += y + m + d;
	if(o == 'h') {
		str += h;
	} else if(o == 'min') {
		str += h + min;
	} else if(o == 's') {
		str += h + min + s;
	} else if(o == 'ms') {
		str += h + min + s + ms;
	}
	return str;
};
/**
 * 判断年份是否为润年
 * @param {Number} year
 */
function isLeapYear(year) {
	return(year % 400 == 0) || (year % 4 == 0 && year % 100 != 0);
};
/**
 * 获取某一年份的某一月份的天数
 * @param {Number} year
 * @param {Number} month
 */
function getMonthDays(year, month) {
	return ["", 31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
};
/***
 * 获取某年的某天是第几周
 * @param {Number} y
 * @param {Number} m
 * @param {Number} d
 * @returns {Number}
 */
function getWeekNumber(date, type) {
	type = type || '1';
	date = String(date).replace(/-/g, '').replace(/\//g, '');
	var y = date.substring(0, 4),
		m = date.substring(4, 6),
		d = date.substring(6, 8);
	var now = new Date(y, m - 1, d),
		year = now.getFullYear(),
		month = now.getMonth(),
		days = now.getDate();
	//那一天是那一年中的第多少天
	for(var i = 0; i < month; i++) {
		days += getMonthDays(year, i);
	}
	//那一年第一天是星期几
	var yearFirstDay = new Date(year, 0, 1).getDay() || 7;
	var week = null;
	if(yearFirstDay == 1) {
		week = Math.ceil(days / yearFirstDay);
	} else {
		days -= (7 - yearFirstDay + 1);
		week = Math.ceil(days / 7) + 1;
	}
	week = type == '1' ? week - 1 : week; //默认周一至周日为一周,type不为1时,周日至周一为一周;
	return week;
};
//获取加或减num天后的日期
function getAddDate(num, date) {
	date = date ? new Date(date) : new Date();
	return(new Date(date - (-1 * num * 24 * 60 * 60 * 1000))).dseDateFormat("yyyy-MM-dd");
};
//获取本周第num天时间
function getWeekDay(num, date) {
	var now = date ? new Date(date) : new Date(),
		nowTime = now.getTime(),
		day = now.getDay(),
		oneDayLong = 24 * 60 * 60 * 1000,
		Time = nowTime - (day - num) * oneDayLong;
	return(new Date(Time)).dseDateFormat("yyyy-MM-dd");
};

//对Date的扩展，将 Date 转化为指定格式的String
//月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
//年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
//例子：
//(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
//(new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.dseDateFormat = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};
