import{a as r}from"./chunk-OLUNBRMC.js";var a,o,f,h,l=0,y=[],c=[],v=r.__b,m=r.__r,p=r.diffed,d=r.__c,H=r.unmount;function V(n,t){r.__h&&r.__h(o,n,l||t),l=0;var _=o.__H||(o.__H={__:[],__h:[]});return n>=_.__.length&&_.__.push({__V:c}),_.__[n]}function A(n,t){var _=V(a++,7);return g(_.__H,t)?(_.__V=n(),_.i=t,_.__h=n,_.__V):_.__}function N(){for(var n;n=y.shift();)if(n.__P&&n.__H)try{n.__H.__h.forEach(i),n.__H.__h.forEach(s),n.__H.__h=[]}catch(t){n.__H.__h=[],r.__e(t,n.__v)}}r.__b=function(n){o=null,v&&v(n)},r.__r=function(n){m&&m(n),a=0;var t=(o=n.__c).__H;t&&(f===o?(t.__h=[],o.__h=[],t.__.forEach(function(_){_.__N&&(_.__=_.__N),_.__V=c,_.__N=_.i=void 0})):(t.__h.forEach(i),t.__h.forEach(s),t.__h=[],a=0)),f=o},r.diffed=function(n){p&&p(n);var t=n.__c;t&&t.__H&&(t.__H.__h.length&&(y.push(t)!==1&&h===r.requestAnimationFrame||((h=r.requestAnimationFrame)||b)(N)),t.__H.__.forEach(function(_){_.i&&(_.__H=_.i),_.__V!==c&&(_.__=_.__V),_.i=void 0,_.__V=c})),f=o=null},r.__c=function(n,t){t.some(function(_){try{_.__h.forEach(i),_.__h=_.__h.filter(function(u){return!u.__||s(u)})}catch(u){t.some(function(e){e.__h&&(e.__h=[])}),t=[],r.__e(u,_.__v)}}),d&&d(n,t)},r.unmount=function(n){H&&H(n);var t,_=n.__c;_&&_.__H&&(_.__H.__.forEach(function(u){try{i(u)}catch(e){t=e}}),_.__H=void 0,t&&r.__e(t,_.__v))};var E=typeof requestAnimationFrame=="function";function b(n){var t,_=function(){clearTimeout(u),E&&cancelAnimationFrame(t),setTimeout(n)},u=setTimeout(_,100);E&&(t=requestAnimationFrame(_))}function i(n){var t=o,_=n.__c;typeof _=="function"&&(n.__c=void 0,_()),o=t}function s(n){var t=o;n.__c=n.__(),o=t}function g(n,t){return!n||n.length!==t.length||t.some(function(_,u){return _!==n[u]})}export{A as a};
