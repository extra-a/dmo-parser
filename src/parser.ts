import { DemoHeader } from './types.js';
import { getInt32, consumeNBytes, consumeByte, getVlqInt, getVlqUInt, clamp, vecfromyawpitch, vec3Multiply, Vec3, getString } from './utils.js';
import { MessageNames, idsToMessageNames, DMF, DVELF, ammoNames, gunNames } from './const.js';
import { DataIter } from './data-iter.js';
import os from 'node:os';

export function parseDemo(buffer: Buffer) {
  const iter = new DataIter(buffer.values(), buffer.length);
  checkMagic(iter);
  checkDemoHeader(iter);
  parsePackets(iter);
}

function checkMagic(iter: DataIter) {
  const data = consumeNBytes(iter, 16);
  const magic = data.map(c => String.fromCharCode(c)).join('');
  if (magic !== 'SAUERBRATEN_DEMO') {
    throw new Error('Not a sauerbraten demo');
  }
}

function parsePackets(iter: DataIter) {
  while(iter.remaining() > 0) {
    const timestamp = getInt32(iter);
    const ch = getInt32(iter);
    const length = getInt32(iter);
    const msgIter = new DataIter(iter, length);
    while (msgIter.remaining() > 0) {
      parseMessages(msgIter, { timestamp, ch, });
    }
  }
}

function checkDemoHeader(iter: DataIter): DemoHeader {
  const fileVersion = getInt32(iter);
  if (fileVersion !== 1) {
    throw new Error(`Wrong file version ${fileVersion}`);
  }
  const protocolVersion = getInt32(iter);
  if (protocolVersion !== 260) {
    throw new Error(`Wrong protocal version ${protocolVersion}`);
  }
  return { fileVersion, protocolVersion };
}

function getMsgName(iter: DataIter): MessageNames {
  const idx = getVlqInt(iter);
  const name = idsToMessageNames[idx] ?? 'UNKNOWN';
  return name;
}

function parseMessages(iter: DataIter, meta: Record<string, any>): void {
  while(iter.remaining()) {
    const data = parseMessage(iter, meta);
    if (data) {
      const ev = { ...meta, ...data };
      process.stdout.write(JSON.stringify(ev) + os.EOL);
    }
  }
}

