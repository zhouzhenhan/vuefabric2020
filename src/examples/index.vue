<template>
    <div class="">
        <!--<div style=" background: red; height: 500px;">{{123}}</div>-->

        <Fabric-Canvas ref="canvas" :width="width" :height="height" :boxWidth="boxWidth" :boxHeight="boxHeight"
                       :showRuler="showRuler" :stepLengthp="stepLength"
                       id="can"></Fabric-Canvas>
    </div>
</template>

<script>

    export default {
        name: "index",
        data(){
            return{
                data: '123',
                width:1500,      //标尺、画布的宽
                height:1000,     //标尺、画布的高
                boxWidth: 1200,  //外框宽
                boxHeight:500,   //外框高
                stepLength:50,  //标尺单位 每格
                showRuler:[true,true] //横纵标尺是否显示
            }
        },
        mounted () {
            /*this.boxHeight = document.documentElement.clientHeight-document.getElementById('demohead').offsetHeight-10;
            window.onresize = ()=>{
                return (()=>{
                    this.boxHeight = document.documentElement.clientHeight-document.getElementById('demohead').offsetHeight-10;
                })();
            };*/

            var canvas =  this.$refs.canvas.canvas;
            fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

            //圆角矩形
            let rectdata = this.$refs.canvas.createRect({
                id: 1,
                width: 100,
                height: 200,
                left: 0,
                top: 0,
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

            this.$refs.canvas.createRect({
                id: 2,
                width: 500,
                height: 100,
                left: 200,
                top: 200,
                fillColor:'#eee',
                bordersColor: '#f00',
                bordersWidth:3 ,
                bordersStyle:[10,4,3,4]
            });

         //   this.$refs.canvas.setNomove();

            this.$refs.canvas.rename(1,'我是边框矩形');

            this.$refs.canvas.createRect({
                id: 3,
                width: 100,
                height: 30,
                left: 200,
                top: 100,
            });

        },
        methods: {

        },
    }
</script>

<style scoped>
.demobox{
    display: flex;
    flex-direction: column;
}
</style>
