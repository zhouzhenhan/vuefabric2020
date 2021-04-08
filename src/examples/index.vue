<template>
  <div class="demobox">
    <div class="top">
      <b>保存</b>

      <b>预览</b>

      <b>缩放</b>
    </div>

    <div class="bot">
      <div class="menuleft">
          <div class="components">

            <!--文本-->
            <div class="oneComponent" @click="addCom('test',{width:150,height:300,textback:'#ff0',textcolor:'#f00',textdemo:'Text',originXY:['right','bottom']})">
              <div class="iconfont icon-wenben"></div>
            </div>

            <!--线条-->
            <div class="oneComponent" @click="addCom('Dottedline',{ strokeWidth:2,DottedlineType:2,})">
              <div class="iconfont icon-zhixian"></div>
            </div>

            <!--矩形-->
            <div class="oneComponent" @click="addCom('Rect')">
              <div class="iconfont icon-juxing1"></div>
            </div>

            <!--圆角矩形-->
            <div class="oneComponent" @click="addCom('Rectangle')">
              <div class="iconfont icon-yuanjiaojuxing"></div>
            </div>

            <!--椭圆形-->
            <div class="oneComponent" @click="addCom('Circle')">
              <div class="iconfont icon-tuoyuanxing"></div>
            </div>

            <!--图片-->
            <div class="oneComponent" @click="addCom('Image',{width:80,height:80,})">
              <div class="iconfont icon-tupian3"></div>
            </div>

            <!--条形码-->
            <div class="oneComponent" @click="addCom('Barcode',{originXY:['center','top'] })">
              <div class="iconfont icon-tiaoma"></div>
            </div>

            <!--二维码-->
            <div class="oneComponent" @click="addCom('Qrcode',{width:80,height:80,})">
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
                       id="can"></Fabric-Canvas>
      </div>

      <div class="rightbox">
          <div class="tuceng">
            <GeminiScrollbar>

            </GeminiScrollbar>
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
        id: 1,
        width: 800,      //标尺、画布的宽
        height: 500,     //标尺、画布的高
        boxWidth: document.documentElement.clientWidth-250,  //外框宽
        boxHeight: document.documentElement.clientHeight-60,   //外框高
        stepLength: 50,  //标尺单位 每格
        showRuler: [true, true],  //横纵标尺是否显示

        img:'',   //预览图片的
        showimg:false, //显示预览

        currentObj:{},
        origin:[0,0], //新组件位置
        originx:0,
        originy:0,
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
      //预览
      preview(data){
          this.img = data;
      },
      //获取左上距原点距离
      setlefttop(x,y){
        this.originx = x;
        this.originy = y;
      },


      //预览框开关
      toshow(){
        this.$refs.canvas.todata();
        this.showimg = !this.showimg;
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
          this.changeInputObj();
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
      },
      //创建组件
      addCom(name,options){
        if(!options){
          options = {};
        }
        this.idAdd();
        options.id = this.id;
        this.origin[0] =  this.origin[0] + 10;
        this.origin[1] = this.origin[1] + 10;
        options['left'] = this.origin[0];
        options['top'] = this.origin[1];
        this.$refs.canvas.createElement(name,{...options});
      },
      //画布变化触发数据变动
      changeTargetObj(data){
        console.log(data);

      },
      //右边数据触发画布变化
      changeDataToCanvas(){

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
