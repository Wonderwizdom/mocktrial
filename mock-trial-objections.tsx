import React, { useState, useEffect } from 'react';
import { AlertCircle, Award, Check, ChevronDown, ChevronUp, RotateCcw, Star, X } from 'lucide-react';

const MockTrialObjections = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [gameMode, setGameMode] = useState('learn'); // 'learn' or 'challenge'
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [expandedObjection, setExpandedObjection] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [gameHistory, setGameHistory] = useState([]);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [confetti, setConfetti] = useState(false);

  // List of objections with descriptions, examples, and categories
  const objections = [
    {
      id: 1,
      name: "Leading Question",
      description: "Asked by an attorney who is improperly suggesting the answer within the question.",
      examples: [
        "You saw the defendant run the red light, didn't you?",
        "The light was red when the car drove through, correct?"
      ],
      response: "The question suggests the answer the attorney wants. Ask a non-leading question like: 'What color was the traffic light when the car went through the intersection?'",
      categories: ["questioning", "basic"],
      icon: <ChevronUp className="text-blue-500" />
    },
    {
      id: 2,
      name: "Relevance",
      description: "The evidence or testimony has no connection to the facts at issue in the case.",
      examples: [
        "What color shirt was the witness wearing three days before the incident?",
        "Did the defendant ever visit Chicago in the summer of 2017?"
      ],
      response: "The attorney must show how this evidence relates to the facts of the case. Otherwise, it wastes time and may confuse the issues.",
      categories: ["evidence", "basic"],
      icon: <X className="text-red-500" />
    },
    {
      id: 3,
      name: "Hearsay",
      description: "Witness testimony reporting an out-of-court statement offered to prove the truth of the matter asserted.",
      examples: [
        "My friend told me that he saw the defendant at the store that day.",
        "The victim's mother said that he was afraid of the defendant."
      ],
      response: "This is an out-of-court statement offered for its truth. Unless it falls under an exception, it's inadmissible hearsay.",
      categories: ["evidence", "advanced"],
      icon: <AlertCircle className="text-yellow-500" />
    },
    {
      id: 4,
      name: "Compound Question",
      description: "A question that contains multiple questions but calls for a single answer.",
      examples: [
        "Did you see the car and did you notice its color?",
        "Was the restaurant busy and were you seated immediately?"
      ],
      response: "The question contains multiple parts that require separate answers. The attorney should break it into separate questions.",
      categories: ["questioning", "basic"],
      icon: <ChevronDown className="text-purple-500" />
    },
    {
      id: 5,
      name: "Speculation",
      description: "The witness is asked to guess, speculate, or make assumptions without personal knowledge.",
      examples: [
        "If the light had been red, would the accident have happened?",
        "What do you think the defendant was thinking at that moment?"
      ],
      response: "The witness is being asked to speculate beyond their personal knowledge. Witnesses should testify only to facts they observed.",
      categories: ["questioning", "intermediate"],
      icon: <Star className="text-orange-500" />
    },
    {
      id: 6,
      name: "Assumes Facts Not in Evidence",
      description: "The question contains an assumption of facts that haven't been established.",
      examples: [
        "When did you stop hitting your roommate?",
        "What did you do with the knife after the argument?"
      ],
      response: "The question assumes facts (that the witness hit their roommate or had a knife) that haven't been established in evidence.",
      categories: ["questioning", "intermediate"],
      icon: <AlertCircle className="text-red-500" />
    },
    {
      id: 7,
      name: "Lack of Foundation",
      description: "Testimony or evidence is presented without establishing the necessary background or qualifications.",
      examples: [
        "Attorney asking for expert opinion from a witness without establishing expertise",
        "Showing a document to a witness without establishing its authenticity or relevance"
      ],
      response: "The attorney needs to lay proper foundation first by establishing the witness's knowledge, the document's authenticity, or other prerequisites.",
      categories: ["evidence", "intermediate"],
      icon: <X className="text-purple-500" />
    },
    {
      id: 8,
      name: "Argumentative",
      description: "The attorney is arguing with the witness rather than asking legitimate questions.",
      examples: [
        "You're lying about what you saw, aren't you?",
        "No reasonable person would believe your story, would they?"
      ],
      response: "The question is argumentative - the attorney is arguing with the witness rather than eliciting facts.",
      categories: ["questioning", "basic"],
      icon: <ChevronUp className="text-red-500" />
    },
    {
      id: 9,
      name: "Non-Responsive",
      description: "The witness's answer goes beyond the scope of the question or fails to answer it.",
      examples: [
        "Q: Where were you on May 1st? A: I'm always careful about remembering important dates, and I have a system for tracking my calendar...",
        "Q: Did you see the defendant? A: Let me tell you about what happened earlier that day..."
      ],
      response: "The witness's answer is not responsive to the specific question asked. Direct the witness to answer only what was asked.",
      categories: ["testimony", "basic"],
      icon: <Check className="text-yellow-500" />
    },
    {
      id: 10,
      name: "Beyond the Scope",
      description: "Questions during cross-examination that go beyond the topics covered in direct examination.",
      examples: [
        "Direct exam was about witness location; cross asks about personal relationship with defendant",
        "Direct covered only the accident; cross asks about events the following day"
      ],
      response: "The question goes beyond the scope of what was covered in direct examination. Cross-examination should be limited to subjects covered in direct plus credibility.",
      categories: ["procedure", "intermediate"],
      icon: <AlertCircle className="text-green-500" />
    },
    {
      id: 11,
      name: "Asked and Answered",
      description: "The question has already been asked and answered by this witness.",
      examples: [
        "Repeatedly asking the same question about the witness's location",
        "Asking for the same timeline information multiple times"
      ],
      response: "This question has already been asked and answered. Repetitive questioning wastes time and may harass the witness.",
      categories: ["questioning", "basic"],
      icon: <RotateCcw className="text-blue-500" />
    },
    {
      id: 12,
      name: "Lack of Personal Knowledge",
      description: "The witness is testifying about matters they didn't personally observe or experience.",
      examples: [
        "Witness testifying about events that occurred when they weren't present",
        "Witness describing details they couldn't have seen from their vantage point"
      ],
      response: "The witness lacks personal knowledge of these matters. Witnesses must testify based on personal observation, not what they heard from others.",
      categories: ["testimony", "intermediate"],
      icon: <X className="text-orange-500" />
    }
  ];

  // Scenarios for the challenge mode
  const scenarios = [
    {
      id: 1,
      scenario: "Prosecutor: Mr. Witness, the defendant was angry when he left the party, wasn't he?",
      correctObjection: "Leading Question",
      explanation: "This is a leading question because it suggests the answer that the prosecutor wants - that the defendant was angry. A proper question would be 'What was the defendant's demeanor when he left the party?'"
    },
    {
      id: 2,
      scenario: "Defense Attorney: Ms. Witness, what was your third-grade teacher's name?",
      correctObjection: "Relevance",
      explanation: "This question asks for information that has no connection to the facts at issue in the case. The witness's third-grade teacher's name is not relevant to any material fact in the current case."
    },
    {
      id: 3,
      scenario: "Prosecutor: The victim's brother told you that the defendant threatened him, right?",
      correctObjection: "Hearsay",
      explanation: "This is hearsay because the question asks the witness to testify about what the victim's brother said (an out-of-court statement) to prove that the defendant made a threat (the truth of the matter asserted)."
    },
    {
      id: 4,
      scenario: "Defense Attorney: Did you see the car and was it speeding and did it have its lights on?",
      correctObjection: "Compound Question",
      explanation: "This is a compound question because it asks multiple questions at once: (1) Did you see the car? (2) Was it speeding? (3) Did it have its lights on? These should be asked separately."
    },
    {
      id: 5,
      scenario: "Prosecutor: What do you think the defendant would have done if the security guard wasn't there?",
      correctObjection: "Speculation",
      explanation: "This question asks the witness to speculate about what might have happened in a hypothetical scenario. Witnesses should testify only to facts they directly observed."
    },
    {
      id: 6,
      scenario: "Defense Attorney: How long have you been hiding evidence from the police?",
      correctObjection: "Assumes Facts Not in Evidence",
      explanation: "This question improperly assumes that the witness has been hiding evidence, a fact that has not been established in court."
    },
    {
      id: 7,
      scenario: "Prosecutor shows witness a document and asks: Can you interpret this DNA analysis for the jury?",
      correctObjection: "Lack of Foundation",
      explanation: "The prosecutor has not established that the witness has the expertise or qualifications to interpret DNA analysis. A proper foundation must be laid first."
    },
    {
      id: 8,
      scenario: "Defense Attorney: You're clearly lying about what you saw that night, aren't you?",
      correctObjection: "Argumentative",
      explanation: "This question is argumentative because the attorney is arguing with the witness rather than asking for factual information. It accuses the witness of lying rather than eliciting testimony."
    },
    {
      id: 9,
      scenario: "Prosecutor: Where were you at 9 PM?\nWitness: Well, I usually go to bed early because I need to wake up for work at 5 AM, and I've always been an early riser. My parents taught me the value of a consistent sleep schedule...",
      correctObjection: "Non-Responsive",
      explanation: "The witness's answer goes well beyond the scope of the question, which simply asked for their location at 9 PM. The witness is not directly answering the question asked."
    },
    {
      id: 10,
      scenario: "Direct examination covered only the witness's observations at the crime scene. On cross, the attorney asks: Have you ever been convicted of a crime?",
      correctObjection: "Beyond the Scope",
      explanation: "This question goes beyond the scope of direct examination, which only covered the witness's observations at the crime scene. However, note that questions about credibility (including criminal history) are often allowed even if beyond the scope."
    },
    {
      id: 11,
      scenario: "Attorney asks for the fifth time: And you're absolutely certain about what time you arrived?",
      correctObjection: "Asked and Answered",
      explanation: "This question has already been asked and answered multiple times. Repetitive questioning wastes time and can be used to badger the witness."
    },
    {
      id: 12,
      scenario: "Prosecutor: What was the defendant thinking when he entered the store?",
      correctObjection: "Lack of Personal Knowledge",
      explanation: "The witness cannot have personal knowledge of what another person was thinking. This calls for speculation about the internal thoughts of the defendant."
    }
  ];

  // Filter objections based on selected category
  const filteredObjections = selectedCategory === 'all' ? 
    objections : 
    objections.filter(obj => obj.categories.includes(selectedCategory));

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Objections' },
    { id: 'basic', name: 'Basic' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
    { id: 'questioning', name: 'Questioning' },
    { id: 'evidence', name: 'Evidence' },
    { id: 'testimony', name: 'Testimony' },
    { id: 'procedure', name: 'Procedure' }
  ];

  // Function to handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Function to toggle objection details
  const toggleObjection = (id) => {
    setExpandedObjection(expandedObjection === id ? null : id);
  };

  // Reset the challenge
  const resetChallenge = () => {
    setCurrentScenarioIndex(0);
    setScore(0);
    setTotalAttempts(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
    setChallengeComplete(false);
    setGameHistory([]);
  };

  // Handle answer selection in challenge mode
  const handleAnswerSelect = (objectionName) => {
    setSelectedAnswer(objectionName);
    setTotalAttempts(totalAttempts + 1);
    
    const isCorrect = objectionName === scenarios[currentScenarioIndex].correctObjection;
    if (isCorrect) {
      setScore(score + 1);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 2000);
    }
    
    setGameHistory([...gameHistory, {
      scenario: scenarios[currentScenarioIndex].scenario,
      selectedAnswer: objectionName,
      correctAnswer: scenarios[currentScenarioIndex].correctObjection,
      isCorrect
    }]);
    
    setShowAnswer(true);
  };

  // Go to next scenario
  const nextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    } else {
      setChallengeComplete(true);
    }
  };

  // Track progress for learn mode
  useEffect(() => {
    const newProgress = {...userProgress};
    if (expandedObjection) {
      newProgress[expandedObjection] = true;
      setUserProgress(newProgress);
    }
  }, [expandedObjection]);

  // Calculate mastery percentage
  const getMasteryPercentage = () => {
    const learnedCount = Object.keys(userProgress).length;
    return Math.round((learnedCount / objections.length) * 100);
  };

  // Simple confetti effect
  const Confetti = () => {
    return (
      <div className={`fixed inset-0 pointer-events-none z-50 ${confetti ? 'block' : 'hidden'}`}>
        {Array.from({ length: 50 }).map((_, i) => {
          const size = Math.random() * 10 + 5;
          const left = Math.random() * 100;
          const animationDuration = Math.random() * 3 + 2;
          const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          return (
            <div 
              key={i}
              className={`absolute ${color} rounded-full`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: '-10px',
                animation: `fall ${animationDuration}s linear forwards`
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
      
      <Confetti />
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-800">Objection Master</h1>
          <p className="text-gray-600 mt-2">Learn and master mock trial objections in a fun way!</p>
        </header>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <button 
            onClick={() => setGameMode('learn')}
            className={`px-6 py-3 rounded-lg flex-1 transition-all ${
              gameMode === 'learn' 
                ? 'bg-indigo-600 text-white font-bold' 
                : 'bg-white text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            Learn Mode
          </button>
          <button 
            onClick={() => {
              setGameMode('challenge');
              resetChallenge();
            }}
            className={`px-6 py-3 rounded-lg flex-1 transition-all ${
              gameMode === 'challenge' 
                ? 'bg-indigo-600 text-white font-bold' 
                : 'bg-white text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            Challenge Mode
          </button>
        </div>
        
        {gameMode === 'learn' && (
          <>
            <div className="bg-white rounded-xl p-4 shadow-md mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Your Progress</h2>
                <div className="flex items-center">
                  <div className="h-2.5 w-32 bg-gray-200 rounded-full mr-2">
                    <div 
                      className="h-2.5 bg-green-500 rounded-full" 
                      style={{ width: `${getMasteryPercentage()}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{getMasteryPercentage()}%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-md mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Filter By Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedCategory === category.id
                        ? 'bg-indigo-100 text-indigo-800 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredObjections.map(objection => (
                <div 
                  key={objection.id}
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 card-hover ${
                    userProgress[objection.id] ? 'border-l-4 border-green-500' : ''
                  }`}
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleObjection(objection.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {objection.icon}
                        </div>
                        <h3 className="font-bold text-gray-800">{objection.name}</h3>
                      </div>
                      {userProgress[objection.id] && (
                        <span className="text-green-500">
                          <Check size={16} />
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{objection.description}</p>
                    
                    <div className={`mt-3 ${expandedObjection === objection.id ? 'block' : 'hidden'}`}>
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 text-sm">Examples:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                          {objection.examples.map((example, idx) => (
                            <li key={idx} className="ml-2 mt-1">{example}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                        <h4 className="font-semibold text-gray-700 text-sm">How to Respond:</h4>
                        <p className="text-sm text-gray-600 mt-1">{objection.response}</p>
                      </div>
                      
                      <div className="mt-4 text-xs text-gray-500">
                        Categories: {objection.categories.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {gameMode === 'challenge' && !challengeComplete && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-500">Scenario {currentScenarioIndex + 1} of {scenarios.length}</span>
                <div className="h-1.5 w-full bg-gray-200 rounded-full mt-1">
                  <div 
                    className="h-1.5 bg-indigo-600 rounded-full" 
                    style={{ width: `${((currentScenarioIndex) / scenarios.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  Score: {score}/{totalAttempts || 1}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">Scenario:</h3>
              <p className="text-gray-800 whitespace-pre-line">{scenarios[currentScenarioIndex].scenario}</p>
            </div>
            
            <h3 className="font-semibold text-gray-700 mb-2">What's the appropriate objection?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {objections.map(objection => (
                <button
                  key={objection.id}
                  onClick={() => !showAnswer && handleAnswerSelect(objection.name)}
                  disabled={showAnswer}
                  className={`p-3 text-left rounded-lg transition-all flex items-center ${
                    showAnswer
                      ? objection.name === scenarios[currentScenarioIndex].correctObjection
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : objection.name === selectedAnswer
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-gray-100 text-gray-400'
                      : 'bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700'
                  }`}
                >
                  <div className="mr-2">
                    {objection.icon}
                  </div>
                  <span>{objection.name}</span>
                </button>
              ))}
            </div>
            
            {showAnswer && (
              <div className={`p-4 rounded-lg mb-6 ${
                selectedAnswer === scenarios[currentScenarioIndex].correctObjection
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-red-100 border border-red-300'
              }`}>
                <h3 className="font-semibold mb-2">{
                  selectedAnswer === scenarios[currentScenarioIndex].correctObjection
                    ? '✓ Correct!'
                    : `✗ Incorrect. The correct objection is "${scenarios[currentScenarioIndex].correctObjection}"`
                }</h3>
                <p>{scenarios[currentScenarioIndex].explanation}</p>
              </div>
            )}
            
            <div className="flex justify-end">
              {showAnswer && (
                <button
                  onClick={nextScenario}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Next Scenario
                </button>
              )}
            </div>
          </div>
        )}
        
        {gameMode === 'challenge' && challengeComplete && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-gray-800">Challenge Complete!</h2>
              <p className="text-gray-600">Your final score: {score} out of {scenarios.length}</p>
              <div className="mt-2">
                {score === scenarios.length ? (
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Perfect Score! 🎉
                  </span>
                ) : score >= scenarios.length * 0.7 ? (
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Great Job! 👍
                  </span>
                ) : (
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Keep Practicing! 💪
                  </span>
                )}
              </div>
            </div>
            
            <h3 className="font-semibold text-gray-700 mb-3">Your Results:</h3>
            <div className="space-y-3 mb-6">
              {gameHistory.map((item, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    item.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`mr-2 ${
                      item.isCorrect ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {item.isCorrect ? <Check size={16} /> : <X size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Scenario {index + 1}: {item.scenario.substring(0, 60)}...</p>
                      <p className="text-xs mt-1">
                        <span className="font-medium">Your answer:</span> {item.selectedAnswer} 
                        {!item.isCorrect && (
                          <span> | <span className="font-medium">Correct answer:</span> {item.correctAnswer}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={resetChallenge}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTrialObjections;
