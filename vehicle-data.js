/* Manufacturer configurations, checked 2026-10-16. Sources: research/SOURCES.md.
 * extra values are DEMO monthly deltas, never manufacturer or binding rental quotes.
 * Optional equipment does not produce a fabricated monthly price.
 */
window.VEHICLE_DATA = {
  'new-x': {
    year:'全新一代 A6L', image:'assets/a6-front.webp',
    specs:[['车身','中大型轿车'],['轴距','3,066mm'],['变速箱','7速 S tronic'],['座位','5座']],
    dimensions:'5,142 × 1,874 × 1,464mm',
    colors:[['传奇黑','#222326'],['茉莉白','#f5f4ef'],['香槟黑','#504c45'],['曼达洛银','#aeb3b4'],['深洋蓝','#273b50']],
    trims:[
      {id:'a6-select',name:'臻选型',trim:'2.0T · 150kW · 前驱',extra:0,features:['星辰矩阵大灯','三屏数字座舱','18英寸轮毂']},
      {id:'a6-enjoy',name:'尊享型',trim:'2.0T · 200kW · 前驱',extra:600,features:['B&O音响','四区自动空调','19英寸对比色轮毂']},
      {id:'a6-quattro',name:'quattro 尊享型',trim:'2.0T · 200kW · 四驱',extra:1200,features:['HDI双电机混动','前排座椅通风','20英寸对比色轮毂']},
      {id:'a6-flagship',name:'3.0T quattro 旗舰型',trim:'3.0T V6 · 270kW · 四驱',extra:2400,features:['纳帕真皮座椅','前排通风按摩','21英寸对比色轮毂']}
    ],
    interiors:[
      {id:'serica',name:'Serica 科技皮',status:['standard','standard','standard','unavailable']},
      {id:'nappa',name:'高级纳帕真皮',note:'含真皮包',status:['optional','optional','optional','standard']}
    ],
    wheels:[
      {id:'w18',name:'18英寸铝合金轮毂',status:['standard','unavailable','unavailable','unavailable']},
      {id:'w19',name:'19英寸铝合金轮毂',status:['optional','optional','unavailable','unavailable']},
      {id:'w19c',name:'19英寸对比色轮毂',status:['optional','standard','unavailable','unavailable']},
      {id:'w20c',name:'20英寸对比色轮毂',status:['optional','optional','standard','unavailable']},
      {id:'w20b',name:'20英寸黑色轮毂',status:['optional','optional','optional','unavailable']},
      {id:'w21c',name:'21英寸对比色轮毂',status:['unavailable','optional','optional','standard']}
    ],
    options:[
      {id:'bo',name:'B&O 音响',status:['optional','standard','standard','standard']},
      {id:'hud',name:'W-HUD 抬头显示',status:['optional','optional','optional','optional']},
      {id:'air',name:'自适应空气悬架',status:['unavailable','unavailable','optional','optional']},
      {id:'steer',name:'全轮转向',status:['unavailable','unavailable','optional','optional']},
      {id:'digital',name:'数字大灯',status:['optional','optional','optional','optional']},
      {id:'doors',name:'车门电吸关闭',status:['optional','optional','optional','standard']}
    ],
    gallery:[['assets/a6-front.webp','前侧外观'],['assets/a6-side.webp','车身侧面'],['assets/a6-rear.webp','尾部外观'],['assets/a6-interior.jpg','座舱空间']],
    features:[['assets/a6-light.jpg','星辰矩阵大灯'],['assets/a6-interior.jpg','数字座舱'],['assets/a6-drive.jpg','从容，见于每一程']],
    source:'奥迪中国 · 全新奥迪 A6L 车型折页', sourceUrl:'https://www.audi.cn/zh/models/a/a6/new_a6l.html'
  },
  'new-v': {
    year:'2026款 e:HEV',image:'assets/crv-front.png',
    specs:[['车型','紧凑型SUV'],['动力','2.0L 混动'],['电机功率','135kW'],['座位','5座']],
    colors:[['晶耀白','#f4f3f0'],['摩登灰','#838688'],['彩晶黑','#24272a']],
    trims:[
      {id:'crv-shang',name:'智尚版',trim:'2.0L e:HEV · 两驱',extra:0,features:['12.3英寸中控屏','ANC主动降噪','18英寸轮毂']},
      {id:'crv-xiang',name:'智享版',trim:'2.0L e:HEV · 两驱',extra:200,features:['Honda SENSING','真皮座椅','8扬声器']},
      {id:'crv-yi',name:'智逸版',trim:'2.0L e:HEV · 两驱',extra:350,features:['前排座椅通风加热','氛围灯','8探头驻车雷达']},
      {id:'crv-awd',name:'智逸四驱版',trim:'2.0L e:HEV · 四驱',extra:550,features:['实时四驱','后排座椅加热','前排座椅通风']},
      {id:'crv-rui',name:'智睿版',trim:'2.0L e:HEV · 两驱',extra:650,features:['360°全景影像','电动尾门','50W无线充电']},
      {id:'crv-zhen',name:'智臻版',trim:'2.0L e:HEV · 两驱',extra:850,features:['HUD抬头显示','BOSE音响','19英寸轮毂']}
    ],
    interiors:[],wheels:[{id:'w18',name:'18英寸轮毂',status:['standard','standard','standard','standard','standard','unavailable']},{id:'w19',name:'19英寸轮毂',status:['unavailable','unavailable','unavailable','unavailable','unavailable','standard']}],options:[],
    gallery:[['assets/crv-front.png','外观'],['assets/crv-gallery.jpg','车身设计'],['assets/crv-interior.jpg','座舱空间']],
    features:[['assets/crv-light.jpg','LED前大灯'],['assets/crv-interior.jpg','宽适座舱'],['assets/crv-gallery.jpg','自在，驶向生活']],
    source:'东风本田 · CR-V e:HEV 配置表',sourceUrl:'https://www.dongfeng-honda.com/cr-v/HEV/js/configuration.html'
  },
  'new-mg': {
    year:'2024款 MG4 EV',
    specs:[['车型','紧凑型两厢车'],['轴距','2,705mm'],['电池','49 / 64kWh'],['座位','5座']],
    colors:[['骑士银','#a4a7aa'],['高冷灰','#686b71'],['忠毅白','#f1f2f3'],['回头绿','#146644'],['花木蓝','#23758b'],['中国红','#ba2237']],
    colorTrims:{'花木蓝':['mg-520'],'中国红':['mg-520']},
    trims:[
      {id:'mg-champion',name:'出海冠军版',trim:'415km CLTC · 125kW · 后驱',extra:0,features:['49kWh电池','360°全景影像','前排座椅加热']},
      {id:'mg-520',name:'520km旗舰版',trim:'520km CLTC · 150kW · 后驱',extra:300,features:['64kWh电池','ACC自适应巡航','前排手机无线充电']},
      {id:'mg-awd',name:'四驱性能版',trim:'460km CLTC · 315kW · 四驱',extra:700,features:['3.8秒零百加速','一体式运动座椅','18英寸轮毂']}
    ],
    interiors:[{id:'black',name:'高雅黑内饰',status:['standard','standard','standard']},{id:'gray',name:'极简灰内饰',status:['optional','optional','unavailable']}],
    wheels:[{id:'w17',name:'17英寸轮毂',status:['standard','standard','unavailable']},{id:'w18',name:'18英寸轮毂',status:['unavailable','unavailable','standard']}],
    options:[{id:'heatpump',name:'热泵空调',status:['optional','optional','optional']},{id:'roof',name:'天空之境穹顶天幕',status:['unavailable','optional','standard']}],
    gallery:[['assets/mg-gallery-two.jpg','车身外观'],['assets/mg-gallery.jpg','城市行驶']],
    features:[['assets/mg-gallery.jpg','轻盈城市出行'],['assets/mg-gallery-two.jpg','灵动两厢造型']],
    source:'上汽名爵 · MG4 EV 2024年配置表',sourceUrl:'https://www.saicmg.com/pc/vehicles/sedan/mulan/mulan20240704.pdf'
  },
  'new-m3': {
    year:'Model 3',specs:[['车型','中型轿车'],['轴距','2,875mm'],['动力','纯电'],['座位','5座']],
    colors:[['星空灰','#56595f'],['海洋蓝','#285078']],
    trims:[
      {id:'tesla-rwd',name:'后轮驱动版',trim:'后轮驱动',extra:0,features:['玻璃车顶','基础辅助驾驶','座椅加热']},
      {id:'tesla-lr',name:'长续航后轮驱动版',trim:'长续航 · 后轮驱动',extra:600,features:['玻璃车顶','基础辅助驾驶','座椅加热']},
      {id:'tesla-awd',name:'长续航全轮驱动版',trim:'双电机 · 全轮驱动',extra:1000,features:['玻璃车顶','基础辅助驾驶','座椅加热']}
    ],
    interiors:[{id:'black',name:'深色高级内饰',status:['standard','standard','standard']},{id:'light',name:'浅色高级内饰',status:['optional','optional','optional']}],
    wheels:[{id:'photon',name:'18英寸光子轮毂',status:['standard','standard','standard']},{id:'nova',name:'19英寸新星轮毂',status:['optional','optional','optional']}],options:[],
    gallery:[['assets/tesla-gallery.jpg','车身外观'],['assets/tesla-interior.jpg','极简座舱'],['assets/tesla-seat.jpg','玻璃车顶']],
    features:[['assets/tesla-interior.jpg','极简座舱'],['assets/tesla-seat.jpg','玻璃车顶'],['assets/tesla-gallery.jpg','尽享每一程']],
    source:'特斯拉中国 · 官方车型与配置',sourceUrl:'https://www.tesla.cn/model3/design'
  }
};
// Stock and new cars share model photography, never a configurable trim catalog.
window.STOCK_SHOWROOM = Object.fromEntries([
  ['mg','new-mg','2024款 MG4 EV'],
  ['m3','new-m3','2025款 Model 3'],
  ['crv','new-v','2025款 CR-V e:HEV']
].map(([id,source,year])=>{
  const data=window.VEHICLE_DATA[source];
  return [id,{year,gallery:data.gallery,features:data.features,source:data.source,sourceUrl:data.sourceUrl}];
}));
window.STOCK_SHOWROOM.q5={
  year:'2025款 Q5L',
  gallery:[['assets/q5-hero.png','车辆外观'],['assets/q5-cabin.jpg','座舱空间'],['assets/q5-feature.jpg','尾部设计'],['assets/q5-gallery.jpg','出行场景']],
  features:[['assets/q5-interior.jpg','动感车头造型'],['assets/q5-cabin.jpg','双屏数字座舱'],['assets/q5-gallery.jpg','与生活，一同出发']],
  source:'奥迪中国 · Q5L 车型图库',sourceUrl:'https://www.audi.cn/zh/models/q/q5/q5l.html'
};
