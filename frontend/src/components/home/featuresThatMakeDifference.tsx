import useHomeData from '@/utils/useHomeData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const FeaturesThatMakeDifference = () => {
  const { features } = useHomeData();
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-800/30 rounded-xl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Features That Make a Difference</h2>
          <p className="text-xl max-w-3xl mx-auto font-light">
            Cutting-edge technology developed specifically for the Brazilian market
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-neutral-800/50 border hover:bg-neutral-800/70 transition-all duration-300 hover:scale-105"
              >
                <CardHeader>
                  <div className="h-14 w-14 bg-gradient-to-r from-rose-800 via-rose-700 to-rose-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-light leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default FeaturesThatMakeDifference;
