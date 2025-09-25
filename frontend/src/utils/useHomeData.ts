import { Bot, Clock, Shield, Zap } from 'lucide-react';

const useHomeData = () => {
      const features = [
    {
      icon: Bot,
      title: "Advanced AI",
      description: "State-of-the-art algorithms for accurate email classification with 95% accuracy"
    },
    {
      icon: Clock,
      title: "Time Savings",
      description: "Reduce up to 80% of the time spent on manual corporate email triage"
    },
    {
      icon: Shield,
      title: "Total Security",
      description: "End-to-end encryption and compliance with LGPD and international regulations"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Real-time analysis and response for thousands of emails simultaneously"
    }
  ]

  const stats = [
    { number: "50M+", label: "Processed Emails" },
    { number: "2.5s", label: "Average Analysis Time" },
    { number: "95%", label: "AI Accuracy" },
    { number: "500+", label: "Trusted Companies" }
  ]

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Operations Director",
      company: "FinTech Brazil",
      content: "It revolutionized our operation. We save 15 hours per week just on email triage.",
      rating: 5,
      src:"https://github.com/evilrabbit.png",
      alt:"@evilrabbit"
    },
    {
      name: "João Santos",
      role: "IT Manager",
      company: "Digital Bank",
      content: "The AI accuracy is impressive. We rarely have false positives.",
      rating: 5,
      src:"https://github.com/shadcn.png",
      alt:"@shadcn"
    },
    {
      name: "Ana Costa",
      role: "Head of Customer Success",
      company: "StartupX",
      content: "Intuitive interface and immediate results. Our team adopted it in minutes.",
      rating: 5,
      src:'https://rickandmortyapi.com/api/character/avatar/215.jpeg',
      alt: '@RS'
    }
  ]
  return {
    features,
    testimonials,
    stats
  }
}
export default useHomeData