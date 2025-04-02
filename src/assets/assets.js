import search_icon from "./search_icon.svg";
import company_icon from "./company_icon.svg";
import microsoft_logo from "./microsoft_logo.svg";
import walmart_logo from "./walmart_logo.svg";
import accenture_logo from "./accenture_logo.png";
import profile_img from "./profile_img.png";
import app_main_img from "./app_main_img.png";
import cross_icon from './cross_icon.svg';
import location_icon from './location_icon.svg';
import money_icon from './money_icon.svg';
import suitcase_icon from './suitcase_icon.svg';
import person_icon from './person_icon.svg';
import upload_area from './upload_area.svg';
import resume_selected from './resume_selected.svg';
import resume_not_selected from './resume_not_selected.svg';
import play_store from './play_store.svg';
import app_store from './app_store.svg';
import back_arrow_icon from './back_arrow_icon.svg';
import left_arrow_icon from './left_arrow_icon.svg';
import right_arrow_icon from './right_arrow_icon.svg';
import facebook_icon from './facebook_icon.svg'
import instagram_icon from './instagram_icon.svg'
import twitter_icon from './twitter_icon.svg'
import home_icon from './home_icon.svg'
import add_icon from './add_icon.svg'
import profile_upload_icon from './profile_upload_icon.svg'
import person_tick_icon from './person_tick_icon.svg'
import resume_download_icon from './resume_download_icon.svg'
import delete_icon from './delete_icon.svg'
import email_icon from './email_icon.svg'
import lock_icon from './lock_icon.svg'
import samsung_logo from './samsung_logo.png'
import adobe_logo from './adobe_logo.png'
import amazon_logo from './amazon_logo.png'
import logo from './image.png'

export const assets = {
    logo,
    search_icon,
    cross_icon,
    upload_area,
    company_icon,
    resume_not_selected,
    resume_selected,
    microsoft_logo,
    walmart_logo,
    accenture_logo,
    app_main_img,
    play_store,
    app_store,
    back_arrow_icon,
    left_arrow_icon,
    right_arrow_icon,
    location_icon,
    money_icon,
    suitcase_icon,
    person_icon,
    facebook_icon,
    instagram_icon,
    twitter_icon,
    home_icon,
    add_icon,
    person_tick_icon,
    resume_download_icon,
    profile_img,
    delete_icon,
    profile_upload_icon,
    email_icon,
    lock_icon,
    samsung_logo,
    adobe_logo,
    amazon_logo
}

export const JobCategories = [
    "Locum",
    "Surgical assistant",
    "Medical Officer",
    "Registra"
]

export const JobLocations = [
    "Pretoria",
    "Johannesburg",
    "Centurion",
    "Cape Town",
    "Durban",
    "Soweto",
    "Orlando"
]

// Sample data for Manage Jobs Page
export const manageJobsData = [
    {
        eventCode: "A1B2C3",
        eventName: "Locum",
        eventType: "Job",
        eventDate: 1729102298497,
        eventLocation: "Pretoria",
        numberOfAttendees: 20,
        clientName: "John Doe",
        clientEmail: "johndoe@example.com",
        clientPhone: "+27 123 456 7890",
        additionalNotes: "This is a temporary medical position."
    },
    {
        eventCode: "D4E5F6",
        eventName: "Clinical Research",
        eventType: "Job",
        eventDate: 1729102298497,
        eventLocation: "Centurion",
        numberOfAttendees: 15,
        clientName: "Jane Smith",
        clientEmail: "janesmith@example.com",
        clientPhone: "+27 987 654 3210",
        additionalNotes: "Research study on new treatment methods."
    },
    {
        eventCode: "G7H8I9",
        eventName: "Partner",
        eventType: "Job",
        eventDate: 1729102298497,
        eventLocation: "Cape Town",
        numberOfAttendees: 2,
        clientName: "Michael Brown",
        clientEmail: "michaelbrown@example.com",
        clientPhone: "+27 555 123 4567",
        additionalNotes: "Seeking a business partnership in the medical field."
    },
    {
        eventCode: "J1K2L3",
        eventName: "Medical Officer",
        eventType: "Job",
        eventDate: 1729102298497,
        eventLocation: "Soweto",
        numberOfAttendees: 25,
        clientName: "Emily Johnson",
        clientEmail: "emilyjohnson@example.com",
        clientPhone: "+27 444 987 6543",
        additionalNotes: "Medical officer position available in a local clinic."
    }
];



