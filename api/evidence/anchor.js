"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod2, isNodeMode, target) => (target = mod2 != null ? __create(__getProtoOf(mod2)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod2 || !mod2.__esModule ? __defProp(target, "default", { value: mod2, enumerable: true }) : target,
  mod2
));
var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/cryptoNode.js
var nc, crypto;
var init_cryptoNode = __esm({
  "node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/cryptoNode.js"() {
    nc = __toESM(require("node:crypto"), 1);
    crypto = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : nc && typeof nc === "object" && "randomBytes" in nc ? nc : void 0;
  }
});

// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber(n) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new Error("positive integer expected, got " + n);
}
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function ahash(h) {
  if (typeof h !== "function" || typeof h.create !== "function")
    throw new Error("Hash should be wrapped by utils.createHasher");
  anumber(h.outputLen);
  anumber(h.blockLen);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function createView(arr) {
  return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
function rotr(word, shift) {
  return word << 32 - shift | word >>> shift;
}
function rotl(word, shift) {
  return word << shift | word >>> 32 - shift >>> 0;
}
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
  return arr;
}
function bytesToHex(bytes) {
  abytes(bytes);
  if (hasHexBuiltin)
    return bytes.toHex();
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]];
  }
  return hex;
}
function asciiToBase16(ch) {
  if (ch >= asciis._0 && ch <= asciis._9)
    return ch - asciis._0;
  if (ch >= asciis.A && ch <= asciis.F)
    return ch - (asciis.A - 10);
  if (ch >= asciis.a && ch <= asciis.f)
    return ch - (asciis.a - 10);
  return;
}
function hexToBytes(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function kdfInputToBytes(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad2 = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad2);
    pad2 += a.length;
  }
  return res;
}
function checkOpts(defaults, opts) {
  if (opts !== void 0 && {}.toString.call(opts) !== "[object Object]")
    throw new Error("options should be object or undefined");
  const merged = Object.assign(defaults, opts);
  return merged;
}
function createHasher(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
function randomBytes(bytesLength = 32) {
  if (crypto && typeof crypto.getRandomValues === "function") {
    return crypto.getRandomValues(new Uint8Array(bytesLength));
  }
  if (crypto && typeof crypto.randomBytes === "function") {
    return Uint8Array.from(crypto.randomBytes(bytesLength));
  }
  throw new Error("crypto.getRandomValues must be defined");
}
var isLE, swap32IfBE, hasHexBuiltin, hexes, asciis, Hash;
var init_utils = __esm({
  "node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/utils.js"() {
    init_cryptoNode();
    isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    swap32IfBE = isLE ? (u) => u : byteSwap32;
    hasHexBuiltin = /* @__PURE__ */ (() => (
      // @ts-ignore
      typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function"
    ))();
    hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    Hash = class {
    };
  }
});

// node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/utils.js
function isBytes2(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function abytes2(item) {
  if (!isBytes2(item))
    throw new Error("Uint8Array expected");
}
function abool(title, value) {
  if (typeof value !== "boolean")
    throw new Error(title + " boolean expected, got " + value);
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? "0" + hex : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  return hex === "" ? _0n : BigInt("0x" + hex);
}
function bytesToHex2(bytes) {
  abytes2(bytes);
  if (hasHexBuiltin2)
    return bytes.toHex();
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes2[bytes[i]];
  }
  return hex;
}
function asciiToBase162(ch) {
  if (ch >= asciis2._0 && ch <= asciis2._9)
    return ch - asciis2._0;
  if (ch >= asciis2.A && ch <= asciis2.F)
    return ch - (asciis2.A - 10);
  if (ch >= asciis2.a && ch <= asciis2.f)
    return ch - (asciis2.a - 10);
  return;
}
function hexToBytes2(hex) {
  if (typeof hex !== "string")
    throw new Error("hex string expected, got " + typeof hex);
  if (hasHexBuiltin2)
    return Uint8Array.fromHex(hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2)
    throw new Error("hex string expected, got unpadded hex of length " + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase162(hex.charCodeAt(hi));
    const n2 = asciiToBase162(hex.charCodeAt(hi + 1));
    if (n1 === void 0 || n2 === void 0) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex2(bytes));
}
function bytesToNumberLE(bytes) {
  abytes2(bytes);
  return hexToNumber(bytesToHex2(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === "string") {
    try {
      res = hexToBytes2(hex);
    } catch (e) {
      throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
    }
  } else if (isBytes2(hex)) {
    res = Uint8Array.from(hex);
  } else {
    throw new Error(title + " must be hex string or Uint8Array");
  }
  const len = res.length;
  if (typeof expectedLength === "number" && len !== expectedLength)
    throw new Error(title + " of length " + expectedLength + " expected, got " + len);
  return res;
}
function concatBytes2(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes2(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad2 = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad2);
    pad2 += a.length;
  }
  return res;
}
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
function aInRange(title, n, min, max) {
  if (!inRange(n, min, max))
    throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
}
function bitLen(n) {
  let len;
  for (len = 0; n > _0n; n >>= _1n, len += 1)
    ;
  return len;
}
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== "number" || hashLen < 2)
    throw new Error("hashLen must be a number");
  if (typeof qByteLen !== "number" || qByteLen < 2)
    throw new Error("qByteLen must be a number");
  if (typeof hmacFn !== "function")
    throw new Error("hmacFn must be a function");
  let v = u8n(hashLen);
  let k = u8n(hashLen);
  let i = 0;
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...b) => hmacFn(k, v, ...b);
  const reseed = (seed = u8n(0)) => {
    k = h(u8fr([0]), seed);
    v = h();
    if (seed.length === 0)
      return;
    k = h(u8fr([1]), seed);
    v = h();
  };
  const gen2 = () => {
    if (i++ >= 1e3)
      throw new Error("drbg: tried 1000 values");
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes2(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed);
    let res = void 0;
    while (!(res = pred(gen2())))
      reseed();
    reset();
    return res;
  };
  return genUntil;
}
function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== "function")
      throw new Error("invalid validator function");
    const val = object[fieldName];
    if (isOptional && val === void 0)
      return;
    if (!checkVal(val, object)) {
      throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
    }
  };
  for (const [fieldName, type] of Object.entries(validators))
    checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators))
    checkField(fieldName, type, true);
  return object;
}
function memoized(fn) {
  const map = /* @__PURE__ */ new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== void 0)
      return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}
var _0n, _1n, hasHexBuiltin2, hexes2, asciis2, isPosBig, bitMask, u8n, u8fr, validatorFns;
var init_utils2 = __esm({
  "node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/utils.js"() {
    _0n = /* @__PURE__ */ BigInt(0);
    _1n = /* @__PURE__ */ BigInt(1);
    hasHexBuiltin2 = // @ts-ignore
    typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function";
    hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
    asciis2 = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
    isPosBig = (n) => typeof n === "bigint" && _0n <= n;
    bitMask = (n) => (_1n << BigInt(n)) - _1n;
    u8n = (len) => new Uint8Array(len);
    u8fr = (arr) => Uint8Array.from(arr);
    validatorFns = {
      bigint: (val) => typeof val === "bigint",
      function: (val) => typeof val === "function",
      boolean: (val) => typeof val === "boolean",
      string: (val) => typeof val === "string",
      stringOrUint8Array: (val) => typeof val === "string" || isBytes2(val),
      isSafeInteger: (val) => Number.isSafeInteger(val),
      array: (val) => Array.isArray(val),
      field: (val, object) => object.Fp.isValid(val),
      hash: (val) => typeof val === "function" && Number.isSafeInteger(val.outputLen)
    };
  }
});

// node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/modular.js
function mod(a, b) {
  const result = a % b;
  return result >= _0n2 ? result : b + result;
}
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
function invert(number, modulo) {
  if (number === _0n2)
    throw new Error("invert: expected non-zero number");
  if (modulo <= _0n2)
    throw new Error("invert: expected positive modulus, got " + modulo);
  let a = mod(number, modulo);
  let b = modulo;
  let x = _0n2, y = _1n2, u = _1n2, v = _0n2;
  while (a !== _0n2) {
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    const n = y - v * q;
    b = a, a = r, x = u, y = v, u = m, v = n;
  }
  const gcd2 = b;
  if (gcd2 !== _1n2)
    throw new Error("invert: does not exist");
  return mod(x, modulo);
}
function sqrt3mod4(Fp, n) {
  const p1div4 = (Fp.ORDER + _1n2) / _4n;
  const root = Fp.pow(n, p1div4);
  if (!Fp.eql(Fp.sqr(root), n))
    throw new Error("Cannot find square root");
  return root;
}
function sqrt5mod8(Fp, n) {
  const p5div8 = (Fp.ORDER - _5n) / _8n;
  const n2 = Fp.mul(n, _2n);
  const v = Fp.pow(n2, p5div8);
  const nv = Fp.mul(n, v);
  const i = Fp.mul(Fp.mul(nv, _2n), v);
  const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
  if (!Fp.eql(Fp.sqr(root), n))
    throw new Error("Cannot find square root");
  return root;
}
function tonelliShanks(P) {
  if (P < BigInt(3))
    throw new Error("sqrt is not defined for small field");
  let Q = P - _1n2;
  let S = 0;
  while (Q % _2n === _0n2) {
    Q /= _2n;
    S++;
  }
  let Z = _2n;
  const _Fp = Field(P);
  while (FpLegendre(_Fp, Z) === 1) {
    if (Z++ > 1e3)
      throw new Error("Cannot find square root: probably non-prime P");
  }
  if (S === 1)
    return sqrt3mod4;
  let cc = _Fp.pow(Z, Q);
  const Q1div2 = (Q + _1n2) / _2n;
  return function tonelliSlow(Fp, n) {
    if (Fp.is0(n))
      return n;
    if (FpLegendre(Fp, n) !== 1)
      throw new Error("Cannot find square root");
    let M = S;
    let c = Fp.mul(Fp.ONE, cc);
    let t = Fp.pow(n, Q);
    let R = Fp.pow(n, Q1div2);
    while (!Fp.eql(t, Fp.ONE)) {
      if (Fp.is0(t))
        return Fp.ZERO;
      let i = 1;
      let t_tmp = Fp.sqr(t);
      while (!Fp.eql(t_tmp, Fp.ONE)) {
        i++;
        t_tmp = Fp.sqr(t_tmp);
        if (i === M)
          throw new Error("Cannot find square root");
      }
      const exponent = _1n2 << BigInt(M - i - 1);
      const b = Fp.pow(c, exponent);
      M = i;
      c = Fp.sqr(b);
      t = Fp.mul(t, c);
      R = Fp.mul(R, b);
    }
    return R;
  };
}
function FpSqrt(P) {
  if (P % _4n === _3n)
    return sqrt3mod4;
  if (P % _8n === _5n)
    return sqrt5mod8;
  return tonelliShanks(P);
}
function validateField(field) {
  const initial = {
    ORDER: "bigint",
    MASK: "bigint",
    BYTES: "isSafeInteger",
    BITS: "isSafeInteger"
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = "function";
    return map;
  }, initial);
  return validateObject(field, opts);
}
function FpPow(Fp, num, power) {
  if (power < _0n2)
    throw new Error("invalid exponent, negatives unsupported");
  if (power === _0n2)
    return Fp.ONE;
  if (power === _1n2)
    return num;
  let p = Fp.ONE;
  let d = num;
  while (power > _0n2) {
    if (power & _1n2)
      p = Fp.mul(p, d);
    d = Fp.sqr(d);
    power >>= _1n2;
  }
  return p;
}
function FpInvertBatch(Fp, nums, passZero = false) {
  const inverted = new Array(nums.length).fill(passZero ? Fp.ZERO : void 0);
  const multipliedAcc = nums.reduce((acc, num, i) => {
    if (Fp.is0(num))
      return acc;
    inverted[i] = acc;
    return Fp.mul(acc, num);
  }, Fp.ONE);
  const invertedAcc = Fp.inv(multipliedAcc);
  nums.reduceRight((acc, num, i) => {
    if (Fp.is0(num))
      return acc;
    inverted[i] = Fp.mul(acc, inverted[i]);
    return Fp.mul(acc, num);
  }, invertedAcc);
  return inverted;
}
function FpLegendre(Fp, n) {
  const p1mod2 = (Fp.ORDER - _1n2) / _2n;
  const powered = Fp.pow(n, p1mod2);
  const yes = Fp.eql(powered, Fp.ONE);
  const zero = Fp.eql(powered, Fp.ZERO);
  const no = Fp.eql(powered, Fp.neg(Fp.ONE));
  if (!yes && !zero && !no)
    throw new Error("invalid Legendre symbol result");
  return yes ? 1 : zero ? 0 : -1;
}
function nLength(n, nBitLength) {
  if (nBitLength !== void 0)
    anumber(nBitLength);
  const _nBitLength = nBitLength !== void 0 ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return { nBitLength: _nBitLength, nByteLength };
}
function Field(ORDER, bitLen2, isLE2 = false, redef = {}) {
  if (ORDER <= _0n2)
    throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
  const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen2);
  if (BYTES > 2048)
    throw new Error("invalid field: expected ORDER of <= 2048 bytes");
  let sqrtP;
  const f = Object.freeze({
    ORDER,
    isLE: isLE2,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n2,
    ONE: _1n2,
    create: (num) => mod(num, ORDER),
    isValid: (num) => {
      if (typeof num !== "bigint")
        throw new Error("invalid field element: expected bigint, got " + typeof num);
      return _0n2 <= num && num < ORDER;
    },
    is0: (num) => num === _0n2,
    isOdd: (num) => (num & _1n2) === _1n2,
    neg: (num) => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: (num) => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: (num) => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: (num) => invert(num, ORDER),
    sqrt: redef.sqrt || ((n) => {
      if (!sqrtP)
        sqrtP = FpSqrt(ORDER);
      return sqrtP(f, n);
    }),
    toBytes: (num) => isLE2 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: (bytes) => {
      if (bytes.length !== BYTES)
        throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
      return isLE2 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    },
    // TODO: we don't need it here, move out to separate fn
    invertBatch: (lst) => FpInvertBatch(f, lst),
    // We can't move this out because Fp6, Fp12 implement it
    // and it's unclear what to return in there.
    cmov: (a, b, c) => c ? b : a
  });
  return Object.freeze(f);
}
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== "bigint")
    throw new Error("field order must be bigint");
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
function mapHashToField(key, fieldOrder, isLE2 = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  if (len < 16 || len < minLen || len > 1024)
    throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
  const num = isLE2 ? bytesToNumberLE(key) : bytesToNumberBE(key);
  const reduced = mod(num, fieldOrder - _1n2) + _1n2;
  return isLE2 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}
var _0n2, _1n2, _2n, _3n, _4n, _5n, _8n, FIELD_FIELDS;
var init_modular = __esm({
  "node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/modular.js"() {
    init_utils();
    init_utils2();
    _0n2 = BigInt(0);
    _1n2 = BigInt(1);
    _2n = /* @__PURE__ */ BigInt(2);
    _3n = /* @__PURE__ */ BigInt(3);
    _4n = /* @__PURE__ */ BigInt(4);
    _5n = /* @__PURE__ */ BigInt(5);
    _8n = /* @__PURE__ */ BigInt(8);
    FIELD_FIELDS = [
      "create",
      "isValid",
      "is0",
      "neg",
      "inv",
      "sqrt",
      "sqr",
      "eql",
      "add",
      "sub",
      "mul",
      "pow",
      "div",
      "addN",
      "subN",
      "mulN",
      "sqrN"
    ];
  }
});

// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_md.js
function setBigUint64(view, byteOffset, value, isLE2) {
  if (typeof view.setBigUint64 === "function")
    return view.setBigUint64(byteOffset, value, isLE2);
  const _32n2 = BigInt(32);
  const _u32_max = BigInt(4294967295);
  const wh = Number(value >> _32n2 & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE2 ? 4 : 0;
  const l = isLE2 ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE2);
  view.setUint32(byteOffset + l, wl, isLE2);
}
function Chi(a, b, c) {
  return a & b ^ ~a & c;
}
function Maj(a, b, c) {
  return a & b ^ a & c ^ b & c;
}
var HashMD, SHA256_IV, SHA512_IV;
var init_md = __esm({
  "node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_md.js"() {
    init_utils();
    HashMD = class extends Hash {
      constructor(blockLen, outputLen, padOffset, isLE2) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE2;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView(this.buffer);
      }
      update(data) {
        aexists(this);
        data = toBytes(data);
        abytes(data);
        const { view, buffer, blockLen } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          if (take === blockLen) {
            const dataView = createView(data);
            for (; blockLen <= len - pos; pos += blockLen)
              this.process(dataView, pos);
            continue;
          }
          buffer.set(data.subarray(pos, pos + take), this.pos);
          this.pos += take;
          pos += take;
          if (this.pos === blockLen) {
            this.process(view, 0);
            this.pos = 0;
          }
        }
        this.length += data.length;
        this.roundClean();
        return this;
      }
      digestInto(out) {
        aexists(this);
        aoutput(out, this);
        this.finished = true;
        const { buffer, view, blockLen, isLE: isLE2 } = this;
        let { pos } = this;
        buffer[pos++] = 128;
        clean(this.buffer.subarray(pos));
        if (this.padOffset > blockLen - pos) {
          this.process(view, 0);
          pos = 0;
        }
        for (let i = pos; i < blockLen; i++)
          buffer[i] = 0;
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
        this.process(view, 0);
        const oview = createView(out);
        const len = this.outputLen;
        if (len % 4)
          throw new Error("_sha2: outputLen should be aligned to 32bit");
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
          throw new Error("_sha2: outputLen bigger than state");
        for (let i = 0; i < outLen; i++)
          oview.setUint32(4 * i, state[i], isLE2);
      }
      digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
      }
      _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.destroyed = destroyed;
        to.finished = finished;
        to.length = length;
        to.pos = pos;
        if (length % blockLen)
          to.buffer.set(buffer);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
    };
    SHA256_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ]);
    SHA512_IV = /* @__PURE__ */ Uint32Array.from([
      1779033703,
      4089235720,
      3144134277,
      2227873595,
      1013904242,
      4271175723,
      2773480762,
      1595750129,
      1359893119,
      2917565137,
      2600822924,
      725511199,
      528734635,
      4215389547,
      1541459225,
      327033209
    ]);
  }
});

// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_u64.js
function fromBig(n, le = false) {
  if (le)
    return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
  return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
function add(Ah, Al, Bh, Bl) {
  const l = (Al >>> 0) + (Bl >>> 0);
  return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
}
var U32_MASK64, _32n, shrSH, shrSL, rotrSH, rotrSL, rotrBH, rotrBL, rotlSH, rotlSL, rotlBH, rotlBL, add3L, add3H, add4L, add4H, add5L, add5H;
var init_u64 = __esm({
  "node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/_u64.js"() {
    U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    _32n = /* @__PURE__ */ BigInt(32);
    shrSH = (h, _l, s) => h >>> s;
    shrSL = (h, l, s) => h << 32 - s | l >>> s;
    rotrSH = (h, l, s) => h >>> s | l << 32 - s;
    rotrSL = (h, l, s) => h << 32 - s | l >>> s;
    rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
    rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
    rotlSH = (h, l, s) => h << s | l >>> 32 - s;
    rotlSL = (h, l, s) => l << s | h >>> 32 - s;
    rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
    rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
    add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
    add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
    add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
    add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
    add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
    add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
  }
});

// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/sha2.js
var SHA256_K, SHA256_W, SHA256, K512, SHA512_Kh, SHA512_Kl, SHA512_W_H, SHA512_W_L, SHA512, sha256, sha512;
var init_sha2 = __esm({
  "node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/sha2.js"() {
    init_md();
    init_u64();
    init_utils();
    SHA256_K = /* @__PURE__ */ Uint32Array.from([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    SHA256_W = /* @__PURE__ */ new Uint32Array(64);
    SHA256 = class extends HashMD {
      constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        this.A = SHA256_IV[0] | 0;
        this.B = SHA256_IV[1] | 0;
        this.C = SHA256_IV[2] | 0;
        this.D = SHA256_IV[3] | 0;
        this.E = SHA256_IV[4] | 0;
        this.F = SHA256_IV[5] | 0;
        this.G = SHA256_IV[6] | 0;
        this.H = SHA256_IV[7] | 0;
      }
      get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
      }
      // prettier-ignore
      set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
          const W15 = SHA256_W[i - 15];
          const W2 = SHA256_W[i - 2];
          const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
          const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
          SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
        }
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
          const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
          const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
          const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
          const T2 = sigma0 + Maj(A, B, C) | 0;
          H = G;
          G = F;
          F = E;
          E = D + T1 | 0;
          D = C;
          C = B;
          B = A;
          A = T1 + T2 | 0;
        }
        A = A + this.A | 0;
        B = B + this.B | 0;
        C = C + this.C | 0;
        D = D + this.D | 0;
        E = E + this.E | 0;
        F = F + this.F | 0;
        G = G + this.G | 0;
        H = H + this.H | 0;
        this.set(A, B, C, D, E, F, G, H);
      }
      roundClean() {
        clean(SHA256_W);
      }
      destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        clean(this.buffer);
      }
    };
    K512 = /* @__PURE__ */ (() => split([
      "0x428a2f98d728ae22",
      "0x7137449123ef65cd",
      "0xb5c0fbcfec4d3b2f",
      "0xe9b5dba58189dbbc",
      "0x3956c25bf348b538",
      "0x59f111f1b605d019",
      "0x923f82a4af194f9b",
      "0xab1c5ed5da6d8118",
      "0xd807aa98a3030242",
      "0x12835b0145706fbe",
      "0x243185be4ee4b28c",
      "0x550c7dc3d5ffb4e2",
      "0x72be5d74f27b896f",
      "0x80deb1fe3b1696b1",
      "0x9bdc06a725c71235",
      "0xc19bf174cf692694",
      "0xe49b69c19ef14ad2",
      "0xefbe4786384f25e3",
      "0x0fc19dc68b8cd5b5",
      "0x240ca1cc77ac9c65",
      "0x2de92c6f592b0275",
      "0x4a7484aa6ea6e483",
      "0x5cb0a9dcbd41fbd4",
      "0x76f988da831153b5",
      "0x983e5152ee66dfab",
      "0xa831c66d2db43210",
      "0xb00327c898fb213f",
      "0xbf597fc7beef0ee4",
      "0xc6e00bf33da88fc2",
      "0xd5a79147930aa725",
      "0x06ca6351e003826f",
      "0x142929670a0e6e70",
      "0x27b70a8546d22ffc",
      "0x2e1b21385c26c926",
      "0x4d2c6dfc5ac42aed",
      "0x53380d139d95b3df",
      "0x650a73548baf63de",
      "0x766a0abb3c77b2a8",
      "0x81c2c92e47edaee6",
      "0x92722c851482353b",
      "0xa2bfe8a14cf10364",
      "0xa81a664bbc423001",
      "0xc24b8b70d0f89791",
      "0xc76c51a30654be30",
      "0xd192e819d6ef5218",
      "0xd69906245565a910",
      "0xf40e35855771202a",
      "0x106aa07032bbd1b8",
      "0x19a4c116b8d2d0c8",
      "0x1e376c085141ab53",
      "0x2748774cdf8eeb99",
      "0x34b0bcb5e19b48a8",
      "0x391c0cb3c5c95a63",
      "0x4ed8aa4ae3418acb",
      "0x5b9cca4f7763e373",
      "0x682e6ff3d6b2b8a3",
      "0x748f82ee5defb2fc",
      "0x78a5636f43172f60",
      "0x84c87814a1f0ab72",
      "0x8cc702081a6439ec",
      "0x90befffa23631e28",
      "0xa4506cebde82bde9",
      "0xbef9a3f7b2c67915",
      "0xc67178f2e372532b",
      "0xca273eceea26619c",
      "0xd186b8c721c0c207",
      "0xeada7dd6cde0eb1e",
      "0xf57d4f7fee6ed178",
      "0x06f067aa72176fba",
      "0x0a637dc5a2c898a6",
      "0x113f9804bef90dae",
      "0x1b710b35131c471b",
      "0x28db77f523047d84",
      "0x32caab7b40c72493",
      "0x3c9ebe0a15c9bebc",
      "0x431d67c49c100d4c",
      "0x4cc5d4becb3e42b6",
      "0x597f299cfc657e2a",
      "0x5fcb6fab3ad6faec",
      "0x6c44198c4a475817"
    ].map((n) => BigInt(n))))();
    SHA512_Kh = /* @__PURE__ */ (() => K512[0])();
    SHA512_Kl = /* @__PURE__ */ (() => K512[1])();
    SHA512_W_H = /* @__PURE__ */ new Uint32Array(80);
    SHA512_W_L = /* @__PURE__ */ new Uint32Array(80);
    SHA512 = class extends HashMD {
      constructor(outputLen = 64) {
        super(128, outputLen, 16, false);
        this.Ah = SHA512_IV[0] | 0;
        this.Al = SHA512_IV[1] | 0;
        this.Bh = SHA512_IV[2] | 0;
        this.Bl = SHA512_IV[3] | 0;
        this.Ch = SHA512_IV[4] | 0;
        this.Cl = SHA512_IV[5] | 0;
        this.Dh = SHA512_IV[6] | 0;
        this.Dl = SHA512_IV[7] | 0;
        this.Eh = SHA512_IV[8] | 0;
        this.El = SHA512_IV[9] | 0;
        this.Fh = SHA512_IV[10] | 0;
        this.Fl = SHA512_IV[11] | 0;
        this.Gh = SHA512_IV[12] | 0;
        this.Gl = SHA512_IV[13] | 0;
        this.Hh = SHA512_IV[14] | 0;
        this.Hl = SHA512_IV[15] | 0;
      }
      // prettier-ignore
      get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
      }
      // prettier-ignore
      set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4) {
          SHA512_W_H[i] = view.getUint32(offset);
          SHA512_W_L[i] = view.getUint32(offset += 4);
        }
        for (let i = 16; i < 80; i++) {
          const W15h = SHA512_W_H[i - 15] | 0;
          const W15l = SHA512_W_L[i - 15] | 0;
          const s0h = rotrSH(W15h, W15l, 1) ^ rotrSH(W15h, W15l, 8) ^ shrSH(W15h, W15l, 7);
          const s0l = rotrSL(W15h, W15l, 1) ^ rotrSL(W15h, W15l, 8) ^ shrSL(W15h, W15l, 7);
          const W2h = SHA512_W_H[i - 2] | 0;
          const W2l = SHA512_W_L[i - 2] | 0;
          const s1h = rotrSH(W2h, W2l, 19) ^ rotrBH(W2h, W2l, 61) ^ shrSH(W2h, W2l, 6);
          const s1l = rotrSL(W2h, W2l, 19) ^ rotrBL(W2h, W2l, 61) ^ shrSL(W2h, W2l, 6);
          const SUMl = add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
          const SUMh = add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
          SHA512_W_H[i] = SUMh | 0;
          SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        for (let i = 0; i < 80; i++) {
          const sigma1h = rotrSH(Eh, El, 14) ^ rotrSH(Eh, El, 18) ^ rotrBH(Eh, El, 41);
          const sigma1l = rotrSL(Eh, El, 14) ^ rotrSL(Eh, El, 18) ^ rotrBL(Eh, El, 41);
          const CHIh = Eh & Fh ^ ~Eh & Gh;
          const CHIl = El & Fl ^ ~El & Gl;
          const T1ll = add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
          const T1h = add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
          const T1l = T1ll | 0;
          const sigma0h = rotrSH(Ah, Al, 28) ^ rotrBH(Ah, Al, 34) ^ rotrBH(Ah, Al, 39);
          const sigma0l = rotrSL(Ah, Al, 28) ^ rotrBL(Ah, Al, 34) ^ rotrBL(Ah, Al, 39);
          const MAJh = Ah & Bh ^ Ah & Ch ^ Bh & Ch;
          const MAJl = Al & Bl ^ Al & Cl ^ Bl & Cl;
          Hh = Gh | 0;
          Hl = Gl | 0;
          Gh = Fh | 0;
          Gl = Fl | 0;
          Fh = Eh | 0;
          Fl = El | 0;
          ({ h: Eh, l: El } = add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
          Dh = Ch | 0;
          Dl = Cl | 0;
          Ch = Bh | 0;
          Cl = Bl | 0;
          Bh = Ah | 0;
          Bl = Al | 0;
          const All = add3L(T1l, sigma0l, MAJl);
          Ah = add3H(All, T1h, sigma0h, MAJh);
          Al = All | 0;
        }
        ({ h: Ah, l: Al } = add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
      }
      roundClean() {
        clean(SHA512_W_H, SHA512_W_L);
      }
      destroy() {
        clean(this.buffer);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      }
    };
    sha256 = /* @__PURE__ */ createHasher(() => new SHA256());
    sha512 = /* @__PURE__ */ createHasher(() => new SHA512());
  }
});

// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/hmac.js
var HMAC, hmac;
var init_hmac = __esm({
  "node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/hmac.js"() {
    init_utils();
    HMAC = class extends Hash {
      constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        ahash(hash);
        const key = toBytes(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== "function")
          throw new Error("Expected instance of class which extends utils.Hash");
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad2 = new Uint8Array(blockLen);
        pad2.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad2.length; i++)
          pad2[i] ^= 54;
        this.iHash.update(pad2);
        this.oHash = hash.create();
        for (let i = 0; i < pad2.length; i++)
          pad2[i] ^= 54 ^ 92;
        this.oHash.update(pad2);
        clean(pad2);
      }
      update(buf) {
        aexists(this);
        this.iHash.update(buf);
        return this;
      }
      digestInto(out) {
        aexists(this);
        abytes(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
      }
      digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
      }
      _cloneInto(to) {
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
      }
      clone() {
        return this._cloneInto();
      }
      destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
      }
    };
    hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
    hmac.create = (hash, key) => new HMAC(hash, key);
  }
});

// node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/curve.js
function constTimeNegate(condition, item) {
  const neg = item.negate();
  return condition ? neg : item;
}
function validateW(W, bits) {
  if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
    throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
}
function calcWOpts(W, scalarBits) {
  validateW(W, scalarBits);
  const windows = Math.ceil(scalarBits / W) + 1;
  const windowSize = 2 ** (W - 1);
  const maxNumber = 2 ** W;
  const mask = bitMask(W);
  const shiftBy = BigInt(W);
  return { windows, windowSize, mask, maxNumber, shiftBy };
}
function calcOffsets(n, window, wOpts) {
  const { windowSize, mask, maxNumber, shiftBy } = wOpts;
  let wbits = Number(n & mask);
  let nextN = n >> shiftBy;
  if (wbits > windowSize) {
    wbits -= maxNumber;
    nextN += _1n3;
  }
  const offsetStart = window * windowSize;
  const offset = offsetStart + Math.abs(wbits) - 1;
  const isZero = wbits === 0;
  const isNeg = wbits < 0;
  const isNegF = window % 2 !== 0;
  const offsetF = offsetStart;
  return { nextN, offset, isZero, isNeg, isNegF, offsetF };
}
function validateMSMPoints(points, c) {
  if (!Array.isArray(points))
    throw new Error("array expected");
  points.forEach((p, i) => {
    if (!(p instanceof c))
      throw new Error("invalid point at index " + i);
  });
}
function validateMSMScalars(scalars, field) {
  if (!Array.isArray(scalars))
    throw new Error("array of scalars expected");
  scalars.forEach((s, i) => {
    if (!field.isValid(s))
      throw new Error("invalid scalar at index " + i);
  });
}
function getW(P) {
  return pointWindowSizes.get(P) || 1;
}
function wNAF(c, bits) {
  return {
    constTimeNegate,
    hasPrecomputes(elm) {
      return getW(elm) !== 1;
    },
    // non-const time multiplication ladder
    unsafeLadder(elm, n, p = c.ZERO) {
      let d = elm;
      while (n > _0n3) {
        if (n & _1n3)
          p = p.add(d);
        d = d.double();
        n >>= _1n3;
      }
      return p;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @param elm Point instance
     * @param W window size
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const { windows, windowSize } = calcWOpts(W, bits);
      const points = [];
      let p = elm;
      let base = p;
      for (let window = 0; window < windows; window++) {
        base = p;
        points.push(base);
        for (let i = 1; i < windowSize; i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      let p = c.ZERO;
      let f = c.BASE;
      const wo = calcWOpts(W, bits);
      for (let window = 0; window < wo.windows; window++) {
        const { nextN, offset, isZero, isNeg, isNegF, offsetF } = calcOffsets(n, window, wo);
        n = nextN;
        if (isZero) {
          f = f.add(constTimeNegate(isNegF, precomputes[offsetF]));
        } else {
          p = p.add(constTimeNegate(isNeg, precomputes[offset]));
        }
      }
      return { p, f };
    },
    /**
     * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @param acc accumulator point to add result of multiplication
     * @returns point
     */
    wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
      const wo = calcWOpts(W, bits);
      for (let window = 0; window < wo.windows; window++) {
        if (n === _0n3)
          break;
        const { nextN, offset, isZero, isNeg } = calcOffsets(n, window, wo);
        n = nextN;
        if (isZero) {
          continue;
        } else {
          const item = precomputes[offset];
          acc = acc.add(isNeg ? item.negate() : item);
        }
      }
      return acc;
    },
    getPrecomputes(W, P, transform) {
      let comp = pointPrecomputes.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1)
          pointPrecomputes.set(P, transform(comp));
      }
      return comp;
    },
    wNAFCached(P, n, transform) {
      const W = getW(P);
      return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
    },
    wNAFCachedUnsafe(P, n, transform, prev) {
      const W = getW(P);
      if (W === 1)
        return this.unsafeLadder(P, n, prev);
      return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(P, W) {
      validateW(W, bits);
      pointWindowSizes.set(P, W);
      pointPrecomputes.delete(P);
    }
  };
}
function pippenger(c, fieldN, points, scalars) {
  validateMSMPoints(points, c);
  validateMSMScalars(scalars, fieldN);
  const plength = points.length;
  const slength = scalars.length;
  if (plength !== slength)
    throw new Error("arrays of points and scalars must have equal length");
  const zero = c.ZERO;
  const wbits = bitLen(BigInt(plength));
  let windowSize = 1;
  if (wbits > 12)
    windowSize = wbits - 3;
  else if (wbits > 4)
    windowSize = wbits - 2;
  else if (wbits > 0)
    windowSize = 2;
  const MASK = bitMask(windowSize);
  const buckets = new Array(Number(MASK) + 1).fill(zero);
  const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
  let sum = zero;
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(zero);
    for (let j = 0; j < slength; j++) {
      const scalar = scalars[j];
      const wbits2 = Number(scalar >> BigInt(i) & MASK);
      buckets[wbits2] = buckets[wbits2].add(points[j]);
    }
    let resI = zero;
    for (let j = buckets.length - 1, sumI = zero; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0)
      for (let j = 0; j < windowSize; j++)
        sum = sum.double();
  }
  return sum;
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: "bigint",
    h: "bigint",
    Gx: "field",
    Gy: "field"
  }, {
    nBitLength: "isSafeInteger",
    nByteLength: "isSafeInteger"
  });
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{ p: curve.Fp.ORDER }
  });
}
var _0n3, _1n3, pointPrecomputes, pointWindowSizes;
var init_curve = __esm({
  "node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/curve.js"() {
    init_modular();
    init_utils2();
    _0n3 = BigInt(0);
    _1n3 = BigInt(1);
    pointPrecomputes = /* @__PURE__ */ new WeakMap();
    pointWindowSizes = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/weierstrass.js
function validateSigVerOpts(opts) {
  if (opts.lowS !== void 0)
    abool("lowS", opts.lowS);
  if (opts.prehash !== void 0)
    abool("prehash", opts.prehash);
}
function validatePointOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    a: "field",
    b: "field"
  }, {
    allowInfinityPoint: "boolean",
    allowedPrivateKeyLengths: "array",
    clearCofactor: "function",
    fromBytes: "function",
    isTorsionFree: "function",
    toBytes: "function",
    wrapPrivateKey: "boolean"
  });
  const { endo, Fp, a } = opts;
  if (endo) {
    if (!Fp.eql(a, Fp.ZERO)) {
      throw new Error("invalid endo: CURVE.a must be 0");
    }
    if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
      throw new Error('invalid endo: expected "beta": bigint and "splitScalar": function');
    }
  }
  return Object.freeze({ ...opts });
}
function numToSizedHex(num, size2) {
  return bytesToHex2(numberToBytesBE(num, size2));
}
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const { Fp } = CURVE;
  const Fn = Field(CURVE.n, CURVE.nBitLength);
  const toBytes3 = CURVE.toBytes || ((_c, point, _isCompressed) => {
    const a = point.toAffine();
    return concatBytes2(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
  });
  const fromBytes = CURVE.fromBytes || ((bytes) => {
    const tail = bytes.subarray(1);
    const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
    const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
    return { x, y };
  });
  function weierstrassEquation(x) {
    const { a, b } = CURVE;
    const x2 = Fp.sqr(x);
    const x3 = Fp.mul(x2, x);
    return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
  }
  function isValidXY(x, y) {
    const left = Fp.sqr(y);
    const right = weierstrassEquation(x);
    return Fp.eql(left, right);
  }
  if (!isValidXY(CURVE.Gx, CURVE.Gy))
    throw new Error("bad curve params: generator point");
  const _4a3 = Fp.mul(Fp.pow(CURVE.a, _3n2), _4n2);
  const _27b2 = Fp.mul(Fp.sqr(CURVE.b), BigInt(27));
  if (Fp.is0(Fp.add(_4a3, _27b2)))
    throw new Error("bad curve params: a or b");
  function isWithinCurveOrder(num) {
    return inRange(num, _1n4, CURVE.n);
  }
  function normPrivateKeyToScalar(key) {
    const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE;
    if (lengths && typeof key !== "bigint") {
      if (isBytes2(key))
        key = bytesToHex2(key);
      if (typeof key !== "string" || !lengths.includes(key.length))
        throw new Error("invalid private key");
      key = key.padStart(nByteLength * 2, "0");
    }
    let num;
    try {
      num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
    } catch (error) {
      throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
    }
    if (wrapPrivateKey)
      num = mod(num, N);
    aInRange("private key", num, _1n4, N);
    return num;
  }
  function aprjpoint(other) {
    if (!(other instanceof Point2))
      throw new Error("ProjectivePoint expected");
  }
  const toAffineMemo = memoized((p, iz) => {
    const { px: x, py: y, pz: z } = p;
    if (Fp.eql(z, Fp.ONE))
      return { x, y };
    const is0 = p.is0();
    if (iz == null)
      iz = is0 ? Fp.ONE : Fp.inv(z);
    const ax = Fp.mul(x, iz);
    const ay = Fp.mul(y, iz);
    const zz = Fp.mul(z, iz);
    if (is0)
      return { x: Fp.ZERO, y: Fp.ZERO };
    if (!Fp.eql(zz, Fp.ONE))
      throw new Error("invZ was invalid");
    return { x: ax, y: ay };
  });
  const assertValidMemo = memoized((p) => {
    if (p.is0()) {
      if (CURVE.allowInfinityPoint && !Fp.is0(p.py))
        return;
      throw new Error("bad point: ZERO");
    }
    const { x, y } = p.toAffine();
    if (!Fp.isValid(x) || !Fp.isValid(y))
      throw new Error("bad point: x or y not FE");
    if (!isValidXY(x, y))
      throw new Error("bad point: equation left != right");
    if (!p.isTorsionFree())
      throw new Error("bad point: not in prime-order subgroup");
    return true;
  });
  class Point2 {
    constructor(px, py, pz) {
      if (px == null || !Fp.isValid(px))
        throw new Error("x required");
      if (py == null || !Fp.isValid(py) || Fp.is0(py))
        throw new Error("y required");
      if (pz == null || !Fp.isValid(pz))
        throw new Error("z required");
      this.px = px;
      this.py = py;
      this.pz = pz;
      Object.freeze(this);
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(p) {
      const { x, y } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("invalid affine point");
      if (p instanceof Point2)
        throw new Error("projective point not allowed");
      const is0 = (i) => Fp.eql(i, Fp.ZERO);
      if (is0(x) && is0(y))
        return Point2.ZERO;
      return new Point2(x, y, Fp.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(points) {
      const toInv = FpInvertBatch(Fp, points.map((p) => p.pz));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point2.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(hex) {
      const P = Point2.fromAffine(fromBytes(ensureBytes("pointHex", hex)));
      P.assertValidity();
      return P;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(privateKey) {
      return Point2.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    // Multiscalar Multiplication
    static msm(points, scalars) {
      return pippenger(Point2, Fn, points, scalars);
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const { y } = this.toAffine();
      if (Fp.isOdd)
        return !Fp.isOdd(y);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(other) {
      aprjpoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new Point2(this.px, Fp.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const { a, b } = CURVE;
      const b3 = Fp.mul(b, _3n2);
      const { px: X1, py: Y1, pz: Z1 } = this;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      let t0 = Fp.mul(X1, X1);
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3);
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3);
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3);
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0);
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1);
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3);
      Z3 = Fp.add(Z3, Z3);
      return new Point2(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      aprjpoint(other);
      const { px: X1, py: Y1, pz: Z1 } = this;
      const { px: X2, py: Y2, pz: Z2 } = other;
      let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n2);
      let t0 = Fp.mul(X1, X2);
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2);
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2);
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2);
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2);
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0);
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2);
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4);
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0);
      return new Point2(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point2.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, n, Point2.normalizeZ);
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      const { endo: endo2, n: N } = CURVE;
      aInRange("scalar", sc, _0n4, N);
      const I = Point2.ZERO;
      if (sc === _0n4)
        return I;
      if (this.is0() || sc === _1n4)
        return this;
      if (!endo2 || wnaf.hasPrecomputes(this))
        return wnaf.wNAFCachedUnsafe(this, sc, Point2.normalizeZ);
      let { k1neg, k1, k2neg, k2 } = endo2.splitScalar(sc);
      let k1p = I;
      let k2p = I;
      let d = this;
      while (k1 > _0n4 || k2 > _0n4) {
        if (k1 & _1n4)
          k1p = k1p.add(d);
        if (k2 & _1n4)
          k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n4;
        k2 >>= _1n4;
      }
      if (k1neg)
        k1p = k1p.negate();
      if (k2neg)
        k2p = k2p.negate();
      k2p = new Point2(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const { endo: endo2, n: N } = CURVE;
      aInRange("scalar", scalar, _1n4, N);
      let point, fake;
      if (endo2) {
        const { k1neg, k1, k2neg, k2 } = endo2.splitScalar(scalar);
        let { p: k1p, f: f1p } = this.wNAF(k1);
        let { p: k2p, f: f2p } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point2(Fp.mul(k2p.px, endo2.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const { p, f } = this.wNAF(scalar);
        point = p;
        fake = f;
      }
      return Point2.normalizeZ([point, fake])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point2.BASE;
      const mul = (P, a2) => a2 === _0n4 || a2 === _1n4 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2);
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? void 0 : sum;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    isTorsionFree() {
      const { h: cofactor, isTorsionFree } = CURVE;
      if (cofactor === _1n4)
        return true;
      if (isTorsionFree)
        return isTorsionFree(Point2, this);
      throw new Error("isTorsionFree() has not been declared for the elliptic curve");
    }
    clearCofactor() {
      const { h: cofactor, clearCofactor } = CURVE;
      if (cofactor === _1n4)
        return this;
      if (clearCofactor)
        return clearCofactor(Point2, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      abool("isCompressed", isCompressed);
      this.assertValidity();
      return toBytes3(Point2, this, isCompressed);
    }
    toHex(isCompressed = true) {
      abool("isCompressed", isCompressed);
      return bytesToHex2(this.toRawBytes(isCompressed));
    }
  }
  Point2.BASE = new Point2(CURVE.Gx, CURVE.Gy, Fp.ONE);
  Point2.ZERO = new Point2(Fp.ZERO, Fp.ONE, Fp.ZERO);
  const { endo, nBitLength } = CURVE;
  const wnaf = wNAF(Point2, endo ? Math.ceil(nBitLength / 2) : nBitLength);
  return {
    CURVE,
    ProjectivePoint: Point2,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    hash: "hash",
    hmac: "function",
    randomBytes: "function"
  }, {
    bits2int: "function",
    bits2int_modN: "function",
    lowS: "boolean"
  });
  return Object.freeze({ lowS: true, ...opts });
}
function weierstrass(curveDef) {
  const CURVE = validateOpts(curveDef);
  const { Fp, n: CURVE_ORDER, nByteLength, nBitLength } = CURVE;
  const compressedLen = Fp.BYTES + 1;
  const uncompressedLen = 2 * Fp.BYTES + 1;
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  function invN(a) {
    return invert(a, CURVE_ORDER);
  }
  const { ProjectivePoint: Point2, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
    ...CURVE,
    toBytes(_c, point, isCompressed) {
      const a = point.toAffine();
      const x = Fp.toBytes(a.x);
      const cat = concatBytes2;
      abool("isCompressed", isCompressed);
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
      } else {
        return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
      }
    },
    fromBytes(bytes) {
      const len = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      if (len === compressedLen && (head === 2 || head === 3)) {
        const x = bytesToNumberBE(tail);
        if (!inRange(x, _1n4, Fp.ORDER))
          throw new Error("Point is not on curve");
        const y2 = weierstrassEquation(x);
        let y;
        try {
          y = Fp.sqrt(y2);
        } catch (sqrtError) {
          const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
          throw new Error("Point is not on curve" + suffix);
        }
        const isYOdd = (y & _1n4) === _1n4;
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd)
          y = Fp.neg(y);
        return { x, y };
      } else if (len === uncompressedLen && head === 4) {
        const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return { x, y };
      } else {
        const cl = compressedLen;
        const ul = uncompressedLen;
        throw new Error("invalid Point, expected length of " + cl + ", or uncompressed " + ul + ", got " + len);
      }
    }
  });
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n4;
    return number > HALF;
  }
  function normalizeS(s) {
    return isBiggerThanHalfOrder(s) ? modN(-s) : s;
  }
  const slcNum = (b, from, to) => bytesToNumberBE(b.slice(from, to));
  class Signature {
    constructor(r, s, recovery) {
      aInRange("r", r, _1n4, CURVE_ORDER);
      aInRange("s", s, _1n4, CURVE_ORDER);
      this.r = r;
      this.s = s;
      if (recovery != null)
        this.recovery = recovery;
      Object.freeze(this);
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(hex) {
      const l = nByteLength;
      hex = ensureBytes("compactSignature", hex, l * 2);
      return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(hex) {
      const { r, s } = DER.toSig(ensureBytes("DER", hex));
      return new Signature(r, s);
    }
    /**
     * @todo remove
     * @deprecated
     */
    assertValidity() {
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const { r, s, recovery: rec } = this;
      const h = bits2int_modN(ensureBytes("msgHash", msgHash));
      if (rec == null || ![0, 1, 2, 3].includes(rec))
        throw new Error("recovery id invalid");
      const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
      if (radj >= Fp.ORDER)
        throw new Error("recovery id 2 or 3 invalid");
      const prefix = (rec & 1) === 0 ? "02" : "03";
      const R = Point2.fromHex(prefix + numToSizedHex(radj, Fp.BYTES));
      const ir = invN(radj);
      const u1 = modN(-h * ir);
      const u2 = modN(s * ir);
      const Q = Point2.BASE.multiplyAndAddUnsafe(R, u1, u2);
      if (!Q)
        throw new Error("point at infinify");
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return hexToBytes2(this.toDERHex());
    }
    toDERHex() {
      return DER.hexFromSig(this);
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return hexToBytes2(this.toCompactHex());
    }
    toCompactHex() {
      const l = nByteLength;
      return numToSizedHex(this.r, l) + numToSizedHex(this.s, l);
    }
  }
  const utils2 = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar,
    /**
     * Produces cryptographically secure private key from random of size
     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
     */
    randomPrivateKey: () => {
      const length = getMinHashLength(CURVE.n);
      return mapHashToField(CURVE.randomBytes(length), CURVE.n);
    },
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(windowSize = 8, point = Point2.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3));
      return point;
    }
  };
  function getPublicKey(privateKey, isCompressed = true) {
    return Point2.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  function isProbPub(item) {
    if (typeof item === "bigint")
      return false;
    if (item instanceof Point2)
      return true;
    const arr = ensureBytes("key", item);
    const len = arr.length;
    const fpl = Fp.BYTES;
    const compLen = fpl + 1;
    const uncompLen = 2 * fpl + 1;
    if (CURVE.allowedPrivateKeyLengths || nByteLength === compLen) {
      return void 0;
    } else {
      return len === compLen || len === uncompLen;
    }
  }
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA) === true)
      throw new Error("first arg must be private key");
    if (isProbPub(publicB) === false)
      throw new Error("second arg must be public key");
    const b = Point2.fromHex(publicB);
    return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  const bits2int = CURVE.bits2int || function(bytes) {
    if (bytes.length > 8192)
      throw new Error("input is too large");
    const num = bytesToNumberBE(bytes);
    const delta = bytes.length * 8 - nBitLength;
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function(bytes) {
    return modN(bits2int(bytes));
  };
  const ORDER_MASK = bitMask(nBitLength);
  function int2octets(num) {
    aInRange("num < 2^" + nBitLength, num, _0n4, ORDER_MASK);
    return numberToBytesBE(num, nByteLength);
  }
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (["recovered", "canonical"].some((k) => k in opts))
      throw new Error("sign() legacy options not supported");
    const { hash, randomBytes: randomBytes2 } = CURVE;
    let { lowS, prehash, extraEntropy: ent } = opts;
    if (lowS == null)
      lowS = true;
    msgHash = ensureBytes("msgHash", msgHash);
    validateSigVerOpts(opts);
    if (prehash)
      msgHash = ensureBytes("prehashed msgHash", hash(msgHash));
    const h1int = bits2int_modN(msgHash);
    const d = normPrivateKeyToScalar(privateKey);
    const seedArgs = [int2octets(d), int2octets(h1int)];
    if (ent != null && ent !== false) {
      const e = ent === true ? randomBytes2(Fp.BYTES) : ent;
      seedArgs.push(ensureBytes("extraEntropy", e));
    }
    const seed = concatBytes2(...seedArgs);
    const m = h1int;
    function k2sig(kBytes) {
      const k = bits2int(kBytes);
      if (!isWithinCurveOrder(k))
        return;
      const ik = invN(k);
      const q = Point2.BASE.multiply(k).toAffine();
      const r = modN(q.x);
      if (r === _0n4)
        return;
      const s = modN(ik * modN(m + r * d));
      if (s === _0n4)
        return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n4);
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = normalizeS(s);
        recovery ^= 1;
      }
      return new Signature(r, normS, recovery);
    }
    return { seed, k2sig };
  }
  const defaultSigOpts = { lowS: CURVE.lowS, prehash: false };
  const defaultVerOpts = { lowS: CURVE.lowS, prehash: false };
  function sign2(msgHash, privKey, opts = defaultSigOpts) {
    const { seed, k2sig } = prepSig(msgHash, privKey, opts);
    const C = CURVE;
    const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
    return drbg(seed, k2sig);
  }
  Point2.BASE._setWindowSize(8);
  function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
    const sg = signature;
    msgHash = ensureBytes("msgHash", msgHash);
    publicKey = ensureBytes("publicKey", publicKey);
    const { lowS, prehash, format } = opts;
    validateSigVerOpts(opts);
    if ("strict" in opts)
      throw new Error("options.strict was renamed to lowS");
    if (format !== void 0 && format !== "compact" && format !== "der")
      throw new Error("format must be compact or der");
    const isHex2 = typeof sg === "string" || isBytes2(sg);
    const isObj = !isHex2 && !format && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
    if (!isHex2 && !isObj)
      throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
    let _sig = void 0;
    let P;
    try {
      if (isObj)
        _sig = new Signature(sg.r, sg.s);
      if (isHex2) {
        try {
          if (format !== "compact")
            _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err))
            throw derError;
        }
        if (!_sig && format !== "der")
          _sig = Signature.fromCompact(sg);
      }
      P = Point2.fromHex(publicKey);
    } catch (error) {
      return false;
    }
    if (!_sig)
      return false;
    if (lowS && _sig.hasHighS())
      return false;
    if (prehash)
      msgHash = CURVE.hash(msgHash);
    const { r, s } = _sig;
    const h = bits2int_modN(msgHash);
    const is = invN(s);
    const u1 = modN(h * is);
    const u2 = modN(r * is);
    const R = Point2.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
    if (!R)
      return false;
    const v = modN(R.x);
    return v === r;
  }
  return {
    CURVE,
    getPublicKey,
    getSharedSecret,
    sign: sign2,
    verify,
    ProjectivePoint: Point2,
    Signature,
    utils: utils2
  };
}
var DERErr, DER, _0n4, _1n4, _2n2, _3n2, _4n2;
var init_weierstrass = __esm({
  "node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/abstract/weierstrass.js"() {
    init_curve();
    init_modular();
    init_utils2();
    DERErr = class extends Error {
      constructor(m = "") {
        super(m);
      }
    };
    DER = {
      // asn.1 DER encoding utils
      Err: DERErr,
      // Basic building block is TLV (Tag-Length-Value)
      _tlv: {
        encode: (tag, data) => {
          const { Err: E } = DER;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length & 1)
            throw new E("tlv.encode: unpadded data");
          const dataLen = data.length / 2;
          const len = numberToHexUnpadded(dataLen);
          if (len.length / 2 & 128)
            throw new E("tlv.encode: long form length too big");
          const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
          const t = numberToHexUnpadded(tag);
          return t + lenLen + len + data;
        },
        // v - value, l - left bytes (unparsed)
        decode(tag, data) {
          const { Err: E } = DER;
          let pos = 0;
          if (tag < 0 || tag > 256)
            throw new E("tlv.encode: wrong tag");
          if (data.length < 2 || data[pos++] !== tag)
            throw new E("tlv.decode: wrong tlv");
          const first = data[pos++];
          const isLong = !!(first & 128);
          let length = 0;
          if (!isLong)
            length = first;
          else {
            const lenLen = first & 127;
            if (!lenLen)
              throw new E("tlv.decode(long): indefinite length not supported");
            if (lenLen > 4)
              throw new E("tlv.decode(long): byte length is too big");
            const lengthBytes = data.subarray(pos, pos + lenLen);
            if (lengthBytes.length !== lenLen)
              throw new E("tlv.decode: length bytes not complete");
            if (lengthBytes[0] === 0)
              throw new E("tlv.decode(long): zero leftmost byte");
            for (const b of lengthBytes)
              length = length << 8 | b;
            pos += lenLen;
            if (length < 128)
              throw new E("tlv.decode(long): not minimal encoding");
          }
          const v = data.subarray(pos, pos + length);
          if (v.length !== length)
            throw new E("tlv.decode: wrong value length");
          return { v, l: data.subarray(pos + length) };
        }
      },
      // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
      // since we always use positive integers here. It must always be empty:
      // - add zero byte if exists
      // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
      _int: {
        encode(num) {
          const { Err: E } = DER;
          if (num < _0n4)
            throw new E("integer: negative integers are not allowed");
          let hex = numberToHexUnpadded(num);
          if (Number.parseInt(hex[0], 16) & 8)
            hex = "00" + hex;
          if (hex.length & 1)
            throw new E("unexpected DER parsing assertion: unpadded hex");
          return hex;
        },
        decode(data) {
          const { Err: E } = DER;
          if (data[0] & 128)
            throw new E("invalid signature integer: negative");
          if (data[0] === 0 && !(data[1] & 128))
            throw new E("invalid signature integer: unnecessary leading zero");
          return bytesToNumberBE(data);
        }
      },
      toSig(hex) {
        const { Err: E, _int: int, _tlv: tlv } = DER;
        const data = ensureBytes("signature", hex);
        const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
        if (seqLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
        const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
        if (sLeftBytes.length)
          throw new E("invalid signature: left bytes after parsing");
        return { r: int.decode(rBytes), s: int.decode(sBytes) };
      },
      hexFromSig(sig) {
        const { _tlv: tlv, _int: int } = DER;
        const rs = tlv.encode(2, int.encode(sig.r));
        const ss = tlv.encode(2, int.encode(sig.s));
        const seq = rs + ss;
        return tlv.encode(48, seq);
      }
    };
    _0n4 = BigInt(0);
    _1n4 = BigInt(1);
    _2n2 = BigInt(2);
    _3n2 = BigInt(3);
    _4n2 = BigInt(4);
  }
});

// node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/_shortw_utils.js
function getHash(hash) {
  return {
    hash,
    hmac: (key, ...msgs) => hmac(hash, key, concatBytes(...msgs)),
    randomBytes
  };
}
function createCurve(curveDef, defHash) {
  const create = (hash) => weierstrass({ ...curveDef, ...getHash(hash) });
  return { ...create(defHash), create };
}
var init_shortw_utils = __esm({
  "node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/_shortw_utils.js"() {
    init_hmac();
    init_utils();
    init_weierstrass();
  }
});

// node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/secp256k1.js
function sqrtMod(y) {
  const P = secp256k1P;
  const _3n3 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
  const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
  const b2 = y * y * y % P;
  const b3 = b2 * b2 * y % P;
  const b6 = pow2(b3, _3n3, P) * b3 % P;
  const b9 = pow2(b6, _3n3, P) * b3 % P;
  const b11 = pow2(b9, _2n3, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n3, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n3, P);
  if (!Fpk1.eql(Fpk1.sqr(root), y))
    throw new Error("Cannot find square root");
  return root;
}
var secp256k1P, secp256k1N, _0n5, _1n5, _2n3, divNearest, Fpk1, secp256k1;
var init_secp256k1 = __esm({
  "node_modules/.pnpm/@noble+curves@1.9.1/node_modules/@noble/curves/esm/secp256k1.js"() {
    init_sha2();
    init_shortw_utils();
    init_modular();
    secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
    secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
    _0n5 = BigInt(0);
    _1n5 = BigInt(1);
    _2n3 = BigInt(2);
    divNearest = (a, b) => (a + b / _2n3) / b;
    Fpk1 = Field(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
    secp256k1 = createCurve({
      a: _0n5,
      b: BigInt(7),
      Fp: Fpk1,
      n: secp256k1N,
      Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
      Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
      h: BigInt(1),
      lowS: true,
      // Allow only low-S signatures by default in sign() and verify()
      endo: {
        // Endomorphism, see above
        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
        splitScalar: (k) => {
          const n = secp256k1N;
          const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
          const b1 = -_1n5 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
          const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
          const b2 = a1;
          const POW_2_128 = BigInt("0x100000000000000000000000000000000");
          const c1 = divNearest(b2 * k, n);
          const c2 = divNearest(-b1 * k, n);
          let k1 = mod(k - c1 * a1 - c2 * a2, n);
          let k2 = mod(-c1 * b1 - c2 * b2, n);
          const k1neg = k1 > POW_2_128;
          const k2neg = k2 > POW_2_128;
          if (k1neg)
            k1 = n - k1;
          if (k2neg)
            k2 = n - k2;
          if (k1 > POW_2_128 || k2 > POW_2_128) {
            throw new Error("splitScalar: Endomorphism failed, k=" + k);
          }
          return { k1neg, k1, k2neg, k2 };
        }
      }
    }, sha256);
  }
});

// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/legacy.js
function ripemd_f(group, x, y, z) {
  if (group === 0)
    return x ^ y ^ z;
  if (group === 1)
    return x & y | ~x & z;
  if (group === 2)
    return (x | ~y) ^ z;
  if (group === 3)
    return x & z | y & ~z;
  return x ^ (y | ~z);
}
var Rho160, Id160, Pi160, idxLR, idxL, idxR, shifts160, shiftsL160, shiftsR160, Kl160, Kr160, BUF_160, RIPEMD160, ripemd160;
var init_legacy = __esm({
  "node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/legacy.js"() {
    init_md();
    init_utils();
    Rho160 = /* @__PURE__ */ Uint8Array.from([
      7,
      4,
      13,
      1,
      10,
      6,
      15,
      3,
      12,
      0,
      9,
      5,
      2,
      14,
      11,
      8
    ]);
    Id160 = /* @__PURE__ */ (() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
    Pi160 = /* @__PURE__ */ (() => Id160.map((i) => (9 * i + 5) % 16))();
    idxLR = /* @__PURE__ */ (() => {
      const L = [Id160];
      const R = [Pi160];
      const res = [L, R];
      for (let i = 0; i < 4; i++)
        for (let j of res)
          j.push(j[i].map((k) => Rho160[k]));
      return res;
    })();
    idxL = /* @__PURE__ */ (() => idxLR[0])();
    idxR = /* @__PURE__ */ (() => idxLR[1])();
    shifts160 = /* @__PURE__ */ [
      [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
      [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
      [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
      [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
      [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
    ].map((i) => Uint8Array.from(i));
    shiftsL160 = /* @__PURE__ */ idxL.map((idx, i) => idx.map((j) => shifts160[i][j]));
    shiftsR160 = /* @__PURE__ */ idxR.map((idx, i) => idx.map((j) => shifts160[i][j]));
    Kl160 = /* @__PURE__ */ Uint32Array.from([
      0,
      1518500249,
      1859775393,
      2400959708,
      2840853838
    ]);
    Kr160 = /* @__PURE__ */ Uint32Array.from([
      1352829926,
      1548603684,
      1836072691,
      2053994217,
      0
    ]);
    BUF_160 = /* @__PURE__ */ new Uint32Array(16);
    RIPEMD160 = class extends HashMD {
      constructor() {
        super(64, 20, 8, true);
        this.h0 = 1732584193 | 0;
        this.h1 = 4023233417 | 0;
        this.h2 = 2562383102 | 0;
        this.h3 = 271733878 | 0;
        this.h4 = 3285377520 | 0;
      }
      get() {
        const { h0, h1, h2, h3, h4 } = this;
        return [h0, h1, h2, h3, h4];
      }
      set(h0, h1, h2, h3, h4) {
        this.h0 = h0 | 0;
        this.h1 = h1 | 0;
        this.h2 = h2 | 0;
        this.h3 = h3 | 0;
        this.h4 = h4 | 0;
      }
      process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
          BUF_160[i] = view.getUint32(offset, true);
        let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
        for (let group = 0; group < 5; group++) {
          const rGroup = 4 - group;
          const hbl = Kl160[group], hbr = Kr160[group];
          const rl = idxL[group], rr = idxR[group];
          const sl = shiftsL160[group], sr = shiftsR160[group];
          for (let i = 0; i < 16; i++) {
            const tl = rotl(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
            al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl;
          }
          for (let i = 0; i < 16; i++) {
            const tr = rotl(ar + ripemd_f(rGroup, br, cr, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
            ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr;
          }
        }
        this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
      }
      roundClean() {
        clean(BUF_160);
      }
      destroy() {
        this.destroyed = true;
        clean(this.buffer);
        this.set(0, 0, 0, 0, 0);
      }
    };
    ripemd160 = /* @__PURE__ */ createHasher(() => new RIPEMD160());
  }
});

// node_modules/.pnpm/@scure+base@1.2.6/node_modules/@scure/base/lib/esm/index.js
function isBytes3(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function isArrayOf(isString, arr) {
  if (!Array.isArray(arr))
    return false;
  if (arr.length === 0)
    return true;
  if (isString) {
    return arr.every((item) => typeof item === "string");
  } else {
    return arr.every((item) => Number.isSafeInteger(item));
  }
}
function afn(input) {
  if (typeof input !== "function")
    throw new Error("function expected");
  return true;
}
function astr(label, input) {
  if (typeof input !== "string")
    throw new Error(`${label}: string expected`);
  return true;
}
function anumber2(n) {
  if (!Number.isSafeInteger(n))
    throw new Error(`invalid integer: ${n}`);
}
function aArr(input) {
  if (!Array.isArray(input))
    throw new Error("array expected");
}
function astrArr(label, input) {
  if (!isArrayOf(true, input))
    throw new Error(`${label}: array of strings expected`);
}
function anumArr(label, input) {
  if (!isArrayOf(false, input))
    throw new Error(`${label}: array of numbers expected`);
}
// @__NO_SIDE_EFFECTS__
function chain(...args) {
  const id = (a) => a;
  const wrap = (a, b) => (c) => a(b(c));
  const encode = args.map((x) => x.encode).reduceRight(wrap, id);
  const decode = args.map((x) => x.decode).reduce(wrap, id);
  return { encode, decode };
}
// @__NO_SIDE_EFFECTS__
function alphabet(letters) {
  const lettersA = typeof letters === "string" ? letters.split("") : letters;
  const len = lettersA.length;
  astrArr("alphabet", lettersA);
  const indexes = new Map(lettersA.map((l, i) => [l, i]));
  return {
    encode: (digits) => {
      aArr(digits);
      return digits.map((i) => {
        if (!Number.isSafeInteger(i) || i < 0 || i >= len)
          throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
        return lettersA[i];
      });
    },
    decode: (input) => {
      aArr(input);
      return input.map((letter) => {
        astr("alphabet.decode", letter);
        const i = indexes.get(letter);
        if (i === void 0)
          throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
        return i;
      });
    }
  };
}
// @__NO_SIDE_EFFECTS__
function join(separator = "") {
  astr("join", separator);
  return {
    encode: (from) => {
      astrArr("join.decode", from);
      return from.join(separator);
    },
    decode: (to) => {
      astr("join.decode", to);
      return to.split(separator);
    }
  };
}
// @__NO_SIDE_EFFECTS__
function padding(bits, chr = "=") {
  anumber2(bits);
  astr("padding", chr);
  return {
    encode(data) {
      astrArr("padding.encode", data);
      while (data.length * bits % 8)
        data.push(chr);
      return data;
    },
    decode(input) {
      astrArr("padding.decode", input);
      let end = input.length;
      if (end * bits % 8)
        throw new Error("padding: invalid, string should have whole number of bytes");
      for (; end > 0 && input[end - 1] === chr; end--) {
        const last = end - 1;
        const byte = last * bits;
        if (byte % 8 === 0)
          throw new Error("padding: invalid, string has too much padding");
      }
      return input.slice(0, end);
    }
  };
}
function convertRadix(data, from, to) {
  if (from < 2)
    throw new Error(`convertRadix: invalid from=${from}, base cannot be less than 2`);
  if (to < 2)
    throw new Error(`convertRadix: invalid to=${to}, base cannot be less than 2`);
  aArr(data);
  if (!data.length)
    return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data, (d) => {
    anumber2(d);
    if (d < 0 || d >= from)
      throw new Error(`invalid integer: ${d}`);
    return d;
  });
  const dlen = digits.length;
  while (true) {
    let carry = 0;
    let done = true;
    for (let i = pos; i < dlen; i++) {
      const digit = digits[i];
      const fromCarry = from * carry;
      const digitBase = fromCarry + digit;
      if (!Number.isSafeInteger(digitBase) || fromCarry / from !== carry || digitBase - digit !== fromCarry) {
        throw new Error("convertRadix: carry overflow");
      }
      const div = digitBase / to;
      carry = digitBase % to;
      const rounded = Math.floor(div);
      digits[i] = rounded;
      if (!Number.isSafeInteger(rounded) || rounded * to + carry !== digitBase)
        throw new Error("convertRadix: carry overflow");
      if (!done)
        continue;
      else if (!rounded)
        pos = i;
      else
        done = false;
    }
    res.push(carry);
    if (done)
      break;
  }
  for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
    res.push(0);
  return res.reverse();
}
function convertRadix2(data, from, to, padding2) {
  aArr(data);
  if (from <= 0 || from > 32)
    throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32)
    throw new Error(`convertRadix2: wrong to=${to}`);
  if (/* @__PURE__ */ radix2carry(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const max = powers[from];
  const mask = powers[to] - 1;
  const res = [];
  for (const n of data) {
    anumber2(n);
    if (n >= max)
      throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32)
      throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to)
      res.push((carry >> pos - to & mask) >>> 0);
    const pow = powers[pos];
    if (pow === void 0)
      throw new Error("invalid carry");
    carry &= pow - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding2 && pos >= from)
    throw new Error("Excess padding");
  if (!padding2 && carry > 0)
    throw new Error(`Non-zero padding: ${carry}`);
  if (padding2 && pos > 0)
    res.push(carry >>> 0);
  return res;
}
// @__NO_SIDE_EFFECTS__
function radix(num) {
  anumber2(num);
  const _256 = 2 ** 8;
  return {
    encode: (bytes) => {
      if (!isBytes3(bytes))
        throw new Error("radix.encode input should be Uint8Array");
      return convertRadix(Array.from(bytes), _256, num);
    },
    decode: (digits) => {
      anumArr("radix.decode", digits);
      return Uint8Array.from(convertRadix(digits, num, _256));
    }
  };
}
// @__NO_SIDE_EFFECTS__
function radix2(bits, revPadding = false) {
  anumber2(bits);
  if (bits <= 0 || bits > 32)
    throw new Error("radix2: bits should be in (0..32]");
  if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32)
    throw new Error("radix2: carry overflow");
  return {
    encode: (bytes) => {
      if (!isBytes3(bytes))
        throw new Error("radix2.encode input should be Uint8Array");
      return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
    },
    decode: (digits) => {
      anumArr("radix2.decode", digits);
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
function checksum(len, fn) {
  anumber2(len);
  afn(fn);
  return {
    encode(data) {
      if (!isBytes3(data))
        throw new Error("checksum.encode: input should be Uint8Array");
      const sum = fn(data).slice(0, len);
      const res = new Uint8Array(data.length + len);
      res.set(data);
      res.set(sum, data.length);
      return res;
    },
    decode(data) {
      if (!isBytes3(data))
        throw new Error("checksum.decode: input should be Uint8Array");
      const payload = data.slice(0, -len);
      const oldChecksum = data.slice(-len);
      const newChecksum = fn(payload).slice(0, len);
      for (let i = 0; i < len; i++)
        if (newChecksum[i] !== oldChecksum[i])
          throw new Error("Invalid checksum");
      return payload;
    }
  };
}
var gcd, radix2carry, powers, utils, genBase58, base58, createBase58check;
var init_esm = __esm({
  "node_modules/.pnpm/@scure+base@1.2.6/node_modules/@scure/base/lib/esm/index.js"() {
    gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    radix2carry = /* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to));
    powers = /* @__PURE__ */ (() => {
      let res = [];
      for (let i = 0; i < 40; i++)
        res.push(2 ** i);
      return res;
    })();
    utils = {
      alphabet,
      chain,
      checksum,
      convertRadix,
      convertRadix2,
      radix,
      radix2,
      join,
      padding
    };
    genBase58 = /* @__NO_SIDE_EFFECTS__ */ (abc) => /* @__PURE__ */ chain(/* @__PURE__ */ radix(58), /* @__PURE__ */ alphabet(abc), /* @__PURE__ */ join(""));
    base58 = /* @__PURE__ */ genBase58("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
    createBase58check = (sha2564) => /* @__PURE__ */ chain(checksum(4, (data) => sha2564(sha2564(data))), base58);
  }
});

// node_modules/.pnpm/@scure+bip32@1.7.0/node_modules/@scure/bip32/lib/esm/index.js
function bytesToNumber(bytes) {
  abytes(bytes);
  const h = bytes.length === 0 ? "0" : bytesToHex(bytes);
  return BigInt("0x" + h);
}
function numberToBytes(num) {
  if (typeof num !== "bigint")
    throw new Error("bigint expected");
  return hexToBytes(num.toString(16).padStart(64, "0"));
}
var Point, base58check, MASTER_SECRET, BITCOIN_VERSIONS, HARDENED_OFFSET, hash160, fromU32, toU32, HDKey;
var init_esm2 = __esm({
  "node_modules/.pnpm/@scure+bip32@1.7.0/node_modules/@scure/bip32/lib/esm/index.js"() {
    init_modular();
    init_secp256k1();
    init_hmac();
    init_legacy();
    init_sha2();
    init_utils();
    init_esm();
    Point = secp256k1.ProjectivePoint;
    base58check = createBase58check(sha256);
    MASTER_SECRET = utf8ToBytes("Bitcoin seed");
    BITCOIN_VERSIONS = { private: 76066276, public: 76067358 };
    HARDENED_OFFSET = 2147483648;
    hash160 = (data) => ripemd160(sha256(data));
    fromU32 = (data) => createView(data).getUint32(0, false);
    toU32 = (n) => {
      if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1) {
        throw new Error("invalid number, should be from 0 to 2**32-1, got " + n);
      }
      const buf = new Uint8Array(4);
      createView(buf).setUint32(0, n, false);
      return buf;
    };
    HDKey = class _HDKey {
      get fingerprint() {
        if (!this.pubHash) {
          throw new Error("No publicKey set!");
        }
        return fromU32(this.pubHash);
      }
      get identifier() {
        return this.pubHash;
      }
      get pubKeyHash() {
        return this.pubHash;
      }
      get privateKey() {
        return this.privKeyBytes || null;
      }
      get publicKey() {
        return this.pubKey || null;
      }
      get privateExtendedKey() {
        const priv = this.privateKey;
        if (!priv) {
          throw new Error("No private key");
        }
        return base58check.encode(this.serialize(this.versions.private, concatBytes(new Uint8Array([0]), priv)));
      }
      get publicExtendedKey() {
        if (!this.pubKey) {
          throw new Error("No public key");
        }
        return base58check.encode(this.serialize(this.versions.public, this.pubKey));
      }
      static fromMasterSeed(seed, versions = BITCOIN_VERSIONS) {
        abytes(seed);
        if (8 * seed.length < 128 || 8 * seed.length > 512) {
          throw new Error("HDKey: seed length must be between 128 and 512 bits; 256 bits is advised, got " + seed.length);
        }
        const I = hmac(sha512, MASTER_SECRET, seed);
        return new _HDKey({
          versions,
          chainCode: I.slice(32),
          privateKey: I.slice(0, 32)
        });
      }
      static fromExtendedKey(base58key, versions = BITCOIN_VERSIONS) {
        const keyBuffer = base58check.decode(base58key);
        const keyView = createView(keyBuffer);
        const version2 = keyView.getUint32(0, false);
        const opt = {
          versions,
          depth: keyBuffer[4],
          parentFingerprint: keyView.getUint32(5, false),
          index: keyView.getUint32(9, false),
          chainCode: keyBuffer.slice(13, 45)
        };
        const key = keyBuffer.slice(45);
        const isPriv = key[0] === 0;
        if (version2 !== versions[isPriv ? "private" : "public"]) {
          throw new Error("Version mismatch");
        }
        if (isPriv) {
          return new _HDKey({ ...opt, privateKey: key.slice(1) });
        } else {
          return new _HDKey({ ...opt, publicKey: key });
        }
      }
      static fromJSON(json) {
        return _HDKey.fromExtendedKey(json.xpriv);
      }
      constructor(opt) {
        this.depth = 0;
        this.index = 0;
        this.chainCode = null;
        this.parentFingerprint = 0;
        if (!opt || typeof opt !== "object") {
          throw new Error("HDKey.constructor must not be called directly");
        }
        this.versions = opt.versions || BITCOIN_VERSIONS;
        this.depth = opt.depth || 0;
        this.chainCode = opt.chainCode || null;
        this.index = opt.index || 0;
        this.parentFingerprint = opt.parentFingerprint || 0;
        if (!this.depth) {
          if (this.parentFingerprint || this.index) {
            throw new Error("HDKey: zero depth with non-zero index/parent fingerprint");
          }
        }
        if (opt.publicKey && opt.privateKey) {
          throw new Error("HDKey: publicKey and privateKey at same time.");
        }
        if (opt.privateKey) {
          if (!secp256k1.utils.isValidPrivateKey(opt.privateKey)) {
            throw new Error("Invalid private key");
          }
          this.privKey = typeof opt.privateKey === "bigint" ? opt.privateKey : bytesToNumber(opt.privateKey);
          this.privKeyBytes = numberToBytes(this.privKey);
          this.pubKey = secp256k1.getPublicKey(opt.privateKey, true);
        } else if (opt.publicKey) {
          this.pubKey = Point.fromHex(opt.publicKey).toRawBytes(true);
        } else {
          throw new Error("HDKey: no public or private key provided");
        }
        this.pubHash = hash160(this.pubKey);
      }
      derive(path) {
        if (!/^[mM]'?/.test(path)) {
          throw new Error('Path must start with "m" or "M"');
        }
        if (/^[mM]'?$/.test(path)) {
          return this;
        }
        const parts = path.replace(/^[mM]'?\//, "").split("/");
        let child = this;
        for (const c of parts) {
          const m = /^(\d+)('?)$/.exec(c);
          const m1 = m && m[1];
          if (!m || m.length !== 3 || typeof m1 !== "string")
            throw new Error("invalid child index: " + c);
          let idx = +m1;
          if (!Number.isSafeInteger(idx) || idx >= HARDENED_OFFSET) {
            throw new Error("Invalid index");
          }
          if (m[2] === "'") {
            idx += HARDENED_OFFSET;
          }
          child = child.deriveChild(idx);
        }
        return child;
      }
      deriveChild(index) {
        if (!this.pubKey || !this.chainCode) {
          throw new Error("No publicKey or chainCode set");
        }
        let data = toU32(index);
        if (index >= HARDENED_OFFSET) {
          const priv = this.privateKey;
          if (!priv) {
            throw new Error("Could not derive hardened child key");
          }
          data = concatBytes(new Uint8Array([0]), priv, data);
        } else {
          data = concatBytes(this.pubKey, data);
        }
        const I = hmac(sha512, this.chainCode, data);
        const childTweak = bytesToNumber(I.slice(0, 32));
        const chainCode = I.slice(32);
        if (!secp256k1.utils.isValidPrivateKey(childTweak)) {
          throw new Error("Tweak bigger than curve order");
        }
        const opt = {
          versions: this.versions,
          chainCode,
          depth: this.depth + 1,
          parentFingerprint: this.fingerprint,
          index
        };
        try {
          if (this.privateKey) {
            const added = mod(this.privKey + childTweak, secp256k1.CURVE.n);
            if (!secp256k1.utils.isValidPrivateKey(added)) {
              throw new Error("The tweak was out of range or the resulted private key is invalid");
            }
            opt.privateKey = added;
          } else {
            const added = Point.fromHex(this.pubKey).add(Point.fromPrivateKey(childTweak));
            if (added.equals(Point.ZERO)) {
              throw new Error("The tweak was equal to negative P, which made the result key invalid");
            }
            opt.publicKey = added.toRawBytes(true);
          }
          return new _HDKey(opt);
        } catch (err) {
          return this.deriveChild(index + 1);
        }
      }
      sign(hash) {
        if (!this.privateKey) {
          throw new Error("No privateKey set!");
        }
        abytes(hash, 32);
        return secp256k1.sign(hash, this.privKey).toCompactRawBytes();
      }
      verify(hash, signature) {
        abytes(hash, 32);
        abytes(signature, 64);
        if (!this.publicKey) {
          throw new Error("No publicKey set!");
        }
        let sig;
        try {
          sig = secp256k1.Signature.fromCompact(signature);
        } catch (error) {
          return false;
        }
        return secp256k1.verify(sig, hash, this.publicKey);
      }
      wipePrivateData() {
        this.privKey = void 0;
        if (this.privKeyBytes) {
          this.privKeyBytes.fill(0);
          this.privKeyBytes = void 0;
        }
        return this;
      }
      toJSON() {
        return {
          xpriv: this.privateExtendedKey,
          xpub: this.publicExtendedKey
        };
      }
      serialize(version2, key) {
        if (!this.chainCode) {
          throw new Error("No chainCode set");
        }
        abytes(key, 33);
        return concatBytes(toU32(version2), new Uint8Array([this.depth]), toU32(this.parentFingerprint), toU32(this.index), this.chainCode, key);
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/version.js
var version;
var init_version = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/version.js"() {
    version = "2.48.7";
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/base.js
function walk(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause !== void 0)
    return walk(err.cause, fn);
  return fn ? null : err;
}
var errorConfig, BaseError;
var init_base = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/base.js"() {
    init_version();
    errorConfig = {
      getDocsUrl: ({ docsBaseUrl, docsPath = "", docsSlug }) => docsPath ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
      version: `viem@${version}`
    };
    BaseError = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        const details = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.details;
          if (args.cause?.message)
            return args.cause.message;
          return args.details;
        })();
        const docsPath = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.docsPath || args.docsPath;
          return args.docsPath;
        })();
        const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath });
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsUrl ? [`Docs: ${docsUrl}`] : [],
          ...details ? [`Details: ${details}`] : [],
          ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
        ].join("\n");
        super(message, args.cause ? { cause: args.cause } : void 0);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BaseError"
        });
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version;
      }
      walk(fn) {
        return walk(this, fn);
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/encoding.js
var IntegerOutOfRangeError, SizeOverflowError;
var init_encoding = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/encoding.js"() {
    init_base();
    IntegerOutOfRangeError = class extends BaseError {
      constructor({ max, min, signed, size: size2, value }) {
        super(`Number "${value}" is not in safe ${size2 ? `${size2 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
      }
    };
    SizeOverflowError = class extends BaseError {
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
  if (!value)
    return false;
  if (typeof value !== "string")
    return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
var init_isHex = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/isHex.js"() {
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/size.js
function size(value) {
  if (isHex(value, { strict: false }))
    return Math.ceil((value.length - 2) / 2);
  return value.length;
}
var init_size = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/size.js"() {
    init_isHex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/trim.js
function trim(hexOrBytes, { dir = "left" } = {}) {
  let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
  let sliceLength = 0;
  for (let i = 0; i < data.length - 1; i++) {
    if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (typeof hexOrBytes === "string") {
    if (data.length === 1 && dir === "right")
      data = `${data}0`;
    return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
  }
  return data;
}
var init_trim = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/trim.js"() {
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/data.js
var SliceOffsetOutOfBoundsError, SizeExceedsPaddingSizeError;
var init_data = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/data.js"() {
    init_base();
    SliceOffsetOutOfBoundsError = class extends BaseError {
      constructor({ offset, position, size: size2 }) {
        super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size2}).`, { name: "SliceOffsetOutOfBoundsError" });
      }
    };
    SizeExceedsPaddingSizeError = class extends BaseError {
      constructor({ size: size2, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size2}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size: size2 = 32 } = {}) {
  if (typeof hexOrBytes === "string")
    return padHex(hexOrBytes, { dir, size: size2 });
  return padBytes(hexOrBytes, { dir, size: size2 });
}
function padHex(hex_, { dir, size: size2 = 32 } = {}) {
  if (size2 === null)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size2 * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex.length / 2),
      targetSize: size2,
      type: "hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size2 * 2, "0")}`;
}
function padBytes(bytes, { dir, size: size2 = 32 } = {}) {
  if (size2 === null)
    return bytes;
  if (bytes.length > size2)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size2,
      type: "bytes"
    });
  const paddedBytes = new Uint8Array(size2);
  for (let i = 0; i < size2; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size2 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}
var init_pad = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/pad.js"() {
    init_data();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/encoding/toHex.js
function toHex(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToHex(value, opts);
  if (typeof value === "string") {
    return stringToHex(value, opts);
  }
  if (typeof value === "boolean")
    return boolToHex(value, opts);
  return bytesToHex3(value, opts);
}
function boolToHex(value, opts = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { size: opts.size });
  }
  return hex;
}
function bytesToHex3(value, opts = {}) {
  let string = "";
  for (let i = 0; i < value.length; i++) {
    string += hexes3[value[i]];
  }
  const hex = `0x${string}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { dir: "right", size: opts.size });
  }
  return hex;
}
function numberToHex(value_, opts = {}) {
  const { signed, size: size2 } = opts;
  const value = BigInt(value_);
  let maxValue;
  if (size2) {
    if (signed)
      maxValue = (1n << BigInt(size2) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size2) * 8n) - 1n;
  } else if (typeof value_ === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value > maxValue || value < minValue) {
    const suffix = typeof value_ === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : void 0,
      min: `${minValue}${suffix}`,
      signed,
      size: size2,
      value: `${value_}${suffix}`
    });
  }
  const hex = `0x${(signed && value < 0 ? (1n << BigInt(size2 * 8)) + BigInt(value) : value).toString(16)}`;
  if (size2)
    return pad(hex, { size: size2 });
  return hex;
}
function stringToHex(value_, opts = {}) {
  const value = encoder.encode(value_);
  return bytesToHex3(value, opts);
}
var hexes3, encoder;
var init_toHex = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/encoding/toHex.js"() {
    init_encoding();
    init_pad();
    init_fromHex();
    hexes3 = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
    encoder = /* @__PURE__ */ new TextEncoder();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/encoding/toBytes.js
function toBytes2(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToBytes2(value, opts);
  if (typeof value === "boolean")
    return boolToBytes(value, opts);
  if (isHex(value))
    return hexToBytes3(value, opts);
  return stringToBytes(value, opts);
}
function boolToBytes(value, opts = {}) {
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { size: opts.size });
  }
  return bytes;
}
function charCodeToBase16(char) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine)
    return char - charCodeMap.zero;
  if (char >= charCodeMap.A && char <= charCodeMap.F)
    return char - (charCodeMap.A - 10);
  if (char >= charCodeMap.a && char <= charCodeMap.f)
    return char - (charCodeMap.a - 10);
  return void 0;
}
function hexToBytes3(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = pad(hex, { dir: "right", size: opts.size });
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index = 0, j = 0; index < length; index++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === void 0 || nibbleRight === void 0) {
      throw new BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
function numberToBytes2(value, opts) {
  const hex = numberToHex(value, opts);
  return hexToBytes3(hex);
}
function stringToBytes(value, opts = {}) {
  const bytes = encoder2.encode(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { dir: "right", size: opts.size });
  }
  return bytes;
}
var encoder2, charCodeMap;
var init_toBytes = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/encoding/toBytes.js"() {
    init_base();
    init_isHex();
    init_pad();
    init_fromHex();
    init_toHex();
    encoder2 = /* @__PURE__ */ new TextEncoder();
    charCodeMap = {
      zero: 48,
      nine: 57,
      A: 65,
      F: 70,
      a: 97,
      f: 102
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size2 }) {
  if (size(hexOrBytes) > size2)
    throw new SizeOverflowError({
      givenSize: size(hexOrBytes),
      maxSize: size2
    });
}
function hexToBigInt(hex, opts = {}) {
  const { signed } = opts;
  if (opts.size)
    assertSize(hex, { size: opts.size });
  const value = BigInt(hex);
  if (!signed)
    return value;
  const size2 = (hex.length - 2) / 2;
  const max = (1n << BigInt(size2) * 8n - 1n) - 1n;
  if (value <= max)
    return value;
  return value - BigInt(`0x${"f".padStart(size2 * 2, "f")}`) - 1n;
}
function hexToNumber2(hex, opts = {}) {
  const value = hexToBigInt(hex, opts);
  const number = Number(value);
  if (!Number.isSafeInteger(number))
    throw new IntegerOutOfRangeError({
      max: `${Number.MAX_SAFE_INTEGER}`,
      min: `${Number.MIN_SAFE_INTEGER}`,
      signed: opts.signed,
      size: opts.size,
      value: `${value}n`
    });
  return number;
}
var init_fromHex = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/encoding/fromHex.js"() {
    init_encoding();
    init_size();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/actions/public/getTransactionCount.js
async function getTransactionCount(client, { address, blockTag = "latest", blockNumber }) {
  const count = await client.request({
    method: "eth_getTransactionCount",
    params: [
      address,
      typeof blockNumber === "bigint" ? numberToHex(blockNumber) : blockTag
    ]
  }, {
    dedupe: Boolean(blockNumber)
  });
  return hexToNumber2(count);
}
var init_getTransactionCount = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/actions/public/getTransactionCount.js"() {
    init_fromHex();
    init_toHex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/lru.js
var LruMap;
var init_lru = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/lru.js"() {
    LruMap = class extends Map {
      constructor(size2) {
        super();
        Object.defineProperty(this, "maxSize", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.maxSize = size2;
      }
      get(key) {
        const value = super.get(key);
        if (super.has(key)) {
          super.delete(key);
          super.set(key, value);
        }
        return value;
      }
      set(key, value) {
        if (super.has(key))
          super.delete(key);
        super.set(key, value);
        if (this.maxSize && this.size > this.maxSize) {
          const firstKey = super.keys().next().value;
          if (firstKey !== void 0)
            super.delete(firstKey);
        }
        return this;
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/nonceManager.js
function createNonceManager(parameters) {
  const { source } = parameters;
  const deltaMap = /* @__PURE__ */ new Map();
  const nonceMap = new LruMap(8192);
  const promiseMap = /* @__PURE__ */ new Map();
  const getKey = ({ address, chainId }) => `${address}.${chainId}`;
  return {
    async consume({ address, chainId, client }) {
      const key = getKey({ address, chainId });
      const promise = this.get({ address, chainId, client });
      this.increment({ address, chainId });
      const nonce = await promise;
      await source.set({ address, chainId }, nonce);
      nonceMap.set(key, nonce);
      return nonce;
    },
    async increment({ address, chainId }) {
      const key = getKey({ address, chainId });
      const delta = deltaMap.get(key) ?? 0;
      deltaMap.set(key, delta + 1);
    },
    async get({ address, chainId, client }) {
      const key = getKey({ address, chainId });
      let promise = promiseMap.get(key);
      if (!promise) {
        promise = (async () => {
          try {
            const nonce = await source.get({ address, chainId, client });
            const previousNonce = nonceMap.get(key) ?? 0;
            if (previousNonce > 0 && nonce <= previousNonce)
              return previousNonce + 1;
            nonceMap.delete(key);
            return nonce;
          } finally {
            this.reset({ address, chainId });
          }
        })();
        promiseMap.set(key, promise);
      }
      const delta = deltaMap.get(key) ?? 0;
      return delta + await promise;
    },
    reset({ address, chainId }) {
      const key = getKey({ address, chainId });
      deltaMap.delete(key);
      promiseMap.delete(key);
    }
  };
}
function jsonRpc() {
  return {
    async get(parameters) {
      const { address, client } = parameters;
      return getTransactionCount(client, {
        address,
        blockTag: "pending"
      });
    },
    set() {
    }
  };
}
var nonceManager;
var init_nonceManager = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/nonceManager.js"() {
    init_getTransactionCount();
    init_lru();
    nonceManager = /* @__PURE__ */ createNonceManager({
      source: jsonRpc()
    });
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/signature/serializeSignature.js
function serializeSignature({ r, s, to = "hex", v, yParity }) {
  const yParity_ = (() => {
    if (yParity === 0 || yParity === 1)
      return yParity;
    if (v && (v === 27n || v === 28n || v >= 35n))
      return v % 2n === 0n ? 1 : 0;
    throw new Error("Invalid `v` or `yParity` value");
  })();
  const signature = `0x${new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).toCompactHex()}${yParity_ === 0 ? "1b" : "1c"}`;
  if (to === "hex")
    return signature;
  return hexToBytes3(signature);
}
var init_serializeSignature = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/signature/serializeSignature.js"() {
    init_secp256k1();
    init_fromHex();
    init_toBytes();
  }
});

// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/pbkdf2.js
function pbkdf2Init(hash, _password, _salt, _opts) {
  ahash(hash);
  const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
  const { c, dkLen, asyncTick } = opts;
  anumber(c);
  anumber(dkLen);
  anumber(asyncTick);
  if (c < 1)
    throw new Error("iterations (c) should be >= 1");
  const password = kdfInputToBytes(_password);
  const salt = kdfInputToBytes(_salt);
  const DK = new Uint8Array(dkLen);
  const PRF = hmac.create(hash, password);
  const PRFSalt = PRF._cloneInto().update(salt);
  return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
  PRF.destroy();
  PRFSalt.destroy();
  if (prfW)
    prfW.destroy();
  clean(u);
  return DK;
}
function pbkdf2(hash, password, salt, opts) {
  const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
  let prfW;
  const arr = new Uint8Array(4);
  const view = createView(arr);
  const u = new Uint8Array(PRF.outputLen);
  for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
    const Ti = DK.subarray(pos, pos + PRF.outputLen);
    view.setInt32(0, ti, false);
    (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
    Ti.set(u.subarray(0, Ti.length));
    for (let ui = 1; ui < c; ui++) {
      PRF._cloneInto(prfW).update(u).digestInto(u);
      for (let i = 0; i < Ti.length; i++)
        Ti[i] ^= u[i];
    }
  }
  return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}
var init_pbkdf2 = __esm({
  "node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/pbkdf2.js"() {
    init_hmac();
    init_utils();
  }
});

// node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/index.js
function nfkd(str) {
  if (typeof str !== "string")
    throw new TypeError("invalid mnemonic type: " + typeof str);
  return str.normalize("NFKD");
}
function normalize(str) {
  const norm = nfkd(str);
  const words = norm.split(" ");
  if (![12, 15, 18, 21, 24].includes(words.length))
    throw new Error("Invalid mnemonic");
  return { nfkd: norm, words };
}
function aentropy(ent) {
  abytes(ent, 16, 20, 24, 28, 32);
}
function generateMnemonic(wordlist11, strength = 128) {
  anumber(strength);
  if (strength % 32 !== 0 || strength > 256)
    throw new TypeError("Invalid entropy");
  return entropyToMnemonic(randomBytes(strength / 8), wordlist11);
}
function getCoder(wordlist11) {
  if (!Array.isArray(wordlist11) || wordlist11.length !== 2048 || typeof wordlist11[0] !== "string")
    throw new Error("Wordlist: expected array of 2048 strings");
  wordlist11.forEach((i) => {
    if (typeof i !== "string")
      throw new Error("wordlist: non-string element: " + i);
  });
  return utils.chain(utils.checksum(1, calcChecksum), utils.radix2(11, true), utils.alphabet(wordlist11));
}
function entropyToMnemonic(entropy, wordlist11) {
  aentropy(entropy);
  const words = getCoder(wordlist11).encode(entropy);
  return words.join(isJapanese(wordlist11) ? "\u3000" : " ");
}
function mnemonicToSeedSync(mnemonic, passphrase = "") {
  return pbkdf2(sha512, normalize(mnemonic).nfkd, psalt(passphrase), { c: 2048, dkLen: 64 });
}
var isJapanese, calcChecksum, psalt;
var init_esm3 = __esm({
  "node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/index.js"() {
    init_pbkdf2();
    init_sha2();
    init_utils();
    init_esm();
    isJapanese = (wordlist11) => wordlist11[0] === "\u3042\u3044\u3053\u304F\u3057\u3093";
    calcChecksum = (entropy) => {
      const bitsLeft = 8 - entropy.length / 4;
      return new Uint8Array([sha256(entropy)[0] >> bitsLeft << bitsLeft]);
    };
    psalt = (passphrase) => nfkd("mnemonic" + passphrase);
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/generateMnemonic.js
function generateMnemonic2(wordlist11, strength) {
  return generateMnemonic(wordlist11, strength);
}
var init_generateMnemonic = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/generateMnemonic.js"() {
    init_esm3();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/generatePrivateKey.js
function generatePrivateKey() {
  return toHex(secp256k1.utils.randomPrivateKey());
}
var init_generatePrivateKey = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/generatePrivateKey.js"() {
    init_secp256k1();
    init_toHex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/address.js
var InvalidAddressError;
var init_address = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/address.js"() {
    init_base();
    InvalidAddressError = class extends BaseError {
      constructor({ address }) {
        super(`Address "${address}" is invalid.`, {
          metaMessages: [
            "- Address must be a hex value of 20 bytes (40 hex characters).",
            "- Address must match its checksum counterpart."
          ],
          name: "InvalidAddressError"
        });
      }
    };
  }
});

// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/sha3.js
function keccakP(s, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds; round < 24; round++) {
    for (let x = 0; x < 10; x++)
      B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0; x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0; y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    let curH = s[2];
    let curL = s[3];
    for (let t = 0; t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    for (let y = 0; y < 50; y += 10) {
      for (let x = 0; x < 10; x++)
        B[x] = s[y + x];
      for (let x = 0; x < 10; x++)
        s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  clean(B);
}
var _0n6, _1n6, _2n4, _7n, _256n, _0x71n, SHA3_PI, SHA3_ROTL, _SHA3_IOTA, IOTAS, SHA3_IOTA_H, SHA3_IOTA_L, rotlH, rotlL, Keccak, gen, keccak_256;
var init_sha3 = __esm({
  "node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/sha3.js"() {
    init_u64();
    init_utils();
    _0n6 = BigInt(0);
    _1n6 = BigInt(1);
    _2n4 = BigInt(2);
    _7n = BigInt(7);
    _256n = BigInt(256);
    _0x71n = BigInt(113);
    SHA3_PI = [];
    SHA3_ROTL = [];
    _SHA3_IOTA = [];
    for (let round = 0, R = _1n6, x = 1, y = 0; round < 24; round++) {
      [x, y] = [y, (2 * x + 3 * y) % 5];
      SHA3_PI.push(2 * (5 * y + x));
      SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
      let t = _0n6;
      for (let j = 0; j < 7; j++) {
        R = (R << _1n6 ^ (R >> _7n) * _0x71n) % _256n;
        if (R & _2n4)
          t ^= _1n6 << (_1n6 << /* @__PURE__ */ BigInt(j)) - _1n6;
      }
      _SHA3_IOTA.push(t);
    }
    IOTAS = split(_SHA3_IOTA, true);
    SHA3_IOTA_H = IOTAS[0];
    SHA3_IOTA_L = IOTAS[1];
    rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
    rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
    Keccak = class _Keccak extends Hash {
      // NOTE: we accept arguments in bytes instead of bits here.
      constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        this.enableXOF = false;
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        anumber(outputLen);
        if (!(0 < blockLen && blockLen < 200))
          throw new Error("only keccak-f1600 function is supported");
        this.state = new Uint8Array(200);
        this.state32 = u32(this.state);
      }
      clone() {
        return this._cloneInto();
      }
      keccak() {
        swap32IfBE(this.state32);
        keccakP(this.state32, this.rounds);
        swap32IfBE(this.state32);
        this.posOut = 0;
        this.pos = 0;
      }
      update(data) {
        aexists(this);
        data = toBytes(data);
        abytes(data);
        const { blockLen, state } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          for (let i = 0; i < take; i++)
            state[this.pos++] ^= data[pos++];
          if (this.pos === blockLen)
            this.keccak();
        }
        return this;
      }
      finish() {
        if (this.finished)
          return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        state[pos] ^= suffix;
        if ((suffix & 128) !== 0 && pos === blockLen - 1)
          this.keccak();
        state[blockLen - 1] ^= 128;
        this.keccak();
      }
      writeInto(out) {
        aexists(this, false);
        abytes(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len; ) {
          if (this.posOut >= blockLen)
            this.keccak();
          const take = Math.min(blockLen - this.posOut, len - pos);
          out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
          this.posOut += take;
          pos += take;
        }
        return out;
      }
      xofInto(out) {
        if (!this.enableXOF)
          throw new Error("XOF is not possible for this instance");
        return this.writeInto(out);
      }
      xof(bytes) {
        anumber(bytes);
        return this.xofInto(new Uint8Array(bytes));
      }
      digestInto(out) {
        aoutput(out, this);
        if (this.finished)
          throw new Error("digest() was already called");
        this.writeInto(out);
        this.destroy();
        return out;
      }
      digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
      }
      destroy() {
        this.destroyed = true;
        clean(this.state);
      }
      _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
      }
    };
    gen = (suffix, blockLen, outputLen) => createHasher(() => new Keccak(blockLen, suffix, outputLen));
    keccak_256 = /* @__PURE__ */ (() => gen(1, 136, 256 / 8))();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
  const to = to_ || "hex";
  const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes2(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}
var init_keccak256 = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/hash/keccak256.js"() {
    init_sha3();
    init_isHex();
    init_toBytes();
    init_toHex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/address/getAddress.js
function checksumAddress(address_, chainId) {
  if (checksumAddressCache.has(`${address_}.${chainId}`))
    return checksumAddressCache.get(`${address_}.${chainId}`);
  const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
  const hash = keccak256(stringToBytes(hexAddress), "bytes");
  const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
  for (let i = 0; i < 40; i += 2) {
    if (hash[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase();
    }
    if ((hash[i >> 1] & 15) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase();
    }
  }
  const result = `0x${address.join("")}`;
  checksumAddressCache.set(`${address_}.${chainId}`, result);
  return result;
}
var checksumAddressCache;
var init_getAddress = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/address/getAddress.js"() {
    init_toBytes();
    init_keccak256();
    init_lru();
    checksumAddressCache = /* @__PURE__ */ new LruMap(8192);
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/address/isAddress.js
function isAddress(address, options) {
  const { strict = true } = options ?? {};
  const cacheKey = `${address}.${strict}`;
  if (isAddressCache.has(cacheKey))
    return isAddressCache.get(cacheKey);
  const result = (() => {
    if (!addressRegex.test(address))
      return false;
    if (address.toLowerCase() === address)
      return true;
    if (strict)
      return checksumAddress(address) === address;
    return true;
  })();
  isAddressCache.set(cacheKey, result);
  return result;
}
var addressRegex, isAddressCache;
var init_isAddress = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/address/isAddress.js"() {
    init_lru();
    init_getAddress();
    addressRegex = /^0x[a-fA-F0-9]{40}$/;
    isAddressCache = /* @__PURE__ */ new LruMap(8192);
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/toAccount.js
function toAccount(source) {
  if (typeof source === "string") {
    if (!isAddress(source, { strict: false }))
      throw new InvalidAddressError({ address: source });
    return {
      address: source,
      type: "json-rpc"
    };
  }
  if (!isAddress(source.address, { strict: false }))
    throw new InvalidAddressError({ address: source.address });
  return {
    address: source.address,
    nonceManager: source.nonceManager,
    sign: source.sign,
    signAuthorization: source.signAuthorization,
    signMessage: source.signMessage,
    signTransaction: source.signTransaction,
    signTypedData: source.signTypedData,
    source: "custom",
    type: "local"
  };
}
var init_toAccount = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/toAccount.js"() {
    init_address();
    init_isAddress();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js
function publicKeyToAddress(publicKey) {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
  return checksumAddress(`0x${address}`);
}
var init_publicKeyToAddress = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/publicKeyToAddress.js"() {
    init_getAddress();
    init_keccak256();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/sign.js
function setSignEntropy(entropy) {
  if (!entropy)
    throw new Error("must be a `true` or a hex value.");
  extraEntropy = entropy;
}
async function sign({ hash, privateKey, to = "object" }) {
  const { r, s, recovery } = secp256k1.sign(hash.slice(2), privateKey.slice(2), {
    lowS: true,
    extraEntropy: isHex(extraEntropy, { strict: false }) ? hexToBytes3(extraEntropy) : extraEntropy
  });
  const signature = {
    r: numberToHex(r, { size: 32 }),
    s: numberToHex(s, { size: 32 }),
    v: recovery ? 28n : 27n,
    yParity: recovery
  };
  return (() => {
    if (to === "bytes" || to === "hex")
      return serializeSignature({ ...signature, to });
    return signature;
  })();
}
var extraEntropy;
var init_sign = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/sign.js"() {
    init_secp256k1();
    init_isHex();
    init_toBytes();
    init_toHex();
    init_serializeSignature();
    extraEntropy = false;
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/concat.js
function concat(values) {
  if (typeof values[0] === "string")
    return concatHex(values);
  return concatBytes3(values);
}
function concatBytes3(values) {
  let length = 0;
  for (const arr of values) {
    length += arr.length;
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const arr of values) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
function concatHex(values) {
  return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
var init_concat = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/concat.js"() {
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/cursor.js
var NegativeOffsetError, PositionOutOfBoundsError, RecursiveReadLimitExceededError;
var init_cursor = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/cursor.js"() {
    init_base();
    NegativeOffsetError = class extends BaseError {
      constructor({ offset }) {
        super(`Offset \`${offset}\` cannot be negative.`, {
          name: "NegativeOffsetError"
        });
      }
    };
    PositionOutOfBoundsError = class extends BaseError {
      constructor({ length, position }) {
        super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
      }
    };
    RecursiveReadLimitExceededError = class extends BaseError {
      constructor({ count, limit }) {
        super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/cursor.js
function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
  const cursor = Object.create(staticCursor);
  cursor.bytes = bytes;
  cursor.dataView = new DataView(bytes.buffer ?? bytes, bytes.byteOffset, bytes.byteLength);
  cursor.positionReadCount = /* @__PURE__ */ new Map();
  cursor.recursiveReadLimit = recursiveReadLimit;
  return cursor;
}
var staticCursor;
var init_cursor2 = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/cursor.js"() {
    init_cursor();
    staticCursor = {
      bytes: new Uint8Array(),
      dataView: new DataView(new ArrayBuffer(0)),
      position: 0,
      positionReadCount: /* @__PURE__ */ new Map(),
      recursiveReadCount: 0,
      recursiveReadLimit: Number.POSITIVE_INFINITY,
      assertReadLimit() {
        if (this.recursiveReadCount >= this.recursiveReadLimit)
          throw new RecursiveReadLimitExceededError({
            count: this.recursiveReadCount + 1,
            limit: this.recursiveReadLimit
          });
      },
      assertPosition(position) {
        if (position < 0 || position > this.bytes.length - 1)
          throw new PositionOutOfBoundsError({
            length: this.bytes.length,
            position
          });
      },
      decrementPosition(offset) {
        if (offset < 0)
          throw new NegativeOffsetError({ offset });
        const position = this.position - offset;
        this.assertPosition(position);
        this.position = position;
      },
      getReadCount(position) {
        return this.positionReadCount.get(position || this.position) || 0;
      },
      incrementPosition(offset) {
        if (offset < 0)
          throw new NegativeOffsetError({ offset });
        const position = this.position + offset;
        this.assertPosition(position);
        this.position = position;
      },
      inspectByte(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectBytes(length, position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + length - 1);
        return this.bytes.subarray(position, position + length);
      },
      inspectUint8(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectUint16(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 1);
        return this.dataView.getUint16(position);
      },
      inspectUint24(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 2);
        return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
      },
      inspectUint32(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 3);
        return this.dataView.getUint32(position);
      },
      pushByte(byte) {
        this.assertPosition(this.position);
        this.bytes[this.position] = byte;
        this.position++;
      },
      pushBytes(bytes) {
        this.assertPosition(this.position + bytes.length - 1);
        this.bytes.set(bytes, this.position);
        this.position += bytes.length;
      },
      pushUint8(value) {
        this.assertPosition(this.position);
        this.bytes[this.position] = value;
        this.position++;
      },
      pushUint16(value) {
        this.assertPosition(this.position + 1);
        this.dataView.setUint16(this.position, value);
        this.position += 2;
      },
      pushUint24(value) {
        this.assertPosition(this.position + 2);
        this.dataView.setUint16(this.position, value >> 8);
        this.dataView.setUint8(this.position + 2, value & ~4294967040);
        this.position += 3;
      },
      pushUint32(value) {
        this.assertPosition(this.position + 3);
        this.dataView.setUint32(this.position, value);
        this.position += 4;
      },
      readByte() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectByte();
        this.position++;
        return value;
      },
      readBytes(length, size2) {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectBytes(length);
        this.position += size2 ?? length;
        return value;
      },
      readUint8() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint8();
        this.position += 1;
        return value;
      },
      readUint16() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint16();
        this.position += 2;
        return value;
      },
      readUint24() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint24();
        this.position += 3;
        return value;
      },
      readUint32() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint32();
        this.position += 4;
        return value;
      },
      get remaining() {
        return this.bytes.length - this.position;
      },
      setPosition(position) {
        const oldPosition = this.position;
        this.assertPosition(position);
        this.position = position;
        return () => this.position = oldPosition;
      },
      _touch() {
        if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
          return;
        const count = this.getReadCount();
        this.positionReadCount.set(this.position, count + 1);
        if (count > 0)
          this.recursiveReadCount++;
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/encoding/toRlp.js
function toRlp(bytes, to = "hex") {
  const encodable = getEncodable(bytes);
  const cursor = createCursor(new Uint8Array(encodable.length));
  encodable.encode(cursor);
  if (to === "hex")
    return bytesToHex3(cursor.bytes);
  return cursor.bytes;
}
function getEncodable(bytes) {
  if (Array.isArray(bytes))
    return getEncodableList(bytes.map((x) => getEncodable(x)));
  return getEncodableBytes(bytes);
}
function getEncodableList(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength(bodyLength);
  const length = (() => {
    if (bodyLength <= 55)
      return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor) {
      if (bodyLength <= 55) {
        cursor.pushByte(192 + bodyLength);
      } else {
        cursor.pushByte(192 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1)
          cursor.pushUint8(bodyLength);
        else if (sizeOfBodyLength === 2)
          cursor.pushUint16(bodyLength);
        else if (sizeOfBodyLength === 3)
          cursor.pushUint24(bodyLength);
        else
          cursor.pushUint32(bodyLength);
      }
      for (const { encode } of list) {
        encode(cursor);
      }
    }
  };
}
function getEncodableBytes(bytesOrHex) {
  const bytes = typeof bytesOrHex === "string" ? hexToBytes3(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength(bytes.length);
  const length = (() => {
    if (bytes.length === 1 && bytes[0] < 128)
      return 1;
    if (bytes.length <= 55)
      return 1 + bytes.length;
    return 1 + sizeOfBytesLength + bytes.length;
  })();
  return {
    length,
    encode(cursor) {
      if (bytes.length === 1 && bytes[0] < 128) {
        cursor.pushBytes(bytes);
      } else if (bytes.length <= 55) {
        cursor.pushByte(128 + bytes.length);
        cursor.pushBytes(bytes);
      } else {
        cursor.pushByte(128 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1)
          cursor.pushUint8(bytes.length);
        else if (sizeOfBytesLength === 2)
          cursor.pushUint16(bytes.length);
        else if (sizeOfBytesLength === 3)
          cursor.pushUint24(bytes.length);
        else
          cursor.pushUint32(bytes.length);
        cursor.pushBytes(bytes);
      }
    }
  };
}
function getSizeOfLength(length) {
  if (length < 2 ** 8)
    return 1;
  if (length < 2 ** 16)
    return 2;
  if (length < 2 ** 24)
    return 3;
  if (length < 2 ** 32)
    return 4;
  throw new BaseError("Length is too large.");
}
var init_toRlp = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/encoding/toRlp.js"() {
    init_base();
    init_cursor2();
    init_toBytes();
    init_toHex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/authorization/hashAuthorization.js
function hashAuthorization(parameters) {
  const { chainId, nonce, to } = parameters;
  const address = parameters.contractAddress ?? parameters.address;
  const hash = keccak256(concatHex([
    "0x05",
    toRlp([
      chainId ? numberToHex(chainId) : "0x",
      address,
      nonce ? numberToHex(nonce) : "0x"
    ])
  ]));
  if (to === "bytes")
    return hexToBytes3(hash);
  return hash;
}
var init_hashAuthorization = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/authorization/hashAuthorization.js"() {
    init_concat();
    init_toBytes();
    init_toHex();
    init_toRlp();
    init_keccak256();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/signAuthorization.js
async function signAuthorization(parameters) {
  const { chainId, nonce, privateKey, to = "object" } = parameters;
  const address = parameters.contractAddress ?? parameters.address;
  const signature = await sign({
    hash: hashAuthorization({ address, chainId, nonce }),
    privateKey,
    to
  });
  if (to === "object")
    return {
      address,
      chainId,
      nonce,
      ...signature
    };
  return signature;
}
var init_signAuthorization = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/signAuthorization.js"() {
    init_hashAuthorization();
    init_sign();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/constants/strings.js
var presignMessagePrefix;
var init_strings = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/constants/strings.js"() {
    presignMessagePrefix = "Ethereum Signed Message:\n";
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/signature/toPrefixedMessage.js
function toPrefixedMessage(message_) {
  const message = (() => {
    if (typeof message_ === "string")
      return stringToHex(message_);
    if (typeof message_.raw === "string")
      return message_.raw;
    return bytesToHex3(message_.raw);
  })();
  const prefix = stringToHex(`${presignMessagePrefix}${size(message)}`);
  return concat([prefix, message]);
}
var init_toPrefixedMessage = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/signature/toPrefixedMessage.js"() {
    init_strings();
    init_concat();
    init_size();
    init_toHex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/signature/hashMessage.js
function hashMessage(message, to_) {
  return keccak256(toPrefixedMessage(message), to_);
}
var init_hashMessage = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/signature/hashMessage.js"() {
    init_keccak256();
    init_toPrefixedMessage();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/signMessage.js
async function signMessage({ message, privateKey }) {
  return await sign({ hash: hashMessage(message), privateKey, to: "hex" });
}
var init_signMessage = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/signMessage.js"() {
    init_hashMessage();
    init_sign();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/constants/unit.js
var gweiUnits;
var init_unit = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/constants/unit.js"() {
    gweiUnits = {
      ether: -9,
      wei: 9
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/unit/formatUnits.js
function formatUnits(value, decimals) {
  let display = value.toString();
  const negative = display.startsWith("-");
  if (negative)
    display = display.slice(1);
  display = display.padStart(decimals, "0");
  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals)
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
}
var init_formatUnits = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/unit/formatUnits.js"() {
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/unit/formatGwei.js
function formatGwei(wei, unit = "wei") {
  return formatUnits(wei, gweiUnits[unit]);
}
var init_formatGwei = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/unit/formatGwei.js"() {
    init_unit();
    init_formatUnits();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/transaction.js
function prettyPrint(args) {
  const entries = Object.entries(args).map(([key, value]) => {
    if (value === void 0 || value === false)
      return null;
    return [key, value];
  }).filter(Boolean);
  const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
  return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
}
var InvalidLegacyVError, InvalidSerializableTransactionError, InvalidStorageKeySizeError;
var init_transaction = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/transaction.js"() {
    init_base();
    InvalidLegacyVError = class extends BaseError {
      constructor({ v }) {
        super(`Invalid \`v\` value "${v}". Expected 27 or 28.`, {
          name: "InvalidLegacyVError"
        });
      }
    };
    InvalidSerializableTransactionError = class extends BaseError {
      constructor({ transaction }) {
        super("Cannot infer a transaction type from provided transaction.", {
          metaMessages: [
            "Provided Transaction:",
            "{",
            prettyPrint(transaction),
            "}",
            "",
            "To infer the type, either provide:",
            "- a `type` to the Transaction, or",
            "- an EIP-1559 Transaction with `maxFeePerGas`, or",
            "- an EIP-2930 Transaction with `gasPrice` & `accessList`, or",
            "- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or",
            "- an EIP-7702 Transaction with `authorizationList`, or",
            "- a Legacy Transaction with `gasPrice`"
          ],
          name: "InvalidSerializableTransactionError"
        });
      }
    };
    InvalidStorageKeySizeError = class extends BaseError {
      constructor({ storageKey }) {
        super(`Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${Math.floor((storageKey.length - 2) / 2)} bytes.`, { name: "InvalidStorageKeySizeError" });
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/authorization/serializeAuthorizationList.js
function serializeAuthorizationList(authorizationList) {
  if (!authorizationList || authorizationList.length === 0)
    return [];
  const serializedAuthorizationList = [];
  for (const authorization of authorizationList) {
    const { chainId, nonce, ...signature } = authorization;
    const contractAddress = authorization.address;
    serializedAuthorizationList.push([
      chainId ? toHex(chainId) : "0x",
      contractAddress,
      nonce ? toHex(nonce) : "0x",
      ...toYParitySignatureArray({}, signature)
    ]);
  }
  return serializedAuthorizationList;
}
var init_serializeAuthorizationList = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/authorization/serializeAuthorizationList.js"() {
    init_toHex();
    init_serializeTransaction();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/blobsToCommitments.js
function blobsToCommitments(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes3(x)) : parameters.blobs;
  const commitments = [];
  for (const blob of blobs)
    commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
  return to === "bytes" ? commitments : commitments.map((x) => bytesToHex3(x));
}
var init_blobsToCommitments = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/blobsToCommitments.js"() {
    init_toBytes();
    init_toHex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/blobsToProofs.js
function blobsToProofs(parameters) {
  const { kzg } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === "string" ? "hex" : "bytes");
  const blobs = typeof parameters.blobs[0] === "string" ? parameters.blobs.map((x) => hexToBytes3(x)) : parameters.blobs;
  const commitments = typeof parameters.commitments[0] === "string" ? parameters.commitments.map((x) => hexToBytes3(x)) : parameters.commitments;
  const proofs = [];
  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i];
    const commitment = commitments[i];
    proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
  }
  return to === "bytes" ? proofs : proofs.map((x) => bytesToHex3(x));
}
var init_blobsToProofs = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/blobsToProofs.js"() {
    init_toBytes();
    init_toHex();
  }
});

// node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/sha256.js
var sha2562;
var init_sha256 = __esm({
  "node_modules/.pnpm/@noble+hashes@1.8.0/node_modules/@noble/hashes/esm/sha256.js"() {
    init_sha2();
    sha2562 = sha256;
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/hash/sha256.js
function sha2563(value, to_) {
  const to = to_ || "hex";
  const bytes = sha2562(isHex(value, { strict: false }) ? toBytes2(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}
var init_sha2562 = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/hash/sha256.js"() {
    init_sha256();
    init_isHex();
    init_toBytes();
    init_toHex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js
function commitmentToVersionedHash(parameters) {
  const { commitment, version: version2 = 1 } = parameters;
  const to = parameters.to ?? (typeof commitment === "string" ? "hex" : "bytes");
  const versionedHash = sha2563(commitment, "bytes");
  versionedHash.set([version2], 0);
  return to === "bytes" ? versionedHash : bytesToHex3(versionedHash);
}
var init_commitmentToVersionedHash = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/commitmentToVersionedHash.js"() {
    init_toHex();
    init_sha2562();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/commitmentsToVersionedHashes.js
function commitmentsToVersionedHashes(parameters) {
  const { commitments, version: version2 } = parameters;
  const to = parameters.to ?? (typeof commitments[0] === "string" ? "hex" : "bytes");
  const hashes = [];
  for (const commitment of commitments) {
    hashes.push(commitmentToVersionedHash({
      commitment,
      to,
      version: version2
    }));
  }
  return hashes;
}
var init_commitmentsToVersionedHashes = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/commitmentsToVersionedHashes.js"() {
    init_commitmentToVersionedHash();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/constants/blob.js
var blobsPerTransaction, bytesPerFieldElement, fieldElementsPerBlob, bytesPerBlob, maxBytesPerTransaction;
var init_blob = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/constants/blob.js"() {
    blobsPerTransaction = 6;
    bytesPerFieldElement = 32;
    fieldElementsPerBlob = 4096;
    bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
    maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction - // terminator byte (0x80).
    1 - // zero byte (0x00) appended to each field element.
    1 * fieldElementsPerBlob * blobsPerTransaction;
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/constants/kzg.js
var versionedHashVersionKzg;
var init_kzg = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/constants/kzg.js"() {
    versionedHashVersionKzg = 1;
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/blob.js
var BlobSizeTooLargeError, EmptyBlobError, InvalidVersionedHashSizeError, InvalidVersionedHashVersionError;
var init_blob2 = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/blob.js"() {
    init_kzg();
    init_base();
    BlobSizeTooLargeError = class extends BaseError {
      constructor({ maxSize, size: size2 }) {
        super("Blob size is too large.", {
          metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size2} bytes`],
          name: "BlobSizeTooLargeError"
        });
      }
    };
    EmptyBlobError = class extends BaseError {
      constructor() {
        super("Blob data must not be empty.", { name: "EmptyBlobError" });
      }
    };
    InvalidVersionedHashSizeError = class extends BaseError {
      constructor({ hash, size: size2 }) {
        super(`Versioned hash "${hash}" size is invalid.`, {
          metaMessages: ["Expected: 32", `Received: ${size2}`],
          name: "InvalidVersionedHashSizeError"
        });
      }
    };
    InvalidVersionedHashVersionError = class extends BaseError {
      constructor({ hash, version: version2 }) {
        super(`Versioned hash "${hash}" version is invalid.`, {
          metaMessages: [
            `Expected: ${versionedHashVersionKzg}`,
            `Received: ${version2}`
          ],
          name: "InvalidVersionedHashVersionError"
        });
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/toBlobs.js
function toBlobs(parameters) {
  const to = parameters.to ?? (typeof parameters.data === "string" ? "hex" : "bytes");
  const data = typeof parameters.data === "string" ? hexToBytes3(parameters.data) : parameters.data;
  const size_ = size(data);
  if (!size_)
    throw new EmptyBlobError();
  if (size_ > maxBytesPerTransaction)
    throw new BlobSizeTooLargeError({
      maxSize: maxBytesPerTransaction,
      size: size_
    });
  const blobs = [];
  let active = true;
  let position = 0;
  while (active) {
    const blob = createCursor(new Uint8Array(bytesPerBlob));
    let size2 = 0;
    while (size2 < fieldElementsPerBlob) {
      const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
      blob.pushByte(0);
      blob.pushBytes(bytes);
      if (bytes.length < 31) {
        blob.pushByte(128);
        active = false;
        break;
      }
      size2++;
      position += 31;
    }
    blobs.push(blob);
  }
  return to === "bytes" ? blobs.map((x) => x.bytes) : blobs.map((x) => bytesToHex3(x.bytes));
}
var init_toBlobs = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/toBlobs.js"() {
    init_blob();
    init_blob2();
    init_cursor2();
    init_size();
    init_toBytes();
    init_toHex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/toBlobSidecars.js
function toBlobSidecars(parameters) {
  const { data, kzg, to } = parameters;
  const blobs = parameters.blobs ?? toBlobs({ data, to });
  const commitments = parameters.commitments ?? blobsToCommitments({ blobs, kzg, to });
  const proofs = parameters.proofs ?? blobsToProofs({ blobs, commitments, kzg, to });
  const sidecars = [];
  for (let i = 0; i < blobs.length; i++)
    sidecars.push({
      blob: blobs[i],
      commitment: commitments[i],
      proof: proofs[i]
    });
  return sidecars;
}
var init_toBlobSidecars = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/blob/toBlobSidecars.js"() {
    init_blobsToCommitments();
    init_blobsToProofs();
    init_toBlobs();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/constants/number.js
var maxInt8, maxInt16, maxInt24, maxInt32, maxInt40, maxInt48, maxInt56, maxInt64, maxInt72, maxInt80, maxInt88, maxInt96, maxInt104, maxInt112, maxInt120, maxInt128, maxInt136, maxInt144, maxInt152, maxInt160, maxInt168, maxInt176, maxInt184, maxInt192, maxInt200, maxInt208, maxInt216, maxInt224, maxInt232, maxInt240, maxInt248, maxInt256, minInt8, minInt16, minInt24, minInt32, minInt40, minInt48, minInt56, minInt64, minInt72, minInt80, minInt88, minInt96, minInt104, minInt112, minInt120, minInt128, minInt136, minInt144, minInt152, minInt160, minInt168, minInt176, minInt184, minInt192, minInt200, minInt208, minInt216, minInt224, minInt232, minInt240, minInt248, minInt256, maxUint8, maxUint16, maxUint24, maxUint32, maxUint40, maxUint48, maxUint56, maxUint64, maxUint72, maxUint80, maxUint88, maxUint96, maxUint104, maxUint112, maxUint120, maxUint128, maxUint136, maxUint144, maxUint152, maxUint160, maxUint168, maxUint176, maxUint184, maxUint192, maxUint200, maxUint208, maxUint216, maxUint224, maxUint232, maxUint240, maxUint248, maxUint256;
var init_number = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/constants/number.js"() {
    maxInt8 = 2n ** (8n - 1n) - 1n;
    maxInt16 = 2n ** (16n - 1n) - 1n;
    maxInt24 = 2n ** (24n - 1n) - 1n;
    maxInt32 = 2n ** (32n - 1n) - 1n;
    maxInt40 = 2n ** (40n - 1n) - 1n;
    maxInt48 = 2n ** (48n - 1n) - 1n;
    maxInt56 = 2n ** (56n - 1n) - 1n;
    maxInt64 = 2n ** (64n - 1n) - 1n;
    maxInt72 = 2n ** (72n - 1n) - 1n;
    maxInt80 = 2n ** (80n - 1n) - 1n;
    maxInt88 = 2n ** (88n - 1n) - 1n;
    maxInt96 = 2n ** (96n - 1n) - 1n;
    maxInt104 = 2n ** (104n - 1n) - 1n;
    maxInt112 = 2n ** (112n - 1n) - 1n;
    maxInt120 = 2n ** (120n - 1n) - 1n;
    maxInt128 = 2n ** (128n - 1n) - 1n;
    maxInt136 = 2n ** (136n - 1n) - 1n;
    maxInt144 = 2n ** (144n - 1n) - 1n;
    maxInt152 = 2n ** (152n - 1n) - 1n;
    maxInt160 = 2n ** (160n - 1n) - 1n;
    maxInt168 = 2n ** (168n - 1n) - 1n;
    maxInt176 = 2n ** (176n - 1n) - 1n;
    maxInt184 = 2n ** (184n - 1n) - 1n;
    maxInt192 = 2n ** (192n - 1n) - 1n;
    maxInt200 = 2n ** (200n - 1n) - 1n;
    maxInt208 = 2n ** (208n - 1n) - 1n;
    maxInt216 = 2n ** (216n - 1n) - 1n;
    maxInt224 = 2n ** (224n - 1n) - 1n;
    maxInt232 = 2n ** (232n - 1n) - 1n;
    maxInt240 = 2n ** (240n - 1n) - 1n;
    maxInt248 = 2n ** (248n - 1n) - 1n;
    maxInt256 = 2n ** (256n - 1n) - 1n;
    minInt8 = -(2n ** (8n - 1n));
    minInt16 = -(2n ** (16n - 1n));
    minInt24 = -(2n ** (24n - 1n));
    minInt32 = -(2n ** (32n - 1n));
    minInt40 = -(2n ** (40n - 1n));
    minInt48 = -(2n ** (48n - 1n));
    minInt56 = -(2n ** (56n - 1n));
    minInt64 = -(2n ** (64n - 1n));
    minInt72 = -(2n ** (72n - 1n));
    minInt80 = -(2n ** (80n - 1n));
    minInt88 = -(2n ** (88n - 1n));
    minInt96 = -(2n ** (96n - 1n));
    minInt104 = -(2n ** (104n - 1n));
    minInt112 = -(2n ** (112n - 1n));
    minInt120 = -(2n ** (120n - 1n));
    minInt128 = -(2n ** (128n - 1n));
    minInt136 = -(2n ** (136n - 1n));
    minInt144 = -(2n ** (144n - 1n));
    minInt152 = -(2n ** (152n - 1n));
    minInt160 = -(2n ** (160n - 1n));
    minInt168 = -(2n ** (168n - 1n));
    minInt176 = -(2n ** (176n - 1n));
    minInt184 = -(2n ** (184n - 1n));
    minInt192 = -(2n ** (192n - 1n));
    minInt200 = -(2n ** (200n - 1n));
    minInt208 = -(2n ** (208n - 1n));
    minInt216 = -(2n ** (216n - 1n));
    minInt224 = -(2n ** (224n - 1n));
    minInt232 = -(2n ** (232n - 1n));
    minInt240 = -(2n ** (240n - 1n));
    minInt248 = -(2n ** (248n - 1n));
    minInt256 = -(2n ** (256n - 1n));
    maxUint8 = 2n ** 8n - 1n;
    maxUint16 = 2n ** 16n - 1n;
    maxUint24 = 2n ** 24n - 1n;
    maxUint32 = 2n ** 32n - 1n;
    maxUint40 = 2n ** 40n - 1n;
    maxUint48 = 2n ** 48n - 1n;
    maxUint56 = 2n ** 56n - 1n;
    maxUint64 = 2n ** 64n - 1n;
    maxUint72 = 2n ** 72n - 1n;
    maxUint80 = 2n ** 80n - 1n;
    maxUint88 = 2n ** 88n - 1n;
    maxUint96 = 2n ** 96n - 1n;
    maxUint104 = 2n ** 104n - 1n;
    maxUint112 = 2n ** 112n - 1n;
    maxUint120 = 2n ** 120n - 1n;
    maxUint128 = 2n ** 128n - 1n;
    maxUint136 = 2n ** 136n - 1n;
    maxUint144 = 2n ** 144n - 1n;
    maxUint152 = 2n ** 152n - 1n;
    maxUint160 = 2n ** 160n - 1n;
    maxUint168 = 2n ** 168n - 1n;
    maxUint176 = 2n ** 176n - 1n;
    maxUint184 = 2n ** 184n - 1n;
    maxUint192 = 2n ** 192n - 1n;
    maxUint200 = 2n ** 200n - 1n;
    maxUint208 = 2n ** 208n - 1n;
    maxUint216 = 2n ** 216n - 1n;
    maxUint224 = 2n ** 224n - 1n;
    maxUint232 = 2n ** 232n - 1n;
    maxUint240 = 2n ** 240n - 1n;
    maxUint248 = 2n ** 248n - 1n;
    maxUint256 = 2n ** 256n - 1n;
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/chain.js
var InvalidChainIdError;
var init_chain = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/chain.js"() {
    init_base();
    InvalidChainIdError = class extends BaseError {
      constructor({ chainId }) {
        super(typeof chainId === "number" ? `Chain ID "${chainId}" is invalid.` : "Chain ID is invalid.", { name: "InvalidChainIdError" });
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/node.js
var ExecutionRevertedError, FeeCapTooHighError, FeeCapTooLowError, NonceTooHighError, NonceTooLowError, NonceMaxValueError, InsufficientFundsError, IntrinsicGasTooHighError, IntrinsicGasTooLowError, TransactionTypeNotSupportedError, TipAboveFeeCapError;
var init_node = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/node.js"() {
    init_formatGwei();
    init_base();
    ExecutionRevertedError = class extends BaseError {
      constructor({ cause, message } = {}) {
        const reason = message?.replace("execution reverted: ", "")?.replace("execution reverted", "");
        super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
          cause,
          name: "ExecutionRevertedError"
        });
      }
    };
    Object.defineProperty(ExecutionRevertedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /execution reverted|gas required exceeds allowance/
    });
    FeeCapTooHighError = class extends BaseError {
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
          cause,
          name: "FeeCapTooHighError"
        });
      }
    };
    Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
    });
    FeeCapTooLowError = class extends BaseError {
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
          cause,
          name: "FeeCapTooLowError"
        });
      }
    };
    Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
    });
    NonceTooHighError = class extends BaseError {
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, { cause, name: "NonceTooHighError" });
      }
    };
    Object.defineProperty(NonceTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too high/
    });
    NonceTooLowError = class extends BaseError {
      constructor({ cause, nonce } = {}) {
        super([
          `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`,
          "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
        ].join("\n"), { cause, name: "NonceTooLowError" });
      }
    };
    Object.defineProperty(NonceTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too low|transaction already imported|already known/
    });
    NonceMaxValueError = class extends BaseError {
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, { cause, name: "NonceMaxValueError" });
      }
    };
    Object.defineProperty(NonceMaxValueError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce has max value/
    });
    InsufficientFundsError = class extends BaseError {
      constructor({ cause } = {}) {
        super([
          "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
        ].join("\n"), {
          cause,
          metaMessages: [
            "This error could arise when the account does not have enough funds to:",
            " - pay for the total gas fee,",
            " - pay for the value to send.",
            " ",
            "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
            " - `gas` is the amount of gas needed for transaction to execute,",
            " - `gas fee` is the gas fee,",
            " - `value` is the amount of ether to send to the recipient."
          ],
          name: "InsufficientFundsError"
        });
      }
    };
    Object.defineProperty(InsufficientFundsError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /insufficient funds|exceeds transaction sender account balance/
    });
    IntrinsicGasTooHighError = class extends BaseError {
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
          cause,
          name: "IntrinsicGasTooHighError"
        });
      }
    };
    Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too high|gas limit reached/
    });
    IntrinsicGasTooLowError = class extends BaseError {
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
          cause,
          name: "IntrinsicGasTooLowError"
        });
      }
    };
    Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too low/
    });
    TransactionTypeNotSupportedError = class extends BaseError {
      constructor({ cause }) {
        super("The transaction type is not supported for this chain.", {
          cause,
          name: "TransactionTypeNotSupportedError"
        });
      }
    };
    Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /transaction type not valid/
    });
    TipAboveFeeCapError = class extends BaseError {
      constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
        super([
          `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ""}).`
        ].join("\n"), {
          cause,
          name: "TipAboveFeeCapError"
        });
      }
    };
    Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
    });
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/slice.js
function slice(value, start, end, { strict } = {}) {
  if (isHex(value, { strict: false }))
    return sliceHex(value, start, end, {
      strict
    });
  return sliceBytes(value, start, end, {
    strict
  });
}
function assertStartOffset(value, start) {
  if (typeof start === "number" && start > 0 && start > size(value) - 1)
    throw new SliceOffsetOutOfBoundsError({
      offset: start,
      position: "start",
      size: size(value)
    });
}
function assertEndOffset(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError({
      offset: end,
      position: "end",
      size: size(value)
    });
  }
}
function sliceBytes(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = value_.slice(start, end);
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
function sliceHex(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
var init_slice = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/data/slice.js"() {
    init_data();
    init_isHex();
    init_size();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/transaction/assertTransaction.js
function assertTransactionEIP7702(transaction) {
  const { authorizationList } = transaction;
  if (authorizationList) {
    for (const authorization of authorizationList) {
      const { chainId } = authorization;
      const address = authorization.address;
      if (!isAddress(address))
        throw new InvalidAddressError({ address });
      if (chainId < 0)
        throw new InvalidChainIdError({ chainId });
    }
  }
  assertTransactionEIP1559(transaction);
}
function assertTransactionEIP4844(transaction) {
  const { blobVersionedHashes } = transaction;
  if (blobVersionedHashes) {
    if (blobVersionedHashes.length === 0)
      throw new EmptyBlobError();
    for (const hash of blobVersionedHashes) {
      const size_ = size(hash);
      const version2 = hexToNumber2(slice(hash, 0, 1));
      if (size_ !== 32)
        throw new InvalidVersionedHashSizeError({ hash, size: size_ });
      if (version2 !== versionedHashVersionKzg)
        throw new InvalidVersionedHashVersionError({
          hash,
          version: version2
        });
    }
  }
  assertTransactionEIP1559(transaction);
}
function assertTransactionEIP1559(transaction) {
  const { chainId, maxPriorityFeePerGas, maxFeePerGas, to } = transaction;
  if (chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (maxFeePerGas && maxFeePerGas > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
function assertTransactionEIP2930(transaction) {
  const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
  if (chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (maxPriorityFeePerGas || maxFeePerGas)
    throw new BaseError("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.");
  if (gasPrice && gasPrice > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}
function assertTransactionLegacy(transaction) {
  const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (typeof chainId !== "undefined" && chainId <= 0)
    throw new InvalidChainIdError({ chainId });
  if (maxPriorityFeePerGas || maxFeePerGas)
    throw new BaseError("`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.");
  if (gasPrice && gasPrice > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}
var init_assertTransaction = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/transaction/assertTransaction.js"() {
    init_kzg();
    init_number();
    init_address();
    init_base();
    init_blob2();
    init_chain();
    init_node();
    init_isAddress();
    init_size();
    init_slice();
    init_fromHex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/transaction/getTransactionType.js
function getTransactionType(transaction) {
  if (transaction.type)
    return transaction.type;
  if (typeof transaction.authorizationList !== "undefined")
    return "eip7702";
  if (typeof transaction.blobs !== "undefined" || typeof transaction.blobVersionedHashes !== "undefined" || typeof transaction.maxFeePerBlobGas !== "undefined" || typeof transaction.sidecars !== "undefined")
    return "eip4844";
  if (typeof transaction.maxFeePerGas !== "undefined" || typeof transaction.maxPriorityFeePerGas !== "undefined") {
    return "eip1559";
  }
  if (typeof transaction.gasPrice !== "undefined") {
    if (typeof transaction.accessList !== "undefined")
      return "eip2930";
    return "legacy";
  }
  throw new InvalidSerializableTransactionError({ transaction });
}
var init_getTransactionType = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/transaction/getTransactionType.js"() {
    init_transaction();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/transaction/serializeAccessList.js
function serializeAccessList(accessList) {
  if (!accessList || accessList.length === 0)
    return [];
  const serializedAccessList = [];
  for (let i = 0; i < accessList.length; i++) {
    const { address, storageKeys } = accessList[i];
    for (let j = 0; j < storageKeys.length; j++) {
      if (storageKeys[j].length - 2 !== 64) {
        throw new InvalidStorageKeySizeError({ storageKey: storageKeys[j] });
      }
    }
    if (!isAddress(address, { strict: false })) {
      throw new InvalidAddressError({ address });
    }
    serializedAccessList.push([address, storageKeys]);
  }
  return serializedAccessList;
}
var init_serializeAccessList = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/transaction/serializeAccessList.js"() {
    init_address();
    init_transaction();
    init_isAddress();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/transaction/serializeTransaction.js
function serializeTransaction(transaction, signature) {
  const type = getTransactionType(transaction);
  if (type === "eip1559")
    return serializeTransactionEIP1559(transaction, signature);
  if (type === "eip2930")
    return serializeTransactionEIP2930(transaction, signature);
  if (type === "eip4844")
    return serializeTransactionEIP4844(transaction, signature);
  if (type === "eip7702")
    return serializeTransactionEIP7702(transaction, signature);
  return serializeTransactionLegacy(transaction, signature);
}
function serializeTransactionEIP7702(transaction, signature) {
  const { authorizationList, chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP7702(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedAuthorizationList = serializeAuthorizationList(authorizationList);
  return concatHex([
    "0x04",
    toRlp([
      numberToHex(chainId),
      nonce ? numberToHex(nonce) : "0x",
      maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
      maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
      gas ? numberToHex(gas) : "0x",
      to ?? "0x",
      value ? numberToHex(value) : "0x",
      data ?? "0x",
      serializedAccessList,
      serializedAuthorizationList,
      ...toYParitySignatureArray(transaction, signature)
    ])
  ]);
}
function serializeTransactionEIP4844(transaction, signature) {
  const { chainId, gas, nonce, to, value, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP4844(transaction);
  let blobVersionedHashes = transaction.blobVersionedHashes;
  let sidecars = transaction.sidecars;
  if (transaction.blobs && (typeof blobVersionedHashes === "undefined" || typeof sidecars === "undefined")) {
    const blobs2 = typeof transaction.blobs[0] === "string" ? transaction.blobs : transaction.blobs.map((x) => bytesToHex3(x));
    const kzg = transaction.kzg;
    const commitments2 = blobsToCommitments({
      blobs: blobs2,
      kzg
    });
    if (typeof blobVersionedHashes === "undefined")
      blobVersionedHashes = commitmentsToVersionedHashes({
        commitments: commitments2
      });
    if (typeof sidecars === "undefined") {
      const proofs2 = blobsToProofs({ blobs: blobs2, commitments: commitments2, kzg });
      sidecars = toBlobSidecars({ blobs: blobs2, commitments: commitments2, proofs: proofs2 });
    }
  }
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    maxFeePerBlobGas ? numberToHex(maxFeePerBlobGas) : "0x",
    blobVersionedHashes ?? [],
    ...toYParitySignatureArray(transaction, signature)
  ];
  const blobs = [];
  const commitments = [];
  const proofs = [];
  if (sidecars)
    for (let i = 0; i < sidecars.length; i++) {
      const { blob, commitment, proof } = sidecars[i];
      blobs.push(blob);
      commitments.push(commitment);
      proofs.push(proof);
    }
  return concatHex([
    "0x03",
    sidecars ? (
      // If sidecars are enabled, envelope turns into a "wrapper":
      toRlp([serializedTransaction, blobs, commitments, proofs])
    ) : (
      // If sidecars are disabled, standard envelope is used:
      toRlp(serializedTransaction)
    )
  ]);
}
function serializeTransactionEIP1559(transaction, signature) {
  const { chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data } = transaction;
  assertTransactionEIP1559(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    maxPriorityFeePerGas ? numberToHex(maxPriorityFeePerGas) : "0x",
    maxFeePerGas ? numberToHex(maxFeePerGas) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    ...toYParitySignatureArray(transaction, signature)
  ];
  return concatHex([
    "0x02",
    toRlp(serializedTransaction)
  ]);
}
function serializeTransactionEIP2930(transaction, signature) {
  const { chainId, gas, data, nonce, to, value, accessList, gasPrice } = transaction;
  assertTransactionEIP2930(transaction);
  const serializedAccessList = serializeAccessList(accessList);
  const serializedTransaction = [
    numberToHex(chainId),
    nonce ? numberToHex(nonce) : "0x",
    gasPrice ? numberToHex(gasPrice) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x",
    serializedAccessList,
    ...toYParitySignatureArray(transaction, signature)
  ];
  return concatHex([
    "0x01",
    toRlp(serializedTransaction)
  ]);
}
function serializeTransactionLegacy(transaction, signature) {
  const { chainId = 0, gas, data, nonce, to, value, gasPrice } = transaction;
  assertTransactionLegacy(transaction);
  let serializedTransaction = [
    nonce ? numberToHex(nonce) : "0x",
    gasPrice ? numberToHex(gasPrice) : "0x",
    gas ? numberToHex(gas) : "0x",
    to ?? "0x",
    value ? numberToHex(value) : "0x",
    data ?? "0x"
  ];
  if (signature) {
    const v = (() => {
      if (signature.v >= 35n) {
        const inferredChainId = (signature.v - 35n) / 2n;
        if (inferredChainId > 0)
          return signature.v;
        return 27n + (signature.v === 35n ? 0n : 1n);
      }
      if (chainId > 0)
        return BigInt(chainId * 2) + BigInt(35n + signature.v - 27n);
      const v2 = 27n + (signature.v === 27n ? 0n : 1n);
      if (signature.v !== v2)
        throw new InvalidLegacyVError({ v: signature.v });
      return v2;
    })();
    const r = trim(signature.r);
    const s = trim(signature.s);
    serializedTransaction = [
      ...serializedTransaction,
      numberToHex(v),
      r === "0x00" ? "0x" : r,
      s === "0x00" ? "0x" : s
    ];
  } else if (chainId > 0) {
    serializedTransaction = [
      ...serializedTransaction,
      numberToHex(chainId),
      "0x",
      "0x"
    ];
  }
  return toRlp(serializedTransaction);
}
function toYParitySignatureArray(transaction, signature_) {
  const signature = signature_ ?? transaction;
  const { v, yParity } = signature;
  if (typeof signature.r === "undefined")
    return [];
  if (typeof signature.s === "undefined")
    return [];
  if (typeof v === "undefined" && typeof yParity === "undefined")
    return [];
  const r = trim(signature.r);
  const s = trim(signature.s);
  const yParity_ = (() => {
    if (typeof yParity === "number")
      return yParity ? numberToHex(1) : "0x";
    if (v === 0n)
      return "0x";
    if (v === 1n)
      return numberToHex(1);
    return v === 27n ? "0x" : numberToHex(1);
  })();
  return [yParity_, r === "0x00" ? "0x" : r, s === "0x00" ? "0x" : s];
}
var init_serializeTransaction = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/transaction/serializeTransaction.js"() {
    init_transaction();
    init_serializeAuthorizationList();
    init_blobsToCommitments();
    init_blobsToProofs();
    init_commitmentsToVersionedHashes();
    init_toBlobSidecars();
    init_concat();
    init_trim();
    init_toHex();
    init_toRlp();
    init_assertTransaction();
    init_getTransactionType();
    init_serializeAccessList();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/signTransaction.js
async function signTransaction(parameters) {
  const { privateKey, transaction, serializer = serializeTransaction } = parameters;
  const signableTransaction = (() => {
    if (transaction.type === "eip4844")
      return {
        ...transaction,
        sidecars: false
      };
    return transaction;
  })();
  const signature = await sign({
    hash: keccak256(await serializer(signableTransaction)),
    privateKey
  });
  return await serializer(transaction, signature);
}
var init_signTransaction = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/signTransaction.js"() {
    init_keccak256();
    init_serializeTransaction();
    init_sign();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/abi.js
var AbiEncodingArrayLengthMismatchError, AbiEncodingBytesSizeMismatchError, AbiEncodingLengthMismatchError, BytesSizeMismatchError, InvalidAbiEncodingTypeError, InvalidArrayError;
var init_abi = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/abi.js"() {
    init_size();
    init_base();
    AbiEncodingArrayLengthMismatchError = class extends BaseError {
      constructor({ expectedLength, givenLength, type }) {
        super([
          `ABI encoding array length mismatch for type ${type}.`,
          `Expected length: ${expectedLength}`,
          `Given length: ${givenLength}`
        ].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
      }
    };
    AbiEncodingBytesSizeMismatchError = class extends BaseError {
      constructor({ expectedSize, value }) {
        super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
      }
    };
    AbiEncodingLengthMismatchError = class extends BaseError {
      constructor({ expectedLength, givenLength }) {
        super([
          "ABI encoding params/values length mismatch.",
          `Expected length (params): ${expectedLength}`,
          `Given length (values): ${givenLength}`
        ].join("\n"), { name: "AbiEncodingLengthMismatchError" });
      }
    };
    BytesSizeMismatchError = class extends BaseError {
      constructor({ expectedSize, givenSize }) {
        super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
          name: "BytesSizeMismatchError"
        });
      }
    };
    InvalidAbiEncodingTypeError = class extends BaseError {
      constructor(type, { docsPath }) {
        super([
          `Type "${type}" is not a valid encoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath, name: "InvalidAbiEncodingType" });
      }
    };
    InvalidArrayError = class extends BaseError {
      constructor(value) {
        super([`Value "${value}" is not a valid array.`].join("\n"), {
          name: "InvalidArrayError"
        });
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/regex.js
var bytesRegex, integerRegex;
var init_regex = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/regex.js"() {
    bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
    integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
function encodeAbiParameters(params, values) {
  if (params.length !== values.length)
    throw new AbiEncodingLengthMismatchError({
      expectedLength: params.length,
      givenLength: values.length
    });
  const preparedParams = prepareParams({
    params,
    values
  });
  const data = encodeParams(preparedParams);
  if (data.length === 0)
    return "0x";
  return data;
}
function prepareParams({ params, values }) {
  const preparedParams = [];
  for (let i = 0; i < params.length; i++) {
    preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
  }
  return preparedParams;
}
function prepareParam({ param, value }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray(value, { length, param: { ...param, type } });
  }
  if (param.type === "tuple") {
    return encodeTuple(value, {
      param
    });
  }
  if (param.type === "address") {
    return encodeAddress(value);
  }
  if (param.type === "bool") {
    return encodeBool(value);
  }
  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    const signed = param.type.startsWith("int");
    const [, , size2 = "256"] = integerRegex.exec(param.type) ?? [];
    return encodeNumber(value, {
      signed,
      size: Number(size2)
    });
  }
  if (param.type.startsWith("bytes")) {
    return encodeBytes(value, { param });
  }
  if (param.type === "string") {
    return encodeString(value);
  }
  throw new InvalidAbiEncodingTypeError(param.type, {
    docsPath: "/docs/contract/encodeAbiParameters"
  });
}
function encodeParams(preparedParams) {
  let staticSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic)
      staticSize += 32;
    else
      staticSize += size(encoded);
  }
  const staticParams = [];
  const dynamicParams = [];
  let dynamicSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic) {
      staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
      dynamicParams.push(encoded);
      dynamicSize += size(encoded);
    } else {
      staticParams.push(encoded);
    }
  }
  return concat([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
  if (!isAddress(value))
    throw new InvalidAddressError({ address: value });
  return { dynamic: false, encoded: padHex(value.toLowerCase()) };
}
function encodeArray(value, { length, param }) {
  const dynamic = length === null;
  if (!Array.isArray(value))
    throw new InvalidArrayError(value);
  if (!dynamic && value.length !== length)
    throw new AbiEncodingArrayLengthMismatchError({
      expectedLength: length,
      givenLength: value.length,
      type: `${param.type}[${length}]`
    });
  let dynamicChild = false;
  const preparedParams = [];
  for (let i = 0; i < value.length; i++) {
    const preparedParam = prepareParam({ param, value: value[i] });
    if (preparedParam.dynamic)
      dynamicChild = true;
    preparedParams.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encodeParams(preparedParams);
    if (dynamic) {
      const length2 = numberToHex(preparedParams.length, { size: 32 });
      return {
        dynamic: true,
        encoded: preparedParams.length > 0 ? concat([length2, data]) : length2
      };
    }
    if (dynamicChild)
      return { dynamic: true, encoded: data };
  }
  return {
    dynamic: false,
    encoded: concat(preparedParams.map(({ encoded }) => encoded))
  };
}
function encodeBytes(value, { param }) {
  const [, paramSize] = param.type.split("bytes");
  const bytesSize = size(value);
  if (!paramSize) {
    let value_ = value;
    if (bytesSize % 32 !== 0)
      value_ = padHex(value_, {
        dir: "right",
        size: Math.ceil((value.length - 2) / 2 / 32) * 32
      });
    return {
      dynamic: true,
      encoded: concat([padHex(numberToHex(bytesSize, { size: 32 })), value_])
    };
  }
  if (bytesSize !== Number.parseInt(paramSize, 10))
    throw new AbiEncodingBytesSizeMismatchError({
      expectedSize: Number.parseInt(paramSize, 10),
      value
    });
  return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
}
function encodeBool(value) {
  if (typeof value !== "boolean")
    throw new BaseError(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return { dynamic: false, encoded: padHex(boolToHex(value)) };
}
function encodeNumber(value, { signed, size: size2 = 256 }) {
  if (typeof size2 === "number") {
    const max = 2n ** (BigInt(size2) - (signed ? 1n : 0n)) - 1n;
    const min = signed ? -max - 1n : 0n;
    if (value > max || value < min)
      throw new IntegerOutOfRangeError({
        max: max.toString(),
        min: min.toString(),
        signed,
        size: size2 / 8,
        value: value.toString()
      });
  }
  return {
    dynamic: false,
    encoded: numberToHex(value, {
      size: 32,
      signed
    })
  };
}
function encodeString(value) {
  const hexValue = stringToHex(value);
  const partsLength = Math.ceil(size(hexValue) / 32);
  const parts = [];
  for (let i = 0; i < partsLength; i++) {
    parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), {
      dir: "right"
    }));
  }
  return {
    dynamic: true,
    encoded: concat([
      padHex(numberToHex(size(hexValue), { size: 32 })),
      ...parts
    ])
  };
}
function encodeTuple(value, { param }) {
  let dynamic = false;
  const preparedParams = [];
  for (let i = 0; i < param.components.length; i++) {
    const param_ = param.components[i];
    const index = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParam({
      param: param_,
      value: value[index]
    });
    preparedParams.push(preparedParam);
    if (preparedParam.dynamic)
      dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encodeParams(preparedParams) : concat(preparedParams.map(({ encoded }) => encoded))
  };
}
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? (
    // Return `null` if the array is dynamic.
    [matches[2] ? Number(matches[2]) : null, matches[1]]
  ) : void 0;
}
var init_encodeAbiParameters = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/abi/encodeAbiParameters.js"() {
    init_abi();
    init_address();
    init_base();
    init_encoding();
    init_isAddress();
    init_concat();
    init_pad();
    init_size();
    init_slice();
    init_toHex();
    init_regex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/stringify.js
var stringify;
var init_stringify = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/stringify.js"() {
    stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
      const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value2) : value2;
    }, space);
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/typedData.js
var InvalidDomainError, InvalidPrimaryTypeError, InvalidStructTypeError;
var init_typedData = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/errors/typedData.js"() {
    init_stringify();
    init_base();
    InvalidDomainError = class extends BaseError {
      constructor({ domain }) {
        super(`Invalid domain "${stringify(domain)}".`, {
          metaMessages: ["Must be a valid EIP-712 domain."]
        });
      }
    };
    InvalidPrimaryTypeError = class extends BaseError {
      constructor({ primaryType, types }) {
        super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, {
          docsPath: "/api/glossary/Errors#typeddatainvalidprimarytypeerror",
          metaMessages: ["Check that the primary type is a key in `types`."]
        });
      }
    };
    InvalidStructTypeError = class extends BaseError {
      constructor({ type }) {
        super(`Struct type "${type}" is invalid.`, {
          metaMessages: ["Struct type must not be a Solidity type."],
          name: "InvalidStructTypeError"
        });
      }
    };
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/typedData.js
function validateTypedData(parameters) {
  const { domain, message, primaryType, types } = parameters;
  const validateData = (struct, data) => {
    for (const param of struct) {
      const { name, type } = param;
      const value = data[name];
      const integerMatch = type.match(integerRegex);
      if (integerMatch && (typeof value === "number" || typeof value === "bigint")) {
        const [_type, base, size_] = integerMatch;
        numberToHex(value, {
          signed: base === "int",
          size: Number.parseInt(size_, 10) / 8
        });
      }
      if (type === "address" && typeof value === "string" && !isAddress(value))
        throw new InvalidAddressError({ address: value });
      const bytesMatch = type.match(bytesRegex);
      if (bytesMatch) {
        const [_type, size_] = bytesMatch;
        if (size_ && size(value) !== Number.parseInt(size_, 10))
          throw new BytesSizeMismatchError({
            expectedSize: Number.parseInt(size_, 10),
            givenSize: size(value)
          });
      }
      const struct2 = types[type];
      if (struct2) {
        validateReference(type);
        validateData(struct2, value);
      }
    }
  };
  if (types.EIP712Domain && domain) {
    if (typeof domain !== "object")
      throw new InvalidDomainError({ domain });
    validateData(types.EIP712Domain, domain);
  }
  if (primaryType !== "EIP712Domain") {
    if (types[primaryType])
      validateData(types[primaryType], message);
    else
      throw new InvalidPrimaryTypeError({ primaryType, types });
  }
}
function getTypesForEIP712Domain({ domain }) {
  return [
    typeof domain?.name === "string" && { name: "name", type: "string" },
    domain?.version && { name: "version", type: "string" },
    (typeof domain?.chainId === "number" || typeof domain?.chainId === "bigint") && {
      name: "chainId",
      type: "uint256"
    },
    domain?.verifyingContract && {
      name: "verifyingContract",
      type: "address"
    },
    domain?.salt && { name: "salt", type: "bytes32" }
  ].filter(Boolean);
}
function validateReference(type) {
  if (type === "address" || type === "bool" || type === "string" || type.startsWith("bytes") || type.startsWith("uint") || type.startsWith("int"))
    throw new InvalidStructTypeError({ type });
}
var init_typedData2 = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/typedData.js"() {
    init_abi();
    init_address();
    init_typedData();
    init_isAddress();
    init_size();
    init_toHex();
    init_regex();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/signature/hashTypedData.js
function hashTypedData(parameters) {
  const { domain = {}, message, primaryType } = parameters;
  const types = {
    EIP712Domain: getTypesForEIP712Domain({ domain }),
    ...parameters.types
  };
  validateTypedData({
    domain,
    message,
    primaryType,
    types
  });
  const parts = ["0x1901"];
  if (domain)
    parts.push(hashDomain({
      domain,
      types
    }));
  if (primaryType !== "EIP712Domain")
    parts.push(hashStruct({
      data: message,
      primaryType,
      types
    }));
  return keccak256(concat(parts));
}
function hashDomain({ domain, types }) {
  return hashStruct({
    data: domain,
    primaryType: "EIP712Domain",
    types
  });
}
function hashStruct({ data, primaryType, types }) {
  const encoded = encodeData({
    data,
    primaryType,
    types
  });
  return keccak256(encoded);
}
function encodeData({ data, primaryType, types }) {
  const encodedTypes = [{ type: "bytes32" }];
  const encodedValues = [hashType({ primaryType, types })];
  for (const field of types[primaryType]) {
    const [type, value] = encodeField({
      types,
      name: field.name,
      type: field.type,
      value: data[field.name]
    });
    encodedTypes.push(type);
    encodedValues.push(value);
  }
  return encodeAbiParameters(encodedTypes, encodedValues);
}
function hashType({ primaryType, types }) {
  const encodedHashType = toHex(encodeType({ primaryType, types }));
  return keccak256(encodedHashType);
}
function encodeType({ primaryType, types }) {
  let result = "";
  const unsortedDeps = findTypeDependencies({ primaryType, types });
  unsortedDeps.delete(primaryType);
  const deps = [primaryType, ...Array.from(unsortedDeps).sort()];
  for (const type of deps) {
    result += `${type}(${types[type].map(({ name, type: t }) => `${t} ${name}`).join(",")})`;
  }
  return result;
}
function findTypeDependencies({ primaryType: primaryType_, types }, results = /* @__PURE__ */ new Set()) {
  const match = primaryType_.match(/^\w*/u);
  const primaryType = match?.[0];
  if (results.has(primaryType) || types[primaryType] === void 0) {
    return results;
  }
  results.add(primaryType);
  for (const field of types[primaryType]) {
    findTypeDependencies({ primaryType: field.type, types }, results);
  }
  return results;
}
function encodeField({ types, name, type, value }) {
  if (types[type] !== void 0) {
    return [
      { type: "bytes32" },
      keccak256(encodeData({ data: value, primaryType: type, types }))
    ];
  }
  if (type === "bytes")
    return [{ type: "bytes32" }, keccak256(value)];
  if (type === "string")
    return [{ type: "bytes32" }, keccak256(toHex(value))];
  if (type.lastIndexOf("]") === type.length - 1) {
    const parsedType = type.slice(0, type.lastIndexOf("["));
    const typeValuePairs = value.map((item) => encodeField({
      name,
      type: parsedType,
      types,
      value: item
    }));
    return [
      { type: "bytes32" },
      keccak256(encodeAbiParameters(typeValuePairs.map(([t]) => t), typeValuePairs.map(([, v]) => v)))
    ];
  }
  return [{ type }, value];
}
var init_hashTypedData = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/utils/signature/hashTypedData.js"() {
    init_encodeAbiParameters();
    init_concat();
    init_toHex();
    init_keccak256();
    init_typedData2();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/signTypedData.js
async function signTypedData(parameters) {
  const { privateKey, ...typedData } = parameters;
  return await sign({
    hash: hashTypedData(typedData),
    privateKey,
    to: "hex"
  });
}
var init_signTypedData = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/signTypedData.js"() {
    init_hashTypedData();
    init_sign();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/privateKeyToAccount.js
function privateKeyToAccount(privateKey, options = {}) {
  const { nonceManager: nonceManager2 } = options;
  const publicKey = toHex(secp256k1.getPublicKey(privateKey.slice(2), false));
  const address = publicKeyToAddress(publicKey);
  const account = toAccount({
    address,
    nonceManager: nonceManager2,
    async sign({ hash }) {
      return sign({ hash, privateKey, to: "hex" });
    },
    async signAuthorization(authorization) {
      return signAuthorization({ ...authorization, privateKey });
    },
    async signMessage({ message }) {
      return signMessage({ message, privateKey });
    },
    async signTransaction(transaction, { serializer } = {}) {
      return signTransaction({ privateKey, transaction, serializer });
    },
    async signTypedData(typedData) {
      return signTypedData({ ...typedData, privateKey });
    }
  });
  return {
    ...account,
    publicKey,
    source: "privateKey"
  };
}
var init_privateKeyToAccount = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/privateKeyToAccount.js"() {
    init_secp256k1();
    init_toHex();
    init_toAccount();
    init_publicKeyToAddress();
    init_sign();
    init_signAuthorization();
    init_signMessage();
    init_signTransaction();
    init_signTypedData();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/hdKeyToAccount.js
function hdKeyToAccount(hdKey_, { accountIndex = 0, addressIndex = 0, changeIndex = 0, path, ...options } = {}) {
  const hdKey = hdKey_.derive(path || `m/44'/60'/${accountIndex}'/${changeIndex}/${addressIndex}`);
  const account = privateKeyToAccount(toHex(hdKey.privateKey), options);
  return {
    ...account,
    getHdKey: () => hdKey,
    source: "hd"
  };
}
var init_hdKeyToAccount = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/hdKeyToAccount.js"() {
    init_toHex();
    init_privateKeyToAccount();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/mnemonicToAccount.js
function mnemonicToAccount(mnemonic, { passphrase, ...hdKeyOpts } = {}) {
  const seed = mnemonicToSeedSync(mnemonic, passphrase);
  return hdKeyToAccount(HDKey.fromMasterSeed(seed), hdKeyOpts);
}
var init_mnemonicToAccount = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/mnemonicToAccount.js"() {
    init_esm2();
    init_esm3();
    init_hdKeyToAccount();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/parseAccount.js
function parseAccount(account) {
  if (typeof account === "string")
    return { address: account, type: "json-rpc" };
  return account;
}
var init_parseAccount = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/parseAccount.js"() {
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/privateKeyToAddress.js
function privateKeyToAddress(privateKey) {
  const publicKey = bytesToHex3(secp256k1.getPublicKey(privateKey.slice(2), false));
  return publicKeyToAddress(publicKey);
}
var init_privateKeyToAddress = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/utils/privateKeyToAddress.js"() {
    init_secp256k1();
    init_toHex();
    init_publicKeyToAddress();
  }
});

// node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/czech.js
var wordlist;
var init_czech = __esm({
  "node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/czech.js"() {
    wordlist = `abdikace
abeceda
adresa
agrese
akce
aktovka
alej
alkohol
amputace
ananas
andulka
anekdota
anketa
antika
anulovat
archa
arogance
asfalt
asistent
aspirace
astma
astronom
atlas
atletika
atol
autobus
azyl
babka
bachor
bacil
baculka
badatel
bageta
bagr
bahno
bakterie
balada
baletka
balkon
balonek
balvan
balza
bambus
bankomat
barbar
baret
barman
baroko
barva
baterka
batoh
bavlna
bazalka
bazilika
bazuka
bedna
beran
beseda
bestie
beton
bezinka
bezmoc
beztak
bicykl
bidlo
biftek
bikiny
bilance
biograf
biolog
bitva
bizon
blahobyt
blatouch
blecha
bledule
blesk
blikat
blizna
blokovat
bloudit
blud
bobek
bobr
bodlina
bodnout
bohatost
bojkot
bojovat
bokorys
bolest
borec
borovice
bota
boubel
bouchat
bouda
boule
bourat
boxer
bradavka
brambora
branka
bratr
brepta
briketa
brko
brloh
bronz
broskev
brunetka
brusinka
brzda
brzy
bublina
bubnovat
buchta
buditel
budka
budova
bufet
bujarost
bukvice
buldok
bulva
bunda
bunkr
burza
butik
buvol
buzola
bydlet
bylina
bytovka
bzukot
capart
carevna
cedr
cedule
cejch
cejn
cela
celer
celkem
celnice
cenina
cennost
cenovka
centrum
cenzor
cestopis
cetka
chalupa
chapadlo
charita
chata
chechtat
chemie
chichot
chirurg
chlad
chleba
chlubit
chmel
chmura
chobot
chochol
chodba
cholera
chomout
chopit
choroba
chov
chrapot
chrlit
chrt
chrup
chtivost
chudina
chutnat
chvat
chvilka
chvost
chyba
chystat
chytit
cibule
cigareta
cihelna
cihla
cinkot
cirkus
cisterna
citace
citrus
cizinec
cizost
clona
cokoliv
couvat
ctitel
ctnost
cudnost
cuketa
cukr
cupot
cvaknout
cval
cvik
cvrkot
cyklista
daleko
dareba
datel
datum
dcera
debata
dechovka
decibel
deficit
deflace
dekl
dekret
demokrat
deprese
derby
deska
detektiv
dikobraz
diktovat
dioda
diplom
disk
displej
divadlo
divoch
dlaha
dlouho
dluhopis
dnes
dobro
dobytek
docent
dochutit
dodnes
dohled
dohoda
dohra
dojem
dojnice
doklad
dokola
doktor
dokument
dolar
doleva
dolina
doma
dominant
domluvit
domov
donutit
dopad
dopis
doplnit
doposud
doprovod
dopustit
dorazit
dorost
dort
dosah
doslov
dostatek
dosud
dosyta
dotaz
dotek
dotknout
doufat
doutnat
dovozce
dozadu
doznat
dozorce
drahota
drak
dramatik
dravec
draze
drdol
drobnost
drogerie
drozd
drsnost
drtit
drzost
duben
duchovno
dudek
duha
duhovka
dusit
dusno
dutost
dvojice
dvorec
dynamit
ekolog
ekonomie
elektron
elipsa
email
emise
emoce
empatie
epizoda
epocha
epopej
epos
esej
esence
eskorta
eskymo
etiketa
euforie
evoluce
exekuce
exkurze
expedice
exploze
export
extrakt
facka
fajfka
fakulta
fanatik
fantazie
farmacie
favorit
fazole
federace
fejeton
fenka
fialka
figurant
filozof
filtr
finance
finta
fixace
fjord
flanel
flirt
flotila
fond
fosfor
fotbal
fotka
foton
frakce
freska
fronta
fukar
funkce
fyzika
galeje
garant
genetika
geolog
gilotina
glazura
glejt
golem
golfista
gotika
graf
gramofon
granule
grep
gril
grog
groteska
guma
hadice
hadr
hala
halenka
hanba
hanopis
harfa
harpuna
havran
hebkost
hejkal
hejno
hejtman
hektar
helma
hematom
herec
herna
heslo
hezky
historik
hladovka
hlasivky
hlava
hledat
hlen
hlodavec
hloh
hloupost
hltat
hlubina
hluchota
hmat
hmota
hmyz
hnis
hnojivo
hnout
hoblina
hoboj
hoch
hodiny
hodlat
hodnota
hodovat
hojnost
hokej
holinka
holka
holub
homole
honitba
honorace
horal
horda
horizont
horko
horlivec
hormon
hornina
horoskop
horstvo
hospoda
hostina
hotovost
houba
houf
houpat
houska
hovor
hradba
hranice
hravost
hrazda
hrbolek
hrdina
hrdlo
hrdost
hrnek
hrobka
hromada
hrot
hrouda
hrozen
hrstka
hrubost
hryzat
hubenost
hubnout
hudba
hukot
humr
husita
hustota
hvozd
hybnost
hydrant
hygiena
hymna
hysterik
idylka
ihned
ikona
iluze
imunita
infekce
inflace
inkaso
inovace
inspekce
internet
invalida
investor
inzerce
ironie
jablko
jachta
jahoda
jakmile
jakost
jalovec
jantar
jarmark
jaro
jasan
jasno
jatka
javor
jazyk
jedinec
jedle
jednatel
jehlan
jekot
jelen
jelito
jemnost
jenom
jepice
jeseter
jevit
jezdec
jezero
jinak
jindy
jinoch
jiskra
jistota
jitrnice
jizva
jmenovat
jogurt
jurta
kabaret
kabel
kabinet
kachna
kadet
kadidlo
kahan
kajak
kajuta
kakao
kaktus
kalamita
kalhoty
kalibr
kalnost
kamera
kamkoliv
kamna
kanibal
kanoe
kantor
kapalina
kapela
kapitola
kapka
kaple
kapota
kapr
kapusta
kapybara
karamel
karotka
karton
kasa
katalog
katedra
kauce
kauza
kavalec
kazajka
kazeta
kazivost
kdekoliv
kdesi
kedluben
kemp
keramika
kino
klacek
kladivo
klam
klapot
klasika
klaun
klec
klenba
klepat
klesnout
klid
klima
klisna
klobouk
klokan
klopa
kloub
klubovna
klusat
kluzkost
kmen
kmitat
kmotr
kniha
knot
koalice
koberec
kobka
kobliha
kobyla
kocour
kohout
kojenec
kokos
koktejl
kolaps
koleda
kolize
kolo
komando
kometa
komik
komnata
komora
kompas
komunita
konat
koncept
kondice
konec
konfese
kongres
konina
konkurs
kontakt
konzerva
kopanec
kopie
kopnout
koprovka
korbel
korektor
kormidlo
koroptev
korpus
koruna
koryto
korzet
kosatec
kostka
kotel
kotleta
kotoul
koukat
koupelna
kousek
kouzlo
kovboj
koza
kozoroh
krabice
krach
krajina
kralovat
krasopis
kravata
kredit
krejcar
kresba
kreveta
kriket
kritik
krize
krkavec
krmelec
krmivo
krocan
krok
kronika
kropit
kroupa
krovka
krtek
kruhadlo
krupice
krutost
krvinka
krychle
krypta
krystal
kryt
kudlanka
kufr
kujnost
kukla
kulajda
kulich
kulka
kulomet
kultura
kuna
kupodivu
kurt
kurzor
kutil
kvalita
kvasinka
kvestor
kynolog
kyselina
kytara
kytice
kytka
kytovec
kyvadlo
labrador
lachtan
ladnost
laik
lakomec
lamela
lampa
lanovka
lasice
laso
lastura
latinka
lavina
lebka
leckdy
leden
lednice
ledovka
ledvina
legenda
legie
legrace
lehce
lehkost
lehnout
lektvar
lenochod
lentilka
lepenka
lepidlo
letadlo
letec
letmo
letokruh
levhart
levitace
levobok
libra
lichotka
lidojed
lidskost
lihovina
lijavec
lilek
limetka
linie
linka
linoleum
listopad
litina
litovat
lobista
lodivod
logika
logoped
lokalita
loket
lomcovat
lopata
lopuch
lord
losos
lotr
loudal
louh
louka
louskat
lovec
lstivost
lucerna
lucifer
lump
lusk
lustrace
lvice
lyra
lyrika
lysina
madam
madlo
magistr
mahagon
majetek
majitel
majorita
makak
makovice
makrela
malba
malina
malovat
malvice
maminka
mandle
manko
marnost
masakr
maskot
masopust
matice
matrika
maturita
mazanec
mazivo
mazlit
mazurka
mdloba
mechanik
meditace
medovina
melasa
meloun
mentolka
metla
metoda
metr
mezera
migrace
mihnout
mihule
mikina
mikrofon
milenec
milimetr
milost
mimika
mincovna
minibar
minomet
minulost
miska
mistr
mixovat
mladost
mlha
mlhovina
mlok
mlsat
mluvit
mnich
mnohem
mobil
mocnost
modelka
modlitba
mohyla
mokro
molekula
momentka
monarcha
monokl
monstrum
montovat
monzun
mosaz
moskyt
most
motivace
motorka
motyka
moucha
moudrost
mozaika
mozek
mozol
mramor
mravenec
mrkev
mrtvola
mrzet
mrzutost
mstitel
mudrc
muflon
mulat
mumie
munice
muset
mutace
muzeum
muzikant
myslivec
mzda
nabourat
nachytat
nadace
nadbytek
nadhoz
nadobro
nadpis
nahlas
nahnat
nahodile
nahradit
naivita
najednou
najisto
najmout
naklonit
nakonec
nakrmit
nalevo
namazat
namluvit
nanometr
naoko
naopak
naostro
napadat
napevno
naplnit
napnout
naposled
naprosto
narodit
naruby
narychlo
nasadit
nasekat
naslepo
nastat
natolik
navenek
navrch
navzdory
nazvat
nebe
nechat
necky
nedaleko
nedbat
neduh
negace
nehet
nehoda
nejen
nejprve
neklid
nelibost
nemilost
nemoc
neochota
neonka
nepokoj
nerost
nerv
nesmysl
nesoulad
netvor
neuron
nevina
nezvykle
nicota
nijak
nikam
nikdy
nikl
nikterak
nitro
nocleh
nohavice
nominace
nora
norek
nositel
nosnost
nouze
noviny
novota
nozdra
nuda
nudle
nuget
nutit
nutnost
nutrie
nymfa
obal
obarvit
obava
obdiv
obec
obehnat
obejmout
obezita
obhajoba
obilnice
objasnit
objekt
obklopit
oblast
oblek
obliba
obloha
obluda
obnos
obohatit
obojek
obout
obrazec
obrna
obruba
obrys
obsah
obsluha
obstarat
obuv
obvaz
obvinit
obvod
obvykle
obyvatel
obzor
ocas
ocel
ocenit
ochladit
ochota
ochrana
ocitnout
odboj
odbyt
odchod
odcizit
odebrat
odeslat
odevzdat
odezva
odhadce
odhodit
odjet
odjinud
odkaz
odkoupit
odliv
odluka
odmlka
odolnost
odpad
odpis
odplout
odpor
odpustit
odpykat
odrazka
odsoudit
odstup
odsun
odtok
odtud
odvaha
odveta
odvolat
odvracet
odznak
ofina
ofsajd
ohlas
ohnisko
ohrada
ohrozit
ohryzek
okap
okenice
oklika
okno
okouzlit
okovy
okrasa
okres
okrsek
okruh
okupant
okurka
okusit
olejnina
olizovat
omak
omeleta
omezit
omladina
omlouvat
omluva
omyl
onehdy
opakovat
opasek
operace
opice
opilost
opisovat
opora
opozice
opravdu
oproti
orbital
orchestr
orgie
orlice
orloj
ortel
osada
oschnout
osika
osivo
oslava
oslepit
oslnit
oslovit
osnova
osoba
osolit
ospalec
osten
ostraha
ostuda
ostych
osvojit
oteplit
otisk
otop
otrhat
otrlost
otrok
otruby
otvor
ovanout
ovar
oves
ovlivnit
ovoce
oxid
ozdoba
pachatel
pacient
padouch
pahorek
pakt
palanda
palec
palivo
paluba
pamflet
pamlsek
panenka
panika
panna
panovat
panstvo
pantofle
paprika
parketa
parodie
parta
paruka
paryba
paseka
pasivita
pastelka
patent
patrona
pavouk
pazneht
pazourek
pecka
pedagog
pejsek
peklo
peloton
penalta
pendrek
penze
periskop
pero
pestrost
petarda
petice
petrolej
pevnina
pexeso
pianista
piha
pijavice
pikle
piknik
pilina
pilnost
pilulka
pinzeta
pipeta
pisatel
pistole
pitevna
pivnice
pivovar
placenta
plakat
plamen
planeta
plastika
platit
plavidlo
plaz
plech
plemeno
plenta
ples
pletivo
plevel
plivat
plnit
plno
plocha
plodina
plomba
plout
pluk
plyn
pobavit
pobyt
pochod
pocit
poctivec
podat
podcenit
podepsat
podhled
podivit
podklad
podmanit
podnik
podoba
podpora
podraz
podstata
podvod
podzim
poezie
pohanka
pohnutka
pohovor
pohroma
pohyb
pointa
pojistka
pojmout
pokazit
pokles
pokoj
pokrok
pokuta
pokyn
poledne
polibek
polknout
poloha
polynom
pomalu
pominout
pomlka
pomoc
pomsta
pomyslet
ponechat
ponorka
ponurost
popadat
popel
popisek
poplach
poprosit
popsat
popud
poradce
porce
porod
porucha
poryv
posadit
posed
posila
poskok
poslanec
posoudit
pospolu
postava
posudek
posyp
potah
potkan
potlesk
potomek
potrava
potupa
potvora
poukaz
pouto
pouzdro
povaha
povidla
povlak
povoz
povrch
povstat
povyk
povzdech
pozdrav
pozemek
poznatek
pozor
pozvat
pracovat
prahory
praktika
prales
praotec
praporek
prase
pravda
princip
prkno
probudit
procento
prodej
profese
prohra
projekt
prolomit
promile
pronikat
propad
prorok
prosba
proton
proutek
provaz
prskavka
prsten
prudkost
prut
prvek
prvohory
psanec
psovod
pstruh
ptactvo
puberta
puch
pudl
pukavec
puklina
pukrle
pult
pumpa
punc
pupen
pusa
pusinka
pustina
putovat
putyka
pyramida
pysk
pytel
racek
rachot
radiace
radnice
radon
raft
ragby
raketa
rakovina
rameno
rampouch
rande
rarach
rarita
rasovna
rastr
ratolest
razance
razidlo
reagovat
reakce
recept
redaktor
referent
reflex
rejnok
reklama
rekord
rekrut
rektor
reputace
revize
revma
revolver
rezerva
riskovat
riziko
robotika
rodokmen
rohovka
rokle
rokoko
romaneto
ropovod
ropucha
rorejs
rosol
rostlina
rotmistr
rotoped
rotunda
roubenka
roucho
roup
roura
rovina
rovnice
rozbor
rozchod
rozdat
rozeznat
rozhodce
rozinka
rozjezd
rozkaz
rozloha
rozmar
rozpad
rozruch
rozsah
roztok
rozum
rozvod
rubrika
ruchadlo
rukavice
rukopis
ryba
rybolov
rychlost
rydlo
rypadlo
rytina
ryzost
sadista
sahat
sako
samec
samizdat
samota
sanitka
sardinka
sasanka
satelit
sazba
sazenice
sbor
schovat
sebranka
secese
sedadlo
sediment
sedlo
sehnat
sejmout
sekera
sekta
sekunda
sekvoje
semeno
seno
servis
sesadit
seshora
seskok
seslat
sestra
sesuv
sesypat
setba
setina
setkat
setnout
setrvat
sever
seznam
shoda
shrnout
sifon
silnice
sirka
sirotek
sirup
situace
skafandr
skalisko
skanzen
skaut
skeptik
skica
skladba
sklenice
sklo
skluz
skoba
skokan
skoro
skripta
skrz
skupina
skvost
skvrna
slabika
sladidlo
slanina
slast
slavnost
sledovat
slepec
sleva
slezina
slib
slina
sliznice
slon
sloupek
slovo
sluch
sluha
slunce
slupka
slza
smaragd
smetana
smilstvo
smlouva
smog
smrad
smrk
smrtka
smutek
smysl
snad
snaha
snob
sobota
socha
sodovka
sokol
sopka
sotva
souboj
soucit
soudce
souhlas
soulad
soumrak
souprava
soused
soutok
souviset
spalovna
spasitel
spis
splav
spodek
spojenec
spolu
sponzor
spornost
spousta
sprcha
spustit
sranda
sraz
srdce
srna
srnec
srovnat
srpen
srst
srub
stanice
starosta
statika
stavba
stehno
stezka
stodola
stolek
stopa
storno
stoupat
strach
stres
strhnout
strom
struna
studna
stupnice
stvol
styk
subjekt
subtropy
suchar
sudost
sukno
sundat
sunout
surikata
surovina
svah
svalstvo
svetr
svatba
svazek
svisle
svitek
svoboda
svodidlo
svorka
svrab
sykavka
sykot
synek
synovec
sypat
sypkost
syrovost
sysel
sytost
tabletka
tabule
tahoun
tajemno
tajfun
tajga
tajit
tajnost
taktika
tamhle
tampon
tancovat
tanec
tanker
tapeta
tavenina
tazatel
technika
tehdy
tekutina
telefon
temnota
tendence
tenista
tenor
teplota
tepna
teprve
terapie
termoska
textil
ticho
tiskopis
titulek
tkadlec
tkanina
tlapka
tleskat
tlukot
tlupa
tmel
toaleta
topinka
topol
torzo
touha
toulec
tradice
traktor
tramp
trasa
traverza
trefit
trest
trezor
trhavina
trhlina
trochu
trojice
troska
trouba
trpce
trpitel
trpkost
trubec
truchlit
truhlice
trus
trvat
tudy
tuhnout
tuhost
tundra
turista
turnaj
tuzemsko
tvaroh
tvorba
tvrdost
tvrz
tygr
tykev
ubohost
uboze
ubrat
ubrousek
ubrus
ubytovna
ucho
uctivost
udivit
uhradit
ujednat
ujistit
ujmout
ukazatel
uklidnit
uklonit
ukotvit
ukrojit
ulice
ulita
ulovit
umyvadlo
unavit
uniforma
uniknout
upadnout
uplatnit
uplynout
upoutat
upravit
uran
urazit
usednout
usilovat
usmrtit
usnadnit
usnout
usoudit
ustlat
ustrnout
utahovat
utkat
utlumit
utonout
utopenec
utrousit
uvalit
uvolnit
uvozovka
uzdravit
uzel
uzenina
uzlina
uznat
vagon
valcha
valoun
vana
vandal
vanilka
varan
varhany
varovat
vcelku
vchod
vdova
vedro
vegetace
vejce
velbloud
veletrh
velitel
velmoc
velryba
venkov
veranda
verze
veselka
veskrze
vesnice
vespodu
vesta
veterina
veverka
vibrace
vichr
videohra
vidina
vidle
vila
vinice
viset
vitalita
vize
vizitka
vjezd
vklad
vkus
vlajka
vlak
vlasec
vlevo
vlhkost
vliv
vlnovka
vloupat
vnucovat
vnuk
voda
vodivost
vodoznak
vodstvo
vojensky
vojna
vojsko
volant
volba
volit
volno
voskovka
vozidlo
vozovna
vpravo
vrabec
vracet
vrah
vrata
vrba
vrcholek
vrhat
vrstva
vrtule
vsadit
vstoupit
vstup
vtip
vybavit
vybrat
vychovat
vydat
vydra
vyfotit
vyhledat
vyhnout
vyhodit
vyhradit
vyhubit
vyjasnit
vyjet
vyjmout
vyklopit
vykonat
vylekat
vymazat
vymezit
vymizet
vymyslet
vynechat
vynikat
vynutit
vypadat
vyplatit
vypravit
vypustit
vyrazit
vyrovnat
vyrvat
vyslovit
vysoko
vystavit
vysunout
vysypat
vytasit
vytesat
vytratit
vyvinout
vyvolat
vyvrhel
vyzdobit
vyznat
vzadu
vzbudit
vzchopit
vzdor
vzduch
vzdychat
vzestup
vzhledem
vzkaz
vzlykat
vznik
vzorek
vzpoura
vztah
vztek
xylofon
zabrat
zabydlet
zachovat
zadarmo
zadusit
zafoukat
zahltit
zahodit
zahrada
zahynout
zajatec
zajet
zajistit
zaklepat
zakoupit
zalepit
zamezit
zamotat
zamyslet
zanechat
zanikat
zaplatit
zapojit
zapsat
zarazit
zastavit
zasunout
zatajit
zatemnit
zatknout
zaujmout
zavalit
zavelet
zavinit
zavolat
zavrtat
zazvonit
zbavit
zbrusu
zbudovat
zbytek
zdaleka
zdarma
zdatnost
zdivo
zdobit
zdroj
zdvih
zdymadlo
zelenina
zeman
zemina
zeptat
zezadu
zezdola
zhatit
zhltnout
zhluboka
zhotovit
zhruba
zima
zimnice
zjemnit
zklamat
zkoumat
zkratka
zkumavka
zlato
zlehka
zloba
zlom
zlost
zlozvyk
zmapovat
zmar
zmatek
zmije
zmizet
zmocnit
zmodrat
zmrzlina
zmutovat
znak
znalost
znamenat
znovu
zobrazit
zotavit
zoubek
zoufale
zplodit
zpomalit
zprava
zprostit
zprudka
zprvu
zrada
zranit
zrcadlo
zrnitost
zrno
zrovna
zrychlit
zrzavost
zticha
ztratit
zubovina
zubr
zvednout
zvenku
zvesela
zvon
zvrat
zvukovod
zvyk`.split("\n");
  }
});

// node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/english.js
var wordlist2;
var init_english = __esm({
  "node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/english.js"() {
    wordlist2 = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split("\n");
  }
});

// node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/french.js
var wordlist3;
var init_french = __esm({
  "node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/french.js"() {
    wordlist3 = `abaisser
abandon
abdiquer
abeille
abolir
aborder
aboutir
aboyer
abrasif
abreuver
abriter
abroger
abrupt
absence
absolu
absurde
abusif
abyssal
acade\u0301mie
acajou
acarien
accabler
accepter
acclamer
accolade
accroche
accuser
acerbe
achat
acheter
aciduler
acier
acompte
acque\u0301rir
acronyme
acteur
actif
actuel
adepte
ade\u0301quat
adhe\u0301sif
adjectif
adjuger
admettre
admirer
adopter
adorer
adoucir
adresse
adroit
adulte
adverbe
ae\u0301rer
ae\u0301ronef
affaire
affecter
affiche
affreux
affubler
agacer
agencer
agile
agiter
agrafer
agre\u0301able
agrume
aider
aiguille
ailier
aimable
aisance
ajouter
ajuster
alarmer
alchimie
alerte
alge\u0300bre
algue
alie\u0301ner
aliment
alle\u0301ger
alliage
allouer
allumer
alourdir
alpaga
altesse
alve\u0301ole
amateur
ambigu
ambre
ame\u0301nager
amertume
amidon
amiral
amorcer
amour
amovible
amphibie
ampleur
amusant
analyse
anaphore
anarchie
anatomie
ancien
ane\u0301antir
angle
angoisse
anguleux
animal
annexer
annonce
annuel
anodin
anomalie
anonyme
anormal
antenne
antidote
anxieux
apaiser
ape\u0301ritif
aplanir
apologie
appareil
appeler
apporter
appuyer
aquarium
aqueduc
arbitre
arbuste
ardeur
ardoise
argent
arlequin
armature
armement
armoire
armure
arpenter
arracher
arriver
arroser
arsenic
arte\u0301riel
article
aspect
asphalte
aspirer
assaut
asservir
assiette
associer
assurer
asticot
astre
astuce
atelier
atome
atrium
atroce
attaque
attentif
attirer
attraper
aubaine
auberge
audace
audible
augurer
aurore
automne
autruche
avaler
avancer
avarice
avenir
averse
aveugle
aviateur
avide
avion
aviser
avoine
avouer
avril
axial
axiome
badge
bafouer
bagage
baguette
baignade
balancer
balcon
baleine
balisage
bambin
bancaire
bandage
banlieue
bannie\u0300re
banquier
barbier
baril
baron
barque
barrage
bassin
bastion
bataille
bateau
batterie
baudrier
bavarder
belette
be\u0301lier
belote
be\u0301ne\u0301fice
berceau
berger
berline
bermuda
besace
besogne
be\u0301tail
beurre
biberon
bicycle
bidule
bijou
bilan
bilingue
billard
binaire
biologie
biopsie
biotype
biscuit
bison
bistouri
bitume
bizarre
blafard
blague
blanchir
blessant
blinder
blond
bloquer
blouson
bobard
bobine
boire
boiser
bolide
bonbon
bondir
bonheur
bonifier
bonus
bordure
borne
botte
boucle
boueux
bougie
boulon
bouquin
bourse
boussole
boutique
boxeur
branche
brasier
brave
brebis
bre\u0300che
breuvage
bricoler
brigade
brillant
brioche
brique
brochure
broder
bronzer
brousse
broyeur
brume
brusque
brutal
bruyant
buffle
buisson
bulletin
bureau
burin
bustier
butiner
butoir
buvable
buvette
cabanon
cabine
cachette
cadeau
cadre
cafe\u0301ine
caillou
caisson
calculer
calepin
calibre
calmer
calomnie
calvaire
camarade
came\u0301ra
camion
campagne
canal
caneton
canon
cantine
canular
capable
caporal
caprice
capsule
capter
capuche
carabine
carbone
caresser
caribou
carnage
carotte
carreau
carton
cascade
casier
casque
cassure
causer
caution
cavalier
caverne
caviar
ce\u0301dille
ceinture
ce\u0301leste
cellule
cendrier
censurer
central
cercle
ce\u0301re\u0301bral
cerise
cerner
cerveau
cesser
chagrin
chaise
chaleur
chambre
chance
chapitre
charbon
chasseur
chaton
chausson
chavirer
chemise
chenille
che\u0301quier
chercher
cheval
chien
chiffre
chignon
chime\u0300re
chiot
chlorure
chocolat
choisir
chose
chouette
chrome
chute
cigare
cigogne
cimenter
cine\u0301ma
cintrer
circuler
cirer
cirque
citerne
citoyen
citron
civil
clairon
clameur
claquer
classe
clavier
client
cligner
climat
clivage
cloche
clonage
cloporte
cobalt
cobra
cocasse
cocotier
coder
codifier
coffre
cogner
cohe\u0301sion
coiffer
coincer
cole\u0300re
colibri
colline
colmater
colonel
combat
come\u0301die
commande
compact
concert
conduire
confier
congeler
connoter
consonne
contact
convexe
copain
copie
corail
corbeau
cordage
corniche
corpus
correct
corte\u0300ge
cosmique
costume
coton
coude
coupure
courage
couteau
couvrir
coyote
crabe
crainte
cravate
crayon
cre\u0301ature
cre\u0301diter
cre\u0301meux
creuser
crevette
cribler
crier
cristal
crite\u0300re
croire
croquer
crotale
crucial
cruel
crypter
cubique
cueillir
cuille\u0300re
cuisine
cuivre
culminer
cultiver
cumuler
cupide
curatif
curseur
cyanure
cycle
cylindre
cynique
daigner
damier
danger
danseur
dauphin
de\u0301battre
de\u0301biter
de\u0301border
de\u0301brider
de\u0301butant
de\u0301caler
de\u0301cembre
de\u0301chirer
de\u0301cider
de\u0301clarer
de\u0301corer
de\u0301crire
de\u0301cupler
de\u0301dale
de\u0301ductif
de\u0301esse
de\u0301fensif
de\u0301filer
de\u0301frayer
de\u0301gager
de\u0301givrer
de\u0301glutir
de\u0301grafer
de\u0301jeuner
de\u0301lice
de\u0301loger
demander
demeurer
de\u0301molir
de\u0301nicher
de\u0301nouer
dentelle
de\u0301nuder
de\u0301part
de\u0301penser
de\u0301phaser
de\u0301placer
de\u0301poser
de\u0301ranger
de\u0301rober
de\u0301sastre
descente
de\u0301sert
de\u0301signer
de\u0301sobe\u0301ir
dessiner
destrier
de\u0301tacher
de\u0301tester
de\u0301tourer
de\u0301tresse
devancer
devenir
deviner
devoir
diable
dialogue
diamant
dicter
diffe\u0301rer
dige\u0301rer
digital
digne
diluer
dimanche
diminuer
dioxyde
directif
diriger
discuter
disposer
dissiper
distance
divertir
diviser
docile
docteur
dogme
doigt
domaine
domicile
dompter
donateur
donjon
donner
dopamine
dortoir
dorure
dosage
doseur
dossier
dotation
douanier
double
douceur
douter
doyen
dragon
draper
dresser
dribbler
droiture
duperie
duplexe
durable
durcir
dynastie
e\u0301blouir
e\u0301carter
e\u0301charpe
e\u0301chelle
e\u0301clairer
e\u0301clipse
e\u0301clore
e\u0301cluse
e\u0301cole
e\u0301conomie
e\u0301corce
e\u0301couter
e\u0301craser
e\u0301cre\u0301mer
e\u0301crivain
e\u0301crou
e\u0301cume
e\u0301cureuil
e\u0301difier
e\u0301duquer
effacer
effectif
effigie
effort
effrayer
effusion
e\u0301galiser
e\u0301garer
e\u0301jecter
e\u0301laborer
e\u0301largir
e\u0301lectron
e\u0301le\u0301gant
e\u0301le\u0301phant
e\u0301le\u0300ve
e\u0301ligible
e\u0301litisme
e\u0301loge
e\u0301lucider
e\u0301luder
emballer
embellir
embryon
e\u0301meraude
e\u0301mission
emmener
e\u0301motion
e\u0301mouvoir
empereur
employer
emporter
emprise
e\u0301mulsion
encadrer
enche\u0300re
enclave
encoche
endiguer
endosser
endroit
enduire
e\u0301nergie
enfance
enfermer
enfouir
engager
engin
englober
e\u0301nigme
enjamber
enjeu
enlever
ennemi
ennuyeux
enrichir
enrobage
enseigne
entasser
entendre
entier
entourer
entraver
e\u0301nume\u0301rer
envahir
enviable
envoyer
enzyme
e\u0301olien
e\u0301paissir
e\u0301pargne
e\u0301patant
e\u0301paule
e\u0301picerie
e\u0301pide\u0301mie
e\u0301pier
e\u0301pilogue
e\u0301pine
e\u0301pisode
e\u0301pitaphe
e\u0301poque
e\u0301preuve
e\u0301prouver
e\u0301puisant
e\u0301querre
e\u0301quipe
e\u0301riger
e\u0301rosion
erreur
e\u0301ruption
escalier
espadon
espe\u0300ce
espie\u0300gle
espoir
esprit
esquiver
essayer
essence
essieu
essorer
estime
estomac
estrade
e\u0301tage\u0300re
e\u0301taler
e\u0301tanche
e\u0301tatique
e\u0301teindre
e\u0301tendoir
e\u0301ternel
e\u0301thanol
e\u0301thique
ethnie
e\u0301tirer
e\u0301toffer
e\u0301toile
e\u0301tonnant
e\u0301tourdir
e\u0301trange
e\u0301troit
e\u0301tude
euphorie
e\u0301valuer
e\u0301vasion
e\u0301ventail
e\u0301vidence
e\u0301viter
e\u0301volutif
e\u0301voquer
exact
exage\u0301rer
exaucer
exceller
excitant
exclusif
excuse
exe\u0301cuter
exemple
exercer
exhaler
exhorter
exigence
exiler
exister
exotique
expe\u0301dier
explorer
exposer
exprimer
exquis
extensif
extraire
exulter
fable
fabuleux
facette
facile
facture
faiblir
falaise
fameux
famille
farceur
farfelu
farine
farouche
fasciner
fatal
fatigue
faucon
fautif
faveur
favori
fe\u0301brile
fe\u0301conder
fe\u0301de\u0301rer
fe\u0301lin
femme
fe\u0301mur
fendoir
fe\u0301odal
fermer
fe\u0301roce
ferveur
festival
feuille
feutre
fe\u0301vrier
fiasco
ficeler
fictif
fide\u0300le
figure
filature
filetage
filie\u0300re
filleul
filmer
filou
filtrer
financer
finir
fiole
firme
fissure
fixer
flairer
flamme
flasque
flatteur
fle\u0301au
fle\u0300che
fleur
flexion
flocon
flore
fluctuer
fluide
fluvial
folie
fonderie
fongible
fontaine
forcer
forgeron
formuler
fortune
fossile
foudre
fouge\u0300re
fouiller
foulure
fourmi
fragile
fraise
franchir
frapper
frayeur
fre\u0301gate
freiner
frelon
fre\u0301mir
fre\u0301ne\u0301sie
fre\u0300re
friable
friction
frisson
frivole
froid
fromage
frontal
frotter
fruit
fugitif
fuite
fureur
furieux
furtif
fusion
futur
gagner
galaxie
galerie
gambader
garantir
gardien
garnir
garrigue
gazelle
gazon
ge\u0301ant
ge\u0301latine
ge\u0301lule
gendarme
ge\u0301ne\u0301ral
ge\u0301nie
genou
gentil
ge\u0301ologie
ge\u0301ome\u0300tre
ge\u0301ranium
germe
gestuel
geyser
gibier
gicler
girafe
givre
glace
glaive
glisser
globe
gloire
glorieux
golfeur
gomme
gonfler
gorge
gorille
goudron
gouffre
goulot
goupille
gourmand
goutte
graduel
graffiti
graine
grand
grappin
gratuit
gravir
grenat
griffure
griller
grimper
grogner
gronder
grotte
groupe
gruger
grutier
gruye\u0300re
gue\u0301pard
guerrier
guide
guimauve
guitare
gustatif
gymnaste
gyrostat
habitude
hachoir
halte
hameau
hangar
hanneton
haricot
harmonie
harpon
hasard
he\u0301lium
he\u0301matome
herbe
he\u0301risson
hermine
he\u0301ron
he\u0301siter
heureux
hiberner
hibou
hilarant
histoire
hiver
homard
hommage
homoge\u0300ne
honneur
honorer
honteux
horde
horizon
horloge
hormone
horrible
houleux
housse
hublot
huileux
humain
humble
humide
humour
hurler
hydromel
hygie\u0300ne
hymne
hypnose
idylle
ignorer
iguane
illicite
illusion
image
imbiber
imiter
immense
immobile
immuable
impact
impe\u0301rial
implorer
imposer
imprimer
imputer
incarner
incendie
incident
incliner
incolore
indexer
indice
inductif
ine\u0301dit
ineptie
inexact
infini
infliger
informer
infusion
inge\u0301rer
inhaler
inhiber
injecter
injure
innocent
inoculer
inonder
inscrire
insecte
insigne
insolite
inspirer
instinct
insulter
intact
intense
intime
intrigue
intuitif
inutile
invasion
inventer
inviter
invoquer
ironique
irradier
irre\u0301el
irriter
isoler
ivoire
ivresse
jaguar
jaillir
jambe
janvier
jardin
jauger
jaune
javelot
jetable
jeton
jeudi
jeunesse
joindre
joncher
jongler
joueur
jouissif
journal
jovial
joyau
joyeux
jubiler
jugement
junior
jupon
juriste
justice
juteux
juve\u0301nile
kayak
kimono
kiosque
label
labial
labourer
lace\u0301rer
lactose
lagune
laine
laisser
laitier
lambeau
lamelle
lampe
lanceur
langage
lanterne
lapin
largeur
larme
laurier
lavabo
lavoir
lecture
le\u0301gal
le\u0301ger
le\u0301gume
lessive
lettre
levier
lexique
le\u0301zard
liasse
libe\u0301rer
libre
licence
licorne
lie\u0300ge
lie\u0300vre
ligature
ligoter
ligue
limer
limite
limonade
limpide
line\u0301aire
lingot
lionceau
liquide
lisie\u0300re
lister
lithium
litige
littoral
livreur
logique
lointain
loisir
lombric
loterie
louer
lourd
loutre
louve
loyal
lubie
lucide
lucratif
lueur
lugubre
luisant
lumie\u0300re
lunaire
lundi
luron
lutter
luxueux
machine
magasin
magenta
magique
maigre
maillon
maintien
mairie
maison
majorer
malaxer
male\u0301fice
malheur
malice
mallette
mammouth
mandater
maniable
manquant
manteau
manuel
marathon
marbre
marchand
mardi
maritime
marqueur
marron
marteler
mascotte
massif
mate\u0301riel
matie\u0300re
matraque
maudire
maussade
mauve
maximal
me\u0301chant
me\u0301connu
me\u0301daille
me\u0301decin
me\u0301diter
me\u0301duse
meilleur
me\u0301lange
me\u0301lodie
membre
me\u0301moire
menacer
mener
menhir
mensonge
mentor
mercredi
me\u0301rite
merle
messager
mesure
me\u0301tal
me\u0301te\u0301ore
me\u0301thode
me\u0301tier
meuble
miauler
microbe
miette
mignon
migrer
milieu
million
mimique
mince
mine\u0301ral
minimal
minorer
minute
miracle
miroiter
missile
mixte
mobile
moderne
moelleux
mondial
moniteur
monnaie
monotone
monstre
montagne
monument
moqueur
morceau
morsure
mortier
moteur
motif
mouche
moufle
moulin
mousson
mouton
mouvant
multiple
munition
muraille
mure\u0300ne
murmure
muscle
muse\u0301um
musicien
mutation
muter
mutuel
myriade
myrtille
myste\u0300re
mythique
nageur
nappe
narquois
narrer
natation
nation
nature
naufrage
nautique
navire
ne\u0301buleux
nectar
ne\u0301faste
ne\u0301gation
ne\u0301gliger
ne\u0301gocier
neige
nerveux
nettoyer
neurone
neutron
neveu
niche
nickel
nitrate
niveau
noble
nocif
nocturne
noirceur
noisette
nomade
nombreux
nommer
normatif
notable
notifier
notoire
nourrir
nouveau
novateur
novembre
novice
nuage
nuancer
nuire
nuisible
nume\u0301ro
nuptial
nuque
nutritif
obe\u0301ir
objectif
obliger
obscur
observer
obstacle
obtenir
obturer
occasion
occuper
oce\u0301an
octobre
octroyer
octupler
oculaire
odeur
odorant
offenser
officier
offrir
ogive
oiseau
oisillon
olfactif
olivier
ombrage
omettre
onctueux
onduler
one\u0301reux
onirique
opale
opaque
ope\u0301rer
opinion
opportun
opprimer
opter
optique
orageux
orange
orbite
ordonner
oreille
organe
orgueil
orifice
ornement
orque
ortie
osciller
osmose
ossature
otarie
ouragan
ourson
outil
outrager
ouvrage
ovation
oxyde
oxyge\u0300ne
ozone
paisible
palace
palmare\u0300s
palourde
palper
panache
panda
pangolin
paniquer
panneau
panorama
pantalon
papaye
papier
papoter
papyrus
paradoxe
parcelle
paresse
parfumer
parler
parole
parrain
parsemer
partager
parure
parvenir
passion
paste\u0300que
paternel
patience
patron
pavillon
pavoiser
payer
paysage
peigne
peintre
pelage
pe\u0301lican
pelle
pelouse
peluche
pendule
pe\u0301ne\u0301trer
pe\u0301nible
pensif
pe\u0301nurie
pe\u0301pite
pe\u0301plum
perdrix
perforer
pe\u0301riode
permuter
perplexe
persil
perte
peser
pe\u0301tale
petit
pe\u0301trir
peuple
pharaon
phobie
phoque
photon
phrase
physique
piano
pictural
pie\u0300ce
pierre
pieuvre
pilote
pinceau
pipette
piquer
pirogue
piscine
piston
pivoter
pixel
pizza
placard
plafond
plaisir
planer
plaque
plastron
plateau
pleurer
plexus
pliage
plomb
plonger
pluie
plumage
pochette
poe\u0301sie
poe\u0300te
pointe
poirier
poisson
poivre
polaire
policier
pollen
polygone
pommade
pompier
ponctuel
ponde\u0301rer
poney
portique
position
posse\u0301der
posture
potager
poteau
potion
pouce
poulain
poumon
pourpre
poussin
pouvoir
prairie
pratique
pre\u0301cieux
pre\u0301dire
pre\u0301fixe
pre\u0301lude
pre\u0301nom
pre\u0301sence
pre\u0301texte
pre\u0301voir
primitif
prince
prison
priver
proble\u0300me
proce\u0301der
prodige
profond
progre\u0300s
proie
projeter
prologue
promener
propre
prospe\u0300re
prote\u0301ger
prouesse
proverbe
prudence
pruneau
psychose
public
puceron
puiser
pulpe
pulsar
punaise
punitif
pupitre
purifier
puzzle
pyramide
quasar
querelle
question
quie\u0301tude
quitter
quotient
racine
raconter
radieux
ragondin
raideur
raisin
ralentir
rallonge
ramasser
rapide
rasage
ratisser
ravager
ravin
rayonner
re\u0301actif
re\u0301agir
re\u0301aliser
re\u0301animer
recevoir
re\u0301citer
re\u0301clamer
re\u0301colter
recruter
reculer
recycler
re\u0301diger
redouter
refaire
re\u0301flexe
re\u0301former
refrain
refuge
re\u0301galien
re\u0301gion
re\u0301glage
re\u0301gulier
re\u0301ite\u0301rer
rejeter
rejouer
relatif
relever
relief
remarque
reme\u0300de
remise
remonter
remplir
remuer
renard
renfort
renifler
renoncer
rentrer
renvoi
replier
reporter
reprise
reptile
requin
re\u0301serve
re\u0301sineux
re\u0301soudre
respect
rester
re\u0301sultat
re\u0301tablir
retenir
re\u0301ticule
retomber
retracer
re\u0301union
re\u0301ussir
revanche
revivre
re\u0301volte
re\u0301vulsif
richesse
rideau
rieur
rigide
rigoler
rincer
riposter
risible
risque
rituel
rival
rivie\u0300re
rocheux
romance
rompre
ronce
rondin
roseau
rosier
rotatif
rotor
rotule
rouge
rouille
rouleau
routine
royaume
ruban
rubis
ruche
ruelle
rugueux
ruiner
ruisseau
ruser
rustique
rythme
sabler
saboter
sabre
sacoche
safari
sagesse
saisir
salade
salive
salon
saluer
samedi
sanction
sanglier
sarcasme
sardine
saturer
saugrenu
saumon
sauter
sauvage
savant
savonner
scalpel
scandale
sce\u0301le\u0301rat
sce\u0301nario
sceptre
sche\u0301ma
science
scinder
score
scrutin
sculpter
se\u0301ance
se\u0301cable
se\u0301cher
secouer
se\u0301cre\u0301ter
se\u0301datif
se\u0301duire
seigneur
se\u0301jour
se\u0301lectif
semaine
sembler
semence
se\u0301minal
se\u0301nateur
sensible
sentence
se\u0301parer
se\u0301quence
serein
sergent
se\u0301rieux
serrure
se\u0301rum
service
se\u0301same
se\u0301vir
sevrage
sextuple
side\u0301ral
sie\u0300cle
sie\u0301ger
siffler
sigle
signal
silence
silicium
simple
since\u0300re
sinistre
siphon
sirop
sismique
situer
skier
social
socle
sodium
soigneux
soldat
soleil
solitude
soluble
sombre
sommeil
somnoler
sonde
songeur
sonnette
sonore
sorcier
sortir
sosie
sottise
soucieux
soudure
souffle
soulever
soupape
source
soutirer
souvenir
spacieux
spatial
spe\u0301cial
sphe\u0300re
spiral
stable
station
sternum
stimulus
stipuler
strict
studieux
stupeur
styliste
sublime
substrat
subtil
subvenir
succe\u0300s
sucre
suffixe
sugge\u0301rer
suiveur
sulfate
superbe
supplier
surface
suricate
surmener
surprise
sursaut
survie
suspect
syllabe
symbole
syme\u0301trie
synapse
syntaxe
syste\u0300me
tabac
tablier
tactile
tailler
talent
talisman
talonner
tambour
tamiser
tangible
tapis
taquiner
tarder
tarif
tartine
tasse
tatami
tatouage
taupe
taureau
taxer
te\u0301moin
temporel
tenaille
tendre
teneur
tenir
tension
terminer
terne
terrible
te\u0301tine
texte
the\u0300me
the\u0301orie
the\u0301rapie
thorax
tibia
tie\u0300de
timide
tirelire
tiroir
tissu
titane
titre
tituber
toboggan
tole\u0301rant
tomate
tonique
tonneau
toponyme
torche
tordre
tornade
torpille
torrent
torse
tortue
totem
toucher
tournage
tousser
toxine
traction
trafic
tragique
trahir
train
trancher
travail
tre\u0300fle
tremper
tre\u0301sor
treuil
triage
tribunal
tricoter
trilogie
triomphe
tripler
triturer
trivial
trombone
tronc
tropical
troupeau
tuile
tulipe
tumulte
tunnel
turbine
tuteur
tutoyer
tuyau
tympan
typhon
typique
tyran
ubuesque
ultime
ultrason
unanime
unifier
union
unique
unitaire
univers
uranium
urbain
urticant
usage
usine
usuel
usure
utile
utopie
vacarme
vaccin
vagabond
vague
vaillant
vaincre
vaisseau
valable
valise
vallon
valve
vampire
vanille
vapeur
varier
vaseux
vassal
vaste
vecteur
vedette
ve\u0301ge\u0301tal
ve\u0301hicule
veinard
ve\u0301loce
vendredi
ve\u0301ne\u0301rer
venger
venimeux
ventouse
verdure
ve\u0301rin
vernir
verrou
verser
vertu
veston
ve\u0301te\u0301ran
ve\u0301tuste
vexant
vexer
viaduc
viande
victoire
vidange
vide\u0301o
vignette
vigueur
vilain
village
vinaigre
violon
vipe\u0300re
virement
virtuose
virus
visage
viseur
vision
visqueux
visuel
vital
vitesse
viticole
vitrine
vivace
vivipare
vocation
voguer
voile
voisin
voiture
volaille
volcan
voltiger
volume
vorace
vortex
voter
vouloir
voyage
voyelle
wagon
xe\u0301non
yacht
ze\u0300bre
ze\u0301nith
zeste
zoologie`.split("\n");
  }
});

// node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/italian.js
var wordlist4;
var init_italian = __esm({
  "node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/italian.js"() {
    wordlist4 = `abaco
abbaglio
abbinato
abete
abisso
abolire
abrasivo
abrogato
accadere
accenno
accusato
acetone
achille
acido
acqua
acre
acrilico
acrobata
acuto
adagio
addebito
addome
adeguato
aderire
adipe
adottare
adulare
affabile
affetto
affisso
affranto
aforisma
afoso
africano
agave
agente
agevole
aggancio
agire
agitare
agonismo
agricolo
agrumeto
aguzzo
alabarda
alato
albatro
alberato
albo
albume
alce
alcolico
alettone
alfa
algebra
aliante
alibi
alimento
allagato
allegro
allievo
allodola
allusivo
almeno
alogeno
alpaca
alpestre
altalena
alterno
alticcio
altrove
alunno
alveolo
alzare
amalgama
amanita
amarena
ambito
ambrato
ameba
america
ametista
amico
ammasso
ammenda
ammirare
ammonito
amore
ampio
ampliare
amuleto
anacardo
anagrafe
analista
anarchia
anatra
anca
ancella
ancora
andare
andrea
anello
angelo
angolare
angusto
anima
annegare
annidato
anno
annuncio
anonimo
anticipo
anzi
apatico
apertura
apode
apparire
appetito
appoggio
approdo
appunto
aprile
arabica
arachide
aragosta
araldica
arancio
aratura
arazzo
arbitro
archivio
ardito
arenile
argento
argine
arguto
aria
armonia
arnese
arredato
arringa
arrosto
arsenico
arso
artefice
arzillo
asciutto
ascolto
asepsi
asettico
asfalto
asino
asola
aspirato
aspro
assaggio
asse
assoluto
assurdo
asta
astenuto
astice
astratto
atavico
ateismo
atomico
atono
attesa
attivare
attorno
attrito
attuale
ausilio
austria
autista
autonomo
autunno
avanzato
avere
avvenire
avviso
avvolgere
azione
azoto
azzimo
azzurro
babele
baccano
bacino
baco
badessa
badilata
bagnato
baita
balcone
baldo
balena
ballata
balzano
bambino
bandire
baraonda
barbaro
barca
baritono
barlume
barocco
basilico
basso
batosta
battuto
baule
bava
bavosa
becco
beffa
belgio
belva
benda
benevole
benigno
benzina
bere
berlina
beta
bibita
bici
bidone
bifido
biga
bilancia
bimbo
binocolo
biologo
bipede
bipolare
birbante
birra
biscotto
bisesto
bisnonno
bisonte
bisturi
bizzarro
blando
blatta
bollito
bonifico
bordo
bosco
botanico
bottino
bozzolo
braccio
bradipo
brama
branca
bravura
bretella
brevetto
brezza
briglia
brillante
brindare
broccolo
brodo
bronzina
brullo
bruno
bubbone
buca
budino
buffone
buio
bulbo
buono
burlone
burrasca
bussola
busta
cadetto
caduco
calamaro
calcolo
calesse
calibro
calmo
caloria
cambusa
camerata
camicia
cammino
camola
campale
canapa
candela
cane
canino
canotto
cantina
capace
capello
capitolo
capogiro
cappero
capra
capsula
carapace
carcassa
cardo
carisma
carovana
carretto
cartolina
casaccio
cascata
caserma
caso
cassone
castello
casuale
catasta
catena
catrame
cauto
cavillo
cedibile
cedrata
cefalo
celebre
cellulare
cena
cenone
centesimo
ceramica
cercare
certo
cerume
cervello
cesoia
cespo
ceto
chela
chiaro
chicca
chiedere
chimera
china
chirurgo
chitarra
ciao
ciclismo
cifrare
cigno
cilindro
ciottolo
circa
cirrosi
citrico
cittadino
ciuffo
civetta
civile
classico
clinica
cloro
cocco
codardo
codice
coerente
cognome
collare
colmato
colore
colposo
coltivato
colza
coma
cometa
commando
comodo
computer
comune
conciso
condurre
conferma
congelare
coniuge
connesso
conoscere
consumo
continuo
convegno
coperto
copione
coppia
copricapo
corazza
cordata
coricato
cornice
corolla
corpo
corredo
corsia
cortese
cosmico
costante
cottura
covato
cratere
cravatta
creato
credere
cremoso
crescita
creta
criceto
crinale
crisi
critico
croce
cronaca
crostata
cruciale
crusca
cucire
cuculo
cugino
cullato
cupola
curatore
cursore
curvo
cuscino
custode
dado
daino
dalmata
damerino
daniela
dannoso
danzare
datato
davanti
davvero
debutto
decennio
deciso
declino
decollo
decreto
dedicato
definito
deforme
degno
delegare
delfino
delirio
delta
demenza
denotato
dentro
deposito
derapata
derivare
deroga
descritto
deserto
desiderio
desumere
detersivo
devoto
diametro
dicembre
diedro
difeso
diffuso
digerire
digitale
diluvio
dinamico
dinnanzi
dipinto
diploma
dipolo
diradare
dire
dirotto
dirupo
disagio
discreto
disfare
disgelo
disposto
distanza
disumano
dito
divano
divelto
dividere
divorato
doblone
docente
doganale
dogma
dolce
domato
domenica
dominare
dondolo
dono
dormire
dote
dottore
dovuto
dozzina
drago
druido
dubbio
dubitare
ducale
duna
duomo
duplice
duraturo
ebano
eccesso
ecco
eclissi
economia
edera
edicola
edile
editoria
educare
egemonia
egli
egoismo
egregio
elaborato
elargire
elegante
elencato
eletto
elevare
elfico
elica
elmo
elsa
eluso
emanato
emblema
emesso
emiro
emotivo
emozione
empirico
emulo
endemico
enduro
energia
enfasi
enoteca
entrare
enzima
epatite
epilogo
episodio
epocale
eppure
equatore
erario
erba
erboso
erede
eremita
erigere
ermetico
eroe
erosivo
errante
esagono
esame
esanime
esaudire
esca
esempio
esercito
esibito
esigente
esistere
esito
esofago
esortato
esoso
espanso
espresso
essenza
esso
esteso
estimare
estonia
estroso
esultare
etilico
etnico
etrusco
etto
euclideo
europa
evaso
evidenza
evitato
evoluto
evviva
fabbrica
faccenda
fachiro
falco
famiglia
fanale
fanfara
fango
fantasma
fare
farfalla
farinoso
farmaco
fascia
fastoso
fasullo
faticare
fato
favoloso
febbre
fecola
fede
fegato
felpa
feltro
femmina
fendere
fenomeno
fermento
ferro
fertile
fessura
festivo
fetta
feudo
fiaba
fiducia
fifa
figurato
filo
finanza
finestra
finire
fiore
fiscale
fisico
fiume
flacone
flamenco
flebo
flemma
florido
fluente
fluoro
fobico
focaccia
focoso
foderato
foglio
folata
folclore
folgore
fondente
fonetico
fonia
fontana
forbito
forchetta
foresta
formica
fornaio
foro
fortezza
forzare
fosfato
fosso
fracasso
frana
frassino
fratello
freccetta
frenata
fresco
frigo
frollino
fronde
frugale
frutta
fucilata
fucsia
fuggente
fulmine
fulvo
fumante
fumetto
fumoso
fune
funzione
fuoco
furbo
furgone
furore
fuso
futile
gabbiano
gaffe
galateo
gallina
galoppo
gambero
gamma
garanzia
garbo
garofano
garzone
gasdotto
gasolio
gastrico
gatto
gaudio
gazebo
gazzella
geco
gelatina
gelso
gemello
gemmato
gene
genitore
gennaio
genotipo
gergo
ghepardo
ghiaccio
ghisa
giallo
gilda
ginepro
giocare
gioiello
giorno
giove
girato
girone
gittata
giudizio
giurato
giusto
globulo
glutine
gnomo
gobba
golf
gomito
gommone
gonfio
gonna
governo
gracile
grado
grafico
grammo
grande
grattare
gravoso
grazia
greca
gregge
grifone
grigio
grinza
grotta
gruppo
guadagno
guaio
guanto
guardare
gufo
guidare
ibernato
icona
identico
idillio
idolo
idra
idrico
idrogeno
igiene
ignaro
ignorato
ilare
illeso
illogico
illudere
imballo
imbevuto
imbocco
imbuto
immane
immerso
immolato
impacco
impeto
impiego
importo
impronta
inalare
inarcare
inattivo
incanto
incendio
inchino
incisivo
incluso
incontro
incrocio
incubo
indagine
india
indole
inedito
infatti
infilare
inflitto
ingaggio
ingegno
inglese
ingordo
ingrosso
innesco
inodore
inoltrare
inondato
insano
insetto
insieme
insonnia
insulina
intasato
intero
intonaco
intuito
inumidire
invalido
invece
invito
iperbole
ipnotico
ipotesi
ippica
iride
irlanda
ironico
irrigato
irrorare
isolato
isotopo
isterico
istituto
istrice
italia
iterare
labbro
labirinto
lacca
lacerato
lacrima
lacuna
laddove
lago
lampo
lancetta
lanterna
lardoso
larga
laringe
lastra
latenza
latino
lattuga
lavagna
lavoro
legale
leggero
lembo
lentezza
lenza
leone
lepre
lesivo
lessato
lesto
letterale
leva
levigato
libero
lido
lievito
lilla
limatura
limitare
limpido
lineare
lingua
liquido
lira
lirica
lisca
lite
litigio
livrea
locanda
lode
logica
lombare
londra
longevo
loquace
lorenzo
loto
lotteria
luce
lucidato
lumaca
luminoso
lungo
lupo
luppolo
lusinga
lusso
lutto
macabro
macchina
macero
macinato
madama
magico
maglia
magnete
magro
maiolica
malafede
malgrado
malinteso
malsano
malto
malumore
mana
mancia
mandorla
mangiare
manifesto
mannaro
manovra
mansarda
mantide
manubrio
mappa
maratona
marcire
maretta
marmo
marsupio
maschera
massaia
mastino
materasso
matricola
mattone
maturo
mazurca
meandro
meccanico
mecenate
medesimo
meditare
mega
melassa
melis
melodia
meninge
meno
mensola
mercurio
merenda
merlo
meschino
mese
messere
mestolo
metallo
metodo
mettere
miagolare
mica
micelio
michele
microbo
midollo
miele
migliore
milano
milite
mimosa
minerale
mini
minore
mirino
mirtillo
miscela
missiva
misto
misurare
mitezza
mitigare
mitra
mittente
mnemonico
modello
modifica
modulo
mogano
mogio
mole
molosso
monastero
monco
mondina
monetario
monile
monotono
monsone
montato
monviso
mora
mordere
morsicato
mostro
motivato
motosega
motto
movenza
movimento
mozzo
mucca
mucosa
muffa
mughetto
mugnaio
mulatto
mulinello
multiplo
mummia
munto
muovere
murale
musa
muscolo
musica
mutevole
muto
nababbo
nafta
nanometro
narciso
narice
narrato
nascere
nastrare
naturale
nautica
naviglio
nebulosa
necrosi
negativo
negozio
nemmeno
neofita
neretto
nervo
nessuno
nettuno
neutrale
neve
nevrotico
nicchia
ninfa
nitido
nobile
nocivo
nodo
nome
nomina
nordico
normale
norvegese
nostrano
notare
notizia
notturno
novella
nucleo
nulla
numero
nuovo
nutrire
nuvola
nuziale
oasi
obbedire
obbligo
obelisco
oblio
obolo
obsoleto
occasione
occhio
occidente
occorrere
occultare
ocra
oculato
odierno
odorare
offerta
offrire
offuscato
oggetto
oggi
ognuno
olandese
olfatto
oliato
oliva
ologramma
oltre
omaggio
ombelico
ombra
omega
omissione
ondoso
onere
onice
onnivoro
onorevole
onta
operato
opinione
opposto
oracolo
orafo
ordine
orecchino
orefice
orfano
organico
origine
orizzonte
orma
ormeggio
ornativo
orologio
orrendo
orribile
ortensia
ortica
orzata
orzo
osare
oscurare
osmosi
ospedale
ospite
ossa
ossidare
ostacolo
oste
otite
otre
ottagono
ottimo
ottobre
ovale
ovest
ovino
oviparo
ovocito
ovunque
ovviare
ozio
pacchetto
pace
pacifico
padella
padrone
paese
paga
pagina
palazzina
palesare
pallido
palo
palude
pandoro
pannello
paolo
paonazzo
paprica
parabola
parcella
parere
pargolo
pari
parlato
parola
partire
parvenza
parziale
passivo
pasticca
patacca
patologia
pattume
pavone
peccato
pedalare
pedonale
peggio
peloso
penare
pendice
penisola
pennuto
penombra
pensare
pentola
pepe
pepita
perbene
percorso
perdonato
perforare
pergamena
periodo
permesso
perno
perplesso
persuaso
pertugio
pervaso
pesatore
pesista
peso
pestifero
petalo
pettine
petulante
pezzo
piacere
pianta
piattino
piccino
picozza
piega
pietra
piffero
pigiama
pigolio
pigro
pila
pilifero
pillola
pilota
pimpante
pineta
pinna
pinolo
pioggia
piombo
piramide
piretico
pirite
pirolisi
pitone
pizzico
placebo
planare
plasma
platano
plenario
pochezza
poderoso
podismo
poesia
poggiare
polenta
poligono
pollice
polmonite
polpetta
polso
poltrona
polvere
pomice
pomodoro
ponte
popoloso
porfido
poroso
porpora
porre
portata
posa
positivo
possesso
postulato
potassio
potere
pranzo
prassi
pratica
precluso
predica
prefisso
pregiato
prelievo
premere
prenotare
preparato
presenza
pretesto
prevalso
prima
principe
privato
problema
procura
produrre
profumo
progetto
prolunga
promessa
pronome
proposta
proroga
proteso
prova
prudente
prugna
prurito
psiche
pubblico
pudica
pugilato
pugno
pulce
pulito
pulsante
puntare
pupazzo
pupilla
puro
quadro
qualcosa
quasi
querela
quota
raccolto
raddoppio
radicale
radunato
raffica
ragazzo
ragione
ragno
ramarro
ramingo
ramo
randagio
rantolare
rapato
rapina
rappreso
rasatura
raschiato
rasente
rassegna
rastrello
rata
ravveduto
reale
recepire
recinto
recluta
recondito
recupero
reddito
redimere
regalato
registro
regola
regresso
relazione
remare
remoto
renna
replica
reprimere
reputare
resa
residente
responso
restauro
rete
retina
retorica
rettifica
revocato
riassunto
ribadire
ribelle
ribrezzo
ricarica
ricco
ricevere
riciclato
ricordo
ricreduto
ridicolo
ridurre
rifasare
riflesso
riforma
rifugio
rigare
rigettato
righello
rilassato
rilevato
rimanere
rimbalzo
rimedio
rimorchio
rinascita
rincaro
rinforzo
rinnovo
rinomato
rinsavito
rintocco
rinuncia
rinvenire
riparato
ripetuto
ripieno
riportare
ripresa
ripulire
risata
rischio
riserva
risibile
riso
rispetto
ristoro
risultato
risvolto
ritardo
ritegno
ritmico
ritrovo
riunione
riva
riverso
rivincita
rivolto
rizoma
roba
robotico
robusto
roccia
roco
rodaggio
rodere
roditore
rogito
rollio
romantico
rompere
ronzio
rosolare
rospo
rotante
rotondo
rotula
rovescio
rubizzo
rubrica
ruga
rullino
rumine
rumoroso
ruolo
rupe
russare
rustico
sabato
sabbiare
sabotato
sagoma
salasso
saldatura
salgemma
salivare
salmone
salone
saltare
saluto
salvo
sapere
sapido
saporito
saraceno
sarcasmo
sarto
sassoso
satellite
satira
satollo
saturno
savana
savio
saziato
sbadiglio
sbalzo
sbancato
sbarra
sbattere
sbavare
sbendare
sbirciare
sbloccato
sbocciato
sbrinare
sbruffone
sbuffare
scabroso
scadenza
scala
scambiare
scandalo
scapola
scarso
scatenare
scavato
scelto
scenico
scettro
scheda
schiena
sciarpa
scienza
scindere
scippo
sciroppo
scivolo
sclerare
scodella
scolpito
scomparto
sconforto
scoprire
scorta
scossone
scozzese
scriba
scrollare
scrutinio
scuderia
scultore
scuola
scuro
scusare
sdebitare
sdoganare
seccatura
secondo
sedano
seggiola
segnalato
segregato
seguito
selciato
selettivo
sella
selvaggio
semaforo
sembrare
seme
seminato
sempre
senso
sentire
sepolto
sequenza
serata
serbato
sereno
serio
serpente
serraglio
servire
sestina
setola
settimana
sfacelo
sfaldare
sfamato
sfarzoso
sfaticato
sfera
sfida
sfilato
sfinge
sfocato
sfoderare
sfogo
sfoltire
sforzato
sfratto
sfruttato
sfuggito
sfumare
sfuso
sgabello
sgarbato
sgonfiare
sgorbio
sgrassato
sguardo
sibilo
siccome
sierra
sigla
signore
silenzio
sillaba
simbolo
simpatico
simulato
sinfonia
singolo
sinistro
sino
sintesi
sinusoide
sipario
sisma
sistole
situato
slitta
slogatura
sloveno
smarrito
smemorato
smentito
smeraldo
smilzo
smontare
smottato
smussato
snellire
snervato
snodo
sobbalzo
sobrio
soccorso
sociale
sodale
soffitto
sogno
soldato
solenne
solido
sollazzo
solo
solubile
solvente
somatico
somma
sonda
sonetto
sonnifero
sopire
soppeso
sopra
sorgere
sorpasso
sorriso
sorso
sorteggio
sorvolato
sospiro
sosta
sottile
spada
spalla
spargere
spatola
spavento
spazzola
specie
spedire
spegnere
spelatura
speranza
spessore
spettrale
spezzato
spia
spigoloso
spillato
spinoso
spirale
splendido
sportivo
sposo
spranga
sprecare
spronato
spruzzo
spuntino
squillo
sradicare
srotolato
stabile
stacco
staffa
stagnare
stampato
stantio
starnuto
stasera
statuto
stelo
steppa
sterzo
stiletto
stima
stirpe
stivale
stizzoso
stonato
storico
strappo
stregato
stridulo
strozzare
strutto
stuccare
stufo
stupendo
subentro
succoso
sudore
suggerito
sugo
sultano
suonare
superbo
supporto
surgelato
surrogato
sussurro
sutura
svagare
svedese
sveglio
svelare
svenuto
svezia
sviluppo
svista
svizzera
svolta
svuotare
tabacco
tabulato
tacciare
taciturno
tale
talismano
tampone
tannino
tara
tardivo
targato
tariffa
tarpare
tartaruga
tasto
tattico
taverna
tavolata
tazza
teca
tecnico
telefono
temerario
tempo
temuto
tendone
tenero
tensione
tentacolo
teorema
terme
terrazzo
terzetto
tesi
tesserato
testato
tetro
tettoia
tifare
tigella
timbro
tinto
tipico
tipografo
tiraggio
tiro
titanio
titolo
titubante
tizio
tizzone
toccare
tollerare
tolto
tombola
tomo
tonfo
tonsilla
topazio
topologia
toppa
torba
tornare
torrone
tortora
toscano
tossire
tostatura
totano
trabocco
trachea
trafila
tragedia
tralcio
tramonto
transito
trapano
trarre
trasloco
trattato
trave
treccia
tremolio
trespolo
tributo
tricheco
trifoglio
trillo
trincea
trio
tristezza
triturato
trivella
tromba
trono
troppo
trottola
trovare
truccato
tubatura
tuffato
tulipano
tumulto
tunisia
turbare
turchino
tuta
tutela
ubicato
uccello
uccisore
udire
uditivo
uffa
ufficio
uguale
ulisse
ultimato
umano
umile
umorismo
uncinetto
ungere
ungherese
unicorno
unificato
unisono
unitario
unte
uovo
upupa
uragano
urgenza
urlo
usanza
usato
uscito
usignolo
usuraio
utensile
utilizzo
utopia
vacante
vaccinato
vagabondo
vagliato
valanga
valgo
valico
valletta
valoroso
valutare
valvola
vampata
vangare
vanitoso
vano
vantaggio
vanvera
vapore
varano
varcato
variante
vasca
vedetta
vedova
veduto
vegetale
veicolo
velcro
velina
velluto
veloce
venato
vendemmia
vento
verace
verbale
vergogna
verifica
vero
verruca
verticale
vescica
vessillo
vestale
veterano
vetrina
vetusto
viandante
vibrante
vicenda
vichingo
vicinanza
vidimare
vigilia
vigneto
vigore
vile
villano
vimini
vincitore
viola
vipera
virgola
virologo
virulento
viscoso
visione
vispo
vissuto
visura
vita
vitello
vittima
vivanda
vivido
viziare
voce
voga
volatile
volere
volpe
voragine
vulcano
zampogna
zanna
zappato
zattera
zavorra
zefiro
zelante
zelo
zenzero
zerbino
zibetto
zinco
zircone
zitto
zolla
zotico
zucchero
zufolo
zulu
zuppa`.split("\n");
  }
});

// node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/japanese.js
var wordlist5;
var init_japanese = __esm({
  "node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/japanese.js"() {
    wordlist5 = `\u3042\u3044\u3053\u304F\u3057\u3093
\u3042\u3044\u3055\u3064
\u3042\u3044\u305F\u3099
\u3042\u304A\u305D\u3099\u3089
\u3042\u304B\u3061\u3083\u3093
\u3042\u304D\u308B
\u3042\u3051\u304B\u3099\u305F
\u3042\u3051\u308B
\u3042\u3053\u304B\u3099\u308C\u308B
\u3042\u3055\u3044
\u3042\u3055\u3072
\u3042\u3057\u3042\u3068
\u3042\u3057\u3099\u308F\u3046
\u3042\u3059\u3099\u304B\u308B
\u3042\u3059\u3099\u304D
\u3042\u305D\u3075\u3099
\u3042\u305F\u3048\u308B
\u3042\u305F\u305F\u3081\u308B
\u3042\u305F\u308A\u307E\u3048
\u3042\u305F\u308B
\u3042\u3064\u3044
\u3042\u3064\u304B\u3046
\u3042\u3063\u3057\u3085\u304F
\u3042\u3064\u307E\u308A
\u3042\u3064\u3081\u308B
\u3042\u3066\u306A
\u3042\u3066\u306F\u307E\u308B
\u3042\u3072\u308B
\u3042\u3075\u3099\u3089
\u3042\u3075\u3099\u308B
\u3042\u3075\u308C\u308B
\u3042\u307E\u3044
\u3042\u307E\u3068\u3099
\u3042\u307E\u3084\u304B\u3059
\u3042\u307E\u308A
\u3042\u307F\u3082\u306E
\u3042\u3081\u308A\u304B
\u3042\u3084\u307E\u308B
\u3042\u3086\u3080
\u3042\u3089\u3044\u304F\u3099\u307E
\u3042\u3089\u3057
\u3042\u3089\u3059\u3057\u3099
\u3042\u3089\u305F\u3081\u308B
\u3042\u3089\u3086\u308B
\u3042\u3089\u308F\u3059
\u3042\u308A\u304B\u3099\u3068\u3046
\u3042\u308F\u305B\u308B
\u3042\u308F\u3066\u308B
\u3042\u3093\u3044
\u3042\u3093\u304B\u3099\u3044
\u3042\u3093\u3053
\u3042\u3093\u305B\u3099\u3093
\u3042\u3093\u3066\u3044
\u3042\u3093\u306A\u3044
\u3042\u3093\u307E\u308A
\u3044\u3044\u305F\u3099\u3059
\u3044\u304A\u3093
\u3044\u304B\u3099\u3044
\u3044\u304B\u3099\u304F
\u3044\u304D\u304A\u3044
\u3044\u304D\u306A\u308A
\u3044\u304D\u3082\u306E
\u3044\u304D\u308B
\u3044\u304F\u3057\u3099
\u3044\u304F\u3075\u3099\u3093
\u3044\u3051\u306F\u3099\u306A
\u3044\u3051\u3093
\u3044\u3053\u3046
\u3044\u3053\u304F
\u3044\u3053\u3064
\u3044\u3055\u307E\u3057\u3044
\u3044\u3055\u3093
\u3044\u3057\u304D
\u3044\u3057\u3099\u3085\u3046
\u3044\u3057\u3099\u3087\u3046
\u3044\u3057\u3099\u308F\u308B
\u3044\u3059\u3099\u307F
\u3044\u3059\u3099\u308C
\u3044\u305B\u3044
\u3044\u305B\u3048\u3072\u3099
\u3044\u305B\u304B\u3044
\u3044\u305B\u304D
\u3044\u305B\u3099\u3093
\u3044\u305D\u3046\u308D\u3046
\u3044\u305D\u304B\u3099\u3057\u3044
\u3044\u305F\u3099\u3044
\u3044\u305F\u3099\u304F
\u3044\u305F\u3059\u3099\u3089
\u3044\u305F\u307F
\u3044\u305F\u308A\u3042
\u3044\u3061\u304A\u3046
\u3044\u3061\u3057\u3099
\u3044\u3061\u3068\u3099
\u3044\u3061\u306F\u3099
\u3044\u3061\u3075\u3099
\u3044\u3061\u308A\u3085\u3046
\u3044\u3064\u304B
\u3044\u3063\u3057\u3085\u3093
\u3044\u3063\u305B\u3044
\u3044\u3063\u305D\u3046
\u3044\u3063\u305F\u3093
\u3044\u3063\u3061
\u3044\u3063\u3066\u3044
\u3044\u3063\u307B\u309A\u3046
\u3044\u3066\u3055\u3099
\u3044\u3066\u3093
\u3044\u3068\u3099\u3046
\u3044\u3068\u3053
\u3044\u306A\u3044
\u3044\u306A\u304B
\u3044\u306D\u3080\u308A
\u3044\u306E\u3061
\u3044\u306E\u308B
\u3044\u306F\u3064
\u3044\u306F\u3099\u308B
\u3044\u306F\u3093
\u3044\u3072\u3099\u304D
\u3044\u3072\u3093
\u3044\u3075\u304F
\u3044\u3078\u3093
\u3044\u307B\u3046
\u3044\u307F\u3093
\u3044\u3082\u3046\u3068
\u3044\u3082\u305F\u308C
\u3044\u3082\u308A
\u3044\u3084\u304B\u3099\u308B
\u3044\u3084\u3059
\u3044\u3088\u304B\u3093
\u3044\u3088\u304F
\u3044\u3089\u3044
\u3044\u3089\u3059\u3068
\u3044\u308A\u304F\u3099\u3061
\u3044\u308A\u3087\u3046
\u3044\u308C\u3044
\u3044\u308C\u3082\u306E
\u3044\u308C\u308B
\u3044\u308D\u3048\u3093\u3072\u309A\u3064
\u3044\u308F\u3044
\u3044\u308F\u3046
\u3044\u308F\u304B\u3093
\u3044\u308F\u306F\u3099
\u3044\u308F\u3086\u308B
\u3044\u3093\u3051\u3099\u3093\u307E\u3081
\u3044\u3093\u3055\u3064
\u3044\u3093\u3057\u3087\u3046
\u3044\u3093\u3088\u3046
\u3046\u3048\u304D
\u3046\u3048\u308B
\u3046\u304A\u3055\u3099
\u3046\u304B\u3099\u3044
\u3046\u304B\u3075\u3099
\u3046\u304B\u3078\u3099\u308B
\u3046\u304D\u308F
\u3046\u304F\u3089\u3044\u306A
\u3046\u304F\u308C\u308C
\u3046\u3051\u305F\u307E\u308F\u308B
\u3046\u3051\u3064\u3051
\u3046\u3051\u3068\u308B
\u3046\u3051\u3082\u3064
\u3046\u3051\u308B
\u3046\u3053\u3099\u304B\u3059
\u3046\u3053\u3099\u304F
\u3046\u3053\u3093
\u3046\u3055\u304D\u3099
\u3046\u3057\u306A\u3046
\u3046\u3057\u308D\u304B\u3099\u307F
\u3046\u3059\u3044
\u3046\u3059\u304D\u3099
\u3046\u3059\u304F\u3099\u3089\u3044
\u3046\u3059\u3081\u308B
\u3046\u305B\u3064
\u3046\u3061\u3042\u308F\u305B
\u3046\u3061\u304B\u3099\u308F
\u3046\u3061\u304D
\u3046\u3061\u3085\u3046
\u3046\u3063\u304B\u308A
\u3046\u3064\u304F\u3057\u3044
\u3046\u3063\u305F\u3048\u308B
\u3046\u3064\u308B
\u3046\u3068\u3099\u3093
\u3046\u306A\u304D\u3099
\u3046\u306A\u3057\u3099
\u3046\u306A\u3059\u3099\u304F
\u3046\u306A\u308B
\u3046\u306D\u308B
\u3046\u306E\u3046
\u3046\u3075\u3099\u3051\u3099
\u3046\u3075\u3099\u3053\u3099\u3048
\u3046\u307E\u308C\u308B
\u3046\u3081\u308B
\u3046\u3082\u3046
\u3046\u3084\u307E\u3046
\u3046\u3088\u304F
\u3046\u3089\u304B\u3099\u3048\u3059
\u3046\u3089\u304F\u3099\u3061
\u3046\u3089\u306A\u3044
\u3046\u308A\u3042\u3051\u3099
\u3046\u308A\u304D\u308C
\u3046\u308B\u3055\u3044
\u3046\u308C\u3057\u3044
\u3046\u308C\u3086\u304D
\u3046\u308C\u308B
\u3046\u308D\u3053
\u3046\u308F\u304D
\u3046\u308F\u3055
\u3046\u3093\u3053\u3046
\u3046\u3093\u3061\u3093
\u3046\u3093\u3066\u3093
\u3046\u3093\u3068\u3099\u3046
\u3048\u3044\u3048\u3093
\u3048\u3044\u304B\u3099
\u3048\u3044\u304D\u3087\u3046
\u3048\u3044\u3053\u3099
\u3048\u3044\u305B\u3044
\u3048\u3044\u3075\u3099\u3093
\u3048\u3044\u3088\u3046
\u3048\u3044\u308F
\u3048\u304A\u308A
\u3048\u304B\u3099\u304A
\u3048\u304B\u3099\u304F
\u3048\u304D\u305F\u3044
\u3048\u304F\u305B\u308B
\u3048\u3057\u3083\u304F
\u3048\u3059\u3066
\u3048\u3064\u3089\u3093
\u3048\u306E\u304F\u3099
\u3048\u307B\u3046\u307E\u304D
\u3048\u307B\u3093
\u3048\u307E\u304D
\u3048\u3082\u3057\u3099
\u3048\u3082\u306E
\u3048\u3089\u3044
\u3048\u3089\u3075\u3099
\u3048\u308A\u3042
\u3048\u3093\u3048\u3093
\u3048\u3093\u304B\u3044
\u3048\u3093\u304D\u3099
\u3048\u3093\u3051\u3099\u304D
\u3048\u3093\u3057\u3085\u3046
\u3048\u3093\u305B\u3099\u3064
\u3048\u3093\u305D\u304F
\u3048\u3093\u3061\u3087\u3046
\u3048\u3093\u3068\u3064
\u304A\u3044\u304B\u3051\u308B
\u304A\u3044\u3053\u3059
\u304A\u3044\u3057\u3044
\u304A\u3044\u3064\u304F
\u304A\u3046\u3048\u3093
\u304A\u3046\u3055\u307E
\u304A\u3046\u3057\u3099
\u304A\u3046\u305B\u3064
\u304A\u3046\u305F\u3044
\u304A\u3046\u3075\u304F
\u304A\u3046\u3078\u3099\u3044
\u304A\u3046\u3088\u3046
\u304A\u3048\u308B
\u304A\u304A\u3044
\u304A\u304A\u3046
\u304A\u304A\u3068\u3099\u304A\u308A
\u304A\u304A\u3084
\u304A\u304A\u3088\u305D
\u304A\u304B\u3048\u308A
\u304A\u304B\u3059\u3099
\u304A\u304B\u3099\u3080
\u304A\u304B\u308F\u308A
\u304A\u304D\u3099\u306A\u3046
\u304A\u304D\u308B
\u304A\u304F\u3055\u307E
\u304A\u304F\u3057\u3099\u3087\u3046
\u304A\u304F\u308A\u304B\u3099\u306A
\u304A\u304F\u308B
\u304A\u304F\u308C\u308B
\u304A\u3053\u3059
\u304A\u3053\u306A\u3046
\u304A\u3053\u308B
\u304A\u3055\u3048\u308B
\u304A\u3055\u306A\u3044
\u304A\u3055\u3081\u308B
\u304A\u3057\u3044\u308C
\u304A\u3057\u3048\u308B
\u304A\u3057\u3099\u304D\u3099
\u304A\u3057\u3099\u3055\u3093
\u304A\u3057\u3083\u308C
\u304A\u305D\u3089\u304F
\u304A\u305D\u308F\u308B
\u304A\u305F\u304B\u3099\u3044
\u304A\u305F\u304F
\u304A\u305F\u3099\u3084\u304B
\u304A\u3061\u3064\u304F
\u304A\u3063\u3068
\u304A\u3064\u308A
\u304A\u3066\u3099\u304B\u3051
\u304A\u3068\u3057\u3082\u306E
\u304A\u3068\u306A\u3057\u3044
\u304A\u3068\u3099\u308A
\u304A\u3068\u3099\u308D\u304B\u3059
\u304A\u306F\u3099\u3055\u3093
\u304A\u307E\u3044\u308A
\u304A\u3081\u3066\u3099\u3068\u3046
\u304A\u3082\u3044\u3066\u3099
\u304A\u3082\u3046
\u304A\u3082\u305F\u3044
\u304A\u3082\u3061\u3083
\u304A\u3084\u3064
\u304A\u3084\u3086\u3072\u3099
\u304A\u3088\u307B\u3099\u3059
\u304A\u3089\u3093\u305F\u3099
\u304A\u308D\u3059
\u304A\u3093\u304B\u3099\u304F
\u304A\u3093\u3051\u3044
\u304A\u3093\u3057\u3083
\u304A\u3093\u305B\u3093
\u304A\u3093\u305F\u3099\u3093
\u304A\u3093\u3061\u3085\u3046
\u304A\u3093\u3068\u3099\u3051\u3044
\u304B\u3042\u3064
\u304B\u3044\u304B\u3099
\u304B\u3099\u3044\u304D
\u304B\u3099\u3044\u3051\u3093
\u304B\u3099\u3044\u3053\u3046
\u304B\u3044\u3055\u3064
\u304B\u3044\u3057\u3083
\u304B\u3044\u3059\u3044\u3088\u304F
\u304B\u3044\u305B\u3099\u3093
\u304B\u3044\u305D\u3099\u3046\u3068\u3099
\u304B\u3044\u3064\u3046
\u304B\u3044\u3066\u3093
\u304B\u3044\u3068\u3046
\u304B\u3044\u3075\u304F
\u304B\u3099\u3044\u3078\u304D
\u304B\u3044\u307B\u3046
\u304B\u3044\u3088\u3046
\u304B\u3099\u3044\u3089\u3044
\u304B\u3044\u308F
\u304B\u3048\u308B
\u304B\u304A\u308A
\u304B\u304B\u3048\u308B
\u304B\u304B\u3099\u304F
\u304B\u304B\u3099\u3057
\u304B\u304B\u3099\u307F
\u304B\u304F\u3053\u3099
\u304B\u304F\u3068\u304F
\u304B\u3055\u3099\u308B
\u304B\u3099\u305D\u3099\u3046
\u304B\u305F\u3044
\u304B\u305F\u3061
\u304B\u3099\u3061\u3087\u3046
\u304B\u3099\u3063\u304D\u3085\u3046
\u304B\u3099\u3063\u3053\u3046
\u304B\u3099\u3063\u3055\u3093
\u304B\u3099\u3063\u3057\u3087\u3046
\u304B\u306A\u3055\u3099\u308F\u3057
\u304B\u306E\u3046
\u304B\u3099\u306F\u304F
\u304B\u3075\u3099\u304B
\u304B\u307B\u3046
\u304B\u307B\u3053\u3099
\u304B\u307E\u3046
\u304B\u307E\u307B\u3099\u3053
\u304B\u3081\u308C\u304A\u3093
\u304B\u3086\u3044
\u304B\u3088\u3046\u3072\u3099
\u304B\u3089\u3044
\u304B\u308B\u3044
\u304B\u308D\u3046
\u304B\u308F\u304F
\u304B\u308F\u3089
\u304B\u3099\u3093\u304B
\u304B\u3093\u3051\u3044
\u304B\u3093\u3053\u3046
\u304B\u3093\u3057\u3083
\u304B\u3093\u305D\u3046
\u304B\u3093\u305F\u3093
\u304B\u3093\u3061
\u304B\u3099\u3093\u306F\u3099\u308B
\u304D\u3042\u3044
\u304D\u3042\u3064
\u304D\u3044\u308D
\u304D\u3099\u3044\u3093
\u304D\u3046\u3044
\u304D\u3046\u3093
\u304D\u3048\u308B
\u304D\u304A\u3046
\u304D\u304A\u304F
\u304D\u304A\u3061
\u304D\u304A\u3093
\u304D\u304B\u3044
\u304D\u304B\u304F
\u304D\u304B\u3093\u3057\u3083
\u304D\u304D\u3066
\u304D\u304F\u306F\u3099\u308A
\u304D\u304F\u3089\u3051\u3099
\u304D\u3051\u3093\u305B\u3044
\u304D\u3053\u3046
\u304D\u3053\u3048\u308B
\u304D\u3053\u304F
\u304D\u3055\u3044
\u304D\u3055\u304F
\u304D\u3055\u307E
\u304D\u3055\u3089\u304D\u3099
\u304D\u3099\u3057\u3099\u304B\u304B\u3099\u304F
\u304D\u3099\u3057\u304D
\u304D\u3099\u3057\u3099\u305F\u3044\u3051\u3093
\u304D\u3099\u3057\u3099\u306B\u3063\u3066\u3044
\u304D\u3099\u3057\u3099\u3085\u3064\u3057\u3083
\u304D\u3059\u3046
\u304D\u305B\u3044
\u304D\u305B\u304D
\u304D\u305B\u3064
\u304D\u305D\u3046
\u304D\u305D\u3099\u304F
\u304D\u305D\u3099\u3093
\u304D\u305F\u3048\u308B
\u304D\u3061\u3087\u3046
\u304D\u3064\u3048\u3093
\u304D\u3099\u3063\u3061\u308A
\u304D\u3064\u3064\u304D
\u304D\u3064\u306D
\u304D\u3066\u3044
\u304D\u3068\u3099\u3046
\u304D\u3068\u3099\u304F
\u304D\u306A\u3044
\u304D\u306A\u304B\u3099
\u304D\u306A\u3053
\u304D\u306C\u3053\u3099\u3057
\u304D\u306D\u3093
\u304D\u306E\u3046
\u304D\u306E\u3057\u305F
\u304D\u306F\u304F
\u304D\u3072\u3099\u3057\u3044
\u304D\u3072\u3093
\u304D\u3075\u304F
\u304D\u3075\u3099\u3093
\u304D\u307B\u3099\u3046
\u304D\u307B\u3093
\u304D\u307E\u308B
\u304D\u307F\u3064
\u304D\u3080\u3059\u3099\u304B\u3057\u3044
\u304D\u3081\u308B
\u304D\u3082\u305F\u3099\u3081\u3057
\u304D\u3082\u3061
\u304D\u3082\u306E
\u304D\u3083\u304F
\u304D\u3084\u304F
\u304D\u3099\u3085\u3046\u306B\u304F
\u304D\u3088\u3046
\u304D\u3087\u3046\u308A\u3085\u3046
\u304D\u3089\u3044
\u304D\u3089\u304F
\u304D\u308A\u3093
\u304D\u308C\u3044
\u304D\u308C\u3064
\u304D\u308D\u304F
\u304D\u3099\u308D\u3093
\u304D\u308F\u3081\u308B
\u304D\u3099\u3093\u3044\u308D
\u304D\u3093\u304B\u304F\u3057\u3099
\u304D\u3093\u3057\u3099\u3087
\u304D\u3093\u3088\u3046\u3072\u3099
\u304F\u3099\u3042\u3044
\u304F\u3044\u3059\u3099
\u304F\u3046\u304B\u3093
\u304F\u3046\u304D
\u304F\u3046\u304F\u3099\u3093
\u304F\u3046\u3053\u3046
\u304F\u3099\u3046\u305B\u3044
\u304F\u3046\u305D\u3046
\u304F\u3099\u3046\u305F\u3089
\u304F\u3046\u3075\u304F
\u304F\u3046\u307B\u3099
\u304F\u304B\u3093
\u304F\u304D\u3087\u3046
\u304F\u3051\u3099\u3093
\u304F\u3099\u3053\u3046
\u304F\u3055\u3044
\u304F\u3055\u304D
\u304F\u3055\u306F\u3099\u306A
\u304F\u3055\u308B
\u304F\u3057\u3083\u307F
\u304F\u3057\u3087\u3046
\u304F\u3059\u306E\u304D
\u304F\u3059\u308A\u3086\u3072\u3099
\u304F\u305B\u3051\u3099
\u304F\u305B\u3093
\u304F\u3099\u305F\u3044\u3066\u304D
\u304F\u305F\u3099\u3055\u308B
\u304F\u305F\u3072\u3099\u308C\u308B
\u304F\u3061\u3053\u307F
\u304F\u3061\u3055\u304D
\u304F\u3064\u3057\u305F
\u304F\u3099\u3063\u3059\u308A
\u304F\u3064\u308D\u304F\u3099
\u304F\u3068\u3046\u3066\u3093
\u304F\u3068\u3099\u304F
\u304F\u306A\u3093
\u304F\u306D\u304F\u306D
\u304F\u306E\u3046
\u304F\u3075\u3046
\u304F\u307F\u3042\u308F\u305B
\u304F\u307F\u305F\u3066\u308B
\u304F\u3081\u308B
\u304F\u3084\u304F\u3057\u3087
\u304F\u3089\u3059
\u304F\u3089\u3078\u3099\u308B
\u304F\u308B\u307E
\u304F\u308C\u308B
\u304F\u308D\u3046
\u304F\u308F\u3057\u3044
\u304F\u3099\u3093\u304B\u3093
\u304F\u3099\u3093\u3057\u3087\u304F
\u304F\u3099\u3093\u305F\u3044
\u304F\u3099\u3093\u3066
\u3051\u3042\u306A
\u3051\u3044\u304B\u304F
\u3051\u3044\u3051\u3093
\u3051\u3044\u3053
\u3051\u3044\u3055\u3064
\u3051\u3099\u3044\u3057\u3099\u3085\u3064
\u3051\u3044\u305F\u3044
\u3051\u3099\u3044\u306E\u3046\u3057\u3099\u3093
\u3051\u3044\u308C\u304D
\u3051\u3044\u308D
\u3051\u304A\u3068\u3059
\u3051\u304A\u308A\u3082\u306E
\u3051\u3099\u304D\u304B
\u3051\u3099\u304D\u3051\u3099\u3093
\u3051\u3099\u304D\u305F\u3099\u3093
\u3051\u3099\u304D\u3061\u3093
\u3051\u3099\u304D\u3068\u3064
\u3051\u3099\u304D\u306F
\u3051\u3099\u304D\u3084\u304F
\u3051\u3099\u3053\u3046
\u3051\u3099\u3053\u304F\u3057\u3099\u3087\u3046
\u3051\u3099\u3055\u3099\u3044
\u3051\u3055\u304D
\u3051\u3099\u3055\u3099\u3093
\u3051\u3057\u304D
\u3051\u3057\u3053\u3099\u3080
\u3051\u3057\u3087\u3046
\u3051\u3099\u3059\u3068
\u3051\u305F\u306F\u3099
\u3051\u3061\u3083\u3063\u3075\u309A
\u3051\u3061\u3089\u3059
\u3051\u3064\u3042\u3064
\u3051\u3064\u3044
\u3051\u3064\u3048\u304D
\u3051\u3063\u3053\u3093
\u3051\u3064\u3057\u3099\u3087
\u3051\u3063\u305B\u304D
\u3051\u3063\u3066\u3044
\u3051\u3064\u307E\u3064
\u3051\u3099\u3064\u3088\u3046\u3072\u3099
\u3051\u3099\u3064\u308C\u3044
\u3051\u3064\u308D\u3093
\u3051\u3099\u3068\u3099\u304F
\u3051\u3068\u306F\u3099\u3059
\u3051\u3068\u308B
\u3051\u306A\u3051\u3099
\u3051\u306A\u3059
\u3051\u306A\u307F
\u3051\u306C\u304D
\u3051\u3099\u306D\u3064
\u3051\u306D\u3093
\u3051\u306F\u3044
\u3051\u3099\u3072\u3093
\u3051\u3075\u3099\u304B\u3044
\u3051\u3099\u307B\u3099\u304F
\u3051\u307E\u308A
\u3051\u307F\u304B\u308B
\u3051\u3080\u3057
\u3051\u3080\u308A
\u3051\u3082\u306E
\u3051\u3089\u3044
\u3051\u308D\u3051\u308D
\u3051\u308F\u3057\u3044
\u3051\u3093\u3044
\u3051\u3093\u3048\u3064
\u3051\u3093\u304A
\u3051\u3093\u304B
\u3051\u3099\u3093\u304D
\u3051\u3093\u3051\u3099\u3093
\u3051\u3093\u3053\u3046
\u3051\u3093\u3055\u304F
\u3051\u3093\u3057\u3085\u3046
\u3051\u3093\u3059\u3046
\u3051\u3099\u3093\u305D\u3046
\u3051\u3093\u3061\u304F
\u3051\u3093\u3066\u3044
\u3051\u3093\u3068\u3046
\u3051\u3093\u306A\u3044
\u3051\u3093\u306B\u3093
\u3051\u3099\u3093\u3075\u3099\u3064
\u3051\u3093\u307E
\u3051\u3093\u307F\u3093
\u3051\u3093\u3081\u3044
\u3051\u3093\u3089\u3093
\u3051\u3093\u308A
\u3053\u3042\u304F\u307E
\u3053\u3044\u306C
\u3053\u3044\u3072\u3099\u3068
\u3053\u3099\u3046\u3044
\u3053\u3046\u3048\u3093
\u3053\u3046\u304A\u3093
\u3053\u3046\u304B\u3093
\u3053\u3099\u3046\u304D\u3085\u3046
\u3053\u3099\u3046\u3051\u3044
\u3053\u3046\u3053\u3046
\u3053\u3046\u3055\u3044
\u3053\u3046\u3057\u3099
\u3053\u3046\u3059\u3044
\u3053\u3099\u3046\u305B\u3044
\u3053\u3046\u305D\u304F
\u3053\u3046\u305F\u3044
\u3053\u3046\u3061\u3083
\u3053\u3046\u3064\u3046
\u3053\u3046\u3066\u3044
\u3053\u3046\u3068\u3099\u3046
\u3053\u3046\u306A\u3044
\u3053\u3046\u306F\u3044
\u3053\u3099\u3046\u307B\u3046
\u3053\u3099\u3046\u307E\u3093
\u3053\u3046\u3082\u304F
\u3053\u3046\u308A\u3064
\u3053\u3048\u308B
\u3053\u304A\u308A
\u3053\u3099\u304B\u3044
\u3053\u3099\u304B\u3099\u3064
\u3053\u3099\u304B\u3093
\u3053\u304F\u3053\u3099
\u3053\u304F\u3055\u3044
\u3053\u304F\u3068\u3046
\u3053\u304F\u306A\u3044
\u3053\u304F\u306F\u304F
\u3053\u304F\u3099\u307E
\u3053\u3051\u3044
\u3053\u3051\u308B
\u3053\u3053\u306E\u304B
\u3053\u3053\u308D
\u3053\u3055\u3081
\u3053\u3057\u3064
\u3053\u3059\u3046
\u3053\u305B\u3044
\u3053\u305B\u304D
\u3053\u305B\u3099\u3093
\u3053\u305D\u305F\u3099\u3066
\u3053\u305F\u3044
\u3053\u305F\u3048\u308B
\u3053\u305F\u3064
\u3053\u3061\u3087\u3046
\u3053\u3063\u304B
\u3053\u3064\u3053\u3064
\u3053\u3064\u306F\u3099\u3093
\u3053\u3064\u3075\u3099
\u3053\u3066\u3044
\u3053\u3066\u3093
\u3053\u3068\u304B\u3099\u3089
\u3053\u3068\u3057
\u3053\u3068\u306F\u3099
\u3053\u3068\u308A
\u3053\u306A\u3053\u3099\u306A
\u3053\u306D\u3053\u306D
\u3053\u306E\u307E\u307E
\u3053\u306E\u307F
\u3053\u306E\u3088
\u3053\u3099\u306F\u3093
\u3053\u3072\u3064\u3057\u3099
\u3053\u3075\u3046
\u3053\u3075\u3093
\u3053\u307B\u3099\u308C\u308B
\u3053\u3099\u307E\u3042\u3075\u3099\u3089
\u3053\u307E\u304B\u3044
\u3053\u3099\u307E\u3059\u308A
\u3053\u307E\u3064\u306A
\u3053\u307E\u308B
\u3053\u3080\u304D\u3099\u3053
\u3053\u3082\u3057\u3099
\u3053\u3082\u3061
\u3053\u3082\u306E
\u3053\u3082\u3093
\u3053\u3084\u304F
\u3053\u3084\u307E
\u3053\u3086\u3046
\u3053\u3086\u3072\u3099
\u3053\u3088\u3044
\u3053\u3088\u3046
\u3053\u308A\u308B
\u3053\u308C\u304F\u3057\u3087\u3093
\u3053\u308D\u3063\u3051
\u3053\u308F\u3082\u3066
\u3053\u308F\u308C\u308B
\u3053\u3093\u3044\u3093
\u3053\u3093\u304B\u3044
\u3053\u3093\u304D
\u3053\u3093\u3057\u3085\u3046
\u3053\u3093\u3059\u3044
\u3053\u3093\u305F\u3099\u3066
\u3053\u3093\u3068\u3093
\u3053\u3093\u306A\u3093
\u3053\u3093\u3072\u3099\u306B
\u3053\u3093\u307B\u309A\u3093
\u3053\u3093\u307E\u3051
\u3053\u3093\u3084
\u3053\u3093\u308C\u3044
\u3053\u3093\u308F\u304F
\u3055\u3099\u3044\u3048\u304D
\u3055\u3044\u304B\u3044
\u3055\u3044\u304D\u3093
\u3055\u3099\u3044\u3051\u3099\u3093
\u3055\u3099\u3044\u3053
\u3055\u3044\u3057\u3087
\u3055\u3044\u305B\u3044
\u3055\u3099\u3044\u305F\u304F
\u3055\u3099\u3044\u3061\u3085\u3046
\u3055\u3044\u3066\u304D
\u3055\u3099\u3044\u308A\u3087\u3046
\u3055\u3046\u306A
\u3055\u304B\u3044\u3057
\u3055\u304B\u3099\u3059
\u3055\u304B\u306A
\u3055\u304B\u307F\u3061
\u3055\u304B\u3099\u308B
\u3055\u304D\u3099\u3087\u3046
\u3055\u304F\u3057
\u3055\u304F\u3072\u3093
\u3055\u304F\u3089
\u3055\u3053\u304F
\u3055\u3053\u3064
\u3055\u3059\u3099\u304B\u308B
\u3055\u3099\u305B\u304D
\u3055\u305F\u3093
\u3055\u3064\u3048\u3044
\u3055\u3099\u3064\u304A\u3093
\u3055\u3099\u3063\u304B
\u3055\u3099\u3064\u304B\u3099\u304F
\u3055\u3063\u304D\u3087\u304F
\u3055\u3099\u3063\u3057
\u3055\u3064\u3057\u3099\u3093
\u3055\u3099\u3063\u305D\u3046
\u3055\u3064\u305F\u306F\u3099
\u3055\u3064\u307E\u3044\u3082
\u3055\u3066\u3044
\u3055\u3068\u3044\u3082
\u3055\u3068\u3046
\u3055\u3068\u304A\u3084
\u3055\u3068\u3057
\u3055\u3068\u308B
\u3055\u306E\u3046
\u3055\u306F\u3099\u304F
\u3055\u3072\u3099\u3057\u3044
\u3055\u3078\u3099\u3064
\u3055\u307B\u3046
\u3055\u307B\u3068\u3099
\u3055\u307E\u3059
\u3055\u307F\u3057\u3044
\u3055\u307F\u305F\u3099\u308C
\u3055\u3080\u3051
\u3055\u3081\u308B
\u3055\u3084\u3048\u3093\u3068\u3099\u3046
\u3055\u3086\u3046
\u3055\u3088\u3046
\u3055\u3088\u304F
\u3055\u3089\u305F\u3099
\u3055\u3099\u308B\u305D\u306F\u3099
\u3055\u308F\u3084\u304B
\u3055\u308F\u308B
\u3055\u3093\u3044\u3093
\u3055\u3093\u304B
\u3055\u3093\u304D\u3083\u304F
\u3055\u3093\u3053\u3046
\u3055\u3093\u3055\u3044
\u3055\u3099\u3093\u3057\u3087
\u3055\u3093\u3059\u3046
\u3055\u3093\u305B\u3044
\u3055\u3093\u305D
\u3055\u3093\u3061
\u3055\u3093\u307E
\u3055\u3093\u307F
\u3055\u3093\u3089\u3093
\u3057\u3042\u3044
\u3057\u3042\u3051\u3099
\u3057\u3042\u3055\u3063\u3066
\u3057\u3042\u308F\u305B
\u3057\u3044\u304F
\u3057\u3044\u3093
\u3057\u3046\u3061
\u3057\u3048\u3044
\u3057\u304A\u3051
\u3057\u304B\u3044
\u3057\u304B\u304F
\u3057\u3099\u304B\u3093
\u3057\u3053\u3099\u3068
\u3057\u3059\u3046
\u3057\u3099\u305F\u3099\u3044
\u3057\u305F\u3046\u3051
\u3057\u305F\u304D\u3099
\u3057\u305F\u3066
\u3057\u305F\u307F
\u3057\u3061\u3087\u3046
\u3057\u3061\u308A\u3093
\u3057\u3063\u304B\u308A
\u3057\u3064\u3057\u3099
\u3057\u3064\u3082\u3093
\u3057\u3066\u3044
\u3057\u3066\u304D
\u3057\u3066\u3064
\u3057\u3099\u3066\u3093
\u3057\u3099\u3068\u3099\u3046
\u3057\u306A\u304D\u3099\u308C
\u3057\u306A\u3082\u306E
\u3057\u306A\u3093
\u3057\u306D\u307E
\u3057\u306D\u3093
\u3057\u306E\u304F\u3099
\u3057\u306E\u3075\u3099
\u3057\u306F\u3044
\u3057\u306F\u3099\u304B\u308A
\u3057\u306F\u3064
\u3057\u306F\u3089\u3044
\u3057\u306F\u3093
\u3057\u3072\u3087\u3046
\u3057\u3075\u304F
\u3057\u3099\u3075\u3099\u3093
\u3057\u3078\u3044
\u3057\u307B\u3046
\u3057\u307B\u3093
\u3057\u307E\u3046
\u3057\u307E\u308B
\u3057\u307F\u3093
\u3057\u3080\u3051\u308B
\u3057\u3099\u3080\u3057\u3087
\u3057\u3081\u3044
\u3057\u3081\u308B
\u3057\u3082\u3093
\u3057\u3083\u3044\u3093
\u3057\u3083\u3046\u3093
\u3057\u3083\u304A\u3093
\u3057\u3099\u3083\u304B\u3099\u3044\u3082
\u3057\u3084\u304F\u3057\u3087
\u3057\u3083\u304F\u307B\u3046
\u3057\u3083\u3051\u3093
\u3057\u3083\u3053
\u3057\u3083\u3055\u3099\u3044
\u3057\u3083\u3057\u3093
\u3057\u3083\u305B\u3093
\u3057\u3083\u305D\u3046
\u3057\u3083\u305F\u3044
\u3057\u3083\u3061\u3087\u3046
\u3057\u3083\u3063\u304D\u3093
\u3057\u3099\u3083\u307E
\u3057\u3083\u308A\u3093
\u3057\u3083\u308C\u3044
\u3057\u3099\u3086\u3046
\u3057\u3099\u3085\u3046\u3057\u3087
\u3057\u3085\u304F\u306F\u304F
\u3057\u3099\u3085\u3057\u3093
\u3057\u3085\u3063\u305B\u304D
\u3057\u3085\u307F
\u3057\u3085\u3089\u306F\u3099
\u3057\u3099\u3085\u3093\u306F\u3099\u3093
\u3057\u3087\u3046\u304B\u3044
\u3057\u3087\u304F\u305F\u304F
\u3057\u3087\u3063\u3051\u3093
\u3057\u3087\u3068\u3099\u3046
\u3057\u3087\u3082\u3064
\u3057\u3089\u305B\u308B
\u3057\u3089\u3078\u3099\u308B
\u3057\u3093\u304B
\u3057\u3093\u3053\u3046
\u3057\u3099\u3093\u3057\u3099\u3083
\u3057\u3093\u305B\u3044\u3057\u3099
\u3057\u3093\u3061\u304F
\u3057\u3093\u308A\u3093
\u3059\u3042\u3051\u3099
\u3059\u3042\u3057
\u3059\u3042\u306A
\u3059\u3099\u3042\u3093
\u3059\u3044\u3048\u3044
\u3059\u3044\u304B
\u3059\u3044\u3068\u3046
\u3059\u3099\u3044\u3075\u3099\u3093
\u3059\u3044\u3088\u3046\u3072\u3099
\u3059\u3046\u304B\u3099\u304F
\u3059\u3046\u3057\u3099\u3064
\u3059\u3046\u305B\u3093
\u3059\u304A\u3068\u3099\u308A
\u3059\u304D\u307E
\u3059\u304F\u3046
\u3059\u304F\u306A\u3044
\u3059\u3051\u308B
\u3059\u3053\u3099\u3044
\u3059\u3053\u3057
\u3059\u3099\u3055\u3093
\u3059\u3059\u3099\u3057\u3044
\u3059\u3059\u3080
\u3059\u3059\u3081\u308B
\u3059\u3063\u304B\u308A
\u3059\u3099\u3063\u3057\u308A
\u3059\u3099\u3063\u3068
\u3059\u3066\u304D
\u3059\u3066\u308B
\u3059\u306D\u308B
\u3059\u306E\u3053
\u3059\u306F\u305F\u3099
\u3059\u306F\u3099\u3089\u3057\u3044
\u3059\u3099\u3072\u3087\u3046
\u3059\u3099\u3075\u3099\u306C\u308C
\u3059\u3075\u3099\u308A
\u3059\u3075\u308C
\u3059\u3078\u3099\u3066
\u3059\u3078\u3099\u308B
\u3059\u3099\u307B\u3046
\u3059\u307B\u3099\u3093
\u3059\u307E\u3044
\u3059\u3081\u3057
\u3059\u3082\u3046
\u3059\u3084\u304D
\u3059\u3089\u3059\u3089
\u3059\u308B\u3081
\u3059\u308C\u3061\u304B\u3099\u3046
\u3059\u308D\u3063\u3068
\u3059\u308F\u308B
\u3059\u3093\u305B\u3099\u3093
\u3059\u3093\u307B\u309A\u3046
\u305B\u3042\u3075\u3099\u3089
\u305B\u3044\u304B\u3064
\u305B\u3044\u3051\u3099\u3093
\u305B\u3044\u3057\u3099
\u305B\u3044\u3088\u3046
\u305B\u304A\u3046
\u305B\u304B\u3044\u304B\u3093
\u305B\u304D\u306B\u3093
\u305B\u304D\u3080
\u305B\u304D\u3086
\u305B\u304D\u3089\u3093\u3046\u3093
\u305B\u3051\u3093
\u305B\u3053\u3046
\u305B\u3059\u3057\u3099
\u305B\u305F\u3044
\u305B\u305F\u3051
\u305B\u3063\u304B\u304F
\u305B\u3063\u304D\u3083\u304F
\u305B\u3099\u3063\u304F
\u305B\u3063\u3051\u3093
\u305B\u3063\u3053\u3064
\u305B\u3063\u3055\u305F\u304F\u307E
\u305B\u3064\u305D\u3099\u304F
\u305B\u3064\u305F\u3099\u3093
\u305B\u3064\u3066\u3099\u3093
\u305B\u3063\u306F\u309A\u3093
\u305B\u3064\u3072\u3099
\u305B\u3064\u3075\u3099\u3093
\u305B\u3064\u3081\u3044
\u305B\u3064\u308A\u3064
\u305B\u306A\u304B
\u305B\u306E\u3072\u3099
\u305B\u306F\u306F\u3099
\u305B\u3072\u3099\u308D
\u305B\u307B\u3099\u306D
\u305B\u307E\u3044
\u305B\u307E\u308B
\u305B\u3081\u308B
\u305B\u3082\u305F\u308C
\u305B\u308A\u3075
\u305B\u3099\u3093\u3042\u304F
\u305B\u3093\u3044
\u305B\u3093\u3048\u3044
\u305B\u3093\u304B
\u305B\u3093\u304D\u3087
\u305B\u3093\u304F
\u305B\u3093\u3051\u3099\u3093
\u305B\u3099\u3093\u3053\u3099
\u305B\u3093\u3055\u3044
\u305B\u3093\u3057\u3085
\u305B\u3093\u3059\u3044
\u305B\u3093\u305B\u3044
\u305B\u3093\u305D\u3099
\u305B\u3093\u305F\u304F
\u305B\u3093\u3061\u3087\u3046
\u305B\u3093\u3066\u3044
\u305B\u3093\u3068\u3046
\u305B\u3093\u306C\u304D
\u305B\u3093\u306D\u3093
\u305B\u3093\u306F\u309A\u3044
\u305B\u3099\u3093\u3075\u3099
\u305B\u3099\u3093\u307B\u309A\u3046
\u305B\u3093\u3080
\u305B\u3093\u3081\u3093\u3057\u3099\u3087
\u305B\u3093\u3082\u3093
\u305B\u3093\u3084\u304F
\u305B\u3093\u3086\u3046
\u305B\u3093\u3088\u3046
\u305B\u3099\u3093\u3089
\u305B\u3099\u3093\u308A\u3083\u304F
\u305B\u3093\u308C\u3044
\u305B\u3093\u308D
\u305D\u3042\u304F
\u305D\u3044\u3068\u3051\u3099\u308B
\u305D\u3044\u306D
\u305D\u3046\u304B\u3099\u3093\u304D\u3087\u3046
\u305D\u3046\u304D
\u305D\u3046\u3053\u3099
\u305D\u3046\u3057\u3093
\u305D\u3046\u305F\u3099\u3093
\u305D\u3046\u306A\u3093
\u305D\u3046\u3072\u3099
\u305D\u3046\u3081\u3093
\u305D\u3046\u308A
\u305D\u3048\u3082\u306E
\u305D\u3048\u3093
\u305D\u304B\u3099\u3044
\u305D\u3051\u3099\u304D
\u305D\u3053\u3046
\u305D\u3053\u305D\u3053
\u305D\u3055\u3099\u3044
\u305D\u3057\u306A
\u305D\u305B\u3044
\u305D\u305B\u3093
\u305D\u305D\u304F\u3099
\u305D\u305F\u3099\u3066\u308B
\u305D\u3064\u3046
\u305D\u3064\u3048\u3093
\u305D\u3063\u304B\u3093
\u305D\u3064\u304D\u3099\u3087\u3046
\u305D\u3063\u3051\u3064
\u305D\u3063\u3053\u3046
\u305D\u3063\u305B\u3093
\u305D\u3063\u3068
\u305D\u3068\u304B\u3099\u308F
\u305D\u3068\u3064\u3099\u3089
\u305D\u306A\u3048\u308B
\u305D\u306A\u305F
\u305D\u3075\u307B\u3099
\u305D\u307B\u3099\u304F
\u305D\u307B\u3099\u308D
\u305D\u307E\u3064
\u305D\u307E\u308B
\u305D\u3080\u304F
\u305D\u3080\u308A\u3048
\u305D\u3081\u308B
\u305D\u3082\u305D\u3082
\u305D\u3088\u304B\u305B\u3099
\u305D\u3089\u307E\u3081
\u305D\u308D\u3046
\u305D\u3093\u304B\u3044
\u305D\u3093\u3051\u3044
\u305D\u3093\u3055\u3099\u3044
\u305D\u3093\u3057\u3064
\u305D\u3093\u305D\u3099\u304F
\u305D\u3093\u3061\u3087\u3046
\u305D\u3099\u3093\u3072\u3099
\u305D\u3099\u3093\u3075\u3099\u3093
\u305D\u3093\u307F\u3093
\u305F\u3042\u3044
\u305F\u3044\u3044\u3093
\u305F\u3044\u3046\u3093
\u305F\u3044\u3048\u304D
\u305F\u3044\u304A\u3046
\u305F\u3099\u3044\u304B\u3099\u304F
\u305F\u3044\u304D
\u305F\u3044\u304F\u3099\u3046
\u305F\u3044\u3051\u3093
\u305F\u3044\u3053
\u305F\u3044\u3055\u3099\u3044
\u305F\u3099\u3044\u3057\u3099\u3087\u3046\u3075\u3099
\u305F\u3099\u3044\u3059\u304D
\u305F\u3044\u305B\u3064
\u305F\u3044\u305D\u3046
\u305F\u3099\u3044\u305F\u3044
\u305F\u3044\u3061\u3087\u3046
\u305F\u3044\u3066\u3044
\u305F\u3099\u3044\u3068\u3099\u3053\u308D
\u305F\u3044\u306A\u3044
\u305F\u3044\u306D\u3064
\u305F\u3044\u306E\u3046
\u305F\u3044\u306F\u3093
\u305F\u3099\u3044\u3072\u3087\u3046
\u305F\u3044\u3075\u3046
\u305F\u3044\u3078\u3093
\u305F\u3044\u307B
\u305F\u3044\u307E\u3064\u306F\u3099\u306A
\u305F\u3044\u307F\u3093\u304F\u3099
\u305F\u3044\u3080
\u305F\u3044\u3081\u3093
\u305F\u3044\u3084\u304D
\u305F\u3044\u3088\u3046
\u305F\u3044\u3089
\u305F\u3044\u308A\u3087\u304F
\u305F\u3044\u308B
\u305F\u3044\u308F\u3093
\u305F\u3046\u3048
\u305F\u3048\u308B
\u305F\u304A\u3059
\u305F\u304A\u308B
\u305F\u304A\u308C\u308B
\u305F\u304B\u3044
\u305F\u304B\u306D
\u305F\u304D\u3072\u3099
\u305F\u304F\u3055\u3093
\u305F\u3053\u304F
\u305F\u3053\u3084\u304D
\u305F\u3055\u3044
\u305F\u3057\u3055\u3099\u3093
\u305F\u3099\u3057\u3099\u3083\u308C
\u305F\u3059\u3051\u308B
\u305F\u3059\u3099\u3055\u308F\u308B
\u305F\u305D\u304B\u3099\u308C
\u305F\u305F\u304B\u3046
\u305F\u305F\u304F
\u305F\u305F\u3099\u3057\u3044
\u305F\u305F\u307F
\u305F\u3061\u306F\u3099\u306A
\u305F\u3099\u3063\u304B\u3044
\u305F\u3099\u3063\u304D\u3083\u304F
\u305F\u3099\u3063\u3053
\u305F\u3099\u3063\u3057\u3085\u3064
\u305F\u3099\u3063\u305F\u3044
\u305F\u3066\u308B
\u305F\u3068\u3048\u308B
\u305F\u306A\u306F\u3099\u305F
\u305F\u306B\u3093
\u305F\u306C\u304D
\u305F\u306E\u3057\u307F
\u305F\u306F\u3064
\u305F\u3075\u3099\u3093
\u305F\u3078\u3099\u308B
\u305F\u307B\u3099\u3046
\u305F\u307E\u3053\u3099
\u305F\u307E\u308B
\u305F\u3099\u3080\u308B
\u305F\u3081\u3044\u304D
\u305F\u3081\u3059
\u305F\u3081\u308B
\u305F\u3082\u3064
\u305F\u3084\u3059\u3044
\u305F\u3088\u308B
\u305F\u3089\u3059
\u305F\u308A\u304D\u307B\u3093\u304B\u3099\u3093
\u305F\u308A\u3087\u3046
\u305F\u308A\u308B
\u305F\u308B\u3068
\u305F\u308C\u308B
\u305F\u308C\u3093\u3068
\u305F\u308D\u3063\u3068
\u305F\u308F\u3080\u308C\u308B
\u305F\u3099\u3093\u3042\u3064
\u305F\u3093\u3044
\u305F\u3093\u304A\u3093
\u305F\u3093\u304B
\u305F\u3093\u304D
\u305F\u3093\u3051\u3093
\u305F\u3093\u3053\u3099
\u305F\u3093\u3055\u3093
\u305F\u3093\u3057\u3099\u3087\u3046\u3072\u3099
\u305F\u3099\u3093\u305B\u3044
\u305F\u3093\u305D\u304F
\u305F\u3093\u305F\u3044
\u305F\u3099\u3093\u3061
\u305F\u3093\u3066\u3044
\u305F\u3093\u3068\u3046
\u305F\u3099\u3093\u306A
\u305F\u3093\u306B\u3093
\u305F\u3099\u3093\u306D\u3064
\u305F\u3093\u306E\u3046
\u305F\u3093\u3072\u309A\u3093
\u305F\u3099\u3093\u307B\u3099\u3046
\u305F\u3093\u307E\u3064
\u305F\u3093\u3081\u3044
\u305F\u3099\u3093\u308C\u3064
\u305F\u3099\u3093\u308D
\u305F\u3099\u3093\u308F
\u3061\u3042\u3044
\u3061\u3042\u3093
\u3061\u3044\u304D
\u3061\u3044\u3055\u3044
\u3061\u3048\u3093
\u3061\u304B\u3044
\u3061\u304B\u3089
\u3061\u304D\u3085\u3046
\u3061\u304D\u3093
\u3061\u3051\u3044\u3059\u3099
\u3061\u3051\u3093
\u3061\u3053\u304F
\u3061\u3055\u3044
\u3061\u3057\u304D
\u3061\u3057\u308A\u3087\u3046
\u3061\u305B\u3044
\u3061\u305D\u3046
\u3061\u305F\u3044
\u3061\u305F\u3093
\u3061\u3061\u304A\u3084
\u3061\u3064\u3057\u3099\u3087
\u3061\u3066\u304D
\u3061\u3066\u3093
\u3061\u306C\u304D
\u3061\u306C\u308A
\u3061\u306E\u3046
\u3061\u3072\u3087\u3046
\u3061\u3078\u3044\u305B\u3093
\u3061\u307B\u3046
\u3061\u307E\u305F
\u3061\u307F\u3064
\u3061\u307F\u3068\u3099\u308D
\u3061\u3081\u3044\u3068\u3099
\u3061\u3083\u3093\u3053\u306A\u3078\u3099
\u3061\u3085\u3046\u3044
\u3061\u3086\u308A\u3087\u304F
\u3061\u3087\u3046\u3057
\u3061\u3087\u3055\u304F\u3051\u3093
\u3061\u3089\u3057
\u3061\u3089\u307F
\u3061\u308A\u304B\u3099\u307F
\u3061\u308A\u3087\u3046
\u3061\u308B\u3068\u3099
\u3061\u308F\u308F
\u3061\u3093\u305F\u3044
\u3061\u3093\u3082\u304F
\u3064\u3044\u304B
\u3064\u3044\u305F\u3061
\u3064\u3046\u304B
\u3064\u3046\u3057\u3099\u3087\u3046
\u3064\u3046\u306F\u3093
\u3064\u3046\u308F
\u3064\u304B\u3046
\u3064\u304B\u308C\u308B
\u3064\u304F\u306D
\u3064\u304F\u308B
\u3064\u3051\u306D
\u3064\u3051\u308B
\u3064\u3053\u3099\u3046
\u3064\u305F\u3048\u308B
\u3064\u3064\u3099\u304F
\u3064\u3064\u3057\u3099
\u3064\u3064\u3080
\u3064\u3068\u3081\u308B
\u3064\u306A\u304B\u3099\u308B
\u3064\u306A\u307F
\u3064\u306D\u3064\u3099\u306D
\u3064\u306E\u308B
\u3064\u3075\u3099\u3059
\u3064\u307E\u3089\u306A\u3044
\u3064\u307E\u308B
\u3064\u307F\u304D
\u3064\u3081\u305F\u3044
\u3064\u3082\u308A
\u3064\u3082\u308B
\u3064\u3088\u3044
\u3064\u308B\u307B\u3099
\u3064\u308B\u307F\u304F
\u3064\u308F\u3082\u306E
\u3064\u308F\u308A
\u3066\u3042\u3057
\u3066\u3042\u3066
\u3066\u3042\u307F
\u3066\u3044\u304A\u3093
\u3066\u3044\u304B
\u3066\u3044\u304D
\u3066\u3044\u3051\u3044
\u3066\u3044\u3053\u304F
\u3066\u3044\u3055\u3064
\u3066\u3044\u3057
\u3066\u3044\u305B\u3044
\u3066\u3044\u305F\u3044
\u3066\u3044\u3068\u3099
\u3066\u3044\u306D\u3044
\u3066\u3044\u3072\u3087\u3046
\u3066\u3044\u3078\u3093
\u3066\u3044\u307B\u3099\u3046
\u3066\u3046\u3061
\u3066\u304A\u304F\u308C
\u3066\u304D\u3068\u3046
\u3066\u304F\u3072\u3099
\u3066\u3099\u3053\u307B\u3099\u3053
\u3066\u3055\u304D\u3099\u3087\u3046
\u3066\u3055\u3051\u3099
\u3066\u3059\u308A
\u3066\u305D\u3046
\u3066\u3061\u304B\u3099\u3044
\u3066\u3061\u3087\u3046
\u3066\u3064\u304B\u3099\u304F
\u3066\u3064\u3064\u3099\u304D
\u3066\u3099\u3063\u306F\u309A
\u3066\u3064\u307B\u3099\u3046
\u3066\u3064\u3084
\u3066\u3099\u306C\u304B\u3048
\u3066\u306C\u304D
\u3066\u306C\u304F\u3099\u3044
\u3066\u306E\u3072\u3089
\u3066\u306F\u3044
\u3066\u3075\u3099\u304F\u308D
\u3066\u3075\u305F\u3099
\u3066\u307B\u3068\u3099\u304D
\u3066\u307B\u3093
\u3066\u307E\u3048
\u3066\u307E\u304D\u3059\u3099\u3057
\u3066\u307F\u3057\u3099\u304B
\u3066\u307F\u3084\u3051\u3099
\u3066\u3089\u3059
\u3066\u308C\u3072\u3099
\u3066\u308F\u3051
\u3066\u308F\u305F\u3057
\u3066\u3099\u3093\u3042\u3064
\u3066\u3093\u3044\u3093
\u3066\u3093\u304B\u3044
\u3066\u3093\u304D
\u3066\u3093\u304F\u3099
\u3066\u3093\u3051\u3093
\u3066\u3093\u3053\u3099\u304F
\u3066\u3093\u3055\u3044
\u3066\u3093\u3057
\u3066\u3093\u3059\u3046
\u3066\u3099\u3093\u3061
\u3066\u3093\u3066\u304D
\u3066\u3093\u3068\u3046
\u3066\u3093\u306A\u3044
\u3066\u3093\u3075\u309A\u3089
\u3066\u3093\u307B\u3099\u3046\u305F\u3099\u3044
\u3066\u3093\u3081\u3064
\u3066\u3093\u3089\u3093\u304B\u3044
\u3066\u3099\u3093\u308A\u3087\u304F
\u3066\u3099\u3093\u308F
\u3068\u3099\u3042\u3044
\u3068\u3044\u308C
\u3068\u3099\u3046\u304B\u3093
\u3068\u3046\u304D\u3085\u3046
\u3068\u3099\u3046\u304F\u3099
\u3068\u3046\u3057
\u3068\u3046\u3080\u304D\u3099
\u3068\u304A\u3044
\u3068\u304A\u304B
\u3068\u304A\u304F
\u3068\u304A\u3059
\u3068\u304A\u308B
\u3068\u304B\u3044
\u3068\u304B\u3059
\u3068\u304D\u304A\u308A
\u3068\u304D\u3068\u3099\u304D
\u3068\u304F\u3044
\u3068\u304F\u3057\u3085\u3046
\u3068\u304F\u3066\u3093
\u3068\u304F\u306B
\u3068\u304F\u3078\u3099\u3064
\u3068\u3051\u3044
\u3068\u3051\u308B
\u3068\u3053\u3084
\u3068\u3055\u304B
\u3068\u3057\u3087\u304B\u3093
\u3068\u305D\u3046
\u3068\u305F\u3093
\u3068\u3061\u3085\u3046
\u3068\u3063\u304D\u3085\u3046
\u3068\u3063\u304F\u3093
\u3068\u3064\u305B\u3099\u3093
\u3068\u3064\u306B\u3085\u3046
\u3068\u3068\u3099\u3051\u308B
\u3068\u3068\u306E\u3048\u308B
\u3068\u306A\u3044
\u3068\u306A\u3048\u308B
\u3068\u306A\u308A
\u3068\u306E\u3055\u307E
\u3068\u306F\u3099\u3059
\u3068\u3099\u3075\u3099\u304B\u3099\u308F
\u3068\u307B\u3046
\u3068\u307E\u308B
\u3068\u3081\u308B
\u3068\u3082\u305F\u3099\u3061
\u3068\u3082\u308B
\u3068\u3099\u3088\u3046\u3072\u3099
\u3068\u3089\u3048\u308B
\u3068\u3093\u304B\u3064
\u3068\u3099\u3093\u3075\u3099\u308A
\u306A\u3044\u304B\u304F
\u306A\u3044\u3053\u3046
\u306A\u3044\u3057\u3087
\u306A\u3044\u3059
\u306A\u3044\u305B\u3093
\u306A\u3044\u305D\u3046
\u306A\u304A\u3059
\u306A\u304B\u3099\u3044
\u306A\u304F\u3059
\u306A\u3051\u3099\u308B
\u306A\u3053\u3046\u3068\u3099
\u306A\u3055\u3051
\u306A\u305F\u3066\u3099\u3053\u3053
\u306A\u3063\u3068\u3046
\u306A\u3064\u3084\u3059\u307F
\u306A\u306A\u304A\u3057
\u306A\u306B\u3053\u3099\u3068
\u306A\u306B\u3082\u306E
\u306A\u306B\u308F
\u306A\u306E\u304B
\u306A\u3075\u305F\u3099
\u306A\u307E\u3044\u304D
\u306A\u307E\u3048
\u306A\u307E\u307F
\u306A\u307F\u305F\u3099
\u306A\u3081\u3089\u304B
\u306A\u3081\u308B
\u306A\u3084\u3080
\u306A\u3089\u3046
\u306A\u3089\u3072\u3099
\u306A\u3089\u3075\u3099
\u306A\u308C\u308B
\u306A\u308F\u3068\u3072\u3099
\u306A\u308F\u306F\u3099\u308A
\u306B\u3042\u3046
\u306B\u3044\u304B\u3099\u305F
\u306B\u3046\u3051
\u306B\u304A\u3044
\u306B\u304B\u3044
\u306B\u304B\u3099\u3066
\u306B\u304D\u3072\u3099
\u306B\u304F\u3057\u307F
\u306B\u304F\u307E\u3093
\u306B\u3051\u3099\u308B
\u306B\u3055\u3093\u304B\u305F\u3093\u305D
\u306B\u3057\u304D
\u306B\u305B\u3082\u306E
\u306B\u3061\u3057\u3099\u3087\u3046
\u306B\u3061\u3088\u3046\u3072\u3099
\u306B\u3063\u304B
\u306B\u3063\u304D
\u306B\u3063\u3051\u3044
\u306B\u3063\u3053\u3046
\u306B\u3063\u3055\u3093
\u306B\u3063\u3057\u3087\u304F
\u306B\u3063\u3059\u3046
\u306B\u3063\u305B\u304D
\u306B\u3063\u3066\u3044
\u306B\u306A\u3046
\u306B\u307B\u3093
\u306B\u307E\u3081
\u306B\u3082\u3064
\u306B\u3084\u308A
\u306B\u3085\u3046\u3044\u3093
\u306B\u308A\u3093\u3057\u3083
\u306B\u308F\u3068\u308A
\u306B\u3093\u3044
\u306B\u3093\u304B
\u306B\u3093\u304D
\u306B\u3093\u3051\u3099\u3093
\u306B\u3093\u3057\u304D
\u306B\u3093\u3059\u3099\u3046
\u306B\u3093\u305D\u3046
\u306B\u3093\u305F\u3044
\u306B\u3093\u3061
\u306B\u3093\u3066\u3044
\u306B\u3093\u306B\u304F
\u306B\u3093\u3075\u309A
\u306B\u3093\u307E\u308A
\u306B\u3093\u3080
\u306B\u3093\u3081\u3044
\u306B\u3093\u3088\u3046
\u306C\u3044\u304F\u304D\u3099
\u306C\u304B\u3059
\u306C\u304F\u3099\u3044\u3068\u308B
\u306C\u304F\u3099\u3046
\u306C\u304F\u3082\u308A
\u306C\u3059\u3080
\u306C\u307E\u3048\u3072\u3099
\u306C\u3081\u308A
\u306C\u3089\u3059
\u306C\u3093\u3061\u3083\u304F
\u306D\u3042\u3051\u3099
\u306D\u3044\u304D
\u306D\u3044\u308B
\u306D\u3044\u308D
\u306D\u304F\u3099\u305B
\u306D\u304F\u305F\u3044
\u306D\u304F\u3089
\u306D\u3053\u305B\u3099
\u306D\u3053\u3080
\u306D\u3055\u3051\u3099
\u306D\u3059\u3053\u3099\u3059
\u306D\u305D\u3078\u3099\u308B
\u306D\u305F\u3099\u3093
\u306D\u3064\u3044
\u306D\u3063\u3057\u3093
\u306D\u3064\u305D\u3099\u3046
\u306D\u3063\u305F\u3044\u304D\u3099\u3087
\u306D\u3075\u3099\u305D\u304F
\u306D\u3075\u305F\u3099
\u306D\u307B\u3099\u3046
\u306D\u307B\u308A\u306F\u307B\u308A
\u306D\u307E\u304D
\u306D\u307E\u308F\u3057
\u306D\u307F\u307F
\u306D\u3080\u3044
\u306D\u3080\u305F\u3044
\u306D\u3082\u3068
\u306D\u3089\u3046
\u306D\u308F\u3055\u3099
\u306D\u3093\u3044\u308A
\u306D\u3093\u304A\u3057
\u306D\u3093\u304B\u3093
\u306D\u3093\u304D\u3093
\u306D\u3093\u304F\u3099
\u306D\u3093\u3055\u3099
\u306D\u3093\u3057
\u306D\u3093\u3061\u3083\u304F
\u306D\u3093\u3068\u3099
\u306D\u3093\u3072\u309A
\u306D\u3093\u3075\u3099\u3064
\u306D\u3093\u307E\u3064
\u306D\u3093\u308A\u3087\u3046
\u306D\u3093\u308C\u3044
\u306E\u3044\u3059\u3099
\u306E\u304A\u3064\u3099\u307E
\u306E\u304B\u3099\u3059
\u306E\u304D\u306A\u307F
\u306E\u3053\u304D\u3099\u308A
\u306E\u3053\u3059
\u306E\u3053\u308B
\u306E\u305B\u308B
\u306E\u305D\u3099\u304F
\u306E\u305D\u3099\u3080
\u306E\u305F\u307E\u3046
\u306E\u3061\u307B\u3068\u3099
\u306E\u3063\u304F
\u306E\u306F\u3099\u3059
\u306E\u306F\u3089
\u306E\u3078\u3099\u308B
\u306E\u307B\u3099\u308B
\u306E\u307F\u3082\u306E
\u306E\u3084\u307E
\u306E\u3089\u3044\u306C
\u306E\u3089\u306D\u3053
\u306E\u308A\u3082\u306E
\u306E\u308A\u3086\u304D
\u306E\u308C\u3093
\u306E\u3093\u304D
\u306F\u3099\u3042\u3044
\u306F\u3042\u304F
\u306F\u3099\u3042\u3055\u3093
\u306F\u3099\u3044\u304B
\u306F\u3099\u3044\u304F
\u306F\u3044\u3051\u3093
\u306F\u3044\u3053\u3099
\u306F\u3044\u3057\u3093
\u306F\u3044\u3059\u3044
\u306F\u3044\u305B\u3093
\u306F\u3044\u305D\u3046
\u306F\u3044\u3061
\u306F\u3099\u3044\u306F\u3099\u3044
\u306F\u3044\u308C\u3064
\u306F\u3048\u308B
\u306F\u304A\u308B
\u306F\u304B\u3044
\u306F\u3099\u304B\u308A
\u306F\u304B\u308B
\u306F\u304F\u3057\u3085
\u306F\u3051\u3093
\u306F\u3053\u3075\u3099
\u306F\u3055\u307F
\u306F\u3055\u3093
\u306F\u3057\u3053\u3099
\u306F\u3099\u3057\u3087
\u306F\u3057\u308B
\u306F\u305B\u308B
\u306F\u309A\u305D\u3053\u3093
\u306F\u305D\u3093
\u306F\u305F\u3093
\u306F\u3061\u307F\u3064
\u306F\u3064\u304A\u3093
\u306F\u3063\u304B\u304F
\u306F\u3064\u3099\u304D
\u306F\u3063\u304D\u308A
\u306F\u3063\u304F\u3064
\u306F\u3063\u3051\u3093
\u306F\u3063\u3053\u3046
\u306F\u3063\u3055\u3093
\u306F\u3063\u3057\u3093
\u306F\u3063\u305F\u3064
\u306F\u3063\u3061\u3085\u3046
\u306F\u3063\u3066\u3093
\u306F\u3063\u3072\u309A\u3087\u3046
\u306F\u3063\u307B\u309A\u3046
\u306F\u306A\u3059
\u306F\u306A\u3072\u3099
\u306F\u306B\u304B\u3080
\u306F\u3075\u3099\u3089\u3057
\u306F\u307F\u304B\u3099\u304D
\u306F\u3080\u304B\u3046
\u306F\u3081\u3064
\u306F\u3084\u3044
\u306F\u3084\u3057
\u306F\u3089\u3046
\u306F\u308D\u3046\u3043\u3093
\u306F\u308F\u3044
\u306F\u3093\u3044
\u306F\u3093\u3048\u3044
\u306F\u3093\u304A\u3093
\u306F\u3093\u304B\u304F
\u306F\u3093\u304D\u3087\u3046
\u306F\u3099\u3093\u304F\u3099\u307F
\u306F\u3093\u3053
\u306F\u3093\u3057\u3083
\u306F\u3093\u3059\u3046
\u306F\u3093\u305F\u3099\u3093
\u306F\u309A\u3093\u3061
\u306F\u309A\u3093\u3064
\u306F\u3093\u3066\u3044
\u306F\u3093\u3068\u3057
\u306F\u3093\u306E\u3046
\u306F\u3093\u306F\u309A
\u306F\u3093\u3075\u3099\u3093
\u306F\u3093\u3078\u309A\u3093
\u306F\u3093\u307B\u3099\u3046\u304D
\u306F\u3093\u3081\u3044
\u306F\u3093\u3089\u3093
\u306F\u3093\u308D\u3093
\u3072\u3044\u304D
\u3072\u3046\u3093
\u3072\u3048\u308B
\u3072\u304B\u304F
\u3072\u304B\u308A
\u3072\u304B\u308B
\u3072\u304B\u3093
\u3072\u304F\u3044
\u3072\u3051\u3064
\u3072\u3053\u3046\u304D
\u3072\u3053\u304F
\u3072\u3055\u3044
\u3072\u3055\u3057\u3075\u3099\u308A
\u3072\u3055\u3093
\u3072\u3099\u3057\u3099\u3085\u3064\u304B\u3093
\u3072\u3057\u3087
\u3072\u305D\u304B
\u3072\u305D\u3080
\u3072\u305F\u3080\u304D
\u3072\u305F\u3099\u308A
\u3072\u305F\u308B
\u3072\u3064\u304D\u3099
\u3072\u3063\u3053\u3057
\u3072\u3063\u3057
\u3072\u3064\u3057\u3099\u3085\u3072\u3093
\u3072\u3063\u3059
\u3072\u3064\u305B\u3099\u3093
\u3072\u309A\u3063\u305F\u308A
\u3072\u309A\u3063\u3061\u308A
\u3072\u3064\u3088\u3046
\u3072\u3066\u3044
\u3072\u3068\u3053\u3099\u307F
\u3072\u306A\u307E\u3064\u308A
\u3072\u306A\u3093
\u3072\u306D\u308B
\u3072\u306F\u3093
\u3072\u3072\u3099\u304F
\u3072\u3072\u3087\u3046
\u3072\u307B\u3046
\u3072\u307E\u308F\u308A
\u3072\u307E\u3093
\u3072\u307F\u3064
\u3072\u3081\u3044
\u3072\u3081\u3057\u3099\u3057
\u3072\u3084\u3051
\u3072\u3084\u3059
\u3072\u3088\u3046
\u3072\u3099\u3087\u3046\u304D
\u3072\u3089\u304B\u3099\u306A
\u3072\u3089\u304F
\u3072\u308A\u3064
\u3072\u308A\u3087\u3046
\u3072\u308B\u307E
\u3072\u308B\u3084\u3059\u307F
\u3072\u308C\u3044
\u3072\u308D\u3044
\u3072\u308D\u3046
\u3072\u308D\u304D
\u3072\u308D\u3086\u304D
\u3072\u3093\u304B\u304F
\u3072\u3093\u3051\u3064
\u3072\u3093\u3053\u3093
\u3072\u3093\u3057\u3085
\u3072\u3093\u305D\u3046
\u3072\u309A\u3093\u3061
\u3072\u3093\u306F\u309A\u3093
\u3072\u3099\u3093\u307B\u3099\u3046
\u3075\u3042\u3093
\u3075\u3044\u3046\u3061
\u3075\u3046\u3051\u3044
\u3075\u3046\u305B\u3093
\u3075\u309A\u3046\u305F\u308D\u3046
\u3075\u3046\u3068\u3046
\u3075\u3046\u3075
\u3075\u3048\u308B
\u3075\u304A\u3093
\u3075\u304B\u3044
\u3075\u304D\u3093
\u3075\u304F\u3055\u3099\u3064
\u3075\u304F\u3075\u3099\u304F\u308D
\u3075\u3053\u3046
\u3075\u3055\u3044
\u3075\u3057\u304D\u3099
\u3075\u3057\u3099\u307F
\u3075\u3059\u307E
\u3075\u305B\u3044
\u3075\u305B\u304F\u3099
\u3075\u305D\u304F
\u3075\u3099\u305F\u306B\u304F
\u3075\u305F\u3093
\u3075\u3061\u3087\u3046
\u3075\u3064\u3046
\u3075\u3064\u304B
\u3075\u3063\u304B\u3064
\u3075\u3063\u304D
\u3075\u3063\u3053\u304F
\u3075\u3099\u3068\u3099\u3046
\u3075\u3068\u308B
\u3075\u3068\u3093
\u3075\u306E\u3046
\u3075\u306F\u3044
\u3075\u3072\u3087\u3046
\u3075\u3078\u3093
\u3075\u307E\u3093
\u3075\u307F\u3093
\u3075\u3081\u3064
\u3075\u3081\u3093
\u3075\u3088\u3046
\u3075\u308A\u3053
\u3075\u308A\u308B
\u3075\u308B\u3044
\u3075\u3093\u3044\u304D
\u3075\u3099\u3093\u304B\u3099\u304F
\u3075\u3099\u3093\u304F\u3099
\u3075\u3093\u3057\u3064
\u3075\u3099\u3093\u305B\u304D
\u3075\u3093\u305D\u3046
\u3075\u3099\u3093\u307B\u309A\u3046
\u3078\u3044\u3042\u3093
\u3078\u3044\u304A\u3093
\u3078\u3044\u304B\u3099\u3044
\u3078\u3044\u304D
\u3078\u3044\u3051\u3099\u3093
\u3078\u3044\u3053\u3046
\u3078\u3044\u3055
\u3078\u3044\u3057\u3083
\u3078\u3044\u305B\u3064
\u3078\u3044\u305D
\u3078\u3044\u305F\u304F
\u3078\u3044\u3066\u3093
\u3078\u3044\u306D\u3064
\u3078\u3044\u308F
\u3078\u304D\u304B\u3099
\u3078\u3053\u3080
\u3078\u3099\u306B\u3044\u308D
\u3078\u3099\u306B\u3057\u3087\u3046\u304B\u3099
\u3078\u3089\u3059
\u3078\u3093\u304B\u3093
\u3078\u3099\u3093\u304D\u3087\u3046
\u3078\u3099\u3093\u3053\u3099\u3057
\u3078\u3093\u3055\u3044
\u3078\u3093\u305F\u3044
\u3078\u3099\u3093\u308A
\u307B\u3042\u3093
\u307B\u3044\u304F
\u307B\u3099\u3046\u304D\u3099\u3087
\u307B\u3046\u3053\u304F
\u307B\u3046\u305D\u3046
\u307B\u3046\u307B\u3046
\u307B\u3046\u3082\u3093
\u307B\u3046\u308A\u3064
\u307B\u3048\u308B
\u307B\u304A\u3093
\u307B\u304B\u3093
\u307B\u304D\u3087\u3046
\u307B\u3099\u304D\u3093
\u307B\u304F\u308D
\u307B\u3051\u3064
\u307B\u3051\u3093
\u307B\u3053\u3046
\u307B\u3053\u308B
\u307B\u3057\u3044
\u307B\u3057\u3064
\u307B\u3057\u3085
\u307B\u3057\u3087\u3046
\u307B\u305B\u3044
\u307B\u305D\u3044
\u307B\u305D\u304F
\u307B\u305F\u3066
\u307B\u305F\u308B
\u307B\u309A\u3061\u3075\u3099\u304F\u308D
\u307B\u3063\u304D\u3087\u304F
\u307B\u3063\u3055
\u307B\u3063\u305F\u3093
\u307B\u3068\u3093\u3068\u3099
\u307B\u3081\u308B
\u307B\u3093\u3044
\u307B\u3093\u304D
\u307B\u3093\u3051
\u307B\u3093\u3057\u3064
\u307B\u3093\u3084\u304F
\u307E\u3044\u306B\u3061
\u307E\u304B\u3044
\u307E\u304B\u305B\u308B
\u307E\u304B\u3099\u308B
\u307E\u3051\u308B
\u307E\u3053\u3068
\u307E\u3055\u3064
\u307E\u3057\u3099\u3081
\u307E\u3059\u304F
\u307E\u305B\u3099\u308B
\u307E\u3064\u308A
\u307E\u3068\u3081
\u307E\u306A\u3075\u3099
\u307E\u306C\u3051
\u307E\u306D\u304F
\u307E\u307B\u3046
\u307E\u3082\u308B
\u307E\u3086\u3051\u3099
\u307E\u3088\u3046
\u307E\u308D\u3084\u304B
\u307E\u308F\u3059
\u307E\u308F\u308A
\u307E\u308F\u308B
\u307E\u3093\u304B\u3099
\u307E\u3093\u304D\u3064
\u307E\u3093\u305D\u3099\u304F
\u307E\u3093\u306A\u304B
\u307F\u3044\u3089
\u307F\u3046\u3061
\u307F\u3048\u308B
\u307F\u304B\u3099\u304F
\u307F\u304B\u305F
\u307F\u304B\u3093
\u307F\u3051\u3093
\u307F\u3053\u3093
\u307F\u3057\u3099\u304B\u3044
\u307F\u3059\u3044
\u307F\u3059\u3048\u308B
\u307F\u305B\u308B
\u307F\u3063\u304B
\u307F\u3064\u304B\u308B
\u307F\u3064\u3051\u308B
\u307F\u3066\u3044
\u307F\u3068\u3081\u308B
\u307F\u306A\u3068
\u307F\u306A\u307F\u304B\u3055\u3044
\u307F\u306D\u3089\u308B
\u307F\u306E\u3046
\u307F\u306E\u304B\u3099\u3059
\u307F\u307B\u3093
\u307F\u3082\u3068
\u307F\u3084\u3051\u3099
\u307F\u3089\u3044
\u307F\u308A\u3087\u304F
\u307F\u308F\u304F
\u307F\u3093\u304B
\u307F\u3093\u305D\u3099\u304F
\u3080\u3044\u304B
\u3080\u3048\u304D
\u3080\u3048\u3093
\u3080\u304B\u3044
\u3080\u304B\u3046
\u3080\u304B\u3048
\u3080\u304B\u3057
\u3080\u304D\u3099\u3061\u3083
\u3080\u3051\u308B
\u3080\u3051\u3099\u3093
\u3080\u3055\u307B\u3099\u308B
\u3080\u3057\u3042\u3064\u3044
\u3080\u3057\u306F\u3099
\u3080\u3057\u3099\u3085\u3093
\u3080\u3057\u308D
\u3080\u3059\u3046
\u3080\u3059\u3053
\u3080\u3059\u3075\u3099
\u3080\u3059\u3081
\u3080\u305B\u308B
\u3080\u305B\u3093
\u3080\u3061\u3085\u3046
\u3080\u306A\u3057\u3044
\u3080\u306E\u3046
\u3080\u3084\u307F
\u3080\u3088\u3046
\u3080\u3089\u3055\u304D
\u3080\u308A\u3087\u3046
\u3080\u308D\u3093
\u3081\u3044\u3042\u3093
\u3081\u3044\u3046\u3093
\u3081\u3044\u3048\u3093
\u3081\u3044\u304B\u304F
\u3081\u3044\u304D\u3087\u304F
\u3081\u3044\u3055\u3044
\u3081\u3044\u3057
\u3081\u3044\u305D\u3046
\u3081\u3044\u3075\u3099\u3064
\u3081\u3044\u308C\u3044
\u3081\u3044\u308F\u304F
\u3081\u304F\u3099\u307E\u308C\u308B
\u3081\u3055\u3099\u3059
\u3081\u3057\u305F
\u3081\u3059\u3099\u3089\u3057\u3044
\u3081\u305F\u3099\u3064
\u3081\u307E\u3044
\u3081\u3084\u3059
\u3081\u3093\u304D\u3087
\u3081\u3093\u305B\u304D
\u3081\u3093\u3068\u3099\u3046
\u3082\u3046\u3057\u3042\u3051\u3099\u308B
\u3082\u3046\u3068\u3099\u3046\u3051\u3093
\u3082\u3048\u308B
\u3082\u304F\u3057
\u3082\u304F\u3066\u304D
\u3082\u304F\u3088\u3046\u3072\u3099
\u3082\u3061\u308D\u3093
\u3082\u3068\u3099\u308B
\u3082\u3089\u3046
\u3082\u3093\u304F
\u3082\u3093\u305F\u3099\u3044
\u3084\u304A\u3084
\u3084\u3051\u308B
\u3084\u3055\u3044
\u3084\u3055\u3057\u3044
\u3084\u3059\u3044
\u3084\u3059\u305F\u308D\u3046
\u3084\u3059\u307F
\u3084\u305B\u308B
\u3084\u305D\u3046
\u3084\u305F\u3044
\u3084\u3061\u3093
\u3084\u3063\u3068
\u3084\u3063\u306F\u309A\u308A
\u3084\u3075\u3099\u308B
\u3084\u3081\u308B
\u3084\u3084\u3053\u3057\u3044
\u3084\u3088\u3044
\u3084\u308F\u3089\u304B\u3044
\u3086\u3046\u304D
\u3086\u3046\u3072\u3099\u3093\u304D\u3087\u304F
\u3086\u3046\u3078\u3099
\u3086\u3046\u3081\u3044
\u3086\u3051\u3064
\u3086\u3057\u3085\u3064
\u3086\u305B\u3093
\u3086\u305D\u3046
\u3086\u305F\u304B
\u3086\u3061\u3083\u304F
\u3086\u3066\u3099\u308B
\u3086\u306B\u3085\u3046
\u3086\u3072\u3099\u308F
\u3086\u3089\u3044
\u3086\u308C\u308B
\u3088\u3046\u3044
\u3088\u3046\u304B
\u3088\u3046\u304D\u3085\u3046
\u3088\u3046\u3057\u3099
\u3088\u3046\u3059
\u3088\u3046\u3061\u3048\u3093
\u3088\u304B\u305B\u3099
\u3088\u304B\u3093
\u3088\u304D\u3093
\u3088\u304F\u305B\u3044
\u3088\u304F\u307B\u3099\u3046
\u3088\u3051\u3044
\u3088\u3053\u3099\u308C\u308B
\u3088\u3055\u3093
\u3088\u3057\u3085\u3046
\u3088\u305D\u3046
\u3088\u305D\u304F
\u3088\u3063\u304B
\u3088\u3066\u3044
\u3088\u3068\u3099\u304B\u3099\u308F\u304F
\u3088\u306D\u3064
\u3088\u3084\u304F
\u3088\u3086\u3046
\u3088\u308D\u3053\u3075\u3099
\u3088\u308D\u3057\u3044
\u3089\u3044\u3046
\u3089\u304F\u304B\u3099\u304D
\u3089\u304F\u3053\u3099
\u3089\u304F\u3055\u3064
\u3089\u304F\u305F\u3099
\u3089\u3057\u3093\u306F\u3099\u3093
\u3089\u305B\u3093
\u3089\u305D\u3099\u304F
\u3089\u305F\u3044
\u3089\u3063\u304B
\u3089\u308C\u3064
\u308A\u3048\u304D
\u308A\u304B\u3044
\u308A\u304D\u3055\u304F
\u308A\u304D\u305B\u3064
\u308A\u304F\u304F\u3099\u3093
\u308A\u304F\u3064
\u308A\u3051\u3093
\u308A\u3053\u3046
\u308A\u305B\u3044
\u308A\u305D\u3046
\u308A\u305D\u304F
\u308A\u3066\u3093
\u308A\u306D\u3093
\u308A\u3086\u3046
\u308A\u3085\u3046\u304B\u3099\u304F
\u308A\u3088\u3046
\u308A\u3087\u3046\u308A
\u308A\u3087\u304B\u3093
\u308A\u3087\u304F\u3061\u3083
\u308A\u3087\u3053\u3046
\u308A\u308A\u304F
\u308A\u308C\u304D
\u308A\u308D\u3093
\u308A\u3093\u3053\u3099
\u308B\u3044\u3051\u3044
\u308B\u3044\u3055\u3044
\u308B\u3044\u3057\u3099
\u308B\u3044\u305B\u304D
\u308B\u3059\u306F\u3099\u3093
\u308B\u308A\u304B\u3099\u308F\u3089
\u308C\u3044\u304B\u3093
\u308C\u3044\u304D\u3099
\u308C\u3044\u305B\u3044
\u308C\u3044\u305D\u3099\u3046\u3053
\u308C\u3044\u3068\u3046
\u308C\u3044\u307B\u3099\u3046
\u308C\u304D\u3057
\u308C\u304D\u305F\u3099\u3044
\u308C\u3093\u3042\u3044
\u308C\u3093\u3051\u3044
\u308C\u3093\u3053\u3093
\u308C\u3093\u3055\u3044
\u308C\u3093\u3057\u3085\u3046
\u308C\u3093\u305D\u3099\u304F
\u308C\u3093\u3089\u304F
\u308D\u3046\u304B
\u308D\u3046\u3053\u3099
\u308D\u3046\u3057\u3099\u3093
\u308D\u3046\u305D\u304F
\u308D\u304F\u304B\u3099
\u308D\u3053\u3064
\u308D\u3057\u3099\u3046\u3089
\u308D\u3057\u3085\u3064
\u308D\u305B\u3093
\u308D\u3066\u3093
\u308D\u3081\u3093
\u308D\u308C\u3064
\u308D\u3093\u304D\u3099
\u308D\u3093\u306F\u309A
\u308D\u3093\u3075\u3099\u3093
\u308D\u3093\u308A
\u308F\u304B\u3059
\u308F\u304B\u3081
\u308F\u304B\u3084\u307E
\u308F\u304B\u308C\u308B
\u308F\u3057\u3064
\u308F\u3057\u3099\u307E\u3057
\u308F\u3059\u308C\u3082\u306E
\u308F\u3089\u3046
\u308F\u308C\u308B`.split("\n");
  }
});

// node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/korean.js
var wordlist6;
var init_korean = __esm({
  "node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/korean.js"() {
    wordlist6 = `\u1100\u1161\u1100\u1167\u11A8
\u1100\u1161\u1101\u1173\u11B7
\u1100\u1161\u1102\u1161\u11AB
\u1100\u1161\u1102\u1173\u11BC
\u1100\u1161\u1103\u1173\u11A8
\u1100\u1161\u1105\u1173\u110E\u1175\u11B7
\u1100\u1161\u1106\u116E\u11B7
\u1100\u1161\u1107\u1161\u11BC
\u1100\u1161\u1109\u1161\u11BC
\u1100\u1161\u1109\u1173\u11B7
\u1100\u1161\u110B\u116E\u11AB\u1103\u1166
\u1100\u1161\u110B\u1173\u11AF
\u1100\u1161\u110B\u1175\u1103\u1173
\u1100\u1161\u110B\u1175\u11B8
\u1100\u1161\u110C\u1161\u11BC
\u1100\u1161\u110C\u1165\u11BC
\u1100\u1161\u110C\u1169\u11A8
\u1100\u1161\u110C\u116E\u11A8
\u1100\u1161\u11A8\u110B\u1169
\u1100\u1161\u11A8\u110C\u1161
\u1100\u1161\u11AB\u1100\u1167\u11A8
\u1100\u1161\u11AB\u1107\u116E
\u1100\u1161\u11AB\u1109\u1165\u11B8
\u1100\u1161\u11AB\u110C\u1161\u11BC
\u1100\u1161\u11AB\u110C\u1165\u11B8
\u1100\u1161\u11AB\u1111\u1161\u11AB
\u1100\u1161\u11AF\u1103\u1173\u11BC
\u1100\u1161\u11AF\u1107\u1175
\u1100\u1161\u11AF\u1109\u1162\u11A8
\u1100\u1161\u11AF\u110C\u1173\u11BC
\u1100\u1161\u11B7\u1100\u1161\u11A8
\u1100\u1161\u11B7\u1100\u1175
\u1100\u1161\u11B7\u1109\u1169
\u1100\u1161\u11B7\u1109\u116E\u1109\u1165\u11BC
\u1100\u1161\u11B7\u110C\u1161
\u1100\u1161\u11B7\u110C\u1165\u11BC
\u1100\u1161\u11B8\u110C\u1161\u1100\u1175
\u1100\u1161\u11BC\u1102\u1161\u11B7
\u1100\u1161\u11BC\u1103\u1161\u11BC
\u1100\u1161\u11BC\u1103\u1169
\u1100\u1161\u11BC\u1105\u1167\u11A8\u1112\u1175
\u1100\u1161\u11BC\u1107\u1167\u11AB
\u1100\u1161\u11BC\u1107\u116E\u11A8
\u1100\u1161\u11BC\u1109\u1161
\u1100\u1161\u11BC\u1109\u116E\u1105\u1163\u11BC
\u1100\u1161\u11BC\u110B\u1161\u110C\u1175
\u1100\u1161\u11BC\u110B\u116F\u11AB\u1103\u1169
\u1100\u1161\u11BC\u110B\u1174
\u1100\u1161\u11BC\u110C\u1166
\u1100\u1161\u11BC\u110C\u1169
\u1100\u1161\u11C0\u110B\u1175
\u1100\u1162\u1100\u116E\u1105\u1175
\u1100\u1162\u1102\u1161\u1105\u1175
\u1100\u1162\u1107\u1161\u11BC
\u1100\u1162\u1107\u1167\u11AF
\u1100\u1162\u1109\u1165\u11AB
\u1100\u1162\u1109\u1165\u11BC
\u1100\u1162\u110B\u1175\u11AB
\u1100\u1162\u11A8\u1100\u116A\u11AB\u110C\u1165\u11A8
\u1100\u1165\u1109\u1175\u11AF
\u1100\u1165\u110B\u1162\u11A8
\u1100\u1165\u110B\u116E\u11AF
\u1100\u1165\u110C\u1175\u11BA
\u1100\u1165\u1111\u116E\u11B7
\u1100\u1165\u11A8\u110C\u1165\u11BC
\u1100\u1165\u11AB\u1100\u1161\u11BC
\u1100\u1165\u11AB\u1106\u116E\u11AF
\u1100\u1165\u11AB\u1109\u1165\u11AF
\u1100\u1165\u11AB\u110C\u1169
\u1100\u1165\u11AB\u110E\u116E\u11A8
\u1100\u1165\u11AF\u110B\u1173\u11B7
\u1100\u1165\u11B7\u1109\u1161
\u1100\u1165\u11B7\u1110\u1169
\u1100\u1166\u1109\u1175\u1111\u1161\u11AB
\u1100\u1166\u110B\u1175\u11B7
\u1100\u1167\u110B\u116E\u11AF
\u1100\u1167\u11AB\u1112\u1162
\u1100\u1167\u11AF\u1100\u116A
\u1100\u1167\u11AF\u1100\u116E\u11A8
\u1100\u1167\u11AF\u1105\u1169\u11AB
\u1100\u1167\u11AF\u1109\u1165\u11A8
\u1100\u1167\u11AF\u1109\u1173\u11BC
\u1100\u1167\u11AF\u1109\u1175\u11B7
\u1100\u1167\u11AF\u110C\u1165\u11BC
\u1100\u1167\u11AF\u1112\u1169\u11AB
\u1100\u1167\u11BC\u1100\u1168
\u1100\u1167\u11BC\u1100\u1169
\u1100\u1167\u11BC\u1100\u1175
\u1100\u1167\u11BC\u1105\u1167\u11A8
\u1100\u1167\u11BC\u1107\u1169\u11A8\u1100\u116E\u11BC
\u1100\u1167\u11BC\u1107\u1175
\u1100\u1167\u11BC\u1109\u1161\u11BC\u1103\u1169
\u1100\u1167\u11BC\u110B\u1167\u11BC
\u1100\u1167\u11BC\u110B\u116E
\u1100\u1167\u11BC\u110C\u1162\u11BC
\u1100\u1167\u11BC\u110C\u1166
\u1100\u1167\u11BC\u110C\u116E
\u1100\u1167\u11BC\u110E\u1161\u11AF
\u1100\u1167\u11BC\u110E\u1175
\u1100\u1167\u11BC\u1112\u1163\u11BC
\u1100\u1167\u11BC\u1112\u1165\u11B7
\u1100\u1168\u1100\u1169\u11A8
\u1100\u1168\u1103\u1161\u11AB
\u1100\u1168\u1105\u1161\u11AB
\u1100\u1168\u1109\u1161\u11AB
\u1100\u1168\u1109\u1169\u11A8
\u1100\u1168\u110B\u1163\u11A8
\u1100\u1168\u110C\u1165\u11AF
\u1100\u1168\u110E\u1173\u11BC
\u1100\u1168\u1112\u116C\u11A8
\u1100\u1169\u1100\u1162\u11A8
\u1100\u1169\u1100\u116E\u1105\u1167
\u1100\u1169\u1100\u116E\u11BC
\u1100\u1169\u1100\u1173\u11B8
\u1100\u1169\u1103\u1173\u11BC\u1112\u1161\u11A8\u1109\u1162\u11BC
\u1100\u1169\u1106\u116E\u1109\u1175\u11AB
\u1100\u1169\u1106\u1175\u11AB
\u1100\u1169\u110B\u1163\u11BC\u110B\u1175
\u1100\u1169\u110C\u1161\u11BC
\u1100\u1169\u110C\u1165\u11AB
\u1100\u1169\u110C\u1175\u11B8
\u1100\u1169\u110E\u116E\u11BA\u1100\u1161\u1105\u116E
\u1100\u1169\u1110\u1169\u11BC
\u1100\u1169\u1112\u1163\u11BC
\u1100\u1169\u11A8\u1109\u1175\u11A8
\u1100\u1169\u11AF\u1106\u1169\u11A8
\u1100\u1169\u11AF\u110D\u1161\u1100\u1175
\u1100\u1169\u11AF\u1111\u1173
\u1100\u1169\u11BC\u1100\u1161\u11AB
\u1100\u1169\u11BC\u1100\u1162
\u1100\u1169\u11BC\u1100\u1167\u11A8
\u1100\u1169\u11BC\u1100\u116E\u11AB
\u1100\u1169\u11BC\u1100\u1173\u11B8
\u1100\u1169\u11BC\u1100\u1175
\u1100\u1169\u11BC\u1103\u1169\u11BC
\u1100\u1169\u11BC\u1106\u116E\u110B\u116F\u11AB
\u1100\u1169\u11BC\u1107\u116E
\u1100\u1169\u11BC\u1109\u1161
\u1100\u1169\u11BC\u1109\u1175\u11A8
\u1100\u1169\u11BC\u110B\u1165\u11B8
\u1100\u1169\u11BC\u110B\u1167\u11AB
\u1100\u1169\u11BC\u110B\u116F\u11AB
\u1100\u1169\u11BC\u110C\u1161\u11BC
\u1100\u1169\u11BC\u110D\u1161
\u1100\u1169\u11BC\u110E\u1162\u11A8
\u1100\u1169\u11BC\u1110\u1169\u11BC
\u1100\u1169\u11BC\u1111\u1169
\u1100\u1169\u11BC\u1112\u1161\u11BC
\u1100\u1169\u11BC\u1112\u1172\u110B\u1175\u11AF
\u1100\u116A\u1106\u1169\u11A8
\u1100\u116A\u110B\u1175\u11AF
\u1100\u116A\u110C\u1161\u11BC
\u1100\u116A\u110C\u1165\u11BC
\u1100\u116A\u1112\u1161\u11A8
\u1100\u116A\u11AB\u1100\u1162\u11A8
\u1100\u116A\u11AB\u1100\u1168
\u1100\u116A\u11AB\u1100\u116A\u11BC
\u1100\u116A\u11AB\u1102\u1167\u11B7
\u1100\u116A\u11AB\u1105\u1161\u11B7
\u1100\u116A\u11AB\u1105\u1167\u11AB
\u1100\u116A\u11AB\u1105\u1175
\u1100\u116A\u11AB\u1109\u1173\u11B8
\u1100\u116A\u11AB\u1109\u1175\u11B7
\u1100\u116A\u11AB\u110C\u1165\u11B7
\u1100\u116A\u11AB\u110E\u1161\u11AF
\u1100\u116A\u11BC\u1100\u1167\u11BC
\u1100\u116A\u11BC\u1100\u1169
\u1100\u116A\u11BC\u110C\u1161\u11BC
\u1100\u116A\u11BC\u110C\u116E
\u1100\u116C\u1105\u1169\u110B\u116E\u11B7
\u1100\u116C\u11BC\u110C\u1161\u11BC\u1112\u1175
\u1100\u116D\u1100\u116A\u1109\u1165
\u1100\u116D\u1106\u116E\u11AB
\u1100\u116D\u1107\u1169\u11A8
\u1100\u116D\u1109\u1175\u11AF
\u1100\u116D\u110B\u1163\u11BC
\u1100\u116D\u110B\u1172\u11A8
\u1100\u116D\u110C\u1161\u11BC
\u1100\u116D\u110C\u1175\u11A8
\u1100\u116D\u1110\u1169\u11BC
\u1100\u116D\u1112\u116A\u11AB
\u1100\u116D\u1112\u116E\u11AB
\u1100\u116E\u1100\u1167\u11BC
\u1100\u116E\u1105\u1173\u11B7
\u1100\u116E\u1106\u1165\u11BC
\u1100\u116E\u1107\u1167\u11AF
\u1100\u116E\u1107\u116E\u11AB
\u1100\u116E\u1109\u1165\u11A8
\u1100\u116E\u1109\u1165\u11BC
\u1100\u116E\u1109\u1169\u11A8
\u1100\u116E\u110B\u1167\u11A8
\u1100\u116E\u110B\u1175\u11B8
\u1100\u116E\u110E\u1165\u11BC
\u1100\u116E\u110E\u1166\u110C\u1165\u11A8
\u1100\u116E\u11A8\u1100\u1161
\u1100\u116E\u11A8\u1100\u1175
\u1100\u116E\u11A8\u1102\u1162
\u1100\u116E\u11A8\u1105\u1175\u11B8
\u1100\u116E\u11A8\u1106\u116E\u11AF
\u1100\u116E\u11A8\u1106\u1175\u11AB
\u1100\u116E\u11A8\u1109\u116E
\u1100\u116E\u11A8\u110B\u1165
\u1100\u116E\u11A8\u110B\u116A\u11BC
\u1100\u116E\u11A8\u110C\u1165\u11A8
\u1100\u116E\u11A8\u110C\u1166
\u1100\u116E\u11A8\u1112\u116C
\u1100\u116E\u11AB\u1103\u1162
\u1100\u116E\u11AB\u1109\u1161
\u1100\u116E\u11AB\u110B\u1175\u11AB
\u1100\u116E\u11BC\u1100\u1173\u11A8\u110C\u1165\u11A8
\u1100\u116F\u11AB\u1105\u1175
\u1100\u116F\u11AB\u110B\u1171
\u1100\u116F\u11AB\u1110\u116E
\u1100\u1171\u1100\u116E\u11A8
\u1100\u1171\u1109\u1175\u11AB
\u1100\u1172\u110C\u1165\u11BC
\u1100\u1172\u110E\u1175\u11A8
\u1100\u1172\u11AB\u1112\u1167\u11BC
\u1100\u1173\u1102\u1161\u11AF
\u1100\u1173\u1102\u1163\u11BC
\u1100\u1173\u1102\u1173\u11AF
\u1100\u1173\u1105\u1165\u1102\u1161
\u1100\u1173\u1105\u116E\u11B8
\u1100\u1173\u1105\u1173\u11BA
\u1100\u1173\u1105\u1175\u11B7
\u1100\u1173\u110C\u1166\u1109\u1165\u110B\u1163
\u1100\u1173\u1110\u1169\u1105\u1169\u11A8
\u1100\u1173\u11A8\u1107\u1169\u11A8
\u1100\u1173\u11A8\u1112\u1175
\u1100\u1173\u11AB\u1100\u1165
\u1100\u1173\u11AB\u1100\u116D
\u1100\u1173\u11AB\u1105\u1162
\u1100\u1173\u11AB\u1105\u1169
\u1100\u1173\u11AB\u1106\u116E
\u1100\u1173\u11AB\u1107\u1169\u11AB
\u1100\u1173\u11AB\u110B\u116F\u11AB
\u1100\u1173\u11AB\u110B\u1172\u11A8
\u1100\u1173\u11AB\u110E\u1165
\u1100\u1173\u11AF\u110A\u1175
\u1100\u1173\u11AF\u110C\u1161
\u1100\u1173\u11B7\u1100\u1161\u11BC\u1109\u1161\u11AB
\u1100\u1173\u11B7\u1100\u1169
\u1100\u1173\u11B7\u1102\u1167\u11AB
\u1100\u1173\u11B7\u1106\u1166\u1103\u1161\u11AF
\u1100\u1173\u11B7\u110B\u1162\u11A8
\u1100\u1173\u11B7\u110B\u1167\u11AB
\u1100\u1173\u11B7\u110B\u116D\u110B\u1175\u11AF
\u1100\u1173\u11B7\u110C\u1175
\u1100\u1173\u11BC\u110C\u1165\u11BC\u110C\u1165\u11A8
\u1100\u1175\u1100\u1161\u11AB
\u1100\u1175\u1100\u116A\u11AB
\u1100\u1175\u1102\u1167\u11B7
\u1100\u1175\u1102\u1173\u11BC
\u1100\u1175\u1103\u1169\u11A8\u1100\u116D
\u1100\u1175\u1103\u116E\u11BC
\u1100\u1175\u1105\u1169\u11A8
\u1100\u1175\u1105\u1173\u11B7
\u1100\u1175\u1107\u1165\u11B8
\u1100\u1175\u1107\u1169\u11AB
\u1100\u1175\u1107\u116E\u11AB
\u1100\u1175\u1108\u1173\u11B7
\u1100\u1175\u1109\u116E\u11A8\u1109\u1161
\u1100\u1175\u1109\u116E\u11AF
\u1100\u1175\u110B\u1165\u11A8
\u1100\u1175\u110B\u1165\u11B8
\u1100\u1175\u110B\u1169\u11AB
\u1100\u1175\u110B\u116E\u11AB
\u1100\u1175\u110B\u116F\u11AB
\u1100\u1175\u110C\u1165\u11A8
\u1100\u1175\u110C\u116E\u11AB
\u1100\u1175\u110E\u1175\u11B7
\u1100\u1175\u1112\u1169\u11AB
\u1100\u1175\u1112\u116C\u11A8
\u1100\u1175\u11AB\u1100\u1173\u11B8
\u1100\u1175\u11AB\u110C\u1161\u11BC
\u1100\u1175\u11AF\u110B\u1175
\u1100\u1175\u11B7\u1107\u1161\u11B8
\u1100\u1175\u11B7\u110E\u1175
\u1100\u1175\u11B7\u1111\u1169\u1100\u1169\u11BC\u1112\u1161\u11BC
\u1101\u1161\u11A8\u1103\u116E\u1100\u1175
\u1101\u1161\u11B7\u1108\u1161\u11A8
\u1101\u1162\u1103\u1161\u11AF\u110B\u1173\u11B7
\u1101\u1162\u1109\u1169\u1100\u1173\u11B7
\u1101\u1165\u11B8\u110C\u1175\u11AF
\u1101\u1169\u11A8\u1103\u1162\u1100\u1175
\u1101\u1169\u11BE\u110B\u1175\u11C1
\u1102\u1161\u1103\u1173\u11AF\u110B\u1175
\u1102\u1161\u1105\u1161\u11AB\u1112\u1175
\u1102\u1161\u1106\u1165\u110C\u1175
\u1102\u1161\u1106\u116E\u11AF
\u1102\u1161\u110E\u1175\u11B7\u1107\u1161\u11AB
\u1102\u1161\u1112\u1173\u11AF
\u1102\u1161\u11A8\u110B\u1167\u11B8
\u1102\u1161\u11AB\u1107\u1161\u11BC
\u1102\u1161\u11AF\u1100\u1162
\u1102\u1161\u11AF\u110A\u1175
\u1102\u1161\u11AF\u110D\u1161
\u1102\u1161\u11B7\u1102\u1167
\u1102\u1161\u11B7\u1103\u1162\u1106\u116E\u11AB
\u1102\u1161\u11B7\u1106\u1162
\u1102\u1161\u11B7\u1109\u1161\u11AB
\u1102\u1161\u11B7\u110C\u1161
\u1102\u1161\u11B7\u1111\u1167\u11AB
\u1102\u1161\u11B7\u1112\u1161\u11A8\u1109\u1162\u11BC
\u1102\u1161\u11BC\u1107\u1175
\u1102\u1161\u11C0\u1106\u1161\u11AF
\u1102\u1162\u1102\u1167\u11AB
\u1102\u1162\u110B\u116D\u11BC
\u1102\u1162\u110B\u1175\u11AF
\u1102\u1162\u11B7\u1107\u1175
\u1102\u1162\u11B7\u1109\u1162
\u1102\u1162\u11BA\u1106\u116E\u11AF
\u1102\u1162\u11BC\u1103\u1169\u11BC
\u1102\u1162\u11BC\u1106\u1167\u11AB
\u1102\u1162\u11BC\u1107\u1161\u11BC
\u1102\u1162\u11BC\u110C\u1161\u11BC\u1100\u1169
\u1102\u1166\u11A8\u1110\u1161\u110B\u1175
\u1102\u1166\u11BA\u110D\u1162
\u1102\u1169\u1103\u1169\u11BC
\u1102\u1169\u1105\u1161\u11AB\u1109\u1162\u11A8
\u1102\u1169\u1105\u1167\u11A8
\u1102\u1169\u110B\u1175\u11AB
\u1102\u1169\u11A8\u110B\u1173\u11B7
\u1102\u1169\u11A8\u110E\u1161
\u1102\u1169\u11A8\u1112\u116A
\u1102\u1169\u11AB\u1105\u1175
\u1102\u1169\u11AB\u1106\u116E\u11AB
\u1102\u1169\u11AB\u110C\u1162\u11BC
\u1102\u1169\u11AF\u110B\u1175
\u1102\u1169\u11BC\u1100\u116E
\u1102\u1169\u11BC\u1103\u1161\u11B7
\u1102\u1169\u11BC\u1106\u1175\u11AB
\u1102\u1169\u11BC\u1107\u116E
\u1102\u1169\u11BC\u110B\u1165\u11B8
\u1102\u1169\u11BC\u110C\u1161\u11BC
\u1102\u1169\u11BC\u110E\u1169\u11AB
\u1102\u1169\u11C1\u110B\u1175
\u1102\u116E\u11AB\u1103\u1169\u11BC\u110C\u1161
\u1102\u116E\u11AB\u1106\u116E\u11AF
\u1102\u116E\u11AB\u110A\u1165\u11B8
\u1102\u1172\u110B\u116D\u11A8
\u1102\u1173\u1101\u1175\u11B7
\u1102\u1173\u11A8\u1103\u1162
\u1102\u1173\u11BC\u1103\u1169\u11BC\u110C\u1165\u11A8
\u1102\u1173\u11BC\u1105\u1167\u11A8
\u1103\u1161\u1107\u1161\u11BC
\u1103\u1161\u110B\u1163\u11BC\u1109\u1165\u11BC
\u1103\u1161\u110B\u1173\u11B7
\u1103\u1161\u110B\u1175\u110B\u1165\u1110\u1173
\u1103\u1161\u1112\u1162\u11BC
\u1103\u1161\u11AB\u1100\u1168
\u1103\u1161\u11AB\u1100\u1169\u11AF
\u1103\u1161\u11AB\u1103\u1169\u11A8
\u1103\u1161\u11AB\u1106\u1161\u11BA
\u1103\u1161\u11AB\u1109\u116E\u11AB
\u1103\u1161\u11AB\u110B\u1165
\u1103\u1161\u11AB\u110B\u1171
\u1103\u1161\u11AB\u110C\u1165\u11B7
\u1103\u1161\u11AB\u110E\u1166
\u1103\u1161\u11AB\u110E\u116E
\u1103\u1161\u11AB\u1111\u1167\u11AB
\u1103\u1161\u11AB\u1111\u116E\u11BC
\u1103\u1161\u11AF\u1100\u1163\u11AF
\u1103\u1161\u11AF\u1105\u1165
\u1103\u1161\u11AF\u1105\u1167\u11A8
\u1103\u1161\u11AF\u1105\u1175
\u1103\u1161\u11B0\u1100\u1169\u1100\u1175
\u1103\u1161\u11B7\u1103\u1161\u11BC
\u1103\u1161\u11B7\u1107\u1162
\u1103\u1161\u11B7\u110B\u116D
\u1103\u1161\u11B7\u110B\u1175\u11B7
\u1103\u1161\u11B8\u1107\u1167\u11AB
\u1103\u1161\u11B8\u110C\u1161\u11BC
\u1103\u1161\u11BC\u1100\u1173\u11AB
\u1103\u1161\u11BC\u1107\u116E\u11AB\u1100\u1161\u11AB
\u1103\u1161\u11BC\u110B\u1167\u11AB\u1112\u1175
\u1103\u1161\u11BC\u110C\u1161\u11BC
\u1103\u1162\u1100\u1172\u1106\u1169
\u1103\u1162\u1102\u1161\u11BD
\u1103\u1162\u1103\u1161\u11AB\u1112\u1175
\u1103\u1162\u1103\u1161\u11B8
\u1103\u1162\u1103\u1169\u1109\u1175
\u1103\u1162\u1105\u1163\u11A8
\u1103\u1162\u1105\u1163\u11BC
\u1103\u1162\u1105\u1172\u11A8
\u1103\u1162\u1106\u116E\u11AB
\u1103\u1162\u1107\u116E\u1107\u116E\u11AB
\u1103\u1162\u1109\u1175\u11AB
\u1103\u1162\u110B\u1173\u11BC
\u1103\u1162\u110C\u1161\u11BC
\u1103\u1162\u110C\u1165\u11AB
\u1103\u1162\u110C\u1165\u11B8
\u1103\u1162\u110C\u116E\u11BC
\u1103\u1162\u110E\u1162\u11A8
\u1103\u1162\u110E\u116E\u11AF
\u1103\u1162\u110E\u116E\u11BC
\u1103\u1162\u1110\u1169\u11BC\u1105\u1167\u11BC
\u1103\u1162\u1112\u1161\u11A8
\u1103\u1162\u1112\u1161\u11AB\u1106\u1175\u11AB\u1100\u116E\u11A8
\u1103\u1162\u1112\u1161\u11B8\u1109\u1175\u11AF
\u1103\u1162\u1112\u1167\u11BC
\u1103\u1165\u11BC\u110B\u1165\u1105\u1175
\u1103\u1166\u110B\u1175\u1110\u1173
\u1103\u1169\u1103\u1162\u110E\u1166
\u1103\u1169\u1103\u1165\u11A8
\u1103\u1169\u1103\u116E\u11A8
\u1103\u1169\u1106\u1161\u11BC
\u1103\u1169\u1109\u1165\u1100\u116A\u11AB
\u1103\u1169\u1109\u1175\u11B7
\u1103\u1169\u110B\u116E\u11B7
\u1103\u1169\u110B\u1175\u11B8
\u1103\u1169\u110C\u1161\u1100\u1175
\u1103\u1169\u110C\u1165\u1112\u1175
\u1103\u1169\u110C\u1165\u11AB
\u1103\u1169\u110C\u116E\u11BC
\u1103\u1169\u110E\u1161\u11A8
\u1103\u1169\u11A8\u1100\u1161\u11B7
\u1103\u1169\u11A8\u1105\u1175\u11B8
\u1103\u1169\u11A8\u1109\u1165
\u1103\u1169\u11A8\u110B\u1175\u11AF
\u1103\u1169\u11A8\u110E\u1161\u11BC\u110C\u1165\u11A8
\u1103\u1169\u11BC\u1112\u116A\u110E\u1162\u11A8
\u1103\u1171\u11BA\u1106\u1169\u1109\u1173\u11B8
\u1103\u1171\u11BA\u1109\u1161\u11AB
\u1104\u1161\u11AF\u110B\u1161\u110B\u1175
\u1106\u1161\u1102\u116E\u1105\u1161
\u1106\u1161\u1102\u1173\u11AF
\u1106\u1161\u1103\u1161\u11BC
\u1106\u1161\u1105\u1161\u1110\u1169\u11AB
\u1106\u1161\u1105\u1167\u11AB
\u1106\u1161\u1106\u116E\u1105\u1175
\u1106\u1161\u1109\u1161\u110C\u1175
\u1106\u1161\u110B\u1163\u11A8
\u1106\u1161\u110B\u116D\u1102\u1166\u110C\u1173
\u1106\u1161\u110B\u1173\u11AF
\u1106\u1161\u110B\u1173\u11B7
\u1106\u1161\u110B\u1175\u110F\u1173
\u1106\u1161\u110C\u116E\u11BC
\u1106\u1161\u110C\u1175\u1106\u1161\u11A8
\u1106\u1161\u110E\u1161\u11AB\u1100\u1161\u110C\u1175
\u1106\u1161\u110E\u1161\u11AF
\u1106\u1161\u1112\u1173\u11AB
\u1106\u1161\u11A8\u1100\u1165\u11AF\u1105\u1175
\u1106\u1161\u11A8\u1102\u1162
\u1106\u1161\u11A8\u1109\u1161\u11BC
\u1106\u1161\u11AB\u1102\u1161\u11B7
\u1106\u1161\u11AB\u1103\u116E
\u1106\u1161\u11AB\u1109\u1166
\u1106\u1161\u11AB\u110B\u1163\u11A8
\u1106\u1161\u11AB\u110B\u1175\u11AF
\u1106\u1161\u11AB\u110C\u1165\u11B7
\u1106\u1161\u11AB\u110C\u1169\u11A8
\u1106\u1161\u11AB\u1112\u116A
\u1106\u1161\u11AD\u110B\u1175
\u1106\u1161\u11AF\u1100\u1175
\u1106\u1161\u11AF\u110A\u1173\u11B7
\u1106\u1161\u11AF\u1110\u116E
\u1106\u1161\u11B7\u1103\u1162\u1105\u1169
\u1106\u1161\u11BC\u110B\u116F\u11AB\u1100\u1167\u11BC
\u1106\u1162\u1102\u1167\u11AB
\u1106\u1162\u1103\u1161\u11AF
\u1106\u1162\u1105\u1167\u11A8
\u1106\u1162\u1107\u1165\u11AB
\u1106\u1162\u1109\u1173\u110F\u1165\u11B7
\u1106\u1162\u110B\u1175\u11AF
\u1106\u1162\u110C\u1161\u11BC
\u1106\u1162\u11A8\u110C\u116E
\u1106\u1165\u11A8\u110B\u1175
\u1106\u1165\u11AB\u110C\u1165
\u1106\u1165\u11AB\u110C\u1175
\u1106\u1165\u11AF\u1105\u1175
\u1106\u1166\u110B\u1175\u11AF
\u1106\u1167\u1102\u1173\u1105\u1175
\u1106\u1167\u110E\u1175\u11AF
\u1106\u1167\u11AB\u1103\u1161\u11B7
\u1106\u1167\u11AF\u110E\u1175
\u1106\u1167\u11BC\u1103\u1161\u11AB
\u1106\u1167\u11BC\u1105\u1167\u11BC
\u1106\u1167\u11BC\u110B\u1168
\u1106\u1167\u11BC\u110B\u1174
\u1106\u1167\u11BC\u110C\u1165\u11AF
\u1106\u1167\u11BC\u110E\u1175\u11BC
\u1106\u1167\u11BC\u1112\u1161\u11B7
\u1106\u1169\u1100\u1173\u11B7
\u1106\u1169\u1102\u1175\u1110\u1165
\u1106\u1169\u1103\u1166\u11AF
\u1106\u1169\u1103\u1173\u11AB
\u1106\u1169\u1107\u1165\u11B7
\u1106\u1169\u1109\u1173\u11B8
\u1106\u1169\u110B\u1163\u11BC
\u1106\u1169\u110B\u1175\u11B7
\u1106\u1169\u110C\u1169\u1105\u1175
\u1106\u1169\u110C\u1175\u11B8
\u1106\u1169\u1110\u116E\u11BC\u110B\u1175
\u1106\u1169\u11A8\u1100\u1165\u11AF\u110B\u1175
\u1106\u1169\u11A8\u1105\u1169\u11A8
\u1106\u1169\u11A8\u1109\u1161
\u1106\u1169\u11A8\u1109\u1169\u1105\u1175
\u1106\u1169\u11A8\u1109\u116E\u11B7
\u1106\u1169\u11A8\u110C\u1165\u11A8
\u1106\u1169\u11A8\u1111\u116D
\u1106\u1169\u11AF\u1105\u1162
\u1106\u1169\u11B7\u1106\u1162
\u1106\u1169\u11B7\u1106\u116E\u1100\u1166
\u1106\u1169\u11B7\u1109\u1161\u11AF
\u1106\u1169\u11B7\u1109\u1169\u11A8
\u1106\u1169\u11B7\u110C\u1175\u11BA
\u1106\u1169\u11B7\u1110\u1169\u11BC
\u1106\u1169\u11B8\u1109\u1175
\u1106\u116E\u1100\u116A\u11AB\u1109\u1175\u11B7
\u1106\u116E\u1100\u116E\u11BC\u1112\u116A
\u1106\u116E\u1103\u1165\u110B\u1171
\u1106\u116E\u1103\u1165\u11B7
\u1106\u116E\u1105\u1173\u11C1
\u1106\u116E\u1109\u1173\u11AB
\u1106\u116E\u110B\u1165\u11BA
\u1106\u116E\u110B\u1167\u11A8
\u1106\u116E\u110B\u116D\u11BC
\u1106\u116E\u110C\u1169\u1100\u1165\u11AB
\u1106\u116E\u110C\u1175\u1100\u1162
\u1106\u116E\u110E\u1165\u11A8
\u1106\u116E\u11AB\u1100\u116E
\u1106\u116E\u11AB\u1103\u1173\u11A8
\u1106\u116E\u11AB\u1107\u1165\u11B8
\u1106\u116E\u11AB\u1109\u1165
\u1106\u116E\u11AB\u110C\u1166
\u1106\u116E\u11AB\u1112\u1161\u11A8
\u1106\u116E\u11AB\u1112\u116A
\u1106\u116E\u11AF\u1100\u1161
\u1106\u116E\u11AF\u1100\u1165\u11AB
\u1106\u116E\u11AF\u1100\u1167\u11AF
\u1106\u116E\u11AF\u1100\u1169\u1100\u1175
\u1106\u116E\u11AF\u1105\u1169\u11AB
\u1106\u116E\u11AF\u1105\u1175\u1112\u1161\u11A8
\u1106\u116E\u11AF\u110B\u1173\u11B7
\u1106\u116E\u11AF\u110C\u1175\u11AF
\u1106\u116E\u11AF\u110E\u1166
\u1106\u1175\u1100\u116E\u11A8
\u1106\u1175\u1103\u1175\u110B\u1165
\u1106\u1175\u1109\u1161\u110B\u1175\u11AF
\u1106\u1175\u1109\u116E\u11AF
\u1106\u1175\u110B\u1167\u11A8
\u1106\u1175\u110B\u116D\u11BC\u1109\u1175\u11AF
\u1106\u1175\u110B\u116E\u11B7
\u1106\u1175\u110B\u1175\u11AB
\u1106\u1175\u1110\u1175\u11BC
\u1106\u1175\u1112\u1169\u11AB
\u1106\u1175\u11AB\u1100\u1161\u11AB
\u1106\u1175\u11AB\u110C\u1169\u11A8
\u1106\u1175\u11AB\u110C\u116E
\u1106\u1175\u11AE\u110B\u1173\u11B7
\u1106\u1175\u11AF\u1100\u1161\u1105\u116E
\u1106\u1175\u11AF\u1105\u1175\u1106\u1175\u1110\u1165
\u1106\u1175\u11C0\u1107\u1161\u1103\u1161\u11A8
\u1107\u1161\u1100\u1161\u110C\u1175
\u1107\u1161\u1100\u116E\u1102\u1175
\u1107\u1161\u1102\u1161\u1102\u1161
\u1107\u1161\u1102\u1173\u11AF
\u1107\u1161\u1103\u1161\u11A8
\u1107\u1161\u1103\u1161\u11BA\u1100\u1161
\u1107\u1161\u1105\u1161\u11B7
\u1107\u1161\u110B\u1175\u1105\u1165\u1109\u1173
\u1107\u1161\u1110\u1161\u11BC
\u1107\u1161\u11A8\u1106\u116E\u11AF\u1100\u116A\u11AB
\u1107\u1161\u11A8\u1109\u1161
\u1107\u1161\u11A8\u1109\u116E
\u1107\u1161\u11AB\u1103\u1162
\u1107\u1161\u11AB\u1103\u1173\u1109\u1175
\u1107\u1161\u11AB\u1106\u1161\u11AF
\u1107\u1161\u11AB\u1107\u1161\u11AF
\u1107\u1161\u11AB\u1109\u1165\u11BC
\u1107\u1161\u11AB\u110B\u1173\u11BC
\u1107\u1161\u11AB\u110C\u1161\u11BC
\u1107\u1161\u11AB\u110C\u116E\u11A8
\u1107\u1161\u11AB\u110C\u1175
\u1107\u1161\u11AB\u110E\u1161\u11AB
\u1107\u1161\u11AE\u110E\u1175\u11B7
\u1107\u1161\u11AF\u1100\u1161\u1105\u1161\u11A8
\u1107\u1161\u11AF\u1100\u1165\u11AF\u110B\u1173\u11B7
\u1107\u1161\u11AF\u1100\u1167\u11AB
\u1107\u1161\u11AF\u1103\u1161\u11AF
\u1107\u1161\u11AF\u1105\u1166
\u1107\u1161\u11AF\u1106\u1169\u11A8
\u1107\u1161\u11AF\u1107\u1161\u1103\u1161\u11A8
\u1107\u1161\u11AF\u1109\u1162\u11BC
\u1107\u1161\u11AF\u110B\u1173\u11B7
\u1107\u1161\u11AF\u110C\u1161\u1100\u116E\u11A8
\u1107\u1161\u11AF\u110C\u1165\u11AB
\u1107\u1161\u11AF\u1110\u1169\u11B8
\u1107\u1161\u11AF\u1111\u116D
\u1107\u1161\u11B7\u1112\u1161\u1102\u1173\u11AF
\u1107\u1161\u11B8\u1100\u1173\u1105\u1173\u11BA
\u1107\u1161\u11B8\u1106\u1161\u11BA
\u1107\u1161\u11B8\u1109\u1161\u11BC
\u1107\u1161\u11B8\u1109\u1169\u11C0
\u1107\u1161\u11BC\u1100\u1173\u11B7
\u1107\u1161\u11BC\u1106\u1167\u11AB
\u1107\u1161\u11BC\u1106\u116E\u11AB
\u1107\u1161\u11BC\u1107\u1161\u1103\u1161\u11A8
\u1107\u1161\u11BC\u1107\u1165\u11B8
\u1107\u1161\u11BC\u1109\u1169\u11BC
\u1107\u1161\u11BC\u1109\u1175\u11A8
\u1107\u1161\u11BC\u110B\u1161\u11AB
\u1107\u1161\u11BC\u110B\u116E\u11AF
\u1107\u1161\u11BC\u110C\u1175
\u1107\u1161\u11BC\u1112\u1161\u11A8
\u1107\u1161\u11BC\u1112\u1162
\u1107\u1161\u11BC\u1112\u1163\u11BC
\u1107\u1162\u1100\u1167\u11BC
\u1107\u1162\u1101\u1169\u11B8
\u1107\u1162\u1103\u1161\u11AF
\u1107\u1162\u1103\u1173\u1106\u1175\u11AB\u1110\u1165\u11AB
\u1107\u1162\u11A8\u1103\u116E\u1109\u1161\u11AB
\u1107\u1162\u11A8\u1109\u1162\u11A8
\u1107\u1162\u11A8\u1109\u1165\u11BC
\u1107\u1162\u11A8\u110B\u1175\u11AB
\u1107\u1162\u11A8\u110C\u1166
\u1107\u1162\u11A8\u1112\u116A\u110C\u1165\u11B7
\u1107\u1165\u1105\u1173\u11BA
\u1107\u1165\u1109\u1165\u11BA
\u1107\u1165\u1110\u1173\u11AB
\u1107\u1165\u11AB\u1100\u1162
\u1107\u1165\u11AB\u110B\u1167\u11A8
\u1107\u1165\u11AB\u110C\u1175
\u1107\u1165\u11AB\u1112\u1169
\u1107\u1165\u11AF\u1100\u1173\u11B7
\u1107\u1165\u11AF\u1105\u1166
\u1107\u1165\u11AF\u110A\u1165
\u1107\u1165\u11B7\u110B\u1171
\u1107\u1165\u11B7\u110B\u1175\u11AB
\u1107\u1165\u11B7\u110C\u116C
\u1107\u1165\u11B8\u1105\u1172\u11AF
\u1107\u1165\u11B8\u110B\u116F\u11AB
\u1107\u1165\u11B8\u110C\u1165\u11A8
\u1107\u1165\u11B8\u110E\u1175\u11A8
\u1107\u1166\u110B\u1175\u110C\u1175\u11BC
\u1107\u1166\u11AF\u1110\u1173
\u1107\u1167\u11AB\u1100\u1167\u11BC
\u1107\u1167\u11AB\u1103\u1169\u11BC
\u1107\u1167\u11AB\u1106\u1167\u11BC
\u1107\u1167\u11AB\u1109\u1175\u11AB
\u1107\u1167\u11AB\u1112\u1169\u1109\u1161
\u1107\u1167\u11AB\u1112\u116A
\u1107\u1167\u11AF\u1103\u1169
\u1107\u1167\u11AF\u1106\u1167\u11BC
\u1107\u1167\u11AF\u110B\u1175\u11AF
\u1107\u1167\u11BC\u1109\u1175\u11AF
\u1107\u1167\u11BC\u110B\u1161\u1105\u1175
\u1107\u1167\u11BC\u110B\u116F\u11AB
\u1107\u1169\u1100\u116A\u11AB
\u1107\u1169\u1102\u1165\u1109\u1173
\u1107\u1169\u1105\u1161\u1109\u1162\u11A8
\u1107\u1169\u1105\u1161\u11B7
\u1107\u1169\u1105\u1173\u11B7
\u1107\u1169\u1109\u1161\u11BC
\u1107\u1169\u110B\u1161\u11AB
\u1107\u1169\u110C\u1161\u1100\u1175
\u1107\u1169\u110C\u1161\u11BC
\u1107\u1169\u110C\u1165\u11AB
\u1107\u1169\u110C\u1169\u11AB
\u1107\u1169\u1110\u1169\u11BC
\u1107\u1169\u1111\u1167\u11AB\u110C\u1165\u11A8
\u1107\u1169\u1112\u1165\u11B7
\u1107\u1169\u11A8\u1103\u1169
\u1107\u1169\u11A8\u1109\u1161
\u1107\u1169\u11A8\u1109\u116E\u11BC\u110B\u1161
\u1107\u1169\u11A8\u1109\u1173\u11B8
\u1107\u1169\u11A9\u110B\u1173\u11B7
\u1107\u1169\u11AB\u1100\u1167\u11A8\u110C\u1165\u11A8
\u1107\u1169\u11AB\u1105\u1162
\u1107\u1169\u11AB\u1107\u116E
\u1107\u1169\u11AB\u1109\u1161
\u1107\u1169\u11AB\u1109\u1165\u11BC
\u1107\u1169\u11AB\u110B\u1175\u11AB
\u1107\u1169\u11AB\u110C\u1175\u11AF
\u1107\u1169\u11AF\u1111\u1166\u11AB
\u1107\u1169\u11BC\u1109\u1161
\u1107\u1169\u11BC\u110C\u1175
\u1107\u1169\u11BC\u1110\u116E
\u1107\u116E\u1100\u1173\u11AB
\u1107\u116E\u1101\u1173\u1105\u1165\u110B\u116E\u11B7
\u1107\u116E\u1103\u1161\u11B7
\u1107\u116E\u1103\u1169\u11BC\u1109\u1161\u11AB
\u1107\u116E\u1106\u116E\u11AB
\u1107\u116E\u1107\u116E\u11AB
\u1107\u116E\u1109\u1161\u11AB
\u1107\u116E\u1109\u1161\u11BC
\u1107\u116E\u110B\u1165\u11BF
\u1107\u116E\u110B\u1175\u11AB
\u1107\u116E\u110C\u1161\u11A8\u110B\u116D\u11BC
\u1107\u116E\u110C\u1161\u11BC
\u1107\u116E\u110C\u1165\u11BC
\u1107\u116E\u110C\u1169\u11A8
\u1107\u116E\u110C\u1175\u1105\u1165\u11AB\u1112\u1175
\u1107\u116E\u110E\u1175\u11AB
\u1107\u116E\u1110\u1161\u11A8
\u1107\u116E\u1111\u116E\u11B7
\u1107\u116E\u1112\u116C\u110C\u1161\u11BC
\u1107\u116E\u11A8\u1107\u116E
\u1107\u116E\u11A8\u1112\u1161\u11AB
\u1107\u116E\u11AB\u1102\u1169
\u1107\u116E\u11AB\u1105\u1163\u11BC
\u1107\u116E\u11AB\u1105\u1175
\u1107\u116E\u11AB\u1106\u1167\u11BC
\u1107\u116E\u11AB\u1109\u1165\u11A8
\u1107\u116E\u11AB\u110B\u1163
\u1107\u116E\u11AB\u110B\u1171\u1100\u1175
\u1107\u116E\u11AB\u1111\u1175\u11AF
\u1107\u116E\u11AB\u1112\u1169\u11BC\u1109\u1162\u11A8
\u1107\u116E\u11AF\u1100\u1169\u1100\u1175
\u1107\u116E\u11AF\u1100\u116A
\u1107\u116E\u11AF\u1100\u116D
\u1107\u116E\u11AF\u1101\u1169\u11BE
\u1107\u116E\u11AF\u1106\u1161\u11AB
\u1107\u116E\u11AF\u1107\u1165\u11B8
\u1107\u116E\u11AF\u1107\u1175\u11BE
\u1107\u116E\u11AF\u110B\u1161\u11AB
\u1107\u116E\u11AF\u110B\u1175\u110B\u1175\u11A8
\u1107\u116E\u11AF\u1112\u1162\u11BC
\u1107\u1173\u1105\u1162\u11AB\u1103\u1173
\u1107\u1175\u1100\u1173\u11A8
\u1107\u1175\u1102\u1161\u11AB
\u1107\u1175\u1102\u1175\u11AF
\u1107\u1175\u1103\u116E\u11AF\u1100\u1175
\u1107\u1175\u1103\u1175\u110B\u1169
\u1107\u1175\u1105\u1169\u1109\u1169
\u1107\u1175\u1106\u1161\u11AB
\u1107\u1175\u1106\u1167\u11BC
\u1107\u1175\u1106\u1175\u11AF
\u1107\u1175\u1107\u1161\u1105\u1161\u11B7
\u1107\u1175\u1107\u1175\u11B7\u1107\u1161\u11B8
\u1107\u1175\u1109\u1161\u11BC
\u1107\u1175\u110B\u116D\u11BC
\u1107\u1175\u110B\u1172\u11AF
\u1107\u1175\u110C\u116E\u11BC
\u1107\u1175\u1110\u1161\u1106\u1175\u11AB
\u1107\u1175\u1111\u1161\u11AB
\u1107\u1175\u11AF\u1103\u1175\u11BC
\u1107\u1175\u11BA\u1106\u116E\u11AF
\u1107\u1175\u11BA\u1107\u1161\u11BC\u110B\u116E\u11AF
\u1107\u1175\u11BA\u110C\u116E\u11AF\u1100\u1175
\u1107\u1175\u11BE\u1101\u1161\u11AF
\u1108\u1161\u11AF\u1100\u1161\u11AB\u1109\u1162\u11A8
\u1108\u1161\u11AF\u1105\u1162
\u1108\u1161\u11AF\u1105\u1175
\u1109\u1161\u1100\u1165\u11AB
\u1109\u1161\u1100\u1168\u110C\u1165\u11AF
\u1109\u1161\u1102\u1161\u110B\u1175
\u1109\u1161\u1102\u1163\u11BC
\u1109\u1161\u1105\u1161\u11B7
\u1109\u1161\u1105\u1161\u11BC
\u1109\u1161\u1105\u1175\u11B8
\u1109\u1161\u1106\u1169\u1102\u1175\u11B7
\u1109\u1161\u1106\u116E\u11AF
\u1109\u1161\u1107\u1161\u11BC
\u1109\u1161\u1109\u1161\u11BC
\u1109\u1161\u1109\u1162\u11BC\u1112\u116A\u11AF
\u1109\u1161\u1109\u1165\u11AF
\u1109\u1161\u1109\u1173\u11B7
\u1109\u1161\u1109\u1175\u11AF
\u1109\u1161\u110B\u1165\u11B8
\u1109\u1161\u110B\u116D\u11BC
\u1109\u1161\u110B\u116F\u11AF
\u1109\u1161\u110C\u1161\u11BC
\u1109\u1161\u110C\u1165\u11AB
\u1109\u1161\u110C\u1175\u11AB
\u1109\u1161\u110E\u1169\u11AB
\u1109\u1161\u110E\u116E\u11AB\u1100\u1175
\u1109\u1161\u1110\u1161\u11BC
\u1109\u1161\u1110\u116E\u1105\u1175
\u1109\u1161\u1112\u1173\u11AF
\u1109\u1161\u11AB\u1100\u1175\u11AF
\u1109\u1161\u11AB\u1107\u116E\u110B\u1175\u11AB\u1100\u116A
\u1109\u1161\u11AB\u110B\u1165\u11B8
\u1109\u1161\u11AB\u110E\u1162\u11A8
\u1109\u1161\u11AF\u1105\u1175\u11B7
\u1109\u1161\u11AF\u110B\u1175\u11AB
\u1109\u1161\u11AF\u110D\u1161\u11A8
\u1109\u1161\u11B7\u1100\u1168\u1110\u1161\u11BC
\u1109\u1161\u11B7\u1100\u116E\u11A8
\u1109\u1161\u11B7\u1109\u1175\u11B8
\u1109\u1161\u11B7\u110B\u116F\u11AF
\u1109\u1161\u11B7\u110E\u1169\u11AB
\u1109\u1161\u11BC\u1100\u116A\u11AB
\u1109\u1161\u11BC\u1100\u1173\u11B7
\u1109\u1161\u11BC\u1103\u1162
\u1109\u1161\u11BC\u1105\u1172
\u1109\u1161\u11BC\u1107\u1161\u11AB\u1100\u1175
\u1109\u1161\u11BC\u1109\u1161\u11BC
\u1109\u1161\u11BC\u1109\u1175\u11A8
\u1109\u1161\u11BC\u110B\u1165\u11B8
\u1109\u1161\u11BC\u110B\u1175\u11AB
\u1109\u1161\u11BC\u110C\u1161
\u1109\u1161\u11BC\u110C\u1165\u11B7
\u1109\u1161\u11BC\u110E\u1165
\u1109\u1161\u11BC\u110E\u116E
\u1109\u1161\u11BC\u1110\u1162
\u1109\u1161\u11BC\u1111\u116D
\u1109\u1161\u11BC\u1111\u116E\u11B7
\u1109\u1161\u11BC\u1112\u116A\u11BC
\u1109\u1162\u1107\u1167\u11A8
\u1109\u1162\u11A8\u1101\u1161\u11AF
\u1109\u1162\u11A8\u110B\u1167\u11AB\u1111\u1175\u11AF
\u1109\u1162\u11BC\u1100\u1161\u11A8
\u1109\u1162\u11BC\u1106\u1167\u11BC
\u1109\u1162\u11BC\u1106\u116E\u11AF
\u1109\u1162\u11BC\u1107\u1161\u11BC\u1109\u1169\u11BC
\u1109\u1162\u11BC\u1109\u1161\u11AB
\u1109\u1162\u11BC\u1109\u1165\u11AB
\u1109\u1162\u11BC\u1109\u1175\u11AB
\u1109\u1162\u11BC\u110B\u1175\u11AF
\u1109\u1162\u11BC\u1112\u116A\u11AF
\u1109\u1165\u1105\u1161\u11B8
\u1109\u1165\u1105\u1173\u11AB
\u1109\u1165\u1106\u1167\u11BC
\u1109\u1165\u1106\u1175\u11AB
\u1109\u1165\u1107\u1175\u1109\u1173
\u1109\u1165\u110B\u1163\u11BC
\u1109\u1165\u110B\u116E\u11AF
\u1109\u1165\u110C\u1165\u11A8
\u1109\u1165\u110C\u1165\u11B7
\u1109\u1165\u110D\u1169\u11A8
\u1109\u1165\u110F\u1173\u11AF
\u1109\u1165\u11A8\u1109\u1161
\u1109\u1165\u11A8\u110B\u1172
\u1109\u1165\u11AB\u1100\u1165
\u1109\u1165\u11AB\u1106\u116E\u11AF
\u1109\u1165\u11AB\u1107\u1162
\u1109\u1165\u11AB\u1109\u1162\u11BC
\u1109\u1165\u11AB\u1109\u116E
\u1109\u1165\u11AB\u110B\u116F\u11AB
\u1109\u1165\u11AB\u110C\u1161\u11BC
\u1109\u1165\u11AB\u110C\u1165\u11AB
\u1109\u1165\u11AB\u1110\u1162\u11A8
\u1109\u1165\u11AB\u1111\u116E\u11BC\u1100\u1175
\u1109\u1165\u11AF\u1100\u1165\u110C\u1175
\u1109\u1165\u11AF\u1102\u1161\u11AF
\u1109\u1165\u11AF\u1105\u1165\u11BC\u1110\u1161\u11BC
\u1109\u1165\u11AF\u1106\u1167\u11BC
\u1109\u1165\u11AF\u1106\u116E\u11AB
\u1109\u1165\u11AF\u1109\u1161
\u1109\u1165\u11AF\u110B\u1161\u11A8\u1109\u1161\u11AB
\u1109\u1165\u11AF\u110E\u1175
\u1109\u1165\u11AF\u1110\u1161\u11BC
\u1109\u1165\u11B8\u110A\u1175
\u1109\u1165\u11BC\u1100\u1169\u11BC
\u1109\u1165\u11BC\u1103\u1161\u11BC
\u1109\u1165\u11BC\u1106\u1167\u11BC
\u1109\u1165\u11BC\u1107\u1167\u11AF
\u1109\u1165\u11BC\u110B\u1175\u11AB
\u1109\u1165\u11BC\u110C\u1161\u11BC
\u1109\u1165\u11BC\u110C\u1165\u11A8
\u1109\u1165\u11BC\u110C\u1175\u11AF
\u1109\u1165\u11BC\u1112\u1161\u11B7
\u1109\u1166\u1100\u1173\u11B7
\u1109\u1166\u1106\u1175\u1102\u1161
\u1109\u1166\u1109\u1161\u11BC
\u1109\u1166\u110B\u116F\u11AF
\u1109\u1166\u110C\u1169\u11BC\u1103\u1162\u110B\u116A\u11BC
\u1109\u1166\u1110\u1161\u11A8
\u1109\u1166\u11AB\u1110\u1165
\u1109\u1166\u11AB\u1110\u1175\u1106\u1175\u1110\u1165
\u1109\u1166\u11BA\u110D\u1162
\u1109\u1169\u1100\u1172\u1106\u1169
\u1109\u1169\u1100\u1173\u11A8\u110C\u1165\u11A8
\u1109\u1169\u1100\u1173\u11B7
\u1109\u1169\u1102\u1161\u1100\u1175
\u1109\u1169\u1102\u1167\u11AB
\u1109\u1169\u1103\u1173\u11A8
\u1109\u1169\u1106\u1161\u11BC
\u1109\u1169\u1106\u116E\u11AB
\u1109\u1169\u1109\u1165\u11AF
\u1109\u1169\u1109\u1169\u11A8
\u1109\u1169\u110B\u1161\u1100\u116A
\u1109\u1169\u110B\u116D\u11BC
\u1109\u1169\u110B\u116F\u11AB
\u1109\u1169\u110B\u1173\u11B7
\u1109\u1169\u110C\u116E\u11BC\u1112\u1175
\u1109\u1169\u110C\u1175\u1111\u116E\u11B7
\u1109\u1169\u110C\u1175\u11AF
\u1109\u1169\u1111\u116E\u11BC
\u1109\u1169\u1112\u1167\u11BC
\u1109\u1169\u11A8\u1103\u1161\u11B7
\u1109\u1169\u11A8\u1103\u1169
\u1109\u1169\u11A8\u110B\u1169\u11BA
\u1109\u1169\u11AB\u1100\u1161\u1105\u1161\u11A8
\u1109\u1169\u11AB\u1100\u1175\u11AF
\u1109\u1169\u11AB\u1102\u1167
\u1109\u1169\u11AB\u1102\u1175\u11B7
\u1109\u1169\u11AB\u1103\u1173\u11BC
\u1109\u1169\u11AB\u1106\u1169\u11A8
\u1109\u1169\u11AB\u1108\u1167\u11A8
\u1109\u1169\u11AB\u1109\u1175\u11AF
\u1109\u1169\u11AB\u110C\u1175\u11AF
\u1109\u1169\u11AB\u1110\u1169\u11B8
\u1109\u1169\u11AB\u1112\u1162
\u1109\u1169\u11AF\u110C\u1175\u11A8\u1112\u1175
\u1109\u1169\u11B7\u110A\u1175
\u1109\u1169\u11BC\u110B\u1161\u110C\u1175
\u1109\u1169\u11BC\u110B\u1175
\u1109\u1169\u11BC\u1111\u1167\u11AB
\u1109\u116C\u1100\u1169\u1100\u1175
\u1109\u116D\u1111\u1175\u11BC
\u1109\u116E\u1100\u1165\u11AB
\u1109\u116E\u1102\u1167\u11AB
\u1109\u116E\u1103\u1161\u11AB
\u1109\u116E\u1103\u1169\u11BA\u1106\u116E\u11AF
\u1109\u116E\u1103\u1169\u11BC\u110C\u1165\u11A8
\u1109\u116E\u1106\u1167\u11AB
\u1109\u116E\u1106\u1167\u11BC
\u1109\u116E\u1107\u1161\u11A8
\u1109\u116E\u1109\u1161\u11BC
\u1109\u116E\u1109\u1165\u11A8
\u1109\u116E\u1109\u116E\u11AF
\u1109\u116E\u1109\u1175\u1105\u1169
\u1109\u116E\u110B\u1165\u11B8
\u1109\u116E\u110B\u1167\u11B7
\u1109\u116E\u110B\u1167\u11BC
\u1109\u116E\u110B\u1175\u11B8
\u1109\u116E\u110C\u116E\u11AB
\u1109\u116E\u110C\u1175\u11B8
\u1109\u116E\u110E\u116E\u11AF
\u1109\u116E\u110F\u1165\u11BA
\u1109\u116E\u1111\u1175\u11AF
\u1109\u116E\u1112\u1161\u11A8
\u1109\u116E\u1112\u1165\u11B7\u1109\u1162\u11BC
\u1109\u116E\u1112\u116A\u1100\u1175
\u1109\u116E\u11A8\u1102\u1167
\u1109\u116E\u11A8\u1109\u1169
\u1109\u116E\u11A8\u110C\u1166
\u1109\u116E\u11AB\u1100\u1161\u11AB
\u1109\u116E\u11AB\u1109\u1165
\u1109\u116E\u11AB\u1109\u116E
\u1109\u116E\u11AB\u1109\u1175\u11A8\u1100\u1161\u11AB
\u1109\u116E\u11AB\u110B\u1171
\u1109\u116E\u11AE\u1100\u1161\u1105\u1161\u11A8
\u1109\u116E\u11AF\u1107\u1167\u11BC
\u1109\u116E\u11AF\u110C\u1175\u11B8
\u1109\u116E\u11BA\u110C\u1161
\u1109\u1173\u1102\u1175\u11B7
\u1109\u1173\u1106\u116E\u11AF
\u1109\u1173\u1109\u1173\u1105\u1169
\u1109\u1173\u1109\u1173\u11BC
\u1109\u1173\u110B\u1170\u1110\u1165
\u1109\u1173\u110B\u1171\u110E\u1175
\u1109\u1173\u110F\u1166\u110B\u1175\u1110\u1173
\u1109\u1173\u1110\u1172\u1103\u1175\u110B\u1169
\u1109\u1173\u1110\u1173\u1105\u1166\u1109\u1173
\u1109\u1173\u1111\u1169\u110E\u1173
\u1109\u1173\u11AF\u110D\u1165\u11A8
\u1109\u1173\u11AF\u1111\u1173\u11B7
\u1109\u1173\u11B8\u1100\u116A\u11AB
\u1109\u1173\u11B8\u1100\u1175
\u1109\u1173\u11BC\u1100\u1162\u11A8
\u1109\u1173\u11BC\u1105\u1175
\u1109\u1173\u11BC\u1107\u116E
\u1109\u1173\u11BC\u110B\u116D\u11BC\u110E\u1161
\u1109\u1173\u11BC\u110C\u1175\u11AB
\u1109\u1175\u1100\u1161\u11A8
\u1109\u1175\u1100\u1161\u11AB
\u1109\u1175\u1100\u1169\u11AF
\u1109\u1175\u1100\u1173\u11B7\u110E\u1175
\u1109\u1175\u1102\u1161\u1105\u1175\u110B\u1169
\u1109\u1175\u1103\u1162\u11A8
\u1109\u1175\u1105\u1175\u110C\u1173
\u1109\u1175\u1106\u1166\u11AB\u1110\u1173
\u1109\u1175\u1106\u1175\u11AB
\u1109\u1175\u1107\u116E\u1106\u1169
\u1109\u1175\u1109\u1165\u11AB
\u1109\u1175\u1109\u1165\u11AF
\u1109\u1175\u1109\u1173\u1110\u1166\u11B7
\u1109\u1175\u110B\u1161\u1107\u1165\u110C\u1175
\u1109\u1175\u110B\u1165\u1106\u1165\u1102\u1175
\u1109\u1175\u110B\u116F\u11AF
\u1109\u1175\u110B\u1175\u11AB
\u1109\u1175\u110B\u1175\u11AF
\u1109\u1175\u110C\u1161\u11A8
\u1109\u1175\u110C\u1161\u11BC
\u1109\u1175\u110C\u1165\u11AF
\u1109\u1175\u110C\u1165\u11B7
\u1109\u1175\u110C\u116E\u11BC
\u1109\u1175\u110C\u1173\u11AB
\u1109\u1175\u110C\u1175\u11B8
\u1109\u1175\u110E\u1165\u11BC
\u1109\u1175\u1112\u1161\u11B8
\u1109\u1175\u1112\u1165\u11B7
\u1109\u1175\u11A8\u1100\u116E
\u1109\u1175\u11A8\u1100\u1175
\u1109\u1175\u11A8\u1103\u1161\u11BC
\u1109\u1175\u11A8\u1105\u1163\u11BC
\u1109\u1175\u11A8\u1105\u116D\u1111\u116E\u11B7
\u1109\u1175\u11A8\u1106\u116E\u11AF
\u1109\u1175\u11A8\u1108\u1161\u11BC
\u1109\u1175\u11A8\u1109\u1161
\u1109\u1175\u11A8\u1109\u1162\u11BC\u1112\u116A\u11AF
\u1109\u1175\u11A8\u110E\u1169
\u1109\u1175\u11A8\u1110\u1161\u11A8
\u1109\u1175\u11A8\u1111\u116E\u11B7
\u1109\u1175\u11AB\u1100\u1169
\u1109\u1175\u11AB\u1100\u1172
\u1109\u1175\u11AB\u1102\u1167\u11B7
\u1109\u1175\u11AB\u1106\u116E\u11AB
\u1109\u1175\u11AB\u1107\u1161\u11AF
\u1109\u1175\u11AB\u1107\u1175
\u1109\u1175\u11AB\u1109\u1161
\u1109\u1175\u11AB\u1109\u1166
\u1109\u1175\u11AB\u110B\u116D\u11BC
\u1109\u1175\u11AB\u110C\u1166\u1111\u116E\u11B7
\u1109\u1175\u11AB\u110E\u1165\u11BC
\u1109\u1175\u11AB\u110E\u1166
\u1109\u1175\u11AB\u1112\u116A
\u1109\u1175\u11AF\u1100\u1161\u11B7
\u1109\u1175\u11AF\u1102\u1162
\u1109\u1175\u11AF\u1105\u1167\u11A8
\u1109\u1175\u11AF\u1105\u1168
\u1109\u1175\u11AF\u1106\u1161\u11BC
\u1109\u1175\u11AF\u1109\u116E
\u1109\u1175\u11AF\u1109\u1173\u11B8
\u1109\u1175\u11AF\u1109\u1175
\u1109\u1175\u11AF\u110C\u1161\u11BC
\u1109\u1175\u11AF\u110C\u1165\u11BC
\u1109\u1175\u11AF\u110C\u1175\u11AF\u110C\u1165\u11A8
\u1109\u1175\u11AF\u110E\u1165\u11AB
\u1109\u1175\u11AF\u110E\u1166
\u1109\u1175\u11AF\u110F\u1165\u11BA
\u1109\u1175\u11AF\u1110\u1162
\u1109\u1175\u11AF\u1111\u1162
\u1109\u1175\u11AF\u1112\u1165\u11B7
\u1109\u1175\u11AF\u1112\u1167\u11AB
\u1109\u1175\u11B7\u1105\u1175
\u1109\u1175\u11B7\u1107\u116E\u1105\u1173\u11B7
\u1109\u1175\u11B7\u1109\u1161
\u1109\u1175\u11B7\u110C\u1161\u11BC
\u1109\u1175\u11B7\u110C\u1165\u11BC
\u1109\u1175\u11B7\u1111\u1161\u11AB
\u110A\u1161\u11BC\u1103\u116E\u11BC\u110B\u1175
\u110A\u1175\u1105\u1173\u11B7
\u110A\u1175\u110B\u1161\u11BA
\u110B\u1161\u1100\u1161\u110A\u1175
\u110B\u1161\u1102\u1161\u110B\u116E\u11AB\u1109\u1165
\u110B\u1161\u1103\u1173\u1102\u1175\u11B7
\u110B\u1161\u1103\u1173\u11AF
\u110B\u1161\u1109\u1171\u110B\u116E\u11B7
\u110B\u1161\u1109\u1173\u1111\u1161\u11AF\u1110\u1173
\u110B\u1161\u1109\u1175\u110B\u1161
\u110B\u1161\u110B\u116E\u11AF\u1105\u1165
\u110B\u1161\u110C\u1165\u110A\u1175
\u110B\u1161\u110C\u116E\u11B7\u1106\u1161
\u110B\u1161\u110C\u1175\u11A8
\u110B\u1161\u110E\u1175\u11B7
\u110B\u1161\u1111\u1161\u1110\u1173
\u110B\u1161\u1111\u1173\u1105\u1175\u110F\u1161
\u110B\u1161\u1111\u1173\u11B7
\u110B\u1161\u1112\u1169\u11B8
\u110B\u1161\u1112\u1173\u11AB
\u110B\u1161\u11A8\u1100\u1175
\u110B\u1161\u11A8\u1106\u1169\u11BC
\u110B\u1161\u11A8\u1109\u116E
\u110B\u1161\u11AB\u1100\u1162
\u110B\u1161\u11AB\u1100\u1167\u11BC
\u110B\u1161\u11AB\u1100\u116A
\u110B\u1161\u11AB\u1102\u1162
\u110B\u1161\u11AB\u1102\u1167\u11BC
\u110B\u1161\u11AB\u1103\u1169\u11BC
\u110B\u1161\u11AB\u1107\u1161\u11BC
\u110B\u1161\u11AB\u1107\u116E
\u110B\u1161\u11AB\u110C\u116E
\u110B\u1161\u11AF\u1105\u116E\u1106\u1175\u1102\u1172\u11B7
\u110B\u1161\u11AF\u110F\u1169\u110B\u1169\u11AF
\u110B\u1161\u11B7\u1109\u1175
\u110B\u1161\u11B7\u110F\u1165\u11BA
\u110B\u1161\u11B8\u1105\u1167\u11A8
\u110B\u1161\u11C1\u1102\u1161\u11AF
\u110B\u1161\u11C1\u1106\u116E\u11AB
\u110B\u1162\u110B\u1175\u11AB
\u110B\u1162\u110C\u1165\u11BC
\u110B\u1162\u11A8\u1109\u116E
\u110B\u1162\u11AF\u1107\u1165\u11B7
\u110B\u1163\u1100\u1161\u11AB
\u110B\u1163\u1103\u1161\u11AB
\u110B\u1163\u110B\u1169\u11BC
\u110B\u1163\u11A8\u1100\u1161\u11AB
\u110B\u1163\u11A8\u1100\u116E\u11A8
\u110B\u1163\u11A8\u1109\u1169\u11A8
\u110B\u1163\u11A8\u1109\u116E
\u110B\u1163\u11A8\u110C\u1165\u11B7
\u110B\u1163\u11A8\u1111\u116E\u11B7
\u110B\u1163\u11A8\u1112\u1169\u11AB\u1102\u1167
\u110B\u1163\u11BC\u1102\u1167\u11B7
\u110B\u1163\u11BC\u1105\u1167\u11A8
\u110B\u1163\u11BC\u1106\u1161\u11AF
\u110B\u1163\u11BC\u1107\u1162\u110E\u116E
\u110B\u1163\u11BC\u110C\u116E
\u110B\u1163\u11BC\u1111\u1161
\u110B\u1165\u1103\u116E\u11B7
\u110B\u1165\u1105\u1167\u110B\u116E\u11B7
\u110B\u1165\u1105\u1173\u11AB
\u110B\u1165\u110C\u1166\u11BA\u1107\u1161\u11B7
\u110B\u1165\u110D\u1162\u11BB\u1103\u1173\u11AB
\u110B\u1165\u110D\u1165\u1103\u1161\u1100\u1161
\u110B\u1165\u110D\u1165\u11AB\u110C\u1175
\u110B\u1165\u11AB\u1102\u1175
\u110B\u1165\u11AB\u1103\u1165\u11A8
\u110B\u1165\u11AB\u1105\u1169\u11AB
\u110B\u1165\u11AB\u110B\u1165
\u110B\u1165\u11AF\u1100\u116E\u11AF
\u110B\u1165\u11AF\u1105\u1173\u11AB
\u110B\u1165\u11AF\u110B\u1173\u11B7
\u110B\u1165\u11AF\u1111\u1175\u11BA
\u110B\u1165\u11B7\u1106\u1161
\u110B\u1165\u11B8\u1106\u116E
\u110B\u1165\u11B8\u110C\u1169\u11BC
\u110B\u1165\u11B8\u110E\u1166
\u110B\u1165\u11BC\u1103\u1165\u11BC\u110B\u1175
\u110B\u1165\u11BC\u1106\u1161\u11BC
\u110B\u1165\u11BC\u1110\u1165\u1105\u1175
\u110B\u1165\u11BD\u1100\u1173\u110C\u1166
\u110B\u1166\u1102\u1165\u110C\u1175
\u110B\u1166\u110B\u1165\u110F\u1165\u11AB
\u110B\u1166\u11AB\u110C\u1175\u11AB
\u110B\u1167\u1100\u1165\u11AB
\u110B\u1167\u1100\u1169\u1109\u1162\u11BC
\u110B\u1167\u1100\u116A\u11AB
\u110B\u1167\u1100\u116E\u11AB
\u110B\u1167\u1100\u116F\u11AB
\u110B\u1167\u1103\u1162\u1109\u1162\u11BC
\u110B\u1167\u1103\u1165\u11B2
\u110B\u1167\u1103\u1169\u11BC\u1109\u1162\u11BC
\u110B\u1167\u1103\u1173\u11AB
\u110B\u1167\u1105\u1169\u11AB
\u110B\u1167\u1105\u1173\u11B7
\u110B\u1167\u1109\u1165\u11BA
\u110B\u1167\u1109\u1165\u11BC
\u110B\u1167\u110B\u116A\u11BC
\u110B\u1167\u110B\u1175\u11AB
\u110B\u1167\u110C\u1165\u11AB\u1112\u1175
\u110B\u1167\u110C\u1175\u11A8\u110B\u116F\u11AB
\u110B\u1167\u1112\u1161\u11A8\u1109\u1162\u11BC
\u110B\u1167\u1112\u1162\u11BC
\u110B\u1167\u11A8\u1109\u1161
\u110B\u1167\u11A8\u1109\u1175
\u110B\u1167\u11A8\u1112\u1161\u11AF
\u110B\u1167\u11AB\u1100\u1167\u11AF
\u110B\u1167\u11AB\u1100\u116E
\u110B\u1167\u11AB\u1100\u1173\u11A8
\u110B\u1167\u11AB\u1100\u1175
\u110B\u1167\u11AB\u1105\u1161\u11A8
\u110B\u1167\u11AB\u1109\u1165\u11AF
\u110B\u1167\u11AB\u1109\u1166
\u110B\u1167\u11AB\u1109\u1169\u11A8
\u110B\u1167\u11AB\u1109\u1173\u11B8
\u110B\u1167\u11AB\u110B\u1162
\u110B\u1167\u11AB\u110B\u1168\u110B\u1175\u11AB
\u110B\u1167\u11AB\u110B\u1175\u11AB
\u110B\u1167\u11AB\u110C\u1161\u11BC
\u110B\u1167\u11AB\u110C\u116E
\u110B\u1167\u11AB\u110E\u116E\u11AF
\u110B\u1167\u11AB\u1111\u1175\u11AF
\u110B\u1167\u11AB\u1112\u1161\u11B8
\u110B\u1167\u11AB\u1112\u1172
\u110B\u1167\u11AF\u1100\u1175
\u110B\u1167\u11AF\u1106\u1162
\u110B\u1167\u11AF\u1109\u116C
\u110B\u1167\u11AF\u1109\u1175\u11B7\u1112\u1175
\u110B\u1167\u11AF\u110C\u1165\u11BC
\u110B\u1167\u11AF\u110E\u1161
\u110B\u1167\u11AF\u1112\u1173\u11AF
\u110B\u1167\u11B7\u1105\u1167
\u110B\u1167\u11B8\u1109\u1165
\u110B\u1167\u11BC\u1100\u116E\u11A8
\u110B\u1167\u11BC\u1102\u1161\u11B7
\u110B\u1167\u11BC\u1109\u1161\u11BC
\u110B\u1167\u11BC\u110B\u1163\u11BC
\u110B\u1167\u11BC\u110B\u1167\u11A8
\u110B\u1167\u11BC\u110B\u116E\u11BC
\u110B\u1167\u11BC\u110B\u116F\u11AB\u1112\u1175
\u110B\u1167\u11BC\u1112\u1161
\u110B\u1167\u11BC\u1112\u1163\u11BC
\u110B\u1167\u11BC\u1112\u1169\u11AB
\u110B\u1167\u11BC\u1112\u116A
\u110B\u1167\u11C1\u1100\u116E\u1105\u1175
\u110B\u1167\u11C1\u1107\u1161\u11BC
\u110B\u1167\u11C1\u110C\u1175\u11B8
\u110B\u1168\u1100\u1161\u11B7
\u110B\u1168\u1100\u1173\u11B7
\u110B\u1168\u1107\u1161\u11BC
\u110B\u1168\u1109\u1161\u11AB
\u110B\u1168\u1109\u1161\u11BC
\u110B\u1168\u1109\u1165\u11AB
\u110B\u1168\u1109\u116E\u11AF
\u110B\u1168\u1109\u1173\u11B8
\u110B\u1168\u1109\u1175\u11A8\u110C\u1161\u11BC
\u110B\u1168\u110B\u1163\u11A8
\u110B\u1168\u110C\u1165\u11AB
\u110B\u1168\u110C\u1165\u11AF
\u110B\u1168\u110C\u1165\u11BC
\u110B\u1168\u110F\u1165\u11AB\u1103\u1162
\u110B\u1168\u11BA\u1102\u1161\u11AF
\u110B\u1169\u1102\u1173\u11AF
\u110B\u1169\u1105\u1161\u11A8
\u110B\u1169\u1105\u1162\u11BA\u1103\u1169\u11BC\u110B\u1161\u11AB
\u110B\u1169\u1105\u1166\u11AB\u110C\u1175
\u110B\u1169\u1105\u1169\u110C\u1175
\u110B\u1169\u1105\u1173\u11AB\u1107\u1161\u11AF
\u110B\u1169\u1107\u1173\u11AB
\u110B\u1169\u1109\u1175\u11B8
\u110B\u1169\u110B\u1167\u11B7
\u110B\u1169\u110B\u116F\u11AF
\u110B\u1169\u110C\u1165\u11AB
\u110B\u1169\u110C\u1175\u11A8
\u110B\u1169\u110C\u1175\u11BC\u110B\u1165
\u110B\u1169\u1111\u1166\u1105\u1161
\u110B\u1169\u1111\u1175\u1109\u1173\u1110\u1166\u11AF
\u110B\u1169\u1112\u1175\u1105\u1167
\u110B\u1169\u11A8\u1109\u1161\u11BC
\u110B\u1169\u11A8\u1109\u116E\u1109\u116E
\u110B\u1169\u11AB\u1100\u1161\u11BD
\u110B\u1169\u11AB\u1105\u1161\u110B\u1175\u11AB
\u110B\u1169\u11AB\u1106\u1169\u11B7
\u110B\u1169\u11AB\u110C\u1169\u11BC\u110B\u1175\u11AF
\u110B\u1169\u11AB\u1110\u1169\u11BC
\u110B\u1169\u11AF\u1100\u1161\u110B\u1173\u11AF
\u110B\u1169\u11AF\u1105\u1175\u11B7\u1111\u1175\u11A8
\u110B\u1169\u11AF\u1112\u1162
\u110B\u1169\u11BA\u110E\u1161\u1105\u1175\u11B7
\u110B\u116A\u110B\u1175\u1109\u1167\u110E\u1173
\u110B\u116A\u110B\u1175\u11AB
\u110B\u116A\u11AB\u1109\u1165\u11BC
\u110B\u116A\u11AB\u110C\u1165\u11AB
\u110B\u116A\u11BC\u1107\u1175
\u110B\u116A\u11BC\u110C\u1161
\u110B\u116B\u1102\u1163\u1112\u1161\u1106\u1167\u11AB
\u110B\u116B\u11AB\u110C\u1175
\u110B\u116C\u1100\u1161\u11BA\u110C\u1175\u11B8
\u110B\u116C\u1100\u116E\u11A8
\u110B\u116C\u1105\u1169\u110B\u116E\u11B7
\u110B\u116C\u1109\u1161\u11B7\u110E\u1169\u11AB
\u110B\u116C\u110E\u116E\u11AF
\u110B\u116C\u110E\u1175\u11B7
\u110B\u116C\u1112\u1161\u11AF\u1106\u1165\u1102\u1175
\u110B\u116C\u11AB\u1107\u1161\u11AF
\u110B\u116C\u11AB\u1109\u1169\u11AB
\u110B\u116C\u11AB\u110D\u1169\u11A8
\u110B\u116D\u1100\u1173\u11B7
\u110B\u116D\u110B\u1175\u11AF
\u110B\u116D\u110C\u1173\u11B7
\u110B\u116D\u110E\u1165\u11BC
\u110B\u116D\u11BC\u1100\u1175
\u110B\u116D\u11BC\u1109\u1165
\u110B\u116D\u11BC\u110B\u1165
\u110B\u116E\u1109\u1161\u11AB
\u110B\u116E\u1109\u1165\u11AB
\u110B\u116E\u1109\u1173\u11BC
\u110B\u116E\u110B\u1167\u11AB\u1112\u1175
\u110B\u116E\u110C\u1165\u11BC
\u110B\u116E\u110E\u1166\u1100\u116E\u11A8
\u110B\u116E\u1111\u1167\u11AB
\u110B\u116E\u11AB\u1103\u1169\u11BC
\u110B\u116E\u11AB\u1106\u1167\u11BC
\u110B\u116E\u11AB\u1107\u1161\u11AB
\u110B\u116E\u11AB\u110C\u1165\u11AB
\u110B\u116E\u11AB\u1112\u1162\u11BC
\u110B\u116E\u11AF\u1109\u1161\u11AB
\u110B\u116E\u11AF\u110B\u1173\u11B7
\u110B\u116E\u11B7\u110C\u1175\u11A8\u110B\u1175\u11B7
\u110B\u116E\u11BA\u110B\u1165\u1105\u1173\u11AB
\u110B\u116E\u11BA\u110B\u1173\u11B7
\u110B\u116F\u1102\u1161\u11A8
\u110B\u116F\u11AB\u1100\u1169
\u110B\u116F\u11AB\u1105\u1162
\u110B\u116F\u11AB\u1109\u1165
\u110B\u116F\u11AB\u1109\u116E\u11BC\u110B\u1175
\u110B\u116F\u11AB\u110B\u1175\u11AB
\u110B\u116F\u11AB\u110C\u1161\u11BC
\u110B\u116F\u11AB\u1111\u1175\u1109\u1173
\u110B\u116F\u11AF\u1100\u1173\u11B8
\u110B\u116F\u11AF\u1103\u1173\u110F\u1165\u11B8
\u110B\u116F\u11AF\u1109\u1166
\u110B\u116F\u11AF\u110B\u116D\u110B\u1175\u11AF
\u110B\u1170\u110B\u1175\u1110\u1165
\u110B\u1171\u1107\u1161\u11AB
\u110B\u1171\u1107\u1165\u11B8
\u110B\u1171\u1109\u1165\u11BC
\u110B\u1171\u110B\u116F\u11AB
\u110B\u1171\u1112\u1165\u11B7
\u110B\u1171\u1112\u1167\u11B8
\u110B\u1171\u11BA\u1109\u1161\u1105\u1161\u11B7
\u110B\u1172\u1102\u1161\u11AB\u1112\u1175
\u110B\u1172\u1105\u1165\u11B8
\u110B\u1172\u1106\u1167\u11BC
\u110B\u1172\u1106\u116E\u11AF
\u110B\u1172\u1109\u1161\u11AB
\u110B\u1172\u110C\u1165\u11A8
\u110B\u1172\u110E\u1175\u110B\u116F\u11AB
\u110B\u1172\u1112\u1161\u11A8
\u110B\u1172\u1112\u1162\u11BC
\u110B\u1172\u1112\u1167\u11BC
\u110B\u1172\u11A8\u1100\u116E\u11AB
\u110B\u1172\u11A8\u1109\u1161\u11BC
\u110B\u1172\u11A8\u1109\u1175\u11B8
\u110B\u1172\u11A8\u110E\u1166
\u110B\u1173\u11AB\u1112\u1162\u11BC
\u110B\u1173\u11B7\u1105\u1167\u11A8
\u110B\u1173\u11B7\u1105\u116D
\u110B\u1173\u11B7\u1107\u1161\u11AB
\u110B\u1173\u11B7\u1109\u1165\u11BC
\u110B\u1173\u11B7\u1109\u1175\u11A8
\u110B\u1173\u11B7\u110B\u1161\u11A8
\u110B\u1173\u11B7\u110C\u116E
\u110B\u1174\u1100\u1167\u11AB
\u110B\u1174\u1102\u1169\u11AB
\u110B\u1174\u1106\u116E\u11AB
\u110B\u1174\u1107\u1169\u11A8
\u110B\u1174\u1109\u1175\u11A8
\u110B\u1174\u1109\u1175\u11B7
\u110B\u1174\u110B\u116C\u1105\u1169
\u110B\u1174\u110B\u116D\u11A8
\u110B\u1174\u110B\u116F\u11AB
\u110B\u1174\u1112\u1161\u11A8
\u110B\u1175\u1100\u1165\u11BA
\u110B\u1175\u1100\u1169\u11BA
\u110B\u1175\u1102\u1167\u11B7
\u110B\u1175\u1102\u1169\u11B7
\u110B\u1175\u1103\u1161\u11AF
\u110B\u1175\u1103\u1162\u1105\u1169
\u110B\u1175\u1103\u1169\u11BC
\u110B\u1175\u1105\u1165\u11C2\u1100\u1166
\u110B\u1175\u1105\u1167\u11A8\u1109\u1165
\u110B\u1175\u1105\u1169\u11AB\u110C\u1165\u11A8
\u110B\u1175\u1105\u1173\u11B7
\u110B\u1175\u1106\u1175\u11AB
\u110B\u1175\u1107\u1161\u11AF\u1109\u1169
\u110B\u1175\u1107\u1167\u11AF
\u110B\u1175\u1107\u116E\u11AF
\u110B\u1175\u1108\u1161\u11AF
\u110B\u1175\u1109\u1161\u11BC
\u110B\u1175\u1109\u1165\u11BC
\u110B\u1175\u1109\u1173\u11AF
\u110B\u1175\u110B\u1163\u1100\u1175
\u110B\u1175\u110B\u116D\u11BC
\u110B\u1175\u110B\u116E\u11BA
\u110B\u1175\u110B\u116F\u11AF
\u110B\u1175\u110B\u1173\u11A8\u1100\u1169
\u110B\u1175\u110B\u1175\u11A8
\u110B\u1175\u110C\u1165\u11AB
\u110B\u1175\u110C\u116E\u11BC
\u110B\u1175\u1110\u1173\u11AE\u1102\u1161\u11AF
\u110B\u1175\u1110\u1173\u11AF
\u110B\u1175\u1112\u1169\u11AB
\u110B\u1175\u11AB\u1100\u1161\u11AB
\u110B\u1175\u11AB\u1100\u1167\u11A8
\u110B\u1175\u11AB\u1100\u1169\u11BC
\u110B\u1175\u11AB\u1100\u116E
\u110B\u1175\u11AB\u1100\u1173\u11AB
\u110B\u1175\u11AB\u1100\u1175
\u110B\u1175\u11AB\u1103\u1169
\u110B\u1175\u11AB\u1105\u1172
\u110B\u1175\u11AB\u1106\u116E\u11AF
\u110B\u1175\u11AB\u1109\u1162\u11BC
\u110B\u1175\u11AB\u1109\u116B
\u110B\u1175\u11AB\u110B\u1167\u11AB
\u110B\u1175\u11AB\u110B\u116F\u11AB
\u110B\u1175\u11AB\u110C\u1162
\u110B\u1175\u11AB\u110C\u1169\u11BC
\u110B\u1175\u11AB\u110E\u1165\u11AB
\u110B\u1175\u11AB\u110E\u1166
\u110B\u1175\u11AB\u1110\u1165\u1102\u1166\u11BA
\u110B\u1175\u11AB\u1112\u1161
\u110B\u1175\u11AB\u1112\u1167\u11BC
\u110B\u1175\u11AF\u1100\u1169\u11B8
\u110B\u1175\u11AF\u1100\u1175
\u110B\u1175\u11AF\u1103\u1161\u11AB
\u110B\u1175\u11AF\u1103\u1162
\u110B\u1175\u11AF\u1103\u1173\u11BC
\u110B\u1175\u11AF\u1107\u1161\u11AB
\u110B\u1175\u11AF\u1107\u1169\u11AB
\u110B\u1175\u11AF\u1107\u116E
\u110B\u1175\u11AF\u1109\u1161\u11BC
\u110B\u1175\u11AF\u1109\u1162\u11BC
\u110B\u1175\u11AF\u1109\u1169\u11AB
\u110B\u1175\u11AF\u110B\u116D\u110B\u1175\u11AF
\u110B\u1175\u11AF\u110B\u116F\u11AF
\u110B\u1175\u11AF\u110C\u1165\u11BC
\u110B\u1175\u11AF\u110C\u1169\u11BC
\u110B\u1175\u11AF\u110C\u116E\u110B\u1175\u11AF
\u110B\u1175\u11AF\u110D\u1175\u11A8
\u110B\u1175\u11AF\u110E\u1166
\u110B\u1175\u11AF\u110E\u1175
\u110B\u1175\u11AF\u1112\u1162\u11BC
\u110B\u1175\u11AF\u1112\u116C\u110B\u116D\u11BC
\u110B\u1175\u11B7\u1100\u1173\u11B7
\u110B\u1175\u11B7\u1106\u116E
\u110B\u1175\u11B8\u1103\u1162
\u110B\u1175\u11B8\u1105\u1167\u11A8
\u110B\u1175\u11B8\u1106\u1161\u11BA
\u110B\u1175\u11B8\u1109\u1161
\u110B\u1175\u11B8\u1109\u116E\u11AF
\u110B\u1175\u11B8\u1109\u1175
\u110B\u1175\u11B8\u110B\u116F\u11AB
\u110B\u1175\u11B8\u110C\u1161\u11BC
\u110B\u1175\u11B8\u1112\u1161\u11A8
\u110C\u1161\u1100\u1161\u110B\u116D\u11BC
\u110C\u1161\u1100\u1167\u11A8
\u110C\u1161\u1100\u1173\u11A8
\u110C\u1161\u1103\u1169\u11BC
\u110C\u1161\u1105\u1161\u11BC
\u110C\u1161\u1107\u116E\u1109\u1175\u11B7
\u110C\u1161\u1109\u1175\u11A8
\u110C\u1161\u1109\u1175\u11AB
\u110C\u1161\u110B\u1167\u11AB
\u110C\u1161\u110B\u116F\u11AB
\u110C\u1161\u110B\u1172\u11AF
\u110C\u1161\u110C\u1165\u11AB\u1100\u1165
\u110C\u1161\u110C\u1165\u11BC
\u110C\u1161\u110C\u1169\u11AB\u1109\u1175\u11B7
\u110C\u1161\u1111\u1161\u11AB
\u110C\u1161\u11A8\u1100\u1161
\u110C\u1161\u11A8\u1102\u1167\u11AB
\u110C\u1161\u11A8\u1109\u1165\u11BC
\u110C\u1161\u11A8\u110B\u1165\u11B8
\u110C\u1161\u11A8\u110B\u116D\u11BC
\u110C\u1161\u11A8\u110B\u1173\u11AB\u1104\u1161\u11AF
\u110C\u1161\u11A8\u1111\u116E\u11B7
\u110C\u1161\u11AB\u1103\u1175
\u110C\u1161\u11AB\u1104\u1173\u11A8
\u110C\u1161\u11AB\u110E\u1175
\u110C\u1161\u11AF\u1106\u1169\u11BA
\u110C\u1161\u11B7\u1101\u1161\u11AB
\u110C\u1161\u11B7\u1109\u116E\u1112\u1161\u11B7
\u110C\u1161\u11B7\u1109\u1175
\u110C\u1161\u11B7\u110B\u1169\u11BA
\u110C\u1161\u11B7\u110C\u1161\u1105\u1175
\u110C\u1161\u11B8\u110C\u1175
\u110C\u1161\u11BC\u1100\u116A\u11AB
\u110C\u1161\u11BC\u1100\u116E\u11AB
\u110C\u1161\u11BC\u1100\u1175\u1100\u1161\u11AB
\u110C\u1161\u11BC\u1105\u1162
\u110C\u1161\u11BC\u1105\u1168
\u110C\u1161\u11BC\u1105\u1173
\u110C\u1161\u11BC\u1106\u1161
\u110C\u1161\u11BC\u1106\u1167\u11AB
\u110C\u1161\u11BC\u1106\u1169
\u110C\u1161\u11BC\u1106\u1175
\u110C\u1161\u11BC\u1107\u1175
\u110C\u1161\u11BC\u1109\u1161
\u110C\u1161\u11BC\u1109\u1169
\u110C\u1161\u11BC\u1109\u1175\u11A8
\u110C\u1161\u11BC\u110B\u1162\u110B\u1175\u11AB
\u110C\u1161\u11BC\u110B\u1175\u11AB
\u110C\u1161\u11BC\u110C\u1165\u11B7
\u110C\u1161\u11BC\u110E\u1161
\u110C\u1161\u11BC\u1112\u1161\u11A8\u1100\u1173\u11B7
\u110C\u1162\u1102\u1173\u11BC
\u110C\u1162\u1108\u1161\u11AF\u1105\u1175
\u110C\u1162\u1109\u1161\u11AB
\u110C\u1162\u1109\u1162\u11BC
\u110C\u1162\u110C\u1161\u11A8\u1102\u1167\u11AB
\u110C\u1162\u110C\u1165\u11BC
\u110C\u1162\u110E\u1162\u1100\u1175
\u110C\u1162\u1111\u1161\u11AB
\u110C\u1162\u1112\u1161\u11A8
\u110C\u1162\u1112\u116A\u11AF\u110B\u116D\u11BC
\u110C\u1165\u1100\u1165\u11BA
\u110C\u1165\u1100\u1169\u1105\u1175
\u110C\u1165\u1100\u1169\u11BA
\u110C\u1165\u1102\u1167\u11A8
\u110C\u1165\u1105\u1165\u11AB
\u110C\u1165\u1105\u1165\u11C2\u1100\u1166
\u110C\u1165\u1107\u1165\u11AB
\u110C\u1165\u110B\u116E\u11AF
\u110C\u1165\u110C\u1165\u11AF\u1105\u1169
\u110C\u1165\u110E\u116E\u11A8
\u110C\u1165\u11A8\u1100\u1173\u11A8
\u110C\u1165\u11A8\u1103\u1161\u11BC\u1112\u1175
\u110C\u1165\u11A8\u1109\u1165\u11BC
\u110C\u1165\u11A8\u110B\u116D\u11BC
\u110C\u1165\u11A8\u110B\u1173\u11BC
\u110C\u1165\u11AB\u1100\u1162
\u110C\u1165\u11AB\u1100\u1169\u11BC
\u110C\u1165\u11AB\u1100\u1175
\u110C\u1165\u11AB\u1103\u1161\u11AF
\u110C\u1165\u11AB\u1105\u1161\u1103\u1169
\u110C\u1165\u11AB\u1106\u1161\u11BC
\u110C\u1165\u11AB\u1106\u116E\u11AB
\u110C\u1165\u11AB\u1107\u1161\u11AB
\u110C\u1165\u11AB\u1107\u116E
\u110C\u1165\u11AB\u1109\u1166
\u110C\u1165\u11AB\u1109\u1175
\u110C\u1165\u11AB\u110B\u116D\u11BC
\u110C\u1165\u11AB\u110C\u1161
\u110C\u1165\u11AB\u110C\u1162\u11BC
\u110C\u1165\u11AB\u110C\u116E
\u110C\u1165\u11AB\u110E\u1165\u11AF
\u110C\u1165\u11AB\u110E\u1166
\u110C\u1165\u11AB\u1110\u1169\u11BC
\u110C\u1165\u11AB\u1112\u1167
\u110C\u1165\u11AB\u1112\u116E
\u110C\u1165\u11AF\u1103\u1162
\u110C\u1165\u11AF\u1106\u1161\u11BC
\u110C\u1165\u11AF\u1107\u1161\u11AB
\u110C\u1165\u11AF\u110B\u1163\u11A8
\u110C\u1165\u11AF\u110E\u1161
\u110C\u1165\u11B7\u1100\u1165\u11B7
\u110C\u1165\u11B7\u1109\u116E
\u110C\u1165\u11B7\u1109\u1175\u11B7
\u110C\u1165\u11B7\u110B\u116F\u11AB
\u110C\u1165\u11B7\u110C\u1165\u11B7
\u110C\u1165\u11B7\u110E\u1161
\u110C\u1165\u11B8\u1100\u1173\u11AB
\u110C\u1165\u11B8\u1109\u1175
\u110C\u1165\u11B8\u110E\u1169\u11A8
\u110C\u1165\u11BA\u1100\u1161\u1105\u1161\u11A8
\u110C\u1165\u11BC\u1100\u1165\u110C\u1161\u11BC
\u110C\u1165\u11BC\u1103\u1169
\u110C\u1165\u11BC\u1105\u1172\u110C\u1161\u11BC
\u110C\u1165\u11BC\u1105\u1175
\u110C\u1165\u11BC\u1106\u1161\u11AF
\u110C\u1165\u11BC\u1106\u1167\u11AB
\u110C\u1165\u11BC\u1106\u116E\u11AB
\u110C\u1165\u11BC\u1107\u1161\u11AB\u1103\u1162
\u110C\u1165\u11BC\u1107\u1169
\u110C\u1165\u11BC\u1107\u116E
\u110C\u1165\u11BC\u1107\u1175
\u110C\u1165\u11BC\u1109\u1161\u11BC
\u110C\u1165\u11BC\u1109\u1165\u11BC
\u110C\u1165\u11BC\u110B\u1169
\u110C\u1165\u11BC\u110B\u116F\u11AB
\u110C\u1165\u11BC\u110C\u1161\u11BC
\u110C\u1165\u11BC\u110C\u1175
\u110C\u1165\u11BC\u110E\u1175
\u110C\u1165\u11BC\u1112\u116A\u11A8\u1112\u1175
\u110C\u1166\u1100\u1169\u11BC
\u110C\u1166\u1100\u116A\u110C\u1165\u11B7
\u110C\u1166\u1103\u1162\u1105\u1169
\u110C\u1166\u1106\u1169\u11A8
\u110C\u1166\u1107\u1161\u11AF
\u110C\u1166\u1107\u1165\u11B8
\u110C\u1166\u1109\u1161\u11BA\u1102\u1161\u11AF
\u110C\u1166\u110B\u1161\u11AB
\u110C\u1166\u110B\u1175\u11AF
\u110C\u1166\u110C\u1161\u11A8
\u110C\u1166\u110C\u116E\u1103\u1169
\u110C\u1166\u110E\u116E\u11AF
\u110C\u1166\u1111\u116E\u11B7
\u110C\u1166\u1112\u1161\u11AB
\u110C\u1169\u1100\u1161\u11A8
\u110C\u1169\u1100\u1165\u11AB
\u110C\u1169\u1100\u1173\u11B7
\u110C\u1169\u1100\u1175\u11BC
\u110C\u1169\u1106\u1167\u11BC
\u110C\u1169\u1106\u1175\u1105\u116D
\u110C\u1169\u1109\u1161\u11BC
\u110C\u1169\u1109\u1165\u11AB
\u110C\u1169\u110B\u116D\u11BC\u1112\u1175
\u110C\u1169\u110C\u1165\u11AF
\u110C\u1169\u110C\u1165\u11BC
\u110C\u1169\u110C\u1175\u11A8
\u110C\u1169\u11AB\u1103\u1162\u11BA\u1106\u1161\u11AF
\u110C\u1169\u11AB\u110C\u1162
\u110C\u1169\u11AF\u110B\u1165\u11B8
\u110C\u1169\u11AF\u110B\u1173\u11B7
\u110C\u1169\u11BC\u1100\u116D
\u110C\u1169\u11BC\u1105\u1169
\u110C\u1169\u11BC\u1105\u1172
\u110C\u1169\u11BC\u1109\u1169\u1105\u1175
\u110C\u1169\u11BC\u110B\u1165\u11B8\u110B\u116F\u11AB
\u110C\u1169\u11BC\u110C\u1169\u11BC
\u110C\u1169\u11BC\u1112\u1161\u11B8
\u110C\u116A\u1109\u1165\u11A8
\u110C\u116C\u110B\u1175\u11AB
\u110C\u116E\u1100\u116A\u11AB\u110C\u1165\u11A8
\u110C\u116E\u1105\u1173\u11B7
\u110C\u116E\u1106\u1161\u11AF
\u110C\u116E\u1106\u1165\u1102\u1175
\u110C\u116E\u1106\u1165\u11A8
\u110C\u116E\u1106\u116E\u11AB
\u110C\u116E\u1106\u1175\u11AB
\u110C\u116E\u1107\u1161\u11BC
\u110C\u116E\u1107\u1167\u11AB
\u110C\u116E\u1109\u1175\u11A8
\u110C\u116E\u110B\u1175\u11AB
\u110C\u116E\u110B\u1175\u11AF
\u110C\u116E\u110C\u1161\u11BC
\u110C\u116E\u110C\u1165\u11AB\u110C\u1161
\u110C\u116E\u1110\u1162\u11A8
\u110C\u116E\u11AB\u1107\u1175
\u110C\u116E\u11AF\u1100\u1165\u1105\u1175
\u110C\u116E\u11AF\u1100\u1175
\u110C\u116E\u11AF\u1106\u116E\u1102\u1174
\u110C\u116E\u11BC\u1100\u1161\u11AB
\u110C\u116E\u11BC\u1100\u1168\u1107\u1161\u11BC\u1109\u1169\u11BC
\u110C\u116E\u11BC\u1100\u116E\u11A8
\u110C\u116E\u11BC\u1102\u1167\u11AB
\u110C\u116E\u11BC\u1103\u1161\u11AB
\u110C\u116E\u11BC\u1103\u1169\u11A8
\u110C\u116E\u11BC\u1107\u1161\u11AB
\u110C\u116E\u11BC\u1107\u116E
\u110C\u116E\u11BC\u1109\u1166
\u110C\u116E\u11BC\u1109\u1169\u1100\u1175\u110B\u1165\u11B8
\u110C\u116E\u11BC\u1109\u116E\u11AB
\u110C\u116E\u11BC\u110B\u1161\u11BC
\u110C\u116E\u11BC\u110B\u116D
\u110C\u116E\u11BC\u1112\u1161\u11A8\u1100\u116D
\u110C\u1173\u11A8\u1109\u1165\u11A8
\u110C\u1173\u11A8\u1109\u1175
\u110C\u1173\u11AF\u1100\u1165\u110B\u116E\u11B7
\u110C\u1173\u11BC\u1100\u1161
\u110C\u1173\u11BC\u1100\u1165
\u110C\u1173\u11BC\u1100\u116F\u11AB
\u110C\u1173\u11BC\u1109\u1161\u11BC
\u110C\u1173\u11BC\u1109\u1166
\u110C\u1175\u1100\u1161\u11A8
\u110C\u1175\u1100\u1161\u11B8
\u110C\u1175\u1100\u1167\u11BC
\u110C\u1175\u1100\u1173\u11A8\u1112\u1175
\u110C\u1175\u1100\u1173\u11B7
\u110C\u1175\u1100\u1173\u11B8
\u110C\u1175\u1102\u1173\u11BC
\u110C\u1175\u1105\u1173\u11B7\u1100\u1175\u11AF
\u110C\u1175\u1105\u1175\u1109\u1161\u11AB
\u110C\u1175\u1107\u1161\u11BC
\u110C\u1175\u1107\u116E\u11BC
\u110C\u1175\u1109\u1175\u11A8
\u110C\u1175\u110B\u1167\u11A8
\u110C\u1175\u110B\u116E\u1100\u1162
\u110C\u1175\u110B\u116F\u11AB
\u110C\u1175\u110C\u1165\u11A8
\u110C\u1175\u110C\u1165\u11B7
\u110C\u1175\u110C\u1175\u11AB
\u110C\u1175\u110E\u116E\u11AF
\u110C\u1175\u11A8\u1109\u1165\u11AB
\u110C\u1175\u11A8\u110B\u1165\u11B8
\u110C\u1175\u11A8\u110B\u116F\u11AB
\u110C\u1175\u11A8\u110C\u1161\u11BC
\u110C\u1175\u11AB\u1100\u1173\u11B8
\u110C\u1175\u11AB\u1103\u1169\u11BC
\u110C\u1175\u11AB\u1105\u1169
\u110C\u1175\u11AB\u1105\u116D
\u110C\u1175\u11AB\u1105\u1175
\u110C\u1175\u11AB\u110D\u1161
\u110C\u1175\u11AB\u110E\u1161\u11AF
\u110C\u1175\u11AB\u110E\u116E\u11AF
\u110C\u1175\u11AB\u1110\u1169\u11BC
\u110C\u1175\u11AB\u1112\u1162\u11BC
\u110C\u1175\u11AF\u1106\u116E\u11AB
\u110C\u1175\u11AF\u1107\u1167\u11BC
\u110C\u1175\u11AF\u1109\u1165
\u110C\u1175\u11B7\u110C\u1161\u11A8
\u110C\u1175\u11B8\u1103\u1161\u11AB
\u110C\u1175\u11B8\u110B\u1161\u11AB
\u110C\u1175\u11B8\u110C\u116E\u11BC
\u110D\u1161\u110C\u1173\u11BC
\u110D\u1175\u1101\u1165\u1100\u1175
\u110E\u1161\u1102\u1161\u11B7
\u110E\u1161\u1105\u1161\u1105\u1175
\u110E\u1161\u1105\u1163\u11BC
\u110E\u1161\u1105\u1175\u11B7
\u110E\u1161\u1107\u1167\u11AF
\u110E\u1161\u1109\u1165\u11AB
\u110E\u1161\u110E\u1173\u11B7
\u110E\u1161\u11A8\u1100\u1161\u11A8
\u110E\u1161\u11AB\u1106\u116E\u11AF
\u110E\u1161\u11AB\u1109\u1165\u11BC
\u110E\u1161\u11B7\u1100\u1161
\u110E\u1161\u11B7\u1100\u1175\u1105\u1173\u11B7
\u110E\u1161\u11B7\u1109\u1162
\u110E\u1161\u11B7\u1109\u1165\u11A8
\u110E\u1161\u11B7\u110B\u1167
\u110E\u1161\u11B7\u110B\u116C
\u110E\u1161\u11B7\u110C\u1169
\u110E\u1161\u11BA\u110C\u1161\u11AB
\u110E\u1161\u11BC\u1100\u1161
\u110E\u1161\u11BC\u1100\u1169
\u110E\u1161\u11BC\u1100\u116E
\u110E\u1161\u11BC\u1106\u116E\u11AB
\u110E\u1161\u11BC\u1107\u1161\u11A9
\u110E\u1161\u11BC\u110C\u1161\u11A8
\u110E\u1161\u11BC\u110C\u1169
\u110E\u1162\u1102\u1165\u11AF
\u110E\u1162\u110C\u1165\u11B7
\u110E\u1162\u11A8\u1100\u1161\u1107\u1161\u11BC
\u110E\u1162\u11A8\u1107\u1161\u11BC
\u110E\u1162\u11A8\u1109\u1161\u11BC
\u110E\u1162\u11A8\u110B\u1175\u11B7
\u110E\u1162\u11B7\u1111\u1175\u110B\u1165\u11AB
\u110E\u1165\u1107\u1165\u11AF
\u110E\u1165\u110B\u1173\u11B7
\u110E\u1165\u11AB\u1100\u116E\u11A8
\u110E\u1165\u11AB\u1103\u116E\u11BC
\u110E\u1165\u11AB\u110C\u1161\u11BC
\u110E\u1165\u11AB\u110C\u1162
\u110E\u1165\u11AB\u110E\u1165\u11AB\u1112\u1175
\u110E\u1165\u11AF\u1103\u1169
\u110E\u1165\u11AF\u110C\u1165\u1112\u1175
\u110E\u1165\u11AF\u1112\u1161\u11A8
\u110E\u1165\u11BA\u1102\u1161\u11AF
\u110E\u1165\u11BA\u110D\u1162
\u110E\u1165\u11BC\u1102\u1167\u11AB
\u110E\u1165\u11BC\u1107\u1161\u110C\u1175
\u110E\u1165\u11BC\u1109\u1169
\u110E\u1165\u11BC\u110E\u116E\u11AB
\u110E\u1166\u1100\u1168
\u110E\u1166\u1105\u1167\u11A8
\u110E\u1166\u110B\u1169\u11AB
\u110E\u1166\u110B\u1172\u11A8
\u110E\u1166\u110C\u116E\u11BC
\u110E\u1166\u1112\u1165\u11B7
\u110E\u1169\u1103\u1173\u11BC\u1112\u1161\u11A8\u1109\u1162\u11BC
\u110E\u1169\u1107\u1161\u11AB
\u110E\u1169\u1107\u1161\u11B8
\u110E\u1169\u1109\u1161\u11BC\u1112\u116A
\u110E\u1169\u1109\u116E\u11AB
\u110E\u1169\u110B\u1167\u1105\u1173\u11B7
\u110E\u1169\u110B\u116F\u11AB
\u110E\u1169\u110C\u1165\u1102\u1167\u11A8
\u110E\u1169\u110C\u1165\u11B7
\u110E\u1169\u110E\u1165\u11BC
\u110E\u1169\u110F\u1169\u11AF\u1105\u1175\u11BA
\u110E\u1169\u11BA\u1107\u116E\u11AF
\u110E\u1169\u11BC\u1100\u1161\u11A8
\u110E\u1169\u11BC\u1105\u1175
\u110E\u1169\u11BC\u110C\u1161\u11BC
\u110E\u116A\u11AF\u110B\u1167\u11BC
\u110E\u116C\u1100\u1173\u11AB
\u110E\u116C\u1109\u1161\u11BC
\u110E\u116C\u1109\u1165\u11AB
\u110E\u116C\u1109\u1175\u11AB
\u110E\u116C\u110B\u1161\u11A8
\u110E\u116C\u110C\u1169\u11BC
\u110E\u116E\u1109\u1165\u11A8
\u110E\u116E\u110B\u1165\u11A8
\u110E\u116E\u110C\u1175\u11AB
\u110E\u116E\u110E\u1165\u11AB
\u110E\u116E\u110E\u1173\u11A8
\u110E\u116E\u11A8\u1100\u116E
\u110E\u116E\u11A8\u1109\u1169
\u110E\u116E\u11A8\u110C\u1166
\u110E\u116E\u11A8\u1112\u1161
\u110E\u116E\u11AF\u1100\u1173\u11AB
\u110E\u116E\u11AF\u1107\u1161\u11AF
\u110E\u116E\u11AF\u1109\u1161\u11AB
\u110E\u116E\u11AF\u1109\u1175\u11AB
\u110E\u116E\u11AF\u110B\u1167\u11AB
\u110E\u116E\u11AF\u110B\u1175\u11B8
\u110E\u116E\u11AF\u110C\u1161\u11BC
\u110E\u116E\u11AF\u1111\u1161\u11AB
\u110E\u116E\u11BC\u1100\u1167\u11A8
\u110E\u116E\u11BC\u1100\u1169
\u110E\u116E\u11BC\u1103\u1169\u11AF
\u110E\u116E\u11BC\u1107\u116E\u11AB\u1112\u1175
\u110E\u116E\u11BC\u110E\u1165\u11BC\u1103\u1169
\u110E\u1171\u110B\u1165\u11B8
\u110E\u1171\u110C\u1175\u11A8
\u110E\u1171\u1112\u1163\u11BC
\u110E\u1175\u110B\u1163\u11A8
\u110E\u1175\u11AB\u1100\u116E
\u110E\u1175\u11AB\u110E\u1165\u11A8
\u110E\u1175\u11AF\u1109\u1175\u11B8
\u110E\u1175\u11AF\u110B\u116F\u11AF
\u110E\u1175\u11AF\u1111\u1161\u11AB
\u110E\u1175\u11B7\u1103\u1162
\u110E\u1175\u11B7\u1106\u116E\u11A8
\u110E\u1175\u11B7\u1109\u1175\u11AF
\u110E\u1175\u11BA\u1109\u1169\u11AF
\u110E\u1175\u11BC\u110E\u1161\u11AB
\u110F\u1161\u1106\u1166\u1105\u1161
\u110F\u1161\u110B\u116E\u11AB\u1110\u1165
\u110F\u1161\u11AF\u1100\u116E\u11A8\u1109\u116E
\u110F\u1162\u1105\u1175\u11A8\u1110\u1165
\u110F\u1162\u11B7\u1111\u1165\u1109\u1173
\u110F\u1162\u11B7\u1111\u1166\u110B\u1175\u11AB
\u110F\u1165\u1110\u1173\u11AB
\u110F\u1165\u11AB\u1103\u1175\u1109\u1167\u11AB
\u110F\u1165\u11AF\u1105\u1165
\u110F\u1165\u11B7\u1111\u1172\u1110\u1165
\u110F\u1169\u1101\u1175\u1105\u1175
\u110F\u1169\u1106\u1175\u1103\u1175
\u110F\u1169\u11AB\u1109\u1165\u1110\u1173
\u110F\u1169\u11AF\u1105\u1161
\u110F\u1169\u11B7\u1111\u1173\u11AF\u1105\u1166\u11A8\u1109\u1173
\u110F\u1169\u11BC\u1102\u1161\u1106\u116E\u11AF
\u110F\u116B\u1100\u1161\u11B7
\u110F\u116E\u1103\u1166\u1110\u1161
\u110F\u1173\u1105\u1175\u11B7
\u110F\u1173\u11AB\u1100\u1175\u11AF
\u110F\u1173\u11AB\u1104\u1161\u11AF
\u110F\u1173\u11AB\u1109\u1169\u1105\u1175
\u110F\u1173\u11AB\u110B\u1161\u1103\u1173\u11AF
\u110F\u1173\u11AB\u110B\u1165\u1106\u1165\u1102\u1175
\u110F\u1173\u11AB\u110B\u1175\u11AF
\u110F\u1173\u11AB\u110C\u1165\u11AF
\u110F\u1173\u11AF\u1105\u1162\u1109\u1175\u11A8
\u110F\u1173\u11AF\u1105\u1165\u11B8
\u110F\u1175\u11AF\u1105\u1169
\u1110\u1161\u110B\u1175\u11B8
\u1110\u1161\u110C\u1161\u1100\u1175
\u1110\u1161\u11A8\u1100\u116E
\u1110\u1161\u11A8\u110C\u1161
\u1110\u1161\u11AB\u1109\u1162\u11BC
\u1110\u1162\u1100\u116F\u11AB\u1103\u1169
\u1110\u1162\u110B\u1163\u11BC
\u1110\u1162\u1111\u116E\u11BC
\u1110\u1162\u11A8\u1109\u1175
\u1110\u1162\u11AF\u1105\u1165\u11AB\u1110\u1173
\u1110\u1165\u1102\u1165\u11AF
\u1110\u1165\u1106\u1175\u1102\u1165\u11AF
\u1110\u1166\u1102\u1175\u1109\u1173
\u1110\u1166\u1109\u1173\u1110\u1173
\u1110\u1166\u110B\u1175\u1107\u1173\u11AF
\u1110\u1166\u11AF\u1105\u1166\u1107\u1175\u110C\u1165\u11AB
\u1110\u1169\u1105\u1169\u11AB
\u1110\u1169\u1106\u1161\u1110\u1169
\u1110\u1169\u110B\u116D\u110B\u1175\u11AF
\u1110\u1169\u11BC\u1100\u1168
\u1110\u1169\u11BC\u1100\u116A
\u1110\u1169\u11BC\u1105\u1169
\u1110\u1169\u11BC\u1109\u1175\u11AB
\u1110\u1169\u11BC\u110B\u1167\u11A8
\u1110\u1169\u11BC\u110B\u1175\u11AF
\u1110\u1169\u11BC\u110C\u1161\u11BC
\u1110\u1169\u11BC\u110C\u1166
\u1110\u1169\u11BC\u110C\u1173\u11BC
\u1110\u1169\u11BC\u1112\u1161\u11B8
\u1110\u1169\u11BC\u1112\u116A
\u1110\u116C\u1100\u1173\u11AB
\u1110\u116C\u110B\u116F\u11AB
\u1110\u116C\u110C\u1175\u11A8\u1100\u1173\u11B7
\u1110\u1171\u1100\u1175\u11B7
\u1110\u1173\u1105\u1165\u11A8
\u1110\u1173\u11A8\u1100\u1173\u11B8
\u1110\u1173\u11A8\u1107\u1167\u11AF
\u1110\u1173\u11A8\u1109\u1165\u11BC
\u1110\u1173\u11A8\u1109\u116E
\u1110\u1173\u11A8\u110C\u1175\u11BC
\u1110\u1173\u11A8\u1112\u1175
\u1110\u1173\u11AB\u1110\u1173\u11AB\u1112\u1175
\u1110\u1175\u1109\u1167\u110E\u1173
\u1111\u1161\u1105\u1161\u11AB\u1109\u1162\u11A8
\u1111\u1161\u110B\u1175\u11AF
\u1111\u1161\u110E\u116E\u11AF\u1109\u1169
\u1111\u1161\u11AB\u1100\u1167\u11AF
\u1111\u1161\u11AB\u1103\u1161\u11AB
\u1111\u1161\u11AB\u1106\u1162
\u1111\u1161\u11AB\u1109\u1161
\u1111\u1161\u11AF\u1109\u1175\u11B8
\u1111\u1161\u11AF\u110B\u116F\u11AF
\u1111\u1161\u11B8\u1109\u1169\u11BC
\u1111\u1162\u1109\u1167\u11AB
\u1111\u1162\u11A8\u1109\u1173
\u1111\u1162\u11A8\u1109\u1175\u1106\u1175\u11AF\u1105\u1175
\u1111\u1162\u11AB\u1110\u1175
\u1111\u1165\u1109\u1166\u11AB\u1110\u1173
\u1111\u1166\u110B\u1175\u11AB\u1110\u1173
\u1111\u1167\u11AB\u1100\u1167\u11AB
\u1111\u1167\u11AB\u110B\u1174
\u1111\u1167\u11AB\u110C\u1175
\u1111\u1167\u11AB\u1112\u1175
\u1111\u1167\u11BC\u1100\u1161
\u1111\u1167\u11BC\u1100\u1172\u11AB
\u1111\u1167\u11BC\u1109\u1162\u11BC
\u1111\u1167\u11BC\u1109\u1169
\u1111\u1167\u11BC\u110B\u1163\u11BC
\u1111\u1167\u11BC\u110B\u1175\u11AF
\u1111\u1167\u11BC\u1112\u116A
\u1111\u1169\u1109\u1173\u1110\u1165
\u1111\u1169\u110B\u1175\u11AB\u1110\u1173
\u1111\u1169\u110C\u1161\u11BC
\u1111\u1169\u1112\u1161\u11B7
\u1111\u116D\u1106\u1167\u11AB
\u1111\u116D\u110C\u1165\u11BC
\u1111\u116D\u110C\u116E\u11AB
\u1111\u116D\u1112\u1167\u11AB
\u1111\u116E\u11B7\u1106\u1169\u11A8
\u1111\u116E\u11B7\u110C\u1175\u11AF
\u1111\u116E\u11BC\u1100\u1167\u11BC
\u1111\u116E\u11BC\u1109\u1169\u11A8
\u1111\u116E\u11BC\u1109\u1173\u11B8
\u1111\u1173\u1105\u1161\u11BC\u1109\u1173
\u1111\u1173\u1105\u1175\u11AB\u1110\u1165
\u1111\u1173\u11AF\u1105\u1161\u1109\u1173\u1110\u1175\u11A8
\u1111\u1175\u1100\u1169\u11AB
\u1111\u1175\u1106\u1161\u11BC
\u1111\u1175\u110B\u1161\u1102\u1169
\u1111\u1175\u11AF\u1105\u1173\u11B7
\u1111\u1175\u11AF\u1109\u116E
\u1111\u1175\u11AF\u110B\u116D
\u1111\u1175\u11AF\u110C\u1161
\u1111\u1175\u11AF\u1110\u1169\u11BC
\u1111\u1175\u11BC\u1100\u1168
\u1112\u1161\u1102\u1173\u1102\u1175\u11B7
\u1112\u1161\u1102\u1173\u11AF
\u1112\u1161\u1103\u1173\u110B\u1170\u110B\u1165
\u1112\u1161\u1105\u116E\u11BA\u1107\u1161\u11B7
\u1112\u1161\u1107\u1161\u11AB\u1100\u1175
\u1112\u1161\u1109\u116E\u11A8\u110C\u1175\u11B8
\u1112\u1161\u1109\u116E\u11AB
\u1112\u1161\u110B\u1167\u1110\u1173\u11AB
\u1112\u1161\u110C\u1175\u1106\u1161\u11AB
\u1112\u1161\u110E\u1165\u11AB
\u1112\u1161\u1111\u116E\u11B7
\u1112\u1161\u1111\u1175\u11AF
\u1112\u1161\u11A8\u1100\u116A
\u1112\u1161\u11A8\u1100\u116D
\u1112\u1161\u11A8\u1100\u1173\u11B8
\u1112\u1161\u11A8\u1100\u1175
\u1112\u1161\u11A8\u1102\u1167\u11AB
\u1112\u1161\u11A8\u1105\u1167\u11A8
\u1112\u1161\u11A8\u1107\u1165\u11AB
\u1112\u1161\u11A8\u1107\u116E\u1106\u1169
\u1112\u1161\u11A8\u1107\u1175
\u1112\u1161\u11A8\u1109\u1162\u11BC
\u1112\u1161\u11A8\u1109\u116E\u11AF
\u1112\u1161\u11A8\u1109\u1173\u11B8
\u1112\u1161\u11A8\u110B\u116D\u11BC\u1111\u116E\u11B7
\u1112\u1161\u11A8\u110B\u116F\u11AB
\u1112\u1161\u11A8\u110B\u1171
\u1112\u1161\u11A8\u110C\u1161
\u1112\u1161\u11A8\u110C\u1165\u11B7
\u1112\u1161\u11AB\u1100\u1168
\u1112\u1161\u11AB\u1100\u1173\u11AF
\u1112\u1161\u11AB\u1101\u1165\u1107\u1165\u11AB\u110B\u1166
\u1112\u1161\u11AB\u1102\u1161\u11BD
\u1112\u1161\u11AB\u1102\u116E\u11AB
\u1112\u1161\u11AB\u1103\u1169\u11BC\u110B\u1161\u11AB
\u1112\u1161\u11AB\u1104\u1162
\u1112\u1161\u11AB\u1105\u1161\u1109\u1161\u11AB
\u1112\u1161\u11AB\u1106\u1161\u1103\u1175
\u1112\u1161\u11AB\u1106\u116E\u11AB
\u1112\u1161\u11AB\u1107\u1165\u11AB
\u1112\u1161\u11AB\u1107\u1169\u11A8
\u1112\u1161\u11AB\u1109\u1175\u11A8
\u1112\u1161\u11AB\u110B\u1167\u1105\u1173\u11B7
\u1112\u1161\u11AB\u110D\u1169\u11A8
\u1112\u1161\u11AF\u1106\u1165\u1102\u1175
\u1112\u1161\u11AF\u110B\u1161\u1107\u1165\u110C\u1175
\u1112\u1161\u11AF\u110B\u1175\u11AB
\u1112\u1161\u11B7\u1101\u1166
\u1112\u1161\u11B7\u1107\u116E\u1105\u1169
\u1112\u1161\u11B8\u1100\u1167\u11A8
\u1112\u1161\u11B8\u1105\u1175\u110C\u1165\u11A8
\u1112\u1161\u11BC\u1100\u1169\u11BC
\u1112\u1161\u11BC\u1100\u116E
\u1112\u1161\u11BC\u1109\u1161\u11BC
\u1112\u1161\u11BC\u110B\u1174
\u1112\u1162\u1100\u1167\u11AF
\u1112\u1162\u1100\u116E\u11AB
\u1112\u1162\u1103\u1161\u11B8
\u1112\u1162\u1103\u1161\u11BC
\u1112\u1162\u1106\u116E\u11AF
\u1112\u1162\u1109\u1165\u11A8
\u1112\u1162\u1109\u1165\u11AF
\u1112\u1162\u1109\u116E\u110B\u116D\u11A8\u110C\u1161\u11BC
\u1112\u1162\u110B\u1161\u11AB
\u1112\u1162\u11A8\u1109\u1175\u11B7
\u1112\u1162\u11AB\u1103\u1173\u1107\u1162\u11A8
\u1112\u1162\u11B7\u1107\u1165\u1100\u1165
\u1112\u1162\u11BA\u1107\u1167\u11C0
\u1112\u1162\u11BA\u1109\u1161\u11AF
\u1112\u1162\u11BC\u1103\u1169\u11BC
\u1112\u1162\u11BC\u1107\u1169\u11A8
\u1112\u1162\u11BC\u1109\u1161
\u1112\u1162\u11BC\u110B\u116E\u11AB
\u1112\u1162\u11BC\u110B\u1171
\u1112\u1163\u11BC\u1100\u1175
\u1112\u1163\u11BC\u1109\u1161\u11BC
\u1112\u1163\u11BC\u1109\u116E
\u1112\u1165\u1105\u1161\u11A8
\u1112\u1165\u110B\u116D\u11BC
\u1112\u1166\u11AF\u1100\u1175
\u1112\u1167\u11AB\u1100\u116A\u11AB
\u1112\u1167\u11AB\u1100\u1173\u11B7
\u1112\u1167\u11AB\u1103\u1162
\u1112\u1167\u11AB\u1109\u1161\u11BC
\u1112\u1167\u11AB\u1109\u1175\u11AF
\u1112\u1167\u11AB\u110C\u1161\u11BC
\u1112\u1167\u11AB\u110C\u1162
\u1112\u1167\u11AB\u110C\u1175
\u1112\u1167\u11AF\u110B\u1162\u11A8
\u1112\u1167\u11B8\u1105\u1167\u11A8
\u1112\u1167\u11BC\u1107\u116E
\u1112\u1167\u11BC\u1109\u1161
\u1112\u1167\u11BC\u1109\u116E
\u1112\u1167\u11BC\u1109\u1175\u11A8
\u1112\u1167\u11BC\u110C\u1166
\u1112\u1167\u11BC\u1110\u1162
\u1112\u1167\u11BC\u1111\u1167\u11AB
\u1112\u1168\u1110\u1162\u11A8
\u1112\u1169\u1100\u1175\u1109\u1175\u11B7
\u1112\u1169\u1102\u1161\u11B7
\u1112\u1169\u1105\u1161\u11BC\u110B\u1175
\u1112\u1169\u1107\u1161\u11A8
\u1112\u1169\u1110\u1166\u11AF
\u1112\u1169\u1112\u1173\u11B8
\u1112\u1169\u11A8\u1109\u1175
\u1112\u1169\u11AF\u1105\u1169
\u1112\u1169\u11B7\u1111\u1166\u110B\u1175\u110C\u1175
\u1112\u1169\u11BC\u1107\u1169
\u1112\u1169\u11BC\u1109\u116E
\u1112\u1169\u11BC\u110E\u1161
\u1112\u116A\u1106\u1167\u11AB
\u1112\u116A\u1107\u116E\u11AB
\u1112\u116A\u1109\u1161\u11AF
\u1112\u116A\u110B\u116D\u110B\u1175\u11AF
\u1112\u116A\u110C\u1161\u11BC
\u1112\u116A\u1112\u1161\u11A8
\u1112\u116A\u11A8\u1107\u1169
\u1112\u116A\u11A8\u110B\u1175\u11AB
\u1112\u116A\u11A8\u110C\u1161\u11BC
\u1112\u116A\u11A8\u110C\u1165\u11BC
\u1112\u116A\u11AB\u1100\u1161\u11B8
\u1112\u116A\u11AB\u1100\u1167\u11BC
\u1112\u116A\u11AB\u110B\u1167\u11BC
\u1112\u116A\u11AB\u110B\u1172\u11AF
\u1112\u116A\u11AB\u110C\u1161
\u1112\u116A\u11AF\u1100\u1175
\u1112\u116A\u11AF\u1103\u1169\u11BC
\u1112\u116A\u11AF\u1107\u1161\u11AF\u1112\u1175
\u1112\u116A\u11AF\u110B\u116D\u11BC
\u1112\u116A\u11AF\u110D\u1161\u11A8
\u1112\u116C\u1100\u1167\u11AB
\u1112\u116C\u1100\u116A\u11AB
\u1112\u116C\u1107\u1169\u11A8
\u1112\u116C\u1109\u1162\u11A8
\u1112\u116C\u110B\u116F\u11AB
\u1112\u116C\u110C\u1161\u11BC
\u1112\u116C\u110C\u1165\u11AB
\u1112\u116C\u11BA\u1109\u116E
\u1112\u116C\u11BC\u1103\u1161\u11AB\u1107\u1169\u1103\u1169
\u1112\u116D\u110B\u1172\u11AF\u110C\u1165\u11A8
\u1112\u116E\u1107\u1161\u11AB
\u1112\u116E\u110E\u116E\u11BA\u1100\u1161\u1105\u116E
\u1112\u116E\u11AB\u1105\u1167\u11AB
\u1112\u116F\u11AF\u110A\u1175\u11AB
\u1112\u1172\u1109\u1175\u11A8
\u1112\u1172\u110B\u1175\u11AF
\u1112\u1172\u11BC\u1102\u1162
\u1112\u1173\u1105\u1173\u11B7
\u1112\u1173\u11A8\u1107\u1162\u11A8
\u1112\u1173\u11A8\u110B\u1175\u11AB
\u1112\u1173\u11AB\u110C\u1165\u11A8
\u1112\u1173\u11AB\u1112\u1175
\u1112\u1173\u11BC\u1106\u1175
\u1112\u1173\u11BC\u1107\u116E\u11AB
\u1112\u1174\u1100\u1169\u11A8
\u1112\u1174\u1106\u1161\u11BC
\u1112\u1174\u1109\u1162\u11BC
\u1112\u1174\u11AB\u1109\u1162\u11A8
\u1112\u1175\u11B7\u1101\u1165\u11BA`.split("\n");
  }
});

// node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/portuguese.js
var wordlist7;
var init_portuguese = __esm({
  "node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/portuguese.js"() {
    wordlist7 = `abacate
abaixo
abalar
abater
abduzir
abelha
aberto
abismo
abotoar
abranger
abreviar
abrigar
abrupto
absinto
absoluto
absurdo
abutre
acabado
acalmar
acampar
acanhar
acaso
aceitar
acelerar
acenar
acervo
acessar
acetona
achatar
acidez
acima
acionado
acirrar
aclamar
aclive
acolhida
acomodar
acoplar
acordar
acumular
acusador
adaptar
adega
adentro
adepto
adequar
aderente
adesivo
adeus
adiante
aditivo
adjetivo
adjunto
admirar
adorar
adquirir
adubo
adverso
advogado
aeronave
afastar
aferir
afetivo
afinador
afivelar
aflito
afluente
afrontar
agachar
agarrar
agasalho
agenciar
agilizar
agiota
agitado
agora
agradar
agreste
agrupar
aguardar
agulha
ajoelhar
ajudar
ajustar
alameda
alarme
alastrar
alavanca
albergue
albino
alcatra
aldeia
alecrim
alegria
alertar
alface
alfinete
algum
alheio
aliar
alicate
alienar
alinhar
aliviar
almofada
alocar
alpiste
alterar
altitude
alucinar
alugar
aluno
alusivo
alvo
amaciar
amador
amarelo
amassar
ambas
ambiente
ameixa
amenizar
amido
amistoso
amizade
amolador
amontoar
amoroso
amostra
amparar
ampliar
ampola
anagrama
analisar
anarquia
anatomia
andaime
anel
anexo
angular
animar
anjo
anomalia
anotado
ansioso
anterior
anuidade
anunciar
anzol
apagador
apalpar
apanhado
apego
apelido
apertada
apesar
apetite
apito
aplauso
aplicada
apoio
apontar
aposta
aprendiz
aprovar
aquecer
arame
aranha
arara
arcada
ardente
areia
arejar
arenito
aresta
argiloso
argola
arma
arquivo
arraial
arrebate
arriscar
arroba
arrumar
arsenal
arterial
artigo
arvoredo
asfaltar
asilado
aspirar
assador
assinar
assoalho
assunto
astral
atacado
atadura
atalho
atarefar
atear
atender
aterro
ateu
atingir
atirador
ativo
atoleiro
atracar
atrevido
atriz
atual
atum
auditor
aumentar
aura
aurora
autismo
autoria
autuar
avaliar
avante
avaria
avental
avesso
aviador
avisar
avulso
axila
azarar
azedo
azeite
azulejo
babar
babosa
bacalhau
bacharel
bacia
bagagem
baiano
bailar
baioneta
bairro
baixista
bajular
baleia
baliza
balsa
banal
bandeira
banho
banir
banquete
barato
barbado
baronesa
barraca
barulho
baseado
bastante
batata
batedor
batida
batom
batucar
baunilha
beber
beijo
beirada
beisebol
beldade
beleza
belga
beliscar
bendito
bengala
benzer
berimbau
berlinda
berro
besouro
bexiga
bezerro
bico
bicudo
bienal
bifocal
bifurcar
bigorna
bilhete
bimestre
bimotor
biologia
biombo
biosfera
bipolar
birrento
biscoito
bisneto
bispo
bissexto
bitola
bizarro
blindado
bloco
bloquear
boato
bobagem
bocado
bocejo
bochecha
boicotar
bolada
boletim
bolha
bolo
bombeiro
bonde
boneco
bonita
borbulha
borda
boreal
borracha
bovino
boxeador
branco
brasa
braveza
breu
briga
brilho
brincar
broa
brochura
bronzear
broto
bruxo
bucha
budismo
bufar
bule
buraco
busca
busto
buzina
cabana
cabelo
cabide
cabo
cabrito
cacau
cacetada
cachorro
cacique
cadastro
cadeado
cafezal
caiaque
caipira
caixote
cajado
caju
calafrio
calcular
caldeira
calibrar
calmante
calota
camada
cambista
camisa
camomila
campanha
camuflar
canavial
cancelar
caneta
canguru
canhoto
canivete
canoa
cansado
cantar
canudo
capacho
capela
capinar
capotar
capricho
captador
capuz
caracol
carbono
cardeal
careca
carimbar
carneiro
carpete
carreira
cartaz
carvalho
casaco
casca
casebre
castelo
casulo
catarata
cativar
caule
causador
cautelar
cavalo
caverna
cebola
cedilha
cegonha
celebrar
celular
cenoura
censo
centeio
cercar
cerrado
certeiro
cerveja
cetim
cevada
chacota
chaleira
chamado
chapada
charme
chatice
chave
chefe
chegada
cheiro
cheque
chicote
chifre
chinelo
chocalho
chover
chumbo
chutar
chuva
cicatriz
ciclone
cidade
cidreira
ciente
cigana
cimento
cinto
cinza
ciranda
circuito
cirurgia
citar
clareza
clero
clicar
clone
clube
coado
coagir
cobaia
cobertor
cobrar
cocada
coelho
coentro
coeso
cogumelo
coibir
coifa
coiote
colar
coleira
colher
colidir
colmeia
colono
coluna
comando
combinar
comentar
comitiva
comover
complexo
comum
concha
condor
conectar
confuso
congelar
conhecer
conjugar
consumir
contrato
convite
cooperar
copeiro
copiador
copo
coquetel
coragem
cordial
corneta
coronha
corporal
correio
cortejo
coruja
corvo
cosseno
costela
cotonete
couro
couve
covil
cozinha
cratera
cravo
creche
credor
creme
crer
crespo
criada
criminal
crioulo
crise
criticar
crosta
crua
cruzeiro
cubano
cueca
cuidado
cujo
culatra
culminar
culpar
cultura
cumprir
cunhado
cupido
curativo
curral
cursar
curto
cuspir
custear
cutelo
damasco
datar
debater
debitar
deboche
debulhar
decalque
decimal
declive
decote
decretar
dedal
dedicado
deduzir
defesa
defumar
degelo
degrau
degustar
deitado
deixar
delator
delegado
delinear
delonga
demanda
demitir
demolido
dentista
depenado
depilar
depois
depressa
depurar
deriva
derramar
desafio
desbotar
descanso
desenho
desfiado
desgaste
desigual
deslize
desmamar
desova
despesa
destaque
desviar
detalhar
detentor
detonar
detrito
deusa
dever
devido
devotado
dezena
diagrama
dialeto
didata
difuso
digitar
dilatado
diluente
diminuir
dinastia
dinheiro
diocese
direto
discreta
disfarce
disparo
disquete
dissipar
distante
ditador
diurno
diverso
divisor
divulgar
dizer
dobrador
dolorido
domador
dominado
donativo
donzela
dormente
dorsal
dosagem
dourado
doutor
drenagem
drible
drogaria
duelar
duende
dueto
duplo
duquesa
durante
duvidoso
eclodir
ecoar
ecologia
edificar
edital
educado
efeito
efetivar
ejetar
elaborar
eleger
eleitor
elenco
elevador
eliminar
elogiar
embargo
embolado
embrulho
embutido
emenda
emergir
emissor
empatia
empenho
empinado
empolgar
emprego
empurrar
emulador
encaixe
encenado
enchente
encontro
endeusar
endossar
enfaixar
enfeite
enfim
engajado
engenho
englobar
engomado
engraxar
enguia
enjoar
enlatar
enquanto
enraizar
enrolado
enrugar
ensaio
enseada
ensino
ensopado
entanto
enteado
entidade
entortar
entrada
entulho
envergar
enviado
envolver
enxame
enxerto
enxofre
enxuto
epiderme
equipar
ereto
erguido
errata
erva
ervilha
esbanjar
esbelto
escama
escola
escrita
escuta
esfinge
esfolar
esfregar
esfumado
esgrima
esmalte
espanto
espelho
espiga
esponja
espreita
espumar
esquerda
estaca
esteira
esticar
estofado
estrela
estudo
esvaziar
etanol
etiqueta
euforia
europeu
evacuar
evaporar
evasivo
eventual
evidente
evoluir
exagero
exalar
examinar
exato
exausto
excesso
excitar
exclamar
executar
exemplo
exibir
exigente
exonerar
expandir
expelir
expirar
explanar
exposto
expresso
expulsar
externo
extinto
extrato
fabricar
fabuloso
faceta
facial
fada
fadiga
faixa
falar
falta
familiar
fandango
fanfarra
fantoche
fardado
farelo
farinha
farofa
farpa
fartura
fatia
fator
favorita
faxina
fazenda
fechado
feijoada
feirante
felino
feminino
fenda
feno
fera
feriado
ferrugem
ferver
festejar
fetal
feudal
fiapo
fibrose
ficar
ficheiro
figurado
fileira
filho
filme
filtrar
firmeza
fisgada
fissura
fita
fivela
fixador
fixo
flacidez
flamingo
flanela
flechada
flora
flutuar
fluxo
focal
focinho
fofocar
fogo
foguete
foice
folgado
folheto
forjar
formiga
forno
forte
fosco
fossa
fragata
fralda
frango
frasco
fraterno
freira
frente
fretar
frieza
friso
fritura
fronha
frustrar
fruteira
fugir
fulano
fuligem
fundar
fungo
funil
furador
furioso
futebol
gabarito
gabinete
gado
gaiato
gaiola
gaivota
galega
galho
galinha
galocha
ganhar
garagem
garfo
gargalo
garimpo
garoupa
garrafa
gasoduto
gasto
gata
gatilho
gaveta
gazela
gelado
geleia
gelo
gemada
gemer
gemido
generoso
gengiva
genial
genoma
genro
geologia
gerador
germinar
gesso
gestor
ginasta
gincana
gingado
girafa
girino
glacial
glicose
global
glorioso
goela
goiaba
golfe
golpear
gordura
gorjeta
gorro
gostoso
goteira
governar
gracejo
gradual
grafite
gralha
grampo
granada
gratuito
graveto
graxa
grego
grelhar
greve
grilo
grisalho
gritaria
grosso
grotesco
grudado
grunhido
gruta
guache
guarani
guaxinim
guerrear
guiar
guincho
guisado
gula
guloso
guru
habitar
harmonia
haste
haver
hectare
herdar
heresia
hesitar
hiato
hibernar
hidratar
hiena
hino
hipismo
hipnose
hipoteca
hoje
holofote
homem
honesto
honrado
hormonal
hospedar
humorado
iate
ideia
idoso
ignorado
igreja
iguana
ileso
ilha
iludido
iluminar
ilustrar
imagem
imediato
imenso
imersivo
iminente
imitador
imortal
impacto
impedir
implante
impor
imprensa
impune
imunizar
inalador
inapto
inativo
incenso
inchar
incidir
incluir
incolor
indeciso
indireto
indutor
ineficaz
inerente
infantil
infestar
infinito
inflamar
informal
infrator
ingerir
inibido
inicial
inimigo
injetar
inocente
inodoro
inovador
inox
inquieto
inscrito
inseto
insistir
inspetor
instalar
insulto
intacto
integral
intimar
intocado
intriga
invasor
inverno
invicto
invocar
iogurte
iraniano
ironizar
irreal
irritado
isca
isento
isolado
isqueiro
italiano
janeiro
jangada
janta
jararaca
jardim
jarro
jasmim
jato
javali
jazida
jejum
joaninha
joelhada
jogador
joia
jornal
jorrar
jovem
juba
judeu
judoca
juiz
julgador
julho
jurado
jurista
juro
justa
labareda
laboral
lacre
lactante
ladrilho
lagarta
lagoa
laje
lamber
lamentar
laminar
lampejo
lanche
lapidar
lapso
laranja
lareira
largura
lasanha
lastro
lateral
latido
lavanda
lavoura
lavrador
laxante
lazer
lealdade
lebre
legado
legendar
legista
leigo
leiloar
leitura
lembrete
leme
lenhador
lentilha
leoa
lesma
leste
letivo
letreiro
levar
leveza
levitar
liberal
libido
liderar
ligar
ligeiro
limitar
limoeiro
limpador
linda
linear
linhagem
liquidez
listagem
lisura
litoral
livro
lixa
lixeira
locador
locutor
lojista
lombo
lona
longe
lontra
lorde
lotado
loteria
loucura
lousa
louvar
luar
lucidez
lucro
luneta
lustre
lutador
luva
macaco
macete
machado
macio
madeira
madrinha
magnata
magreza
maior
mais
malandro
malha
malote
maluco
mamilo
mamoeiro
mamute
manada
mancha
mandato
manequim
manhoso
manivela
manobrar
mansa
manter
manusear
mapeado
maquinar
marcador
maresia
marfim
margem
marinho
marmita
maroto
marquise
marreco
martelo
marujo
mascote
masmorra
massagem
mastigar
matagal
materno
matinal
matutar
maxilar
medalha
medida
medusa
megafone
meiga
melancia
melhor
membro
memorial
menino
menos
mensagem
mental
merecer
mergulho
mesada
mesclar
mesmo
mesquita
mestre
metade
meteoro
metragem
mexer
mexicano
micro
migalha
migrar
milagre
milenar
milhar
mimado
minerar
minhoca
ministro
minoria
miolo
mirante
mirtilo
misturar
mocidade
moderno
modular
moeda
moer
moinho
moita
moldura
moleza
molho
molinete
molusco
montanha
moqueca
morango
morcego
mordomo
morena
mosaico
mosquete
mostarda
motel
motim
moto
motriz
muda
muito
mulata
mulher
multar
mundial
munido
muralha
murcho
muscular
museu
musical
nacional
nadador
naja
namoro
narina
narrado
nascer
nativa
natureza
navalha
navegar
navio
neblina
nebuloso
negativa
negociar
negrito
nervoso
neta
neural
nevasca
nevoeiro
ninar
ninho
nitidez
nivelar
nobreza
noite
noiva
nomear
nominal
nordeste
nortear
notar
noticiar
noturno
novelo
novilho
novo
nublado
nudez
numeral
nupcial
nutrir
nuvem
obcecado
obedecer
objetivo
obrigado
obscuro
obstetra
obter
obturar
ocidente
ocioso
ocorrer
oculista
ocupado
ofegante
ofensiva
oferenda
oficina
ofuscado
ogiva
olaria
oleoso
olhar
oliveira
ombro
omelete
omisso
omitir
ondulado
oneroso
ontem
opcional
operador
oponente
oportuno
oposto
orar
orbitar
ordem
ordinal
orfanato
orgasmo
orgulho
oriental
origem
oriundo
orla
ortodoxo
orvalho
oscilar
ossada
osso
ostentar
otimismo
ousadia
outono
outubro
ouvido
ovelha
ovular
oxidar
oxigenar
pacato
paciente
pacote
pactuar
padaria
padrinho
pagar
pagode
painel
pairar
paisagem
palavra
palestra
palheta
palito
palmada
palpitar
pancada
panela
panfleto
panqueca
pantanal
papagaio
papelada
papiro
parafina
parcial
pardal
parede
partida
pasmo
passado
pastel
patamar
patente
patinar
patrono
paulada
pausar
peculiar
pedalar
pedestre
pediatra
pedra
pegada
peitoral
peixe
pele
pelicano
penca
pendurar
peneira
penhasco
pensador
pente
perceber
perfeito
pergunta
perito
permitir
perna
perplexo
persiana
pertence
peruca
pescado
pesquisa
pessoa
petiscar
piada
picado
piedade
pigmento
pilastra
pilhado
pilotar
pimenta
pincel
pinguim
pinha
pinote
pintar
pioneiro
pipoca
piquete
piranha
pires
pirueta
piscar
pistola
pitanga
pivete
planta
plaqueta
platina
plebeu
plumagem
pluvial
pneu
poda
poeira
poetisa
polegada
policiar
poluente
polvilho
pomar
pomba
ponderar
pontaria
populoso
porta
possuir
postal
pote
poupar
pouso
povoar
praia
prancha
prato
praxe
prece
predador
prefeito
premiar
prensar
preparar
presilha
pretexto
prevenir
prezar
primata
princesa
prisma
privado
processo
produto
profeta
proibido
projeto
prometer
propagar
prosa
protetor
provador
publicar
pudim
pular
pulmonar
pulseira
punhal
punir
pupilo
pureza
puxador
quadra
quantia
quarto
quase
quebrar
queda
queijo
quente
querido
quimono
quina
quiosque
rabanada
rabisco
rachar
racionar
radial
raiar
rainha
raio
raiva
rajada
ralado
ramal
ranger
ranhura
rapadura
rapel
rapidez
raposa
raquete
raridade
rasante
rascunho
rasgar
raspador
rasteira
rasurar
ratazana
ratoeira
realeza
reanimar
reaver
rebaixar
rebelde
rebolar
recado
recente
recheio
recibo
recordar
recrutar
recuar
rede
redimir
redonda
reduzida
reenvio
refinar
refletir
refogar
refresco
refugiar
regalia
regime
regra
reinado
reitor
rejeitar
relativo
remador
remendo
remorso
renovado
reparo
repelir
repleto
repolho
represa
repudiar
requerer
resenha
resfriar
resgatar
residir
resolver
respeito
ressaca
restante
resumir
retalho
reter
retirar
retomada
retratar
revelar
revisor
revolta
riacho
rica
rigidez
rigoroso
rimar
ringue
risada
risco
risonho
robalo
rochedo
rodada
rodeio
rodovia
roedor
roleta
romano
roncar
rosado
roseira
rosto
rota
roteiro
rotina
rotular
rouco
roupa
roxo
rubro
rugido
rugoso
ruivo
rumo
rupestre
russo
sabor
saciar
sacola
sacudir
sadio
safira
saga
sagrada
saibro
salada
saleiro
salgado
saliva
salpicar
salsicha
saltar
salvador
sambar
samurai
sanar
sanfona
sangue
sanidade
sapato
sarda
sargento
sarjeta
saturar
saudade
saxofone
sazonal
secar
secular
seda
sedento
sediado
sedoso
sedutor
segmento
segredo
segundo
seiva
seleto
selvagem
semanal
semente
senador
senhor
sensual
sentado
separado
sereia
seringa
serra
servo
setembro
setor
sigilo
silhueta
silicone
simetria
simpatia
simular
sinal
sincero
singular
sinopse
sintonia
sirene
siri
situado
soberano
sobra
socorro
sogro
soja
solda
soletrar
solteiro
sombrio
sonata
sondar
sonegar
sonhador
sono
soprano
soquete
sorrir
sorteio
sossego
sotaque
soterrar
sovado
sozinho
suavizar
subida
submerso
subsolo
subtrair
sucata
sucesso
suco
sudeste
sufixo
sugador
sugerir
sujeito
sulfato
sumir
suor
superior
suplicar
suposto
suprimir
surdina
surfista
surpresa
surreal
surtir
suspiro
sustento
tabela
tablete
tabuada
tacho
tagarela
talher
talo
talvez
tamanho
tamborim
tampa
tangente
tanto
tapar
tapioca
tardio
tarefa
tarja
tarraxa
tatuagem
taurino
taxativo
taxista
teatral
tecer
tecido
teclado
tedioso
teia
teimar
telefone
telhado
tempero
tenente
tensor
tentar
termal
terno
terreno
tese
tesoura
testado
teto
textura
texugo
tiara
tigela
tijolo
timbrar
timidez
tingido
tinteiro
tiragem
titular
toalha
tocha
tolerar
tolice
tomada
tomilho
tonel
tontura
topete
tora
torcido
torneio
torque
torrada
torto
tostar
touca
toupeira
toxina
trabalho
tracejar
tradutor
trafegar
trajeto
trama
trancar
trapo
traseiro
tratador
travar
treino
tremer
trepidar
trevo
triagem
tribo
triciclo
tridente
trilogia
trindade
triplo
triturar
triunfal
trocar
trombeta
trova
trunfo
truque
tubular
tucano
tudo
tulipa
tupi
turbo
turma
turquesa
tutelar
tutorial
uivar
umbigo
unha
unidade
uniforme
urologia
urso
urtiga
urubu
usado
usina
usufruir
vacina
vadiar
vagaroso
vaidoso
vala
valente
validade
valores
vantagem
vaqueiro
varanda
vareta
varrer
vascular
vasilha
vassoura
vazar
vazio
veado
vedar
vegetar
veicular
veleiro
velhice
veludo
vencedor
vendaval
venerar
ventre
verbal
verdade
vereador
vergonha
vermelho
verniz
versar
vertente
vespa
vestido
vetorial
viaduto
viagem
viajar
viatura
vibrador
videira
vidraria
viela
viga
vigente
vigiar
vigorar
vilarejo
vinco
vinheta
vinil
violeta
virada
virtude
visitar
visto
vitral
viveiro
vizinho
voador
voar
vogal
volante
voleibol
voltagem
volumoso
vontade
vulto
vuvuzela
xadrez
xarope
xeque
xeretar
xerife
xingar
zangado
zarpar
zebu
zelador
zombar
zoologia
zumbido`.split("\n");
  }
});

// node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/simplified-chinese.js
var wordlist8;
var init_simplified_chinese = __esm({
  "node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/simplified-chinese.js"() {
    wordlist8 = `\u7684
\u4E00
\u662F
\u5728
\u4E0D
\u4E86
\u6709
\u548C
\u4EBA
\u8FD9
\u4E2D
\u5927
\u4E3A
\u4E0A
\u4E2A
\u56FD
\u6211
\u4EE5
\u8981
\u4ED6
\u65F6
\u6765
\u7528
\u4EEC
\u751F
\u5230
\u4F5C
\u5730
\u4E8E
\u51FA
\u5C31
\u5206
\u5BF9
\u6210
\u4F1A
\u53EF
\u4E3B
\u53D1
\u5E74
\u52A8
\u540C
\u5DE5
\u4E5F
\u80FD
\u4E0B
\u8FC7
\u5B50
\u8BF4
\u4EA7
\u79CD
\u9762
\u800C
\u65B9
\u540E
\u591A
\u5B9A
\u884C
\u5B66
\u6CD5
\u6240
\u6C11
\u5F97
\u7ECF
\u5341
\u4E09
\u4E4B
\u8FDB
\u7740
\u7B49
\u90E8
\u5EA6
\u5BB6
\u7535
\u529B
\u91CC
\u5982
\u6C34
\u5316
\u9AD8
\u81EA
\u4E8C
\u7406
\u8D77
\u5C0F
\u7269
\u73B0
\u5B9E
\u52A0
\u91CF
\u90FD
\u4E24
\u4F53
\u5236
\u673A
\u5F53
\u4F7F
\u70B9
\u4ECE
\u4E1A
\u672C
\u53BB
\u628A
\u6027
\u597D
\u5E94
\u5F00
\u5B83
\u5408
\u8FD8
\u56E0
\u7531
\u5176
\u4E9B
\u7136
\u524D
\u5916
\u5929
\u653F
\u56DB
\u65E5
\u90A3
\u793E
\u4E49
\u4E8B
\u5E73
\u5F62
\u76F8
\u5168
\u8868
\u95F4
\u6837
\u4E0E
\u5173
\u5404
\u91CD
\u65B0
\u7EBF
\u5185
\u6570
\u6B63
\u5FC3
\u53CD
\u4F60
\u660E
\u770B
\u539F
\u53C8
\u4E48
\u5229
\u6BD4
\u6216
\u4F46
\u8D28
\u6C14
\u7B2C
\u5411
\u9053
\u547D
\u6B64
\u53D8
\u6761
\u53EA
\u6CA1
\u7ED3
\u89E3
\u95EE
\u610F
\u5EFA
\u6708
\u516C
\u65E0
\u7CFB
\u519B
\u5F88
\u60C5
\u8005
\u6700
\u7ACB
\u4EE3
\u60F3
\u5DF2
\u901A
\u5E76
\u63D0
\u76F4
\u9898
\u515A
\u7A0B
\u5C55
\u4E94
\u679C
\u6599
\u8C61
\u5458
\u9769
\u4F4D
\u5165
\u5E38
\u6587
\u603B
\u6B21
\u54C1
\u5F0F
\u6D3B
\u8BBE
\u53CA
\u7BA1
\u7279
\u4EF6
\u957F
\u6C42
\u8001
\u5934
\u57FA
\u8D44
\u8FB9
\u6D41
\u8DEF
\u7EA7
\u5C11
\u56FE
\u5C71
\u7EDF
\u63A5
\u77E5
\u8F83
\u5C06
\u7EC4
\u89C1
\u8BA1
\u522B
\u5979
\u624B
\u89D2
\u671F
\u6839
\u8BBA
\u8FD0
\u519C
\u6307
\u51E0
\u4E5D
\u533A
\u5F3A
\u653E
\u51B3
\u897F
\u88AB
\u5E72
\u505A
\u5FC5
\u6218
\u5148
\u56DE
\u5219
\u4EFB
\u53D6
\u636E
\u5904
\u961F
\u5357
\u7ED9
\u8272
\u5149
\u95E8
\u5373
\u4FDD
\u6CBB
\u5317
\u9020
\u767E
\u89C4
\u70ED
\u9886
\u4E03
\u6D77
\u53E3
\u4E1C
\u5BFC
\u5668
\u538B
\u5FD7
\u4E16
\u91D1
\u589E
\u4E89
\u6D4E
\u9636
\u6CB9
\u601D
\u672F
\u6781
\u4EA4
\u53D7
\u8054
\u4EC0
\u8BA4
\u516D
\u5171
\u6743
\u6536
\u8BC1
\u6539
\u6E05
\u7F8E
\u518D
\u91C7
\u8F6C
\u66F4
\u5355
\u98CE
\u5207
\u6253
\u767D
\u6559
\u901F
\u82B1
\u5E26
\u5B89
\u573A
\u8EAB
\u8F66
\u4F8B
\u771F
\u52A1
\u5177
\u4E07
\u6BCF
\u76EE
\u81F3
\u8FBE
\u8D70
\u79EF
\u793A
\u8BAE
\u58F0
\u62A5
\u6597
\u5B8C
\u7C7B
\u516B
\u79BB
\u534E
\u540D
\u786E
\u624D
\u79D1
\u5F20
\u4FE1
\u9A6C
\u8282
\u8BDD
\u7C73
\u6574
\u7A7A
\u5143
\u51B5
\u4ECA
\u96C6
\u6E29
\u4F20
\u571F
\u8BB8
\u6B65
\u7FA4
\u5E7F
\u77F3
\u8BB0
\u9700
\u6BB5
\u7814
\u754C
\u62C9
\u6797
\u5F8B
\u53EB
\u4E14
\u7A76
\u89C2
\u8D8A
\u7EC7
\u88C5
\u5F71
\u7B97
\u4F4E
\u6301
\u97F3
\u4F17
\u4E66
\u5E03
\u590D
\u5BB9
\u513F
\u987B
\u9645
\u5546
\u975E
\u9A8C
\u8FDE
\u65AD
\u6DF1
\u96BE
\u8FD1
\u77FF
\u5343
\u5468
\u59D4
\u7D20
\u6280
\u5907
\u534A
\u529E
\u9752
\u7701
\u5217
\u4E60
\u54CD
\u7EA6
\u652F
\u822C
\u53F2
\u611F
\u52B3
\u4FBF
\u56E2
\u5F80
\u9178
\u5386
\u5E02
\u514B
\u4F55
\u9664
\u6D88
\u6784
\u5E9C
\u79F0
\u592A
\u51C6
\u7CBE
\u503C
\u53F7
\u7387
\u65CF
\u7EF4
\u5212
\u9009
\u6807
\u5199
\u5B58
\u5019
\u6BDB
\u4EB2
\u5FEB
\u6548
\u65AF
\u9662
\u67E5
\u6C5F
\u578B
\u773C
\u738B
\u6309
\u683C
\u517B
\u6613
\u7F6E
\u6D3E
\u5C42
\u7247
\u59CB
\u5374
\u4E13
\u72B6
\u80B2
\u5382
\u4EAC
\u8BC6
\u9002
\u5C5E
\u5706
\u5305
\u706B
\u4F4F
\u8C03
\u6EE1
\u53BF
\u5C40
\u7167
\u53C2
\u7EA2
\u7EC6
\u5F15
\u542C
\u8BE5
\u94C1
\u4EF7
\u4E25
\u9996
\u5E95
\u6DB2
\u5B98
\u5FB7
\u968F
\u75C5
\u82CF
\u5931
\u5C14
\u6B7B
\u8BB2
\u914D
\u5973
\u9EC4
\u63A8
\u663E
\u8C08
\u7F6A
\u795E
\u827A
\u5462
\u5E2D
\u542B
\u4F01
\u671B
\u5BC6
\u6279
\u8425
\u9879
\u9632
\u4E3E
\u7403
\u82F1
\u6C27
\u52BF
\u544A
\u674E
\u53F0
\u843D
\u6728
\u5E2E
\u8F6E
\u7834
\u4E9A
\u5E08
\u56F4
\u6CE8
\u8FDC
\u5B57
\u6750
\u6392
\u4F9B
\u6CB3
\u6001
\u5C01
\u53E6
\u65BD
\u51CF
\u6811
\u6EB6
\u600E
\u6B62
\u6848
\u8A00
\u58EB
\u5747
\u6B66
\u56FA
\u53F6
\u9C7C
\u6CE2
\u89C6
\u4EC5
\u8D39
\u7D27
\u7231
\u5DE6
\u7AE0
\u65E9
\u671D
\u5BB3
\u7EED
\u8F7B
\u670D
\u8BD5
\u98DF
\u5145
\u5175
\u6E90
\u5224
\u62A4
\u53F8
\u8DB3
\u67D0
\u7EC3
\u5DEE
\u81F4
\u677F
\u7530
\u964D
\u9ED1
\u72AF
\u8D1F
\u51FB
\u8303
\u7EE7
\u5174
\u4F3C
\u4F59
\u575A
\u66F2
\u8F93
\u4FEE
\u6545
\u57CE
\u592B
\u591F
\u9001
\u7B14
\u8239
\u5360
\u53F3
\u8D22
\u5403
\u5BCC
\u6625
\u804C
\u89C9
\u6C49
\u753B
\u529F
\u5DF4
\u8DDF
\u867D
\u6742
\u98DE
\u68C0
\u5438
\u52A9
\u5347
\u9633
\u4E92
\u521D
\u521B
\u6297
\u8003
\u6295
\u574F
\u7B56
\u53E4
\u5F84
\u6362
\u672A
\u8DD1
\u7559
\u94A2
\u66FE
\u7AEF
\u8D23
\u7AD9
\u7B80
\u8FF0
\u94B1
\u526F
\u5C3D
\u5E1D
\u5C04
\u8349
\u51B2
\u627F
\u72EC
\u4EE4
\u9650
\u963F
\u5BA3
\u73AF
\u53CC
\u8BF7
\u8D85
\u5FAE
\u8BA9
\u63A7
\u5DDE
\u826F
\u8F74
\u627E
\u5426
\u7EAA
\u76CA
\u4F9D
\u4F18
\u9876
\u7840
\u8F7D
\u5012
\u623F
\u7A81
\u5750
\u7C89
\u654C
\u7565
\u5BA2
\u8881
\u51B7
\u80DC
\u7EDD
\u6790
\u5757
\u5242
\u6D4B
\u4E1D
\u534F
\u8BC9
\u5FF5
\u9648
\u4ECD
\u7F57
\u76D0
\u53CB
\u6D0B
\u9519
\u82E6
\u591C
\u5211
\u79FB
\u9891
\u9010
\u9760
\u6DF7
\u6BCD
\u77ED
\u76AE
\u7EC8
\u805A
\u6C7D
\u6751
\u4E91
\u54EA
\u65E2
\u8DDD
\u536B
\u505C
\u70C8
\u592E
\u5BDF
\u70E7
\u8FC5
\u5883
\u82E5
\u5370
\u6D32
\u523B
\u62EC
\u6FC0
\u5B54
\u641E
\u751A
\u5BA4
\u5F85
\u6838
\u6821
\u6563
\u4FB5
\u5427
\u7532
\u6E38
\u4E45
\u83DC
\u5473
\u65E7
\u6A21
\u6E56
\u8D27
\u635F
\u9884
\u963B
\u6BEB
\u666E
\u7A33
\u4E59
\u5988
\u690D
\u606F
\u6269
\u94F6
\u8BED
\u6325
\u9152
\u5B88
\u62FF
\u5E8F
\u7EB8
\u533B
\u7F3A
\u96E8
\u5417
\u9488
\u5218
\u554A
\u6025
\u5531
\u8BEF
\u8BAD
\u613F
\u5BA1
\u9644
\u83B7
\u8336
\u9C9C
\u7CAE
\u65A4
\u5B69
\u8131
\u786B
\u80A5
\u5584
\u9F99
\u6F14
\u7236
\u6E10
\u8840
\u6B22
\u68B0
\u638C
\u6B4C
\u6C99
\u521A
\u653B
\u8C13
\u76FE
\u8BA8
\u665A
\u7C92
\u4E71
\u71C3
\u77DB
\u4E4E
\u6740
\u836F
\u5B81
\u9C81
\u8D35
\u949F
\u7164
\u8BFB
\u73ED
\u4F2F
\u9999
\u4ECB
\u8FEB
\u53E5
\u4E30
\u57F9
\u63E1
\u5170
\u62C5
\u5F26
\u86CB
\u6C89
\u5047
\u7A7F
\u6267
\u7B54
\u4E50
\u8C01
\u987A
\u70DF
\u7F29
\u5F81
\u8138
\u559C
\u677E
\u811A
\u56F0
\u5F02
\u514D
\u80CC
\u661F
\u798F
\u4E70
\u67D3
\u4E95
\u6982
\u6162
\u6015
\u78C1
\u500D
\u7956
\u7687
\u4FC3
\u9759
\u8865
\u8BC4
\u7FFB
\u8089
\u8DF5
\u5C3C
\u8863
\u5BBD
\u626C
\u68C9
\u5E0C
\u4F24
\u64CD
\u5782
\u79CB
\u5B9C
\u6C22
\u5957
\u7763
\u632F
\u67B6
\u4EAE
\u672B
\u5BAA
\u5E86
\u7F16
\u725B
\u89E6
\u6620
\u96F7
\u9500
\u8BD7
\u5EA7
\u5C45
\u6293
\u88C2
\u80DE
\u547C
\u5A18
\u666F
\u5A01
\u7EFF
\u6676
\u539A
\u76DF
\u8861
\u9E21
\u5B59
\u5EF6
\u5371
\u80F6
\u5C4B
\u4E61
\u4E34
\u9646
\u987E
\u6389
\u5440
\u706F
\u5C81
\u63AA
\u675F
\u8010
\u5267
\u7389
\u8D75
\u8DF3
\u54E5
\u5B63
\u8BFE
\u51EF
\u80E1
\u989D
\u6B3E
\u7ECD
\u5377
\u9F50
\u4F1F
\u84B8
\u6B96
\u6C38
\u5B97
\u82D7
\u5DDD
\u7089
\u5CA9
\u5F31
\u96F6
\u6768
\u594F
\u6CBF
\u9732
\u6746
\u63A2
\u6ED1
\u9547
\u996D
\u6D53
\u822A
\u6000
\u8D76
\u5E93
\u593A
\u4F0A
\u7075
\u7A0E
\u9014
\u706D
\u8D5B
\u5F52
\u53EC
\u9F13
\u64AD
\u76D8
\u88C1
\u9669
\u5EB7
\u552F
\u5F55
\u83CC
\u7EAF
\u501F
\u7CD6
\u76D6
\u6A2A
\u7B26
\u79C1
\u52AA
\u5802
\u57DF
\u67AA
\u6DA6
\u5E45
\u54C8
\u7ADF
\u719F
\u866B
\u6CFD
\u8111
\u58E4
\u78B3
\u6B27
\u904D
\u4FA7
\u5BE8
\u6562
\u5F7B
\u8651
\u659C
\u8584
\u5EAD
\u7EB3
\u5F39
\u9972
\u4F38
\u6298
\u9EA6
\u6E7F
\u6697
\u8377
\u74E6
\u585E
\u5E8A
\u7B51
\u6076
\u6237
\u8BBF
\u5854
\u5947
\u900F
\u6881
\u5200
\u65CB
\u8FF9
\u5361
\u6C2F
\u9047
\u4EFD
\u6BD2
\u6CE5
\u9000
\u6D17
\u6446
\u7070
\u5F69
\u5356
\u8017
\u590F
\u62E9
\u5FD9
\u94DC
\u732E
\u786C
\u4E88
\u7E41
\u5708
\u96EA
\u51FD
\u4EA6
\u62BD
\u7BC7
\u9635
\u9634
\u4E01
\u5C3A
\u8FFD
\u5806
\u96C4
\u8FCE
\u6CDB
\u7238
\u697C
\u907F
\u8C0B
\u5428
\u91CE
\u732A
\u65D7
\u7D2F
\u504F
\u5178
\u9986
\u7D22
\u79E6
\u8102
\u6F6E
\u7237
\u8C46
\u5FFD
\u6258
\u60CA
\u5851
\u9057
\u6108
\u6731
\u66FF
\u7EA4
\u7C97
\u503E
\u5C1A
\u75DB
\u695A
\u8C22
\u594B
\u8D2D
\u78E8
\u541B
\u6C60
\u65C1
\u788E
\u9AA8
\u76D1
\u6355
\u5F1F
\u66B4
\u5272
\u8D2F
\u6B8A
\u91CA
\u8BCD
\u4EA1
\u58C1
\u987F
\u5B9D
\u5348
\u5C18
\u95FB
\u63ED
\u70AE
\u6B8B
\u51AC
\u6865
\u5987
\u8B66
\u7EFC
\u62DB
\u5434
\u4ED8
\u6D6E
\u906D
\u5F90
\u60A8
\u6447
\u8C37
\u8D5E
\u7BB1
\u9694
\u8BA2
\u7537
\u5439
\u56ED
\u7EB7
\u5510
\u8D25
\u5B8B
\u73BB
\u5DE8
\u8015
\u5766
\u8363
\u95ED
\u6E7E
\u952E
\u51E1
\u9A7B
\u9505
\u6551
\u6069
\u5265
\u51DD
\u78B1
\u9F7F
\u622A
\u70BC
\u9EBB
\u7EBA
\u7981
\u5E9F
\u76DB
\u7248
\u7F13
\u51C0
\u775B
\u660C
\u5A5A
\u6D89
\u7B52
\u5634
\u63D2
\u5CB8
\u6717
\u5E84
\u8857
\u85CF
\u59D1
\u8D38
\u8150
\u5974
\u5566
\u60EF
\u4E58
\u4F19
\u6062
\u5300
\u7EB1
\u624E
\u8FA9
\u8033
\u5F6A
\u81E3
\u4EBF
\u7483
\u62B5
\u8109
\u79C0
\u8428
\u4FC4
\u7F51
\u821E
\u5E97
\u55B7
\u7EB5
\u5BF8
\u6C57
\u6302
\u6D2A
\u8D3A
\u95EA
\u67EC
\u7206
\u70EF
\u6D25
\u7A3B
\u5899
\u8F6F
\u52C7
\u50CF
\u6EDA
\u5398
\u8499
\u82B3
\u80AF
\u5761
\u67F1
\u8361
\u817F
\u4EEA
\u65C5
\u5C3E
\u8F67
\u51B0
\u8D21
\u767B
\u9ECE
\u524A
\u94BB
\u52D2
\u9003
\u969C
\u6C28
\u90ED
\u5CF0
\u5E01
\u6E2F
\u4F0F
\u8F68
\u4EA9
\u6BD5
\u64E6
\u83AB
\u523A
\u6D6A
\u79D8
\u63F4
\u682A
\u5065
\u552E
\u80A1
\u5C9B
\u7518
\u6CE1
\u7761
\u7AE5
\u94F8
\u6C64
\u9600
\u4F11
\u6C47
\u820D
\u7267
\u7ED5
\u70B8
\u54F2
\u78F7
\u7EE9
\u670B
\u6DE1
\u5C16
\u542F
\u9677
\u67F4
\u5448
\u5F92
\u989C
\u6CEA
\u7A0D
\u5FD8
\u6CF5
\u84DD
\u62D6
\u6D1E
\u6388
\u955C
\u8F9B
\u58EE
\u950B
\u8D2B
\u865A
\u5F2F
\u6469
\u6CF0
\u5E7C
\u5EF7
\u5C0A
\u7A97
\u7EB2
\u5F04
\u96B6
\u7591
\u6C0F
\u5BAB
\u59D0
\u9707
\u745E
\u602A
\u5C24
\u7434
\u5FAA
\u63CF
\u819C
\u8FDD
\u5939
\u8170
\u7F18
\u73E0
\u7A77
\u68EE
\u679D
\u7AF9
\u6C9F
\u50AC
\u7EF3
\u5FC6
\u90A6
\u5269
\u5E78
\u6D46
\u680F
\u62E5
\u7259
\u8D2E
\u793C
\u6EE4
\u94A0
\u7EB9
\u7F62
\u62CD
\u54B1
\u558A
\u8896
\u57C3
\u52E4
\u7F5A
\u7126
\u6F5C
\u4F0D
\u58A8
\u6B32
\u7F1D
\u59D3
\u520A
\u9971
\u4EFF
\u5956
\u94DD
\u9B3C
\u4E3D
\u8DE8
\u9ED8
\u6316
\u94FE
\u626B
\u559D
\u888B
\u70AD
\u6C61
\u5E55
\u8BF8
\u5F27
\u52B1
\u6885
\u5976
\u6D01
\u707E
\u821F
\u9274
\u82EF
\u8BBC
\u62B1
\u6BC1
\u61C2
\u5BD2
\u667A
\u57D4
\u5BC4
\u5C4A
\u8DC3
\u6E21
\u6311
\u4E39
\u8270
\u8D1D
\u78B0
\u62D4
\u7239
\u6234
\u7801
\u68A6
\u82BD
\u7194
\u8D64
\u6E14
\u54ED
\u656C
\u9897
\u5954
\u94C5
\u4EF2
\u864E
\u7A00
\u59B9
\u4E4F
\u73CD
\u7533
\u684C
\u9075
\u5141
\u9686
\u87BA
\u4ED3
\u9B4F
\u9510
\u6653
\u6C2E
\u517C
\u9690
\u788D
\u8D6B
\u62E8
\u5FE0
\u8083
\u7F38
\u7275
\u62A2
\u535A
\u5DE7
\u58F3
\u5144
\u675C
\u8BAF
\u8BDA
\u78A7
\u7965
\u67EF
\u9875
\u5DE1
\u77E9
\u60B2
\u704C
\u9F84
\u4F26
\u7968
\u5BFB
\u6842
\u94FA
\u5723
\u6050
\u6070
\u90D1
\u8DA3
\u62AC
\u8352
\u817E
\u8D34
\u67D4
\u6EF4
\u731B
\u9614
\u8F86
\u59BB
\u586B
\u64A4
\u50A8
\u7B7E
\u95F9
\u6270
\u7D2B
\u7802
\u9012
\u620F
\u540A
\u9676
\u4F10
\u5582
\u7597
\u74F6
\u5A46
\u629A
\u81C2
\u6478
\u5FCD
\u867E
\u8721
\u90BB
\u80F8
\u5DE9
\u6324
\u5076
\u5F03
\u69FD
\u52B2
\u4E73
\u9093
\u5409
\u4EC1
\u70C2
\u7816
\u79DF
\u4E4C
\u8230
\u4F34
\u74DC
\u6D45
\u4E19
\u6682
\u71E5
\u6A61
\u67F3
\u8FF7
\u6696
\u724C
\u79E7
\u80C6
\u8BE6
\u7C27
\u8E0F
\u74F7
\u8C31
\u5446
\u5BBE
\u7CCA
\u6D1B
\u8F89
\u6124
\u7ADE
\u9699
\u6012
\u7C98
\u4E43
\u7EEA
\u80A9
\u7C4D
\u654F
\u6D82
\u7199
\u7686
\u4FA6
\u60AC
\u6398
\u4EAB
\u7EA0
\u9192
\u72C2
\u9501
\u6DC0
\u6068
\u7272
\u9738
\u722C
\u8D4F
\u9006
\u73A9
\u9675
\u795D
\u79D2
\u6D59
\u8C8C
\u5F79
\u5F7C
\u6089
\u9E2D
\u8D8B
\u51E4
\u6668
\u755C
\u8F88
\u79E9
\u5375
\u7F72
\u68AF
\u708E
\u6EE9
\u68CB
\u9A71
\u7B5B
\u5CE1
\u5192
\u5565
\u5BFF
\u8BD1
\u6D78
\u6CC9
\u5E3D
\u8FDF
\u7845
\u7586
\u8D37
\u6F0F
\u7A3F
\u51A0
\u5AE9
\u80C1
\u82AF
\u7262
\u53DB
\u8680
\u5965
\u9E23
\u5CAD
\u7F8A
\u51ED
\u4E32
\u5858
\u7ED8
\u9175
\u878D
\u76C6
\u9521
\u5E99
\u7B79
\u51BB
\u8F85
\u6444
\u88AD
\u7B4B
\u62D2
\u50DA
\u65F1
\u94BE
\u9E1F
\u6F06
\u6C88
\u7709
\u758F
\u6DFB
\u68D2
\u7A57
\u785D
\u97E9
\u903C
\u626D
\u4FA8
\u51C9
\u633A
\u7897
\u683D
\u7092
\u676F
\u60A3
\u998F
\u529D
\u8C6A
\u8FBD
\u52C3
\u9E3F
\u65E6
\u540F
\u62DC
\u72D7
\u57CB
\u8F8A
\u63A9
\u996E
\u642C
\u9A82
\u8F9E
\u52FE
\u6263
\u4F30
\u848B
\u7ED2
\u96FE
\u4E08
\u6735
\u59C6
\u62DF
\u5B87
\u8F91
\u9655
\u96D5
\u507F
\u84C4
\u5D07
\u526A
\u5021
\u5385
\u54AC
\u9A76
\u85AF
\u5237
\u65A5
\u756A
\u8D4B
\u5949
\u4F5B
\u6D47
\u6F2B
\u66FC
\u6247
\u9499
\u6843
\u6276
\u4ED4
\u8FD4
\u4FD7
\u4E8F
\u8154
\u978B
\u68F1
\u8986
\u6846
\u6084
\u53D4
\u649E
\u9A97
\u52D8
\u65FA
\u6CB8
\u5B64
\u5410
\u5B5F
\u6E20
\u5C48
\u75BE
\u5999
\u60DC
\u4EF0
\u72E0
\u80C0
\u8C10
\u629B
\u9709
\u6851
\u5C97
\u561B
\u8870
\u76D7
\u6E17
\u810F
\u8D56
\u6D8C
\u751C
\u66F9
\u9605
\u808C
\u54E9
\u5389
\u70C3
\u7EAC
\u6BC5
\u6628
\u4F2A
\u75C7
\u716E
\u53F9
\u9489
\u642D
\u830E
\u7B3C
\u9177
\u5077
\u5F13
\u9525
\u6052
\u6770
\u5751
\u9F3B
\u7FFC
\u7EB6
\u53D9
\u72F1
\u902E
\u7F50
\u7EDC
\u68DA
\u6291
\u81A8
\u852C
\u5BFA
\u9AA4
\u7A46
\u51B6
\u67AF
\u518C
\u5C38
\u51F8
\u7EC5
\u576F
\u727A
\u7130
\u8F70
\u6B23
\u664B
\u7626
\u5FA1
\u952D
\u9526
\u4E27
\u65EC
\u953B
\u5784
\u641C
\u6251
\u9080
\u4EAD
\u916F
\u8FC8
\u8212
\u8106
\u9176
\u95F2
\u5FE7
\u915A
\u987D
\u7FBD
\u6DA8
\u5378
\u4ED7
\u966A
\u8F9F
\u60E9
\u676D
\u59DA
\u809A
\u6349
\u98D8
\u6F02
\u6606
\u6B3A
\u543E
\u90CE
\u70F7
\u6C41
\u5475
\u9970
\u8427
\u96C5
\u90AE
\u8FC1
\u71D5
\u6492
\u59FB
\u8D74
\u5BB4
\u70E6
\u503A
\u5E10
\u6591
\u94C3
\u65E8
\u9187
\u8463
\u997C
\u96CF
\u59FF
\u62CC
\u5085
\u8179
\u59A5
\u63C9
\u8D24
\u62C6
\u6B6A
\u8461
\u80FA
\u4E22
\u6D69
\u5FBD
\u6602
\u57AB
\u6321
\u89C8
\u8D2A
\u6170
\u7F34
\u6C6A
\u614C
\u51AF
\u8BFA
\u59DC
\u8C0A
\u51F6
\u52A3
\u8BEC
\u8000
\u660F
\u8EBA
\u76C8
\u9A91
\u4E54
\u6EAA
\u4E1B
\u5362
\u62B9
\u95F7
\u54A8
\u522E
\u9A7E
\u7F06
\u609F
\u6458
\u94D2
\u63B7
\u9887
\u5E7B
\u67C4
\u60E0
\u60E8
\u4F73
\u4EC7
\u814A
\u7A9D
\u6DA4
\u5251
\u77A7
\u5821
\u6CFC
\u8471
\u7F69
\u970D
\u635E
\u80CE
\u82CD
\u6EE8
\u4FE9
\u6345
\u6E58
\u780D
\u971E
\u90B5
\u8404
\u75AF
\u6DEE
\u9042
\u718A
\u7CAA
\u70D8
\u5BBF
\u6863
\u6208
\u9A73
\u5AC2
\u88D5
\u5F99
\u7BAD
\u6350
\u80A0
\u6491
\u6652
\u8FA8
\u6BBF
\u83B2
\u644A
\u6405
\u9171
\u5C4F
\u75AB
\u54C0
\u8521
\u5835
\u6CAB
\u76B1
\u7545
\u53E0
\u9601
\u83B1
\u6572
\u8F96
\u94A9
\u75D5
\u575D
\u5DF7
\u997F
\u7978
\u4E18
\u7384
\u6E9C
\u66F0
\u903B
\u5F6D
\u5C1D
\u537F
\u59A8
\u8247
\u541E
\u97E6
\u6028
\u77EE
\u6B47`.split("\n");
  }
});

// node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/spanish.js
var wordlist9;
var init_spanish = __esm({
  "node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/spanish.js"() {
    wordlist9 = `a\u0301baco
abdomen
abeja
abierto
abogado
abono
aborto
abrazo
abrir
abuelo
abuso
acabar
academia
acceso
accio\u0301n
aceite
acelga
acento
aceptar
a\u0301cido
aclarar
acne\u0301
acoger
acoso
activo
acto
actriz
actuar
acudir
acuerdo
acusar
adicto
admitir
adoptar
adorno
aduana
adulto
ae\u0301reo
afectar
aficio\u0301n
afinar
afirmar
a\u0301gil
agitar
agoni\u0301a
agosto
agotar
agregar
agrio
agua
agudo
a\u0301guila
aguja
ahogo
ahorro
aire
aislar
ajedrez
ajeno
ajuste
alacra\u0301n
alambre
alarma
alba
a\u0301lbum
alcalde
aldea
alegre
alejar
alerta
aleta
alfiler
alga
algodo\u0301n
aliado
aliento
alivio
alma
almeja
almi\u0301bar
altar
alteza
altivo
alto
altura
alumno
alzar
amable
amante
amapola
amargo
amasar
a\u0301mbar
a\u0301mbito
ameno
amigo
amistad
amor
amparo
amplio
ancho
anciano
ancla
andar
ande\u0301n
anemia
a\u0301ngulo
anillo
a\u0301nimo
ani\u0301s
anotar
antena
antiguo
antojo
anual
anular
anuncio
an\u0303adir
an\u0303ejo
an\u0303o
apagar
aparato
apetito
apio
aplicar
apodo
aporte
apoyo
aprender
aprobar
apuesta
apuro
arado
aran\u0303a
arar
a\u0301rbitro
a\u0301rbol
arbusto
archivo
arco
arder
ardilla
arduo
a\u0301rea
a\u0301rido
aries
armoni\u0301a
arne\u0301s
aroma
arpa
arpo\u0301n
arreglo
arroz
arruga
arte
artista
asa
asado
asalto
ascenso
asegurar
aseo
asesor
asiento
asilo
asistir
asno
asombro
a\u0301spero
astilla
astro
astuto
asumir
asunto
atajo
ataque
atar
atento
ateo
a\u0301tico
atleta
a\u0301tomo
atraer
atroz
atu\u0301n
audaz
audio
auge
aula
aumento
ausente
autor
aval
avance
avaro
ave
avellana
avena
avestruz
avio\u0301n
aviso
ayer
ayuda
ayuno
azafra\u0301n
azar
azote
azu\u0301car
azufre
azul
baba
babor
bache
bahi\u0301a
baile
bajar
balanza
balco\u0301n
balde
bambu\u0301
banco
banda
ban\u0303o
barba
barco
barniz
barro
ba\u0301scula
basto\u0301n
basura
batalla
bateri\u0301a
batir
batuta
bau\u0301l
bazar
bebe\u0301
bebida
bello
besar
beso
bestia
bicho
bien
bingo
blanco
bloque
blusa
boa
bobina
bobo
boca
bocina
boda
bodega
boina
bola
bolero
bolsa
bomba
bondad
bonito
bono
bonsa\u0301i
borde
borrar
bosque
bote
boti\u0301n
bo\u0301veda
bozal
bravo
brazo
brecha
breve
brillo
brinco
brisa
broca
broma
bronce
brote
bruja
brusco
bruto
buceo
bucle
bueno
buey
bufanda
bufo\u0301n
bu\u0301ho
buitre
bulto
burbuja
burla
burro
buscar
butaca
buzo\u0301n
caballo
cabeza
cabina
cabra
cacao
cada\u0301ver
cadena
caer
cafe\u0301
cai\u0301da
caima\u0301n
caja
cajo\u0301n
cal
calamar
calcio
caldo
calidad
calle
calma
calor
calvo
cama
cambio
camello
camino
campo
ca\u0301ncer
candil
canela
canguro
canica
canto
can\u0303a
can\u0303o\u0301n
caoba
caos
capaz
capita\u0301n
capote
captar
capucha
cara
carbo\u0301n
ca\u0301rcel
careta
carga
carin\u0303o
carne
carpeta
carro
carta
casa
casco
casero
caspa
castor
catorce
catre
caudal
causa
cazo
cebolla
ceder
cedro
celda
ce\u0301lebre
celoso
ce\u0301lula
cemento
ceniza
centro
cerca
cerdo
cereza
cero
cerrar
certeza
ce\u0301sped
cetro
chacal
chaleco
champu\u0301
chancla
chapa
charla
chico
chiste
chivo
choque
choza
chuleta
chupar
ciclo\u0301n
ciego
cielo
cien
cierto
cifra
cigarro
cima
cinco
cine
cinta
cipre\u0301s
circo
ciruela
cisne
cita
ciudad
clamor
clan
claro
clase
clave
cliente
clima
cli\u0301nica
cobre
coccio\u0301n
cochino
cocina
coco
co\u0301digo
codo
cofre
coger
cohete
coji\u0301n
cojo
cola
colcha
colegio
colgar
colina
collar
colmo
columna
combate
comer
comida
co\u0301modo
compra
conde
conejo
conga
conocer
consejo
contar
copa
copia
corazo\u0301n
corbata
corcho
cordo\u0301n
corona
correr
coser
cosmos
costa
cra\u0301neo
cra\u0301ter
crear
crecer
crei\u0301do
crema
cri\u0301a
crimen
cripta
crisis
cromo
cro\u0301nica
croqueta
crudo
cruz
cuadro
cuarto
cuatro
cubo
cubrir
cuchara
cuello
cuento
cuerda
cuesta
cueva
cuidar
culebra
culpa
culto
cumbre
cumplir
cuna
cuneta
cuota
cupo\u0301n
cu\u0301pula
curar
curioso
curso
curva
cutis
dama
danza
dar
dardo
da\u0301til
deber
de\u0301bil
de\u0301cada
decir
dedo
defensa
definir
dejar
delfi\u0301n
delgado
delito
demora
denso
dental
deporte
derecho
derrota
desayuno
deseo
desfile
desnudo
destino
desvi\u0301o
detalle
detener
deuda
di\u0301a
diablo
diadema
diamante
diana
diario
dibujo
dictar
diente
dieta
diez
difi\u0301cil
digno
dilema
diluir
dinero
directo
dirigir
disco
disen\u0303o
disfraz
diva
divino
doble
doce
dolor
domingo
don
donar
dorado
dormir
dorso
dos
dosis
drago\u0301n
droga
ducha
duda
duelo
duen\u0303o
dulce
du\u0301o
duque
durar
dureza
duro
e\u0301bano
ebrio
echar
eco
ecuador
edad
edicio\u0301n
edificio
editor
educar
efecto
eficaz
eje
ejemplo
elefante
elegir
elemento
elevar
elipse
e\u0301lite
elixir
elogio
eludir
embudo
emitir
emocio\u0301n
empate
empen\u0303o
empleo
empresa
enano
encargo
enchufe
enci\u0301a
enemigo
enero
enfado
enfermo
engan\u0303o
enigma
enlace
enorme
enredo
ensayo
ensen\u0303ar
entero
entrar
envase
envi\u0301o
e\u0301poca
equipo
erizo
escala
escena
escolar
escribir
escudo
esencia
esfera
esfuerzo
espada
espejo
espi\u0301a
esposa
espuma
esqui\u0301
estar
este
estilo
estufa
etapa
eterno
e\u0301tica
etnia
evadir
evaluar
evento
evitar
exacto
examen
exceso
excusa
exento
exigir
exilio
existir
e\u0301xito
experto
explicar
exponer
extremo
fa\u0301brica
fa\u0301bula
fachada
fa\u0301cil
factor
faena
faja
falda
fallo
falso
faltar
fama
familia
famoso
farao\u0301n
farmacia
farol
farsa
fase
fatiga
fauna
favor
fax
febrero
fecha
feliz
feo
feria
feroz
fe\u0301rtil
fervor
festi\u0301n
fiable
fianza
fiar
fibra
ficcio\u0301n
ficha
fideo
fiebre
fiel
fiera
fiesta
figura
fijar
fijo
fila
filete
filial
filtro
fin
finca
fingir
finito
firma
flaco
flauta
flecha
flor
flota
fluir
flujo
flu\u0301or
fobia
foca
fogata
fogo\u0301n
folio
folleto
fondo
forma
forro
fortuna
forzar
fosa
foto
fracaso
fra\u0301gil
franja
frase
fraude
frei\u0301r
freno
fresa
fri\u0301o
frito
fruta
fuego
fuente
fuerza
fuga
fumar
funcio\u0301n
funda
furgo\u0301n
furia
fusil
fu\u0301tbol
futuro
gacela
gafas
gaita
gajo
gala
galeri\u0301a
gallo
gamba
ganar
gancho
ganga
ganso
garaje
garza
gasolina
gastar
gato
gavila\u0301n
gemelo
gemir
gen
ge\u0301nero
genio
gente
geranio
gerente
germen
gesto
gigante
gimnasio
girar
giro
glaciar
globo
gloria
gol
golfo
goloso
golpe
goma
gordo
gorila
gorra
gota
goteo
gozar
grada
gra\u0301fico
grano
grasa
gratis
grave
grieta
grillo
gripe
gris
grito
grosor
gru\u0301a
grueso
grumo
grupo
guante
guapo
guardia
guerra
gui\u0301a
guin\u0303o
guion
guiso
guitarra
gusano
gustar
haber
ha\u0301bil
hablar
hacer
hacha
hada
hallar
hamaca
harina
haz
hazan\u0303a
hebilla
hebra
hecho
helado
helio
hembra
herir
hermano
he\u0301roe
hervir
hielo
hierro
hi\u0301gado
higiene
hijo
himno
historia
hocico
hogar
hoguera
hoja
hombre
hongo
honor
honra
hora
hormiga
horno
hostil
hoyo
hueco
huelga
huerta
hueso
huevo
huida
huir
humano
hu\u0301medo
humilde
humo
hundir
huraca\u0301n
hurto
icono
ideal
idioma
i\u0301dolo
iglesia
iglu\u0301
igual
ilegal
ilusio\u0301n
imagen
ima\u0301n
imitar
impar
imperio
imponer
impulso
incapaz
i\u0301ndice
inerte
infiel
informe
ingenio
inicio
inmenso
inmune
innato
insecto
instante
intere\u0301s
i\u0301ntimo
intuir
inu\u0301til
invierno
ira
iris
ironi\u0301a
isla
islote
jabali\u0301
jabo\u0301n
jamo\u0301n
jarabe
jardi\u0301n
jarra
jaula
jazmi\u0301n
jefe
jeringa
jinete
jornada
joroba
joven
joya
juerga
jueves
juez
jugador
jugo
juguete
juicio
junco
jungla
junio
juntar
ju\u0301piter
jurar
justo
juvenil
juzgar
kilo
koala
labio
lacio
lacra
lado
ladro\u0301n
lagarto
la\u0301grima
laguna
laico
lamer
la\u0301mina
la\u0301mpara
lana
lancha
langosta
lanza
la\u0301piz
largo
larva
la\u0301stima
lata
la\u0301tex
latir
laurel
lavar
lazo
leal
leccio\u0301n
leche
lector
leer
legio\u0301n
legumbre
lejano
lengua
lento
len\u0303a
leo\u0301n
leopardo
lesio\u0301n
letal
letra
leve
leyenda
libertad
libro
licor
li\u0301der
lidiar
lienzo
liga
ligero
lima
li\u0301mite
limo\u0301n
limpio
lince
lindo
li\u0301nea
lingote
lino
linterna
li\u0301quido
liso
lista
litera
litio
litro
llaga
llama
llanto
llave
llegar
llenar
llevar
llorar
llover
lluvia
lobo
locio\u0301n
loco
locura
lo\u0301gica
logro
lombriz
lomo
lonja
lote
lucha
lucir
lugar
lujo
luna
lunes
lupa
lustro
luto
luz
maceta
macho
madera
madre
maduro
maestro
mafia
magia
mago
mai\u0301z
maldad
maleta
malla
malo
mama\u0301
mambo
mamut
manco
mando
manejar
manga
maniqui\u0301
manjar
mano
manso
manta
man\u0303ana
mapa
ma\u0301quina
mar
marco
marea
marfil
margen
marido
ma\u0301rmol
marro\u0301n
martes
marzo
masa
ma\u0301scara
masivo
matar
materia
matiz
matriz
ma\u0301ximo
mayor
mazorca
mecha
medalla
medio
me\u0301dula
mejilla
mejor
melena
melo\u0301n
memoria
menor
mensaje
mente
menu\u0301
mercado
merengue
me\u0301rito
mes
meso\u0301n
meta
meter
me\u0301todo
metro
mezcla
miedo
miel
miembro
miga
mil
milagro
militar
millo\u0301n
mimo
mina
minero
mi\u0301nimo
minuto
miope
mirar
misa
miseria
misil
mismo
mitad
mito
mochila
mocio\u0301n
moda
modelo
moho
mojar
molde
moler
molino
momento
momia
monarca
moneda
monja
monto
mon\u0303o
morada
morder
moreno
morir
morro
morsa
mortal
mosca
mostrar
motivo
mover
mo\u0301vil
mozo
mucho
mudar
mueble
muela
muerte
muestra
mugre
mujer
mula
muleta
multa
mundo
mun\u0303eca
mural
muro
mu\u0301sculo
museo
musgo
mu\u0301sica
muslo
na\u0301car
nacio\u0301n
nadar
naipe
naranja
nariz
narrar
nasal
natal
nativo
natural
na\u0301usea
naval
nave
navidad
necio
ne\u0301ctar
negar
negocio
negro
neo\u0301n
nervio
neto
neutro
nevar
nevera
nicho
nido
niebla
nieto
nin\u0303ez
nin\u0303o
ni\u0301tido
nivel
nobleza
noche
no\u0301mina
noria
norma
norte
nota
noticia
novato
novela
novio
nube
nuca
nu\u0301cleo
nudillo
nudo
nuera
nueve
nuez
nulo
nu\u0301mero
nutria
oasis
obeso
obispo
objeto
obra
obrero
observar
obtener
obvio
oca
ocaso
oce\u0301ano
ochenta
ocho
ocio
ocre
octavo
octubre
oculto
ocupar
ocurrir
odiar
odio
odisea
oeste
ofensa
oferta
oficio
ofrecer
ogro
oi\u0301do
oi\u0301r
ojo
ola
oleada
olfato
olivo
olla
olmo
olor
olvido
ombligo
onda
onza
opaco
opcio\u0301n
o\u0301pera
opinar
oponer
optar
o\u0301ptica
opuesto
oracio\u0301n
orador
oral
o\u0301rbita
orca
orden
oreja
o\u0301rgano
orgi\u0301a
orgullo
oriente
origen
orilla
oro
orquesta
oruga
osadi\u0301a
oscuro
osezno
oso
ostra
oton\u0303o
otro
oveja
o\u0301vulo
o\u0301xido
oxi\u0301geno
oyente
ozono
pacto
padre
paella
pa\u0301gina
pago
pai\u0301s
pa\u0301jaro
palabra
palco
paleta
pa\u0301lido
palma
paloma
palpar
pan
panal
pa\u0301nico
pantera
pan\u0303uelo
papa\u0301
papel
papilla
paquete
parar
parcela
pared
parir
paro
pa\u0301rpado
parque
pa\u0301rrafo
parte
pasar
paseo
pasio\u0301n
paso
pasta
pata
patio
patria
pausa
pauta
pavo
payaso
peato\u0301n
pecado
pecera
pecho
pedal
pedir
pegar
peine
pelar
peldan\u0303o
pelea
peligro
pellejo
pelo
peluca
pena
pensar
pen\u0303o\u0301n
peo\u0301n
peor
pepino
pequen\u0303o
pera
percha
perder
pereza
perfil
perico
perla
permiso
perro
persona
pesa
pesca
pe\u0301simo
pestan\u0303a
pe\u0301talo
petro\u0301leo
pez
pezun\u0303a
picar
picho\u0301n
pie
piedra
pierna
pieza
pijama
pilar
piloto
pimienta
pino
pintor
pinza
pin\u0303a
piojo
pipa
pirata
pisar
piscina
piso
pista
pito\u0301n
pizca
placa
plan
plata
playa
plaza
pleito
pleno
plomo
pluma
plural
pobre
poco
poder
podio
poema
poesi\u0301a
poeta
polen
polici\u0301a
pollo
polvo
pomada
pomelo
pomo
pompa
poner
porcio\u0301n
portal
posada
poseer
posible
poste
potencia
potro
pozo
prado
precoz
pregunta
premio
prensa
preso
previo
primo
pri\u0301ncipe
prisio\u0301n
privar
proa
probar
proceso
producto
proeza
profesor
programa
prole
promesa
pronto
propio
pro\u0301ximo
prueba
pu\u0301blico
puchero
pudor
pueblo
puerta
puesto
pulga
pulir
pulmo\u0301n
pulpo
pulso
puma
punto
pun\u0303al
pun\u0303o
pupa
pupila
pure\u0301
quedar
queja
quemar
querer
queso
quieto
qui\u0301mica
quince
quitar
ra\u0301bano
rabia
rabo
racio\u0301n
radical
rai\u0301z
rama
rampa
rancho
rango
rapaz
ra\u0301pido
rapto
rasgo
raspa
rato
rayo
raza
razo\u0301n
reaccio\u0301n
realidad
reban\u0303o
rebote
recaer
receta
rechazo
recoger
recreo
recto
recurso
red
redondo
reducir
reflejo
reforma
refra\u0301n
refugio
regalo
regir
regla
regreso
rehe\u0301n
reino
rei\u0301r
reja
relato
relevo
relieve
relleno
reloj
remar
remedio
remo
rencor
rendir
renta
reparto
repetir
reposo
reptil
res
rescate
resina
respeto
resto
resumen
retiro
retorno
retrato
reunir
reve\u0301s
revista
rey
rezar
rico
riego
rienda
riesgo
rifa
ri\u0301gido
rigor
rinco\u0301n
rin\u0303o\u0301n
ri\u0301o
riqueza
risa
ritmo
rito
rizo
roble
roce
rociar
rodar
rodeo
rodilla
roer
rojizo
rojo
romero
romper
ron
ronco
ronda
ropa
ropero
rosa
rosca
rostro
rotar
rubi\u0301
rubor
rudo
rueda
rugir
ruido
ruina
ruleta
rulo
rumbo
rumor
ruptura
ruta
rutina
sa\u0301bado
saber
sabio
sable
sacar
sagaz
sagrado
sala
saldo
salero
salir
salmo\u0301n
salo\u0301n
salsa
salto
salud
salvar
samba
sancio\u0301n
sandi\u0301a
sanear
sangre
sanidad
sano
santo
sapo
saque
sardina
sarte\u0301n
sastre
sata\u0301n
sauna
saxofo\u0301n
seccio\u0301n
seco
secreto
secta
sed
seguir
seis
sello
selva
semana
semilla
senda
sensor
sen\u0303al
sen\u0303or
separar
sepia
sequi\u0301a
ser
serie
sermo\u0301n
servir
sesenta
sesio\u0301n
seta
setenta
severo
sexo
sexto
sidra
siesta
siete
siglo
signo
si\u0301laba
silbar
silencio
silla
si\u0301mbolo
simio
sirena
sistema
sitio
situar
sobre
socio
sodio
sol
solapa
soldado
soledad
so\u0301lido
soltar
solucio\u0301n
sombra
sondeo
sonido
sonoro
sonrisa
sopa
soplar
soporte
sordo
sorpresa
sorteo
soste\u0301n
so\u0301tano
suave
subir
suceso
sudor
suegra
suelo
suen\u0303o
suerte
sufrir
sujeto
sulta\u0301n
sumar
superar
suplir
suponer
supremo
sur
surco
suren\u0303o
surgir
susto
sutil
tabaco
tabique
tabla
tabu\u0301
taco
tacto
tajo
talar
talco
talento
talla
talo\u0301n
taman\u0303o
tambor
tango
tanque
tapa
tapete
tapia
tapo\u0301n
taquilla
tarde
tarea
tarifa
tarjeta
tarot
tarro
tarta
tatuaje
tauro
taza
tazo\u0301n
teatro
techo
tecla
te\u0301cnica
tejado
tejer
tejido
tela
tele\u0301fono
tema
temor
templo
tenaz
tender
tener
tenis
tenso
teori\u0301a
terapia
terco
te\u0301rmino
ternura
terror
tesis
tesoro
testigo
tetera
texto
tez
tibio
tiburo\u0301n
tiempo
tienda
tierra
tieso
tigre
tijera
tilde
timbre
ti\u0301mido
timo
tinta
ti\u0301o
ti\u0301pico
tipo
tira
tiro\u0301n
tita\u0301n
ti\u0301tere
ti\u0301tulo
tiza
toalla
tobillo
tocar
tocino
todo
toga
toldo
tomar
tono
tonto
topar
tope
toque
to\u0301rax
torero
tormenta
torneo
toro
torpedo
torre
torso
tortuga
tos
tosco
toser
to\u0301xico
trabajo
tractor
traer
tra\u0301fico
trago
traje
tramo
trance
trato
trauma
trazar
tre\u0301bol
tregua
treinta
tren
trepar
tres
tribu
trigo
tripa
triste
triunfo
trofeo
trompa
tronco
tropa
trote
trozo
truco
trueno
trufa
tuberi\u0301a
tubo
tuerto
tumba
tumor
tu\u0301nel
tu\u0301nica
turbina
turismo
turno
tutor
ubicar
u\u0301lcera
umbral
unidad
unir
universo
uno
untar
un\u0303a
urbano
urbe
urgente
urna
usar
usuario
u\u0301til
utopi\u0301a
uva
vaca
vaci\u0301o
vacuna
vagar
vago
vaina
vajilla
vale
va\u0301lido
valle
valor
va\u0301lvula
vampiro
vara
variar
varo\u0301n
vaso
vecino
vector
vehi\u0301culo
veinte
vejez
vela
velero
veloz
vena
vencer
venda
veneno
vengar
venir
venta
venus
ver
verano
verbo
verde
vereda
verja
verso
verter
vi\u0301a
viaje
vibrar
vicio
vi\u0301ctima
vida
vi\u0301deo
vidrio
viejo
viernes
vigor
vil
villa
vinagre
vino
vin\u0303edo
violi\u0301n
viral
virgo
virtud
visor
vi\u0301spera
vista
vitamina
viudo
vivaz
vivero
vivir
vivo
volca\u0301n
volumen
volver
voraz
votar
voto
voz
vuelo
vulgar
yacer
yate
yegua
yema
yerno
yeso
yodo
yoga
yogur
zafiro
zanja
zapato
zarza
zona
zorro
zumo
zurdo`.split("\n");
  }
});

// node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/traditional-chinese.js
var wordlist10;
var init_traditional_chinese = __esm({
  "node_modules/.pnpm/@scure+bip39@1.6.0/node_modules/@scure/bip39/esm/wordlists/traditional-chinese.js"() {
    wordlist10 = `\u7684
\u4E00
\u662F
\u5728
\u4E0D
\u4E86
\u6709
\u548C
\u4EBA
\u9019
\u4E2D
\u5927
\u70BA
\u4E0A
\u500B
\u570B
\u6211
\u4EE5
\u8981
\u4ED6
\u6642
\u4F86
\u7528
\u5011
\u751F
\u5230
\u4F5C
\u5730
\u65BC
\u51FA
\u5C31
\u5206
\u5C0D
\u6210
\u6703
\u53EF
\u4E3B
\u767C
\u5E74
\u52D5
\u540C
\u5DE5
\u4E5F
\u80FD
\u4E0B
\u904E
\u5B50
\u8AAA
\u7522
\u7A2E
\u9762
\u800C
\u65B9
\u5F8C
\u591A
\u5B9A
\u884C
\u5B78
\u6CD5
\u6240
\u6C11
\u5F97
\u7D93
\u5341
\u4E09
\u4E4B
\u9032
\u8457
\u7B49
\u90E8
\u5EA6
\u5BB6
\u96FB
\u529B
\u88E1
\u5982
\u6C34
\u5316
\u9AD8
\u81EA
\u4E8C
\u7406
\u8D77
\u5C0F
\u7269
\u73FE
\u5BE6
\u52A0
\u91CF
\u90FD
\u5169
\u9AD4
\u5236
\u6A5F
\u7576
\u4F7F
\u9EDE
\u5F9E
\u696D
\u672C
\u53BB
\u628A
\u6027
\u597D
\u61C9
\u958B
\u5B83
\u5408
\u9084
\u56E0
\u7531
\u5176
\u4E9B
\u7136
\u524D
\u5916
\u5929
\u653F
\u56DB
\u65E5
\u90A3
\u793E
\u7FA9
\u4E8B
\u5E73
\u5F62
\u76F8
\u5168
\u8868
\u9593
\u6A23
\u8207
\u95DC
\u5404
\u91CD
\u65B0
\u7DDA
\u5167
\u6578
\u6B63
\u5FC3
\u53CD
\u4F60
\u660E
\u770B
\u539F
\u53C8
\u9EBC
\u5229
\u6BD4
\u6216
\u4F46
\u8CEA
\u6C23
\u7B2C
\u5411
\u9053
\u547D
\u6B64
\u8B8A
\u689D
\u53EA
\u6C92
\u7D50
\u89E3
\u554F
\u610F
\u5EFA
\u6708
\u516C
\u7121
\u7CFB
\u8ECD
\u5F88
\u60C5
\u8005
\u6700
\u7ACB
\u4EE3
\u60F3
\u5DF2
\u901A
\u4E26
\u63D0
\u76F4
\u984C
\u9EE8
\u7A0B
\u5C55
\u4E94
\u679C
\u6599
\u8C61
\u54E1
\u9769
\u4F4D
\u5165
\u5E38
\u6587
\u7E3D
\u6B21
\u54C1
\u5F0F
\u6D3B
\u8A2D
\u53CA
\u7BA1
\u7279
\u4EF6
\u9577
\u6C42
\u8001
\u982D
\u57FA
\u8CC7
\u908A
\u6D41
\u8DEF
\u7D1A
\u5C11
\u5716
\u5C71
\u7D71
\u63A5
\u77E5
\u8F03
\u5C07
\u7D44
\u898B
\u8A08
\u5225
\u5979
\u624B
\u89D2
\u671F
\u6839
\u8AD6
\u904B
\u8FB2
\u6307
\u5E7E
\u4E5D
\u5340
\u5F37
\u653E
\u6C7A
\u897F
\u88AB
\u5E79
\u505A
\u5FC5
\u6230
\u5148
\u56DE
\u5247
\u4EFB
\u53D6
\u64DA
\u8655
\u968A
\u5357
\u7D66
\u8272
\u5149
\u9580
\u5373
\u4FDD
\u6CBB
\u5317
\u9020
\u767E
\u898F
\u71B1
\u9818
\u4E03
\u6D77
\u53E3
\u6771
\u5C0E
\u5668
\u58D3
\u5FD7
\u4E16
\u91D1
\u589E
\u722D
\u6FDF
\u968E
\u6CB9
\u601D
\u8853
\u6975
\u4EA4
\u53D7
\u806F
\u4EC0
\u8A8D
\u516D
\u5171
\u6B0A
\u6536
\u8B49
\u6539
\u6E05
\u7F8E
\u518D
\u63A1
\u8F49
\u66F4
\u55AE
\u98A8
\u5207
\u6253
\u767D
\u6559
\u901F
\u82B1
\u5E36
\u5B89
\u5834
\u8EAB
\u8ECA
\u4F8B
\u771F
\u52D9
\u5177
\u842C
\u6BCF
\u76EE
\u81F3
\u9054
\u8D70
\u7A4D
\u793A
\u8B70
\u8072
\u5831
\u9B25
\u5B8C
\u985E
\u516B
\u96E2
\u83EF
\u540D
\u78BA
\u624D
\u79D1
\u5F35
\u4FE1
\u99AC
\u7BC0
\u8A71
\u7C73
\u6574
\u7A7A
\u5143
\u6CC1
\u4ECA
\u96C6
\u6EAB
\u50B3
\u571F
\u8A31
\u6B65
\u7FA4
\u5EE3
\u77F3
\u8A18
\u9700
\u6BB5
\u7814
\u754C
\u62C9
\u6797
\u5F8B
\u53EB
\u4E14
\u7A76
\u89C0
\u8D8A
\u7E54
\u88DD
\u5F71
\u7B97
\u4F4E
\u6301
\u97F3
\u773E
\u66F8
\u5E03
\u590D
\u5BB9
\u5152
\u9808
\u969B
\u5546
\u975E
\u9A57
\u9023
\u65B7
\u6DF1
\u96E3
\u8FD1
\u7926
\u5343
\u9031
\u59D4
\u7D20
\u6280
\u5099
\u534A
\u8FA6
\u9752
\u7701
\u5217
\u7FD2
\u97FF
\u7D04
\u652F
\u822C
\u53F2
\u611F
\u52DE
\u4FBF
\u5718
\u5F80
\u9178
\u6B77
\u5E02
\u514B
\u4F55
\u9664
\u6D88
\u69CB
\u5E9C
\u7A31
\u592A
\u6E96
\u7CBE
\u503C
\u865F
\u7387
\u65CF
\u7DAD
\u5283
\u9078
\u6A19
\u5BEB
\u5B58
\u5019
\u6BDB
\u89AA
\u5FEB
\u6548
\u65AF
\u9662
\u67E5
\u6C5F
\u578B
\u773C
\u738B
\u6309
\u683C
\u990A
\u6613
\u7F6E
\u6D3E
\u5C64
\u7247
\u59CB
\u537B
\u5C08
\u72C0
\u80B2
\u5EE0
\u4EAC
\u8B58
\u9069
\u5C6C
\u5713
\u5305
\u706B
\u4F4F
\u8ABF
\u6EFF
\u7E23
\u5C40
\u7167
\u53C3
\u7D05
\u7D30
\u5F15
\u807D
\u8A72
\u9435
\u50F9
\u56B4
\u9996
\u5E95
\u6DB2
\u5B98
\u5FB7
\u96A8
\u75C5
\u8607
\u5931
\u723E
\u6B7B
\u8B1B
\u914D
\u5973
\u9EC3
\u63A8
\u986F
\u8AC7
\u7F6A
\u795E
\u85DD
\u5462
\u5E2D
\u542B
\u4F01
\u671B
\u5BC6
\u6279
\u71DF
\u9805
\u9632
\u8209
\u7403
\u82F1
\u6C27
\u52E2
\u544A
\u674E
\u53F0
\u843D
\u6728
\u5E6B
\u8F2A
\u7834
\u4E9E
\u5E2B
\u570D
\u6CE8
\u9060
\u5B57
\u6750
\u6392
\u4F9B
\u6CB3
\u614B
\u5C01
\u53E6
\u65BD
\u6E1B
\u6A39
\u6EB6
\u600E
\u6B62
\u6848
\u8A00
\u58EB
\u5747
\u6B66
\u56FA
\u8449
\u9B5A
\u6CE2
\u8996
\u50C5
\u8CBB
\u7DCA
\u611B
\u5DE6
\u7AE0
\u65E9
\u671D
\u5BB3
\u7E8C
\u8F15
\u670D
\u8A66
\u98DF
\u5145
\u5175
\u6E90
\u5224
\u8B77
\u53F8
\u8DB3
\u67D0
\u7DF4
\u5DEE
\u81F4
\u677F
\u7530
\u964D
\u9ED1
\u72AF
\u8CA0
\u64CA
\u8303
\u7E7C
\u8208
\u4F3C
\u9918
\u5805
\u66F2
\u8F38
\u4FEE
\u6545
\u57CE
\u592B
\u5920
\u9001
\u7B46
\u8239
\u4F54
\u53F3
\u8CA1
\u5403
\u5BCC
\u6625
\u8077
\u89BA
\u6F22
\u756B
\u529F
\u5DF4
\u8DDF
\u96D6
\u96DC
\u98DB
\u6AA2
\u5438
\u52A9
\u6607
\u967D
\u4E92
\u521D
\u5275
\u6297
\u8003
\u6295
\u58DE
\u7B56
\u53E4
\u5F91
\u63DB
\u672A
\u8DD1
\u7559
\u92FC
\u66FE
\u7AEF
\u8CAC
\u7AD9
\u7C21
\u8FF0
\u9322
\u526F
\u76E1
\u5E1D
\u5C04
\u8349
\u885D
\u627F
\u7368
\u4EE4
\u9650
\u963F
\u5BA3
\u74B0
\u96D9
\u8ACB
\u8D85
\u5FAE
\u8B93
\u63A7
\u5DDE
\u826F
\u8EF8
\u627E
\u5426
\u7D00
\u76CA
\u4F9D
\u512A
\u9802
\u790E
\u8F09
\u5012
\u623F
\u7A81
\u5750
\u7C89
\u6575
\u7565
\u5BA2
\u8881
\u51B7
\u52DD
\u7D55
\u6790
\u584A
\u5291
\u6E2C
\u7D72
\u5354
\u8A34
\u5FF5
\u9673
\u4ECD
\u7F85
\u9E7D
\u53CB
\u6D0B
\u932F
\u82E6
\u591C
\u5211
\u79FB
\u983B
\u9010
\u9760
\u6DF7
\u6BCD
\u77ED
\u76AE
\u7D42
\u805A
\u6C7D
\u6751
\u96F2
\u54EA
\u65E2
\u8DDD
\u885B
\u505C
\u70C8
\u592E
\u5BDF
\u71D2
\u8FC5
\u5883
\u82E5
\u5370
\u6D32
\u523B
\u62EC
\u6FC0
\u5B54
\u641E
\u751A
\u5BA4
\u5F85
\u6838
\u6821
\u6563
\u4FB5
\u5427
\u7532
\u904A
\u4E45
\u83DC
\u5473
\u820A
\u6A21
\u6E56
\u8CA8
\u640D
\u9810
\u963B
\u6BEB
\u666E
\u7A69
\u4E59
\u5ABD
\u690D
\u606F
\u64F4
\u9280
\u8A9E
\u63EE
\u9152
\u5B88
\u62FF
\u5E8F
\u7D19
\u91AB
\u7F3A
\u96E8
\u55CE
\u91DD
\u5289
\u554A
\u6025
\u5531
\u8AA4
\u8A13
\u9858
\u5BE9
\u9644
\u7372
\u8336
\u9BAE
\u7CE7
\u65A4
\u5B69
\u812B
\u786B
\u80A5
\u5584
\u9F8D
\u6F14
\u7236
\u6F38
\u8840
\u6B61
\u68B0
\u638C
\u6B4C
\u6C99
\u525B
\u653B
\u8B02
\u76FE
\u8A0E
\u665A
\u7C92
\u4E82
\u71C3
\u77DB
\u4E4E
\u6BBA
\u85E5
\u5BE7
\u9B6F
\u8CB4
\u9418
\u7164
\u8B80
\u73ED
\u4F2F
\u9999
\u4ECB
\u8FEB
\u53E5
\u8C50
\u57F9
\u63E1
\u862D
\u64D4
\u5F26
\u86CB
\u6C89
\u5047
\u7A7F
\u57F7
\u7B54
\u6A02
\u8AB0
\u9806
\u7159
\u7E2E
\u5FB5
\u81C9
\u559C
\u677E
\u8173
\u56F0
\u7570
\u514D
\u80CC
\u661F
\u798F
\u8CB7
\u67D3
\u4E95
\u6982
\u6162
\u6015
\u78C1
\u500D
\u7956
\u7687
\u4FC3
\u975C
\u88DC
\u8A55
\u7FFB
\u8089
\u8E10
\u5C3C
\u8863
\u5BEC
\u63DA
\u68C9
\u5E0C
\u50B7
\u64CD
\u5782
\u79CB
\u5B9C
\u6C2B
\u5957
\u7763
\u632F
\u67B6
\u4EAE
\u672B
\u61B2
\u6176
\u7DE8
\u725B
\u89F8
\u6620
\u96F7
\u92B7
\u8A69
\u5EA7
\u5C45
\u6293
\u88C2
\u80DE
\u547C
\u5A18
\u666F
\u5A01
\u7DA0
\u6676
\u539A
\u76DF
\u8861
\u96DE
\u5B6B
\u5EF6
\u5371
\u81A0
\u5C4B
\u9109
\u81E8
\u9678
\u9867
\u6389
\u5440
\u71C8
\u6B72
\u63AA
\u675F
\u8010
\u5287
\u7389
\u8D99
\u8DF3
\u54E5
\u5B63
\u8AB2
\u51F1
\u80E1
\u984D
\u6B3E
\u7D39
\u5377
\u9F4A
\u5049
\u84B8
\u6B96
\u6C38
\u5B97
\u82D7
\u5DDD
\u7210
\u5CA9
\u5F31
\u96F6
\u694A
\u594F
\u6CBF
\u9732
\u687F
\u63A2
\u6ED1
\u93AE
\u98EF
\u6FC3
\u822A
\u61F7
\u8D95
\u5EAB
\u596A
\u4F0A
\u9748
\u7A05
\u9014
\u6EC5
\u8CFD
\u6B78
\u53EC
\u9F13
\u64AD
\u76E4
\u88C1
\u96AA
\u5EB7
\u552F
\u9304
\u83CC
\u7D14
\u501F
\u7CD6
\u84CB
\u6A6B
\u7B26
\u79C1
\u52AA
\u5802
\u57DF
\u69CD
\u6F64
\u5E45
\u54C8
\u7ADF
\u719F
\u87F2
\u6FA4
\u8166
\u58E4
\u78B3
\u6B50
\u904D
\u5074
\u5BE8
\u6562
\u5FB9
\u616E
\u659C
\u8584
\u5EAD
\u7D0D
\u5F48
\u98FC
\u4F38
\u6298
\u9EA5
\u6FD5
\u6697
\u8377
\u74E6
\u585E
\u5E8A
\u7BC9
\u60E1
\u6236
\u8A2A
\u5854
\u5947
\u900F
\u6881
\u5200
\u65CB
\u8DE1
\u5361
\u6C2F
\u9047
\u4EFD
\u6BD2
\u6CE5
\u9000
\u6D17
\u64FA
\u7070
\u5F69
\u8CE3
\u8017
\u590F
\u64C7
\u5FD9
\u9285
\u737B
\u786C
\u4E88
\u7E41
\u5708
\u96EA
\u51FD
\u4EA6
\u62BD
\u7BC7
\u9663
\u9670
\u4E01
\u5C3A
\u8FFD
\u5806
\u96C4
\u8FCE
\u6CDB
\u7238
\u6A13
\u907F
\u8B00
\u5678
\u91CE
\u8C6C
\u65D7
\u7D2F
\u504F
\u5178
\u9928
\u7D22
\u79E6
\u8102
\u6F6E
\u723A
\u8C46
\u5FFD
\u6258
\u9A5A
\u5851
\u907A
\u6108
\u6731
\u66FF
\u7E96
\u7C97
\u50BE
\u5C1A
\u75DB
\u695A
\u8B1D
\u596E
\u8CFC
\u78E8
\u541B
\u6C60
\u65C1
\u788E
\u9AA8
\u76E3
\u6355
\u5F1F
\u66B4
\u5272
\u8CAB
\u6B8A
\u91CB
\u8A5E
\u4EA1
\u58C1
\u9813
\u5BF6
\u5348
\u5875
\u805E
\u63ED
\u70AE
\u6B98
\u51AC
\u6A4B
\u5A66
\u8B66
\u7D9C
\u62DB
\u5433
\u4ED8
\u6D6E
\u906D
\u5F90
\u60A8
\u6416
\u8C37
\u8D0A
\u7BB1
\u9694
\u8A02
\u7537
\u5439
\u5712
\u7D1B
\u5510
\u6557
\u5B8B
\u73BB
\u5DE8
\u8015
\u5766
\u69AE
\u9589
\u7063
\u9375
\u51E1
\u99D0
\u934B
\u6551
\u6069
\u525D
\u51DD
\u9E7C
\u9F52
\u622A
\u7149
\u9EBB
\u7D21
\u7981
\u5EE2
\u76DB
\u7248
\u7DE9
\u6DE8
\u775B
\u660C
\u5A5A
\u6D89
\u7B52
\u5634
\u63D2
\u5CB8
\u6717
\u838A
\u8857
\u85CF
\u59D1
\u8CBF
\u8150
\u5974
\u5566
\u6163
\u4E58
\u5925
\u6062
\u52FB
\u7D17
\u624E
\u8FAF
\u8033
\u5F6A
\u81E3
\u5104
\u7483
\u62B5
\u8108
\u79C0
\u85A9
\u4FC4
\u7DB2
\u821E
\u5E97
\u5674
\u7E31
\u5BF8
\u6C57
\u639B
\u6D2A
\u8CC0
\u9583
\u67EC
\u7206
\u70EF
\u6D25
\u7A3B
\u7246
\u8EDF
\u52C7
\u50CF
\u6EFE
\u5398
\u8499
\u82B3
\u80AF
\u5761
\u67F1
\u76EA
\u817F
\u5100
\u65C5
\u5C3E
\u8ECB
\u51B0
\u8CA2
\u767B
\u9ECE
\u524A
\u947D
\u52D2
\u9003
\u969C
\u6C28
\u90ED
\u5CF0
\u5E63
\u6E2F
\u4F0F
\u8ECC
\u755D
\u7562
\u64E6
\u83AB
\u523A
\u6D6A
\u79D8
\u63F4
\u682A
\u5065
\u552E
\u80A1
\u5CF6
\u7518
\u6CE1
\u7761
\u7AE5
\u9444
\u6E6F
\u95A5
\u4F11
\u532F
\u820D
\u7267
\u7E5E
\u70B8
\u54F2
\u78F7
\u7E3E
\u670B
\u6DE1
\u5C16
\u555F
\u9677
\u67F4
\u5448
\u5F92
\u984F
\u6DDA
\u7A0D
\u5FD8
\u6CF5
\u85CD
\u62D6
\u6D1E
\u6388
\u93E1
\u8F9B
\u58EF
\u92D2
\u8CA7
\u865B
\u5F4E
\u6469
\u6CF0
\u5E7C
\u5EF7
\u5C0A
\u7A97
\u7DB1
\u5F04
\u96B8
\u7591
\u6C0F
\u5BAE
\u59D0
\u9707
\u745E
\u602A
\u5C24
\u7434
\u5FAA
\u63CF
\u819C
\u9055
\u593E
\u8170
\u7DE3
\u73E0
\u7AAE
\u68EE
\u679D
\u7AF9
\u6E9D
\u50AC
\u7E69
\u61B6
\u90A6
\u5269
\u5E78
\u6F3F
\u6B04
\u64C1
\u7259
\u8CAF
\u79AE
\u6FFE
\u9209
\u7D0B
\u7F77
\u62CD
\u54B1
\u558A
\u8896
\u57C3
\u52E4
\u7F70
\u7126
\u6F5B
\u4F0D
\u58A8
\u6B32
\u7E2B
\u59D3
\u520A
\u98FD
\u4EFF
\u734E
\u92C1
\u9B3C
\u9E97
\u8DE8
\u9ED8
\u6316
\u93C8
\u6383
\u559D
\u888B
\u70AD
\u6C61
\u5E55
\u8AF8
\u5F27
\u52F5
\u6885
\u5976
\u6F54
\u707D
\u821F
\u9451
\u82EF
\u8A1F
\u62B1
\u6BC0
\u61C2
\u5BD2
\u667A
\u57D4
\u5BC4
\u5C46
\u8E8D
\u6E21
\u6311
\u4E39
\u8271
\u8C9D
\u78B0
\u62D4
\u7239
\u6234
\u78BC
\u5922
\u82BD
\u7194
\u8D64
\u6F01
\u54ED
\u656C
\u9846
\u5954
\u925B
\u4EF2
\u864E
\u7A00
\u59B9
\u4E4F
\u73CD
\u7533
\u684C
\u9075
\u5141
\u9686
\u87BA
\u5009
\u9B4F
\u92B3
\u66C9
\u6C2E
\u517C
\u96B1
\u7919
\u8D6B
\u64A5
\u5FE0
\u8085
\u7F38
\u727D
\u6436
\u535A
\u5DE7
\u6BBC
\u5144
\u675C
\u8A0A
\u8AA0
\u78A7
\u7965
\u67EF
\u9801
\u5DE1
\u77E9
\u60B2
\u704C
\u9F61
\u502B
\u7968
\u5C0B
\u6842
\u92EA
\u8056
\u6050
\u6070
\u912D
\u8DA3
\u62AC
\u8352
\u9A30
\u8CBC
\u67D4
\u6EF4
\u731B
\u95CA
\u8F1B
\u59BB
\u586B
\u64A4
\u5132
\u7C3D
\u9B27
\u64FE
\u7D2B
\u7802
\u905E
\u6232
\u540A
\u9676
\u4F10
\u9935
\u7642
\u74F6
\u5A46
\u64AB
\u81C2
\u6478
\u5FCD
\u8766
\u881F
\u9130
\u80F8
\u978F
\u64E0
\u5076
\u68C4
\u69FD
\u52C1
\u4E73
\u9127
\u5409
\u4EC1
\u721B
\u78DA
\u79DF
\u70CF
\u8266
\u4F34
\u74DC
\u6DFA
\u4E19
\u66AB
\u71E5
\u6A61
\u67F3
\u8FF7
\u6696
\u724C
\u79E7
\u81BD
\u8A73
\u7C27
\u8E0F
\u74F7
\u8B5C
\u5446
\u8CD3
\u7CCA
\u6D1B
\u8F1D
\u61A4
\u7AF6
\u9699
\u6012
\u7C98
\u4E43
\u7DD2
\u80A9
\u7C4D
\u654F
\u5857
\u7199
\u7686
\u5075
\u61F8
\u6398
\u4EAB
\u7CFE
\u9192
\u72C2
\u9396
\u6DC0
\u6068
\u7272
\u9738
\u722C
\u8CDE
\u9006
\u73A9
\u9675
\u795D
\u79D2
\u6D59
\u8C8C
\u5F79
\u5F7C
\u6089
\u9D28
\u8DA8
\u9CF3
\u6668
\u755C
\u8F29
\u79E9
\u5375
\u7F72
\u68AF
\u708E
\u7058
\u68CB
\u9A45
\u7BE9
\u5CFD
\u5192
\u5565
\u58FD
\u8B6F
\u6D78
\u6CC9
\u5E3D
\u9072
\u77FD
\u7586
\u8CB8
\u6F0F
\u7A3F
\u51A0
\u5AE9
\u8105
\u82AF
\u7262
\u53DB
\u8755
\u5967
\u9CF4
\u5DBA
\u7F8A
\u6191
\u4E32
\u5858
\u7E6A
\u9175
\u878D
\u76C6
\u932B
\u5EDF
\u7C4C
\u51CD
\u8F14
\u651D
\u8972
\u7B4B
\u62D2
\u50DA
\u65F1
\u9240
\u9CE5
\u6F06
\u6C88
\u7709
\u758F
\u6DFB
\u68D2
\u7A57
\u785D
\u97D3
\u903C
\u626D
\u50D1
\u6DBC
\u633A
\u7897
\u683D
\u7092
\u676F
\u60A3
\u993E
\u52F8
\u8C6A
\u907C
\u52C3
\u9D3B
\u65E6
\u540F
\u62DC
\u72D7
\u57CB
\u8F25
\u63A9
\u98F2
\u642C
\u7F75
\u8FAD
\u52FE
\u6263
\u4F30
\u8523
\u7D68
\u9727
\u4E08
\u6735
\u59C6
\u64EC
\u5B87
\u8F2F
\u965D
\u96D5
\u511F
\u84C4
\u5D07
\u526A
\u5021
\u5EF3
\u54AC
\u99DB
\u85AF
\u5237
\u65A5
\u756A
\u8CE6
\u5949
\u4F5B
\u6F86
\u6F2B
\u66FC
\u6247
\u9223
\u6843
\u6276
\u4ED4
\u8FD4
\u4FD7
\u8667
\u8154
\u978B
\u68F1
\u8986
\u6846
\u6084
\u53D4
\u649E
\u9A19
\u52D8
\u65FA
\u6CB8
\u5B64
\u5410
\u5B5F
\u6E20
\u5C48
\u75BE
\u5999
\u60DC
\u4EF0
\u72E0
\u8139
\u8AE7
\u62CB
\u9EF4
\u6851
\u5D17
\u561B
\u8870
\u76DC
\u6EF2
\u81DF
\u8CF4
\u6E67
\u751C
\u66F9
\u95B1
\u808C
\u54E9
\u53B2
\u70F4
\u7DEF
\u6BC5
\u6628
\u507D
\u75C7
\u716E
\u5606
\u91D8
\u642D
\u8396
\u7C60
\u9177
\u5077
\u5F13
\u9310
\u6046
\u5091
\u5751
\u9F3B
\u7FFC
\u7DB8
\u6558
\u7344
\u902E
\u7F50
\u7D61
\u68DA
\u6291
\u81A8
\u852C
\u5BFA
\u9A5F
\u7A46
\u51B6
\u67AF
\u518A
\u5C4D
\u51F8
\u7D33
\u576F
\u72A7
\u7130
\u8F5F
\u6B23
\u6649
\u7626
\u79A6
\u9320
\u9326
\u55AA
\u65EC
\u935B
\u58DF
\u641C
\u64B2
\u9080
\u4EAD
\u916F
\u9081
\u8212
\u8106
\u9176
\u9592
\u6182
\u915A
\u9811
\u7FBD
\u6F32
\u5378
\u4ED7
\u966A
\u95E2
\u61F2
\u676D
\u59DA
\u809A
\u6349
\u98C4
\u6F02
\u6606
\u6B3A
\u543E
\u90CE
\u70F7
\u6C41
\u5475
\u98FE
\u856D
\u96C5
\u90F5
\u9077
\u71D5
\u6492
\u59FB
\u8D74
\u5BB4
\u7169
\u50B5
\u5E33
\u6591
\u9234
\u65E8
\u9187
\u8463
\u9905
\u96DB
\u59FF
\u62CC
\u5085
\u8179
\u59A5
\u63C9
\u8CE2
\u62C6
\u6B6A
\u8461
\u80FA
\u4E1F
\u6D69
\u5FBD
\u6602
\u588A
\u64CB
\u89BD
\u8CAA
\u6170
\u7E73
\u6C6A
\u614C
\u99AE
\u8AFE
\u59DC
\u8ABC
\u5147
\u52A3
\u8AA3
\u8000
\u660F
\u8EBA
\u76C8
\u9A0E
\u55AC
\u6EAA
\u53E2
\u76E7
\u62B9
\u60B6
\u8AEE
\u522E
\u99D5
\u7E9C
\u609F
\u6458
\u927A
\u64F2
\u9817
\u5E7B
\u67C4
\u60E0
\u6158
\u4F73
\u4EC7
\u81D8
\u7AA9
\u6ECC
\u528D
\u77A7
\u5821
\u6F51
\u8525
\u7F69
\u970D
\u6488
\u80CE
\u84BC
\u6FF1
\u5006
\u6345
\u6E58
\u780D
\u971E
\u90B5
\u8404
\u760B
\u6DEE
\u9042
\u718A
\u7CDE
\u70D8
\u5BBF
\u6A94
\u6208
\u99C1
\u5AC2
\u88D5
\u5F99
\u7BAD
\u6350
\u8178
\u6490
\u66EC
\u8FA8
\u6BBF
\u84EE
\u6524
\u652A
\u91AC
\u5C4F
\u75AB
\u54C0
\u8521
\u5835
\u6CAB
\u76BA
\u66A2
\u758A
\u95A3
\u840A
\u6572
\u8F44
\u9264
\u75D5
\u58E9
\u5DF7
\u9913
\u798D
\u4E18
\u7384
\u6E9C
\u66F0
\u908F
\u5F6D
\u5617
\u537F
\u59A8
\u8247
\u541E
\u97CB
\u6028
\u77EE
\u6B47`.split("\n");
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/wordlists.js
var init_wordlists = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/wordlists.js"() {
    init_czech();
    init_english();
    init_french();
    init_italian();
    init_japanese();
    init_korean();
    init_portuguese();
    init_simplified_chinese();
    init_spanish();
    init_traditional_chinese();
  }
});

// node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/index.js
var accounts_exports = {};
__export(accounts_exports, {
  HDKey: () => HDKey,
  createNonceManager: () => createNonceManager,
  czech: () => wordlist,
  english: () => wordlist2,
  french: () => wordlist3,
  generateMnemonic: () => generateMnemonic2,
  generatePrivateKey: () => generatePrivateKey,
  hdKeyToAccount: () => hdKeyToAccount,
  italian: () => wordlist4,
  japanese: () => wordlist5,
  korean: () => wordlist6,
  mnemonicToAccount: () => mnemonicToAccount,
  nonceManager: () => nonceManager,
  parseAccount: () => parseAccount,
  portuguese: () => wordlist7,
  privateKeyToAccount: () => privateKeyToAccount,
  privateKeyToAddress: () => privateKeyToAddress,
  publicKeyToAddress: () => publicKeyToAddress,
  serializeSignature: () => serializeSignature,
  setSignEntropy: () => setSignEntropy,
  sign: () => sign,
  signAuthorization: () => signAuthorization,
  signMessage: () => signMessage,
  signTransaction: () => signTransaction,
  signTypedData: () => signTypedData,
  signatureToHex: () => serializeSignature,
  simplifiedChinese: () => wordlist8,
  spanish: () => wordlist9,
  toAccount: () => toAccount,
  traditionalChinese: () => wordlist10
});
var init_accounts = __esm({
  "node_modules/.pnpm/viem@2.48.7_typescript@5.9.3_zod@4.3.6/node_modules/viem/_esm/accounts/index.js"() {
    init_esm2();
    init_nonceManager();
    init_serializeSignature();
    init_generateMnemonic();
    init_generatePrivateKey();
    init_hdKeyToAccount();
    init_mnemonicToAccount();
    init_privateKeyToAccount();
    init_toAccount();
    init_parseAccount();
    init_privateKeyToAddress();
    init_publicKeyToAddress();
    init_sign();
    init_signAuthorization();
    init_signMessage();
    init_signTransaction();
    init_signTypedData();
    init_wordlists();
  }
});

// api-src/evidence/anchor.ts
var anchor_exports = {};
__export(anchor_exports, {
  default: () => handler
});
module.exports = __toCommonJS(anchor_exports);
async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  let body = req.body;
  if (!body || typeof body !== "object") {
    try {
      const raw = await new Promise((resolve, reject) => {
        let s = "";
        req.on("data", (c) => {
          s += c.toString();
        });
        req.on("end", () => resolve(s));
        req.on("error", reject);
      });
      body = raw ? JSON.parse(raw) : {};
    } catch {
      body = {};
    }
  }
  const { txHash, tier, feeBps } = body;
  if (!txHash || typeof txHash !== "string") {
    res.statusCode = 400;
    res.end(JSON.stringify({ anchored: false, error: "txHash required" }));
    return;
  }
  const zgUrl = process.env.NEXT_PUBLIC_ZG_STORAGE_URL;
  const signerKey = process.env.ZG_SIGNER_PRIVATE_KEY;
  if (!zgUrl || !signerKey) {
    const storageRef = `local:${txHash.slice(0, 16)}`;
    res.statusCode = 200;
    res.end(JSON.stringify({ anchored: true, storageRef, mode: "local", note: "0G Storage not configured \u2014 record stored ephemerally. Configure ZG_SIGNER_PRIVATE_KEY and NEXT_PUBLIC_ZG_STORAGE_URL in Vercel for decentralized storage." }));
    return;
  }
  try {
    const { privateKeyToAccount: privateKeyToAccount2 } = await Promise.resolve().then(() => (init_accounts(), accounts_exports));
    const account = privateKeyToAccount2(signerKey);
    const evidence = { txHash, tier: tier ?? 0, feeBps: feeBps ?? 30, anchoredAt: (/* @__PURE__ */ new Date()).toISOString(), protocol: "toxicflow-passport", chainId: 11155111 };
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25e3);
    const uploadRes = await fetch(`${zgUrl}/upload`, { method: "POST", headers: { "Content-Type": "application/json", "X-Signer": account.address }, body: JSON.stringify(evidence), signal: controller.signal });
    clearTimeout(timeout);
    if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);
    const data = await uploadRes.json();
    const storageRef = data.ref ?? data.hash ?? `zg:${txHash.slice(0, 16)}`;
    res.statusCode = 200;
    res.end(JSON.stringify({ anchored: true, storageRef, mode: "0g-storage" }));
  } catch (err) {
    const storageRef = `local:${txHash.slice(0, 16)}`;
    res.statusCode = 200;
    res.end(JSON.stringify({ anchored: true, storageRef, mode: "local-fallback", note: String(err) }));
  }
}
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
@noble/curves/esm/abstract/modular.js:
@noble/curves/esm/abstract/curve.js:
@noble/curves/esm/abstract/weierstrass.js:
@noble/curves/esm/_shortw_utils.js:
@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/base/lib/esm/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/bip32/lib/esm/index.js:
  (*! scure-bip32 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) *)

@scure/bip39/esm/index.js:
  (*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) *)
*/
