<template>
  <div class="demobox">
    <div class="top">
      <b>保存</b>

      <b>预览</b>

      <b @click="disRulder">设置标尺</b>

      <b @click="clickthis">选中</b>

      <span class="resolutionbox">缩放
        <select name="scale" id="scale" v-model="bigger" @change="changeScale">
                     <option value="0.1">10%</option>

           <option value="0.5">50%</option>
          <option value="0.8">80%</option>
          <option value="1">100%</option>
          <option value="1.1">110%</option>
          <option value="1.2">120%</option>
          <option value="1.3">130%</option>
          <option value="1.4">140%</option>
          <option value="3">300%</option>
        </select>
      </span>

      <span class="resolutionbox">切换分辨率
        <select name="resolution" id="resolution" v-model="resolution" @change="changeResolution">
          <option value="800*500">800*500</option>
           <option value="500*500">500*500</option>
           <option value="500*400">500*400</option>
           <option value="600*200">600*200</option>
           <option value="400*800">400*800</option>
          <option value="200*100">200*100</option>

          <option value="1200*500">1200*500</option>
           <option value="1920*500">1920*500</option>
          <option value="500*1800">500*1800</option>
          <option value="2310*1080">2310*1080</option>
        </select>
      </span>

      <b @click="getObjectsNew">获取全部元素</b>

      <b  @click="$refs.canvas.setNewTable($refs.canvas.getEditObj(),table2)">新增一列</b>


    </div>

    <div class="bot">
      <div class="menuleft">
          <div class="components">

            <!--文本-->
            <div class="oneComponent" @click="addCom('TextRect',{hasRotatingPoint:false,width:250,height:100,fontColor:'#f00',backgroundColor:'#ff0',stroke:'#f00',strokeWidth: 2,
            xLeft:10,yTop:20,xRight:30,yBot:40,
            fontSize:30,textdemo:'abcdefg',originXY:['right','bottom']})">
              <div class="iconfont icon-wenben"></div>
            </div>

            <!--时间-->
            <div class="oneComponent" @click="addCom('Time',{hasRotatingPoint:false,textdemo:'2010-10-10 10:30:10'})">
              <div class="iconfont icon-jiacu"></div>
            </div>

            <!--线条-->
            <div class="oneComponent" @click="addCom('Dottedline',{ hasRotatingPoint:false,strokeWidth:2,DottedlineType:2,})">
              <div class="iconfont icon-zhixian"></div>
            </div>

            <!--矩形-->
            <div class="oneComponent" @click="addCom('Rect')">
              <div class="iconfont icon-juxing1"></div>
            </div>

            <!--圆角矩形-->
            <div class="oneComponent" @click="addCom('Rectangle',{fill:'#f00'})">
              <div class="iconfont icon-yuanjiaojuxing"></div>
            </div>

            <!--椭圆形-->
            <div class="oneComponent" @click="addCom('Circle',{fill:'#ff0'})">
              <div class="iconfont icon-tuoyuanxing"></div>
            </div>

            <!--图片-->
            <div class="oneComponent" @click="addCom('Image',{hasRotatingPoint:false,width:80,height:80,})">
              <div class="iconfont icon-tupian3"></div>
            </div>

            <!--图片2-->
            <div class="oneComponent" @click="addCom('Image2',{hasRotatingPoint:false,width:80,height:80,src:'http://47.118.58.9:8410/group1/M00/00/18/rBMAA2CBCw2AVX1sADXcr0OOIYE104.jpg'})">
              <div class="iconfont icon-tupian3"></div>
            </div>

            <!--图片3-->
            <div class="oneComponent" @click="addCom('Image3',{hasRotatingPoint:false,width:80,height:80,src:'../../../static/images/6.png'})">
              <div class="iconfont icon-tupian3"></div>
            </div>

            <!--图片3-->
            <div class="oneComponent" @click="addCom('Image3',{hasRotatingPoint:false,width:80,height:80,src:'../../../static/images/8.png'})">
              <div class="iconfont icon-tupian3"></div>
            </div>

            <!--图片4-->
            <div class="oneComponent" @click="addCom('equalImage',{hasRotatingPoint:false,width:80,height:80,src:'../../../static/images/8.png'})">
              <div class="iconfont icon-tupian3"></div>
            </div>

            <!--条形码-->
            <div class="oneComponent" @click="addCom('Barcode',{hasRotatingPoint:false,width:600,height:30,originXY:['left','top'] ,lineColor:'#ff0000'})">
              <div class="iconfont icon-tiaoma"></div>
            </div>

            <!--二维码-->
            <div class="oneComponent" @click="addCom('Qrcode',{hasRotatingPoint:false,width:80,height:80,lineColor:'#ff0000'})">
              <div class="iconfont icon-erweima1"></div>
            </div>

            <!--三角形-->
            <div class="oneComponent" @click="addCom('EqualTriangle')">
              <div class="iconfont icon-sanjiaoxing"></div>
            </div>

            <!--平行四边形-->
            <div class="oneComponent" @click="addCom('Parallelogram')">
              <div class="iconfont icon-pinghangsibianxing"></div>
            </div>

            <!--表格-->
            <div class="oneComponent" @click="addCom('tableView',)">
              <div class="iconfont icon-pinghangsibianxing"></div>
            </div>

            <!--表格2-->
            <div class="oneComponent" @click="addCom('tableList',{},table)">
              <div class="iconfont icon-juxing1"></div>
            </div>

          </div>

      </div>

      <div :style="'min-width: calc(100vw - 250px);height: calc(100vh - 60px);width:'+boxWidth+'px;'">
        <Fabric-Canvas ref="canvas" :idno="id" :width="width" :height="height" :boxWidth="boxWidth" :boxHeight="boxHeight"
                       :showRuler="showRuler" :stepLengthp="stepLength" @idAdd="idAdd" @preview ="preview" @setlefttop="setlefttop"
                       @object:selected = "objectselected"
                       @selection:updated="selectionupdated"
                       @object:scaled = "objectscaled"
                       @object:moved = "objectmoved"
                       @object:rotating = "objectrotating"

                       @changeZoomTo="changeZoomTo"
                       @copydata="copydata"
                       @deleteidsdata="deleteidsdata"
                       id="can"></Fabric-Canvas>
      </div>

      <div class="rightbox">
          <div class="tuceng">
            <!--<GeminiScrollbar>

            </GeminiScrollbar>-->
          </div>
          <div class="zujian">

          </div>
      </div>

    </div>


  </div>
