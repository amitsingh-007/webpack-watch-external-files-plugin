'use strict';

var glob = require('glob');
var path = require('path');

var i="WebpackWatchExternalFilesPlugin";var p=c=>{let{filesToWatch:s,filesToExclude:l}=c.reduce((e,o)=>{if(o[0]!=="!"){let t=glob.globSync(o);e.filesToWatch.push(...t);}else {let t=glob.globSync(o.substr(1));e.filesToExclude.push(...t);}return e},{filesToWatch:[],filesToExclude:[]});return Array.from(new Set(s.filter(e=>!l.includes(e)))).map(e=>path.resolve(e))},r=class{files;constructor({files:s}){this.files=s;}apply(s){let l=s.getInfrastructureLogger(i);s.hooks.initialize.tap(i,()=>{l.info("Watching External Files:",this.files);}),s.hooks.afterCompile.tapAsync(i,(f,e)=>{p(this.files).map(t=>f.fileDependencies.add(t)),e();});}},d=r;

module.exports = d;
