import {motion, AnimatePresence} from 'framer-motion';
import {CreditCard, Check, Zap, Star, Shield, ArrowLeft, ArrowRight} from 'lucide-react';
import React, {useState, useEffect, useRef} from 'react';

import CustomButton from '@/shared/components/forms/CustomButton';
import Layout from '@/shared/components/layout/templates/Layout';

const BillingPage: React.FC = () => {
    const [isAnnual, setIsAnnual] = useState(false);
    const [activeCardIndex, setActiveCardIndex] = useState(1); // Start with Standard plan
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    const plans = [
        {
            name: 'Free',
            monthlyPrice: null,
            annualPrice: null,
            period: '',
            description: 'Test out our platform and come see if its for you',
            features: [
                '100 documents/month',
                'Basic parsing features',
                'Email support',
                'Basic analytics',
            ],
            popular: false
        },
        {
            name: 'Standard',
            monthlyPrice: 20,
            annualPrice: 16, // 20% discount
            period: '/month',
            description: 'Perfect for small teams getting started with document processing',
            features: [
                '1,000 documents/month',
                'Basic parsing features',
                'API access',
                'Email support',
                'Advanced analytics',
                '98.2% uptime SLA'
            ],
            popular: false
        },
        {
            name: 'Professional',
            monthlyPrice: 50,
            annualPrice: 40, // 20% discount
            period: '/month',
            description: 'Advanced features for growing businesses and teams',
            features: [
                '10,000 documents/month',
                'Advanced parsing & AI',
                'Custom integrations',
                'Priority support',
                '99.9% uptime SLA',
                'Team collaboration',
                'Advanced Analytics'
            ],
            popular: true
        },
        {
            name: 'Enterprise',
            monthlyPrice: null,
            annualPrice: null,
            period: '',
            description: 'Tailored solutions for large organizations',
            features: [
                'Unlimited documents',
                'Custom AI models',
                'Dedicated infrastructure',
                '24/7 phone support',
                '99.99% uptime SLA',
                'Advanced security',
                'Custom integrations',
                'Dedicated success manager'
            ],
            popular: false
        }
    ];

    // Handle touch events for mobile swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const difference = touchStartX.current - touchEndX.current;
        if (difference > 50) { // Swipe left
            goToNextCard();
        } else if (difference < -50) { // Swipe right
            goToPrevCard();
        }
    };

    const goToNextCard = () => {
        setActiveCardIndex(prev => prev === plans.length - 1 ? 0 : prev + 1);
    };

    const goToPrevCard = () => {
        setActiveCardIndex(prev => prev === 0 ? plans.length - 1 : prev - 1);
    };

    // Auto-scroll to active card on mobile
    useEffect(() => {
        if (carouselRef.current && window.innerWidth < 1024) {
            const scrollAmount = activeCardIndex * (288 + 24); // Card width + gap
            carouselRef.current.scrollTo({left: scrollAmount, behavior: 'smooth'});
        }
    }, [activeCardIndex]);

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <h1 className="text-2xl font-bold text-gray-900">Billing & Plans</h1>
                        <p className="text-gray-600 mt-1">Future pricing plans - currently in beta development</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Pricing Header */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Future Pricing Plans
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            We're still in beta, but here's our planned pricing structure. Beta users get special early
                            access pricing.
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 mb-8">
                            <button
                                onClick={() => setIsAnnual(false)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    !isAnnual
                                        ? 'text-gray-900 bg-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setIsAnnual(true)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    isAnnual
                                        ? 'text-gray-900 bg-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Annual
                                <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Desktop Carousel */}
                    <div className="hidden lg:block mb-16 relative">
                        <div className="flex justify-center items-center">
                            {/* Navigation arrows */}
                            <button
                                onClick={goToPrevCard}
                                className="absolute left-0 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                                aria-label="Previous plan"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-500"/>
                            </button>

                            {/* Cards Carousel */}
                            <div className="w-full max-w-4xl mx-auto">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeCardIndex}
                                        initial={{opacity: 0, x: 100}}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: -100}}
                                        transition={{duration: 0.5}}
                                        className="flex justify-center"
                                    >
                                        {/* Current active card */}
                                        <div
                                            className={`relative bg-white rounded-2xl shadow-lg border ${
                                                plans[activeCardIndex].popular
                                                    ? 'border-blue-200 ring-2 ring-blue-100'
                                                    : 'border-gray-200'
                                            } p-8 flex flex-col w-full max-w-xl min-h-[550px]`}
                                        >
                                            {plans[activeCardIndex].popular && (
                                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                    <div
                                                        className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                                                        <Star className="w-4 h-4 mr-1"/>
                                                        Most Popular
                                                    </div>
                                                </div>
                                            )}

                                            <div className="text-center mb-8">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plans[activeCardIndex].name}</h3>
                                                <div className="flex items-baseline justify-center mb-4">
                          <span className="text-5xl font-bold text-gray-900">
                            {plans[activeCardIndex].monthlyPrice ? (
                                `$${isAnnual ? plans[activeCardIndex].annualPrice : plans[activeCardIndex].monthlyPrice}`
                            ) : (
                                'Custom'
                            )}
                          </span>
                                                    <span
                                                        className="text-gray-600 ml-1">{plans[activeCardIndex].period}</span>
                                                </div>
                                                <p className="text-lg text-gray-600">{plans[activeCardIndex].description}</p>
                                            </div>

                                            <ul className="space-y-4 flex-grow max-w-md mx-auto w-full">
                                                {plans[activeCardIndex].features.map((feature) => (
                                                    <li key={feature} className="flex items-center">
                                                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"/>
                                                        <span className="text-gray-700">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="mt-8 max-w-xs mx-auto w-full">
                                                <CustomButton
                                                    variant={plans[activeCardIndex].popular ? 'primary' : 'outline'}
                                                    size="lg"
                                                    fullWidth
                                                >
                                                    {plans[activeCardIndex].name === 'Enterprise' ? 'Contact Us' : 'Join Beta'}
                                                </CustomButton>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={goToNextCard}
                                className="absolute right-0 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                                aria-label="Next plan"
                            >
                                <ArrowRight className="w-6 h-6 text-gray-500"/>
                            </button>
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center mt-8 space-x-2">
                            {plans.map((plan, index) => (
                                <button
                                    key={plan.name}
                                    onClick={() => setActiveCardIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                                        index === activeCardIndex ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                    aria-label={`Go to ${plan.name} plan`}
                                />
                            ))}
                        </div>

                        {/* Plan names */}
                        <div className="flex justify-center mt-4 space-x-8">
                            {plans.map((plan, index) => (
                                <button
                                    key={plan.name}
                                    onClick={() => setActiveCardIndex(index)}
                                    className={`text-sm font-medium transition-colors duration-200 ${
                                        index === activeCardIndex ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {plan.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Carousel */}
                    <div
                        className="lg:hidden mb-16"
                        ref={carouselRef}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 pb-8 hide-scrollbar">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={plan.name}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.6, delay: index * 0.1}}
                                    className={`relative flex-shrink-0 w-72 min-h-[500px] bg-white rounded-2xl shadow-sm border ${
                                        plan.popular
                                            ? 'border-blue-200 ring-2 ring-blue-100'
                                            : 'border-gray-200'
                                    } p-6 flex flex-col snap-center ${
                                        activeCardIndex === index ? 'scale-105 shadow-md z-10' : 'scale-100'
                                    }`}
                                    style={{
                                        transform: activeCardIndex === index ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'transform 0.3s ease-in-out'
                                    }}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                                            <div
                                                className="bg-blue-600 text-white px-3 py-1 mt-3 rounded-full text-xs font-medium whitespace-nowrap flex items-center">
                                                <Star className="w-3 h-3 mr-1"/>
                                                Most Popular
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-center mb-6 mt-3">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                                        <div className="flex items-baseline justify-center mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        {plan.monthlyPrice ? (
                            `$${isAnnual ? plan.annualPrice : plan.monthlyPrice}`
                        ) : (
                            'Custom'
                        )}
                      </span>
                                            <span className="text-gray-600 ml-1">{plan.period}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{plan.description}</p>
                                    </div>

                                    <ul className="space-y-3 flex-grow">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start">
                                                <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-0.5"/>
                                                <span className="text-sm text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-6">
                                        <CustomButton
                                            variant={plan.popular ? 'primary' : 'outline'}
                                            size="lg"
                                            fullWidth
                                        >
                                            {plan.name === 'Enterprise' ? 'Contact Us' : 'Join Beta'}
                                        </CustomButton>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center mt-6 space-x-2">
                            {plans.map((plan, index) => (
                                <button
                                    key={plan.name}
                                    onClick={() => setActiveCardIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                        index === activeCardIndex ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                    aria-label={`Go to ${plan.name} plan`}
                                />
                            ))}
                        </div>

                        {/* Swipe Hint */}
                        <div className="text-center mt-4 flex items-center justify-center gap-2">
                            <ArrowLeft className="w-3 h-3 text-gray-500"/>
                            <p className="text-sm text-gray-500">Swipe to see all plans</p>
                            <ArrowRight className="w-3 h-3 text-gray-500"/>
                        </div>
                    </div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.4}}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8 mb-16"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                            What we're building
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div
                                    className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-6 h-6 text-blue-600"/>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Lightning Fast</h4>
                                <p className="text-gray-600">Targeting sub-second processing with cloud-native
                                    architecture</p>
                            </div>

                            <div className="text-center">
                                <div
                                    className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-6 h-6 text-green-600"/>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Enterprise Security</h4>
                                <p className="text-gray-600">Building with enterprise security and compliance from day
                                    one</p>
                            </div>

                            <div className="text-center">
                                <div
                                    className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <CreditCard className="w-6 h-6 text-purple-600"/>
                                </div>
                                <h4 className="font-semibold text-gray-900 mb-2">Flexible Billing</h4>
                                <p className="text-gray-600">Simple, transparent pricing with no hidden fees</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* FAQ Section */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.5}}
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:p-8"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                            Beta Program FAQ
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    question: 'What does beta access include?',
                                    answer: 'Beta users get early access to our platform, direct feedback channels with our team, and special pricing when we launch.'
                                },
                                {
                                    question: 'When will the full platform launch?',
                                    answer: 'We\'re targeting a full launch in 2025. Beta users will be the first to know and get priority access.'
                                },
                                {
                                    question: 'How can I influence the product?',
                                    answer: 'Beta users have direct access to our product team and can request features, report issues, and shape our roadmap.'
                                },
                                {
                                    question: 'What are the beta requirements?',
                                    answer: 'Just enthusiasm for better document processing! We welcome feedback from users of all technical levels.'
                                }
                            ].map((faq, index) => (
                                <div key={index}>
                                    <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.6}}
                        className="text-center mt-12 px-4"
                    >
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Join our beta program
                        </h3>
                        <p className="text-gray-600 mb-8">
                            Be among the first to experience the future of document processing. Help us build something
                            amazing.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto sm:max-w-none">
                            <CustomButton size="lg">
                                Join Beta Program
                            </CustomButton>
                            <CustomButton variant="outline" size="lg">
                                Learn More
                            </CustomButton>
                        </div>
                    </motion.div>
                </div>
            </div>
        </Layout>
    );
};

export default BillingPage;