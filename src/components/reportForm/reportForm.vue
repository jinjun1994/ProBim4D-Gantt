<template>
    <div class="reportFormTable" id="reportFormTable">
        <h1>{{reportFormData.title}} <span>{{common.dateInit(reportFormData.selectTime[0])}} - {{common.dateInit(reportFormData.selectTime[1])}}</span></h1>
        <el-table :data="reportFormData.tableBodyData" height="250" border style="width: 100%">
            <el-table-column :prop="t.prop" :label="t.label" v-for="t in reportFormData.tableHeaderData" :key="t.id">
            </el-table-column>
        </el-table>
    </div>
</template>
<style>
    .reportFormTable{
        padding: 20px;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .reportFormTable h1{
        font-size: 16px;
        line-height: 30px;
    }
    .reportFormTable .el-table--border{
        border-bottom: 1px solid #ebeef5;
    }
    .reportFormTable h1 span{
        font-size: 14px;
        margin-left: 10px;
        color: #666;
    }
</style>

<script>
    export default{
        name:'reportForm',
        props:{
            reportFormData: {
                type: Object,
                default () {
                    return {
                        title: '',
                        tableHeaderData: [],
                        tableBodyData: [],
                        showOrHide:false,
                        selectTime:[]
                    };
                }
            },
        },
        data(){
            return{
                tableHight:0,
                
            }
        },
        // watch:{
        //     'reportFormData.showOrHide':function(val,oldval){
        //         if(val){
        //             console.log(document.getElementById('reportFormTable').height)
        //         }
        //     }
        // }
        
    }
</script>