var c="039d3b19d7591f48fd4916177fdb44e97dbbd616";var m="/_frsh",i="__frsh_c";function a(s){if(!s.startsWith("/")||s.startsWith("//"))return s;try{let t=new URL(s,"https://freshassetcache.local");return t.protocol!=="https:"||t.host!=="freshassetcache.local"||t.searchParams.has(i)?s:(t.searchParams.set(i,c),t.pathname+t.search+t.hash)}catch(t){return console.warn(`Failed to create asset() URL, falling back to regular path ('${s}'):`,t),s}}function d(s){if(s.includes("("))return s;let t=s.split(","),o=[];for(let n of t){let r=n.trimStart(),f=n.length-r.length;if(r==="")return s;let e=r.indexOf(" ");e===-1&&(e=r.length);let l=n.substring(0,f),u=r.substring(0,e),h=r.substring(e);o.push(l+a(u)+h)}return o.join(",")}function b(s){if(s.type==="img"||s.type==="source"){let{props:t}=s;if(t["data-fresh-disable-lock"])return;typeof t.src=="string"&&(t.src=a(t.src)),typeof t.srcset=="string"&&(t.srcset=d(t.srcset))}}export{m as a,a as b,b as c};
