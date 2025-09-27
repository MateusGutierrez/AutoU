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
  }, [navigate]);
  return (
    <section className="px-4 pt-20 pb-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl text-center">
        <Badge className="text-emerald-400-400 mb-6 border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-blue-600/10">
          <Sparkles className="mr-2 h-4 w-4" />
          Powered by Open AI
        </Badge>

        <h1 className="mb-8 text-5xl leading-tight font-bold md:text-7xl">
          Turn Emails into
          <span className="bg-gradient-to-r from-rose-800 via-rose-700 to-rose-600 bg-clip-text text-transparent">
            {' '}
            Productivity
          </span>
        </h1>

        <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed md:text-2xl">
          The first AI platform in Brazil that automatically classifies corporate emails, suggests
          smart replies, and frees your team to focus on what really matters.
        </p>

        <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
          <Button className="px-8 py-6" onClick={click}>
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="mb-20 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-3xl font-bold md:text-4xl">{stat.number}</div>
              <div className="text-sm font-extralight md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-rose-500/20 to-red-600/20 blur-3xl"></div>
          <SparkCard status={status} content={content} confidence={0.95} />
        </div>
      </div>
    </section>
  );
};
export default TurnEmailIntoProductivity;
