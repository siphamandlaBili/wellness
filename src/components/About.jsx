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
              HealthSpace FMP Wellness is a collaborative innovation born from
              the partnership between leading experts in healthcare technology
              and clinical practice. Our mission is to seamlessly integrate
              health and wellness into everyday healthcare — transforming it
              from a once-off service into a continuous, patient-centered
              experience.
              <br />
              <br />
              This partnership brings together: Aflu Med Healthcare (Pty) Ltd
              Reg No: 2014/194125/07 (Hereinafter referred to as "the
              Developer") The Business Partner, jointly represented by: FMP
              Wellness (Pty) Ltd Reg No: 2024/479529/07 Alisha Lalbeharie
              Podiatrist Inc. T/A Foot Motion Podiatry Reg No: 2023/093592/21
              Together, we combine the power of advanced technology and clinical
              expertise into one unified solution — designed to enhance the way
              health and wellness are delivered, monitored, and applied to
              improve real patient outcomes.
              <br />
              <br />
              We believe health and wellness should form the foundation of
              healthcare — not just a one-time event. Our solution embeds
              wellness activities directly into each patient’s One Patient, One
              Health Record, ensuring that accurate, up-to-date information is
              always accessible at the point of care. This approach empowers
              healthcare providers and patients alike to make better-informed
              decisions, ultimately improving overall well-being and long-term
              health outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
