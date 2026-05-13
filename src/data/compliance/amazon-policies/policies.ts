// ─── Amazon Policy Data ───
// Structured policy updates relevant to bathroom/kitchen product sellers

import type { AmazonPolicyUpdate } from "./types";

export const AMAZON_POLICY_UPDATES: AmazonPolicyUpdate[] = [
  {
    id: "ap-2026-04-01",
    title: "美国：卫浴产品饮用水接触材料 NSF/ANSI 61 认证要求强化",
    summary:
      "亚马逊美国站更新卫浴产品合规政策，所有接触饮用水的产品（水龙头、阀门、管道件等）必须提供 NSF/ANSI 61 认证，否则将面临 listing 下架。新政策适用于所有新上架和现有 listing。",
    category: "compliance",
    market: "US",
    severity: "critical",
    affectedProducts: ["faucet", "valve", "pipe", "fitting", "water_heater", "water_treatment"],
    effectiveDate: "2026-06-01",
    sourceUrl: "https://sellercentral.amazon.com/help/hub/reference/G200141480",
    publishedAt: "2026-04-01",
    details: `## 政策变更详情

### 变更内容
亚马逊美国站将 NSF/ANSI 61（饮用水系统组件健康影响）认证从"建议"升级为"强制"要求，适用于所有接触饮用水的卫浴产品。

### 受影响产品
- 厨房/浴室水龙头（faucet）
- 阀门（valve）
- 管道及管件（pipe, fitting）
- 热水器（water heater）
- 净水器（water treatment）

### 时间线
- **2026年4月1日**：政策公告
- **2026年5月1日**：开始抽查，不合规产品收到警告
- **2026年6月1日**：全面执行，不合规产品将被下架

### 应对建议
1. 确认产品是否接触饮用水
2. 联系 IAPMO、NSF 或 UL 进行 NSF/ANSI 61 检测
3. 检测周期约 4-8 周，费用 $2,000-$5,000
4. 取得认证后更新 listing 的合规信息`,
  },
  {
    id: "ap-2026-03-15",
    title: "加州：CEC Title 20 水效标准更新，龙头最大流量降至 1.2 GPM",
    summary:
      "加州能源委员会（CEC）更新 Title 20 水效标准，厨房龙头最大流量从 1.8 GPM 降至 1.2 GPM，浴室龙头降至 1.0 GPM。亚马逊加州站将同步执行。",
    category: "compliance",
    market: "CA",
    severity: "critical",
    affectedProducts: ["faucet", "shower_head", "valve"],
    effectiveDate: "2026-07-01",
    sourceUrl: "https://www.energy.ca.gov/standards",
    publishedAt: "2026-03-15",
    details: `## 政策变更详情

### 新流量标准
| 产品类型 | 旧标准 | 新标准 |
|---------|--------|--------|
| 厨房龙头 | 1.8 GPM | 1.2 GPM |
| 浴室龙头 | 1.5 GPM | 1.0 GPM |
| 花洒 | 2.0 GPM | 1.8 GPM |

### 执行时间
- **2026年7月1日**：新标准生效
- **2026年9月1日**：亚马逊开始强制核查

### 应对建议
1. 检查现有产品流量是否符合新标准
2. 需要更新产品的起泡器/限流器
3. 重新申请 CEC 认证
4. 更新产品标签和 listing 描述`,
  },
  {
    id: "ap-2026-02-20",
    title: "欧盟：CE 标志产品需提供欧盟负责人（EU Responsible Person）信息",
    summary:
      "亚马逊欧盟站加强 CE 标志合规审核，所有带 CE 标志的产品必须在 listing 中明确标注欧盟负责人信息（公司名称、地址、联系方式），否则将被移除。",
    category: "compliance",
    market: "EU",
    severity: "warning",
    affectedProducts: [
      "faucet", "shower_head", "shower_tray", "toilet", "bidet",
      "bathtub", "washbasin", "valve", "water_heater", "water_treatment",
    ],
    effectiveDate: "2026-05-01",
    sourceUrl: "https://sellercentral.amazon.eu/help/hub/reference/G202109020",
    publishedAt: "2026-02-20",
    details: `## 政策变更详情

### 新要求
根据欧盟《市场监督条例》(EU) 2019/1020，所有 CE 标志产品必须指定一名欧盟境内负责人。

### 负责人职责
- 确认产品符合相关欧盟法规
- 保存技术文件
- 配合市场监管机构

### 应对建议
1. 确认产品是否带 CE 标志
2. 指定欧盟境内负责人（可委托第三方服务商）
3. 在产品和包装上标注负责人信息
4. 更新亚马逊 listing 的合规信息`,
  },
  {
    id: "ap-2026-01-10",
    title: "英国：UKCA 标志过渡期延长至 2027 年底",
    summary:
      "英国政府宣布 UKCA 标志的强制实施日期再次延长至 2027 年 12 月 31 日。在此之前，CE 标志产品仍可在英国市场销售。但亚马逊建议卖家尽早准备 UKCA 认证。",
    category: "compliance",
    market: "UK",
    severity: "info",
    affectedProducts: [
      "faucet", "shower_head", "toilet", "bidet", "bathtub",
      "valve", "water_heater", "pipe", "fitting",
    ],
    effectiveDate: "2027-12-31",
    sourceUrl: "https://www.gov.uk/guidance/using-the-ukca-marking",
    publishedAt: "2026-01-10",
    details: `## 政策变更详情

### 过渡期延长
UKCA 标志强制实施日期从 2025 年 1 月 1 日延长至 2027 年 12 月 31 日。

### 当前状态
- CE 标志产品在英国市场继续有效
- UKCA 认证仍为自愿
- 建议新开发产品直接申请 UKCA

### 应对建议
1. 现有 CE 产品无需立即变更
2. 新产品开发建议直接申请 UKCA
3. 关注英国政府后续公告`,
  },
  {
    id: "ap-2026-04-05",
    title: "美国：亚马逊加强智能卫浴产品 UL 认证审核",
    summary:
      "亚马逊美国站加强对含电气组件的卫浴产品（智能马桶盖、电热水龙头、感应水龙头等）的 UL 认证审核。未提供 UL 认证的产品将被限制上架。",
    category: "safety",
    market: "US",
    severity: "warning",
    affectedProducts: ["toilet", "bidet", "faucet", "water_heater", "shower_head"],
    effectiveDate: "2026-05-15",
    sourceUrl: "https://sellercentral.amazon.com/help/hub/reference/G200141480",
    publishedAt: "2026-04-05",
    details: `## 政策变更详情

### 背景
智能卫浴产品销量增长，亚马逊收到多起电气安全投诉，决定加强 UL 认证审核。

### 受影响产品
- 智能马桶盖/智能马桶
- 电热水龙头
- 感应式水龙头
- 电热毛巾架
- 带 LED/加热功能的花洒

### 应对建议
1. 确认产品是否含电气组件
2. 联系 UL、Intertek 或 TUV 进行安全检测
3. 常见标准：UL 1431（个人卫浴器具）、UL 1951（电动管道器具）
4. 检测周期约 6-10 周`,
  },
  {
    id: "ap-2026-03-01",
    title: "澳大利亚：WaterMark 认证范围扩大至商用卫浴产品",
    summary:
      "澳大利亚建筑规范委员会（ABCB）更新 WaterMark 认证范围，商用卫浴产品（商用龙头、感应冲水阀、公共浴室设备）纳入强制认证范围。",
    category: "compliance",
    market: "AU",
    severity: "warning",
    affectedProducts: ["faucet", "valve", "flushometer", "urinal", "toilet"],
    effectiveDate: "2026-08-01",
    sourceUrl: "https://www.abcb.gov.au/watermark",
    publishedAt: "2026-03-01",
    details: `## 政策变更详情

### 新范围
WaterMark 认证从家用产品扩展至商用卫浴产品。

### 新增受影响产品
- 商用感应水龙头
- 感应冲水阀（flushometer）
- 小便器（urinal）
- 商用马桶
- 公共浴室混水阀

### 应对建议
1. 确认产品是否用于商业/公共建筑
2. 联系 JAS-ANZ 认可的认证机构
3. 准备产品技术文件和测试报告`,
  },
];

export function getPolicyUpdates(options?: {
  market?: string;
  category?: string;
  severity?: string;
  limit?: number;
}): AmazonPolicyUpdate[] {
  let filtered = [...AMAZON_POLICY_UPDATES];

  if (options?.market) {
    filtered = filtered.filter(
      (p) => p.market === options.market || p.market === "global"
    );
  }
  if (options?.category) {
    filtered = filtered.filter((p) => p.category === options.category);
  }
  if (options?.severity) {
    filtered = filtered.filter((p) => p.severity === options.severity);
  }

  // Sort by publishedAt descending
  filtered.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  if (options?.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

export function getCriticalUpdates(): AmazonPolicyUpdate[] {
  return getPolicyUpdates({ severity: "critical" });
}

export function getUpdatesForProduct(productType: string): AmazonPolicyUpdate[] {
  return AMAZON_POLICY_UPDATES.filter((p) =>
    p.affectedProducts.includes(productType)
  ).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
