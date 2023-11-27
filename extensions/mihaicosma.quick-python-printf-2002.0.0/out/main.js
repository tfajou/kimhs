"use strict";var g=Object.create;var l=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var h=Object.getPrototypeOf,y=Object.prototype.hasOwnProperty;var E=(e,t)=>{for(var n in t)l(e,n,{get:t[n],enumerable:!0})},v=(e,t,n,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of w(t))!y.call(e,i)&&i!==n&&l(e,i,{get:()=>t[i],enumerable:!(o=x(t,i))||o.enumerable});return e};var C=(e,t,n)=>(n=e!=null?g(h(e)):{},v(t||!e||!e.__esModule?l(n,"default",{value:e,enumerable:!0}):n,e)),T=e=>v(l({},"__esModule",{value:!0}),e);var $={};E($,{activate:()=>W});module.exports=T($);var s=C(require("vscode")),A=(e,t)=>(e.isEmpty?t:s.window.activeTextEditor.document.getText(e).trim()).includes("print")?[]:(t.match(/.+?(?=\=|\+=|\-=|\/=|\/\/=|\*=|\%=)/)||[]).filter(n=>/^[A-Za-z0-9_,\.\s]+$/.test(n)).flatMap(n=>n.includes(",")?n.split(/\s*,\s*/):[n.trim()]);async function b(e){let t=s.window.activeTextEditor,n=t.document.lineAt(t.selection.start.line).text;for(let o of e.match("variable")?t.selection.isEmpty?A(t.selection,n):[t.document.getText(t.selection)]:[""]){let i=`print(${e.replace("variable",o)})`;n.trim()&&await s.commands.executeCommand("editor.action.insertLineAfter"),await t.edit(d=>{let m=n.trim()?t.selection.start:t.selection.end;d.insert(m,i)})}}async function u(e){let t=s.window.activeTextEditor,n=e==="down"?t.selection.end.line:0,o=e==="up"?t.selection.start.line:t.document.lineCount;await t.edit(i=>{let d=t.selection.isEmpty?n:t.selection.start.line,m=t.selection.isEmpty?o:t.selection.end.line;for(let a=d;a<=m;a++){let r=t.document.lineAt(a),p=r.firstNonWhitespaceCharacterIndex;if(r.text.trim().startsWith("print(")||r.text.trim().startsWith("prints("))i.insert(new s.Position(a,p),"# ");else if(!t.selection.isEmpty&&(r.text.trim().startsWith("# print(")||r.text.trim().startsWith("# prints("))){let f=new s.Range(r.range.start.translate(0,p),r.range.start.translate(0,p+2));i.delete(f)}}})}async function P(){let e=s.window.activeTextEditor,{start:t,end:n}=e.selection.isEmpty?{start:0,end:e.document.lineCount-1}:{start:e.selection.start.line,end:e.selection.end.line};await e.edit(o=>{for(let i=n;i>=t;i--)/^(# )?(print|prints)\(/.test(e.document.lineAt(i).text.trim())&&o.delete(e.document.lineAt(i).rangeIncludingLineBreak)})}function c(e,t,n,o=null){e.subscriptions.push(s.commands.registerCommand(t,()=>{n(o)}))}function W(e){console.log("Quick Python Print is now active!");for(let t=1;t<=5;t++)c(e,`extension.python-printf${t}`,b,s.workspace.getConfiguration().get(`customFString${t}`));c(e,"extension.python-print-commentall",u,"all"),c(e,"extension.python-print-commentup",u,"up"),c(e,"extension.python-print-commentdown",u,"down"),c(e,"extension.python-print-deleteall",P)}0&&(module.exports={activate});
