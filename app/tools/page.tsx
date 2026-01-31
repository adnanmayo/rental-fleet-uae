'use client';

import { useState } from "react";
import Link from "next/link";
import DownloadButton from "@/components/DownloadButton";
import { siteConfig } from "@/lib/site-config";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ToolsPage() {
  const [roiInputs, setRoiInputs] = useState({
    fleetSize: 50,
    monthlyRevenue: 250000,
    operationalCosts: 150000,
    softwareCost: 5000
  });

  const [pricingInputs, setPricingInputs] = useState({
    vehicleCost: 50000,
    dailyRate: 200,
    utilizationRate: 75
  });

  // ROI Calculator Logic
  const calculateROI = () => {
    const currentProfit = roiInputs.monthlyRevenue - roiInputs.operationalCosts;
    const projectedSavings = roiInputs.operationalCosts * 0.25; // 25% cost reduction
    const projectedRevenueIncrease = roiInputs.monthlyRevenue * 0.15; // 15% revenue increase
    const netBenefit = projectedSavings + projectedRevenueIncrease - roiInputs.softwareCost;
    const roi = ((netBenefit / roiInputs.softwareCost) * 100).toFixed(1);
    const paybackMonths = (roiInputs.softwareCost / (projectedSavings + projectedRevenueIncrease)).toFixed(1);

    return {
      currentProfit,
      projectedSavings,
      projectedRevenueIncrease,
      netBenefit,
      roi,
      paybackMonths
    };
  };

  // Pricing Calculator Logic
  const calculatePricing = () => {
    const annualRevenue = pricingInputs.dailyRate * 365 * (pricingInputs.utilizationRate / 100);
    const breakEvenDays = Math.ceil(pricingInputs.vehicleCost / pricingInputs.dailyRate);
    const yearlyProfit = annualRevenue - (pricingInputs.vehicleCost * 0.2); // 20% annual costs

    return {
      annualRevenue,
      breakEvenDays,
      yearlyProfit
    };
  };

  const roiResults = calculateROI();
  const pricingResults = calculatePricing();

  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools", href: "/tools" }]} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-amber-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Free Interactive Tools
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Rental Business Tools & Calculators
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Free calculators, templates, and resources to optimize your UAE rental business operations and maximize profitability
            </p>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Fleet Management Software ROI Calculator
              </h2>
              <p className="text-gray-700 text-lg">
                Calculate the return on investment for implementing {" "}
                <a
                  href={siteConfig.promotedSites.autycloud.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline font-semibold"
                  data-ga-event="cta_click"
                  data-ga-label="autycloud_tools_inline"
                  data-ga-category="outbound"
                >
                  fleet management software
                </a>
                {" "} in your rental business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fleet Size (Number of Vehicles)
                  </label>
                  <input
                    type="number"
                    value={roiInputs.fleetSize}
                    onChange={(e) => setRoiInputs({...roiInputs, fleetSize: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Revenue (AED)
                  </label>
                  <input
                    type="number"
                    value={roiInputs.monthlyRevenue}
                    onChange={(e) => setRoiInputs({...roiInputs, monthlyRevenue: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Operational Costs (AED)
                  </label>
                  <input
                    type="number"
                    value={roiInputs.operationalCosts}
                    onChange={(e) => setRoiInputs({...roiInputs, operationalCosts: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Software Cost (AED)
                  </label>
                  <input
                    type="number"
                    value={roiInputs.softwareCost}
                    onChange={(e) => setRoiInputs({...roiInputs, softwareCost: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Projected Results</h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-blue-200 mb-1">ROI Percentage</div>
                    <div className="text-4xl font-bold">{roiResults.roi}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-200 mb-1">Payback Period</div>
                    <div className="text-3xl font-bold">{roiResults.paybackMonths} months</div>
                  </div>
                  <div className="pt-4 border-t border-blue-400">
                    <div className="text-sm text-blue-200 mb-1">Monthly Cost Savings</div>
                    <div className="text-2xl font-bold">AED {roiResults.projectedSavings.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-blue-200 mb-1">Projected Revenue Increase</div>
                    <div className="text-2xl font-bold">AED {roiResults.projectedRevenueIncrease.toLocaleString()}</div>
                  </div>
                  <div className="pt-4 border-t border-blue-400">
                    <div className="text-sm text-blue-200 mb-1">Net Monthly Benefit</div>
                    <div className="text-3xl font-bold text-green-300">AED {roiResults.netBenefit.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-blue-100 border-l-4 border-blue-600 p-6">
              <p className="text-gray-700">
                <strong>Note:</strong> Calculations based on industry averages showing 25% cost reduction and 15% revenue increase with proper fleet management software implementation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Pricing Calculator */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Vehicle Pricing & Profitability Calculator
              </h2>
              <p className="text-gray-700 text-lg">
                Determine optimal pricing and expected returns for your rental vehicles.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Vehicle Purchase Cost (AED)
                  </label>
                  <input
                    type="number"
                    value={pricingInputs.vehicleCost}
                    onChange={(e) => setPricingInputs({...pricingInputs, vehicleCost: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Daily Rental Rate (AED)
                  </label>
                  <input
                    type="number"
                    value={pricingInputs.dailyRate}
                    onChange={(e) => setPricingInputs({...pricingInputs, dailyRate: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expected Utilization Rate (%)
                  </label>
                  <input
                    type="number"
                    value={pricingInputs.utilizationRate}
                    onChange={(e) => setPricingInputs({...pricingInputs, utilizationRate: parseInt(e.target.value) || 0})}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    UAE average: 70-80% for well-managed fleets
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Expected Performance</h3>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-amber-200 mb-1">Annual Revenue</div>
                    <div className="text-4xl font-bold">AED {pricingResults.annualRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-amber-200 mb-1">Break-Even Period</div>
                    <div className="text-3xl font-bold">{pricingResults.breakEvenDays} days</div>
                  </div>
                  <div className="pt-4 border-t border-amber-400">
                    <div className="text-sm text-amber-200 mb-1">Estimated Annual Profit</div>
                    <div className="text-3xl font-bold text-green-300">AED {pricingResults.yearlyProfit.toLocaleString()}</div>
                  </div>
                  <div className="mt-6 text-sm text-amber-100">
                    <p>Based on {pricingInputs.utilizationRate}% utilization at AED {pricingInputs.dailyRate}/day</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloadable Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Free Downloadable Templates
            </h2>
            <p className="text-xl text-gray-600">
              Professional templates and guides to streamline your operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Fleet Management Checklist",
                description: "Comprehensive daily, weekly, and monthly operational checklist",
                file: "fleet-management-checklist.pdf",
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                )
              },
              {
                title: "Rental Pricing Template",
                description: "Excel spreadsheet for dynamic pricing strategy optimization",
                file: "pricing-calculator-template.xlsx",
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "UAE Compliance Guide",
                description: "Complete regulatory compliance checklist for rental businesses",
                file: "uae-compliance-guide.pdf",
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              },
              {
                title: "Customer Service Scripts",
                description: "Pre-written scripts for common rental scenarios",
                file: "customer-service-scripts.pdf",
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                )
              },
              {
                title: "Fleet Size Optimizer",
                description: "Worksheet to determine optimal fleet size for your market",
                file: "fleet-size-optimizer.xlsx",
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                title: "2026 Market Report",
                description: "Comprehensive UAE rental market analysis and trends",
                file: "uae-rental-market-report-2026.pdf",
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((resource, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all border border-gray-200">
                <div className="text-blue-600 mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">{resource.description}</p>
                <DownloadButton
                  title="Download"
                  file={resource.file}
                  className="w-full justify-center"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for a Complete Solution?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Explore {" "}
            <a
              href={siteConfig.promotedSites.autycloud.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-white"
              data-ga-event="cta_click"
              data-ga-label="autycloud_tools_cta_inline"
              data-ga-category="outbound"
            >
              AutyCloud
            </a>
            {" "} - the all-in-one fleet management platform trusted by UAE rental businesses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={siteConfig.promotedSites.autycloud.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all shadow-lg"
              data-ga-event="cta_click"
              data-ga-label="autycloud_tools_cta"
              data-ga-category="outbound"
            >
              Try AutyCloud Free
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Next (Internal Links) */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/resources" className="bg-gray-50 border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Free resources</div>
              <div className="text-sm text-gray-600">Templates and reports to speed up ops →</div>
            </Link>
            <Link href="/blog" className="bg-gray-50 border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Read guides</div>
              <div className="text-sm text-gray-600">Best practices for fleet and rentals →</div>
            </Link>
            <Link href="/compare" className="bg-gray-50 border rounded-2xl p-6 hover:shadow-md transition">
              <div className="font-bold text-gray-900 mb-1">Compare vehicles</div>
              <div className="text-sm text-gray-600">Side-by-side comparisons →</div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
