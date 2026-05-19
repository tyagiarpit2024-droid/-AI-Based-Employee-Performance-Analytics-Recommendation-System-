const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ margin: 50 });
const outputPath = path.join(__dirname, '..', 'Project_Report.pdf');

doc.pipe(fs.createWriteStream(outputPath));

// Title Page
doc.fontSize(24).font('Helvetica-Bold').text('AI-Based Employee Performance Analytics', { align: 'center' });
doc.fontSize(18).text('& Recommendation System', { align: 'center' });
doc.moveDown(2);
doc.fontSize(14).font('Helvetica').text('End Semester Project Report', { align: 'center' });
doc.moveDown(3);

// Section 1
doc.fontSize(16).font('Helvetica-Bold').text('1. Introduction');
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('The "AI-Based Employee Performance Analytics & Recommendation System" is a full-stack web application designed to revolutionize how HR departments and managers evaluate and support their workforce. By leveraging modern web technologies (MERN stack) and Artificial Intelligence (OpenRouter/OpenAI API), the system provides deep, automated insights into employee performance, promotion readiness, and personalized learning paths.', { align: 'justify' });
doc.moveDown();

// Section 2
doc.fontSize(16).font('Helvetica-Bold').text('2. Objectives');
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('- Centralized Management: To provide a secure, centralized dashboard for managing employee records, skills, and performance metrics.');
doc.text('- AI-Driven Insights: To eliminate human bias and manual effort by using AI to generate performance reviews, training suggestions, and promotion recommendations based on empirical data.');
doc.text('- Modern User Experience: To deliver a premium, responsive, and visually engaging user interface using a modern design system.');
doc.moveDown();

// Section 3
doc.fontSize(16).font('Helvetica-Bold').text('3. Technology Stack');
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('- Frontend: React.js (Vite), React Router, Framer Motion, Recharts, Custom CSS.');
doc.text('- Backend: Node.js, Express.js, JWT for authentication, Bcrypt.js for security.');
doc.text('- Database: MongoDB Atlas (Cloud NoSQL Database), Mongoose ODM.');
doc.text('- AI Integration: OpenRouter API (gpt-3.5-turbo).');
doc.text('- Deployment: Render (Cloud Hosting), GitHub (Version Control).');
doc.moveDown();

// Section 4
doc.fontSize(16).font('Helvetica-Bold').text('4. System Architecture');
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('The system follows a standard Client-Server architecture:');
doc.text('1. Client (React): Communicates with the backend via RESTful APIs. Manages local state and global authentication state.');
doc.text('2. Server (Express): Processes requests, validates data, interacts with the MongoDB database, and securely communicates with the external OpenRouter AI API.');
doc.text('3. Authentication Flow: Users register/login to receive a JWT. This token is attached to the Authorization header of all subsequent API requests.');
doc.moveDown();

// Section 5
doc.fontSize(16).font('Helvetica-Bold').text('5. Key Features');
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('- Secure Authentication: JWT-based login and registration system protecting the admin dashboard.');
doc.text('- Interactive Dashboard: Visual analytics including Department Distribution (Pie Charts) and Top Performers tables.');
doc.text('- Employee CRUD: Full Create, Read, Update, and Delete functionality for employee profiles.');
doc.text('- Search & Filter: Real-time search functionality to filter employees by department.');
doc.text('- AI Recommendation Engine: Generates a comprehensive 4-part analysis for any employee: Promotion Readiness, Learning Path, Manager Feedback Synthesis, Performance Insight Ranking.');
doc.moveDown();

// Section 6
doc.fontSize(16).font('Helvetica-Bold').text('6. Conclusion');
doc.moveDown(0.5);
doc.fontSize(12).font('Helvetica').text('The project successfully demonstrates the integration of a traditional CRUD web application with modern Generative AI capabilities. The resulting system is a production-ready, highly secure, and visually premium SaaS application suitable for modern HR teams.', { align: 'justify' });

// Finalize PDF file
doc.end();
console.log('PDF generated at ' + outputPath);
