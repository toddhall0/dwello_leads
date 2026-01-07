import { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ProgressBar from './components/ProgressBar';
import QuizQuestion from './components/QuizQuestion';
import LeadCapture from './components/LeadCapture';
import ResultsScreen from './components/ResultsScreen';
import AdminDashboard from './pages/AdminDashboard';
import { quizQuestions } from './data/quizQuestions';
import { calculateScores, matchNeighborhood, generateLeadData } from './utils/scoring';
import { saveLead } from './utils/storage';
import './index.css';

// Quiz phases
const PHASES = {
  WELCOME: 'welcome',
  QUIZ: 'quiz',
  LEAD_CAPTURE: 'lead_capture',
  RESULTS: 'results',
  ADMIN: 'admin'
};

function App() {
  const [phase, setPhase] = useState(PHASES.WELCOME);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [scores, setScores] = useState(null);
  const [neighborhoodResult, setNeighborhoodResult] = useState(null);
  const [fadeIn, setFadeIn] = useState(true);

  // Check for admin access via URL
  useEffect(() => {
    if (window.location.hash === '#admin') {
      setPhase(PHASES.ADMIN);
    }
  }, []);

  // Handle starting the quiz
  const handleStart = () => {
    setFadeIn(false);
    setTimeout(() => {
      setPhase(PHASES.QUIZ);
      setCurrentQuestion(0);
      setAnswers([]);
      setFadeIn(true);
    }, 300);
  };

  // Handle answering a question
  const handleAnswer = (answer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // All questions answered - calculate scores and show lead capture
      const calculatedScores = calculateScores(newAnswers);
      const neighborhood = matchNeighborhood(calculatedScores);

      setScores({
        ...calculatedScores,
        budgetRange: calculatedScores.budgetRange.label
      });
      setNeighborhoodResult(neighborhood.id);

      setFadeIn(false);
      setTimeout(() => {
        setPhase(PHASES.LEAD_CAPTURE);
        setFadeIn(true);
      }, 300);
    }
  };

  // Handle lead form submission
  const handleLeadSubmit = async (contactInfo) => {
    // Generate and save lead data
    const leadData = generateLeadData(answers, contactInfo);

    try {
      await saveLead(leadData);
    } catch (error) {
      console.error('Error saving lead:', error);
      // Continue to show results even if save fails
    }

    // Show results
    setFadeIn(false);
    setTimeout(() => {
      setPhase(PHASES.RESULTS);
      setFadeIn(true);
    }, 300);
  };

  // Handle restarting the quiz
  const handleRestart = () => {
    setFadeIn(false);
    setTimeout(() => {
      setPhase(PHASES.WELCOME);
      setCurrentQuestion(0);
      setAnswers([]);
      setScores(null);
      setNeighborhoodResult(null);
      setFadeIn(true);
    }, 300);
  };

  // Handle going back from admin
  const handleBackFromAdmin = () => {
    window.location.hash = '';
    setPhase(PHASES.WELCOME);
  };

  // Render admin dashboard
  if (phase === PHASES.ADMIN) {
    return <AdminDashboard onBack={handleBackFromAdmin} />;
  }

  return (
    <div className={`min-h-screen transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      {/* Admin access hint (hidden) */}
      <button
        onClick={() => setPhase(PHASES.ADMIN)}
        className="fixed bottom-4 right-4 p-2 text-navy/20 hover:text-navy/60 transition-colors"
        title="Admin Dashboard"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Welcome Screen */}
      {phase === PHASES.WELCOME && (
        <WelcomeScreen onStart={handleStart} />
      )}

      {/* Quiz Questions */}
      {phase === PHASES.QUIZ && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <ProgressBar
              current={currentQuestion + 1}
              total={quizQuestions.length}
            />
            <QuizQuestion
              question={quizQuestions[currentQuestion]}
              questionNumber={currentQuestion + 1}
              onAnswer={handleAnswer}
            />
          </div>
        </div>
      )}

      {/* Lead Capture */}
      {phase === PHASES.LEAD_CAPTURE && (
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
          <LeadCapture
            onSubmit={handleLeadSubmit}
          />
        </div>
      )}

      {/* Results Screen */}
      {phase === PHASES.RESULTS && (
        <div className="min-h-screen py-8">
          <ResultsScreen
            result={neighborhoodResult}
            scores={scores}
            onRestart={handleRestart}
          />
        </div>
      )}
    </div>
  );
}

export default App;
