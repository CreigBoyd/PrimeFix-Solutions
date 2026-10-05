// src/routes/pageRegistry.js

// Page chunk loaders
export const pageImports = {
  home: () => import('../pages/Home'),
  reviews: () => import('../pages/Reviews'),
  services: () => import('../pages/ServiceExplorer'),
  maintenance: () => import('../pages/MaintenancePlans'),
  portfolio: () => import('../pages/BeforeAfterPortfolio'),
  estimator: () => import('../pages/CostEstimator'),
  faq: () => import('../pages/FAQ'),
  notFound: () => import('../pages/NotFound'),
  privacy: () => import('../pages/Privacy'),
  terms: () => import('../pages/Terms')
}