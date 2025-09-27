import useHomeData from '@/utils/useHomeData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const FeaturesThatMakeDifference = () => {
  const { features } = useHomeData();
  return (
    <section id="features" className="rounded-xl bg-neutral-800/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">Features That Make a Difference</h2>
          <p className="mx-auto max-w-3xl text-xl font-light">
            Cutting-edge technology developed specifically for the Brazilian market
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border bg-neutral-800/50 transition-all duration-300 hover:scale-105 hover:bg-neutral-800/70"
              >
                <CardHeader>
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-rose-800 via-rose-700 to-rose-600">
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed font-light">
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
