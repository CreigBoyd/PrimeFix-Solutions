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
  terms: () => import('../pages/Terms'),
  servicesHub: () => import('../pages/ServicesHub'),
  servicePage: () => import('../pages/ServicePage'),
  areasHub: () => import('../pages/AreasHub'),
  areaPage: () => import('../pages/AreaPage'),
  about: () => import('../pages/About'),
  contact: () => import('../pages/ContactPage'),
  guidesHub: () => import('../pages/GuidesHub'),
  guidePage: () => import('../pages/GuidePage')
}