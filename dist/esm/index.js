import n from 'glob';
import { resolve } from 'path';

var i="WebpackWatchExternalFilesPlugin";var p=c=>{let{filesToWatch:s,filesToExclude:l}=c.reduce((e,o)=>{if(o[0]!=="!"){let t=n.sync(o);e.filesToWatch.push(...t);}else {let t=n.sync(o.substr(1));e.filesToExclude.push(...t);}return e},{filesToWatch:[],filesToExclude:[]});return Array.from(new Set(s.filter(e=>!l.includes(e)))).map(e=>resolve(e))},r=class{constructor({files:s}){this.files=s;}apply(s){let l=s.getInfrastructureLogger(i);s.hooks.initialize.tap(i,()=>{l.info("Watching External Files:",this.files);}),s.hooks.afterCompile.tapAsync(i,(f,e)=>{p(this.files).map(t=>f.fileDependencies.add(t)),e();});}},d=r;

export { d as default };
