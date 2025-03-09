import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FiDollarSign, FiTarget, FiTrendingUp, FiCalendar, FiCoffee, FiShoppingBag, FiHome, FiCreditCard, FiEdit, FiSave, FiRefreshCw, FiFileText } from "react-icons/fi";
import Link from "next/link";

// GradientGrid component for the background (reused from statement-analysis.jsx)
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

export default function SavingsPlanner() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingsTarget, setSavingsTarget] = useState(0);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempSavingsTarget, setTempSavingsTarget] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  
  // Expense data from statement analysis
  const [expenseData, setExpenseData] = useState({
    averageMonthlyIncome: 0,
    averageMonthlyExpenses: 0,
    topCategories: [],
    currentSavingsRate: 0,
  });

  // Add a state to track if data is available
  const [dataAvailable, setDataAvailable] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("savquest_user");
    if (!userData) {
      router.push("/signin");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load savings target from localStorage if available
    const savedTarget = localStorage.getItem("savquest_savings_target");
    if (savedTarget) {
      setSavingsTarget(parseFloat(savedTarget));
      setTempSavingsTarget(parseFloat(savedTarget));
    }
    
    // Load expense data from localStorage if available
    const savedExpenseData = localStorage.getItem("savquest_expense_data");
    if (savedExpenseData) {
      setExpenseData(JSON.parse(savedExpenseData));
      setDataAvailable(true);
    }
    
    // Load AI suggestions from localStorage if available
    const savedSuggestions = localStorage.getItem("savquest_ai_suggestions");
    if (savedSuggestions) {
      setAiSuggestions(JSON.parse(savedSuggestions));
    }
    
    setLoading(false);
  }, [router]);

  // Update expense data based on statement analysis results
  useEffect(() => {
    // First check if there's already saved expense data
    const savedExpenseData = localStorage.getItem("savquest_expense_data");
    if (savedExpenseData) {
      try {
        const parsedData = JSON.parse(savedExpenseData);
        setExpenseData(parsedData);
        setDataAvailable(true);
        console.log("Loaded expense data from localStorage:", parsedData);
      } catch (error) {
        console.error("Error parsing saved expense data:", error);
        setDataAvailable(false);
      }
    } else {
      // If no saved expense data, try to get it from analysis results
      const analysisResults = localStorage.getItem("savquest_analysis_results");
      if (analysisResults) {
        try {
          const results = JSON.parse(analysisResults);
          
          // Calculate average monthly values
          const newExpenseData = {
            averageMonthlyIncome: results.totalIncome || 0,
            averageMonthlyExpenses: results.totalExpenses || 0,
            topCategories: results.topCategories || [],
            currentSavingsRate: results.savingsRate || 0,
            numStatements: results.numStatements || 1,
            totalIncomeAllStatements: results.totalIncomeAllStatements,
            totalExpensesAllStatements: results.totalExpensesAllStatements
          };
          
          setExpenseData(newExpenseData);
          setDataAvailable(newExpenseData.averageMonthlyIncome > 0);
          localStorage.setItem("savquest_expense_data", JSON.stringify(newExpenseData));
          console.log("Created expense data from analysis results:", newExpenseData);
        } catch (error) {
          console.error("Error parsing analysis results:", error);
          setDataAvailable(false);
        }
      } else {
        console.log("No expense data or analysis results found in localStorage");
        setDataAvailable(false);
      }
    }
  }, []);

  const handleSavingsTargetChange = (e) => {
    setTempSavingsTarget(parseFloat(e.target.value) || 0);
  };

  const saveSavingsTarget = () => {
    setSavingsTarget(tempSavingsTarget);
    localStorage.setItem("savquest_savings_target", tempSavingsTarget.toString());
    setIsEditingTarget(false);
    
    // Generate new suggestions when target changes
    generateAiSuggestions();
  };

  const generateAiSuggestions = async () => {
    setGeneratingSuggestions(true);
    
    try {
      // Prepare the request data
      const requestData = {
        averageMonthlyIncome: expenseData.averageMonthlyIncome,
        averageMonthlyExpenses: expenseData.averageMonthlyExpenses,
        currentSavingsRate: expenseData.currentSavingsRate,
        targetSavingsRate: tempSavingsTarget || savingsTarget,
        topCategories: expenseData.topCategories
      };
      
      // Call the backend API
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/savings-planner/suggestions`;
      console.log("Sending request to:", apiUrl, requestData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('savquest_token')}`
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate savings suggestions');
      }
      
      const result = await response.json();
      console.log("API Response:", result);
      
      setAiSuggestions(result);
      localStorage.setItem("savquest_ai_suggestions", JSON.stringify(result));
      
    } catch (error) {
      console.error("Error generating suggestions:", error);
      
      // Fall back to client-side calculations if the API fails
      fallbackGenerateSuggestions();
    } finally {
      setGeneratingSuggestions(false);
    }
  };
  
  // Fallback function to generate suggestions client-side if the API fails
  const fallbackGenerateSuggestions = () => {
    try {
      // Calculate how much needs to be saved
      const targetSavingsAmount = (expenseData.averageMonthlyIncome * (tempSavingsTarget / 100));
      const currentSavingsAmount = (expenseData.averageMonthlyIncome * (expenseData.currentSavingsRate / 100));
      const additionalSavingsNeeded = targetSavingsAmount - currentSavingsAmount;
      
      // Calculate daily and weekly spending limits
      const dailySpendingLimit = (expenseData.averageMonthlyIncome - targetSavingsAmount) / 30;
      const weeklySpendingLimit = (expenseData.averageMonthlyIncome - targetSavingsAmount) / 4.3;
      
      // Generate category-specific suggestions
      const categorySuggestions = expenseData.topCategories.map(category => {
        const percentReduction = Math.min(25, Math.max(5, additionalSavingsNeeded / expenseData.averageMonthlyExpenses * 100));
        const suggestedReduction = category.amount * (percentReduction / 100);
        const newAmount = category.amount - suggestedReduction;
        
        let tip = "";
        switch(category.name.toLowerCase()) {
          case "food":
            tip = "Try meal prepping on weekends to reduce food costs.";
            break;
          case "entertainment":
            tip = "Look for free or low-cost entertainment options in your area.";
            break;
          case "shopping":
            tip = "Consider a 24-hour waiting period before non-essential purchases.";
            break;
          case "transportation":
            tip = "Combine errands to save on fuel or transit costs.";
            break;
          default:
            tip = `Look for ways to reduce ${category.name.toLowerCase()} expenses by ${percentReduction.toFixed(1)}%.`;
        }
        
        return {
          category: category.name,
          currentAmount: category.amount,
          suggestedAmount: newAmount,
          reduction: suggestedReduction,
          tip
        };
      });
      
      const suggestions = {
        targetSavingsRate: tempSavingsTarget,
        targetSavingsAmount,
        currentSavingsAmount,
        additionalSavingsNeeded,
        dailySpendingLimit,
        weeklySpendingLimit,
        categorySuggestions,
        generalTips: [
          "Set up automatic transfers to your savings account on payday",
          "Use cash for discretionary spending to make it more tangible",
          "Review subscriptions monthly and cancel unused services",
          "Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings"
        ]
      };
      
      setAiSuggestions(suggestions);
      localStorage.setItem("savquest_ai_suggestions", JSON.stringify(suggestions));
    } catch (error) {
      console.error("Error in fallback suggestion generation:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Savings Planner | SavQuest</title>
        <meta name="description" content="Plan your savings and get AI-powered spending suggestions" />
      </Head>

      <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-16 relative overflow-hidden">
        {/* Add the GradientGrid background */}
        <GradientGrid />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl font-bold mb-2"
          >
            Savings Planner
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-zinc-400 mb-10"
          >
            Set savings goals and get personalized spending suggestions
          </motion.p>
          
          {!dataAvailable && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-6 mb-8 relative z-10"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-300">No Financial Data Available</h2>
              <p className="text-zinc-300 mb-4">
                To get personalized savings suggestions, you need to analyze your bank statements first.
              </p>
              <Link 
                href="/statement-analysis" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                <FiFileText className="mr-2" />
                Go to Statement Analysis
              </Link>
            </motion.div>
          )}
          
          {dataAvailable && (
            <>
              {/* Monthly Overview Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-zinc-900 rounded-lg p-6 mb-8 relative z-10"
              >
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiCalendar className="mr-2" />
                  Monthly Overview
                </h2>
                
                {expenseData.numStatements > 1 && (
                  <div className="mb-6 p-3 bg-blue-900/30 border border-blue-800 rounded-md">
                    <p className="text-blue-300">
                      <span className="font-semibold">Based on Multiple Statements:</span> The data below shows monthly averages calculated from {expenseData.numStatements} statements.
                    </p>
                    {expenseData.totalIncomeAllStatements && (
                      <p className="text-sm text-blue-400 mt-2">
                        Total across all statements: ${expenseData.totalIncomeAllStatements.toFixed(2)} income, ${expenseData.totalExpensesAllStatements.toFixed(2)} expenses
                      </p>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <p className="text-zinc-400 text-sm">
                      {expenseData.numStatements > 1 ? "Average Monthly Income" : "Monthly Income"}
                    </p>
                    <p className="text-2xl font-bold text-green-400">${expenseData.averageMonthlyIncome.toFixed(2)}</p>
                  </div>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <p className="text-zinc-400 text-sm">
                      {expenseData.numStatements > 1 ? "Average Monthly Expenses" : "Monthly Expenses"}
                    </p>
                    <p className="text-2xl font-bold text-red-400">${expenseData.averageMonthlyExpenses.toFixed(2)}</p>
                  </div>
                  <div className="bg-zinc-800 p-4 rounded-lg">
                    <p className="text-zinc-400 text-sm">Current Savings Rate</p>
                    <p className="text-2xl font-bold text-blue-400">{expenseData.currentSavingsRate.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="bg-zinc-800 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-zinc-400 text-sm flex items-center">
                      <FiTarget className="mr-2" />
                      Savings Target
                    </p>
                    {!isEditingTarget ? (
                      <button 
                        onClick={() => setIsEditingTarget(true)}
                        className="text-sm text-blue-400 flex items-center"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </button>
                    ) : (
                      <button 
                        onClick={saveSavingsTarget}
                        className="text-sm text-green-400 flex items-center"
                      >
                        <FiSave className="mr-1" /> Save
                      </button>
                    )}
                  </div>
                  
                  {!isEditingTarget ? (
                    <p className="text-2xl font-bold text-yellow-400">{savingsTarget.toFixed(1)}%</p>
                  ) : (
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={tempSavingsTarget}
                        onChange={handleSavingsTargetChange}
                        className="bg-zinc-700 text-white border border-zinc-600 rounded-md px-3 py-2 w-24 mr-2"
                      />
                      <span className="text-xl font-bold text-yellow-400">%</span>
                    </div>
                  )}
                  <p className="text-sm text-zinc-500 mt-1">
                    {savingsTarget > 0 
                      ? `Target: Save $${((expenseData.averageMonthlyIncome * savingsTarget) / 100).toFixed(2)} per month`
                      : "Set a target savings percentage to get personalized suggestions"
                    }
                  </p>
                </div>
                
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <FiShoppingBag className="mr-2" />
                    Top Spending Categories
                  </h3>
                  <div className="space-y-3">
                    {expenseData.topCategories.length > 0 ? (
                      expenseData.topCategories.map((category, index) => (
                        <div key={index} className="bg-zinc-700 p-3 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-zinc-300">${category.amount.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-zinc-600 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(category.amount / expenseData.averageMonthlyExpenses) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-500">No spending data available. Upload bank statements for analysis.</p>
                    )}
                  </div>
                </div>
              </motion.div>
              
              {/* AI Suggestions Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-zinc-900 rounded-lg p-6 relative z-10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FiTrendingUp className="mr-2" />
                    AI-Powered Savings Suggestions
                  </h2>
                  <button
                    onClick={generateAiSuggestions}
                    disabled={generatingSuggestions || savingsTarget <= 0}
                    className={`px-3 py-1 rounded-md text-sm flex items-center ${
                      generatingSuggestions || savingsTarget <= 0
                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {generatingSuggestions ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FiRefreshCw className="mr-2" />
                        Refresh Suggestions
                      </>
                    )}
                  </button>
                </div>
                
                {!aiSuggestions && !generatingSuggestions && (
                  <div className="bg-zinc-800 p-6 rounded-lg text-center">
                    <p className="text-zinc-400 mb-4">
                      {savingsTarget <= 0 
                        ? "Set a savings target above to get personalized suggestions"
                        : "Click 'Generate Suggestions' to get AI-powered savings advice"
                      }
                    </p>
                    <button
                      onClick={generateAiSuggestions}
                      disabled={savingsTarget <= 0}
                      className={`px-4 py-2 rounded-md ${
                        savingsTarget <= 0
                          ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Generate Suggestions
                    </button>
                  </div>
                )}
                
                {generatingSuggestions && (
                  <div className="bg-zinc-800 p-6 rounded-lg text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-zinc-400">Analyzing your spending patterns and generating personalized suggestions...</p>
                  </div>
                )}
                
                {aiSuggestions && !generatingSuggestions && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <p className="text-zinc-400 text-sm">Daily Spending Limit</p>
                        <p className="text-2xl font-bold text-green-400">${aiSuggestions.dailySpendingLimit.toFixed(2)}</p>
                      </div>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <p className="text-zinc-400 text-sm">Weekly Spending Limit</p>
                        <p className="text-2xl font-bold text-green-400">${aiSuggestions.weeklySpendingLimit.toFixed(2)}</p>
                      </div>
                      <div className="bg-zinc-800 p-4 rounded-lg">
                        <p className="text-zinc-400 text-sm">Monthly Savings Goal</p>
                        <p className="text-2xl font-bold text-yellow-400">${aiSuggestions.targetSavingsAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">Category-Specific Suggestions</h3>
                      <div className="space-y-4">
                        {aiSuggestions.categorySuggestions.map((suggestion, index) => (
                          <div key={index} className="bg-zinc-700 p-4 rounded-md">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-lg">{suggestion.category}</span>
                              <div className="text-right">
                                <span className="text-red-400 line-through mr-2">${suggestion.currentAmount.toFixed(2)}</span>
                                <span className="text-green-400">${suggestion.suggestedAmount.toFixed(2)}</span>
                              </div>
                            </div>
                            <p className="text-zinc-300 text-sm mb-2">
                              Reduce spending by ${suggestion.reduction.toFixed(2)} per month
                            </p>
                            <p className="text-blue-300 text-sm italic">
                              Tip: {suggestion.tip}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-zinc-800 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">General Savings Tips</h3>
                      <ul className="space-y-2">
                        {aiSuggestions.generalTips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <FiCreditCard className="text-blue-400 mt-1 mr-2 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
} 