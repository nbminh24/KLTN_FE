'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, MapPin, Clock, Briefcase } from 'lucide-react';

const jobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'We're looking for an experienced frontend developer to join our team and help build amazing user experiences.',
  },
  {
    id: '2',
    title: 'Product Designer',
    department: 'Design',
    location: 'New York, US',
    type: 'Full-time',
    description: 'Join our design team to create beautiful and intuitive interfaces for our customers.',
  },
  {
    id: '3',
    title: 'Customer Success Manager',
    department: 'Customer Support',
    location: 'Remote',
    type: 'Full-time',
    description: 'Help our customers succeed by providing exceptional support and guidance.',
  },
  {
    id: '4',
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'London, UK',
    type: 'Full-time',
    description: 'Lead marketing campaigns and strategies to grow our brand presence globally.',
  },
  {
    id: '5',
    title: 'Backend Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Build scalable and reliable backend systems to power our e-commerce platform.',
  },
  {
    id: '6',
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Singapore',
    type: 'Full-time',
    description: 'Turn data into insights to drive business decisions and improve customer experience.',
  },
];

export default function CareerPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  
  const departments = ['All', 'Engineering', 'Design', 'Customer Support', 'Marketing', 'Analytics'];
  
  const filteredJobs = selectedDepartment === 'All' 
    ? jobs 
    : jobs.filter(job => job.department === selectedDepartment);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Career</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-integral font-bold mb-6">
              JOIN OUR TEAM
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Help us revolutionize online fashion. We're always looking for talented people to join our mission.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: 'Work From Anywhere',
                description: 'Flexible remote work options for most positions',
              },
              {
                title: 'Competitive Salary',
                description: 'Industry-leading compensation and benefits',
              },
              {
                title: 'Growth Opportunities',
                description: 'Learn and grow with a fast-paced startup',
              },
            ].map((benefit, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl p-6 text-center">
                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Department Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedDepartment === dept
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4 mb-16">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No positions available in this department</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">
                          {job.department}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Link
                        href={`/career/${job.id}`}
                        className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* CTA */}
          <div className="bg-black text-white rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Don't See Your Dream Role?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We're always interested in meeting talented people. Send us your resume and tell us about yourself.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
