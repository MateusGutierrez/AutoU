import { createFileRoute } from '@tanstack/react-router';
import TurnEmailIntoProductivity from '@/components/home/turnEmailIntoProductivity';
import FeaturesThatMakeDifference from '@/components/home/featuresThatMakeDifference';
import WhatOurCLientsSay from '@/components/home/whatOurClientsSay';
import ReadyToTransform from '@/components/home/readyToTransform';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <TurnEmailIntoProductivity />
      <FeaturesThatMakeDifference />
      <WhatOurCLientsSay />
      <ReadyToTransform />
    </div>
  );
}
