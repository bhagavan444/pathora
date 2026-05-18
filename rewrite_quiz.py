import sys
import os

file_path = 'frontend/src/Pages/Quiz.jsx'
if not os.path.exists(file_path):
    print("File not found")
    sys.exit(1)

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if 'const MagneticCursor =' in line:
        start_idx = i
        break

if start_idx == -1:
    print('Could not find MagneticCursor')
    sys.exit(1)

new_component = """const MagneticCursor = () => {
  const cursorRef = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e) => {
      setIsVisible(true);
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    const interactiveElements = document.querySelectorAll('button, a, .glass-card, .interactive-element');
    
    const magneticEffect = (e) => {
      const element = e.currentTarget;
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 120;

      if (distance < maxDistance) {
        const strength = 0.2;
        const moveX = deltaX * strength;
        const moveY = deltaY * strength;
        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        cursor.style.transform = 'scale(1.5)';
        cursor.style.borderColor = 'rgba(139, 92, 246, 0.8)';
        cursor.style.background = 'rgba(139, 92, 246, 0.1)';
      }
    };

    const resetMagnetic = (e) => {
      e.currentTarget.style.transform = 'translate(0, 0) scale(1)';
      cursor.style.transform = 'scale(1)';
      cursor.style.borderColor = 'rgba(255, 255, 255, 0.5)';
      cursor.style.background = 'transparent';
    };

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', magneticEffect);
      el.addEventListener('mousemove', magneticEffect);
      el.addEventListener('mouseleave', resetMagnetic);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', magneticEffect);
        el.removeEventListener('mousemove', magneticEffect);
        el.removeEventListener('mouseleave', resetMagnetic);
      });
    };
  }, []);

  const cursorStyle = {
    position: 'fixed',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    pointerEvents: 'none',
    zIndex: 99999,
    transform: 'translate(-50%, -50%)',
    transition: 'transform 0.15s ease-out, border-color 0.15s ease-out, background 0.15s ease-out',
    opacity: isVisible ? 1 : 0,
    backdropFilter: 'blur(2px)',
  };

  return <div ref={cursorRef} style={cursorStyle} />;
};

/* ======================================================
   AI UI COMPONENTS
====================================================== */

const GlassCard = ({ children, style, className, onClick }) => (
  <div
    className={`glass-card ${className || ''}`}
    onClick={onClick}
    style={{
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      borderRadius: '24px',
      ...style
    }}
  >
    {children}
  </div>
);

const NeuralLoadingIndicator = ({ message }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px' }}>
    <div className="neural-spinner" style={{
      width: '64px', height: '64px', borderRadius: '50%',
      border: '2px solid rgba(99, 102, 241, 0.2)',
      borderTopColor: '#8b5cf6',
      borderRightColor: '#6366f1',
      animation: 'spin 1s linear infinite',
      marginBottom: '24px',
      boxShadow: '0 0 24px rgba(139, 92, 246, 0.4)'
    }} />
    <h3 style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '500', letterSpacing: '1px' }}>{message}</h3>
    <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px', animation: 'pulse 2s infinite' }}>Analyzing neural pathways...</p>
  </div>
);

const QuizCard = ({ question, options, onAnswer, isAnswered, selectedOption, correctAnswer }) => {
  return (
    <GlassCard style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <h3 style={{
        fontSize: '26px', color: '#f8fafc', fontWeight: '600', lineHeight: '1.5',
        marginBottom: '36px', letterSpacing: '-0.5px'
      }}>
        {question}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {options.map((option, i) => {
          const isCorrect = isAnswered && option === correctAnswer;
          const isWrong = isAnswered && selectedOption === option && !isCorrect;
          
          let btnBg = 'rgba(255, 255, 255, 0.03)';
          let btnBorder = 'rgba(255, 255, 255, 0.1)';
          let btnColor = '#cbd5e1';
          let iconBg = 'rgba(255, 255, 255, 0.05)';
          
          if (isCorrect) {
            btnBg = 'rgba(16, 185, 129, 0.1)'; btnBorder = 'rgba(16, 185, 129, 0.4)'; btnColor = '#10b981'; iconBg = '#10b981';
          } else if (isWrong) {
            btnBg = 'rgba(239, 68, 68, 0.1)'; btnBorder = 'rgba(239, 68, 68, 0.4)'; btnColor = '#ef4444'; iconBg = '#ef4444';
          } else if (isAnswered) {
            btnColor = '#475569'; btnBorder = 'rgba(255, 255, 255, 0.02)';
          }

          return (
            <button
              key={i}
              onClick={() => !isAnswered && onAnswer(option)}
              className={`interactive-element ${!isAnswered ? 'hover-glow' : ''}`}
              style={{
                width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center',
                background: btnBg, border: `1px solid ${btnBorder}`, borderRadius: '16px',
                color: btnColor, fontSize: '16px', fontWeight: '500', cursor: isAnswered ? 'default' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'left'
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px', background: iconBg,
                color: isCorrect || isWrong ? '#fff' : '#94a3b8', display: 'flex',
                alignItems: 'center', justifyContent: 'center', marginRight: '16px',
                fontWeight: '600', fontSize: '14px', transition: 'all 0.3s'
              }}>
                {String.fromCharCode(65 + i)}
              </div>
              <span style={{ flex: 1 }}>{option}</span>
              {isCorrect && <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>}
              {isWrong && <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✗</span>}
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
};

/* ======================================================
   MAIN QUIZ COMPONENT
====================================================== */

export default function Quiz() {
  const [stage, setStage] = useState(() => localStorage.getItem("pathora_quiz_stage") || "selection");
  const [selectedDomains, setSelectedDomains] = useState(() => JSON.parse(localStorage.getItem("pathora_quiz_domains") || "[]"));
  const [round, setRound] = useState(() => parseInt(localStorage.getItem("pathora_quiz_round")) || 1);
  const [questions, setQuestions] = useState(() => JSON.parse(localStorage.getItem("pathora_quiz_questions") || "[]"));
  const [currentIndex, setCurrentIndex] = useState(() => parseInt(localStorage.getItem("pathora_quiz_index")) || 0);
  const [timeLeft, setTimeLeft] = useState(() => parseInt(localStorage.getItem("pathora_quiz_time")) || 300);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [completed, setCompleted] = useState(() => localStorage.getItem("pathora_quiz_completed") === "true");
  
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem("pathora_quiz_xp")) || 1250);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("pathora_quiz_streak")) || 0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [scores, setScores] = useState(() => JSON.parse(localStorage.getItem("pathora_quiz_scores")) || {
    tech: 0, data: 0, ai: 0, cloud: 0, business: 0,
    cyber: 0, marketing: 0, design: 0, management: 0,
    finance: 0, healthcare: 0, content: 0,
  });

  const totalQuestionsPerRound = 15;
  const maxRounds = 3;

  const domainInfo = {
    tech: { name: "Software Engineering", description: "Scalable Systems & Architecture", color: "#6366f1", icon: "💻" },
    data: { name: "Data Science & Analytics", description: "Statistical Modeling & Insights", color: "#10b981", icon: "📊" },
    ai: { name: "AI / Machine Learning", description: "Neural Networks & Intelligence", color: "#f59e0b", icon: "🧠" },
    cloud: { name: "Cloud & DevOps", description: "Infrastructure & Deployment", color: "#06b6d4", icon: "☁️" },
    business: { name: "Product & Business", description: "Strategy & Market Growth", color: "#8b5cf6", icon: "📈" },
    cyber: { name: "Cyber Security", description: "Threat Defense & Cryptography", color: "#ef4444", icon: "🛡️" },
    marketing: { name: "Digital Marketing", description: "Growth & Brand Presence", color: "#f97316", icon: "📱" },
    design: { name: "UI/UX & Design", description: "Human-Computer Interaction", color: "#ec4899", icon: "✨" },
    management: { name: "Project Management", description: "Agile & Leadership", color: "#4f46e5", icon: "📋" },
    finance: { name: "Finance & Accounting", description: "Capital & Valuation", color: "#14b8a6", icon: "💰" },
    healthcare: { name: "Healthcare & MedTech", description: "Clinical Systems & Informatics", color: "#22c55e", icon: "🏥" },
    content: { name: "Content & Media", description: "Digital Storytelling", color: "#a855f7", icon: "🎬" },
  };

  useEffect(() => {
    localStorage.setItem("pathora_quiz_stage", stage);
    localStorage.setItem("pathora_quiz_domains", JSON.stringify(selectedDomains));
    localStorage.setItem("pathora_quiz_round", round);
    localStorage.setItem("pathora_quiz_questions", JSON.stringify(questions));
    localStorage.setItem("pathora_quiz_index", currentIndex);
    localStorage.setItem("pathora_quiz_time", timeLeft);
    localStorage.setItem("pathora_quiz_completed", completed);
    localStorage.setItem("pathora_quiz_scores", JSON.stringify(scores));
    localStorage.setItem("pathora_quiz_xp", xp);
    localStorage.setItem("pathora_quiz_streak", streak);
  }, [stage, selectedDomains, round, questions, currentIndex, timeLeft, completed, scores, xp, streak]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const headingStyles = {
    fontFamily: "'Space Grotesk', 'Inter', sans-serif",
    letterSpacing: '-1px',
  };

  const toggleDomain = (domain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const startQuiz = () => {
    if (selectedDomains.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setStage("quiz");
      setIsTransitioning(false);
    }, 1500);
  };

  useEffect(() => {
    if (stage !== "quiz" || questions.length > 0) return;

    const difficulty = getDifficultyByRound(round);
    let filtered = MASTER_QUESTIONS.filter(
      (q) => selectedDomains.includes(q.domain) && q.difficulty === difficulty
    );

    if (filtered.length < totalQuestionsPerRound) {
      filtered = MASTER_QUESTIONS.filter((q) => q.difficulty === difficulty);
    }

    if (round > 1) {
      filtered = filtered.sort((a, b) => scores[a.domain] - scores[b.domain]);
    }

    const selected = shuffle(filtered).slice(0, totalQuestionsPerRound);
    setQuestions(selected);
    setCurrentIndex(0);
    setTimeLeft(300);
    setIsAnswered(false);
    setSelectedOption(null);
  }, [round, stage, selectedDomains, scores, questions.length]);

  useEffect(() => {
    if (stage !== "quiz" || completed || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, completed, questions.length, stage]);

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = option === currentQuestion.answer;

    if (isCorrect) {
      const responseTimeBonus = timeLeft > 280 ? 2 : timeLeft > 250 ? 1 : 0;
      const points = currentQuestion.weight * 10 + responseTimeBonus * 5;
      
      setScores((prev) => ({
        ...prev,
        [currentQuestion.domain]: prev[currentQuestion.domain] + currentQuestion.weight,
      }));
      setXp(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => handleNext(), 2000);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      if (round < maxRounds) {
        setIsTransitioning(true);
        setTimeout(() => {
          setRound(round + 1);
          setQuestions([]);
          setIsTransitioning(false);
        }, 1500);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          setCompleted(true);
          setStage("results");
          setIsTransitioning(false);
        }, 2000);
      }
    }
  };

  const resetQuiz = () => {
    localStorage.removeItem("pathora_quiz_stage");
    localStorage.removeItem("pathora_quiz_domains");
    localStorage.removeItem("pathora_quiz_round");
    localStorage.removeItem("pathora_quiz_questions");
    localStorage.removeItem("pathora_quiz_index");
    localStorage.removeItem("pathora_quiz_time");
    localStorage.removeItem("pathora_quiz_completed");
    localStorage.removeItem("pathora_quiz_scores");
    localStorage.removeItem("pathora_quiz_xp");
    localStorage.removeItem("pathora_quiz_streak");

    setStage("selection");
    setSelectedDomains([]);
    setRound(1);
    setQuestions([]);
    setCurrentIndex(0);
    setCompleted(false);
    setScores({
      tech: 0, data: 0, ai: 0, cloud: 0, business: 0,
      cyber: 0, marketing: 0, design: 0, management: 0,
      finance: 0, healthcare: 0, content: 0,
    });
    setXp(1250);
    setStreak(0);
  };

  if (stage === "selection") {
    if (isTransitioning) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
          <MagneticCursor />
          <NeuralLoadingIndicator message="Initializing AI Adaptive Engine..." />
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', padding: '100px 24px', background: 'transparent', fontFamily: "'Inter', sans-serif" }}>
        <MagneticCursor />
        <style>{`
          .domain-glass { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
          .domain-glass:hover { transform: translateY(-4px) scale(1.02); background: rgba(30, 41, 59, 0.6) !important; border-color: rgba(99, 102, 241, 0.4) !important; box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15) !important; }
          .domain-selected { background: rgba(99, 102, 241, 0.15) !important; border-color: #6366f1 !important; box-shadow: 0 0 20px rgba(99, 102, 241, 0.2) !important; }
          .cta-glow:hover { box-shadow: 0 0 30px rgba(139, 92, 246, 0.6) !important; transform: translateY(-2px); }
          .hover-glow:hover { background: rgba(255, 255, 255, 0.08) !important; border-color: rgba(255, 255, 255, 0.2) !important; }
          @keyframes spin { 100% { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        `}</style>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '2px' }}>Engine Online</span>
            </div>
            <GlassCard style={{ padding: '8px 24px', display: 'flex', gap: '24px', borderRadius: '100px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#f59e0b' }}>⚡</span>
                <span style={{ color: '#f8fafc', fontWeight: '600' }}>{streak} Streak</span>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#6366f1' }}>💠</span>
                <span style={{ color: '#f8fafc', fontWeight: '600' }}>{xp} XP</span>
              </div>
            </GlassCard>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{
              display: 'inline-block', padding: '6px 16px', background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '100px', color: '#c4b5fd',
              fontSize: '14px', fontWeight: '500', marginBottom: '24px', letterSpacing: '1px'
            }}>
              PATHORA AI • 2026 EDITION
            </div>
            <h1 style={{ ...headingStyles, fontSize: '64px', color: '#f8fafc', margin: '0 0 24px 0', lineHeight: '1.1' }}>
              Configure Your <br/>
              <span style={{ background: 'linear-gradient(to right, #818cf8, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Intelligence Profile
              </span>
            </h1>
            <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
              Select your target domains. Our neural engine will dynamically adapt to your skill level, mapping your career trajectory in real-time.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '64px' }}>
            {Object.entries(domainInfo).map(([key, info]) => {
              const isSelected = selectedDomains.includes(key);
              return (
                <GlassCard
                  key={key}
                  className={`domain-glass ${isSelected ? 'domain-selected' : ''}`}
                  onClick={() => toggleDomain(key)}
                  style={{
                    padding: '32px 24px', cursor: 'pointer',
                    position: 'relative', overflow: 'hidden'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '16px' }}>{info.icon}</div>
                  <h3 style={{ fontSize: '18px', color: '#f8fafc', fontWeight: '600', marginBottom: '8px' }}>{info.name}</h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>{info.description}</p>
                  
                  {isSelected && (
                    <div style={{
                      position: 'absolute', top: '24px', right: '24px', width: '12px', height: '12px',
                      background: '#10b981', borderRadius: '50%', boxShadow: '0 0 12px #10b981'
                    }} />
                  )}
                </GlassCard>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={startQuiz}
              disabled={selectedDomains.length === 0}
              className="cta-glow"
              style={{
                padding: '18px 48px', fontSize: '18px', fontWeight: '600', color: '#fff',
                background: selectedDomains.length > 0 ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.1)',
                border: 'none', borderRadius: '16px', cursor: selectedDomains.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s', opacity: selectedDomains.length > 0 ? 1 : 0.5,
              }}
            >
              Initialize Assessment Sequence {selectedDomains.length > 0 && `(${selectedDomains.length})`}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (stage === "quiz") {
    if (isTransitioning || !questions.length) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
          <MagneticCursor />
          <NeuralLoadingIndicator message={`Calibrating Round ${round} Matrices...`} />
        </div>
      );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const isUrgent = timeLeft < 30;

    return (
      <div style={{ minHeight: '100vh', padding: '100px 24px', background: 'transparent', fontFamily: "'Inter', sans-serif" }}>
        <MagneticCursor />
        <style>{`
          .option-btn { transition: all 0.2s; }
          .option-btn:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.2) !important; transform: translateX(4px); }
          @keyframes flashRed { 0%, 100% { box-shadow: 0 0 0 rgba(239, 68, 68, 0); } 50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.4); } }
        `}</style>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <GlassCard style={{ padding: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: isUrgent ? 'flashRed 2s infinite' : 'none' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                Round {round} / {maxRounds} • {getDifficultyByRound(round).toUpperCase()}
              </div>
              <div style={{ color: '#f8fafc', fontSize: '18px', fontWeight: '600' }}>
                Question {currentIndex + 1} <span style={{ color: '#475569' }}>/ {questions.length}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Time Remaining</div>
                <div style={{ color: isUrgent ? '#ef4444' : '#f8fafc', fontSize: '24px', fontWeight: '700', fontVariantNumeric: 'tabular-nums' }}>
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </GlassCard>

          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '48px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #ec4899)', transition: 'width 0.4s ease-out', boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)' }} />
          </div>

          <QuizCard 
            question={currentQuestion.q}
            options={currentQuestion.options}
            onAnswer={handleOptionClick}
            isAnswered={isAnswered}
            selectedOption={selectedOption}
            correctAnswer={currentQuestion.answer}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', color: '#64748b', fontSize: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: domainInfo[currentQuestion.domain].color }}>●</span>
              {domainInfo[currentQuestion.domain].name}
            </div>
            <div>Adaptive Engine Active</div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "results") {
    const sortedDomains = Object.entries(scores)
      .filter(([domain]) => selectedDomains.includes(domain))
      .sort((a, b) => b[1] - a[1])
      .map(([domain, score]) => ({ domain, score }));

    const bestDomain = sortedDomains[0]?.domain || selectedDomains[0] || "tech";
    
    const totalScore = sortedDomains.reduce((sum, d) => sum + d.score, 0);
    const maxScore = maxRounds * totalQuestionsPerRound * 3;
    const accuracy = Math.min(100, Math.round((totalScore / maxScore) * 100));

    const careerMapping = {
      tech: "Principal Software Engineer", data: "Lead Data Scientist", ai: "AI Solutions Architect",
      cloud: "Cloud Infrastructure Architect", business: "Director of Product", cyber: "Chief Information Security Officer",
      marketing: "Growth Marketing VP", design: "Staff Product Designer", management: "VP of Engineering",
      finance: "Quantitative Analyst", healthcare: "Health Informatics Director", content: "Creative Director"
    };

    return (
      <div style={{ minHeight: '100vh', padding: '100px 24px', background: 'transparent', fontFamily: "'Inter', sans-serif" }}>
        <MagneticCursor />
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '64px', animation: 'float 6s ease-in-out infinite' }}>
            <div style={{
              display: 'inline-block', padding: '6px 16px', background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '100px', color: '#34d399',
              fontSize: '14px', fontWeight: '500', marginBottom: '24px', letterSpacing: '1px'
            }}>
              ANALYSIS COMPLETE
            </div>
            <h1 style={{ ...headingStyles, fontSize: '56px', color: '#f8fafc', margin: '0 0 16px 0' }}>
              Your Career Intelligence <span style={{ color: '#8b5cf6' }}>Matrix</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#94a3b8', margin: 0 }}>AI-generated insights based on your performance architecture.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <GlassCard style={{ padding: '40px', background: 'linear-gradient(135deg, rgba(15,23,42,0.6) 0%, rgba(30,27,75,0.6) 100%)', border: '1px solid rgba(139, 92, 246, 0.3)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />
              <div style={{ color: '#c4b5fd', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Predicted Optimal Role</div>
              <h2 style={{ fontSize: '36px', color: '#f8fafc', fontWeight: '700', marginBottom: '32px', lineHeight: '1.2' }}>{careerMapping[bestDomain]}</h2>
              
              <div style={{ display: 'flex', gap: '32px' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>Domain Resonance</div>
                  <div style={{ fontSize: '28px', color: '#34d399', fontWeight: '600' }}>{Math.min(99, accuracy + 15)}%</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '4px' }}>Interview Readiness</div>
                  <div style={{ fontSize: '28px', color: '#60a5fa', fontWeight: '600' }}>{accuracy}%</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Total Experience (XP)</div>
                  <div style={{ fontSize: '36px', color: '#f59e0b', fontWeight: '700' }}>{xp}</div>
                </div>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>💠</div>
              </div>
              
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '16px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', borderRadius: '4px' }} />
              </div>
              <div style={{ color: '#cbd5e1', fontSize: '14px' }}>{2000 - xp} XP to Level 12 (Senior Status)</div>
            </GlassCard>
          </div>

          <GlassCard style={{ padding: '40px', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '20px', color: '#f8fafc', fontWeight: '600', marginBottom: '32px' }}>Neural Skill Heatmap</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {sortedDomains.map(({ domain, score }) => {
                const percentage = Math.min(100, (score / (maxRounds * 3 * 3)) * 100);
                const info = domainInfo[domain];
                return (
                  <div key={domain}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                      <span style={{ color: '#cbd5e1', fontWeight: '500' }}>{info.name}</span>
                      <span style={{ color: info.color }}>{score} pts</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: `linear-gradient(90deg, ${info.color}88, ${info.color})`, borderRadius: '4px', boxShadow: `0 0 10px ${info.color}66` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button onClick={resetQuiz} style={{ padding: '16px 32px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: '16px', fontWeight: '500', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s' }} className="hover-glow">
              Recalibrate Engine
            </button>
            <button style={{ padding: '16px 32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontSize: '16px', fontWeight: '600', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)', transition: 'all 0.3s' }} className="cta-glow">
              Generate AI Career Roadmap →
            </button>
          </div>

        </div>
        <Footer />
      </div>
    );
  }
}
"""

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines[:start_idx])
    f.write(new_component)
