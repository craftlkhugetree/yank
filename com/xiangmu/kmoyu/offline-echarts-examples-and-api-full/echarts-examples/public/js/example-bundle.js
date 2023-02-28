var echartsExample;echartsExample =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@lang/object-visualizer/dist/object-visualizer.esm.min.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@lang/object-visualizer/dist/object-visualizer.esm.min.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mount": () => /* binding */ To,
/* harmony export */   "reactive": () => /* binding */ qe
/* harmony export */ });
function e(e,n){const t=Object.create(null),r=e.split(",");for(let e=0;e<r.length;e++)t[r[e]]=!0;return n?e=>!!t[e.toLowerCase()]:e=>!!t[e]}const n=e("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl"),t=e("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly");function r(e){if(x(e)){const n={};for(let t=0;t<e.length;t++){const o=e[t],s=r(k(o)?l(o):o);if(s)for(const e in s)n[e]=s[e]}return n}if(E(e))return e}const o=/;(?![^(]*\))/g,s=/:(.+)/;function l(e){const n={};return e.split(o).forEach((e=>{if(e){const t=e.split(s);t.length>1&&(n[t[0].trim()]=t[1].trim())}})),n}function a(e){let n="";if(k(e))n=e;else if(x(e))for(let t=0;t<e.length;t++)n+=a(e[t])+" ";else if(E(e))for(const t in e)e[t]&&(n+=t+" ");return n.trim()}const i=e=>null==e?"":E(e)?JSON.stringify(e,c,2):String(e),c=(e,n)=>S(n)?{[`Map(${n.size})`]:[...n.entries()].reduce(((e,[n,t])=>(e[`${n} =>`]=t,e)),{})}:C(n)?{[`Set(${n.size})`]:[...n.values()]}:!E(n)||x(n)||T(n)?n:String(n),u={},d=[],p=()=>{},f=()=>!1,h=/^on[^a-z]/,g=e=>h.test(e),_=e=>e.startsWith("onUpdate:"),y=Object.assign,m=(e,n)=>{const t=e.indexOf(n);t>-1&&e.splice(t,1)},v=Object.prototype.hasOwnProperty,b=(e,n)=>v.call(e,n),x=Array.isArray,S=e=>"[object Map]"===P(e),C=e=>"[object Set]"===P(e),O=e=>"function"==typeof e,k=e=>"string"==typeof e,w=e=>"symbol"==typeof e,E=e=>null!==e&&"object"==typeof e,A=e=>E(e)&&O(e.then)&&O(e.catch),U=Object.prototype.toString,P=e=>U.call(e),T=e=>"[object Object]"===P(e),N=e=>k(e)&&"NaN"!==e&&"-"!==e[0]&&""+parseInt(e,10)===e,V=e(",key,ref,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),F=e=>{const n=Object.create(null);return t=>n[t]||(n[t]=e(t))},j=/-(\w)/g,R=F((e=>e.replace(j,((e,n)=>n?n.toUpperCase():"")))),I=/\B([A-Z])/g,K=F((e=>e.replace(I,"-$1").toLowerCase())),M=F((e=>e.charAt(0).toUpperCase()+e.slice(1))),D=F((e=>e?`on${M(e)}`:"")),$=(e,n)=>e!==n&&(e==e||n==n),L=(e,n)=>{for(let t=0;t<e.length;t++)e[t](n)},q=(e,n,t)=>{Object.defineProperty(e,n,{configurable:!0,enumerable:!1,value:t})},B=e=>{const n=parseFloat(e);return isNaN(n)?e:n};let W;const z=()=>W||(W="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof __webpack_require__.g?__webpack_require__.g:{}),H=new WeakMap,J=[];let G;const Z=Symbol(""),Q=Symbol("");function X(e,n=u){(function(e){return e&&!0===e._isEffect})(e)&&(e=e.raw);const t=function(e,n){const t=function(){if(!t.active)return n.scheduler?void 0:e();if(!J.includes(t)){ne(t);try{return re.push(te),te=!0,J.push(t),G=t,e()}finally{J.pop(),se(),G=J[J.length-1]}}};return t.id=ee++,t.allowRecurse=!!n.allowRecurse,t._isEffect=!0,t.active=!0,t.raw=e,t.deps=[],t.options=n,t}(e,n);return n.lazy||t(),t}function Y(e){e.active&&(ne(e),e.options.onStop&&e.options.onStop(),e.active=!1)}let ee=0;function ne(e){const{deps:n}=e;if(n.length){for(let t=0;t<n.length;t++)n[t].delete(e);n.length=0}}let te=!0;const re=[];function oe(){re.push(te),te=!1}function se(){const e=re.pop();te=void 0===e||e}function le(e,n,t){if(!te||void 0===G)return;let r=H.get(e);r||H.set(e,r=new Map);let o=r.get(t);o||r.set(t,o=new Set),o.has(G)||(o.add(G),G.deps.push(o))}function ae(e,n,t,r,o,s){const l=H.get(e);if(!l)return;const a=new Set,i=e=>{e&&e.forEach((e=>{(e!==G||e.allowRecurse)&&a.add(e)}))};if("clear"===n)l.forEach(i);else if("length"===t&&x(e))l.forEach(((e,n)=>{("length"===n||n>=r)&&i(e)}));else switch(void 0!==t&&i(l.get(t)),n){case"add":x(e)?N(t)&&i(l.get("length")):(i(l.get(Z)),S(e)&&i(l.get(Q)));break;case"delete":x(e)||(i(l.get(Z)),S(e)&&i(l.get(Q)));break;case"set":S(e)&&i(l.get(Z))}a.forEach((e=>{e.options.scheduler?e.options.scheduler(e):e()}))}const ie=new Set(Object.getOwnPropertyNames(Symbol).map((e=>Symbol[e])).filter(w)),ce=he(),ue=he(!1,!0),de=he(!0),pe=he(!0,!0),fe={};function he(e=!1,n=!1){return function(t,r,o){if("__v_isReactive"===r)return!e;if("__v_isReadonly"===r)return e;if("__v_raw"===r&&o===(e?$e:De).get(t))return t;const s=x(t);if(!e&&s&&b(fe,r))return Reflect.get(fe,r,o);const l=Reflect.get(t,r,o);if(w(r)?ie.has(r):"__proto__"===r||"__v_isRef"===r)return l;if(e||le(t,0,r),n)return l;if(Qe(l)){return!s||!N(r)?l.value:l}return E(l)?e?Be(l):qe(l):l}}["includes","indexOf","lastIndexOf"].forEach((e=>{const n=Array.prototype[e];fe[e]=function(...e){const t=Ge(this);for(let e=0,n=this.length;e<n;e++)le(t,0,e+"");const r=n.apply(t,e);return-1===r||!1===r?n.apply(t,e.map(Ge)):r}})),["push","pop","shift","unshift","splice"].forEach((e=>{const n=Array.prototype[e];fe[e]=function(...e){oe();const t=n.apply(this,e);return se(),t}}));function ge(e=!1){return function(n,t,r,o){const s=n[t];if(!e&&(r=Ge(r),!x(n)&&Qe(s)&&!Qe(r)))return s.value=r,!0;const l=x(n)&&N(t)?Number(t)<n.length:b(n,t),a=Reflect.set(n,t,r,o);return n===Ge(o)&&(l?$(r,s)&&ae(n,"set",t,r):ae(n,"add",t,r)),a}}const _e={get:ce,set:ge(),deleteProperty:function(e,n){const t=b(e,n),r=(e[n],Reflect.deleteProperty(e,n));return r&&t&&ae(e,"delete",n,void 0),r},has:function(e,n){const t=Reflect.has(e,n);return w(n)&&ie.has(n)||le(e,0,n),t},ownKeys:function(e){return le(e,0,x(e)?"length":Z),Reflect.ownKeys(e)}},ye={get:de,set:(e,n)=>!0,deleteProperty:(e,n)=>!0},me=y({},_e,{get:ue,set:ge(!0)}),ve=(y({},ye,{get:pe}),e=>E(e)?qe(e):e),be=e=>E(e)?Be(e):e,xe=e=>e,Se=e=>Reflect.getPrototypeOf(e);function Ce(e,n,t=!1,r=!1){const o=Ge(e=e.__v_raw),s=Ge(n);n!==s&&!t&&le(o,0,n),!t&&le(o,0,s);const{has:l}=Se(o),a=t?be:r?xe:ve;return l.call(o,n)?a(e.get(n)):l.call(o,s)?a(e.get(s)):void 0}function Oe(e,n=!1){const t=this.__v_raw,r=Ge(t),o=Ge(e);return e!==o&&!n&&le(r,0,e),!n&&le(r,0,o),e===o?t.has(e):t.has(e)||t.has(o)}function ke(e,n=!1){return e=e.__v_raw,!n&&le(Ge(e),0,Z),Reflect.get(e,"size",e)}function we(e){e=Ge(e);const n=Ge(this),t=Se(n).has.call(n,e);return n.add(e),t||ae(n,"add",e,e),this}function Ee(e,n){n=Ge(n);const t=Ge(this),{has:r,get:o}=Se(t);let s=r.call(t,e);s||(e=Ge(e),s=r.call(t,e));const l=o.call(t,e);return t.set(e,n),s?$(n,l)&&ae(t,"set",e,n):ae(t,"add",e,n),this}function Ae(e){const n=Ge(this),{has:t,get:r}=Se(n);let o=t.call(n,e);o||(e=Ge(e),o=t.call(n,e));r&&r.call(n,e);const s=n.delete(e);return o&&ae(n,"delete",e,void 0),s}function Ue(){const e=Ge(this),n=0!==e.size,t=e.clear();return n&&ae(e,"clear",void 0,void 0),t}function Pe(e,n){return function(t,r){const o=this,s=o.__v_raw,l=Ge(s),a=e?be:n?xe:ve;return!e&&le(l,0,Z),s.forEach(((e,n)=>t.call(r,a(e),a(n),o)))}}function Te(e,n,t){return function(...r){const o=this.__v_raw,s=Ge(o),l=S(s),a="entries"===e||e===Symbol.iterator&&l,i="keys"===e&&l,c=o[e](...r),u=n?be:t?xe:ve;return!n&&le(s,0,i?Q:Z),{next(){const{value:e,done:n}=c.next();return n?{value:e,done:n}:{value:a?[u(e[0]),u(e[1])]:u(e),done:n}},[Symbol.iterator](){return this}}}}function Ne(e){return function(...n){return"delete"!==e&&this}}const Ve={get(e){return Ce(this,e)},get size(){return ke(this)},has:Oe,add:we,set:Ee,delete:Ae,clear:Ue,forEach:Pe(!1,!1)},Fe={get(e){return Ce(this,e,!1,!0)},get size(){return ke(this)},has:Oe,add:we,set:Ee,delete:Ae,clear:Ue,forEach:Pe(!1,!0)},je={get(e){return Ce(this,e,!0)},get size(){return ke(this,!0)},has(e){return Oe.call(this,e,!0)},add:Ne("add"),set:Ne("set"),delete:Ne("delete"),clear:Ne("clear"),forEach:Pe(!0,!1)};function Re(e,n){const t=n?Fe:e?je:Ve;return(n,r,o)=>"__v_isReactive"===r?!e:"__v_isReadonly"===r?e:"__v_raw"===r?n:Reflect.get(b(t,r)&&r in n?t:n,r,o)}["keys","values","entries",Symbol.iterator].forEach((e=>{Ve[e]=Te(e,!1,!1),je[e]=Te(e,!0,!1),Fe[e]=Te(e,!1,!0)}));const Ie={get:Re(!1,!1)},Ke={get:Re(!1,!0)},Me={get:Re(!0,!1)},De=new WeakMap,$e=new WeakMap;function Le(e){return e.__v_skip||!Object.isExtensible(e)?0:function(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}((e=>P(e).slice(8,-1))(e))}function qe(e){return e&&e.__v_isReadonly?e:We(e,!1,_e,Ie)}function Be(e){return We(e,!0,ye,Me)}function We(e,n,t,r){if(!E(e))return e;if(e.__v_raw&&(!n||!e.__v_isReactive))return e;const o=n?$e:De,s=o.get(e);if(s)return s;const l=Le(e);if(0===l)return e;const a=new Proxy(e,2===l?r:t);return o.set(e,a),a}function ze(e){return He(e)?ze(e.__v_raw):!(!e||!e.__v_isReactive)}function He(e){return!(!e||!e.__v_isReadonly)}function Je(e){return ze(e)||He(e)}function Ge(e){return e&&Ge(e.__v_raw)||e}const Ze=e=>E(e)?qe(e):e;function Qe(e){return Boolean(e&&!0===e.__v_isRef)}function Xe(e){return function(e,n=!1){if(Qe(e))return e;return new Ye(e,n)}(e)}class Ye{constructor(e,n=!1){this._rawValue=e,this._shallow=n,this.__v_isRef=!0,this._value=n?e:Ze(e)}get value(){return le(Ge(this),0,"value"),this._value}set value(e){$(Ge(e),this._rawValue)&&(this._rawValue=e,this._value=this._shallow?e:Ze(e),ae(Ge(this),"set","value",e))}}const en={get:(e,n,t)=>function(e){return Qe(e)?e.value:e}(Reflect.get(e,n,t)),set:(e,n,t,r)=>{const o=e[n];return Qe(o)&&!Qe(t)?(o.value=t,!0):Reflect.set(e,n,t,r)}};function nn(e){return ze(e)?e:new Proxy(e,en)}class tn{constructor(e,n){this._object=e,this._key=n,this.__v_isRef=!0}get value(){return this._object[this._key]}set value(e){this._object[this._key]=e}}class rn{constructor(e,n,t){this._setter=n,this._dirty=!0,this.__v_isRef=!0,this.effect=X(e,{lazy:!0,scheduler:()=>{this._dirty||(this._dirty=!0,ae(Ge(this),"set","value"))}}),this.__v_isReadonly=t}get value(){return this._dirty&&(this._value=this.effect(),this._dirty=!1),le(Ge(this),0,"value"),this._value}set value(e){this._setter(e)}}function on(e,n,t,r){let o;try{o=r?e(...r):e()}catch(e){ln(e,n,t)}return o}function sn(e,n,t,r){if(O(e)){const o=on(e,n,t,r);return o&&A(o)&&o.catch((e=>{ln(e,n,t)})),o}const o=[];for(let s=0;s<e.length;s++)o.push(sn(e[s],n,t,r));return o}function ln(e,n,t,r=!0){n&&n.vnode;if(n){let r=n.parent;const o=n.proxy,s=t;for(;r;){const n=r.ec;if(n)for(let t=0;t<n.length;t++)if(!1===n[t](e,o,s))return;r=r.parent}const l=n.appContext.config.errorHandler;if(l)return void on(l,null,10,[e,o,s])}!function(e,n,t,r=!0){console.error(e)}(e,0,0,r)}let an=!1,cn=!1;const un=[];let dn=0;const pn=[];let fn=null,hn=0;const gn=[];let _n=null,yn=0;const mn=Promise.resolve();let vn=null,bn=null;function xn(e){const n=vn||mn;return e?n.then(this?e.bind(this):e):n}function Sn(e){un.length&&un.includes(e,an&&e.allowRecurse?dn+1:dn)||e===bn||(un.push(e),Cn())}function Cn(){an||cn||(cn=!0,vn=mn.then(An))}function On(e,n,t,r){x(e)?t.push(...e):n&&n.includes(e,e.allowRecurse?r+1:r)||t.push(e),Cn()}function kn(e,n=null){if(pn.length){for(bn=n,fn=[...new Set(pn)],pn.length=0,hn=0;hn<fn.length;hn++)fn[hn]();fn=null,hn=0,bn=null,kn(e,n)}}function wn(e){if(gn.length){const e=[...new Set(gn)];if(gn.length=0,_n)return void _n.push(...e);for(_n=e,_n.sort(((e,n)=>En(e)-En(n))),yn=0;yn<_n.length;yn++)_n[yn]();_n=null,yn=0}}const En=e=>null==e.id?1/0:e.id;function An(e){cn=!1,an=!0,kn(e),un.sort(((e,n)=>En(e)-En(n)));try{for(dn=0;dn<un.length;dn++){const e=un[dn];e&&on(e,null,14)}}finally{dn=0,un.length=0,wn(),an=!1,vn=null,(un.length||gn.length)&&An(e)}}function Un(e,n,...t){const r=e.vnode.props||u;let o=t;const s=n.startsWith("update:"),l=s&&n.slice(7);if(l&&l in r){const e=`${"modelValue"===l?"model":l}Modifiers`,{number:n,trim:s}=r[e]||u;s?o=t.map((e=>e.trim())):n&&(o=t.map(B))}__VUE_PROD_DEVTOOLS__;let a=D(R(n)),i=r[a];!i&&s&&(a=D(K(n)),i=r[a]),i&&sn(i,e,6,o);const c=r[a+"Once"];if(c){if(e.emitted){if(e.emitted[a])return}else(e.emitted={})[a]=!0;sn(c,e,6,o)}}function Pn(e,n,t=!1){if(!n.deopt&&void 0!==e.__emits)return e.__emits;const r=e.emits;let o={},s=!1;if(__VUE_OPTIONS_API__&&!O(e)){const r=e=>{s=!0,y(o,Pn(e,n,!0))};!t&&n.mixins.length&&n.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}return r||s?(x(r)?r.forEach((e=>o[e]=null)):y(o,r),e.__emits=o):e.__emits=null}function Tn(e,n){return!(!e||!g(n))&&(n=n.slice(2).replace(/Once$/,""),b(e,n[0].toLowerCase()+n.slice(1))||b(e,K(n))||b(e,n))}let Nn=null;function Vn(e){Nn=e}function Fn(e){const{type:n,vnode:t,proxy:r,withProxy:o,props:s,propsOptions:[l],slots:a,attrs:i,emit:c,render:u,renderCache:d,data:p,setupState:f,ctx:h}=e;let g;Nn=e;try{let e;if(4&t.shapeFlag){const n=o||r;g=Xt(u.call(n,n,d,s,f,p,h)),e=i}else{const t=n;0,g=Xt(t.length>1?t(s,{attrs:i,slots:a,emit:c}):t(s,null)),e=n.props?i:Rn(i)}let y=g;if(!1!==n.inheritAttrs&&e){const n=Object.keys(e),{shapeFlag:t}=y;n.length&&(1&t||6&t)&&(l&&n.some(_)&&(e=In(e,l)),y=Gt(y,e))}t.dirs&&(y.dirs=y.dirs?y.dirs.concat(t.dirs):t.dirs),t.transition&&(y.transition=t.transition),g=y}catch(n){ln(n,e,1),g=Jt(Rt)}return Nn=null,g}function jn(e){let n;for(let t=0;t<e.length;t++){const r=e[t];if(!qt(r))return;if(r.type!==Rt||"v-if"===r.children){if(n)return;n=r}}return n}const Rn=e=>{let n;for(const t in e)("class"===t||"style"===t||g(t))&&((n||(n={}))[t]=e[t]);return n},In=(e,n)=>{const t={};for(const r in e)_(r)&&r.slice(9)in n||(t[r]=e[r]);return t};function Kn(e,n,t){const r=Object.keys(n);if(r.length!==Object.keys(e).length)return!0;for(let o=0;o<r.length;o++){const s=r[o];if(n[s]!==e[s]&&!Tn(t,s))return!0}return!1}function Mn(e){if(O(e)&&(e=e()),x(e)){e=jn(e)}return Xt(e)}let Dn=0;const $n=e=>Dn+=e;function Ln(e,n,t,r=!1){const o={},s={};q(s,Wt,1),qn(e,n,o,s),t?e.props=r?o:We(o,!1,me,Ke):e.type.props?e.props=o:e.props=s,e.attrs=s}function qn(e,n,t,r){const[o,s]=e.propsOptions;if(n)for(const s in n){const l=n[s];if(V(s))continue;let a;o&&b(o,a=R(s))?t[a]=l:Tn(e.emitsOptions,s)||(r[s]=l)}if(s){const n=Ge(t);for(let r=0;r<s.length;r++){const l=s[r];t[l]=Bn(o,n,l,n[l],e)}}}function Bn(e,n,t,r,o){const s=e[t];if(null!=s){const e=b(s,"default");if(e&&void 0===r){const e=s.default;s.type!==Function&&O(e)?(mr(o),r=e(n),mr(null)):r=e}s[0]&&(b(n,t)||e?!s[1]||""!==r&&r!==K(t)||(r=!0):r=!1)}return r}function Wn(e,n,t=!1){if(!n.deopt&&e.__props)return e.__props;const r=e.props,o={},s=[];let l=!1;if(__VUE_OPTIONS_API__&&!O(e)){const r=e=>{l=!0;const[t,r]=Wn(e,n,!0);y(o,t),r&&s.push(...r)};!t&&n.mixins.length&&n.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}if(!r&&!l)return e.__props=d;if(x(r))for(let e=0;e<r.length;e++){const n=R(r[e]);zn(n)&&(o[n]=u)}else if(r)for(const e in r){const n=R(e);if(zn(n)){const t=r[e],l=o[n]=x(t)||O(t)?{type:t}:t;if(l){const e=Gn(Boolean,l.type),t=Gn(String,l.type);l[0]=e>-1,l[1]=t<0||e<t,(e>-1||b(l,"default"))&&s.push(n)}}}return e.__props=[o,s]}function zn(e){return"$"!==e[0]}function Hn(e){const n=e&&e.toString().match(/^\s*function (\w+)/);return n?n[1]:""}function Jn(e,n){return Hn(e)===Hn(n)}function Gn(e,n){if(x(n)){for(let t=0,r=n.length;t<r;t++)if(Jn(n[t],e))return t}else if(O(n))return Jn(n,e)?0:-1;return-1}function Zn(e,n,t=yr,r=!1){if(t){const o=t[e]||(t[e]=[]),s=n.__weh||(n.__weh=(...r)=>{if(t.isUnmounted)return;oe(),mr(t);const o=sn(n,t,e,r);return mr(null),se(),o});return r?o.unshift(s):o.push(s),s}}const Qn=e=>(n,t=yr)=>!vr&&Zn(e,n,t),Xn=Qn("bm"),Yn=Qn("m"),et=Qn("bu"),nt=Qn("u"),tt=Qn("bum"),rt=Qn("um"),ot=Qn("rtg"),st=Qn("rtc"),lt={};function at(e,n,t){return it(e,n,t)}function it(e,n,{immediate:t,deep:r,flush:o,onTrack:s,onTrigger:l}=u,a=yr){let i,c,d=!1;if(Qe(e)?(i=()=>e.value,d=!!e._shallow):ze(e)?(i=()=>e,r=!0):i=x(e)?()=>e.map((e=>Qe(e)?e.value:ze(e)?ut(e):O(e)?on(e,a,2):void 0)):O(e)?n?()=>on(e,a,2):()=>{if(!a||!a.isUnmounted)return c&&c(),on(e,a,3,[f])}:p,n&&r){const e=i;i=()=>ut(e())}const f=e=>{c=y.options.onStop=()=>{on(e,a,4)}};let h=x(e)?[]:lt;const g=()=>{if(y.active)if(n){const e=y();(r||d||$(e,h))&&(c&&c(),sn(n,a,3,[e,h===lt?void 0:h,f]),h=e)}else y()};let _;g.allowRecurse=!!n,_="sync"===o?g:"post"===o?()=>kt(g,a&&a.suspense):()=>{!a||a.isMounted?function(e){On(e,fn,pn,hn)}(g):g()};const y=X(i,{lazy:!0,onTrack:s,onTrigger:l,scheduler:_});return Sr(y,a),n?t?g():h=y():"post"===o?kt(y,a&&a.suspense):y(),()=>{Y(y),a&&m(a.effects,y)}}function ct(e,n,t){const r=this.proxy;return it(k(e)?()=>r[e]:e.bind(r),n.bind(r),t,this)}function ut(e,n=new Set){if(!E(e)||n.has(e))return e;if(n.add(e),Qe(e))ut(e.value,n);else if(x(e))for(let t=0;t<e.length;t++)ut(e[t],n);else if(C(e)||S(e))e.forEach((e=>{ut(e,n)}));else for(const t in e)ut(e[t],n);return e}const dt=e=>e.type.__isKeepAlive;function pt(e,n,t=yr){const r=e.__wdc||(e.__wdc=()=>{let n=t;for(;n;){if(n.isDeactivated)return;n=n.parent}e()});if(Zn(n,r,t),t){let e=t.parent;for(;e&&e.parent;)dt(e.parent.vnode)&&ft(r,n,t,e),e=e.parent}}function ft(e,n,t,r){const o=Zn(n,e,r,!0);rt((()=>{m(r[n],o)}),t)}const ht=e=>"_"===e[0]||"$stable"===e,gt=e=>x(e)?e.map(Xt):[Xt(e)],_t=(e,n,t)=>function(e,n=Nn){if(!n)return e;const t=(...t)=>{Dn||Dt(!0);const r=Nn;Vn(n);const o=e(...t);return Vn(r),Dn||$t(),o};return t._c=!0,t}((e=>gt(n(e))),t),yt=(e,n)=>{const t=e._ctx;for(const r in e){if(ht(r))continue;const o=e[r];if(O(o))n[r]=_t(0,o,t);else if(null!=o){const e=gt(o);n[r]=()=>e}}},mt=(e,n)=>{const t=gt(n);e.slots.default=()=>t};function vt(e,n){if(null===Nn)return e;const t=Nn.proxy,r=e.dirs||(e.dirs=[]);for(let e=0;e<n.length;e++){let[o,s,l,a=u]=n[e];O(o)&&(o={mounted:o,updated:o}),r.push({dir:o,instance:t,value:s,oldValue:void 0,arg:l,modifiers:a})}return e}function bt(e,n,t,r){const o=e.dirs,s=n&&n.dirs;for(let l=0;l<o.length;l++){const a=o[l];s&&(a.oldValue=s[l].value);const i=a.dir[r];i&&sn(i,t,8,[e.el,a,e,n])}}function xt(){return{app:null,config:{isNativeTag:f,performance:!1,globalProperties:{},optionMergeStrategies:{},isCustomElement:f,errorHandler:void 0,warnHandler:void 0},mixins:[],components:{},directives:{},provides:Object.create(null)}}let St=0;function Ct(e,n){return function(t,r=null){null==r||E(r)||(r=null);const o=xt(),s=new Set;let l=!1;const a=o.app={_uid:St++,_component:t,_props:r,_container:null,_context:o,version:kr,get config(){return o.config},set config(e){},use:(e,...n)=>(s.has(e)||(e&&O(e.install)?(s.add(e),e.install(a,...n)):O(e)&&(s.add(e),e(a,...n))),a),mixin:e=>(__VUE_OPTIONS_API__&&(o.mixins.includes(e)||(o.mixins.push(e),(e.props||e.emits)&&(o.deopt=!0))),a),component:(e,n)=>n?(o.components[e]=n,a):o.components[e],directive:(e,n)=>n?(o.directives[e]=n,a):o.directives[e],mount(s,i){if(!l){const c=Jt(t,r);return c.appContext=o,i&&n?n(c,s):e(c,s),l=!0,a._container=s,s.__vue_app__=a,__VUE_PROD_DEVTOOLS__,c.component.proxy}},unmount(){l&&(e(null,a._container),__VUE_PROD_DEVTOOLS__)},provide:(e,n)=>(o.provides[e]=n,a)};return a}}const Ot={scheduler:Sn,allowRecurse:!0},kt=function(e,n){n&&n.pendingBranch?x(e)?n.effects.push(...e):n.effects.push(e):On(e,_n,gn,yn)},wt=(e,n,t,r)=>{if(x(e))return void e.forEach(((e,o)=>wt(e,n&&(x(n)?n[o]:n),t,r)));let o;o=!r||r.type.__asyncLoader?null:4&r.shapeFlag?r.component.exposed||r.component.proxy:r.el;const{i:s,r:l}=e,a=n&&n.r,i=s.refs===u?s.refs={}:s.refs,c=s.setupState;if(null!=a&&a!==l&&(k(a)?(i[a]=null,b(c,a)&&(c[a]=null)):Qe(a)&&(a.value=null)),k(l)){const e=()=>{i[l]=o,b(c,l)&&(c[l]=o)};o?(e.id=-1,kt(e,t)):e()}else if(Qe(l)){const e=()=>{l.value=o};o?(e.id=-1,kt(e,t)):e()}else O(l)&&on(l,s,12,[o,i])};function Et(e){return function(e,n){"boolean"!=typeof __VUE_OPTIONS_API__&&(z().__VUE_OPTIONS_API__=!0),"boolean"!=typeof __VUE_PROD_DEVTOOLS__&&(z().__VUE_PROD_DEVTOOLS__=!1);const{insert:t,remove:r,patchProp:o,forcePatchProp:s,createElement:l,createText:a,createComment:i,setText:c,setElementText:f,parentNode:h,nextSibling:g,setScopeId:_=p,cloneNode:m,insertStaticContent:v}=e,x=(e,n,t,r=null,o=null,s=null,l=!1,a=!1)=>{e&&!Bt(e,n)&&(r=le(e),Q(e,o,s,!0),e=null),-2===n.patchFlag&&(a=!1,n.dynamicChildren=null);const{type:i,ref:c,shapeFlag:u}=n;switch(i){case jt:S(e,n,t,r);break;case Rt:C(e,n,t,r);break;case It:null==e&&O(n,t,r,l);break;case Ft:I(e,n,t,r,o,s,l,a);break;default:1&u?E(e,n,t,r,o,s,l,a):6&u?M(e,n,t,r,o,s,l,a):(64&u||128&u)&&i.process(e,n,t,r,o,s,l,a,ce)}null!=c&&o&&wt(c,e&&e.ref,s,n)},S=(e,n,r,o)=>{if(null==e)t(n.el=a(n.children),r,o);else{const t=n.el=e.el;n.children!==e.children&&c(t,n.children)}},C=(e,n,r,o)=>{null==e?t(n.el=i(n.children||""),r,o):n.el=e.el},O=(e,n,t,r)=>{[e.el,e.anchor]=v(e.children,n,t,r)},k=({el:e,anchor:n},r,o)=>{let s;for(;e&&e!==n;)s=g(e),t(e,r,o),e=s;t(n,r,o)},w=({el:e,anchor:n})=>{let t;for(;e&&e!==n;)t=g(e),r(e),e=t;r(n)},E=(e,n,t,r,o,s,l,a)=>{l=l||"svg"===n.type,null==e?U(n,t,r,o,s,l,a):N(e,n,o,s,l,a)},U=(e,n,r,s,a,i,c)=>{let u,d;const{type:p,props:h,shapeFlag:g,transition:_,scopeId:y,patchFlag:v,dirs:b}=e;if(e.el&&void 0!==m&&-1===v)u=e.el=m(e.el);else{if(u=e.el=l(e.type,i,h&&h.is),8&g?f(u,e.children):16&g&&T(e.children,u,null,s,a,i&&"foreignObject"!==p,c||!!e.dynamicChildren),b&&bt(e,null,s,"created"),h){for(const n in h)V(n)||o(u,n,null,h[n],i,e.children,s,a,re);(d=h.onVnodeBeforeMount)&&At(d,s,e)}P(u,y,e,s)}__VUE_PROD_DEVTOOLS__&&(Object.defineProperty(u,"__vnode",{value:e,enumerable:!1}),Object.defineProperty(u,"__vueParentComponent",{value:s,enumerable:!1})),b&&bt(e,null,s,"beforeMount");const x=(!a||a&&!a.pendingBranch)&&_&&!_.persisted;x&&_.beforeEnter(u),t(u,n,r),((d=h&&h.onVnodeMounted)||x||b)&&kt((()=>{d&&At(d,s,e),x&&_.enter(u),b&&bt(e,null,s,"mounted")}),a)},P=(e,n,t,r)=>{if(n&&_(e,n),r){const o=r.type.__scopeId;o&&o!==n&&_(e,o+"-s"),t===r.subTree&&P(e,r.vnode.scopeId,r.vnode,r.parent)}},T=(e,n,t,r,o,s,l,a=0)=>{for(let i=a;i<e.length;i++){const a=e[i]=l?Yt(e[i]):Xt(e[i]);x(null,a,n,t,r,o,s,l)}},N=(e,n,t,r,l,a)=>{const i=n.el=e.el;let{patchFlag:c,dynamicChildren:d,dirs:p}=n;c|=16&e.patchFlag;const h=e.props||u,g=n.props||u;let _;if((_=g.onVnodeBeforeUpdate)&&At(_,t,n,e),p&&bt(n,e,t,"beforeUpdate"),c>0){if(16&c)j(i,n,h,g,t,r,l);else if(2&c&&h.class!==g.class&&o(i,"class",null,g.class,l),4&c&&o(i,"style",h.style,g.style,l),8&c){const a=n.dynamicProps;for(let n=0;n<a.length;n++){const c=a[n],u=h[c],d=g[c];(d!==u||s&&s(i,c))&&o(i,c,u,d,l,e.children,t,r,re)}}1&c&&e.children!==n.children&&f(i,n.children)}else a||null!=d||j(i,n,h,g,t,r,l);const y=l&&"foreignObject"!==n.type;d?F(e.dynamicChildren,d,i,t,r,y):a||H(e,n,i,null,t,r,y),((_=g.onVnodeUpdated)||p)&&kt((()=>{_&&At(_,t,n,e),p&&bt(n,e,t,"updated")}),r)},F=(e,n,t,r,o,s)=>{for(let l=0;l<n.length;l++){const a=e[l],i=n[l],c=a.type===Ft||!Bt(a,i)||6&a.shapeFlag||64&a.shapeFlag?h(a.el):t;x(a,i,c,null,r,o,s,!0)}},j=(e,n,t,r,l,a,i)=>{if(t!==r){for(const c in r){if(V(c))continue;const u=r[c],d=t[c];(u!==d||s&&s(e,c))&&o(e,c,d,u,i,n.children,l,a,re)}if(t!==u)for(const s in t)V(s)||s in r||o(e,s,t[s],null,i,n.children,l,a,re)}},I=(e,n,r,o,s,l,i,c)=>{const u=n.el=e?e.el:a(""),d=n.anchor=e?e.anchor:a("");let{patchFlag:p,dynamicChildren:f}=n;p>0&&(c=!0),null==e?(t(u,r,o),t(d,r,o),T(n.children,r,d,s,l,i,c)):p>0&&64&p&&f?(F(e.dynamicChildren,f,r,s,l,i),(null!=n.key||s&&n===s.subTree)&&Ut(e,n,!0)):H(e,n,r,d,s,l,i,c)},M=(e,n,t,r,o,s,l,a)=>{null==e?512&n.shapeFlag?o.ctx.activate(n,t,r,l,a):D(n,t,r,o,s,l,a):$(e,n,a)},D=(e,n,t,r,o,s,l)=>{const a=e.component=function(e,n,t){const r=e.type,o=(n?n.appContext:e.appContext)||gr,s={uid:_r++,vnode:e,type:r,parent:n,appContext:o,root:null,next:null,subTree:null,update:null,render:null,proxy:null,exposed:null,withProxy:null,effects:null,provides:n?n.provides:Object.create(o.provides),accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Wn(r,o),emitsOptions:Pn(r,o),emit:null,emitted:null,ctx:u,data:u,props:u,attrs:u,slots:u,refs:u,setupState:u,setupContext:null,suspense:t,suspenseId:t?t.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null};s.ctx={_:s},s.root=n?n.root:s,s.emit=Un.bind(null,s),__VUE_PROD_DEVTOOLS__;return s}(e,r,o);if(dt(e)&&(a.ctx.renderer=ce),function(e,n=!1){vr=n;const{props:t,children:r,shapeFlag:o}=e.vnode,s=4&o;Ln(e,t,s,n),((e,n)=>{if(32&e.vnode.shapeFlag){const t=n._;t?(e.slots=n,q(n,"_",t)):yt(n,e.slots={})}else e.slots={},n&&mt(e,n);q(e.slots,Wt,1)})(e,r);const l=s?function(e,n){const t=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,fr);const{setup:r}=t;if(r){const t=e.setupContext=r.length>1?function(e){const n=n=>{e.exposed=nn(n)};return{attrs:e.attrs,slots:e.slots,emit:e.emit,expose:n}}(e):null;yr=e,oe();const o=on(r,e,0,[e.props,t]);if(se(),yr=null,A(o)){if(n)return o.then((n=>{br(e,n)}));e.asyncDep=o}else br(e,o)}else xr(e)}(e,n):void 0;vr=!1}(a),a.asyncDep){if(o&&o.registerDep(a,B),!e.el){const e=a.subTree=Jt(Rt);C(null,e,n,t)}}else B(a,e,n,t,o,s,l)},$=(e,n,t)=>{const r=n.component=e.component;if(function(e,n,t){const{props:r,children:o,component:s}=e,{props:l,children:a,patchFlag:i}=n,c=s.emitsOptions;if(n.dirs||n.transition)return!0;if(!(t&&i>=0))return!(!o&&!a||a&&a.$stable)||r!==l&&(r?!l||Kn(r,l,c):!!l);if(1024&i)return!0;if(16&i)return r?Kn(r,l,c):!!l;if(8&i){const e=n.dynamicProps;for(let n=0;n<e.length;n++){const t=e[n];if(l[t]!==r[t]&&!Tn(c,t))return!0}}return!1}(e,n,t)){if(r.asyncDep&&!r.asyncResolved)return void W(r,n,t);r.next=n,function(e){const n=un.indexOf(e);n>-1&&un.splice(n,1)}(r.update),r.update()}else n.component=e.component,n.el=e.el,r.vnode=n},B=(e,n,t,r,o,s,l)=>{e.update=X((function(){if(e.isMounted){let n,{next:t,bu:r,u:a,parent:i,vnode:c}=e,u=t;t?(t.el=c.el,W(e,t,l)):t=c,r&&L(r),(n=t.props&&t.props.onVnodeBeforeUpdate)&&At(n,i,t,c);const d=Fn(e),p=e.subTree;e.subTree=d,x(p,d,h(p.el),le(p),e,o,s),t.el=d.el,null===u&&function({vnode:e,parent:n},t){for(;n&&n.subTree===e;)(e=n.vnode).el=t,n=n.parent}(e,d.el),a&&kt(a,o),(n=t.props&&t.props.onVnodeUpdated)&&kt((()=>{At(n,i,t,c)}),o),__VUE_PROD_DEVTOOLS__}else{let l;const{el:a,props:i}=n,{bm:c,m:u,parent:d}=e;c&&L(c),(l=i&&i.onVnodeBeforeMount)&&At(l,d,n);const p=e.subTree=Fn(e);a&&de?de(n.el,p,e,o):(x(null,p,t,r,e,o,s),n.el=p.el),u&&kt(u,o),(l=i&&i.onVnodeMounted)&&kt((()=>{At(l,d,n)}),o);const{a:f}=e;f&&256&n.shapeFlag&&kt(f,o),e.isMounted=!0}}),Ot)},W=(e,n,t)=>{n.component=e;const r=e.vnode.props;e.vnode=n,e.next=null,function(e,n,t,r){const{props:o,attrs:s,vnode:{patchFlag:l}}=e,a=Ge(o),[i]=e.propsOptions;if(!(r||l>0)||16&l){let r;qn(e,n,o,s);for(const s in a)n&&(b(n,s)||(r=K(s))!==s&&b(n,r))||(i?!t||void 0===t[s]&&void 0===t[r]||(o[s]=Bn(i,n||u,s,void 0,e)):delete o[s]);if(s!==a)for(const e in s)n&&b(n,e)||delete s[e]}else if(8&l){const t=e.vnode.dynamicProps;for(let r=0;r<t.length;r++){const l=t[r],c=n[l];if(i)if(b(s,l))s[l]=c;else{const n=R(l);o[n]=Bn(i,a,n,c,e)}else s[l]=c}}ae(e,"set","$attrs")}(e,n.props,r,t),((e,n)=>{const{vnode:t,slots:r}=e;let o=!0,s=u;if(32&t.shapeFlag){const e=n._;e?1===e?o=!1:y(r,n):(o=!n.$stable,yt(n,r)),s=n}else n&&(mt(e,n),s={default:1});if(o)for(const e in r)ht(e)||e in s||delete r[e]})(e,n.children),kn(void 0,e.update)},H=(e,n,t,r,o,s,l,a=!1)=>{const i=e&&e.children,c=e?e.shapeFlag:0,u=n.children,{patchFlag:d,shapeFlag:p}=n;if(d>0){if(128&d)return void G(i,u,t,r,o,s,l,a);if(256&d)return void J(i,u,t,r,o,s,l,a)}8&p?(16&c&&re(i,o,s),u!==i&&f(t,u)):16&c?16&p?G(i,u,t,r,o,s,l,a):re(i,o,s,!0):(8&c&&f(t,""),16&p&&T(u,t,r,o,s,l,a))},J=(e,n,t,r,o,s,l,a)=>{n=n||d;const i=(e=e||d).length,c=n.length,u=Math.min(i,c);let p;for(p=0;p<u;p++){const r=n[p]=a?Yt(n[p]):Xt(n[p]);x(e[p],r,t,null,o,s,l,a)}i>c?re(e,o,s,!0,!1,u):T(n,t,r,o,s,l,a,u)},G=(e,n,t,r,o,s,l,a)=>{let i=0;const c=n.length;let u=e.length-1,p=c-1;for(;i<=u&&i<=p;){const r=e[i],c=n[i]=a?Yt(n[i]):Xt(n[i]);if(!Bt(r,c))break;x(r,c,t,null,o,s,l,a),i++}for(;i<=u&&i<=p;){const r=e[u],i=n[p]=a?Yt(n[p]):Xt(n[p]);if(!Bt(r,i))break;x(r,i,t,null,o,s,l,a),u--,p--}if(i>u){if(i<=p){const e=p+1,u=e<c?n[e].el:r;for(;i<=p;)x(null,n[i]=a?Yt(n[i]):Xt(n[i]),t,u,o,s,l),i++}}else if(i>p)for(;i<=u;)Q(e[i],o,s,!0),i++;else{const f=i,h=i,g=new Map;for(i=h;i<=p;i++){const e=n[i]=a?Yt(n[i]):Xt(n[i]);null!=e.key&&g.set(e.key,i)}let _,y=0;const m=p-h+1;let v=!1,b=0;const S=new Array(m);for(i=0;i<m;i++)S[i]=0;for(i=f;i<=u;i++){const r=e[i];if(y>=m){Q(r,o,s,!0);continue}let c;if(null!=r.key)c=g.get(r.key);else for(_=h;_<=p;_++)if(0===S[_-h]&&Bt(r,n[_])){c=_;break}void 0===c?Q(r,o,s,!0):(S[c-h]=i+1,c>=b?b=c:v=!0,x(r,n[c],t,null,o,s,l,a),y++)}const C=v?function(e){const n=e.slice(),t=[0];let r,o,s,l,a;const i=e.length;for(r=0;r<i;r++){const i=e[r];if(0!==i){if(o=t[t.length-1],e[o]<i){n[r]=o,t.push(r);continue}for(s=0,l=t.length-1;s<l;)a=(s+l)/2|0,e[t[a]]<i?s=a+1:l=a;i<e[t[s]]&&(s>0&&(n[r]=t[s-1]),t[s]=r)}}s=t.length,l=t[s-1];for(;s-- >0;)t[s]=l,l=n[l];return t}(S):d;for(_=C.length-1,i=m-1;i>=0;i--){const e=h+i,a=n[e],u=e+1<c?n[e+1].el:r;0===S[i]?x(null,a,t,u,o,s,l):v&&(_<0||i!==C[_]?Z(a,t,u,2):_--)}}},Z=(e,n,r,o,s=null)=>{const{el:l,type:a,transition:i,children:c,shapeFlag:u}=e;if(6&u)return void Z(e.component.subTree,n,r,o);if(128&u)return void e.suspense.move(n,r,o);if(64&u)return void a.move(e,n,r,ce);if(a===Ft){t(l,n,r);for(let e=0;e<c.length;e++)Z(c[e],n,r,o);return void t(e.anchor,n,r)}if(a===It)return void k(e,n,r);if(2!==o&&1&u&&i)if(0===o)i.beforeEnter(l),t(l,n,r),kt((()=>i.enter(l)),s);else{const{leave:e,delayLeave:o,afterLeave:s}=i,a=()=>t(l,n,r),c=()=>{e(l,(()=>{a(),s&&s()}))};o?o(l,a,c):c()}else t(l,n,r)},Q=(e,n,t,r=!1,o=!1)=>{const{type:s,props:l,ref:a,children:i,dynamicChildren:c,shapeFlag:u,patchFlag:d,dirs:p}=e;if(null!=a&&wt(a,null,t,null),256&u)return void n.ctx.deactivate(e);const f=1&u&&p;let h;if((h=l&&l.onVnodeBeforeUnmount)&&At(h,n,e),6&u)te(e.component,t,r);else{if(128&u)return void e.suspense.unmount(t,r);f&&bt(e,null,n,"beforeUnmount"),c&&(s!==Ft||d>0&&64&d)?re(c,n,t,!1,!0):(s===Ft&&(128&d||256&d)||!o&&16&u)&&re(i,n,t),64&u&&(r||!Pt(e.props))&&e.type.remove(e,ce),r&&ee(e)}((h=l&&l.onVnodeUnmounted)||f)&&kt((()=>{h&&At(h,n,e),f&&bt(e,null,n,"unmounted")}),t)},ee=e=>{const{type:n,el:t,anchor:o,transition:s}=e;if(n===Ft)return void ne(t,o);if(n===It)return void w(e);const l=()=>{r(t),s&&!s.persisted&&s.afterLeave&&s.afterLeave()};if(1&e.shapeFlag&&s&&!s.persisted){const{leave:n,delayLeave:r}=s,o=()=>n(t,l);r?r(e.el,l,o):o()}else l()},ne=(e,n)=>{let t;for(;e!==n;)t=g(e),r(e),e=t;r(n)},te=(e,n,t)=>{const{bum:r,effects:o,update:s,subTree:l,um:a}=e;if(r&&L(r),o)for(let e=0;e<o.length;e++)Y(o[e]);s&&(Y(s),Q(l,e,n,t)),a&&kt(a,n),kt((()=>{e.isUnmounted=!0}),n),n&&n.pendingBranch&&!n.isUnmounted&&e.asyncDep&&!e.asyncResolved&&e.suspenseId===n.pendingId&&(n.deps--,0===n.deps&&n.resolve()),__VUE_PROD_DEVTOOLS__},re=(e,n,t,r=!1,o=!1,s=0)=>{for(let l=s;l<e.length;l++)Q(e[l],n,t,r,o)},le=e=>6&e.shapeFlag?le(e.component.subTree):128&e.shapeFlag?e.suspense.next():g(e.anchor||e.el),ie=(e,n)=>{null==e?n._vnode&&Q(n._vnode,null,null,!0):x(n._vnode||null,e,n),wn(),n._vnode=e},ce={p:x,um:Q,m:Z,r:ee,mt:D,mc:T,pc:H,pbc:F,n:le,o:e};let ue,de;n&&([ue,de]=n(ce));return{render:ie,hydrate:ue,createApp:Ct(ie,ue)}}(e)}function At(e,n,t,r=null){sn(e,n,7,[t,r])}function Ut(e,n,t=!1){const r=e.children,o=n.children;if(x(r)&&x(o))for(let e=0;e<r.length;e++){const n=r[e];let s=o[e];1&s.shapeFlag&&!s.dynamicChildren&&((s.patchFlag<=0||32===s.patchFlag)&&(s=o[e]=Yt(o[e]),s.el=n.el),t||Ut(n,s))}}const Pt=e=>e&&(e.disabled||""===e.disabled);function Tt(e){return function(e,n,t=!0){const r=Nn||yr;if(r){const t=r.type;if("components"===e){if("_self"===n)return t;const e=t.displayName||t.name;if(e&&(e===n||e===R(n)||e===M(R(n))))return t}return Vt(r[e]||t[e],n)||Vt(r.appContext[e],n)}}("components",e)||e}const Nt=Symbol();function Vt(e,n){return e&&(e[n]||e[R(n)]||e[M(R(n))])}const Ft=Symbol(void 0),jt=Symbol(void 0),Rt=Symbol(void 0),It=Symbol(void 0),Kt=[];let Mt=null;function Dt(e=!1){Kt.push(Mt=e?null:[])}function $t(){Kt.pop(),Mt=Kt[Kt.length-1]||null}function Lt(e,n,t,r,o){const s=Jt(e,n,t,r,o,!0);return s.dynamicChildren=Mt||d,$t(),Mt&&Mt.push(s),s}function qt(e){return!!e&&!0===e.__v_isVNode}function Bt(e,n){return e.type===n.type&&e.key===n.key}const Wt="__vInternal",zt=({key:e})=>null!=e?e:null,Ht=({ref:e})=>null!=e?k(e)||Qe(e)||O(e)?{i:Nn,r:e}:e:null,Jt=function(e,n=null,t=null,o=0,s=null,l=!1){e&&e!==Nt||(e=Rt);if(qt(e)){const r=Gt(e,n,!0);return t&&er(r,t),r}i=e,O(i)&&"__vccOpts"in i&&(e=e.__vccOpts);var i;if(n){(Je(n)||Wt in n)&&(n=y({},n));let{class:e,style:t}=n;e&&!k(e)&&(n.class=a(e)),E(t)&&(Je(t)&&!x(t)&&(t=y({},t)),n.style=r(t))}const c=k(e)?1:(e=>e.__isSuspense)(e)?128:(e=>e.__isTeleport)(e)?64:E(e)?4:O(e)?2:0,u={__v_isVNode:!0,__v_skip:!0,type:e,props:n,key:n&&zt(n),ref:n&&Ht(n),scopeId:null,children:null,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetAnchor:null,staticCount:0,shapeFlag:c,patchFlag:o,dynamicProps:s,dynamicChildren:null,appContext:null};if(er(u,t),128&c){const{content:e,fallback:n}=function(e){const{shapeFlag:n,children:t}=e;let r,o;return 32&n?(r=Mn(t.default),o=Mn(t.fallback)):(r=Mn(t),o=Xt(null)),{content:r,fallback:o}}(u);u.ssContent=e,u.ssFallback=n}!l&&Mt&&(o>0||6&c)&&32!==o&&Mt.push(u);return u};function Gt(e,n,t=!1){const{props:o,ref:s,patchFlag:l}=e,i=n?function(...e){const n=y({},e[0]);for(let t=1;t<e.length;t++){const o=e[t];for(const e in o)if("class"===e)n.class!==o.class&&(n.class=a([n.class,o.class]));else if("style"===e)n.style=r([n.style,o.style]);else if(g(e)){const t=n[e],r=o[e];t!==r&&(n[e]=t?[].concat(t,o[e]):r)}else""!==e&&(n[e]=o[e])}return n}(o||{},n):o;return{__v_isVNode:!0,__v_skip:!0,type:e.type,props:i,key:i&&zt(i),ref:n&&n.ref?t&&s?x(s)?s.concat(Ht(n)):[s,Ht(n)]:Ht(n):s,scopeId:e.scopeId,children:e.children,target:e.target,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:n&&e.type!==Ft?-1===l?16:16|l:l,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:e.transition,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Gt(e.ssContent),ssFallback:e.ssFallback&&Gt(e.ssFallback),el:e.el,anchor:e.anchor}}function Zt(e=" ",n=0){return Jt(jt,null,e,n)}function Qt(e="",n=!1){return n?(Dt(),Lt(Rt,null,e)):Jt(Rt,null,e)}function Xt(e){return null==e||"boolean"==typeof e?Jt(Rt):x(e)?Jt(Ft,null,e):"object"==typeof e?null===e.el?e:Gt(e):Jt(jt,null,String(e))}function Yt(e){return null===e.el?e:Gt(e)}function er(e,n){let t=0;const{shapeFlag:r}=e;if(null==n)n=null;else if(x(n))t=16;else if("object"==typeof n){if(1&r||64&r){const t=n.default;return void(t&&(t._c&&$n(1),er(e,t()),t._c&&$n(-1)))}{t=32;const r=n._;r||Wt in n?3===r&&Nn&&(1024&Nn.vnode.patchFlag?(n._=2,e.patchFlag|=1024):n._=1):n._ctx=Nn}}else O(n)?(n={default:n,_ctx:Nn},t=32):(n=String(n),64&r?(t=16,n=[Zt(n)]):t=8);e.children=n,e.shapeFlag|=t}function nr(e,n,t=!1){const r=yr||Nn;if(r){const o=null==r.parent?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides;if(o&&e in o)return o[e];if(arguments.length>1)return t&&O(n)?n():n}}let tr=!1;function rr(e,n,t=[],r=[],o=[],s=!1){const{mixins:l,extends:a,data:i,computed:c,methods:d,watch:f,provide:h,inject:g,components:_,directives:m,beforeMount:v,mounted:b,beforeUpdate:S,updated:C,activated:k,deactivated:w,beforeDestroy:A,beforeUnmount:U,destroyed:P,unmounted:T,render:N,renderTracked:V,renderTriggered:F,errorCaptured:j,expose:R}=n,I=e.proxy,K=e.ctx,M=e.appContext.mixins;if(s&&N&&e.render===p&&(e.render=N),s||(tr=!0,or("beforeCreate","bc",n,e,M),tr=!1,ar(e,M,t,r,o)),a&&rr(e,a,t,r,o,!0),l&&ar(e,l,t,r,o),g)if(x(g))for(let e=0;e<g.length;e++){const n=g[e];K[n]=nr(n)}else for(const e in g){const n=g[e];E(n)?K[e]=nr(n.from||e,n.default,!0):K[e]=nr(n)}if(d)for(const e in d){const n=d[e];O(n)&&(K[e]=n.bind(I))}if(s?i&&t.push(i):(t.length&&t.forEach((n=>ir(e,n,I))),i&&ir(e,i,I)),c)for(const e in c){const n=c[e],t=Cr({get:O(n)?n.bind(I,I):O(n.get)?n.get.bind(I,I):p,set:!O(n)&&O(n.set)?n.set.bind(I):p});Object.defineProperty(K,e,{enumerable:!0,configurable:!0,get:()=>t.value,set:e=>t.value=e})}var D;if(f&&r.push(f),!s&&r.length&&r.forEach((e=>{for(const n in e)cr(e[n],K,I,n)})),h&&o.push(h),!s&&o.length&&o.forEach((e=>{const n=O(e)?e.call(I):e;Reflect.ownKeys(n).forEach((e=>{!function(e,n){if(yr){let t=yr.provides;const r=yr.parent&&yr.parent.provides;r===t&&(t=yr.provides=Object.create(r)),t[e]=n}}(e,n[e])}))})),s&&(_&&y(e.components||(e.components=y({},e.type.components)),_),m&&y(e.directives||(e.directives=y({},e.type.directives)),m)),s||or("created","c",n,e,M),v&&Xn(v.bind(I)),b&&Yn(b.bind(I)),S&&et(S.bind(I)),C&&nt(C.bind(I)),k&&pt(k.bind(I),"a",D),w&&function(e,n){pt(e,"da",n)}(w.bind(I)),j&&((e,n=yr)=>{Zn("ec",e,n)})(j.bind(I)),V&&st(V.bind(I)),F&&ot(F.bind(I)),U&&tt(U.bind(I)),T&&rt(T.bind(I)),x(R)&&!s)if(R.length){const n=e.exposed||(e.exposed=nn({}));R.forEach((e=>{n[e]=function(e,n){return Qe(e[n])?e[n]:new tn(e,n)}(I,e)}))}else e.exposed||(e.exposed=u)}function or(e,n,t,r,o){lr(e,n,o,r);const{extends:s,mixins:l}=t;s&&sr(e,n,s,r),l&&lr(e,n,l,r);const a=t[e];a&&sn(a.bind(r.proxy),r,n)}function sr(e,n,t,r){t.extends&&sr(e,n,t.extends,r);const o=t[e];o&&sn(o.bind(r.proxy),r,n)}function lr(e,n,t,r){for(let o=0;o<t.length;o++){const s=t[o].mixins;s&&lr(e,n,s,r);const l=t[o][e];l&&sn(l.bind(r.proxy),r,n)}}function ar(e,n,t,r,o){for(let s=0;s<n.length;s++)rr(e,n[s],t,r,o,!0)}function ir(e,n,t){const r=n.call(t,t);E(r)&&(e.data===u?e.data=qe(r):y(e.data,r))}function cr(e,n,t,r){const o=r.includes(".")?function(e,n){const t=n.split(".");return()=>{let n=e;for(let e=0;e<t.length&&n;e++)n=n[t[e]];return n}}(t,r):()=>t[r];if(k(e)){const t=n[e];O(t)&&at(o,t)}else if(O(e))at(o,e.bind(t));else if(E(e))if(x(e))e.forEach((e=>cr(e,n,t,r)));else{const r=O(e.handler)?e.handler.bind(t):n[e.handler];O(r)&&at(o,r,e)}}function ur(e,n,t){const r=t.appContext.config.optionMergeStrategies,{mixins:o,extends:s}=n;s&&ur(e,s,t),o&&o.forEach((n=>ur(e,n,t)));for(const o in n)r&&b(r,o)?e[o]=r[o](e[o],n[o],t.proxy,o):e[o]=n[o]}const dr=e=>e&&(e.proxy?e.proxy:dr(e.parent)),pr=y(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>dr(e.parent),$root:e=>e.root&&e.root.proxy,$emit:e=>e.emit,$options:e=>__VUE_OPTIONS_API__?function(e){const n=e.type,{__merged:t,mixins:r,extends:o}=n;if(t)return t;const s=e.appContext.mixins;if(!s.length&&!r&&!o)return n;const l={};return s.forEach((n=>ur(l,n,e))),ur(l,n,e),n.__merged=l}(e):e.type,$forceUpdate:e=>()=>Sn(e.update),$nextTick:e=>xn.bind(e.proxy),$watch:e=>__VUE_OPTIONS_API__?ct.bind(e):p}),fr={get({_:e},n){const{ctx:t,setupState:r,data:o,props:s,accessCache:l,type:a,appContext:i}=e;if("__v_skip"===n)return!0;let c;if("$"!==n[0]){const a=l[n];if(void 0!==a)switch(a){case 0:return r[n];case 1:return o[n];case 3:return t[n];case 2:return s[n]}else{if(r!==u&&b(r,n))return l[n]=0,r[n];if(o!==u&&b(o,n))return l[n]=1,o[n];if((c=e.propsOptions[0])&&b(c,n))return l[n]=2,s[n];if(t!==u&&b(t,n))return l[n]=3,t[n];__VUE_OPTIONS_API__&&tr||(l[n]=4)}}const d=pr[n];let p,f;return d?("$attrs"===n&&le(e,0,n),d(e)):(p=a.__cssModules)&&(p=p[n])?p:t!==u&&b(t,n)?(l[n]=3,t[n]):(f=i.config.globalProperties,b(f,n)?f[n]:void 0)},set({_:e},n,t){const{data:r,setupState:o,ctx:s}=e;if(o!==u&&b(o,n))o[n]=t;else if(r!==u&&b(r,n))r[n]=t;else if(n in e.props)return!1;return("$"!==n[0]||!(n.slice(1)in e))&&(s[n]=t,!0)},has({_:{data:e,setupState:n,accessCache:t,ctx:r,appContext:o,propsOptions:s}},l){let a;return void 0!==t[l]||e!==u&&b(e,l)||n!==u&&b(n,l)||(a=s[0])&&b(a,l)||b(r,l)||b(pr,l)||b(o.config.globalProperties,l)}},hr=y({},fr,{get(e,n){if(n!==Symbol.unscopables)return fr.get(e,n,e)},has:(e,t)=>"_"!==t[0]&&!n(t)}),gr=xt();let _r=0;let yr=null;const mr=e=>{yr=e};let vr=!1;function br(e,n,t){O(n)?e.render=n:E(n)&&(__VUE_PROD_DEVTOOLS__&&(e.devtoolsRawSetupState=n),e.setupState=nn(n)),xr(e)}function xr(e,n){const t=e.type;e.render||(e.render=t.render||p,e.render._rc&&(e.withProxy=new Proxy(e.ctx,hr))),__VUE_OPTIONS_API__&&(yr=e,oe(),rr(e,t),se(),yr=null)}function Sr(e,n=yr){n&&(n.effects||(n.effects=[])).push(e)}function Cr(e){const n=function(e){let n,t;return O(e)?(n=e,t=p):(n=e.get,t=e.set),new rn(n,t,O(e)||!e.set)}(e);return Sr(n.effect),n}function Or(e,n){let t;if(x(e)||k(e)){t=new Array(e.length);for(let r=0,o=e.length;r<o;r++)t[r]=n(e[r],r)}else if("number"==typeof e){t=new Array(e);for(let r=0;r<e;r++)t[r]=n(r+1,r)}else if(E(e))if(e[Symbol.iterator])t=Array.from(e,n);else{const r=Object.keys(e);t=new Array(r.length);for(let o=0,s=r.length;o<s;o++){const s=r[o];t[o]=n(e[s],s,o)}}else t=[];return t}const kr="3.0.4",wr="http://www.w3.org/2000/svg",Er="undefined"!=typeof document?document:null;let Ar,Ur;const Pr={insert:(e,n,t)=>{n.insertBefore(e,t||null)},remove:e=>{const n=e.parentNode;n&&n.removeChild(e)},createElement:(e,n,t)=>n?Er.createElementNS(wr,e):Er.createElement(e,t?{is:t}:void 0),createText:e=>Er.createTextNode(e),createComment:e=>Er.createComment(e),setText:(e,n)=>{e.nodeValue=n},setElementText:(e,n)=>{e.textContent=n},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Er.querySelector(e),setScopeId(e,n){e.setAttribute(n,"")},cloneNode:e=>e.cloneNode(!0),insertStaticContent(e,n,t,r){const o=r?Ur||(Ur=Er.createElementNS(wr,"svg")):Ar||(Ar=Er.createElement("div"));o.innerHTML=e;const s=o.firstChild;let l=s,a=l;for(;l;)a=l,Pr.insert(l,n,t),l=o.firstChild;return[s,a]}};const Tr=/\s*!important$/;function Nr(e,n,t){if(x(t))t.forEach((t=>Nr(e,n,t)));else if(n.startsWith("--"))e.setProperty(n,t);else{const r=function(e,n){const t=Fr[n];if(t)return t;let r=R(n);if("filter"!==r&&r in e)return Fr[n]=r;r=M(r);for(let t=0;t<Vr.length;t++){const o=Vr[t]+r;if(o in e)return Fr[n]=o}return n}(e,n);Tr.test(t)?e.setProperty(K(r),t.replace(Tr,""),"important"):e[r]=t}}const Vr=["Webkit","Moz","ms"],Fr={};const jr="http://www.w3.org/1999/xlink";let Rr=Date.now;"undefined"!=typeof document&&Rr()>document.createEvent("Event").timeStamp&&(Rr=()=>performance.now());let Ir=0;const Kr=Promise.resolve(),Mr=()=>{Ir=0};function Dr(e,n,t,r,o=null){const s=e._vei||(e._vei={}),l=s[n];if(r&&l)l.value=r;else{const[t,a]=function(e){let n;if($r.test(e)){let t;for(n={};t=e.match($r);)e=e.slice(0,e.length-t[0].length),n[t[0].toLowerCase()]=!0}return[e.slice(2).toLowerCase(),n]}(n);if(r){!function(e,n,t,r){e.addEventListener(n,t,r)}(e,t,s[n]=function(e,n){const t=e=>{(e.timeStamp||Rr())>=t.attached-1&&sn(function(e,n){if(x(n)){const t=e.stopImmediatePropagation;return e.stopImmediatePropagation=()=>{t.call(e),e._stopped=!0},n.map((e=>n=>!n._stopped&&e(n)))}return n}(e,t.value),n,5,[e])};return t.value=e,t.attached=(()=>Ir||(Kr.then(Mr),Ir=Rr()))(),t}(r,o),a)}else l&&(!function(e,n,t,r){e.removeEventListener(n,t,r)}(e,t,l,a),s[n]=void 0)}}const $r=/(?:Once|Passive|Capture)$/;const Lr=/^on[a-z]/;const qr={beforeMount(e,{value:n},{transition:t}){e._vod="none"===e.style.display?"":e.style.display,t&&n?t.beforeEnter(e):Br(e,n)},mounted(e,{value:n},{transition:t}){t&&n&&t.enter(e)},updated(e,{value:n,oldValue:t},{transition:r}){r&&n!==t?n?(r.beforeEnter(e),Br(e,!0),r.enter(e)):r.leave(e,(()=>{Br(e,!1)})):Br(e,n)},beforeUnmount(e,{value:n}){Br(e,n)}};function Br(e,n){e.style.display=n?e._vod:"none"}const Wr=y({patchProp:(e,n,r,o,s=!1,l,a,i,c)=>{switch(n){case"class":!function(e,n,t){if(null==n&&(n=""),t)e.setAttribute("class",n);else{const t=e._vtc;t&&(n=(n?[n,...t]:[...t]).join(" ")),e.className=n}}(e,o,s);break;case"style":!function(e,n,t){const r=e.style;if(t)if(k(t))n!==t&&(r.cssText=t);else{for(const e in t)Nr(r,e,t[e]);if(n&&!k(n))for(const e in n)null==t[e]&&Nr(r,e,"")}else e.removeAttribute("style")}(e,r,o);break;default:g(n)?_(n)||Dr(e,n,0,o,a):function(e,n,t,r){if(r)return"innerHTML"===n||!!(n in e&&Lr.test(n)&&O(t));if("spellcheck"===n||"draggable"===n)return!1;if("form"===n&&"string"==typeof t)return!1;if("list"===n&&"INPUT"===e.tagName)return!1;if(Lr.test(n)&&k(t))return!1;return n in e}(e,n,o,s)?function(e,n,t,r,o,s,l){if("innerHTML"===n||"textContent"===n)return r&&l(r,o,s),void(e[n]=null==t?"":t);if("value"!==n||"PROGRESS"===e.tagName){if(""===t||null==t){const r=typeof e[n];if(""===t&&"boolean"===r)return void(e[n]=!0);if(null==t&&"string"===r)return e[n]="",void e.removeAttribute(n);if("number"===r)return e[n]=0,void e.removeAttribute(n)}try{e[n]=t}catch(e){}}else{e._value=t;const n=null==t?"":t;e.value!==n&&(e.value=n)}}(e,n,o,l,a,i,c):("true-value"===n?e._trueValue=o:"false-value"===n&&(e._falseValue=o),function(e,n,r,o){if(o&&n.startsWith("xlink:"))null==r?e.removeAttributeNS(jr,n.slice(6,n.length)):e.setAttributeNS(jr,n,r);else{const o=t(n);null==r||o&&!1===r?e.removeAttribute(n):e.setAttribute(n,o?"":r)}}(e,n,o,s))}},forcePatchProp:(e,n)=>"value"===n},Pr);let zr;function Hr(){return zr||(zr=Et(Wr))}const Jr=(...e)=>{const n=Hr().createApp(...e),{mount:t}=n;return n.mount=e=>{const r=function(e){if(k(e)){return document.querySelector(e)}return e}(e);if(!r)return;const o=n._component;O(o)||o.render||o.template||(o.template=r.innerHTML),r.innerHTML="";const s=t(r);return r.removeAttribute("v-cloak"),r.setAttribute("data-v-app",""),s},n};const Gr=(...e)=>Object.prototype.toString.call(...e).slice(8,-1);var Zr={props:{data:{required:!0,validator:e=>"Null"===Gr(e)},name:{required:!0,type:String}}};const Qr={class:"null"},Xr={class:"key"},Yr={key:0,class:"separator"},eo=Jt("span",{class:"value"},"null",-1);Zr.render=function(e,n,t,r,o,s){return Dt(),Lt("span",Qr,[Jt("span",Xr,i(t.name),1),""!==t.name?(Dt(),Lt("span",Yr,": ")):Qt("v-if",!0),eo])},Zr.__file="src/components/NullWrapper.vue";var no={props:{data:{required:!0,validator:e=>"Boolean"===Gr(e)},name:{required:!0,type:String}}};const to={class:"boolean"},ro={class:"key"},oo={key:0,class:"separator"},so={class:"value"};no.render=function(e,n,t,r,o,s){return Dt(),Lt("span",to,[Jt("span",ro,i(t.name),1),""!==t.name?(Dt(),Lt("span",oo,": ")):Qt("v-if",!0),Jt("span",so,i(t.data),1)])},no.__file="src/components/BooleanWrapper.vue";var lo={props:{data:{required:!0,validator:e=>"Number"===Gr(e)},name:{required:!0,type:String}}};const ao={class:"number"},io={class:"key"},co={key:0,class:"separator"},uo={class:"value"};lo.render=function(e,n,t,r,o,s){return Dt(),Lt("span",ao,[Jt("span",io,i(t.name),1),""!==t.name?(Dt(),Lt("span",co,": ")):Qt("v-if",!0),Jt("span",uo,i(t.data),1)])},lo.__file="src/components/NumberWrapper.vue";var po={props:{data:{required:!0,validator:e=>"String"===Gr(e)},name:{required:!0,type:String}}};const fo={class:"string"},ho={class:"key"},go={key:0,class:"separator"},_o=Jt("span",{class:"quotes"},'"',-1),yo={class:"value"},mo=Jt("span",{class:"quotes"},'"',-1);po.render=function(e,n,t,r,o,s){return Dt(),Lt("span",fo,[Jt("span",ho,i(t.name),1),""!==t.name?(Dt(),Lt("span",go,": ")):Qt("v-if",!0),_o,Jt("span",yo,i(t.data),1),mo])},po.__file="src/components/StringWrapper.vue";const vo=new Set;function bo(e={collapseSignal:collapseSignal,expandSignal:expandSignal}){const n=Xe(!1),t=Xe(!1),r=()=>{n.value=!1,t.value=!t.value};at((()=>e.collapseSignal),r);const o=Xe(!1),s=()=>{n.value=!0,o.value=!o.value};at((()=>e.expandSignal),s);return at((()=>e.data),(()=>{e.expandOnCreatedAndUpdated(e.path)?s():r()}),{immediate:!0}),{isExpanding:n,innerCollapseSignal:t,innerExpandSignal:o,handleClick:e=>{vo.clear(),!0===e.metaKey&&!0===e.shiftKey?r():!0===e.metaKey?s():n.value=!n.value}}}var xo={name:"array-wrapper",props:{path:{required:!0,validator:e=>"Array"===Gr(e)&&e.every((e=>"String"===Gr(e)||"Number"===Gr(e)))},data:{required:!0,validator:e=>"Array"===Gr(e)},name:{required:!0,type:String},collapseSignal:{default:!1,type:Boolean},expandSignal:{default:!1,type:Boolean},expandOnCreatedAndUpdated:{required:!0,type:Function},getKeys:{required:!0,type:Function}},setup(e){const{isExpanding:n,innerExpandSignal:t,innerCollapseSignal:r,handleClick:o}=bo(e),s=Cr((()=>e.getKeys(e.data,e.path))),l=vo.has(e.data);return vo.add(e.data),{keys:s,isExpanding:n,innerExpandSignal:t,innerCollapseSignal:r,handleClick:o,isCircular:l}},components:{}};const So={class:"array"},Co={key:0,class:"value"},Oo={key:0,class:"value"};xo.render=function(e,n,t,r,o,s){const l=Tt("wrapper");return Dt(),Lt("span",So,[Jt("span",{class:"indicator",onClick:n[1]||(n[1]=(...e)=>r.handleClick&&r.handleClick(...e))},i(r.isExpanding?"▼":"▶"),1),Jt("span",{class:"key",onClick:n[2]||(n[2]=(...e)=>r.handleClick&&r.handleClick(...e))},i(""===t.name?"":t.name),1),Jt("span",{class:"separator",onClick:n[3]||(n[3]=(...e)=>r.handleClick&&r.handleClick(...e))},i(""===t.name?"":": "),1),Jt("span",{class:"count",onClick:n[4]||(n[4]=(...e)=>r.handleClick&&r.handleClick(...e))},i(!1===r.isExpanding&&t.data.length>=2?"("+t.data.length+")":""),1),Jt("span",{class:"preview",onClick:n[5]||(n[5]=(...e)=>r.handleClick&&r.handleClick(...e))},i(r.isExpanding?"Array("+t.data.length+")":"[...]"),1),r.isCircular?(Dt(),Lt(Ft,{key:0},[r.isExpanding?(Dt(),Lt("span",Co,[(Dt(!0),Lt(Ft,null,Or(r.keys,(e=>(Dt(),Lt(l,{key:e,name:e,path:t.path.concat(e),data:t.data[e],"expand-signal":r.innerExpandSignal,"collapse-signal":r.innerCollapseSignal,expandOnCreatedAndUpdated:()=>!1,getKeys:t.getKeys},null,8,["name","path","data","expand-signal","collapse-signal","expandOnCreatedAndUpdated","getKeys"])))),128))])):Qt("v-if",!0)],64)):(Dt(),Lt(Ft,{key:1},[r.isExpanding?(Dt(),Lt("span",Oo,[(Dt(!0),Lt(Ft,null,Or(r.keys,(e=>(Dt(),Lt(l,{key:e,name:e,path:t.path.concat(e),data:t.data[e],"expand-signal":r.innerExpandSignal,"collapse-signal":r.innerCollapseSignal,expandOnCreatedAndUpdated:t.expandOnCreatedAndUpdated,getKeys:t.getKeys},null,8,["name","path","data","expand-signal","collapse-signal","expandOnCreatedAndUpdated","getKeys"])))),128))])):Qt("v-if",!0)],64))])},xo.__file="src/components/ArrayWrapper.vue";var ko={name:"object-wrapper",props:{path:{required:!0,validator:e=>"Array"===Gr(e)&&e.every((e=>"String"===Gr(e)||"Number"===Gr(e)))},data:{required:!0,validator:e=>"Object"===Gr(e)},name:{required:!0,type:String},collapseSignal:{default:!1,type:Boolean},expandSignal:{default:!1,type:Boolean},expandOnCreatedAndUpdated:{required:!0,type:Function},getKeys:{required:!0,type:Function}},setup(e){const{isExpanding:n,innerExpandSignal:t,innerCollapseSignal:r,handleClick:o}=bo(e),s=Cr((()=>e.getKeys(e.data,e.path))),l=vo.has(e.data);return vo.add(e.data),{keys:s,isExpanding:n,innerExpandSignal:t,innerCollapseSignal:r,handleClick:o,isCircular:l}},components:{}};const wo={class:"object"},Eo={key:0,class:"value"},Ao={key:1,class:"value"};ko.render=function(e,n,t,r,o,s){const l=Tt("wrapper");return Dt(),Lt("span",wo,[Jt("span",{class:"indicator",onClick:n[1]||(n[1]=(...e)=>r.handleClick&&r.handleClick(...e))},i(r.isExpanding?"▼":"▶"),1),Jt("span",{class:"key",onClick:n[2]||(n[2]=(...e)=>r.handleClick&&r.handleClick(...e))},i(""===t.name?"":t.name),1),Jt("span",{class:"separator",onClick:n[3]||(n[3]=(...e)=>r.handleClick&&r.handleClick(...e))},i(""===t.name?"":": "),1),Jt("span",{class:"preview",onClick:n[4]||(n[4]=(...e)=>r.handleClick&&r.handleClick(...e))},i(r.isExpanding?"":"{...}"),1),r.isCircular?(Dt(),Lt(Ft,{key:0},[r.isExpanding?(Dt(),Lt("span",Eo,[(Dt(!0),Lt(Ft,null,Or(r.keys,(e=>(Dt(),Lt(l,{key:e,class:"value",name:e,path:t.path.concat(e),data:t.data[e],"expand-signal":r.innerExpandSignal,"collapse-signal":r.innerCollapseSignal,expandOnCreatedAndUpdated:()=>!1,getKeys:t.getKeys},null,8,["name","path","data","expand-signal","collapse-signal","expandOnCreatedAndUpdated","getKeys"])))),128))])):Qt("v-if",!0)],64)):vt((Dt(),Lt("span",Ao,[(Dt(!0),Lt(Ft,null,Or(r.keys,(e=>(Dt(),Lt(l,{key:e,class:"value",name:e,path:t.path.concat(e),data:t.data[e],"expand-signal":r.innerExpandSignal,"collapse-signal":r.innerCollapseSignal,expandOnCreatedAndUpdated:t.expandOnCreatedAndUpdated,getKeys:t.getKeys},null,8,["name","path","data","expand-signal","collapse-signal","expandOnCreatedAndUpdated","getKeys"])))),128))],512)),[[qr,r.isExpanding]])])},ko.__file="src/components/ObjectWrapper.vue";const Uo={name:"wrapper",props:{path:{required:!0,validator:e=>"Array"===Gr(e)&&e.every((e=>"String"===Gr(e)||"Number"===Gr(e)))},data:{required:!0,validator:e=>"Null"===Gr(e)||"Boolean"===Gr(e)||"Number"===Gr(e)||"String"===Gr(e)||"Array"===Gr(e)||"Object"===Gr(e)},name:{required:!0,type:String},collapseSignal:{default:!1,type:Boolean},expandSignal:{default:!1,type:Boolean},expandOnCreatedAndUpdated:{required:!0,type:Function},getKeys:{required:!0,type:Function}},setup:()=>({objectToString:Gr}),components:{NullWrapper:Zr,BooleanWrapper:no,NumberWrapper:lo,StringWrapper:po,ArrayWrapper:xo,ObjectWrapper:ko}};xo.components.Wrapper=Uo,ko.components.Wrapper=Uo,Uo.render=function(e,n,t,r,o,s){const l=Tt("null-wrapper"),a=Tt("boolean-wrapper"),i=Tt("number-wrapper"),c=Tt("string-wrapper"),u=Tt("array-wrapper"),d=Tt("object-wrapper");return"Null"===e.objectToString(e.data)?(Dt(),Lt(l,{key:0,name:e.name,data:e.data},null,8,["name","data"])):"Boolean"===e.objectToString(e.data)?(Dt(),Lt(a,{key:1,name:e.name,data:e.data},null,8,["name","data"])):"Number"===e.objectToString(e.data)?(Dt(),Lt(i,{key:2,name:e.name,data:e.data},null,8,["name","data"])):"String"===e.objectToString(e.data)?(Dt(),Lt(c,{key:3,name:e.name,data:e.data},null,8,["name","data"])):"Array"===e.objectToString(e.data)?(Dt(),Lt(u,{key:4,name:e.name,path:e.path,data:e.data,"collapse-signal":e.collapseSignal,"expand-signal":e.expandSignal,expandOnCreatedAndUpdated:e.expandOnCreatedAndUpdated,getKeys:e.getKeys},null,8,["name","path","data","collapse-signal","expand-signal","expandOnCreatedAndUpdated","getKeys"])):"Object"===e.objectToString(e.data)?(Dt(),Lt(d,{key:5,name:e.name,path:e.path,data:e.data,"collapse-signal":e.collapseSignal,"expand-signal":e.expandSignal,expandOnCreatedAndUpdated:e.expandOnCreatedAndUpdated,getKeys:e.getKeys},null,8,["name","path","data","collapse-signal","expand-signal","expandOnCreatedAndUpdated","getKeys"])):Qt("v-if",!0)},Uo.__file="src/components/Wrapper.vue";const Po=Object.freeze({expandOnCreatedAndUpdated:e=>!1,getKeys:(e,n)=>Object.keys(e)});var To=(e,n,t={})=>{void 0===t.rootName&&(t.rootName=""),void 0===t.getKeys&&(t.getKeys=Po.getKeys),void 0===t.expandOnCreatedAndUpdated&&(t.expandOnCreatedAndUpdated=Po.expandOnCreatedAndUpdated),n.classList.add("object-visualizer"),((...e)=>{Hr().render(...e)})(null,n),Jr(Uo,{data:e,name:t.rootName,path:[],expandOnCreatedAndUpdated:t.expandOnCreatedAndUpdated,getKeys:t.getKeys}).mount(n)};


/***/ }),

/***/ "./common/buildCode.js":
/*!*****************************!*\
  !*** ./common/buildCode.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var COMPONENTS_MAP = {
  grid: 'GridComponent',
  polar: 'PolarComponent',
  geo: 'GeoComponent',
  singleAxis: 'SingleAxisComponent',
  parallel: 'ParallelComponent',
  calendar: 'CalendarComponent',
  graphic: 'GraphicComponent',
  toolbox: 'ToolboxComponent',
  tooltip: 'TooltipComponent',
  axisPointer: 'AxisPointerComponent',
  brush: 'BrushComponent',
  title: 'TitleComponent',
  timeline: 'TimelineComponent',
  markPoint: 'MarkPointComponent',
  markLine: 'MarkLineComponent',
  markArea: 'MarkAreaComponent',
  legend: 'LegendComponent',
  dataZoom: 'DataZoomComponent',
  visualMap: 'VisualMapComponent',
  aria: 'AriaComponent',
  dataset: 'DatasetComponent',
  // Dependencies
  xAxis: 'GridComponent',
  yAxis: 'GridComponent',
  angleAxis: 'PolarComponent',
  radiusAxis: 'PolarComponent'
};
var CHARTS_MAP = {
  line: 'LineChart',
  bar: 'BarChart',
  pie: 'PieChart',
  scatter: 'ScatterChart',
  radar: 'RadarChart',
  map: 'MapChart',
  tree: 'TreeChart',
  treemap: 'TreemapChart',
  graph: 'GraphChart',
  gauge: 'GaugeChart',
  funnel: 'FunnelChart',
  parallel: 'ParallelChart',
  sankey: 'SankeyChart',
  boxplot: 'BoxplotChart',
  candlestick: 'CandlestickChart',
  effectScatter: 'EffectScatterChart',
  lines: 'LinesChart',
  heatmap: 'HeatmapChart',
  pictorialBar: 'PictorialBarChart',
  themeRiver: 'ThemeRiverChart',
  sunburst: 'SunburstChart',
  custom: 'CustomChart'
};
var COMPONENTS_GL_MAP = {
  grid3D: 'Grid3DComponent',
  geo3D: 'Geo3DComponent',
  globe: 'GlobeComponent',
  mapbox3D: 'Mapbox3DComponent',
  maptalks3D: 'Maptalks3DComponent',
  // Dependencies
  xAxis3D: 'Grid3DComponent',
  yAxis3D: 'Grid3DComponent',
  zAxis3D: 'Grid3DComponent'
};
var CHARTS_GL_MAP = {
  bar3D: 'Bar3DChart',
  line3D: 'Line3DChart',
  scatter3D: 'Scatter3DChart',
  lines3D: 'Lines3DChart',
  polygons3D: 'Polygons3DChart',
  surface: 'SurfaceChart',
  map3D: 'Map3DChart',
  scatterGL: 'ScatterGLChart',
  graphGL: 'GraphGLChart',
  flowGL: 'FlowGLChart',
  linesGL: 'LinesGLChart'
};
var COMPONENTS_MAP_REVERSE = {};
var CHARTS_MAP_REVERSE = {};
var CHARTS_GL_MAP_REVERSE = {};
var COMPONENTS_GL_MAP_REVERSE = {};
var RENDERERS_MAP_REVERSE = {
  'SVGRenderer': 'svg',
  'CanvasRenderer': 'canvas'
}; // Component that will be injected automatically in preprocessor
// These should be excluded util find they were used explicitly.

var MARKERS = ['markLine', 'markArea', 'markPoint'];
var INJECTED_COMPONENTS = [].concat(MARKERS, ['grid', 'axisPointer', 'aria' // TODO aria
]); // Component that was dependent.

var DEPENDENT_COMPONENTS = ['xAxis', 'yAxis', 'angleAxis', 'radiusAxis', 'xAxis3D', 'yAxis3D', 'zAxis3D'];

function createReverseMap(map, reverseMap) {
  Object.keys(map).forEach(function (key) {
    // Exclude dependencies.
    if (DEPENDENT_COMPONENTS.includes(key)) {
      return;
    }

    reverseMap[map[key]] = key;
  });
}

createReverseMap(COMPONENTS_MAP, COMPONENTS_MAP_REVERSE);
createReverseMap(CHARTS_MAP, CHARTS_MAP_REVERSE);
createReverseMap(COMPONENTS_GL_MAP, COMPONENTS_GL_MAP_REVERSE);
createReverseMap(CHARTS_GL_MAP, CHARTS_GL_MAP_REVERSE);

module.exports.collectDeps = function collectDeps(option) {
  var deps = [];

  if (option.options) {
    // TODO getOption() doesn't have baseOption and options.
    option.options.forEach(function (opt) {
      deps = deps.concat(collectDeps(opt));
    });

    if (option.baseOption) {
      deps = deps.concat(collectDeps(option.baseOption));
    } // Remove duplicates


    return Array.from(new Set(deps));
  }

  Object.keys(option).forEach(function (key) {
    if (INJECTED_COMPONENTS.includes(key)) {
      return;
    }

    var val = option[key];

    if (Array.isArray(val) && !val.length) {
      return;
    }

    if (COMPONENTS_MAP[key]) {
      deps.push(COMPONENTS_MAP[key]);
    }

    if (COMPONENTS_GL_MAP[key]) {
      deps.push(COMPONENTS_GL_MAP[key]);
    }
  });
  var series = option.series;

  if (!Array.isArray(series)) {
    series = [series];
  }

  series.forEach(function (seriesOpt) {
    if (CHARTS_MAP[seriesOpt.type]) {
      deps.push(CHARTS_MAP[seriesOpt.type]);
    }

    if (CHARTS_GL_MAP[seriesOpt.type]) {
      deps.push(CHARTS_GL_MAP[seriesOpt.type]);
    }

    if (seriesOpt.type === 'map') {
      // Needs geo component when using map
      deps.push(COMPONENTS_MAP.geo);
    }

    MARKERS.forEach(function (markerType) {
      if (seriesOpt[markerType]) {
        deps.push(COMPONENTS_MAP[markerType]);
      }
    });
  }); // Remove duplicates

  return Array.from(new Set(deps));
};

function buildMinimalBundleCode(deps, includeType) {
  var chartsImports = [];
  var componentsImports = [];
  var chartsGLImports = [];
  var componentsGLImports = [];
  var renderersImports = [];
  deps.forEach(function (dep) {
    if (dep.endsWith('Renderer')) {
      renderersImports.push(dep);
    } else if (CHARTS_MAP_REVERSE[dep]) {
      chartsImports.push(dep);

      if (includeType) {
        chartsImports.push(dep.replace(/Chart$/, 'SeriesOption'));
      }
    } else if (COMPONENTS_MAP_REVERSE[dep]) {
      componentsImports.push(dep);

      if (includeType) {
        componentsImports.push(dep.replace(/Component$/, 'ComponentOption'));
      }
    } else if (CHARTS_GL_MAP_REVERSE[dep]) {
      chartsGLImports.push(dep);
    } else if (COMPONENTS_GL_MAP_REVERSE[dep]) {
      componentsGLImports.push(dep);
    }
  });

  function getImportsPartCode(imports) {
    return "".concat(imports.map(function (str) {
      return "\n    ".concat(str);
    }).join(','));
  }

  var allImports = [].concat(componentsImports, chartsImports, componentsGLImports, chartsGLImports, renderersImports);
  var ECOptionTypeCode = "\ntype ECOption = echarts.ComposeOption<\n    ".concat(allImports.filter(function (a) {
    return a.endsWith('Option');
  }).join(' | '), "\n>");
  var importsCodes = [[componentsImports, 'echarts/components'], [chartsImports, 'echarts/charts'], [renderersImports, 'echarts/renderers'], [chartsGLImports, 'echarts-gl/charts'], [componentsGLImports, 'echarts-gl/components']].filter(function (a) {
    return a[0].length > 0;
  }).map(function (item) {
    return "\nimport {".concat(getImportsPartCode(item[0]), "\n} from '").concat(item[1], "';\n    ").trim();
  }).join('\n');
  return "import * as echarts from 'echarts/core';\n".concat(importsCodes, "\n\necharts.use(\n    [").concat(allImports.filter(function (a) {
    return !a.endsWith('Option');
  }).join(', '), "]\n);\n") + (includeType ? ECOptionTypeCode : '');
}

module.exports.buildMinimalBundleCode = buildMinimalBundleCode;

function buildLegacyMinimalBundleCode(deps, isESM) {
  var modules = [];
  deps.forEach(function (dep) {
    if (dep.endsWith('Renderer') && dep !== 'CanvasRenderer') {
      modules.push("zrender/lib/".concat(RENDERERS_MAP_REVERSE[dep], "/").concat(RENDERERS_MAP_REVERSE[dep]));
    } else if (CHARTS_MAP_REVERSE[dep]) {
      modules.push("echarts/lib/chart/".concat(CHARTS_MAP_REVERSE[dep]));
    } else if (COMPONENTS_MAP_REVERSE[dep]) {
      modules.push("echarts/lib/component/".concat(COMPONENTS_MAP_REVERSE[dep]));
    } else if (CHARTS_GL_MAP_REVERSE[dep]) {
      modules.push("echarts-gl/lib/chart/".concat(CHARTS_GL_MAP_REVERSE[dep]));
    } else if (COMPONENTS_GL_MAP_REVERSE[dep]) {
      modules.push("echarts-gl/lib/component/".concat(COMPONENTS_GL_MAP_REVERSE[dep]));
    }
  });
  return isESM ? "import * as echarts from 'echarts/lib/echarts';\n".concat(modules.map(function (mod) {
    return "import '".concat(mod, "';");
  }).join('\n'), "\n") : "const echarts = require('echarts/lib/echarts');\n".concat(modules.map(function (mod) {
    return "require('".concat(mod, "');");
  }).join('\n'), "\n");
}

function hasGLInDeps(deps) {
  return !!deps.find(function (dep) {
    return !!(CHARTS_GL_MAP_REVERSE[dep] || COMPONENTS_GL_MAP_REVERSE[dep]);
  });
}

module.buildLegacyMinimalBundleCode = buildLegacyMinimalBundleCode;

module.exports.buildExampleCode = function (jsCode, deps, _ref) {
  var minimal = _ref.minimal,
      _ref$esm = _ref.esm,
      esm = _ref$esm === void 0 ? true : _ref$esm,
      legacy = _ref.legacy,
      ts = _ref.ts,
      theme = _ref.theme,
      ROOT_PATH = _ref.ROOT_PATH,
      extraImports = _ref.extraImports;

  // if (minimal && !legacy) {
  //     // ESM must be used when use the new minimal import
  //     esm = true;
  // }
  if (ts) {
    esm = true;
  }

  if (minimal && !esm) {
    // Only legacy mode can be used when use require in mimimal bundle.
    legacy = true;
  }

  var hasECStat = jsCode.indexOf('ecStat') >= 0;
  var usedRootPath = jsCode.indexOf('ROOT_PATH') >= 0;
  var usedApp = jsCode.indexOf('app') >= 0;
  var DEP_CODE = "\n".concat(hasECStat ? esm ? "import ecStat from 'echarts-stat';" : "var ecStat = require('echarts-stat');" : '', "\n");
  var IMPORT_CODE = [!minimal ? esm ? "import * as echarts from 'echarts';".concat(hasGLInDeps(deps) ? "\nimport 'echarts-gl';" : '') : "var echarts = require('echarts');".concat(hasGLInDeps(deps) ? "\nrequire('echarts-gl');" : '') : legacy ? buildLegacyMinimalBundleCode(deps, esm) : buildMinimalBundleCode(deps, ts), theme && theme !== 'dark' ? esm ? "import 'echarts/theme/".concat(theme, "'") : "require('echarts/theme/".concat(theme, "')") : '', extraImports].filter(function (a) {
    return !!a;
  }).join('\n');
  var ENV_CODE = [usedRootPath ? "var ROOT_PATH = '".concat(ROOT_PATH, "';") : '', usedApp ? "var app".concat(ts ? ': any' : '', " = {};") : '', ts && !minimal ? 'type ECOption = echarts.EChartsOption' : ''].filter(function (a) {
    return !!a;
  }).join('\n');
  var PREPARE_CODE = [IMPORT_CODE.trim(), DEP_CODE.trim(), ENV_CODE.trim()].filter(function (a) {
    return !!a;
  }).join('\n\n');
  return "".concat(PREPARE_CODE, "\n\nvar chartDom = document.getElementById('main')").concat(ts ? '!' : '', ";\nvar myChart = echarts.init(chartDom").concat(theme ? ", '".concat(theme, "'") : '', ");\nvar option").concat(ts ? ': ECOption' : '', ";\n\n").concat(jsCode.trim(), "\n\noption && myChart.setOption(option);\n");
};

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeAce.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeAce.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _data_option_keywords__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/option-keywords */ "./src/data/option-keywords.js");
/* harmony import */ var _common_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/helper */ "./src/common/helper.js");
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/store */ "./src/common/store.js");
/* harmony import */ var _common_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/config */ "./src/common/config.js");
//
//
//
//





function ensureACE() {
  if (typeof ace === 'undefined') {
    return (0,_common_helper__WEBPACK_IMPORTED_MODULE_1__.loadScriptsAsync)([_common_config__WEBPACK_IMPORTED_MODULE_3__.SCRIPT_URLS.aceDir + '/ace.js', _common_config__WEBPACK_IMPORTED_MODULE_3__.SCRIPT_URLS.aceDir + '/ext-language_tools.js']).then(function () {
      var lnTools = ace.require('ace/ext/language_tools');

      var completions = [];
      _data_option_keywords__WEBPACK_IMPORTED_MODULE_0__.keywords.forEach(function (keyword) {
        completions.push({
          caption: keyword.name,
          value: keyword.name,
          score: keyword.count,
          metal: 'local'
        });
      });
      lnTools.addCompleter({
        getCompletions: function getCompletions(editor, session, pos, prefix, callback) {
          callback(null, completions);
        }
      });
    });
  }

  return Promise.resolve();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['initialCode'],
  data: function data() {
    return {
      shared: _common_store__WEBPACK_IMPORTED_MODULE_2__.store,
      loading: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.loading = true;
    ensureACE().then(function () {
      _this.loading = false;
      var editor = ace.edit(_this.$el);
      editor.getSession().setMode('ace/mode/javascript');
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      });
      _this._editor = editor;
      editor.on('change', function () {
        _common_store__WEBPACK_IMPORTED_MODULE_2__.store.sourceCode = _common_store__WEBPACK_IMPORTED_MODULE_2__.store.runCode = editor.getValue();
      });

      if (_this.initialCode) {
        _this.setInitialCode(_this.initialCode);
      }
    });
  },
  methods: {
    setInitialCode: function setInitialCode(code) {
      if (this._editor && code) {
        this._editor.setValue(code || '');

        this._editor.selection.setSelectionRange({
          start: {
            row: 1,
            column: 4
          },
          end: {
            row: 1,
            column: 4
          }
        });
      }
    }
  },
  watch: {
    initialCode: function initialCode(newVal) {
      this.setInitialCode(newVal);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeMonaco.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeMonaco.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _data_option_keywords__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/option-keywords */ "./src/data/option-keywords.js");
/* harmony import */ var _common_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/helper */ "./src/common/helper.js");
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/store */ "./src/common/store.js");
/* harmony import */ var _common_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/config */ "./src/common/config.js");
/* harmony import */ var _Preview_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Preview.vue */ "./src/editor/Preview.vue");
//
//
//
//






function loadTypes() {
  return fetch(_common_store__WEBPACK_IMPORTED_MODULE_2__.store.cdnRoot + '/types/echarts.d.ts', {
    mode: 'cors'
  }).then(function (response) {
    return response.text();
  }).then(function (code) {
    // validation settings
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    }); // compiler options

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES6,
      allowNonTsExtensions: true,
      noResolve: false
    }); // console.log('file:///node_modules/@types/' + res[i].path);

    monaco.languages.typescript.typescriptDefaults.addExtraLib(code, // https://github.com/microsoft/monaco-editor/issues/667#issuecomment-468164794
    'file:///node_modules/@types/echarts/index.d.ts');
    monaco.languages.typescript.typescriptDefaults.addExtraLib("import {init, EChartsOption} from 'echarts';\n// Declare to global namespace.\ndeclare global {\ndeclare const $: any;\ndeclare const ROOT_PATH: string;\ndeclare const app: {\n    configParameters: {\n        [key: string]: ({\n            options: { [key: string]: string\n        }) | ({\n            min?: number\n            max?: number\n        })\n    }\n    config: {\n        onChange: () => void\n        [key: string]: string | number | function\n    }\n    [key: string]: any\n};\ndeclare const myChart: ReturnType<typeof init>;\ndeclare var option: EChartsOption;\n}\n", 'file:///example.d.ts');
    return;
  });
}

function ensureMonacoAndTsTransformer() {
  function loadMonaco() {
    if (typeof monaco === 'undefined') {
      return (0,_common_helper__WEBPACK_IMPORTED_MODULE_1__.loadScriptsAsync)([_common_config__WEBPACK_IMPORTED_MODULE_3__.SCRIPT_URLS.monacoDir + '/loader.js', // Prebuilt TS transformer with surcrase
      _common_store__WEBPACK_IMPORTED_MODULE_2__.store.cdnRoot + '/js/example-transform-ts-bundle.js']).then(function () {
        window.require.config({
          paths: {
            'vs': _common_config__WEBPACK_IMPORTED_MODULE_3__.SCRIPT_URLS.monacoDir
          }
        });

        return new Promise(function (resolve) {
          window.require(['vs/editor/editor.main'], function () {
            loadTypes().then(function () {
              resolve();
            });
          });
        });
      });
    }

    return Promise.resolve();
  } // Must load echarts before monaco. Or the AMD loader will affect loading of echarts.


  return (0,_Preview_vue__WEBPACK_IMPORTED_MODULE_4__.ensureECharts)().then(loadMonaco);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['initialCode'],
  data: function data() {
    return {
      shared: _common_store__WEBPACK_IMPORTED_MODULE_2__.store,
      loading: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.loading = true;
    ensureMonacoAndTsTransformer().then(function () {
      _this.loading = false;
      var model = monaco.editor.createModel(_this.initialCode || '', 'typescript', // Should also be a file path so it can resolve the lib.
      monaco.Uri.parse('file:///main.ts'));
      var editor = monaco.editor.create(_this.$el, {
        model: model,
        fontFamily: "'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace",
        minimap: {
          enabled: false
        },
        automaticLayout: true
      });
      _this._editor = editor;

      if (_this.initialCode) {
        _common_store__WEBPACK_IMPORTED_MODULE_2__.store.sourceCode = _this.initialCode;
        _common_store__WEBPACK_IMPORTED_MODULE_2__.store.runCode = echartsExampleTransformTs(_common_store__WEBPACK_IMPORTED_MODULE_2__.store.sourceCode);
      }

      editor.onDidChangeModelContent(function () {
        _common_store__WEBPACK_IMPORTED_MODULE_2__.store.sourceCode = editor.getValue();
        _common_store__WEBPACK_IMPORTED_MODULE_2__.store.runCode = echartsExampleTransformTs(_common_store__WEBPACK_IMPORTED_MODULE_2__.store.sourceCode);
      });
    });
  },
  destroyed: function destroyed() {
    if (this._editor) {
      this._editor.getModel().dispose();

      this._editor.dispose();
    }
  },
  methods: {
    setInitialCode: function setInitialCode(code) {
      if (this._editor && code) {
        this._editor.setValue(code || '');
      }
    }
  },
  watch: {
    initialCode: function initialCode(newVal) {
      this.setInitialCode(newVal);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Editor.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Editor.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _CodeAce_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CodeAce.vue */ "./src/editor/CodeAce.vue");
/* harmony import */ var _CodeMonaco_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CodeMonaco.vue */ "./src/editor/CodeMonaco.vue");
/* harmony import */ var _FullCodePreview_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FullCodePreview.vue */ "./src/editor/FullCodePreview.vue");
/* harmony import */ var _Preview_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Preview.vue */ "./src/editor/Preview.vue");
/* harmony import */ var _common_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/config */ "./src/common/config.js");
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/store */ "./src/common/store.js");
/* harmony import */ var _common_buildCode__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../common/buildCode */ "./common/buildCode.js");
/* harmony import */ var _common_buildCode__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_common_buildCode__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _lang_object_visualizer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @lang/object-visualizer */ "./node_modules/@lang/object-visualizer/dist/object-visualizer.esm.min.js");
/* harmony import */ var _object_visualizer_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./object-visualizer.css */ "./src/editor/object-visualizer.css");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    CodeAce: _CodeAce_vue__WEBPACK_IMPORTED_MODULE_0__.default,
    CodeMonaco: _CodeMonaco_vue__WEBPACK_IMPORTED_MODULE_1__.default,
    FullCodePreview: _FullCodePreview_vue__WEBPACK_IMPORTED_MODULE_2__.default,
    Preview: _Preview_vue__WEBPACK_IMPORTED_MODULE_3__.default
  },
  data: function data() {
    return {
      mousedown: false,
      leftContainerSize: 40,
      mobileMode: false,
      shared: _common_store__WEBPACK_IMPORTED_MODULE_5__.store,
      initialCode: '',
      currentTab: 'code-editor',
      fullCode: '',
      fullCodeConfig: {
        mimimal: false,
        esm: true,
        node: false // If is in node

      }
    };
  },
  computed: {
    currentTime: function currentTime() {
      // Update time when message updated.
      var message = this.shared.message;
      var time = new Date();
      var digits = [time.getHours(), time.getMinutes(), time.getSeconds()];
      var timeStr = '';

      for (var i = 0, len = digits.length; i < len; ++i) {
        timeStr += (digits[i] < 10 ? '0' : '') + digits[i];

        if (i < len - 1) {
          timeStr += ':';
        }
      }

      return timeStr;
    }
  },
  mounted: function mounted() {
    var _this = this;

    if (_common_store__WEBPACK_IMPORTED_MODULE_5__.store.isMobile) {
      this.leftContainerSize = 0;
      (0,_common_store__WEBPACK_IMPORTED_MODULE_5__.loadExampleCode)().then(function (code) {
        // No editor available. Set to runCode directly.
        _common_store__WEBPACK_IMPORTED_MODULE_5__.store.runCode = (0,_common_store__WEBPACK_IMPORTED_MODULE_5__.parseSourceCode)(code);
      });
    } else {
      (0,_common_store__WEBPACK_IMPORTED_MODULE_5__.loadExampleCode)().then(function (code) {
        // Only set the code in editor. editor will sync to the store.
        _this.initialCode = (0,_common_store__WEBPACK_IMPORTED_MODULE_5__.parseSourceCode)(code);
      });
      window.addEventListener('mousemove', function (e) {
        if (_this.mousedown) {
          var percentage = e.clientX / window.innerWidth;
          percentage = Math.min(0.9, Math.max(0.1, percentage));
          _this.leftContainerSize = percentage * 100;
        }
      });
      window.addEventListener('mouseup', function (e) {
        _this.mousedown = false;
      });
    }
  },
  methods: {
    onSplitterDragStart: function onSplitterDragStart() {
      this.mousedown = true;
    },
    disposeAndRun: function disposeAndRun() {
      this.$refs.preview.refreshAll();
    },
    updateFullCode: function updateFullCode() {
      var option = this.$refs.preview.getOption();

      if (!option) {
        return;
      }

      var deps = (0,_common_buildCode__WEBPACK_IMPORTED_MODULE_6__.collectDeps)(option);
      deps.push(_common_store__WEBPACK_IMPORTED_MODULE_5__.store.renderer === 'svg' ? 'SVGRenderer' : 'CanvasRenderer');
      this.fullCode = (0,_common_buildCode__WEBPACK_IMPORTED_MODULE_6__.buildExampleCode)(_common_store__WEBPACK_IMPORTED_MODULE_5__.store.sourceCode, deps, {
        minimal: this.fullCodeConfig.minimal,
        ts: false,
        esm: this.fullCodeConfig.esm,
        // legacy: true,
        theme: _common_store__WEBPACK_IMPORTED_MODULE_5__.store.darkMode ? 'dark' : '',
        ROOT_PATH: _common_store__WEBPACK_IMPORTED_MODULE_5__.store.cdnRoot
      });
    },
    updateOptionOutline: function updateOptionOutline() {
      var option = Object.freeze(this.$refs.preview.getOption());

      if (!option) {
        return;
      }

      (0,_lang_object_visualizer__WEBPACK_IMPORTED_MODULE_7__.mount)(option, this.$el.querySelector('#option-outline'), {
        getKeys: function getKeys(object, path) {
          return Object.keys(object).filter(function (key) {
            if (Array.isArray(object[key]) && !object[key].length) {
              return false;
            }

            return true;
          });
        },
        expandOnCreatedAndUpdated: function expandOnCreatedAndUpdated(path) {
          return path.length === 0 || path[0] === 'series' && path.length <= 1;
        }
      });
    },
    updateTabContent: function updateTabContent(tab) {
      if (tab === 'full-code') {
        this.updateFullCode();
      } else if (tab === 'full-option') {
        this.updateOptionOutline();
      }
    }
  },
  watch: {
    'shared.typeCheck': function sharedTypeCheck(enableTypeCheck) {
      // Update initialCode to avoid code changed when switching editor
      this.initialCode = _common_store__WEBPACK_IMPORTED_MODULE_5__.store.sourceCode;
      this.updateFullCode();
    },
    'currentTab': function currentTab(tab) {
      this.updateTabContent(tab);
    },
    'shared.runHash': function sharedRunHash() {
      this.updateTabContent(this.currentTab);
    },
    fullCodeConfig: {
      deep: true,
      handler: function handler() {
        this.updateFullCode();
      }
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/FullCodePreview.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/FullCodePreview.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _common_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/helper */ "./src/common/helper.js");
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/store */ "./src/common/store.js");
/* harmony import */ var _common_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/config */ "./src/common/config.js");
//
//
//
//




function ensureACE() {
  if (typeof ace === 'undefined') {
    return (0,_common_helper__WEBPACK_IMPORTED_MODULE_0__.loadScriptsAsync)([_common_config__WEBPACK_IMPORTED_MODULE_2__.SCRIPT_URLS.aceDir + '/ace.js']);
  }

  return Promise.resolve();
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['code'],
  data: function data() {
    return {
      shared: _common_store__WEBPACK_IMPORTED_MODULE_1__.store,
      loading: false
    };
  },
  mounted: function mounted() {
    var _this = this;

    this.loading = true;
    ensureACE().then(function () {
      _this.loading = false;
      var editor = ace.edit(_this.$el);
      editor.getSession().setMode('ace/mode/javascript'); // https://stackoverflow.com/questions/32806060/is-there-a-programmatic-way-to-hide-the-cursor-in-ace-editor

      editor.setOptions({
        readOnly: true,
        showLineNumbers: false,
        showFoldWidgets: false,
        highlightActiveLine: false,
        highlightGutterLine: false
      }); // editor.renderer.setShowGutter(false);

      editor.renderer.$cursorLayer.element.style.display = 'none';
      _this._editor = editor;

      _this.setCode(_this.code);
    });
  },
  methods: {
    setCode: function setCode(code) {
      if (this._editor) {
        this._editor.setValue(code);

        this._editor.selection.setSelectionRange({
          start: {
            row: 1,
            column: 4
          },
          end: {
            row: 1,
            column: 4
          }
        });
      }
    }
  },
  watch: {
    code: function code(newVal) {
      this.setCode(newVal);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Preview.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Preview.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ensureECharts": () => /* binding */ ensureECharts,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/store */ "./src/common/store.js");
/* harmony import */ var _common_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/config */ "./src/common/config.js");
/* harmony import */ var _common_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/helper */ "./src/common/helper.js");
/* harmony import */ var _sandbox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sandbox */ "./src/editor/sandbox.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash/debounce */ "./node_modules/lodash/debounce.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var resize_detector__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! resize-detector */ "./node_modules/resize-detector/esm/index.js");
/* harmony import */ var _data_chart_list_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../data/chart-list-data */ "./src/data/chart-list-data.js");
/* harmony import */ var _data_chart_list_data_gl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../data/chart-list-data-gl */ "./src/data/chart-list-data-gl.js");
/* harmony import */ var _downloadExample__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./downloadExample */ "./src/editor/downloadExample.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//










function findExample(item) {
  return _common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS.c === item.id;
}

var example = _data_chart_list_data__WEBPACK_IMPORTED_MODULE_6__.default.concat(_data_chart_list_data_gl__WEBPACK_IMPORTED_MODULE_7__.default).find(findExample);
var isGL = _data_chart_list_data_gl__WEBPACK_IMPORTED_MODULE_7__.default.find(findExample);

function addDecalIfNecessary(option) {
  if (_common_store__WEBPACK_IMPORTED_MODULE_0__.store.enableDecal) {
    option.aria = option.aria || {};
    option.aria.decal = option.aria.decal || {};
    option.aria.decal.show = true;
    option.aria.show = option.aria.enabled = true;
  }
}

function ensureECharts() {
  if (typeof echarts === 'undefined') {
    var hasBmap = example && example.tags.indexOf('bmap') >= 0; // Code from https://api.map.baidu.com/api?v=2.0&ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu

    if (hasBmap) {
      window.HOST_TYPE = "2";
      window.BMap_loadScriptTime = new Date().getTime();
    }

    return (0,_common_helper__WEBPACK_IMPORTED_MODULE_2__.loadScriptsAsync)([_common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.datGUIMinJS, 'local' in _common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS ? _common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.localEChartsMinJS : _common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsMinJS, _common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsDir + '/dist/extension/dataTool.js', _common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsDir + '/world.js', _common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsStatMinJS].concat(_toConsumableArray(_common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS.gl ? [_common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsGLMinJS] : []), _toConsumableArray(hasBmap ? ['https://api.map.baidu.com/getscript?v=3.0&ak=KOmVjPVUAey1G2E8zNhPiuQ6QiEmAwZu&services=&t=20200327103013', _common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsDir + '/dist/extension/bmap.js'] : []))).then(function () {
      echarts.registerPreprocessor(addDecalIfNecessary);
    });
  }

  return Promise.resolve();
}

function log(text, type) {
  if (type !== 'warn' && type !== 'error') {
    type = 'info';
  }

  _common_store__WEBPACK_IMPORTED_MODULE_0__.store.editorStatus.message = text;
  _common_store__WEBPACK_IMPORTED_MODULE_0__.store.editorStatus.type = type;
}

function run() {
  var _this = this;

  if (typeof echarts === 'undefined') {
    return;
  }

  if (!this.sandbox) {
    this.sandbox = (0,_sandbox__WEBPACK_IMPORTED_MODULE_3__.createSandbox)(function (chart) {
      var option = chart.getOption();

      if (typeof option.backgroundColor === 'string' && option.backgroundColor !== 'transparent') {
        _this.backgroundColor = option.backgroundColor;
      } else {
        _this.backgroundColor = '#fff';
      }
    });
  }

  try {
    var updateTime = this.sandbox.run(this.$el.querySelector('.chart-container'), _common_store__WEBPACK_IMPORTED_MODULE_0__.store);
    log(this.$t('editor.chartOK') + updateTime + 'ms'); // Find the appropriate throttle time

    var debounceTime = 500;
    var debounceTimeQuantities = [0, 500, 2000, 5000, 10000];

    for (var i = debounceTimeQuantities.length - 1; i >= 0; i--) {
      var quantity = debounceTimeQuantities[i];
      var preferredDebounceTime = debounceTimeQuantities[i + 1] || 1000000;

      if (updateTime >= quantity && this.debouncedTime !== preferredDebounceTime) {
        this.debouncedRun = lodash_debounce__WEBPACK_IMPORTED_MODULE_4___default()(run, preferredDebounceTime, {
          trailing: true
        });
        this.debouncedTime = preferredDebounceTime;
        break;
      }
    } // Update run hash to let others known chart has been changed.


    (0,_common_store__WEBPACK_IMPORTED_MODULE_0__.updateRunHash)();
  } catch (e) {
    log(this.$t('editor.errorInEditor'), 'error');
    console.error(e);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['inEditor'],
  data: function data() {
    return {
      shared: _common_store__WEBPACK_IMPORTED_MODULE_0__.store,
      debouncedTime: undefined,
      backgroundColor: '',
      autoRun: true,
      loading: false,
      isGL: isGL
    };
  },
  mounted: function mounted() {
    var _this2 = this;

    this.loading = true;
    ensureECharts().then(function () {
      _this2.loading = false;

      if (_common_store__WEBPACK_IMPORTED_MODULE_0__.store.runCode) {
        _this2.run();
      }
    });
    (0,resize_detector__WEBPACK_IMPORTED_MODULE_5__.addListener)(this.$el, function () {
      if (_this2.sandbox) {
        _this2.sandbox.resize();
      }
    });
  },
  computed: {
    editLink: function editLink() {
      var params = ['c=' + _common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS.c];

      if (_common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS.theme) {
        params.push(['theme=' + _common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS.theme]);
      }

      if (_common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS.gl) {
        params.push(['gl=' + _common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS.gl]);
      }

      return './editor.html?' + params.join('&');
    }
  },
  watch: {
    'shared.runCode': function sharedRunCode(val) {
      if (this.autoRun || !this.sandbox) {
        if (!this.debouncedRun) {
          // First run
          this.run();
        } else {
          this.debouncedRun();
        }
      }
    },
    'shared.renderer': function sharedRenderer() {
      this.refreshAll();
    },
    'shared.darkMode': function sharedDarkMode() {
      this.refreshAll();
    },
    'shared.enableDecal': function sharedEnableDecal() {
      this.refreshAll();
    },
    'shared.useDirtyRect': function sharedUseDirtyRect() {
      this.refreshAll();
    }
  },
  methods: {
    run: run,
    // debouncedRun will be created at first run
    // debouncedRun: null,
    refreshAll: function refreshAll() {
      this.dispose();
      this.run();
    },
    dispose: function dispose() {
      if (this.sandbox) {
        this.sandbox.dispose();
      }
    },
    downloadExample: function downloadExample() {
      (0,_downloadExample__WEBPACK_IMPORTED_MODULE_8__.download)();
    },
    screenshot: function screenshot() {
      if (this.sandbox) {
        var url = this.sandbox.getDataURL();
        var $a = document.createElement('a');
        $a.download = _common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS.c + '.' + (_common_store__WEBPACK_IMPORTED_MODULE_0__.store.renderer === 'svg' ? 'svg' : 'png');
        $a.target = '_blank';
        $a.href = url;
        var evt = new MouseEvent('click', {
          bubbles: true,
          cancelable: false
        });
        $a.dispatchEvent(evt);
      }
    },
    getOption: function getOption() {
      return this.sandbox && this.sandbox.getOption();
    } // hasEditorError() {
    //     const annotations = this.editor.getSession().getAnnotations();
    //     for (let aid = 0, alen = annotations.length; aid < alen; ++aid) {
    //         if (annotations[aid].type === 'error') {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/View.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/View.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _Preview_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Preview.vue */ "./src/editor/Preview.vue");
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/store */ "./src/common/store.js");
//
//
//
//


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    Preview: _Preview_vue__WEBPACK_IMPORTED_MODULE_0__.default
  },
  mounted: function mounted() {
    (0,_common_store__WEBPACK_IMPORTED_MODULE_1__.loadExampleCode)().then(function (code) {
      _common_store__WEBPACK_IMPORTED_MODULE_1__.store.runCode = (0,_common_store__WEBPACK_IMPORTED_MODULE_1__.parseSourceCode)(code);
    });
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/ExampleCard.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/ExampleCard.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/store */ "./src/common/store.js");
/* harmony import */ var _common_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/config */ "./src/common/config.js");
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  props: ['example'],
  computed: {
    title: function title() {
      return (_common_store__WEBPACK_IMPORTED_MODULE_0__.store.locale === 'zh' ? this.example.titleCN : this.example.title) || this.example.title || '';
    },
    showSubtitle: function showSubtitle() {
      return _common_store__WEBPACK_IMPORTED_MODULE_0__.store.locale === 'zh';
    },
    subtitle: function subtitle() {
      return this.example.title || '';
    },
    exampleTheme: function exampleTheme() {
      var example = this.example;
      return example.theme || (_common_store__WEBPACK_IMPORTED_MODULE_0__.store.darkMode ? 'dark' : '');
    },
    exampleLink: function exampleLink() {
      var example = this.example;
      var hash = ['c=' + example.id];
      var exampleTheme = this.exampleTheme;

      if (example.isGL) {
        hash.push('gl=1');
      }

      if (exampleTheme) {
        hash.push('theme=' + exampleTheme);
      }

      if ('local' in _common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS) {
        hash.push('local');
      }

      if ('useDirtyRect' in _common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS) {
        hash.push('useDirtyRect');
      }

      return './editor.html?' + hash.join('&');
    },
    screenshotURL: function screenshotURL() {
      var example = this.example;
      var themePostfix = this.exampleTheme ? '-' + this.exampleTheme : '';
      var ext = _common_config__WEBPACK_IMPORTED_MODULE_1__.SUPPORT_WEBP ? 'webp' : 'png';
      var folder = example.isGL ? 'data-gl' : 'data';
      return "".concat(_common_store__WEBPACK_IMPORTED_MODULE_0__.store.cdnRoot, "/").concat(folder, "/thumb").concat(themePostfix, "/").concat(example.id, ".").concat(ext, "?_v_=").concat(_common_store__WEBPACK_IMPORTED_MODULE_0__.store.version);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/Explore.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/Explore.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _data_chart_list_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../data/chart-list-data */ "./src/data/chart-list-data.js");
/* harmony import */ var _data_chart_list_data_gl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../data/chart-list-data-gl */ "./src/data/chart-list-data-gl.js");
/* harmony import */ var _common_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/config */ "./src/common/config.js");
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/store */ "./src/common/store.js");
/* harmony import */ var _ExampleCard_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ExampleCard.vue */ "./src/explore/ExampleCard.vue");
/* harmony import */ var vanilla_lazyload_dist_lazyload_esm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vanilla-lazyload/dist/lazyload.esm */ "./node_modules/vanilla-lazyload/dist/lazyload.esm.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





 // import scrollIntoView from 'scroll-into-view';

var icons = {};
['line', 'bar', 'scatter', 'pie', 'radar', 'funnel', 'gauge', 'map', 'graph', 'treemap', 'parallel', 'sankey', 'candlestick', 'boxplot', 'heatmap', 'pictorialBar', 'themeRiver', 'calendar', 'custom', 'sunburst', 'tree', 'dataset', 'geo', 'lines', 'dataZoom', 'rich', 'drag'].forEach(function (category) {
  icons[category] = __webpack_require__("./src/asset/icon sync recursive ^\\.\\/.*\\.svg$")("./" + category + ".svg");
});

var glIcon = __webpack_require__(/*! ../asset/icon/gl.svg */ "./src/asset/icon/gl.svg");

['globe', 'bar3D', 'scatter3D', 'surface', 'map3D', 'lines3D', 'line3D', 'scatterGL', 'linesGL', 'flowGL', 'graphGL', 'geo3D'].forEach(function (category) {
  icons[category] = glIcon;
});
var LAZY_LOADED_CLASS = 'ec-shot-loaded';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  components: {
    ExampleCard: _ExampleCard_vue__WEBPACK_IMPORTED_MODULE_4__.default
  },
  data: function data() {
    var exampleListByCategory = {};

    function addExamples(list, isGL) {
      var categoryOrder = 0; // Add by category order in each example.

      do {
        var added = false;

        for (var i = 0; i < list.length; i++) {
          var example = list[i];

          if (_common_config__WEBPACK_IMPORTED_MODULE_2__.BLACK_MAP.hasOwnProperty(example.id)) {
            continue;
          }

          if (typeof example.category === 'string') {
            example.category = [example.category];
          }

          var categoryStr = (example.category || [])[categoryOrder];

          if (categoryStr) {
            added = true;
            var categoryObj = exampleListByCategory[categoryStr];

            if (!categoryObj) {
              categoryObj = {
                category: categoryStr,
                examples: []
              };
              exampleListByCategory[categoryStr] = categoryObj;
            }

            example.isGL = isGL;
            categoryObj.examples.push(example);
          }
        }

        if (!added) {
          break;
        }
      } while (++categoryOrder && categoryOrder < 4); // At most 4 category

    }

    addExamples(_data_chart_list_data__WEBPACK_IMPORTED_MODULE_0__.default, false);
    addExamples(_data_chart_list_data_gl__WEBPACK_IMPORTED_MODULE_1__.default, true);
    return {
      shared: _common_store__WEBPACK_IMPORTED_MODULE_3__.store,
      icons: icons,
      EXAMPLE_CATEGORIES: _common_config__WEBPACK_IMPORTED_MODULE_2__.EXAMPLE_CATEGORIES,
      // [{
      //  category: '',
      //  isGL: false
      //  examples: []
      // }]
      exampleListByCategory: exampleListByCategory
    };
  },
  watch: {
    "shared.darkMode": function sharedDarkMode() {
      var imgs = this.$el.querySelectorAll('img.chart-area');

      for (var i = 0; i < imgs.length; i++) {
        // Force lazyload to update
        imgs[i].classList.remove(LAZY_LOADED_CLASS);
        imgs[i].setAttribute('data-was-processed', 'false');
      }

      this._lazyload.update();
    }
  },
  computed: {
    exampleList: function exampleList() {
      var list = [];

      for (var i = 0; i < _common_config__WEBPACK_IMPORTED_MODULE_2__.EXAMPLE_CATEGORIES.length; i++) {
        var category = _common_config__WEBPACK_IMPORTED_MODULE_2__.EXAMPLE_CATEGORIES[i];
        var categoryObj = this.exampleListByCategory[category];

        if (categoryObj && categoryObj.examples.length > 0) {
          list.push({
            category: category,
            examples: categoryObj.examples
          });
        }
      }

      return list;
    }
  },
  mounted: function mounted() {
    this._lazyload = new vanilla_lazyload_dist_lazyload_esm__WEBPACK_IMPORTED_MODULE_5__.default({
      // Container should be the scroll viewport.
      // container: this.$el.querySelector('#explore-container .example-list-panel'),
      elements_selector: 'img.chart-area',
      load_delay: 400,
      class_loaded: LAZY_LOADED_CLASS
    });
  },
  methods: {
    onActiveNavChanged: function onActiveNavChanged(event, currentItem, lastActiveItem) {// currentItem && currentItem.scrollIntoView && currentItem.parentNode.scrollIntoView();
      // scrollIntoView(currentItem, {
      //     time: 100,
      //     cancellable: false,
      //     align: {
      //         top: 0,
      //         topOffset: 50
      //     }
      // });
    }
  }
});

/***/ }),

/***/ "./src/common/config.js":
/*!******************************!*\
  !*** ./src/common/config.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EXAMPLE_CATEGORIES": () => /* binding */ EXAMPLE_CATEGORIES,
/* harmony export */   "THEMES": () => /* binding */ THEMES,
/* harmony export */   "BLACK_MAP": () => /* binding */ BLACK_MAP,
/* harmony export */   "URL_PARAMS": () => /* binding */ URL_PARAMS,
/* harmony export */   "SUPPORT_WEBP": () => /* binding */ SUPPORT_WEBP,
/* harmony export */   "SCRIPT_URLS": () => /* binding */ SCRIPT_URLS
/* harmony export */ });
var EXAMPLE_CATEGORIES = ['line', 'bar', 'pie', 'scatter', 'map', 'candlestick', 'radar', 'boxplot', 'heatmap', 'graph', 'lines', 'tree', 'treemap', 'sunburst', 'parallel', 'sankey', 'funnel', 'gauge', 'pictorialBar', 'themeRiver', 'calendar', 'custom', 'dataset', 'dataZoom', 'drag', 'rich', 'globe', 'bar3D', 'scatter3D', 'surface', 'map3D', 'lines3D', 'line3D', 'scatterGL', 'linesGL', 'flowGL', 'graphGL'];
var THEMES = {
  "default": ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
  dark: ['#4992ff', '#7cffb2', '#fddd60', '#ff6e76', '#58d9f9', '#05c091', '#ff8a45', '#8d48e3', '#dd79ff']
};
var BLACK_MAP = function (list) {
  var map = {};

  for (var i = 0; i < list.length; i++) {
    map[list[i]] = 1;
  }

  return location.href.indexOf('github.io') >= 0 ? {} : map;
}(['effectScatter-map', 'geo-lines', 'geo-map-scatter', 'heatmap-map', 'lines-airline', 'map-china', 'map-china-dataRange', 'map-labels', 'map-locate', 'map-province', 'map-world', 'map-world-dataRange', 'scatter-map', 'scatter-map-brush', 'scatter-weibo', 'scatter-world-population', 'geo3d', 'geo3d-with-different-height', 'globe-country-carousel', 'globe-with-echarts-surface', 'map3d-alcohol-consumption', 'map3d-wood-map', 'scattergl-weibo']);
var URL_PARAMS = {};
(location.search || '').substr(1).split('&').forEach(function (item) {
  var kv = item.split('=');
  URL_PARAMS[kv[0]] = kv[1];
});

var SUPPORT_WEBP = function () {
  var elem = document.createElement('canvas');
  elem.width = elem.height = 1;

  if (!!(elem.getContext && elem.getContext('2d'))) {
    // was able or not to get WebP representation
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } // very old browser like IE 8, canvas not supported


  return false;
}(); // export const SCRIPT_URLS = {
//     localEChartsMinJS: 'http://localhost/echarts/dist/echarts.js',
//     echartsMinJS: 'https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js',
//     echartsDir: 'https://cdn.jsdelivr.net/npm/echarts@5',
//     echartsStatMinJS: 'https://cdn.jsdelivr.net/npm/echarts-stat@latest/dist/ecStat.min.js',
//     // echartsGLMinJS: 'http://localhost/echarts-gl/dist/echarts-gl.min.js',
//     echartsGLMinJS: 'https://cdn.jsdelivr.net/npm/echarts-gl@2/dist/echarts-gl.min.js',
//     datGUIMinJS: 'https://cdn.jsdelivr.net/npm/dat.gui@0.6.5/build/dat.gui.min.js',
//     monacoDir: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/min/vs',
//     aceDir: 'https://cdn.jsdelivr.net/npm/ace-builds@1.4.12/src-min-noconflict'
// };

var SCRIPT_URLS = {
  localEChartsMinJS: 'http://localhost:8086/dependent/echarts.js',
  echartsMinJS: 'http://localhost:8086/dependent/echarts.min.js',
  echartsDir: 'http://localhost:8086/dependent/web',
  echartsStatMinJS: 'http://localhost:8086/dependent/ecStat.min.js',
  // echartsGLMinJS: 'http://localhost/echarts-gl/dist/echarts-gl.min.js',
  echartsGLMinJS: 'http://localhost:8086/dependent/echarts-gl.min.js',
  datGUIMinJS: 'http://localhost:8086/dependent/dat.gui.min.js',
  monacoDir: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/min/vs',
  aceDir: 'http://localhost:8086/dependent/web'
};

/***/ }),

/***/ "./src/common/helper.js":
/*!******************************!*\
  !*** ./src/common/helper.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadScriptsAsync": () => /* binding */ loadScriptsAsync,
/* harmony export */   "downloadBlob": () => /* binding */ downloadBlob
/* harmony export */ });
var promisesCache = {};
function loadScriptsAsync(scripts) {
  return Promise.all(scripts.map(function (scriptUrl) {
    if (typeof scriptUrl === 'string') {
      scriptUrl = {
        url: scriptUrl,
        // TODO Not supported type
        type: scriptUrl.match(/\.css$/) ? 'css' : 'js'
      };
    }

    if (promisesCache[scriptUrl.url]) {
      return promisesCache[scriptUrl.url];
    }

    var promise = new Promise(function (resolve, reject) {
      if (scriptUrl.type === 'js') {
        var script = document.createElement('script');
        script.src = scriptUrl.url;
        script.async = false;

        script.onload = function () {
          resolve();
        };

        script.onerror = function () {
          reject();
        };

        document.body.appendChild(script);
      } else if (scriptUrl.type === 'css') {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = scriptUrl.url;

        link.onload = function () {
          resolve();
        };

        link.onerror = function () {
          reject();
        };

        document.body.appendChild(link);
      }
    });
    promisesCache[scriptUrl.url] = promise;
    return promise;
  }));
}
function downloadBlob(blob, fileName) {
  // for IE
  if (typeof window.navigator.msSaveBlob === 'function') {
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    a.click(); // should revoke the blob url after the download

    URL.revokeObjectURL(a.href);
  }
}

/***/ }),

/***/ "./src/common/i18n.js":
/*!****************************!*\
  !*** ./src/common/i18n.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  en: {
    editor: {
      run: 'Run',
      errorInEditor: 'Errors exist in code!',
      chartOK: 'Chart has been generated successfully, ',
      darkMode: 'Dark Mode',
      enableDecal: 'Decal Pattern',
      // lightMode: 'Light Mode',
      renderCfgTitle: 'Render',
      renderer: 'Renderer',
      useDirtyRect: 'Use Dirty Rect',
      download: 'Download',
      edit: 'Edit',
      monacoMode: 'Enable Type Checking',
      tabEditor: 'Edit Example',
      tabFullCodePreview: 'Full Code',
      tabOptionPreview: 'Option Preview',
      minimalBundle: 'Minimal Bundle'
    },
    chartTypes: {
      line: 'Line',
      bar: 'Bar',
      pie: 'Pie',
      scatter: 'Scatter',
      map: 'GEO/Map',
      candlestick: 'Candlestick',
      radar: 'Radar',
      boxplot: 'Boxplot',
      heatmap: 'Heatmap',
      graph: 'Graph',
      lines: 'Lines',
      tree: 'Tree',
      treemap: 'Treemap',
      sunburst: 'Sunburst',
      parallel: 'Parallel',
      sankey: 'Sankey',
      funnel: 'Funnel',
      gauge: 'Gauge',
      pictorialBar: 'PictorialBar',
      themeRiver: 'ThemeRiver',
      calendar: 'Calendar',
      custom: 'Custom',
      dataset: 'Dataset',
      dataZoom: 'DataZoom',
      drag: 'Drag',
      rich: 'Rich Text',
      globe: '3D Globe',
      bar3D: '3D Bar',
      scatter3D: '3D Scatter',
      surface: '3D Surface',
      map3D: '3D Map',
      lines3D: '3D Lines',
      line3D: '3D Line',
      scatterGL: 'Scatter GL',
      linesGL: 'Lines GL',
      flowGL: 'Flow GL',
      graphGL: 'Graph GL'
    }
  },
  zh: {
    editor: {
      run: '运行',
      errorInEditor: '编辑器内容有误！',
      chartOK: '图表已生成, ',
      darkMode: '深色模式',
      enableDecal: '无障碍花纹',
      // lightMode: '浅色模式',
      renderCfgTitle: '渲染设置',
      useDirtyRect: '开启脏矩形优化',
      renderer: '渲染模式',
      download: '下载示例',
      edit: '编辑',
      monacoMode: '开启类型检查',
      tabEditor: '示例编辑',
      tabFullCodePreview: '完整代码',
      tabOptionPreview: '配置项',
      minimalBundle: '按需引入'
    },
    chartTypes: {
      line: '折线图',
      bar: '柱状图',
      pie: '饼图',
      scatter: '散点图',
      map: '地理坐标/地图',
      candlestick: 'K 线图',
      radar: '雷达图',
      boxplot: '盒须图',
      heatmap: '热力图',
      graph: '关系图',
      lines: '路径图',
      tree: '树图',
      treemap: '矩形树图',
      sunburst: '旭日图',
      parallel: '平行坐标系',
      sankey: '桑基图',
      funnel: '漏斗图',
      gauge: '仪表盘',
      pictorialBar: '象形柱图',
      themeRiver: '主题河流图',
      calendar: '日历坐标系',
      custom: '自定义系列',
      dataset: '数据集',
      dataZoom: '数据区域缩放',
      drag: '拖拽',
      rich: '富文本',
      globe: '3D 地球',
      bar3D: '3D 柱状图',
      scatter3D: '3D 散点图',
      surface: '3D 曲面',
      map3D: '3D 地图',
      lines3D: '3D 路径图',
      line3D: '3D 折线图',
      scatterGL: 'GL 散点图',
      linesGL: 'GL 路径图',
      flowGL: 'GL 矢量场图',
      graphGL: 'GL 关系图'
    }
  }
});

/***/ }),

/***/ "./src/common/store.js":
/*!*****************************!*\
  !*** ./src/common/store.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "store": () => /* binding */ store,
/* harmony export */   "loadExampleCode": () => /* binding */ loadExampleCode,
/* harmony export */   "parseSourceCode": () => /* binding */ parseSourceCode,
/* harmony export */   "updateRunHash": () => /* binding */ updateRunHash
/* harmony export */ });
/* harmony import */ var _common_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/config */ "./src/common/config.js");
// import * as matter from 'gray-matter';

var store = {
  cdnRoot: '',
  version: '',
  locale: '',
  darkMode: _common_config__WEBPACK_IMPORTED_MODULE_0__.URL_PARAMS.theme === 'dark',
  enableDecal: 'decal' in _common_config__WEBPACK_IMPORTED_MODULE_0__.URL_PARAMS,
  renderer: _common_config__WEBPACK_IMPORTED_MODULE_0__.URL_PARAMS.renderer || 'canvas',
  typeCheck: _common_config__WEBPACK_IMPORTED_MODULE_0__.URL_PARAMS.editor === 'monaco',
  useDirtyRect: 'useDirtyRect' in _common_config__WEBPACK_IMPORTED_MODULE_0__.URL_PARAMS,
  runCode: '',
  sourceCode: '',
  runHash: '',
  isMobile: window.innerWidth < 600,
  editorStatus: {
    type: '',
    message: ''
  }
};
function loadExampleCode() {
  return new Promise(function (resolve) {
    var dataRoot = _common_config__WEBPACK_IMPORTED_MODULE_0__.URL_PARAMS.gl ? 'data-gl' : 'data';
    $.ajax("".concat(store.cdnRoot, "/").concat(dataRoot, "/").concat(_common_config__WEBPACK_IMPORTED_MODULE_0__.URL_PARAMS.c, ".js?_v_").concat(store.version), {
      dataType: 'text',
      success: function success(data) {
        resolve(data);
      }
    });
  });
}
function parseSourceCode(code) {
  return code.replace(/\/\*[\w\W]*?\*\//, '').trim();
}
var hashId = 123;
function updateRunHash() {
  store.runHash = hashId++;
}

/***/ }),

/***/ "./src/data/chart-list-data-gl.js":
/*!****************************************!*\
  !*** ./src/data/chart-list-data-gl.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* eslint-disable */
// THIS FILE IS GENERATED, DON'T MODIFY */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([{
  "category": ["globe"],
  "id": "animating-contour-on-globe",
  "tags": [],
  "title": "Animating Contour on Globe",
  "titleCN": "Animating Contour on Globe",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "bar3d-dataset",
  "tags": [],
  "title": "3D Bar with Dataset",
  "titleCN": "使用 dataset 为三维柱状图设置数据",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "bar3d-global-population",
  "tags": [],
  "title": "Bar3D - Global Population",
  "titleCN": "Bar3D - Global Population",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "bar3d-myth",
  "tags": [],
  "title": "星云",
  "titleCN": "星云",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "bar3d-noise-modified-from-marpi-demo",
  "tags": [],
  "title": "Noise modified from marpi's demo",
  "titleCN": "Noise modified from marpi's demo",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "bar3d-punch-card",
  "tags": [],
  "title": "Bar3D - Punch Card",
  "titleCN": "Bar3D - Punch Card",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "bar3d-simplex-noise",
  "tags": [],
  "theme": "dark",
  "title": "Bar3D - Simplex Noise",
  "titleCN": "Bar3D - Simplex Noise",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "bar3d-voxelize-image",
  "tags": [],
  "title": "Voxelize image",
  "titleCN": "Voxelize image",
  "difficulty": 10
}, {
  "category": ["flowGL"],
  "id": "flowGL-noise",
  "tags": [],
  "theme": "dark",
  "title": "Flow on the cartesian",
  "titleCN": "直角坐标系上的向量场",
  "difficulty": 10
}, {
  "category": ["geo3D"],
  "id": "geo3d",
  "tags": [],
  "title": "Geo3D",
  "titleCN": "Geo3D",
  "difficulty": 10
}, {
  "category": ["geo3D"],
  "id": "geo3d-with-different-height",
  "tags": [],
  "title": "Geo3D with Different Height",
  "titleCN": "Geo3D with Different Height",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "global-population-bar3d-on-globe",
  "tags": [],
  "title": "Global Population - Bar3D on Globe",
  "titleCN": "Global Population - Bar3D on Globe",
  "difficulty": 10
}, {
  "category": ["flowGL"],
  "id": "global-wind-visualization",
  "tags": ["bmap"],
  "title": "Global wind visualization",
  "titleCN": "Global wind visualization",
  "difficulty": 10
}, {
  "category": ["flowGL"],
  "id": "global-wind-visualization-2",
  "tags": ["bmap"],
  "title": "Global Wind Visualization 2",
  "titleCN": "Global Wind Visualization 2",
  "difficulty": 10
}, {
  "category": ["globe"],
  "id": "globe-atmosphere",
  "tags": [],
  "title": "Globe with Atmosphere",
  "titleCN": "大气层显示",
  "difficulty": 10
}, {
  "category": ["globe"],
  "id": "globe-contour-paint",
  "tags": [],
  "title": "Contour Paint",
  "titleCN": "Contour Paint",
  "difficulty": 10
}, {
  "category": ["globe"],
  "id": "globe-country-carousel",
  "tags": [],
  "title": "Country Carousel",
  "titleCN": "Country Carousel",
  "difficulty": 10
}, {
  "category": ["globe"],
  "id": "globe-displacement",
  "tags": [],
  "title": "Globe Displacement",
  "titleCN": "Globe Displacement",
  "difficulty": 10
}, {
  "category": ["globe"],
  "id": "globe-echarts-gl-hello-world",
  "tags": [],
  "title": "ECharts-GL Hello World",
  "titleCN": "ECharts-GL Hello World",
  "difficulty": 10
}, {
  "category": ["globe"],
  "id": "globe-layers",
  "tags": [],
  "title": "Globe Layers",
  "titleCN": "Globe Layers",
  "difficulty": 10
}, {
  "category": ["globe"],
  "id": "globe-moon",
  "tags": [],
  "title": "Moon",
  "titleCN": "Moon",
  "difficulty": 10
}, {
  "category": ["globe"],
  "id": "globe-with-echarts-surface",
  "tags": [],
  "title": "Globe with ECharts Surface",
  "titleCN": "Globe with ECharts Surface",
  "difficulty": 10
}, {
  "category": ["graphGL"],
  "id": "graphgl-gpu-layout",
  "tags": [],
  "theme": "dark",
  "title": "GraphGL GPU Layout",
  "titleCN": "GraphGL GPU Layout",
  "difficulty": 10
}, {
  "category": ["graphGL"],
  "id": "graphgl-large-internet",
  "tags": [],
  "theme": "dark",
  "title": "GraphGL - Large Internet",
  "titleCN": "GraphGL - Large Internet",
  "difficulty": 10
}, {
  "category": ["graphGL"],
  "id": "graphgl-npm-dep",
  "tags": [],
  "theme": "dark",
  "title": "NPM Dependencies with graphGL",
  "titleCN": "1w 节点 2w7 边的NPM 依赖图",
  "difficulty": 10
}, {
  "category": ["surface"],
  "id": "image-surface-sushuang",
  "tags": [],
  "title": "Image Surface Sushuang",
  "titleCN": "Image Surface Sushuang",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "image-to-bar3d",
  "tags": [],
  "title": "Image to Bar3D",
  "titleCN": "Image to Bar3D",
  "difficulty": 10
}, {
  "category": ["globe"],
  "id": "iron-globe",
  "tags": [],
  "title": "Iron globe",
  "titleCN": "Iron globe",
  "difficulty": 10
}, {
  "category": ["line3D"],
  "id": "line3d-orthographic",
  "tags": [],
  "title": "三维折线图正交投影",
  "titleCN": "三维折线图正交投影",
  "difficulty": 10
}, {
  "category": ["lines3D"],
  "id": "lines3d-airline-on-globe",
  "tags": [],
  "title": "Airline on Globe",
  "titleCN": "Airline on Globe",
  "difficulty": 10
}, {
  "category": ["lines3D"],
  "id": "lines3d-flights",
  "tags": [],
  "title": "Flights",
  "titleCN": "Flights",
  "difficulty": 10
}, {
  "category": ["lines3D"],
  "id": "lines3d-flights-gl",
  "tags": [],
  "title": "Flights GL",
  "titleCN": "Flights GL",
  "difficulty": 10
}, {
  "category": ["lines3D"],
  "id": "lines3d-flights-on-geo3d",
  "tags": [],
  "title": "Flights on Geo3D",
  "titleCN": "Flights on Geo3D",
  "difficulty": 10
}, {
  "category": ["linesGL"],
  "id": "linesGL-ny",
  "tags": [],
  "title": "Use linesGL to draw 1 million ny streets.",
  "titleCN": "实时交互的纽约街道可视化",
  "difficulty": 10
}, {
  "category": ["map3D"],
  "id": "map3d-alcohol-consumption",
  "tags": [],
  "title": "Map3D - Alcohol Consumption",
  "titleCN": "Map3D - Alcohol Consumption",
  "difficulty": 10
}, {
  "category": ["map3D"],
  "id": "map3d-buildings",
  "tags": [],
  "title": "Buildings",
  "titleCN": "Buildings",
  "difficulty": 10
}, {
  "category": ["map3D"],
  "id": "map3d-wood-city",
  "tags": [],
  "title": "Wood City",
  "titleCN": "Wood City",
  "difficulty": 10
}, {
  "category": ["map3D"],
  "id": "map3d-wood-map",
  "tags": [],
  "title": "木质世界地图",
  "titleCN": "木质世界地图",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "metal-bar3d",
  "tags": [],
  "title": "Metal Bar3D",
  "titleCN": "Metal Bar3D",
  "difficulty": 10
}, {
  "category": ["surface"],
  "id": "metal-surface",
  "tags": [],
  "title": "Metal Surface",
  "titleCN": "Metal Surface",
  "difficulty": 10
}, {
  "category": ["surface"],
  "id": "parametric-surface-rose",
  "tags": [],
  "title": "Parametric Surface Rose",
  "titleCN": "Parametric Surface Rose",
  "difficulty": 10
}, {
  "category": ["scatter3D"],
  "id": "scatter3d",
  "tags": [],
  "theme": "dark",
  "title": "Scatter3D",
  "titleCN": "Scatter3D",
  "difficulty": 10
}, {
  "category": ["scatter3D"],
  "id": "scatter3D-dataset",
  "tags": [],
  "title": "3D Scatter with Dataset",
  "titleCN": "使用 dataset 为三维散点图设置数据",
  "difficulty": 10
}, {
  "category": ["scatter3D"],
  "id": "scatter3d-globe-population",
  "tags": [],
  "title": "Scatter3D - Globe Population",
  "titleCN": "Scatter3D - Globe Population",
  "difficulty": 10
}, {
  "category": ["scatter3D"],
  "id": "scatter3d-orthographic",
  "tags": [],
  "theme": "dark",
  "title": "三维散点图正交投影",
  "titleCN": "三维散点图正交投影",
  "difficulty": 10
}, {
  "category": ["scatter3D"],
  "id": "scatter3d-scatter",
  "tags": [],
  "title": "3D Scatter with Scatter Matrix",
  "titleCN": "三维散点图和散点矩阵结合使用",
  "difficulty": 10
}, {
  "category": ["scatter3D"],
  "id": "scatter3d-simplex-noise",
  "tags": [],
  "theme": "dark",
  "title": "Scatter3D - Simplex Noise",
  "titleCN": "Scatter3D - Simplex Noise",
  "difficulty": 10
}, {
  "category": ["scatterGL"],
  "id": "scatterGL-gps",
  "tags": [],
  "title": "10 million Bulk GPS points",
  "titleCN": "1 千万 GPS 点可视化",
  "difficulty": 10
}, {
  "category": ["scatterGL"],
  "id": "scattergl-weibo",
  "tags": [],
  "theme": "dark",
  "title": "微博签到数据点亮中国",
  "titleCN": "微博签到数据点亮中国",
  "difficulty": 10
}, {
  "category": ["surface"],
  "id": "simple-surface",
  "tags": [],
  "title": "Simple Surface",
  "titleCN": "Simple Surface",
  "difficulty": 10
}, {
  "category": ["surface"],
  "id": "sphere-parametric-surface",
  "tags": [],
  "title": "Sphere Parametric Surface",
  "titleCN": "Sphere Parametric Surface",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "stacked-bar3d",
  "tags": [],
  "title": "Stacked Bar3D",
  "titleCN": "Stacked Bar3D",
  "difficulty": 10
}, {
  "category": ["surface"],
  "id": "surface-breather",
  "tags": [],
  "title": "Breather",
  "titleCN": "Breather",
  "difficulty": 10
}, {
  "category": ["surface"],
  "id": "surface-golden-rose",
  "tags": [],
  "title": "Golden Rose",
  "titleCN": "Golden Rose",
  "difficulty": 10
}, {
  "category": ["surface"],
  "id": "surface-leather",
  "tags": [],
  "title": "皮革材质",
  "titleCN": "皮革材质",
  "difficulty": 10
}, {
  "category": ["surface"],
  "id": "surface-mollusc-shell",
  "tags": [],
  "title": "Mollusc Shell",
  "titleCN": "Mollusc Shell",
  "difficulty": 10
}, {
  "category": ["surface"],
  "id": "surface-theme-roses",
  "tags": [],
  "title": "Theme Roses",
  "titleCN": "Theme Roses",
  "difficulty": 10
}, {
  "category": ["surface"],
  "id": "surface-wave",
  "tags": [],
  "title": "Surface Wave",
  "titleCN": "Surface Wave",
  "difficulty": 10
}, {
  "category": ["bar3D"],
  "id": "transparent-bar3d",
  "tags": [],
  "title": "Transparent Bar3D",
  "titleCN": "Transparent Bar3D",
  "difficulty": 10
}]);

/***/ }),

/***/ "./src/data/chart-list-data.js":
/*!*************************************!*\
  !*** ./src/data/chart-list-data.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* eslint-disable */
// THIS FILE IS GENERATED, DON'T MODIFY */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([{
  "category": ["bar"],
  "id": "bar-background",
  "tags": [],
  "title": "Bar with Background",
  "titleCN": "带背景色的柱状图",
  "difficulty": 0
}, {
  "category": ["custom"],
  "id": "bar-histogram",
  "tags": [],
  "title": "Histogram with Custom Series",
  "titleCN": "直方图（自定义系列）",
  "difficulty": 0
}, {
  "category": ["bar"],
  "id": "bar-simple",
  "tags": [],
  "title": "Basic Bar",
  "titleCN": "基础柱状图",
  "difficulty": 0
}, {
  "category": ["bar"],
  "id": "bar-tick-align",
  "tags": [],
  "title": "Axis Align with Tick",
  "titleCN": "坐标轴刻度与标签对齐",
  "difficulty": 0
}, {
  "category": ["calendar"],
  "id": "calendar-simple",
  "tags": [],
  "title": "Simple Calendar",
  "titleCN": "基础日历图",
  "difficulty": 0
}, {
  "category": ["candlestick"],
  "id": "candlestick-simple",
  "tags": [],
  "title": "Basic Candlestick",
  "titleCN": "基础 K 线图",
  "difficulty": 0
}, {
  "category": ["dataset", "bar", "transform"],
  "id": "data-transform-sort-bar",
  "tags": [],
  "title": "Sort Data in Bar Chart",
  "titleCN": "柱状图排序",
  "difficulty": 0
}, {
  "category": ["heatmap"],
  "id": "heatmap-cartesian",
  "tags": [],
  "title": "Heatmap on Cartesian",
  "titleCN": "笛卡尔坐标系上的热力图",
  "difficulty": 0
}, {
  "category": ["line"],
  "id": "line-simple",
  "tags": [],
  "title": "Basic Line Chart",
  "titleCN": "基础折线图",
  "difficulty": 0
}, {
  "category": ["line"],
  "id": "line-smooth",
  "tags": [],
  "title": "Smoothed Line Chart",
  "titleCN": "基础平滑折线图",
  "difficulty": 0
}, {
  "category": ["pie"],
  "id": "pie-simple",
  "tags": [],
  "title": "Referer of a website",
  "titleCN": "某站点用户访问来源",
  "difficulty": 0
}, {
  "category": ["radar"],
  "id": "radar",
  "tags": [],
  "title": "Basic Radar Chart",
  "titleCN": "基础雷达图",
  "difficulty": 0
}, {
  "category": ["sankey"],
  "id": "sankey-simple",
  "tags": [],
  "title": "Basic Sankey",
  "titleCN": "基础桑基图",
  "difficulty": 0
}, {
  "category": ["scatter"],
  "id": "scatter-simple",
  "tags": [],
  "title": "Basic Scatter Chart",
  "titleCN": "基础散点图",
  "difficulty": 0
}, {
  "category": ["line"],
  "id": "area-basic",
  "tags": [],
  "title": "Basic area chart",
  "titleCN": "基础面积图",
  "difficulty": 1
}, {
  "category": ["bar"],
  "id": "bar-data-color",
  "tags": [],
  "title": "Set Style of Single Bar.",
  "titleCN": "自定义单个柱子颜色",
  "difficulty": 1
}, {
  "category": ["bar"],
  "id": "bar-waterfall",
  "tags": [],
  "title": "Waterfall Chart",
  "titleCN": "瀑布图（柱状图模拟）",
  "difficulty": 1
}, {
  "category": ["calendar", "heatmap"],
  "id": "calendar-heatmap",
  "tags": [],
  "title": "Calendar Heatmap",
  "titleCN": "日历热力图",
  "difficulty": 1
}, {
  "category": ["calendar", "heatmap"],
  "id": "calendar-vertical",
  "tags": [],
  "title": "Calendar Heatmap Vertical",
  "titleCN": "纵向日历图",
  "difficulty": 1
}, {
  "category": ["candlestick"],
  "id": "custom-ohlc",
  "tags": [],
  "title": "OHLC Chart",
  "titleCN": "OHLC 图（使用自定义系列）",
  "difficulty": 1
}, {
  "category": ["custom"],
  "id": "custom-profit",
  "tags": [],
  "title": "Profit",
  "titleCN": "利润分布直方图",
  "difficulty": 1
}, {
  "category": ["dataset", "bar"],
  "id": "dataset-encode0",
  "tags": [],
  "title": "Simple Encode",
  "titleCN": "指定数据到坐标轴的映射",
  "difficulty": 1
}, {
  "category": ["gauge"],
  "id": "gauge",
  "tags": [],
  "title": "Gauge Basic chart",
  "titleCN": "基础仪表盘",
  "difficulty": 1
}, {
  "category": ["gauge"],
  "id": "gauge-simple",
  "tags": [],
  "title": "Simple Gauge",
  "titleCN": "带标签数字动画的基础仪表盘",
  "difficulty": 1
}, {
  "category": ["graph"],
  "id": "graph-force2",
  "tags": [],
  "title": "Force Layout",
  "titleCN": "力引导布局",
  "difficulty": 1
}, {
  "category": ["line"],
  "id": "line-stack",
  "tags": [],
  "title": "Stacked Line Chart",
  "titleCN": "折线图堆叠",
  "difficulty": 1
}, {
  "category": ["parallel"],
  "id": "parallel-simple",
  "tags": [],
  "title": "Basic Parallel",
  "titleCN": "基础平行坐标",
  "difficulty": 1
}, {
  "category": ["pie"],
  "id": "pie-borderRadius",
  "tags": [],
  "title": "Doughnut Chart with Rounded Corner",
  "titleCN": "圆角环形图",
  "difficulty": 1
}, {
  "category": ["pie"],
  "id": "pie-doughnut",
  "tags": [],
  "title": "Doughnut Chart",
  "titleCN": "环形图",
  "difficulty": 1
}, {
  "category": ["radar"],
  "id": "radar-aqi",
  "tags": [],
  "title": "AQI - Radar Chart",
  "titleCN": "AQI - 雷达图",
  "difficulty": 1
}, {
  "category": ["sankey"],
  "id": "sankey-vertical",
  "tags": [],
  "title": "Sankey Orient Vertical",
  "titleCN": "垂直方向的桑基图",
  "difficulty": 1
}, {
  "category": ["scatter"],
  "id": "scatter-anscombe-quartet",
  "tags": [],
  "title": "Anscomb's quartet",
  "titleCN": "Anscomb's quartet",
  "difficulty": 1
}, {
  "category": ["scatter"],
  "id": "scatter-clustering",
  "tags": [],
  "title": "Clustering Process",
  "titleCN": "数据聚合",
  "difficulty": 1
}, {
  "category": ["scatter"],
  "id": "scatter-clustering-process",
  "tags": [],
  "title": "Clustering Process",
  "titleCN": "聚合过程可视化",
  "difficulty": 1
}, {
  "category": ["scatter"],
  "id": "scatter-exponential-regression",
  "tags": [],
  "title": "Exponential Regression",
  "titleCN": "指数回归（使用统计插件）",
  "difficulty": 1
}, {
  "category": ["sunburst"],
  "id": "sunburst-simple",
  "tags": [],
  "title": "Basic Sunburst",
  "titleCN": "基础旭日图",
  "difficulty": 1
}, {
  "category": ["line"],
  "id": "area-stack",
  "tags": [],
  "title": "Stacked area chart",
  "titleCN": "堆叠面积图",
  "difficulty": 2
}, {
  "category": ["line"],
  "id": "area-stack-gradient",
  "tags": [],
  "title": "Gradient Stacked area chart",
  "titleCN": "渐变堆叠面积图",
  "difficulty": 2
}, {
  "category": ["bar"],
  "id": "bar-negative2",
  "tags": [],
  "title": "Bar Chart with Negative Value",
  "titleCN": "交错正负轴标签",
  "difficulty": 2
}, {
  "category": ["bar"],
  "id": "bar-y-category",
  "tags": [],
  "title": "World Total Population",
  "titleCN": "世界人口总量 - 条形图",
  "difficulty": 2
}, {
  "category": ["calendar"],
  "id": "calendar-horizontal",
  "tags": [],
  "title": "Calendar Heatmap Horizontal",
  "titleCN": "横向日力图",
  "difficulty": 2
}, {
  "category": ["candlestick"],
  "id": "candlestick-sh",
  "tags": [],
  "title": "ShangHai Index",
  "titleCN": "上证指数",
  "difficulty": 2
}, {
  "category": ["custom", "dataZoom"],
  "id": "custom-error-scatter",
  "tags": [],
  "title": "Error Scatter on Catesian",
  "titleCN": "使用自定系列给散点图添加误差范围",
  "difficulty": 2
}, {
  "category": ["scatter"],
  "id": "effectScatter-map",
  "tags": [],
  "title": "Air Quality",
  "titleCN": "全国主要城市空气质量",
  "difficulty": 2
}, {
  "category": ["gauge"],
  "id": "gauge-speed",
  "tags": [],
  "title": "Speed Gauge",
  "titleCN": "速度仪表盘",
  "difficulty": 2
}, {
  "category": ["graph"],
  "id": "graph-grid",
  "tags": [],
  "title": "Graph on Cartesian",
  "titleCN": "笛卡尔坐标系上的 Graph",
  "difficulty": 2
}, {
  "category": ["graph"],
  "id": "graph-simple",
  "tags": [],
  "title": "Simple Graph",
  "titleCN": "Graph 简单示例",
  "difficulty": 2
}, {
  "category": ["heatmap"],
  "id": "heatmap-large",
  "tags": [],
  "title": "Heatmap - 2w data",
  "titleCN": "热力图 - 2w 数据",
  "difficulty": 2
}, {
  "category": ["heatmap"],
  "id": "heatmap-large-piecewise",
  "tags": [],
  "title": "Heatmap - Discrete Mapping of Color",
  "titleCN": "热力图 - 颜色的离散映射",
  "difficulty": 2
}, {
  "category": ["line"],
  "id": "line-marker",
  "tags": [],
  "title": "Temperature Change in the coming week",
  "titleCN": "未来一周气温变化",
  "difficulty": 2
}, {
  "category": ["parallel"],
  "id": "parallel-aqi",
  "tags": [],
  "title": "Parallel Aqi",
  "titleCN": "AQI 分布（平行坐标）",
  "difficulty": 2
}, {
  "category": ["pie"],
  "id": "pie-custom",
  "tags": [],
  "title": "Customized Pie",
  "titleCN": "饼图自定义样式",
  "difficulty": 2
}, {
  "category": ["pie"],
  "id": "pie-pattern",
  "tags": [],
  "title": "Texture on Pie Chart",
  "titleCN": "饼图纹理",
  "difficulty": 2
}, {
  "category": ["pie"],
  "id": "pie-roseType",
  "tags": [],
  "title": "Nightingale's Rose Diagram",
  "titleCN": "南丁格尔玫瑰图",
  "difficulty": 2
}, {
  "category": ["pie"],
  "id": "pie-roseType-simple",
  "tags": [],
  "title": "Nightingale's Rose Diagram",
  "titleCN": "基础南丁格尔玫瑰图",
  "difficulty": 2
}, {
  "category": ["radar"],
  "id": "radar-custom",
  "tags": [],
  "title": "Customized Radar Chart",
  "titleCN": "自定义雷达图",
  "difficulty": 2
}, {
  "category": ["sankey"],
  "id": "sankey-itemstyle",
  "tags": [],
  "title": "Specify ItemStyle for Each Node in Sankey",
  "titleCN": "桑基图节点自定义样式",
  "difficulty": 2
}, {
  "category": ["sankey"],
  "id": "sankey-levels",
  "tags": [],
  "title": "Sankey with Levels Setting",
  "titleCN": "桑基图层级自定义样式",
  "difficulty": 2
}, {
  "category": ["scatter"],
  "id": "scatter-effect",
  "tags": [],
  "title": "Effect Scatter Chart",
  "titleCN": "涟漪特效散点图",
  "difficulty": 2
}, {
  "category": ["scatter"],
  "id": "scatter-linear-regression",
  "tags": [],
  "title": "Linear Regression",
  "titleCN": "线性回归（使用统计插件）",
  "difficulty": 2
}, {
  "category": ["scatter"],
  "id": "scatter-polynomial-regression",
  "tags": [],
  "title": "Polynomial Regression",
  "titleCN": "多项式回归（使用统计插件）",
  "difficulty": 2
}, {
  "category": ["sunburst"],
  "id": "sunburst-borderRadius",
  "tags": [],
  "title": "Sunburst with Rounded Corner",
  "titleCN": "圆角旭日图",
  "difficulty": 2
}, {
  "category": ["sunburst"],
  "id": "sunburst-label-rotate",
  "tags": [],
  "title": "Sunburst Label Rotate",
  "titleCN": "旭日图标签旋转",
  "difficulty": 2
}, {
  "category": ["line", "visualMap"],
  "id": "area-pieces",
  "tags": [],
  "title": "Area Pieces",
  "titleCN": "折线图区域高亮",
  "difficulty": 3
}, {
  "category": ["bar"],
  "id": "bar-gradient",
  "tags": [],
  "title": "Clickable Column Chart with Gradient",
  "titleCN": "特性示例：渐变色 阴影 点击缩放",
  "difficulty": 3
}, {
  "category": ["bar"],
  "id": "bar-label-rotation",
  "tags": [],
  "title": "Bar Label Rotation",
  "titleCN": "柱状图标签旋转",
  "difficulty": 3
}, {
  "category": ["bar"],
  "id": "bar-stack",
  "tags": [],
  "title": "Stacked Column Chart",
  "titleCN": "堆叠柱状图",
  "difficulty": 3
}, {
  "category": ["bar"],
  "id": "bar-waterfall2",
  "tags": [],
  "title": "Waterfall Chart",
  "titleCN": "阶梯瀑布图（柱状图模拟）",
  "difficulty": 3
}, {
  "category": ["bar"],
  "id": "bar-y-category-stack",
  "tags": [],
  "title": "Stacked Horizontal Bar",
  "titleCN": "堆叠条形图",
  "difficulty": 3
}, {
  "category": ["candlestick"],
  "id": "candlestick-large",
  "tags": [],
  "title": "Large Scale Candlestick",
  "titleCN": "大数据量K线图",
  "difficulty": 3
}, {
  "category": ["custom"],
  "id": "custom-bar-trend",
  "tags": [],
  "title": "Custom Bar Trend",
  "titleCN": "使用自定义系列添加柱状图趋势",
  "difficulty": 3
}, {
  "category": ["custom"],
  "id": "custom-cartesian-polygon",
  "tags": [],
  "title": "Custom Cartesian Polygon",
  "titleCN": "自定义多边形图",
  "difficulty": 3
}, {
  "category": ["custom"],
  "id": "custom-error-bar",
  "tags": [],
  "title": "Error Bar on Catesian",
  "titleCN": "使用自定系列给柱状图添加误差范围",
  "difficulty": 3
}, {
  "category": ["custom"],
  "id": "custom-profile",
  "tags": [],
  "title": "Profile",
  "titleCN": "性能分析图",
  "difficulty": 3
}, {
  "category": ["custom"],
  "id": "cycle-plot",
  "tags": [],
  "title": "Cycle Plot",
  "titleCN": "Cycle Plot",
  "difficulty": 3
}, {
  "category": ["line"],
  "id": "data-transform-filter",
  "tags": [],
  "title": "Data Transform Fitler",
  "titleCN": "数据过滤",
  "difficulty": 3
}, {
  "category": ["dataset", "pie", "transform"],
  "id": "data-transform-multiple-pie",
  "tags": [],
  "title": "Partition Data to Pies",
  "titleCN": "分割数据到数个饼图",
  "difficulty": 3
}, {
  "category": ["dataset", "pie"],
  "id": "dataset-default",
  "tags": [],
  "title": "Default arrangement",
  "titleCN": "默认 encode 设置",
  "difficulty": 3
}, {
  "category": ["dataset"],
  "id": "dataset-encode1",
  "tags": [],
  "title": "Encode and Matrix",
  "titleCN": "指定数据到坐标轴的映射",
  "difficulty": 3
}, {
  "category": ["gauge"],
  "id": "gauge-progress",
  "tags": [],
  "title": "Grogress Gauge",
  "titleCN": "进度仪表盘",
  "difficulty": 3
}, {
  "category": ["gauge"],
  "id": "gauge-stage",
  "tags": [],
  "title": "Stage Speed Gauge",
  "titleCN": "阶段速度仪表盘",
  "difficulty": 3
}, {
  "category": ["graph"],
  "id": "graph-force",
  "tags": [],
  "title": "Force Layout",
  "titleCN": "力引导布局",
  "difficulty": 3
}, {
  "category": ["graph"],
  "id": "graph-label-overlap",
  "tags": [],
  "title": "Hide Overlapped Label",
  "titleCN": "关系图自动隐藏重叠标签",
  "difficulty": 3
}, {
  "category": ["heatmap"],
  "id": "heatmap-bmap",
  "tags": ["bmap"],
  "title": "Heatmap on Baidu Map Extension",
  "titleCN": "热力图与百度地图扩展",
  "difficulty": 3
}, {
  "category": ["heatmap"],
  "id": "heatmap-map",
  "tags": [],
  "title": "Air Qulity",
  "titleCN": "全国主要城市空气质量",
  "difficulty": 3
}, {
  "category": ["line"],
  "id": "line-gradient",
  "tags": [],
  "title": "Line Gradient",
  "titleCN": "折线图的渐变",
  "difficulty": 3
}, {
  "category": ["line"],
  "id": "line-sections",
  "tags": [],
  "title": "Distribution of Electricity",
  "titleCN": "一天用电量分布",
  "difficulty": 3
}, {
  "category": ["pie"],
  "id": "pie-alignTo",
  "tags": [],
  "title": "Pie Label Align",
  "titleCN": "饼图标签对齐",
  "difficulty": 3
}, {
  "category": ["pie"],
  "id": "pie-labelLine-adjust",
  "tags": [],
  "title": "Label Line Adjust",
  "titleCN": "饼图引导线调整",
  "difficulty": 3
}, {
  "category": ["radar"],
  "id": "radar2",
  "tags": [],
  "title": "Proportion of Browsers",
  "titleCN": "浏览器占比变化",
  "difficulty": 3
}, {
  "category": ["sankey"],
  "id": "sankey-energy",
  "tags": [],
  "title": "Gradient Edge",
  "titleCN": "桑基图渐变色边",
  "difficulty": 3
}, {
  "category": ["sankey"],
  "id": "sankey-nodeAlign-left",
  "tags": [],
  "title": "Node Align Left in Sankey",
  "titleCN": "桑基图左对齐布局",
  "difficulty": 3
}, {
  "category": ["sankey"],
  "id": "sankey-nodeAlign-right",
  "tags": [],
  "title": "Node Align Right in Sankey",
  "titleCN": "桑基图右对齐布局",
  "difficulty": 3
}, {
  "category": ["scatter"],
  "id": "scatter-punchCard",
  "tags": [],
  "title": "Punch Card of Github",
  "titleCN": "GitHub 打卡气泡图",
  "difficulty": 3
}, {
  "category": ["scatter"],
  "id": "scatter-single-axis",
  "tags": [],
  "title": "Scatter on Single Axis",
  "titleCN": "单轴散点图",
  "difficulty": 3
}, {
  "category": ["scatter"],
  "id": "scatter-weight",
  "tags": [],
  "title": "Distribution of Height and Weight",
  "titleCN": "男性女性身高体重分布",
  "difficulty": 3
}, {
  "category": ["sunburst"],
  "id": "sunburst-monochrome",
  "tags": [],
  "title": "Monochrome Sunburst",
  "titleCN": "Monochrome Sunburst",
  "difficulty": 3
}, {
  "category": ["line", "dataZoom"],
  "id": "area-simple",
  "tags": [],
  "title": "Large scale area chart",
  "titleCN": "大数据量面积图",
  "difficulty": 4
}, {
  "category": ["bar"],
  "id": "bar-brush",
  "tags": [],
  "title": "Brush Select on Column Chart",
  "titleCN": "柱状图框选",
  "difficulty": 4
}, {
  "category": ["bar"],
  "id": "bar-negative",
  "tags": [],
  "title": "Bar Chart with Negative Value",
  "titleCN": "正负条形图",
  "difficulty": 4
}, {
  "category": ["bar"],
  "id": "bar1",
  "tags": [],
  "title": "Rainfall and Evaporation",
  "titleCN": "某地区蒸发量和降水量",
  "difficulty": 4
}, {
  "category": ["calendar", "graph"],
  "id": "calendar-graph",
  "tags": [],
  "title": "Calendar Graph",
  "titleCN": "日历关系图",
  "difficulty": 4
}, {
  "category": ["calendar"],
  "id": "calendar-lunar",
  "tags": [],
  "title": "Calendar Lunar",
  "titleCN": "农历日历图",
  "difficulty": 4
}, {
  "category": ["candlestick"],
  "id": "candlestick-touch",
  "tags": [],
  "title": "Axis Pointer Link and Touch",
  "titleCN": "触屏上的坐标轴指示器",
  "difficulty": 4
}, {
  "category": ["line"],
  "id": "confidence-band",
  "tags": [],
  "title": "Confidence Band",
  "titleCN": "Confidence Band",
  "difficulty": 4
}, {
  "category": ["custom", "dataZoom", "drag"],
  "id": "custom-gantt-flight",
  "tags": [],
  "title": "Gantt Chart of Airport Flights",
  "titleCN": "机场航班甘特图",
  "difficulty": 4
}, {
  "category": ["custom"],
  "id": "custom-polar-heatmap",
  "tags": [],
  "title": "Polar Heatmap",
  "titleCN": "极坐标热力图（自定义系列）",
  "difficulty": 4
}, {
  "category": ["boxplot"],
  "id": "data-transform-aggregate",
  "tags": [],
  "title": "Data Transform Simple Aggregate",
  "titleCN": "简单的数据聚合",
  "difficulty": 4
}, {
  "category": ["gauge"],
  "id": "gauge-grade",
  "tags": [],
  "title": "Grade Gauge",
  "titleCN": "等级仪表盘",
  "difficulty": 4
}, {
  "category": ["gauge"],
  "id": "gauge-multi-title",
  "tags": [],
  "title": "Multi Title Gauge",
  "titleCN": "多标题仪表盘",
  "difficulty": 4
}, {
  "category": ["gauge"],
  "id": "gauge-temperature",
  "tags": [],
  "title": "Temperature Gauge chart",
  "titleCN": "气温仪表盘",
  "difficulty": 4
}, {
  "category": ["graph"],
  "id": "graph",
  "tags": [],
  "title": "Les Miserables",
  "titleCN": "悲惨世界人物关系图",
  "difficulty": 4
}, {
  "category": ["line"],
  "id": "grid-multiple",
  "tags": [],
  "title": "Rainfall and Water Flow",
  "titleCN": "雨量流量关系图",
  "difficulty": 4
}, {
  "category": ["line"],
  "id": "line-aqi",
  "tags": [],
  "title": "Beijing AQI",
  "titleCN": "北京 AQI 可视化",
  "difficulty": 4
}, {
  "category": ["bar"],
  "id": "mix-line-bar",
  "tags": [],
  "title": "Mixed Line and Bar",
  "titleCN": "折柱混合",
  "difficulty": 4
}, {
  "category": ["bar"],
  "id": "mix-zoom-on-value",
  "tags": [],
  "title": "Mix Zoom On Value",
  "titleCN": "多数值轴轴缩放",
  "difficulty": 4
}, {
  "category": ["line"],
  "id": "multiple-x-axis",
  "tags": [],
  "title": "Multiple X Axes",
  "titleCN": "多 X 轴",
  "difficulty": 4
}, {
  "category": ["bar"],
  "id": "multiple-y-axis",
  "tags": [],
  "title": "Multiple Y Axes",
  "titleCN": "多 Y 轴示例",
  "difficulty": 4
}, {
  "category": ["parallel"],
  "id": "parallel-nutrients",
  "tags": [],
  "title": "Parallel Nutrients",
  "titleCN": "营养结构（平行坐标）",
  "difficulty": 4
}, {
  "category": ["pie"],
  "id": "pie-legend",
  "tags": [],
  "title": "Pie with Scrollable Legend",
  "titleCN": "可滚动的图例",
  "difficulty": 4
}, {
  "category": ["pie", "rich"],
  "id": "pie-rich-text",
  "tags": [],
  "title": "Pie Special Label",
  "titleCN": "富文本标签",
  "difficulty": 4
}, {
  "category": ["scatter"],
  "id": "scatter-label-align-right",
  "tags": [],
  "title": "Align Label on the Top",
  "titleCN": "散点图标签顶部对齐",
  "difficulty": 4
}, {
  "category": ["scatter"],
  "id": "scatter-label-align-top",
  "tags": [],
  "title": "Align Label on the Top",
  "titleCN": "散点图标签顶部对齐",
  "difficulty": 4
}, {
  "category": ["sunburst"],
  "id": "sunburst-visualMap",
  "tags": [],
  "title": "Sunburst VisualMap",
  "titleCN": "旭日图使用视觉编码",
  "difficulty": 4
}, {
  "category": ["line"],
  "id": "area-rainfall",
  "tags": [],
  "title": "Rainfall",
  "titleCN": "雨量流量关系图",
  "difficulty": 5
}, {
  "category": ["line"],
  "id": "area-time-axis",
  "tags": [],
  "title": "Area Chart with Time Axis",
  "titleCN": "时间轴折线图",
  "difficulty": 5
}, {
  "category": ["bar"],
  "id": "bar-animation-delay",
  "tags": [],
  "title": "Animation Delay",
  "titleCN": "柱状图动画延迟",
  "difficulty": 5
}, {
  "category": ["bar"],
  "id": "bar-large",
  "tags": [],
  "title": "Large Scale Bar Chart",
  "titleCN": "大数据量柱图",
  "difficulty": 5
}, {
  "category": ["bar"],
  "id": "bar-race",
  "tags": [],
  "title": "Bar Race",
  "titleCN": "动态排序柱状图",
  "difficulty": 5
}, {
  "category": ["dataset", "line", "pie"],
  "id": "dataset-link",
  "tags": [],
  "title": "Share Dataset",
  "titleCN": "联动和共享数据集",
  "difficulty": 5
}, {
  "category": ["dataset", "bar"],
  "id": "dataset-series-layout-by",
  "tags": [],
  "title": "Series Layout By Column or Row",
  "titleCN": "系列按行和按列排布",
  "difficulty": 5
}, {
  "category": ["dataset", "bar"],
  "id": "dataset-simple0",
  "tags": [],
  "title": "Simple Example of Dataset",
  "titleCN": "最简单的数据集（dataset）",
  "difficulty": 5
}, {
  "category": ["dataset", "bar"],
  "id": "dataset-simple1",
  "tags": [],
  "title": "Dataset in Object Array",
  "titleCN": "对象数组的输入格式",
  "difficulty": 5
}, {
  "category": ["line"],
  "id": "dynamic-data2",
  "tags": [],
  "title": "Dynamic Data + Time Axis",
  "titleCN": "动态数据 + 时间坐标轴",
  "difficulty": 5
}, {
  "category": ["gauge"],
  "id": "gauge-ring",
  "tags": [],
  "title": "Ring Gauge",
  "titleCN": "得分环",
  "difficulty": 5
}, {
  "category": ["graph"],
  "id": "graph-circular-layout",
  "tags": [],
  "title": "Les Miserables",
  "titleCN": "悲惨世界人物关系图(环形布局)",
  "difficulty": 5
}, {
  "category": ["line"],
  "id": "line-function",
  "tags": [],
  "title": "Function Plot",
  "titleCN": "函数绘图",
  "difficulty": 5
}, {
  "category": ["line"],
  "id": "line-race",
  "tags": [],
  "title": "Line Race",
  "titleCN": "动态排序折线图",
  "difficulty": 5
}, {
  "category": ["pie", "rich"],
  "id": "pie-nest",
  "tags": [],
  "title": "Nested Pies",
  "titleCN": "嵌套环形图",
  "difficulty": 5
}, {
  "category": ["scatter"],
  "id": "scatter-large",
  "tags": [],
  "title": "Large Scatter",
  "titleCN": "大规模散点图",
  "difficulty": 5
}, {
  "category": ["scatter"],
  "id": "scatter-nebula",
  "tags": [],
  "title": "Scatter Nebula",
  "titleCN": "大规模星云散点图",
  "difficulty": 5
}, {
  "category": ["scatter"],
  "id": "scatter-stream-visual",
  "tags": [],
  "title": "Visual interaction with stream",
  "titleCN": "流式渲染和视觉映射操作",
  "difficulty": 5
}, {
  "category": ["sunburst"],
  "id": "sunburst-drink",
  "tags": [],
  "title": "Drink Flavors",
  "titleCN": "Drink Flavors",
  "difficulty": 5
}, {
  "category": ["custom", "dataZoom"],
  "id": "wind-barb",
  "tags": [],
  "title": "Wind Barb",
  "titleCN": "风向图",
  "difficulty": 5
}, {
  "category": ["bar"],
  "id": "bar-race-country",
  "tags": [],
  "title": "Bar Race",
  "titleCN": "动态排序柱状图 - 人均收入",
  "difficulty": 6
}, {
  "category": ["bar", "rich"],
  "id": "bar-rich-text",
  "tags": [],
  "title": "Wheater Statistics",
  "titleCN": "天气统计（富文本）",
  "difficulty": 6
}, {
  "category": ["scatter"],
  "id": "bubble-gradient",
  "tags": [],
  "title": "Bubble Chart",
  "titleCN": "气泡图",
  "difficulty": 6
}, {
  "category": ["calendar", "pie"],
  "id": "calendar-pie",
  "tags": [],
  "title": "Calendar Pie",
  "titleCN": "日历饼图",
  "difficulty": 6
}, {
  "category": ["custom", "map"],
  "id": "custom-hexbin",
  "tags": [],
  "title": "Hexagonal Binning",
  "titleCN": "六边形分箱图（自定义系列）",
  "difficulty": 6
}, {
  "category": ["bar"],
  "id": "dynamic-data",
  "tags": [],
  "title": "Dynamic Data",
  "titleCN": "动态数据",
  "difficulty": 6
}, {
  "category": ["gauge"],
  "id": "gauge-barometer",
  "tags": [],
  "title": "Gauge Barometer chart",
  "titleCN": "气压表",
  "difficulty": 6
}, {
  "category": ["graph"],
  "id": "graph-force-dynamic",
  "tags": [],
  "title": "Graph Dynamic",
  "titleCN": "动态增加图节点",
  "difficulty": 6
}, {
  "category": ["line"],
  "id": "line-markline",
  "tags": [],
  "title": "Line with Marklines",
  "titleCN": "折线图的标记线",
  "difficulty": 6
}, {
  "category": ["line"],
  "id": "line-style",
  "tags": [],
  "title": "Line Style and Item Style",
  "titleCN": "自定义折线图样式",
  "difficulty": 6
}, {
  "category": ["bar"],
  "id": "mix-timeline-finance",
  "tags": [],
  "title": "Finance Indices 2002",
  "titleCN": "2002全国宏观经济指标",
  "difficulty": 6
}, {
  "category": ["sunburst"],
  "id": "sunburst-book",
  "tags": [],
  "title": "Book Records",
  "titleCN": "书籍分布",
  "difficulty": 6
}, {
  "category": ["bar"],
  "id": "watermark",
  "tags": [],
  "title": "Watermark - ECharts Download",
  "titleCN": "水印 - ECharts 下载统计",
  "difficulty": 6
}, {
  "category": ["bar"],
  "id": "bar-polar-real-estate",
  "tags": [],
  "title": "Bar Chart on Polar",
  "difficulty": 7
}, {
  "category": ["bar"],
  "id": "bar-polar-stack",
  "tags": [],
  "title": "Stacked Bar Chart on Polar",
  "titleCN": "极坐标系下的堆叠柱状图",
  "difficulty": 7
}, {
  "category": ["bar"],
  "id": "bar-polar-stack-radial",
  "tags": [],
  "title": "Stacked Bar Chart on Polar(Radial)",
  "titleCN": "极坐标系下的堆叠柱状图",
  "difficulty": 7
}, {
  "category": ["custom", "calendar"],
  "id": "custom-calendar-icon",
  "tags": [],
  "title": "Custom Calendar Icon",
  "titleCN": "日历图自定义图标",
  "difficulty": 7
}, {
  "category": ["custom"],
  "id": "custom-wind",
  "tags": [],
  "title": "Use custom series to draw wind vectors",
  "titleCN": "使用自定义系列绘制风场",
  "difficulty": 7
}, {
  "category": ["gauge"],
  "id": "gauge-clock",
  "tags": [],
  "title": "Clock Gauge",
  "titleCN": "时钟仪表盘",
  "difficulty": 7
}, {
  "category": ["graph"],
  "id": "graph-life-expectancy",
  "tags": [],
  "title": "Graph Life Expectancy",
  "titleCN": "Graph Life Expectancy",
  "difficulty": 7
}, {
  "category": ["line"],
  "id": "line-in-cartesian-coordinate-system",
  "tags": [],
  "title": "Line Chart in Cartesian Coordinate System",
  "titleCN": "双数值轴折线图",
  "difficulty": 7
}, {
  "category": ["line"],
  "id": "line-log",
  "tags": [],
  "title": "Log Axis",
  "titleCN": "对数轴示例",
  "difficulty": 7
}, {
  "category": ["line"],
  "id": "line-step",
  "tags": [],
  "title": "Step Line",
  "titleCN": "阶梯折线图",
  "difficulty": 7
}, {
  "category": ["bar"],
  "id": "polar-roundCap",
  "tags": [],
  "title": "Rounded Bar on Polar",
  "titleCN": "圆角环形图",
  "difficulty": 7
}, {
  "category": ["scatter"],
  "id": "scatter-aqi-color",
  "tags": [],
  "title": "Scatter Aqi Color",
  "titleCN": "AQI 气泡图",
  "difficulty": 7
}, {
  "category": ["scatter"],
  "id": "scatter-nutrients",
  "tags": [],
  "title": "Scatter Nutrients",
  "titleCN": "营养分布散点图",
  "difficulty": 7
}, {
  "category": ["scatter"],
  "id": "scatter-nutrients-matrix",
  "tags": [],
  "title": "Scatter Nutrients Matrix",
  "titleCN": "营养分布散点矩阵",
  "difficulty": 7
}, {
  "category": ["gauge"],
  "id": "gauge-car",
  "tags": [],
  "title": "Gauge Car",
  "titleCN": "Gauge Car",
  "difficulty": 8
}, {
  "category": ["graph"],
  "id": "graph-webkit-dep",
  "tags": [],
  "title": "Graph Webkit Dep",
  "titleCN": "WebKit 模块关系依赖图",
  "difficulty": 8
}, {
  "category": ["line"],
  "id": "line-easing",
  "tags": [],
  "title": "Line Easing Visualizing",
  "titleCN": "缓动函数可视化",
  "difficulty": 8
}, {
  "category": ["line"],
  "id": "line-y-category",
  "tags": [],
  "title": "Line Y Category",
  "titleCN": "垂直折线图（Y轴为类目轴）",
  "difficulty": 8
}, {
  "category": ["scatter"],
  "id": "scatter-polar-punchCard",
  "tags": [],
  "title": "Punch Card of Github",
  "titleCN": "GitHub 打卡气泡图（极坐标）",
  "difficulty": 8
}, {
  "category": ["custom"],
  "id": "custom-aggregate-scatter-bar",
  "tags": [],
  "title": "Aggregate Morphing Between Scatter and Bar",
  "titleCN": "聚合分割形变（散点图 - 柱状图）",
  "difficulty": 9
}, {
  "category": ["custom"],
  "id": "custom-aggregate-scatter-pie",
  "tags": [],
  "title": "Aggregate Morphing Between Scatter and Pie",
  "titleCN": "聚合分割形变（散点图 - 饼图）",
  "difficulty": 9
}, {
  "category": ["custom"],
  "id": "custom-gauge",
  "tags": [],
  "title": "Custom Gauge",
  "titleCN": "自定义仪表",
  "difficulty": 9
}, {
  "category": ["graph"],
  "id": "graph-npm",
  "tags": [],
  "title": "NPM Dependencies",
  "titleCN": "NPM 依赖关系图",
  "difficulty": 9
}, {
  "category": ["line"],
  "id": "line-graphic",
  "tags": [],
  "title": "Custom Graphic Component",
  "titleCN": "自定义图形组件",
  "difficulty": 9
}, {
  "category": ["line"],
  "id": "line-pen",
  "tags": [],
  "title": "Click to Add Points",
  "titleCN": "点击添加折线图拐点",
  "difficulty": 9
}, {
  "category": ["scatter"],
  "id": "scatter-life-expectancy-timeline",
  "tags": [],
  "title": "Life Expectancy and GDP",
  "titleCN": "各国人均寿命与GDP关系演变",
  "difficulty": 9
}, {
  "category": ["scatter"],
  "id": "scatter-painter-choice",
  "tags": [],
  "title": "Master Painter Color Choices Throughout History",
  "titleCN": "Master Painter Color Choices Throughout History",
  "difficulty": 9
}, {
  "category": ["boxplot"],
  "id": "boxplot-light-velocity",
  "tags": [],
  "title": "Boxplot Light Velocity",
  "titleCN": "基础盒须图",
  "difficulty": 10
}, {
  "category": ["boxplot"],
  "id": "boxplot-light-velocity2",
  "tags": [],
  "title": "Boxplot Light Velocity2",
  "titleCN": "垂直方向盒须图",
  "difficulty": 10
}, {
  "category": ["boxplot"],
  "id": "boxplot-multi",
  "tags": [],
  "title": "Multiple Categories",
  "titleCN": "多系列盒须图",
  "difficulty": 10
}, {
  "category": [],
  "id": "calendar-effectscatter",
  "tags": [],
  "difficulty": 10
}, {
  "category": ["candlestick"],
  "id": "candlestick-brush",
  "tags": [],
  "title": "Candlestick Brush",
  "titleCN": "日力图刷选",
  "difficulty": 10
}, {
  "category": ["candlestick"],
  "id": "candlestick-sh-2015",
  "tags": [],
  "title": "ShangHai Index, 2015",
  "titleCN": "2015 年上证指数",
  "difficulty": 10
}, {
  "category": [],
  "id": "covid-america",
  "tags": [],
  "difficulty": 10
}, {
  "category": ["custom"],
  "id": "custom-aggregate-scatter-cluster",
  "tags": [],
  "title": "Aggregate Morphing Between Scatter Clustering",
  "titleCN": "聚合分割形变（散点图聚类）",
  "difficulty": 10
}, {
  "category": ["scatter", "map"],
  "id": "effectScatter-bmap",
  "tags": ["bmap"],
  "title": "Air Quality - Baidu Map",
  "titleCN": "全国主要城市空气质量 - 百度地图",
  "difficulty": 10
}, {
  "category": ["funnel"],
  "id": "funnel",
  "tags": [],
  "title": "Funnel Chart",
  "titleCN": "漏斗图",
  "difficulty": 10
}, {
  "category": ["funnel"],
  "id": "funnel-align",
  "tags": [],
  "title": "Funnel (align)",
  "titleCN": "漏斗图(对比)",
  "difficulty": 10
}, {
  "category": ["funnel"],
  "id": "funnel-customize",
  "tags": [],
  "title": "Customized Funnel",
  "titleCN": "漏斗图",
  "difficulty": 10
}, {
  "category": ["funnel"],
  "id": "funnel-mutiple",
  "tags": [],
  "title": "Multiple Funnels",
  "titleCN": "漏斗图",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "geo-beef-cuts",
  "tags": [],
  "title": "GEO Beef Cuts",
  "titleCN": "庖丁解牛",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "geo-lines",
  "tags": [],
  "title": "Migration",
  "titleCN": "模拟迁徙",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "geo-map-scatter",
  "tags": [],
  "title": "map and scatter share a geo",
  "titleCN": "map and scatter share a geo",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "geo-organ",
  "tags": [],
  "title": "Organ Data with SVG",
  "titleCN": "内脏数据（SVG）",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "geo-seatmap-flight",
  "tags": [],
  "title": "Flight Seatmap with SVG",
  "titleCN": "航班选座（SVG）",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "geo-svg-lines",
  "tags": [],
  "title": "GEO SVG Lines",
  "titleCN": "GEO 路径图（SVG）",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "geo-svg-map",
  "tags": [],
  "title": "GEO SVG Map",
  "titleCN": "地图（SVG）",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "geo-svg-traffic",
  "tags": [],
  "title": "GEO SVG Traffic",
  "titleCN": "交通（SVG）",
  "difficulty": 10
}, {
  "category": ["line", "drag"],
  "id": "line-draggable",
  "tags": [],
  "title": "Try Dragging these Points",
  "titleCN": "可拖拽点",
  "difficulty": 10
}, {
  "category": ["line"],
  "id": "line-polar",
  "tags": [],
  "title": "Two Value-Axes in Polar",
  "titleCN": "极坐标双数值轴",
  "difficulty": 10
}, {
  "category": ["line"],
  "id": "line-polar2",
  "tags": [],
  "title": "Two Value-Axes in Polar",
  "titleCN": "极坐标双数值轴",
  "difficulty": 10
}, {
  "category": ["line", "dataZoom"],
  "id": "line-tooltip-touch",
  "tags": [],
  "title": "Tooltip and DataZoom on Mobile",
  "titleCN": "移动端上的 dataZoom 和 tooltip",
  "difficulty": 10
}, {
  "category": ["map", "lines"],
  "id": "lines-airline",
  "tags": [],
  "title": "65k+ Airline",
  "titleCN": "65k+ 飞机航线",
  "difficulty": 10
}, {
  "category": ["map", "lines"],
  "id": "lines-bmap",
  "tags": ["bmap"],
  "title": "A Hiking Trail in Hangzhou - Baidu Map",
  "titleCN": "杭州热门步行路线 - 百度地图",
  "difficulty": 10
}, {
  "category": ["map", "lines"],
  "id": "lines-bmap-bus",
  "tags": ["bmap"],
  "title": "Bus Lines of Beijing - Baidu Map",
  "titleCN": "北京公交路线 - 百度地图",
  "difficulty": 10
}, {
  "category": ["map", "lines"],
  "id": "lines-bmap-effect",
  "tags": ["bmap"],
  "title": "Bus Lines of Beijing - Line Effect",
  "titleCN": "北京公交路线 - 线特效",
  "difficulty": 10
}, {
  "category": ["map", "lines"],
  "id": "lines-ny",
  "tags": [],
  "title": "Use lines to draw 1 million ny streets.",
  "titleCN": "使用线图绘制近 100 万的纽约街道数据",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "map-bin",
  "tags": ["bmap"],
  "title": "Binning on Map",
  "titleCN": "Binning on Map",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "map-china",
  "tags": [],
  "title": "Map China",
  "titleCN": "Map China",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "map-china-dataRange",
  "tags": [],
  "title": "Sales of iphone",
  "titleCN": "iphone销量",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "map-HK",
  "tags": [],
  "title": "Population Density of HongKong (2011)",
  "titleCN": "香港18区人口密度 （2011）",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "map-labels",
  "tags": [],
  "title": "Rich Text Labels on Map",
  "titleCN": "地图上的富文本标签",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "map-locate",
  "tags": [],
  "title": "Map Locate",
  "titleCN": "Map Locate",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "map-polygon",
  "tags": ["bmap"],
  "title": "Draw Polygon on Map",
  "titleCN": "在地图上绘制多边形",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "map-province",
  "tags": [],
  "title": "Switch among 34 Provinces",
  "titleCN": "34 省切换查看",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "map-usa",
  "tags": [],
  "title": "USA Population Estimates (2012)",
  "titleCN": "USA Population Estimates (2012)",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "map-world",
  "tags": [],
  "title": "Map World",
  "titleCN": "Map World",
  "difficulty": 10
}, {
  "category": ["map"],
  "id": "map-world-dataRange",
  "tags": [],
  "title": "World Population (2010)",
  "titleCN": "World Population (2010)",
  "difficulty": 10
}, {
  "category": ["pictorialBar"],
  "id": "pictorialBar-body-fill",
  "tags": [],
  "title": "Water Content",
  "titleCN": "人体含水量",
  "difficulty": 10
}, {
  "category": ["pictorialBar"],
  "id": "pictorialBar-dotted",
  "tags": [],
  "title": "Dotted bar",
  "titleCN": "虚线柱状图效果",
  "difficulty": 10
}, {
  "category": ["pictorialBar"],
  "id": "pictorialBar-forest",
  "tags": [],
  "title": "Expansion of forest",
  "titleCN": "森林的增长",
  "difficulty": 10
}, {
  "category": ["pictorialBar"],
  "id": "pictorialBar-hill",
  "tags": [],
  "title": "Wish List and Mountain Height",
  "titleCN": "圣诞愿望清单和山峰高度",
  "difficulty": 10
}, {
  "category": ["pictorialBar"],
  "id": "pictorialBar-spirit",
  "tags": [],
  "title": "Spirits",
  "titleCN": "精灵",
  "difficulty": 10
}, {
  "category": ["pictorialBar"],
  "id": "pictorialBar-vehicle",
  "tags": [],
  "title": "Vehicles",
  "titleCN": "交通工具",
  "difficulty": 10
}, {
  "category": ["pictorialBar"],
  "id": "pictorialBar-velocity",
  "tags": [],
  "title": "Velocity of Christmas Reindeers",
  "titleCN": "驯鹿的速度",
  "difficulty": 10
}, {
  "category": ["radar"],
  "id": "radar-multiple",
  "tags": [],
  "title": "Multiple Radar",
  "titleCN": "多雷达图",
  "difficulty": 10
}, {
  "category": ["scatter"],
  "id": "scatter-map",
  "tags": [],
  "title": "Air Quality",
  "titleCN": "全国主要城市空气质量",
  "difficulty": 10
}, {
  "category": ["scatter"],
  "id": "scatter-map-brush",
  "tags": [],
  "title": "Scatter Map Brush",
  "titleCN": "Scatter Map Brush",
  "difficulty": 10
}, {
  "category": ["parallel", "scatter"],
  "id": "scatter-matrix",
  "tags": [],
  "title": "Scatter Matrix",
  "titleCN": "散点矩阵和平行坐标",
  "difficulty": 10
}, {
  "category": ["scatter"],
  "id": "scatter-weibo",
  "tags": [],
  "title": "Sign in of weibo",
  "titleCN": "微博签到数据点亮中国",
  "difficulty": 10
}, {
  "category": ["scatter"],
  "id": "scatter-world-population",
  "tags": [],
  "title": "World Population (2011)",
  "titleCN": "World Population (2011)",
  "difficulty": 10
}, {
  "category": ["themeRiver"],
  "id": "themeRiver-basic",
  "tags": [],
  "title": "ThemeRiver",
  "titleCN": "主题河流图",
  "difficulty": 10
}, {
  "category": ["themeRiver"],
  "id": "themeRiver-lastfm",
  "tags": [],
  "title": "ThemeRiver Lastfm",
  "titleCN": "ThemeRiver Lastfm",
  "difficulty": 10
}, {
  "category": ["tree"],
  "id": "tree-basic",
  "tags": [],
  "title": "From Left to Right Tree",
  "titleCN": "从左到右树状图",
  "difficulty": 10
}, {
  "category": ["tree"],
  "id": "tree-legend",
  "tags": [],
  "title": "Multiple Trees",
  "titleCN": "多棵树",
  "difficulty": 10
}, {
  "category": ["tree"],
  "id": "tree-orient-bottom-top",
  "tags": [],
  "title": "From Bottom to Top Tree",
  "titleCN": "从下到上树状图",
  "difficulty": 10
}, {
  "category": ["tree"],
  "id": "tree-orient-right-left",
  "tags": [],
  "title": "From Right to Left Tree",
  "titleCN": "从右到左树状图",
  "difficulty": 10
}, {
  "category": ["tree"],
  "id": "tree-polyline",
  "tags": [],
  "title": "Tree with Polyline Edge",
  "titleCN": "折线树图",
  "difficulty": 10
}, {
  "category": ["tree"],
  "id": "tree-radial",
  "tags": [],
  "title": "Radial Tree",
  "titleCN": "径向树状图",
  "difficulty": 10
}, {
  "category": ["tree"],
  "id": "tree-vertical",
  "tags": [],
  "title": "From Top to Bottom Tree",
  "titleCN": "从上到下树状图",
  "difficulty": 10
}, {
  "category": ["treemap"],
  "id": "treemap-disk",
  "tags": [],
  "title": "Disk Usage",
  "titleCN": "磁盘占用",
  "difficulty": 10
}, {
  "category": ["treemap"],
  "id": "treemap-drill-down",
  "tags": [],
  "title": "ECharts Option Query",
  "titleCN": "ECharts 配置项查询分布",
  "difficulty": 10
}, {
  "category": ["treemap"],
  "id": "treemap-obama",
  "tags": [],
  "title": "How $3.7 Trillion is Spent",
  "titleCN": "How $3.7 Trillion is Spent",
  "difficulty": 10
}, {
  "category": ["treemap"],
  "id": "treemap-show-parent",
  "tags": [],
  "title": "Show Parent Labels",
  "titleCN": "显示父层级标签",
  "difficulty": 10
}, {
  "category": ["treemap"],
  "id": "treemap-simple",
  "tags": [],
  "title": "Basic Treemap",
  "titleCN": "基础矩形树图",
  "difficulty": 10
}, {
  "category": ["treemap"],
  "id": "treemap-visual",
  "tags": [],
  "title": "Gradient Mapping",
  "titleCN": "映射为渐变色",
  "difficulty": 10
}, {
  "category": ["calendar", "scatter"],
  "id": "calendar-charts",
  "tags": [],
  "title": "Calendar Charts",
  "titleCN": "日力图",
  "difficulty": 11
}, {
  "category": ["custom"],
  "id": "circle-packing-with-d3",
  "tags": [],
  "title": "Circle Packing with d3",
  "titleCN": "Circle Packing with d3",
  "difficulty": 11
}, {
  "category": ["custom"],
  "id": "custom-one-to-one-morph",
  "tags": [],
  "title": "One-to-one Morphing",
  "titleCN": "一对一映射形变",
  "difficulty": 11
}, {
  "category": ["custom"],
  "id": "custom-spiral-race",
  "tags": [],
  "title": "Custom Spiral Race",
  "titleCN": "自定义螺旋线竞速",
  "difficulty": 11
}, {
  "category": ["custom"],
  "id": "custom-story-transition",
  "tags": [],
  "title": "Simple Story Transition",
  "titleCN": "极简场景变换示例",
  "difficulty": 11
}, {
  "category": ["scatter"],
  "id": "scatter-logarithmic-regression",
  "tags": [],
  "title": "Logarithmic Regression",
  "titleCN": "对数回归（使用统计插件）",
  "difficulty": 16
}]);

/***/ }),

/***/ "./src/data/option-keywords.js":
/*!*************************************!*\
  !*** ./src/data/option-keywords.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "keywords": () => /* binding */ keywords
/* harmony export */ });
// THIS FILE IS GENERATED, DON'T MODIFY */

/* eslint-disable  */
var keywords = [{
  "name": "color",
  "count": 1835
}, {
  "name": "shadowColor",
  "count": 1770
}, {
  "name": "shadowBlur",
  "count": 1770
}, {
  "name": "shadowOffsetX",
  "count": 1770
}, {
  "name": "shadowOffsetY",
  "count": 1770
}, {
  "name": "borderColor",
  "count": 1451
}, {
  "name": "borderWidth",
  "count": 1450
}, {
  "name": "width",
  "count": 1411
}, {
  "name": "borderType",
  "count": 1385
}, {
  "name": "borderDashOffset",
  "count": 1373
}, {
  "name": "height",
  "count": 1120
}, {
  "name": "backgroundColor",
  "count": 1111
}, {
  "name": "fontSize",
  "count": 1098
}, {
  "name": "fontStyle",
  "count": 1081
}, {
  "name": "fontWeight",
  "count": 1081
}, {
  "name": "fontFamily",
  "count": 1081
}, {
  "name": "lineHeight",
  "count": 1081
}, {
  "name": "textBorderColor",
  "count": 1081
}, {
  "name": "textBorderWidth",
  "count": 1081
}, {
  "name": "textBorderType",
  "count": 1081
}, {
  "name": "textBorderDashOffset",
  "count": 1081
}, {
  "name": "textShadowColor",
  "count": 1081
}, {
  "name": "textShadowBlur",
  "count": 1081
}, {
  "name": "textShadowOffsetX",
  "count": 1081
}, {
  "name": "textShadowOffsetY",
  "count": 1081
}, {
  "name": "padding",
  "count": 1079
}, {
  "name": "borderRadius",
  "count": 1051
}, {
  "name": "align",
  "count": 916
}, {
  "name": "verticalAlign",
  "count": 913
}, {
  "name": "opacity",
  "count": 692
}, {
  "name": "show",
  "count": 664
}, {
  "name": "overflow",
  "count": 567
}, {
  "name": "ellipsis",
  "count": 567
}, {
  "name": "lineOverflow",
  "count": 567
}, {
  "name": "position",
  "count": 528
}, {
  "name": "rich",
  "count": 514
}, {
  "name": "<style_name>",
  "count": 514
}, {
  "name": "distance",
  "count": 472
}, {
  "name": "label",
  "count": 468
}, {
  "name": "type",
  "count": 389
}, {
  "name": "rotate",
  "count": 365
}, {
  "name": "offset",
  "count": 357
}, {
  "name": "itemStyle",
  "count": 356
}, {
  "name": "borderCap",
  "count": 347
}, {
  "name": "borderJoin",
  "count": 347
}, {
  "name": "borderMiterLimit",
  "count": 347
}, {
  "name": "formatter",
  "count": 331
}, {
  "name": "lineStyle",
  "count": 298
}, {
  "name": "dashOffset",
  "count": 278
}, {
  "name": "cap",
  "count": 278
}, {
  "name": "join",
  "count": 278
}, {
  "name": "miterLimit",
  "count": 278
}, {
  "name": "emphasis",
  "count": 175
}, {
  "name": "blur",
  "count": 143
}, {
  "name": "name",
  "count": 133
}, {
  "name": "curveness",
  "count": 124
}, {
  "name": "symbol",
  "count": 119
}, {
  "name": "symbolSize",
  "count": 119
}, {
  "name": "x",
  "count": 115
}, {
  "name": "y",
  "count": 115
}, {
  "name": "value",
  "count": 101
}, {
  "name": "symbolKeepAspect",
  "count": 94
}, {
  "name": "silent",
  "count": 93
}, {
  "name": "labelLine",
  "count": 81
}, {
  "name": "rotation",
  "count": 78
}, {
  "name": "symbolOffset",
  "count": 75
}, {
  "name": "id",
  "count": 71
}, {
  "name": "data",
  "count": 71
}, {
  "name": "symbolRotate",
  "count": 67
}, {
  "name": "animationDuration",
  "count": 66
}, {
  "name": "animationEasing",
  "count": 66
}, {
  "name": "animationDelay",
  "count": 65
}, {
  "name": "z",
  "count": 64
}, {
  "name": "animation",
  "count": 64
}, {
  "name": "animationDurationUpdate",
  "count": 63
}, {
  "name": "animationThreshold",
  "count": 62
}, {
  "name": "animationEasingUpdate",
  "count": 62
}, {
  "name": "animationDelayUpdate",
  "count": 62
}, {
  "name": "style",
  "count": 60
}, {
  "name": "select",
  "count": 56
}, {
  "name": "textStyle",
  "count": 54
}, {
  "name": "zlevel",
  "count": 52
}, {
  "name": "transition",
  "count": 48
}, {
  "name": "focus",
  "count": 41
}, {
  "name": "blurScope",
  "count": 41
}, {
  "name": "coord",
  "count": 41
}, {
  "name": "tooltip",
  "count": 40
}, {
  "name": "inside",
  "count": 40
}, {
  "name": "valueIndex",
  "count": 40
}, {
  "name": "valueDim",
  "count": 40
}, {
  "name": "extraCssText",
  "count": 38
}, {
  "name": "interval",
  "count": 34
}, {
  "name": "left",
  "count": 33
}, {
  "name": "top",
  "count": 33
}, {
  "name": "right",
  "count": 33
}, {
  "name": "bottom",
  "count": 33
}, {
  "name": "draggable",
  "count": 31
}, {
  "name": "decal",
  "count": 28
}, {
  "name": "dashArrayX",
  "count": 28
}, {
  "name": "dashArrayY",
  "count": 28
}, {
  "name": "maxTileWidth",
  "count": 28
}, {
  "name": "maxTileHeight",
  "count": 28
}, {
  "name": "margin",
  "count": 27
}, {
  "name": "xAxis",
  "count": 27
}, {
  "name": "yAxis",
  "count": 27
}, {
  "name": "origin",
  "count": 26
}, {
  "name": "0",
  "count": 26
}, {
  "name": "1",
  "count": 26
}, {
  "name": "precision",
  "count": 25
}, {
  "name": "scaleX",
  "count": 25
}, {
  "name": "scaleY",
  "count": 25
}, {
  "name": "originX",
  "count": 25
}, {
  "name": "originY",
  "count": 25
}, {
  "name": "info",
  "count": 25
}, {
  "name": "invisible",
  "count": 25
}, {
  "name": "ignore",
  "count": 25
}, {
  "name": "textContent",
  "count": 25
}, {
  "name": "textConfig",
  "count": 25
}, {
  "name": "layoutRect",
  "count": 25
}, {
  "name": "local",
  "count": 25
}, {
  "name": "insideFill",
  "count": 25
}, {
  "name": "insideStroke",
  "count": 25
}, {
  "name": "outsideFill",
  "count": 25
}, {
  "name": "outsideStroke",
  "count": 25
}, {
  "name": "smooth",
  "count": 24
}, {
  "name": "selectedMode",
  "count": 23
}, {
  "name": "fill",
  "count": 23
}, {
  "name": "stroke",
  "count": 23
}, {
  "name": "lineWidth",
  "count": 23
}, {
  "name": "length",
  "count": 21
}, {
  "name": "areaStyle",
  "count": 20
}, {
  "name": "shape",
  "count": 20
}, {
  "name": "cursor",
  "count": 19
}, {
  "name": "showAbove",
  "count": 19
}, {
  "name": "splitNumber",
  "count": 18
}, {
  "name": "progressive",
  "count": 18
}, {
  "name": "length2",
  "count": 18
}, {
  "name": "minTurnAngle",
  "count": 18
}, {
  "name": "labelLayout",
  "count": 18
}, {
  "name": "hideOverlap",
  "count": 17
}, {
  "name": "moveOverlap",
  "count": 17
}, {
  "name": "dx",
  "count": 17
}, {
  "name": "dy",
  "count": 17
}, {
  "name": "labelLinePoints",
  "count": 17
}, {
  "name": "icon",
  "count": 16
}, {
  "name": "xAxisIndex",
  "count": 15
}, {
  "name": "yAxisIndex",
  "count": 15
}, {
  "name": "min",
  "count": 14
}, {
  "name": "max",
  "count": 14
}, {
  "name": "scale",
  "count": 14
}, {
  "name": "coordinateSystem",
  "count": 13
}, {
  "name": "markPoint",
  "count": 13
}, {
  "name": "markLine",
  "count": 13
}, {
  "name": "markArea",
  "count": 13
}, {
  "name": "z2",
  "count": 13
}, {
  "name": "during",
  "count": 13
}, {
  "name": "extra",
  "count": 13
}, {
  "name": "orient",
  "count": 12
}, {
  "name": "iconStyle",
  "count": 12
}, {
  "name": "areaColor",
  "count": 12
}, {
  "name": "$action",
  "count": 12
}, {
  "name": "bounding",
  "count": 12
}, {
  "name": "onclick",
  "count": 12
}, {
  "name": "onmouseover",
  "count": 12
}, {
  "name": "onmouseout",
  "count": 12
}, {
  "name": "onmousemove",
  "count": 12
}, {
  "name": "onmousewheel",
  "count": 12
}, {
  "name": "onmousedown",
  "count": 12
}, {
  "name": "onmouseup",
  "count": 12
}, {
  "name": "ondrag",
  "count": 12
}, {
  "name": "ondragstart",
  "count": 12
}, {
  "name": "ondragend",
  "count": 12
}, {
  "name": "ondragenter",
  "count": 12
}, {
  "name": "ondragleave",
  "count": 12
}, {
  "name": "ondragover",
  "count": 12
}, {
  "name": "ondrop",
  "count": 12
}, {
  "name": "legendHoverLink",
  "count": 12
}, {
  "name": "upperLabel",
  "count": 12
}, {
  "name": "dimensions",
  "count": 11
}, {
  "name": "axisPointer",
  "count": 10
}, {
  "name": "snap",
  "count": 10
}, {
  "name": "shadowStyle",
  "count": 10
}, {
  "name": "r",
  "count": 10
}, {
  "name": "encode",
  "count": 10
}, {
  "name": "minAngle",
  "count": 10
}, {
  "name": "morph",
  "count": 10
}, {
  "name": "title",
  "count": 9
}, {
  "name": "textAlign",
  "count": 9
}, {
  "name": "triggerEvent",
  "count": 9
}, {
  "name": "inverse",
  "count": 9
}, {
  "name": "axisLine",
  "count": 9
}, {
  "name": "axisTick",
  "count": 9
}, {
  "name": "axisLabel",
  "count": 9
}, {
  "name": "boundaryGap",
  "count": 8
}, {
  "name": "showMinLabel",
  "count": 8
}, {
  "name": "showMaxLabel",
  "count": 8
}, {
  "name": "splitLine",
  "count": 8
}, {
  "name": "size",
  "count": 8
}, {
  "name": "throttle",
  "count": 8
}, {
  "name": "center",
  "count": 8
}, {
  "name": "startAngle",
  "count": 8
}, {
  "name": "geoIndex",
  "count": 8
}, {
  "name": "cx",
  "count": 8
}, {
  "name": "cy",
  "count": 8
}, {
  "name": "seriesLayoutBy",
  "count": 8
}, {
  "name": "datasetIndex",
  "count": 8
}, {
  "name": "color0",
  "count": 8
}, {
  "name": "borderColor0",
  "count": 8
}, {
  "name": "nameGap",
  "count": 7
}, {
  "name": "minInterval",
  "count": 7
}, {
  "name": "maxInterval",
  "count": 7
}, {
  "name": "logBase",
  "count": 7
}, {
  "name": "alignWithLabel",
  "count": 7
}, {
  "name": "minorTick",
  "count": 7
}, {
  "name": "polarIndex",
  "count": 7
}, {
  "name": "clockwise",
  "count": 7
}, {
  "name": "clip",
  "count": 7
}, {
  "name": "text",
  "count": 6
}, {
  "name": "nameLocation",
  "count": 6
}, {
  "name": "nameTextStyle",
  "count": 6
}, {
  "name": "nameRotate",
  "count": 6
}, {
  "name": "splitArea",
  "count": 6
}, {
  "name": "triggerTooltip",
  "count": 6
}, {
  "name": "status",
  "count": 6
}, {
  "name": "handle",
  "count": 6
}, {
  "name": "textPosition",
  "count": 6
}, {
  "name": "textFill",
  "count": 6
}, {
  "name": "textBackgroundColor",
  "count": 6
}, {
  "name": "textBorderRadius",
  "count": 6
}, {
  "name": "textPadding",
  "count": 6
}, {
  "name": "line",
  "count": 6
}, {
  "name": "layout",
  "count": 6
}, {
  "name": "r0",
  "count": 6
}, {
  "name": "progressiveThreshold",
  "count": 6
}, {
  "name": "colorAlpha",
  "count": 6
}, {
  "name": "colorSaturation",
  "count": 6
}, {
  "name": "offsetCenter",
  "count": 6
}, {
  "name": "target",
  "count": 5
}, {
  "name": "itemGap",
  "count": 5
}, {
  "name": "minorSplitLine",
  "count": 5
}, {
  "name": "radius",
  "count": 5
}, {
  "name": "realtime",
  "count": 5
}, {
  "name": "zoom",
  "count": 5
}, {
  "name": "bar",
  "count": 5
}, {
  "name": "stack",
  "count": 5
}, {
  "name": "roam",
  "count": 5
}, {
  "name": "endAngle",
  "count": 5
}, {
  "name": "valueAnimation",
  "count": 5
}, {
  "name": "calendarIndex",
  "count": 5
}, {
  "name": "link",
  "count": 4
}, {
  "name": "selected",
  "count": 4
}, {
  "name": "trigger",
  "count": 4
}, {
  "name": "axis",
  "count": 4
}, {
  "name": "crossStyle",
  "count": 4
}, {
  "name": "end",
  "count": 4
}, {
  "name": "seriesIndex",
  "count": 4
}, {
  "name": "inRange",
  "count": 4
}, {
  "name": "outOfRange",
  "count": 4
}, {
  "name": "nameMap",
  "count": 4
}, {
  "name": "points",
  "count": 4
}, {
  "name": "smoothConstraint",
  "count": 4
}, {
  "name": "x1",
  "count": 4
}, {
  "name": "y1",
  "count": 4
}, {
  "name": "x2",
  "count": 4
}, {
  "name": "y2",
  "count": 4
}, {
  "name": "percent",
  "count": 4
}, {
  "name": "endLabel",
  "count": 4
}, {
  "name": "large",
  "count": 4
}, {
  "name": "largeThreshold",
  "count": 4
}, {
  "name": "hoverAnimation",
  "count": 4
}, {
  "name": "edgeLabel",
  "count": 4
}, {
  "name": "textVerticalAlign",
  "count": 3
}, {
  "name": "itemWidth",
  "count": 3
}, {
  "name": "itemHeight",
  "count": 3
}, {
  "name": "filterMode",
  "count": 3
}, {
  "name": "handleStyle",
  "count": 3
}, {
  "name": "brushStyle",
  "count": 3
}, {
  "name": "rect",
  "count": 3
}, {
  "name": "polygon",
  "count": 3
}, {
  "name": "map",
  "count": 3
}, {
  "name": "children",
  "count": 3
}, {
  "name": "image",
  "count": 3
}, {
  "name": "font",
  "count": 3
}, {
  "name": "source",
  "count": 3
}, {
  "name": "config",
  "count": 3
}, {
  "name": "print",
  "count": 3
}, {
  "name": "sort",
  "count": 3
}, {
  "name": "withName",
  "count": 3
}, {
  "name": "withoutName",
  "count": 3
}, {
  "name": "roundCap",
  "count": 3
}, {
  "name": "barWidth",
  "count": 3
}, {
  "name": "barMaxWidth",
  "count": 3
}, {
  "name": "barMinWidth",
  "count": 3
}, {
  "name": "progressiveChunkMode",
  "count": 3
}, {
  "name": "visualDimension",
  "count": 3
}, {
  "name": "visualMin",
  "count": 3
}, {
  "name": "visualMax",
  "count": 3
}, {
  "name": "colorMappingBy",
  "count": 3
}, {
  "name": "visibleMin",
  "count": 3
}, {
  "name": "childrenVisibleMin",
  "count": 3
}, {
  "name": "gapWidth",
  "count": 3
}, {
  "name": "borderColorSaturation",
  "count": 3
}, {
  "name": "levels",
  "count": 3
}, {
  "name": "selectorLabel",
  "count": 2
}, {
  "name": "gridIndex",
  "count": 2
}, {
  "name": "realtimeSort",
  "count": 2
}, {
  "name": "sortSeriesIndex",
  "count": 2
}, {
  "name": "onZero",
  "count": 2
}, {
  "name": "onZeroAxisIndex",
  "count": 2
}, {
  "name": "radar",
  "count": 2
}, {
  "name": "dataZoom",
  "count": 2
}, {
  "name": "radiusAxisIndex",
  "count": 2
}, {
  "name": "angleAxisIndex",
  "count": 2
}, {
  "name": "start",
  "count": 2
}, {
  "name": "startValue",
  "count": 2
}, {
  "name": "endValue",
  "count": 2
}, {
  "name": "minSpan",
  "count": 2
}, {
  "name": "maxSpan",
  "count": 2
}, {
  "name": "minValueSpan",
  "count": 2
}, {
  "name": "maxValueSpan",
  "count": 2
}, {
  "name": "zoomLock",
  "count": 2
}, {
  "name": "rangeMode",
  "count": 2
}, {
  "name": "handleIcon",
  "count": 2
}, {
  "name": "handleSize",
  "count": 2
}, {
  "name": "moveHandleStyle",
  "count": 2
}, {
  "name": "range",
  "count": 2
}, {
  "name": "textGap",
  "count": 2
}, {
  "name": "dimension",
  "count": 2
}, {
  "name": "hoverLink",
  "count": 2
}, {
  "name": "controller",
  "count": 2
}, {
  "name": "categories",
  "count": 2
}, {
  "name": "triggerOn",
  "count": 2
}, {
  "name": "toolbox",
  "count": 2
}, {
  "name": "itemSize",
  "count": 2
}, {
  "name": "back",
  "count": 2
}, {
  "name": "option",
  "count": 2
}, {
  "name": "brush",
  "count": 2
}, {
  "name": "lineX",
  "count": 2
}, {
  "name": "lineY",
  "count": 2
}, {
  "name": "keep",
  "count": 2
}, {
  "name": "clear",
  "count": 2
}, {
  "name": "brushType",
  "count": 2
}, {
  "name": "aspectScale",
  "count": 2
}, {
  "name": "boundingCoords",
  "count": 2
}, {
  "name": "scaleLimit",
  "count": 2
}, {
  "name": "nameProperty",
  "count": 2
}, {
  "name": "layoutCenter",
  "count": 2
}, {
  "name": "layoutSize",
  "count": 2
}, {
  "name": "parallel",
  "count": 2
}, {
  "name": "parallelIndex",
  "count": 2
}, {
  "name": "loop",
  "count": 2
}, {
  "name": "checkpointStyle",
  "count": 2
}, {
  "name": "controlStyle",
  "count": 2
}, {
  "name": "progress",
  "count": 2
}, {
  "name": "diffChildrenByName",
  "count": 2
}, {
  "name": "polyline",
  "count": 2
}, {
  "name": "cpx1",
  "count": 2
}, {
  "name": "cpy1",
  "count": 2
}, {
  "name": "cpx2",
  "count": 2
}, {
  "name": "cpy2",
  "count": 2
}, {
  "name": "enabled",
  "count": 2
}, {
  "name": "series",
  "count": 2
}, {
  "name": "maxCount",
  "count": 2
}, {
  "name": "prefix",
  "count": 2
}, {
  "name": "separator",
  "count": 2
}, {
  "name": "middle",
  "count": 2
}, {
  "name": "sampling",
  "count": 2
}, {
  "name": "barMinHeight",
  "count": 2
}, {
  "name": "barMinAngle",
  "count": 2
}, {
  "name": "barGap",
  "count": 2
}, {
  "name": "barCategoryGap",
  "count": 2
}, {
  "name": "period",
  "count": 2
}, {
  "name": "nodeClick",
  "count": 2
}, {
  "name": "nodes",
  "count": 2
}, {
  "name": "links",
  "count": 2
}, {
  "name": "edges",
  "count": 2
}, {
  "name": "depth",
  "count": 2
}, {
  "name": "detail",
  "count": 2
}, {
  "name": "keepAspect",
  "count": 2
}, {
  "name": "symbolPosition",
  "count": 2
}, {
  "name": "symbolRepeat",
  "count": 2
}, {
  "name": "symbolRepeatDirection",
  "count": 2
}, {
  "name": "symbolMargin",
  "count": 2
}, {
  "name": "symbolClip",
  "count": 2
}, {
  "name": "symbolBoundingData",
  "count": 2
}, {
  "name": "symbolPatternSize",
  "count": 2
}, {
  "name": "subtext",
  "count": 1
}, {
  "name": "sublink",
  "count": 1
}, {
  "name": "subtarget",
  "count": 1
}, {
  "name": "subtextStyle",
  "count": 1
}, {
  "name": "legend",
  "count": 1
}, {
  "name": "inactiveColor",
  "count": 1
}, {
  "name": "scrollDataIndex",
  "count": 1
}, {
  "name": "pageButtonItemGap",
  "count": 1
}, {
  "name": "pageButtonGap",
  "count": 1
}, {
  "name": "pageButtonPosition",
  "count": 1
}, {
  "name": "pageFormatter",
  "count": 1
}, {
  "name": "pageIcons",
  "count": 1
}, {
  "name": "horizontal",
  "count": 1
}, {
  "name": "vertical",
  "count": 1
}, {
  "name": "pageIconColor",
  "count": 1
}, {
  "name": "pageIconInactiveColor",
  "count": 1
}, {
  "name": "pageIconSize",
  "count": 1
}, {
  "name": "pageTextStyle",
  "count": 1
}, {
  "name": "selector",
  "count": 1
}, {
  "name": "selectorPosition",
  "count": 1
}, {
  "name": "selectorItemGap",
  "count": 1
}, {
  "name": "selectorButtonGap",
  "count": 1
}, {
  "name": "grid",
  "count": 1
}, {
  "name": "containLabel",
  "count": 1
}, {
  "name": "polar",
  "count": 1
}, {
  "name": "radiusAxis",
  "count": 1
}, {
  "name": "angleAxis",
  "count": 1
}, {
  "name": "indicator",
  "count": 1
}, {
  "name": "disabled",
  "count": 1
}, {
  "name": "zoomOnMouseWheel",
  "count": 1
}, {
  "name": "moveOnMouseMove",
  "count": 1
}, {
  "name": "moveOnMouseWheel",
  "count": 1
}, {
  "name": "preventDefaultMouseMove",
  "count": 1
}, {
  "name": "slider",
  "count": 1
}, {
  "name": "dataBackground",
  "count": 1
}, {
  "name": "selectedDataBackground",
  "count": 1
}, {
  "name": "fillerColor",
  "count": 1
}, {
  "name": "moveHandleIcon",
  "count": 1
}, {
  "name": "moveHandleSize",
  "count": 1
}, {
  "name": "labelPrecision",
  "count": 1
}, {
  "name": "labelFormatter",
  "count": 1
}, {
  "name": "showDetail",
  "count": 1
}, {
  "name": "showDataShadow",
  "count": 1
}, {
  "name": "brushSelect",
  "count": 1
}, {
  "name": "visualMap",
  "count": 1
}, {
  "name": "continuous",
  "count": 1
}, {
  "name": "calculable",
  "count": 1
}, {
  "name": "indicatorIcon",
  "count": 1
}, {
  "name": "indicatorSize",
  "count": 1
}, {
  "name": "indicatorStyle",
  "count": 1
}, {
  "name": "piecewise",
  "count": 1
}, {
  "name": "pieces",
  "count": 1
}, {
  "name": "minOpen",
  "count": 1
}, {
  "name": "maxOpen",
  "count": 1
}, {
  "name": "showLabel",
  "count": 1
}, {
  "name": "itemSymbol",
  "count": 1
}, {
  "name": "showContent",
  "count": 1
}, {
  "name": "alwaysShowContent",
  "count": 1
}, {
  "name": "showDelay",
  "count": 1
}, {
  "name": "hideDelay",
  "count": 1
}, {
  "name": "enterable",
  "count": 1
}, {
  "name": "renderMode",
  "count": 1
}, {
  "name": "confine",
  "count": 1
}, {
  "name": "appendToBody",
  "count": 1
}, {
  "name": "className",
  "count": 1
}, {
  "name": "transitionDuration",
  "count": 1
}, {
  "name": "order",
  "count": 1
}, {
  "name": "showTitle",
  "count": 1
}, {
  "name": "feature",
  "count": 1
}, {
  "name": "saveAsImage",
  "count": 1
}, {
  "name": "connectedBackgroundColor",
  "count": 1
}, {
  "name": "excludeComponents",
  "count": 1
}, {
  "name": "pixelRatio",
  "count": 1
}, {
  "name": "restore",
  "count": 1
}, {
  "name": "dataView",
  "count": 1
}, {
  "name": "readOnly",
  "count": 1
}, {
  "name": "optionToContent",
  "count": 1
}, {
  "name": "contentToOption",
  "count": 1
}, {
  "name": "lang",
  "count": 1
}, {
  "name": "textareaColor",
  "count": 1
}, {
  "name": "textareaBorderColor",
  "count": 1
}, {
  "name": "textColor",
  "count": 1
}, {
  "name": "buttonColor",
  "count": 1
}, {
  "name": "buttonTextColor",
  "count": 1
}, {
  "name": "magicType",
  "count": 1
}, {
  "name": "tiled",
  "count": 1
}, {
  "name": "brushLink",
  "count": 1
}, {
  "name": "brushMode",
  "count": 1
}, {
  "name": "transformable",
  "count": 1
}, {
  "name": "throttleType",
  "count": 1
}, {
  "name": "throttleDelay",
  "count": 1
}, {
  "name": "removeOnClick",
  "count": 1
}, {
  "name": "inBrush",
  "count": 1
}, {
  "name": "outOfBrush",
  "count": 1
}, {
  "name": "geo",
  "count": 1
}, {
  "name": "regions",
  "count": 1
}, {
  "name": "axisExpandable",
  "count": 1
}, {
  "name": "axisExpandCenter",
  "count": 1
}, {
  "name": "axisExpandCount",
  "count": 1
}, {
  "name": "axisExpandWidth",
  "count": 1
}, {
  "name": "axisExpandTriggerOn",
  "count": 1
}, {
  "name": "parallelAxisDefault",
  "count": 1
}, {
  "name": "parallelAxis",
  "count": 1
}, {
  "name": "dim",
  "count": 1
}, {
  "name": "areaSelectStyle",
  "count": 1
}, {
  "name": "singleAxis",
  "count": 1
}, {
  "name": "timeline",
  "count": 1
}, {
  "name": "axisType",
  "count": 1
}, {
  "name": "currentIndex",
  "count": 1
}, {
  "name": "autoPlay",
  "count": 1
}, {
  "name": "rewind",
  "count": 1
}, {
  "name": "playInterval",
  "count": 1
}, {
  "name": "replaceMerge",
  "count": 1
}, {
  "name": "controlPosition",
  "count": 1
}, {
  "name": "showPlayBtn",
  "count": 1
}, {
  "name": "showPrevBtn",
  "count": 1
}, {
  "name": "showNextBtn",
  "count": 1
}, {
  "name": "playIcon",
  "count": 1
}, {
  "name": "stopIcon",
  "count": 1
}, {
  "name": "prevIcon",
  "count": 1
}, {
  "name": "nextIcon",
  "count": 1
}, {
  "name": "graphic",
  "count": 1
}, {
  "name": "elements",
  "count": 1
}, {
  "name": "group",
  "count": 1
}, {
  "name": "circle",
  "count": 1
}, {
  "name": "ring",
  "count": 1
}, {
  "name": "sector",
  "count": 1
}, {
  "name": "arc",
  "count": 1
}, {
  "name": "bezierCurve",
  "count": 1
}, {
  "name": "calendar",
  "count": 1
}, {
  "name": "cellSize",
  "count": 1
}, {
  "name": "dayLabel",
  "count": 1
}, {
  "name": "firstDay",
  "count": 1
}, {
  "name": "monthLabel",
  "count": 1
}, {
  "name": "yearLabel",
  "count": 1
}, {
  "name": "dataset",
  "count": 1
}, {
  "name": "sourceHeader",
  "count": 1
}, {
  "name": "transform",
  "count": 1
}, {
  "name": "filter",
  "count": 1
}, {
  "name": "xxx:xxx",
  "count": 1
}, {
  "name": "fromDatasetIndex",
  "count": 1
}, {
  "name": "fromDatasetId",
  "count": 1
}, {
  "name": "fromTransformResult",
  "count": 1
}, {
  "name": "aria",
  "count": 1
}, {
  "name": "description",
  "count": 1
}, {
  "name": "general",
  "count": 1
}, {
  "name": "withTitle",
  "count": 1
}, {
  "name": "withoutTitle",
  "count": 1
}, {
  "name": "single",
  "count": 1
}, {
  "name": "multiple",
  "count": 1
}, {
  "name": "allData",
  "count": 1
}, {
  "name": "partialData",
  "count": 1
}, {
  "name": "decals",
  "count": 1
}, {
  "name": "showSymbol",
  "count": 1
}, {
  "name": "showAllSymbol",
  "count": 1
}, {
  "name": "connectNulls",
  "count": 1
}, {
  "name": "step",
  "count": 1
}, {
  "name": "smoothMonotone",
  "count": 1
}, {
  "name": "showBackground",
  "count": 1
}, {
  "name": "backgroundStyle",
  "count": 1
}, {
  "name": "pie",
  "count": 1
}, {
  "name": "selectedOffset",
  "count": 1
}, {
  "name": "minShowLabelAngle",
  "count": 1
}, {
  "name": "roseType",
  "count": 1
}, {
  "name": "avoidLabelOverlap",
  "count": 1
}, {
  "name": "stillShowZeroSum",
  "count": 1
}, {
  "name": "alignTo",
  "count": 1
}, {
  "name": "edgeDistance",
  "count": 1
}, {
  "name": "bleedMargin",
  "count": 1
}, {
  "name": "distanceToLabelLine",
  "count": 1
}, {
  "name": "maxSurfaceAngle",
  "count": 1
}, {
  "name": "scaleSize",
  "count": 1
}, {
  "name": "animationType",
  "count": 1
}, {
  "name": "animationTypeUpdate",
  "count": 1
}, {
  "name": "scatter",
  "count": 1
}, {
  "name": "effectScatter",
  "count": 1
}, {
  "name": "effectType",
  "count": 1
}, {
  "name": "showEffectOn",
  "count": 1
}, {
  "name": "rippleEffect",
  "count": 1
}, {
  "name": "radarIndex",
  "count": 1
}, {
  "name": "tree",
  "count": 1
}, {
  "name": "edgeShape",
  "count": 1
}, {
  "name": "edgeForkPosition",
  "count": 1
}, {
  "name": "expandAndCollapse",
  "count": 1
}, {
  "name": "initialTreeDepth",
  "count": 1
}, {
  "name": "leaves",
  "count": 1
}, {
  "name": "treemap",
  "count": 1
}, {
  "name": "squareRatio",
  "count": 1
}, {
  "name": "leafDepth",
  "count": 1
}, {
  "name": "drillDownIcon",
  "count": 1
}, {
  "name": "zoomToNodeRatio",
  "count": 1
}, {
  "name": "breadcrumb",
  "count": 1
}, {
  "name": "emptyItemWidth",
  "count": 1
}, {
  "name": "sunburst",
  "count": 1
}, {
  "name": "renderLabelForZeroData",
  "count": 1
}, {
  "name": "boxplot",
  "count": 1
}, {
  "name": "boxWidth",
  "count": 1
}, {
  "name": "candlestick",
  "count": 1
}, {
  "name": "heatmap",
  "count": 1
}, {
  "name": "pointSize",
  "count": 1
}, {
  "name": "blurSize",
  "count": 1
}, {
  "name": "minOpacity",
  "count": 1
}, {
  "name": "maxOpacity",
  "count": 1
}, {
  "name": "mapValueCalculation",
  "count": 1
}, {
  "name": "showLegendSymbol",
  "count": 1
}, {
  "name": "inactiveOpacity",
  "count": 1
}, {
  "name": "activeOpacity",
  "count": 1
}, {
  "name": "lines",
  "count": 1
}, {
  "name": "effect",
  "count": 1
}, {
  "name": "delay",
  "count": 1
}, {
  "name": "constantSpeed",
  "count": 1
}, {
  "name": "trailLength",
  "count": 1
}, {
  "name": "coords",
  "count": 1
}, {
  "name": "graph",
  "count": 1
}, {
  "name": "circular",
  "count": 1
}, {
  "name": "rotateLabel",
  "count": 1
}, {
  "name": "force",
  "count": 1
}, {
  "name": "initLayout",
  "count": 1
}, {
  "name": "repulsion",
  "count": 1
}, {
  "name": "gravity",
  "count": 1
}, {
  "name": "edgeLength",
  "count": 1
}, {
  "name": "layoutAnimation",
  "count": 1
}, {
  "name": "friction",
  "count": 1
}, {
  "name": "nodeScaleRatio",
  "count": 1
}, {
  "name": "edgeSymbol",
  "count": 1
}, {
  "name": "edgeSymbolSize",
  "count": 1
}, {
  "name": "autoCurveness",
  "count": 1
}, {
  "name": "fixed",
  "count": 1
}, {
  "name": "category",
  "count": 1
}, {
  "name": "ignoreForceLayout",
  "count": 1
}, {
  "name": "sankey",
  "count": 1
}, {
  "name": "nodeWidth",
  "count": 1
}, {
  "name": "nodeGap",
  "count": 1
}, {
  "name": "nodeAlign",
  "count": 1
}, {
  "name": "layoutIterations",
  "count": 1
}, {
  "name": "funnel",
  "count": 1
}, {
  "name": "minSize",
  "count": 1
}, {
  "name": "maxSize",
  "count": 1
}, {
  "name": "gap",
  "count": 1
}, {
  "name": "funnelAlign",
  "count": 1
}, {
  "name": "gauge",
  "count": 1
}, {
  "name": "overlap",
  "count": 1
}, {
  "name": "pointer",
  "count": 1
}, {
  "name": "anchor",
  "count": 1
}, {
  "name": "pictorialBar",
  "count": 1
}, {
  "name": "themeRiver",
  "count": 1
}, {
  "name": "singleAxisIndex",
  "count": 1
}, {
  "name": "date",
  "count": 1
}, {
  "name": "custom",
  "count": 1
}, {
  "name": "renderItem",
  "count": 1
}, {
  "name": "arguments",
  "count": 1
}, {
  "name": "params",
  "count": 1
}, {
  "name": "api",
  "count": 1
}, {
  "name": "styleEmphasis",
  "count": 1
}, {
  "name": "visual",
  "count": 1
}, {
  "name": "barLayout",
  "count": 1
}, {
  "name": "currentSeriesIndices",
  "count": 1
}, {
  "name": "getWidth",
  "count": 1
}, {
  "name": "getHeight",
  "count": 1
}, {
  "name": "getZr",
  "count": 1
}, {
  "name": "getDevicePixelRatio",
  "count": 1
}, {
  "name": "return",
  "count": 1
}, {
  "name": "return_group",
  "count": 1
}, {
  "name": "return_path",
  "count": 1
}, {
  "name": "pathData",
  "count": 1
}, {
  "name": "d",
  "count": 1
}, {
  "name": "return_image",
  "count": 1
}, {
  "name": "return_text",
  "count": 1
}, {
  "name": "return_rect",
  "count": 1
}, {
  "name": "return_circle",
  "count": 1
}, {
  "name": "return_ring",
  "count": 1
}, {
  "name": "return_sector",
  "count": 1
}, {
  "name": "return_arc",
  "count": 1
}, {
  "name": "return_polygon",
  "count": 1
}, {
  "name": "return_polyline",
  "count": 1
}, {
  "name": "return_line",
  "count": 1
}, {
  "name": "return_bezierCurve",
  "count": 1
}, {
  "name": "darkMode",
  "count": 1
}, {
  "name": "stateAnimation",
  "count": 1
}, {
  "name": "duration",
  "count": 1
}, {
  "name": "easing",
  "count": 1
}, {
  "name": "blendMode",
  "count": 1
}, {
  "name": "hoverLayerThreshold",
  "count": 1
}, {
  "name": "useUTC",
  "count": 1
}, {
  "name": "options",
  "count": 1
}, {
  "name": "media",
  "count": 1
}, {
  "name": "query",
  "count": 1
}, {
  "name": "minWidth",
  "count": 1
}, {
  "name": "maxHeight",
  "count": 1
}, {
  "name": "minAspectRatio",
  "count": 1
}];

/***/ }),

/***/ "./src/dep/showDebugDirtyRect.js":
/*!***************************************!*\
  !*** ./src/dep/showDebugDirtyRect.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* export default binding */ __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
var DebugRect = function () {
  function DebugRect(style) {
    var dom = this.dom = document.createElement('div');
    dom.className = 'ec-debug-dirty-rect';
    style = Object.assign({}, style);
    Object.assign(style, {
      backgroundColor: 'rgba(0, 0, 255, 0.2)',
      border: '1px solid #00f'
    });
    dom.style.cssText = "\nposition: absolute;\nopacity: 0;\ntransition: opacity 0.5s linear;\npointer-events: none;\n";

    for (var key in style) {
      if (style.hasOwnProperty(key)) {
        dom.style[key] = style[key];
      }
    }
  }

  DebugRect.prototype.update = function (rect) {
    var domStyle = this.dom.style;
    domStyle.width = rect.width + 'px';
    domStyle.height = rect.height + 'px';
    domStyle.left = rect.x + 'px';
    domStyle.top = rect.y + 'px';
  };

  DebugRect.prototype.hide = function () {
    this.dom.style.opacity = '0';
  };

  DebugRect.prototype.show = function () {
    var _this = this;

    clearTimeout(this._hideTimeout);
    this.dom.style.opacity = '1';
    this._hideTimeout = setTimeout(function () {
      _this.hide();
    }, 500);
  };

  return DebugRect;
}();

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(zr, opts) {
  opts = opts || {};
  var painter = zr.painter;

  if (!painter.getLayers) {
    throw new Error('Debug dirty rect can only been used on canvas renderer.');
  }

  if (painter.isSingleCanvas()) {
    throw new Error('Debug dirty rect can only been used on zrender inited with container.');
  }

  var debugViewRoot = document.createElement('div');
  debugViewRoot.style.cssText = "\nposition:absolute;\nleft:0;\ntop:0;\nright:0;\nbottom:0;\npointer-events:none;\n";
  debugViewRoot.className = 'ec-debug-dirty-rect-container';
  var debugRects = [];
  var dom = zr.dom;
  dom.appendChild(debugViewRoot);
  var computedStyle = getComputedStyle(dom);

  if (computedStyle.position === 'static') {
    dom.style.position = 'relative';
  }

  zr.on('rendered', function () {
    if (painter.getLayers) {
      var idx_1 = 0;
      painter.eachBuiltinLayer(function (layer) {
        if (!layer.debugGetPaintRects) {
          return;
        }

        var paintRects = layer.debugGetPaintRects();

        for (var i = 0; i < paintRects.length; i++) {
          if (!debugRects[idx_1]) {
            debugRects[idx_1] = new DebugRect(opts.style);
            debugViewRoot.appendChild(debugRects[idx_1].dom);
          }

          debugRects[idx_1].show();
          debugRects[idx_1].update(paintRects[i]);
          idx_1++;
        }
      });

      for (var i = idx_1; i < debugRects.length; i++) {
        debugRects[i].hide();
      }
    }
  });
}

/***/ }),

/***/ "./src/editor/downloadExample.js":
/*!***************************************!*\
  !*** ./src/editor/downloadExample.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "download": () => /* binding */ download
/* harmony export */ });
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/store */ "./src/common/store.js");
/* harmony import */ var _common_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/config */ "./src/common/config.js");
/* harmony import */ var _common_helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/helper */ "./src/common/helper.js");



var hasRootPath = _common_store__WEBPACK_IMPORTED_MODULE_0__.store.sourceCode.indexOf('ROOT_PATH') >= 0;
var rootPathCode = hasRootPath ? "var ROOT_PATH = '".concat(_common_store__WEBPACK_IMPORTED_MODULE_0__.store.cdnRoot, "'") : '';
function download() {
  var code = "<!--\n    THIS EXAMPLE WAS DOWNLOADED FROM ".concat(window.location.href, "\n-->\n<!DOCTYPE html>\n<html style=\"height: 100%\">\n    <head>\n        <meta charset=\"utf-8\">\n    </head>\n    <body style=\"height: 100%; margin: 0\">\n        <div id=\"container\" style=\"height: 100%\"></div>\n\n        <script type=\"text/javascript\" src=\"").concat(_common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsMinJS, "\"></script>\n        <!-- Uncomment this line if you want to dataTool extension\n        <script type=\"text/javascript\" src=\"").concat(_common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsDir, "/dist/extension/dataTool.min.js\"></script>\n        -->\n        <!-- Uncomment this line if you want to use gl extension\n        <script type=\"text/javascript\" src=\"").concat(_common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsGLMinJS, "\"></script>\n        -->\n        <!-- Uncomment this line if you want to echarts-stat extension\n        <script type=\"text/javascript\" src=\"").concat(_common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsStatMinJS, "\"></script>\n        -->\n        <!-- Uncomment this line if you want to use map\n        <script type=\"text/javascript\" src=\"").concat(_common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsDir, "/map/js/china.js\"></script>\n        <script type=\"text/javascript\" src=\"").concat(_common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsDir, "/map/js/world.js\"></script>\n        -->\n        <!-- Uncomment these two lines if you want to use bmap extension\n        <script type=\"text/javascript\" src=\"https://api.map.baidu.com/api?v=2.0&ak=<Your Key Here>\"></script>\n        <script type=\"text/javascript\" src=\"").concat(_common_config__WEBPACK_IMPORTED_MODULE_1__.SCRIPT_URLS.echartsDir, "/dist/extension/bmap.min.js\"></script>\n        -->\n\n        <script type=\"text/javascript\">\nvar dom = document.getElementById(\"container\");\nvar myChart = echarts.init(dom);\nvar app = {};\n\nvar option;\n\n").concat(rootPathCode, "\n\n").concat(_common_store__WEBPACK_IMPORTED_MODULE_0__.store.sourceCode, "\n\nif (option && typeof option === 'object') {\n    myChart.setOption(option);\n}\n\n        </script>\n    </body>\n</html>\n    ");
  var file = new Blob([code], {
    type: 'text/html;charset=UTF-8',
    encoding: 'UTF-8'
  }); // download the blob

  (0,_common_helper__WEBPACK_IMPORTED_MODULE_2__.downloadBlob)(file, _common_config__WEBPACK_IMPORTED_MODULE_1__.URL_PARAMS.c + '.html');
}

/***/ }),

/***/ "./src/editor/sandbox.js":
/*!*******************************!*\
  !*** ./src/editor/sandbox.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createSandbox": () => /* binding */ createSandbox
/* harmony export */ });
/* harmony import */ var _dep_showDebugDirtyRect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dep/showDebugDirtyRect */ "./src/dep/showDebugDirtyRect.js");
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }


function createSandbox(optionUpdated) {
  var appEnv = {};
  var gui;
  var _intervalIdList = [];
  var _timeoutIdList = [];
  var _oldSetTimeout = window.setTimeout;
  var _oldSetInterval = window.setInterval;

  function setTimeout(func, delay) {
    var id = _oldSetTimeout(func, delay);

    _timeoutIdList.push(id);

    return id;
  }

  ;

  function setInterval(func, gap) {
    var id = _oldSetInterval(func, gap);

    _intervalIdList.push(id);

    return id;
  }

  ;

  function _clearTimeTickers() {
    for (var i = 0; i < _intervalIdList.length; i++) {
      clearInterval(_intervalIdList[i]);
    }

    for (var i = 0; i < _timeoutIdList.length; i++) {
      clearTimeout(_timeoutIdList[i]);
    }

    _intervalIdList = [];
    _timeoutIdList = [];
  }

  var _events = [];

  function _wrapOnMethods(chart) {
    var oldOn = chart.on;
    var oldSetOption = chart.setOption;

    chart.on = function (eventName) {
      var res = oldOn.apply(chart, arguments);

      _events.push(eventName);

      return res;
    };

    chart.setOption = function () {
      var res = oldSetOption.apply(this, arguments);
      optionUpdated && optionUpdated(chart);
      return res;
    };
  }

  function _clearChartEvents(chart) {
    _events.forEach(function (eventName) {
      if (chart) {
        chart.off(eventName);
      }
    });

    _events.length = 0;
  }

  var chartInstance;
  return {
    resize: function resize() {
      if (chartInstance) {
        chartInstance.resize();
      }
    },
    dispose: function dispose() {
      if (chartInstance) {
        chartInstance.dispose();
        chartInstance = null;
      }
    },
    getDataURL: function getDataURL() {
      return chartInstance.getDataURL({
        pixelRatio: 2,
        excludeComponents: ['toolbox']
      });
    },
    getOption: function getOption() {
      return chartInstance.getOption();
    },
    run: function run(el, store) {
      if (!chartInstance) {
        chartInstance = echarts.init(el, store.darkMode ? 'dark' : '', {
          renderer: store.renderer,
          useDirtyRect: store.useDirtyRect
        });

        if (store.useDirtyRect && store.renderer === 'canvas') {
          try {
            (0,_dep_showDebugDirtyRect__WEBPACK_IMPORTED_MODULE_0__.default)(chartInstance.getZr(), {
              autoHideDelay: 500
            });
          } catch (e) {
            console.error(e);
          }
        }

        _wrapOnMethods(chartInstance);
      } // if (this.hasEditorError()) {
      //     log(this.$t('editor.errorInEditor'), 'error');
      //     return;
      // }
      // TODO Scope the variables in component.


      _clearTimeTickers();

      _clearChartEvents(chartInstance); // Reset


      appEnv.config = null; // run the code

      var compiledCode = store.runCode;
      var func = new Function('myChart', 'app', 'setTimeout', 'setInterval', 'ROOT_PATH', 'var option;\n' + compiledCode + '\nreturn option;');
      var option = func(chartInstance, appEnv, setTimeout, setInterval, store.cdnRoot);
      var updateTime = 0;

      if (option && _typeof(option) === 'object') {
        var startTime = +new Date();
        chartInstance.setOption(option, true);
        var endTime = +new Date();
        updateTime = endTime - startTime;
      }

      if (gui) {
        $(gui.domElement).remove();
        gui.destroy();
        gui = null;
      }

      if (appEnv.config) {
        gui = new dat.GUI({
          autoPlace: false
        });
        $(gui.domElement).css({
          position: 'absolute',
          right: 5,
          top: 0,
          zIndex: 1000
        });
        $('.right-container').append(gui.domElement);
        var configParameters = appEnv.configParameters || {};

        for (var name in appEnv.config) {
          var value = appEnv.config[name];

          if (name !== 'onChange' && name !== 'onFinishChange') {
            var isColor = false; // var value = obj;

            var controller = null;

            if (configParameters[name]) {
              if (configParameters[name].options) {
                controller = gui.add(appEnv.config, name, configParameters[name].options);
              } else if (configParameters[name].min != null) {
                controller = gui.add(appEnv.config, name, configParameters[name].min, configParameters[name].max);
              }
            }

            if (typeof obj === 'string') {
              try {
                var colorArr = echarts.color.parse(value);
                isColor = !!colorArr;

                if (isColor) {
                  value = echarts.color.stringify(colorArr, 'rgba');
                }
              } catch (e) {}
            }

            if (!controller) {
              controller = gui[isColor ? 'addColor' : 'add'](appEnv.config, name);
            }

            appEnv.config.onChange && controller.onChange(appEnv.config.onChange);
            appEnv.config.onFinishChange && controller.onFinishChange(appEnv.config.onFinishChange);
          }
        }
      }

      return updateTime;
    }
  };
}
;

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "init": () => /* binding */ init
/* harmony export */ });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "vue");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue_i18n__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vue-i18n */ "./node_modules/vue-i18n/dist/vue-i18n.esm.js");
/* harmony import */ var _common_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/i18n */ "./src/common/i18n.js");
/* harmony import */ var _editor_Editor_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./editor/Editor.vue */ "./src/editor/Editor.vue");
/* harmony import */ var _explore_Explore_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./explore/Explore.vue */ "./src/explore/Explore.vue");
/* harmony import */ var _editor_View_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor/View.vue */ "./src/editor/View.vue");
/* harmony import */ var _common_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/store */ "./src/common/store.js");
/* harmony import */ var vue_scrollactive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vue-scrollactive */ "./node_modules/vue-scrollactive/dist/vue-scrollactive.min.js");
/* harmony import */ var vue_scrollactive__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(vue_scrollactive__WEBPACK_IMPORTED_MODULE_6__);








vue__WEBPACK_IMPORTED_MODULE_0___default().use((vue_scrollactive__WEBPACK_IMPORTED_MODULE_6___default()));
/**
 *
 * @param {*} el
 * @param {Object} option
 * @param {string} [option.cdnRoot]
 * @param {string} [option.page] editor | explore
 * @param {string} [option.locale] zh | en
 * @param {string} [option.version]
 */

function init(el, option) {
  var i18n = new vue_i18n__WEBPACK_IMPORTED_MODULE_7__.default({
    locale: option.locale,
    fallbackLocale: 'en',
    messages: _common_i18n__WEBPACK_IMPORTED_MODULE_1__.default
  });
  _common_store__WEBPACK_IMPORTED_MODULE_5__.store.cdnRoot = option.cdnRoot;
  _common_store__WEBPACK_IMPORTED_MODULE_5__.store.version = option.version;
  _common_store__WEBPACK_IMPORTED_MODULE_5__.store.locale = option.locale || 'en';

  if (typeof el === 'string') {
    el = document.querySelector(el);
  }

  if (!el) {
    throw new Error('Can\'t find el.');
  }

  var container = document.createElement('div');
  el.appendChild(container);
  new (vue__WEBPACK_IMPORTED_MODULE_0___default())({
    i18n: i18n,
    el: container,
    render: function render(h) {
      return h({
        editor: _editor_Editor_vue__WEBPACK_IMPORTED_MODULE_2__.default,
        explore: _explore_Explore_vue__WEBPACK_IMPORTED_MODULE_3__.default,
        view: _editor_View_vue__WEBPACK_IMPORTED_MODULE_4__.default
      }[option.page] || _explore_Explore_vue__WEBPACK_IMPORTED_MODULE_3__.default);
    }
  });
}

/***/ }),

/***/ "./src/asset/placeholder.jpg":
/*!***********************************!*\
  !*** ./src/asset/placeholder.jpg ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "../asset/placeholder.jpg";

/***/ }),

/***/ "./src/asset/icon/bar.svg":
/*!********************************!*\
  !*** ./src/asset/icon/bar.svg ***!
  \********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"138px\" viewBox=\"0 0 175 138\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>bar</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"bar\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M121.488231,0 L102.050114,0 C99.36627,-1.1969592e-16 97.1905846,2.17568537 97.1905846,4.85952929 L97.1905846,133.140471 C97.1905846,135.824315 99.36627,138 102.050114,138 L121.488231,138 C124.172075,138 126.34776,135.824315 126.34776,133.140471 L126.34776,4.85952929 C126.34776,2.17568537 124.172075,1.1969592e-16 121.488231,0 Z M170.083523,30.1571753 L150.645406,30.1571753 C147.961562,30.1571753 145.785877,32.3328607 145.785877,35.0167046 L145.785877,132.207289 C145.785877,134.891133 147.961562,137.066819 150.645406,137.066819 L170.083523,137.066819 C172.767367,137.066819 174.943052,134.891133 174.943052,132.207289 L174.943052,35.0167046 C174.943052,32.3328607 172.767367,30.1571753 170.083523,30.1571753 Z M53.4548215,39.8762339 C50.7709777,39.876234 48.5952924,42.0519193 48.5952924,44.7357631 L48.5952924,132.207289 C48.5952924,134.891133 50.7709777,137.066818 53.4548215,137.066819 L72.8929386,137.066819 C75.5767824,137.066818 77.7524677,134.891133 77.7524677,132.207289 L77.7524677,44.7357631 C77.7524676,42.0519193 75.5767824,39.876234 72.8929386,39.8762339 L53.4548215,39.8762339 Z M29.1571753,67.17388 L29.1571753,132.207289 C29.1571753,134.891133 26.9814901,137.066818 24.2976462,137.066819 L4.85952929,137.066819 C2.17568537,137.066819 3.28676086e-16,134.891133 0,132.207289 L0,67.17388 C7.33863613e-08,64.4900361 2.17568542,62.3143508 4.85952929,62.3143508 L24.2976462,62.3143508 C26.98149,62.3143509 29.1571753,64.4900362 29.1571753,67.17388 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/boxplot.svg":
/*!************************************!*\
  !*** ./src/asset/icon/boxplot.svg ***!
  \************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"98px\" viewBox=\"0 0 175 98\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>boxplot</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"boxplot\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M165.206074,4.85900217 L165.206074,43.7310195 L145.770065,43.7310195 L145.770065,14.5770065 C145.770065,11.8934537 143.594616,9.71800434 140.911063,9.71800434 L72.8850325,9.71800434 C70.2014797,9.71800434 68.0260304,11.8934537 68.0260304,14.5770065 L68.0260304,82.6030369 C68.0260304,85.2865897 70.2014797,87.462039 72.8850325,87.462039 L140.911063,87.462039 C143.594616,87.462039 145.770065,85.2865897 145.770065,82.6030369 L145.770065,53.4490239 L165.206074,53.4490239 L165.206074,92.3210412 C165.206074,95.004594 167.381523,97.1800434 170.065076,97.1800434 C172.748629,97.1800434 174.924078,95.004594 174.924078,92.3210412 L174.924078,4.85900217 C174.924078,2.17544937 172.748629,1.43751749e-14 170.065076,1.42108547e-14 C167.381523,-1.05827854e-15 165.206074,2.17544937 165.206074,4.85900217 Z M58.308026,14.5770065 L58.308026,82.6030369 C58.308026,83.8917244 57.7960969,85.1276306 56.8848572,86.0388703 C55.9736176,86.9501099 54.7377114,87.462039 53.4490239,87.462039 L34.0130152,87.462039 C31.3294624,87.462039 29.154013,85.2865897 29.154013,82.6030369 L29.154013,53.4490239 L9.71800434,53.4490239 L9.71800434,92.3210412 C9.71800434,95.004594 7.54255497,97.1800434 4.85900217,97.1800434 C2.17544937,97.1800434 3.28640434e-16,95.004594 0,92.3210412 L0,4.85900217 C-3.28640434e-16,2.17544937 2.17544937,4.31255248e-14 4.85900217,4.26325641e-14 C7.54255497,4.21396035e-14 9.71800434,2.17544937 9.71800434,4.85900217 L9.71800434,43.7310195 L29.154013,43.7310195 L29.154013,14.5770065 C29.154013,11.8934537 31.3294624,9.71800434 34.0130152,9.71800434 L53.4490239,9.71800434 C56.1325767,9.71800434 58.308026,11.8934537 58.308026,14.5770065 L58.308026,14.5770065 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/calendar.svg":
/*!*************************************!*\
  !*** ./src/asset/icon/calendar.svg ***!
  \*************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"164px\" height=\"138px\" viewBox=\"0 0 164 138\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>calendar </title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"calendar-\" transform=\"translate(-0.500000, -0.315789)\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M147.236842,56.3782895 C147.236842,53.9965615 145.304597,52.0657895 142.921053,52.0657895 L125.657895,52.0657895 C123.27435,52.0657895 121.342105,53.9965615 121.342105,56.3782895 L121.342105,65.0032895 C121.342105,67.3850175 123.27435,69.3157895 125.657895,69.3157895 L142.921053,69.3157895 C145.304597,69.3157895 147.236842,67.3850175 147.236842,65.0032895 L147.236842,56.3782895 Z M147.236842,82.2532895 C147.236842,79.8715615 145.304597,77.9407895 142.921053,77.9407895 L125.657895,77.9407895 C123.27435,77.9407895 121.342105,79.8715615 121.342105,82.2532895 L121.342105,90.8782895 C121.342105,93.2600175 123.27435,95.1907895 125.657895,95.1907895 L142.921053,95.1907895 C145.304597,95.1907895 147.236842,93.2600175 147.236842,90.8782895 L147.236842,82.2532895 Z M112.710526,56.3782895 C112.710526,53.9965615 110.778282,52.0657895 108.394737,52.0657895 L91.1315789,52.0657895 C88.7480342,52.0657895 86.8157895,53.9965615 86.8157895,56.3782895 L86.8157895,65.0032895 C86.8157895,67.3850175 88.7480342,69.3157895 91.1315789,69.3157895 L108.394737,69.3157895 C110.778282,69.3157895 112.710526,67.3850175 112.710526,65.0032895 L112.710526,56.3782895 Z M112.710526,82.2532895 C112.710526,79.8715615 110.778282,77.9407895 108.394737,77.9407895 L91.1315789,77.9407895 C88.7480342,77.9407895 86.8157895,79.8715615 86.8157895,82.2532895 L86.8157895,90.8782895 C86.8157895,93.2600175 88.7480342,95.1907895 91.1315789,95.1907895 L108.394737,95.1907895 C110.778282,95.1907895 112.710526,93.2600175 112.710526,90.8782895 L112.710526,82.2532895 Z M112.710526,108.128289 C112.710526,105.746561 110.778282,103.815789 108.394737,103.815789 L91.1315789,103.815789 C88.7480342,103.815789 86.8157895,105.746561 86.8157895,108.128289 L86.8157895,116.753289 C86.8157895,119.135017 88.7480342,121.065789 91.1315789,121.065789 L108.394737,121.065789 C110.778282,121.065789 112.710526,119.135017 112.710526,116.753289 L112.710526,108.128289 Z M78.1842105,56.3782895 C78.1842105,53.9965615 76.2519658,52.0657895 73.8684211,52.0657895 L56.6052632,52.0657895 C54.2217184,52.0657895 52.2894737,53.9965615 52.2894737,56.3782895 L52.2894737,65.0032895 C52.2894737,67.3850175 54.2217184,69.3157895 56.6052632,69.3157895 L73.8684211,69.3157895 C76.2519658,69.3157895 78.1842105,67.3850175 78.1842105,65.0032895 L78.1842105,56.3782895 Z M78.1842105,82.2532895 C78.1842105,79.8715615 76.2519658,77.9407895 73.8684211,77.9407895 L56.6052632,77.9407895 C54.2217184,77.9407895 52.2894737,79.8715615 52.2894737,82.2532895 L52.2894737,90.8782895 C52.2894737,93.2600175 54.2217184,95.1907895 56.6052632,95.1907895 L73.8684211,95.1907895 C76.2519658,95.1907895 78.1842105,93.2600175 78.1842105,90.8782895 L78.1842105,82.2532895 Z M78.1842105,108.128289 C78.1842105,105.746561 76.2519658,103.815789 73.8684211,103.815789 L56.6052632,103.815789 C54.2217184,103.815789 52.2894737,105.746561 52.2894737,108.128289 L52.2894737,116.753289 C52.2894737,119.135017 54.2217184,121.065789 56.6052632,121.065789 L73.8684211,121.065789 C76.2519658,121.065789 78.1842105,119.135017 78.1842105,116.753289 L78.1842105,108.128289 Z M43.6578947,82.2532895 C43.6578947,79.8715615 41.72565,77.9407895 39.3421053,77.9407895 L22.0789474,77.9407895 C19.6954027,77.9407895 17.7631579,79.8715615 17.7631579,82.2532895 L17.7631579,90.8782895 C17.7631579,93.2600175 19.6954027,95.1907895 22.0789474,95.1907895 L39.3421053,95.1907895 C41.72565,95.1907895 43.6578947,93.2600175 43.6578947,90.8782895 L43.6578947,82.2532895 Z M43.6578947,108.128289 C43.6578947,105.746561 41.72565,103.815789 39.3421053,103.815789 L22.0789474,103.815789 C19.6954027,103.815789 17.7631579,105.746561 17.7631579,108.128289 L17.7631579,116.753289 C17.7631579,119.135017 19.6954027,121.065789 22.0789474,121.065789 L39.3421053,121.065789 C41.72565,121.065789 43.6578947,119.135017 43.6578947,116.753289 L43.6578947,108.128289 Z M164.5,39.1282895 L164.5,134.003289 C164.5,136.385017 162.567755,138.315789 160.184211,138.315789 L4.81578947,138.315789 C2.43224476,138.315789 0.5,136.385017 0.5,134.003289 L0.5,39.1282895 C0.5,36.7465615 2.43224476,34.8157895 4.81578947,34.8157895 L160.184211,34.8157895 C162.567755,34.8157895 164.5,36.7465615 164.5,39.1282895 Z M164.5,4.62828947 L164.5,21.8782895 C164.5,24.2600175 162.567755,26.1907895 160.184211,26.1907895 L4.81578947,26.1907895 C2.43224476,26.1907895 0.5,24.2600175 0.5,21.8782895 L0.5,4.62828947 C0.5,2.24656149 2.43224476,0.315789474 4.81578947,0.315789474 L160.184211,0.315789474 C162.567755,0.315789474 164.5,2.24656149 164.5,4.62828947 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/candlestick.svg":
/*!****************************************!*\
  !*** ./src/asset/icon/candlestick.svg ***!
  \****************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"138px\" viewBox=\"0 0 175 138\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>Candlestick (1)</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"Candlestick-(1)\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M121.508001,34.0222403 L116.647681,33.0222403 L116.647681,4.86032 C116.647681,2.17603934 114.471642,-7.11961547e-08 111.787361,-7.11961549e-08 C109.10308,-7.1196155e-08 106.927041,2.17603934 106.927041,4.86032 L106.927041,33.0222403 L102.066721,33.0222403 C100.777684,33.0222403 99.5414424,33.5343082 98.6299556,34.4457951 C97.7184688,35.3572819 97.2064009,36.5935234 97.2064009,37.8825604 L97.2064009,105.927041 C97.2064009,107.216078 97.7184688,108.452319 98.6299556,109.363806 C99.5414424,110.275293 100.777684,110.787361 102.066721,110.787361 L106.927041,110.787361 L106.927041,125.572455 C106.927041,128.256735 109.10308,130.432775 111.787361,130.432775 C114.471642,130.432775 116.647681,128.256735 116.647681,125.572455 L116.647681,110.787361 L121.508001,110.787361 C122.797038,110.787361 124.03328,110.275293 124.944766,109.363806 C125.856253,108.452319 126.368321,107.216078 126.368321,105.927041 L126.368321,37.8825604 C126.368321,36.5935233 125.856253,35.3572819 124.944766,34.445795 C124.03328,33.5343082 122.797038,33.0222402 121.508001,33.0222403 L121.508001,34.0222403 Z M170.111202,41.6032004 L165.250881,41.6032004 L165.250881,27.0222403 C165.250881,24.3379598 163.074842,22.1619207 160.390561,22.1619207 C157.706281,22.1619207 155.530242,24.3379598 155.530241,27.0222403 L155.530241,41.6032004 L150.669921,41.6032004 C149.380884,41.6032004 148.144643,42.1152684 147.233156,43.0267552 C146.321669,43.938242 145.809601,45.1744835 145.809601,46.4635205 L145.809601,75.6254408 C145.809601,78.3097214 147.985641,80.4857608 150.669921,80.4857608 L155.530241,80.4857608 L155.530241,104.729037 C155.530241,107.413318 157.706281,109.589357 160.390561,109.589357 C163.074842,109.589357 165.250881,107.413318 165.250881,104.729037 L165.250881,80.4857608 L170.111202,80.4857608 C172.795482,80.4857608 174.971522,78.3097214 174.971522,75.6254408 L174.971522,46.4635205 C174.971522,45.1744835 174.459454,43.938242 173.547967,43.0267552 C172.63648,42.1152684 171.400239,41.6032004 170.111202,41.6032004 L170.111202,41.6032004 Z M72.9048007,84.3460808 L68.0444807,84.3460808 L68.0444807,55.1841605 C68.0444805,52.4998799 65.8684412,50.3238407 63.1841606,50.3238407 C60.49988,50.3238407 58.3238406,52.4998799 58.3238405,55.1841605 L58.3238405,84.3460808 L53.4635205,84.3460808 C52.1744835,84.3460807 50.938242,84.8581487 50.0267552,85.7696355 C49.1152683,86.6811224 48.6032003,87.9173639 48.6032004,89.2064009 L48.6032004,118.368321 C48.6032004,119.657358 49.1152684,120.8936 50.0267552,121.805086 C50.938242,122.716573 52.1744835,123.228641 53.4635205,123.228641 L58.3238405,123.228641 L58.3238405,132.949281 C58.3238406,135.633562 60.49988,137.809601 63.1841606,137.809601 C65.8684412,137.809601 68.0444805,135.633562 68.0444807,132.949281 L68.0444807,123.228641 L72.9048007,123.228641 C75.5890813,123.228641 77.7651206,121.052602 77.7651206,118.368321 L77.7651206,89.2064009 C77.7651207,87.9173639 77.2530527,86.6811224 76.3415659,85.7696356 C75.4300791,84.8581488 74.1938377,84.3460808 72.9048007,84.3460808 Z M29.1619203,41.6032004 L29.1619203,90.2064009 C29.1619203,92.8906815 26.9858809,95.0667209 24.3016003,95.0667209 L19.4412801,95.0667209 L19.4412801,119.572455 C19.4412801,122.256735 17.2652407,124.432775 14.5809601,124.432775 C11.8966795,124.432775 9.72064013,122.256735 9.72064013,119.572455 L9.72064013,95.0667209 L4.86032,95.0667209 C2.17603938,95.0667209 3.28729566e-16,92.8906815 0,90.2064009 L0,41.6032004 C-3.28729566e-16,38.9189198 2.17603938,36.7428804 4.86032,36.7428804 L9.72064013,36.7428804 L9.72064013,12.4412801 C9.72064013,9.75699951 11.8966795,7.58096013 14.5809601,7.58096013 C17.2652407,7.58096013 19.4412801,9.75699951 19.4412801,12.4412801 L19.4412801,36.7428804 L24.3016003,36.7428804 C26.9858809,36.7428804 29.1619203,38.9189198 29.1619203,41.6032004 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/custom.svg":
/*!***********************************!*\
  !*** ./src/asset/icon/custom.svg ***!
  \***********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"159px\" height=\"142px\" viewBox=\"0 0 159 142\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>custom</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"custom\" transform=\"translate(0.000000, -0.825151)\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M74.8235294,81.2918174 L74.8235294,138.091817 C74.8235294,140.705965 72.7298022,142.825151 70.1470588,142.825151 L4.67647054,142.825151 C2.09372718,142.825151 3.16294839e-16,140.705965 0,138.091817 L0,81.2918174 C-3.63362476e-08,80.0364594 0.492698108,78.8325175 1.36970646,77.9448453 C2.24671482,77.0571731 3.43619342,76.558484 4.67647054,76.558484 L70.1470588,76.558484 C71.387336,76.558484 72.5768146,77.0571731 73.4538229,77.9448453 C74.3308313,78.8325175 74.8235294,80.0364594 74.8235294,81.2918174 Z M74.8235294,5.55848402 L74.8235294,62.358484 C74.8235294,63.6138421 74.3308313,64.817784 73.4538229,65.7054562 C72.5768146,66.5931284 71.387336,67.0918174 70.1470588,67.0918174 L4.67647054,67.0918174 C3.43619342,67.0918174 2.24671482,66.5931284 1.36970646,65.7054562 C0.492698108,64.817784 -3.63362423e-08,63.6138421 0,62.358484 L0,5.55848402 C-2.35506485e-15,4.30312598 0.492698161,3.09918414 1.36970651,2.21151195 C2.24671486,1.32383977 3.43619344,0.825150732 4.67647054,0.825150732 L70.1470588,0.825150732 C72.7298022,0.825150732 74.8235294,2.94433623 74.8235294,5.55848402 Z M159,10.2918174 L159,57.6251507 C159,62.8534463 154.812546,67.0918174 149.647059,67.0918174 L93.5294118,67.0918174 C88.363925,67.0918174 84.1764706,62.8534464 84.1764706,57.6251507 L84.1764706,10.2918174 C84.1764706,5.06352179 88.363925,0.825150732 93.5294118,0.825150732 L149.647059,0.825150732 C154.812546,0.825150809 159,5.06352184 159,10.2918174 Z M154.323529,76.558484 C155.563807,76.558484 156.753285,77.0571731 157.630294,77.9448453 C158.507302,78.8325175 159,80.0364594 159,81.2918174 L159,138.091817 C159,140.705965 156.906273,142.825151 154.323529,142.825151 L88.8529412,142.825151 C86.2701978,142.825151 84.1764706,140.705965 84.1764706,138.091817 L84.1764706,81.2918174 C84.1764706,80.0364594 84.6691687,78.8325175 85.5461771,77.9448453 C86.4231854,77.0571731 87.612664,76.558484 88.8529412,76.558484 L154.323529,76.558484 L154.323529,76.558484 Z M93.5294118,133.358484 L149.647059,133.358484 L149.647059,86.0251507 L93.5294118,86.0251507 L93.5294118,133.358484 L93.5294118,133.358484 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/dataZoom.svg":
/*!*************************************!*\
  !*** ./src/asset/icon/dataZoom.svg ***!
  \*************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"83px\" viewBox=\"0 0 175 83\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>dataZoom</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"dataZoom\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M9.20037003,18.4191593 L9.20957963,13.8143694 L9.20957963,18.4191593 L41.4431082,18.4191593 L41.4431082,64.4670572 L9.20957963,64.4670572 L9.20957963,18.4191593 L9.20037003,18.4191593 Z M133.538904,64.4670572 L133.538904,18.4191593 L165.772433,18.4191593 L165.772433,64.4670572 L133.538904,64.4670572 L133.538904,64.4670572 Z M165.772433,9.20957963 L133.538904,9.20957963 L133.538904,4.60478981 C133.538904,2.06163473 131.47727,2.74466854e-07 128.934115,2.74466854e-07 C126.390959,2.74466855e-07 124.329325,2.06163473 124.329325,4.60478981 L124.329325,9.20957963 L50.6526879,9.20957963 L50.6526879,4.60478981 C50.6526879,2.06163462 48.5910532,-6.1602121e-15 46.047898,-6.31593544e-15 C43.5047429,-6.47165878e-15 41.4431082,2.06163462 41.4431082,4.60478981 L41.4431082,9.20957963 L9.20957963,9.20957963 C4.13510123,9.20957963 0,13.3446809 0,18.4191593 L0,64.4670572 C0,69.5507451 4.13510123,73.6766368 9.20957963,73.6766368 L41.4431082,73.6766368 L41.4431082,78.2814267 C41.4431082,80.8245818 43.5047429,82.8862165 46.047898,82.8862165 C48.5910532,82.8862165 50.6526879,80.8245818 50.6526879,78.2814267 L50.6526879,73.6766368 L124.329325,73.6766368 L124.329325,78.2814267 C124.329325,80.8245818 126.390959,82.8862165 128.934115,82.8862165 C131.47727,82.8862165 133.538904,80.8245818 133.538904,78.2814267 L133.538904,73.6766368 L165.772433,73.6766368 C170.858743,73.6766368 174.982013,69.5533676 174.982013,64.4670572 L174.982013,18.4191593 C174.982013,13.3446809 170.856121,9.20957963 165.772433,9.20957963 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/dataset.svg":
/*!************************************!*\
  !*** ./src/asset/icon/dataset.svg ***!
  \************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"145px\" height=\"157px\" viewBox=\"0 0 145 157\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>dataset</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"dataset\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M77,133.051622 C77,135.720999 74.7614237,137.884956 72,137.884956 C69.2385763,137.884956 67,135.720999 67,133.051622 L67,92.7182891 C67,90.0489128 69.2385763,87.8849558 72,87.8849558 C74.7614237,87.8849558 77,90.0489128 77,92.7182891 L77,133.051622 Z M87,92.7182888 C87.0000002,90.0489126 89.2385764,87.8849558 92,87.8849558 C94.7614236,87.8849558 96.9999998,90.0489126 97,92.7182888 L97,133.051623 C96.9999998,135.720999 94.7614236,137.884956 92,137.884956 C89.2385764,137.884956 87.0000002,135.720999 87,133.051623 L87,92.7182888 Z M58,133.072456 C58,135.730326 55.7614237,137.884956 53,137.884956 C50.2385763,137.884956 48,135.730326 48,133.072456 L48,73.6974557 C48,71.0395854 50.2385763,68.8849558 53,68.8849558 C55.7614237,68.8849558 58,71.0395854 58,73.6974557 L58,133.072456 Z M39,133.066774 C38.9999999,135.727782 36.7614237,137.884956 34,137.884956 C31.2385763,137.884956 29.0000001,135.727782 29,133.066774 L29,44.7031376 C29,42.0421293 31.2385763,39.8849558 34,39.8849558 C36.7614237,39.8849558 39,42.0421293 39,44.7031376 L39,133.066774 Z M126.3,132.884956 L126.3,63.9913737 C126.403893,62.6917747 125.897136,61.4145164 124.9129,60.4952543 L83.0962,21.7192841 C82.9895,21.6282393 82.8537001,21.5918214 82.7469999,21.5098811 C81.8447692,20.5509026 80.5501183,19.997952 79.1870999,19.9894333 L39,19.9894333 L39,10.8849558 L135.9903,10.8849558 L136,132.884956 L126.3,132.884956 Z M116,146.884956 L10,146.884956 L10,28.8849558 L74.0143636,28.8849558 L74.0143636,58.8841865 C74.0143636,63.8855711 78.3314545,67.9611095 83.6507272,67.9611097 L116,67.9611097 L116,146.884956 Z M144.990333,10.0614263 C144.990333,5.00519104 140.659667,0.884955752 135.323667,0.884955752 L38.6666667,0.884955752 C33.3403334,0.884955752 29.0000001,5.00519104 28.9999999,10.0614263 L28.9999999,19.2378969 L9.66666665,19.2378969 C4.34033332,19.2378969 0,23.3581322 0,28.4143675 L0,147.708485 C0,152.773897 4.34033332,156.884956 9.66666665,156.884956 L116,156.884956 C121.338753,156.884956 125.666667,152.77651 125.666667,147.708485 L125.666667,142.202603 L135.333333,142.202603 C140.672086,142.202603 145,138.094157 145,133.026132 L144.990333,10.0614263 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/drag.svg":
/*!*********************************!*\
  !*** ./src/asset/icon/drag.svg ***!
  \*********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"159px\" viewBox=\"0 0 175 159\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>drag</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"drag\" transform=\"translate(0.000000, 0.000000)\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M174.799112,77.2243509 C175.141784,80.4933122 173.860538,83.7226514 171.369927,85.8675022 L145.821493,107.665891 C143.704571,109.29545 140.681703,108.978807 138.948417,106.945941 C137.215132,104.913075 137.380357,101.878162 139.32409,100.045479 L158.345038,83.8019696 L92.4385031,83.8019696 L92.4385031,144.173679 L109.273597,130.085944 C111.397298,128.30558 114.562167,128.583909 116.342532,130.70761 C118.122896,132.83131 117.844567,135.99618 115.720867,137.776544 L93.3308935,156.516741 C89.5429956,159.697467 83.9995074,159.633553 80.2859517,156.366338 L59.0490671,137.706356 C57.140269,135.840194 57.0244102,132.80703 58.7852891,130.800695 C60.546168,128.79436 63.5687212,128.515654 65.6667932,130.166159 L82.4116455,144.885586 L82.4116455,83.8019696 L16.5051101,83.8019696 L35.5360859,100.045479 C36.9700273,101.186546 37.6671397,103.019075 37.3541473,104.824694 C37.041155,106.630312 35.7679333,108.121296 34.0335988,108.713163 C32.2992644,109.305031 30.380183,108.903467 29.0286553,107.665891 L3.52032945,85.8975828 C1.25557692,83.9644222 -0.0328273042,81.1246883 0.00397844461,78.147297 C0.0407841935,75.1699056 1.39899211,72.3628885 3.71083975,70.4863026 L29.118897,49.820949 C31.2816477,48.328475 34.2285594,48.7508003 35.8850928,50.7906204 C37.5416262,52.8304405 37.3503183,55.8013071 35.4458442,57.6118174 L15.5625855,73.7751119 L82.4116455,73.7751119 L82.4116455,14.1153089 L65.6667932,28.8347359 C64.3276607,30.0598688 62.43094,30.4655542 60.7078175,29.8954003 C58.9846951,29.3252464 57.7042897,27.8683002 57.360198,26.0862151 C57.0161064,24.30413 57.662069,22.4752334 59.0490671,21.3045658 L80.2759248,2.65461056 C83.9853287,-0.629787191 89.5418994,-0.698070701 93.3308935,2.49418084 L115.720867,21.2243509 C117.320514,22.5881211 117.904229,24.8023516 117.184781,26.777481 C116.465334,28.7526104 114.594242,30.0726692 112.492218,30.0880931 C111.314421,30.0896881 110.174126,29.6740664 109.273597,28.9149508 L92.4385031,14.8272158 L92.4385031,73.7751119 L159.29759,73.7751119 L139.414331,57.6118174 C138.022627,56.4816171 137.339593,54.6948034 137.622523,52.9244518 C137.905453,51.1541001 139.111362,49.669169 140.785997,49.0290176 C142.460631,48.3888662 144.349574,48.6907487 145.741278,49.820949 L171.149336,70.4863026 C173.218763,72.1532673 174.533435,74.5803549 174.799112,77.2243509\" id=\"Path\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/funnel.svg":
/*!***********************************!*\
  !*** ./src/asset/icon/funnel.svg ***!
  \***********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"137px\" viewBox=\"0 0 175 137\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>funnel </title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"funnel-\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M116.331467,108.325366 L60.5285591,108.325366 C58.9291301,108.325102 57.4459378,109.160985 56.6178211,110.52934 C55.7897045,111.897695 55.7371711,113.5994 56.4793063,115.016231 L66.3876358,133.863994 C67.1750739,135.367321 68.7306799,136.310539 70.4277481,136.313655 L106.432278,136.313655 C108.129346,136.310539 109.684952,135.367321 110.47239,133.863994 L120.380719,115.016231 C121.122854,113.5994 121.070321,111.897695 120.242204,110.52934 C119.414088,109.160985 117.930896,108.325102 116.331467,108.325366 L116.331467,108.325366 Z M134.968998,71.0137414 L41.9001683,71.0137414 C40.2925309,71.0025161 38.7981975,71.8401445 37.9688482,73.2173896 C37.139499,74.5946346 37.098146,76.3072185 37.8600561,77.722887 L47.8415098,96.5706503 C48.6348072,98.0648166 50.1899261,98.9971843 51.881622,98.9928896 L125.024106,98.9928896 C126.716211,98.9981743 128.270437,98.0607046 129.055078,96.5615098 L139.00911,77.7137465 C139.754942,76.2976526 139.705659,74.5945859 138.879188,73.2239903 C138.052717,71.8533948 136.569493,71.014997 134.968998,71.0137414 L134.968998,71.0137414 Z M153.63395,35.5759245 L23.2352156,35.5759245 C21.6347203,35.5771801 20.151496,36.4155778 19.325025,37.7861734 C18.498554,39.156769 18.4492717,40.8598357 19.1951033,42.2759296 L29.1491354,61.1145524 C29.9359394,62.6172637 31.4930184,63.5578521 33.1892477,63.5550727 L143.70734,63.5550727 C145.402425,63.5537423 146.957543,62.6143387 147.747452,61.1145524 L157.674063,42.266789 C158.415446,40.8514003 158.363824,39.1515952 157.537917,37.7838041 C156.712011,36.4160129 155.231751,35.5788553 153.63395,35.5759245 L153.63395,35.5759245 Z M174.995358,4.69922974 C174.994253,5.44166711 174.81229,6.17265769 174.465208,6.82897225 L164.538597,25.6767355 C163.746223,27.1729824 162.191592,28.108575 160.498485,28.1081153 L14.4968732,28.1081153 C12.8031994,28.1106197 11.2475937,27.1744407 10.4567611,25.6767355 L0.530150516,6.82897225 C-0.215681017,5.41287837 -0.166398756,3.70981169 0.660072225,2.33921611 C1.48654321,0.96862053 2.96976742,0.130222778 4.57026264,0.1289671 L170.425096,0.1289671 C172.949182,0.1289671 174.995358,2.17514338 174.995358,4.69922974 L174.995358,4.69922974 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/gauge.svg":
/*!**********************************!*\
  !*** ./src/asset/icon/gauge.svg ***!
  \**********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"100px\" viewBox=\"0 0 175 100\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>gange</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"gange\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M143.698895,82.9089367 C142.437361,67.6655629 135.026556,53.5920156 123.171797,43.9267897 L135.7146,25.9137777 C153.409366,39.7333892 164.305583,60.4959162 165.625777,82.9089367 L143.698895,82.9089367 L143.698895,82.9089367 Z M115.601912,38.6960173 C112.342946,36.8541942 108.909619,35.339582 105.352176,34.174346 L107.654453,22.8655635 C107.981818,21.2534161 107.424245,19.5890834 106.191766,18.4995036 C104.959288,17.4099237 103.239147,17.0606298 101.679304,17.5831975 C100.119461,18.1057651 98.9568933,19.4208039 98.6295287,21.0329513 L96.4193432,31.8996968 C93.4676767,31.3974455 90.4804994,31.132603 87.4865101,31.1077136 C77.1817177,31.1042083 67.0761605,33.9468942 58.284434,39.3222365 L45.5021944,21.4934066 C70.6181595,5.43266895 102.701308,5.12868193 128.117087,20.7106326 L115.601912,38.6960173 L115.601912,38.6960173 Z M31.2649159,82.9089367 L9.34724295,82.9089367 C10.6455448,61.0475255 21.0636813,40.7358347 38.0612364,26.9267794 L50.843476,44.7464001 C39.5322634,54.3814577 32.493597,68.101229 31.2649159,82.9089367 L31.2649159,82.9089367 Z M87.4865101,0.0269797767 C39.2492112,0.0269797767 0,39.276191 0,87.5134899 C5.46353103e-08,90.0565144 2.06152873,92.118043 4.60455321,92.118043 L35.685287,92.118043 C38.2283115,92.118043 40.2898401,90.0565144 40.2898401,87.5134899 C40.315223,61.4580101 61.4310302,40.3422029 87.4865101,40.31682 C89.908505,40.31682 92.2384089,40.6759751 94.5683128,41.0351302 L86.9247546,78.6451205 C82.0531374,79.4923583 78.2774037,83.5443651 78.2774037,88.6646282 C78.2774037,94.3864333 82.9158433,99.0248728 88.6376484,99.0248728 C94.3594535,99.0248728 98.997893,94.3864333 98.997893,88.6646282 C98.997893,85.7361324 97.7546637,83.102328 95.793124,81.2236703 L103.501146,43.3005704 C121.633876,49.8942906 134.68318,67.1337376 134.68318,87.5134899 C134.68318,90.0565144 136.744709,92.118043 139.287733,92.118043 L170.368467,92.118043 C172.911491,92.118043 174.97302,90.0565144 174.97302,87.5134899 C174.97302,39.276191 135.723809,0.0269798756 87.4865101,0.0269797767 L87.4865101,0.0269797767 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/geo.svg":
/*!********************************!*\
  !*** ./src/asset/icon/geo.svg ***!
  \********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"142px\" viewBox=\"0 0 175 142\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>geo</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"geo\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M9.20332621,34.019885 L55.2181167,56.861627 L55.2181167,128.571076 L9.20332621,103.207724 L9.20332621,34.019885 Z M171.819596,50.2815119 L151.996424,43.1124076 C149.63126,42.3318353 147.074346,43.5747977 146.227189,45.9169373 C145.380032,48.2590769 146.550177,50.8501245 148.867418,51.7631882 L165.653614,57.8371405 L165.653614,131.138702 L119.638823,119.625801 L119.638823,87.4706656 C119.638823,84.9293389 117.578671,82.8691865 115.037344,82.8691865 C112.496018,82.8691865 110.435865,84.9293389 110.435865,87.4706656 L110.435865,119.644207 L64.4210748,131.41479 L64.4210748,58.2236647 L81.060023,51.7263763 C83.2914479,50.7138845 84.3410975,48.1328302 83.4496557,45.8503474 C82.5582139,43.5678645 80.037126,42.3813901 77.7101463,43.1492194 L61.2460542,49.5820871 L6.64490386,22.4793755 C5.21943693,21.7614379 3.52312776,21.8367966 2.16693957,22.6783095 C0.810751382,23.5198224 -0.00997312356,25.0062796 0.000368118324,26.6023007 L0.000368118324,105.913394 C0.000368118324,107.597535 0.91146097,109.134429 2.38393426,109.944289 L58.8072703,141.059491 C59.8287987,141.620871 61.0435892,141.795727 62.16635,141.49203 L115.046547,127.963681 L169.141535,141.501233 C170.516378,141.840666 171.970958,141.532118 173.089604,140.663763 C174.206625,139.788526 174.858383,138.44767 174.856572,137.028595 L174.856572,54.6069022 C174.855748,52.6695411 173.64154,50.9402146 171.819596,50.2815119 Z M115.037344,16.5986853 C121.13907,16.6012266 126.083435,21.5497125 126.080894,27.651438 C126.078353,33.7531634 121.129867,38.697529 115.028141,38.6949877 C108.926416,38.6924463 103.98205,33.7439604 103.984592,27.642235 C103.987133,21.5405096 108.935619,16.596144 115.037344,16.5986853 L115.037344,16.5986853 Z M99.5763747,54.7173377 C102.208421,58.3341002 105.00612,61.9140509 107.813022,65.199507 C108.806942,66.3866886 109.718035,67.4358258 110.491083,68.3285127 C111.04326,68.8806902 111.402176,69.2856204 111.558626,69.4512736 C112.438859,70.4713636 113.723372,71.0524431 115.07068,71.0400337 C116.417988,71.0276243 117.69158,70.4229833 118.552874,69.3868529 C118.72773,69.2211997 119.06824,68.8254725 119.555997,68.264092 C120.506081,67.2663872 121.406012,66.2220982 122.252463,65.1350863 C125.059366,61.8496302 127.866268,58.2788825 130.498314,54.6437141 C133.121157,51.0177486 135.412694,47.4470008 137.262488,44.0879211 C140.741206,37.8851274 142.646219,32.5382087 142.646219,28.1207888 C142.701436,12.5861956 130.314255,0.0425636812 115.028141,0.0425636812 C99.7604339,0.0425636812 87.42847,12.5861956 87.42847,28.1207888 C87.42847,32.5382087 89.3334823,37.9403451 92.8029975,44.1523418 C94.7172128,47.5114215 97.0087494,51.0729663 99.5763747,54.7173377 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/gl.svg":
/*!*******************************!*\
  !*** ./src/asset/icon/gl.svg ***!
  \*******************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"120px\" viewBox=\"0 0 175 120\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>gl</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"gl\" fill=\"#5067A2\"> <path d=\"M170.394737,101.315789 L119.736842,101.315789 L119.736842,4.60526316 C119.736842,2.06315789 117.673684,0 115.131579,0 L105.921053,0 C103.378947,0 101.315789,2.06315789 101.315789,4.60526316 L101.315789,115.131579 C101.315789,117.673684 103.378947,119.736842 105.921053,119.736842 L170.394737,119.736842 C172.936842,119.736842 175,117.673684 175,115.131579 L175,105.921053 C175,103.378947 172.936842,101.315789 170.394737,101.315789\" id=\"Fill-1\"></path> <path d=\"M78.2894737,0 L4.60526316,0 C2.06315789,0 0,2.06315789 0,4.60526316 L0,115.131579 C0,117.673684 2.06315789,119.736842 4.60526316,119.736842 L78.2894737,119.736842 C80.8315789,119.736842 82.8947368,117.673684 82.8947368,115.131579 L82.8947368,59.8684211 C82.8947368,57.3263158 80.8315789,55.2631579 78.2894737,55.2631579 L41.4473684,55.2631579 C38.9052632,55.2631579 36.8421053,57.3263158 36.8421053,59.8684211 L36.8421053,69.0789474 C36.8421053,71.6210526 38.9052632,73.6842105 41.4473684,73.6842105 L64.4736842,73.6842105 L64.4736842,101.315789 L18.4210526,101.315789 L18.4210526,18.4210526 L64.4736842,18.4210526 L64.4736842,32.2368421 C64.4736842,34.7789474 66.5368421,36.8421053 69.0789474,36.8421053 L78.2894737,36.8421053 C80.8315789,36.8421053 82.8947368,34.7789474 82.8947368,32.2368421 L82.8947368,4.60526316 C82.8947368,2.06315789 80.8315789,0 78.2894737,0\" id=\"Fill-3\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/graph.svg":
/*!**********************************!*\
  !*** ./src/asset/icon/graph.svg ***!
  \**********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"171px\" height=\"146px\" viewBox=\"0 0 171 146\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>graph</title> <desc>Created with Sketch.</desc> <defs> <polygon id=\"path-1\" points=\"0.06 0 171 0 171 146 0.06 146\"></polygon> </defs> <g id=\"graph\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <mask id=\"mask-2\" fill=\"white\"> <use xlink:href=\"#path-1\"></use> </mask> <g id=\"Clip-2\"></g> <path d=\"M171,100 C171,106.075 166.075,111 160,111 C154.016,111 149.158,106.219 149.014,100.27 L114.105,83.503 C111.564,86.693 108.179,89.18 104.282,90.616 L108.698,124.651 C112.951,126.172 116,130.225 116,135 C116,141.075 111.075,146 105,146 C98.925,146 94,141.075 94,135 C94,131.233 95.896,127.912 98.781,125.93 L94.364,91.896 C82.94,90.82 74,81.206 74,69.5 C74,69.479 74.001,69.46 74.001,69.439 L53.719,64.759 C50.642,70.269 44.76,74 38,74 C36.07,74 34.215,73.689 32.472,73.127 L20.624,90.679 C21.499,92.256 22,94.068 22,96 C22,102.075 17.075,107 11,107 C4.925,107 0,102.075 0,96 C0,89.925 4.925,85 11,85 C11.452,85 11.895,85.035 12.332,85.089 L24.184,67.531 C21.574,64.407 20,60.389 20,56 C20,48.496 24.594,42.07 31.121,39.368 L29.111,21.279 C24.958,19.707 22,15.704 22,11 C22,4.925 26.925,0 33,0 C39.075,0 44,4.925 44,11 C44,14.838 42.031,18.214 39.051,20.182 L41.061,38.279 C49.223,39.681 55.49,46.564 55.95,55.011 L76.245,59.694 C79.889,52.181 87.589,47 96.5,47 C100.902,47 105.006,48.269 108.475,50.455 L131.538,27.391 C131.192,26.322 131,25.184 131,24 C131,17.925 135.925,13 142,13 C148.075,13 153,17.925 153,24 C153,30.075 148.075,35 142,35 C140.816,35 139.678,34.808 138.609,34.461 L115.546,57.525 C117.73,60.994 119,65.098 119,69.5 C119,71.216 118.802,72.884 118.438,74.49 L153.345,91.257 C155.193,89.847 157.495,89 160,89 C166.075,89 171,93.925 171,100\" id=\"Fill-1\" fill=\"#4F608A\" mask=\"url(#mask-2)\"></path> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/heatmap.svg":
/*!************************************!*\
  !*** ./src/asset/icon/heatmap.svg ***!
  \************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"165px\" height=\"137px\" viewBox=\"0 0 165 137\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>heatmap</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"heatmap\" transform=\"translate(-0.500000, -0.474277)\" fill-rule=\"nonzero\"> <path d=\"M44.5999999,89.4742765 L5.40000005,89.4742765 C2.6938048,89.4742765 0.500000074,87.2916647 0.5,84.5992766 L0.5,55.3492765 C0.500000074,52.6568883 2.6938048,50.4742765 5.40000005,50.4742765 L44.5999999,50.4742765 C47.3061952,50.4742765 49.4999999,52.6568883 49.5,55.3492765 L49.5,84.5992766 C49.4999999,87.2916647 47.3061952,89.4742765 44.5999999,89.4742765\" id=\"Path\" fill=\"#687DB0\"></path> <path d=\"M102.6,89.4742765 L63.3999999,89.4742765 C60.6938047,89.4742765 58.5000001,87.2916647 58.5,84.5992766 L58.5,55.3492765 C58.5000001,52.6568884 60.6938047,50.4742766 63.3999999,50.4742765 L102.6,50.4742765 C105.306195,50.4742765 107.5,52.6568883 107.5,55.3492765 L107.5,84.5992766 C107.5,87.2916647 105.306195,89.4742765 102.6,89.4742765\" id=\"Path\" fill=\"#8497C0\"></path> <path d=\"M160.6,89.4742765 L121.4,89.4742765 C118.693805,89.4742765 116.5,87.2916647 116.5,84.5992766 L116.5,55.3492765 C116.5,52.6568884 118.693805,50.4742766 121.4,50.4742765 L160.6,50.4742765 C163.306195,50.4742766 165.5,52.6568884 165.5,55.3492765 L165.5,84.5992766 C165.5,87.2916647 163.306195,89.4742765 160.6,89.4742765\" id=\"Path\" fill=\"#A7B4D1\"></path> <path d=\"M44.5999999,137.474277 L5.40000005,137.474277 C2.69380475,137.474277 0.5,135.291665 0.5,132.599276 L0.5,103.349277 C0.5,100.656888 2.69380475,98.4742765 5.40000005,98.4742765 L44.5999999,98.4742765 C45.8995608,98.4742765 47.1458949,98.9878911 48.0648232,99.902131 C48.9837515,100.816371 49.5,102.056346 49.5,103.349277 L49.5,132.599276 C49.5,135.291665 47.3061953,137.474277 44.5999999,137.474277\" id=\"Path\" fill=\"#8497C0\"></path> <path d=\"M102.6,137.474277 L63.3999999,137.474277 C60.6938047,137.474276 58.5,135.291665 58.5,132.599276 L58.5,103.349277 C58.5,100.656888 60.6938047,98.4742766 63.3999999,98.4742765 L102.6,98.4742765 C105.306195,98.4742765 107.5,100.656888 107.5,103.349277 L107.5,132.599276 C107.5,135.291665 105.306195,137.474277 102.6,137.474277\" id=\"Path\" fill=\"#A7B4D1\"></path> <path d=\"M160.6,137.474277 L121.4,137.474277 C118.693805,137.474276 116.5,135.291665 116.5,132.599276 L116.5,103.349277 C116.5,100.656888 118.693805,98.4742766 121.4,98.4742765 L160.6,98.4742765 C163.306195,98.4742766 165.5,100.656888 165.5,103.349277 L165.5,132.599276 C165.5,135.291665 163.306195,137.474276 160.6,137.474277\" id=\"Path\" fill=\"#CDD5E3\"></path> <path d=\"M5.40000005,0.474276527 L44.5999999,0.474276527 C47.3061953,0.474276527 49.5,2.65688839 49.5,5.34927658 L49.5,34.5992765 C49.5,37.2916647 47.3061953,39.4742765 44.5999999,39.4742765 L5.40000005,39.4742765 C2.69380475,39.4742765 0.5,37.2916647 0.5,34.5992765 L0.5,5.34927658 C0.5,2.65688839 2.69380475,0.474276527 5.40000005,0.474276527\" id=\"Path\" fill=\"#5067A2\"></path> <path d=\"M102.6,39.4742765 L63.3999999,39.4742765 C60.6938047,39.4742765 58.5,37.2916646 58.5,34.5992765 L58.5,5.34927658 C58.5,2.65688845 60.6938047,0.474276601 63.3999999,0.474276527 L102.6,0.474276527 C105.306195,0.474276527 107.5,2.65688839 107.5,5.34927658 L107.5,34.5992765 C107.5,37.2916647 105.306195,39.4742765 102.6,39.4742765\" id=\"Path\" fill=\"#687DB0\"></path> <path d=\"M160.6,39.4742765 L121.4,39.4742765 C118.693805,39.4742765 116.5,37.2916646 116.5,34.5992765 L116.5,5.34927658 C116.5,2.65688845 118.693805,0.474276601 121.4,0.474276527 L160.6,0.474276527 C163.306195,0.474276601 165.5,2.65688845 165.5,5.34927658 L165.5,34.5992765 C165.5,37.2916646 163.306195,39.4742765 160.6,39.4742765\" id=\"Path\" fill=\"#8497C0\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/line.svg":
/*!*********************************!*\
  !*** ./src/asset/icon/line.svg ***!
  \*********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"138px\" viewBox=\"0 0 175 138\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>line</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"line\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M25.2739189,111.655778 C26.7855309,111.657407 28.2007506,110.913642 29.0567232,109.667735 L69.3606163,51.4346379 L108.642876,94.5825372 C109.596174,95.6275458 110.977093,96.1760957 112.387618,96.0700817 C113.798143,95.9640677 115.081554,95.2152689 115.86794,94.0395069 L167.15209,17.582681 C168.126301,16.2187314 168.281888,14.4329668 167.558237,12.9210891 C166.834585,11.4092114 165.346152,10.4103472 163.672804,10.3136363 C161.999456,10.2169253 160.40586,11.0376639 159.512851,12.4561069 L111.496086,84.0348638 L72.2782537,40.9605957 C71.3313898,39.926718 69.968454,39.3754562 68.5690807,39.4603596 C67.1694417,39.5586882 65.8899144,40.2864616 65.0900052,41.4391988 L21.4911146,104.439918 C20.5200574,105.846972 20.4090348,107.676368 21.202809,109.190526 C21.9965833,110.704685 23.5643138,111.65402 25.2739189,111.655778\" id=\"Path\"></path> <path d=\"M170.272214,127.854648 L9.20390349,127.854648 L9.20390349,5.00465881 C9.20390349,2.46307104 7.14353951,0.402707066 4.60195174,0.402707066 C2.06036398,0.402707066 3.11254732e-16,2.46307104 0,5.00465881 L0,132.4566 C3.11254728e-16,134.998188 2.06036395,137.058552 4.60195168,137.058552 L170.272214,137.058552 C172.813801,137.058552 174.874165,134.998188 174.874165,132.4566 C174.874165,129.915012 172.813801,129.257355 170.272214,129.257355\" id=\"Path\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/lines.svg":
/*!**********************************!*\
  !*** ./src/asset/icon/lines.svg ***!
  \**********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"163px\" height=\"137px\" viewBox=\"0 0 163 137\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>lines</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"lines\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M118.024118,118.8 C120.522388,118.8 122.566427,120.8475 122.566427,123.35 C122.566427,125.8525 120.522388,127.9 118.024118,127.9 C115.517543,127.894993 113.486807,125.860819 113.481809,123.35 C113.481809,120.8475 115.525848,118.8 118.024118,118.8 Z M142.434485,46 L64.9673569,46 C62.4587091,46 60.4250482,48.0371044 60.4250482,50.55 C60.4250482,53.0628956 62.4587091,55.1 64.9673569,55.1 L142.034762,55.0909 C149.519307,56.1087027 154.7743,62.9956941 153.790257,70.4972 C152.963556,76.6852 148.066948,81.5264 142.434485,82.2544 L20.6642736,82.2726 C14.6272756,82.8301001 9.06337697,85.7822231 5.21133949,90.4717 C0.0521031846,96.7506172 -1.39663076,105.298969 1.40493936,112.931618 C4.20650947,120.564268 10.8382585,126.136619 18.8291809,127.5724 L105.232977,127.8909 C107.143393,133.33221 112.265894,136.980155 118.024118,137 C125.537097,137 131.651044,130.8757 131.651044,123.35 C131.651044,115.8243 125.537097,109.7 118.024118,109.7 C112.110032,109.7 107.113492,113.5129 105.232977,118.8 L21.8634431,118.8728 L20.4099043,118.618 C14.3307333,117.521702 9.72082575,112.509885 9.12680957,106.3512 C8.77445503,102.712306 9.88625731,99.0830035 12.2155795,96.2684 C14.5594108,93.4383 17.8571269,91.6911 21.0912506,91.3544 L142.988646,91.3271 C153.280464,90.058092 161.421536,81.9929721 162.802197,71.6984 C164.446513,59.2314 155.679857,47.729 142.434485,46 Z\" id=\"Shape\"></path> <path d=\"M31.9999101,18.2496933 C36.9704563,18.2496933 40.9998801,22.3350263 40.9998801,27.37454 C40.9998801,32.4140537 36.9704563,36.4993867 31.9999101,36.4993867 C27.0293639,36.4993867 22.9999401,32.4140537 22.9999401,27.37454 C22.9999401,22.3350263 27.0293639,18.2496933 31.9999101,18.2496933 Z M16.8799604,56.2181803 C19.4539519,59.9411177 22.1809428,63.6184309 24.9259336,66.9946242 C25.9069304,68.2173537 26.7979274,69.3032104 27.5539249,70.2156951 C28.1029231,70.7814356 28.435922,71.1920537 28.5979214,71.3654258 C30.4699152,73.555389 33.5839048,73.555389 35.4378986,71.3015518 C35.617898,71.1373046 35.932897,70.7266865 36.4188954,70.1518212 C37.2648925,69.2393365 38.1288897,68.1443549 39.0558866,66.9307503 C41.8008774,63.554557 44.5368683,59.8863687 47.1108598,56.1451815 C49.6758512,52.4131192 51.9258437,48.7449309 53.7348377,45.2957388 C57.1368264,38.917471 58.9998202,33.4243133 58.9998202,28.8710148 C59.05382,12.911658 46.9398603,0 31.9909101,0 C17.0509599,0 5,12.911658 5,28.8710148 C5,33.4243133 6.8629938,38.9722201 10.2559825,45.3596128 C12.1279763,48.8088048 14.3689688,52.4678683 16.8799604,56.2181803 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/map.svg":
/*!********************************!*\
  !*** ./src/asset/icon/map.svg ***!
  \********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"142px\" viewBox=\"0 0 175 142\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>geo</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"geo\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M9.20332621,34.019885 L55.2181167,56.861627 L55.2181167,128.571076 L9.20332621,103.207724 L9.20332621,34.019885 Z M171.819596,50.2815119 L151.996424,43.1124076 C149.63126,42.3318353 147.074346,43.5747977 146.227189,45.9169373 C145.380032,48.2590769 146.550177,50.8501245 148.867418,51.7631882 L165.653614,57.8371405 L165.653614,131.138702 L119.638823,119.625801 L119.638823,87.4706656 C119.638823,84.9293389 117.578671,82.8691865 115.037344,82.8691865 C112.496018,82.8691865 110.435865,84.9293389 110.435865,87.4706656 L110.435865,119.644207 L64.4210748,131.41479 L64.4210748,58.2236647 L81.060023,51.7263763 C83.2914479,50.7138845 84.3410975,48.1328302 83.4496557,45.8503474 C82.5582139,43.5678645 80.037126,42.3813901 77.7101463,43.1492194 L61.2460542,49.5820871 L6.64490386,22.4793755 C5.21943693,21.7614379 3.52312776,21.8367966 2.16693957,22.6783095 C0.810751382,23.5198224 -0.00997312356,25.0062796 0.000368118324,26.6023007 L0.000368118324,105.913394 C0.000368118324,107.597535 0.91146097,109.134429 2.38393426,109.944289 L58.8072703,141.059491 C59.8287987,141.620871 61.0435892,141.795727 62.16635,141.49203 L115.046547,127.963681 L169.141535,141.501233 C170.516378,141.840666 171.970958,141.532118 173.089604,140.663763 C174.206625,139.788526 174.858383,138.44767 174.856572,137.028595 L174.856572,54.6069022 C174.855748,52.6695411 173.64154,50.9402146 171.819596,50.2815119 Z M115.037344,16.5986853 C121.13907,16.6012266 126.083435,21.5497125 126.080894,27.651438 C126.078353,33.7531634 121.129867,38.697529 115.028141,38.6949877 C108.926416,38.6924463 103.98205,33.7439604 103.984592,27.642235 C103.987133,21.5405096 108.935619,16.596144 115.037344,16.5986853 L115.037344,16.5986853 Z M99.5763747,54.7173377 C102.208421,58.3341002 105.00612,61.9140509 107.813022,65.199507 C108.806942,66.3866886 109.718035,67.4358258 110.491083,68.3285127 C111.04326,68.8806902 111.402176,69.2856204 111.558626,69.4512736 C112.438859,70.4713636 113.723372,71.0524431 115.07068,71.0400337 C116.417988,71.0276243 117.69158,70.4229833 118.552874,69.3868529 C118.72773,69.2211997 119.06824,68.8254725 119.555997,68.264092 C120.506081,67.2663872 121.406012,66.2220982 122.252463,65.1350863 C125.059366,61.8496302 127.866268,58.2788825 130.498314,54.6437141 C133.121157,51.0177486 135.412694,47.4470008 137.262488,44.0879211 C140.741206,37.8851274 142.646219,32.5382087 142.646219,28.1207888 C142.701436,12.5861956 130.314255,0.0425636812 115.028141,0.0425636812 C99.7604339,0.0425636812 87.42847,12.5861956 87.42847,28.1207888 C87.42847,32.5382087 89.3334823,37.9403451 92.8029975,44.1523418 C94.7172128,47.5114215 97.0087494,51.0729663 99.5763747,54.7173377 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/parallel.svg":
/*!*************************************!*\
  !*** ./src/asset/icon/parallel.svg ***!
  \*************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"148px\" viewBox=\"0 0 175 148\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>parallel</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"parallel\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M119.966527,90.2642567 L119.966527,71.4595035 L164.953975,91.1040224 L164.953975,117.16675 L119.966527,90.2642567 Z M99.5422259,68.8202399 L109.969317,68.8202399 L109.969317,80.2370544 L99.5422259,68.8202399 Z M64.9818688,58.8230293 L64.9818688,45.8666444 L76.8485579,58.8230293 L64.9818688,58.8230293 L64.9818688,58.8230293 Z M9.99721065,95.6627504 L9.99721065,37.9888424 L54.9846583,37.9888424 L54.9846583,61.3523236 L9.99721065,95.6627504 Z M170,2.04051565e-11 C167.238576,2.04245402e-11 165,2.23857623 165,4.99999995 L165,80.2194419 L120,60.5694419 L120,5.00139509 C120,2.23997133 117.761424,0.00139506489 115,0.00139506489 C112.238576,0.00139506489 110,2.23997133 110,5.00139509 L110,58.8394419 L90.42,58.8394419 L64.9999999,31.059442 L64.9999999,5.00139509 C64.9999999,2.23997137 62.7614237,0.00139513813 60,0.00139513813 C57.2385763,0.00139513813 55,2.23997137 55,5.00139509 L55,27.999442 L10,27.999442 L10,4.99999995 C10,2.23857619 7.76142378,-7.3221713e-08 5.00000002,-7.32217131e-08 C2.23857626,-7.32217133e-08 3.38176877e-16,2.23857619 0,4.99999995 L0,142.999442 C3.38176877e-16,145.760866 2.23857626,147.999442 5.00000002,147.999442 C7.76142378,147.999442 10,145.760866 10,142.999442 L10,108.249442 L55,73.9494419 L55,142.999442 C55,145.760866 57.2385763,147.999442 60,147.999442 C62.7614237,147.999442 64.9999999,145.760866 64.9999999,142.999442 L64.9999999,68.839442 L86.01,68.839442 L110,95.0694419 L110,142.999442 C110,145.760866 112.238576,147.999442 115,147.999442 C117.761424,147.999442 120,145.760866 120,142.999442 L120,101.939442 L165,128.839442 L165,142.999442 C165,145.760866 167.238576,147.999442 170,147.999442 C172.761424,147.999442 175,145.760866 175,142.999442 L175,4.99999995 C175,3.67391749 174.473216,2.40214791 173.535534,1.46446603 C172.597852,0.526784141 171.326082,-3.88296707e-08 170,2.04051565e-11 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/pictorialBar.svg":
/*!*****************************************!*\
  !*** ./src/asset/icon/pictorialBar.svg ***!
  \*****************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"141px\" viewBox=\"0 0 175 141\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>pictorialBar</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"pictorialBar\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M165.182447,113.123194 C161.75364,113.169204 158.605604,115.027549 156.908673,118.007359 L62.4782339,118.007359 C59.7807842,118.007359 57.5940692,120.194074 57.5940692,122.891524 C57.5940692,125.588973 59.7807842,127.775688 62.4782339,127.775688 L156.908673,127.775688 C158.605604,130.755498 161.75364,132.613843 165.182447,132.659853 C170.576885,132.6592 174.949595,128.285961 174.949595,122.891524 C174.949595,117.497086 170.576885,113.123847 165.182447,113.123194 L165.182447,113.123194 Z M165.182447,78.9340419 C161.75364,78.980052 158.605603,80.8383969 156.908673,83.8182066 L77.2674843,83.8182066 C74.5700347,83.8182066 72.3833197,86.0049216 72.3833197,88.7023712 C72.3833197,91.3998208 74.5700347,93.5865358 77.2674843,93.5865358 L156.908673,93.5865358 C158.605603,96.5663455 161.75364,98.4246904 165.182447,98.4707005 C170.577347,98.4707005 174.950777,94.0972705 174.950777,88.7023712 C174.950777,83.3074719 170.577347,78.9340419 165.182447,78.9340419 L165.182447,78.9340419 Z M165.182447,44.7448896 C170.407595,44.9786234 174.523583,49.2828462 174.523583,54.5132188 C174.523583,59.7435915 170.407595,64.0478142 165.182447,64.2815481 C161.75364,64.235538 158.605604,62.3771932 156.908673,59.3973835 L77.2674843,59.3973835 C74.5700346,59.3973835 72.3833196,57.2106685 72.3833196,54.5132188 C72.3833196,51.8157692 74.5700346,49.6290542 77.2674843,49.6290542 L156.908673,49.6290542 C158.605604,46.6492445 161.75364,44.7908997 165.182447,44.7448896 Z M62.6149904,20.3240665 C62.6149904,19.0287054 63.1295706,17.7863991 64.0455291,16.8704405 C64.9614877,15.954482 66.2037941,15.4399018 67.4991551,15.4399019 L156.908673,15.4399019 C158.605604,12.4600922 161.75364,10.6017474 165.182447,10.5557373 C170.407595,10.7894711 174.523583,15.0936938 174.523583,20.3240665 C174.523583,25.5544392 170.407595,29.8586619 165.182447,30.0923957 C161.75364,30.0463857 158.605604,28.1880408 156.908673,25.2082312 L67.4991551,25.2082312 C66.2037941,25.2082312 64.9614877,24.6936511 64.0455291,23.7776925 C63.1295705,22.8617339 62.6149904,21.6194275 62.6149904,20.3240665 Z M23.5416735,29.3240665 C31.6340224,29.3240665 38.1941674,22.7639215 38.1941674,14.6715726 C38.1941674,6.57922368 31.6340224,0.0190787204 23.5416735,0.0190787204 C15.4493246,0.0190787204 8.88917966,6.57922368 8.88917966,14.6715726 C8.88917966,22.7639215 15.4493246,29.3240665 23.5416735,29.3240665 Z M34.0523957,34.2082312 L13.0211829,34.2082312 C10.6337153,34.2093302 8.59694107,35.9362503 8.20539657,38.2913927 L0.0683783524,87.133039 C-0.166957522,88.5485838 0.232108973,89.996 1.15960938,91.0909397 C2.08710979,92.1858793 3.44919091,92.8175461 4.88416457,92.8182066 L8.88917966,92.8182066 L9.0426883,136.115835 C9.0426883,138.813285 11.2294033,141 13.9268529,141 L33.4635113,141 C34.7588723,141 36.0011787,140.48542 36.9171373,139.569461 C37.8330959,138.653503 38.347676,137.411196 38.347676,136.115835 L38.1941674,92.8182066 L42.189414,92.8182066 C43.6255482,92.8209447 44.9898051,92.1902296 45.9180572,91.0944026 C46.8463094,89.9985755 47.2440794,88.5491696 47.0052003,87.133039 L38.8681821,38.2913927 C38.4766376,35.9362503 36.4398634,34.2093302 34.0523957,34.2082312 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/pie.svg":
/*!********************************!*\
  !*** ./src/asset/icon/pie.svg ***!
  \********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"144px\" height=\"152px\" viewBox=\"0 0 144 152\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>pie (2)</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"pie-(2)\" transform=\"translate(0.000000, -0.612903)\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M72.1778824,12.9606446 L72.1778824,73.6462877 C72.1779317,75.129331 72.9386663,76.5065116 74.1881954,77.2856176 C75.4377246,78.0647237 76.9977039,78.1345538 78.3105882,77.4701504 L128.354824,52.1402676 L132.666353,49.9503148 C134.757503,48.8920984 137.302156,49.7461658 138.350118,51.857969 L138.468706,52.1060495 L138.782118,52.8930638 C140.942118,58.6416896 144,65.8873535 144,83.8518095 C144,116.316148 115.123765,152.612903 73.2282353,152.612903 C31.3242354,152.612903 0,119.994584 0,80.8406245 C0,44.5353146 27.216,13.7391044 62.2588236,9.22232682 C64.122353,8.98280072 65.9265883,8.80315611 67.6715294,8.69194766 C68.8395088,8.61630135 69.986418,9.03213213 70.8400527,9.84074781 C71.6936873,10.6493635 72.1779411,11.7786714 72.1778824,12.9606446 Z M90.0254118,0.659269609 C88.9814749,0.488081123 87.9163292,0.795987208 87.1201941,1.49909291 C86.324059,2.20219861 85.8798887,3.22724309 85.9087059,4.29493319 L85.9087059,54.6039644 C85.9087059,56.9393437 87.6028236,57.8717845 89.5680001,56.7511446 L133.149176,31.9088684 C134.092985,31.4117209 134.762111,30.50855 134.968019,29.4538349 C135.173928,28.3991197 134.894328,27.3070442 134.208,26.4853136 C134.208,26.4853136 133.538824,25.5357637 132.446118,24.3381334 C127.296,18.6921614 122.832,14.7399812 116.860235,10.9417819 C109.345997,6.07770841 100.978781,2.71218494 92.2108235,1.0271132 C89.9745882,0.599388123 90.0254118,0.659269609 90.0254118,0.659269609 L90.0254118,0.659269609 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/radar.svg":
/*!**********************************!*\
  !*** ./src/asset/icon/radar.svg ***!
  \**********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"151px\" height=\"170px\" viewBox=\"0 0 151 170\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>radar</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"radar\" transform=\"translate(0.500000, 0.000000)\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M79.573911,32.0195055 C79.7511468,32.0807796 79.9252225,32.1507623 80.0954971,32.2291958 L126.376239,53.5077701 C128.225278,54.3572545 129.374745,56.2354539 129.285085,58.2607506 L126.927916,110.733256 C126.832633,112.851954 125.405699,114.680595 123.367088,115.296516 L76.444394,129.315811 C75.5054275,129.595861 74.5046062,129.595861 73.5656397,129.315811 L32.4706683,117.053921 C30.8367372,116.566659 29.5635821,115.286115 29.0909814,113.654618 C28.6183807,112.023122 29.0111288,110.264354 30.133561,108.985836 L59.2822032,75.635091 C59.7218624,75.142978 60.0532763,74.5647698 60.2551619,73.937598 L73.2246026,35.1848307 C74.1062345,32.570839 76.9431645,31.1565423 79.573911,32.0195055 L79.573911,32.0195055 Z M139.476076,121.926724 L75.0000016,158.991984 L10.5239274,121.926724 L10.5239274,47.816176 L75.0000016,10.7509165 L139.476076,47.816176 L139.476076,121.926724 Z M146.998953,40.6068232 L77.5076273,0.665810956 C75.9548023,-0.221936985 74.0452007,-0.221936985 72.4923757,0.665810956 L3.00105014,40.6068232 C1.44784731,41.4971353 0.491395456,43.1462367 0.493424274,44.9304378 L0.493424274,124.812462 C0.493424274,126.599823 1.44632208,128.247389 3.00105014,129.136077 L72.4923757,169.077089 C74.047355,169.95676 75.9526481,169.95676 77.5076273,169.077089 L146.998953,129.136077 C148.550638,128.244253 149.506533,126.596111 149.506579,124.812462 L149.506579,44.9304378 C149.506533,43.1467894 148.550638,41.4986473 146.998953,40.6068232 L146.998953,40.6068232 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/rich.svg":
/*!*********************************!*\
  !*** ./src/asset/icon/rich.svg ***!
  \*********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"167px\" height=\"162px\" viewBox=\"0 0 167 162\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>rich</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"rich\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M5.52634288,101.24857 L96.0005147,101.24857 C98.7764873,101.24857 101.026858,98.9820436 101.026858,96.1861415 C101.026858,93.3902395 98.7764873,91.123713 96.0005147,91.123713 L5.52634288,91.123713 C2.75037036,91.123713 0.5,93.3902395 0.5,96.1861415 C0.5,98.9820436 2.75037036,101.24857 5.52634288,101.24857 Z M75.8951432,121.498284 L5.52634288,121.498284 C2.75037036,121.498284 0.5,123.76481 0.5,126.560713 C0.5,129.356615 2.75037036,131.623141 5.52634288,131.623141 L75.8951432,131.623141 C78.6711157,131.623141 80.9214861,129.356615 80.9214861,126.560713 C80.9214861,123.76481 78.6711157,121.498284 75.8951432,121.498284 Z M146.394628,92.0653247 L128.923061,116.435856 L146.394628,116.435856 L146.394628,92.0653247 Z M166.5,60.749142 L166.5,151.872855 C166.5,157.464659 161.999259,161.997712 156.447314,161.997712 C150.895369,161.997712 146.394628,157.464659 146.394628,151.872855 L146.394628,136.68557 L114.406982,136.68557 L99.2575849,157.806021 C96.0041451,162.338178 89.7188607,163.355849 85.2190093,160.079052 C80.7191578,156.802254 79.7087415,150.471846 82.9621813,145.939689 L148.304639,54.8261007 C148.455429,54.6033538 148.706746,54.4919804 148.867589,54.2894832 C149.318111,53.7697312 149.823755,53.3011987 150.375492,52.892253 C150.857637,52.4854402 151.379728,52.1292264 151.933658,51.829143 C152.481136,51.5631055 153.053631,51.3528145 153.642615,51.2014019 C154.31205,50.9842108 155.003114,50.8416105 155.703415,50.7761579 C155.954733,50.7559082 156.185944,50.624285 156.447314,50.624285 C156.819264,50.624285 157.130897,50.7964076 157.492794,50.836907 C158.850886,50.9717079 160.164137,51.3999382 161.342972,52.0923893 C161.674711,52.2746367 162.036608,52.3151361 162.338188,52.537883 C162.559347,52.7100056 162.659874,52.9428773 162.87098,53.1251247 C163.403773,53.5807433 163.836038,54.0869861 164.268304,54.6337284 C164.650306,55.1399712 165.022255,55.6259644 165.30373,56.1929564 C165.585206,56.7498235 165.766154,57.3370652 165.947102,57.9546815 C166.138103,58.6330469 166.298946,59.2709129 166.34921,59.969528 C166.369315,60.2428992 166.5,60.4757709 166.5,60.749142 L166.5,60.749142 Z M55.7897717,151.872855 L5.52634288,151.872855 C2.75037036,151.872855 0.5,154.139381 0.5,156.935284 C0.5,159.731186 2.75037036,161.997712 5.52634288,161.997712 L55.7897717,161.997712 C58.5657442,161.997712 60.8161146,159.731186 60.8161146,156.935284 C60.8161146,154.139381 58.5657442,151.872855 55.7897717,151.872855 Z M86.3887335,40.499428 L161.100608,40.499428 C164.04791,40.499428 166.437171,38.2329016 166.437171,35.4369995 C166.437171,32.6410974 164.04791,30.374571 161.100608,30.374571 L86.3887335,30.374571 C83.4414314,30.374571 81.052171,32.6410974 81.052171,35.4369995 C81.052171,38.2329016 83.4414314,40.499428 86.3887335,40.499428 Z M86.3887335,10.124857 L161.100608,10.124857 C164.04791,10.124857 166.437171,7.85833056 166.437171,5.0624285 C166.437171,2.26652644 164.04791,1.71199625e-16 161.100608,0 L86.3887335,0 C83.4414314,-1.71199625e-16 81.052171,2.26652644 81.052171,5.0624285 C81.052171,7.85833056 83.4414314,10.124857 86.3887335,10.124857 Z M5.6570278,70.873999 L60.9467995,70.873999 C63.722772,70.873999 65.9731424,68.6074726 65.9731424,65.8115705 L65.9731424,5.0624285 C65.9731424,2.26652644 63.722772,1.71199625e-16 60.9467995,0 L5.6570278,0 C2.88105528,-1.71199625e-16 0.630684915,2.26652644 0.630684915,5.0624285 L0.630684915,65.8115705 C0.630684915,68.6074726 2.88105528,70.873999 5.6570278,70.873999 Z M81.052171,65.8115705 C81.052171,63.0156685 83.3025414,60.749142 86.0785139,60.749142 L116.236571,60.749142 C119.012544,60.749142 121.262914,63.0156685 121.262914,65.8115705 C121.262914,68.6074726 119.012544,70.873999 116.236571,70.873999 L86.0785139,70.873999 C83.3025414,70.873999 81.052171,68.6074726 81.052171,65.8115705 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/sankey.svg":
/*!***********************************!*\
  !*** ./src/asset/icon/sankey.svg ***!
  \***********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"139px\" viewBox=\"0 0 175 139\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>sankey</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"sankey\" fill-rule=\"nonzero\"> <path d=\"M4.60195168,138.058552 C2.06036395,138.058552 3.11254728e-16,135.998188 0,133.4566 L0,115.048793 C-3.11254732e-16,112.507205 2.06036398,110.446841 4.60195174,110.446841 C7.14353951,110.446841 9.20390349,112.507205 9.20390349,115.048793 L9.20390349,133.4566 C9.20390349,134.677113 8.71905638,135.847638 7.856023,136.710671 C6.99298962,137.573705 5.82246517,138.058552 4.60195168,138.058552 M4.60195168,106.820503 C2.06036395,106.820503 3.11254728e-16,104.760139 0,102.218552 L0,4.60195168 C-3.11254732e-16,2.06036391 2.06036398,-6.74114049e-08 4.60195174,-6.74114054e-08 C7.14353951,-6.74114058e-08 9.20390349,2.06036391 9.20390349,4.60195168 L9.20390349,102.218552 C9.20390349,103.439065 8.71905638,104.60959 7.856023,105.472623 C6.99298962,106.335656 5.82246517,106.820503 4.60195168,106.820503\" id=\"Shape\" fill=\"#5067A2\"></path> <path d=\"M4.60195168,106.820503 C2.06036395,106.820503 3.11254728e-16,104.760139 0,102.218552 L0,4.60195168 C-3.11254732e-16,2.06036391 2.06036398,-6.74114049e-08 4.60195174,-6.74114054e-08 C7.14353951,-6.74114058e-08 9.20390349,2.06036391 9.20390349,4.60195168 L9.20390349,102.218552 C9.20390349,103.439065 8.71905638,104.60959 7.856023,105.472623 C6.99298962,106.335656 5.82246517,106.820503 4.60195168,106.820503\" id=\"Path\" fill=\"#5067A2\"></path> <path d=\"M87.4370826,64.4273241 C86.2165692,64.4273241 85.0460447,63.942477 84.1830114,63.0794436 C83.319978,62.2164103 82.8351309,61.0458858 82.835131,59.8253723 L82.835131,4.60195168 C82.835131,2.06036391 84.8954949,-6.74113054e-08 87.4370827,-6.74113059e-08 C89.9786705,-6.74113063e-08 92.0390345,2.06036391 92.0390345,4.60195168 L92.0390345,59.8253723 C92.0390345,61.0458858 91.5541874,62.2164103 90.691154,63.0794437 C89.8281206,63.9424771 88.6575962,64.4273242 87.4370826,64.4273241 M170.272214,38.2054031 C167.730626,38.2054031 165.670262,36.1450392 165.670262,33.6034515 L165.670262,4.60195168 C165.670262,2.06036391 167.730626,-6.74114049e-08 170.272214,-6.74114054e-08 C172.813801,-6.74114058e-08 174.874165,2.06036391 174.874165,4.60195168 L174.874165,33.6034515 C174.874165,34.823965 174.389318,35.9944894 173.526285,36.8575227 C172.663252,37.7205561 171.492727,38.2054032 170.272214,38.2054031 M105.84489,138.058552 C104.624376,138.058552 103.453852,137.573705 102.590818,136.710671 C101.727785,135.847638 101.242938,134.677113 101.242938,133.4566 L101.242938,78.2331793 C101.242938,75.6915915 103.303302,73.6312276 105.84489,73.6312276 C108.386477,73.6312276 110.446841,75.6915915 110.446841,78.2331793 L110.446841,133.4566 C110.446841,135.998188 108.386477,138.058552 105.84489,138.058552 M170.272214,138.058552 C167.730626,138.058552 165.670262,135.998188 165.670262,133.4566 L165.670262,48.3020853 C165.670262,45.7604975 167.730626,43.7001336 170.272214,43.7001336 C172.813801,43.7001336 174.874165,45.7604975 174.874165,48.3020853 L174.874165,133.4566 C174.874165,134.677113 174.389318,135.847638 173.526285,136.710671 C172.663252,137.573705 171.492727,138.058552 170.272214,138.058552\" id=\"Shape\" fill=\"#5067A2\"></path> <polygon id=\"Path\" fill=\"#95A5C8\" points=\"110.446841 133.4566 165.670262 133.4566 165.670262 78.2331793 110.446841 78.2331793\"></polygon> <polygon id=\"Path\" fill=\"#5067A2\" points=\"165.670262 133.4566 174.874165 133.4566 174.874165 78.2331793 165.670262 78.2331793\"></polygon> <path d=\"M165.670262,77.9478582 C124.491998,75.6100668 130.198418,59.8345763 92.0390345,59.8253723 L92.0390345,32.213662 C124.832542,32.2228659 136.825229,48.0167643 165.670262,48.6242219 L165.670262,77.9478582\" id=\"Path\" fill=\"#95A5C8\"></path> <path d=\"M92.0390345,59.8253723 L92.0022188,59.8253723 L92.0022188,32.213662 L92.0390345,32.213662 L92.0390345,59.8253723 M174.874165,78.2331793 C171.56076,78.2055676 168.505064,78.1135285 165.670262,77.9478582 L165.670262,48.6242219 L167.400596,48.6426296 C169.765999,48.6426296 172.260257,48.5413867 174.874165,48.3204931 L174.874165,78.2331793\" id=\"Shape\" fill=\"#5067A2\"></path> <polygon id=\"Path\" fill=\"#95A5C8\" points=\"92.0390345 32.213662 165.670262 32.213662 165.670262 4.60195168 92.0390345 4.60195168\"></polygon> <path d=\"M82.835131,32.213662 L92.0390345,32.213662 L92.0390345,4.60195168 L82.835131,4.60195168 L82.835131,32.213662 Z M165.670262,32.213662 L174.506009,32.213662 L174.506009,4.60195168 L165.670262,4.60195168 L165.670262,32.213662 Z\" id=\"Shape\" fill=\"#5067A2\"></path> <polygon id=\"Path\" fill=\"#95A5C8\" points=\"9.20390349 59.8253723 82.835131 59.8253723 82.835131 4.60195168 9.20390349 4.60195168\"></polygon> <polyline id=\"Path\" fill=\"#5067A2\" points=\"82.835131 59.8253723 82.835131 4.60195168 82.835131 59.8253723\"></polyline> <polygon id=\"Path\" fill=\"#95A5C8\" points=\"9.20390349 133.4566 101.242938 133.4566 101.242938 115.048793 9.20390349 115.048793\"></polygon> <polygon id=\"Path\" fill=\"#5067A2\" points=\"101.242938 133.4566 110.446841 133.4566 110.446841 115.048793 101.242938 115.048793\"></polygon> <path d=\"M101.242938,115.048793 C43.4792398,114.699045 52.1585208,101.445424 9.20390349,101.445424 L9.20390349,59.8253723 C56.5579867,59.8253723 47.7682589,78.1319363 101.242938,78.2331793 L101.242938,115.048793\" id=\"Path\" fill=\"#95A5C8\"></path> <path d=\"M101.675521,115.048793 L101.242938,115.048793 L101.242938,78.2331793 L101.675521,78.2331793 C104.335449,78.2331793 100.46981,113.723431 101.675521,115.048793\" id=\"Path\" fill=\"#5067A2\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/scatter.svg":
/*!************************************!*\
  !*** ./src/asset/icon/scatter.svg ***!
  \************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"138px\" viewBox=\"0 0 175 138\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>scatter</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"scatter\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M173.526285,129.202529 C172.663252,128.339495 171.492727,127.854648 170.272214,127.854648 L9.20390349,127.854648 L9.20390349,4.60195168 C9.20390349,2.06036391 7.14353951,-6.74112924e-08 4.60195174,-6.74112925e-08 C2.06036398,-6.74112927e-08 3.11254732e-16,2.06036391 0,4.60195168 L0,132.4566 C3.11254728e-16,134.998188 2.06036395,137.058552 4.60195168,137.058552 L170.272214,137.058552 C171.492727,137.058552 172.663252,136.573705 173.526285,135.710671 C174.389318,134.847638 174.874165,133.677113 174.874165,132.4566 C174.874165,131.236086 174.389318,130.065562 173.526285,129.202529 Z M151.864407,12.8058552 C155.15291,12.8054572 158.191783,14.5596242 159.836149,17.4074853 C161.480516,20.2553464 161.480516,23.7641708 159.836149,26.6120319 C158.191783,29.459893 155.15291,31.21406 151.864407,31.213662 C146.781666,31.2130468 142.661617,27.0924991 142.661617,22.0097586 C142.661617,16.9270181 146.781666,12.8064703 151.864407,12.8058552 Z M142.660503,58.8253723 C147.743679,58.8253723 151.864407,62.9461003 151.864407,68.0292758 C151.864407,73.1124513 147.743679,77.2331793 142.660503,77.2331793 C137.577328,77.2331793 133.4566,73.1124513 133.4566,68.0292758 C133.4566,62.9461003 137.577328,58.8253723 142.660503,58.8253723 Z M124.252696,40.4175655 C127.5412,40.4171675 130.580072,42.1713345 132.224439,45.0191956 C133.868806,47.8670567 133.868806,51.3758811 132.224439,54.2237422 C130.580072,57.0716033 127.5412,58.8257703 124.252696,58.8253723 C119.169956,58.8247572 115.049907,54.7042094 115.049907,49.6214689 C115.049907,44.5387284 119.169956,40.4181807 124.252696,40.4175655 L124.252696,40.4175655 Z M105.84489,22.0097586 C109.133393,22.0093606 112.172266,23.7635277 113.816632,26.6113888 C115.460999,29.4592498 115.460999,32.9680743 113.816632,35.8159354 C112.172266,38.6637965 109.133393,40.4179635 105.84489,40.4175655 C100.762149,40.4169503 96.6421001,36.2964026 96.6421001,31.2136621 C96.6421001,26.1309216 100.762149,22.0103738 105.84489,22.0097586 L105.84489,22.0097586 Z M105.84489,58.8253723 C110.928065,58.8253723 115.048793,62.9461003 115.048793,68.0292758 C115.048793,73.1124513 110.928065,77.2331793 105.84489,77.2331793 C100.761714,77.2331793 96.6409861,73.1124513 96.6409861,68.0292758 C96.6409861,62.9461003 100.761714,58.8253723 105.84489,58.8253723 L105.84489,58.8253723 Z M87.4370826,77.2331793 C90.8200008,77.0784213 94.0146452,78.7938663 95.7543045,81.6993216 C97.4939639,84.6047768 97.4975937,88.2308616 95.7637545,91.1397939 C94.0299154,94.0487262 90.8387117,95.7705634 87.4554905,95.6225784 C82.5370015,95.4074394 78.6587219,91.3598697 78.6537937,86.4366802 C78.6488656,81.5134907 82.5190342,77.4581647 87.4370826,77.2331793 L87.4370826,77.2331793 Z M59.8253723,68.0292758 C63.1138756,68.0288778 66.1527483,69.7830448 67.7971148,72.6309059 C69.4414814,75.478767 69.4414814,78.9875915 67.7971148,81.8354525 C66.1527483,84.6833136 63.1138756,86.4374807 59.8253723,86.4370826 C54.7426318,86.4364675 50.6225828,82.3159197 50.6225828,77.2331792 C50.6225828,72.1504387 54.7426318,68.029891 59.8253723,68.0292758 L59.8253723,68.0292758 Z M32.213662,95.6409861 C35.5021653,95.6405881 38.541038,97.3947552 40.1854045,100.242616 C41.8297711,103.090477 41.8297711,106.599302 40.1854045,109.447163 C38.541038,112.295024 35.5021653,114.049191 32.213662,114.048793 C27.1309215,114.048178 23.0108725,109.92763 23.0108725,104.84489 C23.0108725,99.762149 27.1309215,95.6416013 32.213662,95.6409861 L32.213662,95.6409861 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/sunburst.svg":
/*!*************************************!*\
  !*** ./src/asset/icon/sunburst.svg ***!
  \*************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"176px\" height=\"154px\" viewBox=\"0 0 176 154\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>sunburst</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"sunburst\" transform=\"translate(-0.500000, -0.495167)\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M119.233629,98.0044542 L110.718691,87.8510962 C116.698944,81.6134116 119.776927,73.1460671 119.198407,64.5239101 L132.221771,61.7588152 C132.389075,63.3350954 132.468325,64.9289877 132.468325,66.5404921 C132.486789,78.3855449 127.713147,89.7343283 119.233629,98.0044542 L119.233629,98.0044542 Z M63.3185781,30.3829135 C74.7931609,22.4121709 89.3686325,20.3583561 102.598787,24.8479794 C115.828942,29.3376027 126.144611,39.8381699 130.399028,53.1465133 L117.38447,55.9116082 C114.163414,47.1482037 107.14477,40.3166874 98.2978797,37.3338959 C89.4509892,34.3511045 79.7290566,35.5384174 71.8599325,40.5626897 L63.3185781,30.3829135 L63.3185781,30.3829135 Z M57.4981296,97.8547516 L67.6773104,89.3128978 C73.1543438,94.3147256 80.4453141,97.3616135 88.4495316,97.3616137 C93.8284022,97.3676833 99.1146581,95.9617789 103.779942,93.2844195 L112.365323,103.508226 C105.247152,108.132446 96.9377023,110.586264 88.4495316,110.570666 C76.8578752,110.587037 65.7306915,106.015602 57.4981296,97.8547516 L57.4981296,97.8547516 Z M51.880208,91.0741048 C47.0035405,83.8229191 44.4062144,75.2791485 44.4219328,66.5404921 C44.4219328,54.7315996 49.0624416,44.0146553 56.6263832,36.1068361 L65.194154,46.3130303 C60.3076881,51.9176198 57.6201378,59.1046557 57.6302124,66.5404921 C57.6302124,72.3876992 59.2592335,77.8562467 62.0858054,82.5146391 L51.880208,91.0741048 L51.880208,91.0741048 Z M40.5915316,112.05008 L50.7354904,103.534644 C60.658337,113.682313 74.2570793,119.394563 88.4495316,119.3767 C99.4212094,119.3767 109.618001,116.030407 118.062495,110.306485 L126.586238,120.468649 C115.441046,128.370969 102.111678,132.606084 88.4495316,132.585752 C70.3533434,132.605952 53.0459635,125.179425 40.5915316,112.05008 L40.5915316,112.05008 Z M0.5,62.1374747 C1.61718015,39.3368661 11.5653323,17.8665508 28.2373873,2.27405071 L36.7435195,12.4097967 C23.0478109,25.4703646 14.8209875,43.2437342 13.7258907,62.1374747 L0.5,62.1374747 Z M0.5,70.9435094 L13.7258907,70.9435094 C14.5580363,85.4042184 19.5854188,99.3091254 28.1933598,110.958131 L18.0582064,119.464761 C7.47186066,105.41813 1.35420505,88.5122858 0.5,70.9435094 L0.5,70.9435094 Z M22.5490216,62.1374747 C23.6176776,45.8469855 30.7006658,30.5346593 42.4230797,19.1728312 L50.9380174,29.3261893 C42.1806215,38.1364527 36.8165849,49.7571326 35.7925234,62.1374747 L22.5490216,62.1374747 L22.5490216,62.1374747 Z M22.5490216,70.9435094 L35.7925234,70.9435094 C36.5571371,80.2216635 39.7688087,89.1310032 45.0999577,96.7628032 L34.9559989,105.278239 C27.6604148,95.2350677 23.3587128,83.3306553 22.5490216,70.9435094 Z M160.064824,88.3354281 C162.208458,81.2692542 163.294499,73.9246962 163.287644,66.5404921 C163.287927,62.7888436 163.014228,59.0421838 162.468731,55.3304099 L175.40404,52.5829271 C177.539642,66.0542744 176.545357,79.8364744 172.498218,92.86173 L160.064824,88.3354281 Z M157.009309,96.5954887 L169.451508,101.130596 C164.453629,112.804913 156.992417,123.261434 147.578597,131.784403 L139.08127,121.666269 C146.731696,114.64362 152.837128,106.105711 157.009309,96.5954887 L157.009309,96.5954887 Z M139.336631,80.7886563 C141.234304,74.0037443 141.75525,66.9076826 140.868791,59.9183539 L153.830516,57.1620651 C155.148964,66.5886629 154.449628,76.187832 151.77883,85.3237642 L139.336631,80.7886563 Z M136.263504,89.0487169 L148.714509,93.5750188 C145.090489,101.633987 139.889912,108.885878 133.419321,114.903235 L124.913189,104.776295 C129.629614,100.274719 133.477161,94.943361 136.263504,89.0487169 L136.263504,89.0487169 Z M84.1260215,141.268503 L84.1260215,154.495167 C61.049526,153.386197 39.3397973,143.226766 23.7025446,126.218989 L33.8288923,117.71236 C46.9380429,131.745712 64.9535467,140.183088 84.1260215,141.268503 L84.1260215,141.268503 Z M104.94227,2.57345585 C127.679056,8.4576749 145.591926,25.956003 152.007773,48.5497632 L139.046048,51.306052 C133.813709,33.9700374 120.081572,20.5128194 102.64403,15.6328053 L104.933465,2.64390412 L104.94227,2.57345585 L104.94227,2.57345585 Z M96.2952498,0.953145396 L96.2600278,1.12046007 L93.9970091,13.9948829 C81.1068487,12.6102912 68.1594065,16.034712 57.6390179,23.6110727 L49.1240802,13.4665207 C60.4957814,5.02434618 74.2870046,0.475385223 88.4495316,0.495231624 C91.0999932,0.495231624 93.7152325,0.644934198 96.2952498,0.953145396 L96.2952498,0.953145396 Z\" id=\"Shape\"></path> <path d=\"M88.5,75.295167 C93.3601058,75.295167 97.3,71.3552728 97.3,66.495167 C97.3,61.6350611 93.3601058,57.6951669 88.5,57.6951669 C83.6398942,57.6951669 79.7,61.6350611 79.7,66.495167 C79.7,71.3552728 83.6398942,75.295167 88.5,75.295167 Z M88.5,88.495167 C76.3497355,88.495167 66.5,78.6454315 66.5,66.495167 C66.5,54.3449025 76.3497355,44.495167 88.5,44.495167 C100.650264,44.495167 110.5,54.3449025 110.5,66.495167 C110.5,78.6454315 100.650264,88.495167 88.5,88.495167 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/themeRiver.svg":
/*!***************************************!*\
  !*** ./src/asset/icon/themeRiver.svg ***!
  \***************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"175px\" height=\"130px\" viewBox=\"0 0 175 130\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>themeriver</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"themeriver\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M4.9275627,42.5798026 C5.20117275,42.5813119 5.47437729,42.5585448 5.74396361,42.5117692 C10.5811329,41.6686599 15.2612908,40.0922201 19.6227791,37.836902 C26.4649962,34.328322 32.1798026,30.0130599 43.8718299,30.0130599 C55.5638572,30.0130599 63.7861807,41.3940774 79.5602127,41.4912681 C95.3342445,41.5787397 96.9864845,31.7333333 115.384662,31.7333333 C132.976158,31.7333333 137.621868,44.6208049 153.6,45.4566438 C160.490812,45.8162491 166.6041,44.9318147 171.930144,42.7936218 C173.778744,42.0602993 174.992296,40.2727177 174.991648,38.2839788 L174.991648,26.7960517 C174.987486,25.3270305 174.319017,23.9387356 173.173189,23.0194311 C172.027362,22.1001266 170.527173,21.7484925 169.092179,22.0628701 C165.933485,22.7529233 162.084738,22.8403949 157.5265,22.3155656 C145.533181,20.9160213 134.676993,5.82232335 119.476386,5.82232348 C102.788762,5.82232348 99.3093394,11.1678056 81.9899772,11.1678056 C64.6803341,11.1678056 59.6069856,0.126955258 43.8718299,0.126955258 C37.3211845,0.126955258 27.9422931,3.46059231 17.9025057,7.6009112 C12.9652241,9.65163256 8.49445708,10.8373576 4.50964317,11.1678056 C1.98627058,11.3754189 0.0451326562,13.4857192 0.0485952544,16.0176158 L0.0583143318,37.7202733 C0.0583143318,40.4027335 2.24510251,42.5798026 4.9275627,42.5798026 M170.132118,85.5283219 C169.634444,85.5282959 169.139638,85.6036638 168.664541,85.7518603 C162.658162,87.6665148 157.633409,88.7064541 153.551405,88.9008353 C139.342141,89.522855 131.343356,82.7583903 118.543356,82.7583903 C104.227183,82.7583903 97.8611998,94.1491269 80.444647,94.1491269 C61.0356872,94.1491269 52.3274108,84.1287775 42.4917236,84.1287775 C35.416249,84.1287775 28.7392558,88.7453303 19.9337889,92.9828398 C15.5893698,95.0627183 10.3507973,96.5594533 4.2083523,97.4438876 C1.81553905,97.7920745 0.0427391378,99.8465342 0.0485952544,102.264541 L0.0485952544,124.297646 C0.0496707163,125.687409 0.645723287,127.010209 1.68608385,127.931672 C2.72644442,128.853134 4.11154706,129.285071 5.491268,129.118299 C10.3313591,128.544875 15.142293,127.670159 19.9337889,126.513592 C29.8083523,124.132422 34.2305239,119.068793 42.4917236,118.388459 C54.5822323,117.397115 66.5658314,123.267426 82.4759302,121.323614 C98.386029,119.379803 106.3265,110.156416 120.273349,108.543052 C132.577676,107.12407 140.586181,111.293546 152.083827,110.030068 C159.995141,109.174791 166.81792,107.085194 172.552164,103.780714 C174.06095,102.911932 174.991067,101.303681 174.991648,99.5626424 L174.991648,90.3878512 C174.991648,87.7040073 172.815962,85.5283219 170.132118,85.5283219\" id=\"Shape\"></path> <path d=\"M170.132118,55.1659834 C169.755896,55.1642513 169.380769,55.206657 169.014427,55.2923311 C163.386911,56.5597226 157.597804,56.9530934 151.850569,56.4586181 C133.889749,55.0007593 128.388762,42.7839029 114.655733,42.7839029 C103.264996,42.7839029 93.9249811,52.940319 79.7157175,52.5807138 C59.2668185,52.0656038 52.6578588,41.0733486 42.0738042,41.0733486 C35.5231587,41.0733486 26.5330296,47.0991647 20.6724373,49.7524677 C15.5296251,52.0293301 10.0450596,53.4382394 4.44160976,53.9219438 C1.94888222,54.1623556 0.0470459996,56.2577415 0.0485952544,58.762035 L0.0485952544,80.8242976 C0.0491745866,82.2971429 0.717699925,83.69025 1.86632297,84.6121711 C3.01494602,85.5340923 4.51970635,85.8853329 5.95778278,85.5671982 C11.10094,84.3721963 16.0531556,82.4685044 20.6724373,79.9107062 C28.3018983,75.7703873 34.249962,72.7866364 41.8016705,72.7866364 C56.6037965,72.7866364 63.1252849,82.7778284 79.3755505,82.7778284 C94.6441914,82.7778284 103.070615,71.5231587 117.639484,71.5231587 C132.208352,71.5231587 139.964161,77.2185269 150.314958,77.5295368 C156.48656,77.7044798 163.707821,76.0813971 171.988459,72.6408505 C173.80584,71.8896408 174.991328,70.1171628 174.991648,68.1506454 L174.991648,60.0255125 C174.991648,57.3416686 172.815962,55.1659834 170.132118,55.1659834\" id=\"Path\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/tree.svg":
/*!*********************************!*\
  !*** ./src/asset/icon/tree.svg ***!
  \*********************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"174px\" height=\"147px\" viewBox=\"0 0 174 147\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>tree (1)</title> <desc>Created with Sketch.</desc> <defs> <polygon id=\"path-1\" points=\"2 4.69629167 172 4.69629167 172 146.375 2 146.375\"></polygon> </defs> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"tree-(1)\"> <mask id=\"mask-2\" fill=\"white\"> <use xlink:href=\"#path-1\"></use> </mask> <g id=\"path-1\"></g> <path d=\"M174,127.4965 C173.994333,137.928125 165.534,146.380667 155.101667,146.375708 C144.670042,146.370042 136.216792,137.909 136.222458,127.476667 C136.222458,127.470292 136.222458,127.464625 136.222458,127.45825 C136.226708,118.755667 142.117917,111.435042 150.127042,109.248417 L150.127042,80.2563333 L91.4625,80.2563333 L91.4625,109.120208 C99.7407917,111.126208 105.890542,118.582125 105.889125,127.476667 C105.889125,127.483042 105.889125,127.490125 105.889125,127.4965 C105.883458,137.928125 97.4224167,146.380667 86.9907917,146.375708 C76.5584583,146.370042 68.1059167,137.909 68.1115833,127.476667 C68.1122917,118.764875 74.0049167,111.440708 82.0182917,109.254083 L82.0182917,80.2563333 L23.3530417,80.2563333 L23.3530417,109.120917 C31.630625,111.127625 37.7789583,118.582833 37.77825,127.476667 C37.77825,127.478792 37.77825,127.480917 37.77825,127.483042 C37.776125,137.915375 29.3179167,146.37075 18.8862917,146.368625 C8.45395833,146.367208 -0.00141666667,137.909 0,127.476667 C0.00141666667,118.764167 5.89545833,111.439292 13.9088333,109.254083 L13.9088333,80.2563333 C13.9088333,75.0500833 18.1425417,70.812125 23.3530417,70.812125 L82.0182917,70.812125 L82.0182917,37.8179167 C74.0006667,35.6305833 68.106625,28.298625 68.1115833,19.58825 C68.1122917,9.15025 76.5705,0.694875 87.0028333,0.696291667 C97.4344583,0.697708333 105.890542,9.15591667 105.889125,19.58825 C105.889125,19.594625 105.889125,19.601 105.889125,19.607375 C105.884167,28.4976667 99.7358333,35.9465 91.4625,37.9517917 L91.4625,70.812125 L150.127042,70.812125 C155.337542,70.812125 159.57125,75.0500833 159.57125,80.2563333 L159.57125,109.113125 C167.853083,111.119125 174.00425,118.579292 174,127.476667 C174,127.483042 174,127.490125 174,127.4965 Z\" id=\"Fill-1\" fill=\"#5067A2\" fill-rule=\"nonzero\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/asset/icon/treemap.svg":
/*!************************************!*\
  !*** ./src/asset/icon/treemap.svg ***!
  \************************************/
/***/ ((module) => {

// Module
var code = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> <svg width=\"160px\" height=\"132px\" viewBox=\"0 0 160 132\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"> <title>treemap</title> <desc>Created with Sketch.</desc> <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"> <g id=\"treemap\" transform=\"translate(-0.500000, -0.095199)\" fill=\"#5067A2\" fill-rule=\"nonzero\"> <path d=\"M84.9444444,79.2951993 L4.9444444,79.2951993 C2.48984554,79.2951993 0.5,81.2651464 0.5,83.6951993 L0.5,127.695199 C0.5,130.125252 2.48984554,132.095199 4.9444444,132.095199 L84.9444444,132.095199 C86.1231844,132.095199 87.2536462,131.631629 88.0871413,130.806469 C88.9206363,129.981309 89.3888889,128.862152 89.3888889,127.695199 L89.3888889,83.6951993 C89.3888889,82.5282467 88.9206363,81.4090895 88.0871413,80.5839295 C87.2536462,79.7587694 86.1231844,79.2951993 84.9444444,79.2951993 L84.9444444,79.2951993 Z M156.055556,105.695199 L102.722222,105.695199 C101.543482,105.695199 100.41302,106.158769 99.5795254,106.983929 C98.7460304,107.80909 98.2777777,108.928247 98.2777777,110.095199 L98.2777777,127.695199 C98.2777777,128.862152 98.7460304,129.981309 99.5795254,130.806469 C100.41302,131.631629 101.543482,132.095199 102.722222,132.095199 L156.055556,132.095199 C158.510154,132.095199 160.5,130.125252 160.5,127.695199 L160.5,110.095199 C160.5,107.665146 158.510154,105.695199 156.055556,105.695199 L156.055556,105.695199 Z M156.055556,61.6951994 L102.722222,61.6951994 C101.543482,61.6951994 100.41302,62.1587694 99.5795254,62.9839295 C98.7460304,63.8090896 98.2777777,64.9282468 98.2777777,66.0951993 L98.2777777,92.4951993 C98.2777777,93.6621519 98.7460304,94.7813091 99.5795254,95.6064692 C100.41302,96.4316293 101.543482,96.8951993 102.722222,96.8951993 L156.055556,96.8951993 C158.510154,96.8951993 160.5,94.9252522 160.5,92.4951993 L160.5,66.0951993 C160.5,63.6651465 158.510154,61.6951994 156.055556,61.6951994 L156.055556,61.6951994 Z M156.055556,0.0951993491 L102.722222,0.0951993491 C101.543482,0.0951993149 100.41302,0.558769393 99.5795254,1.38392945 C98.7460304,2.20908951 98.2777777,3.32824674 98.2777777,4.49519931 L98.2777777,48.4951994 C98.2777777,49.662152 98.7460304,50.7813092 99.5795254,51.6064692 C100.41302,52.4316293 101.543482,52.8951994 102.722222,52.8951993 L156.055556,52.8951993 C158.510154,52.8951993 160.5,50.9252523 160.5,48.4951994 L160.5,4.49519931 C160.5,2.06514643 158.510154,0.0951993491 156.055556,0.0951993491 L156.055556,0.0951993491 Z M89.3888889,4.49519931 L89.3888889,66.0951993 C89.3888889,67.2621519 88.9206363,68.3813091 88.0871413,69.2064692 C87.2536462,70.0316293 86.1231844,70.4951993 84.9444444,70.4951993 L4.9444444,70.4951993 C2.48984554,70.4951993 0.5,68.5252522 0.5,66.0951993 L0.5,4.49519931 C0.5,2.06514643 2.48984554,0.0951993491 4.9444444,0.0951993491 L84.9444444,0.0951993491 C86.1231844,0.0951993149 87.2536462,0.558769393 88.0871413,1.38392945 C88.9206363,2.20908951 89.3888889,3.32824674 89.3888889,4.49519931 Z\" id=\"Shape\"></path> </g> </g> </svg>";
// Exports
module.exports = code;

/***/ }),

/***/ "./node_modules/lodash/_Symbol.js":
/*!****************************************!*\
  !*** ./node_modules/lodash/_Symbol.js ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ "./node_modules/lodash/_baseGetTag.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_baseGetTag.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js"),
    getRawTag = __webpack_require__(/*! ./_getRawTag */ "./node_modules/lodash/_getRawTag.js"),
    objectToString = __webpack_require__(/*! ./_objectToString */ "./node_modules/lodash/_objectToString.js");

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),

/***/ "./node_modules/lodash/_freeGlobal.js":
/*!********************************************!*\
  !*** ./node_modules/lodash/_freeGlobal.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),

/***/ "./node_modules/lodash/_getRawTag.js":
/*!*******************************************!*\
  !*** ./node_modules/lodash/_getRawTag.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(/*! ./_Symbol */ "./node_modules/lodash/_Symbol.js");

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),

/***/ "./node_modules/lodash/_objectToString.js":
/*!************************************************!*\
  !*** ./node_modules/lodash/_objectToString.js ***!
  \************************************************/
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),

/***/ "./node_modules/lodash/_root.js":
/*!**************************************!*\
  !*** ./node_modules/lodash/_root.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(/*! ./_freeGlobal */ "./node_modules/lodash/_freeGlobal.js");

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ "./node_modules/lodash/debounce.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/debounce.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    now = __webpack_require__(/*! ./now */ "./node_modules/lodash/now.js"),
    toNumber = __webpack_require__(/*! ./toNumber */ "./node_modules/lodash/toNumber.js");

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),

/***/ "./node_modules/lodash/isObject.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isObject.js ***!
  \*****************************************/
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),

/***/ "./node_modules/lodash/isObjectLike.js":
/*!*********************************************!*\
  !*** ./node_modules/lodash/isObjectLike.js ***!
  \*********************************************/
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),

/***/ "./node_modules/lodash/isSymbol.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/isSymbol.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(/*! ./_baseGetTag */ "./node_modules/lodash/_baseGetTag.js"),
    isObjectLike = __webpack_require__(/*! ./isObjectLike */ "./node_modules/lodash/isObjectLike.js");

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),

/***/ "./node_modules/lodash/now.js":
/*!************************************!*\
  !*** ./node_modules/lodash/now.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(/*! ./_root */ "./node_modules/lodash/_root.js");

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),

/***/ "./node_modules/lodash/toNumber.js":
/*!*****************************************!*\
  !*** ./node_modules/lodash/toNumber.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(/*! ./isObject */ "./node_modules/lodash/isObject.js"),
    isSymbol = __webpack_require__(/*! ./isSymbol */ "./node_modules/lodash/isSymbol.js");

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeAce.vue?vue&type=style&index=0&lang=scss&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeAce.vue?vue&type=style&index=0&lang=scss& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeMonaco.vue?vue&type=style&index=0&lang=scss&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeMonaco.vue?vue&type=style&index=0&lang=scss& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Editor.vue?vue&type=style&index=0&lang=scss&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Editor.vue?vue&type=style&index=0&lang=scss& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/FullCodePreview.vue?vue&type=style&index=0&lang=scss&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/FullCodePreview.vue?vue&type=style&index=0&lang=scss& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Preview.vue?vue&type=style&index=0&lang=scss&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Preview.vue?vue&type=style&index=0&lang=scss& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/ExampleCard.vue?vue&type=style&index=0&lang=scss&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/ExampleCard.vue?vue&type=style&index=0&lang=scss& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/Explore.vue?vue&type=style&index=0&lang=scss&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/Explore.vue?vue&type=style&index=0&lang=scss& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/editor/object-visualizer.css":
/*!******************************************!*\
  !*** ./src/editor/object-visualizer.css ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/resize-detector/esm/index.js":
/*!***************************************************!*\
  !*** ./node_modules/resize-detector/esm/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addListener": () => /* binding */ addListener,
/* harmony export */   "removeListener": () => /* binding */ removeListener
/* harmony export */ });
let raf = null;
function requestAnimationFrame (callback) {
  if (!raf) {
    raf = (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        return setTimeout(callback, 16)
      }
    ).bind(window);
  }
  return raf(callback)
}

let caf = null;
function cancelAnimationFrame (id) {
  if (!caf) {
    caf = (
      window.cancelAnimationFrame ||
      window.webkitCancelAnimationFrame ||
      window.mozCancelAnimationFrame ||
      function (id) {
        clearTimeout(id);
      }
    ).bind(window);
  }

  caf(id);
}

function createStyles (styleText) {
  var style = document.createElement('style');
  style.type = 'text/css';

  if (style.styleSheet) {
    style.styleSheet.cssText = styleText;
  } else {
    style.appendChild(document.createTextNode(styleText));
  }
  (document.querySelector('head') || document.body).appendChild(style);
  return style
}

function createElement (tagName, props = {}) {
  let elem = document.createElement(tagName);
  Object.keys(props).forEach(key => {
    elem[key] = props[key];
  });
  return elem
}

function getComputedStyle (elem, prop, pseudo) {
  // for older versions of Firefox, `getComputedStyle` required
  // the second argument and may return `null` for some elements
  // when `display: none`
  let computedStyle = window.getComputedStyle(elem, pseudo || null) || {
    display: 'none'
  };

  return computedStyle[prop]
}

function getRenderInfo (elem) {
  if (!document.documentElement.contains(elem)) {
    return {
      detached: true,
      rendered: false
    }
  }

  let current = elem;
  while (current !== document) {
    if (getComputedStyle(current, 'display') === 'none') {
      return {
        detached: false,
        rendered: false
      }
    }
    current = current.parentNode;
  }

  return {
    detached: false,
    rendered: true
  }
}

var css = ".resize-triggers{visibility:hidden;opacity:0;pointer-events:none}.resize-contract-trigger,.resize-contract-trigger:before,.resize-expand-trigger,.resize-triggers{content:\"\";position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden}.resize-contract-trigger,.resize-expand-trigger{background:#eee;overflow:auto}.resize-contract-trigger:before{width:200%;height:200%}";

let total = 0;
let style = null;

function addListener (elem, callback) {
  if (!elem.__resize_mutation_handler__) {
    elem.__resize_mutation_handler__ = handleMutation.bind(elem);
  }

  let listeners = elem.__resize_listeners__;

  if (!listeners) {
    elem.__resize_listeners__ = [];
    if (window.ResizeObserver) {
      let { offsetWidth, offsetHeight } = elem;
      let ro = new ResizeObserver(() => {
        if (!elem.__resize_observer_triggered__) {
          elem.__resize_observer_triggered__ = true;
          if (elem.offsetWidth === offsetWidth && elem.offsetHeight === offsetHeight) {
            return
          }
        }
        runCallbacks(elem);
      });

      // initially display none won't trigger ResizeObserver callback
      let { detached, rendered } = getRenderInfo(elem);
      elem.__resize_observer_triggered__ = detached === false && rendered === false;
      elem.__resize_observer__ = ro;
      ro.observe(elem);
    } else if (elem.attachEvent && elem.addEventListener) {
      // targeting IE9/10
      elem.__resize_legacy_resize_handler__ = function handleLegacyResize () {
        runCallbacks(elem);
      };
      elem.attachEvent('onresize', elem.__resize_legacy_resize_handler__);
      document.addEventListener('DOMSubtreeModified', elem.__resize_mutation_handler__);
    } else {
      if (!total) {
        style = createStyles(css);
      }
      initTriggers(elem);

      elem.__resize_rendered__ = getRenderInfo(elem).rendered;
      if (window.MutationObserver) {
        let mo = new MutationObserver(elem.__resize_mutation_handler__);
        mo.observe(document, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
        elem.__resize_mutation_observer__ = mo;
      }
    }
  }

  elem.__resize_listeners__.push(callback);
  total++;
}

function removeListener (elem, callback) {
  let listeners = elem.__resize_listeners__;
  if (!listeners) {
    return
  }

  if (callback) {
    listeners.splice(listeners.indexOf(callback), 1);
  }

  // no listeners exist, or removing all listeners
  if (!listeners.length || !callback) {
    // targeting IE9/10
    if (elem.detachEvent && elem.removeEventListener) {
      elem.detachEvent('onresize', elem.__resize_legacy_resize_handler__);
      document.removeEventListener('DOMSubtreeModified', elem.__resize_mutation_handler__);
      return
    }

    if (elem.__resize_observer__) {
      elem.__resize_observer__.unobserve(elem);
      elem.__resize_observer__.disconnect();
      elem.__resize_observer__ = null;
    } else {
      if (elem.__resize_mutation_observer__) {
        elem.__resize_mutation_observer__.disconnect();
        elem.__resize_mutation_observer__ = null;
      }
      elem.removeEventListener('scroll', handleScroll);
      elem.removeChild(elem.__resize_triggers__.triggers);
      elem.__resize_triggers__ = null;
    }
    elem.__resize_listeners__ = null;
  }

  if (!--total && style) {
    style.parentNode.removeChild(style);
  }
}

function getUpdatedSize (elem) {
  let { width, height } = elem.__resize_last__;
  let { offsetWidth, offsetHeight } = elem;
  if (offsetWidth !== width || offsetHeight !== height) {
    return {
      width: offsetWidth,
      height: offsetHeight
    }
  }
  return null
}

function handleMutation () {
  // `this` denotes the scrolling element
  let { rendered, detached } = getRenderInfo(this);
  if (rendered !== this.__resize_rendered__) {
    if (!detached && this.__resize_triggers__) {
      resetTriggers(this);
      this.addEventListener('scroll', handleScroll, true);
    }
    this.__resize_rendered__ = rendered;
    runCallbacks(this);
  }
}

function handleScroll () {
  // `this` denotes the scrolling element
  resetTriggers(this);
  if (this.__resize_raf__) {
    cancelAnimationFrame(this.__resize_raf__);
  }
  this.__resize_raf__ = requestAnimationFrame(() => {
    let updated = getUpdatedSize(this);
    if (updated) {
      this.__resize_last__ = updated;
      runCallbacks(this);
    }
  });
}

function runCallbacks (elem) {
  if (!elem || !elem.__resize_listeners__) {
    return
  }
  elem.__resize_listeners__.forEach(callback => {
    callback.call(elem, elem);
  });
}

function initTriggers (elem) {
  let position = getComputedStyle(elem, 'position');
  if (!position || position === 'static') {
    elem.style.position = 'relative';
  }

  elem.__resize_old_position__ = position;
  elem.__resize_last__ = {};

  let triggers = createElement('div', {
    className: 'resize-triggers'
  });
  let expand = createElement('div', {
    className: 'resize-expand-trigger'
  });
  let expandChild = createElement('div');
  let contract = createElement('div', {
    className: 'resize-contract-trigger'
  });
  expand.appendChild(expandChild);
  triggers.appendChild(expand);
  triggers.appendChild(contract);
  elem.appendChild(triggers);

  elem.__resize_triggers__ = {
    triggers,
    expand,
    expandChild,
    contract
  };

  resetTriggers(elem);
  elem.addEventListener('scroll', handleScroll, true);

  elem.__resize_last__ = {
    width: elem.offsetWidth,
    height: elem.offsetHeight
  };
}

function resetTriggers (elem) {
  let { expand, expandChild, contract } = elem.__resize_triggers__;

  // batch read
  let { scrollWidth: csw, scrollHeight: csh } = contract;
  let { offsetWidth: eow, offsetHeight: eoh, scrollWidth: esw, scrollHeight: esh } = expand;

  // batch write
  contract.scrollLeft = csw;
  contract.scrollTop = csh;
  expandChild.style.width = eow + 1 + 'px';
  expandChild.style.height = eoh + 1 + 'px';
  expand.scrollLeft = esw;
  expand.scrollTop = esh;
}




/***/ }),

/***/ "./node_modules/vanilla-lazyload/dist/lazyload.esm.js":
/*!************************************************************!*\
  !*** ./node_modules/vanilla-lazyload/dist/lazyload.esm.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
const runningOnBrowser = typeof window !== "undefined";

const isBot =
	(runningOnBrowser && !("onscroll" in window)) ||
	(typeof navigator !== "undefined" &&
		/(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent));

const supportsIntersectionObserver =
	runningOnBrowser && "IntersectionObserver" in window;

const supportsClassList =
	runningOnBrowser && "classList" in document.createElement("p");

const defaultSettings = {
	elements_selector: "img",
	container: isBot || runningOnBrowser ? document : null,
	threshold: 300,
	thresholds: null,
	data_src: "src",
	data_srcset: "srcset",
	data_sizes: "sizes",
	data_bg: "bg",
	data_poster: "poster",
	class_loading: "loading",
	class_loaded: "loaded",
	class_error: "error",
	load_delay: 0,
	auto_unobserve: true,
	callback_enter: null,
	callback_exit: null,
	callback_reveal: null,
	callback_loaded: null,
	callback_error: null,
	callback_finish: null,
	use_native: false
};

var getInstanceSettings = customSettings => {
	return Object.assign({}, defaultSettings, customSettings);
};

/* Creates instance and notifies it through the window element */
const createInstance = function(classObj, options) {
	var event;
	let eventString = "LazyLoad::Initialized";
	let instance = new classObj(options);
	try {
		// Works in modern browsers
		event = new CustomEvent(eventString, { detail: { instance } });
	} catch (err) {
		// Works in Internet Explorer (all versions)
		event = document.createEvent("CustomEvent");
		event.initCustomEvent(eventString, false, false, { instance });
	}
	window.dispatchEvent(event);
};

/* Auto initialization of one or more instances of lazyload, depending on the 
    options passed in (plain object or an array) */
function autoInitialize(classObj, options) {
	if (!options) {
		return;
	}
	if (!options.length) {
		// Plain object
		createInstance(classObj, options);
	} else {
		// Array of objects
		for (let i = 0, optionsItem; (optionsItem = options[i]); i += 1) {
			createInstance(classObj, optionsItem);
		}
	}
}

const dataPrefix = "data-";
const processedDataName = "was-processed";
const timeoutDataName = "ll-timeout";
const trueString = "true";

const getData = (element, attribute) => {
	return element.getAttribute(dataPrefix + attribute);
};

const setData = (element, attribute, value) => {
	var attrName = dataPrefix + attribute;
	if (value === null) {
		element.removeAttribute(attrName);
		return;
	}
	element.setAttribute(attrName, value);
};

const resetWasProcessedData = element =>
	setData(element, processedDataName, null);

const setWasProcessedData = element =>
	setData(element, processedDataName, trueString);

const getWasProcessedData = element =>
	getData(element, processedDataName) === trueString;

const setTimeoutData = (element, value) =>
	setData(element, timeoutDataName, value);

const getTimeoutData = element => getData(element, timeoutDataName);

const purgeProcessedElements = elements => {
	return elements.filter(element => !getWasProcessedData(element));
};

const purgeOneElement = (elements, elementToPurge) => {
	return elements.filter(element => element !== elementToPurge);
};

const safeCallback = (callback, arg1, arg2, arg3) => {
	if (!callback) {
		return;
	}

	if (arg3 !== undefined) {
		callback(arg1, arg2, arg3);
		return;
	}
	if (arg2 !== undefined) {
		callback(arg1, arg2);
		return;
	}
	callback(arg1);
};

const updateLoadingCount = (instance, plusMinus) => {
    instance.loadingCount += plusMinus;
    if (instance._elements.length === 0 && instance.loadingCount === 0) {
        safeCallback(instance._settings.callback_finish, instance);
    }
};

const getSourceTags = parentTag => {
	let sourceTags = [];
	for (let i = 0, childTag; (childTag = parentTag.children[i]); i += 1) {
		if (childTag.tagName === "SOURCE") {
			sourceTags.push(childTag);
		}
	}
	return sourceTags;
};

const setAttributeIfValue = (element, attrName, value) => {
	if (!value) {
		return;
	}
	element.setAttribute(attrName, value);
};

const setImageAttributes = (element, settings) => {
	setAttributeIfValue(
		element,
		"sizes",
		getData(element, settings.data_sizes)
	);
	setAttributeIfValue(
		element,
		"srcset",
		getData(element, settings.data_srcset)
	);
	setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

const setSourcesImg = (element, settings) => {
	const parent = element.parentNode;

	if (parent && parent.tagName === "PICTURE") {
		let sourceTags = getSourceTags(parent);
		sourceTags.forEach(sourceTag => {
			setImageAttributes(sourceTag, settings);
		});
	}

	setImageAttributes(element, settings);
};

const setSourcesIframe = (element, settings) => {
	setAttributeIfValue(element, "src", getData(element, settings.data_src));
};

const setSourcesVideo = (element, settings) => {
	let sourceTags = getSourceTags(element);
	sourceTags.forEach(sourceTag => {
		setAttributeIfValue(
			sourceTag,
			"src",
			getData(sourceTag, settings.data_src)
		);
	});
	setAttributeIfValue(
		element,
		"poster",
		getData(element, settings.data_poster)
	);
	setAttributeIfValue(element, "src", getData(element, settings.data_src));
	element.load();
};

const setSourcesBgImage = (element, settings) => {
	const srcDataValue = getData(element, settings.data_src);
	const bgDataValue = getData(element, settings.data_bg);

	if (srcDataValue) {
		element.style.backgroundImage = `url("${srcDataValue}")`;
	}

	if (bgDataValue) {
		element.style.backgroundImage = bgDataValue;
	}
};

const setSourcesFunctions = {
	IMG: setSourcesImg,
	IFRAME: setSourcesIframe,
	VIDEO: setSourcesVideo
};

const setSources = (element, instance) => {
	const settings = instance._settings;
	const tagName = element.tagName;
	const setSourcesFunction = setSourcesFunctions[tagName];
	if (setSourcesFunction) {
		setSourcesFunction(element, settings);
		updateLoadingCount(instance, 1);
		instance._elements = purgeOneElement(instance._elements, element);
		return;
	}
	setSourcesBgImage(element, settings);
};

const addClass = (element, className) => {
	if (supportsClassList) {
		element.classList.add(className);
		return;
	}
	element.className += (element.className ? " " : "") + className;
};

const removeClass = (element, className) => {
	if (supportsClassList) {
		element.classList.remove(className);
		return;
	}
	element.className = element.className.
		replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ").
		replace(/^\s+/, "").
		replace(/\s+$/, "");
};

const genericLoadEventName = "load";
const mediaLoadEventName = "loadeddata";
const errorEventName = "error";

const addEventListener = (element, eventName, handler) => {
	element.addEventListener(eventName, handler);
};

const removeEventListener = (element, eventName, handler) => {
	element.removeEventListener(eventName, handler);
};

const addEventListeners = (element, loadHandler, errorHandler) => {
	addEventListener(element, genericLoadEventName, loadHandler);
	addEventListener(element, mediaLoadEventName, loadHandler);
	addEventListener(element, errorEventName, errorHandler);
};

const removeEventListeners = (element, loadHandler, errorHandler) => {
	removeEventListener(element, genericLoadEventName, loadHandler);
	removeEventListener(element, mediaLoadEventName, loadHandler);
	removeEventListener(element, errorEventName, errorHandler);
};

const eventHandler = function(event, success, instance) {
	var settings = instance._settings;
	const className = success ? settings.class_loaded : settings.class_error;
	const callback = success
		? settings.callback_loaded
		: settings.callback_error;
	const element = event.target;

	removeClass(element, settings.class_loading);
	addClass(element, className);
	safeCallback(callback, element, instance);

	updateLoadingCount(instance, -1);
};

const addOneShotEventListeners = (element, instance) => {
	const loadHandler = event => {
		eventHandler(event, true, instance);
		removeEventListeners(element, loadHandler, errorHandler);
	};
	const errorHandler = event => {
		eventHandler(event, false, instance);
		removeEventListeners(element, loadHandler, errorHandler);
	};
	addEventListeners(element, loadHandler, errorHandler);
};

const managedTags = ["IMG", "IFRAME", "VIDEO"];

const onEnter = (element, entry, instance) => {
	const settings = instance._settings;
	safeCallback(settings.callback_enter, element, entry, instance);
	if (!settings.load_delay) {
		revealAndUnobserve(element, instance);
		return;
	}
	delayLoad(element, instance);
};

const revealAndUnobserve = (element, instance) => {
	var observer = instance._observer;
	revealElement(element, instance);
	if (observer && instance._settings.auto_unobserve) {
		observer.unobserve(element);
	}
};

const onExit = (element, entry, instance) => {
	const settings = instance._settings;
	safeCallback(settings.callback_exit, element, entry, instance);
	if (!settings.load_delay) {
		return;
	}
	cancelDelayLoad(element);
};

const cancelDelayLoad = element => {
	var timeoutId = getTimeoutData(element);
	if (!timeoutId) {
		return; // do nothing if timeout doesn't exist
	}
	clearTimeout(timeoutId);
	setTimeoutData(element, null);
};

const delayLoad = (element, instance) => {
	var loadDelay = instance._settings.load_delay;
	var timeoutId = getTimeoutData(element);
	if (timeoutId) {
		return; // do nothing if timeout already set
	}
	timeoutId = setTimeout(function() {
		revealAndUnobserve(element, instance);
		cancelDelayLoad(element);
	}, loadDelay);
	setTimeoutData(element, timeoutId);
};

const revealElement = (element, instance, force) => {
	var settings = instance._settings;
	if (!force && getWasProcessedData(element)) {
		return; // element has already been processed and force wasn't true
	}
	if (managedTags.indexOf(element.tagName) > -1) {
		addOneShotEventListeners(element, instance);
		addClass(element, settings.class_loading);
	}
	setSources(element, instance);
	setWasProcessedData(element);
	safeCallback(settings.callback_reveal, element, instance);
	safeCallback(settings.callback_set, element, instance);
};

const isIntersecting = entry =>
	entry.isIntersecting || entry.intersectionRatio > 0;

const getObserverSettings = settings => ({
	root: settings.container === document ? null : settings.container,
	rootMargin: settings.thresholds || settings.threshold + "px"
});

const setObserver = instance => {
	if (!supportsIntersectionObserver) {
		return false;
	}
	instance._observer = new IntersectionObserver(entries => {
		entries.forEach(entry =>
			isIntersecting(entry)
				? onEnter(entry.target, entry, instance)
				: onExit(entry.target, entry, instance)
		);
	}, getObserverSettings(instance._settings));
	return true;
};

const nativeLazyTags = ["IMG", "IFRAME"];

const shouldUseNative = settings =>
	settings.use_native && "loading" in HTMLImageElement.prototype;

const loadAllNative = instance => {
	instance._elements.forEach(element => {
		if (nativeLazyTags.indexOf(element.tagName) === -1) {
			return;
		}
		element.setAttribute("loading", "lazy");
		revealElement(element, instance);
	});
};

const nodeSetToArray = nodeSet => Array.prototype.slice.call(nodeSet);

const queryElements = settings =>
	settings.container.querySelectorAll(settings.elements_selector);

const getElements = (elements, settings) =>
	purgeProcessedElements(nodeSetToArray(elements || queryElements(settings)));

const retryLazyLoad = instance => {
	var settings = instance._settings;
	var errorElements = settings.container.querySelectorAll(
		"." + settings.class_error
	);
	errorElements.forEach(element => {
		removeClass(element, settings.class_error);
		resetWasProcessedData(element);
	});
	instance.update();
};

const setOnlineCheck = instance => {
	if (!runningOnBrowser) {
		return;
	}
	window.addEventListener("online", event => {
		retryLazyLoad(instance);
	});
};

const LazyLoad = function(customSettings, elements) {
    this._settings = getInstanceSettings(customSettings);
    this.loadingCount = 0;
    setObserver(this);
    this.update(elements);
    setOnlineCheck(this);
};

LazyLoad.prototype = {
    update: function(elements) {
        var settings = this._settings;
        this._elements = getElements(elements, settings);
        if (isBot || !this._observer) {
            this.loadAll();
            return;
        }
        if (shouldUseNative(settings)) {
            loadAllNative(this);
            this._elements = getElements(elements, settings);
        }
        this._elements.forEach(element => {
            this._observer.observe(element);
        });
    },

    destroy: function() {
        if (this._observer) {
            this._elements.forEach(element => {
                this._observer.unobserve(element);
            });
            this._observer = null;
        }
        this._elements = null;
        this._settings = null;
    },

    load: function(element, force) {
        revealElement(element, this, force);
    },

    loadAll: function() {
        this._elements.forEach(element => {
            revealAndUnobserve(element, this);
        });
    }
};

/* Automatic instances creation if required (useful for async script loading) */
if (runningOnBrowser) {
    autoInitialize(LazyLoad, window.lazyLoadOptions);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LazyLoad);


/***/ }),

/***/ "./node_modules/vue-i18n/dist/vue-i18n.esm.js":
/*!****************************************************!*\
  !*** ./node_modules/vue-i18n/dist/vue-i18n.esm.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/*!
 * vue-i18n v8.20.0 
 * (c) 2020 kazuya kawaguchi
 * Released under the MIT License.
 */
/*  */

/**
 * constants
 */

var numberFormatKeys = [
  'style',
  'currency',
  'currencyDisplay',
  'useGrouping',
  'minimumIntegerDigits',
  'minimumFractionDigits',
  'maximumFractionDigits',
  'minimumSignificantDigits',
  'maximumSignificantDigits',
  'localeMatcher',
  'formatMatcher',
  'unit'
];

/**
 * utilities
 */

function warn (msg, err) {
  if (typeof console !== 'undefined') {
    console.warn('[vue-i18n] ' + msg);
    /* istanbul ignore if */
    if (err) {
      console.warn(err.stack);
    }
  }
}

function error (msg, err) {
  if (typeof console !== 'undefined') {
    console.error('[vue-i18n] ' + msg);
    /* istanbul ignore if */
    if (err) {
      console.error(err.stack);
    }
  }
}

var isArray = Array.isArray;

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isBoolean (val) {
  return typeof val === 'boolean'
}

function isString (val) {
  return typeof val === 'string'
}

var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING
}

function isNull (val) {
  return val === null || val === undefined
}

function parseArgs () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  var locale = null;
  var params = null;
  if (args.length === 1) {
    if (isObject(args[0]) || Array.isArray(args[0])) {
      params = args[0];
    } else if (typeof args[0] === 'string') {
      locale = args[0];
    }
  } else if (args.length === 2) {
    if (typeof args[0] === 'string') {
      locale = args[0];
    }
    /* istanbul ignore if */
    if (isObject(args[1]) || Array.isArray(args[1])) {
      params = args[1];
    }
  }

  return { locale: locale, params: params }
}

function looseClone (obj) {
  return JSON.parse(JSON.stringify(obj))
}

function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

function includes (arr, item) {
  return !!~arr.indexOf(item)
}

var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

function merge (target) {
  var arguments$1 = arguments;

  var output = Object(target);
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments$1[i];
    if (source !== undefined && source !== null) {
      var key = (void 0);
      for (key in source) {
        if (hasOwn(source, key)) {
          if (isObject(source[key])) {
            output[key] = merge(output[key], source[key]);
          } else {
            output[key] = source[key];
          }
        }
      }
    }
  }
  return output
}

function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/*  */

function extend (Vue) {
  if (!Vue.prototype.hasOwnProperty('$i18n')) {
    // $FlowFixMe
    Object.defineProperty(Vue.prototype, '$i18n', {
      get: function get () { return this._i18n }
    });
  }

  Vue.prototype.$t = function (key) {
    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

    var i18n = this.$i18n;
    return i18n._t.apply(i18n, [ key, i18n.locale, i18n._getMessages(), this ].concat( values ))
  };

  Vue.prototype.$tc = function (key, choice) {
    var values = [], len = arguments.length - 2;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 2 ];

    var i18n = this.$i18n;
    return i18n._tc.apply(i18n, [ key, i18n.locale, i18n._getMessages(), this, choice ].concat( values ))
  };

  Vue.prototype.$te = function (key, locale) {
    var i18n = this.$i18n;
    return i18n._te(key, i18n.locale, i18n._getMessages(), locale)
  };

  Vue.prototype.$d = function (value) {
    var ref;

    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
    return (ref = this.$i18n).d.apply(ref, [ value ].concat( args ))
  };

  Vue.prototype.$n = function (value) {
    var ref;

    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
    return (ref = this.$i18n).n.apply(ref, [ value ].concat( args ))
  };
}

/*  */

var mixin = {
  beforeCreate: function beforeCreate () {
    var options = this.$options;
    options.i18n = options.i18n || (options.__i18n ? {} : null);

    if (options.i18n) {
      if (options.i18n instanceof VueI18n) {
        // init locale messages via custom blocks
        if (options.__i18n) {
          try {
            var localeMessages = {};
            options.__i18n.forEach(function (resource) {
              localeMessages = merge(localeMessages, JSON.parse(resource));
            });
            Object.keys(localeMessages).forEach(function (locale) {
              options.i18n.mergeLocaleMessage(locale, localeMessages[locale]);
            });
          } catch (e) {
            if (true) {
              error("Cannot parse locale messages via custom blocks.", e);
            }
          }
        }
        this._i18n = options.i18n;
        this._i18nWatcher = this._i18n.watchI18nData();
      } else if (isPlainObject(options.i18n)) {
        var rootI18n = this.$root && this.$root.$i18n && this.$root.$i18n instanceof VueI18n
          ? this.$root.$i18n
          : null;
        // component local i18n
        if (rootI18n) {
          options.i18n.root = this.$root;
          options.i18n.formatter = rootI18n.formatter;
          options.i18n.fallbackLocale = rootI18n.fallbackLocale;
          options.i18n.formatFallbackMessages = rootI18n.formatFallbackMessages;
          options.i18n.silentTranslationWarn = rootI18n.silentTranslationWarn;
          options.i18n.silentFallbackWarn = rootI18n.silentFallbackWarn;
          options.i18n.pluralizationRules = rootI18n.pluralizationRules;
          options.i18n.preserveDirectiveContent = rootI18n.preserveDirectiveContent;
        }

        // init locale messages via custom blocks
        if (options.__i18n) {
          try {
            var localeMessages$1 = {};
            options.__i18n.forEach(function (resource) {
              localeMessages$1 = merge(localeMessages$1, JSON.parse(resource));
            });
            options.i18n.messages = localeMessages$1;
          } catch (e) {
            if (true) {
              warn("Cannot parse locale messages via custom blocks.", e);
            }
          }
        }

        var ref = options.i18n;
        var sharedMessages = ref.sharedMessages;
        if (sharedMessages && isPlainObject(sharedMessages)) {
          options.i18n.messages = merge(options.i18n.messages, sharedMessages);
        }

        this._i18n = new VueI18n(options.i18n);
        this._i18nWatcher = this._i18n.watchI18nData();

        if (options.i18n.sync === undefined || !!options.i18n.sync) {
          this._localeWatcher = this.$i18n.watchLocale();
        }

        if (rootI18n) {
          rootI18n.onComponentInstanceCreated(this._i18n);
        }
      } else {
        if (true) {
          warn("Cannot be interpreted 'i18n' option.");
        }
      }
    } else if (this.$root && this.$root.$i18n && this.$root.$i18n instanceof VueI18n) {
      // root i18n
      this._i18n = this.$root.$i18n;
    } else if (options.parent && options.parent.$i18n && options.parent.$i18n instanceof VueI18n) {
      // parent i18n
      this._i18n = options.parent.$i18n;
    }
  },

  beforeMount: function beforeMount () {
    var options = this.$options;
    options.i18n = options.i18n || (options.__i18n ? {} : null);

    if (options.i18n) {
      if (options.i18n instanceof VueI18n) {
        // init locale messages via custom blocks
        this._i18n.subscribeDataChanging(this);
        this._subscribing = true;
      } else if (isPlainObject(options.i18n)) {
        this._i18n.subscribeDataChanging(this);
        this._subscribing = true;
      } else {
        if (true) {
          warn("Cannot be interpreted 'i18n' option.");
        }
      }
    } else if (this.$root && this.$root.$i18n && this.$root.$i18n instanceof VueI18n) {
      this._i18n.subscribeDataChanging(this);
      this._subscribing = true;
    } else if (options.parent && options.parent.$i18n && options.parent.$i18n instanceof VueI18n) {
      this._i18n.subscribeDataChanging(this);
      this._subscribing = true;
    }
  },

  beforeDestroy: function beforeDestroy () {
    if (!this._i18n) { return }

    var self = this;
    this.$nextTick(function () {
      if (self._subscribing) {
        self._i18n.unsubscribeDataChanging(self);
        delete self._subscribing;
      }

      if (self._i18nWatcher) {
        self._i18nWatcher();
        self._i18n.destroyVM();
        delete self._i18nWatcher;
      }

      if (self._localeWatcher) {
        self._localeWatcher();
        delete self._localeWatcher;
      }
    });
  }
};

/*  */

var interpolationComponent = {
  name: 'i18n',
  functional: true,
  props: {
    tag: {
      type: [String, Boolean, Object],
      default: 'span'
    },
    path: {
      type: String,
      required: true
    },
    locale: {
      type: String
    },
    places: {
      type: [Array, Object]
    }
  },
  render: function render (h, ref) {
    var data = ref.data;
    var parent = ref.parent;
    var props = ref.props;
    var slots = ref.slots;

    var $i18n = parent.$i18n;
    if (!$i18n) {
      if (true) {
        warn('Cannot find VueI18n instance!');
      }
      return
    }

    var path = props.path;
    var locale = props.locale;
    var places = props.places;
    var params = slots();
    var children = $i18n.i(
      path,
      locale,
      onlyHasDefaultPlace(params) || places
        ? useLegacyPlaces(params.default, places)
        : params
    );

    var tag = (!!props.tag && props.tag !== true) || props.tag === false ? props.tag : 'span';
    return tag ? h(tag, data, children) : children
  }
};

function onlyHasDefaultPlace (params) {
  var prop;
  for (prop in params) {
    if (prop !== 'default') { return false }
  }
  return Boolean(prop)
}

function useLegacyPlaces (children, places) {
  var params = places ? createParamsFromPlaces(places) : {};

  if (!children) { return params }

  // Filter empty text nodes
  children = children.filter(function (child) {
    return child.tag || child.text.trim() !== ''
  });

  var everyPlace = children.every(vnodeHasPlaceAttribute);
  if ( true && everyPlace) {
    warn('`place` attribute is deprecated in next major version. Please switch to Vue slots.');
  }

  return children.reduce(
    everyPlace ? assignChildPlace : assignChildIndex,
    params
  )
}

function createParamsFromPlaces (places) {
  if (true) {
    warn('`places` prop is deprecated in next major version. Please switch to Vue slots.');
  }

  return Array.isArray(places)
    ? places.reduce(assignChildIndex, {})
    : Object.assign({}, places)
}

function assignChildPlace (params, child) {
  if (child.data && child.data.attrs && child.data.attrs.place) {
    params[child.data.attrs.place] = child;
  }
  return params
}

function assignChildIndex (params, child, index) {
  params[index] = child;
  return params
}

function vnodeHasPlaceAttribute (vnode) {
  return Boolean(vnode.data && vnode.data.attrs && vnode.data.attrs.place)
}

/*  */

var numberComponent = {
  name: 'i18n-n',
  functional: true,
  props: {
    tag: {
      type: [String, Boolean, Object],
      default: 'span'
    },
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    },
    locale: {
      type: String
    }
  },
  render: function render (h, ref) {
    var props = ref.props;
    var parent = ref.parent;
    var data = ref.data;

    var i18n = parent.$i18n;

    if (!i18n) {
      if (true) {
        warn('Cannot find VueI18n instance!');
      }
      return null
    }

    var key = null;
    var options = null;

    if (isString(props.format)) {
      key = props.format;
    } else if (isObject(props.format)) {
      if (props.format.key) {
        key = props.format.key;
      }

      // Filter out number format options only
      options = Object.keys(props.format).reduce(function (acc, prop) {
        var obj;

        if (includes(numberFormatKeys, prop)) {
          return Object.assign({}, acc, ( obj = {}, obj[prop] = props.format[prop], obj ))
        }
        return acc
      }, null);
    }

    var locale = props.locale || i18n.locale;
    var parts = i18n._ntp(props.value, locale, key, options);

    var values = parts.map(function (part, index) {
      var obj;

      var slot = data.scopedSlots && data.scopedSlots[part.type];
      return slot ? slot(( obj = {}, obj[part.type] = part.value, obj.index = index, obj.parts = parts, obj )) : part.value
    });

    var tag = (!!props.tag && props.tag !== true) || props.tag === false ? props.tag : 'span';
    return tag
      ? h(tag, {
        attrs: data.attrs,
        'class': data['class'],
        staticClass: data.staticClass
      }, values)
      : values
  }
};

/*  */

function bind (el, binding, vnode) {
  if (!assert(el, vnode)) { return }

  t(el, binding, vnode);
}

function update (el, binding, vnode, oldVNode) {
  if (!assert(el, vnode)) { return }

  var i18n = vnode.context.$i18n;
  if (localeEqual(el, vnode) &&
    (looseEqual(binding.value, binding.oldValue) &&
     looseEqual(el._localeMessage, i18n.getLocaleMessage(i18n.locale)))) { return }

  t(el, binding, vnode);
}

function unbind (el, binding, vnode, oldVNode) {
  var vm = vnode.context;
  if (!vm) {
    warn('Vue instance does not exists in VNode context');
    return
  }

  var i18n = vnode.context.$i18n || {};
  if (!binding.modifiers.preserve && !i18n.preserveDirectiveContent) {
    el.textContent = '';
  }
  el._vt = undefined;
  delete el['_vt'];
  el._locale = undefined;
  delete el['_locale'];
  el._localeMessage = undefined;
  delete el['_localeMessage'];
}

function assert (el, vnode) {
  var vm = vnode.context;
  if (!vm) {
    warn('Vue instance does not exists in VNode context');
    return false
  }

  if (!vm.$i18n) {
    warn('VueI18n instance does not exists in Vue instance');
    return false
  }

  return true
}

function localeEqual (el, vnode) {
  var vm = vnode.context;
  return el._locale === vm.$i18n.locale
}

function t (el, binding, vnode) {
  var ref$1, ref$2;

  var value = binding.value;

  var ref = parseValue(value);
  var path = ref.path;
  var locale = ref.locale;
  var args = ref.args;
  var choice = ref.choice;
  if (!path && !locale && !args) {
    warn('value type not supported');
    return
  }

  if (!path) {
    warn('`path` is required in v-t directive');
    return
  }

  var vm = vnode.context;
  if (choice != null) {
    el._vt = el.textContent = (ref$1 = vm.$i18n).tc.apply(ref$1, [ path, choice ].concat( makeParams(locale, args) ));
  } else {
    el._vt = el.textContent = (ref$2 = vm.$i18n).t.apply(ref$2, [ path ].concat( makeParams(locale, args) ));
  }
  el._locale = vm.$i18n.locale;
  el._localeMessage = vm.$i18n.getLocaleMessage(vm.$i18n.locale);
}

function parseValue (value) {
  var path;
  var locale;
  var args;
  var choice;

  if (isString(value)) {
    path = value;
  } else if (isPlainObject(value)) {
    path = value.path;
    locale = value.locale;
    args = value.args;
    choice = value.choice;
  }

  return { path: path, locale: locale, args: args, choice: choice }
}

function makeParams (locale, args) {
  var params = [];

  locale && params.push(locale);
  if (args && (Array.isArray(args) || isPlainObject(args))) {
    params.push(args);
  }

  return params
}

var Vue;

function install (_Vue) {
  /* istanbul ignore if */
  if ( true && install.installed && _Vue === Vue) {
    warn('already installed.');
    return
  }
  install.installed = true;

  Vue = _Vue;

  var version = (Vue.version && Number(Vue.version.split('.')[0])) || -1;
  /* istanbul ignore if */
  if ( true && version < 2) {
    warn(("vue-i18n (" + (install.version) + ") need to use Vue 2.0 or later (Vue: " + (Vue.version) + ")."));
    return
  }

  extend(Vue);
  Vue.mixin(mixin);
  Vue.directive('t', { bind: bind, update: update, unbind: unbind });
  Vue.component(interpolationComponent.name, interpolationComponent);
  Vue.component(numberComponent.name, numberComponent);

  // use simple mergeStrategies to prevent i18n instance lose '__proto__'
  var strats = Vue.config.optionMergeStrategies;
  strats.i18n = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal
  };
}

/*  */

var BaseFormatter = function BaseFormatter () {
  this._caches = Object.create(null);
};

BaseFormatter.prototype.interpolate = function interpolate (message, values) {
  if (!values) {
    return [message]
  }
  var tokens = this._caches[message];
  if (!tokens) {
    tokens = parse(message);
    this._caches[message] = tokens;
  }
  return compile(tokens, values)
};



var RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
var RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;

function parse (format) {
  var tokens = [];
  var position = 0;

  var text = '';
  while (position < format.length) {
    var char = format[position++];
    if (char === '{') {
      if (text) {
        tokens.push({ type: 'text', value: text });
      }

      text = '';
      var sub = '';
      char = format[position++];
      while (char !== undefined && char !== '}') {
        sub += char;
        char = format[position++];
      }
      var isClosed = char === '}';

      var type = RE_TOKEN_LIST_VALUE.test(sub)
        ? 'list'
        : isClosed && RE_TOKEN_NAMED_VALUE.test(sub)
          ? 'named'
          : 'unknown';
      tokens.push({ value: sub, type: type });
    } else if (char === '%') {
      // when found rails i18n syntax, skip text capture
      if (format[(position)] !== '{') {
        text += char;
      }
    } else {
      text += char;
    }
  }

  text && tokens.push({ type: 'text', value: text });

  return tokens
}

function compile (tokens, values) {
  var compiled = [];
  var index = 0;

  var mode = Array.isArray(values)
    ? 'list'
    : isObject(values)
      ? 'named'
      : 'unknown';
  if (mode === 'unknown') { return compiled }

  while (index < tokens.length) {
    var token = tokens[index];
    switch (token.type) {
      case 'text':
        compiled.push(token.value);
        break
      case 'list':
        compiled.push(values[parseInt(token.value, 10)]);
        break
      case 'named':
        if (mode === 'named') {
          compiled.push((values)[token.value]);
        } else {
          if (true) {
            warn(("Type of token '" + (token.type) + "' and format of value '" + mode + "' don't match!"));
          }
        }
        break
      case 'unknown':
        if (true) {
          warn("Detect 'unknown' type of token!");
        }
        break
    }
    index++;
  }

  return compiled
}

/*  */

/**
 *  Path parser
 *  - Inspired:
 *    Vue.js Path parser
 */

// actions
var APPEND = 0;
var PUSH = 1;
var INC_SUB_PATH_DEPTH = 2;
var PUSH_SUB_PATH = 3;

// states
var BEFORE_PATH = 0;
var IN_PATH = 1;
var BEFORE_IDENT = 2;
var IN_IDENT = 3;
var IN_SUB_PATH = 4;
var IN_SINGLE_QUOTE = 5;
var IN_DOUBLE_QUOTE = 6;
var AFTER_PATH = 7;
var ERROR = 8;

var pathStateMachine = [];

pathStateMachine[BEFORE_PATH] = {
  'ws': [BEFORE_PATH],
  'ident': [IN_IDENT, APPEND],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[IN_PATH] = {
  'ws': [IN_PATH],
  '.': [BEFORE_IDENT],
  '[': [IN_SUB_PATH],
  'eof': [AFTER_PATH]
};

pathStateMachine[BEFORE_IDENT] = {
  'ws': [BEFORE_IDENT],
  'ident': [IN_IDENT, APPEND],
  '0': [IN_IDENT, APPEND],
  'number': [IN_IDENT, APPEND]
};

pathStateMachine[IN_IDENT] = {
  'ident': [IN_IDENT, APPEND],
  '0': [IN_IDENT, APPEND],
  'number': [IN_IDENT, APPEND],
  'ws': [IN_PATH, PUSH],
  '.': [BEFORE_IDENT, PUSH],
  '[': [IN_SUB_PATH, PUSH],
  'eof': [AFTER_PATH, PUSH]
};

pathStateMachine[IN_SUB_PATH] = {
  "'": [IN_SINGLE_QUOTE, APPEND],
  '"': [IN_DOUBLE_QUOTE, APPEND],
  '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
  ']': [IN_PATH, PUSH_SUB_PATH],
  'eof': ERROR,
  'else': [IN_SUB_PATH, APPEND]
};

pathStateMachine[IN_SINGLE_QUOTE] = {
  "'": [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_SINGLE_QUOTE, APPEND]
};

pathStateMachine[IN_DOUBLE_QUOTE] = {
  '"': [IN_SUB_PATH, APPEND],
  'eof': ERROR,
  'else': [IN_DOUBLE_QUOTE, APPEND]
};

/**
 * Check if an expression is a literal value.
 */

var literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral (exp) {
  return literalValueRE.test(exp)
}

/**
 * Strip quotes from a string
 */

function stripQuotes (str) {
  var a = str.charCodeAt(0);
  var b = str.charCodeAt(str.length - 1);
  return a === b && (a === 0x22 || a === 0x27)
    ? str.slice(1, -1)
    : str
}

/**
 * Determine the type of a character in a keypath.
 */

function getPathCharType (ch) {
  if (ch === undefined || ch === null) { return 'eof' }

  var code = ch.charCodeAt(0);

  switch (code) {
    case 0x5B: // [
    case 0x5D: // ]
    case 0x2E: // .
    case 0x22: // "
    case 0x27: // '
      return ch

    case 0x5F: // _
    case 0x24: // $
    case 0x2D: // -
      return 'ident'

    case 0x09: // Tab
    case 0x0A: // Newline
    case 0x0D: // Return
    case 0xA0:  // No-break space
    case 0xFEFF:  // Byte Order Mark
    case 0x2028:  // Line Separator
    case 0x2029:  // Paragraph Separator
      return 'ws'
  }

  return 'ident'
}

/**
 * Format a subPath, return its plain form if it is
 * a literal string or number. Otherwise prepend the
 * dynamic indicator (*).
 */

function formatSubPath (path) {
  var trimmed = path.trim();
  // invalid leading 0
  if (path.charAt(0) === '0' && isNaN(path)) { return false }

  return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed
}

/**
 * Parse a string path into an array of segments
 */

function parse$1 (path) {
  var keys = [];
  var index = -1;
  var mode = BEFORE_PATH;
  var subPathDepth = 0;
  var c;
  var key;
  var newChar;
  var type;
  var transition;
  var action;
  var typeMap;
  var actions = [];

  actions[PUSH] = function () {
    if (key !== undefined) {
      keys.push(key);
      key = undefined;
    }
  };

  actions[APPEND] = function () {
    if (key === undefined) {
      key = newChar;
    } else {
      key += newChar;
    }
  };

  actions[INC_SUB_PATH_DEPTH] = function () {
    actions[APPEND]();
    subPathDepth++;
  };

  actions[PUSH_SUB_PATH] = function () {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = IN_SUB_PATH;
      actions[APPEND]();
    } else {
      subPathDepth = 0;
      if (key === undefined) { return false }
      key = formatSubPath(key);
      if (key === false) {
        return false
      } else {
        actions[PUSH]();
      }
    }
  };

  function maybeUnescapeQuote () {
    var nextChar = path[index + 1];
    if ((mode === IN_SINGLE_QUOTE && nextChar === "'") ||
      (mode === IN_DOUBLE_QUOTE && nextChar === '"')) {
      index++;
      newChar = '\\' + nextChar;
      actions[APPEND]();
      return true
    }
  }

  while (mode !== null) {
    index++;
    c = path[index];

    if (c === '\\' && maybeUnescapeQuote()) {
      continue
    }

    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap['else'] || ERROR;

    if (transition === ERROR) {
      return // parse error
    }

    mode = transition[0];
    action = actions[transition[1]];
    if (action) {
      newChar = transition[2];
      newChar = newChar === undefined
        ? c
        : newChar;
      if (action() === false) {
        return
      }
    }

    if (mode === AFTER_PATH) {
      return keys
    }
  }
}





var I18nPath = function I18nPath () {
  this._cache = Object.create(null);
};

/**
 * External parse that check for a cache hit first
 */
I18nPath.prototype.parsePath = function parsePath (path) {
  var hit = this._cache[path];
  if (!hit) {
    hit = parse$1(path);
    if (hit) {
      this._cache[path] = hit;
    }
  }
  return hit || []
};

/**
 * Get path value from path string
 */
I18nPath.prototype.getPathValue = function getPathValue (obj, path) {
  if (!isObject(obj)) { return null }

  var paths = this.parsePath(path);
  if (paths.length === 0) {
    return null
  } else {
    var length = paths.length;
    var last = obj;
    var i = 0;
    while (i < length) {
      var value = last[paths[i]];
      if (value === undefined) {
        return null
      }
      last = value;
      i++;
    }

    return last
  }
};

/*  */



var htmlTagMatcher = /<\/?[\w\s="/.':;#-\/]+>/;
var linkKeyMatcher = /(?:@(?:\.[a-z]+)?:(?:[\w\-_|.]+|\([\w\-_|.]+\)))/g;
var linkKeyPrefixMatcher = /^@(?:\.([a-z]+))?:/;
var bracketsMatcher = /[()]/g;
var defaultModifiers = {
  'upper': function (str) { return str.toLocaleUpperCase(); },
  'lower': function (str) { return str.toLocaleLowerCase(); },
  'capitalize': function (str) { return ("" + (str.charAt(0).toLocaleUpperCase()) + (str.substr(1))); }
};

var defaultFormatter = new BaseFormatter();

var VueI18n = function VueI18n (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #290
  /* istanbul ignore if */
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  var locale = options.locale || 'en-US';
  var fallbackLocale = options.fallbackLocale === false
    ? false
    : options.fallbackLocale || 'en-US';
  var messages = options.messages || {};
  var dateTimeFormats = options.dateTimeFormats || {};
  var numberFormats = options.numberFormats || {};

  this._vm = null;
  this._formatter = options.formatter || defaultFormatter;
  this._modifiers = options.modifiers || {};
  this._missing = options.missing || null;
  this._root = options.root || null;
  this._sync = options.sync === undefined ? true : !!options.sync;
  this._fallbackRoot = options.fallbackRoot === undefined
    ? true
    : !!options.fallbackRoot;
  this._formatFallbackMessages = options.formatFallbackMessages === undefined
    ? false
    : !!options.formatFallbackMessages;
  this._silentTranslationWarn = options.silentTranslationWarn === undefined
    ? false
    : options.silentTranslationWarn;
  this._silentFallbackWarn = options.silentFallbackWarn === undefined
    ? false
    : !!options.silentFallbackWarn;
  this._dateTimeFormatters = {};
  this._numberFormatters = {};
  this._path = new I18nPath();
  this._dataListeners = [];
  this._componentInstanceCreatedListener = options.componentInstanceCreatedListener || null;
  this._preserveDirectiveContent = options.preserveDirectiveContent === undefined
    ? false
    : !!options.preserveDirectiveContent;
  this.pluralizationRules = options.pluralizationRules || {};
  this._warnHtmlInMessage = options.warnHtmlInMessage || 'off';
  this._postTranslation = options.postTranslation || null;

  /**
   * @param choice {number} a choice index given by the input to $tc: `$tc('path.to.rule', choiceIndex)`
   * @param choicesLength {number} an overall amount of available choices
   * @returns a final choice index
  */
  this.getChoiceIndex = function (choice, choicesLength) {
    var thisPrototype = Object.getPrototypeOf(this$1);
    if (thisPrototype && thisPrototype.getChoiceIndex) {
      var prototypeGetChoiceIndex = (thisPrototype.getChoiceIndex);
      return (prototypeGetChoiceIndex).call(this$1, choice, choicesLength)
    }

    // Default (old) getChoiceIndex implementation - english-compatible
    var defaultImpl = function (_choice, _choicesLength) {
      _choice = Math.abs(_choice);

      if (_choicesLength === 2) {
        return _choice
          ? _choice > 1
            ? 1
            : 0
          : 1
      }

      return _choice ? Math.min(_choice, 2) : 0
    };

    if (this$1.locale in this$1.pluralizationRules) {
      return this$1.pluralizationRules[this$1.locale].apply(this$1, [choice, choicesLength])
    } else {
      return defaultImpl(choice, choicesLength)
    }
  };


  this._exist = function (message, key) {
    if (!message || !key) { return false }
    if (!isNull(this$1._path.getPathValue(message, key))) { return true }
    // fallback for flat key
    if (message[key]) { return true }
    return false
  };

  if (this._warnHtmlInMessage === 'warn' || this._warnHtmlInMessage === 'error') {
    Object.keys(messages).forEach(function (locale) {
      this$1._checkLocaleMessage(locale, this$1._warnHtmlInMessage, messages[locale]);
    });
  }

  this._initVM({
    locale: locale,
    fallbackLocale: fallbackLocale,
    messages: messages,
    dateTimeFormats: dateTimeFormats,
    numberFormats: numberFormats
  });
};

var prototypeAccessors = { vm: { configurable: true },messages: { configurable: true },dateTimeFormats: { configurable: true },numberFormats: { configurable: true },availableLocales: { configurable: true },locale: { configurable: true },fallbackLocale: { configurable: true },formatFallbackMessages: { configurable: true },missing: { configurable: true },formatter: { configurable: true },silentTranslationWarn: { configurable: true },silentFallbackWarn: { configurable: true },preserveDirectiveContent: { configurable: true },warnHtmlInMessage: { configurable: true },postTranslation: { configurable: true } };

VueI18n.prototype._checkLocaleMessage = function _checkLocaleMessage (locale, level, message) {
  var paths = [];

  var fn = function (level, locale, message, paths) {
    if (isPlainObject(message)) {
      Object.keys(message).forEach(function (key) {
        var val = message[key];
        if (isPlainObject(val)) {
          paths.push(key);
          paths.push('.');
          fn(level, locale, val, paths);
          paths.pop();
          paths.pop();
        } else {
          paths.push(key);
          fn(level, locale, val, paths);
          paths.pop();
        }
      });
    } else if (Array.isArray(message)) {
      message.forEach(function (item, index) {
        if (isPlainObject(item)) {
          paths.push(("[" + index + "]"));
          paths.push('.');
          fn(level, locale, item, paths);
          paths.pop();
          paths.pop();
        } else {
          paths.push(("[" + index + "]"));
          fn(level, locale, item, paths);
          paths.pop();
        }
      });
    } else if (isString(message)) {
      var ret = htmlTagMatcher.test(message);
      if (ret) {
        var msg = "Detected HTML in message '" + message + "' of keypath '" + (paths.join('')) + "' at '" + locale + "'. Consider component interpolation with '<i18n>' to avoid XSS. See https://bit.ly/2ZqJzkp";
        if (level === 'warn') {
          warn(msg);
        } else if (level === 'error') {
          error(msg);
        }
      }
    }
  };

  fn(level, locale, message, paths);
};

VueI18n.prototype._initVM = function _initVM (data) {
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  this._vm = new Vue({ data: data });
  Vue.config.silent = silent;
};

VueI18n.prototype.destroyVM = function destroyVM () {
  this._vm.$destroy();
};

VueI18n.prototype.subscribeDataChanging = function subscribeDataChanging (vm) {
  this._dataListeners.push(vm);
};

VueI18n.prototype.unsubscribeDataChanging = function unsubscribeDataChanging (vm) {
  remove(this._dataListeners, vm);
};

VueI18n.prototype.watchI18nData = function watchI18nData () {
  var self = this;
  return this._vm.$watch('$data', function () {
    var i = self._dataListeners.length;
    while (i--) {
      Vue.nextTick(function () {
        self._dataListeners[i] && self._dataListeners[i].$forceUpdate();
      });
    }
  }, { deep: true })
};

VueI18n.prototype.watchLocale = function watchLocale () {
  /* istanbul ignore if */
  if (!this._sync || !this._root) { return null }
  var target = this._vm;
  return this._root.$i18n.vm.$watch('locale', function (val) {
    target.$set(target, 'locale', val);
    target.$forceUpdate();
  }, { immediate: true })
};

VueI18n.prototype.onComponentInstanceCreated = function onComponentInstanceCreated (newI18n) {
  if (this._componentInstanceCreatedListener) {
    this._componentInstanceCreatedListener(newI18n, this);
  }
};

prototypeAccessors.vm.get = function () { return this._vm };

prototypeAccessors.messages.get = function () { return looseClone(this._getMessages()) };
prototypeAccessors.dateTimeFormats.get = function () { return looseClone(this._getDateTimeFormats()) };
prototypeAccessors.numberFormats.get = function () { return looseClone(this._getNumberFormats()) };
prototypeAccessors.availableLocales.get = function () { return Object.keys(this.messages).sort() };

prototypeAccessors.locale.get = function () { return this._vm.locale };
prototypeAccessors.locale.set = function (locale) {
  this._vm.$set(this._vm, 'locale', locale);
};

prototypeAccessors.fallbackLocale.get = function () { return this._vm.fallbackLocale };
prototypeAccessors.fallbackLocale.set = function (locale) {
  this._localeChainCache = {};
  this._vm.$set(this._vm, 'fallbackLocale', locale);
};

prototypeAccessors.formatFallbackMessages.get = function () { return this._formatFallbackMessages };
prototypeAccessors.formatFallbackMessages.set = function (fallback) { this._formatFallbackMessages = fallback; };

prototypeAccessors.missing.get = function () { return this._missing };
prototypeAccessors.missing.set = function (handler) { this._missing = handler; };

prototypeAccessors.formatter.get = function () { return this._formatter };
prototypeAccessors.formatter.set = function (formatter) { this._formatter = formatter; };

prototypeAccessors.silentTranslationWarn.get = function () { return this._silentTranslationWarn };
prototypeAccessors.silentTranslationWarn.set = function (silent) { this._silentTranslationWarn = silent; };

prototypeAccessors.silentFallbackWarn.get = function () { return this._silentFallbackWarn };
prototypeAccessors.silentFallbackWarn.set = function (silent) { this._silentFallbackWarn = silent; };

prototypeAccessors.preserveDirectiveContent.get = function () { return this._preserveDirectiveContent };
prototypeAccessors.preserveDirectiveContent.set = function (preserve) { this._preserveDirectiveContent = preserve; };

prototypeAccessors.warnHtmlInMessage.get = function () { return this._warnHtmlInMessage };
prototypeAccessors.warnHtmlInMessage.set = function (level) {
    var this$1 = this;

  var orgLevel = this._warnHtmlInMessage;
  this._warnHtmlInMessage = level;
  if (orgLevel !== level && (level === 'warn' || level === 'error')) {
    var messages = this._getMessages();
    Object.keys(messages).forEach(function (locale) {
      this$1._checkLocaleMessage(locale, this$1._warnHtmlInMessage, messages[locale]);
    });
  }
};

prototypeAccessors.postTranslation.get = function () { return this._postTranslation };
prototypeAccessors.postTranslation.set = function (handler) { this._postTranslation = handler; };

VueI18n.prototype._getMessages = function _getMessages () { return this._vm.messages };
VueI18n.prototype._getDateTimeFormats = function _getDateTimeFormats () { return this._vm.dateTimeFormats };
VueI18n.prototype._getNumberFormats = function _getNumberFormats () { return this._vm.numberFormats };

VueI18n.prototype._warnDefault = function _warnDefault (locale, key, result, vm, values, interpolateMode) {
  if (!isNull(result)) { return result }
  if (this._missing) {
    var missingRet = this._missing.apply(null, [locale, key, vm, values]);
    if (isString(missingRet)) {
      return missingRet
    }
  } else {
    if ( true && !this._isSilentTranslationWarn(key)) {
      warn(
        "Cannot translate the value of keypath '" + key + "'. " +
        'Use the value of keypath as default.'
      );
    }
  }

  if (this._formatFallbackMessages) {
    var parsedArgs = parseArgs.apply(void 0, values);
    return this._render(key, interpolateMode, parsedArgs.params, key)
  } else {
    return key
  }
};

VueI18n.prototype._isFallbackRoot = function _isFallbackRoot (val) {
  return !val && !isNull(this._root) && this._fallbackRoot
};

VueI18n.prototype._isSilentFallbackWarn = function _isSilentFallbackWarn (key) {
  return this._silentFallbackWarn instanceof RegExp
    ? this._silentFallbackWarn.test(key)
    : this._silentFallbackWarn
};

VueI18n.prototype._isSilentFallback = function _isSilentFallback (locale, key) {
  return this._isSilentFallbackWarn(key) && (this._isFallbackRoot() || locale !== this.fallbackLocale)
};

VueI18n.prototype._isSilentTranslationWarn = function _isSilentTranslationWarn (key) {
  return this._silentTranslationWarn instanceof RegExp
    ? this._silentTranslationWarn.test(key)
    : this._silentTranslationWarn
};

VueI18n.prototype._interpolate = function _interpolate (
  locale,
  message,
  key,
  host,
  interpolateMode,
  values,
  visitedLinkStack
) {
  if (!message) { return null }

  var pathRet = this._path.getPathValue(message, key);
  if (Array.isArray(pathRet) || isPlainObject(pathRet)) { return pathRet }

  var ret;
  if (isNull(pathRet)) {
    /* istanbul ignore else */
    if (isPlainObject(message)) {
      ret = message[key];
      if (!isString(ret)) {
        if ( true && !this._isSilentTranslationWarn(key) && !this._isSilentFallback(locale, key)) {
          warn(("Value of key '" + key + "' is not a string!"));
        }
        return null
      }
    } else {
      return null
    }
  } else {
    /* istanbul ignore else */
    if (isString(pathRet)) {
      ret = pathRet;
    } else {
      if ( true && !this._isSilentTranslationWarn(key) && !this._isSilentFallback(locale, key)) {
        warn(("Value of key '" + key + "' is not a string!"));
      }
      return null
    }
  }

  // Check for the existence of links within the translated string
  if (ret.indexOf('@:') >= 0 || ret.indexOf('@.') >= 0) {
    ret = this._link(locale, message, ret, host, 'raw', values, visitedLinkStack);
  }

  return this._render(ret, interpolateMode, values, key)
};

VueI18n.prototype._link = function _link (
  locale,
  message,
  str,
  host,
  interpolateMode,
  values,
  visitedLinkStack
) {
  var ret = str;

  // Match all the links within the local
  // We are going to replace each of
  // them with its translation
  var matches = ret.match(linkKeyMatcher);
  for (var idx in matches) {
    // ie compatible: filter custom array
    // prototype method
    if (!matches.hasOwnProperty(idx)) {
      continue
    }
    var link = matches[idx];
    var linkKeyPrefixMatches = link.match(linkKeyPrefixMatcher);
    var linkPrefix = linkKeyPrefixMatches[0];
      var formatterName = linkKeyPrefixMatches[1];

    // Remove the leading @:, @.case: and the brackets
    var linkPlaceholder = link.replace(linkPrefix, '').replace(bracketsMatcher, '');

    if (includes(visitedLinkStack, linkPlaceholder)) {
      if (true) {
        warn(("Circular reference found. \"" + link + "\" is already visited in the chain of " + (visitedLinkStack.reverse().join(' <- '))));
      }
      return ret
    }
    visitedLinkStack.push(linkPlaceholder);

    // Translate the link
    var translated = this._interpolate(
      locale, message, linkPlaceholder, host,
      interpolateMode === 'raw' ? 'string' : interpolateMode,
      interpolateMode === 'raw' ? undefined : values,
      visitedLinkStack
    );

    if (this._isFallbackRoot(translated)) {
      if ( true && !this._isSilentTranslationWarn(linkPlaceholder)) {
        warn(("Fall back to translate the link placeholder '" + linkPlaceholder + "' with root locale."));
      }
      /* istanbul ignore if */
      if (!this._root) { throw Error('unexpected error') }
      var root = this._root.$i18n;
      translated = root._translate(
        root._getMessages(), root.locale, root.fallbackLocale,
        linkPlaceholder, host, interpolateMode, values
      );
    }
    translated = this._warnDefault(
      locale, linkPlaceholder, translated, host,
      Array.isArray(values) ? values : [values],
      interpolateMode
    );

    if (this._modifiers.hasOwnProperty(formatterName)) {
      translated = this._modifiers[formatterName](translated);
    } else if (defaultModifiers.hasOwnProperty(formatterName)) {
      translated = defaultModifiers[formatterName](translated);
    }

    visitedLinkStack.pop();

    // Replace the link with the translated
    ret = !translated ? ret : ret.replace(link, translated);
  }

  return ret
};

VueI18n.prototype._render = function _render (message, interpolateMode, values, path) {
  var ret = this._formatter.interpolate(message, values, path);

  // If the custom formatter refuses to work - apply the default one
  if (!ret) {
    ret = defaultFormatter.interpolate(message, values, path);
  }

  // if interpolateMode is **not** 'string' ('row'),
  // return the compiled data (e.g. ['foo', VNode, 'bar']) with formatter
  return interpolateMode === 'string' && !isString(ret) ? ret.join('') : ret
};

VueI18n.prototype._appendItemToChain = function _appendItemToChain (chain, item, blocks) {
  var follow = false;
  if (!includes(chain, item)) {
    follow = true;
    if (item) {
      follow = item[item.length - 1] !== '!';
      item = item.replace(/!/g, '');
      chain.push(item);
      if (blocks && blocks[item]) {
        follow = blocks[item];
      }
    }
  }
  return follow
};

VueI18n.prototype._appendLocaleToChain = function _appendLocaleToChain (chain, locale, blocks) {
  var follow;
  var tokens = locale.split('-');
  do {
    var item = tokens.join('-');
    follow = this._appendItemToChain(chain, item, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && (follow === true))
  return follow
};

VueI18n.prototype._appendBlockToChain = function _appendBlockToChain (chain, block, blocks) {
  var follow = true;
  for (var i = 0; (i < block.length) && (isBoolean(follow)); i++) {
    var locale = block[i];
    if (isString(locale)) {
      follow = this._appendLocaleToChain(chain, locale, blocks);
    }
  }
  return follow
};

VueI18n.prototype._getLocaleChain = function _getLocaleChain (start, fallbackLocale) {
  if (start === '') { return [] }

  if (!this._localeChainCache) {
    this._localeChainCache = {};
  }

  var chain = this._localeChainCache[start];
  if (!chain) {
    if (!fallbackLocale) {
      fallbackLocale = this.fallbackLocale;
    }
    chain = [];

    // first block defined by start
    var block = [start];

    // while any intervening block found
    while (isArray(block)) {
      block = this._appendBlockToChain(
        chain,
        block,
        fallbackLocale
      );
    }

    // last block defined by default
    var defaults;
    if (isArray(fallbackLocale)) {
      defaults = fallbackLocale;
    } else if (isObject(fallbackLocale)) {
      /* $FlowFixMe */
      if (fallbackLocale['default']) {
        defaults = fallbackLocale['default'];
      } else {
        defaults = null;
      }
    } else {
      defaults = fallbackLocale;
    }

    // convert defaults to array
    if (isString(defaults)) {
      block = [defaults];
    } else {
      block = defaults;
    }
    if (block) {
      this._appendBlockToChain(
        chain,
        block,
        null
      );
    }
    this._localeChainCache[start] = chain;
  }
  return chain
};

VueI18n.prototype._translate = function _translate (
  messages,
  locale,
  fallback,
  key,
  host,
  interpolateMode,
  args
) {
  var chain = this._getLocaleChain(locale, fallback);
  var res;
  for (var i = 0; i < chain.length; i++) {
    var step = chain[i];
    res =
      this._interpolate(step, messages[step], key, host, interpolateMode, args, [key]);
    if (!isNull(res)) {
      if (step !== locale && "development" !== 'production' && !this._isSilentTranslationWarn(key) && !this._isSilentFallbackWarn(key)) {
        warn(("Fall back to translate the keypath '" + key + "' with '" + step + "' locale."));
      }
      return res
    }
  }
  return null
};

VueI18n.prototype._t = function _t (key, _locale, messages, host) {
    var ref;

    var values = [], len = arguments.length - 4;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 4 ];
  if (!key) { return '' }

  var parsedArgs = parseArgs.apply(void 0, values);
  var locale = parsedArgs.locale || _locale;

  var ret = this._translate(
    messages, locale, this.fallbackLocale, key,
    host, 'string', parsedArgs.params
  );
  if (this._isFallbackRoot(ret)) {
    if ( true && !this._isSilentTranslationWarn(key) && !this._isSilentFallbackWarn(key)) {
      warn(("Fall back to translate the keypath '" + key + "' with root locale."));
    }
    /* istanbul ignore if */
    if (!this._root) { throw Error('unexpected error') }
    return (ref = this._root).$t.apply(ref, [ key ].concat( values ))
  } else {
    ret = this._warnDefault(locale, key, ret, host, values, 'string');
    if (this._postTranslation && ret !== null && ret !== undefined) {
      ret = this._postTranslation(ret, key);
    }
    return ret
  }
};

VueI18n.prototype.t = function t (key) {
    var ref;

    var values = [], len = arguments.length - 1;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];
  return (ref = this)._t.apply(ref, [ key, this.locale, this._getMessages(), null ].concat( values ))
};

VueI18n.prototype._i = function _i (key, locale, messages, host, values) {
  var ret =
    this._translate(messages, locale, this.fallbackLocale, key, host, 'raw', values);
  if (this._isFallbackRoot(ret)) {
    if ( true && !this._isSilentTranslationWarn(key)) {
      warn(("Fall back to interpolate the keypath '" + key + "' with root locale."));
    }
    if (!this._root) { throw Error('unexpected error') }
    return this._root.$i18n.i(key, locale, values)
  } else {
    return this._warnDefault(locale, key, ret, host, [values], 'raw')
  }
};

VueI18n.prototype.i = function i (key, locale, values) {
  /* istanbul ignore if */
  if (!key) { return '' }

  if (!isString(locale)) {
    locale = this.locale;
  }

  return this._i(key, locale, this._getMessages(), null, values)
};

VueI18n.prototype._tc = function _tc (
  key,
  _locale,
  messages,
  host,
  choice
) {
    var ref;

    var values = [], len = arguments.length - 5;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 5 ];
  if (!key) { return '' }
  if (choice === undefined) {
    choice = 1;
  }

  var predefined = { 'count': choice, 'n': choice };
  var parsedArgs = parseArgs.apply(void 0, values);
  parsedArgs.params = Object.assign(predefined, parsedArgs.params);
  values = parsedArgs.locale === null ? [parsedArgs.params] : [parsedArgs.locale, parsedArgs.params];
  return this.fetchChoice((ref = this)._t.apply(ref, [ key, _locale, messages, host ].concat( values )), choice)
};

VueI18n.prototype.fetchChoice = function fetchChoice (message, choice) {
  /* istanbul ignore if */
  if (!message && !isString(message)) { return null }
  var choices = message.split('|');

  choice = this.getChoiceIndex(choice, choices.length);
  if (!choices[choice]) { return message }
  return choices[choice].trim()
};

VueI18n.prototype.tc = function tc (key, choice) {
    var ref;

    var values = [], len = arguments.length - 2;
    while ( len-- > 0 ) values[ len ] = arguments[ len + 2 ];
  return (ref = this)._tc.apply(ref, [ key, this.locale, this._getMessages(), null, choice ].concat( values ))
};

VueI18n.prototype._te = function _te (key, locale, messages) {
    var args = [], len = arguments.length - 3;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 3 ];

  var _locale = parseArgs.apply(void 0, args).locale || locale;
  return this._exist(messages[_locale], key)
};

VueI18n.prototype.te = function te (key, locale) {
  return this._te(key, this.locale, this._getMessages(), locale)
};

VueI18n.prototype.getLocaleMessage = function getLocaleMessage (locale) {
  return looseClone(this._vm.messages[locale] || {})
};

VueI18n.prototype.setLocaleMessage = function setLocaleMessage (locale, message) {
  if (this._warnHtmlInMessage === 'warn' || this._warnHtmlInMessage === 'error') {
    this._checkLocaleMessage(locale, this._warnHtmlInMessage, message);
  }
  this._vm.$set(this._vm.messages, locale, message);
};

VueI18n.prototype.mergeLocaleMessage = function mergeLocaleMessage (locale, message) {
  if (this._warnHtmlInMessage === 'warn' || this._warnHtmlInMessage === 'error') {
    this._checkLocaleMessage(locale, this._warnHtmlInMessage, message);
  }
  this._vm.$set(this._vm.messages, locale, merge({}, this._vm.messages[locale] || {}, message));
};

VueI18n.prototype.getDateTimeFormat = function getDateTimeFormat (locale) {
  return looseClone(this._vm.dateTimeFormats[locale] || {})
};

VueI18n.prototype.setDateTimeFormat = function setDateTimeFormat (locale, format) {
  this._vm.$set(this._vm.dateTimeFormats, locale, format);
  this._clearDateTimeFormat(locale, format);
};

VueI18n.prototype.mergeDateTimeFormat = function mergeDateTimeFormat (locale, format) {
  this._vm.$set(this._vm.dateTimeFormats, locale, merge(this._vm.dateTimeFormats[locale] || {}, format));
  this._clearDateTimeFormat(locale, format);
};

VueI18n.prototype._clearDateTimeFormat = function _clearDateTimeFormat (locale, format) {
  for (var key in format) {
    var id = locale + "__" + key;

    if (!this._dateTimeFormatters.hasOwnProperty(id)) {
      continue
    }

    delete this._dateTimeFormatters[id];
  }
};

VueI18n.prototype._localizeDateTime = function _localizeDateTime (
  value,
  locale,
  fallback,
  dateTimeFormats,
  key
) {
  var _locale = locale;
  var formats = dateTimeFormats[_locale];

  var chain = this._getLocaleChain(locale, fallback);
  for (var i = 0; i < chain.length; i++) {
    var current = _locale;
    var step = chain[i];
    formats = dateTimeFormats[step];
    _locale = step;
    // fallback locale
    if (isNull(formats) || isNull(formats[key])) {
      if (step !== locale && "development" !== 'production' && !this._isSilentTranslationWarn(key) && !this._isSilentFallbackWarn(key)) {
        warn(("Fall back to '" + step + "' datetime formats from '" + current + "' datetime formats."));
      }
    } else {
      break
    }
  }

  if (isNull(formats) || isNull(formats[key])) {
    return null
  } else {
    var format = formats[key];
    var id = _locale + "__" + key;
    var formatter = this._dateTimeFormatters[id];
    if (!formatter) {
      formatter = this._dateTimeFormatters[id] = new Intl.DateTimeFormat(_locale, format);
    }
    return formatter.format(value)
  }
};

VueI18n.prototype._d = function _d (value, locale, key) {
  /* istanbul ignore if */
  if ( true && !VueI18n.availabilities.dateTimeFormat) {
    warn('Cannot format a Date value due to not supported Intl.DateTimeFormat.');
    return ''
  }

  if (!key) {
    return new Intl.DateTimeFormat(locale).format(value)
  }

  var ret =
    this._localizeDateTime(value, locale, this.fallbackLocale, this._getDateTimeFormats(), key);
  if (this._isFallbackRoot(ret)) {
    if ( true && !this._isSilentTranslationWarn(key) && !this._isSilentFallbackWarn(key)) {
      warn(("Fall back to datetime localization of root: key '" + key + "'."));
    }
    /* istanbul ignore if */
    if (!this._root) { throw Error('unexpected error') }
    return this._root.$i18n.d(value, key, locale)
  } else {
    return ret || ''
  }
};

VueI18n.prototype.d = function d (value) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var locale = this.locale;
  var key = null;

  if (args.length === 1) {
    if (isString(args[0])) {
      key = args[0];
    } else if (isObject(args[0])) {
      if (args[0].locale) {
        locale = args[0].locale;
      }
      if (args[0].key) {
        key = args[0].key;
      }
    }
  } else if (args.length === 2) {
    if (isString(args[0])) {
      key = args[0];
    }
    if (isString(args[1])) {
      locale = args[1];
    }
  }

  return this._d(value, locale, key)
};

VueI18n.prototype.getNumberFormat = function getNumberFormat (locale) {
  return looseClone(this._vm.numberFormats[locale] || {})
};

VueI18n.prototype.setNumberFormat = function setNumberFormat (locale, format) {
  this._vm.$set(this._vm.numberFormats, locale, format);
  this._clearNumberFormat(locale, format);
};

VueI18n.prototype.mergeNumberFormat = function mergeNumberFormat (locale, format) {
  this._vm.$set(this._vm.numberFormats, locale, merge(this._vm.numberFormats[locale] || {}, format));
  this._clearNumberFormat(locale, format);
};

VueI18n.prototype._clearNumberFormat = function _clearNumberFormat (locale, format) {
  for (var key in format) {
    var id = locale + "__" + key;

    if (!this._numberFormatters.hasOwnProperty(id)) {
      continue
    }

    delete this._numberFormatters[id];
  }
};

VueI18n.prototype._getNumberFormatter = function _getNumberFormatter (
  value,
  locale,
  fallback,
  numberFormats,
  key,
  options
) {
  var _locale = locale;
  var formats = numberFormats[_locale];

  var chain = this._getLocaleChain(locale, fallback);
  for (var i = 0; i < chain.length; i++) {
    var current = _locale;
    var step = chain[i];
    formats = numberFormats[step];
    _locale = step;
    // fallback locale
    if (isNull(formats) || isNull(formats[key])) {
      if (step !== locale && "development" !== 'production' && !this._isSilentTranslationWarn(key) && !this._isSilentFallbackWarn(key)) {
        warn(("Fall back to '" + step + "' number formats from '" + current + "' number formats."));
      }
    } else {
      break
    }
  }

  if (isNull(formats) || isNull(formats[key])) {
    return null
  } else {
    var format = formats[key];

    var formatter;
    if (options) {
      // If options specified - create one time number formatter
      formatter = new Intl.NumberFormat(_locale, Object.assign({}, format, options));
    } else {
      var id = _locale + "__" + key;
      formatter = this._numberFormatters[id];
      if (!formatter) {
        formatter = this._numberFormatters[id] = new Intl.NumberFormat(_locale, format);
      }
    }
    return formatter
  }
};

VueI18n.prototype._n = function _n (value, locale, key, options) {
  /* istanbul ignore if */
  if (!VueI18n.availabilities.numberFormat) {
    if (true) {
      warn('Cannot format a Number value due to not supported Intl.NumberFormat.');
    }
    return ''
  }

  if (!key) {
    var nf = !options ? new Intl.NumberFormat(locale) : new Intl.NumberFormat(locale, options);
    return nf.format(value)
  }

  var formatter = this._getNumberFormatter(value, locale, this.fallbackLocale, this._getNumberFormats(), key, options);
  var ret = formatter && formatter.format(value);
  if (this._isFallbackRoot(ret)) {
    if ( true && !this._isSilentTranslationWarn(key) && !this._isSilentFallbackWarn(key)) {
      warn(("Fall back to number localization of root: key '" + key + "'."));
    }
    /* istanbul ignore if */
    if (!this._root) { throw Error('unexpected error') }
    return this._root.$i18n.n(value, Object.assign({}, { key: key, locale: locale }, options))
  } else {
    return ret || ''
  }
};

VueI18n.prototype.n = function n (value) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var locale = this.locale;
  var key = null;
  var options = null;

  if (args.length === 1) {
    if (isString(args[0])) {
      key = args[0];
    } else if (isObject(args[0])) {
      if (args[0].locale) {
        locale = args[0].locale;
      }
      if (args[0].key) {
        key = args[0].key;
      }

      // Filter out number format options only
      options = Object.keys(args[0]).reduce(function (acc, key) {
          var obj;

        if (includes(numberFormatKeys, key)) {
          return Object.assign({}, acc, ( obj = {}, obj[key] = args[0][key], obj ))
        }
        return acc
      }, null);
    }
  } else if (args.length === 2) {
    if (isString(args[0])) {
      key = args[0];
    }
    if (isString(args[1])) {
      locale = args[1];
    }
  }

  return this._n(value, locale, key, options)
};

VueI18n.prototype._ntp = function _ntp (value, locale, key, options) {
  /* istanbul ignore if */
  if (!VueI18n.availabilities.numberFormat) {
    if (true) {
      warn('Cannot format to parts a Number value due to not supported Intl.NumberFormat.');
    }
    return []
  }

  if (!key) {
    var nf = !options ? new Intl.NumberFormat(locale) : new Intl.NumberFormat(locale, options);
    return nf.formatToParts(value)
  }

  var formatter = this._getNumberFormatter(value, locale, this.fallbackLocale, this._getNumberFormats(), key, options);
  var ret = formatter && formatter.formatToParts(value);
  if (this._isFallbackRoot(ret)) {
    if ( true && !this._isSilentTranslationWarn(key)) {
      warn(("Fall back to format number to parts of root: key '" + key + "' ."));
    }
    /* istanbul ignore if */
    if (!this._root) { throw Error('unexpected error') }
    return this._root.$i18n._ntp(value, locale, key, options)
  } else {
    return ret || []
  }
};

Object.defineProperties( VueI18n.prototype, prototypeAccessors );

var availabilities;
// $FlowFixMe
Object.defineProperty(VueI18n, 'availabilities', {
  get: function get () {
    if (!availabilities) {
      var intlDefined = typeof Intl !== 'undefined';
      availabilities = {
        dateTimeFormat: intlDefined && typeof Intl.DateTimeFormat !== 'undefined',
        numberFormat: intlDefined && typeof Intl.NumberFormat !== 'undefined'
      };
    }

    return availabilities
  }
});

VueI18n.install = install;
VueI18n.version = '8.20.0';

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VueI18n);


/***/ }),

/***/ "./src/editor/CodeAce.vue":
/*!********************************!*\
  !*** ./src/editor/CodeAce.vue ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _CodeAce_vue_vue_type_template_id_37ad02ad___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CodeAce.vue?vue&type=template&id=37ad02ad& */ "./src/editor/CodeAce.vue?vue&type=template&id=37ad02ad&");
/* harmony import */ var _CodeAce_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CodeAce.vue?vue&type=script&lang=js& */ "./src/editor/CodeAce.vue?vue&type=script&lang=js&");
/* harmony import */ var _CodeAce_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CodeAce.vue?vue&type=style&index=0&lang=scss& */ "./src/editor/CodeAce.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _CodeAce_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _CodeAce_vue_vue_type_template_id_37ad02ad___WEBPACK_IMPORTED_MODULE_0__.render,
  _CodeAce_vue_vue_type_template_id_37ad02ad___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/editor/CodeAce.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/editor/CodeMonaco.vue":
/*!***********************************!*\
  !*** ./src/editor/CodeMonaco.vue ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _CodeMonaco_vue_vue_type_template_id_f5fd2472___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CodeMonaco.vue?vue&type=template&id=f5fd2472& */ "./src/editor/CodeMonaco.vue?vue&type=template&id=f5fd2472&");
/* harmony import */ var _CodeMonaco_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CodeMonaco.vue?vue&type=script&lang=js& */ "./src/editor/CodeMonaco.vue?vue&type=script&lang=js&");
/* harmony import */ var _CodeMonaco_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CodeMonaco.vue?vue&type=style&index=0&lang=scss& */ "./src/editor/CodeMonaco.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _CodeMonaco_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _CodeMonaco_vue_vue_type_template_id_f5fd2472___WEBPACK_IMPORTED_MODULE_0__.render,
  _CodeMonaco_vue_vue_type_template_id_f5fd2472___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/editor/CodeMonaco.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/editor/Editor.vue":
/*!*******************************!*\
  !*** ./src/editor/Editor.vue ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _Editor_vue_vue_type_template_id_3a753434___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Editor.vue?vue&type=template&id=3a753434& */ "./src/editor/Editor.vue?vue&type=template&id=3a753434&");
/* harmony import */ var _Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Editor.vue?vue&type=script&lang=js& */ "./src/editor/Editor.vue?vue&type=script&lang=js&");
/* harmony import */ var _Editor_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Editor.vue?vue&type=style&index=0&lang=scss& */ "./src/editor/Editor.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _Editor_vue_vue_type_template_id_3a753434___WEBPACK_IMPORTED_MODULE_0__.render,
  _Editor_vue_vue_type_template_id_3a753434___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/editor/Editor.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/editor/FullCodePreview.vue":
/*!****************************************!*\
  !*** ./src/editor/FullCodePreview.vue ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _FullCodePreview_vue_vue_type_template_id_04a90f3a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FullCodePreview.vue?vue&type=template&id=04a90f3a& */ "./src/editor/FullCodePreview.vue?vue&type=template&id=04a90f3a&");
/* harmony import */ var _FullCodePreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FullCodePreview.vue?vue&type=script&lang=js& */ "./src/editor/FullCodePreview.vue?vue&type=script&lang=js&");
/* harmony import */ var _FullCodePreview_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FullCodePreview.vue?vue&type=style&index=0&lang=scss& */ "./src/editor/FullCodePreview.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _FullCodePreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _FullCodePreview_vue_vue_type_template_id_04a90f3a___WEBPACK_IMPORTED_MODULE_0__.render,
  _FullCodePreview_vue_vue_type_template_id_04a90f3a___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/editor/FullCodePreview.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/editor/Preview.vue":
/*!********************************!*\
  !*** ./src/editor/Preview.vue ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ensureECharts": () => /* reexport safe */ _Preview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.ensureECharts,
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _Preview_vue_vue_type_template_id_66bf6e1f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Preview.vue?vue&type=template&id=66bf6e1f& */ "./src/editor/Preview.vue?vue&type=template&id=66bf6e1f&");
/* harmony import */ var _Preview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Preview.vue?vue&type=script&lang=js& */ "./src/editor/Preview.vue?vue&type=script&lang=js&");
/* harmony import */ var _Preview_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Preview.vue?vue&type=style&index=0&lang=scss& */ "./src/editor/Preview.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _Preview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _Preview_vue_vue_type_template_id_66bf6e1f___WEBPACK_IMPORTED_MODULE_0__.render,
  _Preview_vue_vue_type_template_id_66bf6e1f___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/editor/Preview.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/editor/View.vue":
/*!*****************************!*\
  !*** ./src/editor/View.vue ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _View_vue_vue_type_template_id_3d6bc75e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./View.vue?vue&type=template&id=3d6bc75e& */ "./src/editor/View.vue?vue&type=template&id=3d6bc75e&");
/* harmony import */ var _View_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./View.vue?vue&type=script&lang=js& */ "./src/editor/View.vue?vue&type=script&lang=js&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */
;
var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__.default)(
  _View_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _View_vue_vue_type_template_id_3d6bc75e___WEBPACK_IMPORTED_MODULE_0__.render,
  _View_vue_vue_type_template_id_3d6bc75e___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/editor/View.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/explore/ExampleCard.vue":
/*!*************************************!*\
  !*** ./src/explore/ExampleCard.vue ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _ExampleCard_vue_vue_type_template_id_01229e96___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ExampleCard.vue?vue&type=template&id=01229e96& */ "./src/explore/ExampleCard.vue?vue&type=template&id=01229e96&");
/* harmony import */ var _ExampleCard_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ExampleCard.vue?vue&type=script&lang=js& */ "./src/explore/ExampleCard.vue?vue&type=script&lang=js&");
/* harmony import */ var _ExampleCard_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ExampleCard.vue?vue&type=style&index=0&lang=scss& */ "./src/explore/ExampleCard.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _ExampleCard_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _ExampleCard_vue_vue_type_template_id_01229e96___WEBPACK_IMPORTED_MODULE_0__.render,
  _ExampleCard_vue_vue_type_template_id_01229e96___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/explore/ExampleCard.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/explore/Explore.vue":
/*!*********************************!*\
  !*** ./src/explore/Explore.vue ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _Explore_vue_vue_type_template_id_050c84ae___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Explore.vue?vue&type=template&id=050c84ae& */ "./src/explore/Explore.vue?vue&type=template&id=050c84ae&");
/* harmony import */ var _Explore_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Explore.vue?vue&type=script&lang=js& */ "./src/explore/Explore.vue?vue&type=script&lang=js&");
/* harmony import */ var _Explore_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Explore.vue?vue&type=style&index=0&lang=scss& */ "./src/explore/Explore.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");



;


/* normalize component */

var component = (0,_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__.default)(
  _Explore_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__.default,
  _Explore_vue_vue_type_template_id_050c84ae___WEBPACK_IMPORTED_MODULE_0__.render,
  _Explore_vue_vue_type_template_id_050c84ae___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/explore/Explore.vue"
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (component.exports);

/***/ }),

/***/ "./src/editor/CodeAce.vue?vue&type=script&lang=js&":
/*!*********************************************************!*\
  !*** ./src/editor/CodeAce.vue?vue&type=script&lang=js& ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeAce_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CodeAce.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeAce.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeAce_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/editor/CodeMonaco.vue?vue&type=script&lang=js&":
/*!************************************************************!*\
  !*** ./src/editor/CodeMonaco.vue?vue&type=script&lang=js& ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeMonaco_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CodeMonaco.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeMonaco.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeMonaco_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/editor/Editor.vue?vue&type=script&lang=js&":
/*!********************************************************!*\
  !*** ./src/editor/Editor.vue?vue&type=script&lang=js& ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Editor.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Editor.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Editor_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/editor/FullCodePreview.vue?vue&type=script&lang=js&":
/*!*****************************************************************!*\
  !*** ./src/editor/FullCodePreview.vue?vue&type=script&lang=js& ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FullCodePreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FullCodePreview.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/FullCodePreview.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FullCodePreview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/editor/Preview.vue?vue&type=script&lang=js&":
/*!*********************************************************!*\
  !*** ./src/editor/Preview.vue?vue&type=script&lang=js& ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__,
/* harmony export */   "ensureECharts": () => /* reexport safe */ _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Preview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.ensureECharts
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Preview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Preview.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Preview.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Preview_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/editor/View.vue?vue&type=script&lang=js&":
/*!******************************************************!*\
  !*** ./src/editor/View.vue?vue&type=script&lang=js& ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_View_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./View.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/View.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_View_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/explore/ExampleCard.vue?vue&type=script&lang=js&":
/*!**************************************************************!*\
  !*** ./src/explore/ExampleCard.vue?vue&type=script&lang=js& ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ExampleCard_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ExampleCard.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/ExampleCard.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ExampleCard_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/explore/Explore.vue?vue&type=script&lang=js&":
/*!**********************************************************!*\
  !*** ./src/explore/Explore.vue?vue&type=script&lang=js& ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Explore_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Explore.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/Explore.vue?vue&type=script&lang=js&");
 /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Explore_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__.default); 

/***/ }),

/***/ "./src/editor/CodeAce.vue?vue&type=style&index=0&lang=scss&":
/*!******************************************************************!*\
  !*** ./src/editor/CodeAce.vue?vue&type=style&index=0&lang=scss& ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sassjs_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeAce_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/sassjs-loader/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CodeAce.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeAce.vue?vue&type=style&index=0&lang=scss&");


/***/ }),

/***/ "./src/editor/CodeMonaco.vue?vue&type=style&index=0&lang=scss&":
/*!*********************************************************************!*\
  !*** ./src/editor/CodeMonaco.vue?vue&type=style&index=0&lang=scss& ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sassjs_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeMonaco_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/sassjs-loader/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CodeMonaco.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeMonaco.vue?vue&type=style&index=0&lang=scss&");


/***/ }),

/***/ "./src/editor/Editor.vue?vue&type=style&index=0&lang=scss&":
/*!*****************************************************************!*\
  !*** ./src/editor/Editor.vue?vue&type=style&index=0&lang=scss& ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sassjs_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Editor_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/sassjs-loader/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Editor.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Editor.vue?vue&type=style&index=0&lang=scss&");


/***/ }),

/***/ "./src/editor/FullCodePreview.vue?vue&type=style&index=0&lang=scss&":
/*!**************************************************************************!*\
  !*** ./src/editor/FullCodePreview.vue?vue&type=style&index=0&lang=scss& ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sassjs_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_FullCodePreview_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/sassjs-loader/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FullCodePreview.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/FullCodePreview.vue?vue&type=style&index=0&lang=scss&");


/***/ }),

/***/ "./src/editor/Preview.vue?vue&type=style&index=0&lang=scss&":
/*!******************************************************************!*\
  !*** ./src/editor/Preview.vue?vue&type=style&index=0&lang=scss& ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sassjs_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Preview_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/sassjs-loader/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Preview.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Preview.vue?vue&type=style&index=0&lang=scss&");


/***/ }),

/***/ "./src/explore/ExampleCard.vue?vue&type=style&index=0&lang=scss&":
/*!***********************************************************************!*\
  !*** ./src/explore/ExampleCard.vue?vue&type=style&index=0&lang=scss& ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sassjs_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ExampleCard_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/sassjs-loader/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ExampleCard.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/ExampleCard.vue?vue&type=style&index=0&lang=scss&");


/***/ }),

/***/ "./src/explore/Explore.vue?vue&type=style&index=0&lang=scss&":
/*!*******************************************************************!*\
  !*** ./src/explore/Explore.vue?vue&type=style&index=0&lang=scss& ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sassjs_loader_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_Explore_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/mini-css-extract-plugin/dist/loader.js!../../node_modules/css-loader/dist/cjs.js!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/sassjs-loader/index.js!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Explore.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/sassjs-loader/index.js!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/Explore.vue?vue&type=style&index=0&lang=scss&");


/***/ }),

/***/ "./src/editor/CodeAce.vue?vue&type=template&id=37ad02ad&":
/*!***************************************************************!*\
  !*** ./src/editor/CodeAce.vue?vue&type=template&id=37ad02ad& ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeAce_vue_vue_type_template_id_37ad02ad___WEBPACK_IMPORTED_MODULE_0__.render,
/* harmony export */   "staticRenderFns": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeAce_vue_vue_type_template_id_37ad02ad___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeAce_vue_vue_type_template_id_37ad02ad___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CodeAce.vue?vue&type=template&id=37ad02ad& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeAce.vue?vue&type=template&id=37ad02ad&");


/***/ }),

/***/ "./src/editor/CodeMonaco.vue?vue&type=template&id=f5fd2472&":
/*!******************************************************************!*\
  !*** ./src/editor/CodeMonaco.vue?vue&type=template&id=f5fd2472& ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeMonaco_vue_vue_type_template_id_f5fd2472___WEBPACK_IMPORTED_MODULE_0__.render,
/* harmony export */   "staticRenderFns": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeMonaco_vue_vue_type_template_id_f5fd2472___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CodeMonaco_vue_vue_type_template_id_f5fd2472___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./CodeMonaco.vue?vue&type=template&id=f5fd2472& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeMonaco.vue?vue&type=template&id=f5fd2472&");


/***/ }),

/***/ "./src/editor/Editor.vue?vue&type=template&id=3a753434&":
/*!**************************************************************!*\
  !*** ./src/editor/Editor.vue?vue&type=template&id=3a753434& ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Editor_vue_vue_type_template_id_3a753434___WEBPACK_IMPORTED_MODULE_0__.render,
/* harmony export */   "staticRenderFns": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Editor_vue_vue_type_template_id_3a753434___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Editor_vue_vue_type_template_id_3a753434___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Editor.vue?vue&type=template&id=3a753434& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Editor.vue?vue&type=template&id=3a753434&");


/***/ }),

/***/ "./src/editor/FullCodePreview.vue?vue&type=template&id=04a90f3a&":
/*!***********************************************************************!*\
  !*** ./src/editor/FullCodePreview.vue?vue&type=template&id=04a90f3a& ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FullCodePreview_vue_vue_type_template_id_04a90f3a___WEBPACK_IMPORTED_MODULE_0__.render,
/* harmony export */   "staticRenderFns": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FullCodePreview_vue_vue_type_template_id_04a90f3a___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_FullCodePreview_vue_vue_type_template_id_04a90f3a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./FullCodePreview.vue?vue&type=template&id=04a90f3a& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/FullCodePreview.vue?vue&type=template&id=04a90f3a&");


/***/ }),

/***/ "./src/editor/Preview.vue?vue&type=template&id=66bf6e1f&":
/*!***************************************************************!*\
  !*** ./src/editor/Preview.vue?vue&type=template&id=66bf6e1f& ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Preview_vue_vue_type_template_id_66bf6e1f___WEBPACK_IMPORTED_MODULE_0__.render,
/* harmony export */   "staticRenderFns": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Preview_vue_vue_type_template_id_66bf6e1f___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Preview_vue_vue_type_template_id_66bf6e1f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Preview.vue?vue&type=template&id=66bf6e1f& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Preview.vue?vue&type=template&id=66bf6e1f&");


/***/ }),

/***/ "./src/editor/View.vue?vue&type=template&id=3d6bc75e&":
/*!************************************************************!*\
  !*** ./src/editor/View.vue?vue&type=template&id=3d6bc75e& ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_View_vue_vue_type_template_id_3d6bc75e___WEBPACK_IMPORTED_MODULE_0__.render,
/* harmony export */   "staticRenderFns": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_View_vue_vue_type_template_id_3d6bc75e___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_View_vue_vue_type_template_id_3d6bc75e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./View.vue?vue&type=template&id=3d6bc75e& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/View.vue?vue&type=template&id=3d6bc75e&");


/***/ }),

/***/ "./src/explore/ExampleCard.vue?vue&type=template&id=01229e96&":
/*!********************************************************************!*\
  !*** ./src/explore/ExampleCard.vue?vue&type=template&id=01229e96& ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ExampleCard_vue_vue_type_template_id_01229e96___WEBPACK_IMPORTED_MODULE_0__.render,
/* harmony export */   "staticRenderFns": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ExampleCard_vue_vue_type_template_id_01229e96___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ExampleCard_vue_vue_type_template_id_01229e96___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./ExampleCard.vue?vue&type=template&id=01229e96& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/ExampleCard.vue?vue&type=template&id=01229e96&");


/***/ }),

/***/ "./src/explore/Explore.vue?vue&type=template&id=050c84ae&":
/*!****************************************************************!*\
  !*** ./src/explore/Explore.vue?vue&type=template&id=050c84ae& ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Explore_vue_vue_type_template_id_050c84ae___WEBPACK_IMPORTED_MODULE_0__.render,
/* harmony export */   "staticRenderFns": () => /* reexport safe */ _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Explore_vue_vue_type_template_id_050c84ae___WEBPACK_IMPORTED_MODULE_0__.staticRenderFns
/* harmony export */ });
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Explore_vue_vue_type_template_id_050c84ae___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib/index.js??vue-loader-options!./Explore.vue?vue&type=template&id=050c84ae& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/Explore.vue?vue&type=template&id=050c84ae&");


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeAce.vue?vue&type=template&id=37ad02ad&":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeAce.vue?vue&type=template&id=37ad02ad& ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* binding */ render,
/* harmony export */   "staticRenderFns": () => /* binding */ staticRenderFns
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {
    directives: [
      {
        name: "loading",
        rawName: "v-loading",
        value: _vm.loading,
        expression: "loading"
      }
    ],
    staticClass: "ace-editor-main"
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeMonaco.vue?vue&type=template&id=f5fd2472&":
/*!*********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/CodeMonaco.vue?vue&type=template&id=f5fd2472& ***!
  \*********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* binding */ render,
/* harmony export */   "staticRenderFns": () => /* binding */ staticRenderFns
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {
    directives: [
      {
        name: "loading",
        rawName: "v-loading",
        value: _vm.loading,
        expression: "loading"
      }
    ],
    staticClass: "monaco-editor-main"
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Editor.vue?vue&type=template&id=3a753434&":
/*!*****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Editor.vue?vue&type=template&id=3a753434& ***!
  \*****************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* binding */ render,
/* harmony export */   "staticRenderFns": () => /* binding */ staticRenderFns
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { attrs: { id: "main-container" } },
    [
      !_vm.shared.isMobile
        ? _c(
            "div",
            {
              style: { width: _vm.leftContainerSize + "%" },
              attrs: { id: "editor-left-container" }
            },
            [
              _c(
                "el-tabs",
                {
                  attrs: { type: "border-card" },
                  model: {
                    value: _vm.currentTab,
                    callback: function($$v) {
                      _vm.currentTab = $$v
                    },
                    expression: "currentTab"
                  }
                },
                [
                  _c(
                    "el-tab-pane",
                    {
                      attrs: {
                        label: _vm.$t("editor.tabEditor"),
                        name: "code-editor"
                      }
                    },
                    [
                      _c(
                        "el-container",
                        [
                          _c(
                            "el-header",
                            { attrs: { id: "editor-control-panel" } },
                            [
                              _c(
                                "div",
                                { attrs: { id: "code-info" } },
                                [
                                  _vm.shared.editorStatus.message
                                    ? [
                                        _c(
                                          "span",
                                          { staticClass: "code-info-time" },
                                          [_vm._v(_vm._s(_vm.currentTime))]
                                        ),
                                        _vm._v(" "),
                                        _c(
                                          "span",
                                          {
                                            class:
                                              "code-info-type-" +
                                              _vm.shared.editorStatus.type
                                          },
                                          [
                                            _vm._v(
                                              _vm._s(
                                                _vm.shared.editorStatus.message
                                              )
                                            )
                                          ]
                                        )
                                      ]
                                    : _vm._e()
                                ],
                                2
                              ),
                              _vm._v(" "),
                              _c("div", { staticClass: "editor-controls" }, [
                                _c(
                                  "a",
                                  {
                                    staticClass: "btn btn-default btn-sm",
                                    attrs: { href: "javascript:;" },
                                    on: { click: _vm.disposeAndRun }
                                  },
                                  [_vm._v(_vm._s(_vm.$t("editor.run")))]
                                )
                              ])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "el-main",
                            [
                              _vm.shared.typeCheck
                                ? _c("CodeMonaco", {
                                    attrs: {
                                      id: "code-panel",
                                      initialCode: _vm.initialCode
                                    }
                                  })
                                : _c("CodeAce", {
                                    attrs: {
                                      id: "code-panel",
                                      initialCode: _vm.initialCode
                                    }
                                  })
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "el-tab-pane",
                    {
                      attrs: {
                        label: _vm.$t("editor.tabFullCodePreview"),
                        name: "full-code",
                        lazy: true
                      }
                    },
                    [
                      _c(
                        "el-container",
                        { staticStyle: { width: "100%", height: "100%" } },
                        [
                          _c(
                            "el-header",
                            { attrs: { id: "full-code-generate-config" } },
                            [
                              _c("span", {
                                staticClass: "full-code-generate-config-label"
                              }),
                              _vm._v(" "),
                              _c("el-switch", {
                                staticClass: "enable-decal",
                                attrs: {
                                  "active-text": _vm.$t("editor.minimalBundle"),
                                  "inactive-text": ""
                                },
                                model: {
                                  value: _vm.fullCodeConfig.minimal,
                                  callback: function($$v) {
                                    _vm.$set(_vm.fullCodeConfig, "minimal", $$v)
                                  },
                                  expression: "fullCodeConfig.minimal"
                                }
                              }),
                              _vm._v(" "),
                              _c("el-switch", {
                                staticClass: "enable-decal",
                                attrs: {
                                  "active-text": "ES Modules",
                                  "inactive-text": ""
                                },
                                model: {
                                  value: _vm.fullCodeConfig.esm,
                                  callback: function($$v) {
                                    _vm.$set(_vm.fullCodeConfig, "esm", $$v)
                                  },
                                  expression: "fullCodeConfig.esm"
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "el-main",
                            [
                              _c("FullCodePreview", {
                                attrs: { code: _vm.fullCode }
                              })
                            ],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "el-tab-pane",
                    {
                      attrs: {
                        label: _vm.$t("editor.tabOptionPreview"),
                        name: "full-option"
                      }
                    },
                    [_c("div", { attrs: { id: "option-outline" } })]
                  )
                ],
                1
              )
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      !_vm.shared.isMobile
        ? _c("div", {
            staticClass: "handler",
            style: { left: _vm.leftContainerSize + "%" },
            attrs: { id: "h-handler" },
            on: { mousedown: _vm.onSplitterDragStart }
          })
        : _vm._e(),
      _vm._v(" "),
      _c("Preview", {
        ref: "preview",
        staticClass: "right-container",
        style: {
          width: 100 - _vm.leftContainerSize + "%",
          left: _vm.leftContainerSize + "%"
        },
        attrs: { inEditor: true }
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/FullCodePreview.vue?vue&type=template&id=04a90f3a&":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/FullCodePreview.vue?vue&type=template&id=04a90f3a& ***!
  \**************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* binding */ render,
/* harmony export */   "staticRenderFns": () => /* binding */ staticRenderFns
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", {
    directives: [
      {
        name: "loading",
        rawName: "v-loading",
        value: _vm.loading,
        expression: "loading"
      }
    ],
    staticClass: "full-code-preview"
  })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Preview.vue?vue&type=template&id=66bf6e1f&":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/Preview.vue?vue&type=template&id=66bf6e1f& ***!
  \******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* binding */ render,
/* harmony export */   "staticRenderFns": () => /* binding */ staticRenderFns
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { class: [_vm.inEditor && !_vm.shared.isMobile ? "" : "full"] },
    [
      _c(
        "div",
        {
          directives: [
            {
              name: "loading",
              rawName: "v-loading",
              value: _vm.loading,
              expression: "loading"
            }
          ],
          staticClass: "right-panel",
          style: { background: _vm.backgroundColor },
          attrs: { id: "chart-panel" }
        },
        [_c("div", { staticClass: "chart-container" })]
      ),
      _vm._v(" "),
      _c(
        "div",
        { attrs: { id: "tool-panel" } },
        [
          _c(
            "div",
            { staticClass: "left-panel" },
            [
              _c("el-switch", {
                staticClass: "dark-mode",
                attrs: {
                  "active-color": "#181432",
                  "active-text": _vm.$t("editor.darkMode"),
                  "inactive-text": ""
                },
                model: {
                  value: _vm.shared.darkMode,
                  callback: function($$v) {
                    _vm.$set(_vm.shared, "darkMode", $$v)
                  },
                  expression: "shared.darkMode"
                }
              }),
              _vm._v(" "),
              !_vm.isGL
                ? _c("el-switch", {
                    staticClass: "enable-decal",
                    attrs: {
                      "active-text": _vm.$t("editor.enableDecal"),
                      "inactive-text": ""
                    },
                    model: {
                      value: _vm.shared.enableDecal,
                      callback: function($$v) {
                        _vm.$set(_vm.shared, "enableDecal", $$v)
                      },
                      expression: "shared.enableDecal"
                    }
                  })
                : _vm._e(),
              _vm._v(" "),
              !_vm.isGL
                ? _c(
                    "el-popover",
                    {
                      staticStyle: { "margin-top": "3px" },
                      attrs: {
                        placement: "bottom",
                        width: "450",
                        trigger: "click"
                      }
                    },
                    [
                      _c(
                        "div",
                        { staticClass: "render-config-container" },
                        [
                          _c(
                            "el-row",
                            {
                              attrs: {
                                gutter: 2,
                                type: "flex",
                                align: "middle"
                              }
                            },
                            [
                              _c(
                                "el-col",
                                { attrs: { span: 12 } },
                                [
                                  _c("label", { staticClass: "tool-label" }, [
                                    _vm._v(_vm._s(_vm.$t("editor.renderer")))
                                  ]),
                                  _vm._v(" "),
                                  _c(
                                    "el-radio-group",
                                    {
                                      staticStyle: {
                                        "text-transform": "uppercase"
                                      },
                                      attrs: { size: "mini" },
                                      model: {
                                        value: _vm.shared.renderer,
                                        callback: function($$v) {
                                          _vm.$set(_vm.shared, "renderer", $$v)
                                        },
                                        expression: "shared.renderer"
                                      }
                                    },
                                    [
                                      _c("el-radio-button", {
                                        attrs: { label: "svg" }
                                      }),
                                      _vm._v(" "),
                                      _c("el-radio-button", {
                                        attrs: { label: "canvas" }
                                      })
                                    ],
                                    1
                                  )
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "el-col",
                                { attrs: { span: 12 } },
                                [
                                  _vm.shared.renderer === "canvas"
                                    ? _c("el-switch", {
                                        attrs: {
                                          "active-text": _vm.$t(
                                            "editor.useDirtyRect"
                                          ),
                                          "inactive-text": ""
                                        },
                                        model: {
                                          value: _vm.shared.useDirtyRect,
                                          callback: function($$v) {
                                            _vm.$set(
                                              _vm.shared,
                                              "useDirtyRect",
                                              $$v
                                            )
                                          },
                                          expression: "shared.useDirtyRect"
                                        }
                                      })
                                    : _vm._e()
                                ],
                                1
                              )
                            ],
                            1
                          )
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "span",
                        {
                          staticClass: "render-config-trigger",
                          attrs: { slot: "reference" },
                          slot: "reference"
                        },
                        [
                          _c("i", {
                            staticClass: "el-icon-setting el-icon--left"
                          }),
                          _vm._v(_vm._s(_vm.$t("editor.renderCfgTitle")))
                        ]
                      )
                    ]
                  )
                : _vm._e()
            ],
            1
          ),
          _vm._v(" "),
          _vm.inEditor
            ? [
                !_vm.shared.isMobile
                  ? _c(
                      "button",
                      {
                        staticClass: "download btn btn-sm",
                        on: { click: _vm.downloadExample }
                      },
                      [_vm._v(_vm._s(_vm.$t("editor.download")))]
                    )
                  : _vm._e(),
                _vm._v(" "),
                _c(
                  "a",
                  {
                    staticClass: "screenshot",
                    attrs: { target: "_blank" },
                    on: { click: _vm.screenshot }
                  },
                  [_c("i", { staticClass: "el-icon-camera-solid" })]
                )
              ]
            : _c(
                "a",
                {
                  staticClass: "edit btn btn-sm",
                  attrs: { href: _vm.editLink, target: "_blank" }
                },
                [_vm._v(_vm._s(_vm.$t("editor.edit")))]
              )
        ],
        2
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/View.vue?vue&type=template&id=3d6bc75e&":
/*!***************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/editor/View.vue?vue&type=template&id=3d6bc75e& ***!
  \***************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* binding */ render,
/* harmony export */   "staticRenderFns": () => /* binding */ staticRenderFns
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("preview")
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/ExampleCard.vue?vue&type=template&id=01229e96&":
/*!***********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/ExampleCard.vue?vue&type=template&id=01229e96& ***!
  \***********************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* binding */ render,
/* harmony export */   "staticRenderFns": () => /* binding */ staticRenderFns
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "example-list-item" }, [
    _c(
      "a",
      {
        staticClass: "example-link",
        attrs: { target: "_blank", href: _vm.exampleLink }
      },
      [
        _c("img", {
          staticClass: "chart-area",
          attrs: {
            src: __webpack_require__(/*! ../asset/placeholder.jpg */ "./src/asset/placeholder.jpg"),
            "data-src": _vm.screenshotURL
          }
        }),
        _vm._v(" "),
        _c("h4", { staticClass: "example-title" }, [_vm._v(_vm._s(_vm.title))]),
        _vm._v(" "),
        _vm.showSubtitle
          ? _c("h5", { staticClass: "example-subtitle" }, [
              _vm._v(_vm._s(_vm.subtitle))
            ])
          : _vm._e()
      ]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/Explore.vue?vue&type=template&id=050c84ae&":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib/index.js??vue-loader-options!./src/explore/Explore.vue?vue&type=template&id=050c84ae& ***!
  \*******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => /* binding */ render,
/* harmony export */   "staticRenderFns": () => /* binding */ staticRenderFns
/* harmony export */ });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { attrs: { id: "example-explore" } }, [
    _c("div", { attrs: { id: "left-container" } }, [
      _c(
        "div",
        { attrs: { id: "left-chart-nav" } },
        [
          _c(
            "scrollactive",
            {
              attrs: {
                "active-class": "active",
                offset: 80,
                duration: 500,
                "scroll-container-selector": "#example-explore",
                "bezier-easing-value": ".5,0,.35,1"
              },
              on: { itemchanged: _vm.onActiveNavChanged }
            },
            [
              _c(
                "ul",
                _vm._l(_vm.EXAMPLE_CATEGORIES, function(category) {
                  return _c("li", { key: category }, [
                    _c(
                      "a",
                      {
                        staticClass: "left-chart-nav-link scrollactive-item",
                        attrs: {
                          id: "left-chart-nav-" + category,
                          href: "#chart-type-" + category
                        }
                      },
                      [
                        _c("span", {
                          staticClass: "chart-icon",
                          domProps: { innerHTML: _vm._s(_vm.icons[category]) }
                        }),
                        _vm._v(" "),
                        _c("span", { staticClass: "chart-name" }, [
                          _vm._v(_vm._s(_vm.$t("chartTypes." + category)))
                        ])
                      ]
                    )
                  ])
                }),
                0
              )
            ]
          )
        ],
        1
      )
    ]),
    _vm._v(" "),
    _c("div", { attrs: { id: "explore-container" } }, [
      _c(
        "div",
        { staticClass: "example-list-panel" },
        _vm._l(_vm.exampleList, function(categoryObj) {
          return _c("div", { key: categoryObj.category }, [
            _c(
              "h3",
              {
                staticClass: "chart-type-head",
                attrs: { id: "chart-type-" + categoryObj.category }
              },
              [
                _vm._v(
                  "\r\n                    " +
                    _vm._s(_vm.$t("chartTypes." + categoryObj.category)) +
                    "\r\n                    "
                ),
                _c("span", [_vm._v(_vm._s(categoryObj.category))])
              ]
            ),
            _vm._v(" "),
            _c(
              "div",
              {
                staticClass: "row",
                attrs: { id: "chart-row-" + categoryObj.category }
              },
              _vm._l(categoryObj.examples, function(exampleItem) {
                return _c(
                  "div",
                  {
                    key: exampleItem.id,
                    staticClass: "col-xl-2 col-lg-3 col-md-4 col-sm-6"
                  },
                  [_c("ExampleCard", { attrs: { example: exampleItem } })],
                  1
                )
              }),
              0
            )
          ])
        }),
        0
      )
    ]),
    _vm._v(" "),
    _c(
      "div",
      { attrs: { id: "toolbar" } },
      [
        _c("el-switch", {
          attrs: {
            "active-color": "#181432",
            "active-text": _vm.$t("editor.darkMode"),
            "inactive-text": ""
          },
          model: {
            value: _vm.shared.darkMode,
            callback: function($$v) {
              _vm.$set(_vm.shared, "darkMode", $$v)
            },
            expression: "shared.darkMode"
          }
        })
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ normalizeComponent
/* harmony export */ });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/vue-scrollactive/dist/vue-scrollactive.min.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-scrollactive/dist/vue-scrollactive.min.js ***!
  \********************************************************************/
/***/ (function(module) {

!(function (t, e) {
   true
    ? (module.exports = e())
    : 0;
})('undefined' != typeof self ? self : this, function () {
  return (function (t) {
    var e = {};
    function r(n) {
      if (e[n]) return e[n].exports;
      var o = (e[n] = { i: n, l: !1, exports: {} });
      return t[n].call(o.exports, o, o.exports, r), (o.l = !0), o.exports;
    }
    return (
      (r.m = t),
      (r.c = e),
      (r.d = function (t, e, n) {
        r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
      }),
      (r.r = function (t) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(t, '__esModule', { value: !0 });
      }),
      (r.t = function (t, e) {
        if ((1 & e && (t = r(t)), 8 & e)) return t;
        if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
        var n = Object.create(null);
        if (
          (r.r(n),
          Object.defineProperty(n, 'default', { enumerable: !0, value: t }),
          2 & e && 'string' != typeof t)
        )
          for (var o in t)
            r.d(
              n,
              o,
              function (e) {
                return t[e];
              }.bind(null, o)
            );
        return n;
      }),
      (r.n = function (t) {
        var e =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return r.d(e, 'a', e), e;
      }),
      (r.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (r.p = '/dist/'),
      r((r.s = 1))
    );
  })([
    function (t, e) {
      var r = 'function' == typeof Float32Array;
      function n(t, e) {
        return 1 - 3 * e + 3 * t;
      }
      function o(t, e) {
        return 3 * e - 6 * t;
      }
      function i(t) {
        return 3 * t;
      }
      function s(t, e, r) {
        return ((n(e, r) * t + o(e, r)) * t + i(e)) * t;
      }
      function l(t, e, r) {
        return 3 * n(e, r) * t * t + 2 * o(e, r) * t + i(e);
      }
      function a(t) {
        return t;
      }
      t.exports = function (t, e, n, o) {
        if (!(0 <= t && t <= 1 && 0 <= n && n <= 1))
          throw new Error('bezier x values must be in [0, 1] range');
        if (t === e && n === o) return a;
        for (var i = r ? new Float32Array(11) : new Array(11), c = 0; c < 11; ++c)
          i[c] = s(0.1 * c, t, n);
        function u(e) {
          for (var r = 0, o = 1; 10 !== o && i[o] <= e; ++o) r += 0.1;
          --o;
          var a = r + 0.1 * ((e - i[o]) / (i[o + 1] - i[o])),
            c = l(a, t, n);
          return c >= 0.001
            ? (function (t, e, r, n) {
                for (var o = 0; o < 4; ++o) {
                  var i = l(e, r, n);
                  if (0 === i) return e;
                  e -= (s(e, r, n) - t) / i;
                }
                return e;
              })(e, a, t, n)
            : 0 === c
            ? a
            : (function (t, e, r, n, o) {
                var i,
                  l,
                  a = 0;
                do {
                  (i = s((l = e + (r - e) / 2), n, o) - t) > 0 ? (r = l) : (e = l);
                } while (Math.abs(i) > 1e-7 && ++a < 10);
                return l;
              })(e, r, r + 0.1, t, n);
        }
        return function (t) {
          return 0 === t ? 0 : 1 === t ? 1 : s(u(t), e, o);
        };
      };
    },
    function (t, e, r) {
      'use strict';
      r.r(e);
      var n = function () {
        var t = this.$createElement;
        return (this._self._c || t)(
          this.tag,
          { ref: 'scrollactive-nav-wrapper', tag: 'component', staticClass: 'scrollactive-nav' },
          [this._t('default')],
          2
        );
      };
      n._withStripped = !0;
      var o = r(0),
        i = r.n(o);
      function s(t) {
        return (
          (function (t) {
            if (Array.isArray(t)) return l(t);
          })(t) ||
          (function (t) {
            if ('undefined' != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t);
          })(t) ||
          (function (t, e) {
            if (!t) return;
            if ('string' == typeof t) return l(t, e);
            var r = Object.prototype.toString.call(t).slice(8, -1);
            'Object' === r && t.constructor && (r = t.constructor.name);
            if ('Map' === r || 'Set' === r) return Array.from(t);
            if ('Arguments' === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
              return l(t, e);
          })(t) ||
          (function () {
            throw new TypeError(
              'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
            );
          })()
        );
      }
      function l(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
        return n;
      }
      var a = (function (t, e, r, n, o, i, s, l) {
        var a,
          c = 'function' == typeof t ? t.options : t;
        if (
          (e && ((c.render = e), (c.staticRenderFns = r), (c._compiled = !0)),
          n && (c.functional = !0),
          i && (c._scopeId = 'data-v-' + i),
          s
            ? ((a = function (t) {
                (t =
                  t ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext)) ||
                  'undefined' == typeof __VUE_SSR_CONTEXT__ ||
                  (t = __VUE_SSR_CONTEXT__),
                  o && o.call(this, t),
                  t && t._registeredComponents && t._registeredComponents.add(s);
              }),
              (c._ssrRegister = a))
            : o &&
              (a = l
                ? function () {
                    o.call(this, (c.functional ? this.parent : this).$root.$options.shadowRoot);
                  }
                : o),
          a)
        )
          if (c.functional) {
            c._injectStyles = a;
            var u = c.render;
            c.render = function (t, e) {
              return a.call(e), u(t, e);
            };
          } else {
            var f = c.beforeCreate;
            c.beforeCreate = f ? [].concat(f, a) : [a];
          }
        return { exports: t, options: c };
      })(
        {
          props: {
            activeClass: { type: String, default: 'is-active' },
            offset: { type: Number, default: 20 },
            scrollOffset: { type: Number, default: null },
            scrollContainerSelector: { type: String, default: '' },
            clickToScroll: { type: Boolean, default: !0 },
            duration: { type: Number, default: 600 },
            alwaysTrack: { type: Boolean, default: !1 },
            bezierEasingValue: { type: String, default: '.5,0,.35,1' },
            modifyUrl: { type: Boolean, default: !0 },
            exact: { type: Boolean, default: !1 },
            highlightFirstItem: { type: Boolean, default: !1 },
            tag: { type: String, default: 'nav' },
            scrollOnStart: { type: Boolean, default: !0 },
          },
          data: function () {
            return {
              observer: null,
              items: [],
              currentItem: null,
              lastActiveItem: null,
              scrollAnimationFrame: null,
              bezierEasing: i.a,
            };
          },
          computed: {
            cubicBezierArray: function () {
              return this.bezierEasingValue.split(',');
            },
            scrollContainer: function () {
              var t = window;
              return (
                this.scrollContainerSelector &&
                  (t = document.querySelector(this.scrollContainerSelector) || window),
                t
              );
            },
          },
          mounted: function () {
            var t = window.MutationObserver || window.WebKitMutationObserver;
            this.observer ||
              ((this.observer = new t(this.initScrollactiveItems)),
              this.observer.observe(this.$refs['scrollactive-nav-wrapper'], {
                childList: !0,
                subtree: !0,
              })),
              this.initScrollactiveItems(),
              this.removeActiveClass(),
              (this.currentItem = this.getItemInsideWindow()),
              this.currentItem && this.currentItem.classList.add(this.activeClass),
              this.scrollOnStart && this.scrollToHashElement(),
              this.scrollContainer.addEventListener('scroll', this.onScroll);
          },
          updated: function () {
            this.initScrollactiveItems();
          },
          beforeDestroy: function () {
            this.scrollContainer.removeEventListener('scroll', this.onScroll),
              window.cancelAnimationFrame(this.scrollAnimationFrame);
          },
          methods: {
            onScroll: function (t) {
              (this.currentItem = this.getItemInsideWindow()),
                this.currentItem !== this.lastActiveItem &&
                  (this.removeActiveClass(),
                  this.$emit('itemchanged', t, this.currentItem, this.lastActiveItem),
                  (this.lastActiveItem = this.currentItem)),
                this.currentItem && this.currentItem.classList.add(this.activeClass);
            },
            getItemInsideWindow: function () {
              var t,
                e = this;
              return (
                [].forEach.call(this.items, function (r) {
                  var n = r === e.items[0],
                    o = document.getElementById(decodeURI(r.hash.substr(1)));
                  if (o) {
                    var i = e.scrollContainer.scrollTop || window.pageYOffset,
                      s = i >= e.getOffsetTop(o) - e.offset,
                      l = i < e.getOffsetTop(o) - e.offset + o.offsetHeight;
                    n && e.highlightFirstItem && l && (t = r),
                      e.exact && s && l && (t = r),
                      !e.exact && s && (t = r);
                  }
                }),
                t
              );
            },
            initScrollactiveItems: function () {
              var t = this;
              (this.items = this.$el.querySelectorAll('.scrollactive-item')),
                this.clickToScroll
                  ? [].forEach.call(this.items, function (e) {
                      e.addEventListener('click', t.handleClick);
                    })
                  : [].forEach.call(this.items, function (e) {
                      e.removeEventListener('click', t.handleClick);
                    });
            },
            setScrollactiveItems: function () {
              this.initScrollactiveItems();
            },
            handleClick: function (t) {
              var e = this;
              t.preventDefault();
              var r = t.currentTarget.hash,
                n = document.getElementById(decodeURI(r.substr(1)));
              n
                ? (this.alwaysTrack ||
                    (this.scrollContainer.removeEventListener('scroll', this.onScroll),
                    window.cancelAnimationFrame(this.scrollAnimationFrame),
                    this.removeActiveClass(),
                    t.currentTarget.classList.add(this.activeClass)),
                  this.scrollTo(n).then(function () {
                    if (!e.alwaysTrack) {
                      e.scrollContainer.addEventListener('scroll', e.onScroll);
                      (e.currentItem = [].find.call(e.items, function (t) {
                        return decodeURI(t.hash.substr(1)) === n.id;
                      })),
                        e.currentItem !== e.lastActiveItem &&
                          (e.$emit('itemchanged', null, e.currentItem, e.lastActiveItem),
                          (e.lastActiveItem = e.currentItem));
                    }
                    e.modifyUrl && e.pushHashToUrl(r);
                  }))
                : console.warn(
                    "[vue-scrollactive] Element '".concat(
                      r,
                      "' was not found. Make sure it is set in the DOM."
                    )
                  );
            },
            scrollTo: function (t) {
              var e = this;
              return new Promise(function (r) {
                var n = e.getOffsetTop(t),
                  o = e.scrollContainer.scrollTop || window.pageYOffset,
                  i = n - o,
                  l = e.bezierEasing.apply(e, s(e.cubicBezierArray)),
                  a = null;
                window.requestAnimationFrame(function t(n) {
                  a || (a = n);
                  var s = n - a,
                    c = s / e.duration;
                  s >= e.duration && (s = e.duration), c >= 1 && (c = 1);
                  var u = e.scrollOffset || e.offset,
                    f = o + l(c) * (i - u);
                  e.scrollContainer.scrollTo(0, f),
                    s < e.duration
                      ? (e.scrollAnimationFrame = window.requestAnimationFrame(t))
                      : r();
                });
              });
            },
            getOffsetTop: function (t) {
              for (var e = 0, r = t; r; ) (e += r.offsetTop), (r = r.offsetParent);
              return this.scrollContainer.offsetTop && (e -= this.scrollContainer.offsetTop), e;
            },
            removeActiveClass: function () {
              var t = this;
              [].forEach.call(this.items, function (e) {
                e.classList.remove(t.activeClass);
              });
            },
            scrollToHashElement: function () {
              var t = this,
                e = window.location.hash;
              if (e) {
                var r = document.querySelector(decodeURI(e));
                r &&
                  ((window.location.hash = ''),
                  setTimeout(function () {
                    var n = r.offsetTop - t.offset;
                    t.scrollContainer.scrollTo(0, n), t.pushHashToUrl(e);
                  }, 0));
              }
            },
            pushHashToUrl: function (t) {
              window.history.pushState
                ? window.history.pushState(null, null, t)
                : (window.location.hash = t);
            },
          },
        },
        n,
        [],
        !1,
        null,
        null,
        null
      );
      a.options.__file = 'src/scrollactive.vue';
      var c = a.exports,
        u = {
          install: function (t) {
            u.install.installed || t.component('scrollactive', c);
          },
        };
      'undefined' != typeof window && window.Vue && u.install(window.Vue);
      e.default = u;
    },
  ]);
});


/***/ }),

/***/ "./src/asset/icon sync recursive ^\\.\\/.*\\.svg$":
/*!********************************************!*\
  !*** ./src/asset/icon/ sync ^\.\/.*\.svg$ ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./bar.svg": "./src/asset/icon/bar.svg",
	"./boxplot.svg": "./src/asset/icon/boxplot.svg",
	"./calendar.svg": "./src/asset/icon/calendar.svg",
	"./candlestick.svg": "./src/asset/icon/candlestick.svg",
	"./custom.svg": "./src/asset/icon/custom.svg",
	"./dataZoom.svg": "./src/asset/icon/dataZoom.svg",
	"./dataset.svg": "./src/asset/icon/dataset.svg",
	"./drag.svg": "./src/asset/icon/drag.svg",
	"./funnel.svg": "./src/asset/icon/funnel.svg",
	"./gauge.svg": "./src/asset/icon/gauge.svg",
	"./geo.svg": "./src/asset/icon/geo.svg",
	"./gl.svg": "./src/asset/icon/gl.svg",
	"./graph.svg": "./src/asset/icon/graph.svg",
	"./heatmap.svg": "./src/asset/icon/heatmap.svg",
	"./line.svg": "./src/asset/icon/line.svg",
	"./lines.svg": "./src/asset/icon/lines.svg",
	"./map.svg": "./src/asset/icon/map.svg",
	"./parallel.svg": "./src/asset/icon/parallel.svg",
	"./pictorialBar.svg": "./src/asset/icon/pictorialBar.svg",
	"./pie.svg": "./src/asset/icon/pie.svg",
	"./radar.svg": "./src/asset/icon/radar.svg",
	"./rich.svg": "./src/asset/icon/rich.svg",
	"./sankey.svg": "./src/asset/icon/sankey.svg",
	"./scatter.svg": "./src/asset/icon/scatter.svg",
	"./sunburst.svg": "./src/asset/icon/sunburst.svg",
	"./themeRiver.svg": "./src/asset/icon/themeRiver.svg",
	"./tree.svg": "./src/asset/icon/tree.svg",
	"./treemap.svg": "./src/asset/icon/treemap.svg"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/asset/icon sync recursive ^\\.\\/.*\\.svg$";

/***/ }),

/***/ "vue":
/*!**********************!*\
  !*** external "Vue" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = Vue;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "./";
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/main.js");
/******/ })()
;
//# sourceMappingURL=example-bundle.js.map