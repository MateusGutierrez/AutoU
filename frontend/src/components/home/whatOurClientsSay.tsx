import { Star } from "lucide-react";
import { Card, CardContent } from "../ui/card"
import { Avatar, AvatarImage } from "../ui/avatar";
import useHomeData from "@/utils/useHomeData";

const WhatOurCLientsSay  = () => {
    const {testimonials} = useHomeData();
    return (
         <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl font-light">
              Leading companies are already saving hours every day
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-neutral-800/50 border">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="font-light mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-2">
                     <Avatar>
                      <AvatarImage
                        src={testimonial.src}
                        alt={testimonial.alt}
                      />
                    </Avatar>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="font-light text-sm">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
}
export default WhatOurCLientsSay;