import { createFileRoute } from '@tanstack/react-router';
import TurnEmailIntoProductivity from '@/components/home/turnEmailIntoProductivity';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <TurnEmailIntoProductivity />
    </div>
  );
}
