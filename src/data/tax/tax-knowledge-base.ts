// ============================================================
// 税务合规知识库 - 卫浴行业跨境电商出口
// 涵盖：风险案例、VAT指引、知识词条、HS编码规则
// ============================================================

import type {
  TaxRiskCase, OverseasVATGuide, TaxKnowledgeEntry,
  TaxIssueCategory, BathroomProductCategory, RiskLevel, HSCodeEntry
} from "@/lib/tax/types"

// ==================== 1. 风险案例库 ====================

export const taxRiskCases: TaxRiskCase[] = [
  {
    id: "case-001",
    title: "潮州某卫浴厂买单出口被追缴税款案",
    category: "export_tax_refund",
    scenario: "潮州某卫浴厂年出口额约500万美元，通过货代买单出口（借用他人抬头报关），未自行申报出口退税。企业主认为「小规模纳税人不能退税」故未办理进出口经营权。",
    violation: "买单出口属于虚假贸易，违反《海关法》第24条；未取得进出口经营权擅自出口，违反《对外贸易法》第9条。",
    penalty: "海关追缴3年税款及滞纳金约180万元，罚款50万元，企业列入海关失信企业名单，通关查验率提升至100%。",
    lesson: "买单出口看似省事，实则丧失退税权利且面临法律风险。年出口额超100万美元的企业应办理进出口经营权，选择正规报关渠道。",
    prevention: [
      "年出口额超50万美元即应办理进出口经营权",
      "拒绝货代提供的买单报关方案",
      "选择有资质的报关行签订正规代理报关协议",
      "小规模纳税人也可委托综服企业代办退税"
    ],
    applicableTo: ["toilet", "bathroom_cabinet", "shower_room", "shower_head", "faucet", "hardware_fittings"],
    severity: "critical",
    year: 2023,
    region: "广东潮州"
  },
  {
    id: "case-002",
    title: "佛山某浴室柜厂进项发票缺失导致退税失败案",
    category: "export_tax_refund",
    scenario: "佛山某浴室柜厂从个体户采购木材、油漆等原材料约300万元/年，个体户无法开具增值税专用发票。企业申请出口退税时，因进项发票不足导致退税申报被驳回。",
    violation: "出口退税要求进销匹配，进项发票缺失导致无法证明采购真实性，违反《出口货物劳务增值税和消费税管理办法》第8条。",
    penalty: "该年度应退税款约39万元被驳回，转为内销补税处理，另加收滞纳金。企业实际税负率从3%上升至13%。",
    lesson: "卫浴行业上游个体户多，必须要求供应商开具专票或到税务局代开。进项发票管理是出口退税的生命线。",
    prevention: [
      "建立供应商白名单制度，优先选择能开专票的供应商",
      "对个体户供应商，要求其到税务局代开专票",
      "无法取得专票的采购控制在总采购额20%以内",
      "使用农产品收购发票等替代凭证需提前备案"
    ],
    applicableTo: ["bathroom_cabinet", "hardware_fittings"],
    severity: "high",
    year: 2023,
    region: "广东佛山"
  },
  {
    id: "case-003",
    title: "深圳某卫浴贸易商四流不一致被认定为虚开案",
    category: "four_flow_consistency",
    scenario: "深圳某卫浴贸易商从佛山采购花洒出口至美国，合同与A公司签订，发票由B公司开具，货款支付给C公司个人账户，物流由D公司承运。税务局稽查发现四流不一致。",
    violation: "四流（合同流、物流、发票流、资金流）不一致，违反《发票管理办法》第22条，被认定为虚开增值税专用发票。",
    penalty: "进项税额转出约86万元，补缴增值税及附加约103万元，罚款50万元，企业法定代表人被列入税收违法黑名单。",
    lesson: "卫浴行业多层转手现象普遍，每一笔出口业务必须确保合同、物流、发票、资金四流指向同一主体。",
    prevention: [
      "每笔出口业务建立四流匹配台账",
      "合同方、开票方、收款方、发货方必须为同一主体",
      "严禁通过个人账户收取出口货款",
      "定期进行四流一致性内部审计"
    ],
    applicableTo: ["toilet", "bathroom_cabinet", "shower_room", "shower_head", "faucet", "hardware_fittings"],
    severity: "critical",
    year: 2024,
    region: "广东深圳"
  },
  {
    id: "case-004",
    title: "泉州某水暖厂私户收款被金税四期预警稽查案",
    category: "private_account",
    scenario: "泉州某水暖厂通过法定代表人及财务负责人个人微信、支付宝收取跨境电商货款约1200万元/年，未入公账、未申报收入。金税四期通过银税互动发现个人账户频繁大额收款。",
    violation: "私户收款隐匿收入，违反《税收征收管理法》第63条，构成偷税。个人账户大额交易未申报违反《反洗钱法》。",
    penalty: "补缴增值税及企业所得税约312万元，罚款156万元（偷税额0.5倍），加收滞纳金约28万元。法定代表人个人账户被冻结调查。",
    lesson: "金税四期已实现银税直连，个人账户流水超阈值自动触发预警。卫浴行业私户收款是最高频的稽查风险点。",
    prevention: [
      "所有跨境电商收入必须进入对公账户",
      "平台收款绑定企业账户而非个人账户",
      "历史私户收款应主动补申报（自查自纠从宽）",
      "建立收入确认制度，杜绝账外经营"
    ],
    applicableTo: ["toilet", "bathroom_cabinet", "shower_room", "shower_head", "faucet", "hardware_fittings", "bidet"],
    severity: "critical",
    year: 2024,
    region: "福建泉州"
  },
  {
    id: "case-005",
    title: "佛山某卫浴企业HS编码归类错误被海关处罚案",
    category: "customs_code",
    scenario: "佛山某企业将智能马桶（应归入HS 6910.10）错误归入陶瓷卫生设备配件（HS 6910.90），导致出口退税率从13%降至5%，且被海关认定为申报不实。",
    violation: "HS编码申报不实，违反《海关行政处罚实施条例》第15条。",
    penalty: "处罚款8万元，补缴退税率差税款约15万元，企业被海关降级为B类管理，查验率提升。",
    lesson: "卫浴产品HS编码归类专业性强，马桶/浴室柜/花洒等品类编码差异大，退税率从5%-13%不等。错误归类不仅影响退税，还面临处罚。",
    prevention: [
      "建立卫浴产品HS编码对照表（按品类细分）",
      "新产品首次出口前向海关预归类",
      "定期更新HS编码（每年1月1日调整）",
      "复杂产品委托专业报关行归类"
    ],
    applicableTo: ["toilet", "bidet", "bathroom_cabinet", "shower_head", "faucet"],
    severity: "high",
    year: 2023,
    region: "广东佛山"
  },
  {
    id: "case-006",
    title: "亚马逊卖家德国VAT漏报被封店案",
    category: "overseas_vat",
    scenario: "某卫浴独立站卖家通过亚马逊德国站销售花洒、水龙头等产品，年销售额约80万欧元，未注册德国VAT、未申报缴纳销售税。德国税务局通过亚马逊数据共享发现。",
    violation: "违反德国《增值税法》(UStG)第18条，远程销售超过10万欧元阈值须注册德国VAT。",
    penalty: "补缴VAT约15.2万欧元，罚款3万欧元，亚马逊店铺被冻结，库存被扣押。企业额外支付德国税务师费用约2万欧元处理解封。",
    lesson: "欧洲各国VAT阈值不同（德国10万€、法国3.5万€、意大利3.5万€），超过阈值必须注册。亚马逊已与多国税务局数据共享。",
    prevention: [
      "监控各站点年销售额，接近阈值前注册VAT",
      "使用IOSS简化清关和VAT申报",
      "聘请当地税务代理处理VAT申报",
      "保留所有进口VAT缴纳凭证用于抵扣"
    ],
    applicableTo: ["shower_head", "faucet", "hardware_fittings", "towel_rack"],
    severity: "critical",
    year: 2024,
    region: "德国"
  },
  {
    id: "case-007",
    title: "中山某淋浴房厂小规模纳税人错失退税案",
    category: "taxpayer_identity",
    scenario: "中山某淋浴房厂年出口额约800万元，一直按小规模纳税人纳税（征收率3%），未申请转为一般纳税人。同行一般纳税人企业享受13%出口退税率，该企业因身份错配无法退税。",
    violation: "非违规，但属于纳税人身份错配导致多缴税款。年出口额超500万元应强制转为一般纳税人。",
    penalty: "年多缴税款约80万元（800万×(13%-3%)），且无法享受出口退税。连续3年累计损失超240万元。",
    lesson: "年出口额超500万元的卫浴企业必须转为一般纳税人，否则不仅多缴增值税，还丧失出口退税权利。",
    prevention: [
      "年出口额超300万元即应主动申请转为一般纳税人",
      "转为一般纳税人后及时办理出口退税备案",
      "评估进项税额占比，确保转一般纳税人后税负下降",
      "转登记前清理小规模期间的税务事项"
    ],
    applicableTo: ["shower_room", "bathroom_cabinet", "toilet", "shower_head", "faucet"],
    severity: "high",
    year: 2023,
    region: "广东中山"
  },
  {
    id: "case-008",
    title: "金税四期大数据比对发现卫浴企业产销异常案",
    category: "golden_tax_phase4",
    scenario: "佛山某卫浴企业申报年产量10万件，但用电量仅匹配3万件产能；社保缴纳人数20人，但工资支出申报60人。金税四期通过水电、社保、物流等多维数据交叉比对发现异常。",
    violation: "产量与能耗不匹配、工资与社保人数不一致，涉嫌虚列成本、隐瞒收入，违反《税收征收管理法》第35条（核定征收情形）。",
    penalty: "税务局启动核定征收程序，按能耗反推产量补税约45万元，罚款22万元。企业被列为重点监控对象。",
    lesson: "金税四期已实现税务、市监、社保、银行、海关、电力等多部门数据共享。卫浴企业必须确保各系统数据逻辑自洽。",
    prevention: [
      "确保申报产量与水电能耗、原材料采购量匹配",
      "社保人数与工资申报人数一致",
      "避免大额现金交易（金税四期重点监控）",
      "定期自查各系统数据一致性"
    ],
    applicableTo: ["toilet", "bathroom_cabinet", "shower_room", "faucet", "hardware_fittings"],
    severity: "high",
    year: 2024,
    region: "广东佛山"
  },
  {
    id: "case-009",
    title: "宁波某卫浴企业挂靠出口被追税案",
    category: "export_tax_refund",
    scenario: "宁波某卫浴企业挂靠某外贸公司出口，以被挂靠方名义报关、退税。挂靠方收取1%手续费。后挂靠方因其他业务被稽查，该企业的挂靠出口业务被连带查出。",
    violation: "挂靠出口属于变相买单出口，实际出口企业与报关主体不一致，违反《海关法》和出口退税管理规定。",
    penalty: "追回已退税款约120万元，按偷税处罚款60万元，挂靠方和被挂靠方均被处罚。",
    lesson: "挂靠出口看似双赢，实则双方均承担巨大风险。一旦被挂靠方出问题，所有挂靠业务都会被追溯。",
    prevention: [
      "坚决不使用挂靠方式出口",
      "自营出口或选择正规综服企业代办退税",
      "确需代理出口的，签订规范的代理出口协议",
      "代理出口须以委托方名义报关"
    ],
    applicableTo: ["toilet", "bathroom_cabinet", "shower_room", "shower_head", "faucet", "hardware_fittings"],
    severity: "critical",
    year: 2023,
    region: "浙江宁波"
  },
  {
    id: "case-010",
    title: "香港关联交易转让定价被调整案",
    category: "transfer_pricing",
    scenario: "佛山某卫浴企业通过香港关联公司出口，以低于市场价30%的价格将产品销售给香港公司，再由香港公司加价销售给海外客户。税务局认定转让定价不合理。",
    violation: "关联交易定价不符合独立交易原则，违反《企业所得税法》第41条及《特别纳税调整实施办法》。",
    penalty: "特别纳税调整，调增应纳税所得额约500万元，补缴企业所得税125万元，加收利息约15万元。",
    lesson: "通过香港/离岸公司转移利润是卫浴行业常见做法，但定价须符合独立交易原则，保留完整的转让定价文档。",
    prevention: [
      "关联交易定价须有可比非受控价格依据",
      "准备同期资料（转让定价文档）",
      "关联交易比例控制在20%以内",
      "提前申请预约定价安排（APA）"
    ],
    applicableTo: ["toilet", "bathroom_cabinet", "shower_room", "shower_head", "faucet", "hardware_fittings"],
    severity: "high",
    year: 2023,
    region: "广东佛山"
  }
]

