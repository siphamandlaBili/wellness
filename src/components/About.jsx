import React from "react";

const AboutSection = () => {
  return (
    <section
    id="about"
    className="relative py-16 mx-auto max-w-6xl bg-transparent text-center"
  >
    <div className="container mx-auto px-4">
      <div className="flex w-full flex-col md:flex-row items-center justify-center">
        {/* Content Column */}
        <div className="md:w-full px-6">
          <div className="mb-10">
            <h2 className="text-[rgb(153,39,135)] dark:text-purple-400 text-4xl font-bold">
              About Us
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-[18px] leading-7 max-w-3xl mx-auto">
            Welcome to our wellness community, where your journey toward
            balance and mindfulness begins. We believe that wellness is more
            than just physical health — it’s a holistic approach to nurturing
            the mind, body, and spirit.
            <br /><br />
            Our mission is to create a safe space for everyone seeking
            guidance, connection, and empowerment. Join us for carefully
            curated events designed to inspire, heal, and uplift.
            <br /><br />
            Together, let's embark on a transformative path toward a healthier
            and happier life. Whether you're just starting or continuing your
            journey, we're here to support you every step of the way.
          </p>
        </div>
      </div>
    </div>
  </section>
  );
};

export default AboutSection;
