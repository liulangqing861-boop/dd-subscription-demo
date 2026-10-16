(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = (name, small = false) => `<svg class="icon${small ? ' small' : ''}" viewBox="0 0 24 24" aria-hidden="true">${(window.SUBSCRIPTION_ICONS[name] || []).map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k,v])=>`${k}="${escape(v)}"`).join(' ')} />`).join('')}</svg>`;
  const number = n => Number(n).toLocaleString('zh-CN');
  const money = n => `¥${number(n)}`;
  const price = (n, unit = '') => `<span class="price"><span class="currency">¥</span>${number(n)}${unit ? `<span class="unit">${unit}</span>` : ''}</span>`;
  const cars = [
    {id:'mg', brand:'名爵', name:'MG4 EV', edition:'2025款 520km 旗舰版', image:'assets/mg4-hero.png', status:'准新车', fast:'最快2天交付', terms:{3:3899,6:3399,12:2999}, miles:'1万公里以内', tags:['城市通勤','信用免押'], group:'electric', year:'2025款', color:'珍珠白', energy:'纯电', range:'520km', rangeLabel:'CLTC 续航', seats:'5座', transmission:'自动挡'},
    {id:'m3', brand:'特斯拉', name:'Model 3', edition:'后轮驱动焕新版', image:'assets/model3-hero.png', status:'准新车', fast:'最快3天交付', terms:{3:5599,6:4999,12:4399}, miles:'0.8万公里以内', tags:['智能座舱','长续航'], group:'electric', year:'2025款', color:'珍珠白', energy:'纯电', range:'606km', rangeLabel:'CLTC 续航', seats:'5座', transmission:'自动挡'},
    {id:'q5', brand:'奥迪', name:'奥迪 Q5L', edition:'40T 豪华动感型', image:'assets/q5-hero.png', status:'准新车', fast:'最快5天交付', terms:{3:6899,6:6199,12:5599}, miles:'1.2万公里以内', tags:['豪华SUV','宽适空间'], group:'suv', year:'2025款', color:'曜石黑', energy:'汽油', range:'2.0T', rangeLabel:'发动机', seats:'5座', transmission:'自动挡'},
    {id:'crv', brand:'本田', name:'本田 CR-V', edition:'混动智享版', image:'assets/crv-hero.png', status:'现车', fast:'最快4天交付', terms:{3:4899,6:4299,12:3799}, miles:'1.5万公里以内', tags:['家庭出行','低油耗'], group:'suv', year:'2025款', color:'珍珠白', energy:'混动', range:'2.0L', rangeLabel:'发动机', seats:'5座', transmission:'自动挡'},
    {id:'new-x', brand:'奥迪', name:'奥迪 A6L', edition:'新车专属订阅 · 配置可选', image:'assets/a6l-hero.png', status:'全新车', fast:'交付时间待确认', terms:{12:7999,24:6999}, miles:'全新车', tags:['新车订阅','顾问报价'], group:'sedan', newCar:true, year:'2026款', color:'曜石黑', energy:'汽油', range:'2.0T', rangeLabel:'发动机', seats:'5座', transmission:'自动挡'},
    {id:'new-v', brand:'本田', name:'本田 CR-V', edition:'新车专属订阅 · 配置可选', image:'assets/crv-hero.png', status:'全新车', fast:'交付时间待确认', terms:{12:4699,24:3999}, miles:'全新车', tags:['全新SUV','配置可选'], group:'suv', newCar:true, year:'2026款', color:'珍珠白', energy:'混动', range:'2.0L', rangeLabel:'发动机', seats:'5座', transmission:'自动挡'}
  ];
  // New-car rental amounts are local demo estimates; official configuration data is separate.
  cars.push(
    {...cars[1],id:'new-m3',newCar:true,status:'全新车',edition:'新车选配',fast:'交付时间待确认',miles:'全新车',terms:{12:5999,24:5299},tags:['智能座舱','配置可选']},
    {...cars[0],id:'new-mg',newCar:true,status:'全新车',edition:'新车选配',fast:'交付时间待确认',miles:'全新车',terms:{12:4299,24:3699},tags:['城市通勤','配置可选']}
  );
  const vehicleData = window.VEHICLE_DATA;
  const vehiclePackages = Object.fromEntries(Object.entries(vehicleData).map(([id,d])=>[id,d.trims]));
  cars.forEach(c=>{const d=vehicleData[c.id];if(d){c.year=d.year;c.image=d.image||c.image;c.edition=d.trims[0].name;c.fast='交付时间待确认';c.tags=[c.energy==='纯电'?'纯电出行':'舒适出行','配置可选'];}});
  cars[0].year='2024款';cars[0].edition='520km旗舰版';cars[0].color='忠毅白';
  const storageKey = 'xc-subscription-ui-v2';
  // Illustrative stock only: query results genuinely match these local constraints.
  const demoSupply = {
    mg:{cities:['上海','杭州','广州','深圳','成都','南京'],ready:'2026-10-18'},
    m3:{cities:['上海','杭州','深圳','北京'],ready:'2026-10-20'},
    q5:{cities:['上海','北京','广州','深圳'],ready:'2026-10-22'},
    crv:{cities:['上海','杭州','广州','成都','北京'],ready:'2026-10-19'},
    'new-x':{cities:['上海','杭州','北京','深圳'],ready:null},
    'new-v':{cities:['上海','杭州','广州','深圳','成都'],ready:null}
  };
  demoSupply['new-m3']=demoSupply.m3;demoSupply['new-mg']=demoSupply.mg;
  const cities = [
    ['北京','beijing','朝阳区'],['成都','chengdu','武侯区'],['重庆','chongqing','渝北区'],['长沙','changsha','岳麓区'],['长春','changchun','南关区'],
    ['东莞','dongguan','南城街道'],['大连','dalian','中山区'],['大同','datong','平城区'],['佛山','foshan','禅城区'],['福州','fuzhou','鼓楼区'],
    ['广州','guangzhou','天河区'],['贵阳','guiyang','观山湖区'],['桂林','guilin','七星区'],['杭州','hangzhou','滨江区'],['合肥','hefei','蜀山区'],['海口','haikou','龙华区'],['哈尔滨','haerbin','南岗区'],['惠州','huizhou','惠城区'],
    ['济南','jinan','历下区'],['嘉兴','jiaxing','南湖区'],['金华','jinhua','婺城区'],['昆明','kunming','官渡区'],['洛阳','luoyang','洛龙区'],['兰州','lanzhou','城关区'],
    ['南京','nanjing','建邺区'],['宁波','ningbo','鄞州区'],['南昌','nanchang','红谷滩区'],['南宁','nanning','青秀区'],['青岛','qingdao','市南区'],['泉州','quanzhou','丰泽区'],
    ['上海','shanghai','浦东新区'],['深圳','shenzhen','南山区'],['苏州','suzhou','工业园区'],['沈阳','shenyang','和平区'],['三亚','sanya','吉阳区'],['上饶','shangrao','信州区'],['石家庄','shijiazhuang','裕华区'],
    ['天津','tianjin','河西区'],['太原','taiyuan','小店区'],['武汉','wuhan','武昌区'],['无锡','wuxi','滨湖区'],['温州','wenzhou','鹿城区'],
    ['西安','xian','雁塔区'],['厦门','xiamen','思明区'],['徐州','xuzhou','云龙区'],['烟台','yantai','莱山区'],['扬州','yangzhou','邗江区'],
    ['郑州','zhengzhou','金水区'],['珠海','zhuhai','香洲区'],['中山','zhongshan','东区街道']
  ].map(([name,pinyin,district])=>({name,pinyin,district,letter:pinyin[0].toUpperCase()}));
  const cityDistrict = Object.fromEntries(cities.map(c=>[c.name,c.district]));
  const cityLetters = [...new Set(cities.map(c=>c.letter))];
  const demoToday = '2026-10-16', earliestDelivery = '2026-10-18';
  const seedOrder = () => ({id:'XC202609200018', carId:'mg', monthly:3399, term:6, mileage:2500, coverage:'care', delivery:'door', city:'上海', address:'上海市浦东新区', start:'2026-09-20', time:'10:00', status:'active', services:[], nextBill:'2026-10-20', paid:true});
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { saved = null; }
  if (!saved) {
    let legacy;
    try { legacy = JSON.parse(localStorage.getItem('xc-subscription-demo') || 'null'); } catch { legacy = null; }
    saved = {verified:legacy ? !!legacy.verified : true, orders:legacy?.order ? [{...seedOrder(), ...legacy.order, id:legacy.order.no || seedOrder().id, status:legacy.order.active ? 'active' : 'preparing'}] : [seedOrder()]};
  }
  const state = {page:'home', city:'上海', address:'上海市浦东新区', start:'2026-10-20', time:'10:00', term:24, mileage:2500, coverage:'care', delivery:'door', catalog:'new', sort:'default', search:'', currentCar:cars[0], agreement:false, verified:!!saved.verified, orders:Array.isArray(saved.orders) ? saved.orders.filter(o=>cars.some(c=>c.id===o.carId)) : [], selectedOrder:null, orderFilter:'all', sheet:null, busy:false, configDraft:null, serviceType:'', sheetOrigin:null, backStack:[], invoice:saved.invoice || null};
  const app = $('#app'), fixed = $('#fixed'), overlays = $('#overlays');
  state.cityQuery='';state.recentCities=['上海','杭州'];state.locatedCity='上海';state.calendarMonths=4;state.dateDraft=null;
  state.catalogQuery=null;state.browseCatalog='new';state.homeTerms={};state.brand='all';state.packageId='';state.vehicleChoices={};state.galleryIndex=0;
  state.depositWaived=saved.depositWaived ?? state.verified;state.pendingBill=null;state.debitConsent=false;
  state.driverName='';state.driverPhone='';state.contactErrors={};state.addressDraft=null;
  let toastTimer, lastFocus, sheetScrollTop=0;
  function showSheet(type,content){
    if(!state.sheet){lastFocus=document.activeElement;sheetScrollTop=app.scrollTop;}
    state.sheet=type;overlays.innerHTML=content;app.inert=true;fixed.inert=true;app.classList.add('scroll-locked');
    $('.sheet')?.focus({preventScroll:true});app.scrollTop=sheetScrollTop;
  }
  const dateLabel = date => {const [,m,d] = date.split('-'); return `${Number(m)}月${Number(d)}日`;};
  const isoDate = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  function endDate(start,months) {const [y,m,d]=start.split('-').map(Number);const result=new Date(y,m-1+months,1,12);result.setDate(Math.min(d,new Date(result.getFullYear(),result.getMonth()+1,0).getDate()));return isoDate(result);}
  const fullDateLabel = d => d.slice(0,4)+'年'+dateLabel(d);
  const draftTime = () => `${String(state.dateDraft.hour).padStart(2,'0')}:${String(state.dateDraft.minute).padStart(2,'0')}`;
  function fitPreview() {const native=matchMedia('(pointer: coarse) and (max-width: 540px)').matches;const scale=native?1:Math.max(.2,Math.min(1,(innerWidth-32)/390,(innerHeight-76)/844));document.documentElement.style.setProperty('--preview-scale',scale);}
  const coverageName = value => value === 'premium' ? '无忧保障' : '安心保障';
  const deliveryName = value => value === 'store' ? '门店取车' : '送车上门';
  const carOf = order => cars.find(c=>c.id===order.carId) || cars[0];
  const selectedOrder = () => state.orders.find(o=>o.id===state.selectedOrder) || state.orders[0];
  const lowestTerm = c => Number(Object.keys(c.terms).reduce((a,b)=>c.terms[a]<=c.terms[b]?a:b));
  const homeTerm = c => state.homeTerms[c.id] || (c.terms[state.term]?state.term:Number(Object.keys(c.terms)[0]));
  const carName = c => c.brand==='特斯拉'?'特斯拉 '+c.name:c.name;
  const catalogMode = () => state.page==='searchResults'?state.catalogQuery.catalog:state.browseCatalog;
  function selection() {return {city:state.city,address:state.address,start:state.start,time:state.time,term:state.term,catalog:state.catalog};}
  function syncQuerySelection() {if(state.catalogQuery&&(state.page==='searchResults'||state.backStack.at(-1)?.page==='searchResults'))state.catalogQuery={...state.catalogQuery,...selection()};}
  function matchesSupply(c,q) {const s=demoSupply[c.id];return !!c.terms[q.term]&&s.cities.includes(q.city)&&(!s.ready||q.start>=s.ready);}
  const labels = {pending:'待确认', preparing:'车辆准备中', delivering:'车辆交付', active:'使用中', completed:'已完成', inquiry:'意向已收到'};
  const chosenPackage = (c=state.currentCar, config=state) => (vehiclePackages[c.id]||[]).find(p=>p.id===config.packageId)||(vehiclePackages[c.id]||[])[0];
  const vehicleDeposit = () => state.depositWaived && state.verified ? 0 : 3000;
  const firstPayment = o => o.monthly+(o.deposit||0);
  function normalizeTerm() {if(!state.currentCar.terms[state.term]) state.term = Number(Object.keys(state.currentCar.terms)[0]);}
  function monthly(config = state) {const c = state.currentCar; const term = c.terms[config.term] ? config.term : Number(Object.keys(c.terms)[0]);return c.terms[term] + (chosenPackage(c,config)?.extra||0) + ({1500:-200,2500:0,3500:450}[config.mileage] || 0) + (config.coverage === 'premium' ? 399 : 0);}
  const total = config => monthly(config || state) * (config || state).term;

  const dataOf = (c=state.currentCar) => vehicleData[c.id];
  const trimIndex = () => dataOf().trims.findIndex(p=>p.id===chosenPackage().id);
  const fitStatus = item => item.status[trimIndex()] || 'unavailable';
  function normalizeVehicle() {
    const d=dataOf();if(!d)return;
    state.packageId=chosenPackage().id;
    const choice=state.vehicleChoices[state.currentCar.id] ||= {color:d.colors[0][0],options:[]};
    if(d.colorTrims?.[choice.color]&&!d.colorTrims[choice.color].includes(state.packageId))choice.color=d.colors[0][0];
    for(const key of ['interiors','wheels']) {
      const items=d[key]||[];
      if(!items.some(item=>item.id===choice[key]&&fitStatus(item)!=='unavailable'))choice[key]=(items.find(item=>fitStatus(item)==='standard')||items.find(item=>fitStatus(item)!=='unavailable'))?.id||'';
    }
    choice.options=choice.options.filter(id=>d.options.some(item=>item.id===id&&fitStatus(item)==='optional'));
  }
  const vehicleChoice = () => state.vehicleChoices[state.currentCar.id];
  const pickedItem = key => dataOf()?.[key]?.find(item=>item.id===vehicleChoice()?.[key]);
  function configSummary() {
    if(!dataOf())return state.currentCar.edition;
    normalizeVehicle();const d=dataOf(),v=vehicleChoice();
    return [chosenPackage().name,v.color,pickedItem('interiors')?.name,pickedItem('wheels')?.name,...d.options.filter(x=>v.options.includes(x.id)).map(x=>x.name)].filter(Boolean).join(' · ');
  }
  function selectCar(id,term) {
    const c=cars.find(c=>c.id===id);if(!c)return false;
    const same=state.currentCar.id===id;state.currentCar=c;
    if(!same)state.packageId=state.vehicleChoices[id]?.packageId||'';
    state.term=term||lowestTerm(c);normalizeTerm();normalizeVehicle();state.agreement=false;return true;
  }

  function save() {try {localStorage.setItem(storageKey, JSON.stringify({verified:state.verified,depositWaived:state.depositWaived,orders:state.orders,invoice:state.invoice}));} catch {toast('当前浏览器未开启本地保存，本次操作仍可继续');}}
  function statusBar() {return `<div class="statusbar" aria-hidden="true"><span>9:41</span><div class="status-icons"><span class="signal"><i></i><i></i><i></i><i></i></span><span>5G</span><span class="battery"></span></div></div>`;}
  function header(title, {back=true, right='support', status=true} = {}) {return `<div class="page-navigation">${status ? statusBar() : ''}<header class="page-head">${back?`<button class="icon-button" data-action="back" aria-label="返回">${icon('ChevronLeft')}</button>`:'<span></span>'}<h1>${title}</h1>${right?`<button class="icon-button" data-action="sheet" data-value="${right}" aria-label="${right==='settings'?'设置':right==='share'?'分享':'联系客服'}">${icon(right==='settings'?'Settings2':right==='share'?'Share':'Headset')}</button>` :'<span></span>'}</header></div>`;}
  function nav() {return `<nav class="tabbar" aria-label="主导航">${[['home','首页','House'],['catalog','选车','CarFront'],['orders','订单','FileText'],['mine','我的','UserRound']].map(([key,label,i])=>`<button class="nav-item ${state.page===key?'active':''}" data-action="nav" data-value="${key}" ${state.page===key?'aria-current="page"':''}>${icon(i)}<span>${label}</span></button>`).join('')}</nav>`;}
  function purchaseBar(label, action, {amount=total(), first=false, disabled=false, term=state.term,estimate=true}={}) {return `<div class="purchase-bar"><div class="bar-term"><small>订阅期</small>${term}个月</div><div class="bar-total"><small>${first?'首次应付':estimate?'预估总价':'合同总价'}</small>${price(amount)}</div><button class="primary" data-action="${action}" ${disabled?'disabled':''}>${label}</button></div>`;}
  const pair = (label,value,strong=false) => `<div class="summary-pair${strong?' strong':''}"><span>${label}</span><b>${value}</b></div>`;
  function rowCar(c) {const term = c.terms[state.term] ? state.term : Number(Object.keys(c.terms)[0]);return `<button class="vehicle-row" data-action="car" data-value="${c.id}"><div class="vehicle-thumb"><img src="${c.image}" alt="${c.name}" loading="lazy"></div><div class="vehicle-row-copy"><h3>${c.name}</h3><p class="descriptor">${c.energy} · ${c.transmission} · ${c.seats}</p><div class="pill-row">${c.tags.slice(0,2).map(t=>`<span class="tag">${t}</span>`).join('')}</div>${price(c.terms[term],'/月起')}</div></button>`;}
  function homeVehicle(c) {
    const term=homeTerm(c);
    return `<article class="home-vehicle-row" data-home-car="${c.id}"><button class="home-vehicle-photo" data-action="vehicle" data-value="${c.id}" aria-label="查看${carName(c)}车辆详情"><img src="${c.image}" alt="${carName(c)}"><span>${c.status}</span></button><div class="home-vehicle-copy"><button class="home-car-title" data-action="home-car" data-value="${c.id}"><h3>${carName(c)}</h3></button><p class="home-car-spec">${c.energy} · ${c.seats} · ${c.transmission}</p><div class="pill-row">${[c.tags[0],'含保险保养'].map(t=>`<span class="tag">${t}</span>`).join('')}</div><button class="home-car-price" data-action="home-car" data-value="${c.id}" aria-label="查看${carName(c)}${term}个月方案">${price(c.terms[term],'/月')}</button><div class="home-car-terms" aria-label="${carName(c)}订阅周期">${Object.keys(c.terms).map(t=>`<button class="${Number(t)===term?'active':''}" data-action="home-car-term" data-car="${c.id}" data-value="${t}" aria-pressed="${Number(t)===term}">${t}个月</button>`).join('')}</div></div></article>`;
  }
  function homeGuides() {return `<section class="home-guides"><div class="section-heading"><h2>订阅之前，你可能想了解</h2></div>${[['coverage','月费包含哪些服务？','保险、保养、救援与城市取送'],['deposit','怎样申请信用免押？','评估结果以实际审核为准'],['rules','到期想续订或换车怎么办？','提前联系管家，安排下一程']].map(([v,t,s])=>`<button class="home-guide-row" data-action="sheet" data-value="${v}"><span><strong>${t}</strong><small>${s}</small></span>${icon('ChevronRight',true)}</button>`).join('')}</section>`;}
  function home() {
    const picks=cars.filter(c=>c.newCar);
    return `<section class="home-immersive"><img class="home-visual" src="assets/home-light-hero.png" alt="白色电动车与浅色滨水建筑">${statusBar()}<header class="home-head"><div class="home-brand-group"><div class="brand">DD<em>订阅</em></div><span class="brand-caption">新车新生活</span></div><button class="icon-button" data-action="sheet" data-value="support" aria-label="联系顾问">${icon('Headset')}</button></header><div class="home-title"><h1>新车，为你而来</h1><p>选定心仪车款 · 开启订阅生活</p><span class="title-accent" aria-hidden="true"></span></div></section>
    <main class="home-body home-light">
      <section class="subscription-entries" aria-label="选择订阅方式">
        <button class="subscription-entry entry-new" data-action="enter-catalog" data-value="new"><div><span class="entry-kicker">全新座驾</span><h2>新车订阅</h2><p>选配心仪座驾</p></div><span class="entry-link">选配新车 ${icon('ChevronRight',true)}</span></button>
        <button class="subscription-entry entry-stock" data-action="enter-catalog" data-value="stock"><div><span class="entry-kicker">精选现车</span><h2>现车订阅</h2><p>精选在库车辆</p></div><span class="entry-link">查看现车 ${icon('ChevronRight',true)}</span></button>
      </section>
      <section class="popular-section home-popular"><div class="section-heading"><div><h2>热门新车订阅</h2></div><button data-action="enter-catalog" data-value="new">全部车型${icon('ChevronRight',true)}</button></div><div class="home-vehicle-list">${picks.map(homeVehicle).join('')}</div><button class="home-results-link" data-action="enter-catalog" data-value="new">探索更多新车订阅${icon('ChevronRight',true)}</button></section>
      <section class="home-services" aria-label="订阅服务">${[['ShieldCheck','保险保障','全程安心'],['Wrench','保养维保','定期安排'],['TruckElectric','道路救援','7×24小时'],['House','送车上门','省时省心']].map(([i,t,n])=>`<button data-action="sheet" data-value="coverage">${icon(i)}<b>${t}</b><span>${n}</span></button>`).join('')}</section>${homeGuides()}
    </main>`;
  }
  function catalogCard(c) {
    const term=lowestTerm(c);
    return `<article class="catalog-card"><button class="catalog-image" data-action="vehicle" data-value="${c.id}" aria-label="查看${carName(c)}车辆详情"><img src="${c.image}" alt="${carName(c)}" loading="lazy"></button><button class="catalog-copy" data-action="car" data-value="${c.id}"><h2>${carName(c)}</h2><p class="descriptor">${c.energy} · ${c.seats}${c.newCar?' · '+vehiclePackages[c.id].length+'款车款':''}</p><div class="catalog-card-bottom">${price(c.terms[term],'/月起')}<span class="catalog-cta">${c.newCar?'选配置':'订阅方案'}${icon('ChevronRight',true)}</span></div></button></article>`;
  }
  function filteredCars() {
    let list=cars.filter(c=>catalogMode()==='new'?c.newCar:!c.newCar);
    if(catalogMode()==='stock')list=list.filter(c=>demoSupply[c.id].cities.includes(state.city));
    if(state.brand!=='all')list=list.filter(c=>c.brand===state.brand);
    const q=state.search.trim().toLowerCase();
    if(q)list=list.filter(c=>`${c.brand} ${c.name}`.toLowerCase().includes(q));
    if(state.sort==='price')list.sort((a,b)=>a.terms[state.page==='searchResults'?state.catalogQuery.term:lowestTerm(a)]-b.terms[state.page==='searchResults'?state.catalogQuery.term:lowestTerm(b)]);
    return list;
  }
  function catalogResults() {
    const list=filteredCars(),query=state.page==='searchResults';
    return list.map(catalogCard).join('') || `<div class="empty">${icon('Search')}<h2>暂未找到合适车型</h2><p>试试其他品牌${query?'，或调整用车条件':''}。</p><button class="secondary" data-action="clear-search">清除车型筛选</button>${query?'<button class="text-button" data-action="query-edit" data-value="date">调整用车日期</button>':''}</div>`;
  }
  function catalogFilters() {return `<button class="sort-button" data-action="sort">${state.sort==='price'?'价格从低到高':'月费排序'}${icon('ArrowDownUp',true)}</button>`;}
  function carSearchField() {return `<label class="search-field">${icon('Search')}<input type="search" id="car-search" placeholder="搜索品牌或车型" value="${escape(state.search)}" aria-label="搜索品牌或车型"></label>`;}
  function resultCount() {return `<span>${state.brand==='all'?'全部车型':state.brand} <b>${filteredCars().length}</b> 款</span>${catalogFilters()}`;}
  function brandRail() {
    const brands=['all',...new Set(cars.filter(c=>catalogMode()==='new'?c.newCar:!c.newCar).map(c=>c.brand))];
    return `<aside class="brand-rail" aria-label="按品牌筛选">${brands.map(b=>`<button class="${state.brand===b?'active':''}" data-action="brand" data-value="${b}" aria-pressed="${state.brand===b}">${b==='all'?'全部品牌':b}</button>`).join('')}</aside>`;
  }
  function brandCatalogBody() {return `<div class="brand-catalog">${brandRail()}<div class="brand-results"><div class="catalog-summary" id="catalog-count">${resultCount()}</div><main class="catalog-list" id="catalog-results">${catalogResults()}</main></div></div>`;}
  function catalog() {
    return `${statusBar()}<header class="catalog-page-head"><button class="city-button" data-action="sheet" data-value="city" aria-label="选择用车城市">${state.city}${icon('ChevronDown',true)}</button><h1>订阅选车</h1><button class="icon-button" data-action="sheet" data-value="support" aria-label="联系客服">${icon('Headset')}</button></header><div class="catalog-controls">${carSearchField()}<div class="catalog-modes">${[['new','新车订阅'],['stock','现车订阅']].map(([v,t])=>`<button class="${state.browseCatalog===v?'active':''}" data-action="mode" data-value="${v}">${t}</button>`).join('')}</div></div>${brandCatalogBody()}`;
  }
  function searchResults() {return catalog();}
  function packageSelector() {
    const d=dataOf(),p=chosenPackage(),v=vehicleChoice();
    return `<section class="package-section" aria-label="选配置"><h2 class="simple-heading">选配置</h2><div class="trim-grid">${d.trims.map(t=>`<button class="trim-card ${t.id===p.id?'active':''}" data-action="package" data-value="${t.id}" aria-pressed="${t.id===p.id}"><strong>${t.name}</strong><small>${t.trim}</small></button>`).join('')}</div><div class="paint-heading"><span>外观颜色</span><b>${v.color}</b></div><div class="paint-swatches">${d.colors.map(([name,color])=>`<button class="paint-swatch ${v.color===name?'active':''}" style="--paint:${color}" data-action="paint" data-value="${name}" aria-label="${name}${d.colorTrims?.[name]&&!d.colorTrims[name].includes(p.id)?'（本车款不可选）':''}" ${d.colorTrims?.[name]&&!d.colorTrims[name].includes(p.id)?'disabled':''} aria-pressed="${v.color===name}"><span></span></button>`).join('')}</div>${[['interiors','内饰'],['wheels','轮毂']].filter(([key])=>d[key].length).map(([key,title])=>`<button class="configuration-row" data-action="equipment-choice" data-value="${key}"><span>${title}</span><b>${pickedItem(key)?.name}${icon('ChevronRight',true)}</b></button>`).join('')}${d.options.length?`<button class="configuration-row" data-action="equipment"><span>选装装备</span><b>${v.options.length?'已选 '+v.options.length+' 项':'选择装备'}${icon('ChevronRight',true)}</b></button>`:''}<p class="standard-features">${p.features.join(' · ')}</p></section>`;
  }
  function equipment() {
    const d=dataOf(),v=vehicleChoice(),p=chosenPackage();
    return `${header('选装装备',{right:null})}<main class="equipment-page"><h2>${carName(state.currentCar)}</h2><p class="equipment-trim">${p.name}</p><div class="equipment-list">${d.options.map(item=>{const status=fitStatus(item),selected=v.options.includes(item.id);return `<button class="equipment-item ${selected?'active':''}" data-action="toggle-equipment" data-value="${item.id}" ${status==='optional'?'':'disabled'} aria-pressed="${selected||status==='standard'}"><span><strong>${item.name}</strong><small>${status==='standard'?'本车款标配':status==='unavailable'?'本车款不可选':'可选装'}</small></span><span class="equipment-check">${selected||status==='standard'?icon('Check',true):''}</span></button>`;}).join('')}</div><p class="option-price-note">选装费用随正式订阅报价确认</p></main>`;
  }
  function configurationSheet(key) {
    const title=key==='interiors'?'选择内饰':'选择轮毂';
    return sheetFrame(title,`<div class="equipment-list">${dataOf()[key].map(item=>{const status=fitStatus(item);return `<button class="equipment-item ${vehicleChoice()[key]===item.id?'active':''}" data-action="choose-equipment" data-key="${key}" data-value="${item.id}" ${status==='unavailable'?'disabled':''}><span><strong>${item.name}</strong><small>${status==='standard'?'本车款标配':status==='unavailable'?'本车款不可选':'可选'}${item.note?' · '+item.note:''}</small></span><span class="equipment-check">${vehicleChoice()[key]===item.id?icon('Check',true):''}</span></button>`;}).join('')}</div>`);
  }
  const showroomOf = (c=state.currentCar) => dataOf(c)||window.STOCK_SHOWROOM?.[c.id];
  function galleryOf(c=state.currentCar) {return showroomOf(c)?.gallery||[[c.image,'车辆外观']];}
  function vehicleInfo() {
    const c=state.currentCar,d=showroomOf(c),gallery=galleryOf(c),index=Math.min(state.galleryIndex,gallery.length-1);
    const specs=d?.specs||[['能源',c.energy],[c.rangeLabel,c.range],['座位',c.seats],['变速箱',c.transmission]];
    return `${header('车辆详情',{right:null})}<section class="showroom-gallery"><div class="gallery-stage"><img src="${gallery[index][0]}" alt="${carName(c)} · ${gallery[index][1]}">${gallery.length>1?`<button class="gallery-arrow prev" data-action="gallery-step" data-value="-1" aria-label="上一张">${icon('ChevronLeft')}</button><button class="gallery-arrow next" data-action="gallery-step" data-value="1" aria-label="下一张">${icon('ChevronRight')}</button>`:''}<span class="gallery-count">${index+1} / ${gallery.length}</span></div><div class="gallery-dots">${gallery.map((item,i)=>`<button class="${i===index?'active':''}" data-action="gallery" data-value="${i}" aria-label="查看${item[1]}" aria-pressed="${i===index}"></button>`).join('')}</div></section><main class="showroom-body"><section class="showroom-model"><p>${c.brand} · ${d?.year||c.year}</p><h1>${carName(c)}</h1><div class="showroom-specs">${specs.map(([l,v])=>`<div><small>${l}</small><strong>${v}</strong></div>`).join('')}</div></section>${d?.features.length?`<section class="showroom-features"><h2>车型介绍</h2><div class="feature-mosaic">${d.features.map(([src,title],i)=>`<figure class="${i===2?'wide':''}"><img src="${src}" alt="${title}" loading="lazy"><figcaption>${title}</figcaption></figure>`).join('')}</div></section>`:''}${d?.trims?.length?`<section class="showroom-versions"><h2>车款一览</h2>${d.trims.map(t=>`<div><strong>${t.name}</strong><p>${t.trim}</p></div>`).join('')}</section>`:''}${d?.dimensions?`<div class="showroom-dimensions"><span>长 × 宽 × 高</span><strong>${d.dimensions}</strong></div>`:''}<p class="showroom-source">${d?d.source:'车型外观展示'}<br>图片展示不对应所选颜色及选装组合</p></main>`;
  }
  function detail() {
    const c=state.currentCar;normalizeTerm();normalizeVehicle();
    return `${header('订阅方案',{right:'share'})}<section class="detail-hero"><button class="detail-photo" data-action="vehicle" data-value="${c.id}" aria-label="查看车辆图片与参数"><img src="${c.image}" alt="${carName(c)}"><span>车辆详情 ${icon('ChevronRight',true)}</span></button></section><main class="detail-body"><section class="model-overview"><div><h1>${carName(c)}</h1><p class="model-edition">${c.newCar?dataOf().year:c.edition}</p></div><div class="reference-price"><small>参考月费</small>${price(monthly(),'/月起')}</div></section>
    ${c.newCar?packageSelector():''}
    <section class="open-section"><h2 class="simple-heading">订阅方案</h2><button class="plan-line" data-action="config"><div><h2>${state.term}个月 · ${number(state.mileage)}公里/月</h2><p>${coverageName(state.coverage)} · ${deliveryName(state.delivery)}</p></div>${icon('ChevronRight')}</button></section><p class="included-line">含保险、保养、道路救援及城市取送</p>
    <section class="delivery-grid"><button class="delivery-cell" data-action="sheet" data-value="address"><small>交付地点</small><strong>${escape(state.address)}${icon('ChevronRight',true)}</strong><span>${deliveryName(state.delivery)}</span></button>${c.newCar?'<div class="delivery-cell"><small>交付时间</small><strong>待顾问确认</strong></div>':`<button class="delivery-cell" data-action="sheet" data-value="date"><small>开始用车</small><strong>${dateLabel(state.start)} ${state.time}${icon('ChevronRight',true)}</strong></button>`}</section>
    ${contactFields()}
    <button class="deposit-line" data-action="sheet" data-value="deposit"><span class="tag accent">可申请信用免押</span><span>押金待评估</span>${icon('ChevronRight',true)}</button>
    <section class="fee-panel"><div class="fee-columns"><div><small>预估总价</small><strong>${money(total())}</strong></div><div><small>参考月费</small><strong>${money(monthly())}</strong></div></div><p>${c.newCar?'选装费用另行报价 · ':''}最终以正式报价为准</p></section><div class="fine-links"><button data-action="sheet" data-value="rules">订阅规则</button><button data-action="sheet" data-value="support">咨询顾问</button></div></main>`;
  }
  function miniCar(c,text='',packageName='') {return `<div class="mini-car"><img src="${c.image}" alt="${carName(c)}"><div><h2>${carName(c)}</h2><p>${packageName||(c.newCar?'全新车':c.edition)}${text?`<br>${text}`:''}</p></div></div>`;}

  function config() {const c=state.currentCar,d=state.configDraft;return `${header('调整订阅方案',{right:null})}<main class="page-pad stack"><section class="card">${miniCar(c,'',chosenPackage(c,d)?.name)}</section><section class="config-section"><h2>订阅期限</h2><div class="options ${Object.keys(c.terms).length===2?'two':''}">${Object.entries(c.terms).map(([t,p])=>`<button class="option ${d.term===Number(t)?'active':''}" data-action="config-option" data-key="term" data-value="${t}" aria-pressed="${d.term===Number(t)}"><b>${t}个月</b><small>${money(p)}/月起</small></button>`).join('')}</div></section><section class="config-section"><h2>每月里程</h2><div class="options">${[[1500,'轻度通勤'],[2500,'日常通勤'],[3500,'高频出行']].map(([v,t])=>`<button class="option ${d.mileage===v?'active':''}" data-action="config-option" data-key="mileage" data-value="${v}" aria-pressed="${d.mileage===v}"><b>${number(v)}km</b><small>${t}</small></button>`).join('')}</div><p class="config-note">1,500公里方案减¥200/月，3,500公里方案加¥450/月；超里程按¥1/公里结算。</p></section><section class="config-section"><h2>保障方案</h2>${[['care','安心保障','基础车损、第三者责任保障及道路救援','已包含'],['premium','无忧保障','增加轮胎玻璃保障，降低事故自付额度','+¥399/月']].map(([v,t,desc,p])=>`<button class="choice-row ${d.coverage===v?'active':''}" data-action="config-option" data-key="coverage" data-value="${v}" aria-pressed="${d.coverage===v}"><div><h3>${t}</h3><p>${desc}</p></div><span>${p}</span></button>`).join('')}<button class="text-button" data-action="sheet" data-value="coverage">查看保障说明</button></section><section class="config-section"><h2>交付方式</h2><div class="options two">${[['door','送车上门','到你指定的地点'],['store','门店取车','到服务网点办理']].map(([v,t,desc])=>`<button class="option ${d.delivery===v?'active':''}" data-action="config-option" data-key="delivery" data-value="${v}" aria-pressed="${d.delivery===v}"><b>${t}</b><small>${desc}</small></button>`).join('')}</div></section></main>`;}
  const maskedPhone = phone => /^1\d{10}$/.test(phone||'') ? phone.slice(0,3)+'****'+phone.slice(-4) : '未填写';
  const contactNotice = order => order?.driverPhone ? `顾问将联系手机尾号 ${escape(order.driverPhone.slice(-4))}，确认报价与交付。` : '顾问将与你联系，确认报价与交付。';
  function contactFields() {
    return `<section class="contact-section" aria-labelledby="contact-heading"><h2 class="simple-heading" id="contact-heading">用车人</h2>${[['name','姓名','driverName','请输入用车人姓名','text','name',40],['phone','手机号','driverPhone','请输入11位手机号','tel','tel-national',11]].map(([id,label,key,placeholder,type,autocomplete,max])=>`<div class="contact-field"><label for="driver-${id}">${label}</label><div><input id="driver-${id}" name="${key}" type="${type}" ${type==='tel'?'inputmode="tel"':''} autocomplete="${autocomplete}" maxlength="${max}" required value="${escape(state[key])}" placeholder="${placeholder}" aria-describedby="${id}-error" aria-invalid="${!!state.contactErrors[key]}"><p class="field-error" id="${id}-error" role="alert">${escape(state.contactErrors[key]||'')}</p></div></div>`).join('')}</section>`;
  }
  function focusContact(key='driverName') {
    const field=$(`[name="${key}"]`);if(!field)return;
    field.closest('.contact-field').scrollIntoView({block:'center'});field.focus({preventScroll:true});
  }
  function validateContact() {
    state.driverName=state.driverName.trim();state.driverPhone=state.driverPhone.trim();
    state.contactErrors={};
    if(!state.driverName||state.driverName.length>40)state.contactErrors.driverName='请填写用车人姓名';
    if(!/^1[3-9]\d{9}$/.test(state.driverPhone))state.contactErrors.driverPhone='请输入有效的11位手机号';
    const invalid=Object.keys(state.contactErrors)[0];
    if(!invalid)return true;
    if(state.page!=='detail'){if(state.backStack.at(-1)?.page==='detail')back();else go('detail');}
    for(const [key,id] of [['driverName','name'],['driverPhone','phone']]){
      $(`[name="${key}"]`)?.setAttribute('aria-invalid',String(!!state.contactErrors[key]));
      const error=$(`#${id}-error`);if(error)error.textContent=state.contactErrors[key]||'';
    }
    focusContact(invalid);return false;
  }
  function confirm() {
    const c=state.currentCar,p=chosenPackage();
    return `${header('确认订阅意向',{right:null})}<main class="confirm-main intent-main"><section>${miniCar(c,c.newCar?vehicleChoice().color:c.status,p?.name)}${c.newCar?`<p class="intent-configuration">${escape(configSummary())}</p>`:''}</section>
    <section><h2>交付安排</h2>${pair('交付方式',deliveryName(state.delivery))}<button class="editable-pair" data-action="sheet" data-value="address"><span>交付地点</span><b>${escape(state.address)}${icon('ChevronRight',true)}</b></button>${c.newCar?pair('交付时间','待顾问确认'):`<button class="editable-pair pickup-time" data-action="sheet" data-value="date"><span>开始用车</span><b>${dateLabel(state.start)} ${state.time}${icon('ChevronRight',true)}</b></button>`}</section>
    <section class="contact-summary"><div class="section-heading"><h2>用车人</h2><button data-action="edit-contact">修改${icon('ChevronRight',true)}</button></div>${pair('姓名',escape(state.driverName))}${pair('手机号',maskedPhone(state.driverPhone))}</section>
    <section><h2>订阅方案</h2>${pair('订阅周期',state.term+'个月')}${pair('每月里程',number(state.mileage)+'公里')}${pair('保障服务',coverageName(state.coverage))}${pair('参考月费',money(monthly())+'/月')}${pair('预估总价',money(total()))}${c.newCar?pair('选装费用','待报价'):''}${pair('车辆押金','待信用评估')}<p class="intent-notice">提交意向无需支付，顾问将联系你确认报价与交付。</p></section>
    <div class="agreement"><input id="agreement" type="checkbox" ${state.agreement?'checked':''} aria-label="同意提交订阅意向"><span>已阅读并同意<button data-action="sheet" data-value="intent-rules">《订阅意向说明》</button>及<button data-action="sheet" data-value="privacy">《隐私与授权说明》</button>，同意顾问联系。</span></div></main>`;
  }
  function mine() {const o=state.orders.find(x=>x.status==='active')||state.orders[0],c=o?carOf(o):null;return `${header('我的',{back:false,right:'settings'})}<main class="page-pad stack"><button class="profile-card" data-action="sheet" data-value="identity"><span class="avatar" aria-hidden="true"></span><div class="profile-info"><h2>尾号5185</h2><span class="tag accent">${state.verified?'已认证':'待完善'}</span><p>${state.verified?(state.depositWaived?'信用免押资格已开通':'身份与驾驶资格已核验'):'完善实名与驾驶人信息'}</p></div>${icon('ChevronRight')}</button><section class="card mine-orders"><div class="section-heading"><h2>我的订单</h2><button data-action="orders-filter" data-value="all">全部订单${icon('ChevronRight',true)}</button></div><div class="mine-grid">${[['inquiry','FileText','订阅意向'],['preparing','Truck','待交付'],['active','CarFront','订阅中'],['completed','CircleCheck','已完成']].map(([v,i,t])=>`<button class="mine-entry" data-action="orders-filter" data-value="${v}">${icon(i)}<span>${t}</span></button>`).join('')}</div></section>${o?`<section class="subscription-summary"><div class="mini-car"><img src="${c.image}" alt="${c.name}"><div style="flex:1;min-width:0"><div class="summary-state"><h2>${c.name}</h2><span class="tag accent">${labels[o.status]}</span></div><div class="subscription-facts"><div><small>${o.status==='active'?'下次付款':'预计交付'}</small><strong>${(o.status==='active'?(nextRentBill(o)?dateLabel(nextRentBill(o).date):'已缴清'):o.status==='inquiry'?'待确认':dateLabel(o.start))}</strong></div><div><small>订阅周期</small><strong>${o.term}个月</strong></div></div></div></div><button class="text-button" data-action="order" data-value="${o.id}">查看详情${icon('ChevronRight',true)}</button></section>`:''}<section class="card menu-card">${[['identity','IdCard','身份与驾驶人'],['contracts','FileText','合同中心'],['invoice','ReceiptText','账单与发票'],['deposit','ShieldCheck','信用与押金'],['support','Headset','联系客服']].map(([v,i,t])=>`<button class="menu-row" data-action="sheet" data-value="${v}">${icon(i)}<span>${t}</span>${icon('ChevronRight',true)}</button>`).join('')}</section><p class="mine-footer">DD订阅 · 让用车更轻松</p></main>`;}
  function rentBills(o) {
    return Array.from({length:o.term},(_,i)=>{
      const period=i+1,record=(o.rentPayments||[]).find(p=>p.period===period);
      return {period,date:endDate(o.start,i),amount:o.monthly,paid:!!record||(period===1&&o.paid),record};
    });
  }
  const nextRentBill = o => rentBills(o).find(b=>!b.paid);
  function billingPanel(o) {
    const bill=nextRentBill(o);
    return `<section class="card billing-panel"><div class="section-heading"><h2>月租账单</h2><button data-action="sheet" data-value="bills">全部账单${icon('ChevronRight',true)}</button></div><div class="next-bill"><div><small>${bill?'下一待缴 · 第'+bill.period+'/'+o.term+'期':'合同内月租已全部缴清'}</small><strong>${bill?money(bill.amount):money(0)}</strong><p>${bill?'应付日期 '+fullDateLabel(bill.date):'不影响原订阅期限'}</p></div><button class="primary" data-action="prepay" data-value="${o.id}" ${bill?'':'disabled'}>${bill?'提前交款':'已缴清'}</button></div><button class="debit-setting" data-action="auto-debit" data-value="${o.id}"><span>绑卡自动扣款<small>${o.autoDebit?'已开启 · 示例银行卡 尾号6688':'未开启 · 到期自动支付未缴月租'}</small></span><b>${o.autoDebit?'管理':'去开通'}${icon('ChevronRight',true)}</b></button><p class="demo-disclaimer">提前支付的期次不会重复扣款，不延长合同期限。</p></section>`;
  }
  function progressPanel(o) {
    const stages=[['inquiry','意向已收到'],['preparing','车辆准备中'],['delivering','车辆交付']];
    const index=stages.findIndex(([key])=>key===o.status);
    return `<section class="card order-progress"><div class="section-heading"><h2>订阅进度</h2></div><ol class="progress-track">${stages.map(([key,label],i)=>`<li class="${i<=index?'reached':''} ${i===index?'current':''}" ${i===index?'aria-current="step"':''}><span>${i<index?icon('Check',true):i+1}</span><b>${label}</b></li>`).join('')}</ol></section>`;
  }
  function vehicleService(o,c) {
    const used=o.currentMileage||186,odometer=o.odometer||(c.newCar?186:8686);
    return `<section class="card vehicle-service"><div class="section-heading"><h2>用车服务</h2></div><div class="vehicle-identity"><strong>${carName(c)}</strong><span>沪A·D5185 · ${c.energy} · ${c.seats}</span></div><div class="vehicle-metrics"><div><small>车辆总里程</small><strong>${number(odometer)}<em>km</em></strong></div><div><small>本期已用</small><strong>${number(used)}<em>km</em></strong></div><div><small>本期额度</small><strong>${number(o.mileage)}<em>km</em></strong></div></div><div class="mileage-meter"><div style="width:${Math.min(100,used/o.mileage*100)}%"></div></div><p class="hint">本期剩余 ${number(Math.max(0,o.mileage-used))} 公里</p><div class="service-list">${[['保养预约','预约维保时间'],['事故报备','协助处理事故'],['道路救援','联系救援管家'],['续订 / 换车 / 归还','安排下一程']].map(([t,n])=>`<button data-action="service" data-value="${t}"><span><strong>${t}</strong><small>${n}</small></span>${icon('ChevronRight',true)}</button>`).join('')}</div></section>`;
  }
  function orderCard(o) {
    const c=carOf(o),active=o.status==='active',bill=active?nextRentBill(o):null;
    const detailLabel=active?(bill?'查看详情':'用车服务'):o.status==='completed'?'查看详情':'查看进度';
    return `<article class="order-card"><div class="order-top"><span>${c.newCar?'新车订阅':'现车订阅'} · ${o.id.slice(-8)}</span><span class="order-status">${labels[o.status]}</span></div><button class="order-summary-link" data-action="order" data-value="${o.id}">${miniCar(c,`${o.term}个月 · ${number(o.mileage)}公里/月`,o.packageName)}<div class="order-price">${price(o.monthly,'/月'+(o.status==='inquiry'?' · 预估':''))}</div></button>${active?`<p class="order-bill-hint">${bill?'第'+bill.period+'期 · '+dateLabel(bill.date)+'应付 '+money(bill.amount):'合同内月租已缴清'}</p>`:''}<div class="order-actions"><button class="${active&&bill?'secondary':'primary'}" data-action="order" data-value="${o.id}">${detailLabel}</button>${active&&bill?`<button class="primary" data-action="prepay" data-value="${o.id}">提前交款</button>`:''}</div></article>`;
  }
  function orders() {
    const list=state.orders.filter(o=>state.orderFilter==='all'||o.status===state.orderFilter||(state.orderFilter==='preparing'&&o.status==='delivering'));
    return `${header('我的订单',{back:false})}<main class="page-pad"><nav class="order-tabs" aria-label="订单状态">${[['all','全部'],['inquiry','意向'],['pending','待确认'],['preparing','待交付'],['active','使用中'],['completed','已完成']].map(([v,t])=>`<button class="${state.orderFilter===v?'active':''}" data-action="orders-filter" data-value="${v}">${t}</button>`).join('')}</nav>${list.length?list.map(orderCard).join(''):`<div class="empty">${icon('FileText')}<h2>暂无相关订单</h2><p>选一辆喜欢的车，开始轻松用车。</p><button class="secondary" data-action="enter-catalog" data-value="new">去选车</button></div>`}</main>`;
  }
  function orderDetail() {
    const o=selectedOrder();if(!o)return orders();const c=carOf(o),active=o.status==='active';
    const records=['active','completed'].includes(o.status)?(o.services||[]).filter(n=>n.type!=='管家咨询'):[];
    return `${header('订阅订单')}<main class="page-pad stack"><section class="status-copy"><p class="eyebrow">${c.newCar?'新车订阅':'现车订阅'}</p><h2>${labels[o.status]}</h2>${o.status==='inquiry'?`<p>${contactNotice(o)}</p>`:''}</section>
    ${['inquiry','preparing','delivering'].includes(o.status)?progressPanel(o):''}
    <section class="card">${miniCar(c,`${o.term}个月 · ${money(o.monthly)}/月`,o.packageName)}<div class="divider" style="margin:16px 0 8px"></div>${pair('订单编号',o.id)}${o.packageSummary?pair('选配信息',escape(o.packageSummary)):''}${pair(o.status==='inquiry'?'预估总价':'合同总价',money(o.monthly*o.term))}${pair('车辆押金',o.status==='inquiry'?'待信用评估':money(o.deposit||0)+(o.deposit?'':' · 信用免押'))}</section>
    ${active?billingPanel(o)+vehicleService(o,c):''}
    ${records.length?`<section class="card"><div class="section-heading"><h2>服务记录</h2></div>${records.map(n=>`<div class="service-record"><b>${escape(n.type)} · 已受理</b><p>${escape(n.note)}<br>${escape(n.date)}</p></div>`).join('')}</section>`:''}
    <section class="card"><h2 class="info-heading">交付信息</h2>${pair('用车人',escape(o.driverName||'未填写'))}${pair('手机号',maskedPhone(o.driverPhone))}${pair('交付时间',c.newCar&&!active?'待确认':fullDateLabel(o.start)+' '+(o.time||'10:00'))}${pair('交付方式',deliveryName(o.delivery))}${pair('交付地点',escape(o.address))}${pair('保障方案',coverageName(o.coverage))}${pair('订阅期限',o.term+'个月')}${active?pair('合同到期',fullDateLabel(endDate(o.start,o.term))):''}${o.status!=='inquiry'?'<button class="text-button" data-action="sheet" data-value="contracts">查看订阅合同</button>':''}</section></main>`;
  }
  function addressPicker() {
    const draft=state.addressDraft;
    return `${header('交付地点',{right:null})}<main class="address-page"><p class="address-mode">${deliveryName(state.delivery)}</p><section class="address-card"><button class="address-city-row" data-action="sheet" data-value="city"><span>用车城市</span><strong>${escape(draft.city)}${icon('ChevronRight',true)}</strong></button><label class="address-field" for="delivery-address">${state.delivery==='door'?'送车地点':'取车网点'}</label><textarea id="delivery-address" name="deliveryAddress" rows="3" maxlength="100" placeholder="${state.delivery==='door'?'填写区、街道及详细地址':'填写取车网点名称或地址'}" aria-describedby="address-error" aria-invalid="false">${escape(draft.address)}</textarea><p class="field-error" id="address-error" role="alert"></p></section></main>`;
  }
  const pickingAddressCity = () => state.backStack.at(-1)?.page==='addressPicker' && !!state.addressDraft;
  const pickerCity = () => pickingAddressCity() ? state.addressDraft.city : state.city;
  function cityButton(name) {return `<button class="city-tile ${pickerCity()===name?'selected':''}" data-action="city" data-value="${name}">${name}</button>`;}
  function cityResults() {
    const q=state.cityQuery.trim().toLowerCase();
    if(q){const results=cities.filter(c=>c.name.includes(q)||c.pinyin.includes(q));return `<section class="city-search-results"><h2>搜索结果</h2>${results.length?results.map(c=>`<button class="city-result" data-action="city" data-value="${c.name}"><span>${c.name}</span>${pickerCity()===c.name?icon('Check',true):icon('ChevronRight',true)}</button>`).join(''):'<div class="city-empty"><p>没有找到相关城市</p><span>试试城市中文名或完整拼音</span><button data-action="clear-city-search">清空搜索</button></div>'}</section>`;}
    return `<section class="location-section"><div class="city-section-title"><h2>当前定位城市</h2><button data-action="relocate">${icon('RotateCw',true)}重新定位</button></div><button class="located-city" data-action="city" data-value="${state.locatedCity}">${icon('MapPin')}<strong>${state.locatedCity}</strong></button></section><section class="recent-cities"><h2>最近访问</h2><div class="city-grid">${state.recentCities.map(cityButton).join('')}</div></section><section class="city-index"><h2>字母索引</h2><div class="alphabet-grid">${cityLetters.map(l=>`<button data-action="city-index" data-value="${l}">${l}</button>`).join('')}</div></section><section class="city-groups"><h2>选择城市</h2>${cityLetters.map(l=>`<section class="city-group" id="city-group-${l}"><h3>${l}</h3><div class="city-grid">${cities.filter(c=>c.letter===l).map(c=>cityButton(c.name)).join('')}</div></section>`).join('')}</section>`;
  }
  function cityPicker() {return `<div class="picker-sticky">${statusBar()}<header class="city-search-head"><button class="icon-button" data-action="back" aria-label="返回">${icon('ChevronLeft')}</button><label class="city-search-field">${icon('Search')}<input type="search" id="city-search" value="${escape(state.cityQuery)}" placeholder="输入城市名称或拼音" aria-label="搜索城市" autocomplete="off"></label></header></div><main class="city-content" id="city-content">${cityResults()}</main>`;}
  function calendarMonth(offset) {
    const first=new Date(2026,9+offset,1,12),year=first.getFullYear(),month=first.getMonth(),days=new Date(year,month+1,0).getDate();
    return `<section class="calendar-month"><h2>${year}年${month+1}月</h2><div class="calendar-grid">${'<span class="calendar-blank" aria-hidden="true"></span>'.repeat(first.getDay())}${Array.from({length:days},(_,i)=>{const value=isoDate(new Date(year,month,i+1,12));const selected=value===state.dateDraft.date;return `<button class="calendar-day${selected?' selected':''}" data-action="calendar-date" data-value="${value}" ${value<earliestDelivery?'disabled':''} aria-label="${year}年${month+1}月${i+1}日" aria-pressed="${selected}"><span>${value===demoToday?'今天':i+1}</span><small>${selected?'开始用车':''}</small></button>`;}).join('')}</div></section>`;
  }
  function datePicker() {return `<div class="picker-sticky">${header('选择开始用车日期',{right:null})}<div class="calendar-week">${['日','一','二','三','四','五','六'].map(d=>`<span>${d}</span>`).join('')}</div></div><main class="calendar-content"><p class="calendar-hint">按月订阅，到期日根据订阅周期自动计算</p>${Array.from({length:state.calendarMonths},(_,i)=>calendarMonth(i)).join('')}${state.calendarMonths<12?'<button class="calendar-more" data-action="more-months">查看更多月份 '+icon('ChevronDown',true)+'</button>':''}</main>`;}
  function timeWheel(key,values) {return `<div class="time-wheel" data-time-wheel="${key}" role="listbox" tabindex="0" aria-label="${key==='hour'?'交付小时':'交付分钟'}">${values.map(v=>`<button class="time-option ${state.dateDraft[key]===v?'active':''}" data-action="time-option" data-key="${key}" data-value="${v}" role="option" aria-selected="${state.dateDraft[key]===v}">${String(v).padStart(2,'0')}</button>`).join('')}</div>`;}
  function dateSummary() {const d=state.dateDraft;return `<strong>${dateLabel(d.date)} ${draftTime()}</strong><span>到期 ${fullDateLabel(endDate(d.date,state.term))}</span>`;}
  function calendarFooter() {return `<section class="calendar-footer"><div class="time-title"><h2>交付时间</h2><span>服务时段 09:00–18:45</span></div><div class="time-picker"><div class="time-highlight" aria-hidden="true"></div>${timeWheel('hour',Array.from({length:10},(_,i)=>i+9))}<span class="time-colon">:</span>${timeWheel('minute',[0,15,30,45])}</div><div class="calendar-confirm"><div id="date-summary">${dateSummary()}</div><button class="primary" data-action="confirm-date">确认 · ${state.term}个月</button></div></section>`;}
  function refreshTimeSelection() {if(state.page!=='datePicker')return;fixed.querySelectorAll('.time-option').forEach(b=>{const selected=state.dateDraft[b.dataset.key]===Number(b.dataset.value);b.classList.toggle('active',selected);b.setAttribute('aria-selected',selected);});$('#date-summary').innerHTML=dateSummary();}
  function syncTimeWheels() {
    fixed.querySelectorAll('[data-time-wheel]').forEach(wheel=>{
      const values=[...wheel.querySelectorAll('button')].map(b=>Number(b.dataset.value));
      wheel.scrollTop=values.indexOf(state.dateDraft[wheel.dataset.timeWheel])*32;
      let timer;
      wheel.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(()=>{if(!wheel.isConnected||state.page!=='datePicker')return;const index=Math.max(0,Math.min(values.length-1,Math.round(wheel.scrollTop/32)));state.dateDraft[wheel.dataset.timeWheel]=values[index];refreshTimeSelection();},100);},{passive:true});
      wheel.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const current=values.indexOf(state.dateDraft[wheel.dataset.timeWheel]);const next=Math.max(0,Math.min(values.length-1,current+(e.key==='ArrowDown'?1:-1)));state.dateDraft[wheel.dataset.timeWheel]=values[next];wheel.scrollTo({top:next*32,behavior:'smooth'});refreshTimeSelection();});
    });
  }
  function render({reset=false}={}) {const scroll=app.scrollTop;const pages={home,catalog,detail,config,confirm,mine,orders,orderDetail,searchResults,cityPicker,addressPicker,datePicker,vehicleInfo,equipment};app.classList.toggle('white',['detail','confirm','cityPicker','datePicker','vehicleInfo','equipment'].includes(state.page));app.classList.toggle('results-page',state.page==='searchResults');app.classList.toggle('city-page',state.page==='cityPicker');app.classList.toggle('calendar-page',state.page==='datePicker');app.innerHTML=(pages[state.page]||home)();app.scrollTop=reset?0:scroll;renderFixed();}
  function renderFixed() {
    if(['home','catalog','orders','mine'].includes(state.page))fixed.innerHTML=nav();
    else if(state.page==='detail')fixed.innerHTML=purchaseBar('提交意向','confirm');
    else if(state.page==='vehicleInfo')fixed.innerHTML=`<div class="purchase-bar showroom-bar"><div><strong>${carName(state.currentCar)}</strong><small>${state.currentCar.newCar?'新车订阅':'现车订阅'}</small></div><button class="primary" data-action="start-subscription">${state.currentCar.newCar?'选配订阅':'订阅方案'}</button></div>`;
    else if(state.page==='equipment')fixed.innerHTML=`<div class="purchase-bar only-button"><button class="primary" data-action="back">完成选配${vehicleChoice().options.length?' · 已选'+vehicleChoice().options.length+'项':''}</button></div>`;
    else if(state.page==='addressPicker')fixed.innerHTML=`<div class="purchase-bar only-button"><button class="primary" data-action="save-address">保存交付地点</button></div>`;
    else if(state.page==='config')fixed.innerHTML=purchaseBar('保存方案','save-config',{amount:total(state.configDraft),term:state.configDraft.term});
    else if(state.page==='confirm')fixed.innerHTML=purchaseBar('提交意向','submit',{disabled:!state.agreement,amount:total()});
    else if(state.page==='orderDetail'){const o=selectedOrder();fixed.innerHTML=`<div class="purchase-bar only-button"><button class="primary" data-action="sheet" data-value="support">联系订阅管家</button></div>`;}
    else if(state.page==='datePicker'){fixed.innerHTML=calendarFooter();syncTimeWheels();}else fixed.innerHTML='';
  }
  function go(page,{back=false}={}) {if(state.page!==page&&!back)state.backStack.push({page:state.page,scroll:app.scrollTop});hideToast();closeSheet();state.page=page;render({reset:true});}
  function back() {if(state.page==='config')state.configDraft=null;if(state.page==='addressPicker')state.addressDraft=null;const previous=state.backStack.pop();go(previous?.page||'home',{back:true});if(previous)app.scrollTop=previous.scroll;}
  function hideToast() {clearTimeout(toastTimer);$('#toast').classList.remove('show');}
  function toast(message) {clearTimeout(toastTimer);const node=$('#toast');node.textContent=message;node.classList.add('show');toastTimer=setTimeout(()=>node.classList.remove('show'),2300);}
  function sheetFrame(title,body) {return `<div class="sheet-mask" data-dismiss><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" tabindex="-1"><div class="sheet-handle"></div><div class="sheet-head"><h2 id="sheet-title">${title}</h2><button class="icon-button" data-action="close-sheet" aria-label="关闭">${icon('X')}</button></div>${body}</section></div>`;}
  function chooseRows(items,action,current) {return items.map(([v,t,n])=>`<button class="sheet-choice ${String(current)===String(v)?'active':''}" data-action="${action}" data-value="${v}"><span>${t}</span>${String(current)===String(v)?icon('Check'): `<span>${n||''}</span>`}</button>`).join('');}
  function businessSheet(type,o) {
    if(type==='intent-rules')return sheetFrame('订阅意向说明',`<section class="sheet-section"><h3>提交意向，不产生支付</h3><p>所选车款、周期及地点用于顾问了解你的需求。本次提交不视为签署租赁合同，也不会扣款。</p></section><section class="sheet-section"><h3>先确认报价，再安排车辆</h3><p>顾问将联系你确认车款、配置、订阅费用、押金及交付时间。</p></section><button class="primary" data-action="close-sheet">了解了</button>`);
    if(type==='auth')return sheetFrame('实名与信用评估',`<p class="sheet-text">确认身份与驾驶资格，并通过芝麻信用等服务评估押金方案。</p><div class="auth-status">实名及驾驶资格<span>模拟核验</span></div><div class="auth-status">信用免押评估<span>选择演示结果</span></div><p class="sheet-note">不连接实际信用服务，不采集个人证件。以下按钮仅切换本地模拟结果。</p><button class="primary" data-action="finish-auth" data-value="waived">模拟通过 · 车辆免押</button><button class="secondary full-width spaced" data-action="finish-auth" data-value="deposit">按¥3,000押金方案继续</button>`);
    if(type==='deposit')return sheetFrame('信用与押金',`<section class="sheet-section"><h3>${vehicleDeposit()===0?'当前账号可享信用免押':'可申请信用免押'}</h3><p>支持芝麻信用等服务评估。车辆押金示例为¥3,000，信用评估通过后可减免，实际以订单审核为准。</p></section>${pair('当前演示押金',money(vehicleDeposit()))}${pair('押金用途','车辆履约保障')}${pair('归还与退款','验车及费用结清后按合同退还')}<p class="sheet-note">免押不代表免除违章、车损等责任。已有订单押金不受后续账号评估变化影响。</p><button class="primary" data-action="auth">体验信用评估</button>`);
    if(type==='payment')return sheetFrame('确认首期支付',`<p class="eyebrow">${carName(carOf(o))} · ${o.term}个月订阅</p><div class="amount-due">${money(firstPayment(o))}</div><div class="fee-panel">${pair('首期月费',money(o.monthly))}${pair('车辆押金',money(o.deposit||0)+(o.deposit?'':' · 信用免押'))}${pair('本次应付',money(firstPayment(o)),true)}</div><p class="sheet-note">模拟支付，不会真实扣款。押金不计入租金，归还后按合同结算退还。</p><div class="sheet-actions"><button class="secondary" data-action="pay-later">暂不支付</button><button class="primary" data-action="pay">确认支付</button></div>`);
    if(type==='prepay'){
      const bill=o&&nextRentBill(o);
      if(!o||o.status!=='active'||!bill)return sheetFrame('月租已缴清','<p class="sheet-text">当前没有可提前支付的月租。</p>');
      return sheetFrame('提前交款',`<p class="eyebrow">${carName(carOf(o))} · 第${bill.period}/${o.term}期月租</p><div class="amount-due">${money(bill.amount)}</div><div class="fee-panel">${pair('应付日期',fullDateLabel(bill.date))}${pair('支付用途','提前支付下一待缴月租')}${pair('合同到期',fullDateLabel(endDate(o.start,o.term)))}</div><p class="sheet-text">支付后本期标记为已缴清；已缴期次不会再次自动扣款。订阅期限不变。</p><p class="sheet-note">仅演示账单支付，不发起实际扣款。</p><div class="sheet-actions"><button class="secondary" data-action="close-sheet">暂不支付</button><button class="primary" data-action="pay-next">确认支付</button></div>`);
    }
    if(type==='prepay-success')return sheetFrame('交款成功',`<div class="success-mark">${icon('Check')}</div><h3 class="success-title">这一期，已提前安排</h3><p class="success-copy">第${state.lastPayment?.period}期月租 ${money(state.lastPayment?.amount||0)} 已支付，账单已更新。本期不会重复自动扣款。</p><button class="primary" data-action="sheet" data-value="bills">查看月租账单</button><p class="sheet-note">本地演示记录，未发生真实交易。</p>`);
    if(type==='bills')return sheetFrame('月租账单',`<p class="sheet-text">${carName(carOf(o))} · 共${o.term}期<br>合同期内租金 ${money(o.monthly*o.term)}</p><div class="bill-list">${rentBills(o).map(b=>`<div class="bill-row"><div><strong>第${b.period}期 <small>${b.date}</small></strong><span>${b.paid?(b.record?'主动提前支付 · '+b.record.paidAt:'首期已支付'):'待缴月租'}</span></div><div><b>${money(b.amount)}</b><span class="${b.paid?'paid':''}">${b.paid?'已缴清':'待支付'}</span></div></div>`).join('')}</div><p class="sheet-note">押金独立于月租账单，不计入合同租金。</p>${o.status==='active'&&nextRentBill(o)?`<button class="primary" data-action="prepay" data-value="${o.id}">提前支付下一期</button>`:''}`);
    if(type==='auto-debit')return sheetFrame('月租自动扣款',`<div class="demo-bank-card"><span>演示银行卡</span><strong>•••• •••• •••• 6688</strong><small>${o.autoDebit?'自动扣款已开启':'仅用于演示，不关联真实账户'}</small></div><section class="sheet-section"><h3>按账期支付，不重复扣款</h3><p>每期应付日仅对未缴月租发起扣款；提前交款后跳过对应期次。扣款失败时可通过订单主动补缴。</p></section><p class="sheet-note">本地Demo不保存真实银行卡号、不连接支付服务，也不会执行实际定时扣款。</p>${o.autoDebit?'<button class="secondary full-width" data-action="disable-debit">关闭自动扣款</button>':`<label class="debit-consent"><input id="debit-consent" type="checkbox" ${state.debitConsent?'checked':''}>我已了解自动扣款规则，同意使用示例卡开通演示。</label><button class="primary" data-action="enable-debit" ${state.debitConsent?'':'disabled'}>确认开通（演示）</button>`}`);
    if(type==='advance-order'){
      const desc={inquiry:['车辆准备中','模拟商务已确认配置、正式报价与排产计划，不进行在线支付。'],preparing:['车辆交付','模拟车辆已完成准备，进入交付与验收安排。'],delivering:['使用中','模拟已完成验收、合同签署及线下首期结算，开启用车服务。']};
      const target=desc[o?.status];if(!target)return null;
      return sheetFrame('演示订单进度',`<p class="sheet-text">下一阶段：${target[0]}<br>${target[1]}</p><p class="sheet-note">此按钮仅供评审演示。正式产品中由商务及履约系统更新状态，不允许用户自行更改。</p><div class="sheet-actions"><button class="secondary" data-action="close-sheet">取消</button><button class="primary" data-action="advance-order">确认演示</button></div>`);
    }
    return null;
  }
  function sheetContent(type) {
    const o=selectedOrder();
    const business=businessSheet(type,o);if(business)return business;
    if(type==='term'){const terms=['home','catalog','searchResults'].includes(state.page)?(state.catalog==='new'?[12,24]:[3,6,12]):Object.keys(state.currentCar.terms).map(Number);return sheetFrame('预计用车多久',chooseRows(terms.map(t=>[t,t+'个月',t===6?'日常用车推荐':'期满可续订']),'home-term',state.term));}
    if(type==='rules'||type==='agreement')return sheetFrame(type==='agreement'?'汽车订阅服务协议':'订阅与费用规则',`<section class="sheet-section"><h3>订阅期限与支付</h3><p>新车与现车均先提交订阅意向，由顾问确认配置、报价、押金与交付安排，提交时无需付款。合同生效后按约定支付月租，可提前支付下一待缴期次；自动扣款仅针对未缴期次。</p></section><section class="sheet-section"><h3>月费包含什么</h3><p>车辆使用、基础保障、常规保养、道路救援及服务区域内城市取送。能源、停车、违章及保障外损伤费用由使用人承担。</p></section><section class="sheet-section"><h3>里程与提前退出</h3><p>超出月度里程额度按¥1/公里结算。提前退出需联系管家测算剩余费用，不承诺无条件免费退出。</p></section><section class="sheet-section"><h3>到期续订、换车或归还</h3><p>请提前30天提交需求。换车需确认新车源和报价，归还时核验里程、车况及未结费用。</p></section><p class="sheet-note">本页面用于交互演示，正式服务以签署的合同与运营规则为准。</p>`);
    if(type==='coverage')return sheetFrame('保障与服务说明',`<section class="sheet-section"><h3>安心保障 · 月费已含</h3><p>含基础车损、第三者责任保障和道路救援；常规保养由订阅管家协助安排。赔付范围、免赔额与责任认定以合同为准。</p></section><section class="sheet-section"><h3>无忧保障 · ¥399/月</h3><p>在基础方案上增加轮胎玻璃保障，降低部分事故的自付额度。具体责任和除外事项将在签约前展示。</p></section><section class="sheet-section"><h3>城市取送</h3><p>交付与归还支持服务范围内城市取送，需提前预约并确认地点。</p></section><button class="primary" data-action="close-sheet">了解了</button>`);
    if(type==='privacy')return sheetFrame('隐私与授权说明',`<p class="sheet-text">用车人姓名、手机号及交付地点用于确认订阅需求与联系交付。身份、驾驶资格及信用评估仅在你主动同意后进入授权流程。</p><p class="sheet-note">当前为本地交互演示，提交的联系信息随订单保存在本浏览器，不上传、不发起真实联系。可在“我的 → 设置 → 重置演示数据”清除。无需填写真实身份证、驾驶证或支付信息。</p><button class="primary" data-action="close-sheet">了解了</button>`);
    if(type==='identity')return sheetFrame('身份与驾驶人',`<p class="sheet-text">尾号5185 · 本人用车</p><div class="auth-status">实名认证<span>${state.verified?'已通过':'待认证'}</span></div><div class="auth-status">驾驶资格<span>${state.verified?'C1 · 已核验':'待核验'}</span></div><div class="auth-status">信用授权<span>${state.verified?'已开通':'待授权'}</span></div><p class="sheet-note">演示仅切换认证状态，无需上传个人证件。</p><button class="primary" data-action="auth">${state.verified?'重新体验认证流程':'开始认证'}</button>`);
    if(type==='success')return sheetFrame('订阅已确认',`<div class="success-mark">${icon('Check')}</div><h3 class="success-title">你的用车计划，已就绪</h3><p class="success-copy">首期月费已支付。车辆进入整备流程，订阅管家将与你确认具体交付安排。</p><div class="fee-panel">${pair('订阅车型',carOf(o).name)}${pair('预计交付',dateLabel(o.start)+' '+o.time)}${pair('交付方式',deliveryName(o.delivery))}</div><button class="primary" data-action="view-order">查看交付进度</button>`);
    if(type==='inquiry-success')return sheetFrame('意向已提交',`<div class="success-mark">${icon('Check')}</div><h3 class="success-title">意向已收到</h3><p class="success-copy">${contactNotice(o)}</p><button class="primary" data-action="view-order">查看订阅意向</button>`);
    if(type==='support')return sheetFrame('你的订阅管家',`<p class="eyebrow">用车问题，随时找我们</p><h3 class="support-number">DD · 专属管家</h3><p class="sheet-text">车辆交付、保障、续订与归还，管家全程协助。</p><form data-form="support"><label class="field">想咨询的问题<textarea name="note" required maxlength="200" placeholder="例如：我想了解这款车的交付时间"></textarea></label><button class="primary" type="submit">提交咨询</button></form><p class="sheet-note">以当前账号联系方式回访；演示咨询仅保存于本地。</p>`);
    if(type==='service')return sheetFrame(state.serviceType,`<form data-form="service">${state.serviceType==='续订 / 换车 / 归还'?'<label class="field">服务需求<select name="kind"><option>续订</option><option>换车</option><option>归还</option></select></label>':''}<label class="field">${state.serviceType==='道路救援'?'车辆当前位置':'补充说明'}<textarea name="note" required maxlength="200" placeholder="${state.serviceType==='道路救援'?'请输入车辆位置与遇到的问题':'告诉管家你的需求或方便联系的时间'}"></textarea></label><label class="field">期望联系时间<select name="contact"><option>尽快联系</option><option>今天下午</option><option>明天上午</option></select></label><button class="primary" type="submit">提交服务申请</button></form>`);
    if(type==='contracts'){if(!o)return sheetFrame('合同中心','<p class="sheet-text">暂无订阅合同，完成订单后可在此查看。</p>');return sheetFrame('合同中心',`<section class="sheet-section"><h3>汽车订阅服务协议</h3><p>订单 ${o.id}<br>${carOf(o).name} · ${o.term}个月<br>${o.status==='inquiry'?'交付待商务确认':dateLabel(o.start)+'起'} · ${money(o.monthly)}/月</p></section>${pair('合同状态',o.status==='inquiry'?'待报价确认':o.paid?'已签署（演示）':'待签署')}${pair('合同总价',money(o.monthly*o.term))}${pair('保障方案',coverageName(o.coverage))}<p class="sheet-note">这里展示演示合同摘要。正式合同包含保障责任、退出、车况验收及费用结算条款。</p><button class="primary" data-action="sheet" data-value="agreement">阅读协议内容</button>`);}
    if(type==='invoice')return sheetFrame('账单与发票',`<div class="fee-panel"><h2>已支付账单</h2>${state.orders.filter(x=>x.paid).flatMap(x=>rentBills(x).filter(b=>b.paid).map(b=>pair(carOf(x).name+' · 第'+b.period+'期',money(b.amount)))).join('')||'<p>暂无已支付账单</p>'}</div>${state.invoice?`<p class="sheet-text">发票申请已受理<br>抬头：${escape(state.invoice.title)}<br>邮箱：${escape(state.invoice.email)}</p>`:`<form data-form="invoice"><label class="field">发票抬头<input name="title" required placeholder="个人或公司全称" maxlength="80"></label><label class="field">接收邮箱<input name="email" type="email" required placeholder="用于接收电子发票" maxlength="100"></label><button class="primary" type="submit" ${!state.orders.some(x=>x.paid)?'disabled':''}>申请电子发票</button></form>`}<p class="sheet-note">当前为本地演示，不实际发送或开具发票。</p>`);
    if(type==='share')return sheetFrame('分享订阅方案',`${miniCar(state.currentCar,`${state.term}个月 · ${money(monthly())}/月`)}<div class="divider" style="margin:20px 0"></div><p class="sheet-text">${state.city} · ${number(state.mileage)}公里/月<br>保险、保养、道路救援与城市取送已包含。</p><button class="primary" data-action="copy-plan">复制方案摘要</button>`);
    if(type==='progress-demo')return sheetFrame('订单进度演示',state.orders.filter(x=>['inquiry','preparing','delivering'].includes(x.status)).map(x=>`<button class="sheet-choice" data-action="demo-order" data-value="${x.id}"><span>${carName(carOf(x))}<small> · ${labels[x.status]}</small></span>${icon('ChevronRight',true)}</button>`).join('')||'<p class="sheet-text">暂无可推进的意向订单。</p>');
    if(type==='settings')return sheetFrame('演示设置',`<button class="sheet-choice" data-action="sheet" data-value="progress-demo"><span>切换订单进度</span>${icon('ChevronRight',true)}</button><button class="sheet-choice" data-action="reset-auth"><span>重置认证状态</span>${icon('ChevronRight',true)}</button><button class="sheet-choice" data-action="sheet" data-value="reset"><span>重置演示数据</span>${icon('ChevronRight',true)}</button><p class="sheet-note">DD订阅 · 业务评审第二版<br>部分车型图片为示意图；厂家配置资料已核对，车源、月费、支付及履约为本地模拟。</p>`);
    if(type==='reset')return sheetFrame('重置演示数据',`<p class="sheet-text">将清除本地新增订单、服务记录与发票申请，并恢复一笔示例订阅。原有演示备份文件仍然保留。</p><div class="sheet-actions"><button class="secondary" data-action="close-sheet">取消</button><button class="primary" data-action="reset">确认重置</button></div>`);
    return sheetFrame('服务说明','<p class="sheet-text">请联系订阅管家了解详细信息。</p>');
  }
  function openSheet(type) {
    hideToast();
    if(type==='address'){state.addressDraft={city:state.city,address:state.address};go('addressPicker');return;}
    if(type==='city'){state.cityQuery='';go('cityPicker');return;}
    if(type==='date'){
      const [hour,minute]=state.time.split(':').map(Number);
      state.dateDraft={date:state.start,hour,minute};
      go('datePicker');
      if(state.start.slice(0,7)!=='2026-10')requestAnimationFrame(()=>app.querySelector('.calendar-day.selected')?.scrollIntoView({block:'center'}));
      return;
    }
    showSheet(type,sheetContent(type));
  }
  function closeSheet() {const wasOpen=!!state.sheet;state.sheet=null;overlays.innerHTML='';app.inert=false;fixed.inert=false;app.classList.remove('scroll-locked');if(wasOpen){app.scrollTop=sheetScrollTop;if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});app.scrollTop=sheetScrollTop;}}
  function createOrder(status) {
    const p=chosenPackage();
    const plan={carId:state.currentCar.id,monthly:monthly(),term:state.term,mileage:state.mileage,coverage:state.coverage,delivery:state.delivery,city:state.city,address:state.address,driverName:state.driverName,driverPhone:state.driverPhone,start:state.currentCar.newCar?'2026-11-20':state.start,time:state.time,packageId:p?.id||'',packageName:p?.name||'',packageSummary:p?configSummary():'',deposit:null};
    const existing=state.orders.find(o=>o.id===state.checkoutOrderId&&o.status===status&&!o.paid&&Object.entries(plan).every(([k,v])=>o[k]===v));
    if(existing){state.selectedOrder=existing.id;return existing;}
    const id='DD'+Date.now().toString().slice(-12);const o={id,...plan,status,paid:false,services:[],rentPayments:[]};state.orders.unshift(o);state.selectedOrder=id;state.checkoutOrderId=id;save();return o;
  }
  function afterAuth(waived) {state.verified=true;state.depositWaived=waived;
    if(state.sheetOrigin==='checkout'){const o=selectedOrder();if(o&&o.status==='pending')o.deposit=vehicleDeposit();state.sheetOrigin=null;save();render();openSheet('payment');}
    else{save();closeSheet();render();toast(waived?'演示评估通过，车辆押金已减免':'已选择¥3,000车辆押金方案');}
  }
  const actions = {
    back, 'close-sheet':closeSheet,
    nav: v=>{if(v==='orders')state.orderFilter='all';if(v==='catalog'){state.search='';state.brand='all';state.sort='default';state.catalog=state.browseCatalog;}state.backStack=[];go(v);},
    'enter-catalog': v=>{state.catalog=state.browseCatalog=v;state.term=v==='new'?24:6;state.brand='all';state.search='';state.sort='default';go('catalog');},
    brand: v=>{state.brand=v;render();},
    package: v=>{if(!(vehiclePackages[state.currentCar.id]||[]).some(p=>p.id===v))return;state.packageId=v;normalizeVehicle();vehicleChoice().packageId=v;render();},
    paint: v=>{if(!dataOf()?.colors.some(([name])=>name===v)||(dataOf().colorTrims?.[v]&&!dataOf().colorTrims[v].includes(state.packageId)))return;vehicleChoice().color=v;render();},
    'equipment-choice': v=>{if(!['interiors','wheels'].includes(v))return;showSheet('configuration',configurationSheet(v));},
    'choose-equipment': (v,t)=>{const key=t.dataset.key,item=dataOf()?.[key]?.find(x=>x.id===v);if(!item||fitStatus(item)==='unavailable')return;vehicleChoice()[key]=v;closeSheet();render();},
    equipment: ()=>go('equipment'),
    'toggle-equipment': v=>{const item=dataOf()?.options.find(x=>x.id===v);if(!item||fitStatus(item)!=='optional')return;const chosen=vehicleChoice();chosen.options=chosen.options.includes(v)?chosen.options.filter(id=>id!==v):[...chosen.options,v];render();},
    vehicle: v=>{const c=cars.find(c=>c.id===v);if(!c)return;if(state.currentCar.id!==v&&!selectCar(v,homeTerm(c)))return;normalizeTerm();state.galleryIndex=0;go('vehicleInfo');},
    gallery: v=>{state.galleryIndex=Number(v);render();},
    'gallery-step': v=>{const count=galleryOf().length;state.galleryIndex=(state.galleryIndex+Number(v)+count)%count;render();},
    'start-subscription': ()=>{normalizeTerm();normalizeVehicle();if(state.backStack.at(-1)?.page==='detail')back();else go('detail');},
    'demo-order': v=>{state.selectedOrder=v;openSheet('advance-order');},

    'stock-condition': v=>{state.catalog='stock';if(![3,6,12].includes(state.term))state.term=6;openSheet(v);},
    'find-cars': ()=>{state.browseCatalog='stock';state.catalog='stock';go('catalog');},
    'query-edit': v=>{Object.assign(state,state.catalogQuery);openSheet(v);},
    'home-car-term': (v,t)=>{const c=cars.find(c=>c.id===t.dataset.car);if(!c?.terms[v])return;state.homeTerms[c.id]=Number(v);t.closest('.home-vehicle-row').outerHTML=homeVehicle(c);},
    'home-car': v=>{const c=cars.find(c=>c.id===v);if(c&&selectCar(v,homeTerm(c)))go('detail');},
    sheet: v=>openSheet(v),
    mode: v=>{state.brand='all';state.search='';state.catalog=state.browseCatalog=v;state.term=v==='new'?24:6;render();},
    city: v=>{if(!cityDistrict[v])return;state.recentCities=[v,...state.recentCities.filter(c=>c!==v)].slice(0,4);if(pickingAddressCity()){if(state.addressDraft.city!==v)state.addressDraft={city:v,address:''};}else{if(state.city!==v){state.city=v;state.address=v+'市'+cityDistrict[v];}syncQuerySelection();}back();},
    'save-address': ()=>{const draft=state.addressDraft;if(!draft)return;const address=draft.address.trim();if(address.length<2||address.length>100){$('#address-error').textContent='请填写交付地点';$('#delivery-address').setAttribute('aria-invalid','true');$('#delivery-address').focus({preventScroll:true});return;}state.city=draft.city;state.address=address.startsWith(draft.city)?address:draft.city+'市'+address;syncQuerySelection();back();toast('交付地点已保存');},
    'city-index': v=>$('#city-group-'+v)?.scrollIntoView({behavior:'smooth',block:'start'}),
    relocate: ()=>{state.locatedCity='上海';$('#city-content').innerHTML=cityResults();toast('演示定位已更新为上海，未获取真实位置');},
    'clear-city-search': ()=>{state.cityQuery='';$('#city-search').value='';$('#city-content').innerHTML=cityResults();$('#city-search').focus();},
    'calendar-date': v=>{if(v<earliestDelivery)return;state.dateDraft.date=v;app.querySelectorAll('.calendar-day').forEach(b=>{const selected=b.dataset.value===v;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',selected);b.querySelector('small').textContent=selected?'开始用车':'';});refreshTimeSelection();},
    'more-months': ()=>{state.calendarMonths=Math.min(12,state.calendarMonths+3);render();},
    'time-option': (v,t)=>{state.dateDraft[t.dataset.key]=Number(v);const wheel=t.closest('[data-time-wheel]');wheel.scrollTo({top:[...wheel.children].indexOf(t)*32,behavior:'smooth'});refreshTimeSelection();},
    'confirm-date': ()=>{state.start=state.dateDraft.date;state.time=draftTime();syncQuerySelection();back();toast('用车时间已更新');},
    'home-term': v=>{state.term=Number(v);state.homeTerms={};syncQuerySelection();closeSheet();render();},
    sort: ()=>{state.sort=state.sort==='price'?'default':'price';render();},
    'clear-search': ()=>{state.search='';state.brand='all';render();},
    car: v=>{if(selectCar(v))go('detail');},
    config: ()=>{state.configDraft={term:state.term,mileage:state.mileage,coverage:state.coverage,delivery:state.delivery,packageId:state.packageId};go('config');},
    'config-option': (v,t)=>{const k=t.dataset.key;state.configDraft[k]=['term','mileage'].includes(k)?Number(v):v;render();},
    'save-config': ()=>{Object.assign(state,state.configDraft);state.configDraft=null;back();toast('订阅方案已更新');},
    'edit-contact': ()=>{if(state.backStack.at(-1)?.page==='detail')back();else go('detail');focusContact();},
    confirm: ()=>{if(validateContact())go('confirm');},
    submit: ()=>{if(!state.agreement||state.busy||!validateContact())return;createOrder('inquiry');openSheet('inquiry-success');},
    auth: ()=>{state.sheetOrigin=null;openSheet('auth');},
    'finish-auth': (v,t)=>{if(state.busy)return;state.busy=true;t.disabled=true;t.textContent='评估中…';setTimeout(()=>{state.busy=false;afterAuth(v==='waived');},350);},
    pay: ()=>{const o=selectedOrder();if(state.busy||!o||o.status!=='pending'||o.paid||carOf(o).newCar)return;state.busy=true;const b=$('[data-action="pay"]');b.disabled=true;b.textContent='支付中…';setTimeout(()=>{o.status='preparing';o.paid=true;state.busy=false;save();render();openSheet('success');},350);},
    'pay-later': ()=>{state.orderFilter='pending';go('orders');toast('订单已保存，可在待支付中继续');},
    'resume-payment': ()=>{if(state.verified)openSheet('payment');else{state.sheetOrigin='checkout';openSheet('auth');}},
    'view-order': ()=>go('orderDetail'),
    'orders-filter': v=>{state.orderFilter=v;if(state.page==='orders')render({reset:true});else go('orders');},
    order: v=>{state.selectedOrder=v;go('orderDetail');},
    activate: ()=>{const o=selectedOrder();if(!o||o.status!=='preparing'||!o.paid)return;o.status='active';o.nextBill=nextRentBill(o)?.date||null;save();render();toast('演示交付已完成，用车服务已开启');},
    'advance-order': ()=>{const o=selectedOrder(),next={inquiry:'preparing',preparing:'delivering',delivering:'active'}[o?.status];if(!next)return;o.status=next;
      if(next==='preparing'){o.quoteConfirmed=true;o.deposit=vehicleDeposit();}
      if(next==='active'){o.paid=true;o.settlement='线下首期结算（演示）';o.nextBill=nextRentBill(o)?.date||null;}
      save();closeSheet();render();toast('演示进度已更新：'+labels[next]);},
    prepay: v=>{if(v)state.selectedOrder=v;const o=selectedOrder(),bill=o&&nextRentBill(o);if(!o||o.status!=='active'||!bill){toast('当前没有待缴月租');return;}state.pendingBill={orderId:o.id,period:bill.period};openSheet('prepay');},
    'pay-next': ()=>{const target=state.pendingBill;if(state.busy||!target)return;const o=state.orders.find(x=>x.id===target.orderId),bill=o&&rentBills(o).find(b=>b.period===target.period);if(!o||o.status!=='active'||!bill||bill.paid){toast('该账单已缴清，请勿重复支付');return;}state.busy=true;const b=$('[data-action="pay-next"]');b.disabled=true;b.textContent='支付中…';
      setTimeout(()=>{if(!rentBills(o).find(n=>n.period===target.period).paid){const record={period:bill.period,amount:bill.amount,paidAt:isoDate(new Date()),method:'主动提前支付'};o.rentPayments||=[];o.rentPayments.push(record);state.lastPayment=record;o.nextBill=nextRentBill(o)?.date||null;save();}state.busy=false;state.pendingBill=null;render();openSheet('prepay-success');},350);},
    'auto-debit': v=>{if(v)state.selectedOrder=v;const o=selectedOrder();if(!o||o.status!=='active')return;state.debitConsent=false;openSheet('auto-debit');},
    'enable-debit': ()=>{const o=selectedOrder();if(!state.debitConsent||!o||o.status!=='active')return;o.autoDebit=true;save();render();openSheet('auto-debit');toast('示例银行卡已绑定，自动扣款演示已开启');},
    'disable-debit': ()=>{const o=selectedOrder();if(!o)return;o.autoDebit=false;state.debitConsent=false;save();render();openSheet('auto-debit');toast('自动扣款已关闭，后续请主动缴纳月租');},
    service: v=>{if(selectedOrder()?.status!=='active')return;state.serviceType=v;openSheet('service');},
    'reset-auth': ()=>{state.verified=false;state.depositWaived=false;save();closeSheet();render();toast('认证状态已重置');},
    reset: ()=>{state.verified=true;state.depositWaived=true;state.orders=[seedOrder()];state.selectedOrder=null;state.invoice=null;state.agreement=false;state.driverName='';state.driverPhone='';state.contactErrors={};state.addressDraft=null;state.city='上海';state.address='上海市浦东新区';state.backStack=[];save();go('home');toast('已恢复初始演示状态');},
    'copy-plan': async()=>{const text=`DD订阅｜${state.currentCar.name}｜${state.city}｜${state.term}个月｜${number(state.mileage)}公里/月｜月费${money(monthly())}｜总价${money(total())}`;try{await navigator.clipboard.writeText(text);toast('方案摘要已复制');}catch{openSheet('share');$('.sheet').insertAdjacentHTML('beforeend',`<label class="field" style="margin-top:16px">长按或选择复制<textarea readonly>${escape(text)}</textarea></label>`);$('.sheet textarea').select();}},
  };
  $('#phone').addEventListener('click',e=>{if(e.target.matches('[data-dismiss]')){closeSheet();return;}const button=e.target.closest('[data-action]');if(!button||button.disabled)return;actions[button.dataset.action]?.(button.dataset.value,button);});
  $('#phone').addEventListener('input',e=>{
    if(e.target.id==='car-search'){state.search=e.target.value;$('#catalog-results').innerHTML=catalogResults();$('#catalog-count').innerHTML=resultCount();}
    if(e.target.id==='city-search'){state.cityQuery=e.target.value;$('#city-content').innerHTML=cityResults();app.scrollTop=0;}
    if(['driverName','driverPhone'].includes(e.target.name)){state[e.target.name]=e.target.value;delete state.contactErrors[e.target.name];e.target.setAttribute('aria-invalid','false');e.target.closest('.contact-field').querySelector('.field-error').textContent='';}
    if(e.target.id==='delivery-address'&&state.addressDraft){state.addressDraft.address=e.target.value;e.target.setAttribute('aria-invalid','false');$('#address-error').textContent='';}
  });
  $('#phone').addEventListener('change',e=>{if(e.target.id==='debit-consent'){state.debitConsent=e.target.checked;const button=$('[data-action="enable-debit"]');if(button)button.disabled=!state.debitConsent;}if(e.target.id==='agreement'){state.agreement=e.target.checked;renderFixed();}});
  $('#phone').addEventListener('submit',e=>{
    const form=e.target.closest('[data-form]');if(!form)return;e.preventDefault();
    const values=Object.fromEntries(new FormData(form)),type=form.dataset.form;
    if(type==='date'){state.start=values.date;state.time=values.time;closeSheet();render();toast('交付时间已更新');}
    else if(type==='service'){
      const o=selectedOrder();if(!o||o.status!=='active')return;
      const note=values.note.trim();if(!note){toast('请填写服务信息');return;}
      o.services ||= [];o.services.unshift({type:values.kind||state.serviceType,note,date:values.contact});
      save();closeSheet();render();toast('服务申请已受理，可在服务记录中查看');
    }else if(type==='support'){
      const note=values.note.trim();if(!note){toast('请填写咨询内容');return;}
      const o=selectedOrder();if(o){o.inquiries ||= [];o.inquiries.unshift({note,date:'待回访'});save();}
      closeSheet();render();toast('咨询已收到，管家将与你联系');
    }else if(type==='invoice'){
      state.invoice={title:values.title.trim(),email:values.email.trim()};save();openSheet('invoice');toast('发票申请已受理');
    }
  });
  document.addEventListener('keydown',e=>{if(!state.sheet)return;if(e.key==='Escape'){closeSheet();return;}if(e.key==='Tab'){const focusable=[...overlays.querySelectorAll('button:not(:disabled),input,textarea,select,[tabindex="0"]')];const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('.sheet'))){e.preventDefault();last?.focus();}else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===$('.sheet'))){e.preventDefault();first?.focus();}}});
  fitPreview();
  window.addEventListener('resize',fitPreview);
  render({reset:true});
})();
