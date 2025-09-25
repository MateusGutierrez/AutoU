import { ArrowRight, Check, CheckCircle, Copy, Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import useHomeData from "@/utils/useHomeData"
import { useState } from "react"

const TurnEmailIntoProductivity = () => {
    const [copied, setCopied] = useState(false);
  const {stats} = useHomeData();
  const handleCopy = async () => {
    await navigator.clipboard.writeText('"Hello! We have received your request and it is being processed. You will receive an update within 24 hours..."');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
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
              {" "}Productivity
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl  mb-12 max-w-4xl mx-auto leading-relaxed">
            The first AI platform in Brazil that automatically classifies corporate emails, 
            suggests smart replies, and frees your team to focus on what really matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button className="px-8 py-6">
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
            <div className="relative shadow-2xl">
              <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-slate-400 text-sm">EmailAI Pro</div>
                </div>
                <div className="space-y-3 bg-neutral-800 rounded-lg">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-800">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="font-light">Email classified as: <span className="text-green-400 font-semibold">Productive</span></span>
                    </div>
                    <Badge className="bg-green-500/10 text-green-400">95% confidence</Badge>
                  </div>
                    <Separator/>
                  
                  <div className="p-3 bg-neutral-800 rounded-lg relative">
                    <div className="font-light text-sm p-3 rounded">
                      "Hello! We have received your request and it is being processed. You will receive an update within 24 hours..."
                    </div>
                    <Button
                      onClick={handleCopy}
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}
export default TurnEmailIntoProductivity;