// Sample data for Profile Page
export const jobsApplied = [
    {
        company: 'Mediclinic',
        title: 'General Practitioner',
        location: 'Pretoria',
        date: '22 Aug, 2024',
        status: 'Pending',
        logo: company_icon,
    },
    {
        company: 'Ikhwezi Clinic',
        title: 'Clinical Research',
        location: 'Cpe Town',
        date: '22 Aug, 2024',
        status: 'Rejected',
        logo: company_icon,
    },
    {
        company: 'Exaze',
        title: 'Clinical Administrator',
        location: 'East London',
        date: '25 Sep, 2024',
        status: 'Accepted',
        logo: company_icon,
    },
    {
        company: 'Qualcomm',
        title: 'Surgeon',
        location: 'Dubai',
        date: '15 Oct, 2024',
        status: 'Pending',
        logo: company_icon,
    }
];


export const viewApplicationsPageData = [
    { _id: 1, name: "Landile simemo", jobTitle: "Clinical Research", location: "Bangalore", imgSrc: profile_img },
    { _id: 2, name: "Simamane", jobTitle: "Registra", location: "San Francisco", imgSrc: profile_img },
    { _id: 3, name: "Sandile Ndlovu", jobTitle: "Partner", location: "London", imgSrc: profile_img },
    { _id: 4, name: "Mayibuye Africa", jobTitle: "Medical Officer", location: "Dubai", imgSrc: profile_img },
    { _id: 5, name: "Ilizzwe Lethu", jobTitle: "Surgical assistant", location: "Hyderabad", imgSrc: profile_img },
    { _id: 6, name: "Mihle imizamo", jobTitle: "Locum", location: "New Delhi", imgSrc: profile_img }
];

