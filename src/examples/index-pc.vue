<template>
  <div class="container">

    <vue-fabric ref="canvas" :width="width" :height="height" id="can"></vue-fabric>


  </div>
</template>

<script>

export default {
  components: { },
  data () {
    return {
      data: '123',
      width: 2000,
      height:1000,
    };
  },
  created () {
    this.width = document.body.offsetWidth;
    if (window.innerHeight)
      this.height = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
      this.height = document.body.clientHeight;


  },
  mounted () {
    var canvas =  this.$refs.canvas.canvas;

    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';


    //平行四边形
    let rectdata2 = this.$refs.canvas.createRect({id:2,padding:10,});
    let rectdata3 = this.$refs.canvas.createRect({id:3,left:60,fillColor:'blue', visible:true,selectable:false});
    let rectdata4 = this.$refs.canvas.createRect({id:4,top:60,fillColor:'red',});

    //圆角矩形
    let rectdata = this.$refs.canvas.createRect({
      id: 1,
      width: 500,
      height: 200,
      left: 70,
      top: 70,
      padding: 0,
      angle: 0,
      fillColor:'#eee',
      bordersColor: '#f00',
      bordersWidth: 1,
      bordersStyle: [0,0],
      scaleX:1,
      scaleY:1,
      rx: 0,
      ry: 0,
      skewX: 0,
      skewY: 0,
    });

  },
  methods: {

  }
};
</script>

<style lang='scss' scoped>

</style>