// ==================== 2. 海外VAT/关税指引 ====================

export const overseasVATGuides: OverseasVATGuide[] = [
  {
    country: "美国",
    countryCode: "US",
    vatRate: 0,
    vatThreshold: 0,
    registrationRequired: false,
    registrationThreshold: 0,
    filingFrequency: "monthly",
    filingDeadline: "各州不同，通常每月20日",
    penaltyForLateFiling: "月罚金5%-25%不等，各州差异大",
    taxRepresentativeRequired: false,
    iossAvailable: false,
    ossAvailable: false,
    dutyRate: 3.7,
    dutyFreeThreshold: 800,
    specialRules: [
      "美国无联邦VAT，各州征收Sales Tax（销售税），税率0%-10.25%不等",
      "经济关联（Economic Nexus）阈值：多数州为年销售额10万美元或200笔交易",
      "亚马逊FBA库存所在州即构成物理关联（Physical Nexus）",
      "卫浴产品进口关税集中在2.5%-5.3%（HS 6910/7324/8481等）",
      "301条款对华加征关税：卫浴产品多在List 3/4A，税率7.5%-25%"
    ],
    commonMistakes: [
      "误以为美国无VAT就无需处理税务",
      "未在FBA仓库所在州注册Sales Tax",
      "忽略经济关联阈值，超阈值未注册",
      "未申报301附加关税（错误使用HS编码规避）"
    ],
    tips: [
      "使用亚马逊VAT Services或TaxJar自动处理多州Sales Tax",
      "301关税可申请排除（需证明产品无替代来源）",
      "利用800美元de minimis规则拆分B2C订单",
      "注册IOSS可简化欧盟清关，但美国无IOSS"
    ]
  },
  {
    country: "德国",
    countryCode: "DE",
    vatRate: 19,
    vatThreshold: 100000,
    registrationRequired: true,
    registrationThreshold: 100000,
    filingFrequency: "monthly",
    filingDeadline: "次月10日",
    penaltyForLateFiling: "滞纳金按月1%，最低25欧元；逾期申报罚款0.5%-10%税额",
    taxRepresentativeRequired: false,
    iossAvailable: true,
    ossAvailable: true,
    dutyRate: 3.0,
    dutyFreeThreshold: 150,
    specialRules: [
      "远程销售超10万欧元须注册德国VAT",
      "使用德国FBA仓即须注册（无论销售额）",
      "进口VAT可抵扣（需保留海关进口单据）",
      "OSS可统一申报欧盟各国VAT（简化流程）",
      "卫浴产品进口关税约2%-4%（视具体HS编码）"
    ],
    commonMistakes: [
      "超过远程销售阈值未及时注册",
      "未抵扣进口VAT（丢失海关单据）",
      "FBA发货但未在德国注册VAT",
      "VAT申报金额与亚马逊销售报告不一致"
    ],
    tips: [
      "使用IOSS可避免B2C包裹在海关被扣押",
      "德国税务局审核严格，务必保留7年税务记录",
      "建议聘请德国本土税务师（Steuerberater）",
      "亚马逊已强制要求卖家上传VAT注册号"
    ]
  },
  {
    country: "英国",
    countryCode: "GB",
    vatRate: 20,
    vatThreshold: 85000,
    registrationRequired: true,
    registrationThreshold: 85000,
    filingFrequency: "quarterly",
    filingDeadline: "季度结束后1个月零7天",
    penaltyForLateFiling: "逾期申报罚金：首次£100，后续递增；逾期缴税按2.75%年利率计息",
    taxRepresentativeRequired: false,
    iossAvailable: true,
    ossAvailable: false,
    dutyRate: 3.0,
    dutyFreeThreshold: 135,
    specialRules: [
      "脱欧后英国独立VAT体系，不再适用欧盟规则",
      "远程销售阈值£85,000（含所有远程销售渠道）",
      "英国FBA仓库存即须注册英国VAT",
      "低价值货物（£135以下）B2C进口不征关税但征VAT",
      "卫浴产品进口关税约2.5%-4%"
    ],
    commonMistakes: [
      "脱欧后仍按欧盟规则处理英国VAT",
      "未区分英国与欧盟VAT注册",
      "忽略£135免税阈值变化",
      "未注册UKCA认证（与VAT无关但影响清关）"
    ],
    tips: [
      "脱欧后英国VAT与欧盟VAT须分别注册",
      "使用英国VAT递延（Postponed VAT Accounting）简化清关",
      "保留完整的进口VAT抵扣记录",
      "亚马逊英国站强制要求VAT注册号"
    ]
  },
  {
    country: "法国",
    countryCode: "FR",
    vatRate: 20,
    vatThreshold: 35000,
    registrationRequired: true,
    registrationThreshold: 35000,
    filingFrequency: "monthly",
    filingDeadline: "次月19日",
    penaltyForLateFiling: "滞纳金0.4%/月，逾期申报罚款10%税额",
    taxRepresentativeRequired: false,
    iossAvailable: true,
    ossAvailable: true,
    dutyRate: 3.0,
    dutyFreeThreshold: 150,
    specialRules: [
      "远程销售阈值€35,000（低于德国）",
      "法国税务局要求指定税务代表（非强制但推荐）",
      "使用法国FBA仓即须注册法国VAT",
      "法国对卫浴产品环保税（Eco-tax）额外征收",
      "进口VAT可在首次申报时抵扣"
    ],
    commonMistakes: [
      "忽略法国远程销售阈值低于德国",
      "未考虑环保税（Eco-contribution）",
      "VAT申报使用英语而非法语被退回",
      "未保留EORI号码用于清关"
    ],
    tips: [
      "法国税务审计严格，建议聘请法语税务师",
      "OSS可统一申报法国及欧盟其他国VAT",
      "注意法国环保税（适用于卫浴包装材料）",
      "保留所有C88海关清关文件用于VAT抵扣"
    ]
  },
  {
    country: "意大利",
    countryCode: "IT",
    vatRate: 22,
    vatThreshold: 35000,
    registrationRequired: true,
    registrationThreshold: 35000,
    filingFrequency: "monthly",
    filingDeadline: "次月16日",
    penaltyForLateFiling: "滞纳金按月1.25%，逾期申报罚款15%-30%税额",
    taxRepresentativeRequired: true,
    iossAvailable: true,
    ossAvailable: true,
    dutyRate: 3.5,
    dutyFreeThreshold: 150,
    specialRules: [
      "远程销售阈值€35,000",
      "意大利强制要求指定税务代表（Rappresentante Fiscale）",
      "使用意大利FBA仓即须注册VAT",
      "卫浴产品进口关税约2.5%-4.5%",
      "意大利税务局效率较低，注册周期2-6个月"
    ],
    commonMistakes: [
      "未指定税务代表导致VAT注册被拒",
      "低估意大利VAT注册时间（建议提前6个月）",
      "未保留意大利语版本的合同和发票",
      "忽略Statistiche（Intrastat）申报义务"
    ],
    tips: [
      "提前6个月启动意大利VAT注册",
      "选择有经验的意大利税务代表",
      "使用OSS简化多国VAT申报",
      "Intrastat申报须按月/按季度提交"
    ]
  },
  {
    country: "日本",
    countryCode: "JP",
    vatRate: 10,
    vatThreshold: 10000000,
    registrationRequired: false,
    registrationThreshold: 10000000,
    filingFrequency: "quarterly",
    filingDeadline: "季度结束后2个月",
    penaltyForLateFiling: "滞纳金年利率14.6%，不足税款的15%",
    taxRepresentativeRequired: true,
    iossAvailable: false,
    ossAvailable: false,
    dutyRate: 2.5,
    dutyFreeThreshold: 10000,
    specialRules: [
      "日本消费税（JCT）税率10%（标准）或8%（食品等，卫浴不适用）",
      "2023年10月起实行发票制度（適格請求書等保存方式）",
      "年销售额超1,000万日元须注册JCT",
      "日本海关对卫浴产品征收关税约2%-4%",
      "亚马逊日本站已要求卖家上传JCT注册号"
    ],
    commonMistakes: [
      "误以为日本消费税与己无关（超阈值须注册）",
      "2023年发票制度改革后未及时适应",
      "未指定日本税务代理人（须居住在日本）",
      "忽略JCT申报中的地方消费税部分"
    ],
    tips: [
      "2023年10月新制度后，建议主动注册JCT以便买家抵扣",
      "日本税务代理人须为日本居住者",
      "保留进口JCT缴纳凭证用于抵扣",
      "使用亚马逊JCT服务简化申报"
    ]
  },
  {
    country: "沙特阿拉伯",
    countryCode: "SA",
    vatRate: 15,
    vatThreshold: 375000,
    registrationRequired: true,
    registrationThreshold: 375000,
    filingFrequency: "quarterly",
    filingDeadline: "季度结束后1个月",
    penaltyForLateFiling: "最低罚款SAR 1,000，最高SAR 50,000",
    taxRepresentativeRequired: true,
    iossAvailable: false,
    ossAvailable: false,
    dutyRate: 5.0,
    dutyFreeThreshold: 1000,
    specialRules: [
      "VAT税率15%（2020年从5%上调）",
      "进口VAT在清关时缴纳，可在后续申报中抵扣",
      "沙特要求指定税务代表（须为沙特居民）",
      "卫浴产品关税约5%-12%（视HS编码）",
      "SASO认证为强制要求（与VAT无关但影响清关）"
    ],
    commonMistakes: [
      "未指定沙特税务代表导致无法注册VAT",
      "忽略SASO认证要求导致货物被扣押",
      "未保留清关文件用于VAT抵扣",
      "误以为VAT税率仍为5%"
    ],
    tips: [
      "沙特VAT注册周期约2-4个月，需提前准备",
      "选择有资质的沙特税务代表",
      "SASO认证须在产品发运前完成",
      "保留完整的进口VAT抵扣链"
    ]
  },
  {
    country: "阿联酋",
    countryCode: "AE",
    vatRate: 5,
    vatThreshold: 375000,
    registrationRequired: true,
    registrationThreshold: 375000,
    filingFrequency: "quarterly",
    filingDeadline: "季度结束后28天",
    penaltyForLateFiling: "逾期申报罚款AED 1,000起，逾期缴税按月2%递增",
    taxRepresentativeRequired: false,
    iossAvailable: false,
    ossAvailable: false,
    dutyRate: 5.0,
    dutyFreeThreshold: 1000,
    specialRules: [
      "VAT税率5%（海湾地区最低）",
      "迪拜多种商品中心（DMCC）等自贸区有特殊税务优惠",
      "自贸区内企业间交易免征VAT",
      "卫浴产品关税约5%（GCC统一关税）",
      "ESMA认证为强制要求"
    ],
    commonMistakes: [
      "未区分自贸区与非自贸区的VAT规则",
      "忽略ESMA认证要求",
      "自贸区内销售误征VAT",
      "未保留进口VAT抵扣记录"
    ],
    tips: [
      "利用迪拜自贸区税务优惠政策",
      "ESMA认证须在产品发运前完成",
      "保留所有进口VAT缴纳凭证",
      "阿联酋VAT申报相对简单，可自行处理"
    ]
  },
  {
    country: "澳大利亚",
    countryCode: "AU",
    vatRate: 10,
    vatThreshold: 75000,
    registrationRequired: true,
    registrationThreshold: 75000,
    filingFrequency: "quarterly",
    filingDeadline: "季度结束后28天",
    penaltyForLateFiling: "罚金AUD 850起，逾期缴税按年利率9.04%计息",
    taxRepresentativeRequired: false,
    iossAvailable: false,
    ossAvailable: false,
    dutyRate: 5.0,
    dutyFreeThreshold: 1000,
    specialRules: [
      "GST（商品服务税）税率10%",
      "年营业额超AUD 75,000须注册GST",
      "低价值商品（AUD 1,000以下）进口GST由平台代收",
      "卫浴产品关税约5%（中澳FTA可减免）",
      "WaterMark/WELS认证为强制要求"
    ],
    commonMistakes: [
      "误以为GST由平台代收就无需注册",
      "未利用中澳FTA关税优惠",
      "忽略WaterMark认证要求",
      "GST申报金额与平台报告不一致"
    ],
    tips: [
      "中澳FTA下卫浴产品关税可降至0%-3%",
      "亚马逊澳洲站已代收GST，但仍需注册申报",
      "WaterMark认证须在产品发运前完成",
      "保留进口GST缴纳凭证用于抵扣"
    ]
  }
]

