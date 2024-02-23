import{a as X,c as Y}from"./chunk-ICQPIT24.js";import{a as O,b as $,c as R,d as L,e as z,g as B}from"./chunk-OLUNBRMC.js";import"./chunk-DQW7DUIU.js";typeof globalThis>"u"&&(window.globalThis=window);var j="fresh-partial",w="f-partial",_="f-loading",I="f-client-nav",q="data-fresh-key",C="data-current",b="data-ancestor";function v(e,t){let r=new URL(t,"http://localhost").pathname;return r!=="/"&&r.endsWith("/")&&(r=r.slice(0,-1)),e!=="/"&&e.endsWith("/")&&(e=e.slice(0,-1)),e===r?2:e.startsWith(r+"/")||r==="/"?1:0}function G(e,t){let r=e.props,n=r.href;if(typeof n=="string"&&n.startsWith("/")){let o=v(t,n);o===2?(r[C]="true",r["aria-current"]="page"):o===1&&(r[b]="true",r["aria-current"]="true")}}function se(e,t,r){return e.__k={_frshRootFrag:!0,nodeType:1,parentNode:e,nextSibling:null,get firstChild(){let n=t.nextSibling;return n===r?null:n},get childNodes(){let n=[],o=t.nextSibling;for(;o!==null&&o!==r;)n.push(o),o=o.nextSibling;return n},insertBefore(n,o){e.insertBefore(n,o??r)},appendChild(n){e.insertBefore(n,r)},removeChild(n){e.removeChild(n)}}}function k(e){return e.nodeType===Node.COMMENT_NODE}function le(e){return e.nodeType===Node.TEXT_NODE}function ee(e){return e.nodeType===Node.ELEMENT_NODE&&!("_frshRootFrag"in e)}function Ce(e,t){let r=[];U(e,t,[],[R(L,null)],document.body,r);for(let n=0;n<r.length;n++){let{vnode:o,rootFragment:a}=r[n],i=()=>{B(o,a)};"scheduler"in window?scheduler.postTask(i):setTimeout(i,0)}}function te(e){return e.children}te.displayName="PreactServerComponent";function H(e,t){let r=e.props;r.children==null?r.children=t:Array.isArray(r.children)?r.children.push(t):r.children=[r.children,t]}var W=class extends z{componentDidMount(){ne.set(this.props.name,this)}render(){return this.props.children}};var J=!1,ne=new Map;function K(e){let{startNode:t,endNode:r}=e,n=r.parentNode;if(!J&&t!==null&&t.nodeType===Node.COMMENT_NODE){let o=new Text("");e.startNode=o,n.insertBefore(o,t),t.remove()}if(!J&&r!==null&&r.nodeType===Node.COMMENT_NODE){let o=new Text("");e.endNode=o,n.insertBefore(o,r),r.remove()}}function Q(e,t,r,n,o,a){let[i,l]=o.slice(6).split(":"),s=`#frsh-slot-${i}-${l}-children`,d=document.querySelector(s);if(d!==null){r.push({kind:1,endNode:null,startNode:null,text:o.slice(1)});let c=d.content.cloneNode(!0);U(e,t,r,n,c,a),r.pop()}}function U(e,t,r,n,o,a){let i=o;for(;i!==null;){let l=r.length>0?r[r.length-1]:null;if(k(i)){let s=i.data;if(s.startsWith("!--")&&(s=s.slice(3,-2)),s.startsWith("frsh-slot"))r.push({startNode:i,text:s,endNode:null,kind:1}),n.push(R(te,{id:s}));else if(s.startsWith("frsh-partial")){let[d,c,p,N]=s.split(":");r.push({startNode:i,text:c,endNode:null,kind:2}),n.push(R(W,{name:c,key:N,mode:+p}))}else if(s.startsWith("frsh-key:")){let d=s.slice(9);n.push(R(L,{key:d}))}else if(s.startsWith("/frsh-key:")){let d=n.pop(),c=n[n.length-1];H(c,d),i=i.nextSibling;continue}else if(l!==null&&(s.startsWith("/frsh")||l.text===s)){if(l.endNode=i,r.pop(),l.kind===1){let d=n.pop(),c=n[n.length-1];c.props.children=d,K(l),i=l.endNode.nextSibling;continue}else if(l!==null&&(l.kind===0||l.kind===2))if(r.length===0){let d=n[n.length-1];d.props.children==null&&Q(e,t,r,n,s,a),n.pop();let c=i.parentNode;K(l);let p=se(c,l.startNode,l.endNode);a.push({vnode:d,marker:l,rootFragment:p}),i=l.endNode.nextSibling;continue}else{let d=n[n.length-1];d&&d.props.children==null?(Q(e,t,r,n,s,a),d.props.children==null&&n.pop()):n.pop(),l.endNode=i,K(l);let c=n[n.length-1];H(c,d),i=l.endNode.nextSibling;continue}}else if(s.startsWith("frsh")){let[d,c,p]=s.slice(5).split(":"),N=t[Number(c)];r.push({startNode:i,endNode:null,text:s,kind:0});let g=R(e[d],N);p&&(g.key=p),n.push(g)}}else if(le(i)){let s=n[n.length-1];l!==null&&(l.kind===1||l.kind===2)&&H(s,i.data)}else{let s=n[n.length-1];if(ee(i))if(l!==null&&(l.kind===1||l.kind===2)){let c={children:i.childNodes.length<=1?null:[]},p=!1;for(let g=0;g<i.attributes.length;g++){let f=i.attributes[g];if(f.nodeName===q){p=!0,c.key=f.nodeValue;continue}else if(f.nodeName===_){let h=f.nodeValue,u=t[Number(h)][_].value;i._freshIndicator=u}c[f.nodeName]=typeof i[f.nodeName]=="boolean"?!0:f.nodeValue}p&&i.removeAttribute(q);let N=R(i.localName,c);H(s,N),n.push(N)}else{let d=i.getAttribute(_);if(d!==null){let c=t[Number(d)][_].value;i._freshIndicator=c}}i.firstChild&&i.nodeName!=="SCRIPT"&&U(e,t,r,n,i.firstChild,a),l!==null&&l.kind!==0&&n.pop()}i!==null&&(i=i.nextSibling)}}var ae="Unable to process partial response.";async function D(e,t={}){t.redirect="follow",e.searchParams.set(j,"true");let r=await fetch(e,t);await de(r)}function re(e){document.querySelectorAll("a").forEach(t=>{let r=v(e.pathname,t.href);r===2?(t.setAttribute(C,"true"),t.setAttribute("aria-current","page"),t.removeAttribute(b)):r===1?(t.setAttribute(b,"true"),t.setAttribute("aria-current","true"),t.removeAttribute(C)):(t.removeAttribute(C),t.removeAttribute(b),t.removeAttribute("aria-current"))})}function oe(e,t,r,n){let o=null,a=n.firstChild,i=0;for(;a!==null;){if(k(a)){let l=a.data;if(l.startsWith("frsh-partial"))o=a,i++;else if(l.startsWith("/frsh-partial")){i--;let s={_frshRootFrag:!0,nodeType:1,nextSibling:null,firstChild:o,parentNode:n,get childNodes(){let d=[o],c=o;for(;(c=c.nextSibling)!==null;)d.push(c);return d}};U(t,r[0]??[],[],[R(L,null)],s,e)}}else i===0&&ee(a)&&oe(e,t,r,a);a=a.nextSibling}}var S=class extends Error{};async function de(e){let t=e.headers.get("Content-Type"),r=e.headers.get("X-Fresh-UUID");if(t!=="text/html; charset=utf-8")throw new Error(ae);let n=await e.text(),o=new DOMParser().parseFromString(n,"text/html"),a=[],i={},l=o.getElementById(`__FRSH_PARTIAL_DATA_${r}`),s=null;l!==null&&(s=JSON.parse(l.textContent),a.push(...Array.from(Object.entries(s.islands)).map(async f=>{let h=await import(`${f[1].url}`);i[f[0]]=h[f[1].export]})));let d=o.getElementById(`__FRSH_STATE_${r}`)?.textContent,c=[[],[]],p;s!==null&&s.signals!==null&&a.push(import(s.signals).then(f=>{p=f.signal}));let N;d&&s&&s.deserializer!==null&&a.push(import(s.deserializer).then(f=>N=f.deserialize)),await Promise.all(a),d&&(c=N?N(d,p):JSON.parse(d)?.v);let g=[];if(oe(g,i,c,o.body),g.length===0)throw new S(`Found no partials in HTML response. Please make sure to render at least one partial. Requested url: ${e.url}`);o.title&&(document.title=o.title),Array.from(o.head.childNodes).forEach(f=>{let h=f;if(h.nodeName!=="TITLE"){if(h.nodeName==="META"){let u=h;if(u.hasAttribute("charset"))return;let y=u.name;if(y!==""){let T=document.head.querySelector(`meta[name="${y}"]`);T!==null?T.content!==u.content&&(T.content=u.content):document.head.appendChild(u)}else{let T=h.getAttribute("property"),m=document.head.querySelector(`meta[property="${T}"]`);m!==null?m.content!==u.content&&(m.content=u.content):document.head.appendChild(u)}}else if(h.nodeName==="LINK"){let u=h;if(u.rel==="modulepreload")return;u.rel==="stylesheet"&&Array.from(document.head.querySelectorAll("link")).find(T=>T.href===u.href)===void 0&&document.head.appendChild(u)}else if(h.nodeName==="SCRIPT"){if(h.src===`${X}/refresh.js`)return}else if(h.nodeName==="STYLE"){let u=h;u.id===""&&document.head.appendChild(u)}}});for(let f=0;f<g.length;f++){let{vnode:h,marker:u}=g[f],y=ne.get(u.text);if(!y)console.warn(`Partial "${u.text}" not found. Skipping...`);else{let T=h.props.mode,m=h.props.children;if(T===0)y.props.children=m;else{let V=y.props.children,E=Array.isArray(V)?V:[V];if(T===1)E.push(m);else{$(m)||(m=R(L,null,m)),m.key==null&&(m.key=E.length);let F=y.__v.__k;if(Array.isArray(F))for(let A=0;A<F.length;A++){let x=F[A];if(x.key==null)x.key=A;else break}for(let A=0;A<E.length;A++){let x=E[A];if(x.key==null)x.key=A;else break}E.unshift(m)}y.props.children=E}y.setState({})}}}var Z=O.vnode;O.vnode=e=>{Y(e),e.type==="a"&&G(e,location.pathname),Z&&Z(e)};function M(e){if(e===null)return document.querySelector(`[${I}="true"]`)!==null;let t=e.closest(`[${I}]`);return t===null?!1:t.getAttribute(I)==="true"}var P=history.state?.index||0;if(!history.state){let e={index:P,scrollX,scrollY};history.replaceState(e,document.title)}function ie(e){if(e.href!==window.location.href){let t={index:P,scrollX:window.scrollX,scrollY:window.scrollY};history.replaceState({...t},"",location.href),P++,t.scrollX=0,t.scrollY=0,history.pushState(t,"",e.href)}}document.addEventListener("click",async e=>{let t=e.target;if(t&&t instanceof HTMLElement){let r=t;if(t.nodeName!=="A"&&(t=t.closest("a")),t&&t instanceof HTMLAnchorElement&&t.href&&(!t.target||t.target==="_self")&&t.origin===location.origin&&e.button===0&&!(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.button)&&!e.defaultPrevented){let n=t.getAttribute(w);if(t.getAttribute("href")?.startsWith("#")||!M(t))return;let o=t._freshIndicator;o!==void 0&&(o.value=!0),e.preventDefault();let a=new URL(t.href);try{ie(a);let i=new URL(n||a.href,location.href);await D(i),re(a),scrollTo({left:0,top:0,behavior:"instant"})}finally{o!==void 0&&(o.value=!1)}}else{let n=r;if(n.nodeName!=="A"&&(n=n.closest("button")),n!==null&&n instanceof HTMLButtonElement&&(n.type!=="submit"||n.form===null)){let o=n.getAttribute(w);if(o===null||!M(n))return;let a=new URL(o,location.href);await D(a)}}}});addEventListener("popstate",async e=>{if(e.state===null){history.scrollRestoration&&(history.scrollRestoration="auto");return}let t=history.state;if(P=t.index??P+1,!M(null)){location.reload();return}history.scrollRestoration&&(history.scrollRestoration="manual");let n=new URL(location.href,location.origin);try{await D(n),re(n),scrollTo({left:t.scrollX??0,top:t.scrollY??0,behavior:"instant"})}catch(o){if(o instanceof S){location.reload();return}throw o}});document.addEventListener("submit",async e=>{let t=e.target;if(t!==null&&t instanceof HTMLFormElement&&!e.defaultPrevented){if(!M(t)||e.submitter!==null&&!M(e.submitter))return;let r=e.submitter?.getAttribute("formmethod")?.toLowerCase()??t.method.toLowerCase();if(r!=="get"&&r!=="post"&&r!=="dialog")return;let n=e.submitter?.getAttribute(w)??e.submitter?.getAttribute("formaction")??t.getAttribute(w)??t.action;if(n!==""){e.preventDefault();let o=new URL(n,location.href),a;r==="get"?new URLSearchParams(new FormData(t)).forEach((l,s)=>o.searchParams.set(s,l)):a={body:new FormData(t),method:r},ie(o),await D(o,a)}}});export{de as applyPartials,Ce as revive};
