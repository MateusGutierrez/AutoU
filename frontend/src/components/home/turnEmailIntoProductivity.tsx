import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import useHomeData from '@/utils/useHomeData';
import SparkCard from '../card';
import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';

const content =
  '"Hello! We have received your request and it is being processed. You will receive an update within 24 hours..."';
const status = 'Productive';

const TurnEmailIntoProductivity = () => {
  const { stats } = useHomeData();
  const navigate = useNavigate();
  const click = useCallback(() => {
    navigate({ to: '/quickStart' });
  }, []);
  return (
    <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <Badge className="mb-6 bg-gradient-to-r from-emerald-500/10 to-blue-600/10 text-emerald-400-400 border-emerald-500/20">
          <Sparkles className="h-4 w-4 mr-2" />
          Powered by Open AI
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          Turn Emails into
          <span className="bg-gradient-to-r from-rose-800 via-rose-700 to-rose-600 bg-clip-text text-transparent">
            {' '}
            Productivity
          </span>
        </h1>

        <p className="text-xl md:text-2xl  mb-12 max-w-4xl mx-auto leading-relaxed">
          The first AI platform in Brazil that automatically classifies corporate emails, suggests
          smart replies, and frees your team to focus on what really matters.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button className="px-8 py-6" onClick={click}>
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
              <div className="text-sm md:text-base font-extralight">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-red-600/20 rounded-3xl blur-3xl"></div>
          <SparkCard status={status} content={content} confidence="95" />
        </div>
      </div>
    </section>
  );
};
export default TurnEmailIntoProductivity;
