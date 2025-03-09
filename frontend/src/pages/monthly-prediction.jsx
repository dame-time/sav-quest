import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFile, FiTrash, FiAlertCircle, FiCheckCircle, FiLoader, FiInfo, FiDollarSign, FiTrendingUp, FiTarget, FiArrowUp, FiArrowDown, FiCalendar } from "react-icons/fi";
import { motion } from "framer-motion";
import Link from "next/link";

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

export default function MonthlyPrediction() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [predictionResults, setPredictionResults] = useState(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("savquest_user");
    if (!userData) {
      router.push("/signup");
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const onDrop = useCallback((acceptedFiles) => {
    // Only accept the first file if multiple are dropped
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setUploadError(null);
    setUploadSuccess(false);
    setPredictionResults(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadError(null);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Add the selected model to the request
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/statement-analysis/predict-monthly?model=${selectedModel}`;
      console.log("Sending request to:", apiUrl);
      
      // Send the file to the backend API
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header as it will be set automatically with the boundary
          'Authorization': `Bearer ${localStorage.getItem('savquest_token')}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Failed to parse error response' }));
        console.error("API Error:", errorData);
        throw new Error(errorData.detail || 'Failed to analyze statement');
      }
      
      const result = await response.json();
      console.log("API Response:", result);
      
      // Check if we got a fallback response (error case)
      if (result.overallAdvice && result.overallAdvice.includes("Unable to analyze statement due to an error")) {
        console.error("Received fallback response:", result);
        setUploadError(`Analysis failed: ${result.overallAdvice}`);
        setUploading(false);
        return;
      }
      
      // Save prediction results to localStorage
      localStorage.setItem("savquest_prediction_results", JSON.stringify(result));
      
      // Update user XP if provided
      if (result.xpEarned) {
        const updatedUser = { ...user };
        
        // Initialize XP if not present
        if (updatedUser.xp === undefined) {
          updatedUser.xp = 0;
        }
        
        // Add XP
        updatedUser.xp += result.xpEarned;
        
        // Save updated user to local storage
        localStorage.setItem('savquest_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setXpEarned(result.xpEarned);
      }
      
      setPredictionResults(result);
      setUploadSuccess(true);
      
    } catch (error) {
      console.error("Error uploading file:", error);
      
      // Provide a more user-friendly error message
      let errorMessage = error.message || "An error occurred while uploading the file";
      
      // Check for specific error messages and provide more helpful guidance
      if (errorMessage.includes("OpenAI API key") || errorMessage.includes("OpenAI client")) {
        errorMessage = "The OpenAI API key is not configured. Please ask your administrator to set the OPENAI_API_KEY environment variable or enable mock responses by setting USE_MOCK_RESPONSES=true.";
      } else if (errorMessage.includes("PDF")) {
        errorMessage = "There was an issue with your PDF file. Please ensure it's a valid bank statement.";
      } else if (errorMessage.includes("model")) {
        errorMessage = "There was an issue with the selected AI model. Please try a different model.";
      } else if (errorMessage.includes("client")) {
        errorMessage = "There was an issue with the AI client. Please ask your administrator to enable mock responses by setting USE_MOCK_RESPONSES=true.";
      }
      
      setUploadError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Format percentage values
  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  return (
    <>
      <Head>
        <title>Monthly Spending Prediction | SavQuest</title>
      </Head>
      <div className="min-h-screen bg-zinc-950 text-zinc-50 pt-20 relative overflow-hidden">
        <GradientGrid />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Monthly Spending Prediction</h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Upload your current month's bank statement to get predictions about your spending patterns and personalized savings advice.
            </p>
          </div>

          {!uploadSuccess ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Upload Your Current Month's Statement</h2>
                
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-blue-500 bg-blue-500/10" : "border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  <input {...getInputProps()} />
                  <FiUpload className="mx-auto text-3xl mb-4 text-zinc-400" />
                  <p className="text-zinc-300 mb-2">Drag & drop your PDF statement here, or click to select</p>
                  <p className="text-zinc-500 text-sm">Only PDF files are accepted</p>
                </div>

                {file && (
                  <div className="mt-4 p-4 bg-zinc-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <FiFile className="text-blue-400 mr-3" />
                      <div>
                        <p className="text-zinc-300 font-medium">{file.name}</p>
                        <p className="text-zinc-500 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <FiTrash />
                    </button>
                  </div>
                )}

                {uploadError && (
                  <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center text-red-200">
                    <FiAlertCircle className="text-red-400 mr-3" />
                    <p>{uploadError}</p>
                  </div>
                )}

                <div className="mt-6">
                  <div className="mb-4">
                    <label className="block text-zinc-400 mb-2">Select AI Model</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-zinc-300"
                    >
                      <option value="gpt-4o">GPT-4o (Recommended)</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center ${
                      !file || uploading
                        ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <FiLoader className="animate-spin mr-2" />
                        Analyzing your statement...
                      </>
                    ) : (
                      "Get Spending Prediction"
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center text-zinc-500 text-sm">
                <p>Your data is processed securely and never shared with third parties.</p>
                <p className="mt-1">
                  Already analyzed previous statements?{" "}
                  <Link href="/statement-analysis" className="text-blue-400 hover:text-blue-300">
                    Go to Statement Analysis
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Success message */}
              <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 mb-8 flex items-center">
                <FiCheckCircle className="text-green-400 text-xl mr-3" />
                <div>
                  <p className="text-green-200 font-medium">Statement analyzed successfully!</p>
                  <p className="text-green-300/70 text-sm">
                    You earned {xpEarned} XP for this analysis.
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="ml-auto bg-green-800 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm transition-colors"
                >
                  Analyze Another Statement
                </button>
              </div>

              {/* Prediction Results */}
              {predictionResults && (
                <div className="space-y-8">
                  {/* Overview Section */}
                  <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-6">Monthly Spending Prediction</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-zinc-800/50 rounded-lg p-4 flex flex-col items-center justify-center">
                        <FiDollarSign className="text-3xl text-blue-400 mb-2" />
                        <p className="text-zinc-400 text-sm">Projected Spending</p>
                        <p className="text-2xl font-bold">{formatCurrency(predictionResults.projectedSpending)}</p>
                      </div>
                      
                      <div className="bg-zinc-800/50 rounded-lg p-4 flex flex-col items-center justify-center">
                        <FiTrendingUp className="text-3xl text-green-400 mb-2" />
                        <p className="text-zinc-400 text-sm">Projected Savings Rate</p>
                        <p className="text-2xl font-bold">{formatPercentage(predictionResults.projectedSavingsRate)}</p>
                      </div>
                      
                      <div className="bg-zinc-800/50 rounded-lg p-4 flex flex-col items-center justify-center">
                        <FiTarget className="text-3xl text-purple-400 mb-2" />
                        <p className="text-zinc-400 text-sm">Savings Opportunity Score</p>
                        <div className="flex items-center">
                          <p className="text-2xl font-bold">{predictionResults.savingsOpportunityScore}</p>
                          <span className="text-zinc-400 text-sm ml-1">/100</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Comparison to Previous */}
                    {predictionResults.comparisonToPrevious && (
                      <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg">
                        <h3 className="font-medium mb-2 flex items-center">
                          <FiCalendar className="mr-2" />
                          Comparison to Previous Months
                        </h3>
                        <div className="flex items-center">
                          <div className={`mr-3 ${predictionResults.comparisonToPrevious.isHigher ? 'text-red-400' : 'text-green-400'}`}>
                            {predictionResults.comparisonToPrevious.isHigher ? (
                              <FiArrowUp className="text-xl" />
                            ) : (
                              <FiArrowDown className="text-xl" />
                            )}
                          </div>
                          <div>
                            <p className="text-zinc-300">
                              {predictionResults.comparisonToPrevious.isHigher ? 'Higher' : 'Lower'} by {formatCurrency(Math.abs(predictionResults.comparisonToPrevious.difference))}
                              {' '}({Math.abs(predictionResults.comparisonToPrevious.percentageChange).toFixed(1)}%)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Overall Advice */}
                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center">
                        <FiInfo className="mr-2 text-blue-400" />
                        Overall Advice
                      </h3>
                      <p className="text-zinc-300">{predictionResults.overallAdvice}</p>
                    </div>
                  </div>
                  
                  {/* Unusual Expenses */}
                  {predictionResults.unusualExpenses && predictionResults.unusualExpenses.length > 0 && (
                    <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">Unusual Expenses This Month</h2>
                      <div className="space-y-3">
                        {predictionResults.unusualExpenses.map((expense, index) => (
                          <div key={index} className="p-3 bg-zinc-800/50 rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-medium">{expense.category}</p>
                              <p className="text-sm text-zinc-400">{expense.description}</p>
                            </div>
                            <p className="text-lg font-bold text-red-400">{formatCurrency(expense.amount)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* High Spending Categories */}
                  {predictionResults.highSpendingCategories && predictionResults.highSpendingCategories.length > 0 && (
                    <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">High Spending Categories</h2>
                      <div className="space-y-3">
                        {predictionResults.highSpendingCategories.map((category, index) => (
                          <div key={index} className="p-3 bg-zinc-800/50 rounded-lg flex justify-between items-center">
                            <div>
                              <p className="font-medium">{category.category}</p>
                              <p className="text-sm text-zinc-400">
                                {category.percentageAboveNormal.toFixed(1)}% above normal
                              </p>
                            </div>
                            <p className="text-lg font-bold">{formatCurrency(category.amount)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Savings Opportunities */}
                  {predictionResults.savingsOpportunities && predictionResults.savingsOpportunities.length > 0 && (
                    <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-6">
                      <h2 className="text-xl font-bold mb-4">Savings Opportunities</h2>
                      <div className="space-y-4">
                        {predictionResults.savingsOpportunities.map((opportunity, index) => (
                          <div key={index} className="p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-medium text-lg">{opportunity.category}</p>
                              <p className="text-green-400 font-bold">
                                Save up to {formatCurrency(opportunity.potentialSavings)}
                              </p>
                            </div>
                            <p className="text-zinc-300">{opportunity.advice}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Call to Action */}
                  <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                    <Link href="/savings-planner" className="bg-blue-600 hover:bg-blue-500 text-white py-3 px-6 rounded-md font-medium text-center transition-colors">
                      Go to Savings Planner
                    </Link>
                    <Link href="/statement-analysis" className="bg-zinc-700 hover:bg-zinc-600 text-white py-3 px-6 rounded-md font-medium text-center transition-colors">
                      Analyze Previous Statements
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
} 