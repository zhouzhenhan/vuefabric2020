<template>
    <div class="grey" style="position:relative; width: 600px; height: 600px; margin:100px auto;  overflow: scroll;"  id ="content" >
        <div class="green" id="xZhou" style="position: fixed; margin-left:18px; z-index: 2; width: 572px; overflow-x: scroll; height: 18px;">
            <div class="x-line" style="width: 1000px; ">
                <span v-for="(item,index) in xScale" :key="index" :style="{left:index * 50 + 2 + 'px'}" class="number">{{ item.id }}</span>
            </div>
        </div>
        <div class="green" id="yZhou" style="position: fixed; margin-top:18px; z-index: 2; width: 18px; overflow-y: scroll; height: 572px;">
            <div class="y-line" style="height: 1000px; ">

            </div>
        </div>

        <div  class="black"style="position: absolute; top:18px; left: 18px;">
            <div  class="yellow" style="width: 1000px;height: 1000px; ">abcdefgh</div>
        </div>
    </div>
</template>

<script>
    import { on, off } from './event'
    export default {
        name: "test",
        data(){
            return{
                xScale:[
                    {id:50,},
                    {id:100,},
                ]
            }
        },
        mounted() {

            on(document.getElementById('content'), 'mousewheel', this.show);
            on(document.getElementById('content'), 'scroll', this.show);

            on(document.getElementById('yZhou'), 'mousewheel', this.yshow);
            on(document.getElementById('yZhou'), 'scroll', this.yshow);
            on(document.getElementById('xZhou'), 'mousewheel', this.yshow);
            on(document.getElementById('xZhou'), 'scroll', this.yshow);

        },
        methods:{
            //监听内容区，修改标尺滚动条
            show(e){
                document.getElementById('yZhou').scrollTop = document.getElementById('content').scrollTop;
                document.getElementById('xZhou').scrollLeft = document.getElementById('content').scrollLeft;
            },
            //监听标尺滚动，修改内容区
            yshow(e){
                document.getElementById('content').scrollTop = document.getElementById('yZhou').scrollTop;
                document.getElementById('content').scrollLeft = document.getElementById('xZhou').scrollLeft;
            }
        }
    }
</script>

<style scoped lang="scss">
.grey{
    background: #eee;
    div{
        height: 20px;
    }
}
    .x-line{
        width: 100%;
        height: 18px;
        left: 18px;
        opacity: 0.6;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAMAAAAuTX21AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACNJREFUeNpiYCAdMDKRCka1jGoBA2JZZGshiaCXFpIBQIABAAplBkCmQpujAAAAAElFTkSuQmCC);
    }
    .y-line{
        width: 18px;
        height: 100%;
        top: 18px;
        opacity: 0.6;
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAMAAABmvHtTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRFMzMzAAAA////BqjYlAAAACBJREFUeNpiYGBEBwwMTGiAakI0NX7U9aOuHyGuBwgwAH6bBkAR6jkzAAAAAElFTkSuQmCC);
    }
    .number{
        position: absolute;
        font: 10px/1 Arial, sans-serif;
        color: #333;
        cursor: default;
    }
    .x-line .number{
        top: 1px;
    }
    .y-line .number{
        width: 8px;
        left: 3px;
        word-wrap: break-word;
    }


    .green{
        /*background: green;*/
    }
    .green::-webkit-scrollbar {
        display:none;

    }
    .blue{
        background: blue;
    }
.yellow{
    background: yellow;
}
    .orange{
        background: orange;
    }
    .black{
        background: black;
    }


.contacts {
    width: 300px;
    height:200px;
    margin:50px auto;
    border: 1px solid #ddd;

}
.tree{
    width: 300px;
    height:200px;
    overflow-y: scroll;
}
.tree::-webkit-scrollbar {
    display:none

}
</style>
