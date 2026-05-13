// ─── Amazon Policy Types ───

export interface AmazonPolicyUpdate {
  id: string;
  title: string;
  summary: string;
  category: "compliance" | "listing" | "safety" | "labeling" | "restricted" | "other";
  market: "US" | "EU" | "UK" | "CA" | "AU" | "global";
  severity: "critical" | "warning" | "info";
  affectedProducts: string[];
  effectiveDate: string;
  sourceUrl: string;
  publishedAt: string;
  details: string;
}

export interface AmazonPolicyCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  updateCount: number;
}

export const AMAZON_POLICY_CATEGORIES: AmazonPolicyCategory[] = [
  {
    id: "compliance",
    name: "合规要求",
    description: "亚马逊产品合规政策更新，包括认证要求变更",
    icon: "Shield",
    updateCount: 0,
  },
  {
    id: "listing",
    name: " listing 规则",
    description: "产品 listing 创建和编辑规则变更",
    icon: "FileText",
    updateCount: 0,
  },
  {
    id: "safety",
    name: "产品安全",
    description: "产品安全标准和召回信息",
    icon: "AlertTriangle",
    updateCount: 0,
  },
  {
    id: "labeling",
    name: "标签要求",
    description: "产品标签和包装要求变更",
    icon: "Tag",
    updateCount: 0,
  },
  {
    id: "restricted",
    name: "受限商品",
    description: "受限商品政策和禁售清单更新",
    icon: "Ban",
    updateCount: 0,
  },
];
