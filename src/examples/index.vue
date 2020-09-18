<template>
    <div>
        <vue-fabric ref="canvas" :width="width" :height="height" :boxWidth="boxWidth" :boxHeight="boxHeight" :stepLength="stepLength" id="can"></vue-fabric>
    </div>
</template>

<script>

    export default {
        name: "index",
        data(){
            return{
                data: '123',
                width:5000,      //标尺、画布的宽
                height:1000,     //标尺、画布的高
                boxWidth: 1000,  //外框宽
                boxHeight:600,   //外框高
                stepLength:100,  //标尺单位 每格

            }
        },
        mounted () {
            var canvas =  this.$refs.canvas.canvas;

            fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';


            //圆角矩形
            let rectdata = this.$refs.canvas.createRect({
                id: 1,
                width: 100,
                height: 200,
                left: 100,
                top: 100,
                padding: 0,
                angle: 0,
                fillColor:'#eee',
                bordersColor: '#f00',
                bordersWidth: 1,
                bordersStyle: [0,0],
                scaleX:1,
                scaleY:1,
                rx: 5,
                ry: 5,
                skewX: 0,
                skewY: 0,
            });

            let rectdata2 = this.$refs.canvas.createRect({
                id: 1,
                width: 20,
                height: 30,
                left: 500,
                top: 200,
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

            let rectdata3 = this.$refs.canvas.createRect({
                id: 1,
                width: 60,
                height: 80,
                left: 300,
                top: 300,
            });
            this.$refs.canvas.createRect({
                id: 1,
                width: 60,
                height: 80,
                left: 400,
                top: 300,
            });
            this.$refs.canvas.createRect({
                id: 1,
                width: 60,
                height: 80,
                left: 500,
                top: 400,
            });
            this.$refs.canvas.createRect({
                id: 1,
                width: 60,
                height: 80,
                left: 600,
                top: 220,
            });
            this.$refs.canvas.createRect({
                id: 1,
                width: 60,
                height: 80,
                left: 700,
                top: 100,
            });

        },
        methods: {

        },
    }
</script>

<style scoped>

</style>
