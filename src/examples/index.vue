<template>
  <div class="demobox">
    <!--<div style=" background: red; height: 500px;">{{123}}</div>-->
  <div style="display: flex; flex-direction: row;">
    <div style="width: 100px; height: calc(100vh - 100px);">
      <GeminiScrollbar>
        <div style="width: 200px; height: 1000px; background: red;">123</div>
      </GeminiScrollbar>

    </div>


    <div  style="width: 100px;height: 500px; position: fixed ; top:100px; right:0; z-index: 100; overflow:hidden;">
      <GeminiScrollbar>
        <div style="width: 200px; height: 600px; background: green; overflow:hidden;">56789</div>

      </GeminiScrollbar>
    </div>

    <div :style="'min-width: calc(100vw - 200px);height: calc(100vh - 100px);width:'+boxWidth+'px;'">
      <Fabric-Canvas ref="canvas" :idno="id" :width="width" :height="height" :boxWidth="boxWidth" :boxHeight="boxHeight"
                     :showRuler="showRuler" :stepLengthp="stepLength" @idAdd="idAdd"
                     id="can"></Fabric-Canvas>
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
        boxHeight: 800,   //外框高
        stepLength: 50,  //标尺单位 每格
        showRuler: [true, true] //横纵标尺是否显示
      }
    },
    mounted() {
      this.boxWidth = document.documentElement.clientWidth-250;
      let _this = this;
      window.onresize = ()=>{
          return (()=>{
            _this.boxWidth = document.documentElement.clientWidth-250;
            this.$refs.canvas.setZoom(1);
            this.$refs.canvas.initBgRect();
          })();
      };
      this.$refs.canvas.setZoom(1);
      this.$refs.canvas.initBgRect();
      this.init();

      /*setTimeout(() => {
        this.$refs.canvas.setZoom(1.5);
      }, 2000);*/
    },
    methods: {
      //模板使用调用方法
      idAdd() {
        this.id = this.id + 1;
       // console.warn(this.id);
      },


      init() {
        var canvas = this.$refs.canvas;
        // fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

        //圆角矩形
        /*let rectdata = canvas.createRect({
          id: this.id,
          width: 100,
          height: 200,
          left: 100,
          top: 400,
          padding: 0,
          angle: 0,
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 1,
          strokeDashArray: [0, 0],
          scaleX: 1,
          scaleY: 1,
          rx: 20,
          ry: 20,
          skewX: 10,
          skewY: 0,
        });*/
        /*this.idAdd();
        canvas.createRect({
          id: this.id,
          width: 400,
          height: 100,
          left: 0,
          top: 100,
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 1,
          strokeDashArray: [10, 4, 3, 4],
          skewX: 0,
          skewY: 0,
        });*/


        /*this.idAdd();
        this.$refs.canvas.createRect({
          id: this.id,
          width: 30,
          height: 80,
          left: 0,
          top: 200,
          fill:'#ff0000',
        });

        this.idAdd();
        this.$refs.canvas.createRect({
          id: this.id,
          width: 100,
          height: 10,
          left: 200,
          top: 313,
          fill:'#ff0000',
          skewX:-40,
        });

        this.idAdd();
        this.$refs.canvas.createRect({
          id: this.id,
          width: 300,
          height:20,
          left: 310,
          top: 300,
          fill:'#000000',
          skewX:-40,
        });




        this.idAdd();
        canvas.createRect({
          id: this.id,
          width: 540,
          height: 300,
          left: 10,
          top: 10,
          fill: 'rgba(0,0,0,0)',
          stroke: '#000000',
          strokeWidth: 1,
          strokeDashArray: [5,3],
          skewX: 0,
          skewY: 0,
        });

        this.idAdd();
        this.$refs.canvas.createRect({
          id: this.id,
          width: 560,
          height: 3,
          left: 0,
          top: 130,
          fill: '#ff0000',
        });

        this.idAdd();
        canvas.createText('ZKONG',{
          fontSize: 26,
          left:200,
          fill:'#ff0000',
          top:40,
        })

        this.idAdd();
        canvas.createText('PRICETAG MADE IN',{
          fontSize: 12,
          left:90,
          width:150,
          top:80,
        })

        this.idAdd();
        canvas.createText('ZHANG SAN',{
          fontSize: 30,
          left:80,
          top:198,
          width:200,
        })

        this.idAdd();
        canvas.createText('DEVELOPMENT ENGINEER',{
          fontSize: 14,
          left:80,
          top:230,
          width:200,
        })

        this.idAdd();
        canvas.createText('TEL:13801234567',{
          fontSize: 14,
          left:80,
          top:260,
          width:200,
        })

        this.idAdd();
        canvas.createText('Address:',{
          fontSize: 16,
          left:300,
          top:200,
          width:60,
        })
        this.idAdd();
        canvas.createText(' Building No. 17, Singapore Tech Park, Hangzhou',{
          fontSize: 16,
          left:360,
          top:200,
          width:200,
        })

        this.idAdd();
        canvas.createText('Phone:',{
          fontSize: 16,
          left:300,
          top:240,
          width:60,
        })
        this.idAdd();
        canvas.createText('400-856-9811',{
          fontSize: 16,
          left:360,
          top:240,
          width:200,
        })

        this.idAdd();
        canvas.createText('Email:',{
          fontSize: 16,
          left:300,
          top:260,
          width:60,
        })
        this.idAdd();
        canvas.createText('info@zkong.com',{
          fontSize: 16,
          left:360,
          top:260,
          width:200,
        })

        this.idAdd();
        canvas.createCircle({
          width:100,
          height:100,
          fill:'#ffffff',
          stroke: '#ff0000',
          strokeWidth: 3,
          strokeDashArray: [5,3],
        });

        this.idAdd();
        canvas.createCircle2({
          left:100,
          radius:50,
          fill:'#ffffff',
          stroke: '#ff0000',
          strokeWidth: 3,
          strokeDashArray: [5,3],
        });



        this.idAdd();
        this.$refs.canvas.createParallelogram({
          id: this.id,
          width:50,
          left: 0,
          top: 130,
          fill: '#ff0000',
        });

        this.idAdd();
        this.$refs.canvas.createRectangle({
          id: this.id,
          width:50,
          left: 0,
          top: 300,
          fill: '#ff0000',
        });

        this.idAdd();
        this.$refs.canvas.createImage('./static/images/img.svg', {
          id: this.id,
          left:400,
          top:200,
          width:100,
          height:100,
        });


        this.idAdd();
        this.$refs.canvas.drawDottedline({
          id: this.id,
          left:360,
          top:80,
          width:100,
          drawWidth:2,
        });


        this.idAdd();
        this.$refs.canvas.createEllipse({
          id: this.id,
          left:360,
          top:80,
          width:100,
          drawWidth:2,
        });

        this.idAdd();
        this.$refs.canvas.createEqualTriangle({
          id: this.id,
          left:360,
          top:80,
          width:100,
          drawWidth:2,
        });


        this.idAdd();

        this.$refs.canvas.createQrcode('http://www.zkong.com', {
          id: this.id,
          left:700,
          top:0,
          width:100,
          height:100,
        });


        this.idAdd();

        this.$refs.canvas.createBarcode('690000001', {
          id: this.id,
          left:500,
          top:400,
          width:100,
          height:100,
        });*/

        this.idAdd();
        this.$refs.canvas.createElement('Rect',{
          id: this.id,
        })

        this.idAdd();
        this.$refs.canvas.createElement('Image',{
          id: this.id,
          url:'./static/images/img.svg',
          width:50,
          height:50,
          top:100,
          left:20,
        })

        this.idAdd();
        this.$refs.canvas.createImage('./static/images/img.svg',{
          id: this.id,
          width:50,
          height:50,
          top:200,
          left:500,
        })




        // this.$refs.canvas.setNomove();

        // canvas.rename(1, '我是边框矩形');
        // this.$refs.canvas.setTop();
      },
    },
  }
</script>

<style scoped>
  .demobox {
    width: 100vw;
    height:100vh;
    padding-top: 50px;
    box-sizing: border-box;
    margin:0 auto;
    background: #f5f5f5;
    display: flex;
    flex-direction: row;
    /*justify-content: center;*/
    justify-content: space-between;

  }
</style>
