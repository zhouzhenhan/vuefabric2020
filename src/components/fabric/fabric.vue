<template>
  <div class="bigbox" :style="'width: '+ boxWidth+'px;height:'+boxHeight+'px;' "  @contextmenu="showMenu">

    <div style="position: fixed; top:-99999999px; left:0; z-index:999999;">
      <img id="barcode"/>
      <img id="qrcode" :src="qrcodeImg" alt="" class="qrcodeImg">
    </div>
    <!--  <div class="title">{{name}}:{{width}}*{{height}} | {{boxWidth}}:{{boxHeight}}</div>-->

     <!-- <div class="scrollx" :style="'height:'+boxHeight+'px;margin-left:'+ (boxWidth-8)+'px;'" v-if="showRuler[1]?(height+18)>boxHeight:height>boxHeight">
        <i  id="scrolly" v-drag :style="'height:'+scrollyH+'px;'"></i>
      </div>
      <div class="scrolly" :style="'width:'+boxWidth+'px;margin-top:'+ (boxHeight-8)+'px;'" v-if="showRuler[0]?(width+18)>boxWidth:width>boxWidth">
        <i  id="scrollx"  v-drag :style="'width:'+scrollxW+'px;'"></i>
      </div>-->
     <!-- <div class="boxblock" id="boxblock" v-if="showRuler[0]&&showRuler[1]"></div>-->

      <div class="xZhou" id="xZhou" :style="'width: '+ (boxWidth-returnXYshowcanvas(showXzhou,showYzhou))+'px; visibility:'+returnXYshow(showXzhou)+';margin-left:'+returnXYshowcanvas(showXzhou,showYzhou)+'px;'">
          <div class="x-line" :style="'width: '+ (width>boxWidth?width-translateX:boxWidth-translateX)+'px;transform-origin:left; transform:translateX('+ ((translateX+18)*canvasZoom-18) +'px) scaleX('+canvasZoom+') ;'">
              <span v-for="(item,index) in xScale"  :key="index" :style="{left:index * 50 + 2 + 'px'}" class="number">{{ item.id }}</span>
          </div>
      </div>

      <div class="yZhou" id="yZhou" :style="'height: '+ (boxHeight-returnXYshowcanvas(showXzhou,showYzhou)) +'px;  visibility:'+returnXYshow(showYzhou)+';margin-top:'+returnXYshowcanvas(showXzhou,showYzhou)+'px;'">
          <div class="y-line" :style="'height:'+ (height>boxHeight?height-translateY:boxHeight-translateY)+'px; transform-origin:top; transform:translateY('+((translateY+18)*canvasZoom-18)+'px) scaleY('+canvasZoom+') ;top:'+returnXYshowcanvas(showXzhou,showYzhou)+'px;'">
              <span v-for="(item,index) in yScale"  :key="index" :style="{top:index * 50 + 2 + 'px'}" class="number">{{ item.id }}</span>
          </div>
      </div>

   <div class="content" :style="'width: '+ boxWidth+'px;height:'+boxHeight+'px;' "  id ="content" >
     <GeminiScrollbar  :style="'width: '+ boxWidth+'px;height:'+boxHeight+'px;' ">

      <div id="blackbox" class="black" :style="'position: absolute; '">
         <!-- top:'+returnXYshowcanvas(showXzhou,showYzhou)+'px; left: '+ returnXYshowcanvas(showYzhou,showXzhou)+'px;-->
        <div  class="yellow" :style="'width: '+(width * canvasZoom)+'px;height:'+(height * canvasZoom)+'px; '">
         <!-- <fabricbak ref="canvas" :width="width" :height="height" id="can"></fabricbak>-->

            <input type="text" id="code" style="position:fixed; top:-100px; z-index:9999;"><!--style="visibility: hidden;"-->
            <div style="position:fixed; top:-100px; z-index:9999;visibility: hidden;">{{clipboard}}</div>
          <canvas id="canvas" :width="width>boxWidth?width:boxWidth" :height="height>boxHeight?height:boxHeight" ></canvas>

        </div>
      </div>
     </GeminiScrollbar>
     <!--鼠标右键-->
     <vue-context-menu :contextMenuData="contextMenuData"
                       @toTopLayer="toTopLayer" @toLastLayer="toLastLayer" @toNextLayer="toNextLayer" @toBottomLayer="toBottomLayer"
                       @removeEditObj="removeEditObj" @copypaste="copypaste">
     </vue-context-menu>
   </div>
  </div>

</template>

