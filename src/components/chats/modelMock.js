let rootData = null
let judgeShow3d = false
let common = null
function colorRbg(a){
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = a.toLowerCase();
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));	
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));	
        }
        return "RGB(" + sColorChange.join(",") + ")";
    }else{
        return sColor;	
    }
}
export default{
    initCommon(c){
        common = c
    },
    upDataShow3d(b){
        judgeShow3d = b
    },
    resetModelColor(b){
        if(judgeShow3d){
            window.parent.BIMe.control.BIMeUtility.resetElementColor(b)
            window.parent.BIMe.control.BIMeHide.removeHideElementByElementId(b);
        }
        
            
    },
    initRootData(a){
        rootData = a
    },
    formatTableData(date){
        return new Promise(function(resolve,reject){
            let newDate = new Date()
            let tableDataObj={
                tableTitleDate: common.dateInit(newDate),
                tableData:''
            }
            if(date){
                newDate = date
                tableDataObj.tableTitleDate = common.dateInit(date)
            }
            let lists = []
            tableDataObj.tableData = []
            rootData.forEach(d=>{
                if(common.isDateBetween(newDate,d.TaskStartTime,d.TaskEndTime) || common.isDateBetween(newDate,d.TaskPlanStartTime,d.TaskPlanEndTime)){
                    lists.push(d)
                }
            })
            if(window.parent.BIMe && judgeShow3d){
                
                    let elementID = window.parent.BIMe.modelData.BIMeElementData.getAllElementIds()
                    window.parent.BIMe.control.BIMeUtility.resetElementColor(elementID)
            }
            lists.forEach(list=>{
                let store = null
                if(list.Percentage){//已完成
                    store = common.DateDiff(list.TaskEndTime,list.TaskPlanEndTime)
                }else{
                    store = common.DateDiff(new Date(),list.TaskPlanEndTime)
                }
                if(store > 0){
                    store = `延误${store}天`
                }else{
                    store = '正常'
                }
                tableDataObj.tableData.push({
                    procedure:list.Category,
                    plan1:`第${list.TaskOrder}层`,
                    Actual1:`第${list.TaskOrder}层`,
                    plan2:`${(common.NumberOfDays(list.TaskPlanEndTime,newDate)/common.DateDiff(list.TaskPlanEndTime,list.TaskPlanStartTime)).toFixed(2)}%`,
                    Actual2:`${(common.NumberOfDays(list.TaskEndTime,newDate)/common.DateDiff(list.TaskEndTime,list.TaskStartTime)).toFixed(2)}%`,
                    state:store
                })
                if(window.parent.BIMe && judgeShow3d){

                    let a = list.ElementIDS.split(',')
                    let b = []
                    a.forEach(element => {
                        b.push(
                            window.ModelID + '^' + element
                        )
                        
                    });
                    let color = colorRbg(list.Color)
                    color = color.split('RGB')[1].split('(')[1].split(')')[0].split(',')
                    window.parent.BIMe.control.BIMeUtility.setElementColor(b,color[0],color[1],color[2],1)
                }
            })
            resolve(tableDataObj)
        })
    }
}
