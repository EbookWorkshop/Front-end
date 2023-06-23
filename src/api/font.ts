import axios, { AxiosResponse } from 'axios';

const ASSETS_HOST = import.meta.env.VITE_API_BASE_URL;
export interface ContentType {
  name: string;
  content: string;
}

/**
 * 系统可用字体
 * @returns 可用字体列表地址
 */
export function queryFontList() {
  return axios.get('/services/font').then((data: AxiosResponse<string[]>) => {
    return data.data.map((item) => {
      return {
        name: item.replace(/(\/font\/)|(\.\w+)/g, ''),
        path: ASSETS_HOST + item,
      };
    });
  });
}

/**
 * 样例文章
 * @returns
 */
export function queryDemoContent() {
  return new Promise<{ data: ContentType[] }>((resolve, reject) => {
    resolve({
      data: [
        {
          name: '钗头凤·陆游 ',
          content:
            '红酥手，黄滕酒。满城春色宫墙柳；东风恶，欢情薄，一怀愁绪，几年离索，错，错，错！\n春如旧，人空瘦。泪痕红浥鲛绡透；桃花落，闲池阁，山盟虽在，锦书难托，莫，莫，莫！',
        },
        {
          name: '水调歌头·苏轼',
          content:
            '明月几时有，把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。\n转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
        },
        {
          name: '春江花月夜·张若虚（繁体）',
          content:
            '春江潮水連海平，海上明月共潮生。\n灩灩隨波千萬裏，何處春江無月明。\n江流宛轉繞芳甸，月照花林皆似霰。\n空裏流霜不覺飛，汀上白沙看不見。\n江天一色無纖塵，皎皎空中孤月輪。\n江畔何人初見月，江月何年初照人。\n人生代代無窮已，江月年年只相似。\n不知江月待何人，但見長江送流水。\n白雲一片去悠悠，青楓浦上不勝愁。\n誰家今夜扁舟子，何處相思明月樓。\n可憐樓上月裴回，應照離人妝鏡臺。\n玉戶簾中卷不去，擣衣砧上拂還來。\n此時相望不相聞，願逐月華流照君。\n鴻雁長飛光不度，魚龍潛躍水成文。\n昨夜閑潭夢落花，可憐春半不還家。\n江水流春去欲盡，江潭落月複西斜。\n斜月沉沉藏海霧，碣石瀟湘無限路。\n不知乘月幾人歸，落月搖情滿江樹。',
        },
        {
          name: '木兰花·拟古决绝词柬友·纳兰性德',
          content:
            '人生若只如初见，\n何事秋风悲画扇。\n等闲变却故人心，\n却道故人心易变。\n骊山语罢清宵半，\n泪雨霖铃终不怨。\n何如薄幸锦衣郎，\n比翼连枝当日愿。',
        },
        {
          name: '滕王阁序·王勃',
          content:
            '豫章故郡，洪都新府。星分翼轸，地接衡庐。襟三江而带五湖，控蛮荆而引瓯越。物华天宝，龙光射牛斗之墟；人杰地灵，徐孺下陈蕃之榻。雄州雾列，俊采星驰。台隍枕夷夏之交，宾主尽东南之美。都督阎公之雅望，棨戟遥临；宇文新州之懿范，襜帷暂驻。十旬休假，胜友如云；千里逢迎，高朋满座。腾蛟起凤，孟学士之词宗；紫电青霜，王将军之武库。家君作宰，路出名区；童子何知，躬逢胜饯。(豫章故郡 一作：南昌故郡；青霜 一作：清霜)\n时维九月，序属三秋。潦水尽而寒潭清，烟光凝而暮山紫。俨骖騑于上路，访风景于崇阿。临帝子之长洲，得天人之旧馆。层峦耸翠，上出重霄；飞阁流丹，下临无地。鹤汀凫渚，穷岛屿之萦回；桂殿兰宫，即冈峦之体势。（天人 一作：仙人；层峦 一作：层台；即冈 一作：列冈；飞阁流丹 一作：飞阁翔丹）\n披绣闼，俯雕甍，山原旷其盈视，川泽纡其骇瞩。闾阎扑地，钟鸣鼎食之家；舸舰弥津，青雀黄龙之舳。云销雨霁，彩彻区明。落霞与孤鹜齐飞，秋水共长天一色。渔舟唱晚，响穷彭蠡之滨，雁阵惊寒，声断衡阳之浦。(轴 通：舳；迷津 一作：弥津；云销雨霁，彩彻区明 一作：虹销雨霁，彩彻云衢)\n遥襟甫畅，逸兴遄飞。爽籁发而清风生，纤歌凝而白云遏。睢园绿竹，气凌彭泽之樽；邺水朱华，光照临川之笔。四美具，二难并。穷睇眄于中天，极娱游于暇日。天高地迥，觉宇宙之无穷；兴尽悲来，识盈虚之有数。望长安于日下，目吴会于云间。地势极而南溟深，天柱高而北辰远。关山难越，谁悲失路之人；萍水相逢，尽是他乡之客。怀帝阍而不见，奉宣室以何年？(遥襟甫畅 一作：遥吟俯畅)\n嗟乎！时运不齐，命途多舛。冯唐易老，李广难封。屈贾谊于长沙，非无圣主；窜梁鸿于海曲，岂乏明时？所赖君子见机，达人知命。老当益壮，宁移白首之心？穷且益坚，不坠青云之志。酌贪泉而觉爽，处涸辙以犹欢。北海虽赊，扶摇可接；东隅已逝，桑榆非晚。孟尝高洁，空余报国之情；阮籍猖狂，岂效穷途之哭！(见机 一作：安贫；以犹欢 一作：而相欢)\n勃，三尺微命，一介书生。无路请缨，等终军之弱冠；有怀投笔，慕宗悫之长风。舍簪笏于百龄，奉晨昏于万里。非谢家之宝树，接孟氏之芳邻。他日趋庭，叨陪鲤对；今兹捧袂，喜托龙门。杨意不逢，抚凌云而自惜；钟期既遇，奏流水以何惭？\n呜呼！胜地不常，盛筵难再；兰亭已矣，梓泽丘墟。临别赠言，幸承恩于伟饯；登高作赋，是所望于群公。敢竭鄙怀，恭疏短引；一言均赋，四韵俱成。请洒潘江，各倾陆海云尔。\n滕王高阁临江渚，佩玉鸣鸾罢歌舞。\n画栋朝飞南浦云，珠帘暮卷西山雨。\n闲云潭影日悠悠，物换星移几度秋。\n阁中帝子今何在？槛外长江空自流。',
        },
      ],
    });
  });
}