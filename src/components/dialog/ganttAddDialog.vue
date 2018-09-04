<template>
    <div class="gantt-add-dialog" @click="showDialog = false" v-if="showDialog">
        <div class="add-center" @click.stop :class="{'height300':ruleForm.judgeAdd =='xiugai'}">
            <div class="dialog-header">
                <h2 class="fl" v-if="ruleForm.judgeAdd != 'xiugai'">新增任务</h2>
                <h2 class="fl" v-else>修改任务</h2>
                <img src="./addblack.svg" alt="" class="fr" @click="showDialog = false">
            </div>
            <div class="dialog-center">
                <el-row>
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="30px" class="demo-ruleForm">
                        <el-form-item label=" " prop="name">
                            <el-input v-model="ruleForm.name" placeholder="请输入进度名称" ></el-input>
                        </el-form-item>
                        <el-form-item label=" " prop="floor"    v-if="ruleForm.judgeAdd !='xiugai'">
                            <el-select v-model="ruleForm.floor" placeholder="请选择楼层" @change="selectChange">
                                <el-option
                                v-for="item in floorSelect"
                                :key="item.id"
                                :label="item.id"
                                :value="item.type">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" " prop="floor" v-if="ruleForm.judgeAdd !='xiugai'">
                           <el-select v-model="ruleForm.type" placeholder="请选择工序">
                                <el-option
                                v-for="item in floorProcedure"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" " prop="actualdate">
                            <el-date-picker v-model="ruleForm.actualdate" type="daterange" align="left" size='small' unlink-panels range-separator="-" start-placeholder="实际开始日期" end-placeholder="实际结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-date-picker v-model="ruleForm.plandate" type="daterange" align="left" size='small' unlink-panels range-separator="-" start-placeholder="计划开始日期" end-placeholder="计划结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label=" ">
                            <el-input v-model="ruleForm.additionaltext" placeholder="请填写附加字段"></el-input>
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div class="dialog-footer" v-if="!ruleForm.judgeAdd">
                <div @click="showDialog = false">取消</div>
                <div @click="submitForm()">确定</div>
            </div>
            <div class="dialog-footer" v-if="ruleForm.judgeAdd">
                <div @click="delTask">删除</div>
                <div @click="reviseForm()">确定</div>
            </div>
        </div>
    </div>
</template>
<style>

