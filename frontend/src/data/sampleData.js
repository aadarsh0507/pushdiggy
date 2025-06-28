export const services = [
  {
    id: '1',
    name: 'Cloud Infrastructure',
    description: 'Scalable cloud solutions for modern businesses with enterprise-grade security and reliability.',
    price: '₹2999/month',
    features: ['24/7 Support', 'Auto Scaling', 'Backup & Recovery', 'Security Monitoring', 'Load Balancing'],
    category: 'Infrastructure',
    icon: 'Cloud'
  },
  {
    id: '2',
    name: 'Cybersecurity Suite',
    description: 'Comprehensive security solutions to protect your business from evolving cyber threats.',
    price: '₹1999/month',
    features: ['Firewall Management', 'Threat Detection', 'Compliance Support', 'Security Training', 'Incident Response'],
    category: 'Security',
    icon: 'Shield'
  },
  {
    id: '3',
    name: 'Data Analytics',
    description: 'Transform your data into actionable insights with advanced analytics and reporting.',
    price: '$399/month',
    features: ['Real-time Dashboards', 'Predictive Analytics', 'Custom Reports', 'Data Integration', 'ML Models'],
    category: 'Analytics',
    icon: 'BarChart3'
  },
  {
    id: '4',
    name: 'IT Consulting',
    description: 'Strategic IT guidance for business growth and digital transformation.',
    price: '$150/hour',
    features: ['Technology Strategy', 'Digital Transformation', 'Process Optimization', 'ROI Analysis', 'Implementation'],
    category: 'Consulting',
    icon: 'Users'
  },
  {
    id: '5',
    name: 'Managed Services',
    description: '24/7 IT support and management for your entire technology infrastructure.',
    price: '$499/month',
    features: ['Proactive Monitoring', 'Help Desk Support', 'Patch Management', 'Asset Management', 'Performance Optimization'],
    category: 'Support',
    icon: 'Settings'
  },
  {
    id: '6',
    name: 'Web Development',
    description: 'Custom web applications and websites built with modern technologies.',
    price: '$99/hour',
    features: ['Responsive Design', 'E-commerce Solutions', 'CMS Integration', 'API Development', 'SEO Optimization'],
    category: 'Development',
    icon: 'Code'
  }
];

export const clients = [
  {
    id: '1',
    name: 'John Smith',
    email: 'client@technova.com',
    company: 'ABC Corporation',
    services: ['Cloud Infrastructure', 'Cybersecurity Suite'],
    joinDate: '2024-01-15',
    status: 'active',
    phone: '(555) 123-4567'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    company: 'Tech Innovations Inc',
    services: ['Data Analytics', 'IT Consulting'],
    joinDate: '2024-02-20',
    status: 'active',
    phone: '(555) 234-5678'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@example.com',
    company: 'Digital Solutions Ltd',
    services: ['Cloud Infrastructure', 'Managed Services'],
    joinDate: '2024-03-10',
    status: 'inactive',
    phone: '(555) 345-6789'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    company: 'StartUp Ventures',
    services: ['Web Development', 'Cybersecurity Suite'],
    joinDate: '2024-03-25',
    status: 'active',
    phone: '(555) 456-7890'
  }
];

export const messages = [
  {
    id: '1',
    name: 'Alice Cooper',
    email: 'alice@example.com',
    subject: 'Inquiry about Cloud Services',
    message: 'I would like to know more about your cloud infrastructure solutions for our growing business. We currently have 50 employees and expect to double in size next year.',
    date: '2024-01-10',
    status: 'new',
    phone: '(555) 111-2222'
  },
  {
    id: '2',
    name: 'Bob Martin',
    email: 'bob@example.com',
    subject: 'Cybersecurity Consultation',
    message: 'We need help with improving our cybersecurity posture. Can we schedule a consultation? We\'ve had some security incidents recently.',
    date: '2024-01-08',
    status: 'read',
    phone: '(555) 222-3333'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    subject: 'Data Migration Support',
    message: 'Looking for assistance with migrating our legacy systems to the cloud. We have about 10TB of data to migrate.',
    date: '2024-01-05',
    status: 'replied',
    phone: '(555) 333-4444'
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david@example.com',
    subject: 'Web Development Quote',
    message: 'We need a new e-commerce website for our retail business. Looking for a quote on development and ongoing maintenance.',
    date: '2024-01-12',
    status: 'new',
    phone: '(555) 444-5555'
  }
];

export const supportRequests = [
  {
    id: '1',
    clientId: '1',
    clientName: 'John Smith',
    subject: 'Server Performance Issue',
    description: 'Our application is experiencing slow response times during peak hours. The database queries seem to be taking longer than usual.',
    priority: 'high',
    status: 'in-progress',
    date: '2024-01-12',
    assignedTo: 'Tech Support Team'
  },
  {
    id: '2',
    clientId: '1',
    clientName: 'John Smith',
    subject: 'Backup Verification',
    description: 'Need to verify that our automated backups are working correctly. Last week\'s backup seems to be incomplete.',
    priority: 'medium',
    status: 'resolved',
    date: '2024-01-10',
    assignedTo: 'Infrastructure Team'
  },
  {
    id: '3',
    clientId: '2',
    clientName: 'Sarah Johnson',
    subject: 'Dashboard Access Issue',
    description: 'Unable to access the analytics dashboard. Getting authentication errors when trying to log in.',
    priority: 'medium',
    status: 'open',
    date: '2024-01-14',
    assignedTo: 'Support Team'
  }
];

export const teamMembers = [
  {
    id: '1',
    name: 'Michael Chen',
    role: 'CEO & Founder',
    bio: 'Over 15 years of experience in IT leadership and business strategy.',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Sarah Rodriguez',
    role: 'CTO',
    bio: 'Expert in cloud architecture and cybersecurity with a passion for innovation.',
    image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'David Kim',
    role: 'Lead Developer',
    bio: 'Full-stack developer specializing in modern web technologies and scalable solutions.',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    name: 'Emma Thompson',
    role: 'Data Scientist',
    bio: 'PhD in Computer Science with expertise in machine learning and data analytics.',
    image: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const testimonials = [
  {
    id: '1',
    name: 'Jennifer Walsh',
    company: 'Global Enterprises',
    role: 'IT Director',
    content: 'PUSH DIGGY transformed our IT infrastructure completely. Their cloud migration service was seamless and their ongoing support is exceptional.',
    rating: 5,
    image: 'https://images.pexels.com/photos/3184340/pexels-photo-3184340.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Robert Martinez',
    company: 'Innovation Corp',
    role: 'CEO',
    content: 'The cybersecurity solutions provided by TechNova have given us peace of mind. Their proactive approach to security is exactly what we needed.',
    rating: 5,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Lisa Chang',
    company: 'DataFlow Systems',
    role: 'Operations Manager',
    content: 'Their data analytics platform has revolutionized how we make business decisions. The insights we get are invaluable for our growth strategy.',
    rating: 5,
    image: 'https://images.pexels.com/photos/3184341/pexels-photo-3184341.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];