function parseMessage(iter: DataIter, meta: Record<string, any>): { msg: MessageNames, [idx: string]: any } | void {
  const msg = getMsgName(iter);
  switch (msg) {
    case 'N_POS': {
      const data = parsePos(iter);
      return { msg, ...data };
    }
    case 'N_TELEPORT': {
      const cn = getVlqInt(iter);
      const tp = getVlqInt(iter);
      const td = getVlqInt(iter);
      return { msg, cn, tp, td };
    }
    case 'N_JUMPPAD': {
      const cn = getVlqInt(iter);
      const jp = getVlqInt(iter);
      return { msg, cn, jp };
    }
    case 'N_WELCOME': {
      const data: any[] = [];
      while(iter.remaining()) {
        const ev = parseMessage(iter, meta);
        data.push(ev);
      }
      return { msg, data };
    }
    case 'N_PAUSEGAME': {
      const isPause = getVlqInt(iter) > 0;
      const cn = getVlqInt(iter);
      return { msg, cn, isPause };
    }
    case 'N_GAMESPEED': {
      const speed = getVlqInt(iter);
      const cn = getVlqInt(iter);
      return { msg, cn, speed };
    }
    case 'N_CLIENT': {
      const cn = getVlqInt(iter);
      const len = getVlqUInt(iter);
      return parseMessages(new DataIter(iter, len), {...meta, cn});
    }
    case 'N_SOUND': {
      const s = getVlqInt(iter);
      return {msg, s};
    }
    case 'N_TEXT': {
      const text = getString(iter);
      return {msg,text};
    }
    case 'N_SAYTEAM': {
      const tcn = getVlqInt(iter);
      const text = getString(iter);
      return {msg, tcn, text};
    }
    case 'N_MAPCHANGE': {
      const name = getString(iter);
      const mode = getVlqInt(iter);
      const hasItems = !!getVlqInt(iter);
      return { msg, name, mode, hasItems};
    }
    case 'N_FORCEDEATH': {
      const cn = getVlqInt(iter);
      return { msg, cn };
    }
    case 'N_ITEMLIST': {
      const data: any[] = []
      while(iter.remaining()) {
        const id = getVlqInt(iter);
        if (id < 0|| !iter.remaining()) {
          break;
        }
        const type = getVlqInt(iter);
        data.push({id, type});
      }
      return { msg, data };
    }
    case 'N_INITCLIENT': {
      const cn = getVlqInt(iter);
      const name = getString(iter);
      const team = getString(iter);
      const model = getVlqInt(iter);
      return {msg, cn, name, team, model };
    }
    case 'N_SWITCHNAME': {
      const name = getString(iter);
      return { msg, name };
    }
    case 'N_SWITCHMODEL': {
      const model = getVlqInt(iter)
      return { msg, model };
    }
    case 'N_CDIS': {
      const cn = getVlqInt(iter);
      return { msg, cn };
    }
    case 'N_SPAWN': {
      const data = parseState(iter);
      return { msg, ...data };
    }
    case 'N_SPAWNSTATE': {
      const cn =  getVlqInt(iter);
      const data = parseState(iter);
      return { msg, cn, ...data };
    }
    case 'N_SHOTFX': {
      const scn = getVlqInt(iter);
      const gun = getVlqInt(iter);
      const id = getVlqInt(iter);
      const from = [0, 0, 0].map(() => getVlqInt(iter) / DMF);
      const to = [0, 0, 0].map(() => getVlqInt(iter) / DMF);
      return { msg, scn, gun, id, from, to };
    }
    case 'N_EXPLODEFX': {
      const ecn = getVlqInt(iter);
      const gun = getVlqInt(iter);
      const id = getVlqInt(iter);
      return { msg, ecn, gun, id };
    }
    case 'N_DAMAGE': {
      const tcn = getVlqInt(iter);
      const acn = getVlqInt(iter);
      const damage = getVlqInt(iter);
      const armour = getVlqInt(iter);
      const health = getVlqInt(iter);
      return { msg, tcn, acn, damage, armour, health };
    }
    case 'N_HITPUSH': {
      const tcn = getVlqInt(iter);
      const gun = getVlqInt(iter);
      const damage = getVlqInt(iter);
      const dir = [0, 0, 0].map(() => getVlqInt(iter) / DMF);
      return { msg, tcn, gun, damage, dir };
    }
    case 'N_DIED': {
      const vcn = getVlqInt(iter);
      const acn = getVlqInt(iter);
      const frags = getVlqInt(iter);
      const tfrags = getVlqInt(iter);
      return { msg, vcn, acn, frags, tfrags };
    }
    case 'N_TEAMINFO': {
      const data: any[] = []
      while(iter.remaining()) {
        const name = getString(iter);
        if (name === '' || !iter.remaining()) {
          break;
        }
        const frags = getVlqInt(iter);
        data.push({name, frags});
      }
      return { msg, data };
    }
    case 'N_GUNSELECT': {
      const gun = getVlqInt(iter)
      return { msg, gun };
    }
    case 'N_TAUNT': {
      return { msg };
    }
    case 'N_RESUME': {
      const data: any[] = []
      while(iter.remaining()) {
        const cn = getVlqInt(iter);
        if (cn < 0 || !iter.remaining()) {
          break;
        }
        const state = parseState(iter, true);
        data.push({ cn, ...state });
      }
      return { msg, data };
    }
    case 'N_ITEMSPAWN': {
      const item = getVlqInt(iter);
      return { msg, item };
    }
    case 'N_ITEMACC': {
      const item = getVlqInt(iter);
      const cn = getVlqInt(iter);
      return { msg, cn, item };
    }
    case 'N_CLIENTPING': {
      const ping = getVlqInt(iter);
      return {msg, ping};
    }
    case 'N_TIMEUP': {
      const time = getVlqInt(iter);
      return {msg, time};
    }
    case 'N_SERVMSG': {
      const data = getString(iter);
      return {msg, data};
    }
    case 'N_CURRENTMASTER': {
      const mm = getVlqInt(iter);
      const data: any[] = []
      while(iter.remaining()) {
        const cn = getVlqInt(iter);
        if (cn < 0 || !iter.remaining()) {
          break;
        }
        const priv = getVlqInt(iter);
        data.push({cn, priv});
      }
      return {msg, mm, data};
    }
    case 'N_MASTERMODE': {
      const mm = getVlqInt(iter);
      return {msg, mm};
    }
    case 'N_SPECTATOR': {
      const cn = getVlqInt(iter);
      const isSpectator = !!getVlqInt(iter);
      return {msg, cn, isSpectator};
    }
    case 'N_SETTEAM': {
      const cn = getVlqInt(iter);
      const name = getString(iter);
      const reason = getVlqInt(iter);
      return {msg, cn, name, reason};
    }
    case 'N_ANNOUNCE': {
      const t = getVlqInt(iter);
      return {msg, t};
    }
    // ctf
    case 'N_INITFLAGS': {
      return {msg};
    }
    case 'N_DROPFLAG': {
      const ocn = getVlqInt(iter);
      const flag = getVlqInt(iter);
      const version = getVlqInt(iter);
      const droppos = [0, 0, 0].map(() => getVlqInt(iter) / DMF);
      return {msg, ocn, flag, version, droppos};
    }
    case 'N_SCOREFLAG': {
      const ocn = getVlqInt(iter);
      const relayflag = getVlqInt(iter);
      const relayversion = getVlqInt(iter);
      const goalflag = getVlqInt(iter);
      const goalversion = getVlqInt(iter);
      const goalspawn = getVlqInt(iter);
      const team = getVlqInt(iter);
      const score = getVlqInt(iter);
      const oflags = getVlqInt(iter);
      return {msg, ocn, relayflag, relayversion, goalflag, goalversion, goalspawn, team, score, oflags};
    }
    case 'N_RETURNFLAG': {
      const ocn = getVlqInt(iter);
      const flag = getVlqInt(iter);
      const version = getVlqInt(iter);
      return {msg, ocn, flag, version};
    }
    case 'N_TAKEFLAG': {
      const ocn = getVlqInt(iter);
      const flag = getVlqInt(iter);
      const version = getVlqInt(iter);
      return {msg, ocn, flag, version};
    }
    case 'N_RESETFLAG': {
      const flag = getVlqInt(iter);
      const version = getVlqInt(iter);
      const spawnindex = getVlqInt(iter);
      const team = getVlqInt(iter);
      const score = getVlqInt(iter);
      return {msg, flag, version, spawnindex, team, score};
    }
    case 'N_INVISFLAG': {
      const flag = getVlqInt(iter);
      const invis = getVlqInt(iter);
      return {msg, flag, invis};
    }
    default: {
      // unknown length message, if there are any additional messages,
      // they will be consumed till the known boundary
      const remaining = iter.remaining();
      return {msg, rawData: (remaining > 0 ? consumeNBytes(iter, remaining) : [])};
    }
  }
}

