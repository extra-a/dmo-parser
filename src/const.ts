
export const messages = [
  'N_CONNECT',
  'N_SERVINFO',
  'N_WELCOME',
  'N_INITCLIENT',
  'N_POS',
  'N_TEXT',
  'N_SOUND',
  'N_CDIS',

  'N_SHOOT',
  'N_EXPLODE',
  'N_SUICIDE',

  'N_DIED',
  'N_DAMAGE',
  'N_HITPUSH',
  'N_SHOTFX',
  'N_EXPLODEFX',

  'N_TRYSPAWN',
  'N_SPAWNSTATE',
  'N_SPAWN',
  'N_FORCEDEATH',

  'N_GUNSELECT',
  'N_TAUNT',

  'N_MAPCHANGE',
  'N_MAPVOTE',
  'N_TEAMINFO',
  'N_ITEMSPAWN',
  'N_ITEMPICKUP',
  'N_ITEMACC',
  'N_TELEPORT',
  'N_JUMPPAD',

  'N_PING',
  'N_PONG',
  'N_CLIENTPING',

  'N_TIMEUP',
  'N_FORCEINTERMISSION',

  'N_SERVMSG',
  'N_ITEMLIST',
  'N_RESUME',

  'N_EDITMODE',
  'N_EDITENT',
  'N_EDITF',
  'N_EDITT',
  'N_EDITM',
  'N_FLIP',
  'N_COPY',
  'N_PASTE',
  'N_ROTATE',
  'N_REPLACE',
  'N_DELCUBE',
  'N_REMIP',
  'N_EDITVSLOT',
  'N_UNDO',
  'N_REDO',
  'N_NEWMAP',
  'N_GETMAP',
  'N_SENDMAP',
  'N_CLIPBOARD',
  'N_EDITVAR',

  'N_MASTERMODE',
  'N_KICK',
  'N_CLEARBANS',
  'N_CURRENTMASTER',
  'N_SPECTATOR',
  'N_SETMASTER',
  'N_SETTEAM',

  'N_BASES',
  'N_BASEINFO',
  'N_BASESCORE',
  'N_REPAMMO',
  'N_BASEREGEN',
  'N_ANNOUNCE',

  'N_LISTDEMOS',
  'N_SENDDEMOLIST',
  'N_GETDEMO',
  'N_SENDDEMO',

  'N_DEMOPLAYBACK',
  'N_RECORDDEMO',
  'N_STOPDEMO',
  'N_CLEARDEMOS',

  'N_TAKEFLAG',
  'N_RETURNFLAG',
  'N_RESETFLAG',
  'N_INVISFLAG',
  'N_TRYDROPFLAG',
  'N_DROPFLAG',
  'N_SCOREFLAG',
  'N_INITFLAGS',

  'N_SAYTEAM',

  'N_CLIENT',

  'N_AUTHTRY',
  'N_AUTHKICK',
  'N_AUTHCHAL',
  'N_AUTHANS',
  'N_REQAUTH',

  'N_PAUSEGAME',
  'N_GAMESPEED',

  'N_ADDBOT',
  'N_DELBOT',
  'N_INITAI',
  'N_FROMAI',
  'N_BOTLIMIT',
  'N_BOTBALANCE',

  'N_MAPCRC',
  'N_CHECKMAPS',

  'N_SWITCHNAME',
  'N_SWITCHMODEL',
  'N_SWITCHTEAM',

  'N_INITTOKENS',
  'N_TAKETOKEN',
  'N_EXPIRETOKENS',
  'N_DROPTOKENS',
  'N_DEPOSITTOKENS',
  'N_STEALTOKENS',

  'N_SERVCMD',

  'N_DEMOPACKET',

  'NUMMSG'
] as const;

export type MessageNames = typeof messages[number] | 'UNKNOWN';

const exclude259 = new Set([
  'N_EDITVSLOT',
  'N_UNDO',
  'N_REDO',
]);

const messages259 = messages.filter(m => !exclude259.has(m));

export const idsToMessageNames260 = Object.fromEntries(messages.entries());
export const idsToMessageNames259 = Object.fromEntries(messages259.entries());

export const DMF = 16;
export const DNF = 100;
export const DVELF = 1;

export const cube2unichars =
[
    0, 192, 193, 194, 195, 196, 197, 198, 199, 9, 10, 11, 12, 13, 200, 201,
    202, 203, 204, 205, 206, 207, 209, 210, 211, 212, 213, 214, 216, 217, 218, 219,
    32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63,
    64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79,
    80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95,
    96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111,
    112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 220,
    221, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237,
    238, 239, 241, 242, 243, 244, 245, 246, 248, 249, 250, 251, 252, 253, 255, 0x104,
    0x105, 0x106, 0x107, 0x10C, 0x10D, 0x10E, 0x10F, 0x118, 0x119, 0x11A, 0x11B, 0x11E, 0x11F, 0x130, 0x131, 0x141,
    0x142, 0x143, 0x144, 0x147, 0x148, 0x150, 0x151, 0x152, 0x153, 0x158, 0x159, 0x15A, 0x15B, 0x15E, 0x15F, 0x160,
    0x161, 0x164, 0x165, 0x16E, 0x16F, 0x170, 0x171, 0x178, 0x179, 0x17A, 0x17B, 0x17C, 0x17D, 0x17E, 0x404, 0x411,
    0x413, 0x414, 0x416, 0x417, 0x418, 0x419, 0x41B, 0x41F, 0x423, 0x424, 0x426, 0x427, 0x428, 0x429, 0x42A, 0x42B,
    0x42C, 0x42D, 0x42E, 0x42F, 0x431, 0x432, 0x433, 0x434, 0x436, 0x437, 0x438, 0x439, 0x43A, 0x43B, 0x43C, 0x43D,
    0x43F, 0x442, 0x444, 0x446, 0x447, 0x448, 0x449, 0x44A, 0x44B, 0x44C, 0x44D, 0x44E, 0x44F, 0x454, 0x490, 0x491
] as const;

export const gunNames = ['FIST', 'SG', 'CG', 'RL', 'RIFLE', 'GL', 'PISTOL'] as const;

export const ammoNames = ['SG', 'CG', 'RL', 'RIFLE', 'GL', 'PISTOL'] as const;
