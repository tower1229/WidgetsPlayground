/*! Sea.js 2.3.0 | seajs.org/LICENSE.md */
!function(a,b){function c(a){return function(b){return{}.toString.call(b)=="[object "+a+"]"}}function d(){return z++}function e(a){return a.match(C)[0]}function f(a){for(a=a.replace(D,"/"),a=a.replace(F,"$1/");a.match(E);)a=a.replace(E,"/");return a}function g(a){var b=a.length-1,c=a.charAt(b);return"#"===c?a.substring(0,b):".js"===a.substring(b-2)||a.indexOf("?")>0||"/"===c?a:a+".js"}function h(a){var b=u.alias;return b&&w(b[a])?b[a]:a}function i(a){var b=u.paths,c;return b&&(c=a.match(G))&&w(b[c[1]])&&(a=b[c[1]]+c[2]),a}function j(a){var b=u.vars;return b&&a.indexOf("{")>-1&&(a=a.replace(H,function(a,c){return w(b[c])?b[c]:a})),a}function k(a){var b=u.map,c=a;if(b)for(var d=0,e=b.length;e>d;d++){var f=b[d];if(c=y(f)?f(a)||a:a.replace(f[0],f[1]),c!==a)break}return c}function l(a,b){var c,d=a.charAt(0);if(I.test(a))c=a;else if("."===d)c=f((b?e(b):u.cwd)+a);else if("/"===d){var g=u.cwd.match(J);c=g?g[0]+a.substring(1):a}else c=u.base+a;return 0===c.indexOf("//")&&(c=location.protocol+c),c}function m(a,b){if(!a)return"";a=h(a),a=i(a),a=j(a),a=g(a);var c=l(a,b);return c=k(c)}function n(a){return a.hasAttribute?a.src:a.getAttribute("src",4)}function o(a,b,c){var d=K.createElement("script");if(c){var e=y(c)?c(a):c;e&&(d.charset=e)}p(d,b,a),d.async=!0,d.src=a,R=d,Q?P.insertBefore(d,Q):P.appendChild(d),R=null}function p(a,b,c){function d(){a.onload=a.onerror=a.onreadystatechange=null,u.debug||P.removeChild(a),a=null,b()}var e="onload"in a;e?(a.onload=d,a.onerror=function(){B("error",{uri:c,node:a}),d()}):a.onreadystatechange=function(){/loaded|complete/.test(a.readyState)&&d()}}function q(){if(R)return R;if(S&&"interactive"===S.readyState)return S;for(var a=P.getElementsByTagName("script"),b=a.length-1;b>=0;b--){var c=a[b];if("interactive"===c.readyState)return S=c}}function r(a){var b=[];return a.replace(U,"").replace(T,function(a,c,d){d&&b.push(d)}),b}function s(a,b){this.uri=a,this.dependencies=b||[],this.exports=null,this.status=0,this._waitings={},this._remain=0}if(!a.seajs){var t=a.seajs={version:"2.3.0"},u=t.data={},v=c("Object"),w=c("String"),x=Array.isArray||c("Array"),y=c("Function"),z=0,A=u.events={};t.on=function(a,b){var c=A[a]||(A[a]=[]);return c.push(b),t},t.off=function(a,b){if(!a&&!b)return A=u.events={},t;var c=A[a];if(c)if(b)for(var d=c.length-1;d>=0;d--)c[d]===b&&c.splice(d,1);else delete A[a];return t};var B=t.emit=function(a,b){var c=A[a],d;if(c){c=c.slice();for(var e=0,f=c.length;f>e;e++)c[e](b)}return t},C=/[^?#]*\//,D=/\/\.\//g,E=/\/[^/]+\/\.\.\//,F=/([^:/])\/+\//g,G=/^([^/:]+)(\/.+)$/,H=/{([^{]+)}/g,I=/^\/\/.|:\//,J=/^.*?\/\/.*?\//,K=document,L=location.href&&0!==location.href.indexOf("about:")?e(location.href):"",M=K.scripts,N=K.getElementById("seajsnode")||M[M.length-1],O=e(n(N)||L);t.resolve=m;var P=K.head||K.getElementsByTagName("head")[0]||K.documentElement,Q=P.getElementsByTagName("base")[0],R,S;t.request=o;var T=/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g,U=/\\\\/g,V=t.cache={},W,X={},Y={},Z={},$=s.STATUS={FETCHING:1,SAVED:2,LOADING:3,LOADED:4,EXECUTING:5,EXECUTED:6};s.prototype.resolve=function(){for(var a=this,b=a.dependencies,c=[],d=0,e=b.length;e>d;d++)c[d]=s.resolve(b[d],a.uri);return c},s.prototype.load=function(){var a=this;if(!(a.status>=$.LOADING)){a.status=$.LOADING;var c=a.resolve();B("load",c);for(var d=a._remain=c.length,e,f=0;d>f;f++)e=s.get(c[f]),e.status<$.LOADED?e._waitings[a.uri]=(e._waitings[a.uri]||0)+1:a._remain--;if(0===a._remain)return a.onload(),b;var g={};for(f=0;d>f;f++)e=V[c[f]],e.status<$.FETCHING?e.fetch(g):e.status===$.SAVED&&e.load();for(var h in g)g.hasOwnProperty(h)&&g[h]()}},s.prototype.onload=function(){var a=this;a.status=$.LOADED,a.callback&&a.callback();var b=a._waitings,c,d;for(c in b)b.hasOwnProperty(c)&&(d=V[c],d._remain-=b[c],0===d._remain&&d.onload());delete a._waitings,delete a._remain},s.prototype.fetch=function(a){function c(){t.request(g.requestUri,g.onRequest,g.charset)}function d(){delete X[h],Y[h]=!0,W&&(s.save(f,W),W=null);var a,b=Z[h];for(delete Z[h];a=b.shift();)a.load()}var e=this,f=e.uri;e.status=$.FETCHING;var g={uri:f};B("fetch",g);var h=g.requestUri||f;return!h||Y[h]?(e.load(),b):X[h]?(Z[h].push(e),b):(X[h]=!0,Z[h]=[e],B("request",g={uri:f,requestUri:h,onRequest:d,charset:u.charset}),g.requested||(a?a[g.requestUri]=c:c()),b)},s.prototype.exec=function(){function a(b){return s.get(a.resolve(b)).exec()}var c=this;if(c.status>=$.EXECUTING)return c.exports;c.status=$.EXECUTING;var e=c.uri;a.resolve=function(a){return s.resolve(a,e)},a.async=function(b,c){return s.use(b,c,e+"_async_"+d()),a};var f=c.factory,g=y(f)?f(a,c.exports={},c):f;return g===b&&(g=c.exports),delete c.factory,c.exports=g,c.status=$.EXECUTED,B("exec",c),g},s.resolve=function(a,b){var c={id:a,refUri:b};return B("resolve",c),c.uri||t.resolve(c.id,b)},s.define=function(a,c,d){var e=arguments.length;1===e?(d=a,a=b):2===e&&(d=c,x(a)?(c=a,a=b):c=b),!x(c)&&y(d)&&(c=r(""+d));var f={id:a,uri:s.resolve(a),deps:c,factory:d};if(!f.uri&&K.attachEvent){var g=q();g&&(f.uri=g.src)}B("define",f),f.uri?s.save(f.uri,f):W=f},s.save=function(a,b){var c=s.get(a);c.status<$.SAVED&&(c.id=b.id||a,c.dependencies=b.deps||[],c.factory=b.factory,c.status=$.SAVED,B("save",c))},s.get=function(a,b){return V[a]||(V[a]=new s(a,b))},s.use=function(b,c,d){var e=s.get(d,x(b)?b:[b]);e.callback=function(){for(var b=[],d=e.resolve(),f=0,g=d.length;g>f;f++)b[f]=V[d[f]].exec();c&&c.apply(a,b),delete e.callback},e.load()},t.use=function(a,b){return s.use(a,b,u.cwd+"_use_"+d()),t},s.define.cmd={},a.define=s.define,t.Module=s,u.fetchedList=Y,u.cid=d,t.require=function(a){var b=s.get(s.resolve(a));return b.status<$.EXECUTING&&(b.onload(),b.exec()),b.exports},u.base=O,u.dir=O,u.cwd=L,u.charset="utf-8",t.config=function(a){for(var b in a){var c=a[b],d=u[b];if(d&&v(d))for(var e in c)d[e]=c[e];else x(d)?c=d.concat(c):"base"===b&&("/"!==c.slice(-1)&&(c+="/"),c=l(c)),u[b]=c}return B("config",a),t}}}(this);
/* Seajs.style.js */
!function(){var a,b=/\W/g,c=document,d=document.getElementsByTagName("head")[0]||document.documentElement;seajs.importStyle=function(e,f){if(!f||(f=f.replace(b,"-"),!c.getElementById(f))){var g;if(!a||f?(g=c.createElement("style"),f&&(g.id=f),d.appendChild(g)):g=a,void 0!==g.styleSheet){if(c.getElementsByTagName("style").length>31)throw new Error("Exceed the maximal count of style tags in IE");g.styleSheet.cssText+=e}else g.appendChild(c.createTextNode(e));f||(a=g)}},define("seajs/seajs-style/1.0.2/seajs-style",[],{})}();

// 插件设置
seajs.set = {
	util: {
		timeout: 1.5e4
	}
};

(function(seajs){
    var mod = {
        'audio/audio'                       : 'v1.0.1',
        'copy/ZeroClipboard'                : 'v0.0.1',
        'flv/flv'                           : 'v0.0.2',
        'jquery/1/jquery'                   : 'v1.11.3',
        'jquery/2/jquery'                   : 'v2.1.4',
        'jquery/3/jquery'                   : 'v3.1.1',
        'raty/raty'                         : 'v0.1.0',
        'upload/upload'                     : 'v1.1.1',
        'upload/makethumb'                  : 'v0.0.1',
        'upload/localResizeIMG'             : 'v0.0.1',
        'validform/validform'               : 'v2.4.6',
        'video/video'                       : 'v0.0.1',
        'webuploader/webuploader'           : 'v1.0.0',
        'album'                             : 'v2.2.13',
        'appcan'                            : 'v0.1.0',
        'autocomplete'                      : 'v0.1.0',
        'badge'                             : 'v0.0.1',
        'base'                              : 'v3.3.3',
        'bdshare'                           : 'v3.1.2',
        'box'                               : 'v3.11.7',
        'city-select'                       : 'v1.0.2',
        'collapse'                          : 'v0.0.1',
        'countdown'                         : 'v1.1.1',
        'datepicker'                        : 'v2.0.2',
        'drag'                              : 'v0.8.0',
        'drag-panel'                        : 'v0.0.2',
        'dropdown'                          : 'v0.2.3',
        'easing'                            : 'v0.0.1',
        'echarts'                           : 'v0.1.0',
        'etpl'                              : 'v0.1.1',
        'img-loaded'                        : 'v0.0.1',
        'img-ready'                         : 'v1.0.0',
        'input-number'                      : 'v0.1.3',
        'input'                             : 'v0.1.1',
        'instantclick'                      : 'v0.0.1',
        'label'                             : 'v0.0.1',
        'lazyload'                          : 'v2.1.0',
        'marquee'                           : 'v0.10.1',
        'masonry'                           : 'v0.0.1',
        'menu'                              : 'v0.1.1',
        'mousemenu'                         : 'v1.0.1',
        'mousetrap'                         : 'v1.5.3',
        'mousewheel'                        : 'v0.0.1',
        'notice'                            : 'v0.0.3',
        'offcanvas'                         : 'v2.0.4',
        'on-scroll'                         : 'v2.1.3',
        'page'                              : 'v1.0.3',
        'paging-load'                       : 'v0.0.1',
        'pjax'                              : 'v0.0.1',
        'placeholder'                       : 'v0.0.1',
        'progress'                          : 'v0.0.3',
        'qr'                                : 'v0.1.0',
        'responsive'                        : 'v0.0.1',
        'scroll-bar'                        : 'v2.2.8',
        'scroll-col'                        : 'v4.2.4',
        'scroll-load'                       : 'v1.0.0',
        'scroll-row'                        : 'v3.0.6',
        'select'                            : 'v4.3.3',
        'sendcode'                          : 'v0.2.0',
        'slide'                             : 'v4.2.2',
        'slider'                            : 'v0.0.2',
        'spin'                              : 'v0.0.2',
        'switch'                            : 'v0.3.0',
        'tab'                               : 'v4.1.1',
        'table'                             : 'v1.5.3',
        'timepicker'                        : 'v0.1.1',
        'tip'                               : 'v1.5.0',
        'touch'                             : 'v0.1.1',
        'zoom'                              : 'v2.0.4'
    };
    var manifest = {};
    for(var key in mod){
        manifest[seajs.data.base + key + '.js'] = mod[key];
    }
    if(seajs.data.localcache){
        seajs.data.localcache.manifest = manifest;
    }else{
        seajs.data.localcache = {
            timeout: 2e4,
            manifest: manifest
        };
    }
})(seajs);
/**
 * Localcache
 * (c) 2012-2013 dollydeng@qzone
 * Distributed under the MIT license.
 */
(function(seajs){
    if(!window.window.JSON || !window.localStorage || seajs.data.debug) return
    var module = seajs.Module,
        data = seajs.data,
        fetch = module.prototype.fetch,
        defaultSyntax = ['??',',']
    var remoteManifest = (data.localcache && data.localcache.manifest) || {} 
    var storage = {
        _maxRetry: 1,
        _retry: true,
        get: function(key, parse){
            var val
            try{
                val = localStorage.getItem(key)
            }catch(e){
                return undefined
            }
            if(val){
                return parse? JSON.parse(val):val
            }else{
                return undefined
            }
        },
        set: function(key, val, retry){
            retry = ( typeof retry == 'undefined' ) ? this._retry : retry
            try{
                localStorage.setItem(key, val)
            }catch(e){
                if(retry) {
                    var max = this._maxRetry
                    while(max > 0) {
                        max --
                        this.removeAll()
                        this.set(key, val, false)
                    }
                }
            }
        },
        remove: function(url){
            try{
                localStorage.removeItem(url)
            }catch(e){}
        },
        removeAll: function(){
            /**
             * Default localstorage clean
             * delete localstorage items which are not in latest manifest
             */
            var prefix = (data.localcache && data.localcache.prefix) || /^https?\:/
            for(var i=localStorage.length-1; i>=0; i--) {
                var key = localStorage.key(i)
                if(!prefix.test(key)) continue  //Notice: change the search pattern if not match with your manifest style
                if(!remoteManifest[key]){
                    localStorage.removeItem(key)
                }
            }
        }
    }

    var localManifest = storage.get('manifest',true) || {}

    if(!remoteManifest){
        //failed to fetch latest version and local version is broken.
        return
    }

    /**
     * Check whether the code is complete and clean
     * @param url
     * @param code
     * @return {Boolean}
     */
    var validate = (data.localcache && data.localcache.validate) || function(url, code){
        if(!code || !url) return false
        else return true
    }

    var fetchAjax = function(url, callback){
        var xhr = new window.XMLHttpRequest()
        var timer = setTimeout(function(){
            xhr.abort()
            callback(null)
        }, (data.localcache && data.localcache.timeout) || 30000)
        xhr.open('GET',url,true)
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4){
                clearTimeout(timer)
                if(xhr.status === 200){
                    callback(xhr.responseText)
                }else{
                    callback(null)
                }
            }
        }
        xhr.send(null)
    }

    /**
     * run code in window environment
     * @param url
     * @param code
     */
    var use = function(url, code){
        if(code && /\S/.test(code)){
            if(/\.css(?:\?|$)/i.test(url)) {
                var doc = document,  
                    node = doc.createElement('style')
                doc.getElementsByTagName("head")[0].appendChild(node)
                if(node.styleSheet) {
                  node.styleSheet.cssText = code
                } else {
                  node.appendChild(doc.createTextNode(code))
                }
            } else {
                try{
                    code += '//# sourceURL='+ url  //for chrome debug
                    ;(window.execScript || function(data){ window['eval'].call(window,data)})(code)
                }catch(e){
                    return false
                }
            }
        }
        return true
    }

    var isCombo = function(url){
        var sign = (data.comboSyntax && data.comboSyntax[0]) || '??'
        return url.indexOf(sign) >= 0
    }

    var splitComboUrl = function(url){
        var syntax = data.comboSyntax || defaultSyntax
        var arr = url.split(syntax[0])
        if(arr.length != 2) return url
        var host = arr[0]
        var urls = arr[1].split(syntax[1])
        var result = {}
        result.host = host
        result.files = []
        for(var i= 0,len = urls.length;i<len;i++){
            result.files.push(urls[i])
        }
        return result
    }

    /**
     * Warning: rewrite this function to fit your combo file structure
     * Default: split by define(function(){})
     * @param code
     */
    var splitCombo = (data.localcache && data.localcache.splitCombo) || function(code, url, files){
        var arr = code.split('define')
        var result = []
        for(var i= 0,len = arr.length;i<len;i++){
            if(arr[i]){
                result.push('define'+arr[i])
            }
        }
        return result
    }


    var fetchingList = {}
    var onLoad = function(url){
        var mods = fetchingList[url]
        delete fetchingList[url]
        while ((m = mods.shift())) m.load()
    }

    module.prototype.fetch = function(requestCache){
        var mod = this
        seajs.emit('fetch',mod)
        var url = mod.requestUri || mod.uri
        var isComboUrl = isCombo(url)

        if(fetchingList[url]){
            fetchingList[url].push(mod)
            return
        }
        fetchingList[url] = [mod]

        var fallback = function(url){
            delete fetchingList[url]
            fetch.call(mod,requestCache)
        }
        if(!isComboUrl && remoteManifest[url]){
            //in version control
            var cached = storage.get(url)
            var cachedValidated = validate(url, cached)
            if(remoteManifest[url] == localManifest[url] && cachedValidated){
                //cached version is ready to go
                if(!use(url, cached)){
                    fallback(url)
                }else{
                    onLoad(url)
                }
            }else{
                //otherwise, get latest version from network
                fetchAjax(url + '?v='+Math.random().toString(), function(resp){
                    if(resp && validate(url, resp)){
                        if(!use(url, resp)){
                            fallback(url)
                        }else{
                            localManifest[url] = remoteManifest[url]
                            storage.set('manifest', JSON.stringify(localManifest))  //update one by one
                            storage.set(url, resp)
                            onLoad(url)
                        }
                    }else{
                        fallback(url)
                    }
                })
            }
        }else if(isComboUrl){

            //try to find available code cache
            var splited = splitComboUrl(url), needFetchAjax = false
            for(var i= splited.files.length - 1;i>=0;i--){
                var file = splited.host + splited.files[i]
                var cached = storage.get(file)
                var cachedValidated = validate(file, cached)
                if(remoteManifest[file]){
                    needFetchAjax = true
                    if(remoteManifest[file] == localManifest[file] && cachedValidated) {
                      use(file, cached)
                      splited.files.splice(i,1)  //remove from combo
                    }
                }
            }
            if(splited.files.length == 0){
                onLoad(url)  //all cached
                return
            }
            // call fetch directly if all combo files are not under version control
            if(!needFetchAjax) {
                fallback(url)
                return
            }
            var syntax = data.comboSyntax || defaultSyntax,
                comboUrl = splited.host + syntax[0] + splited.files.join(syntax[1])
            fetchAjax(comboUrl + '?v='+Math.random().toString(), function(resp){
                if(!resp){
                    fallback(url)
                    return
                }
                var splitedCode = splitCombo(resp, comboUrl, splited.files)
                if(splited.files.length == splitedCode.length){
                    //ensure they are matched with each other
                    for(var i= 0,len = splited.files.length;i<len;i++){
                        var file = splited.host + splited.files[i]
                        if(!use(file, splitedCode[i])){
                            fallback(url)
                            return
                        }else{
                            localManifest[file] = remoteManifest[file]
                            storage.set(file, splitedCode[i])
                        }
                    }
                    storage.set('manifest', JSON.stringify(localManifest))
                    onLoad(url)
                }else{
                    //filenames and codes not matched, fetched code is broken at somewhere.
                    fallback(url)
                }
            })
        }else{

            //not in version control, use default fetch method
            if(localManifest[url]){

                delete localManifest[url]
                storage.set('manifest', JSON.stringify(localManifest))
                storage.remove(url)
            }
            fallback(url)
        }
    }
})(seajs);
