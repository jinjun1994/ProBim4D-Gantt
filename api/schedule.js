var schedule = {
        //level 楼层类型
        LevelCategory:[
                {LevelCategory: '首层', LevelDescription: ''},
                {LevelCategory: '二层', LevelDescription: ''},
                {LevelCategory: '三层', LevelDescription: ''},
                {LevelCategory: '标准层', LevelDescription: ''},
        ],
        //工序表
        Process:[{
                ProcessId: 'bd08db2b-66ea-6769-db99-6c667c1745ef',
                ProcessName: '主体工程',
                ProcessDescription: '', 
                ProcessColor:'',
                ProcessNumber: 1,
                LevelCategory2Cycle: [{LevelCategory: '首层', LevelCycle: 2}, {LevelCategory: '二层', LevelCycle: 2}, {LevelCategory: '三层', value: 2}, {
                        LevelCategory: '标准层',
                        LevelCycle: 2
                }]

        },
                {
                        ProcessId: 'd0fe5309-1d2b-f4f6-05ea-300f812c12a5',
                        ProcessName: '抹灰工序',
                        ProcessDescription: '',
                        ProcessNumber: 2,
                        LevelCategory2Cycle: [{LevelCategory: '首层', LevelCycle: 2}, {LevelCategory: '二层', LevelCycle: 2}, {
                                LevelCategory: '三层',
                                value: 2
                        }, {LevelCategory: '标准层', LevelCycle: 2}]

                }
        ],
        //标准工序模板
        ProcessNode:[{
                ProcessNodeName:'主体工序',
                ProcessId:'bd08db2b-66ea-6769-db99-6c667c1745ef',
                BeforeProcessId:'',
                ProcessNodeCategory:'',
                Interval:0
        },{
                ProcessNodeName:'抹灰工序',
                ProcessId:'d0fe5309-1d2b-f4f6-05ea-300f812c12a5',
                BeforeProcessId:'',
                ProcessNodeCategory:'',
                Interval:34
        }]
}