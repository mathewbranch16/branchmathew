import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaPython, FaDatabase } from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';

const FloatingAnimation = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  const sections = ['home', 'about', 'projects', 'skills', 'contact'];
  const sectionRefs = useRef(sections.map(() => React.createRef()));

  useEffect(() => {
    const handleScroll = () => {
      const pageYOffset = window.pageYOffset;
      let newActiveSection = sections[0];

      sectionRefs.current.forEach((ref, index) => {
        const element = ref.current;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (pageYOffset >= offsetTop && pageYOffset < offsetTop + offsetHeight) {
            newActiveSection = sections[index];
          }
        }
      });

      setActiveSection(newActiveSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (section) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getGradient = (section) => {
    const gradients = {
      home: 'from-blue-500 to-purple-600',
      about: 'from-green-400 to-blue-500',
      projects: 'from-yellow-400 to-red-500',
      skills: 'from-pink-500 to-purple-500',
      contact: 'from-indigo-500 to-purple-600'
    };
    return gradients[section];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('Sending...');

    try {
      await addDoc(collection(db, 'messages'), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        timestamp: new Date()
      });

      setFormStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error sending message: ', error);
      setFormStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white bg-opacity-90 backdrop-blur-md">
        <ul className="flex justify-center items-center p-4">
          {sections.map((section) => (
            <li key={section} className="mx-2">
              <button
                onClick={() => handleNavClick(section)}
                className={`text-xl nav-link transition duration-300 ${
                  activeSection === section 
                    ? `bg-gradient-to-r ${getGradient(section)} bg-clip-text text-transparent`
                    : 'text-gray-800 hover:bg-gradient-to-r hover:bg-clip-text hover:text-transparent'
                } ${getGradient(section)}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-16">
        <section id="home" ref={sectionRefs.current[0]} className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <FloatingAnimation>
            <div className="mb-6">
              <img src="profile.JPG?height=256&width=256" alt="Your Photo" className="rounded-full w-64 h-64 object-cover mb-8 mx-auto" />
            </div>
            <h2 className={`text-5xl font-bold mb-4 bg-gradient-to-r text-transparent bg-clip-text ${getGradient('home')}`}>
              Branch Mathew
            </h2>
            <p className="text-white mb-4 max-w-2xl mx-auto">Welcome to my portfolio! Explore my projects, learn more about me, and get in touch.</p>
            <a href="#" className="bg-indigo-700 text-white py-2 px-4 rounded hover:bg-indigo-900 inline-block">
              View Resume
            </a>
          </FloatingAnimation>
        </section>

        <section id="about" ref={sectionRefs.current[1]} className="min-h-screen flex flex-col items-center justify-center p-8">
          <FloatingAnimation>
            <h2 className={`text-5xl font-bold mb-8 bg-gradient-to-r text-transparent bg-clip-text ${getGradient('about')} text-center`}>
              About Me
            </h2>
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto">
              <div className="w-full md:w-1/2">
                <div className="gradient-border rounded-md">
                  <div className={`p-6 rounded-lg border-2 bg-black`} style={{backgroundClip: 'padding-box, border-box', backgroundOrigin: 'border-box'}}>
                    <h3 className="text-2xl font-bold text-white mb-4 text-center">Background & Interests</h3>
                    <p className="text-white mb-4 text-center">
                      As a passionate software developer, I thrive on creating innovative solutions to complex problems. My journey in tech began with a fascination for how software can transform ideas into reality.
                    </p>
                    <p className="text-white mb-4 text-center">
                      I specialize in full-stack web development, with a particular focus on React and Node.js. I'm also deeply interested in artificial intelligence and machine learning, always exploring how these technologies can be integrated into web applications to create more intelligent and responsive user experiences.
                    </p><br></br>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="gradient-border rounded-md">
                  <div className={`p-6 rounded-lg border-2 bg-black ${getGradient('about')}`} style={{backgroundClip: 'padding-box, border-box', backgroundOrigin: 'border-box'}}>
                    <h3 className="text-2xl font-bold text-white mb-4 text-center">Education</h3>
                    <ul className="text-white space-y-4">
                      <li className="text-center">
                        <strong>2023 - 2027 - Present:</strong><br />
                        Bachelor Of Engineering
                        <p>Electronics and Computer Science</p>
                        <p><strong>Fr. Conceicao Rodrigues College of Engineering</strong></p>
                      </li>
                      <li className="text-center">
                        <strong>2021 - 2023:</strong><br />
                        Higher Secondary Certificate, 11th and 12th
                        <p><strong>St. Andrews College</strong></p>
                        <p>80.53%</p>
                      </li>
                      <li className="text-center">
                        <strong>2011 - 2021:</strong><br />
                        Secondary School Certificate, 1st - 10th
                        <p><strong>St. Stanislaus High School</strong></p>
                        <p>91.60%</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </FloatingAnimation>
        </section>

        <section id="projects" ref={sectionRefs.current[2]} className="min-h-screen flex flex-col items-center justify-center p-8">
          <FloatingAnimation>
        <h2 className={`text-5xl font-bold mb-8 bg-gradient-to-r text-transparent bg-clip-text ${getGradient('projects')} text-center`}>
          View my Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
          {[1, 2, 3, 4, 5, 6].map((project) => (
            <div key={project} className="relative group">
              <img src={`project${project}.${project === 1 ? 'jpeg' : project === 2 ? 'avif' : project === 6 ? 'jpg' : 'webp'}?height=200&width=300&text=Project ${project}`} alt={`Project ${project}`} className="w-full h-48 object-cover rounded" />
              <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-white text-center bg-transparent">
                  <h3 className="text-xl font-bold mb-2 bg-transparent">Project {project}</h3>
                  <p className="bg-transparent">Short description of the project</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </FloatingAnimation>
      </section>


        <section id="skills" ref={sectionRefs.current[3]} className="min-h-screen flex flex-col items-center justify-center p-8">
          <FloatingAnimation>
            <h2 className={`text-5xl font-bold mb-8 bg-gradient-to-r text-transparent bg-clip-text ${getGradient('skills')} text-center`}>
              Skills
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <FaHtml5 className="text-6xl text-orange-500 mb-2" />
                <span className="text-white">HTML5</span>
              </div>
              <div className="flex flex-col items-center">
                <FaCss3Alt className="text-6xl text-blue-500 mb-2" />
                <span className="text-white">CSS3</span>
              </div>
              <div className="flex flex-col items-center">
                <FaJs className="text-6xl text-yellow-400 mb-2" />
                <span className="text-white">JavaScript</span>
              </div>
              <div className="flex flex-col items-center">
                <FaReact className="text-6xl text-blue-400 mb-2" />
                <span className="text-white">React</span>
              </div>
              <div className="flex flex-col items-center">
                <FaNodeJs className="text-6xl text-green-500 mb-2" />
                <span className="text-white">Node.js</span>
              </div>
              <div className="flex flex-col items-center">
                <FaPython className="text-6xl text-blue-300 mb-2" />
                <span className="text-white">Python</span>
              </div>
              <div className="flex flex-col items-center">
                <FaDatabase className="text-6xl text-gray-400 mb-2" />
                <span className="text-white">SQL</span>
              </div>
              <div className="flex flex-col items-center">
                <SiTypescript className="text-6xl text-blue-600 mb-2" />
                <span className="text-white">TypeScript</span>
              </div>
            </div>
          </FloatingAnimation>
        </section>

        <section id="contact" ref={sectionRefs.current[4]} className="min-h-screen flex flex-col items-center justify-center p-8">
          <FloatingAnimation>
            <h2 className={`text-5xl font-bold mb-8 bg-gradient-to-r text-transparent bg-clip-text ${getGradient('contact')} text-center`}>
              Contact
            </h2>
            <p className="text-white mb-4 text-center">Feel free to reach out to me via email or social media.</p>
            <div className="flex justify-center space-x-4 mb-8">
              <a href="mailto:your-email@example.com" className="text-white hover:text-indigo-500">
                <FaEnvelope size={24} />
              </a>
              <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-500">
                <FaLinkedin size={24} />
              </a>
              <a href="https://github.com/your-profile" target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-500">
                <FaGithub size={24} />
              </a>
            </div>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full">
              <div className="mb-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded"
                  rows="4"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-700 text-white py-2 px-4 rounded hover:bg-indigo-900">
                Send Message
              </button>
            </form>
            {formStatus && <p className="mt-4 text-center text-white">{formStatus}</p>}
          </FloatingAnimation>
        </section>
      </div>
    </div>
  );
};

export default App;