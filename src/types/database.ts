export type Plan = 'free' | 'premium'
export type GoalType = 'save' | 'debt' | 'invest' | 'custom'
export type GoalStatus = 'active' | 'completed' | 'paused'
export type AccountType = 'checking' | 'savings' | 'credit' | 'investment'
export type ActionStatus = 'pending' | 'executed' | 'failed'
export type ProductType = 'credit_card' | 'loan' | 'investment' | 'insurance'

export interface Profile {
  id: string
  full_name: string | null
  plan: Plan
  stripe_customer_id: string | null
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  type: GoalType
  title: string
  target_amount: number | null
  target_date: string | null
  monthly_contribution: number | null
  status: GoalStatus
  created_at: string
}

export interface Account {
  id: string
  user_id: string
  plaid_account_id: string | null
  name: string
  type: AccountType | null
  current_balance: number
  institution_name: string | null
  last_synced_at: string | null
}

export interface Transaction {
  id: string
  account_id: string
  user_id: string
  plaid_transaction_id: string | null
  amount: number
  category: string | null
  merchant_name: string | null
  description: string | null
  date: string
  is_recurring: boolean
}

export interface AIPlan {
  id: string
  user_id: string
  summary: string | null
  recommendations: ProductRecommendation[] | null
  raw_ai_response: string | null
  created_at: string
}

export interface AgentAction {
  id: string
  user_id: string
  action_type: 'savings_transfer' | 'debt_payment' | 'rebalance_suggestion'
  description: string | null
  status: ActionStatus
  executed_at: string | null
  metadata: Record<string, unknown> | null
}

export interface Recommendation {
  id: string
  user_id: string
  product_type: ProductType | null
  product_name: string | null
  rationale: string | null
  affiliate_url: string | null
  commission_min: number | null
  commission_max: number | null
  clicked_at: string | null
  converted_at: string | null
  shown_at: string
}

export interface ProductRecommendation {
  type: ProductType
  name: string
  why_relevant: string
  estimated_savings_or_benefit: string
  action_url?: string
  commission_range?: string
}

export interface AIGeneratedPlan {
  executive_summary: string
  spending_insights: {
    category: string
    observation: string
    suggested_action: string
  }[]
  goal_recommendations: {
    goal_title: string
    achievable: boolean
    assessment: string
    changes_needed: string[]
  }[]
  product_recommendations: ProductRecommendation[]
  agent_actions: {
    action_type: string
    description: string
    estimated_impact: string
  }[]
}
