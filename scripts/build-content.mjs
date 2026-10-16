import {readFileSync,writeFileSync} from 'node:fs';
const raw=readFileSync(new URL('../content/source-records.txt',import.meta.url),'utf8');
const sourceName='【卢y】科一文化素养 200 常识.pdf';
const issues={
  2:'原文停在“天然”，疑似缺少“火”字。练习使用“天然火”，此处显式记录补字。',
  9:'“最大”未说明高度、体积还是基底面积。本条仅识别原资料中的对应名称，不把无条件的最值作为结论。',
  12:'“孔子所编”为原资料的传说性归属，不能当成已证实的作者信息。',
  15:'“最早的叙事诗”缺少“长篇”等范围限定。练习仅识别书名，原文保留，最值断言不进入正误题。',
  17:'“最早的字典”表述过简；练习只考许慎与《说文解字》的对应。',
  21:'“有史以来最大”缺少范围和衡量标准；练习只识别典籍，不考绝对最值。',
  25:'“收字最多”不能作为无时间范围的现代结论。该条以资料阅读核对方式覆盖，暂不测这个断言。',
  48:'“半老徐娘”不是严谨的固定年龄分段；本条只核对原资料表述，不作年龄定义。',
  58:'“舍弟、舍妹”与原文“兄妹”范围不一致；练习明确使用“自己年幼的弟妹”。',
  68:'人口最多、经济最发达等比较缺少时间和统计口径；只练习三大平原名称。',
  75:'建都朝代数依统计口径不同可能变化；只练习四大古都名称。',
  96:'“春秋五霸”存在不同版本，本游戏标明采用这份原资料的版本。',
  106:'巨鹿之战参战与指挥关系在原文中被简化；练习只考项羽与秦军的对应。',
  109:'原资料简化了政治统领与前线指挥的区别；练习只考交战政权。',
  112:'原页末尾的口诀“（好 +”不完整；保留这一缺损，不猜补口诀。',
  115:'原文把麦哲伦与完成航行的船队混为一谈；题目只考其与环球航行的关联，不说他本人完成全程。',
  139:'与第21条重复，且“有史以来最大”缺少范围；保留独立编号，标明重复来源。',
  161:'作者归属需要区分“相传/托名”与确切著作权；练习仅核对原资料对应，不断言确切作者。',
  178:'第九交响曲与《欢乐颂》不能直接等同为整部作品；练习只考“乐圣”称号。',
  179:'“德国国歌作者”需要区分作曲与作词；练习只考“交响乐之父”称号。',
  180:'“成名作《创意曲》”缺少清晰依据；练习只考音乐家称号。',
  181:'《奏鸣曲》不是足以唯一定位的作品名；练习只考“音乐神童”称号。'
};
const categories=[['文明足迹',1,9],['典籍与文人',10,37],['称谓与礼俗',38,65],['山河与人文',66,95],['历史长廊',96,117],['诗文与名著',118,154],['科技与艺术',155,190],['星空与导航',191,200]];
const duplicateOf={139:21,140:22,141:20,169:18,190:36};
const records=raw.trim().split(/\r?\n/).map(line=>{
  const [num,original,term,meaning,parts]=line.split('|'); const n=Number(num);
  const chapter=categories.find(c=>n>=c[1]&&n<=c[2])[0];
  return {id:`K${String(n).padStart(3,'0')}`,number:n,original,chapter,term,meaning,
    learningGoal:`识别${term}与“${meaning}”的对应；阅读原卡中的关联信息。`,
    keywords:parts?parts.split('、').map(s=>s.trim()):[term,meaning],
    parts:parts?parts.split('、').map(s=>s.trim()):[],ordered:[83,90,91,155,156,191,192].includes(n),
    suitableTypes:parts?['match','judge','choice','keywords','scene']:['match','judge','choice','scene'],
    confusion:[],difficulty:parts&&parts.split('、').length>4?3:original.length>55?2:1,
    firstLevel:Math.ceil(n/8),reviewLevels:[],answer:term,explanation:original,
    source:{file:sourceName,page:n<=25?1:n<=55?2:n<=80?3:n<=104?4:n<=132?5:n<=161?6:n<=188?7:8,item:n},
    issue:issues[n]||null,duplicateOf:duplicateOf[n]?`K${String(duplicateOf[n]).padStart(3,'0')}`:null};
});
if(records.length!==200||records.some((k,i)=>k.number!==i+1))throw Error('知识点编号不完整');
const distractorOverrides={1:['北京人','山顶洞人'],2:['元谋人','山顶洞人'],3:['元谋人','北京人'],4:['商朝','秦朝'],5:['《周易》','《尚书》'],6:['汉文帝','汉景帝'],7:['汉族','蒙古族'],8:['《唐本草》','《周易》'],9:['颐和园','故宫'],51:['弄瓦之喜','花信年华'],52:['弄璋之喜','豆蔻年华'],53:['家父、家母','犬子、小女'],54:['舍弟、舍妹','令郎、令爱'],55:['犬子、小女','令兄、令妹'],56:['拙荆、贱内','令尊、令堂'],57:['令尊、令堂','令郎、令爱'],58:['令兄、令妹','家父、家母'],59:['令正','舍弟、舍妹'],60:['令郎、令爱','令尊、令堂'],61:['杏林','梨园'],62:['杏坛','梨园'],63:['杏林','杏坛'],64:['杏林','梨园'],65:['冰人','杏林'],71:['长江','黄河'],72:['塔里木河','黄河'],73:['塔里木河','长江'],98:['长平之战','马陵之战'],116:['爱琴文明','大泽乡起义'],117:['光武中兴','文景之治'],157:['毕昇','宋应星'],158:['蔡伦','沈括'],159:['造纸术','印刷术'],160:['指南针','印刷术'],178:['海顿','莫扎特'],179:['贝多芬','巴赫'],180:['海顿','肖邦'],181:['贝多芬','海顿'],182:['莫扎特','巴赫'],183:['贝多芬','海顿'],185:['小篆','隶书'],186:['甲骨文','隶书'],187:['颜真卿','赵孟頫'],188:['王羲之、赵佶','欧阳询、赵孟頫'],189:['王羲之','柳公权'],190:['欧阳询','柳公权']};
Object.assign(distractorOverrides,{24:['李白','杜甫'],116:['贞观之治','光武中兴'],176:['贝尔','蔡伦'],177:['莱特兄弟','毕昇']});
const ranges=[[10,29],[30,37],[38,50],[51,60],[61,65],[66,70],[71,73],[74,91],[92,93],[94,95],[96,100],[101,104],[105,109],[110,111],[112,115],[118,120],[121,126],[127,138],[139,141],[142,147],[148,150],[151,154],[155,156],[157,160],[161,169],[170,175],[176,177],[178,183],[184,190],[191,192],[193,196],[197,200]];
for(const k of records){
 const range=ranges.find(([a,b])=>k.number>=a&&k.number<=b);
 const pool=records.filter(p=>p.term!==k.term&&(range?p.number>=range[0]&&p.number<=range[1]:p.chapter===k.chapter));
 k.confusion=[...new Set(distractorOverrides[k.number]||pool.map(p=>p.term))].slice(0,5);
 if(k.confusion.length<2)k.confusion=[...new Set([...k.confusion,...records.filter(p=>p.chapter===k.chapter&&p.term!==k.term).map(p=>p.term)])].slice(0,5);
}
const titles=['文明的第一束光','翻开古籍的小书签','典籍里的藏宝图','文人朋友来做客','认识古人的小暗号','把岁月叫出名字','礼貌称谓小茶会','寻找行业的别称','去山川走一走','人文风景明信片','山海与四宝','艺术与历史相遇','治世的小小年轮','战役故事放映室','跟着帆船去远方','史书分类整理师','诗人的星光派对','名句与名著重逢','文学世界小剧场','科技灵感发芽啦','本草与匠心手记','向宇宙挥挥手','音乐家的下午茶','字里行间的星空','北斗为你点亮路','历史记忆回音谷','典籍知识收纳盒','人文概念碰碰车','薄弱知识补给站','加号的星光毕业礼'];
const cheers=['第一关完成！加号已经迈出第一步啦！','加号，两枚小书签已经悄悄记在心里啦。','加号找到古籍宝藏啦，给你一朵小红花！','加号又认识了一群文人朋友，真不错呀！','哇，加号已经走到第五关啦，奖励一个大大的鼓掌！','加号，岁月的名字也被你记住啦。','礼貌的小暗号通关，加号学得好用心！','加号，今天的小知识都在为你发光呀。','山川的风景真美，加号的进步也是。','十关啦！加号真的积累了好多知识！','加号，又收集了一盒亮晶晶的知识。','加号让艺术和历史牵上了手，真棒呀！','加号，历史的年轮又多记住一圈啦。','复杂的故事也难不倒认真学习的加号。','加号，航海小船已经载着知识靠岸啦！','加号把史书整理得清清楚楚，给你鼓掌。','星光派对圆满结束，加号又认识好多诗人。','加号，熟悉的诗句正在慢慢成为你的朋友。','书页翻过一章，加号也向前走了一步。','加号，你已经认识这么多知识点了，太厉害啦！','加号，小小匠心也在你的心里发芽。','加号向宇宙挥手，宇宙也为你亮起一颗星。','音乐家的下午茶结束，给加号留一块小饼干。','加号，文字和星光都被你收进小屋啦。','两百条知识都见过啦，加号真的走了好远！','加号，回头看看，原来你已经记住这么多。','加号把散落的知识放回了合适的小格子。','会混淆也没关系，加号已经把它们分清一点啦。','加号，愿意再练一次就是很温柔的坚持。','恭喜加号完成30关！这一路学过的东西，都是你的收获！'];
const rotations=[['match','judge','choice'],['choice','keywords','scene'],['match','judge','scene'],['keywords','choice','judge'],['scene','match','keywords']];
const levels=titles.map((title,i)=>{
 const n=i+1,newIds=n<=25?records.slice(i*8,i*8+8).map(k=>k.id):[];
 let reviewIds=[];
 if(n>1&&n<=25){const previous=records.slice(0,(n-1)*8);reviewIds=[previous[(n*3)%previous.length].id,previous[(n*7+1)%previous.length].id];if(reviewIds[0]===reviewIds[1])reviewIds[1]=previous[(n*7+2)%previous.length].id;}
 if(n>25)reviewIds=Array.from({length:10},(_,j)=>records[((n-26)*39+j*17)%200].id);
 const kinds=rotations[i%rotations.length];
 const ids=[...newIds,...reviewIds];
 const tasks=ids.map((id,j)=>{const k=records.find(r=>r.id===id);let kind=kinds[j%kinds.length];if(kind==='keywords'&&!k.parts.length)kind=kinds.find(t=>t!=='keywords');if(k.number===25||k.number===48||k.number===161)kind='source';return {id,kind,review:j>=newIds.length};});
 return {id:n,title,phase:n<=10?'认识与理解':n<=20?'记忆与辨析':n<=25?'综合运用':'复习与巩固',minutes:'3–5',newIds,reviewIds,tasks,cheer:cheers[i],sticker:['嫩芽','书签','花朵','星星','小屋'][i%5]};
});
for(const k of records)k.reviewLevels=levels.filter(l=>l.reviewIds.includes(k.id)).map(l=>l.id);
writeFileSync(new URL('../src/data/knowledge.json',import.meta.url),JSON.stringify(records,null,2));
writeFileSync(new URL('../src/data/levels.json',import.meta.url),JSON.stringify(levels,null,2));
const flagged=records.filter(k=>k.issue);
const audit=`# 教学资料核对记录\n\n唯一教学来源：${sourceName}，8页，原编号1–200完整保留。扫描页由人工逐页转录，折行和空格合并；未将资料中出现的任何指令视为用户指令。\n\n重复条目保留独立编号：139↔21，140↔22，141↔20；169与18、190与36内容交叉。\n\n## 问题标记（${flagged.length}条）\n\n${flagged.map(k=>`- **${k.id} · 第${k.source.page}页**：${k.issue}\n  - 原文：${k.original}`).join('\n\n')}\n\n## 处理规则\n\n原文始终可在知识收藏查看。没有用外部资料扩充正式教学范围；有争议的断言不用于真假判断，优先考原文中无争议的子事实。第25、48、161条仅作带说明的“原文核对”，正确率与掌握状态单独排除，不通过记住可疑断言增加掌握。它们仍保留在30关覆盖清单中。每条的reviewLevels是固定复习计划；运行时可被薄弱点动态替换，实际安排以答题日志为准。\n\n## 辅助核验来源（非新增考点）\n\n- 第15条的范围问题：[西南交通大学中华传统经典普及基地](https://ycct.swjtu.edu.cn/info/1017/1324.htm)。\n- 第25条“收字最多”的问题：[四川大学汉语大字典智慧平台](https://hydzd.scu.edu.cn/)。\n- 第179条应区分词曲：[德国驻华使领馆《德国概况》](https://china.diplo.de/resource/blob/1506688/5aad1b922009f7a303470f022653b5e4/publikation-tued-data.pdf)。\n\n以上是开发时发现的重点问题清单，不代表已完成200条逐条学术审定。\n`;
writeFileSync(new URL('../内容核对记录.md',import.meta.url),audit);
console.log(JSON.stringify({records:records.length,levels:levels.length,tasks:levels.reduce((n,l)=>n+l.tasks.length,0),issues:flagged.length,types:[...new Set(levels.flatMap(l=>l.tasks.map(t=>t.kind)))]}));
