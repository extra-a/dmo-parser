import { DataIter } from './data-iter.js';
import { cube2unichars } from './const.js';

export function getInt32(iter: DataIter): number {
  const rawBytes = consumeNBytes(iter, 4);
  return rawBytes.reduce((acc, val, idx) => acc + (val << (8 * idx)), 0);
}

export function consumeByte(iter: DataIter): number {
  const res1 = iter.next().value!;
  return res1;
}

export function consumeNBytes(iter: DataIter, n: number): number[] {
  let data: number[] = [];
  for (let idx = 0; idx < n; idx++) {
    const res1 = iter.next().value!;
    data.push(res1);
  }
  return data;
}

export function getVlqInt(iter: DataIter): number {
  const initial = toSigned(iter.next().value!);
  if (initial === -128) {
    let n: number = iter.next().value!;
    n |= toSigned(iter.next().value!) << 8;
    return n;
  } else if (initial === -127) {
    let n: number = iter.next().value!;
    n |= iter.next().value! << 8;
    n |= iter.next().value! << 16;
    n |= iter.next().value! << 24;
    return n;
  } else {
    return initial;
  }
}

export function getVlqUInt(iter: DataIter): number {
  let n = iter.next().value!;
  if(n & 0x80) {
    let next = iter.next().value!;
    n += (next << 7) - 0x80;
    if (n & (1<<14)) {
      next = iter.next().value!;
      n += (next << 14) - (1<<14)
    }
    if (n & (1<<21)) {
      next = iter.next().value!;
      n += (next << 21) - (1<<21)
    }
    if (n & (1<<28)) {
      n |= 0xF0000000;
    }
  }
  return n;
}

export function getString(iter: DataIter): string {
  const data: string[] = [];
  while (iter.remaining()) {
    const chIdx = consumeByte(iter);
    if (chIdx === 0) {
      break;
    }
    const char = String.fromCharCode(cube2unichars[chIdx]);
    data.push(char);
  }
  return data.join('');
}

export function toSigned(ubyte: number) {
  if (ubyte < 128) {
    return ubyte;
  }
  return ubyte - 256;
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
};

export const RAD = Math.PI/ 180;

export type Vec3 = [number, number, number]

export function vecfromyawpitch(yaw: number, pitch: number, move: number, strafe: number): Vec3 {
  const res: Vec3 = [0, 0, 0];
  if (move) {
    res[0] = move*-Math.sin(RAD*yaw);
    res[1] = move*Math.cos(RAD*yaw);
  } else {
    res[0] = 0;
    res[1] = 0;
  }

  if (pitch) {
    res[0] *= Math.cos(RAD*pitch);
    res[1] *= Math.cos(RAD*pitch);
    res[2] = move*Math.sin(RAD*pitch);
  } else {
    res[2] = 0;
  }

  if (strafe) {
    res[0] += strafe*Math.cos(RAD*yaw);
    res[1] += strafe*Math.sin(RAD*yaw);

  }
  return res;
}

export function vec3Multiply(vec3: Vec3, n: number): Vec3 {
  return vec3.map(val => val*n) as Vec3;
}
