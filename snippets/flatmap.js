const depList = [
  {
    name: '部门1',
    businesses: [
      {
        name: '产品销售',
        years: [
          { name: '2021', value: 132 },
          { name: '2022', value: 183 },
          { name: '2023', value: 207 },
        ],
      },
      {
        name: '原料采购',
        years: [
          { name: '2021', value: 143 },
          { name: '2022', value: 121 },
          { name: '2023', value: 120 },
        ],
      },
    ],
  },
  {
    name: '部门2',
    businesses: [
      {
        name: '产品销售',
        years: [
          { name: '2021', value: 230 },
          { name: '2022', value: 112 },
          { name: '2023', value: 288 },
        ],
      },
      {
        name: '原料采购',
        years: [
          { name: '2021', value: 168 },
          { name: '2022', value: 203 },
          { name: '2023', value: 115 },
        ],
      },
    ],
  },
  {
    name: '部门3',
    businesses: [
      {
        name: '产品销售',
        years: [
          { name: '2021', value: 279 },
          { name: '2022', value: 163 },
          { name: '2023', value: 271 },
        ],
      },
      {
        name: '原料采购',
        years: [
          { name: '2021', value: 129 },
          { name: '2022', value: 121 },
          { name: '2023', value: 226 },
        ],
      },
    ],
  },
];

function flatBusinesses(list) {
  return list.flatMap(({ name: dept, businesses }) => {
    // console.log(dept, businesses);
    return businesses.flatMap(({ name: business, years }) => {
      return years.map(({ name: year, value }) => ({
        dept,
        business,
        year,
        value,
      }));
    });
  });
}

const flatList = flatBusinesses(depList);
console.log(flatList);

function groupBy(list, key) {
  // 这里简单地兼容一下传入 key 值和 keyGetter 的情况
  const getKey = typeof key === 'function' ? key : it => it[key];
  return list.reduce(
    (groups, it) => {
      let v = groups[getKey(it)];
      v ? v.push(it) : (groups[getKey(it)] = []);
      return groups;
    },
    {} // 空对象作为初始 groups
  );
}

// 按业务再按部门分组;
const groupByList = groupBy(flatList, 'dept');
const entries = Object.entries(groupByList);
console.log(groupByList, entries);

const result1 = entries.map(([name, list]) => ({
  name,
  depts: Object.entries(groupBy(list, 'dept')).map(([name, list]) => ({
    name,
    years: list.map(({ year: name, value }) => ({ name, value })),
  })),
}));
console.log(result1);

// 按业务分组再按年统计;
const result2 = Object.entries(groupBy(flatList, 'business')).map(([name, list]) => ({
  name,
  years: Object.entries(groupBy(list, 'year'))
    //      ^^^^^                               ^^^^^^ 按年分组
    .map(([name, list]) => ({
      name,
      value: list.reduce((sum, { value }) => sum + value, 0),
      //              ^^^^^ 直接取值，使用 reduce 汇总
    })),
}));
console.log(result2);