<script>
  import { on, off } from '../../examples/event'   //时间监听
  import Utils from '../../utils/utils';   //事件注册
  import initAligningGuidelines  from '../../utils/guidelines';  //组件间对齐线
  import vueContextMenu from '../../examples/contextmenu'   //右键菜单



  export default {
    name: 'FabricCanvas',
    components:{vueContextMenu},
    props: {
      width: {
        type: Number,
        required: true
      },
      height: {
        type: Number,
        required: true
      },
      boxWidth: {
        type: Number,
        required: true
      },
      boxHeight: {
        type: Number,
        required: true
      },
      stepLengthp: {
        type: Number,
        default: 50
      },
      showRuler:{
        type:Array,
        default: () => [true,true],
      },
        idno:{
          type:Number,
          default:1,
          required: true
        }
    },
    data(){
      return{
        name:'canvas',
        canvas:null,
        canvasZoom:1,
          clipboard:'',
          cid:1,

        xScale:[],
        yScale:[],
        xLeft:-200,
        yTop:-100,
          translateX:-18,
          translateY:-18,
        stepLength:this.stepLengthp,
        showXzhou:this.showRuler[0],
        showYzhou:this.showRuler[1],
        rulertop:0,
        rulerleft:0,

        scrollyH:100, //纵向滚动条的高度
        scrollxW:50, //横向滚动条的宽度


        contextMenuData: {
              menuName: 'demo',
              axis: {
                  x: null,
                  y: null
              },
              menulists: [
                  {
                      fnHandler: '',
                      icoName: 'fa fa-home fa-fw',
                      btnName: this.$t('m.layer'),
                      children:[
                          {
                              fnHandler: 'toLastLayer',
                              icoName: 'fa fa-home fa-fw',
                              btnName: this.$t('m.MoveUpALayer')
                          },
                          {
                              fnHandler: 'toNextLayer',
                              icoName: 'fa fa-home fa-fw',
                              btnName: this.$t('m.DownALayer')
                          },
                          {
                              fnHandler: 'toTopLayer',
                              icoName: 'fa fa-home fa-fw',
                              btnName: this.$t('m.OnTheTopFloor')
                          },
                          {
                              fnHandler: 'toBottomLayer',
                              icoName: 'fa fa-home fa-fw',
                              btnName: this.$t('m.AtTheBottom')
                          }
                      ]
                  },
                  {
                      fnHandler: 'copypaste',
                      icoName: 'fa fa-home fa-fw',
                      btnName: this.$t('m.copy')
                  },
                  {
                      fnHandler: 'removeEditObj',
                      icoName: 'fa fa-home fa-fw',
                      btnName: this.$t('m.delete')
                  }
              ]
          },

          //二维码
        qrcodeImg:'',

      }
    },
    directives: {
      drag: {
        inserted: function (el, binding, vnode) {

          //console.warn('x',this.scrollyH);
          vnode = vnode.elm;

          el.dragstart = ((event)=>{
            console.log('drag 0');
            event.preventDefault();
            document.onmousemove = document.onmouseup = null
          });
          el.ondrag = ((event)=>{
            console.log('drag 1');
            event.preventDefault();
            document.onmousemove = document.onmouseup = null;
            return false;
          });

          el.onmousedown = ((event) => {
            let scrollH = event.target.offsetHeight;  //滚动条的高度
            let scrollW = event.target.offsetWidth;   //滚动条的宽度

            let dragflag = true;
            if (event.target.id !== "scrollx" && event.target.id !== "scrolly") {
              dragflag = false;
              return;
            }

            console.log(scrollW,scrollH);

            // 获取鼠标在滑块中的位置
            let mouseX = event.clientX - vnode.offsetLeft;
            let mouseY = event.clientY - vnode.offsetTop;
            let direction = null;

            if(event.target.id === "scrollx"){
              direction = 'x';
            }else if(event.target.id === "scrolly"){
              direction = 'y';
            }

            // 绑定移动和停止函数
            document.onmousemove = ((event) => {
              let left, top;
              left = event.clientX - mouseX;
              top = event.clientY - mouseY;

              // 赋值移动
              if(direction==='x'){
                if (event.clientY < mouseY- 60 ||  event.clientY > mouseY+ 60) {
                  dragflag = false;
                  return
                }
                if(dragflag){
                  // 获取滑块在页面中距X轴的最小、最大 位置
                  let minX = 18;
                  let maxX = vnode.parentNode.offsetWidth - 8 - scrollW;
                  if (left <= minX) {
                    left = minX
                  } else if (left >= maxX) {
                    left = maxX
                  }

                  vnode.style.left = left + 'px';
                  let maxscroll = (document.getElementById('canvas').offsetWidth-document.getElementById('content').offsetWidth )+ 30;
                  let scrollLeft = maxscroll * ((left-18)/(maxX-18));
                  document.getElementById('content').scrollLeft = document.getElementById('xZhou').scrollLeft = scrollLeft;
                }


              }else{
                if (event.clientX < mouseX-60 ||  event.clientX > mouseX+60) {
                  dragflag = false;
                  return
                }
                if(dragflag) {
                  // 获取滑块在页面中距Y轴的最小、最大 位置
                  let minY = 18;
                  let maxY =vnode.parentNode.offsetHeight - 8 - scrollH;
                  if (top <= minY) {
                    top = minY
                  } else if (top >= maxY) {
                    top = maxY
                  }

                  vnode.style.top = top + 'px';
                  let maxscroll = (document.getElementById('canvas').offsetHeight - document.getElementById('content').offsetHeight) + 30;
                  let scrollTop = maxscroll * ((top - 18) / (maxY - 18));
                  document.getElementById('content').scrollTop = document.getElementById('yZhou').scrollTop = scrollTop;
                }

              }


            });
            document.onmouseup = ((event) => {
              dragflag = false;
              document.onmousemove = document.onmouseup = null
            })
          })
        }
      }
    },
      watch:{
          idno(val, oldVal){
              console.log('val',val,'old,',oldVal);
              this.cid =val;
          }
      },
    mounted() {
        window.onresize = (() => {
            this.rulertop =  window.pageYOffset ;
            this.rulerleft =  window.pageYOffset ;

          this.scrollxW = 100;
          this.scrollyH = 100;

            /*console.log(document.getElementById('content').offsetTop,
            document.documentElement.scrollTop , window.pageYOffset );*/

        });
      let that = this;

      on(document.getElementById('content').firstChild.childNodes[4], 'mousewheel', this.show);  //监听鼠标滚动控制刻度滚动
      on(document.getElementById('content').firstChild.childNodes[4], 'scroll', this.show);
      on(document.getElementById('yZhou'), 'mousewheel', this.yshow);
      on(document.getElementById('yZhou'), 'scroll', this.yshow);
      on(document.getElementById('xZhou'), 'mousewheel', this.yshow);
      on(document.getElementById('xZhou'), 'scroll', this.yshow);

    //  on(document.getElementById('scrollx'), 'mousemove', this.xmousemove);


      let keyCode = null;
      document.onkeydown = function(e) {
        console.log('keyCode:',window.event.keyCode);
        let keyCode = window.event.keyCode;
        if(event.shiftKey && window.event.keyCode===107){                                                               //shift + '+'
          that.ChangeZoom(1)
        }else if(event.shiftKey && window.event.keyCode===109){                                                         //sheft + '-'
          that.ChangeZoom(0)
        }

        if(keyCode===46){                                                                                               //Delete
            let deleteIDS = that.removeCurrentObj();
            //console.log(deleteIDS);
        }
        if(keyCode===37){                                                                                               // ←
            that.getEditObj().left = parseInt(that.getEditObj().left - 1);
            that.getEditObj().setCoords();
            that.canvas.requestRenderAll();
            that.canvas.renderAll();
        }
          if(keyCode===38){                                                                                             // ↑
              that.getEditObj().top = parseInt(that.getEditObj().top - 1);
              that.getEditObj().setCoords();
              that.canvas.requestRenderAll();
              that.canvas.renderAll();
          }
          if(keyCode===39){                                                                                             // →
              that.getEditObj().left = parseInt(that.getEditObj().left + 1);
              that.getEditObj().setCoords();
              that.canvas.requestRenderAll();
              that.canvas.renderAll();
          }
          if(keyCode===40){                                                                                             // ↓
              that.getEditObj().top = parseInt(that.getEditObj().top + 1);
              that.getEditObj().setCoords();
              that.canvas.requestRenderAll();
              that.canvas.renderAll();
          }
          if(event.ctrlKey && keyCode === 67){                                                                          // ctrl + C
              let copydata = that.copyData()
              document.getElementById('code').value = copydata;
              that.clipboard = copydata; //用来限制每个画布复制一次
              document.getElementById('code').select();
              document.execCommand('copy');
              document.getElementById('code').value = '';
          }
          if(event.ctrlKey && keyCode === 86){                                                                          // ctrl + V

          }
          if(event.shiftKey && keyCode === 68){                                                                          // Shift + D
              that.copypaste();
          }

      };

      document.onkeyup = function(e) {
        /*console.log(window.event);
        keyCode = null*/
      };



        document.addEventListener('paste', function (event) {
            var text = event.clipboardData.getData('Text');
            that.paste(text);
            event.clipboardData.setData('Text','');
            event.clipboardData.clearData('Text');
        });


      this.canvas = new fabric.Canvas('canvas', { preserveObjectStacking: true });
      let canvas = this.canvas;

      fabric.Canvas.prototype.rotationCursor = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NzBBQTBGQ0Y4ODcxMUVBQURGNkU5NzQ3OUY4RTA5NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5NzBBQTBGREY4ODcxMUVBQURGNkU5NzQ3OUY4RTA5NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk3MEFBMEZBRjg4NzExRUFBREY2RTk3NDc5RjhFMDk2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk3MEFBMEZCRjg4NzExRUFBREY2RTk3NDc5RjhFMDk2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+QUJwRwAAAytJREFUeNrsVk1oGkEUXqVIqCRIhVICEsSTkFuwEPDaWiQ9NaQx6VGRaqCHQATBEFMKKUoLos0h4LV4aWxCbyqhEbx4CJJCwJMJRKVWxJ/EkJ/X9yabZd2oay+hhX7wsbPz3sybmTfv21UAAHdXUHJ3iL8rmEKh0CHdyASyhAQRC8gQ0izyNyCD9Lw1GeWsFxFvdDoduN1uSCQSUCqVQIxCoQChUAjMZjM5B5DTw8PDEAwG6f3Trfl6BFEgQzMzM3BwcAByaDabYLPZYHR0FJLJJOu73sdgwd65XC44Pz8XJjw+PoZYLAZ+vx+8Xi/b6enpqWBvtVqwu7vL2u12myZpywZDOCcnJ6FarbKBV1dXEI1GwWg0gkqlIgc/0qtWq2FiYgI2NjagVqt17LRer5NfvW8wxH0E7O3tCQMXFxfJEEWakCqRrxr5lBaQyWQ6gjUaDXJoyAV7gYDLy0s2iJJPiaZFdDmBRyMjI7C5udk1h2hvygX7jGADTk5OgG4i9hlFditym6ef8tcL3S7IPUklPEawRjqd5orFIjXzfP08M5lM35aXl5l9dXV1amtri8tms5xU8s7Ozuix3rfOEL8QbGWBQIDVjsj2FSGsnNrUh3yOnJLwSbdbLt3ZT8QDxM2uiiIbXR7xC8fncpvf+cOhoaGywWDgsNjpfRxtP/rJVZEPwlFAeohs67hbLpVKMVJbclSvPR4Pt7+/z62trbF3uWP8gmDHdHh4CBqNhjo1Ivs0MslzWtSvo8uEC2VjMd/UmZa7ja8QcHFxwQYtLS1R50cZ/SRpC66srAj59Pl8ZPANoiDfEYLszM3NUecHpFbiRykYR0ZI2kiuCEdHR6DX68lBP0gwm8ViYZJDIP1bWFgArVZ7o+x2pEupVMLY2BhEIhEmaQQSg/n5efLzdj2FHkfzfnZ2FiqVinA0+XyelYPdbgfaCWliuVzuUA2n00mDwz2PvE8u3mKBQzwel/3E7OzsAJ2GuC7/KBgf0IKMW61WCIfDkMvlmMiiQrCvApYAOBwO9tVGv5f95pINJtHEMDJHak6KhKwiU0gH3chB5lH8/5X754L9FmAAxKqp09gZRrsAAAAASUVORK5CYII=) 12 12, auto";
      fabric.Object.prototype.originX = 'center';  //设置中心为左上角
      fabric.Object.prototype.originY = 'center';   //设置中心为左上角

     // canvas.backgroundColor = '#ffffff';
      canvas.selection = true;
      canvas.controlsAboveOverlay = false;
      canvas.skipOffscreen = true;
      canvas.preserveObjectStacking = true;
      fabric.Canvas.prototype.customiseControls({
        tl: {
          action: 'scale'
        },
        tr: {
          action: 'scale'
        },
        bl: {
          action: 'scale',
        },
        br: {
          action: 'scale',
        },
        mb: {
            action: 'scaleY',
        },
        mt: {
          action: 'scaleY',
        },

        mr:{
          action: 'scaleX',
        },
        ml:{
          action: 'scaleX',
        },
        mtr: {
          action: 'rotate'
        }
      });


      let Top = 0; //用作按住shift时,取横坐标
      let Left = 0;//用作按住shift时,取纵坐标
        let Direction = null;

      this.canvas.on('selection:created', function (options) {
        //  console.log('selection',1);
        //  console.log('selection',options.target);

        that.$emit('selection:created', options);
          Top = options.target.top;
          Left = options.target.left;

      });
      this.canvas.on('mouse:down', function (options) {
        that.$emit('mouse:down', options);
      });
      this.canvas.on('mouse:up', function (options) {
        that.$emit('mouse:up', options);
      });
      this.canvas.on('mouse:move', function (options) {
        that.$emit('mouse:move', options);
      });
      this.canvas.on('mouse:dblclick', function (options) {
        that.$emit('mouse:dblclick', options);

        console.log('dblclick',options);
      });
      this.canvas.on('mouse:over', function (options) {
        that.$emit('mouse:over', options);
      });
      this.canvas.on('mouse:out', function (options) {
        that.$emit('mouse:out', options);
      });
      this.canvas.on('object:added', function (options) {
        that.$emit('object:added', options);
      });
      this.canvas.on('object:removed', function (options) {
        that.$emit('object:removed', options);
      });
      this.canvas.on('object:moved', function (options) {
        //  console.log('moved',3);
        that.$emit('object:moved', options);

          Top = options.target.top;
          Left = options.target.left;
          Direction = null;
      });
      this.canvas.on('object:modified', function (options) {
        that.$emit('object:modified', options);
            //矩形 等元素边框不变形计算宽高，缩放比例为1，宽高取整
         /* if(!options.target._objects){

              console.log(options);

              options.target.set('left',  parseInt(options.target.left));
              options.target.set('top',  parseInt(options.target.top));

              options.target.set('width',  parseInt(options.target.width * options.target.scaleX));
              options.target.set('height',  parseInt(options.target.height * options.target.scaleY));
              options.target.set('scaleX',  1);
              options.target.set('scaleY',  1);

              options.target.set('angle',  parseInt(options.target.angle));
          }*/
          Top = options.target.top;
          Left = options.target.left;
          Direction = null;

      });
      this.canvas.on('object:rotating', function (options) {
        that.$emit('object:rotating', options);

      });
      this.canvas.on('object:scaling', function (options) {
        that.$emit('object:scaling', options);
      });
      this.canvas.on('object:scaled', function (options) {
        that.$emit('object:scaled', options);
        if(options.target._objects){
            //以下为了放大缩小时边框不变形
            let ids = [];
            let _objects = options.target._objects;
            that.discardActive();
            _objects.forEach((_obj)=>{
                ids.push(_obj.id);
                /*_obj.set('width',  parseInt(_obj.width * _obj.scaleX));
                _obj.set('height',  parseInt(_obj.height * _obj.scaleY));
                _obj.set('scaleX',  1);
                _obj.set('scaleY',  1);*/
            });
            that.setActiveObjs(ids);
        }

      });
      this.canvas.on('object:selected', function (options) {
         //  console.log('selected',options.target);
          that.$emit('object:selected', options);

      });
      this.canvas.on('object:moving', function (options) {
        //  console.log('moving',2,Top,Left);
        that.$emit('object:moving', options);

        //矩形 等元素边框不变形计算宽高，缩放比例为1，宽高取整
          if(!options.target._objects) {
              if (options.transform.shiftKey) {
                  if (Direction === 'x' || Math.abs(options.target.left - Left) > Math.abs(options.target.top - Top)) {
                      if (Math.abs(options.target.left - Left) > 18) {
                          Direction = 'x';
                      }
                      options.target.set('top', Top);
                  } else if (Direction === 'y' || Math.abs(options.target.left - Left) < Math.abs(options.target.top - Top)) {
                      if (Math.abs(options.target.top - Top) > 18) {
                          Direction = 'y';
                      }
                      options.target.set('left', Left);
                  }
              }
          }else{
              if (options.transform.altKey) {
                  if (Direction === 'x' || Math.abs(options.target.left - Left) > Math.abs(options.target.top - Top)) {
                      if (Math.abs(options.target.left - Left) > 18) {
                          Direction = 'x';
                      }
                      options.target.set('top', Top);
                  } else if (Direction === 'y' || Math.abs(options.target.left - Left) < Math.abs(options.target.top - Top)) {
                      if (Math.abs(options.target.top - Top) > 18) {
                          Direction = 'y';
                      }
                      options.target.set('left', Left);
                  }
              }
          }

      });
      this.canvas.on('selection:updated', function (options) {
        that.$emit('selection:updated', options);

        console.log('000   selection:updated')
      });
      this.canvas.on('selection:changed', function (options) {
        that.$emit('selection:changed', options);

          console.log('111   selection:changed')
      });
      this.canvas.on('selection:cleared', function (options) {
        that.$emit('selection:cleared', options);

          console.log('222  selection:cleared')
      });
      this.canvas.on('before:selection:cleared', function (options) {
        that.$emit('before:selection:cleared', options);

          console.log('333  before:selection:cleared')
      });
      this.canvas.on('text:changed', function(options) {
        that.$emit('text:changed', options);
      });
      this.canvas.on('text:editing:entered',function(options){
        that.$emit('text:editing:entered', options);
      });

      this.canvas.on('before:render'),function(options){
        that.$emit('before:render',options);
      };
      this.canvas.on('after:render'),function(options){
        that.$emit('after:render',options);
      };
      this.canvas.on('dragover'),function(options){
        that.$emit('dragover',options);
      };
      this.canvas.on('dragenter'),function(options){
        that.$emit('dragenter',options);
      };
      this.canvas.on('dragleave'),function(options){
        that.$emit('dragleave',options);
      };
      this.canvas.on('drop'),function(options){
        that.$emit('drop',options);
      };




        this.initBgRect();  //初始化画布矩形

        this.scaleCalc();    //标尺计算

        initAligningGuidelines(canvas);   //初始化辅助线


       /* let no = '123456789';
        this.drawbarcode(no,{});

        this.drawqrcode(no,{});*/

    },
    methods:{
      //画条码
        drawbarcode(number,option){
          let barcodeImage = JsBarcode("#barcode", number, {
            format: option.format?option.format:"CODE128",  //条形码的格式
            lineColor:  option.lineColor?option.lineColor:"#000000",  //线条颜色
            margin:  option.margin?option.margin:2, // 条码四边空白（默认为10px）
            width:  option.width?option.width:2, //线宽
            height:  option.height?option.height:20,  //条码高度
            displayValue: false //是否显示文字信息
          });
          console.log(barcodeImage);
        },
      //画二维码
      drawqrcode(text,option){
        let qrcodeImg = jrQrcode.getQrBase64(text, {
          padding       :  option.margin?option.margin:2,   // 二维码四边空白（默认为10px）
          width         :  option.width?option.width:80,  // 二维码图片宽度（默认为256px）
          height        :  option.height?option.height:80,  // 二维码图片高度（默认为256px）
          correctLevel  : QRErrorCorrectLevel.H,    // 二维码容错level（默认为高）
          reverse       : false,        // 反色二维码，二维码颜色为上层容器的背景颜色
          background    :  option.background?option.background:"#ffffff",    // 二维码背景颜色（默认白色）
          foreground    :  option.lineColor?option.lineColor:"#000000"     // 二维码颜色（默认黑色）
        });
        this.qrcodeImg = qrcodeImg;
        return qrcodeImg;

        /**
         @param: text: 要生成二维码的字符，支持中文
         @param: options: {
          padding       : 10,   // 二维码四边空白（默认为10px）
          width         : 256,  // 二维码图片宽度（默认为256px）
          height        : 256,  // 二维码图片高度（默认为256px）
          correctLevel  : QRErrorCorrectLevel.H,    // 二维码容错level（默认为高）
          reverse       : false,        // 反色二维码，二维码颜色为上层容器的背景颜色
          background    : "#ffffff",    // 二维码背景颜色（默认白色）
          foreground    : "#000000"     // 二维码颜色（默认黑色）
        }
         @return: 生成的二维码Base64 URL
         */
      },

        //右键事件
        showMenu () {
            var canvas = this.canvas;

         /* let top = document.getElementById('boxblock').getBoundingClientRect().top;
          let left = document.getElementById('boxblock').getBoundingClientRect().left;*/

            var x = event.clientX ;
            var y = event.clientY ;
            var objects = canvas.getObjects();
            for (var i = objects.length - 1; i >= 0; i--) {
                var object = objects[i];
                console.log(object.component)
                if(object.component !=='component'){  //判断不是背景也不是遮罩
                  event.preventDefault();
                  continue;
                }

                if (canvas.containsPoint(event, object)) {
                    this.setActiveObject(object);
                    //新增滚动条，所以定位有变化

                    this.contextMenuData.axis = { x, y};
                    event.preventDefault();

                    return;  //为了右击时最上面的被选择
                }
            }

        },
        /*右键事件
        * ----------------------------------------------------------------
        * 标尺事件
        * */

        //滚动条计算
      setScroll(w,h){
        //console.log('重置滚动条');
        this.scrollxW = (this.boxWidth * this.boxWidth)/w;
        this.scrollyH = (this.boxHeight * this.boxHeight)/h;
      },

      //标尺显示与否
      returnXYshow(b){
        if(b===true){
          return 'visible';
        }else{
          return 'hidden';
        }
      },
      //标尺显示与否 判断画布坐标
      returnXYshowcanvas(b1,b2){
       // console.log(b1===true && b2===true);
        if(b1===true && b2===true){
          return 18;
        }else{
          return 0;
        }
      },
      //监听内容区，修改标尺滚动条
      show(e){
       //   console.log('获取',document.getElementById('content').firstChild,document.getElementById('content').firstChild.childNodes[4]);
        document.getElementById('yZhou').scrollTop =document.getElementById('content').firstChild.childNodes[4].scrollTop;
        document.getElementById('xZhou').scrollLeft = document.getElementById('content').firstChild.childNodes[4].scrollLeft;
       /* if(this.showRuler[1]?(this.height+18)>this.boxHeight:this.height>this.boxHeight){
          let scrollTop = document.getElementById('content').scrollTop;
          let maxY = document.getElementById('scrolly').parentNode.offsetHeight - 8 - 50 - 18;
          let maxscroll = (document.getElementById('canvas').offsetHeight-document.getElementById('content').offsetHeight )+30;
          let Top = (scrollTop * maxY)/maxscroll +18;
          document.getElementById('scrolly').style.top = Top +'px';
        }

        if(this.showRuler[0]?(this.width+18)>this.boxWidth:this.width>this.boxWidth){
          let scrollLeft = document.getElementById('content').scrollLeft;
          let maxX = document.getElementById('scrollx').parentNode.offsetWidth - 8 - 50 - 18;
          let maxscrollx = (document.getElementById('canvas').offsetWidth-document.getElementById('content').offsetWidth )+30;
          let Left = (scrollLeft * maxX)/maxscrollx +18;
          document.getElementById('scrollx').style.left = Left +'px';
        }*/

      },
      //监听标尺滚动，修改内容区
      yshow(e){
        document.getElementsByClassName('gm-scroll-view')[0].scrollTop = document.getElementById('yZhou').scrollTop;
        document.getElementsByClassName('gm-scroll-view')[0].scrollLeft = document.getElementById('xZhou').scrollLeft;
      },
        yshowadd(){
            let newtop,newleft;
          if((this.boxHeight/2 - (this.height * this.canvasZoom)/2) >0 ){
              let new1 = this.boxHeight*(this.canvasZoom-1)/2;
              let new2 = (this.boxHeight * this.canvasZoom)/2 - (this.height * this.canvasZoom)/2 ;
              newtop = new1<new2? new1: new2;
          }else{
              newtop = (this.boxHeight * this.canvasZoom)/2 - (this.height * this.canvasZoom)/2 ;
          }

          if((this.boxWidth/2 - (this.width * this.canvasZoom)/2) >0){
              let new1 = this.boxWidth*(this.canvasZoom-1)/2 ;
              let new2 = (this.boxWidth * this.canvasZoom)/2 - (this.width * this.canvasZoom)/2;
              newleft = new1<new2? new1: new2;
          }else{
              newleft = (this.boxWidth * this.canvasZoom)/2 - (this.width * this.canvasZoom)/2;
          }

         /* console.log('改变焦点：',this.canvasZoom, document.getElementsByClassName('gm-scroll-view')[0].scrollHeight,'||||',
              (this.boxHeight * this.canvasZoom)/2 - (this.height * this.canvasZoom)/2,
              (this.boxWidth * this.canvasZoom)/2 - (this.width * this.canvasZoom)/2,
              this.boxHeight*(this.canvasZoom-1)/2 ,
              this.boxWidth*(this.canvasZoom-1)/2 ,'end:',newtop,newleft);
*/
        // console.log(document.getElementById('content').firstChild.childNodes[4])
          document.getElementById('content').firstChild.childNodes[4].scrollTop = document.getElementById('yZhou').scrollTop = newtop;
          document.getElementById('content').firstChild.childNodes[4].scrollLeft = document.getElementById('xZhou').scrollLeft = newleft;
        },
      // 计算刻度
      scaleCalc () {
        let w = this.width>this.boxWidth?this.width:this.boxWidth;
        let h = this.height>this.boxHeight?this.height:this.boxHeight;
        this.xScale = this.getCalc(this.xScale, w*this.canvasZoom,'x');
        this.yScale = this.getCalc(this.yScale, h*this.canvasZoom,'y');
      },
      // 获取刻度方法
      getCalc (array,length, direction) {
        array = [];
        if(direction ==='x'){
          for (let i = this.xLeft; i < length * this.stepLength / 50; i += this.stepLength) {
            /*if (i % this.stepLength=== 0) {
              array.push({ id: i })
            }*/
            this.translateX = -i % this.stepLength-18
            if(i % this.stepLength<0){
                array.push({ id: i - i % this.stepLength - this.stepLength })
            }else{
                array.push({ id: i - i % this.stepLength })
            }

          }
        }else if(direction ==='y'){
          for (let i = this.yTop; i < length * this.stepLength / 50; i += this.stepLength) {
            /*if (i % this.stepLength === 0) {
              array.push({ id: i })
            }*/
              this.translateY = -i % this.stepLength-18;
              if(i % this.stepLength<0){
                  array.push({ id: i - i % this.stepLength - this.stepLength })
              }else{
                  array.push({ id: i - i % this.stepLength })
              }
          }
        }else{
            console.log('未计算');
          for (let i = 0; i < length * this.stepLength / 50; i += this.stepLength) {
            if (i % this.stepLength === 0) {
              array.push({ id: i })
            }
          }
        }

        //console.log('new',direction,JSON.stringify(array));
        return array;

      },
      /*
      * 标尺函数
      * ------------------------------------------------------------
      * 画布函数
      * */


      //元素不选中即置顶
      setStackingtrue(){
        this.canvas.preserveObjectStacking = true;
      },
      //获取当前活跃元素
      getEditObj () {
        let obj = this.canvas.getActiveObject();
        return obj;
      },
      //获取当前活跃元素
      getActiveObject(){
        var obj = this.canvas.getActiveObject();
        return obj;
      },
      //设置obj为当前活跃元素
      setActiveObject(obj){
        this.canvas.setActiveObject(obj);
        this.canvas.renderAll();
      },
      //设置多个元素为活跃元素  --- id的集合
      setActiveObjs(ids){
          let objs = [];
          ids.forEach((id)=>{
              let objects = this.canvas.getObjects();
              objects.forEach((obj)=>{
                  if(obj.id===id){
                      objs.push(obj);
                  }
              })
          });
          var sel = new fabric.ActiveSelection(objs, {
              canvas: this.canvas,
          });
          this.canvas.setActiveObject(sel);
          this.canvas.requestRenderAll();
          this.canvas.renderAll();
      },
        //设置多个元素为活跃元素  --- objects对象集合
        setActiveObjects(objs){
            var sel = new fabric.ActiveSelection(objs, {
                canvas: this.canvas,
            });
            this.canvas.setActiveObject(sel);
            this.canvas.requestRenderAll();
            this.canvas.renderAll();
        },

      //单个删除 多个删除 不支持组合删除 ----delete快捷键 删除的
      removeCurrentObj () {
        let obj = this.canvas.getActiveObject();
        let deleteIds = [];
        if(obj._objects){
          this.canvas.discardActiveObject();
          for(var i in obj._objects){
            deleteIds.push(obj._objects[i].id);
            this.canvas.remove(obj._objects[i]);
          }
        }else{
          deleteIds.push(obj.id);
          this.canvas.remove(obj);
        }
        this.canvas.renderAll();
        return deleteIds;
      },

      //删除当前活跃元素 - 右键菜单调用该方法
      removeEditObj(){
        let obj = this.canvas.getActiveObject();
        this.canvas.remove(obj);
      },
      //删除指定元素
      removeObj(obj){
        this.canvas.remove(obj);
        this.canvas.renderAll();
      },
      //新增指定元素
      addObj(obj){
        this.canvas.add(obj);
        this.canvas.renderAll();
      },
      //设置整体缩放比
      setZoom(n){
        this.canvasZoom = n;
        let w = this.width>this.boxWidth?this.width:this.boxWidth;
        let h = this.height>this.boxHeight?this.height:this.boxHeight;

        this.canvas.setWidth(w * this.canvasZoom);
        this.canvas.setHeight(h * this.canvasZoom);
        this.canvas.setZoom(n);

        this.canvas.renderAll();
      },
      //快捷键缩放 比例尺计算缩放
      ChangeZoom(n){
        this.canvasZoom = this.canvas.getZoom();
        let w = this.width>this.boxWidth?this.width:this.boxWidth;
        let h = this.height>this.boxHeight?this.height:this.boxHeight;

        if(n===1){     //增加
            console.log(w * this.canvasZoom);
           if(w * this.canvasZoom >10000 || h * this.canvasZoom >10000){
               return;
           }

          this.canvasZoom = this.canvasZoom + 0.1;
          this.canvas.setWidth(w * this.canvasZoom);
          this.canvas.setHeight(h * this.canvasZoom);
          this.canvas.setZoom(this.canvasZoom);

          this.yshowadd();     //计算滚动条检点对准画布原点
          this.canvas.renderAll();
        }else if(n===0){  //减小

          if(w * (this.canvasZoom- 0.1) < this.boxWidth || h * (this.canvasZoom- 0.1) < this.boxHeight){
            return;
          }
          this.canvasZoom = this.canvasZoom - 0.1;
          this.canvas.setWidth(w * this.canvasZoom);
          this.canvas.setHeight(h * this.canvasZoom);
          this.canvas.setZoom(this.canvasZoom);

            this.yshowadd();    //计算滚动条检点对准画布原点
          this.canvas.renderAll();
        }

        console.log('zoom:',this.canvasZoom);
      },
      //设置画布背景颜色
      setbackground(color){
        this.canvas.backgroundColor = color;
        this.canvas.renderAll();
      },

      //取消所有活跃元素的选择 ---取消选择 （单个或多个）
      discardActive () {
        this.canvas.discardActiveObject();
        this.canvas.requestRenderAll();
        this.canvas.renderAll();
      },
      //层级移动
      moveToshow (obj,index) {
        // let obj = this.canvas.getActiveObject();
        this.canvas.moveTo(obj,index);
        this.canvas.requestRenderAll();
        this.canvas.renderAll();
      },

      //模板设置宽高
      setWidth(width){
        this.canvas.setWidth(width);
      },
      //模板设置宽高
      setHeight(height){
        this.canvas.setHeight(height);
      },
      //模板设置显示
      setShow(id){
         let objects = this.canvas.getObjects();
         for(let i in objects){
           if(objects[i].id === id){
             objects[i].set('selectable',true);
             objects[i].set('visible',true);
             objects[i].set('opacity',1);
             this.canvas.requestRenderAll();
             this.canvas.renderAll();
           }
         }
      },
      //模板设置隐藏
      setHidden(id){
        let objects = this.canvas.getObjects();
        for(let i in objects){
          if(objects[i].id === id){
            objects[i].set('selectable',false);
            objects[i].set('visible',false);
            objects[i].set('opacity',0);
            this.canvas.requestRenderAll();
            this.canvas.renderAll();
          }
        }
      },
      //禁止拖拽选择和多选
      setNomove(){
        this.canvas.selection = false;
        this.canvas.renderAll();
      },
      //组件修改名字
      rename(id,name){
        let objects = this.canvas.getObjects();
        for(let i in objects){
          if(objects[i].id === id){
            objects[i].set('name',name);
            this.canvas.requestRenderAll();
          }
        }
      },
        // 设置层级(对焦点活跃元素才可操作) - 右键菜单中调用了这几个方法
        //下移一层
        toNextLayer () {
            let obj = this.canvas.getActiveObject();
            if (!obj) {
                return;
            }
            obj.sendBackwards(true);
            this.canvas.renderTop();
            this.canvas.renderAll();

            this.setTop(); //遮罩置顶，背景置底重置
        },
        //置于底层
        toBottomLayer () {
            let obj = this.canvas.getActiveObject();
            if (!obj) {
                return;
            }
            obj.sendToBack();
            this.canvas.renderTop();
            this.canvas.renderAll();

            this.setTop(); //遮罩置顶，背景置底重置
        },
        //上移一层
        toLastLayer () {
            let obj = this.canvas.getActiveObject();
            if (!obj) {
                return;
            }
            obj.bringForward(true);
            this.canvas.renderTop();
            this.canvas.renderAll();

            this.setTop(); //遮罩置顶，背景置底重置
        },
        //置于顶层
        toTopLayer () {
            let obj = this.canvas.getActiveObject();
            if (!obj) {
                return;
            }
            obj.bringToFront();
            this.canvas.renderTop();
            this.canvas.renderAll();

            this.setTop(); //遮罩置顶，背景置底重置
        },
        //复制
        copyData(){
            let clipboard =  this.canvas.getActiveObject();
            if(clipboard==undefined || clipboard==null){
                return;
            }
            if(!clipboard._objects){
                console.log('单个元素复制');

                return '#ZKONG#'+ escape(JSON.stringify(clipboard));
            }else{
                let _objects = JSON.parse(JSON.stringify(clipboard._objects));
                let newobjects = []
                _objects.map((_obj)=>{
                   // console.log(clipboard.width,clipboard.height,'|',clipboard.left,clipboard.top,'|', _obj.left, _obj.top);
                    _obj.top =   clipboard.top + _obj.top;
                    _obj.left =  clipboard.left + _obj.left;
                    newobjects.push(_obj);
                });
                return '#ZKONG#'+ escape(JSON.stringify(newobjects));
            }
        },
        //粘贴
        paste(text){
            if(this.clipboard==null){ //剪切板清除不掉，所以画布只可粘贴一次限制
                return;
            }
            this.canvas.discardActiveObject();
            if(text.substring(0,7)!=='#ZKONG#'){
                return;
            }
            let _clipboard = JSON.parse(unescape(text.substring(7,text.length)));
            if(_clipboard instanceof Array){
                console.log('多个元素')
                let canvaobjs = [];
                /*_clipboard.forEach((object)=>{
                    object.top = object.top+10;
                    object.left = object.left+10;
                    let canvaobj = this.addObject(object);
                    canvaobjs.push(canvaobj);
                });*/
                for(var i in _clipboard){
                    this.cid = this.cid + 1;
                    let object = _clipboard[i];

                    object.id = this.cid;
                    object.top = object.top+10;
                    object.left = object.left+10;
                    let canvaobj = this.addObject(object);
                    canvaobjs.push(canvaobj);
                    this.$emit('idAdd',1);
                }
                var sel = new fabric.ActiveSelection(canvaobjs, {
                    canvas: this.canvas,
                });
                this.canvas.setActiveObject(sel);
            }else{
                console.log('单个元素');
                this.cid = this.cid + 1;
                let canvaobj;
                _clipboard.id = this.cid;
                _clipboard.top = _clipboard.top + 10;
                _clipboard.left = _clipboard.left + 10;
                canvaobj = this.addObject(_clipboard);
                this.canvas.setActiveObject(canvaobj);
                this.$emit('idAdd');
            }
            this.clipboard = null;
            this.canvas.requestRenderAll();
        },
        //复制粘贴操作（不用剪切板）
        copypaste(){
            let copydata = this.copyData();
            this.clipboard = copydata; //仅本画布复制保存
            this.paste(copydata);
        },
        //根据数据创建组件  复制粘贴时，修改已加入的左右边距
        addObject(obj){
          switch(obj.isType){
              case 'Rect':
                  obj.left = obj.left + this.xLeft;
                  obj.top = obj.top + this.yTop;
                  return this.createRect(obj);
                  break;
              case 'Text':
                  obj.left = obj.left + this.xLeft;
                  obj.top = obj.top + this.yTop;
                  return this.createText(obj.text,obj);
                  break;

          }
        },

        //计算画布位置，初始化画布矩形  ********************************
        initBgRect(options){
          let left = 0;
          let top = 0;
          if(this.boxWidth> this.width*this.canvasZoom ){
              left = this.boxWidth/2 - this.width/2;
          }else{
              left = 0;
          }

          if( this.boxHeight>this.height*this.canvasZoom){
              top = this.boxHeight/2 - this.height/2;
          }else{
              top = 0;
          }
            console.log('灰色区域：',left,top);

            this.xLeft = -left;
            this.yTop = -top;

            this.scaleCalc();    //标尺计算

          options = Object.assign({ width: this.width, height: this.height, left: 0, top: 0,  padding: 0, angle: 0, scaleX: 1,  scaleY: 1, }, options);
          let rect = new fabric.Rect({
            ...options,
              left: left,
              top: top,
              type: 'sBg',
              name: 'background',
              component: "bg",
              isType: 'Rect',
              isDiff: 'none',
              selectable: false,
              visible: true,
              fill: options.fill ? options.fill : '#fff',
              fillColor: options.fillColor ? options.fillColor : '#fff',

              flipX: false,
              flipY: false,
              originX: 'left',
              originY: 'top',
              stopContextMenu: true,                            //禁掉鼠标右键默认事件
              hoverCursor: 'default',
              evented: false,
              excludeFromExport: true,
              hasControls: false,
              perPixelTargetFind: false,
              strokeWidth: 0,
              stroke: null
          });
            this.canvas.remove(...this.canvas.getObjects('sBg'));
            this.canvas.add(rect);
            rect.sendToBack();


            let x1,x2,y1,y2;
            if(this.boxWidth> this.width*this.canvasZoom ) {
                x1 = this.boxWidth / 2 - this.width / 2;
                x2 = x1 + this.width;
            }else{
                x1 = 0;
                x2 = this.width;
            }
            if(this.boxHeight>this.height*this.canvasZoom){
                y1 = this.boxHeight/2 - this.height/2;
                y2 = y1 + this.height;
            }else{
                y1 = 0;
                y2 = this.height;
            }

            let arrX = [0, x1, x2, x2 + x1];
            let arrY = [0, y1, y2, y2 + y1];


            const pathOption = {
                selectable: false,
                fill: '#f1f1f1',
                hoverCursor: 'default',
                evented: false,
                excludeFromExport: true,
                hasControls: false,
                perPixelTargetFind: false,
                strokeWidth: 0,
                stroke: null,
                originX:'left',
                originY:'top',
            }

            //console.log(x1,x2,y1,y2,arrX,arrY);

            const rect1 = new fabric.Rect({
                left: arrX[0],
                top: arrY[0],
                width: arrX[1] - arrX[0],
                height: arrY[3] - arrY[0]
            });
            const rect2 = new fabric.Rect({
                left: arrX[1] ,
                top: arrY[0],
                width: arrX[3] - arrX[1] + 2,
                height: arrY[1] - arrY[0]
            });
            const rect3 = new fabric.Rect({
                left: arrX[2],
                top: arrY[1] - 1,
                width: arrX[3] - arrX[2],
                height: arrY[2] - arrY[1] + 2
            });
            const rect4 = new fabric.Rect({
                left: arrX[1],
                top: arrY[2],
                width: arrX[3] - arrX[1],
                height: arrY[3] - arrY[2]
            });



            rect1.set({
                name: 'mask1',
                ...pathOption,
                /*fill: 'red',*/
            })
            rect2.set({
                name: 'mask2',
                ...pathOption,
                /*fill: 'yellow',*/
            })
            rect3.set({
                name: 'mask3',
                ...pathOption,
                /*fill: 'blue',*/
            })
            rect4.set({
                name: 'mask4',
                ...pathOption,
                /*fill: 'green',*/
            });

            let maskPath = new fabric.Group([rect1, rect2, rect3, rect4], {
                originX:'left',
                originY:'top',
                selectable: false,
                excludeFromExport: true,
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true,
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                hoverCursor: 'auto',
                name: 'grid',
                left: 0,
                top: 0,
                type: 'sMask',
                evented: false
            })

          this.canvas.remove(...this.canvas.getObjects('sMask'));
          this.canvas.add(maskPath);
          maskPath.bringToFront();

          this.canvas.renderTop();
          this.canvas.renderAll();
        },
        //遮罩置顶
        setTop(){
            let objects = this.canvas.getObjects();
            objects.forEach((obj)=>{
                if(obj.type=='sMask'){
                    obj.bringToFront();
                    this.canvas.renderTop();
                    this.canvas.renderAll();
                }
                if(obj.type=='sBg'){
                   obj.sendToBack();
                    this.canvas.renderTop();
                    this.canvas.renderAll();
                }
            })
        },



      //水平居中分布
      toHorizontalCenterDistribution() {
        var obj = this.getEditObj();

        if (obj._objects) {
          obj._objects.sort(function (a, b) {
            return a.left - b.left;
          });
          for (var o in obj._objects) {
            console.log(obj._objects[o].width * obj._objects[o].scaleX,
              o * ((obj.getBoundingRect().width / this.canvasZoom) / (obj._objects.length - 1)),
              (obj.getBoundingRect().width / this.canvasZoom) / 2 - o * ((obj._objects[o].width * obj._objects[o].scaleX) / (obj._objects.length - 1)));

            if (o > 0) {

              obj._objects[o].left = o * ((obj.getBoundingRect().width / this.canvasZoom) / (obj._objects.length - 1)) - (obj.getBoundingRect().width / this.canvasZoom) / 2 - o * ((obj._objects[o].width * obj._objects[o].scaleX) / (obj._objects.length - 1));
            } else {
              obj._objects[o].left = o * ((obj.getBoundingRect().width / this.canvasZoom) / (obj._objects.length - 1)) - (obj.getBoundingRect().width / this.canvasZoom) * obj._objects[o].scaleX / 2;
            }
          }
          this.canvas.renderTop();
          this.canvas.renderAll();
        }


      },
      //垂直居中分布
      toVerticalCenterDistribution() {
        var obj = this.getEditObj();
        if (obj._objects) {
          obj._objects.sort(function (a, b) {
            return a.top - b.top;
          });
          for (var o in obj._objects) {
            if (o > 0) {
              obj._objects[o].top = o * ((obj.getBoundingRect().height / this.canvasZoom) / (obj._objects.length - 1)) - (obj.getBoundingRect().height / this.canvasZoom) / 2 - o * ((obj._objects[o].height * obj._objects[o].scaleY) / (obj._objects.length - 1));
            } else {
              obj._objects[o].top = o * ((obj.getBoundingRect().height / this.canvasZoom) / (obj._objects.length - 1)) - (obj.getBoundingRect().height / this.canvasZoom) / 2;
            }
          }
          this.canvas.renderTop();
          this.canvas.renderAll();
        }

      },
      //左对齐
      toLeftAlign() {
        var obj = this.getEditObj();
        if (obj._objects) {
          for (var o in obj._objects) {
            obj._objects[o].left = -(obj.getBoundingRect().width / this.canvasZoom) / 2;
            this.getactiveobj(obj._objects[o].id).marginLeft = obj.getBoundingRect().left;
          }
          this.canvas.renderTop();
          this.canvas.renderAll();
        }

      },
      //水平居中对齐
      toHorizontalCenterAlign() {
        var obj = this.getEditObj();
        if (obj._objects) {
          for (var o in obj._objects) {
            obj._objects[o].left = -(obj._objects[o].width * obj._objects[o].scaleX) / 2;
          }
          this.canvas.renderTop();
          this.canvas.renderAll();
        }


      },
      //右对齐
      toRightAlign() {
        var obj = this.getEditObj();
        if (obj._objects) {
          for (var o in obj._objects) {
            obj._objects[o].left = (obj.getBoundingRect().width / this.canvasZoom) / 2 - (obj._objects[o].width * obj._objects[o].scaleX);
          }
          this.canvas.renderTop();
          this.canvas.renderAll();
        }

      },
      //顶对齐
      toTopAlign() {
        var obj = this.getEditObj();
        if (obj._objects) {
          for (var o in obj._objects) {
            obj._objects[o].top = -(obj.getBoundingRect().height / this.canvasZoom) / 2;
            this.getactiveobj(obj._objects[o].id).marginTop = obj.getBoundingRect().top;
          }
          this.canvas.renderTop();
          this.canvas.renderAll();
        }

      },
      //垂直居中对齐
      toVerticalCenterAlign() {
        var obj = this.getEditObj();
        if (obj._objects) {
          for (var o in obj._objects) {
            obj._objects[o].top = -(obj._objects[o].height * obj._objects[o].scaleY) / 2;
          }
          this.canvas.renderTop();
          this.canvas.renderAll();
        }

      },
      //底对齐
      toBottomAlign() {
        var obj = this.getEditObj();
        if (obj._objects) {
          for (var o in obj._objects) {
            obj._objects[o].top = (obj.getBoundingRect().height / this.canvasZoom) / 2 - (obj._objects[o].height * obj._objects[o].scaleY);
          }
          this.canvas.renderTop();
          this.canvas.renderAll();
        }

      },




      /**
       borderDashArray:[8,2],                            //  水印框虚线边
       borderColor: '#999',                              //  描边颜色
       cornerColor: '#999',                              //  边角颜色
       cornerStrokeColor: '#999',                        //  边角描边颜色
       cornerFillColor: '#eee',                          //  边角描边颜色
       centeredRotation:false,                           //  旋转中心默认左上角
       lockScalingFlip: true,                            // 禁止缩放时翻转
       rotatingPointOffset: 20,                          // 旋转位置
       selectionColor:        'rgba(0,0,0,0.1)' ,        // 拖拽选择框样式
       selectionBorderColor:   'rgba(0, 0, 0, 0.4)',     // 拖拽选择框样式修改
       * */

      /**
       * 创建元素
       * @param name   : Rect, Rectangle, Parallelogram, Circle, Dottedline, EqualTriangle, Image, Barcode, Qrcode, Text
       * @param options: id, name, left, top, width, height, angle, padding, scaleX,  scaleY, selectable, visible, fill,
       *  fillColor，backgroundColor, stroke, strokeWidth, strokeDashArray,
       *  rx, ry,
       *  skewX,
       *  DottedlineType ,
       *  radius ,
       *  url,
       *  imgData,
       * @return obj
       * */
      createElement(name,options){
        if(!name){
          return
        }
        let canvasObject,newOptions;
        options = {
          ...options,
          id:options.id ? options.id : 1,

          component:"component",
          isDiff: 'static',
          padding: 0,
          scaleX: 1,
          scaleY: 1,
          flipX: false,
          flipY: false,
          originX: 'left',
          originY: 'top',
          stopContextMenu: true,                            //  禁掉鼠标右键默认事件
          minScaleLimit: 0.0001,                            //  最小限制
          lockSkewingX: true,                               //  禁掉按住shift时的变形
          lockSkewingY:true,

          left: options.left ? -this.xLeft + options.left: -this.xLeft,
          top: options.top ? -this.yTop + options.top : -this.yTop,
          width: options.width ? options.width : 60,
          height:options.height ? options.height : 30,
          angle: options.angle ? options.angle : 0,

          fill: options.fill?options.fill:'#000000',                                            // 填充的颜色（矩形）
          fillColor: options.fillColor?options.fillColor:'#000000',                              // 填充的颜色

          backgroundColor: options.backgroundColor?options.backgroundColor:'rgba(0,0,0,0)',   // 边框填充的颜色
          stroke: options.stroke?options.stroke:'rgba(0,0,0,0)',                              // 边框颜色
          strokeWidth: options.strokeWidth?options.strokeWidth:0,                             // 边框宽度
          strokeDashArray:options.strokeDashArray?options.strokeDashArray:[0,0],              // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

          selectable: options.selectable!==false ? true : options.selectable,                 //元素是否可选中
          visible: options.visible!==false ? true : options.visible,                          //元素是否可见
        };

        switch(name){
          case 'Rect':              //----------------------------------------------------------------------------------------矩形
            newOptions = {
              ...options,
              isType:'Rect',
              name:options.name?options.name:'Rect',
              rx:0,
              ry:0,
            };
            canvasObject = new fabric.Rect({...newOptions});          //创建

            break;
          case 'Rectangle':         //----------------------------------------------------------------------------------------圆角矩形
            newOptions = {
              ...options,
              isType:'Rectangle',
              name:options.name?options.name:'Rectangle',
              rx:options.rx?options.rx:15,
              ry:options.ry?options.ry:15,
            };
            canvasObject = new fabric.Rect({...newOptions});          //创建
            break;
          case 'Parallelogram':     //----------------------------------------------------------------------------------------平行四边形
            newOptions = {
              ...options,
              isType:'Parallelogram',
              name:options.name?options.name:'Parallelogram',
              rx:0,
              ry:0,
              skewX:options.skewX?options.skewX:-45,
              skewY:0,   //暂不允许y轴变形吧 options.skewY?options.skewY:0,
            };
            canvasObject = new fabric.Rect({...newOptions});          //创建
            break;
          case 'Circle':            //----------------------------------------------------------------------------------------椭圆形
            newOptions = {
              ...options,
              isType:'Parallelogram',
              name:options.name?options.name:'Parallelogram',
              rx:options.width/2,      // options.rx?options.rx:15,
              ry:options.height/2,     // options.ry?options.ry:15,
            };
            canvasObject = new fabric.Ellipse({...newOptions});          //创建
            break;
          case 'EqualCircle':            //----------------------------------------------------------------------------------------正圆
            newOptions = {
              ...options,
              isType:'EqualCircle',
              name:options.name?options.name:'EqualCircle',
              radius:options.width/2,
            };
            canvasObject = new fabric.Circle({...newOptions});          //创建
            canvasObject.setControlsVisibility({                        //上中、下中、左中、右中 取消
              bl: true,
              br: true,
              mb: false,
              ml: false,
              mr: false,
              mt: false,
              mtr: true,
              tl: true,
              tr: true
            });
            break;
          case 'Dottedline':        //----------------------------------------------------------------------------------------线段
            newOptions = {
              ...options,
              isType:'Dottedline',
              name:options.name?options.name:'Dottedline',
              strokeDashArray: options.DottedlineType===3?[10, 4, 3, 4]:(options.DottedlineType===2?[8,2]:[0,0]),
              stroke: options.fill,
              strokeWidth: options.height,
            };
            let x1 = -this.xLeft + options.left;
            let x2 = -this.xLeft + options.left + options.width;
            let y1 =  -this.yTop + options.top;
            let y2 = -this.yTop + options.top;
            canvasObject = new fabric.Line([ x1,y1,x2,y2],{...newOptions});          //创建
            canvasObject.setControlsVisibility({                                     //左上、左下、右上、右下 取消
              bl: false,
              br: false,
              mb: true,
              ml: true,
              mr: true,
              mt: true,
              mtr: true,
              tl: false,
              tr: false
            });
            break;
          case 'EqualTriangle':     //----------------------------------------------------------------------------------------等边三角
            newOptions = {
              ...options,
              isType:'EqualTriangle',
              name:options.name?options.name:'EqualTriangle',
            };
            canvasObject = new fabric.Triangle({...newOptions});          //创建
            break;
          case 'Image':             //----------------------------------------------------------------------------------------图片
            let canvas = this.canvas;
            let that = this;
            fabric.Image.fromURL(options.url, function (img) {
              img.set({                   //图片不设置宽度高度，来定义图片放大缩小
                id: options.id ? options.id : 'image',
                isType: 'Image',
                component:"component",
                isDiff: 'static',
                padding: 0,
                flipX: false,
                flipY: false,
                originX: 'left',
                originY: 'top',
                stopContextMenu: true,                            //  禁掉鼠标右键默认事件
                minScaleLimit: 0.0001,                            //  最小限制
                lockSkewingX: true,                               //  禁掉按住shift时的变形
                lockSkewingY:true,

                left: options.left,
                top: options.top,
                angle: options.angle ? options.angle : 0,
                name: options.name ? options.name : 'Image',
                scaleX:  options.width / img.width,
                scaleY: options.height / img.height,

                stroke: options.stroke?options.stroke:'rgba(0,0,0,0)',                              // 边框颜色
                strokeWidth: options.strokeWidth?options.strokeWidth:0,                             // 边框宽度
                strokeDashArray:options.strokeDashArray?options.strokeDashArray:[0,0],              // 边框样式 虚线 [5,1]     直线[0,0]  线段也是这个参数

                selectable: options.selectable!==false ? true : options.selectable,                 //元素是否可选中  如段码屏中可见不可移动false
                visible: options.visible!==false ? true : options.visible,                          //元素是否可见
              });
              img.hasControls = true;
              img.hasBorders = true;
              canvas.add(img); // 把图片添加到画布上
              if (options && options.registeObjectEvent) {
                Utils.registeObjectEvent(that, img);
              }
              canvas.renderAll.bind(canvas);
              that.setTop();  //遮罩置顶
            });
            return;
            break;
          case 'Barcode':           //----------------------------------------------------------------------------------------条码
            break;
          case 'Qrcode':            //----------------------------------------------------------------------------------------二维码
            break;
          case 'Text':              //----------------------------------------------------------------------------------------文本
            break;
          default:                  //----------------------------------------------------------------------------------------其他

        }

        console.log(canvasObject);

        this.canvas.add(canvasObject);
        this.setTop();                                         //遮罩置顶
        this.canvas.renderAll();

        return canvasObject;

      },



      /**
       * 创建矩形√、 圆角矩形 、平行四边形
       * @options {
       *     id, width, height, left, top, padding, angle, scaleX,  scaleY, selectable, visible,   与原数据同名
       *     fillColor，backgroundColor, stroke, strokeWidth, strokeDashArray,           原数据名改造
       *     rx, ry, skewX,    影响圆角和形状
       * }
       * */
      createRect (options) {
       //   console.log('create rect',JSON.stringify(options));
        options = Object.assign({ width: 50, height: 30, left: -this.xLeft, top:  -this.yTop,  padding: 0, angle: 0, scaleX: 1,  scaleY: 1, }, options);
        let rect = new fabric.Rect({
          ...options,
          left: -this.xLeft + options.left,
          top:  -this.yTop + options.top,
          id:options.id,
          name:options.name?options.name:'Rect',
          component:"component",
          isType:'Rect',
          isDiff: 'static',

          selectable: options.selectable!==false ? true : options.selectable,                 //元素是否可选中
          visible: options.visible!==false ? true : options.visible,                          //元素是否可见

          fill: options.fill?options.fill:'#000',                                            // 填充的颜色（矩形）
          fillColor: options.fillColor?options.fillColor:'#000',                              // 填充的颜色

          backgroundColor: options.backgroundColor?options.backgroundColor:'rgba(0,0,0,0)',   // 边框填充的颜色
          stroke: options.stroke?options.stroke:'rgba(0,0,0,0)',                              // 边框颜色
          strokeWidth: options.strokeWidth?options.strokeWidth:0,                             // 边框宽度
          strokeDashArray:options.strokeDashArray?options.strokeDashArray:[0,0],                    // 边框样式 虚线 [5,1]     直线[0,0]

          minScaleLimit: 0.0001,                            //  最小限制

          flipX: false,
          flipY: false,
          originX: 'left',
          originY: 'top',

          stopContextMenu: true,                            //禁掉鼠标右键默认事件
        });
        rect.setCoords();
        this.canvas.add(rect);
        this.setTop();  //遮罩置顶
        this.canvas.renderAll();
        return rect;
      },


      //创建文本
      createText (text, options) {
        options = Object.assign({width: 50, height: 30, left: -this.xLeft, top:  -this.yTop,  padding: 0, angle: 0, scaleX: 1,  scaleY: 1, }, options);
        var canvasObj = new fabric.Textbox(text, {
            ...options,
            left: -this.xLeft + options.left,
            top:  -this.yTop + options.top,
            id:options.id,
            name:options.name?options.name:'Text',
            component:"component",
            isType:'Text',
            isDiff: 'static',
            textAlign: 'left',

            selectable: options.selectable!==false ? true : options.selectable,                 //元素是否可选中
            visible: options.visible!==false ? true : options.visible,                          //元素是否可见

            fill: options.fill?options.fill:'#000',                                            // 填充的颜色（矩形）
            fillColor: options.fillColor?options.fillColor:'#000',                              // 填充的颜色

            backgroundColor: options.backgroundColor?options.backgroundColor:'rgba(0,0,0,0)',   // 边框填充的颜色
            stroke: options.stroke?options.stroke:'rgba(0,0,0,0)',                              // 边框颜色
            strokeWidth: options.strokeWidth?options.strokeWidth:0,                             // 边框宽度
            strokeDashArray:options.strokeDashArray?options.strokeDashArray:[0,0],                    // 边框样式 虚线 [5,1]     直线[0,0]

            minScaleLimit: 0.0001,                            //  最小限制

            flipX: false,
            flipY: false,
            originX: 'left',
            originY: 'top',
          lockSkewingX: true,                  //禁掉按住shift时的变形
          lockSkewingY:true,
            stopContextMenu: true,                            //禁掉鼠标右键默认事件
        });
          canvasObj.setCoords();
          this.canvas.add(canvasObj);
          this.setTop();  //遮罩置顶
          this.canvas.renderAll();
          return canvasObj;
      },


        //创建图片
      createImage (url, options) {
        let canvas = this.canvas;
        let that = this;
        fabric.Image.fromURL(url, function (img) {
          let maxWidth = that.width / 2;
          let width = 0;
          let height = 0;
          if (img.width > img.height) {
            if (img.width > maxWidth) {
              width = maxWidth;
              height = (img.height / img.width) * width;
            } else {
              width = img.width;
              height = img.height;
            }
          } else {
            if (img.height > maxWidth) {
              height = maxWidth;
              width = (img.width / img.height) * height;
            } else {
              width = img.width;
              height = img.height;
            }
          }
          if (options && options.width) {
            width = options.width;
          }
          if (options && options.height) {
            height = options.height;
          }
          let leftP = that.width / 2;
          let topP = that.height / 2;
          if (options && options.left || (options && options.left===0)) {
            leftP = options.left;
          }
          if (options && options.top || (options && options.top===0)) {
            topP = options.top;
          }
          img.set({
            id: options.id ? options.id : 'image',
            name:options.name?options.name:'Image',
            component:"component",
            isType:'Image',
            isDiff: 'static',
            left: leftP,
            top: topP,
            scaleX: width / img.width,
            scaleY: height / img.height,
            originX: 'left',
            originY: 'top',
            angle:0,
            lockSkewingX: true,                  //禁掉按住shift时的变形
            lockSkewingY:true,

          });

          var oldOriginX = img.get('originX');
          var oldOriginY = img.get('originY');
          var center = img.getCenterPoint();
          img.hasControls = true;
          img.hasBorders = true;

          canvas.add(img); // 把图片添加到画布上
          if (options && options.registeObjectEvent) {
            Utils.registeObjectEvent(that, img);
          }
          canvas.renderAll.bind(canvas);
          that.setTop();  //遮罩置顶
        });

      },

      //创建二维码
      createQrcode (url, options) {
        let canvas = this.canvas;
        let that = this;

        this.drawqrcode(url,{});

        var qrcodedata = document.getElementById('qrcode');
        console.log(qrcodedata);

        setTimeout(()=>{
          var canvasObject = new fabric.Image(qrcodedata, {
            left: -this.xLeft + options.left,
            top:  -this.yTop + options.top,
            id:options.id,
            name:options.name?options.name:'Qrcode',
            component:"component",
            isType:'Qrcode',
            isDiff: 'static',
            flipX: false,
            flipY: false,
            lockSkewingX: true,                  //禁掉按住shift时的变形
            lockSkewingY:true,
            originX: 'left',
            originY: 'top',
            lockUniScaling:true,

          });
          canvas.add(canvasObject);
          canvas.renderAll.bind(canvas);
          that.setTop();  //遮罩置顶

        },1000);

      },

      //创建条码
      createBarcode (url, options) {
        let canvas = this.canvas;
        let that = this;

        this.drawbarcode(url,{});

        var barcodedata = document.getElementById('barcode');
        console.log(barcodedata);

        setTimeout(()=>{
          var canvasObject = new fabric.Image(barcodedata, {
            left: -this.xLeft + options.left,
            top:  -this.yTop + options.top,
            id:options.id,
            name:options.name?options.name:'Qrcode',
            component:"component",
            isType:'Qrcode',
            isDiff: 'static',
            flipX: false,
            flipY: false,
            lockSkewingX: true,                  //禁掉按住shift时的变形
            lockSkewingY:true,
            originX: 'left',
            originY: 'top',

          });
          canvas.add(canvasObject);
          canvas.renderAll.bind(canvas);
          that.setTop();  //遮罩置顶

        },1000);

      },


    }
  }
