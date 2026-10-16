import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, CheckCircle2, Heart, Phone, MapPin, Clock,
  Calendar, Coffee, Sun, Moon, Home as HomeIcon, AlertCircle, ArrowRight
} from 'lucide-react';

export const OldAgeHome: React.FC = () => {
  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-foundation-forest/10 text-foundation-forest text-xs font-semibold">
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Dedicated Elder Sanctuary • Anjikar Bagh, Mahuli</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foundation-charcoal">
            VYENKATESH ASHRAM
          </h1>
          <p className="text-sm md:text-base text-stone-600 leading-relaxed">
            A peaceful, charitable old-age home created to give elderly citizens a safe, clean, supportive, and dignified living environment surrounded by green orchards.
          </p>
        </div>

        {/* Feature Hero Card with Building Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-foundation-borderMuted shadow-md">
            <img
              src="/assets/images/ashram_building.jpg"
              alt="Vyenkatesh Ashram Building Exterior"
              className="w-full h-80 object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-foundation-forest font-bold">
              Living with Dignity & Companionship
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal">
              A Home Designed for Senior Comfort
            </h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
              Located away from urban noise and pollution along the Mansar-Mahuli Road, Vyenkatesh Ashram features a spacious two-story structure with wide shaded verandas, comfortable accommodations, hygienic separate restrooms, and a dining hall serving pure vegetarian meals.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-stone-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-foundation-forest flex-shrink-0" />
                <span>Comfortable Living Rooms</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-foundation-forest flex-shrink-0" />
                <span>Separate Restroom Facilities</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-foundation-forest flex-shrink-0" />
                <span>Nutritious Vegetarian Meals</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-foundation-forest flex-shrink-0" />
                <span>24/7 Attendants & Security</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                to="/admission"
                className="px-6 py-2.5 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory font-bold text-xs rounded-full shadow-md transition-all"
              >
                Submit Admission Enquiry
              </Link>
              <a
                href="tel:+919890898081"
                className="px-5 py-2.5 bg-foundation-sandstone/40 hover:bg-foundation-sandstone/70 text-foundation-charcoal font-semibold text-xs rounded-full border border-foundation-borderMuted transition-all flex items-center space-x-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-foundation-forest" />
                <span>Call +91 98908 98081</span>
              </a>
            </div>
          </div>
        </div>

        {/* Daily Schedule Routine */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-foundation-forest font-bold">
              Purposeful Living
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foundation-charcoal">
              Daily Schedule & Ashram Life
            </h2>
            <p className="text-xs text-stone-600">
              A balanced daily rhythm designed for physical vitality, mental peace, and warm companionship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-2">
              <div className="flex items-center justify-between text-foundation-forest">
                <Sun className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">06:00 – 08:30 AM</span>
              </div>
              <h3 className="font-bold text-sm text-foundation-charcoal">Morning Pranayama & Herbal Tea</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Waking up to birdsong in Anjikar Bagh, gentle breathing exercises, morning walk in the herbal garden, and freshly brewed herbal decoctions.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-2">
              <div className="flex items-center justify-between text-foundation-forest">
                <Coffee className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">08:30 – 12:30 PM</span>
              </div>
              <h3 className="font-bold text-sm text-foundation-charcoal">Breakfast, Go-Seva & Recreation</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Wholesome breakfast with pure cow milk, spending peaceful moments at the Go-Seva Kendra, newspaper reading, and light socializing.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-2">
              <div className="flex items-center justify-between text-foundation-forest">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">12:30 – 04:30 PM</span>
              </div>
              <h3 className="font-bold text-sm text-foundation-charcoal">Lunch & Afternoon Rest</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Freshly cooked balanced vegetarian lunch prepared with hygiene, followed by restful afternoon nap in airy, quiet rooms.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm space-y-2">
              <div className="flex items-center justify-between text-foundation-forest">
                <Moon className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">05:00 – 09:00 PM</span>
              </div>
              <h3 className="font-bold text-sm text-foundation-charcoal">Evening Bhajan, Dinner & Rest</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Evening tea, devotional satsang, bhajan recitations in the veranda hall, light nutritious dinner, and restful night sleep under watchful care.
              </p>
            </div>
          </div>
        </div>

        {/* Admission Guidelines & Direct Confirmation Alert */}
        <div className="bg-amber-50 rounded-3xl p-6 md:p-8 border border-amber-200 space-y-4">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-base">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <span>Important Admission & Visiting Guidelines</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-amber-950 leading-relaxed">
            <div>
              <p className="font-bold mb-1">1. Direct Confirmation Required:</p>
              <p>
                Because Vyenkatesh Ashram is a charitable home with limited capacity, admission availability, room suitability, and medical evaluations must be confirmed directly with the management. Submitting an enquiry form online initiates the review process but does not guarantee immediate admission.
              </p>
            </div>
            <div>
              <p className="font-bold mb-1">2. Prior Notification for Visits:</p>
              <p>
                Families and community visitors are encouraged to visit. To ensure that resident rest periods, medical appointments, and daily routines are not disrupted, we kindly ask that you telephone our office (+91 98908 98081) in advance.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-amber-200 text-xs">
            <span className="font-semibold text-amber-900">
              Ashram Address: 434, Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur – 441105
            </span>
            <Link
              to="/admission"
              className="text-amber-800 font-bold hover:underline flex items-center space-x-1"
            >
              <span>Go to Admission Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
