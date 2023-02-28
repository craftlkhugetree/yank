export const mvType = 'mp4|ogg|flv|avi|wmv|rmvb|mov|mv';
export const auditType = 'mp3';
export const imgType = 'jpg|png|jpeg|bmp|gif';

export const tabs = [
  { label: '首页', route: '/home' },
  { label: '院士文库', route: '/tc/academician', apiPre: 'person', filter: { relationship: 1 } },
  { label: '名师著作文库', route: '/tc/teacher', apiPre: 'person', filter: { relationship: 2 } },
  { label: '历代教材', route: '/tc/famous', apiPre: 'book', filter: {} },
  {
    label: '专家捐赠文库',
    route: '/tc/specialSponser',
    apiPre: 'person',
    filter: { relationship: 3 },
  },
  {
    label: '校友捐赠文库',
    route: '/tc/alumnaSponser',
    apiPre: 'person',
    filter: { relationship: 4 },
  },
];

export const title = ['出版书籍', '论文', '专利', '获奖荣誉'];
export const key = ['publishNum', 'paperNum', 'patentNum', 'honorNum'];
