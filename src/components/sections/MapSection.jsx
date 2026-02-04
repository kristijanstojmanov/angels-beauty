import React from 'react';

const MapSection = () => {
    return (
        <section className="h-[500px] relative w-full grayscale-[50%] hover:grayscale-0 transition-all duration-500">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13217.766723225884!2d-118.4068212165039!3d34.07362071649994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c7c379fd081ed1!2sBeverly%20Hills%2C%20CA%2090210!5e0!3m2!1sen!2sus!4v1703000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
            ></iframe>

            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 bg-white dark:bg-background-dark p-6 rounded-2xl shadow-xl max-w-sm">
                <h3 className="text-xl font-bold font-display text-primary mb-2">Visit Our Salon</h3>
                <p className="text-text-muted-light dark:text-text-muted-dark mb-4 text-sm">
                    123 Luxury Lane, Beverly Hills, CA 90210
                </p>
                <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold underline decoration-gold-accent underline-offset-4 hover:text-primary transition-colors"
                >
                    Get Directions
                </a>
            </div>
        </section>
    );
};

export default MapSection;