// ==================== 3. 税务知识词条 ====================

export const taxKnowledgeEntries: TaxKnowledgeEntry[] = [
  {
    id: "knowledge-001",
    title: "出口退税基本条件",
    category: "export_tax_refund",
    tags: ["出口退税", "基本条件", "一般纳税人"],
    summary: "企业办理出口退税须同时满足四个基本条件：一般纳税人资格、出口货物已报关离境、财务上已作出口销售处理、已收汇并核销。",
    content: `出口退税是国家对出口货物退还国内生产流通环节已纳税款的制度。卫浴企业办理出口退税须同时满足以下条件：

1. 必须是增值税一般纳税人（小规模纳税人不能退税，但可委托综服企业代办）
2. 出口货物必须已报关离境并取得报关单（出口退税专用联）
3. 财务上已作出口销售处理（确认收入）
4. 已收汇并办理核销手续（外汇管理局系统）

卫浴产品出口退税率：
- 陶瓷马桶/面盆（HS 6910）：退税率13%
- 不锈钢水槽（HS 7324）：退税率13%
- 水龙头/阀门（HS 8481）：退税率13%
- 浴室柜（HS 9403）：退税率13%
- 花洒/淋浴器（HS 7324）：退税率13%
- 浴缸（HS 6910/3922）：退税率13%

注意：退税率可能随国家政策调整，以出口当日税率为准。`,
    regulations: [
      "《出口货物劳务增值税和消费税管理办法》（国家税务总局公告2012年第24号）",
      "《财政部 国家税务总局关于出口货物劳务增值税和消费税政策的通知》（财税〔2012〕39号）",
      "《国家税务总局关于进一步便利出口退税办理 促进外贸平稳发展有关事项的公告》（2022年第9号）"
    ],
    applicableScenarios: ["一般贸易出口", "跨境电商B2B出口", "海外仓出口"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "knowledge-002",
    title: "四流一致合规要求",
    category: "four_flow_consistency",
    tags: ["四流一致", "合同流", "物流", "发票流", "资金流"],
    summary: "四流一致指合同流、物流（货物流）、发票流、资金流必须指向同一主体。这是出口退税和增值税抵扣的核心合规要求。",
    content: `四流一致是税务机关判断交易真实性的核心标准，也是出口退税和进项抵扣的前提条件。

四流定义：
1. 合同流：买卖双方签订的购销合同
2. 物流（货物流）：货物实际流向，以提单、运单、入库单等证明
3. 发票流：增值税专用发票的开具和接收
4. 资金流：货款的支付和收取

核心要求：
- 四流必须指向同一主体（合同方=开票方=收款方=发货方）
- 出口业务中，报关单上的经营单位须与合同方一致
- 支付货款须通过对公账户，不得使用个人账户

卫浴行业常见四流不一致场景：
- 从A公司采购，B公司开票，C公司收款
- 合同与A签订，货物从B仓库发出
- 出口报关用C公司抬头，实际是A公司货物
- 货款支付给个人账户

合规建议：
- 每笔业务建立四流匹配台账
- 定期进行四流一致性审计
- 发现不一致及时纠正并保留说明材料
- 确需代采/代工的，签订三方协议明确关系`,
    regulations: [
      "《中华人民共和国发票管理办法》第22条",
      "《国家税务总局关于加强增值税征收管理若干问题的通知》（国税发〔1995〕192号）",
      "《国家税务总局关于纳税人对外开具增值税专用发票有关问题的公告》（2014年第39号）"
    ],
    applicableScenarios: ["一般贸易出口", "跨境电商B2B", "国内采购"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "knowledge-003",
    title: "金税四期监控重点",
    category: "golden_tax_phase4",
    tags: ["金税四期", "大数据稽查", "银税互动", "风险预警"],
    summary: "金税四期实现税务、银行、海关、市监、社保、电力等多部门数据共享，通过大数据分析进行风险预警。卫浴企业须关注五大监控重点。",
    content: `金税四期（简称"金四"）是国家级税收管理信息系统，核心特征是多部门数据共享和智能风险分析。

五大监控重点：

1. 私户收款监控
- 个人账户单日/单笔大额交易（超5万元）自动预警
- 个人账户频繁收款（月超20笔）触发核查
- 银税直连后银行主动推送异常交易

2. 发票异常监控
- 进销项品名不匹配（如购进"陶瓷"开出"电子产品"）
- 顶额开票（单张发票金额接近限额）
- 夜间/节假日大量开票
- 作废发票比例异常

3. 产销逻辑监控
- 产量与水电能耗不匹配
- 原材料采购量与产成品量不匹配
- 运费与销售量不匹配
- 社保人数与工资人数不一致

4. 税负率监控
- 行业平均税负率±30%为正常区间
- 卫浴制造业增值税税负率约2.5%-4.5%
- 长期低于行业下限触发预警

5. 关联交易监控
- 关联交易定价明显偏离市场价
- 与低税率地区（如霍尔果斯、海南）企业频繁交易
- 跨境关联交易未申报

卫浴企业应对策略：
- 建立内部税务合规制度
- 定期进行税务健康检查
- 确保各系统数据逻辑自洽
- 主动进行税务自查自纠`,
    regulations: [
      "《关于进一步深化税收征管改革的意见》（中办、国办2021年）",
      "《税收征收管理法》第35条（核定征收情形）",
      "《金融机构大额交易和可疑交易报告管理办法》"
    ],
    applicableScenarios: ["所有卫浴出口企业"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "knowledge-004",
    title: "9710/9810/0110报关模式对比",
    category: "declaration_mode",
    tags: ["9710", "9810", "0110", "报关模式", "跨境电商"],
    summary: "9710（B2B直接出口）、9810（海外仓出口）、0110（一般贸易）是卫浴跨境电商三种主要报关模式，适用场景和退税规则各有不同。",
    content: `跨境电商出口三种主要报关模式对比：

一、9710（B2B直接出口）
- 适用场景：跨境电商企业直接出口给境外企业（B2B）
- 申报主体：跨境电商企业
- 物流方式：国际快递、专线物流、空运、海运
- 退税条件：须取得出口退税专用报关单，收汇后申报
- 优势：简化申报（可汇总申报），通关效率高
- 适合：通过阿里国际站、中国制造网等B2B平台成交的企业

二、9810（海外仓出口）
- 适用场景：货物先出口至海外仓，再从海外仓配送至消费者/零售商
- 申报主体：跨境电商企业
- 物流方式：海运/空运至海外仓
- 退税条件：货物进入海外仓并报关后即可申请退税（无需等待实际销售）
- 优势：提前退税，资金占用少
- 适合：使用亚马逊FBA、第三方海外仓的企业

三、0110（一般贸易）
- 适用场景：传统B2B批量出口
- 申报主体：有进出口经营权的企业
- 物流方式：海运/空运/陆运
- 退税条件：报关出口并收汇后申报
- 优势：流程成熟，适用面广
- 适合：传统外贸B2B出口

选择建议：
- 亚马逊FBA卖家：优先选择9810（可提前退税）
- B2B平台卖家：优先选择9710（简化申报）
- 传统外贸企业：0110即可
- 小批量B2C直邮：9610（本文未详述）`,
    regulations: [
      "《关于跨境电子商务综合试验区零售出口货物税收政策的通知》（财税〔2018〕103号）",
      "《海关总署关于跨境电子商务出口商品申报有关事宜的公告》（2020年第75号）",
      "《国家税务总局关于跨境电商出口退税有关事项的公告》"
    ],
    applicableScenarios: ["跨境电商B2B出口", "海外仓出口", "一般贸易出口"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "knowledge-005",
    title: "卫浴产品HS编码归类指南",
    category: "customs_code",
    tags: ["HS编码", "商品归类", "退税率", "海关"],
    summary: "卫浴产品HS编码归类直接影响出口退税率和关税税率。马桶、浴室柜、花洒、水龙头等主要品类编码不同，退税率从5%-13%不等。",
    content: `卫浴产品HS编码归类对照表（2025年版）：

第69章 陶瓷产品：
- 6910.10：陶瓷马桶、水箱（退税13%）
- 6910.90：其他陶瓷卫生设备（洗手盆、小便器等）（退税13%）
- 6911.10：陶瓷水槽（退税13%）

第73章 钢铁制品：
- 7324.10：不锈钢水槽（退税13%）
- 7324.29：浴缸（钢铁制）（退税13%）
- 7324.90：其他钢铁卫生器具（花洒、地漏等）（退税13%）

第84章 机械制品：
- 8481.80：水龙头、阀门（退税13%）
- 8481.90：水龙头/阀门零件（退税13%）

第39章 塑料制品：
- 3922.10：塑料浴缸、淋浴盘（退税13%）
- 3922.90：塑料马桶盖等（退税13%）

第94章 家具：
- 9403.60：浴室柜（木制）（退税13%）
- 9403.20：浴室柜（金属制）（退税13%）

第70章 玻璃制品：
- 7020.00：玻璃洗手盆、玻璃置物架（退税13%）

第68章 石制品：
- 6802.91：大理石台面、人造石台面（退税5%-13%视加工深度）

注意事项：
1. 每年1月1日HS编码可能调整，须关注最新版本
2. 多功能产品（如带灯镜子）按主要功能归类
3. 归类争议可向海关申请预归类
4. 错误归类可能导致补税+罚款`,
    regulations: [
      "《中华人民共和国进出口税则》（每年更新）",
      "《进出口商品归类管理规定》（海关总署令第252号）",
      "《关于公布进出口商品预归类决定的公告》"
    ],
    applicableScenarios: ["出口报关", "进口清关", "退税申报"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "knowledge-006",
    title: "小规模纳税人与一般纳税人选择",
    category: "taxpayer_identity",
    tags: ["纳税人身份", "小规模", "一般纳税人", "税负测算"],
    summary: "卫浴出口企业选择纳税人身份需综合考虑年销售额、进项占比、出口退税等因素。年出口超500万元须强制转为一般纳税人。",
    content: `纳税人身份选择决策指南：

一、强制登记条件
- 年应征增值税销售额超500万元 → 须登记为一般纳税人
- 年销售额未超500万元 → 可选择小规模或一般纳税人

二、小规模纳税人特点
- 征收率：3%（部分业务可减按1%）
- 不可抵扣进项税
- 不可申请出口退税
- 年销售额500万以下
- 会计核算要求较低

三、一般纳税人特点
- 税率：13%（销售货物）、6%（服务）
- 可抵扣进项税
- 可申请出口退税（退税率最高13%）
- 无销售额上限
- 会计核算要求较高

四、卫浴企业选择建议

情况1：年出口额>500万元
→ 必须转为一般纳税人
→ 否则多缴增值税且丧失退税权利

情况2：年出口额300-500万元，进项充足（>60%）
→ 建议主动转为一般纳税人
→ 进项抵扣+出口退税后实际税负可能低于3%

情况3：年出口额300-500万元，进项少（<30%）
→ 可维持小规模纳税人
→ 但须评估出口退税损失

情况4：年出口额<300万元
→ 维持小规模纳税人
→ 可委托综服企业代办退税

五、转登记注意事项
- 小规模转一般纳税人后不可转回（特定政策除外）
- 转登记前清理存货进项税
- 转登记后及时办理出口退税备案`,
    regulations: [
      "《增值税一般纳税人登记管理办法》（国家税务总局令第43号）",
      "《财政部 税务总局关于统一增值税小规模纳税人标准的通知》（财税〔2018〕33号）",
      "《国家税务总局关于小规模纳税人免征增值税政策有关征管问题的公告》"
    ],
    applicableScenarios: ["新设企业", "企业成长阶段", "税务筹划"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "knowledge-007",
    title: "出口退税单证备案要求",
    category: "document_compliance",
    tags: ["出口退税", "单证备案", "报关单", "提单"],
    summary: "出口退税申报须准备12类核心单证，包括报关单、发票、装箱单、提单等。单证不齐全或不合规将导致退税失败。",
    content: `出口退税单证备案清单（卫浴行业适用）：

一、核心单证（必备）
1. 出口货物报关单（出口退税专用联）
2. 增值税专用发票（进项发票）
3. 出口发票（企业自开）
4. 装箱单
5. 合同（外销合同/形式发票）

二、物流单证
6. 提单（海运）或空运单/国际快递单
7. 装货单（场站收据）
8. 运输发票（国内段运费）

三、收汇单证
9. 银行收汇水单/结汇水单
10. 外汇管理局核销证明（已取消纸质核销，系统自动比对）

四、其他单证
11. 委托报关协议（如委托报关行）
12. 代理出口协议（如委托代理出口）

单证管理要求：
- 所有单证须留存备查，保存期限10年
- 单证信息须相互一致（品名、数量、金额、日期）
- 报关单与发票的品名须一致（可大类一致）
- 提单上的发货人须与报关单经营单位一致

卫浴行业常见单证问题：
- 报关单品名与发票品名不一致（如报关写"陶瓷制品"，发票写"马桶"）
- 提单发货人与报关单经营单位不一致
- 装箱单数量与报关单申报数量不符
- 缺少国内运输发票（无法证明货物真实出口）

数字化建议：
- 使用电子单证管理系统
- 建立单证匹配校验规则
- 定期进行单证完整性检查`,
    regulations: [
      "《出口货物劳务增值税和消费税管理办法》第8条",
      "《国家税务总局关于出口退（免）税申报有关问题的公告》（2018年第16号）",
      "《国家税务总局关于进一步便利出口退税办理的公告》（2022年第9号）"
    ],
    applicableScenarios: ["出口退税申报", "税务稽查应对"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "knowledge-008",
    title: "跨境电商9810海外仓出口退税要点",
    category: "export_tax_refund",
    tags: ["9810", "海外仓", "出口退税", "FBA"],
    summary: "9810模式下货物进入海外仓即可申请退税，无需等待实际销售。但须满足备案、物流、销售等条件，且须在次年4月前完成销售。",
    content: `9810（海外仓出口）退税操作指南：

一、适用条件
1. 企业在跨境电商综试区备案
2. 已在海关办理跨境电商出口备案
3. 货物实际进入海外仓（自有仓或第三方仓）
4. 取得出口退税专用报关单

二、退税时间点
- 货物报关出口并进入海外仓后 → 即可申请退税
- 无需等待货物实际销售
- 但须在次年4月30日前完成销售或退货

三、所需单证
1. 出口货物报关单（9810监管方式）
2. 海外仓入库单/仓储合同
3. 增值税专用发票（进项）
4. 出口发票
5. 装箱单
6. 运输单据（头程物流）
7. 海外仓服务协议

四、注意事项
1. 货物进入海外仓后须在次年4月30日前销售
2. 未销售货物须办理退运或免税处理
3. 海外仓地址变更须及时更新备案
4. 亚马逊FBA仓视为海外仓，适用9810

五、常见问题
Q：FBA货物能否适用9810？
A：可以，亚马逊FBA仓属于海外仓范畴。

Q：9810退税与0110退税有何区别？
A：9810可提前退税（入仓即退），0110须收汇后退税。

Q：9810货物未在次年4月前售完怎么办？
A：未售部分须办理退运或转为免税处理。`,
    regulations: [
      "《海关总署关于跨境电商出口商品申报有关事宜的公告》（2020年第75号）",
      "《国家税务总局关于跨境电商综试区零售出口货物税收政策的通知》",
      "《商务部等六部门关于扩大跨境电商零售进口试点的通知》"
    ],
    applicableScenarios: ["亚马逊FBA卖家", "海外仓卖家", "跨境电商企业"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "knowledge-009",
    title: "卫浴行业税务红线清单",
    category: "general",
    tags: ["红线", "禁止行为", "高风险", "合规底线"],
    summary: "卫浴出口企业必须遵守的10条税务红线，触碰任何一条都将面临严重处罚，包括补税、罚款、降级、甚至刑事责任。",
    content: `卫浴行业税务红线清单（触碰即高危）：

🔴 红线1：虚开增值税专用发票
- 无真实交易开具发票
- 开具金额与实际交易不符
- 后果：补税+罚款+刑事责任（最高无期徒刑）

🔴 红线2：买单出口
- 借用他人抬头报关
- 购买出口数据骗取退税
- 后果：追税+罚款+海关失信+刑事责任

🔴 红线3：私户隐匿收入
- 通过个人微信/支付宝/银行卡收取货款
- 不入公账、不申报
- 后果：补税+罚款+滞纳金+银行账户冻结

🔴 红线4：骗取出口退税
- 虚构出口业务
- 高报价格骗取退税
- 后果：追回退税款+罚款1-5倍+刑事责任

🔴 红线5：四流不一致
- 合同/物流/发票/资金不匹配
- 后果：进项转出+补税+虚开认定

🔴 红线6：HS编码申报不实
- 故意归入高退税率编码
- 后果：补税+罚款+海关降级

🔴 红线7：海外VAT漏报
- 超阈值未注册VAT
- 后果：补税+罚款+平台封店

🔴 红线8：转让定价不合理
- 关联交易价格明显偏离市场价
- 后果：特别纳税调整+补税+利息

🔴 红线9：虚假申报出口退税
- 申报数量/金额与实际不符
- 后果：追税+罚款+暂停退税资格

🔴 红线10：拒不配合税务检查
- 拒绝提供账簿/凭证
- 销毁证据
- 后果：核定征收+从重处罚+移送公安`,
    regulations: [
      "《中华人民共和国刑法》第205条（虚开增值税专用发票罪）",
      "《中华人民共和国税收征收管理法》第63条（偷税）",
      "《中华人民共和国海关法》第24条",
      "《出口货物劳务增值税和消费税管理办法》"
    ],
    applicableScenarios: ["所有卫浴出口企业"],
    lastUpdated: "2025-01-01"
  },
  {
    id: "knowledge-010",
    title: "卫浴行业出口退税计算示例",
    category: "export_tax_refund",
    tags: ["出口退税", "计算示例", "退税额"],
    summary: "以佛山某马桶厂为例，详细演示出口退税计算过程：出口额1000万元，退税率13%，进项税额110万元，实际可退税额约110万元。",
    content: `卫浴行业出口退税计算示例：

【企业背景】
- 佛山某马桶厂，一般纳税人
- 年出口额：1,000万元（FOB价）
- 年原材料采购额：700万元（含税）
- 进项税率：13%
- 出口退税率：13%

【计算过程】

第一步：计算进项税额
进项税额 = 含税采购额 ÷ (1+13%) × 13%
= 700万 ÷ 1.13 × 13%
= 80.53万元

第二步：计算出口免抵退税额
免抵退税额 = 出口额 × 退税率
= 1,000万 × 13%
= 130万元

第三步：比较确定退税额
应退税额 = min(进项税额, 免抵退税额)
= min(80.53万, 130万)
= 80.53万元`,
    regulations: [
      "《出口货物劳务增值税和消费税管理办法》",
      "《财政部 国家税务总局关于出口货物劳务增值税和消费税政策的通知》"
    ],
    applicableScenarios: ["出口退税申报", "税务筹划"],
    lastUpdated: "2025-01-01"
  }
]

// ==================== 4. HS编码对照表 ====================

export const hsCodeTable: HSCodeEntry[] = [
  { hsCode: "6910.10", productName: "陶瓷马桶/坐便器", exportTaxRebateRate: 13, importTariffRate: 8, notes: "含智能马桶陶瓷主体" },
  { hsCode: "6910.90", productName: "其他陶瓷卫生设备", exportTaxRebateRate: 13, importTariffRate: 8, notes: "洗手盆、小便器等" },
  { hsCode: "7324.10", productName: "不锈钢水槽", exportTaxRebateRate: 13, importTariffRate: 8, notes: "厨房/卫生间水槽" },
  { hsCode: "7324.29", productName: "钢铁制浴缸", exportTaxRebateRate: 13, importTariffRate: 8, notes: "含铸铁浴缸、钢板浴缸" },
  { hsCode: "7324.90", productName: "其他钢铁卫生器具", exportTaxRebateRate: 13, importTariffRate: 8, notes: "花洒、地漏、毛巾架等" },
  { hsCode: "8481.80", productName: "水龙头/阀门", exportTaxRebateRate: 13, importTariffRate: 8, notes: "面盆龙头、厨房龙头等" },
  { hsCode: "8481.90", productName: "水龙头/阀门零件", exportTaxRebateRate: 13, importTariffRate: 8, notes: "阀芯、把手等" },
  { hsCode: "3922.10", productName: "塑料浴缸/淋浴盘", exportTaxRebateRate: 13, importTariffRate: 10, notes: "亚克力浴缸、淋浴底盘" },
  { hsCode: "3922.90", productName: "塑料马桶盖等", exportTaxRebateRate: 13, importTariffRate: 10, notes: "马桶盖板、塑料配件" },
  { hsCode: "9403.60", productName: "木制浴室柜", exportTaxRebateRate: 13, importTariffRate: 0, notes: "含实木、多层板浴室柜" },
  { hsCode: "9403.20", productName: "金属浴室柜", exportTaxRebateRate: 13, importTariffRate: 0, notes: "不锈钢/铝合金浴室柜" },
  { hsCode: "7020.00", productName: "玻璃洗手盆/置物架", exportTaxRebateRate: 13, importTariffRate: 10, notes: "钢化玻璃洗手盆" },
  { hsCode: "6802.91", productName: "大理石/人造石台面", exportTaxRebateRate: 5, importTariffRate: 12, notes: "加工后的大理石台面" },
  { hsCode: "6911.10", productName: "陶瓷水槽", exportTaxRebateRate: 13, importTariffRate: 8, notes: "陶瓷台上盆/台下盆" },
  { hsCode: "7615.20", productName: "铝制卫生器具", exportTaxRebateRate: 13, importTariffRate: 10, notes: "铝制毛巾架、置物架" },
]
