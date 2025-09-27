import { Star } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarImage } from '../ui/avatar';
import useHomeData from '@/utils/useHomeData';

const WhatOurCLientsSay = () => {
  const { testimonials } = useHomeData();
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">What Our Clients Say</h2>
          <p className="text-xl font-light">Leading companies are already saving hours every day</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border bg-neutral-800/50">
              <CardContent className="pt-6">
                <div className="mb-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 leading-relaxed font-light">"{testimonial.content}"</p>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={testimonial.src} alt={testimonial.alt} />
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm font-light">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default WhatOurCLientsSay;
