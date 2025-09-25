import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"

const ReadyToTransform = () => {
    return (
         <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-neutral-900/50 to-neutral-900/50 rounded-xl my-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Operation?
          </h2>
          <p className="text-xl font-light mb-8">
            Join hundreds of companies already saving hours every day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className=" px-8 py-6">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-slate-400 mt-4">
            ✓ 14 days free ✓
          </p>
          <p className="text-sm text-slate-400 mt-4">
            ✓ No credit card required
          </p>
          <p className="text-sm text-slate-400 mt-4">
            ✓ Support in Portuguese
          </p>
        </div>
      </section>
    )
}
export default ReadyToTransform;