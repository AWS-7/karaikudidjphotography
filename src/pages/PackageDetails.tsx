import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, ArrowLeft, MessageCircle, Clock, Camera, Users, Film, Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { usePackages } from '../hooks/usePackages';
import img1 from '../images/1778054327731.jpg';
import img2 from '../images/1778054327722.jpg';
import img3 from '../images/1778054327710.jpg';
import img4 from '../images/1778054327688.jpg';

const packageImagesArray = [img1, img2, img3, img4];

export default function PackageDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { packages, loading } = usePackages();
  const pkgIndex = packages.findIndex((p) => p.id === id);
  const pkg = packages[pkgIndex];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-stone-800 mb-4">Package Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-gold-600 font-sans hover:underline flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16 relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-stone-500 hover:text-gold-600 transition-colors font-sans text-sm uppercase tracking-widest font-semibold"
        >
          <ArrowLeft size={18} />
          Back to Packages
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Image & Header */}
          <div className="space-y-8">
            <div className="relative aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={pkg.coverImage || packageImagesArray[pkgIndex] || img1}
                alt={pkg.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {pkg.popular && (
                <div className="absolute top-6 left-6 bg-gold-500 text-white px-6 py-2 rounded-full text-xs font-sans font-bold tracking-[0.2em] uppercase shadow-lg">
                  Most Popular
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="h-px w-12 bg-gold-400" />
                <span className="font-sans text-gold-600 text-xs tracking-[0.3em] uppercase font-bold">
                  Exclusive Package
                </span>
              </div>
              <h1 className="font-serif text-5xl sm:text-6xl text-stone-800 mb-4">
                {pkg.name} <span className="italic text-gold-600">Package</span>
              </h1>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl text-gold-600 font-light">{pkg.price}</span>
                <span className="font-sans text-stone-400 text-sm tracking-wide">{pkg.priceNote}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm text-center">
                <Clock className="mx-auto text-gold-500 mb-2" size={20} />
                <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest">Duration</p>
                <p className="font-serif text-stone-800 font-medium">Full Day</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm text-center">
                <Camera className="mx-auto text-gold-500 mb-2" size={20} />
                <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest">Photos</p>
                <p className="font-serif text-stone-800 font-medium">Edited</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm text-center">
                <Users className="mx-auto text-gold-500 mb-2" size={20} />
                <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest">Team</p>
                <p className="font-serif text-stone-800 font-medium">Pro</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm text-center">
                <Film className="mx-auto text-gold-500 mb-2" size={20} />
                <p className="font-sans text-[10px] text-stone-400 uppercase tracking-widest">Video</p>
                <p className="font-serif text-stone-800 font-medium">4K HDR</p>
              </div>
            </div>

            {/* Services List */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-100 shadow-xl">
              <h3 className="font-serif text-2xl text-stone-800 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center">
                  <Check size={16} className="text-gold-600" />
                </div>
                What's Included
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                {pkg.features.map((feature) => (
                  <li
                    key={feature.text}
                    className={`flex items-start gap-4 ${!feature.included ? 'opacity-30' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      feature.included ? 'bg-gold-50' : 'bg-stone-50'
                    }`}>
                      {feature.included ? (
                        <Check size={12} className="text-gold-600" strokeWidth={3} />
                      ) : (
                        <X size={12} className="text-stone-300" strokeWidth={3} />
                      )}
                    </div>
                    <span className={`font-sans text-sm leading-relaxed ${feature.included ? 'text-stone-700 font-medium' : 'text-stone-400'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <a
                href={`https://wa.me/918825605403?text=Hi%20Dass!%20I'm%20interested%20in%20the%20${pkg.name}%20package%20(${pkg.price}).`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-12 w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-sans text-base font-bold tracking-[0.1em] uppercase bg-gold-500 text-white hover:bg-gold-600 hover:shadow-2xl hover:shadow-gold-500/40 transition-all duration-500 transform hover:-translate-y-1"
              >
                <MessageCircle size={20} />
                Book This Package
              </a>
              <p className="text-center font-sans text-stone-400 text-[10px] mt-4 tracking-widest uppercase">
                * Prices may vary based on location and specific requirements
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
