import { reactive } from 'vue';

export function cutLastComma(str) {
  if (typeof str === 'string' && str) {
    if (str.endsWith(':') || str.endsWith('：')) {
      return str.slice(0, str.length - 1);
    }
  }
  return str;
}

export function forEachForest(forest, fn, options = { childrenKey: '' }) {
  if (!Array.isArray(forest)) {
    console.error('第一个参数必须为数组类型');
    return;
  }
  const childrenKey = options?.childrenKey || 'children';
  const foo = (forestData, hook) => {
    for (let i = 0; i < forestData.length; i++) {
      const currentData = forestData[i];
      hook(currentData);
      if (!currentData[childrenKey]) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (!Array.isArray(currentData[childrenKey])) {
        // eslint-disable-next-line no-continue
        continue;
      }
      if (currentData[childrenKey] && currentData[childrenKey].length) {
        foo(currentData[childrenKey], hook);
      }
    }
  };
  foo(forest, fn);
}
export function initRules(slots) {
  const rules = reactive({});
  if (slots.default) {
    const allSlots = slots.default;
    let rulePath;
    forEachForest(allSlots, slot => {
      const slotType = slot.componentInstance || {};
      const propsData = slotType._props || {};
      if (slot.tag && slot.tag.indexOf('FormItem') > -1) {
        if (slotType && slotType.prop) {
          rules[slotType.prop] = [];
          rulePath = slotType.prop;
        }
        //填充必填项目rule规则
        if (propsData && (propsData.required === '' || propsData.required)) {
          const inputType = propsData.type;
          if (
            inputType == null ||
            inputType === 'input' ||
            inputType === 'textarea' ||
            inputType === 'remarks' ||
            inputType === 'password' ||
            inputType === 'number'
          ) {
            //普通输入框blur触发验证
            rules[rulePath].push({
              required: true,
              message: `请输入${cutLastComma(propsData.label)}`,
              trigger: 'blur',
            });
          } else if (inputType === 'select' || inputType === 'date' || inputType === 'daterange') {
            //日期，单选，多选触发 blur
            rules[rulePath].push({
              required: true,
              message: `请选择${cutLastComma(propsData.label)}`,
              trigger: 'change',
            });
            rules[rulePath].push({
              required: true,
              message: `请选择${cutLastComma(propsData.label)}`,
              trigger: 'blur',
            });
          } else if (inputType === 'upload') {
            rules[rulePath].push({
              required: true,
              message: `请选择${cutLastComma(propsData.label)}`,
              trigger: 'change',
            });
          } else if (inputType === 'boolean') {
            rules[rulePath].push({
              required: true,
              message: `请选择${cutLastComma(propsData.label)}`,
              trigger: ['blur', 'change'],
            });
          } else if (inputType === 'radio') {
            rules[rulePath].push({
              required: true,
              message: `请选择${cutLastComma(propsData.label)}`,
              trigger: ['blur', 'change'],
            });
          }
        }
        //填充字符最小长度规则
        if (propsData && propsData.minLen) {
          const inputType = propsData.type;
          if (inputType == null || inputType === 'input' || inputType === 'password') {
            //普通输入框blur触发验证
            rules[rulePath].push({
              min: propsData.minLen,
              message: `${cutLastComma(propsData.label)}至少${propsData.minLen}位`,
              trigger: 'blur',
            });
          }
        }
        //填充字符最大度规则
        if (propsData && propsData.maxLen) {
          const inputType = propsData.type;
          if (inputType == null || inputType === 'input' || inputType === 'password') {
            //普通输入框blur触发验证
            rules[rulePath].push({
              max: propsData.maxLen,
              message: `${cutLastComma(propsData.label)}最多${propsData.maxLen}位`,
              trigger: 'blur',
            });
          }
        }
        //填充字符长度规则
        if (propsData && propsData.len) {
          const inputType = propsData.type;
          if (inputType == null || inputType === 'input' || inputType === 'password') {
            //普通输入框blur触发验证
            rules[rulePath].push({
              len: propsData.len,
              message: `${cutLastComma(propsData.label)}应该为${propsData.len}位`,
              trigger: 'blur',
            });
          }
        }
        //填充email规则
        const validateEmail = (rule, value, callback) => {
          if (value === null || value.match(/\w+@.*\.\w+/)) {
            callback();
          } else {
            callback(new Error('请填写正确邮箱'));
          }
        };
        if (propsData && (propsData.email || propsData.email === '')) {
          const inputType = propsData.type;
          if (inputType == null || inputType === 'input') {
            //普通输入框才能填充email规则
            rules[rulePath].push({ validator: validateEmail, trigger: 'blur' });
          }
        }
        //填充手机号规则
        const validatePhone = (rule, value, callback) => {
          if (value === null || value.match(/^\d{11}$/)) {
            callback();
          } else {
            callback(new Error('请填写正确手机号'));
          }
        };
        if (propsData && (propsData.phone || propsData.phone === '')) {
          const inputType = propsData.type;
          if (inputType == null || inputType === 'input') {
            //普通输入框才能填充手机号规则
            rules[rulePath].push({ validator: validatePhone, trigger: 'blur' });
          }
        }
      }
    });
  }
  return rules;
}