</template>

<script>

  export default {
    name: "index",
    data() {
      return {
        data: '123',
        resolution:'800*500',
        bigger:1,

        id: 1,
        width: 800,      //标尺、画布的宽
        height: 500,     //标尺、画布的高
        boxWidth: document.documentElement.clientWidth-250,  //外框宽
        boxHeight: document.documentElement.clientHeight-60,   //外框高
        stepLength: 50,  //标尺单位 每格
        showRuler: [true, true],  //横纵标尺是否显示
        showR:true,

        img:'',   //预览图片的
        showimg:false, //显示预览


        currentObj:{},
        origin:[0,0], //新组件位置
        originx:0,
        originy:0,
        table:{
          tableinfo:{
            left:500,
            top:300,
            row:3,
            col:3,
            width:184,
            height:134,
            titleLineHeight:52,
            bodyLineHeight:40,
            times:5,
            animate:0,
            borderWidth:1,
            borderColor:'#ffff00',
            borderType:0,
            bgColors:['#A4CFFC','#AACF98'],

          },
          tableList:[{
            type:0,
            col:1,
            width:60,
            height:50,
            fontType:"",
            fontSize:14,
            fontColor:"#000000",
            value:"A列",
            bgcolor:"#EEEEEE",
            position:5,
            field:"itemTitle",
            fieldType:0,
          },{
            type:0,
            col:2,
            width:60,
            height:50,
            fontType:"",
            fontSize:16,
            fontColor:"#000000",
            value:"B列",
            bgcolor:"#EEEEEE",
            position:5,
            field:"itemTitle",
            fieldType:0,
          },{
            type:0,
            col:3,
            width:60,
            height:50,
            fontType:"",
            fontSize:16,
            fontColor:"#000000",
            value:"C列",
            bgcolor:"#EEEEEE",
            position:5,
            field:"itemTitle",
            fieldType:0,
          },{
            type:1,
            col:1,
            width:60,
            height:40,
            fontType:"",
            fontSize:14,
            fontColor:"#000000",
            value:"A列值",
            bgcolor:"#EEEEEE",
            position:5,
            field:"",
            fieldType:0,
          },{
            type:1,
            col:2,
            width:60,
            height:40,
            fontType:"",
            fontSize:14,
            fontColor:"#000000",
            value:"B列值",
            bgcolor:"#EEEEEE",
            position:5,
            field:"",
            fieldType:0,
          },{
            type:1,
            col:3,
            width:60,
            height:40,
            fontType:"",
            fontSize:12,
            fontColor:"#ff0000",
            value:"C列值",
            bgcolor:"#EEEEEE",
            position:9,
            field:"",
            fieldType:0,
          }]
        },
        table2:{
          tableinfo:{
            left:500,
            top:300,
            row:3,
            col:4,
            width:245,
            height:134,
            titleLineHeight:52,
            bodyLineHeight:40,
            times:5,
            animate:0,
            borderWidth:1,
            borderColor:'#ffff00',
            borderType:0,
            bgColors:['#A4CFFC','#AACF98'],

          },
          tableList:[{
            type:0,
            col:1,
            width:60,
            height:50,
            fontType:"",
            fontSize:14,
            fontColor:"#000000",
            value:"A列",
            bgcolor:"#EEEEEE",
            position:5,
            field:"itemTitle",
            fieldType:0,
          },{
            type:0,
            col:2,
            width:60,
            height:50,
            fontType:"",
            fontSize:16,
            fontColor:"#000000",
            value:"B列",
            bgcolor:"#EEEEEE",
            position:5,
            field:"itemTitle",
            fieldType:0,
          },{
            type:0,
            col:3,
            width:60,
            height:50,
            fontType:"",
            fontSize:16,
            fontColor:"#000000",
            value:"C列",
            bgcolor:"#EEEEEE",
            position:5,
            field:"itemTitle",
            fieldType:0,
          },{
            type:0,
            col:4,
            width:60,
            height:50,
            fontType:"",
            fontSize:16,
            fontColor:"#000000",
            value:"D列",
            bgcolor:"#EEEEEE",
            position:5,
            field:"itemTitle",
            fieldType:0,
          },{
            type:1,
            col:1,
            width:60,
            height:40,
            fontType:"",
            fontSize:14,
            fontColor:"#000000",
            value:"A列值",
            bgcolor:"#EEEEEE",
            position:5,
            field:"",
            fieldType:0,
          },{
            type:1,
            col:2,
            width:60,
            height:40,
            fontType:"",
            fontSize:14,
            fontColor:"#000000",
            value:"B列值",
            bgcolor:"#EEEEEE",
            position:5,
            field:"",
            fieldType:0,
          },{
            type:1,
            col:3,
            width:60,
            height:40,
            fontType:"",
            fontSize:12,
            fontColor:"#ff0000",
            value:"C列值",
            bgcolor:"#EEEEEE",
            position:9,
            field:"",
            fieldType:0,
          },{
            type:1,
            col:4,
            width:60,
            height:40,
            fontType:"",
            fontSize:12,
            fontColor:"#ff0000",
            value:"aaa",
            bgcolor:"#EEEEEE",
            position:9,
            field:"",
            fieldType:0,
          }]
        }
      }
    },
    mounted() {
      this.boxWidth = document.documentElement.clientWidth-250;
      let _this = this;
      window.onresize = ()=>{     //浏览器缩放画布变化
          return (()=>{
            _this.boxWidth = document.documentElement.clientWidth-250;
            this.$refs.canvas.setZoom(1);
            this.$refs.canvas.initBgRect();
          })();
      };
      this.$refs.canvas.setZoom(1);  //设置画布缩放比例
      this.$refs.canvas.initBgRect(); //初始化画布


      this.init();
     /* setTimeout(()=>{
        this.$refs.canvas.setCursor(1); //设置画笔
      },1000);*/

      /*setTimeout(() => {
        this.$refs.canvas.setZoom(1.5);
      }, 2000);*/
    },
    methods: {
      //模板使用调用方法
      idAdd() {
        this.id = this.id + 1;
      },
      //获取左上距原点距离
      setlefttop(x,y){
        this.originx = x;
        this.originy = y;
      },
      //预览
      preview(data){
          this.img = data;
      },
      //取消标尺
      disRulder(){
        this.showR = !this.showR;
        this.$refs.canvas.setNoSeeRuler(this.showR);
      },



      //预览框开关
      toshow(){
        let url =  this.$refs.canvas.todata();
        console.log(url);
        this.showimg = !this.showimg;
      },

      clickthis(){
        this.$refs.canvas.setStackingtrue();
      },

      //缩放------------------
      changeScale(){

        let e = parseFloat(this.bigger);

        this.$refs.canvas.setZoom(e);
        this.$refs.canvas.initBgRect(); //初始化画布

        if(e<1){
          this.$refs.canvas.setNoSeeRuler(false); //关闭标尺
        }else{
          this.$refs.canvas.setNoSeeRuler(true); //开启标尺
        }
      },
      //回调缩放
      changeZoomTo(n){
         console.log('回调：',n);
        this.bigger = n;

      },
      //复制回调
      copydata(data,ids){
        console.log('copy',data,ids)
      },

      //删除回调
      deleteidsdata(ids){
        console.log('del',ids)
      },

      //切换分辨率 -----------------------------
      changeResolution(){
        console.log('分辨率：',this.resolution);

        this.width = parseInt(this.resolution.split('*')[0]);
        this.height =  parseInt(this.resolution.split('*')[1]);
        this.$refs.canvas.initBgRect();
        setTimeout(()=>{
          this.$refs.canvas.setZoom(this.bigger);
        },100);


      },

      //对象选择
      objectselected(obj){
        if(obj.target){
          this.changeTargetObj(obj.target);
        }
      },
      //对象选择更新
      selectionupdated(obj){
        if(obj.target){
          this.changeTargetObj(obj.target);
        }
      },
      //对象放大
      objectscaled(obj){
        if(obj.target){
          this.changeTargetObj(obj.target);
        }
      },
      //对象移动
      objectmoved(obj){
        if(obj.target){
          this.changeTargetObj(obj.target);
        }
      },
      //对象旋转
      objectrotating(obj){
        if(obj.target){
          this.changeTargetObj(obj.target);
        }
      },

      //初始化
      init() {
        var canvas = this.$refs.canvas;
        // fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';


        /*this.idAdd();
        canvas.createText('ZKONG11111',{
          fontSize: 26,
          left:600,
          fill:'#ff0000',
          top:200,
        })*/

        let element = this.$refs.canvas.createElement('TextRect',{hasRotatingPoint:false,width:250,height:100,fontColor:'#f00',backgroundColor:'#ff0',stroke:'#f00',strokeWidth: 2,
          xLeft:10,yTop:20,xRight:30,yBot:40,
          fontSize:30,textdemo:'abcdefg',originXY:['right','bottom']});
      /*
       山田模板中测试四角按钮改变
       var deleteIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABRElEQVQ4T7WVsU4CQRCG//8SYqOxt4aE3SMo0GnsLKWUQl9AfQY7fQb1BWywE0sTC6MVB0rIHQm02hsrQ3JjADc5904TZd1qMzv/N9mZ2VkiYw3z+YW3XK4hwjLIskBWJ24EnyDSI6W3NB43C6PRuy2nbegqVRDwVICtrGDGRuCGkMNKFA2Tfl+AQbG0Dcatn0CpM/HqtUH/OhFotu1ovS+Cs1/BPp1JHFTD8HyWFgDdYmk9Znz/F5jReOJtVAb9B976/uJyLHcCrM0DJPD46nGT7aK/S8qFDatFITtKNwXYsZJ+WY3CRqC02BoR7rGt/GNCjjLKPxUmoQRStqROwBMGWl9BUM+6bhIwObcDpDREi4HSzwBWvsufgU47ISMFlu7lH4Cur+y8KM7bxnljO396puxOh4OBOh1fBup0wBroPF/AB6iE3j8DlE/8AAAAAElFTkSuQmCC";
        fabric.Canvas.prototype.customiseControls({
          settings: {
            borderColor: '#e4e4e4',
            cornerSize: 14,
            cornerShape: 'rect',  // 'rect', 'circle'
            cornerBackgroundColor: '#e4e4e4'
          },
          tr: {
            icon:delimg,
            action: (eventData, transform)=>{        //删除
              var target = transform;
              var canvas = target.canvas;
              canvas.remove(target);
              canvas.requestRenderAll();
            },
            cursor:deleteIcon,

          },
          tl: {
            icon:'../../assets/d.png',
            action: (eventData, transform)=>{        //复制
              var target = transform;
              var canvas = target.canvas;
              target.clone(function(cloned) {
                cloned.left += 10;
                cloned.top += 10;
                canvas.add(cloned);
              });
            },
            cursor:'pointer',

          },
        });
        element.setControlsVisibility({
          bl: false,
          br: true,
          mb: false,
          ml: false,
          mr: false,
          mt: false,
          mtr: false,
          tl: true,
          tr: true
        });
        element.setCoords();
        this.$refs.canvas.renderCanvas();  //画布渲染变化

        console.warn(element);*/



      },
      //创建组件
      addCom(name,options,table){
        if(!options){
          options = {};
        }
        this.idAdd();
        options.id = this.id;
        this.origin[0] =  this.origin[0] + 10;
        this.origin[1] = this.origin[1] + 10;
        options['left'] = this.origin[0];
        options['top'] = this.origin[1];

        if(name==='tableList'){
          table.tableinfo.id = options.id;

          this.$refs.canvas.createElement('tableList',table);
        }else{
          this.$refs.canvas.createElement(name,{...options});
        }

      },
      //画布变化触发数据变动
      changeTargetObj(data){
       // console.log(data);

      },
      //右边数据触发画布变化
      changeDataToCanvas(){
        console.log('右边数据触发画布');
      },

      //获取所有可编辑元素
      getObjectsNew(){
        let objs = this.$refs.canvas.getObjectsNew();
        console.log(objs);
      },



    },
  }
