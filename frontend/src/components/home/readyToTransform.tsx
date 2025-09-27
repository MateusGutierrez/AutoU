import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';

const ReadyToTransform = () => {
  const navigate = useNavigate();
  const click = useCallback(() => {
    navigate({ to: '/quickStart' });
  }, []);
  return (
    <section className="my-8 rounded-xl bg-gradient-to-r from-neutral-900/50 to-neutral-900/50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
          Ready to Transform Your Operation?
        </h2>
        <p className="mb-8 text-xl font-light">
          Join hundreds of companies already saving hours every day
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button className="px-8 py-6" onClick={click}>
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
        <p className="mt-4 text-sm text-slate-400">✓ 14 days free ✓</p>
        <p className="mt-4 text-sm text-slate-400">✓ No credit card required</p>
        <p className="mt-4 text-sm text-slate-400">✓ Support in Portuguese</p>
      </div>
    </section>
  );
};
export default ReadyToTransform;
