<template>
  <div class="dialog-wp" v-if="showDialog" @click="showDialog=false">
    <div class="makser" @click.stop>
      <div class="dialog-header">
        <h2 class="fl">新增匹配规则</h2>
        <img src="./addblack.svg" alt="" class="fr" @click="showDialog = false">
      </div>
      <div class="dialog-center wzw" style="margin-top:20px;">
        <el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="匹配字段" name="first">
                    <el-radio-group v-model="ruleForm.selectn1">
                        <el-radio label="构件名称、类别及族名称" class="mt20"></el-radio>
                        <el-radio label="构件属性" class="mt20"></el-radio>
                         
                    </el-radio-group>
                    <input type="text" placeholder="请输入属性值" class="zdy"  v-model="ruleForm.inputVal" :disabled="inputDisabled" :class="{'none-cursor':inputDisabled}">
                </el-tab-pane>
                <el-tab-pane label="目标字段" name="second">
                    <el-radio-group v-model="ruleForm.selectn2">
                        <el-radio label="任务名称" class="mt20"></el-radio>
                        <el-radio label="任务附加字段" class="mt20"></el-radio>
                         
                    </el-radio-group>
                </el-tab-pane>
            </el-tabs>

        </el-row>
      </div>
      <div class="dialog-footer">
        <div @click="showDialog = false">取消</div>
        <div @click="submitForm" :class="{'submitOk':submitBtnJudge()}">确定</div>
      </div>
    </div>
  </div>
</template>
<style>
.none-cursor{
    cursor: no-drop;
}
input::-webkit-input-placeholder{
            color:#606266;
        }
input:focus{
    outline: none
}
  .submitOk {
    color: #417fcd !important;
  }
  .dialog-wp {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 99;
  }
  input.zdy {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 220px;
    background: #f5f9fc;
    border: none;
    padding-right: 30px;
    height: 24px;
    line-height: 24px;
    margin-left: 30px;
    padding-left: 15px;
    color: #606266;
  }
  form input.zdy::-webkit-input-placeholder {
    color: #ccc;
  }
  form input:focus {
    outline: none;
  }
  .dialog-wp .makser {
    width: 400px;
    height: 250px;
    background-color: #ffffff;
    box-shadow: 0px 18px 49px -30px rgba(87, 89, 89, 0.5);
    border-radius: 2px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  .el-input--suffix .el-input__inner {
    background-color: #f5f9fc;
  }
  .el-form-item__label {
    color: red !important;
  }
  .wzw .el-form-item {
    background: #fff;
  }
  .wzw .el-radio-group {
    display: flex;
    flex-direction: column;
  }
  .el-radio {
    text-align: left;
    margin-top: 15px;
  }
  .wzw .el-radio+.el-radio {
    margin-left: 0;
  }
  .el-radio:first-child {
    margin-top: 0;
  }
  .wzw .el-radio__input.is-checked+.el-radio__label {
    color: #757d8a;
  }
</style>
<script>
  export default {
    props: {
      scheduleId: String,
      ruleForm: {
        type: Object,
        default () {
          return {
            selectn2: "",
            selectn1: "",
            inputVal: "",
            judge: null
          };
        }
      }
    },
    data() {
      return {
        showDialog: false,
        activeName:'first',
        inputDisabled:true
      };
    },
    methods: {
        submitBtnJudge(){
            if(this.$props.ruleForm.selectn1 == '构件属性'){
                if(this.$props.ruleForm.inputVal != '' && this.$props.ruleForm.selectn2 != ''){
                    return true
                }else{
                    return false
                }
            }else{
                if(this.$props.ruleForm.selectn2 != '' && this.$props.ruleForm.selectn1 != ''){
                    return true
                }else{
                    return false
                }
            }
        },
        handleClick(){
            console.log(this.$props)
        },
      initForm() {
        this.ruleForm.selectn1 = "";
        this.ruleForm.inputVal = "";
      },
      submitForm() {
        if (
          (this.ruleForm.selectn2 == "" && this.ruleForm.selectn1 == "") ||
          (this.ruleForm.selectn1 == "" && this.ruleForm.inputVal == "")
        ) {
          return;
        }
        var formData = new FormData();
        formData.append("ProjectID", window.ProjectID);
        formData.append("ScheduleID", this.$props.scheduleId);
        if(this.$props.ruleForm.selectn2 == '任务名称'){//第二页
            formData.append('MatchType',0)
        }else if(this.$props.ruleForm.selectn2 == '任务附加字段'){
            formData.append('MatchType',1)
        }

        if(this.$props.ruleForm.selectn1 == ' 构件名称、类别及族名称'){
            formData.append('MatchValueField',0)
        }else if(this.$props.ruleForm.selectn1 == '构件属性'){
            formData.append('MatchValueField',this.$props.ruleForm.inputVal)
        }
        formData.append('MatchExpression',1)
        this.$axios.post(`${window.urlConfig}/api/Prj/UpdateMatchingRules`,formData).then(res=>{
            console.log(res)
            this.showDialog = false 
            this.$emit('requestItems')
        }).catch(res=>{
            console.log('新增修改匹配规则失败 原因：' + res)
        })
      }
      
    },
    watch: {
      "ruleForm.selectn1": {
        handler: function(val, oldVal) {
          if(val == '构件属性'){
              this.inputDisabled = false
          }else{
              this.inputDisabled = true
          }
        },
        immediate: true
      }
    }
  }
</script>
