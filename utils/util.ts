// 时间戳 转换
export function analysis(time: string) {
  // '2020-05-30 19:46' 转 ['2020', '05', '30', '19', '46']
  return time
    .toString()
    .replace(/-|:|\/| /g, ',')
    .split(',');
}

export function dateFormat(timeStr: string) {
  const timestamp = analysis(timeStr);

  const week = ['日', '一', '二', '三', '四', '五', '六'];
  const mArr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  const weekEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const enArr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec'
  ];

  const opt = {
    Y: timestamp[0],
    M: timestamp[1],
    D: timestamp[2],
    H: timestamp[3],
    m: timestamp[4],
    w: new Date(Date.parse(`${timestamp[0]}/${timestamp[1]}/${timestamp[2]}`)).getDay()
  };

  // 日
  let day = opt.D.slice(0, 1) === '0' ? opt.D.slice(1) : opt.D;
  const st = 'st';
  const nd = 'nd';
  const rd = 'rd';
  const th = 'th';
  const obj: any = {
    1: st,
    2: nd,
    3: rd,
    21: st,
    22: nd,
    23: rd,
    31: st
  };

  day += obj[day] ? obj[day] : th;

  const time = {
    date: `${opt.Y}/${opt.M}/${opt.D} ${opt.H}:${opt.m}`,
    time: `${opt.H}:${opt.m}`,
    year: opt.Y,
    month: {
      on: opt.M,
      cn: mArr[Number(opt.M) - 1],
      en: enArr[Number(opt.M) - 1]
    },
    day: {
      on: opt.D,
      en: day
    },
    week: {
      on: week[opt.w],
      en: weekEn[opt.w]
    }
  };

  return time;
}
