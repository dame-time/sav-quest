import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFile, FiTrash, FiAlertCircle, FiCheckCircle, FiLoader, FiInfo } from "react-icons/fi";
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

export default function StatementAnalysis() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [traitChanges, setTraitChanges] = useState(null);
  const [selectedModel, setSelectedModel] = useState("gpt-4o");

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("savquest_user");
    if (!userData) {
      router.push("/signin");
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const onDrop = useCallback((acceptedFiles) => {
    // Check if adding these files would exceed the 12 file limit
    if (files.length + acceptedFiles.length > 12) {
      setUploadError("You can upload a maximum of 12 files");
      return;
    }

    // Check file types (only allow PDFs)
    const invalidFiles = acceptedFiles.filter(file => file.type !== 'application/pdf');
    if (invalidFiles.length > 0) {
      setUploadError("Only PDF files are allowed");
      return;
    }

    // Add files to state
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    ]);
    setUploadError(null);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10485760, // 10MB
  });

  const removeFile = (index) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadError("Please select at least one file to upload");
      return;
    }

    setUploading(true);
    setUploadError(null);
    
    try {
      // Create a FormData object to send the files
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Add the selected model to the request
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/statement-analysis/analyze?model=${selectedModel}`;
      console.log("Sending request to:", apiUrl);
      
      // Send the files to the backend API
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header as it will be set automatically with the boundary
          'Authorization': `Bearer ${localStorage.getItem('savquest_token')}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to analyze statements');
      }
      
      const result = await response.json();
      console.log("API Response:", result);
      
      // Save analysis results to localStorage for use by the savings planner
      localStorage.setItem("savquest_analysis_results", JSON.stringify(result));
      
      // Also save the processed expense data in a format ready for the savings planner
      const expenseData = {
        averageMonthlyIncome: result.totalIncome || 0,
        averageMonthlyExpenses: result.totalExpenses || 0,
        topCategories: result.topCategories || [],
        currentSavingsRate: result.savingsRate || 0,
      };
      localStorage.setItem("savquest_expense_data", JSON.stringify(expenseData));
      
      // Update the user's traits and XP in local storage
      if (user && result.traits && result.xpEarned) {
        console.log("Updating user traits and XP");
        const updatedUser = { ...user };
        console.log("Original user:", updatedUser);
        
        // Initialize traits object if it doesn't exist
        if (!updatedUser.traits) {
          console.log("Initializing traits object");
          updatedUser.traits = {};
        }
        
        // Calculate trait changes for animation
        const traitChanges = {};
        Object.keys(result.traits).forEach(trait => {
          console.log(`Processing trait: ${trait}`);
          
          // Get current trait value (could be number or object)
          let currentValue = updatedUser.traits[trait] || 0;
          let currentLevel = 0;
          let currentXp = 0;
          
          // Handle current value based on its type
          if (typeof currentValue === 'number') {
            // For numeric values, calculate equivalent level and XP
            currentLevel = Math.max(1, Math.floor(currentValue / 20));
            currentXp = (currentValue % 20) * 5;
          } else if (typeof currentValue === 'object' && currentValue !== null) {
            // For object values, extract level and XP
            currentLevel = currentValue.level || 1;
            currentXp = currentValue.xp || 0;
            // Convert to numeric for animation purposes
            currentValue = ((currentLevel - 1) * 20) + (currentXp / 5);
          }
          
          // Get new trait value from analysis result (always numeric)
          const newValue = result.traits[trait];
          
          // Calculate new level and XP
          const newLevel = Math.max(1, Math.floor(newValue / 20));
          const newXp = (newValue % 20) * 5;
          
          // Store changes for animation
          traitChanges[trait] = {
            from: currentValue,
            to: newValue,
            change: newValue - currentValue
          };
          
          // Update user traits with object format
          updatedUser.traits[trait] = {
            level: newLevel,
            xp: newXp,
            maxXp: 100
          };
        });
        console.log("Trait changes:", traitChanges);
        
        // Update XP
        const currentXp = updatedUser.xp || 0;
        updatedUser.xp = currentXp + result.xpEarned;
        console.log("Updated user:", updatedUser);
        
        // Save updated user to local storage
        localStorage.setItem('savquest_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setTraitChanges(traitChanges);
        setXpEarned(result.xpEarned);
      } else {
        console.warn("Missing traits or xpEarned in result:", result);
      }
      
      setAnalysisResults(result);
      setUploadSuccess(true);
      
      // Show a message about the Savings Planner
      if (result.totalIncome > 0 && result.totalExpenses > 0) {
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadMessage("Your statement has been analyzed! Visit the Savings Planner to get personalized savings suggestions based on your spending patterns.");
        }, 1000);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Function to render trait change with animation
  const renderTraitChange = (trait, label) => {
    if (!traitChanges || !traitChanges[trait]) return null;
    
    const { from, to, change } = traitChanges[trait];
    const isPositive = change > 0;
    
    return (
      <div className="flex items-center mt-2">
        <span className="text-zinc-400 mr-2">{label}:</span>
        <span className="font-medium">{to}</span>
        <span className={`ml-2 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{change}
        </span>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Statement Analysis | SavQuest</title>
        <meta name="description" content="Upload and analyze your bank statements" />
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
            Statement Analysis
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl text-zinc-400 mb-10"
          >
            Upload your bank statements for personalized financial insights
          </motion.p>
          
          <div className="bg-zinc-900 rounded-lg p-6 mb-8 relative z-10">
            <h2 className="text-xl font-semibold mb-4">Upload Bank Statements</h2>
            <p className="text-zinc-400 mb-6">
              Upload up to 12 PDF bank statements for analysis. We'll analyze your spending patterns and provide personalized insights.
            </p>
            
            {/* Add model selection dropdown */}
            <div className="mb-6">
              <label htmlFor="modelSelect" className="block text-sm font-medium text-zinc-400 mb-2">
                Select Analysis Model
              </label>
              <select
                id="modelSelect"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-zinc-800 text-white border border-zinc-700 rounded-md px-3 py-2 w-full max-w-md"
              >
                <option value="gpt-4o">GPT-4o (Recommended)</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster, less accurate)</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-4">GPT-4</option>
              </select>
              <p className="mt-1 text-sm text-zinc-500">
                GPT-4o provides the most accurate analysis but may take longer to process.
              </p>
            </div>
            
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              <FiUpload className="mx-auto text-3xl mb-2 text-zinc-400" />
              <p className="text-zinc-300">Drag & drop PDF files here, or click to select files</p>
              <p className="text-zinc-500 text-sm mt-2">Maximum 12 files, 10MB each</p>
            </div>
            
            {uploadError && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-md flex items-center text-red-300">
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
            
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Selected Files ({files.length}/12)</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-zinc-800 p-3 rounded-md">
                      <div className="flex items-center">
                        <FiFile className="text-blue-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                          <p className="text-xs text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFile(index)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`mt-4 px-4 py-2 rounded-md font-medium flex items-center justify-center ${
                    uploading 
                      ? 'bg-blue-700 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {uploading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    'Upload and Analyze'
                  )}
                </button>
              </div>
            )}
            
            {uploadSuccess && (
              <div className="mt-4 p-3 bg-green-900/30 border border-green-800 rounded-md flex items-center text-green-300">
                <FiCheckCircle className="mr-2 flex-shrink-0" />
                <span>Files uploaded successfully! Analysis complete.</span>
              </div>
            )}
            
            {uploadMessage && (
              <div className="mt-4 p-3 bg-blue-900/30 border border-blue-800 rounded-md flex items-center text-blue-300">
                <FiInfo className="mr-2 flex-shrink-0" />
                <div>
                  <p>{uploadMessage}</p>
                  <Link href="/savings-planner" className="text-blue-400 hover:text-blue-300 underline mt-1 inline-block">
                    Go to Savings Planner →
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {analysisResults && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-zinc-900 rounded-lg p-6 relative z-10"
            >
              <h2 className="text-xl font-semibold mb-6">Analysis Results</h2>
              
              {analysisResults.numStatements > 1 && (
                <div className="mb-6 p-3 bg-blue-900/30 border border-blue-800 rounded-md">
                  <p className="text-blue-300">
                    <span className="font-semibold">Multiple Statements Analyzed:</span> The results below show monthly averages based on {analysisResults.numStatements} statements.
                  </p>
                  {analysisResults.totalIncomeAllStatements && (
                    <p className="text-sm text-blue-400 mt-2">
                      Total across all statements: ${analysisResults.totalIncomeAllStatements.toFixed(2)} income, ${analysisResults.totalExpensesAllStatements.toFixed(2)} expenses
                    </p>
                  )}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <p className="text-zinc-400 text-sm">
                    {analysisResults.numStatements > 1 ? "Average Monthly Income" : "Total Income"}
                  </p>
                  <p className="text-2xl font-bold text-green-400">${analysisResults.totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <p className="text-zinc-400 text-sm">
                    {analysisResults.numStatements > 1 ? "Average Monthly Expenses" : "Total Expenses"}
                  </p>
                  <p className="text-2xl font-bold text-red-400">${analysisResults.totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <p className="text-zinc-400 text-sm">Savings Rate</p>
                  <p className="text-2xl font-bold text-blue-400">{analysisResults.savingsRate.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Top Spending Categories</h3>
                  <div className="space-y-3">
                    {analysisResults.topCategories.map((category, index) => (
                      <div key={index} className="bg-zinc-800 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{category.name}</span>
                          <span className="text-zinc-300">${category.amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-zinc-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(category.amount / analysisResults.totalExpenses) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                  <div className="bg-zinc-800 p-4 rounded-md">
                    <ul className="space-y-3">
                      {analysisResults.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <FiCheckCircle className="text-green-400 mt-1 mr-2 flex-shrink-0" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* XP and Traits Section */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-zinc-800 p-6 rounded-lg"
              >
                <h3 className="text-lg font-medium mb-4">Your Financial Profile</h3>
                
                {xpEarned > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mb-6 p-3 bg-yellow-900/30 border border-yellow-800 rounded-md"
                  >
                    <p className="text-yellow-300 font-medium">
                      <span className="text-xl">+{xpEarned} XP</span> earned from this analysis!
                    </p>
                  </motion.div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-zinc-300 mb-3">Trait Changes</h4>
                    {renderTraitChange('saver', 'Saver')}
                    {renderTraitChange('investor', 'Investor')}
                    {renderTraitChange('planner', 'Planner')}
                    {renderTraitChange('knowledgeable', 'Knowledgeable')}
                  </div>
                  
                  <div>
                    <h4 className="text-zinc-300 mb-3">Financial Strengths</h4>
                    <div className="space-y-2">
                      {analysisResults.traits && Object.entries(analysisResults.traits)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 2)
                        .map(([trait, value]) => (
                          <div key={trait} className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            <span className="capitalize">{trait}</span>
                            <span className="ml-auto font-medium">{value}/100</span>
                          </div>
                        ))
                      }
                    </div>
                    
                    <h4 className="text-zinc-300 mt-4 mb-3">Areas to Improve</h4>
                    <div className="space-y-2">
                      {analysisResults.traits && Object.entries(analysisResults.traits)
                        .sort(([, a], [, b]) => a - b)
                        .slice(0, 2)
                        .map(([trait, value]) => (
                          <div key={trait} className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <span className="capitalize">{trait}</span>
                            <span className="ml-auto font-medium">{value}/100</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
} 