function parsePos(iter: DataIter) {
  const cn = getVlqUInt(iter);
  const physstate = consumeByte(iter);
  const flags = getVlqUInt(iter);
  const pos = [0, 0, 0].map((_, k) => {
    let n = consumeByte(iter);
    n |= (consumeByte(iter) << 8);
    if (flags&(1<<k)) {
      n |= (consumeByte(iter) << 16);
      if (n&0x800000) {
        n |= 0xFF000000;
      }
    }
    return n/DMF;
  });
  let dir = consumeByte(iter);
  dir |= consumeByte(iter)<<8
  const yaw = dir%360;
  const pitch = clamp(Math.trunc(dir/360), 0, 180)-90;
  const roll = clamp(consumeByte(iter), 0, 180)-90;
  let mag = consumeByte(iter);
  if (flags&(1<<3)) {
    mag |= consumeByte(iter) << 8;
  }
  dir = consumeByte(iter);
  dir |= consumeByte(iter) << 8;
  let vel = vecfromyawpitch(dir%360, clamp(Math.trunc(dir/360), 0, 180)-90, 1, 0);
  vel = vec3Multiply(vel, mag/DVELF);
  let falling = [0, 0, 0] as Vec3;
  if (flags&(1<<4)) {
    mag = consumeByte(iter);
    if(flags&(1<<5)) {
      mag |= consumeByte(iter) << 8;
    }
    if(flags&(1<<6)) {
      dir = consumeByte(iter);
      dir |= consumeByte(iter) << 8;
      falling = vecfromyawpitch(dir%360, clamp(Math.trunc(dir/360), 0, 180)-90, 1, 0)
    } else {
      falling = [0, 0, -1];
    }
    falling = vec3Multiply(falling, mag/DVELF);
  }
  return {
    cn,
    yaw,
    pitch,
    roll,
    pos,
    vel,
    falling,
    physstate: physstate.toString(2),
  };
}

function parseState(iter: DataIter, resume = false) {
  let p1 = {} as any;
  if (resume) {
    const state = getVlqInt(iter);
    const frags = getVlqInt(iter);
    const flags = getVlqInt(iter);
    const deaths = getVlqInt(iter);
    const quadmillis = getVlqInt(iter);
    p1 = { state, frags, flags, deaths, quadmillis };
  }
  const lifesequence = getVlqInt(iter);
  const health = getVlqInt(iter);
  const maxhealth = getVlqInt(iter);
  const armour = getVlqInt(iter);
  const armourtype = getVlqInt(iter);
  const gunIdx = getVlqInt(iter);
  const gun = gunNames[gunIdx];
  const ammo = Object.fromEntries(ammoNames.map((name) => {
    const count = getVlqInt(iter);
    return [name, count];
  }));

  return {
    ...p1,
    lifesequence,
    health,
    maxhealth,
    armour,
    armourtype,
    gun,
    ammo
  }
}