</script>

<style scoped lang="scss">
  .bigbox{
      position:relative;
      /*border: 1px solid #ddd;*/
      /*margin:50px auto;*/
      overflow: hidden;
      /*border: 1px solid #E5E9F2;
      box-sizing: border-box;*/
  }
  .content{
    position:relative;
    overflow: auto;
    /*background: url("../../../static/images/psbg.png") repeat;*/
    background: #f1f1f1;
  }
  .x-line{
    width: 100%;
    height: 18px;
    left: 18px;
    opacity: 0.8;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAYAAAAZk42HAAAACXBIWXMAAAsTAAALEwEAmpwYAAA6mGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDIwLTEwLTE0VDE0OjUwOjIwKzA4OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjAtMTAtMTRUMTc6NTY6MjMrMDg6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDIwLTEwLTE0VDE3OjU2OjIzKzA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPgogICAgICAgICAgICA8cmRmOkJhZz4KICAgICAgICAgICAgICAgPHJkZjpsaT54bXAuZGlkOjYwMWNmMzFmLTI5Y2UtZWY0ZC1iYzNiLWZmMDNhNzFmNTM2ZTwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpCYWc+CiAgICAgICAgIDwvcGhvdG9zaG9wOkRvY3VtZW50QW5jZXN0b3JzPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOmU0MTdkNzFiLTk0OTQtZTQ0Mi1hNjRiLTFkYjBhY2Q0YzUyYzwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDo1MmNmMGFlNi0wYjk5LWIyNDMtODA2Mi04NWIwNDk2MDljYmQ8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo1MmNmMGFlNi0wYjk5LWIyNDMtODA2Mi04NWIwNDk2MDljYmQ8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NTJjZjBhZTYtMGI5OS1iMjQzLTgwNjItODViMDQ5NjA5Y2JkPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIwLTEwLTE0VDE0OjUwOjIwKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDplNDE3ZDcxYi05NDk0LWU0NDItYTY0Yi0xZGIwYWNkNGM1MmM8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjAtMTAtMTRUMTc6NTY6MjMrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjUwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjE4PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz6N3U9SAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABESURBVHja7M+xEQAgDMNA779BphUtBTUXggo1PjefqgLI3otbhAi5CDnV/fcfpHtChAgRIkSIEEgmIEZBFgAAAP//AwBdbXYX1O3j3gAAAABJRU5ErkJggg==);
    /*background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAYAAAAZk42HAAAACXBIWXMAAAsTAAALEwEAmpwYAAA5z2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDIwLTEwLTE0VDE0OjUwOjIwKzA4OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjAtMTAtMTRUMTQ6NTM6MTgrMDg6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDIwLTEwLTE0VDE0OjUzOjE4KzA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjJlNGFiNGFiLTQ5MDQtNzg0Mi04MjQyLTM0ZjE5MWQ5NzQ3MDwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+eG1wLmRpZDpmZGQ2MzFhNC0yOWQwLTAwNDktYWRiZi1jZmM1ODI0OGMwYTc8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDpmZGQ2MzFhNC0yOWQwLTAwNDktYWRiZi1jZmM1ODI0OGMwYTc8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ZmRkNjMxYTQtMjlkMC0wMDQ5LWFkYmYtY2ZjNTgyNDhjMGE3PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIwLTEwLTE0VDE0OjUwOjIwKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDoyZTRhYjRhYi00OTA0LTc4NDItODI0Mi0zNGYxOTFkOTc0NzA8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjAtMTAtMTRUMTQ6NTM6MTgrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjUwPC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjE4PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz44Q+t8AAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAA8SURBVHja7M+xDQAACAJB99/gp9U1FJ+EhtBcAZ3QAjohQoQIESJEiJCXkO2/bMjFTchKSEIHAAD//wMAQq9ONkf1DTcAAAAASUVORK5CYII=);*/
    border-right:1px dashed #000;
  }
  .y-line{
    width: 18px;
    height: 100%;
    top: 18px;
    opacity: 0.8;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAYAAABRYothAAAACXBIWXMAAAsTAAALEwEAmpwYAAA5z2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMTQgNzkuMTUxNDgxLCAyMDEzLzAzLzEzLTEyOjA5OjE1ICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDIwLTEwLTE0VDE0OjU1OjUzKzA4OjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMjAtMTAtMTRUMTg6MDM6MzgrMDg6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDIwLTEwLTE0VDE4OjAzOjM4KzA4OjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8eG1wTU06RG9jdW1lbnRJRD54bXAuZGlkOjYwMWNmMzFmLTI5Y2UtZWY0ZC1iYzNiLWZmMDNhNzFmNTM2ZTwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDpmNTBlYmMyZC01MmE4LTUzNDMtYjVjNS0zZTY4YzAzMDY2ZGU8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo2MDFjZjMxZi0yOWNlLWVmNGQtYmMzYi1mZjAzYTcxZjUzNmU8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6N2ZlNmViZDgtYTQwNS1jMTRhLTk2MTEtYjczNDg4MDU5Yjc4PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDIwLTEwLTE0VDE0OjU1OjUzKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDpmNTBlYmMyZC01MmE4LTUzNDMtYjVjNS0zZTY4YzAzMDY2ZGU8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMjAtMTAtMTRUMTg6MDM6MzgrMDg6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjE4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjUwPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgCjw/eHBhY2tldCBlbmQ9InciPz4gLB/dAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABKSURBVHja7NKhDQAwDMTA33+DTOuilpUkUkFl8FJQwMmpKiYDAiT7mO7nRzc8jR5gd9HFtmzLFtuyLduyxbZsy/bR2QIAAP//AwDgonYXrvU/uwAAAABJRU5ErkJggg==);

    border-bottom:1px dashed #000;
  }
  .number{
    position: absolute;
    font: 10px/1 Arial, sans-serif;
    color: #333;
    cursor: default;
  }
  .x-line .number{
    top: 7px;
  }
  .y-line .number{
    width: 8px;
    left: 8px;
    word-wrap: break-word;
  }

  .xZhou{
    position: absolute;
    margin-left:18px;
    z-index: 2;
   /* width: 572px;*/
    overflow-x: scroll;
    height: 18px;
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    -khtml-user-select:none; /*早期浏览器*/
    user-select:none;
  }
  .boxblock{
    position: absolute;
    z-index:2;
    width: 18px;
    height: 18px;
    background: #F5F5F5;
  }
  .yZhou{
    position: absolute;
    margin-top:18px;
    z-index: 2;
    width: 18px;
    overflow-y: scroll;
   /* height: 572px;*/
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    -khtml-user-select:none; /*早期浏览器*/
    user-select:none;
  }
  .xZhou::-webkit-scrollbar ,.yZhou::-webkit-scrollbar{
    display:none;
  }

  .content::-webkit-scrollbar{
    display: none;
  }
  .scrollx{
    position: absolute;
    z-index: 2;
    width: 10px;
    margin-left:992px;
    height: 500px;
    /*background:rgba(0,0,0,0.1);*/
    i{
      position: absolute;
      cursor: pointer;
      z-index: 99999;
      top:19px;
      right: 1px;
      width: 8px;
      height: 50px;
      background: rgba(0,0,0,0.2);
      opacity: 0.8;
      border-radius: 100px;
      -moz-user-select:none; /*火狐*/
      -webkit-user-select:none; /*webkit浏览器*/
      -ms-user-select:none; /*IE10*/
      -khtml-user-select:none; /*早期浏览器*/
      user-select:none;
      &:hover{
        opacity: 1;
      }
    }
  }

  .scrolly{
    position: absolute;
    z-index: 2;
    height: 10px;
    margin-top:492px;
    width: 1000px;
  /*  background:rgba(0,0,0,0.1);*/
    i{
      position: absolute;
      cursor: pointer;
      z-index: 99999;
      bottom:1px;
      left: 19px;
      width: 50px;
      height: 8px;
      background: rgba(0,0,0,0.2);
      opacity: 0.8;
      border-radius: 100px;
      -moz-user-select:none; /*火狐*/
      -webkit-user-select:none; /*webkit浏览器*/
      -ms-user-select:none; /*IE10*/
      -khtml-user-select:none; /*早期浏览器*/
      user-select:none;
      &:hover{
        opacity: 1;
      }
    }

  }


  .title{
    position: fixed;
    top:20px;
    left:20px;
    z-index: 9999999999;
  }
</style>
