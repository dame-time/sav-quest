import Head from "next/head";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiFile, FiTrash, FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";

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
  const [analysisResults, setAnalysisResults] = useState(null);

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
      // Here you would implement the actual file upload to your backend
      // For now, we'll simulate a successful upload after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate analysis results
      setAnalysisResults({
        totalIncome: 4250.75,
        totalExpenses: 3125.50,
        savingsRate: 26.5,
        topCategories: [
          { name: "Housing", amount: 1200.00 },
          { name: "Food", amount: 650.25 },
          { name: "Transportation", amount: 425.75 },
          { name: "Entertainment", amount: 350.50 },
          { name: "Utilities", amount: 275.00 }
        ],
        recommendations: [
          "Consider reducing food expenses by meal planning",
          "Your entertainment spending is higher than average",
          "You're saving 26.5% of your income, which is excellent!"
        ]
      });
      
      setUploadSuccess(true);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
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
          </div>
          
          {analysisResults && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-zinc-900 rounded-lg p-6 relative z-10"
            >
              <h2 className="text-xl font-semibold mb-6">Analysis Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <p className="text-zinc-400 text-sm">Total Income</p>
                  <p className="text-2xl font-bold text-green-400">${analysisResults.totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <p className="text-zinc-400 text-sm">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-400">${analysisResults.totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <p className="text-zinc-400 text-sm">Savings Rate</p>
                  <p className="text-2xl font-bold text-blue-400">{analysisResults.savingsRate}%</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
} 