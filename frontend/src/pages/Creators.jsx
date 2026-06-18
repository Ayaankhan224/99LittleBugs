import { useState, useRef } from 'react';
import { FaLinkedinIn, FaInstagram, FaGithub } from 'react-icons/fa6';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const creators = [
  {
    id: 1,
    name: "Ayaan Khan",
    role: "Full-Stack Engineer (Lead Developer)",
    bio: "A Designer, developer, and art guy by heart. Building digital experiences with an artist’s mindset, where design, development, and creativity exist beyond aesthetics and metrics.",
    image: "/creator-a.jpeg",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/ayaan-khan-702ba6410", icon: "Linkedin" },
      { platform: "Instagram", url: "https://www.instagram.com/ayaannn.6", icon: "Instagram" },
      { platform: "GitHub", url: "https://github.com/Ayaankhan224", icon: "Github" }
    ]
  },
  {
    id: 2,
    name: "Mohd. Fazal",
    role: "Full-Stack Engineer",
    bio: "Obsessed with clean aesthetics, micro-interactions, and beautiful color palettes. Focused on designing intuitive visual systems that are accessible, responsive, and delightful.",
    image: "/creator-f.jpeg",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/mohd-fazal-415b47376", icon: "Linkedin" },
      { platform: "Instagram", url: "https://www.instagram.com/cholabhaturawithpyaaz?igsh=MWdlbjhnNTZndmJlZw==", icon: "Instagram" },
      { platform: "GitHub", url: "https://github.com/whiteee1819", icon: "Github" }
    ]
  },
  {
    id: 3,
    name: "Shrestha S Gupta",
    role: "Full-Stack Engineer",
    bio: "I'm passionate about AI, Data Science, and technology, and I enjoy working on innovative projects and learning new skills",
    image: "/creator-s.jpeg",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/shrestha-s-gupta-9403a2286", icon: "Linkedin" },
      { platform: "Instagram", url: "https://www.instagram.com/shrestha_s_gupta?igsh=N3M1Mzg4OHU3cHg5", icon: "Instagram" },
      { platform: "GitHub", url: "https://github.com/guptaaashrestha-jpg", icon: "Github" }
    ]
  },
  {
    id: 4,
    name: "Avi Saxena",
    role: "Full-Stack Engineer",
    bio: "Passionate about leveraging artificial intelligence and machine learning to build intelligent solutions. Equipped with a strong foundation in core Python development and a solid understanding of HTML for web interfaces",
    image: "/creator-av.jpeg",
    socials: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/avi-saxena-a165b4388/", icon: "Linkedin" },
      { platform: "Instagram", url: "https://www.instagram.com/armansaxena_official/", icon: "Instagram" },
      { platform: "GitHub", url: "https://github.com/avisaxena-stack123", icon: "Github" }
    ]
  }
];

const Creators = () => {
  const [activeCreator, setActiveCreator] = useState(creators[0]);
  const [displayedCreator, setDisplayedCreator] = useState(creators[0]);
  const detailsRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      detailsRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out"
      }
    );
  }, [displayedCreator]);

  const handleHover = (creator) => {
    if (creator.id === activeCreator.id) return;

    setActiveCreator(creator);

    if (creator.id === displayedCreator.id) {
      gsap.killTweensOf(detailsRef.current);
      gsap.to(detailsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out"
      });
    } else {
      gsap.killTweensOf(detailsRef.current);
      gsap.to(detailsRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.25,
        ease: "power3.out",
        onComplete: () => {
          setDisplayedCreator(creator);
        }
      });
    }
  };

  

  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-start py-16 px-4 md:px-8'>
      <h1 className='text-center text-5xl md:text-7xl font-[poppins] tracking-tighter text-neutral-900 mb-12 select-none'>
        the creators.
      </h1>

      <div className='w-full max-w-5xl flex justify-center items-center gap-6 md:gap-12 flex-wrap mb-16 px-4'>
        {creators.map((creator) => {
          const isActive = activeCreator.id === creator.id;
          return (
            <div
              key={creator.id}
              onMouseEnter={() => handleHover(creator)}
              className={`relative overflow-hidden w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full cursor-pointer transition-all duration-300 ease-out select-none bg-[#e7dfc9]/50
                ${isActive 
                  ? 'active-creator-circle border-3 border-[#E56E3A] scale-108' 
                  : 'border border-neutral-950/10 hover:border-[#E56E3A]/50 hover:scale-105 hover:shadow-[0_0_15px_rgba(229,110,58,0.2)]'
                }`}
            >
              <img
                src={creator.image}
                alt={creator.name}
                className='w-full h-full object-cover rounded-full filter grayscale-[10%] contrast-[105%]'
              />
            </div>
          );
        })}
      </div>

      <div 
        ref={detailsRef}
        className='w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 px-6 py-6 border-t border-neutral-950/10'
      >
        {displayedCreator.image && (
          <div className='w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white/50 shrink-0 transform -rotate-1 hover:rotate-0 transition-transform duration-300 select-none'>
            <img 
              src={displayedCreator.image} 
              alt={displayedCreator.name} 
              className='w-full h-full object-cover'
            />
          </div>
        )}

        <div className='flex-1 flex flex-col items-center md:items-start text-center md:text-left'>
          <p className='font-[poppins] text-[#E56E3A] text-sm md:text-base font-semibold tracking-widest uppercase mb-1'>
            This is
          </p>
          <h2 className='font-[poppins] text-4xl sm:text-5xl md:text-6xl uppercase font-semibold tracking-tighter text-neutral-900 mb-1'>
            {displayedCreator.name}
          </h2>
          <p className='font-[poppins] text-base md:text-lg text-[#E56E3A]/90 font-medium tracking-wide uppercase mb-4'>
            {displayedCreator.role}
          </p>
          <p className='font-[poppins] text-sm md:text-base text-neutral-700 leading-relaxed mb-6 max-w-xl'>
            {displayedCreator.bio}
          </p>

          <div className='flex gap-4 flex-wrap justify-center md:justify-start'>
            {displayedCreator.socials.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-950/10 bg-neutral-950/5 text-neutral-800 font-[poppins] text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-[#E56E3A] hover:text-white hover:border-[#E56E3A] hover:scale-105 transition-all duration-200'
              >
                <span>{social.platform}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Creators;