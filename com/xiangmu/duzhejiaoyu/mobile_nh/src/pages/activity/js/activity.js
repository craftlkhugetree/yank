var createRule = {
    actName: [
        { required: true, message: '请输入活动名称', trigger: 'blur' },
    ],
    actLocation: [
        { required: true, message: '请输入', trigger: 'blur' },
    ],
    actTypeId:[
        { required: true, message: '请选择', trigger: 'change' },
    ],
    actTime: [
        {  required: true, message: '请选择日期', trigger: 'blur' }
    ],
    actPostImg: [
        { required: true, message: '请选择', trigger: 'change' }
    ]
}
export default {
    createRule:createRule
}