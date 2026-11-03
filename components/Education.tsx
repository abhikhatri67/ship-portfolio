'use client';

import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const education = {
  institution: 'DIT University',
  location: 'Dehradun, India',
  degree: 'Bachelor of Technology',
  major: 'Computer Science',
  period: '2013 – 2017',
  cgpa: '7.5/10',
};

export const Education = () => {
  return (
    <section id="education" className="py-20 bg-slate-800/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-blue-400">Education</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Academic background and qualifications
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-slate-800 border-slate-700 hover:border-purple-500/50 transition-all duration-300">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-white mb-2 flex items-center gap-2">
                      <GraduationCap className="text-purple-400" size={28} />
                      {education.institution}
                    </CardTitle>
                    <CardDescription className="text-gray-400 flex items-center gap-2 mb-2">
                      <MapPin size={16} />
                      {education.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">{education.period}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                      <GraduationCap className="text-purple-400" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{education.degree}</h4>
                      <p className="text-gray-400">{education.major}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                      <Award className="text-purple-400" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">CGPA</h4>
                      <p className="text-gray-400">{education.cgpa}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
