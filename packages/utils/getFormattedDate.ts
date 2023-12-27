import {format, isToday, isYesterday} from 'date-fns';

export function getFormattedDate(date: number) {
  if (isToday(date)) {
    return format(date, 'h:mm a');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'M/d/yy');
  }
}
