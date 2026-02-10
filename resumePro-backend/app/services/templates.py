# Resume LaTeX Templates
# Each template is a complete, compilable LaTeX document

TEMPLATES = {
    "modern-professional": {
        "id": "modern-professional",
        "name": "Modern Professional",
        "category": "Professional",
        "description": "Clean and modern layout perfect for tech roles",
        "color": "bg-blue-500",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.75in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}

% Colors
\definecolor{primary}{RGB}{0,102,204}
\definecolor{darkgray}{RGB}{64,64,64}

% Section formatting
\titleformat{\section}{\large\bfseries\color{primary}}{}{0em}{}[\titlerule]
\titlespacing{\section}{0pt}{12pt}{6pt}

% Remove page numbers
\pagestyle{empty}

\begin{document}

% Header
\begin{center}
    {\LARGE\bfseries YOUR NAME}\\[4pt]
    \textcolor{darkgray}{
        your.email@example.com $\bullet$ (555) 123-4567 $\bullet$ 
        \href{https://linkedin.com/in/yourprofile}{LinkedIn} $\bullet$ 
        \href{https://github.com/yourusername}{GitHub}
    }
\end{center}

\section{Professional Summary}
Results-driven software engineer with 5+ years of experience building scalable web applications. 
Expertise in React, Node.js, and cloud technologies. Passionate about clean code and user experience.

\section{Experience}

\noindent\textbf{Senior Software Engineer} \hfill Jan 2022 -- Present\\
\textit{Tech Company Inc.} \hfill San Francisco, CA
\begin{itemize}[leftmargin=*,nosep]
    \item Led development of microservices architecture serving 2M+ daily active users
    \item Reduced API response time by 60\% through query optimization and caching strategies
    \item Mentored team of 4 junior developers and conducted code reviews
    \item Implemented CI/CD pipeline reducing deployment time from 2 hours to 15 minutes
\end{itemize}

\vspace{8pt}
\noindent\textbf{Software Engineer} \hfill Jun 2019 -- Dec 2021\\
\textit{Startup XYZ} \hfill New York, NY
\begin{itemize}[leftmargin=*,nosep]
    \item Built React-based dashboard used by 500+ enterprise clients
    \item Developed RESTful APIs handling 10,000+ requests per minute
    \item Collaborated with product team to define technical requirements
\end{itemize}

\section{Education}

\noindent\textbf{Bachelor of Science in Computer Science} \hfill 2019\\
\textit{University Name} \hfill GPA: 3.8/4.0

\section{Skills}

\textbf{Languages:} JavaScript, TypeScript, Python, Go, SQL\\
\textbf{Frontend:} React, Next.js, Vue.js, HTML5, CSS3, Tailwind\\
\textbf{Backend:} Node.js, Express, FastAPI, GraphQL, REST\\
\textbf{Cloud/DevOps:} AWS, Docker, Kubernetes, GitHub Actions, Terraform\\
\textbf{Databases:} PostgreSQL, MongoDB, Redis, Elasticsearch

\end{document}"""
    },

    "executive": {
        "id": "executive",
        "name": "Executive",
        "category": "Professional",
        "description": "Bold design for senior leadership positions",
        "color": "bg-slate-700",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.75in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}

% Colors
\definecolor{darkblue}{RGB}{0,51,102}
\definecolor{gold}{RGB}{184,134,11}

% Section formatting
\titleformat{\section}{\Large\bfseries\color{darkblue}\uppercase}{}{0em}{}
\titlespacing{\section}{0pt}{14pt}{8pt}

\pagestyle{empty}

\begin{document}

% Header
\begin{center}
    {\Huge\bfseries\color{darkblue} YOUR NAME}\\[6pt]
    {\large Chief Technology Officer}\\[8pt]
    \textcolor{gold}{\rule{0.5\textwidth}{1pt}}\\[6pt]
    your.email@example.com $|$ (555) 123-4567 $|$ San Francisco, CA\\
    \href{https://linkedin.com/in/yourprofile}{linkedin.com/in/yourprofile}
\end{center}

\section{Executive Summary}
Transformational technology leader with 15+ years of experience driving digital innovation at Fortune 500 companies. 
Proven track record of building high-performing engineering teams, delivering \$50M+ in cost savings through 
strategic technology initiatives, and scaling platforms to support 100M+ users globally.

\section{Leadership Experience}

\noindent{\large\textbf{Chief Technology Officer}} \hfill 2020 -- Present\\
\textbf{Enterprise Corporation} \hfill San Francisco, CA
\begin{itemize}[leftmargin=*,nosep,itemsep=4pt]
    \item Lead 200+ engineers across 8 product teams, managing \$40M annual technology budget
    \item Architected cloud migration strategy reducing infrastructure costs by 45\% (\$12M annually)
    \item Established AI/ML practice generating \$25M in new revenue within first year
    \item Drove cultural transformation to agile methodology, improving time-to-market by 60\%
\end{itemize}

\vspace{10pt}
\noindent{\large\textbf{VP of Engineering}} \hfill 2016 -- 2020\\
\textbf{Tech Giant Inc.} \hfill Seattle, WA
\begin{itemize}[leftmargin=*,nosep,itemsep=4pt]
    \item Scaled engineering organization from 50 to 150 engineers during hypergrowth phase
    \item Delivered platform serving 50M daily active users with 99.99\% uptime
    \item Implemented security framework achieving SOC 2 Type II and ISO 27001 certification
\end{itemize}

\section{Education \& Certifications}

\noindent\textbf{MBA, Technology Management} -- Stanford Graduate School of Business\\
\textbf{BS, Computer Science} -- MIT (Magna Cum Laude)\\
\textbf{Certifications:} AWS Solutions Architect Professional, Google Cloud Architect

\section{Board Positions \& Advisory Roles}
\begin{itemize}[leftmargin=*,nosep]
    \item Board Member, TechStartup Inc. (2021 -- Present)
    \item Technical Advisor, Venture Capital Partners (2019 -- Present)
\end{itemize}

\end{document}"""
    },

    "creative-portfolio": {
        "id": "creative-portfolio",
        "name": "Creative Portfolio",
        "category": "Creative",
        "description": "Showcase your creative work with style",
        "color": "bg-purple-500",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.6in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}
\usepackage{graphicx}

% Creative Colors
\definecolor{accent}{RGB}{147,51,234}
\definecolor{secondary}{RGB}{236,72,153}
\definecolor{dark}{RGB}{30,30,30}

% Section formatting
\titleformat{\section}{\large\bfseries\color{accent}}{}{0em}{\hspace{-6pt}}
\titlespacing{\section}{0pt}{10pt}{6pt}

\pagestyle{empty}

\begin{document}

% Creative Header
\noindent
\begin{minipage}[t]{0.6\textwidth}
    {\Huge\bfseries\color{dark} YOUR NAME}\\[4pt]
    {\Large\color{accent} Creative Director \& UX Designer}\\[8pt]
    \textcolor{secondary}{Crafting digital experiences that inspire}
\end{minipage}
\hfill
\begin{minipage}[t]{0.35\textwidth}
    \raggedleft
    \textcolor{dark}{
        your.email@example.com\\
        (555) 123-4567\\
        \href{https://yourportfolio.com}{yourportfolio.com}\\
        \href{https://dribbble.com/you}{dribbble.com/you}
    }
\end{minipage}

\vspace{12pt}
\noindent\textcolor{accent}{\rule{\textwidth}{2pt}}

\section{About Me}
Award-winning creative director with 8+ years transforming brands through innovative design. 
I blend strategic thinking with artistic vision to create memorable user experiences that 
drive engagement and business growth. Featured in Awwwards, CSS Design Awards, and Forbes 30 Under 30.

\section{Selected Projects}

\noindent\textbf{\color{accent}Brand Redesign -- Fortune 100 Tech Company}\\
Led complete brand identity overhaul reaching 50M+ users globally.\\
\textit{Impact: 40\% increase in brand recognition, 25\% improvement in user engagement}

\vspace{8pt}
\noindent\textbf{\color{accent}Mobile App Design -- FinTech Startup}\\
Designed intuitive banking app from concept to launch in 6 months.\\
\textit{Impact: 4.8 star rating, 2M downloads in first year, acquired for \$200M}

\vspace{8pt}
\noindent\textbf{\color{accent}E-commerce Platform -- Fashion Retailer}\\
Created immersive shopping experience with AR try-on features.\\
\textit{Impact: 60\% increase in conversion rate, \$15M additional revenue}

\section{Experience}

\noindent\textbf{Creative Director} -- Design Agency XYZ \hfill 2020 -- Present\\
\noindent\textbf{Senior UX Designer} -- Product Company \hfill 2017 -- 2020\\
\noindent\textbf{UI Designer} -- Startup Studio \hfill 2015 -- 2017

\section{Skills \& Tools}

\textbf{Design:} Figma, Sketch, Adobe Creative Suite, Principle, Framer\\
\textbf{Specialties:} Brand Identity, UX/UI Design, Motion Graphics, Design Systems\\
\textbf{Other:} HTML/CSS, React basics, User Research, Design Sprints

\section{Awards}
Awwwards Site of the Day (3x) $\bullet$ Red Dot Design Award $\bullet$ Webby Honoree

\end{document}"""
    },

    "minimalist": {
        "id": "minimalist",
        "name": "Minimalist",
        "category": "Simple",
        "description": "Clean and straightforward design",
        "color": "bg-gray-600",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}

\pagestyle{empty}
\setlength{\parindent}{0pt}

\begin{document}

\begin{center}
    {\Large\textbf{YOUR NAME}}\\[4pt]
    your.email@example.com $\cdot$ (555) 123-4567 $\cdot$ City, State\\
    \href{https://linkedin.com/in/yourprofile}{LinkedIn} $\cdot$ \href{https://github.com/you}{GitHub}
\end{center}

\vspace{12pt}

\textbf{EXPERIENCE}
\vspace{4pt}
\hrule
\vspace{8pt}

\textbf{Software Engineer} \hfill 2021 -- Present\\
Company Name, City, State
\begin{itemize}[nosep,leftmargin=16pt]
    \item Developed and maintained web applications using React and Node.js
    \item Improved system performance by 40\% through code optimization
    \item Collaborated with cross-functional teams to deliver features on time
\end{itemize}

\vspace{8pt}
\textbf{Junior Developer} \hfill 2019 -- 2021\\
Another Company, City, State
\begin{itemize}[nosep,leftmargin=16pt]
    \item Built RESTful APIs serving 100k+ daily requests
    \item Wrote unit tests achieving 90\% code coverage
    \item Participated in agile development processes
\end{itemize}

\vspace{12pt}

\textbf{EDUCATION}
\vspace{4pt}
\hrule
\vspace{8pt}

\textbf{Bachelor of Science in Computer Science} \hfill 2019\\
University Name, City, State

\vspace{12pt}

\textbf{SKILLS}
\vspace{4pt}
\hrule
\vspace{8pt}

JavaScript, TypeScript, Python, React, Node.js, PostgreSQL, Git, AWS, Docker

\end{document}"""
    },

    "tech-startup": {
        "id": "tech-startup",
        "name": "Tech Startup",
        "category": "Modern",
        "description": "Perfect for startup and tech company roles",
        "color": "bg-green-500",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.7in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}

% Startup-friendly colors
\definecolor{startup}{RGB}{16,185,129}
\definecolor{dark}{RGB}{17,24,39}

% Modern section style
\titleformat{\section}{\large\bfseries\color{startup}}{}{0em}{}
\titlespacing{\section}{0pt}{12pt}{6pt}

\pagestyle{empty}

\begin{document}

% Header with emoji-style icons (using symbols)
\begin{center}
    {\LARGE\bfseries YOUR NAME}\\[4pt]
    {\color{startup}Full-Stack Engineer | Startup Enthusiast | Builder}\\[8pt]
    \texttt{your.email@example.com} $\bullet$ 
    \href{https://github.com/you}{github.com/you} $\bullet$
    \href{https://yoursite.dev}{yoursite.dev}
\end{center}

\section{TL;DR}
Shipped 5 products from 0 to 1. Ex-YC founder. Love building things that scale. 
Currently obsessed with AI/ML and developer tools. Open to early-stage opportunities 
where I can wear multiple hats and make a real impact.

\section{What I've Built}

\noindent\textbf{Co-Founder \& CTO} -- StartupName (YC W22) \hfill 2022 -- 2024\\
\textcolor{startup}{Developer productivity tool -- 10k+ users, \$2M seed raised}
\begin{itemize}[leftmargin=*,nosep]
    \item Built entire MVP in 3 weeks, iterated based on user feedback
    \item Scaled from 0 to 10k users with \$0 marketing budget (all organic/Product Hunt)
    \item Architected real-time collaboration features handling 1M+ events/day
    \item Tech: TypeScript, React, Node.js, PostgreSQL, Redis, AWS
\end{itemize}

\vspace{8pt}
\noindent\textbf{Founding Engineer} -- Another Startup \hfill 2020 -- 2022\\
\textcolor{startup}{B2B SaaS platform -- Acquired by BigCo for \$50M}
\begin{itemize}[leftmargin=*,nosep]
    \item Employee \#3, built core platform features from scratch
    \item Owned entire frontend and half the backend infrastructure
    \item Implemented payment system processing \$5M+ monthly
\end{itemize}

\section{Side Projects}

\textbf{open-source-tool} -- 2k+ GitHub stars, CLI tool for developers\\
\textbf{weekend-app} -- Built in 48hrs at hackathon, won 1st place

\section{Tech Stack}

\textbf{Fluent:} TypeScript, React, Next.js, Node.js, Python, PostgreSQL, Redis\\
\textbf{Proficient:} Go, Rust, GraphQL, Kubernetes, Terraform\\
\textbf{Learning:} AI/ML (LangChain, fine-tuning LLMs)

\section{Education}
\textbf{BS Computer Science} -- Stanford University \hfill 2020

\end{document}"""
    },

    "academic": {
        "id": "academic",
        "name": "Academic",
        "category": "Professional",
        "description": "Ideal for research and academic positions",
        "color": "bg-indigo-600",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}

% Academic-style section formatting
\titleformat{\section}{\large\bfseries\scshape}{}{0em}{}
\titlespacing{\section}{0pt}{12pt}{6pt}

\pagestyle{empty}

\begin{document}

\begin{center}
    {\Large\textbf{YOUR NAME, Ph.D.}}\\[4pt]
    Assistant Professor of Computer Science\\[6pt]
    University Name $|$ Department of Computer Science\\
    your.email@university.edu $|$ (555) 123-4567\\
    \href{https://yourwebsite.edu}{yourwebsite.edu} $|$ 
    \href{https://scholar.google.com/citations?user=xxx}{Google Scholar}
\end{center}

\section{Research Interests}
Machine Learning, Natural Language Processing, Human-Computer Interaction, 
Explainable AI, Computational Social Science

\section{Education}

\noindent\textbf{Ph.D. in Computer Science} \hfill 2020\\
Stanford University, Stanford, CA\\
\textit{Dissertation: ``Interpretable Machine Learning for Natural Language Understanding''}\\
\textit{Advisor: Prof. Distinguished Name}

\vspace{6pt}
\noindent\textbf{M.S. in Computer Science} \hfill 2016\\
Massachusetts Institute of Technology, Cambridge, MA

\vspace{6pt}
\noindent\textbf{B.S. in Computer Science} (Summa Cum Laude) \hfill 2014\\
University of California, Berkeley, CA

\section{Academic Appointments}

\noindent\textbf{Assistant Professor} \hfill 2020 -- Present\\
Department of Computer Science, University Name

\noindent\textbf{Postdoctoral Researcher} \hfill 2019 -- 2020\\
Google AI Research, Mountain View, CA

\section{Selected Publications}

\begin{enumerate}[leftmargin=*,nosep]
    \item \textbf{Your Name}, Co-Author. ``Title of Important Paper.'' 
    \textit{Nature Machine Intelligence}, 2024. (Impact Factor: 25.9)
    
    \item \textbf{Your Name}, et al. ``Another Significant Contribution.'' 
    \textit{Proceedings of NeurIPS}, 2023. (Spotlight Paper)
    
    \item Co-Author, \textbf{Your Name}. ``Foundational Work in the Field.'' 
    \textit{ACL}, 2022. (Best Paper Award)
\end{enumerate}

\section{Grants \& Funding}
\begin{itemize}[leftmargin=*,nosep]
    \item NSF CAREER Award, ``Project Title'' (\$500,000), 2023-2028
    \item Google Research Scholar Award (\$60,000), 2022
\end{itemize}

\section{Teaching}
CS 229: Machine Learning (Spring 2024, Fall 2023)\\
CS 224N: Natural Language Processing (Winter 2024)

\end{document}"""
    },

    "two-column": {
        "id": "two-column",
        "name": "Two Column",
        "category": "Modern",
        "description": "Maximize space with a dual-column layout",
        "color": "bg-teal-500",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.5in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}
\usepackage{multicol}
\usepackage{paracol}

\definecolor{sidebar}{RGB}{30,41,59}
\definecolor{accent}{RGB}{20,184,166}
\definecolor{lightgray}{RGB}{241,245,249}

\titleformat{\section}{\normalsize\bfseries\color{accent}\uppercase}{}{0em}{}
\titlespacing{\section}{0pt}{8pt}{4pt}

\pagestyle{empty}
\setlength{\parindent}{0pt}
\setlength{\columnsep}{20pt}

\begin{document}

% Header spanning full width
\begin{center}
    {\LARGE\bfseries YOUR NAME}\\[4pt]
    {\color{accent}Software Engineer}\\[6pt]
    your.email@example.com $\bullet$ (555) 123-4567 $\bullet$ City, State\\
    \href{https://linkedin.com/in/you}{LinkedIn} $\bullet$ \href{https://github.com/you}{GitHub}
\end{center}

\vspace{10pt}
\noindent\textcolor{accent}{\rule{\textwidth}{1pt}}
\vspace{10pt}

\begin{paracol}{2}

% LEFT COLUMN
\section{Experience}

\textbf{Senior Software Engineer}\\
\textit{Tech Company} \hfill 2022--Present
\begin{itemize}[leftmargin=*,nosep,topsep=2pt]
    \item Led team of 5 engineers on core platform
    \item Reduced latency by 50\% through optimization
    \item Mentored 3 junior developers
\end{itemize}

\vspace{6pt}
\textbf{Software Engineer}\\
\textit{Startup Inc.} \hfill 2020--2022
\begin{itemize}[leftmargin=*,nosep,topsep=2pt]
    \item Built React dashboard for 1000+ users
    \item Developed REST APIs with Node.js
    \item Implemented CI/CD pipelines
\end{itemize}

\vspace{6pt}
\textbf{Junior Developer}\\
\textit{Agency XYZ} \hfill 2018--2020
\begin{itemize}[leftmargin=*,nosep,topsep=2pt]
    \item Created responsive websites
    \item Worked with WordPress and PHP
\end{itemize}

\section{Projects}

\textbf{Open Source CLI Tool}\\
Node.js tool with 500+ GitHub stars

\vspace{4pt}
\textbf{Personal Portfolio}\\
Next.js site with 99 Lighthouse score

% SWITCH TO RIGHT COLUMN
\switchcolumn

\section{Skills}

\textbf{Languages}\\
JavaScript, TypeScript, Python, Go

\vspace{4pt}
\textbf{Frontend}\\
React, Next.js, Vue.js, Tailwind CSS

\vspace{4pt}
\textbf{Backend}\\
Node.js, Express, FastAPI, GraphQL

\vspace{4pt}
\textbf{Databases}\\
PostgreSQL, MongoDB, Redis

\vspace{4pt}
\textbf{DevOps}\\
Docker, Kubernetes, AWS, GCP

\vspace{4pt}
\textbf{Tools}\\
Git, GitHub Actions, Terraform

\section{Education}

\textbf{B.S. Computer Science}\\
University Name\\
2018 | GPA: 3.8

\section{Certifications}

AWS Solutions Architect\\
Google Cloud Professional

\section{Languages}

English (Native)\\
Spanish (Conversational)

\end{paracol}

\end{document}"""
    },

    "sales-marketing": {
        "id": "sales-marketing",
        "name": "Sales & Marketing",
        "category": "Professional",
        "description": "Results-focused design for sales roles",
        "color": "bg-orange-500",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.75in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}

\definecolor{sales}{RGB}{234,88,12}
\definecolor{dark}{RGB}{30,30,30}

\titleformat{\section}{\large\bfseries\color{sales}}{}{0em}{}[\color{sales}\titlerule]
\titlespacing{\section}{0pt}{12pt}{6pt}

\pagestyle{empty}

\begin{document}

\begin{center}
    {\LARGE\bfseries YOUR NAME}\\[4pt]
    {\large\color{sales}Senior Sales Executive | Revenue Growth Expert}\\[8pt]
    your.email@example.com $\bullet$ (555) 123-4567 $\bullet$ New York, NY\\
    \href{https://linkedin.com/in/you}{LinkedIn Profile}
\end{center}

\section{Career Highlights}
\begin{center}
\begin{tabular}{ccc}
    \textbf{\color{sales}\$15M+} & \textbf{\color{sales}180\%} & \textbf{\color{sales}500+} \\
    Revenue Generated & Quota Achievement & Deals Closed \\
\end{tabular}
\end{center}

\section{Professional Summary}
Top-performing sales leader with 10+ years driving revenue growth in SaaS and enterprise software. 
Consistently exceed quotas by 150\%+. Expert in consultative selling, complex negotiations, and 
building lasting client relationships. Track record of closing multi-million dollar deals with 
Fortune 500 companies.

\section{Professional Experience}

\noindent\textbf{Enterprise Account Executive} \hfill 2021 -- Present\\
\textit{SaaS Company Inc.} \hfill \$3M+ Annual Quota
\begin{itemize}[leftmargin=*,nosep]
    \item Achieved 185\% of quota in 2023, generating \$5.5M in new ARR
    \item Closed largest deal in company history (\$2.1M, 3-year contract)
    \item Expanded into 3 new verticals, creating \$8M pipeline
    \item Reduced sales cycle by 30\% through improved discovery process
\end{itemize}

\vspace{8pt}
\noindent\textbf{Senior Sales Representative} \hfill 2018 -- 2021\\
\textit{Tech Solutions Corp.}
\begin{itemize}[leftmargin=*,nosep]
    \item President's Club winner 3 consecutive years
    \item Grew territory revenue from \$1M to \$4M annually
    \item Trained and mentored 5 new sales reps
\end{itemize}

\section{Key Skills}
\textbf{Sales:} Enterprise Sales, Solution Selling, Contract Negotiation, Pipeline Management\\
\textbf{Tools:} Salesforce, HubSpot, Outreach, LinkedIn Sales Navigator, Gong\\
\textbf{Industries:} SaaS, FinTech, Healthcare Tech, Enterprise Software

\section{Education}
\textbf{MBA, Marketing} -- NYU Stern School of Business \hfill 2018\\
\textbf{BA, Business Administration} -- Boston University \hfill 2013

\end{document}"""
    },

    "designer-pro": {
        "id": "designer-pro",
        "name": "Designer Pro",
        "category": "Creative",
        "description": "Show your design skills with this template",
        "color": "bg-pink-500",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.6in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}
\usepackage{tikz}

\definecolor{pink}{RGB}{236,72,153}
\definecolor{purple}{RGB}{168,85,247}
\definecolor{dark}{RGB}{24,24,27}

\titleformat{\section}{\large\bfseries\color{pink}}{}{0em}{}
\titlespacing{\section}{0pt}{10pt}{6pt}

\pagestyle{empty}

\begin{document}

% Gradient-style header (simulated)
\noindent
\begin{tikzpicture}[remember picture, overlay]
    \fill[left color=pink, right color=purple, opacity=0.1] 
        (-1,1) rectangle (\paperwidth+1,-2.5);
\end{tikzpicture}

\begin{center}
    {\Huge\bfseries\color{dark} YOUR NAME}\\[6pt]
    {\Large\color{pink} Product Designer}\\[10pt]
    \href{https://yourportfolio.design}{yourportfolio.design} $\bullet$
    \href{mailto:hello@yourname.design}{hello@yourname.design} $\bullet$
    San Francisco
\end{center}

\vspace{8pt}

\section{Design Philosophy}
I believe great design is invisible -- it gets out of the way and lets users accomplish their goals. 
With 6+ years crafting digital products, I combine user research, visual design, and prototyping 
to create experiences that are both beautiful and functional.

\section{Experience}

\noindent\textbf{Lead Product Designer} \hfill 2022 -- Present\\
\textit{Design-Forward Startup}
\begin{itemize}[leftmargin=*,nosep]
    \item Lead design for flagship product used by 2M+ users
    \item Built and scaled design system from scratch (500+ components)
    \item Increased user retention by 35\% through UX improvements
    \item Manage team of 3 designers, established design critique culture
\end{itemize}

\vspace{6pt}
\noindent\textbf{Senior Product Designer} \hfill 2019 -- 2022\\
\textit{Tech Company}
\begin{itemize}[leftmargin=*,nosep]
    \item Redesigned core user flows, improving conversion by 50\%
    \item Conducted 100+ user interviews and usability tests
    \item Collaborated with engineering to ship features bi-weekly
\end{itemize}

\section{Featured Work}

\textbf{\color{pink}Financial App Redesign} -- Complete overhaul of mobile banking experience\\
\textit{Result: 4.8 App Store rating, 45\% increase in daily active users}

\vspace{4pt}
\textbf{\color{pink}Design System} -- Built component library for enterprise SaaS\\
\textit{Result: 60\% faster design-to-dev handoff, adopted by 8 product teams}

\section{Skills \& Tools}

\textbf{Design:} Figma, Sketch, Adobe Creative Suite, Principle, Framer\\
\textbf{Research:} User Interviews, Usability Testing, A/B Testing, Analytics\\
\textbf{Other:} Design Systems, Accessibility (WCAG), HTML/CSS, React basics

\section{Education}
\textbf{BFA, Graphic Design} -- Rhode Island School of Design (RISD)

\end{document}"""
    },

    "classic": {
        "id": "classic",
        "name": "Classic",
        "category": "Simple",
        "description": "Traditional resume format that never goes out of style",
        "color": "bg-amber-600",
        "content": r"""\documentclass[11pt,letterpaper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}

\pagestyle{empty}
\setlength{\parindent}{0pt}

\begin{document}

\begin{center}
    {\Large\textbf{YOUR NAME}}\\[6pt]
    123 Main Street, City, State 12345\\
    (555) 123-4567 $|$ your.email@example.com\\
    \href{https://linkedin.com/in/yourprofile}{linkedin.com/in/yourprofile}
\end{center}

\vspace{12pt}
\noindent\textbf{\large OBJECTIVE}
\vspace{2pt}
\hrule
\vspace{6pt}
Seeking a challenging position as a Software Engineer where I can utilize my programming 
skills and contribute to innovative projects while continuing to grow professionally.

\vspace{12pt}
\noindent\textbf{\large EDUCATION}
\vspace{2pt}
\hrule
\vspace{6pt}
\textbf{Bachelor of Science in Computer Science} \hfill May 2020\\
University Name, City, State\\
GPA: 3.7/4.0 | Dean's List (6 semesters)\\
\textit{Relevant Coursework:} Data Structures, Algorithms, Database Systems, Software Engineering

\vspace{12pt}
\noindent\textbf{\large EXPERIENCE}
\vspace{2pt}
\hrule
\vspace{6pt}

\textbf{Software Engineer} \hfill June 2020 -- Present\\
\textit{Company Name, City, State}
\begin{itemize}[nosep,leftmargin=20pt]
    \item Develop and maintain web applications using Java, Spring Boot, and React
    \item Collaborate with team members to design and implement new features
    \item Write clean, maintainable code following best practices and coding standards
    \item Participate in code reviews and provide constructive feedback to peers
\end{itemize}

\vspace{6pt}
\textbf{Software Development Intern} \hfill Summer 2019\\
\textit{Another Company, City, State}
\begin{itemize}[nosep,leftmargin=20pt]
    \item Assisted in developing internal tools using Python and Django
    \item Created documentation for software processes and procedures
    \item Participated in daily stand-up meetings and sprint planning
\end{itemize}

\vspace{12pt}
\noindent\textbf{\large SKILLS}
\vspace{2pt}
\hrule
\vspace{6pt}
\textbf{Programming Languages:} Java, Python, JavaScript, C++, SQL\\
\textbf{Technologies:} React, Node.js, Spring Boot, PostgreSQL, Git, Docker\\
\textbf{Soft Skills:} Problem-solving, Team collaboration, Communication, Time management

\vspace{12pt}
\noindent\textbf{\large ACTIVITIES}
\vspace{2pt}
\hrule
\vspace{6pt}
\begin{itemize}[nosep,leftmargin=20pt]
    \item Member, Association for Computing Machinery (ACM)
    \item Volunteer, Code for America -- taught programming to underserved youth
\end{itemize}

\end{document}"""
    },

    "software-engineer-plus": {
        "id": "software-engineer-plus",
        "name": "Software Engineer Plus",
        "category": "Tech",
        "description": "High-impact design with modern typography for senior roles",
        "color": "bg-cyan-600",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.6in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}

\definecolor{techblue}{RGB}{3,105,161}
\definecolor{dark}{RGB}{15,23,42}

\titleformat{\section}{\large\bfseries\color{techblue}}{}{0em}{}[\color{techblue}\titlerule]
\titlespacing{\section}{0pt}{10pt}{6pt}

\pagestyle{empty}

\begin{document}

\begin{center}
    {\Huge\bfseries\color{dark} YOUR NAME}\\[4pt]
    {\large\color{techblue}Senior Full-Stack Engineer}\\[6pt]
    \texttt{your.email@example.com} $\bullet$ (555) 123-4567 $\bullet$ 
    \href{https://github.com/you}{github.com/you} $\bullet$ 
    \href{https://yoursite.com}{yoursite.com}
\end{center}

\section{Summary}
Senior Software Engineer with 8+ years of experience specializing in high-performance distributed systems. 
Expert in architecting scalable backends with Node.js/Go and crafting intuitive frontends with React. 

\section{Technical Expertise}
\begin{itemize}[leftmargin=*,nosep]
    \item \textbf{Languages:} TypeScript, JavaScript, Go, Python, SQL, C++
    \item \textbf{Frameworks:} React, Next.js, Node.js, Express, FastAPI, Gin
    \item \textbf{Infrastructure:} AWS (EC2, S3, RDS, Lambda), Docker, Kubernetes, Terraform
\end{itemize}

\section{Experience}

\noindent\textbf{Senior Software Engineer} | \textit{Global Tech Inc.} \hfill 2021 -- Present
\begin{itemize}[leftmargin=*,nosep,topsep=2pt]
    \item Re-architected core messaging system to handle 5B+ monthly events using Go and Kafka
    \item Reduced infra costs by \$2.4M/year through strategic right-sizing
\end{itemize}

\section{Education}
\textbf{Master of Science in Computer Science} $|$ \textit{Technical University} \hfill 2018

\end{document}"""
    },

    "data-science-elite": {
        "id": "data-science-elite",
        "name": "Data Science Elite",
        "category": "Data",
        "description": "Clean, data-focused layout with emphasis on projects and metrics",
        "color": "bg-emerald-600",
        "content": r"""\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.7in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{xcolor}

\definecolor{emerald}{RGB}{5,150,105}

\titleformat{\section}{\large\bfseries\color{emerald}}{}{0em}{}[\vspace{2pt}\hrule]

\pagestyle{empty}

\begin{document}

\begin{center}
    {\Huge\bfseries YOUR NAME}\\[4pt]
    Data Scientist | Machine Learning Engineer\\[6pt]
    \href{mailto:email@example.com}{email@example.com} $\bullet$ 
    \href{https://scholar.google.com}{Google Scholar} $\bullet$ 
    \href{https://github.com/you}{GitHub}
\end{center}

\section{Technical Skills}
\begin{itemize}[leftmargin=*,nosep]
    \item \textbf{Core:} Python (Pandas, NumPy, Scikit-learn), R, SQL, Spark
    \item \textbf{Deep Learning:} PyTorch, TensorFlow, Keras, HuggingFace
\end{itemize}

\section{Professional Experience}

\noindent\textbf{Lead Data Scientist} $|$ \textit{DataCo AI} \hfill 2021 -- Present
\begin{itemize}[leftmargin=*,nosep]
    \item Developed predictive maintenance model reducing downtime by 25\%
    \item Optimized recommendation engine using deep reinforcement learning
\end{itemize}

\section{Education}
\textbf{BS in Mathematics \& CS} $|$ \textit{Top University} \hfill 2020

\end{document}"""
    }
}

def get_all_templates():
    """Returns list of all templates with metadata (without full content)"""
    return [
        {
            "id": t["id"],
            "name": t["name"],
            "category": t["category"],
            "description": t["description"],
            "color": t["color"]
        }
        for t in TEMPLATES.values()
    ]

def get_template_by_id(template_id: str):
    """Returns full template including LaTeX content"""
    return TEMPLATES.get(template_id)
