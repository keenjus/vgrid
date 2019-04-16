import moment from 'moment';

export function dateTemplate() {
  return function instance(date: string | null) {
    if (!date) return '';
    return `<span title="${date}">${moment(date).format('YYYY-MM-DD')}</span>`;
  };
}

export function dateTimeTemplate() {
  return function instance(date: string | null) {
    if (!date) return '';
    return `<span title="${date}">${moment(date).format('YYYY-MM-DD HH:mm')}</span>`;
  };
}
