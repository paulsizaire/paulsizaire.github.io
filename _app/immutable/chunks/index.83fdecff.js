function j(){}function nt(t,e){for(const n in e)t[n]=e[n];return t}function rt(t){return!!t&&(typeof t=="object"||typeof t=="function")&&typeof t.then=="function"}function Q(t){return t()}function J(){return Object.create(null)}function k(t){t.forEach(Q)}function R(t){return typeof t=="function"}function kt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function it(t){return Object.keys(t).length===0}function U(t,...e){if(t==null)return j;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function vt(t){let e;return U(t,n=>e=n)(),e}function Et(t,e,n){t.$$.on_destroy.push(U(e,n))}function Nt(t,e,n,r){if(t){const i=V(t,e,n,r);return t[0](i)}}function V(t,e,n,r){return t[1]&&r?nt(n.ctx.slice(),t[1](r(e))):n.ctx}function St(t,e,n,r){if(t[2]&&r){const i=t[2](r(n));if(e.dirty===void 0)return i;if(typeof i=="object"){const l=[],c=Math.max(e.dirty.length,i.length);for(let o=0;o<c;o+=1)l[o]=e.dirty[o]|i[o];return l}return e.dirty|i}return e.dirty}function jt(t,e,n,r,i,l){if(i){const c=V(e,n,r,l);t.p(c,i)}}function At(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let r=0;r<n;r++)e[r]=-1;return e}return-1}function Mt(t){return t??""}function Ct(t,e,n){return t.set(n),e}let A=!1;function ct(){A=!0}function st(){A=!1}function ut(t,e,n,r){for(;t<e;){const i=t+(e-t>>1);n(i)<=r?t=i+1:e=i}return t}function lt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const s=[];for(let u=0;u<e.length;u++){const d=e[u];d.claim_order!==void 0&&s.push(d)}e=s}const n=new Int32Array(e.length+1),r=new Int32Array(e.length);n[0]=-1;let i=0;for(let s=0;s<e.length;s++){const u=e[s].claim_order,d=(i>0&&e[n[i]].claim_order<=u?i+1:ut(1,i,a=>e[n[a]].claim_order,u))-1;r[s]=n[d]+1;const _=d+1;n[_]=s,i=Math.max(_,i)}const l=[],c=[];let o=e.length-1;for(let s=n[i]+1;s!=0;s=r[s-1]){for(l.push(e[s-1]);o>=s;o--)c.push(e[o]);o--}for(;o>=0;o--)c.push(e[o]);l.reverse(),c.sort((s,u)=>s.claim_order-u.claim_order);for(let s=0,u=0;s<c.length;s++){for(;u<l.length&&c[s].claim_order>=l[u].claim_order;)u++;const d=u<l.length?l[u]:null;t.insertBefore(c[s],d)}}function ot(t,e){if(A){for(lt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Ot(t,e,n){A&&!n?ot(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function at(t){t.parentNode&&t.parentNode.removeChild(t)}function Bt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function ft(t){return document.createElement(t)}function dt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function z(t){return document.createTextNode(t)}function Lt(){return z(" ")}function Pt(){return z("")}function Tt(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function qt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function zt(t){return t===""?null:+t}function _t(t){return Array.from(t.childNodes)}function ht(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function X(t,e,n,r,i=!1){ht(t);const l=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const o=t[c];if(e(o)){const s=n(o);return s===void 0?t.splice(c,1):t[c]=s,i||(t.claim_info.last_index=c),o}}for(let c=t.claim_info.last_index-1;c>=0;c--){const o=t[c];if(e(o)){const s=n(o);return s===void 0?t.splice(c,1):t[c]=s,i?s===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,o}}return r()})();return l.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,l}function Y(t,e,n,r){return X(t,i=>i.nodeName===e,i=>{const l=[];for(let c=0;c<i.attributes.length;c++){const o=i.attributes[c];n[o.name]||l.push(o.name)}l.forEach(c=>i.removeAttribute(c))},()=>r(e))}function Dt(t,e,n){return Y(t,e,n,ft)}function Ft(t,e,n){return Y(t,e,n,dt)}function mt(t,e){return X(t,n=>n.nodeType===3,n=>{const r=""+e;if(n.data.startsWith(r)){if(n.data.length!==r.length)return n.splitText(r.length)}else n.data=r},()=>z(e),!0)}function Ht(t){return mt(t," ")}function It(t,e){e=""+e,t.data!==e&&(t.data=e)}function Wt(t,e){t.value=e??""}function Gt(t,e,n,r){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,r?"important":"")}function Jt(t,e){return new t(e)}let v;function g(t){v=t}function D(){if(!v)throw new Error("Function called outside component initialization");return v}function Kt(t){D().$$.on_mount.push(t)}function Qt(t){D().$$.after_update.push(t)}const w=[],K=[];let $=[];const P=[],Z=Promise.resolve();let T=!1;function tt(){T||(T=!0,Z.then(F))}function Rt(){return tt(),Z}function q(t){$.push(t)}function Ut(t){P.push(t)}const L=new Set;let x=0;function F(){if(x!==0)return;const t=v;do{try{for(;x<w.length;){const e=w[x];x++,g(e),pt(e.$$)}}catch(e){throw w.length=0,x=0,e}for(g(null),w.length=0,x=0;K.length;)K.pop()();for(let e=0;e<$.length;e+=1){const n=$[e];L.has(n)||(L.add(n),n())}$.length=0}while(w.length);for(;P.length;)P.pop()();T=!1,L.clear(),g(t)}function pt(t){if(t.fragment!==null){t.update(),k(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(q)}}function yt(t){const e=[],n=[];$.forEach(r=>t.indexOf(r)===-1?e.push(r):n.push(r)),n.forEach(r=>r()),$=e}const S=new Set;let b;function gt(){b={r:0,c:[],p:b}}function bt(){b.r||k(b.c),b=b.p}function H(t,e){t&&t.i&&(S.delete(t),t.i(e))}function et(t,e,n,r){if(t&&t.o){if(S.has(t))return;S.add(t),b.c.push(()=>{S.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}else r&&r()}function Vt(t,e){const n=e.token={};function r(i,l,c,o){if(e.token!==n)return;e.resolved=o;let s=e.ctx;c!==void 0&&(s=s.slice(),s[c]=o);const u=i&&(e.current=i)(s);let d=!1;e.block&&(e.blocks?e.blocks.forEach((_,a)=>{a!==l&&_&&(gt(),et(_,1,1,()=>{e.blocks[a]===_&&(e.blocks[a]=null)}),bt())}):e.block.d(1),u.c(),H(u,1),u.m(e.mount(),e.anchor),d=!0),e.block=u,e.blocks&&(e.blocks[l]=u),d&&F()}if(rt(t)){const i=D();if(t.then(l=>{g(i),r(e.then,1,e.value,l),g(null)},l=>{if(g(i),r(e.catch,2,e.error,l),g(null),!e.hasCatch)throw l}),e.current!==e.pending)return r(e.pending,0),!0}else{if(e.current!==e.then)return r(e.then,1,e.value,t),!0;e.resolved=t}}function Xt(t,e,n){const r=e.slice(),{resolved:i}=t;t.current===t.then&&(r[t.value]=i),t.current===t.catch&&(r[t.error]=i),t.block.p(r,n)}function Yt(t,e){et(t,1,1,()=>{e.delete(t.key)})}function Zt(t,e,n,r,i,l,c,o,s,u,d,_){let a=t.length,m=l.length,h=a;const M={};for(;h--;)M[t[h].key]=h;const E=[],C=new Map,O=new Map,I=[];for(h=m;h--;){const f=_(i,l,h),p=n(f);let y=c.get(p);y?r&&I.push(()=>y.p(f,e)):(y=u(p,f),y.c()),C.set(p,E[h]=y),p in M&&O.set(p,Math.abs(h-M[p]))}const W=new Set,G=new Set;function B(f){H(f,1),f.m(o,d),c.set(f.key,f),d=f.first,m--}for(;a&&m;){const f=E[m-1],p=t[a-1],y=f.key,N=p.key;f===p?(d=f.first,a--,m--):C.has(N)?!c.has(y)||W.has(y)?B(f):G.has(N)?a--:O.get(y)>O.get(N)?(G.add(y),B(f)):(W.add(N),a--):(s(p,c),a--)}for(;a--;){const f=t[a];C.has(f.key)||s(f,c)}for(;m;)B(E[m-1]);return k(I),E}function te(t,e){const n={},r={},i={$$scope:1};let l=t.length;for(;l--;){const c=t[l],o=e[l];if(o){for(const s in c)s in o||(r[s]=1);for(const s in o)i[s]||(n[s]=o[s],i[s]=1);t[l]=o}else for(const s in c)i[s]=1}for(const c in r)c in n||(n[c]=void 0);return n}function ee(t){return typeof t=="object"&&t!==null?t:{}}function ne(t,e,n){const r=t.$$.props[e];r!==void 0&&(t.$$.bound[r]=n,n(t.$$.ctx[r]))}function re(t){t&&t.c()}function ie(t,e){t&&t.l(e)}function xt(t,e,n,r){const{fragment:i,after_update:l}=t.$$;i&&i.m(e,n),r||q(()=>{const c=t.$$.on_mount.map(Q).filter(R);t.$$.on_destroy?t.$$.on_destroy.push(...c):k(c),t.$$.on_mount=[]}),l.forEach(q)}function wt(t,e){const n=t.$$;n.fragment!==null&&(yt(n.after_update),k(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function $t(t,e){t.$$.dirty[0]===-1&&(w.push(t),tt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ce(t,e,n,r,i,l,c,o=[-1]){const s=v;g(t);const u=t.$$={fragment:null,ctx:[],props:l,update:j,not_equal:i,bound:J(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(s?s.$$.context:[])),callbacks:J(),dirty:o,skip_bound:!1,root:e.target||s.$$.root};c&&c(u.root);let d=!1;if(u.ctx=n?n(t,e.props||{},(_,a,...m)=>{const h=m.length?m[0]:a;return u.ctx&&i(u.ctx[_],u.ctx[_]=h)&&(!u.skip_bound&&u.bound[_]&&u.bound[_](h),d&&$t(t,_)),a}):[],u.update(),d=!0,k(u.before_update),u.fragment=r?r(u.ctx):!1,e.target){if(e.hydrate){ct();const _=_t(e.target);u.fragment&&u.fragment.l(_),_.forEach(at)}else u.fragment&&u.fragment.c();e.intro&&H(t.$$.fragment),xt(t,e.target,e.anchor,e.customElement),st(),F()}g(s)}class se{$destroy(){wt(this,1),this.$destroy=j}$on(e,n){if(!R(n))return j;const r=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return r.push(n),()=>{const i=r.indexOf(n);i!==-1&&r.splice(i,1)}}$set(e){this.$$set&&!it(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{ne as $,xt as A,wt as B,Nt as C,jt as D,At as E,St as F,Et as G,Zt as H,Ct as I,Yt as J,te as K,ee as L,Vt as M,Xt as N,nt as O,j as P,ot as Q,Tt as R,se as S,Bt as T,k as U,vt as V,Wt as W,zt as X,dt as Y,Ft as Z,Mt as _,Lt as a,Ut as a0,Ot as b,Ht as c,et as d,Pt as e,bt as f,H as g,at as h,ce as i,Qt as j,ft as k,Dt as l,_t as m,qt as n,Kt as o,Gt as p,z as q,mt as r,kt as s,Rt as t,It as u,gt as v,K as w,Jt as x,re as y,ie as z};
