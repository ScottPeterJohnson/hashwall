!function(e){self.webpackChunk=function(t,r){for(var o in r)e[o]=r[o];for(;t.length;)n[t.pop()]=1};var t={},n={0:1},r={};var o={2:function(){return{}}};function i(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}i.e=function(e){var t=[];return t.push(Promise.resolve().then((function(){n[e]||importScripts(i.p+""+({}[e]||e)+".worker.js")}))),({1:[2]}[e]||[]).forEach((function(e){var n=r[e];if(n)t.push(n);else{var s,u=o[e](),a=fetch(i.p+""+{2:"ea497630748ed4e5fd7c"}[e]+".module.wasm");if(u instanceof Promise&&"function"==typeof WebAssembly.compileStreaming)s=Promise.all([WebAssembly.compileStreaming(a),u]).then((function(e){return WebAssembly.instantiate(e[0],e[1])}));else if("function"==typeof WebAssembly.instantiateStreaming)s=WebAssembly.instantiateStreaming(a,u);else{s=a.then((function(e){return e.arrayBuffer()})).then((function(e){return WebAssembly.instantiate(e,u)}))}t.push(r[e]=s.then((function(t){return i.w[e]=(t.instance||t).exports})))}})),Promise.all(t)},i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i.w={},i(i.s=0)}([function(e,t,n){"use strict";var r=n.e(1).then(n.bind(null,1)).catch(console.error);self.addEventListener("message",(function(e){var t=e.data,n=t.options;r.then((function(e){for(var r=[],o=(n.target,0);o<n.repetitions;o++){var i=e.hash(n.target,n.difficulty);r.push(i),i,postMessage({callId:t.callId,type:"progress",current:o,total:n.repetitions})}postMessage({callId:t.callId,type:"done",results:r})}))}))}]);