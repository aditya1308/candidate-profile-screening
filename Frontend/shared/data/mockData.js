// Shared mock data for both employer and applicants apps
// Jobs
export const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    location: "Remote",
    type: "Full-time",
    experience: "3-5 years",
    salary: "$80,000 - $120,000",
    description: "We are looking for a passionate Frontend Developer to join our team and help build amazing user experiences. You'll work on cutting-edge web applications that serve millions of users worldwide, collaborating with cross-functional teams to deliver high-quality, scalable solutions.",
    requirements: [
      "React.js, Vue.js, or Angular experience",
      "Strong JavaScript/TypeScript skills",
      "CSS3 and HTML5 expertise",
      "Experience with modern build tools",
      "Understanding of responsive design",
      "Knowledge of state management (Redux, Vuex)",
      "Experience with testing frameworks (Jest, Cypress)",
      "Understanding of web accessibility standards"
    ],
    responsibilities: [
      "Develop and maintain web applications",
      "Collaborate with design and backend teams",
      "Write clean, maintainable code",
      "Participate in code reviews",
      "Stay updated with latest technologies",
      "Optimize application performance",
      "Mentor junior developers",
      "Contribute to technical architecture decisions"
    ],
    department: "Engineering",
    postedDate: "2024-01-15",
    applications: 45,
    status: "Active",
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "401(k) with company match",
      "Flexible work arrangements",
      "Professional development budget",
      "Unlimited PTO",
      "Home office setup allowance"
    ],
    techStack: ["React", "TypeScript", "Node.js", "AWS", "Docker", "Git"]
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "TechCorp Solutions",
    location: "New York, NY",
    type: "Full-time",
    experience: "2-4 years",
    salary: "$70,000 - $100,000",
    description: "Join our backend team to build scalable and robust server-side applications. You'll work on high-traffic systems that process millions of requests daily, implementing best practices for security, performance, and reliability.",
    requirements: [
      "Node.js or Python experience",
      "Database design and optimization",
      "API development experience",
      "Understanding of microservices",
      "Experience with cloud platforms",
      "Knowledge of RESTful APIs",
      "Understanding of authentication/authorization",
      "Experience with message queues"
    ],
    responsibilities: [
      "Design and implement APIs",
      "Optimize database performance",
      "Ensure code quality and testing",
      "Collaborate with frontend team",
      "Deploy and maintain services",
      "Monitor system performance",
      "Implement security best practices",
      "Participate in on-call rotations"
    ],
    department: "Engineering",
    postedDate: "2024-01-10",
    applications: 38,
    status: "Active",
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "401(k) with company match",
      "Flexible work arrangements",
      "Professional development budget",
      "Unlimited PTO",
      "Commuter benefits"
    ],
    techStack: ["Node.js", "Python", "PostgreSQL", "Redis", "AWS", "Docker"]
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    type: "Full-time",
    experience: "2-5 years",
    salary: "$75,000 - $110,000",
    description: "Create beautiful and intuitive user experiences that delight our customers. You'll work closely with product managers and engineers to translate user needs into elegant design solutions that drive engagement and satisfaction.",
    requirements: [
      "Proficiency in Figma, Sketch, or Adobe XD",
      "Understanding of user-centered design",
      "Experience with design systems",
      "Knowledge of accessibility standards",
      "Portfolio showcasing previous work",
      "Experience with user research methods",
      "Understanding of design principles",
      "Knowledge of prototyping tools"
    ],
    responsibilities: [
      "Create wireframes and prototypes",
      "Conduct user research and testing",
      "Collaborate with product and engineering teams",
      "Maintain design consistency",
      "Iterate based on user feedback",
      "Create design documentation",
      "Present design solutions to stakeholders",
      "Stay updated with design trends"
    ],
    department: "Design",
    postedDate: "2024-01-08",
    applications: 52,
    status: "Active",
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "401(k) with company match",
      "Flexible work arrangements",
      "Professional development budget",
      "Unlimited PTO",
      "Design software licenses"
    ],
    techStack: ["Figma", "Sketch", "Adobe Creative Suite", "InVision", "Principle", "Framer"]
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "TechCorp Solutions",
    location: "Remote",
    type: "Full-time",
    experience: "3-6 years",
    salary: "$85,000 - $130,000",
    description: "Help us build and maintain our infrastructure and deployment pipelines. You'll work on automating our development processes, ensuring high availability and security of our systems, and optimizing performance across our cloud infrastructure.",
    requirements: [
      "Experience with AWS, Azure, or GCP",
      "Docker and Kubernetes knowledge",
      "CI/CD pipeline experience",
      "Infrastructure as Code (Terraform, CloudFormation)",
      "Monitoring and logging tools experience",
      "Understanding of networking concepts",
      "Experience with Linux systems",
      "Knowledge of security best practices"
    ],
    responsibilities: [
      "Manage cloud infrastructure",
      "Automate deployment processes",
      "Monitor system performance",
      "Ensure security best practices",
      "Collaborate with development teams",
      "Implement disaster recovery plans",
      "Optimize costs and performance",
      "Maintain documentation and runbooks"
    ],
    department: "Engineering",
    postedDate: "2024-01-05",
    applications: 29,
    status: "Active",
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "401(k) with company match",
      "Flexible work arrangements",
      "Professional development budget",
      "Unlimited PTO",
      "Home office setup allowance"
    ],
    techStack: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "Prometheus"]
  },
  {
    id: 5,
    title: "Product Manager",
    company: "TechCorp Solutions",
    location: "Austin, TX",
    type: "Full-time",
    experience: "4-7 years",
    salary: "$90,000 - $140,000",
    description: "Lead product strategy and execution for our innovative software solutions. You'll work with cross-functional teams to define product vision, gather requirements, and deliver products that meet customer needs and business objectives.",
    requirements: [
      "Product management experience",
      "Strong analytical skills",
      "Experience with agile methodologies",
      "Excellent communication skills",
      "Technical background preferred",
      "Experience with user research",
      "Understanding of market analysis",
      "Experience with product analytics tools"
    ],
    responsibilities: [
      "Define product vision and strategy",
      "Gather and prioritize requirements",
      "Work with cross-functional teams",
      "Analyze market and competition",
      "Drive product launches",
      "Monitor product performance",
      "Gather and analyze user feedback",
      "Collaborate with stakeholders"
    ],
    department: "Product",
    postedDate: "2024-01-12",
    applications: 41,
    status: "Active",
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "401(k) with company match",
      "Flexible work arrangements",
      "Professional development budget",
      "Unlimited PTO",
      "Relocation assistance"
    ],
    techStack: ["Jira", "Confluence", "Amplitude", "Mixpanel", "Figma", "Slack"]
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "TechCorp Solutions",
    location: "Remote",
    type: "Full-time",
    experience: "2-5 years",
    salary: "$80,000 - $120,000",
    description: "Transform data into actionable insights to drive business decisions. You'll work with large datasets, build predictive models, and create visualizations that help stakeholders understand complex data patterns and make informed decisions.",
    requirements: [
      "Python or R programming skills",
      "Statistical analysis experience",
      "Machine learning knowledge",
      "SQL and data manipulation skills",
      "Experience with data visualization tools",
      "Understanding of experimental design",
      "Experience with big data technologies",
      "Knowledge of deep learning frameworks"
    ],
    responsibilities: [
      "Analyze complex datasets",
      "Build predictive models",
      "Create data visualizations",
      "Present findings to stakeholders",
      "Collaborate with engineering teams",
      "Design and run experiments",
      "Maintain data quality standards",
      "Stay updated with ML advances"
    ],
    department: "Data",
    postedDate: "2024-01-03",
    applications: 33,
    status: "Active",
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "401(k) with company match",
      "Flexible work arrangements",
      "Professional development budget",
      "Unlimited PTO",
      "Home office setup allowance"
    ],
    techStack: ["Python", "R", "SQL", "TensorFlow", "PyTorch", "Tableau"]
  }
];

// Users for employer auth
export const users = [
  {
    id: 1,
    email: "hr@techcorp.com",
    password: "password123",
    name: "Sarah Johnson",
    role: "talent-acquisition",
    department: "Human Resources"
  },
  {
    id: 2,
    email: "interview@techcorp.com",
    password: "password123",
    name: "Mike Chen",
    role: "interview-team",
    department: "Engineering"
  }
];

// Sample applications
export const applications = [
  {
    id: 1,
    jobId: 1,
    applicantName: "John Doe",
    email: "john.doe@email.com",
    phone: "+1-555-0123",
    resume: "john_doe_resume.pdf",
    coverLetter: "I am excited to apply for this position...",
    appliedDate: "2024-01-20",
    status: "Under Review",
    experience: "4 years",
    skills: ["React", "JavaScript", "CSS", "HTML"]
  },
  {
    id: 2,
    jobId: 1,
    applicantName: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1-555-0456",
    resume: "jane_smith_resume.pdf",
    coverLetter: "With my background in frontend development...",
    appliedDate: "2024-01-19",
    status: "Shortlisted",
    experience: "3 years",
    skills: ["Vue.js", "TypeScript", "SCSS", "Webpack"]
  }
];


