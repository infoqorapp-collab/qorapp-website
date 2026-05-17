'use client';
import { motion } from 'framer-motion';
import PublicNavbar from '../../components/ui/PublicNavbar';

export default function AboutPage() {
  const team = [
    {
      name: 'Diana Uwinema',
      position: 'CEO',
      image: '/team/diane.jpeg',
      background: [
        'Background in enterprise management',
        'Strong understanding of SME operations and growth strategy',
        'Experience in business development and market research',
        'Focused on financial inclusion & merchant empowerment',
        'Leading product vision, partnerships, and go-to-market strategy'
      ]
    },
    {
      name: 'Joshua Mugisha',
      position: 'COO',
      image: '/team/joshua.jpeg',
      background: [
        'Experienced in logistics and operational systems',
        'Oversees merchant onboarding, operational execution, and field deployment'
      ]
    },
    {
      name: 'Sunny Kagame',
      position: 'CTO',
      image: '/team/kagame.jpeg',
      background: [
        'Experienced in Data Analytics, database Management',
        'Oversees system architecture',
        'Manages payment integrations',
        'Leads product development',
        'Responsible for secure payment infrastructure',
        'API integrations with mobile money'
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicNavbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-slate-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                About Us
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Discover the story behind QORAPP and meet the team building the future of merchant commerce in Africa.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="our-story" className="py-24 lg:py-32 bg-white px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-8">
                  Our Story
                </h2>
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-pesa-navy to-slate-400"></div>
                  <p className="text-lg text-slate-700 leading-relaxed pl-8">
                    Running a small business is already hard enough. Between managing customers, tracking stock, recording sales, handling payments, and staying profitable, most merchants end up juggling too many systems at once with no single place to see the full picture.
                  </p>
                  <p className="text-lg text-slate-700 leading-relaxed pl-8 mt-6">
                    We started with one question: "What would business management look like if it was designed around the everyday reality of African SMEs?" That question became our mission.
                  </p>
                  <p className="text-lg text-slate-700 leading-relaxed pl-8 mt-6">
                    We're building the platform we wish existed one that helps merchants manage their businesses with more clarity, confidence, and less stress, all from one place. Because you deserve tools as capable and considered as you are.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Team Section */}
        <section id="our-team" className="py-24 lg:py-32 bg-gradient-to-br from-slate-50 to-white px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-16 text-center">
                Our Team
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="group"
                >
                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pesa-navy/20 to-transparent"></div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-slate-200 hover:shadow-lg transition-shadow">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-lg font-semibold text-pesa-navy mb-4">
                      {member.position}
                    </p>
                    
                    <ul className="space-y-3">
                      {member.background.map((item, i) => (
                        <li key={i} className="flex items-start text-slate-600 text-sm leading-relaxed">
                          <span className="mr-3 mt-1.5 flex-shrink-0">
                            <svg className="w-4 h-4 text-pesa-navy" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 lg:py-32 bg-white px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-pesa-navy to-slate-800 rounded-3xl p-12 text-white text-center"
            >
              <h3 className="text-3xl font-bold mb-6">
                Our Mission
              </h3>
              <p className="text-lg leading-relaxed opacity-90">
                To empower African SMEs with world-class merchant management tools that simplify operations, reduce costs, and unlock growth opportunities in their local markets.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
