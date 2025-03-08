# PDF Statement Analysis Testing Tools

This directory contains two tools for testing the PDF statement analysis functionality:

1. **Command-line Test Script** (`test_pdf_analysis.py`)
2. **Web-based Test Interface** (`test_pdf_analysis.html`)

These tools allow you to test the PDF parsing and LLM analysis functionality without needing to run the full application.

## Prerequisites

Before using these tools, make sure you have:

1. Python 3.7+ installed
2. Required Python packages installed:
   ```
   pip install pypdf openai tiktoken python-dotenv
   ```
3. An OpenAI API key (set in your environment or in a `.env` file)

## Command-line Test Script

The `test_pdf_analysis.py` script extracts text from a PDF file, sends it to the OpenAI API for analysis, and displays the results.

### Usage

```bash
python test_pdf_analysis.py path/to/your/statement.pdf
```

### What it does

1. Extracts text from the provided PDF file
2. Saves the extracted text to a `.txt` file for inspection
3. Sends the text to the OpenAI API for analysis
4. Saves the analysis results to a `.json` file
5. Displays a summary of the analysis in the terminal

### Example output

```
==================================================
PDF ANALYSIS SUMMARY
==================================================
PDF File: sample_statement.pdf
Extracted Text: 12345 characters (saved to sample_statement.pdf.txt)
Analysis Result: (saved to sample_statement.pdf.analysis.json)

Financial Summary:
- Total Income: $5150.00
- Total Expenses: $2207.61
- Savings Rate: 57.1%

Top Spending Categories:
- Housing: $1200.00
- Food: $336.55
- Entertainment: $161.21
- Utilities: $151.74
- Transportation: $80.60

Recommendations:
- You're saving over 50% of your income, which is excellent!
- Consider setting up automatic transfers to a high-yield savings account
- Your food spending is reasonable, but you could save more by cooking at home more often
- Look into investing some of your savings for long-term growth

Trait Scores:
- Saver: 85/100
- Investor: 40/100
- Planner: 75/100
- Knowledgeable: 60/100

XP Earned: 750
==================================================

Test completed successfully!
Extracted text saved to: sample_statement.pdf.txt
Analysis results saved to: sample_statement.pdf.analysis.json
```

## Web-based Test Interface

The `test_pdf_analysis.html` file provides a user-friendly web interface for testing the PDF analysis functionality.

### Usage

1. Open the HTML file in a web browser:
   ```bash
   open test_pdf_analysis.html
   ```
2. Drag and drop a PDF file onto the dropzone or click to select a file
3. Click the "Analyze Statement" button
4. View the extracted text and analysis results

### Important Note

The web interface currently uses mock data for demonstration purposes. In a real implementation, you would need to:

1. Use a PDF parsing library like PDF.js to extract text from PDFs in the browser
2. Set up a server endpoint to handle the OpenAI API calls (for security reasons)

## Integrating with the Full Application

Once you've verified that the PDF analysis functionality works as expected, you can integrate it with the full application:

1. Make sure the backend API endpoint is properly configured
2. Update the frontend to send PDF files to the backend API
3. Display the analysis results in the frontend UI

## Troubleshooting

If you encounter issues:

1. Check that your OpenAI API key is valid and has sufficient credits
2. Verify that the PDF file is readable and contains text (not just images)
3. Check the logs for any error messages
4. Try with a smaller PDF file if you're hitting token limits