.el-select{
    height: 30px;
    line-height: 30px;
}
.el-form-item__content{
    line-height: 30px;
}
.el-select .el-input .el-select__caret{
    line-height: 30px;
}
    .gantt-add-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5)
    }
    .add-center {
        width: 400px;
        height: 360px;
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        box-shadow: 0px 18px 49px -30px rgba(87, 89, 89, 0.5);
    }
    .gantt-add-dialog .el-form-item__content {
        line-height: 30px;
    }
    .gantt-add-dialog .el-form-item__label .el-form-item__content {
        line-height: 30px;
    }
    .gantt-add-dialog .el-form-item,
    .gantt-add-dialog .el-input,
    .gantt-add-dialog .el-form-item__content,
    .gantt-add-dialog .el-range-editor--small.el-input__inner {
        height: 30px;
        line-height: 30px;
    }
    .gantt-add-dialog .el-form-item {
        margin-bottom: 10px;
    }
    .gantt-del {
        float: left;
    }
    .height300{
    height: 300px;
}
</style>
<script>
    export default {
        props: {
            ruleForm: {
                type: Object,
                default () {
                    return {
                        name: "",
                        plandate: "",
                        actualdate: '',
                        additionaltext: "",
                        type:"",
                        floor:"",
                        judgeAdd: null
                    };
                }
            },
            selectSchedule: {
                type:Object,
                default(){
                    return {}
                }
            },
            taskDefault: {
                type: Object,
                default () {
                    return {
                        queueGanttTask: null, //待处理队列task
                        taskParentId: ''
                    }
                }
            }
        },
        data() {
            return {
                showDialog: false,
                rules: {
                    name: [{
                            required: true,
                            message: " ",
                            trigger: "blur"
                        }
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    floor:[{
                        required:true,
                        message:" ",
                         trigger: "blur"
                    }],
                    actualdate: [{
                        required: true,
                        message: " ",
                        trigger: "change"
                    }],
                    region: [{
                        required: true,
                        message: " ",
                        trigger: "blur"
                    }]
                },
                floorConfig:'',
                floorSelect:[],
                floorProcedure:[]
            }
        },
        methods: {
            selectChange(){
                this.floorProcedure.length = 0
                this.floorConfig.ProcessNode.forEach(process=>{
                    this.floorConfig.Process.forEach(processConfig=>{
                        if(process.ProcessId == processConfig.ProcessId){
                            console.log( this.$props.ruleForm.floor)
                            processConfig.LevelCategory2Cycle.forEach(LevelCategory=>{
                                if(LevelCategory.LevelCategory == this.$props.ruleForm.floor.split('_')[0] && LevelCategory.LevelCycle*1 == 0){
                                    this.floorProcedure.push({
                                        name:process.ProcessNodeName,
                                        id:process.guid
                                    })
                                }
                            })
                        }
                    })
                })
                console.log(this.$props.ruleForm.type)
                // this.$props.ruleForm.floor
            },
            delTask() {
                this.$emit('delGanttTask', this.$props.ruleForm)
            },
            reviseForm() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.$emit('reviseTaskGantt', this.$props.ruleForm)
                    }
                })
            },
            submitForm() {
                var _this = this
                let color = ''
                let type = ''
                _this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.floorConfig.ProcessNode.forEach(processConfig=>{
                            if(processConfig.guid == this.$props.ruleForm.type){
                                this.floorConfig.Process.forEach(process=>{
                                    if(process.ProcessId == processConfig.ProcessId){
                                        color = process.ProcessColor 
                                        type = processConfig.relationName
                                    }
                                })
                            }
                        })
                        let floornumber = ''
                        this.floorSelect.forEach(floor=>{
                            if(this.$props.ruleForm.floor.split('_')[0] ==  floor.type){
                                floornumber = floor.id
                            }
                        })
                        if (this.$props.taskDefault.queueGanttTask) {
                            var task = {
                                id: this.$props.queueGanttTask,
                                text: this.$props.ruleForm.name + '_' + floornumber + 'F',
                                start_date: this.$props.ruleForm.actualdate[0],
                                end_date: this.$props.ruleForm.actualdate[1],
                                parent: this.$props.taskDefault.taskParentId,
                                plan_start_date: this.$props.ruleForm.plandate[0],
                                plan_end_date: this.$props.ruleForm.plandate[1],
                                color:color,
                                type:type,
                                floorNumber:floornumber,
                                allFloorNumber:this.floorSelect.length*1 + 1
                            }
                        } else {
                            var task = {
                                text: this.$props.ruleForm.name + '_' + floornumber + 'F',
                                start_date: this.$props.ruleForm.actualdate[0],
                                end_date: this.$props.ruleForm.actualdate[1],
                                parent: this.$props.taskDefault.taskParentId,
                                plan_start_date: this.$props.ruleForm.plandate[0],
                                plan_end_date: this.$props.ruleForm.plandate[1],
                                color:color,
                                type:type,
                                floorNumber:floornumber,
                                allFloorNumber:this.floorSelect.length*1 + 1
                            }
                        }
                        this.$emit('addTaskDialog', task)
                        this.showDialog = false
                        this.$props.ruleForm.judgeAdd = '新增'
                    }
                })
            }
        },
        mounted() {
            var _this = this
            let ComPanyId;
            if(top.ComPanyId){
                ComPanyId = top.ComPanyId
            }else{
                ComPanyId =  '997223d1-fe87-48df-9eea-cf01c8a57dbf'
            }
            this.$axios.get(`https://api.probim.cn/CompanyData/GetCompanyData?CompanyId=${ComPanyId}`).then(res => {
                if(!res.data.Message){
                    return false
                }
                res.data = JSON.parse(res.data.Message) 
                
                res.data = JSON.parse(res.data.JsonData)
               this.floorConfig = res.data
            })
        },
        watch: {
            /*
            ruleForm: {
                type: Object,
                default () {
                    return {
                        name: "",
                        plandate: "",
                        actualdate: '',
                        additionaltext: "",
                        judgeAdd:null
                    };
                }
            },
            */
           ruleForm:function(val,oldval){
               console.log(val.floor,oldval)
           },
            showDialog: function(val, oldval) {
                if (val == false) {
                    this.$props.ruleForm.judgeAdd = null
                    this.$props.ruleForm.name = ''
                    this.$props.ruleForm.plandate = []
                    this.$props.ruleForm.actualdate = []
                    this.$props.ruleForm.additionaltext = ''
                    this.$props.ruleForm.type = ''
                    this.$props.ruleForm.floor = ''
                    //data数据初始化
                    this.floorSelect = []
                    this.floorProcedure = []

                }else{
                    let w = JSON.parse(this.$props.selectSchedule.ExternalField)
                    console.log(w)
                    w.forEach((element,index) => {
                        this.floorSelect.push({
                            id:element.floorID,
                            type:element.floorType + '_' + index   
                        })
                    });
                    console.log(this.floorSelect)
                }
            }
        }
    }
</script>