export const jobsData = [
    {
        _id: '1',
        title: "Locum General Practitioner",
        location: "New York",
        level: "Mid-Level",
        companyId: {
            "_id": "670e4d25ca9fda8f1bf359b9",
            "name": "CityCare Medical Group",
            "email": "recruitment@citycare.com",
            "image": company_icon,
        },
        description: `
        <p>We are seeking a dedicated Locum General Practitioner (GP) to provide high-quality medical care in a fast-paced clinical environment. The ideal candidate will have strong diagnostic skills and a patient-centered approach. This is a flexible, short-term role ideal for experienced physicians looking for temporary or contract-based opportunities.</p>
        
        <h2><strong>Key Responsibilities</strong></h2>
        <ol>
            <li>Conduct patient consultations, diagnose illnesses, and prescribe treatments.</li>
            <li>Provide urgent care and routine check-ups in a clinical setting.</li>
            <li>Collaborate with nurses, specialists, and other healthcare professionals.</li>
            <li>Maintain accurate patient records and ensure compliance with medical regulations.</li>
            <li>Stay updated with advancements in general medicine and primary care.</li>
        </ol>
        
        <h2><strong>Skills Required</strong></h2>
        <ol>
            <li>Medical degree (MBBS, MD, or equivalent) with a valid practicing license.</li>
            <li>Experience in general practice, urgent care, or family medicine.</li>
            <li>Strong diagnostic and clinical decision-making skills.</li>
            <li>Excellent communication and interpersonal abilities.</li>
            <li>Ability to work in a fast-paced environment with minimal supervision.</li>
        </ol>`,
        salary: 120000,
        date: 1729681667114,
        category: "Medical Officer",
    },
    {
        _id: '2',
        title: "Locum General Practitioner",
        location: "New York",
        level: "Mid-Level",
        companyId: {
            "_id": "670e4d25ca9fda8f1bf359b9",
            "name": "CityCare Medical Group",
            "email": "recruitment@citycare.com",
            "image": company_icon,
        },
        description: `
            <p>We are seeking a dedicated Locum General Practitioner (GP) to provide high-quality medical care in a fast-paced clinical environment. The ideal candidate will have strong diagnostic skills and a patient-centered approach. This is a flexible, short-term role ideal for experienced physicians looking for temporary or contract-based opportunities.</p>
            
            <h2><strong>Key Responsibilities</strong></h2>
            <ol>
                <li>Conduct patient consultations, diagnose illnesses, and prescribe treatments.</li>
                <li>Provide urgent care and routine check-ups in a clinical setting.</li>
                <li>Collaborate with nurses, specialists, and other healthcare professionals.</li>
                <li>Maintain accurate patient records and ensure compliance with medical regulations.</li>
                <li>Stay updated with advancements in general medicine and primary care.</li>
            </ol>
            
            <h2><strong>Skills Required</strong></h2>
            <ol>
                <li>Medical degree (MBBS, MD, or equivalent) with a valid practicing license.</li>
                <li>Experience in general practice, urgent care, or family medicine.</li>
                <li>Strong diagnostic and clinical decision-making skills.</li>
                <li>Excellent communication and interpersonal abilities.</li>
                <li>Ability to work in a fast-paced environment with minimal supervision.</li>
            </ol>`,
        salary: 120000,
        date: 1729681667114,
        category: "Locum",
    },
    {
        _id: '3',
        title: "Emergency Medicine Physician",
        location: "Los Angeles",
        level: "Senior Level",
        companyId: {
            "_id": "670e4d25ca9fda8f1bf3600",
            "name": "Sunrise Hospital",
            "email": "careers@sunrisehospital.com",
            "image": company_icon,
        },
        description: `
            <p>Sunrise Hospital is seeking an experienced Emergency Medicine Physician to join our dynamic team. The successful candidate will provide life-saving care in a high-paced emergency room environment.</p>
            
            <h2><strong>Key Responsibilities</strong></h2>
            <ol>
                <li>Assess, diagnose, and treat patients with acute illnesses or injuries.</li>
                <li>Perform emergency procedures such as intubation, resuscitation, and trauma care.</li>
                <li>Collaborate with multidisciplinary teams to provide optimal patient outcomes.</li>
                <li>Ensure compliance with hospital policies and patient safety protocols.</li>
                <li>Work efficiently under pressure in a fast-moving environment.</li>
            </ol>
            
            <h2><strong>Skills Required</strong></h2>
            <ol>
                <li>Medical degree with board certification in Emergency Medicine.</li>
                <li>Minimum of 5 years of experience in an emergency department.</li>
                <li>Proficiency in handling trauma and critical care cases.</li>
                <li>Strong teamwork and leadership abilities.</li>
                <li>Ability to make quick decisions under pressure.</li>
            </ol>`,
        salary: 180000,
        date: 1729682667114,
        category: "Surgical Assistant",
    },
    {
        _id: '4',
        title: "Pediatrician",
        location: "Chicago",
        level: "Entry-Level",
        companyId: {
            "_id": "670e4d25ca9fda8f1bf3601",
            "name": "Bright Future Pediatrics",
            "email": "jobs@brightfuturepeds.com",
            "image": company_icon,
        },
        description: `
            <p>Bright Future Pediatrics is looking for a compassionate and dedicated Pediatrician to provide high-quality medical care for infants, children, and adolescents.</p>
            
            <h2><strong>Key Responsibilities</strong></h2>
            <ol>
                <li>Conduct routine check-ups and monitor children's growth and development.</li>
                <li>Diagnose and treat childhood illnesses, infections, and injuries.</li>
                <li>Provide vaccinations and preventive care education to parents.</li>
                <li>Coordinate with specialists for advanced pediatric care needs.</li>
                <li>Maintain detailed medical records and ensure compliance with pediatric guidelines.</li>
            </ol>
            
            <h2><strong>Skills Required</strong></h2>
            <ol>
                <li>Medical degree with specialization in Pediatrics.</li>
                <li>State medical license and board certification in Pediatrics.</li>
                <li>Excellent interpersonal and communication skills.</li>
                <li>Ability to handle pediatric emergencies and provide age-appropriate care.</li>
                <li>Empathetic approach toward young patients and their families.</li>
            </ol>`,
        salary: 135000,
        date: 1729683667114,
        category: "Registra",
    },
    {
        _id: '5',
        title: "Locum",
        location: "Houston",
        level: "Senior Level",
        companyId: {
            "_id": "670e4d25ca9fda8f1bf3602",
            "name": "Lifeline Surgical Center",
            "email": "hr@lifelinesurgery.com",
            "image": company_icon,
        },
        description: `
            <p>Lifeline Surgical Center is seeking a skilled Anesthesiologist to administer anesthesia and monitor patients before, during, and after surgical procedures.</p>
            
            <h2><strong>Key Responsibilities</strong></h2>
            <ol>
                <li>Assess patients' medical conditions and determine the best anesthesia plans.</li>
                <li>Administer general or regional anesthesia for various surgical procedures.</li>
                <li>Monitor patients' vital signs and ensure safe anesthesia recovery.</li>
                <li>Collaborate with surgeons, nurses, and other medical professionals.</li>
                <li>Ensure compliance with safety and medical guidelines in anesthesia administration.</li>
            </ol>
            
            <h2><strong>Skills Required</strong></h2>
            <ol>
                <li>Medical degree with board certification in Anesthesiology.</li>
                <li>Minimum of 7 years of experience in a hospital or surgical center.</li>
                <li>In-depth knowledge of anesthesia techniques and pain management.</li>
                <li>Strong attention to detail and ability to make critical decisions under pressure.</li>
                <li>Excellent teamwork and communication skills.</li>
            </ol>`,
        salary: 250000,
        date: 1729684667114,
        category: "Medical Officer",
    },
    {
        _id: '6',
        title: "Registra",
        location: "Centurion",
        level: "Mid-Level",
        companyId: {
            "_id": "670e4d25ca9fda8f1bf359b9",
            "name": "CityCare Medical Group",
            "email": "recruitment@citycare.com",
            "image": company_icon,
        },
        description: `
            <p>We are seeking a dedicated Locum General Practitioner (GP) to provide high-quality medical care in a fast-paced clinical environment. The ideal candidate will have strong diagnostic skills and a patient-centered approach. This is a flexible, short-term role ideal for experienced physicians looking for temporary or contract-based opportunities.</p>
            
            <h2><strong>Key Responsibilities</strong></h2>
            <ol>
                <li>Conduct patient consultations, diagnose illnesses, and prescribe treatments.</li>
                <li>Provide urgent care and routine check-ups in a clinical setting.</li>
                <li>Collaborate with nurses, specialists, and other healthcare professionals.</li>
                <li>Maintain accurate patient records and ensure compliance with medical regulations.</li>
                <li>Stay updated with advancements in general medicine and primary care.</li>
            </ol>
            
            <h2><strong>Skills Required</strong></h2>
            <ol>
                <li>Medical degree (MBBS, MD, or equivalent) with a valid practicing license.</li>
                <li>Experience in general practice, urgent care, or family medicine.</li>
                <li>Strong diagnostic and clinical decision-making skills.</li>
                <li>Excellent communication and interpersonal abilities.</li>
                <li>Ability to work in a fast-paced environment with minimal supervision.</li>
            </ol>`,
        salary: 120000,
        date: 1729681667114,
        category: "Registra",
    },
    {
        _id: '7',
        title: "Locum General Practitioner",
        location: "Pretoria",
        level: "Mid-Level",
        companyId: {
            "_id": "670e4d25ca9fda8f1bf359b9",
            "name": "CityCare Medical Group",
            "email": "recruitment@citycare.com",
            "image": "https://media.wired.com/photos/5a99ba72927dc94e67685b9b/master/w_1600,c_limit/amazon-a-logo.jpg",
        },
        description: `
            <p>We are seeking a dedicated Locum General Practitioner (GP) to provide high-quality medical care in a fast-paced clinical environment. The ideal candidate will have strong diagnostic skills and a patient-centered approach. This is a flexible, short-term role ideal for experienced physicians looking for temporary or contract-based opportunities.</p>
            
            <h2><strong>Key Responsibilities</strong></h2>
            <ol>
                <li>Conduct patient consultations, diagnose illnesses, and prescribe treatments.</li>
                <li>Provide urgent care and routine check-ups in a clinical setting.</li>
                <li>Collaborate with nurses, specialists, and other healthcare professionals.</li>
                <li>Maintain accurate patient records and ensure compliance with medical regulations.</li>
                <li>Stay updated with advancements in general medicine and primary care.</li>
            </ol>
            
            <h2><strong>Skills Required</strong></h2>
            <ol>
                <li>Medical degree (MBBS, MD, or equivalent) with a valid practicing license.</li>
                <li>Experience in general practice, urgent care, or family medicine.</li>
                <li>Strong diagnostic and clinical decision-making skills.</li>
                <li>Excellent communication and interpersonal abilities.</li>
                <li>Ability to work in a fast-paced environment with minimal supervision.</li>
            </ol>`,
        salary: 120000,
        date: 1729681667114,
        category: "Surgical assistant",
    },
    {
        _id: '8',
        title: "Locum General Practitioner",
        location: "Pretoria",
        level: "Mid-Level",
        companyId: {
            "_id": "670e4d25ca9fda8f1bf359b9",
            "name": "CityCare Medical Group",
            "email": "recruitment@citycare.com",
            "image": company_icon,
        },
        description: `
            <p>We are seeking a dedicated Locum General Practitioner (GP) to provide high-quality medical care in a fast-paced clinical environment. The ideal candidate will have strong diagnostic skills and a patient-centered approach. This is a flexible, short-term role ideal for experienced physicians looking for temporary or contract-based opportunities.</p>
            
            <h2><strong>Key Responsibilities</strong></h2>
            <ol>
                <li>Conduct patient consultations, diagnose illnesses, and prescribe treatments.</li>
                <li>Provide urgent care and routine check-ups in a clinical setting.</li>
                <li>Collaborate with nurses, specialists, and other healthcare professionals.</li>
                <li>Maintain accurate patient records and ensure compliance with medical regulations.</li>
                <li>Stay updated with advancements in general medicine and primary care.</li>
            </ol>
            
            <h2><strong>Skills Required</strong></h2>
            <ol>
                <li>Medical degree (MBBS, MD, or equivalent) with a valid practicing license.</li>
                <li>Experience in general practice, urgent care, or family medicine.</li>
                <li>Strong diagnostic and clinical decision-making skills.</li>
                <li>Excellent communication and interpersonal abilities.</li>
                <li>Ability to work in a fast-paced environment with minimal supervision.</li>
            </ol>`,
        salary: 120000,
        date: 1729681667114,
        category: "Locum",
    }

];

