import{w as c}from"./index.d24781c1.js";import{V as l}from"./index.83fdecff.js";const f=c(!1),o=c(null),n=c([]),r=c(null);function u(a=1){var s,i;const t=l(n).length,e=l(n)[t-1];return l(o)||(s=e==null?void 0:e.callbacks)!=null&&s.onBeforeClose&&((i=e==null?void 0:e.callbacks)==null?void 0:i.onBeforeClose())===!1?!1:(l(f)&&t>0&&o.set(!0),f.set(!1),r.set("pop"),g(a),!0)}function d(){return u(1)}function p(a,t,e){l(o)||(r.set("push"),l(f)&&l(n).length&&o.set(!0),f.set(!1),e!=null&&e.replace?n.update(s=>[...s.slice(0,s.length-1),{component:a,props:t}]):n.update(s=>[...s,{component:a,props:t}]))}function g(a=1){n.update(t=>t.slice(0,Math.max(0,t.length-a)))}export{d as c,f as e,n as m,p as o,o as t};
