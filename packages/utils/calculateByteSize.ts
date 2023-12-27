import {Buffer} from 'buffer';

export function calculateByteSize(str: string) {
  return Buffer.byteLength(str);
  // if (size >= 1000000) {
  //   // 1 MB
  //   return `${size / 1000000} MB`;
  // } else if (size >= 1000) {
  //   // 1 KB
  //   return `${size / 1000} KB`;
  // } else {
  //   return `${size} B`;
  // }
}
