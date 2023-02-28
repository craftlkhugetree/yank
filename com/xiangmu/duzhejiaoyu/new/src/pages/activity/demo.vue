<template>
    <div>
        <ul ref="geoChilds" class="ulChildName" @dragstart="dragstartfun"  @dragover="dragoverfun" @dragend="dragendfun">
            <li draggable="true" v-for="item in geoInfo.childNames"  :key="item.id" :entityid="item.id" class="info-body-item" >{{ item.name }}</li>
        </ul>
    </div>
</template>
<script>
export default {
    data(){
        return{
            geoInfo:{
                childNames:[
                    {name:'一', id: 30},
                    {name:'二', id: 24},
                    {name:'三', id: 32},
                    {name:'四', id: 43},
                    {name:'五', id: 53},
                ]
            },
            draging:undefined,
        }
    },
    methods: {
        dragstartfun (event){
        //firefox设置了setData后元素才能拖动！！！！
        event.dataTransfer.setData("te", event.target.innerText); //不能使用text，firefox会打开新tab
        //event.dataTransfer.setData("self", event.target);
        this.draging = event.target;
        },
        dragoverfun (event){
        event.preventDefault();
        var target = event.target;
        //因为dragover会发生在ul上，所以要判断是不是li
        if (target.nodeName === "LI") {
            if (target !== this.draging) {
                var targetRect = target.getBoundingClientRect();
                var dragingRect = this.draging.getBoundingClientRect();
                if (target) {
                    if (target.animated) {
                        return;
                    }
                }
                if (this._index(this.draging) < this._index(target)) {
                    target.parentNode.insertBefore(this.draging, target.nextSibling);
                } else {
                    target.parentNode.insertBefore(this.draging, target);
                }
                this._animate(dragingRect, this.draging);
                this._animate(targetRect, target);
            }
        }
        },
        dragendfun(event){
            console.log("结束拖拽")
            let geoChil = this.$refs['geoChilds']
            let param = []
            let childrens = geoChil.children
            for (let i = 0; i < childrens.length; i++) {
            const element = childrens[i];
            let example = {}
            let id = element.getAttribute("entityid")
            example.id = id
            example.order = i
            param.push(example)
            }
            //保存结果
            orderGeoData(param).then(res => {
            if(res.success){
                this.$message({
                message: "修改序列成功！",
                type: "success"
                })
            }else{
                this.$message({
                message: "修改序列失败！",
                type: "error"
                })
            }
            })
        },
        //获取元素在父元素中的index
        _index(el) {
        var index = 0;
    
        if (!el || !el.parentNode) {
            return -1;
        }
    
        while (el && (el = el.previousElementSibling)) {
            //console.log(el);
            index++;
        }
    
        return index;
        },
    
    _animate(prevRect, target) {
        var ms = 300;
    
        if (ms) {
            var currentRect = target.getBoundingClientRect();
    
            if (prevRect.nodeType === 1) {
                prevRect = prevRect.getBoundingClientRect();
            }
    
            this._css(target, 'transition', 'none');
            this._css(target, 'transform', 'translate3d(' +
                (prevRect.left - currentRect.left) + 'px,' +
                (prevRect.top - currentRect.top) + 'px,0)'
            );
    
            target.offsetWidth; // 触发重绘
            //放在timeout里面也可以
            // setTimeout(function() {
            //     this._css(target, 'transition', 'all ' + ms + 'ms');
            //     this._css(target, 'transform', 'translate3d(0,0,0)');
            // }, 0);
            this._css(target, 'transition', 'all ' + ms + 'ms');
            this._css(target, 'transform', 'translate3d(0,0,0)');
    
            clearTimeout(target.animated);
            target.animated = setTimeout(() => {
                this._css(target, 'transition', '');
                this._css(target, 'transform', '');
                target.animated = false;
            }, ms);
        }
        },
        //给元素添加style
    _css(el, prop, val) {
            var style = el && el.style;
    
            if (style) {
                if (val === void 0) {
                    if (document.defaultView && document.defaultView.getComputedStyle) {
                        val = document.defaultView.getComputedStyle(el, '');
                    } else if (el.currentStyle) {
                        val = el.currentStyle;
                    }
    
                    return prop === void 0 ? val : val[prop];
                } else {
                    if (!(prop in style)) {
                        prop = '-webkit-' + prop;
                    }
    
                    style[prop] = val + (typeof val === 'string' ? '' : 'px');
                }
            }
        },
    }
    
}
</script>
<style>
    /* li{
        width:50px;
        height: 50px;
    } */
</style>