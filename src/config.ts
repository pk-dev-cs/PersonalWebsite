import { isPlaceholderOrigin, siteOrigin } from '../config/site-origin.mjs';

// Professional details transcribed from the supplied resume; blog samples remain illustrative.
export const profile = {
  example: false,
  firstName: 'Przemysław',
  lastName: 'Kleszcz',
  initials: 'p.k',
  handle: 'pk-dev-cs',
  role: 'Developer. Maker. Curious human.',
  description: 'I build thoughtful digital experiences.',
  siteDescription: 'Przemysław Kleszcz - Technical Lead and full-stack developer. Experience with .NET, Angular, application architecture, and development teams.',
  location: 'Kraków, PL',
  availability: 'Let’s talk about software',
  email: 'prz.kleszcz@gmail.com' as string,
  socialLinks: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/przemys%C5%82aw-kleszcz-23840995/' },
    { label: 'Facebook', url: 'https://www.facebook.com/kleszcz.przemyslaw/' },
    { label: 'GitHub', url: 'https://github.com/pk-dev-cs' },
  ],
};

export const resume = {
  intro: 'Technical leadership, full-stack development, and application architecture across web, desktop, mobile, and integration systems.',
  experience: [
    {
      start: '2022-02', end: null, role: 'Technical Lead', company: 'Caspio', location: 'Kraków',
      responsibilities: [
        'Maintaining a large-scale legacy system (C#, VB.NET).',
        'Leading a team of developers and testers.',
        'Designing the architecture and implementing a new integrations subsystem.',
      ],
    },
    {
      start: '2019-05', end: '2022-02', role: 'Senior Full Stack Web Developer', company: 'Aon', location: 'Kraków',
      responsibilities: [
        'Creating and maintaining web applications (ASP.NET Core, Angular).',
        'Making architectural decisions for a large-scale insurance and retirement system.',
        'Coordinating work on a large-scale legacy project.',
        'Supporting other teams as a consultant.',
      ],
    },
    {
      start: '2017-12', end: '2019-04', role: 'Senior Software Engineer', company: 'Global Logic', location: 'Kraków',
      responsibilities: [
        'Creating and maintaining Windows applications using C# and WPF.',
        'Creating and maintaining web applications (ASP.NET Core, Angular).',
        'Creating cross-platform applications (Ionic, Electron).',
        'Implementing device communication layers (OPC-UA).',
      ],
    },
    {
      start: '2016-05', end: '2017-10', role: 'Full-Stack Software Developer', company: 'Aype Sp. z o.o', location: 'Kraków',
      responsibilities: [
        'Creating and maintaining connectors and replication services.',
        'Creating web applications (AngularJS, Web API, ASP.NET MVC).',
        'Maintaining a mobile application (Java, Android).',
        'Creating and maintaining AUREA CRM system extensions.',
        'Designing and creating databases.',
      ],
    },
    {
      start: '2013-09', end: '2016-05', role: 'Full-Stack Software Developer', company: 'Tema Komputer Sp. z o.o', location: 'Andrychów',
      responsibilities: [
        'Creating ASP.NET MVC web applications.',
        'Creating web application interfaces using HTML, JavaScript, and CSS.',
        'Creating Windows applications using C# and Windows Forms.',
        'Designing and creating databases.',
      ],
    },
  ],
  skills: [
    { category: 'Programming languages', items: ['C#', 'C', 'Java', 'JavaScript', 'TypeScript'], note: 'Practical experience with these languages.' },
    { category: 'Platform', items: ['.NET'], note: 'Very good knowledge of the .NET platform.' },
    { category: 'Frontend', items: ['Angular'], note: 'Experience with Angular.' },
    { category: 'Databases', items: ['MSSQL', 'MySQL', 'Oracle'], note: '' },
    { category: 'Version control', items: ['Git'], note: 'Very good knowledge of Git.' },
  ],
  education: {
    degree: 'Master of Science in Engineering',
    institution: 'Cracow University of Technology',
    location: 'Kraków',
  },
  languages: ['Polish', 'English'],
};

export const site = {
  origin: siteOrigin,
  placeholderOrigin: isPlaceholderOrigin,
  title: `${profile.firstName} ${profile.lastName}`,
  language: 'en',
};

export const navigation = [
  { label: 'About', href: '/', number: '01', file: 'about.md' },
  { label: 'Resume', href: '/resume/', number: '02', file: 'resume.md' },
  { label: 'Blog', href: '/blog/', number: '03', file: 'blog/' },
  { label: 'Contact', href: '/contact/', number: '04', file: 'contact.md' },
] as const;

export type Section = (typeof navigation)[number]['label'];
