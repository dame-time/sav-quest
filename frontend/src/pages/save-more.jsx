import Head from "next/head";
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { FiBookOpen, FiDollarSign, FiHome, FiSunrise, FiTrendingUp, FiTarget, FiArrowUp, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';

// GradientGrid component for the background
const GradientGrid = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 2.5,
        ease: "easeInOut",
      }}
      className="absolute inset-0 z-0"
    >
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
        className="absolute inset-0 z-0"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </motion.div>
  );
};

export default function SaveMore() {
  const [savingsRate, setSavingsRate] = useState(15);
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch insights from the API when savings rate changes
  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/v1/savings-opportunities/insights`, {
          params: {
            monthly_income: monthlyIncome,
            savings_rate: savingsRate,
          },
        });
        setInsights(response.data);
      } catch (err) {
        console.error('Error fetching savings insights:', err);
        setError('Failed to fetch savings insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce the API call to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchInsights();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [savingsRate, monthlyIncome]);

  const handleSavingsRateChange = (e) => {
    setSavingsRate(parseInt(e.target.value, 10));
  };

  const handleIncomeChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      setMonthlyIncome(value);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-200">
      <Head>
        <title>Save More | SavQuest</title>
        <meta name="description" content="Explore what you could achieve with different savings rates" />
      </Head>

      <GradientGrid />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">Save More</h1>
          <p className="mt-4 text-xl text-zinc-400">
            Explore what you could achieve with different savings rates. Adjust the slider below to see how saving a percentage of your income could transform your financial future.
          </p>
        </div>

        <div className="mb-8 overflow-hidden rounded-lg bg-zinc-900 shadow">
          <div className="p-6">
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="monthly-income" className="mb-2 block text-lg font-medium text-white">
                  Monthly Income
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-zinc-400">$</span>
                  </div>
                  <input
                    type="number"
                    id="monthly-income"
                    value={monthlyIncome}
                    onChange={handleIncomeChange}
                    className="block w-full rounded-md border-zinc-700 bg-zinc-800 pl-7 pr-12 pb-2.5 pt-2.5 text-white focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="savings-rate" className="mb-2 block text-lg font-medium text-white">
                  Savings Rate: {savingsRate}%
                </label>
                <input
                  type="range"
                  id="savings-rate"
                  min="1"
                  max="30"
                  value={savingsRate}
                  onChange={handleSavingsRateChange}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700"
                />
                <div className="mt-2 flex justify-between text-xs text-zinc-400">
                  <span>1%</span>
                  <span>15%</span>
                  <span>30%</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
                <span className="ml-2 text-zinc-400">Loading insights...</span>
              </div>
            ) : error ? (
              <div className="rounded-md bg-red-900/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-400">Error</h3>
                    <div className="mt-2 text-sm text-red-300">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : insights ? (
              <>
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="overflow-hidden rounded-lg bg-zinc-800 shadow">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                          <FiDollarSign className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h2 className="text-lg font-medium text-white">Monthly Savings</h2>
                          <p className="text-3xl font-bold text-indigo-400">${insights.monthly_savings.toFixed(2)}</p>
                          <p className="text-sm text-zinc-400">Based on ${insights.monthly_income.toFixed(2)} monthly income</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg bg-zinc-800 shadow">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                          <FiTrendingUp className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <h2 className="text-lg font-medium text-white">Yearly Savings</h2>
                          <p className="text-3xl font-bold text-indigo-400">${insights.yearly_savings.toFixed(2)}</p>
                          <p className="text-sm text-zinc-400">What you could save in one year</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="mb-4 text-2xl font-bold text-white">Investment Projections</h2>
                  <p className="mb-4 text-zinc-400">Based on an 8% average annual return (S&P 500 historical average)</p>

                  <div className="overflow-hidden rounded-lg bg-zinc-800 shadow">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-zinc-700">
                        <thead className="bg-zinc-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-400">
                              Time Period
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                              Total Invested
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                              Future Value
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-400">
                              Interest Earned
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-700 bg-zinc-800">
                          {insights.investment_projections.map((projection) => (
                            <tr key={projection.years} className="hover:bg-zinc-700">
                              <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-300">
                                {projection.years} {projection.years === 1 ? 'Year' : 'Years'}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-zinc-300">
                                ${projection.total_invested.toLocaleString()}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-indigo-400">
                                ${projection.future_value.toLocaleString()}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-green-400">
                                ${projection.interest_earned.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="mb-4 text-2xl font-bold text-white">Savings Opportunities</h2>
                  <p className="mb-6 text-zinc-400">Here's what you could do with your savings</p>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="overflow-hidden rounded-lg bg-zinc-800 shadow">
                      <div className="p-5">
                        <div className="mb-4 flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                            <FiBookOpen className="h-5 w-5" />
                          </div>
                          <h3 className="ml-3 text-xl font-medium text-white">Financial Education</h3>
                        </div>
                        <div className="mb-4 border-t border-zinc-700 pt-4">
                          <p className="mb-4 text-zinc-300">
                            {insights.opportunity_insights.financial_education.description}
                          </p>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start">
                              <span className="mr-2 text-indigo-400">•</span>
                              {insights.opportunity_insights.financial_education.books_per_month} finance books per month
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-indigo-400">•</span>
                              {insights.opportunity_insights.financial_education.courses_per_month} online courses per month
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-indigo-400">•</span>
                              Potential {insights.opportunity_insights.financial_education.potential_income_increase}% income increase through new knowledge
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-zinc-800 shadow">
                      <div className="p-5">
                        <div className="mb-4 flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                            <FiDollarSign className="h-5 w-5" />
                          </div>
                          <h3 className="ml-3 text-xl font-medium text-white">Investment Opportunities</h3>
                        </div>
                        <div className="mb-4 border-t border-zinc-700 pt-4">
                          <p className="mb-4 text-zinc-300">
                            {insights.opportunity_insights.investment_opportunities.description}
                          </p>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start">
                              <span className="mr-2 text-indigo-400">•</span>
                              ${insights.opportunity_insights.investment_opportunities.yearly_investment.toLocaleString()} yearly investment
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-indigo-400">•</span>
                              ${insights.opportunity_insights.investment_opportunities.dividend_income.toLocaleString()} potential yearly dividend income
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-zinc-800 shadow">
                      <div className="p-5">
                        <div className="mb-4 flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-white">
                            <FiHome className="h-5 w-5" />
                          </div>
                          <h3 className="ml-3 text-xl font-medium text-white">Major Purchases</h3>
                        </div>
                        <div className="mb-4 border-t border-zinc-700 pt-4">
                          <p className="mb-4 text-zinc-300">
                            {insights.opportunity_insights.major_purchases.description}
                          </p>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start">
                              <span className="mr-2 text-indigo-400">•</span>
                              ${insights.opportunity_insights.major_purchases.home_down_payment_5yr.toLocaleString()} for home down payment in 5 years
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-indigo-400">•</span>
                              {insights.opportunity_insights.major_purchases.vehicles_per_year} vehicle(s) per year
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-indigo-400">•</span>
                              {insights.opportunity_insights.major_purchases.home_improvements_per_year} home improvement projects per year
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-lg bg-zinc-800 shadow">
                      <div className="p-5">
                        <div className="mb-4 flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                            <FiSunrise className="h-5 w-5" />
                          </div>
                          <h3 className="ml-3 text-xl font-medium text-white">Lifestyle Improvements</h3>
                        </div>
                        <div className="mb-4 border-t border-zinc-700 pt-4">
                          <p className="mb-4 text-zinc-300">
                            {insights.opportunity_insights.lifestyle_improvements.description}
                          </p>
                          <ul className="space-y-2 text-zinc-400">
                            <li className="flex items-start">
                              <span className="mr-2 text-indigo-400">•</span>
                              {insights.opportunity_insights.lifestyle_improvements.vacations_per_year} vacation(s) per year
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 text-indigo-400">•</span>
                              ${insights.opportunity_insights.lifestyle_improvements.monthly_housing_upgrade.toLocaleString()} monthly housing upgrade
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-md bg-indigo-900/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiTarget className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-indigo-400">Get Started</h3>
                    <div className="mt-2 text-sm text-indigo-300">
                      <p>Adjust the savings rate slider to see your potential savings opportunities.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 