</script>

<style scoped lang="scss">
  .demobox {
    width: 100vw;
    height:100vh;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;

    .top{
      height: 40px;
      border-bottom: 1px solid #ddd;
      background: #fff;
      line-height: 40px;
      padding: 0 50px;
      b{
        font-weight: normal;
        padding: 0 10px;
        display: inline-block;
        border:1px solid #ddd;
        background: #eee;
        font-size: 14px;
        line-height:24px;
        cursor: pointer;
        &:hover{
          background: #0086b3;
          color: #fff;
        }
      }
      .resolutionbox{
        font-size: 12px;
        margin-left: 20px;
        select{
          border:1px solid #ddd;
          cursor: pointer;
        }
      }
    }
    .bot{
      height: calc(100vh - 40px);
      display: flex;
      flex-direction: row;
    }
  }
  .menuleft{
    width:50px;
    background: #fff;
    .components{
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .oneComponent{
        padding: 5px;
        background: #eee;
        margin:10px auto 0;
        font-size: 20px;
        line-height: 20px;
        cursor: grab;

        &:hover{
          background:#0086b3;
          color:#fff;
        }
      }
    }
  }

  .rightbox{
    width: 200px;
    background: #fff;
    .tuceng{
      border-bottom: 1px solid #ddd;
      height: 500px;
    }
    .zujian{

    }
  }
</style>
