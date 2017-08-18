var Dialog = {};
Dialog.install = function (Vue, options) {
    var opt = {
        defaultType:'bottom',
        duration:'2000'
    };
    for(var property in options){
        opt[property] = options[property];
    }
    Vue.prototype.$dialog = function(tips,type,themeObj){
        var curType = type ? type : opt.defaultType;
        if(document.querySelector('.lx-dialog')){
            // 如果dialog还在，则不再执行
            return;
        }
        var dialogTpl = Vue.extend({
            template: '<div class="dia-mask"><div class="lx-dialog lx-dialog-'+ curType +'">' + tips + '</div></div>'
        });
        var tpl = new dialogTpl().$mount().$el;
        var tep = document.createElement("div");
        tep.setAttribute("class","lx-dialog lx-dialog-"+curType);
        tep.innerText=tips;

        document.body.appendChild(tpl);
        if(themeObj!=undefined){
            for(var key in themeObj){
                document.querySelector(".lx-dialog").style[key]=themeObj[key];
            }
        }
        //$("body").append('<div class="lx-dialog lx-dialog-'+ curType +'">' + tips + '</div>');
        setTimeout(function () {
            //$(".lx-dialog").remove();
            document.body.removeChild(tpl);
        }, opt.duration);
    };
    ['bottom', 'center', 'top'].forEach(function(type) {
        Vue.prototype.$dialog[type] = function(tips,themeObj) {
            return Vue.prototype.$dialog(tips,type,themeObj);
        };
    });

    Vue.prototype.$loading = function(tips,type,themeObj) {
        var load = document.querySelector('.lx-load-mark');
        if(type == 'close'){
            load && document.body.removeChild(load);
        }else{
            if(load){
                // 如果loading还在，则不再执行
                return;
            }
            var loadTpl = Vue.extend({
                template: '<div class="lx-load-mark"><div class="lx-load-box"><div class="lx-loading"><div class="loading_leaf loading_leaf_0"></div><div class="loading_leaf loading_leaf_1"></div><div class="loading_leaf loading_leaf_3"></div><div class="loading_leaf loading_leaf_4"></div><div class="loading_leaf loading_leaf_5"></div><div class="loading_leaf loading_leaf_6"></div><div class="loading_leaf loading_leaf_7"></div><div class="loading_leaf loading_leaf_8"></div><div class="loading_leaf loading_leaf_9"></div><div class="loading_leaf loading_leaf_10"></div><div class="loading_leaf loading_leaf_11"></div></div><div class="lx-load-content">'+tips+'</div></div></div>'
            });
            var tpl = new loadTpl().$mount().$el;
            document.body.appendChild(tpl);
            if(themeObj!="undefined"){
            	for(var key in themeObj){
            		document.querySelector(".lx-load-box").style[key]=themeObj[key];
            	}
            }
        }
    };

    ['open', 'close'].forEach(function(type) {
        Vue.prototype.$loading[type] = function(tips,theme) {
            return Vue.prototype.$loading(tips,type,theme);
        };
    });
};
export default Dialog;
