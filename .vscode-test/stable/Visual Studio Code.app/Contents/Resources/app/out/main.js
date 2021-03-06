/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
"use strict";function onReady(){perf.mark("main:appReady"),Promise.all([nodeCachedDataDir.ensureExists(),userDefinedLocale]).then(([e,r])=>{r&&!nlsConfiguration&&(nlsConfiguration=getNLSConfiguration(r)),nlsConfiguration||(nlsConfiguration=Promise.resolve(void 0)),nlsConfiguration.then(r=>{const n=r=>{r._languagePackSupport=!0,process.env.VSCODE_NLS_CONFIG=JSON.stringify(r),process.env.VSCODE_NODE_CACHED_DATA_DIR=e||"",require("./bootstrap-amd").load("vs/code/electron-main/main")};if(r)n(r);else{let e=app.getLocale();e?getNLSConfiguration(e=e.toLowerCase()).then(r=>{r||(r={locale:e,availableLanguages:{}}),n(r)}):n({locale:"en",availableLanguages:{}})}})},console.error)}function configureCommandlineSwitches(e,r){app.commandLine.appendSwitch("disable-mojo-local-storage"),app.commandLine.appendSwitch("disable-features","ColorCorrectRendering");const n=resolveJSFlags(e,r.jsFlags());n&&app.commandLine.appendSwitch("--js-flags",n)}function resolveJSFlags(e,...r){return e["js-flags"]&&r.push(e["js-flags"]),
e["max-memory"]&&!/max_old_space_size=(\d+)/g.exec(e["js-flags"])&&r.push(`--max_old_space_size=${e["max-memory"]}`),r.length>0?r.join(" "):null}function getUserDataPath(e){return portable.isPortable?path.join(portable.portableDataPath,"user-data"):path.resolve(e["user-data-dir"]||paths.getDefaultUserDataPath(process.platform))}function parseCLIArgs(){return require("minimist")(process.argv,{string:["user-data-dir","locale","js-flags","max-memory"]})}function setCurrentWorkingDirectory(){try{"win32"===process.platform?(process.env.VSCODE_CWD=process.cwd(),process.chdir(path.dirname(app.getPath("exe")))):process.env.VSCODE_CWD&&process.chdir(process.env.VSCODE_CWD)}catch(e){console.error(e)}}function registerListeners(){const e=[];global.macOpenFiles=e,app.on("open-file",function(r,n){e.push(n)});const r=[],n=function(e,n){e.preventDefault(),r.push(n)};app.on("will-finish-launching",function(){app.on("open-url",n)}),global.getOpenUrls=function(){return app.removeListener("open-url",n),r}}
function getNodeCachedDir(){return new class{constructor(){this.value=this._compute()}jsFlags(){return this.value?"--nolazy":void 0}ensureExists(){return mkdirp(this.value).then(()=>this.value,()=>{})}_compute(){if(process.argv.indexOf("--no-cached-data")>0)return;if(process.env.VSCODE_DEV)return;const e=product.commit;if(e)return path.join(userDataPath,"CachedData",e)}}}function stripComments(e){return e.replace(/("(?:[^\\\"]*(?:\\.)?)*")|('(?:[^\\\']*(?:\\.)?)*')|(\/\*(?:\r?\n|.)*?\*\/)|(\/{2,}.*?(?:(?:\r?\n)|$))/g,function(e,r,n,t,a){if(t)return"";if(a){const e=a.length;return e>2&&"\n"===a[e-1]?"\r"===a[e-2]?"\r\n":"\n":""}return e})}function mkdir(e){return new Promise((r,n)=>fs.mkdir(e,t=>t&&"EEXIST"!==t.code?n(t):r(e)))}function exists(e){return new Promise(r=>fs.exists(e,r))}function touch(e){return new Promise((r,n)=>{const t=new Date;fs.utimes(e,t,t,e=>e?n(e):r())})}function lstat(e){return new Promise((r,n)=>fs.lstat(e,(e,t)=>e?n(e):r(t)))}function readdir(e){
return new Promise((r,n)=>fs.readdir(e,(e,t)=>e?n(e):r(t)))}function rmdir(e){return new Promise((r,n)=>fs.rmdir(e,e=>e?n(e):r(void 0)))}function unlink(e){return new Promise((r,n)=>fs.unlink(e,e=>e?n(e):r(void 0)))}function mkdirp(e){return mkdir(e).then(null,r=>{if(r&&"ENOENT"===r.code){const r=path.dirname(e);if(r!==e)return mkdirp(r).then(()=>mkdir(e))}throw r})}function rimraf(e){return lstat(e).then(r=>r.isDirectory()&&!r.isSymbolicLink()?readdir(e).then(r=>Promise.all(r.map(r=>rimraf(path.join(e,r))))).then(()=>rmdir(e)):unlink(e),e=>{if("ENOENT"!==e.code)throw e})}function getUserDefinedLocale(){const e=args.locale;if(e)return Promise.resolve(e.toLowerCase());const r=path.join(userDataPath,"User","locale.json");return exists(r).then(e=>e?bootstrap.readFile(r).then(e=>{e=stripComments(e);try{const r=JSON.parse(e).locale;return r&&"string"==typeof r?r.toLowerCase():void 0}catch(e){return}}):void 0)}function getLanguagePackConfigurations(){const e=path.join(userDataPath,"languagepacks.json");try{
return require(e)}catch(e){}}function resolveLanguagePackLocale(e,r){try{for(;r;){if(e[r])return r;{const e=r.lastIndexOf("-");if(!(e>0))return;r=r.substring(0,e)}}}catch(e){console.error("Resolving language pack configuration failed.",e)}}function getNLSConfiguration(e){if("pseudo"===e)return Promise.resolve({locale:e,availableLanguages:{},pseudo:!0});if(process.env.VSCODE_DEV)return Promise.resolve({locale:e,availableLanguages:{}});if(e&&("en"===e||"en-us"===e))return Promise.resolve({locale:e,availableLanguages:{}});const r=e;perf.mark("nlsGeneration:start");const n=function(e){return perf.mark("nlsGeneration:end"),Promise.resolve({locale:e,availableLanguages:{}})};try{const t=product.commit;if(!t)return n(r);const a=getLanguagePackConfigurations();if(!a)return n(r);if(!(e=resolveLanguagePackLocale(a,e)))return n(r);const o=a[e];let s;return o&&"string"==typeof o.hash&&o.translations&&"string"==typeof(s=o.translations.vscode)?exists(s).then(a=>{if(!a)return n(r)
;const i=o.hash+"."+e,c=path.join(userDataPath,"clp",i),l=path.join(c,t),u=path.join(c,"tcf.json"),p=path.join(c,"corrupted.info"),f={locale:r,availableLanguages:{"*":e},_languagePackId:i,_translationsConfigFile:u,_cacheRoot:c,_resolvedLanguagePackCoreLocation:l,_corruptedFile:p};return exists(p).then(r=>{let t;return(t=r?rimraf(c):Promise.resolve(void 0)).then(()=>exists(l).then(r=>r?(touch(l).catch(()=>{}),perf.mark("nlsGeneration:end"),f):mkdirp(l).then(()=>Promise.all([bootstrap.readFile(path.join(__dirname,"nls.metadata.json")),bootstrap.readFile(s)])).then(e=>{const r=JSON.parse(e[0]),n=JSON.parse(e[1]).contents,t=Object.keys(r.bundles),a=[];for(let e of t){const t=r.bundles[e],o=Object.create(null);for(let e of t){const t=r.keys[e],a=r.messages[e],s=n[e];let i;if(s){i=[];for(let e=0;e<t.length;e++){const r=t[e];let n=s["string"==typeof r?r:r.key];void 0===n&&(n=a[e]),i.push(n)}}else i=a;o[e]=i}a.push(bootstrap.writeFile(path.join(l,e.replace(/\//g,"!")+".nls.json"),JSON.stringify(o)))}
return a.push(bootstrap.writeFile(u,JSON.stringify(o.translations))),Promise.all(a)}).then(()=>(perf.mark("nlsGeneration:end"),f)).catch(r=>(console.error("Generating translation files failed.",r),n(e)))))})}):n(r)}catch(r){return console.error("Generating translation files failed.",r),n(e)}}const perf=require("./vs/base/common/performance");perf.mark("main:started");const fs=require("fs"),path=require("path"),bootstrap=require("./bootstrap"),paths=require("./paths"),product=require("../product.json"),app=require("electron").app,portable=bootstrap.configurePortable();bootstrap.enableASARSupport();const args=parseCLIArgs(),userDataPath=getUserDataPath(args);app.setPath("userData",userDataPath),setCurrentWorkingDirectory(),registerListeners();let nlsConfiguration=void 0;const userDefinedLocale=getUserDefinedLocale();userDefinedLocale.then(e=>{e&&!nlsConfiguration&&(nlsConfiguration=getNLSConfiguration(e))});const nodeCachedDataDir=getNodeCachedDir();configureCommandlineSwitches(args,nodeCachedDataDir),
app.once("ready",function(){if(args.trace){const e=require("electron").contentTracing,r={categoryFilter:args["trace-category-filter"]||"*",traceOptions:args["trace-options"]||"record-until-full,enable-sampling"};e.startRecording(r,()=>onReady())}else onReady()});
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/bc24f98b5f70467bc689abf41cc5550ca637088e/core/main.js.map
